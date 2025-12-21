import { ERROR } from "$lib/const/error.const";
import { IMAGE_HOSTING } from "$lib/const/image/image_hosting.const";
import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { get_session } from "$lib/services/auth.service";
import { Markdown } from "$lib/utils/markdown/markdown.util";
import { SEOUtil } from "$lib/utils/seo/seo.util";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [_admin, gallery] = await Promise.all([
    get_session({ admin: true }),

    Repo.query(
      db.query.gallery.findFirst({
        where: (gallery, { eq }) => eq(gallery.slug, params.slug),

        with: {
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

          pieces: {
            limit: 20,
            columns: {
              id: true,
              name: true,
              slug: true,
              medium: true,
              price: true,
              year_created: true,
            },
            with: {
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
          },
        },
      }),
    ),
  ]);

  if (!gallery.ok || !gallery.data) {
    error(404, ERROR.NOT_FOUND);
  }

  const prerendered = {
    description: gallery.data.description
      ? Markdown.to_html(gallery.data.description)
      : null,
  };

  return {
    prerendered,
    gallery: gallery.data,

    seo: SEOUtil.from_resource(gallery.data),
  };
}) satisfies PageServerLoad;
