import { ERROR } from "$lib/const/error.const";
import { IMAGE_HOSTING } from "$lib/const/image/image_hosting.const";
import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { get_session } from "$lib/services/auth.service";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [user, gallery] = await Promise.all([
    get_session(),

    Repo.query(
      db.query.gallery.findFirst({
        where: (gallery, { eq }) => eq(gallery.slug, params.slug),

        with: {
          images: {
            limit: IMAGE_HOSTING.LIMITS.MAX_COUNT.PER_RESOURCE,
            columns: { id: true, url: true, thumbhash: true },
          },

          pieces: {
            limit: 5,
            columns: {
              name: true,
              slug: true,
              medium: true,
              price: true,
              year_created: true,
            },
            with: {
              images: {
                limit: 1,
                columns: { id: true, url: true, thumbhash: true },
              },
            },
          },
        },
      }),
    ),
  ]);

  if (
    !gallery.ok ||
    !gallery.data ||
    gallery.data.org_id !== user.session.org_id
  ) {
    error(404, ERROR.NOT_FOUND);
  }

  return {
    gallery: gallery.data,
  };
}) satisfies PageServerLoad;
