import { ERROR } from "$lib/const/error.const";
import { SLUG } from "$lib/const/slug.const";
import { PieceTable, type Piece } from "$lib/server/db/models/piece.model";
import { PieceRepo } from "$lib/server/db/repos/piece.repo";
import { Log } from "$lib/utils/logger.util";
import { result } from "$lib/utils/result.util";
import { Strings } from "$lib/utils/strings.util";
import { captureException } from "@sentry/sveltekit";

const insert_one = async (
  input: Omit<typeof PieceTable.$inferInsert, "slug">,
): Promise<App.Result<Piece>> => {
  try {
    const slug =
      Strings.slugify(input.name) + "-" + crypto.randomUUID().slice(0, 6);

    if (SLUG.RESTRICTED.includes(slug)) {
      return result.err({ ...ERROR.INVALID_SLUG, path: ["name"] });
    }

    const res = await PieceRepo.insert_one({
      ...input,
      slug,
    });

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
    const res = await PieceRepo.update_one(find, update);

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
