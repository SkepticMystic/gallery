import { command, form } from "$app/server";
import { ERROR } from "$lib/const/error.const";
import { IMAGE_HOSTING } from "$lib/const/image/image_hosting.const";
import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { result } from "$lib/utils/result.util";
import z from "zod";
import { ImageSchema } from "../../server/db/models/image.model";
import { get_seller_session, get_session } from "../../services/auth.service";
import { ImageService } from "../../services/image/image.service";

export const upload_images_remote = form(
  ImageSchema.insert.extend({
    files: z
      .array(z.instanceof(File))
      .min(1, "No files to upload")
      .max(IMAGE_HOSTING.LIMITS.MAX_COUNT.PER_RESOURCE),
  }),
  async (input) => {
    console.log("upload_images_remote", input);
    const { session } = await get_seller_session();

    return await Promise.all(
      input.files.map((file) =>
        ImageService.upload(file, {
          org_id: session.org_id,
          resource_id: input.resource_id,
          resource_kind: input.resource_kind,
        }),
      ),
    );
  },
);

export const delete_image_remote = command(
  z.uuid(),
  async (image_id: string) => {
    const { session } = await get_seller_session();

    return await ImageService.delete_many({
      id: image_id,
      org_id: session.org_id,
    });
  },
);

export const admin_set_image_approved_remote = command(
  z.object({
    id: z.uuid(),
    admin_approved: z.boolean(),
  }),
  async (input) => {
    await get_session({ admin: true });

    return await ImageService.set_admin_approved(input);
  },
);

export const admin_delete_image_remote = command(
  z.uuid(),
  async (image_id: string) => {
    await get_session({ admin: true });

    const res = await Repo.query(
      db.query.image.findFirst({
        where: (image, { eq }) => eq(image.id, image_id),
        columns: { id: true, org_id: true },
      }),
    );

    if (!res.ok || !res.data) {
      return result.err(ERROR.NOT_FOUND);
    }

    return await ImageService.delete_many({
      id: image_id,
      org_id: res.data.org_id,
    });
  },
);
