import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, decimal, pgEnum, integer, boolean } from "drizzle-orm/pg-core";

// Define disaster risk variable type enum
export const disasterRiskVariableEnum = pgEnum("disaster_risk_variable_type", [
  // Pressure & Stability
  "SURFACE_PRESSURE", // sp
  "MEAN_SEA_LEVEL_PRESSURE", // msl
  "CONVECTIVE_AVAILABLE_POTENTIAL_ENERGY", // cape
  "CONVECTIVE_INHIBITION", // cin
  
  // Cloud & Rain Type Discrimination
  "PRECIPITATION_TYPE", // ptype
  "CONVECTIVE_RAIN_RATE", // crr
  "LARGE_SCALE_RAIN_RATE", // lsrr
  "INSTANTANEOUS_LARGE_SCALE_SURFACE_PRECIPITATION_FRACTION", // ilspf
]);

// Define measurement unit enum
export const disasterRiskUnitEnum = pgEnum("disaster_risk_unit_type", [
  "PA", // Pascal for pressure
  "J_PER_KG", // J/kg for CAPE/CIN
  "MM_PER_HOUR", // mm/hour for rain rates
  "UNITLESS", // unitless for fractions
]);

// Define precipitation type enum
export const precipitationTypeEnum = pgEnum("precipitation_type", [
  "NONE",
  "RAIN",
  "SNOW",
  "FREEZING_RAIN",
  "SLEET",
  "MIXED",
]);

// Define risk level enum
export const riskLevelEnum = pgEnum("risk_level", [
  "LOW",
  "MODERATE",
  "HIGH",
  "EXTREME",
]);

export const disasterRisk = pgTable(
  "disaster_risk",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Date and time of measurement
    measurementDate: timestamp("measurement_date").notNull(),

    // Disaster risk variable type
    variableType: disasterRiskVariableEnum("variable_type").notNull(),

    // Measurement value
    value: decimal("value", {
      precision: 12,
      scale: 4,
    }).notNull(),

    // Unit of measurement
    unit: disasterRiskUnitEnum("unit").notNull(),

    // Optional ward number for ward-specific data
    wardNumber: integer("ward_number"),

    // Optional location coordinates (if available)
    latitude: decimal("latitude", { precision: 8, scale: 6 }),
    longitude: decimal("longitude", { precision: 9, scale: 6 }),

    // Data source or station information
    dataSource: varchar("data_source", { length: 255 }),
    stationId: varchar("station_id", { length: 100 }),

    // Precipitation type (for precipitation_type variable)
    precipitationType: precipitationTypeEnum("precipitation_type"),

    // Risk assessment
    riskLevel: riskLevelEnum("risk_level"),
    riskDescription: varchar("risk_description", { length: 500 }),

    // Early warning indicators
    warningIssued: boolean("warning_issued").default(false),
    warningType: varchar("warning_type", { length: 100 }), // e.g., "FLOOD", "LANDSLIDE", "HEATWAVE"

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type DisasterRisk = typeof disasterRisk.$inferSelect;
export type NewDisasterRisk = typeof disasterRisk.$inferInsert; 