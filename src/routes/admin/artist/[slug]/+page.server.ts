import { ERROR } from "$lib/const/error.const";
import { IMAGE_HOSTING } from "$lib/const/image/image_hosting.const";
import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { get_session } from "$lib/services/auth.service";
import { Markdown } from "$lib/utils/markdown/markdown.util";
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
              width: true,
              height: true,
              thumbhash: true,
              is_approved: true,
            },
          },

          pieces: {
            limit: 10,

            columns: {
              id: true,
              name: true,
              slug: true,
              price: true,
              medium: true,
              artist_name: true,
              is_published: true,
            },

            with: {
              gallery: {
                columns: {
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
                  is_approved: true,
                },
              },
            },
          },
        },
      }),
    ),
  ]);

  if (!artist.ok || !artist.data) {
    error(404, ERROR.NOT_FOUND);
  }

  const prerendered = {
    description: artist.data.description
      ? Markdown.to_html(artist.data.description)
      : null,
  };

  return {
    prerendered,
    artist: artist.data,
  };
}) satisfies PageServerLoad;
