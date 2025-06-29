import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, decimal, pgEnum, integer } from "drizzle-orm/pg-core";

// Define agriculture variable type enum
export const agricultureVariableEnum = pgEnum("agriculture_variable_type", [
  // Soil Moisture & Evaporation
  "VOLUMETRIC_SOIL_WATER_LAYER_1", // swvl1
  "VOLUMETRIC_SOIL_WATER_LAYER_2", // swvl2
  "VOLUMETRIC_SOIL_WATER_LAYER_3", // swvl3
  "VOLUMETRIC_SOIL_WATER_LAYER_4", // swvl4
  "EVAPORATION", // e
  "POTENTIAL_EVAPORATION", // pev
  "SURFACE_LATENT_HEAT_FLUX", // slhf
  "MEAN_EVAPORATION_RATE", // avg_ie
  "MEAN_RUNOFF_RATE", // avg_rorwe
  
  // Vegetation Health
  "LEAF_AREA_INDEX_HIGH_VEGETATION", // lai_hv
  "LEAF_AREA_INDEX_LOW_VEGETATION", // lai_lv
  "HIGH_VEGETATION_COVER", // cvh
  "LOW_VEGETATION_COVER", // cvl
  "SOIL_TYPE", // slt
]);

// Define measurement unit enum
export const agricultureUnitEnum = pgEnum("agriculture_unit_type", [
  "M3_PER_M3", // m³/m³ for soil moisture
  "MM", // millimeters for evaporation
  "W_PER_M2", // W/m² for heat flux
  "MM_PER_HOUR", // mm/hour for rates
  "M2_PER_M2", // m²/m² for leaf area index
  "PERCENTAGE", // percentage for cover
  "UNITLESS", // unitless for soil type
]);

export const agricultureIrrigation = pgTable(
  "agriculture_irrigation",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Date and time of measurement
    measurementDate: timestamp("measurement_date").notNull(),

    // Agriculture variable type
    variableType: agricultureVariableEnum("variable_type").notNull(),

    // Measurement value
    value: decimal("value", {
      precision: 10,
      scale: 4,
    }).notNull(),

    // Unit of measurement
    unit: agricultureUnitEnum("unit").notNull(),

    // Optional ward number for ward-specific data
    wardNumber: integer("ward_number"),

    // Optional location coordinates (if available)
    latitude: decimal("latitude", { precision: 8, scale: 6 }),
    longitude: decimal("longitude", { precision: 9, scale: 6 }),

    // Data source or station information
    dataSource: varchar("data_source", { length: 255 }),
    stationId: varchar("station_id", { length: 100 }),

    // Additional context for soil type
    soilTypeDescription: varchar("soil_type_description", { length: 500 }),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type AgricultureIrrigation = typeof agricultureIrrigation.$inferSelect;
export type NewAgricultureIrrigation = typeof agricultureIrrigation.$inferInsert; 