import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define water purification type enum
export const waterPurificationTypeEnum = pgEnum("water_purification_type", [
  "BOILING",
  "FILTERING",
  "CHEMICAL_PIYUSH",
  "NO_ANY_FILTERING",
  "OTHER",
]);

export const wardWiseWaterPurification = pgTable(
  "ward_wise_water_purification",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Method of water purification
    waterPurification:
      waterPurificationTypeEnum("water_purification_method").notNull(),

    // Number of households using this purification method
    households: integer("households").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseWaterPurification =
  typeof wardWiseWaterPurification.$inferSelect;
export type NewWardWiseWaterPurification =
  typeof wardWiseWaterPurification.$inferInsert;
