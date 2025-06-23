import { pgTable } from "../../basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define economically active age group enum
export const economicallyActiveAgeGroupEnum = pgEnum(
  "economically_active_age_group",
  ["AGE_0_TO_14", "AGE_15_TO_59", "AGE_60_PLUS"],
);

// Reuse the gender enum already defined in the married age schema
import { genderEnum } from "../demographics/common";

export const wardAgeGenderWiseEconomicallyActivePopulation = pgTable(
  "ward_age_gender_wise_economically_active_population",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Reference to the ward entity through the demographic summary
    wardNumber: integer("ward_number").notNull(),

    // Age group category of economically active population
    ageGroup: economicallyActiveAgeGroupEnum("age_group").notNull(),

    // Gender category
    gender: genderEnum("gender").notNull(),

    // Number of people in this demographic category
    population: integer("population").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardAgeGenderWiseEconomicallyActivePopulation =
  typeof wardAgeGenderWiseEconomicallyActivePopulation.$inferSelect;
export type NewWardAgeGenderWiseEconomicallyActivePopulation =
  typeof wardAgeGenderWiseEconomicallyActivePopulation.$inferInsert;
