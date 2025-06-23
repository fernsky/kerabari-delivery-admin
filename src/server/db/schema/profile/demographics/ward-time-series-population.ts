import { pgTable } from "../../../schema/basic";
import {
  integer,
  decimal,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";

export const wardTimeSeriesPopulation = pgTable("ward_time_series_population", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward identification - Use text() with proper encoding
  wardNumber: integer("ward_number").notNull(),
  wardName: text("ward_name"), // This field needs proper UTF-8 handling

  // Census year (e.g., 2068, 2078)
  year: integer("year").notNull(),

  // Population statistics
  totalPopulation: integer("total_population"),
  malePopulation: integer("male_population"),
  femalePopulation: integer("female_population"),
  otherPopulation: integer("other_population"),

  // Household data
  totalHouseholds: integer("total_households"),
  averageHouseholdSize: decimal("average_household_size"),

  // Age demographics
  population0To14: integer("population_0_to_14"),
  population15To59: integer("population_15_to_59"),
  population60AndAbove: integer("population_60_and_above"),

  // Literacy data
  literacyRate: decimal("literacy_rate"),
  maleLiteracyRate: decimal("male_literacy_rate"),
  femaleLiteracyRate: decimal("female_literacy_rate"),

  // Growth rate
  growthRate: decimal("growth_rate"),

  // Geographic data
  areaSqKm: decimal("area_sq_km"),
  populationDensity: decimal("population_density"),

  // Sex ratio
  sexRatio: decimal("sex_ratio"),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardTimeSeriesPopulation =
  typeof wardTimeSeriesPopulation.$inferSelect;
export type NewWardTimeSeriesPopulation =
  typeof wardTimeSeriesPopulation.$inferInsert;
