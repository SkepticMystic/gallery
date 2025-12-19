import { ERROR } from "$lib/const/error.const";
import { SLUG } from "$lib/const/slug.const";
import { ArtistTable } from "$lib/server/db/models/artist.model";
import { ArtistRepo } from "$lib/server/db/repos/artist.repo";
import { ArtistUtil } from "$lib/utils/artist/artist.util";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { Strings } from "$lib/utils/strings.util";
import { captureException } from "@sentry/sveltekit";

const insert_one = async (
  input: Omit<typeof ArtistTable.$inferInsert, "slug" | "normalized_name">,
): Promise<App.Result<null>> => {
  try {
    const slug =
      Strings.slugify(input.name) + "-" + crypto.randomUUID().slice(0, 6);

    if (SLUG.RESTRICTED.includes(slug)) {
      return result.err({
        ...ERROR.INVALID_INPUT,
        path: ["name"],
        message: "Invalid name",
      });
    }

    const normalized_name = ArtistUtil.normalise_name(input.name);
    if (!normalized_name) {
      return result.err({
        ...ERROR.INVALID_INPUT,
        path: ["name"],
        message: "Invalid name",
      });
    }

    const res = await ArtistRepo.insert_one({
      ...input,
      slug,
      normalized_name,
    });

    if (!res.ok && res.error.code === "DUPLICATE") {
      return result.suc(null);
    } else {
      return res.ok ? result.suc(null) : res;
    }
  } catch (error) {
    Log.error(error, "ArtistService.create.error unknown");

    captureException(error);

    return result.err(ERROR.INTERNAL_SERVER_ERROR);
  }
};

// const update_one = async (
//   find: { id: string; org_id: string },
//   update: Partial<typeof ArtistTable.$inferInsert>,
// ): Promise<App.Result<Artist>> => {
//   try {
//     const res = await ArtistRepo.update_one(find, update);

//     return res;
//   } catch (error) {
//     Log.error(error, "ArtistService.update_one.error unknown");

//     captureException(error);

//     return result.err(ERROR.INTERNAL_SERVER_ERROR);
//   }
// };

export const ArtistService = {
  insert_one,
  // update_one,
};
