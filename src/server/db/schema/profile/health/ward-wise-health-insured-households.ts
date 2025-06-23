import { pgTable } from "../../basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const wardWiseHealthInsuredHouseholds = pgTable(
  "ward_wise_health_insured_households",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull().unique(),

    // Number of households with health insurance
    insuredHouseholds: integer("insured_households").notNull(),
    
    // Number of households without health insurance
    nonInsuredHouseholds: integer("non_insured_households").notNull().default(0),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseHealthInsuredHouseholds =
  typeof wardWiseHealthInsuredHouseholds.$inferSelect;
export type NewWardWiseHealthInsuredHouseholds =
  typeof wardWiseHealthInsuredHouseholds.$inferInsert;
