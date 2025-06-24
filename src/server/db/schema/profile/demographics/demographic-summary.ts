import { pgTable } from "../../../schema/basic";
import { integer, decimal, timestamp, varchar, text } from "drizzle-orm/pg-core";

export const demographicSummary = pgTable("demographic_summary", {
  // Using "singleton" as the id since there will only be one record
  id: varchar("id", { length: 36 }).primaryKey().default("singleton"),

  // Population statistics
  totalPopulation: integer("total_population"),
  populationMale: integer("population_male"),
  populationFemale: integer("population_female"),
  populationOther: integer("population_other"),

  // Absentee population
  populationAbsenteeTotal: integer("population_absentee_total"),
  populationMaleAbsentee: integer("population_male_absentee"),
  populationFemaleAbsentee: integer("population_female_absentee"),
  populationOtherAbsentee: integer("population_other_absentee"),

  // Demographic ratios and averages
  sexRatio: decimal("sex_ratio"), // Ratio per 100 females
  totalHouseholds: integer("total_households"),
  averageHouseholdSize: decimal("average_household_size"),
  populationDensity: decimal("population_density"), // People per sq km

  // New fields
  totalWards: integer("total_wards"),
  totalLandArea: decimal("total_land_area"),

  // Age groups
  population0To14: integer("population_0_to_14"),
  population15To59: integer("population_15_to_59"),
  population60AndAbove: integer("population_60_and_above"),

  // Growth and literacy rates (percentages)
  growthRate: decimal("growth_rate"),
  literacyRateAbove15: decimal("literacy_rate_above_15"),
  literacyRate15To24: decimal("literacy_rate_15_to_24"),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type DemographicSummary = typeof demographicSummary.$inferSelect;
export type NewDemographicSummary = typeof demographicSummary.$inferInsert;
