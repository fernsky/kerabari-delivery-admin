import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define map passed status type enum
export const mapPassedStatusTypeEnum = pgEnum("map_passed_status_type", [
  "PASSED",
  "ARCHIVED",
  "NEITHER_PASSED_NOR_ARCHIVED",
]);

export const wardWiseHouseMapPassed = pgTable("ward_wise_house_map_passed", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Building approval status
  mapPassedStatus: mapPassedStatusTypeEnum("map_passed_status").notNull(),

  // Number of households with this approval status
  households: integer("households").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseHouseMapPassed = typeof wardWiseHouseMapPassed.$inferSelect;
export type NewWardWiseHouseMapPassed =
  typeof wardWiseHouseMapPassed.$inferInsert;
