import { ERROR } from "$lib/const/error.const";
import { IMAGE_HOSTING } from "$lib/const/image/image_hosting.const";
import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { Markdown } from "$lib/utils/markdown/markdown.util";
import { SEOUtil } from "$lib/utils/seo/seo.util";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const piece = await Repo.query(
    db.query.piece.findFirst({
      where: (piece, { eq, and }) =>
        and(
          //
          eq(piece.slug, params.slug),
          eq(piece.is_published, true),
        ),

      with: {
        gallery: {
          columns: {
            name: true,
            slug: true,
            admin_approved: true,
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
          },
        },
      },
    }),
  );

  // Only show pieces from approved galleries
  if (!piece.ok || !piece.data || !piece.data.gallery.admin_approved) {
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
