import {
  pgTable,
  varchar,
  uuid,
  integer,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enum for income source types
export const incomeSourceTypeEnum = pgEnum("income_source_type", [
  "JOB",
  "AGRICULTURE",
  "BUSINESS",
  "INDUSTRY",
  "FOREIGN_EMPLOYMENT",
  "LABOUR",
  "OTHER",
]);

export const wardWiseHouseholdIncomeSource = pgTable(
  "ward_wise_household_income_source",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    wardNumber: integer("ward_number").notNull(),
    incomeSource: text("income_source").notNull(), // Using the enum values
    households: integer("households").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
);

export type WardWiseHouseholdIncomeSource =
  typeof wardWiseHouseholdIncomeSource.$inferSelect;
export type NewWardWiseHouseholdIncomeSource =
  typeof wardWiseHouseholdIncomeSource.$inferInsert;
