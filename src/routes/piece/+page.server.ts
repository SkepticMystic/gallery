import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { SEOUtil } from "$lib/utils/seo/seo.util";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const pieces = await Repo.query(
    db.query.piece.findMany({
      where: (piece, { eq }) => eq(piece.is_published, true),
      orderBy: (piece, { desc }) => [desc(piece.createdAt)],

      columns: {
        id: true,
        name: true,
        slug: true,
        artist_name: true,
        medium: true,
        price: true,
        gallery_id: true,
        year_created: true,
      },

      with: {
        gallery: {
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        },

        images: {
          limit: 1,
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

  return {
    pieces: pieces.ok ? pieces.data : [],

    seo: SEOUtil.transform({
      title: "Pieces",
      description: "Browse public art pieces",
    }),
  };
}) satisfies PageServerLoad;
