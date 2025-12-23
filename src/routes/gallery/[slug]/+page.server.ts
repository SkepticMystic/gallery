import { ERROR } from "$lib/const/error.const";
import { IMAGE_HOSTING } from "$lib/const/image/image_hosting.const";
import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { PageViewService } from "$lib/services/page_view/page_view.service";
import { Markdown } from "$lib/utils/markdown/markdown.util";
import { SEOUtil } from "$lib/utils/seo/seo.util";
import { error } from "@sveltejs/kit";
import { waitUntil } from "@vercel/functions";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const gallery = await Repo.query(
    db.query.gallery.findFirst({
      where: (gallery, { eq, and }) =>
        and(
          //
          eq(gallery.slug, params.slug),
          eq(gallery.is_approved, true),
        ),

      with: {
        images: {
          limit: IMAGE_HOSTING.LIMITS.MAX_COUNT.PER_RESOURCE,
          columns: {
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
  );

  if (!gallery.ok || !gallery.data) {
    error(404, ERROR.NOT_FOUND);
  }

  const prerendered = {
    description: gallery.data.description
      ? Markdown.to_html(gallery.data.description)
      : null,
  };

  waitUntil(
    PageViewService.create({
      resource_kind: "gallery",
      resource_id: gallery.data.id,
    }),
  );

  return {
    prerendered,
    gallery: gallery.data,

    seo: SEOUtil.from_resource(gallery.data),
  };
}) satisfies PageServerLoad;
