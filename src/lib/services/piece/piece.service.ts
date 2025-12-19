import { ERROR } from "$lib/const/error.const";
import { SLUG } from "$lib/const/slug.const";
import { PieceTable, type Piece } from "$lib/server/db/models/piece.model";
import { PieceRepo } from "$lib/server/db/repos/piece.repo";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { Strings } from "$lib/utils/strings.util";
import { captureException } from "@sentry/sveltekit";
import { ArtistService } from "../artist/artist.service";

const insert_one = async (
  input: Omit<typeof PieceTable.$inferInsert, "slug">,
): Promise<App.Result<Piece>> => {
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

    const [res] = await Promise.all([
      PieceRepo.insert_one({
        ...input,
        slug,
      }),

      input.artist_name
        ? ArtistService.insert_one({
            name: input.artist_name,
            created_by_org_id: input.org_id,
          })
        : undefined,
    ]);

    return res;
  } catch (error) {
    Log.error(error, "PieceService.create.error unknown");

    captureException(error);

    return result.err(ERROR.INTERNAL_SERVER_ERROR);
  }
};

const update_one = async (
  find: { id: string; org_id: string },
  update: Partial<typeof PieceTable.$inferInsert>,
): Promise<App.Result<Piece>> => {
  try {
    const [res] = await Promise.all([
      PieceRepo.update_one(find, update),

      update.artist_name
        ? ArtistService.insert_one({
            name: update.artist_name,
            created_by_org_id: find.org_id,
          })
        : undefined,
    ]);

    return res;
  } catch (error) {
    Log.error(error, "PieceService.update_one.error unknown");

    captureException(error);

    return result.err(ERROR.INTERNAL_SERVER_ERROR);
  }
};

export const PieceService = {
  insert_one,
  update_one,
};
