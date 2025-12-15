import { command } from "$app/server";
import z from "zod";
import { ImageSchema } from "../../server/db/models/image.model";
import { get_session } from "../../services/auth.service";
import { ImageService } from "../../services/image/image.service";

export const upload_image_remote = command(
  ImageSchema.insert.extend({ file: z.instanceof(File) }),
  async (input) => {
    const { session } = await get_session();

    return await ImageService.upload(input.file, {
      ...input,
      org_id: session.org_id,
    });
  },
);

export const delete_image_remote = command(
  z.uuid(),
  async (image_id: string) => {
    const { session } = await get_session();

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
