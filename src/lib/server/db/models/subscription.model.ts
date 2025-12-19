import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { OrganizationTable, UserTable } from "./auth.model";
import { Schema } from "./index.schema";

// SOURCE: https://github.com/alexasomba/better-auth-paystack/blob/main/src/schema.ts
// Define Subscription table schema
export const SubscriptionTable = pgTable("subscription", {
  ...Schema.id(),

  plan: text().notNull(),
  status: text().notNull().default("incomplete"),

  seats: integer(),
  groupId: varchar({ length: 255 }),

  referenceId: varchar({ length: 255 })
    .references(() => OrganizationTable.id, { onDelete: "cascade" })
    .notNull(),

  paystackSubscriptionCode: varchar({ length: 255 }),
  paystackTransactionReference: varchar({ length: 255 }),
  paystackCustomerCode: varchar({ length: 255 }).references(
    () => UserTable.paystackCustomerCode,
    { onDelete: "cascade" },
  ),

  trialStart: timestamp({ mode: "date" }),
  trialEnd: timestamp({ mode: "date" }),
  periodStart: timestamp({ mode: "date" }),
  periodEnd: timestamp({ mode: "date" }),
  cancelAtPeriodEnd: boolean().notNull(),

  ...Schema.timestamps,
});

// Export type for use in application
export type Subscription = typeof SubscriptionTable.$inferSelect;
export type NewSubscription = typeof SubscriptionTable.$inferInsert;
