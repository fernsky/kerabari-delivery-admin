import { pgTable } from "../../../schema/basic";
import {
  integer,
  decimal,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";

export const wardWiseDemographicSummary = pgTable("ward_wise_demographic_summary", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward identification
  wardNumber: integer("ward_number").notNull(),
  wardName: text("ward_name"), // Using text for proper UTF-8 handling
 

  // Population statistics
  totalPopulation: integer("total_population"),
  populationMale: integer("population_male"),
  populationFemale: integer("population_female"),
  populationOther: integer("population_other"),

  // Household data
  totalHouseholds: integer("total_households"),
  averageHouseholdSize: decimal("average_household_size"),

  // Demographic ratios
  sexRatio: decimal("sex_ratio"), // Ratio per 100 females

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseDemographicSummary = typeof wardWiseDemographicSummary.$inferSelect;
export type NewWardWiseDemographicSummary = typeof wardWiseDemographicSummary.$inferInsert;
