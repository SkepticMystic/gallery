import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { IMAGE_HOSTING } from "../../../const/image/image_hosting.const";
import { RESOURCES } from "../../../const/resource/resource.const";
import { OrganizationTable } from "./auth.model";
import { GalleryTable } from "./gallery.model";
import { Schema } from "./index.schema";
import { PieceTable } from "./piece.model";

export const image_provider_enum = pgEnum(
  "image_providers",
  IMAGE_HOSTING.PROVIDER.IDS,
);

// NOTE: Use the same names as given to the drizzle.schema setup
export const image_resource_kind_enum = pgEnum(
  "image_resource_kind",
  RESOURCES.KIND.IDS,
);

export const ImageTable = pgTable(
  "image",
  {
    ...Schema.id(),

    org_id: uuid()
      .notNull()
      .references(() => OrganizationTable.id, { onDelete: "cascade" }),

    url: varchar({ length: 2048 }).notNull(),
    provider: image_provider_enum().notNull(),
    external_id: varchar({ length: 255 }).notNull().unique(),
    /** Raw response from provider */
    response: jsonb().notNull(),

    // NOT unique! Many images for one resource
    resource_id: uuid().notNull(),
    resource_kind: image_resource_kind_enum().notNull(),

    thumbhash: varchar({ length: 100 }),

    size: integer().notNull(),
    width: integer().notNull(),
    height: integer().notNull(),

    admin_approved: boolean().default(false).notNull(),

    ...Schema.timestamps,
  },
  (table) => [
    index("idx_image_org_id").on(table["org_id"]),
    // NOTE: I could make a compound index on (resource_id, resource_kind) but
    // the id is gonna be a unique uuid
    index("idx_image_resource_id").on(table["resource_id"]),
  ],
);

export const image_relations = relations(ImageTable, ({ one }) => ({
  gallery: one(GalleryTable, {
    fields: [ImageTable.resource_id],
    references: [GalleryTable.id],
  }),

  piece: one(PieceTable, {
    fields: [ImageTable.resource_id],
    references: [PieceTable.id],
  }),
}));

export type Image = typeof ImageTable.$inferSelect;

const pick = {
  resource_id: true,
  resource_kind: true,
} satisfies Partial<Record<keyof Image, true>>;

export const ImageSchema = {
  insert: createInsertSchema(ImageTable).pick(pick),
};
