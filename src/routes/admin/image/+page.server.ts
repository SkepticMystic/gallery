import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { get_session } from "$lib/services/auth.service";
import { result } from "$lib/utils/result.util";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const [_admin, images] = await Promise.all([
    get_session({ admin: true }),

    Repo.query(
      db.query.image.findMany({
        orderBy: (images, { desc }) => [desc(images.createdAt)],

        columns: {
          id: true,
          url: true,
          resource_id: true,
          resource_kind: true,
          admin_approved: true,
          width: true,
          height: true,
          size: true,
          createdAt: true,
        },

        with: {
          org: {
            columns: { name: true },
          },
        },
      }),
    ).then((r) => result.unwrap_or(r, [])),
  ]);

  return { images };
}) satisfies PageServerLoad;
