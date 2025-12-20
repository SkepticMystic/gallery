import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { get_seller_session } from "$lib/services/auth.service";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const { session } = await get_seller_session();

  const galleries = await Repo.query(
    db.query.gallery.findMany({
      where: (gallery, { eq }) => eq(gallery.org_id, session.org_id),

      columns: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        google_place_id: true,
        formatted_address: true,
      },

      orderBy: (gallery, { desc }) => [desc(gallery.createdAt)],
    }),
  );

  return {
    galleries: galleries.ok ? galleries.data : [],
  };
}) satisfies PageServerLoad;
