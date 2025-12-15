import { db } from "$lib/server/db/drizzle.db";
import { PieceTable } from "$lib/server/db/models/piece.model";
import { and, eq } from "drizzle-orm";
import { Repo } from "./index.repo";

const insert_one = async (input: typeof PieceTable.$inferInsert) => {
  const piece = await Repo.insert_one(
    db.insert(PieceTable).values(input).returning(),
  );

  return piece;
};

const update_one = async (
  find: { id: string; org_id: string },
  update: Partial<typeof PieceTable.$inferInsert>,
) => {
  console.log("PieceRepo.update_one.input", update, find);

  const piece = await Repo.update_one(
    db
      .update(PieceTable)
      .set(update)
      .where(
        and(
          eq(PieceTable.id, find.id),
          eq(PieceTable.org_id, find.org_id), //
        ),
      )
      .returning(),
  );

  return piece;
};

export const PieceRepo = {
  insert_one,
  update_one,
};
