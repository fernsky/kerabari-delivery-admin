import { pgTable } from "../../basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";

// Reuse the economically active age group enum already defined
import { economicallyActiveAgeGroupEnum } from "../economics/ward-age-gender-wise-economically-active-population";

export const wardAgeWiseEconomicallyActivePopulation = pgTable(
  "ward_age_gender_wise_economically_active_population",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Reference to the ward entity through the demographic summary
    wardNumber: integer("ward_number").notNull(),

    // Age group category of economically active population
    ageGroup: economicallyActiveAgeGroupEnum("age_group").notNull(),

    // Number of people in this demographic category
    population: integer("population").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardAgeWiseEconomicallyActivePopulation = 
  typeof wardAgeWiseEconomicallyActivePopulation.$inferSelect;
export type NewWardAgeWiseEconomicallyActivePopulation = 
  typeof wardAgeWiseEconomicallyActivePopulation.$inferInsert;
