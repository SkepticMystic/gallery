import { ERROR } from "$lib/const/error.const";
import { db } from "$lib/server/db/drizzle.db";
import { Repo } from "$lib/server/db/repos/index.repo";
import { get_session } from "$lib/services/auth.service";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
  const [_admin, organization] = await Promise.all([
    get_session({ admin: true }),

    Repo.query(
      db.query.organization.findFirst({
        where: (org, { eq }) => eq(org.id, params.id),

        with: {
          members: {
            orderBy: (members, { desc }) => [desc(members.createdAt)],

            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  createdAt: true,
                },
              },
            },
          },

          invitations: {
            orderBy: (invitations, { desc }) => [desc(invitations.createdAt)],

            with: {
              inviter: {
                columns: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      }),
    ),
  ]);

  if (!organization.ok || !organization.data) {
    error(404, ERROR.NOT_FOUND);
  }

  return { organization: organization.data };
}) satisfies PageServerLoad;
