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
  const artist = await Repo.query(
    db.query.artist.findFirst({
      where: (artist, { eq, and }) =>
        and(
          //
          eq(artist.slug, params.slug),
          eq(artist.is_approved, true),
        ),

      with: {
        images: {
          limit: IMAGE_HOSTING.LIMITS.MAX_COUNT.PER_RESOURCE,
          where: (d, { eq }) => eq(d.is_approved, true),

          columns: {
            id: true,
            url: true,
            width: true,
            height: true,
            thumbhash: true,
          },
        },

        pieces: {
          limit: 10,
          where: (d, { eq }) => eq(d.is_published, true),

          columns: {
            id: true,
            name: true,
            slug: true,
            price: true,
            medium: true,
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
              where: (d, { eq }) => eq(d.is_approved, true),

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
  );

  if (!artist.ok || !artist.data) {
    error(404, ERROR.NOT_FOUND);
  }

  const prerendered = {
    description: artist.data.description
      ? Markdown.to_html(artist.data.description)
      : null,
  };

  waitUntil(
    PageViewService.create({
      resource_kind: "artist",
      resource_id: artist.data.id,
    }),
  );

  return {
    prerendered,
    artist: artist.data,

    seo: SEOUtil.from_resource(artist.data),
  };
}) satisfies PageServerLoad;
