import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, decimal, pgEnum, integer } from "drizzle-orm/pg-core";

// Define climate change variable type enum
export const climateChangeVariableEnum = pgEnum("climate_change_variable_type", [
  // Greenhouse Proxy & Heat Budget
  "MEAN_SURFACE_NET_LONG_WAVE_RADIATION_FLUX", // avg_snlwrf
  "MEAN_SURFACE_DOWNWARD_LONG_WAVE_RADIATION_FLUX", // avg_sdlwrf
  "MEAN_SURFACE_NET_SHORT_WAVE_RADIATION_FLUX", // avg_snswrf
  
  // Clouds & Albedo
  "TOTAL_CLOUD_COVER", // tcc
  "LOW_CLOUD_COVER", // lcc
  "HIGH_CLOUD_COVER", // hcc
  "ALBEDO_UV_DIFFUSE", // aluvd
  "ALBEDO_UV_PARALLEL", // aluvp
  "ALBEDO_NIR_DIFFUSE", // alnid
  "ALBEDO_NIR_PARALLEL", // alnip
  
  // Column-integrated Water & Energy
  "TOTAL_COLUMN_WATER_VAPOUR", // tcwv
  "VERTICAL_INTEGRAL_OF_TOTAL_ENERGY", // vitoe
  "TOTAL_COLUMN_OZONE", // tco3
]);

// Define measurement unit enum
export const climateChangeUnitEnum = pgEnum("climate_change_unit_type", [
  "W_PER_M2", // W/m² for radiation flux
  "PERCENTAGE", // percentage for cloud cover
  "UNITLESS", // unitless for albedo
  "KG_PER_M2", // kg/m² for column water vapour
  "J_PER_M2", // J/m² for energy
  "KG_PER_M2", // kg/m² for ozone
]);

export const climateChange = pgTable(
  "climate_change",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Date and time of measurement
    measurementDate: timestamp("measurement_date").notNull(),

    // Climate change variable type
    variableType: climateChangeVariableEnum("variable_type").notNull(),

    // Measurement value
    value: decimal("value", {
      precision: 12,
      scale: 4,
    }).notNull(),

    // Unit of measurement
    unit: climateChangeUnitEnum("unit").notNull(),

    // Optional ward number for ward-specific data
    wardNumber: integer("ward_number"),

    // Optional location coordinates (if available)
    latitude: decimal("latitude", { precision: 8, scale: 6 }),
    longitude: decimal("longitude", { precision: 9, scale: 6 }),

    // Data source or station information
    dataSource: varchar("data_source", { length: 255 }),
    stationId: varchar("station_id", { length: 100 }),

    // Climate change indicators
    trendDirection: varchar("trend_direction", { length: 20 }), // "INCREASING", "DECREASING", "STABLE"
    anomalyValue: decimal("anomaly_value", { precision: 10, scale: 4 }), // deviation from baseline
    baselinePeriod: varchar("baseline_period", { length: 50 }), // e.g., "1991-2020"

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type ClimateChange = typeof climateChange.$inferSelect;
export type NewClimateChange = typeof climateChange.$inferInsert; 