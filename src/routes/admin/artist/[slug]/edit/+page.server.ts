import { ERROR } from "$lib/const/error.const";
import { IMAGE_HOSTING } from "$lib/const/image/image_hosting.const";
import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { get_session } from "$lib/services/auth.service";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [_admin, artist] = await Promise.all([
    get_session({ admin: true }),

    Repo.query(
      db.query.artist.findFirst({
        where: (artist, { eq }) => eq(artist.slug, params.slug),

        with: {
          images: {
            limit: IMAGE_HOSTING.LIMITS.MAX_COUNT.PER_RESOURCE,

            columns: {
              id: true,
              url: true,
              size: true,
              width: true,
              height: true,
              thumbhash: true,
            },
          },
        },
      }),
    ),
  ]);

  if (!artist.ok || !artist.data) {
    error(404, ERROR.NOT_FOUND);
  }

  return {
    artist: artist.data,
  };
}) satisfies PageServerLoad;
