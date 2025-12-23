import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { get_session } from "$lib/services/auth.service";
import { result } from "$lib/utils/result.util";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const [_admin, galleries] = await Promise.all([
    get_session({ admin: true }),

    Repo.query(
      db.query.gallery.findMany({
        orderBy: (galleries, { desc }) => [desc(galleries.createdAt)],

        columns: {
          id: true,
          name: true,
          slug: true,
          is_approved: true,
          createdAt: true,
        },

        with: {
          org: {
            columns: { name: true },
          },
          pieces: {
            columns: { id: true },
          },
        },
      }),
    ).then((r) => result.unwrap_or(r, [])),
  ]);

  return { galleries };
}) satisfies PageServerLoad;
