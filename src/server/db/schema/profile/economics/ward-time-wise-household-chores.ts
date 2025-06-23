import {
  pgTable,
  varchar,
  uuid,
  integer,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enum for time spent categories
export const timeSpentEnum = pgEnum("time_spent", [
  "LESS_THAN_1_HOUR",
  "HOURS_1_TO_3",
  "HOURS_4_TO_6",
  "HOURS_7_TO_9",
  "HOURS_10_TO_12",
  "MORE_THAN_12_HOURS",
]);

export const wardTimeWiseHouseholdChores = pgTable(
  "ward_time_wise_household_chores",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    wardNumber: integer("ward_number").notNull(),
    timeSpent: timeSpentEnum("time_spent").notNull(), // Using the enum type instead of text
    population: integer("population").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
);

export type WardTimeWiseHouseholdChores =
  typeof wardTimeWiseHouseholdChores.$inferSelect;
export type NewWardTimeWiseHouseholdChores =
  typeof wardTimeWiseHouseholdChores.$inferInsert;
