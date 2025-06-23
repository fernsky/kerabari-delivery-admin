import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define land ownership type enum
export const landOwnershipTypeEnum = pgEnum("land_ownership_type", [
  "PRIVATE",
  "GUTHI",
  "PUBLIC_EILANI",
  "VILLAGE_BLOCK",
  "OTHER"
]);

export const wardWiseLandOwnership = pgTable("ward_wise_land_ownership", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Land ownership type
  landOwnershipType: landOwnershipTypeEnum("land_ownership_type").notNull(),

  // Number of households
  households: integer("households").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseLandOwnership = typeof wardWiseLandOwnership.$inferSelect;
export type NewWardWiseLandOwnership = typeof wardWiseLandOwnership.$inferInsert;
