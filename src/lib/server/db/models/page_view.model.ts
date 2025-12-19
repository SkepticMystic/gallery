import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./auth.model";
import { Schema } from "./index.schema";

export const PageViewTable = pgTable("page_view", {
  ...Schema.id(),

  url: varchar({ length: 2047 }).notNull(),
  page_key: varchar({ length: 255 }).notNull(),

  ip_address: varchar({ length: 255 }),
  user_agent: varchar({ length: 255 }),
  user_id: uuid() //
    .references(() => UserTable.id, { onDelete: "cascade" }),

  ...Schema.timestamps,
});

export type PageView = typeof PageViewTable.$inferSelect;
