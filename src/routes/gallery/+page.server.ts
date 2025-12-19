import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { SEOUtil } from "$lib/utils/seo/seo.util";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const galleries = await Repo.query(
    db.query.gallery.findMany({
      where: (gallery, { eq }) => eq(gallery.admin_approved, true),

      columns: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        formatted_address: true,
      },

      orderBy: (gallery, { desc }) => [desc(gallery.createdAt)],
    }),
  );

  return {
    galleries: galleries.ok ? galleries.data : [],

    seo: SEOUtil.transform({
      title: "Galleries",
      description: "Browse public art galleries",
    }),
  };
}) satisfies PageServerLoad;
