import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define base type enum
export const householdBaseTypeEnum = pgEnum("household_base_type", [
  "CONCRETE_PILLAR",
  "CEMENT_JOINED",
  "MUD_JOINED",
  "WOOD_POLE",
  "OTHER",
]);

export const wardWiseHouseholdBase = pgTable("ward_wise_household_base", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Type of house foundation
  baseType: householdBaseTypeEnum("base_type").notNull(),

  // Number of households with this foundation type
  households: integer("households").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseHouseholdBase = typeof wardWiseHouseholdBase.$inferSelect;
export type NewWardWiseHouseholdBase =
  typeof wardWiseHouseholdBase.$inferInsert;
