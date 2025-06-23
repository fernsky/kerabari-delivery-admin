import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define educational level type enum
export const educationalLevelEnum = pgEnum("educational_level", [
  "CHILD_DEVELOPMENT_CENTER",
  "NURSERY",
  "CLASS_1",
  "CLASS_2",
  "CLASS_3",
  "CLASS_4",
  "CLASS_5",
  "CLASS_6",
  "CLASS_7",
  "CLASS_8",
  "CLASS_9",
  "CLASS_10",
  "SLC_LEVEL",
  "CLASS_12_LEVEL",
  "BACHELOR_LEVEL",
  "MASTERS_LEVEL",
  "PHD_LEVEL",
  "OTHER",
  "INFORMAL_EDUCATION",
  "EDUCATED",
  "UNKNOWN",
]);

export const wardWiseAbsenteeEducationalLevel = pgTable(
  "ward_wise_absentee_educational_level",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Reference to the ward entity through the demographic summary
    wardNumber: integer("ward_number").notNull(),

    // Educational level category
    educationalLevel: educationalLevelEnum("educational_level").notNull(),

    // Number of absentee people with this educational level in the ward
    population: integer("population").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseAbsenteeEducationalLevel =
  typeof wardWiseAbsenteeEducationalLevel.$inferSelect;
export type NewWardWiseAbsenteeEducationalLevel =
  typeof wardWiseAbsenteeEducationalLevel.$inferInsert;
