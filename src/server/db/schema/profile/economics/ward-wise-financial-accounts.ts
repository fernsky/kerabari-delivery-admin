import { pgTable } from "../../basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define financial account type enum
export const financialAccountTypeEnum = pgEnum(
  "financial_account_type_enum", 
  [
    "BANK",
    "FINANCE",
    "MICRO_FINANCE",
    "COOPERATIVE",
    "NONE",
  ]
);

export const wardWiseFinancialAccounts = pgTable(
  "ward_wise_financial_accounts",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Type of financial account
    financialAccountType: financialAccountTypeEnum(
      "financial_account_type"
    ).notNull(),

    // Number of households with this account type
    households: integer("households").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  }
);

export type WardWiseFinancialAccounts = 
  typeof wardWiseFinancialAccounts.$inferSelect;
export type NewWardWiseFinancialAccounts = 
  typeof wardWiseFinancialAccounts.$inferInsert;
