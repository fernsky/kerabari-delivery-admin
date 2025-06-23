import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define educational level type enum
export const educationalLevelTypeEnum = pgEnum("educational_level_type", [
  "CHILD_DEVELOPMENT_CENTER",
  "NURSERY",
  "GRADE_1",
  "GRADE_2",
  "GRADE_3",
  "GRADE_4",
  "GRADE_5",
  "GRADE_6",
  "GRADE_7",
  "GRADE_8",
  "GRADE_9",
  "GRADE_10",
  "SLC_LEVEL",
  "CLASS_12_LEVEL",
  "BACHELOR_LEVEL",
  "MASTERS_LEVEL",
  "PHD_LEVEL",
  "INFORMAL_EDUCATION",
  "OTHER",
  "EDUCATED",
  "UNKNOWN",
]);

export const wardWiseEducationalLevel = pgTable("ward_wise_educational_level", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Education level
  educationalLevelType: educationalLevelTypeEnum(
    "educational_level_type",
  ).notNull(),

  // Number of people with this education level in the ward
  population: integer("population").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseEducationalLevel =
  typeof wardWiseEducationalLevel.$inferSelect;
export type NewWardWiseEducationalLevel =
  typeof wardWiseEducationalLevel.$inferInsert;
