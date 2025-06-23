import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define first child birth age group enum
export const firstChildBirthAgeGroupEnum = pgEnum(
  "first_child_birth_age_group",
  [
    "AGE_15_19", // Ages 15 to 19 years
    "AGE_20_24", // Ages 20 to 24 years
    "AGE_25_29", // Ages 25 to 29 years
    "AGE_30_34", // Ages 30 to 34 years
    "AGE_35_39", // Ages 35 to 39 years
    "AGE_40_44", // Ages 40 to 44 years
    "AGE_45_49", // Ages 45 to 49 years
  ],
);

export const wardAgeWiseFirstChildBirthAge = pgTable(
  "ward_age_wise_first_child_birth_age",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Age group at first childbirth
    firstChildBirthAgeGroup: firstChildBirthAgeGroupEnum(
      "first_child_birth_age_group",
    ).notNull(),

    // Number of women in this age group
    population: integer("population").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

// Define the composite unique constraint on ward and age group
// This ensures we don't have duplicate entries for the same ward and age group
export const wardAgeWiseFirstChildBirthAgeConstraints = {
  uniqWardAgeGroup: {
    name: "ward_age_wise_first_child_birth_age_ward_age_group_unique",
    columns: [
      wardAgeWiseFirstChildBirthAge.wardNumber,
      wardAgeWiseFirstChildBirthAge.firstChildBirthAgeGroup,
    ],
  },
};

export type WardAgeWiseFirstChildBirthAge =
  typeof wardAgeWiseFirstChildBirthAge.$inferSelect;
export type NewWardAgeWiseFirstChildBirthAge =
  typeof wardAgeWiseFirstChildBirthAge.$inferInsert;
