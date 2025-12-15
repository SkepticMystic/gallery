import { captureException } from "@sentry/sveltekit";
import { ERROR } from "../../const/error.const";
import { IMAGE_HOSTING } from "../../const/image/image_hosting.const";
import type { Image } from "../../server/db/models/image.model";
import { ImageRepo } from "../../server/db/repos/image.repo";
import { Format } from "../../utils/format.util";
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

const set_admin_approved = async (input: {
  id: string;
  admin_approved: boolean;
}) => {
  try {
    const res = await ImageRepo.set_admin_approved(input);

    return res;
  } catch (error) {
    Log.error(error, "BusinessService.set_admin_approved.error unknown");

    captureException(error);

    return result.err(ERROR.INTERNAL_SERVER_ERROR);
  }
};

export const ImageService = {
  upload: async (
    file: File,
    input: Pick<Image, "resource_id" | "resource_kind" | "org_id">,
  ): Promise<App.Result<Image>> => {
    if (file.size > IMAGE_HOSTING.LIMITS.MAX_FILE_SIZE_BYTES) {
      return result.err({
        status: 413,
        message: `Image exceeds size limit of ${Format.number(
          IMAGE_HOSTING.LIMITS.MAX_FILE_SIZE_BYTES / (1024 * 1024),
          {
            style: "unit",
            unit: "megabyte",
            unitDisplay: "long",
            maximumFractionDigits: 1,
          },
        )}`,
      });
    }

    const [count_limit, resource] = await Promise.all([
      check_count_limit(input),
      ResourceService.get_by_kind_and_id(input),
    ]);

    if (!resource.ok || resource.data.org_id !== input.org_id) {
      return result.err({ message: "Resource not found" });
    } else if (!count_limit.ok) {
      return count_limit;
    }

    const [upload, thumbhash] = await Promise.all([
      ImageHostingService.upload(file),
      // NOTE: Calling this second in line seems to help with the timeout issue
      ThumbhashService.generate(file),
    ]);
    if (!upload.ok) return upload;

    const res = await ImageRepo.create({
      ...input,
      url: upload.data.image.url,
      response: upload.data.response,
      provider: ImageHostingService.provider,
      external_id: upload.data.image.external_id,
      thumbhash: thumbhash.ok ? thumbhash.data : null,
    });

    return res;
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

  set_admin_approved,
};
