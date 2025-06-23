import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define roof type enum
export const roofTypeEnum = pgEnum("roof_type", [
  "CEMENT",
  "TIN",
  "TILE",
  "STRAW",
  "WOOD",
  "STONE",
  "OTHER",
]);

export const wardWiseHouseholdRoof = pgTable("ward_wise_household_roof", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Type of house roof
  roofType: roofTypeEnum("roof_type").notNull(),

  // Number of households with this roof type
  households: integer("households").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseHouseholdRoof = typeof wardWiseHouseholdRoof.$inferSelect;
export type NewWardWiseHouseholdRoof =
  typeof wardWiseHouseholdRoof.$inferInsert;
