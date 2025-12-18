import { resolve } from "$app/paths";
import { command, form, query } from "$app/server";
import { query_schema, where_schema } from "$lib/schema/query/query.schema";
import { db } from "$lib/server/db/drizzle.db";
import { PieceSchema, PieceTable } from "$lib/server/db/models/piece.model";
import { Repo } from "$lib/server/db/repos/index.repo";
import { get_session } from "$lib/services/auth.service";
import { PieceService } from "$lib/services/piece/piece.service";
import { error, invalid, redirect } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const list_my_pieces_remote = query(async () => {
  const { session } = await get_session();

  const pieces = await Repo.query(
    db.query.piece.findMany({
      where: (piece, { eq }) => eq(piece.org_id, session.org_id),

      columns: { id: true, name: true, slug: true },

      with: {
        images: {
          columns: { id: true, url: true, thumbhash: true },
        },
      },
    }),
  );

  return pieces;
});

export const upsert_piece_remote = form(
  PieceSchema.insert.extend({ id: z.uuid().optional() }),
  async (input) => {
    console.log("upsert_piece_remote.input", input);

    const [{ session }, gallery] = await Promise.all([
      get_session(),

      Repo.query(
        db.query.gallery.findFirst({
          columns: { id: true, org_id: true },
          where: (gallery, { eq }) => eq(gallery.id, input.gallery_id),
        }),
      ),
    ]);

    if (
      !gallery.ok ||
      !gallery.data ||
      gallery.data.org_id !== session.org_id
    ) {
      error(401, "Unauthorized");
    }

    const res = input.id
      ? await PieceService.update_one(
          { id: input.id, org_id: session.org_id },
          input,
        )
      : await PieceService.insert_one({
          ...input,
          org_id: session.org_id,
        });

    console.log("upsert_piece_remote.res", res);

    if (!res.ok) {
      if (res.error.path) {
        invalid(res.error);
      } else {
        return res;
      }
    } else {
      redirect(302, resolve("/s/piece/[slug]", res.data));
    }
  },
);

export const delete_piece_by_id_remote = command(
  z.uuid(), //
  async (piece_id) => {
    const { session } = await get_session();

    return await Repo.delete_one(
      db
        .delete(PieceTable)
        .where(
          and(
            eq(PieceTable.id, piece_id),
            eq(PieceTable.org_id, session.org_id),
          ),
        )
        .execute(),
    );
  },
);

const piece_query_schema = query_schema(
  z.object({
    name: z.object(where_schema.ilike()).optional(),
    id: z.object(where_schema.nin(z.uuid())).optional(),
    gallery_id: z.object(where_schema.in(z.uuid())).optional(),
  }),
);

export const search_published_pieces_remote = query(
  piece_query_schema,
  async (input) => {
    const pieces = await Repo.query(
      db.query.piece.findMany({
        limit: input.limit,
        offset: input.offset,

        where: (piece, { eq, and, ilike, inArray, notInArray }) =>
          and(
            eq(piece.is_published, true),

            input.where.id?.nin //
              ? notInArray(piece.id, input.where.id.nin)
              : undefined,
            input.where.name?.ilike //
              ? ilike(piece.name, input.where.name.ilike)
              : undefined,
            input.where.gallery_id?.in
              ? inArray(piece.gallery_id, input.where.gallery_id.in)
              : undefined,
          ),

        columns: {
          id: true,
          name: true,
          slug: true,
          price: true,
          medium: true,
          gallery_id: true,
          year_created: true,
        },

        with: {
          images: {
            columns: { url: true, thumbhash: true },
          },
        },
      }),
    );

    return pieces;
  },
);
