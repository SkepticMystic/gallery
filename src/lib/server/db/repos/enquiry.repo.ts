import { db } from "$lib/server/db/drizzle.db";
import { EnquiryTable } from "$lib/server/db/models/enquiry.model";
import { Repo } from "./index.repo";

const insert_one = async (input: typeof EnquiryTable.$inferInsert) => {
  const enquiry = await Repo.insert_one(
    db.insert(EnquiryTable).values(input).returning(),
  );

  return enquiry;
};

export const EnquiryRepo = {
  insert_one,
};
