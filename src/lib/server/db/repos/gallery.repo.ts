import { db } from "$lib/server/db/drizzle.db";
import { GalleryTable } from "$lib/server/db/models/gallery.model";
import { and, eq } from "drizzle-orm";
import { Repo } from "./index.repo";

const insert_one = async (input: typeof GalleryTable.$inferInsert) => {
  const gallery = await Repo.insert_one(
    db.insert(GalleryTable).values(input).returning(),
  );

  return gallery;
};

const update_one = async (
  find: { id: string; org_id: string },
  update: Partial<typeof GalleryTable.$inferInsert>,
) => {
  console.log("GalleryRepo.update_one.input", update, find);

  const gallery = await Repo.update_one(
    db
      .update(GalleryTable)
      .set(update)
      .where(
        and(
          eq(GalleryTable.id, find.id),
          eq(GalleryTable.org_id, find.org_id), //
        ),
      )
      .returning(),
  );

  return gallery;
};

export const GalleryRepo = {
  insert_one,
  update_one,
};
