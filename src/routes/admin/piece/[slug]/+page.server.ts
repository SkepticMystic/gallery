import { ERROR } from "$lib/const/error.const";
import { IMAGE_HOSTING } from "$lib/const/image/image_hosting.const";
import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { get_session } from "$lib/services/auth.service";
import { Markdown } from "$lib/utils/markdown/markdown.util";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [_admin, piece] = await Promise.all([
    get_session({ admin: true }),

    Repo.query(
      db.query.piece.findFirst({
        where: (piece, { eq }) => eq(piece.slug, params.slug),

        with: {
          gallery: {
            columns: {
              id: true,
              name: true,
              slug: true,
              is_approved: true,
            },
          },

          images: {
            limit: IMAGE_HOSTING.LIMITS.MAX_COUNT.PER_RESOURCE,

            columns: {
              id: true,
              url: true,
              width: true,
              height: true,
              thumbhash: true,
              is_approved: true,
            },
          },
        },
      }),
    ),
  ]);

  if (!piece.ok || !piece.data) {
    error(404, ERROR.NOT_FOUND);
  }

  const prerendered = {
    description: piece.data.description
      ? Markdown.to_html(piece.data.description)
      : null,
  };

  return {
    prerendered,
    piece: piece.data,
  };
}) satisfies PageServerLoad;
