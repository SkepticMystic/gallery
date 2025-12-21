import { command, query } from "$app/server";
import { query_schema } from "$lib/schema/query/query.schema";
import { db } from "$lib/server/db/drizzle.db";
import { ArtistTable } from "$lib/server/db/models/artist.model";
import { Repo } from "$lib/server/db/repos/index.repo";
import { get_session } from "$lib/services/auth.service";
import { ArtistUtil } from "$lib/utils/artist/artist.util";
import { Log } from "$lib/utils/logger.util";
import { eq } from "drizzle-orm";
import z from "zod";

export const get_artist_by_name_remote = query.batch(
  z.string().transform(ArtistUtil.normalise_name),
  async (normalized_names) => {
    const artists = await Repo.query(
      db.query.artist.findMany({
        where: (artist, { eq, ilike, or, and }) =>
          and(
            eq(artist.is_approved, true),
            or(
              ...normalized_names.map((normalized_name) =>
                ilike(artist.normalized_name, "%" + normalized_name + "%"),
              ),
            ),
          ),
      }),
    );

    if (!artists.ok) {
      return () => undefined;
    }

    // NOTE: Svelte says `name` is the post-transform normalized type, but it's not
    return (name) => {
      const normalized_name = ArtistUtil.normalise_name(name);

      return artists.data.find((a) => a.normalized_name === normalized_name);
    };
  },
);

// export const create_artist_remote = form(
//   ArtistSchema.insert, //
//   async (input) => {
//     console.log("create_artist_remote.input", input);

//     const { session } = await get_seller_session();

//     const res = await ArtistService.insert_one({
//       ...input,
//       created_by_org_id: session.org_id,
//     });

//     console.log("create_artist_remote.res", res);

//     if (!res.ok) {
//       if (res.error.path) {
//         invalid(res.error);
//       } else {
//         return res;
//       }
//     } else {
//       redirect(302, resolve("/s/artist/[slug]", res.data));
//     }
//   },
// );

const artist_query_schema = query_schema(
  z.object({
    normalized_name: z
      .object({
        ilike: z.string().transform(ArtistUtil.normalise_name).optional(),
      })
      .optional(),
  }),
);

export const search_artists_remote = query(
  artist_query_schema,
  async (input) => {
    Log.info(input, "search_artists_remote.input");

    const artists = await Repo.query(
      db.query.artist.findMany({
        limit: input.limit,
        offset: input.offset,

        where: (artist, { and, ilike }) =>
          and(
            input.where.normalized_name?.ilike //
              ? ilike(
                  artist.normalized_name,
                  "%" + input.where.normalized_name.ilike + "%",
                )
              : undefined,
          ),

        columns: {
          id: true,
          name: true,
          slug: true,
          normalized_name: true,
        },

        // with: {
        //   images: {
        //     columns: {
        //       url: true,
        //       thumbhash: true,
        //     },
        //   },
        // },
      }),
    );

    Log.debug(artists, "search_artists_remote.res");

    return artists;
  },
);

export const admin_delete_artist_remote = command(
  z.uuid(), //
  async (artist_id) => {
    await get_session({ admin: true });

    return await Repo.delete_one(
      db.delete(ArtistTable).where(eq(ArtistTable.id, artist_id)).execute(),
    );
  },
);

export const admin_approve_artist_remote = command(
  z.object({ id: z.uuid(), is_approved: z.boolean() }),
  async (input) => {
    await get_session({ admin: true });

    return await Repo.update_one(
      db
        .update(ArtistTable)
        .set({ is_approved: input.is_approved })
        .where(eq(ArtistTable.id, input.id))
        .returning(),
    );
  },
);
