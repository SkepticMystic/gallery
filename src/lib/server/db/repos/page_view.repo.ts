import { db } from "$lib/server/db/drizzle.db";
import { PageViewTable } from "$lib/server/db/models/page_view.model";
import { Repo } from "./index.repo";

const insert_one = async (input: typeof PageViewTable.$inferInsert) => {
  const res = await Repo.insert_one(
    db.insert(PageViewTable).values(input).returning(),
  );

  return res;
};

export const PageViewRepo = {
  insert_one,
};
