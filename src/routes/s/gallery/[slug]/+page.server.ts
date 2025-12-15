import { ERROR } from "$lib/const/error.const";
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
