import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define cooking fuel type enum
export const cookingFuelTypeEnum = pgEnum("cooking_fuel_type", [
  "WOOD",
  "LP_GAS",
  "KEROSENE",
  "ELECTRICITY",
  "BIOGAS",
  "DUNGCAKE",
  "OTHER",
]);

export const wardWiseCookingFuel = pgTable("ward_wise_cooking_fuel", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Type of cooking fuel
  cookingFuel: cookingFuelTypeEnum("cooking_fuel").notNull(),

  // Number of households using this fuel type in the ward
  households: integer("households").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseCookingFuel = typeof wardWiseCookingFuel.$inferSelect;
export type NewWardWiseCookingFuel = typeof wardWiseCookingFuel.$inferInsert;
