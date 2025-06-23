import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";
import { genderEnum } from "./common";

// Define married age group enum
export const marriedAgeGroupEnum = pgEnum("married_age_group", [
  "AGE_BELOW_15",
  "AGE_15_19",
  "AGE_20_24",
  "AGE_25_29",
  "AGE_30_34",
  "AGE_35_39",
  "AGE_40_AND_ABOVE",
]);

export const wardAgeGenderWiseMarriedAge = pgTable(
  "ward_age_gender_wise_married_age",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Reference to the ward entity through the demographic summary
    wardNumber: integer("ward_number").notNull(),

    // Age group category at which marriage occurred
    ageGroup: marriedAgeGroupEnum("age_group").notNull(),

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

export type WardAgeGenderWiseMarriedAge =
  typeof wardAgeGenderWiseMarriedAge.$inferSelect;
export type NewWardAgeGenderWiseMarriedAge =
  typeof wardAgeGenderWiseMarriedAge.$inferInsert;
