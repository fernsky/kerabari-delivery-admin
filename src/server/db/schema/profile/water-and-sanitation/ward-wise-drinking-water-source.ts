import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define drinking water source type enum
export const drinkingWaterSourceTypeEnum = pgEnum(
  "drinking_water_source_type",
  [
    "TAP_INSIDE_HOUSE",
    "TAP_OUTSIDE_HOUSE",
    "TUBEWELL",
    "COVERED_WELL",
    "OPEN_WELL",
    "AQUIFIER_MOOL",
    "RIVER",
    "JAR",
    "OTHER",
  ],
);

export const wardWiseDrinkingWaterSource = pgTable(
  "ward_wise_drinking_water_source",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Source of drinking water
    drinkingWaterSource: drinkingWaterSourceTypeEnum(
      "drinking_water_source",
    ).notNull(),

    // Number of households using this water source
    households: integer("households").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseDrinkingWaterSource =
  typeof wardWiseDrinkingWaterSource.$inferSelect;
export type NewWardWiseDrinkingWaterSource =
  typeof wardWiseDrinkingWaterSource.$inferInsert;
