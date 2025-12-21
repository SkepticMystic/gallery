import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { get_session } from "$lib/services/auth.service";
import { result } from "$lib/utils/result.util";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const [_admin, artists] = await Promise.all([
    get_session({ admin: true }),

    Repo.query(
      db.query.artist.findMany({
        orderBy: (artists, { desc }) => [desc(artists.createdAt)],

        columns: {
          id: true,
          name: true,
          slug: true,
          is_approved: true,
          createdAt: true,
        },

        with: {
          pieces: {
            columns: { id: true },
          },
        },
      }),
    ).then((r) => result.unwrap_or(r, [])),
  ]);

  return { artists };
}) satisfies PageServerLoad;
