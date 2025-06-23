import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define school dropout cause type enum
export const schoolDropoutCauseTypeEnum = pgEnum("school_dropout_cause_type", [
  "LIMITED_SPACE",
  "EXPENSIVE",
  "FAR",
  "HOUSE_HELP",
  "UNWILLING_PARENTS",
  "WANTED_STUDY_COMPLETED",
  "MARRIAGE",
  "EMPLOYMENT",
  "OTHER",
]);

export const wardWiseSchoolDropout = pgTable("ward_wise_school_dropout", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Dropout cause
  cause: schoolDropoutCauseTypeEnum("cause").notNull(),

  // Number of people who dropped out for this reason in the ward
  population: integer("population").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseSchoolDropout = typeof wardWiseSchoolDropout.$inferSelect;
export type NewWardWiseSchoolDropout =
  typeof wardWiseSchoolDropout.$inferInsert;
