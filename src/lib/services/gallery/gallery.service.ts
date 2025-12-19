import { ERROR } from "$lib/const/error.const";
import { SLUG } from "$lib/const/slug.const";
import {
  GalleryTable,
  type Gallery,
} from "$lib/server/db/models/gallery.model";
import { GalleryRepo } from "$lib/server/db/repos/gallery.repo";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { Strings } from "$lib/utils/strings.util";
import { captureException } from "@sentry/sveltekit";

const insert_one = async (
  input: Omit<typeof GalleryTable.$inferInsert, "slug">,
): Promise<App.Result<Gallery>> => {
  try {
    const slug = Strings.slugify(input.name);
    if (SLUG.RESTRICTED.includes(slug)) {
      return result.err({
        ...ERROR.INVALID_INPUT,
        path: ["name"],
        message: "Invalid name",
      });
    }

    const res = await GalleryRepo.insert_one({
      ...input,
      slug,
    });

    return res;
  } catch (error) {
    Log.error(error, "GalleryService.create.error unknown");

    captureException(error);

    return result.err(ERROR.INTERNAL_SERVER_ERROR);
  }
};

const update_one = async (
  find: { id: string; org_id: string },
  update: Partial<typeof GalleryTable.$inferInsert>,
): Promise<App.Result<Gallery>> => {
  try {
    const res = await GalleryRepo.update_one(find, update);

    return res;
  } catch (error) {
    Log.error(error, "GalleryService.update_one.error unknown");

    captureException(error);

    return result.err(ERROR.INTERNAL_SERVER_ERROR);
  }
};

export const GalleryService = {
  insert_one,
  update_one,
};
