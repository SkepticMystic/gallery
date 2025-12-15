import { ERROR } from "$lib/const/error.const";
import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { get_session } from "$lib/services/auth.service";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [{ session }, piece] = await Promise.all([
    get_session(),

    Repo.query(
      db.query.piece.findFirst({
        where: (piece, { eq }) => eq(piece.slug, params.slug),

        with: {
          images: {
            columns: {
              id: true,
              url: true,
              thumbhash: true,

              size: true,
              width: true,
              height: true,
            },
          },
        },
      }),
    ),
  ]);

  if (!piece.ok || !piece.data || piece.data.org_id !== session.org_id) {
    error(404, ERROR.NOT_FOUND);
  }

  return {
    piece: piece.data,
  };
}) satisfies PageServerLoad;
