import {
  pgTable,
  varchar,
  uuid,
  integer,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enum for loan use types
export const loanUseTypeEnum = pgEnum("loan_use_type", [
  "AGRICULTURE",
  "BUSINESS",
  "HOUSEHOLD_EXPENSES",
  "FOREIGN_EMPLOYMENT",
  "EDUCATION",
  "HEALTH_TREATMENT",
  "HOME_CONSTRUCTION",
  "VEHICLE_PURCHASE",
  "CEREMONY",
  "OTHER",
]);

export const wardWiseHouseholdsLoanUse = pgTable(
  "ward_wise_households_loan_use",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    wardNumber: integer("ward_number").notNull(),
    loanUse: text("loan_use").notNull(), // Using the enum values
    households: integer("households").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
);

export type WardWiseHouseholdsLoanUse =
  typeof wardWiseHouseholdsLoanUse.$inferSelect;
export type NewWardWiseHouseholdsLoanUse =
  typeof wardWiseHouseholdsLoanUse.$inferInsert;
