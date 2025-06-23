import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define gender type enum
export const genderTypeEnum = pgEnum("gender_type", [
  "MALE",
  "FEMALE",
  "OTHER",
]);

// Define first marriage age group enum
export const firstMarriageAgeGroupEnum = pgEnum("first_marriage_age_group", [
  "AGE_0_14",
  "AGE_15_19",
  "AGE_20_24",
  "AGE_25_29",
  "AGE_30_34",
  "AGE_35_39",
  "AGE_40_44",
  "AGE_45_49",
  "AGE_50_54",
  "AGE_55_59",
  "AGE_60_AND_ABOVE",
]);

export const wardAgeGenderWiseFirstMarriageAge = pgTable(
  "ward_age_gender_wise_first_marriage_age",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Age group at first marriage
    firstMarriageAgeGroup: firstMarriageAgeGroupEnum(
      "first_marriage_age_group",
    ).notNull(),

    // Gender of the population
    gender: genderTypeEnum("gender").notNull(),

    // Number of people in this category
    population: integer("population").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardAgeGenderWiseFirstMarriageAge =
  typeof wardAgeGenderWiseFirstMarriageAge.$inferSelect;
export type NewWardAgeGenderWiseFirstMarriageAge =
  typeof wardAgeGenderWiseFirstMarriageAge.$inferInsert;
