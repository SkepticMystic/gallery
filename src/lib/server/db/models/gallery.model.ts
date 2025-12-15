import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  jsonb,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import type { Branded } from "../../../interfaces/zod/zod.types";
import { tel_schema } from "../../../schema/tel/schema/tel.schema";
import { friendly_url_schema } from "../../../schema/url/url.schema";
import { OrganizationTable } from "./auth.model";
import { ImageTable } from "./image.model";
import { Schema } from "./index.schema";

// Define Gallery table schema
export const GalleryTable = pgTable(
  "gallery",
  {
    ...Schema.id(),

    org_id: uuid()
      .notNull()
      .references(() => OrganizationTable.id, { onDelete: "cascade" }),

    name: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull().unique(),
    logo: varchar({ length: 2047 }).default("").notNull(),
    description: text().default("").notNull(),

    urls: jsonb()
      .default([])
      .notNull()
      .$type<{ data: Branded<"Url">; label: string }[]>(),
    phones: jsonb()
      .default([])
      .notNull()
      .$type<{ data: Branded<"Phone">; label: string }[]>(),
    emails: jsonb()
      .default([])
      .notNull()
      .$type<{ data: Branded<"Email">; label: string }[]>(),

    google_place_id: varchar({ length: 255 }).default("").notNull(),
    formatted_address: varchar({ length: 511 }).default("").notNull(),
    coord_lat: doublePrecision().default(0).notNull(),
    coord_lng: doublePrecision().default(0).notNull(),

    admin_approved: boolean().default(false).notNull(),

    ...Schema.timestamps,
  },
  (table) => [index("idx_gallery_org_id").on(table["org_id"])],
);

export const gallery_relations = relations(GalleryTable, ({ one, many }) => ({
  org: one(OrganizationTable, {
    fields: [GalleryTable.org_id],
    references: [OrganizationTable.id],
  }),

  images: many(ImageTable),
}));

export type Gallery = typeof GalleryTable.$inferSelect;

const pick = {
  name: true,
  logo: true,
  description: true,

  urls: true,
  phones: true,
  emails: true,

  coord_lat: true,
  coord_lng: true,
  google_place_id: true,
  formatted_address: true,
} satisfies Partial<Record<keyof Gallery, true>>;

const refinements = {
  logo: z.union([z.literal(""), friendly_url_schema]),
  name: z.string().trim().min(1, "Please enter a name for your gallery"),

  description: z
    .string()
    .trim()
    .max(5000, "Description must be at most 5000 characters"),

  coord_lat: z.coerce.number<string | number>(),
  coord_lng: z.coerce.number<string | number>(),
  formatted_address: z.string().trim(),

  urls: z
    .array(
      z.object({
        label: z.string().trim().default(""),
        data: z.union([z.literal(""), friendly_url_schema]),
      }),
    )
    .max(3)
    .transform(
      (arr) =>
        arr.filter((v) => v.data) as {
          label: string;
          data: Branded<"Url">;
        }[],
    ),
  emails: z
    .array(
      z.object({
        label: z.string().trim().default(""),
        data: z.union([z.literal(""), z.email()]),
      }),
    )
    .max(3)
    .transform(
      (arr) =>
        arr.filter((v) => v.data) as {
          label: string;
          data: Branded<"Email">;
        }[],
    ),
  phones: z
    .array(
      z.object({
        label: z.string().trim().default(""),
        data: z.union(
          [z.literal(""), tel_schema],
          "Please enter a valid phone number",
        ),
      }),
    )
    .max(3)
    .transform(
      (arr) =>
        arr.filter((v) => v.data) as {
          label: string;
          data: Branded<"Phone">;
        }[],
    ),
};

export const GallerySchema = {
  insert: createInsertSchema(GalleryTable, refinements).pick(pick),
  update: createUpdateSchema(GalleryTable, refinements)
    .pick(pick)
    .extend({ id: z.uuid() }),
};

export type GallerySchema = {
  insert: z.input<typeof GallerySchema.insert>;
  update: z.input<typeof GallerySchema.update>;
};
