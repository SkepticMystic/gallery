import { resolve } from "$app/paths";
import { command, form, query } from "$app/server";
import { db } from "$lib/server/db/drizzle.db";
import {
  GallerySchema,
  GalleryTable,
} from "$lib/server/db/models/gallery.model";
import { Repo } from "$lib/server/db/repos/index.repo";
import { get_seller_session, get_session } from "$lib/services/auth.service";
import { GalleryService } from "$lib/services/gallery/gallery.service";
import { result } from "$lib/utils/result.util";
import { invalid, redirect } from "@sveltejs/kit";
import { and, count, eq, sql } from "drizzle-orm";
import z from "zod";

export const get_random_public_gallery_remote = query(async () => {
  const res = await Repo.query(
    db
      .select()
      .from(GalleryTable)
      .where(eq(GalleryTable.is_approved, true))
      .orderBy(sql.raw("RANDOM()"))
      .limit(1)
      .execute(),
  );

  return res.ok ? result.suc(res.data.at(0)) : result.err(res.error);
});

export const count_public_galleries_remote = query(async () => {
  const res = await Repo.query(
    db
      .select({ count: count(GalleryTable.id) })
      .from(GalleryTable)
      .where(eq(GalleryTable.is_approved, true)),
  );

  return res.ok ? (res.data.at(0)?.count ?? 0) : 0;
});

export const list_my_galleries_remote = query(async () => {
  const { session } = await get_seller_session();

  const galleries = await Repo.query(
    db.query.gallery.findMany({
      where: (gallery, { eq }) => eq(gallery.org_id, session.org_id),

      columns: { id: true, name: true, slug: true, logo: true },
    }),
  );

  return galleries;
});

export const upsert_gallery_remote = form(
  GallerySchema.insert.extend({ id: z.uuid().optional() }),
  async (input) => {
    console.log("upsert_gallery_remote.input", input);

    const { session } = await get_seller_session();

    const res = input.id
      ? await GalleryService.update_one(
          { id: input.id, org_id: session.org_id },
          input,
        )
      : await GalleryService.insert_one({
          ...input,
          org_id: session.org_id,
        });

    console.log("upsert_gallery_remote.res", res);

    if (!res.ok) {
      if (res.error.path) {
        invalid(res.error);
      } else {
        return res;
      }
    } else {
      redirect(302, resolve("/s/gallery/[slug]", res.data));
    }
  },
);

export const delete_gallery_by_id_remote = command(
  z.uuid(), //
  async (gallery_id) => {
    const { session } = await get_seller_session();

    return await Repo.delete_one(
      db
        .delete(GalleryTable)
        .where(
          and(
            eq(GalleryTable.id, gallery_id),
            eq(GalleryTable.org_id, session.org_id),
          ),
        )
        .execute(),
    );
  },
);

export const admin_delete_gallery_remote = command(
  z.uuid(), //
  async (gallery_id) => {
    await get_session({ admin: true });

    return await Repo.delete_one(
      db.delete(GalleryTable).where(eq(GalleryTable.id, gallery_id)).execute(),
    );
  },
);

export const toggle_gallery_approved_remote = command(
  z.uuid(),
  async (gallery_id) => {
    await get_session({ admin: true });

    // Get current state
    const gallery = await Repo.query(
      db.query.gallery.findFirst({
        where: (gallery, { eq }) => eq(gallery.id, gallery_id),
        columns: { is_approved: true },
      }),
    );

    if (!gallery.ok || !gallery.data) {
      return result.err({ message: "Gallery not found" });
    }

    // Toggle the approval state
    return await Repo.update_one(
      db
        .update(GalleryTable)
        .set({ is_approved: !gallery.data.is_approved })
        .where(eq(GalleryTable.id, gallery_id))
        .returning(),
    );
  },
);
