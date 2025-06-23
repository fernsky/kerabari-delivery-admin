import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define toilet type enum
export const toiletTypeEnum = pgEnum("toilet_type", [
  "FLUSH_WITH_SEPTIC_TANK",
  "NORMAL",
  "PUBLIC_EILANI",
  "NO_TOILET",
  "OTHER",
]);

export const wardWiseToiletType = pgTable("ward_wise_toilet_type", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Type of toilet
  toiletType: toiletTypeEnum("toilet_type").notNull(),

  // Number of households using this toilet type
  households: integer("households").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseToiletType = typeof wardWiseToiletType.$inferSelect;
export type NewWardWiseToiletType = typeof wardWiseToiletType.$inferInsert;
