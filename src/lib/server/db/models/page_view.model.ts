import { index, pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { RESOURCES } from "../../../const/resource/resource.const";
import { OrganizationTable, UserTable } from "./auth.model";
import { Schema } from "./index.schema";

export const page_view_resource_kind_enum = pgEnum(
  "page_view_resource_kind",
  RESOURCES.KIND.IDS,
);

export const PageViewTable = pgTable(
  "page_view",
  {
    ...Schema.id(),

    url: varchar({ length: 2047 }).notNull(),

    resource_id: uuid().notNull(),
    resource_kind: page_view_resource_kind_enum().notNull(),

    viewer_user_id: uuid() //
      .references(() => UserTable.id, { onDelete: "no action" }),
    org_id: uuid() //
      .references(() => OrganizationTable.id, { onDelete: "cascade" })
      .notNull(),

    ip_address: varchar({ length: 255 }),
    user_agent: varchar({ length: 255 }),

    ...Schema.timestamps,
  },
  (table) => [
    index("idx_page_view_org_id").on(table["org_id"]),
    index("idx_page_view_resource_id").on(table["resource_id"]),
  ],
);

export type PageView = typeof PageViewTable.$inferSelect;
