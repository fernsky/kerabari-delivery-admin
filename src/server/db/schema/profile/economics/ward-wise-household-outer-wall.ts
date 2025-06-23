import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define outer wall type enum
export const outerWallTypeEnum = pgEnum("outer_wall_type", [
  "CEMENT_JOINED",
  "UNBAKED_BRICK",
  "MUD_JOINED",
  "TIN",
  "BAMBOO",
  "WOOD",
  "PREFAB",
  "OTHER",
]);

export const wardWiseHouseholdOuterWall = pgTable(
  "ward_wise_household_outer_wall",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Type of house outer wall
    wallType: outerWallTypeEnum("wall_type").notNull(),

    // Number of households with this wall type
    households: integer("households").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseHouseholdOuterWall =
  typeof wardWiseHouseholdOuterWall.$inferSelect;
export type NewWardWiseHouseholdOuterWall =
  typeof wardWiseHouseholdOuterWall.$inferInsert;
