import {
  pgTable,
  pgEnum,
  uuid,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Define enum for remittance expense types
export const remittanceExpenseTypeEnum = pgEnum("remittance_expense_type", [
  "EDUCATION",
  "HEALTH",
  "HOUSEHOLD_USE",
  "FESTIVALS",
  "LOAN_PAYMENT",
  "LOANED_OTHERS",
  "SAVING",
  "HOUSE_CONSTRUCTION",
  "LAND_OWNERSHIP",
  "JEWELRY_PURCHASE",
  "GOODS_PURCHASE",
  "BUSINESS_INVESTMENT",
  "OTHER",
  "UNKNOWN",
]);

export const wardWiseRemittanceExpenses = pgTable(
  "ward_wise_remittance_expenses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    wardNumber: integer("ward_number").notNull(),
    remittanceExpense:
      remittanceExpenseTypeEnum("remittance_expense").notNull(),
    households: integer("households").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
);

export type WardWiseRemittanceExpenses =
  typeof wardWiseRemittanceExpenses.$inferSelect;
export type NewWardWiseRemittanceExpenses =
  typeof wardWiseRemittanceExpenses.$inferInsert;
