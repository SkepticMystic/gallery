import type { Branded } from "$lib/interfaces/zod/zod.types";
import { db } from "$lib/server/db/drizzle.db";
import { ArtistTable } from "$lib/server/db/models/artist.model";
import { Repo } from "./index.repo";

const get_by_normalized_name = async (
  normalized_name: Branded<"NormalizedName">,
) => {
  const artist = await Repo.query(
    db.query.artist.findFirst({
      where: (artist, { eq }) => eq(artist.normalized_name, normalized_name),
    }),
  );

  return artist;
};

const insert_one = async (input: typeof ArtistTable.$inferInsert) => {
  const artist = await Repo.insert_one(
    db.insert(ArtistTable).values(input).returning(),
  );

  return artist;
};

// const update_one = async (
//   find: {
//     id: string;
//     // org_id: string
//   },
//   update: Partial<typeof ArtistTable.$inferInsert>,
// ) => {
//   console.log("ArtistRepo.update_one.input", update, find);

//   const artist = await Repo.update_one(
//     db
//       .update(ArtistTable)
//       .set(update)
//       .where(
//         and(
//           eq(ArtistTable.id, find.id),
//           // eq(ArtistTable.org_id, find.org_id), // TODO: Currently just an admin thing then, I guess?
//         ),
//       )
//       .returning(),
//   );

//   return artist;
// };

export const ArtistRepo = {
  get_by_normalized_name,
  insert_one,
  // update_one,
};
