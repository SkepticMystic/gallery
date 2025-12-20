import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { PIECE } from "../../../const/piece/piece.const";
import { ArtistTable } from "./artist.model";
import { OrganizationTable } from "./auth.model";
import { GalleryTable } from "./gallery.model";
import { ImageTable } from "./image.model";
import { Schema } from "./index.schema";

export const piece_status_enum = pgEnum("piece_status", PIECE.STATUS.IDS);

// Define Piece table schema
export const PieceTable = pgTable(
  "piece",
  {
    ...Schema.id(),

    org_id: uuid()
      .notNull()
      .references(() => OrganizationTable.id, { onDelete: "cascade" }),

    gallery_id: uuid()
      .notNull()
      .references(() => GalleryTable.id, { onDelete: "cascade" }),

    artist_name: varchar({ length: 255 }).notNull().default(""),

    is_featured: boolean().default(false).notNull(),
    is_published: boolean().default(false).notNull(),

    name: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull().unique(),
    description: text().default("").notNull(),

    medium: text().notNull(),
    style: varchar({ length: 511 }).notNull().default(""),
    // category: varchar({ length: 511 }).notNull().default(""),

    width_cm: doublePrecision().notNull().default(0),
    height_cm: doublePrecision().notNull().default(0),
    depth_cm: doublePrecision().notNull().default(0),

    weight_kg: doublePrecision().notNull().default(0),

    year_created: integer().notNull().default(0),

    price: doublePrecision().notNull().default(0),

    status: piece_status_enum().notNull().default("available"),

    // is_published: boolean().default(false).notNull(),

    ...Schema.timestamps,
  },
  (table) => [
    index("idx_piece_org_id").on(table["org_id"]),
    index("idx_piece_gallery_id").on(table["gallery_id"]),
    index("idx_piece_status").on(table["status"]),
  ],
);

export const piece_relations = relations(PieceTable, ({ one, many }) => ({
  org: one(OrganizationTable, {
    fields: [PieceTable.org_id],
    references: [OrganizationTable.id],
  }),
  gallery: one(GalleryTable, {
    fields: [PieceTable.gallery_id],
    references: [GalleryTable.id],
  }),
  artist: one(ArtistTable, {
    fields: [PieceTable.artist_name],
    references: [ArtistTable.name],
  }),

  images: many(ImageTable),
}));

export type Piece = typeof PieceTable.$inferSelect;

const pick = {
  gallery_id: true,
  artist_name: true,

  is_featured: true,
  is_published: true,

  name: true,
  description: true,

  medium: true,
  style: true,
  // category: true,

  depth_cm: true,
  height_cm: true,
  width_cm: true,
  weight_kg: true,
  year_created: true,

  price: true,
  status: true,
} satisfies Partial<Record<keyof Piece, true>>;

const refinements = {
  gallery_id: z.uuid(),

  name: z.string().trim().min(1, "Please enter a title for the piece"),

  description: z
    .string()
    .trim()
    .max(5000, "Description must be at most 5000 characters"),

  medium: z.string().trim().min(1, "Please enter a medium"),

  width_cm: z.coerce.number<number>().default(0),
  height_cm: z.coerce.number<number>().default(0),
  depth_cm: z.coerce.number<number>().default(0),
  weight_kg: z.coerce.number<number>().default(0),

  year_created: z.coerce.number<number>().int().default(0),

  price: z.coerce
    .number<number>()
    .min(0, "Price cannot be negative")
    .max(100_000_000, "It can't be _that_ expensive...")
    .default(0),
};

export const PieceSchema = {
  insert: createInsertSchema(PieceTable, refinements).pick(pick),
  update: createUpdateSchema(PieceTable, refinements)
    .pick(pick)
    .extend({ id: z.uuid() }),
};

export type PieceSchema = {
  insert: z.input<typeof PieceSchema.insert>;
  update: z.input<typeof PieceSchema.update>;
};
