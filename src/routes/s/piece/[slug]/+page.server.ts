import { ERROR } from "$lib/const/error.const";
import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { get_session } from "$lib/services/auth.service";
import { Markdown } from "$lib/utils/markdown/markdown.util";
import { SEOUtil } from "$lib/utils/seo/seo.util";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [{ session }, piece] = await Promise.all([
    get_session(),

    Repo.query(
      db.query.piece.findFirst({
        where: (piece, { eq }) => eq(piece.slug, params.slug),

        with: {
          gallery: {
            columns: {
              name: true,
              slug: true,
            },
          },

          images: {
            columns: {
              id: true,
              url: true,
              width: true,
              height: true,
              thumbhash: true,
            },
          },
        },
      }),
    ),
  ]);

  if (!piece.ok || !piece.data || piece.data.org_id !== session.org_id) {
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

    seo: SEOUtil.from_resource(piece.data),
  };
}) satisfies PageServerLoad;
