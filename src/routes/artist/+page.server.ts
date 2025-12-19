import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { SEOUtil } from "$lib/utils/seo/seo.util";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const artists = await Repo.query(
    db.query.artist.findMany({
      where: (artist, { eq }) => eq(artist.is_approved, true),

      columns: {
        id: true,
        name: true,
        slug: true,
      },

      orderBy: (artist, { asc }) => [asc(artist.normalized_name)],
    }),
  );

  return {
    artists: artists.ok ? artists.data : [],

    seo: SEOUtil.transform({
      title: "Artists",
      description: "Browse artists and their work",
    }),
  };
}) satisfies PageServerLoad;
