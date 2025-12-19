import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import {
  RESOURCES,
  type ResourceKind,
} from "../../../const/resource/resource.const";
import { OrganizationTable } from "./auth.model";
import { Schema } from "./index.schema";

// Define Enquiry table schema
export const EnquiryTable = pgTable("enquiry", {
  ...Schema.id(),

  created_by_user_id: uuid(),
  org_id: uuid()
    .references(() => OrganizationTable.id, { onDelete: "no action" })
    .notNull(),

  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  message: text().notNull(),

  resource_id: varchar({ length: 255 }).notNull(),
  resource_kind: text().notNull().$type<ResourceKind>(),

  ...Schema.timestamps,
});

export type Enquiry = typeof EnquiryTable.$inferSelect;

const pick = {
  name: true,
  email: true,
  message: true,

  resource_id: true,
  resource_kind: true,
} satisfies Partial<Record<keyof Enquiry, true>>;

const refinements = {
  email: z.email("Please enter a valid email address"),
  name: z.string().trim().min(1, "Please enter your name"),
  message: z
    .string()
    .trim()
    .min(1, "Please enter a message")
    .max(5000, "Message must be at most 5000 characters"),

  resource_id: z.string().trim().min(1),
  resource_kind: z.enum(RESOURCES.KIND.IDS),
};

export const EnquirySchema = {
  insert: createInsertSchema(EnquiryTable, refinements).pick(pick),
};

export type EnquirySchema = {
  insert: z.input<typeof EnquirySchema.insert>;
};
