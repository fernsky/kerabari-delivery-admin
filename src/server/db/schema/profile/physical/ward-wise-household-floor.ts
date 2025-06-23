import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define floor type enum
export const floorTypeEnum = pgEnum("floor_type", [
  "CONCRETE",
  "MUD",
  "WOOD",
  "BRICK",
  "TILE",
  "OTHER",
]);

export const wardWiseHouseholdFloor = pgTable("ward_wise_household_floor", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Type of house floor
  floorType: floorTypeEnum("floor_type").notNull(),

  // Number of households with this floor type
  households: integer("households").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseHouseholdFloor = typeof wardWiseHouseholdFloor.$inferSelect;
export type NewWardWiseHouseholdFloor =
  typeof wardWiseHouseholdFloor.$inferInsert;
