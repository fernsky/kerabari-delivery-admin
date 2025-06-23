import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define absentee age group enum
export const absenteeAgeGroupEnum = pgEnum("absentee_age_group", [
  "AGE_0_4",
  "AGE_5_9",
  "AGE_10_14",
  "AGE_15_19",
  "AGE_20_24",
  "AGE_25_29",
  "AGE_30_34",
  "AGE_35_39",
  "AGE_40_44",
  "AGE_45_49",
  "AGE_50_AND_ABOVE",
]);

import { genderEnum } from "./common";

export const wardAgeGenderWiseAbsentee = pgTable(
  "ward_age_gender_wise_absentee",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Reference to the ward entity through the demographic summary
    wardNumber: integer("ward_number").notNull(),

    // Age group category of absentee
    ageGroup: absenteeAgeGroupEnum("age_group").notNull(),

    // Gender category
    gender: genderEnum("gender").notNull(),

    // Number of absentee people in this demographic category
    population: integer("population").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardAgeGenderWiseAbsentee =
  typeof wardAgeGenderWiseAbsentee.$inferSelect;
export type NewWardAgeGenderWiseAbsentee =
  typeof wardAgeGenderWiseAbsentee.$inferInsert;
