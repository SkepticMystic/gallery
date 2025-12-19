import type { Branded } from "$lib/interfaces/zod/zod.types";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { OrganizationTable } from "./auth.model";
import { ImageTable } from "./image.model";
import { Schema } from "./index.schema";
import { PieceTable } from "./piece.model";

// Define Artist table schema
export const ArtistTable = pgTable(
  "artist",
  {
    ...Schema.id(),

    name: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull().unique(),
    normalized_name: varchar({ length: 255 })
      .notNull()
      .unique()
      .$type<Branded<"NormalizedName">>(),

    description: text().default("").notNull(),

    created_by_org_id: uuid()
      .references(() => OrganizationTable.id, { onDelete: "no action" })
      .notNull(),

    is_approved: boolean().default(false).notNull(),

    ...Schema.timestamps,
  },
  (table) => [
    // NOTE: The Piece.artist_name field is a foreign key
    index("idx_artist_name").on(table["name"]),
  ],
);

export const artist_relations = relations(ArtistTable, ({ many }) => ({
  pieces: many(PieceTable),
  images: many(ImageTable),
}));

export type Artist = typeof ArtistTable.$inferSelect;

const pick = {
  name: true,
  description: true,
} satisfies Partial<Record<keyof Artist, true>>;

const refinements = {
  name: z.string().trim().min(1, "Please enter a name for the artist"),

  description: z
    .string()
    .trim()
    .max(5000, "Description must be at most 5000 characters"),
};

export const ArtistSchema = {
  insert: createInsertSchema(ArtistTable, refinements).pick(pick),
  update: createUpdateSchema(ArtistTable, refinements)
    .pick(pick)
    .extend({ id: z.uuid() }),
};

export type ArtistSchema = {
  insert: z.input<typeof ArtistSchema.insert>;
  update: z.input<typeof ArtistSchema.update>;
};
