import type { RouteId } from "$app/types";
import { APP } from "$lib/const/app.const";
import { ERROR } from "$lib/const/error.const";
import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { error, type RequestHandler } from "@sveltejs/kit";
import * as sitemap from "super-sitemap";

export const prerender = true;

export const GET: RequestHandler = async () => {
  const [galleries, pieces] = await Promise.all([
    Repo.query(
      db.query.gallery.findMany({
        columns: { slug: true, updatedAt: true },
      }),
    ),
    Repo.query(
      db.query.piece.findMany({
        columns: { slug: true, updatedAt: true },
      }),
    ),
  ]);

  if (!galleries.ok || !pieces.ok) {
    error(500, ERROR.INTERNAL_SERVER_ERROR);
  }

  return await sitemap.response({
    origin: APP.URL,

    excludeRoutePatterns: ["^/admin", "^/s/"],

    paramValues: {
      "/gallery/[slug]": galleries.data.map((d) => ({
        values: [d.slug],
        lastmod: d.updatedAt?.toISOString().split("T")[0],
      })),
      "/piece/[slug]": pieces.data.map((d) => ({
        values: [d.slug],
        lastmod: d.updatedAt?.toISOString().split("T")[0],
      })),
    } satisfies Partial<Record<RouteId, sitemap.ParamValues[string]>>,
  });
};
