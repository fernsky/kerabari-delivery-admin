import { pgTable } from "../../basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define age group enum
export const ageGroupEnum = pgEnum("age_group", [
  "AGE_BELOW_15",
  "AGE_15_19",
  "AGE_20_24",
  "AGE_25_29",
  "AGE_30_34",
  "AGE_35_39",
  "AGE_40_44",
  "AGE_45_49",
  "AGE_50_54",
  "AGE_55_59",
  "AGE_60_64",
  "AGE_65_69",
  "AGE_70_74",
  "AGE_75_AND_ABOVE",
]);

// Define marital status enum
export const maritalStatusEnum = pgEnum("marital_status", [
  "SINGLE",
  "MARRIED",
  "DIVORCED",
  "WIDOWED",
  "SEPARATED",
  "NOT_STATED",
]);

export const wardWiseMaritalStatus = pgTable("ward_age_wise_marital_status", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Reference to the ward entity through the demographic summary
  wardNumber: integer("ward_number").notNull(),

  // Age group
  ageGroup: ageGroupEnum("age_group").notNull(),

  // Marital status
  maritalStatus: maritalStatusEnum("marital_status").notNull(),

  // Population with this age group and marital status in the ward
  population: integer("population").notNull(),

  // Gender breakdown (optional)
  malePopulation: integer("male_population"),
  femalePopulation: integer("female_population"),
  otherPopulation: integer("other_population"),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseMaritalStatus = typeof wardWiseMaritalStatus.$inferSelect;
export type NewWardWiseMaritalStatus =
  typeof wardWiseMaritalStatus.$inferInsert;
