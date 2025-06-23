import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define solid waste management type enum
export const solidWasteManagementTypeEnum = pgEnum(
  "solid_waste_management_type",
  [
    "HOME_COLLECTION",
    "WASTE_COLLECTING_PLACE",
    "BURNING",
    "DIGGING",
    "RIVER",
    "ROAD_OR_PUBLIC_PLACE",
    "COMPOST_MANURE",
    "OTHER",
  ],
);

export const wardWiseSolidWasteManagement = pgTable(
  "ward_wise_solid_waste_management",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Method of solid waste management
    solidWasteManagement: solidWasteManagementTypeEnum(
      "solid_waste_management",
    ).notNull(),

    // Number of households using this waste management method
    households: integer("households").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseSolidWasteManagement =
  typeof wardWiseSolidWasteManagement.$inferSelect;
export type NewWardWiseSolidWasteManagement =
  typeof wardWiseSolidWasteManagement.$inferInsert;
