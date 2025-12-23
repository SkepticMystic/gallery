import { getRequestEvent } from "$app/server";
import { format_bytes } from "$lib/components/ui/file-drop-zone";
import { captureException } from "@sentry/sveltekit";
import { ERROR } from "../../const/error.const";
import { IMAGE_HOSTING } from "../../const/image/image_hosting.const";
import { db } from "../../server/db/drizzle.db";
import type { Image } from "../../server/db/models/image.model";
import { ImageRepo } from "../../server/db/repos/image.repo";
import { Repo } from "../../server/db/repos/index.repo";
import { Log } from "../../utils/logger.util";
import { result } from "../../utils/result.util";
import { ResourceService } from "../resource/resource.service";
import { ImageHostingService } from "./image_hosting.service";
import { ThumbhashService } from "./thumbhash.image.service";

const check_count_limit = async (
  input: Pick<Image, "resource_id" | "resource_kind" | "org_id">,
) => {
  try {
    const count = await ImageRepo.count(input);

    if (!count.ok) {
      return count;
    } else if (count.data >= IMAGE_HOSTING.LIMITS.MAX_COUNT.PER_RESOURCE) {
      return result.err({
        status: 429,
        message: `Image limit reached for this ${input.resource_kind} (${IMAGE_HOSTING.LIMITS.MAX_COUNT.PER_RESOURCE}). Please delete existing images before uploading more`,
      });
    }

    return count;
  } catch (error) {
    Log.error(error, "ImageService.check_count_limit.error unknown");

    captureException(error);

    return result.err(ERROR.INTERNAL_SERVER_ERROR);
  }
};

const toggle_approved = async (image_id: string) => {
  try {
    // Get current state using a query
    const res = await Repo.query(
      db.query.image.findFirst({
        where: (image, { eq }) => eq(image.id, image_id),
        columns: { is_approved: true },
      }),
    );

    if (!res.ok || !res.data) {
      return result.err(ERROR.NOT_FOUND);
    }

    // Toggle the approval state
    return await ImageRepo.set_approved({
      id: image_id,
      is_approved: !res.data.is_approved,
    });
  } catch (error) {
    Log.error(error, "ImageService.toggle_approved.error unknown");

    captureException(error);

    return result.err(ERROR.INTERNAL_SERVER_ERROR);
  }
};

export const ImageService = {
  upload: async (
    file: File,
    input: Pick<Image, "resource_id" | "resource_kind" | "org_id">,
  ): Promise<App.Result<Image>> => {
    try {
      if (file.size > IMAGE_HOSTING.LIMITS.MAX_FILE_SIZE_BYTES) {
        return result.err({
          status: 413,
          message: `Image exceeds size limit of ${format_bytes(
            IMAGE_HOSTING.LIMITS.MAX_FILE_SIZE_BYTES,
          )}`,
        });
      }

      const [count_limit, resource] = await Promise.all([
        check_count_limit(input),
        ResourceService.get_by_key(input),
      ]);

      if (!count_limit.ok) {
        return count_limit;
      } else if (!resource.ok) {
        return result.err(ERROR.NOT_FOUND);
      } else if (!resource.data.org_id) {
        const event = getRequestEvent();

        if (!event.locals.session) {
          return result.err(ERROR.UNAUTHORIZED);
        } else if (event.locals.session.user.role !== "admin") {
          return result.err(ERROR.FORBIDDEN);
        }
      } else if (resource.data.org_id !== input.org_id) {
        return result.err(ERROR.FORBIDDEN);
      }

      const [upload, thumbhash] = await Promise.all([
        ImageHostingService.upload(file),
        // NOTE: Calling this second in line seems to help with the timeout issue
        ThumbhashService.generate(file),
      ]);
      if (!upload.ok) return upload;

      const res = await ImageRepo.create({
        ...input,
        ...upload.data,
        provider: ImageHostingService.provider,
        thumbhash: thumbhash.ok ? thumbhash.data : null,
      });

      return res;
    } catch (error) {
      Log.error(error, "ImageService.upload.error");

      captureException(error);

      return result.err(ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  delete_many: async (
    input: Partial<Pick<Image, "id" | "resource_id" | "resource_kind">> & {
      org_id: string;
    },
  ): Promise<App.Result<null>> => {
    try {
      const images = await ImageRepo.delete_many(input);

      if (!images.ok) {
        return images;
      } else if (images.data.length === 0) {
        return result.err(ERROR.NOT_FOUND);
      }

      await Promise.all(
        images.data.map((image) =>
          ImageHostingService.delete(image.external_id),
        ),
      );

      return result.suc(null);
    } catch (error) {
      Log.error(error, "ImageService.delete.error");

      captureException(error);

      return result.err(ERROR.INTERNAL_SERVER_ERROR);
    }
  },

  toggle_approved,
};
