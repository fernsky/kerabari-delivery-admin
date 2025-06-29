import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, decimal, pgEnum, integer } from "drizzle-orm/pg-core";

// Define energy variable type enum
export const energyVariableEnum = pgEnum("energy_variable_type", [
  // Solar Radiation (Solar Energy)
  "SURFACE_SOLAR_RADIATION_DOWNWARDS", // ssrd
  "TOA_INCIDENT_SOLAR_RADIATION", // tisr
  "SURFACE_NET_SOLAR_RADIATION", // ssr
  "CLEAR_SKY_DIRECT_SOLAR_RADIATION_AT_SURFACE", // cdir
  
  // Wind Energy
  "WIND_U_COMPONENT_100M", // 100u
  "WIND_V_COMPONENT_100M", // 100v
  "FRICTION_VELOCITY", // zust
  
  // Hydropower
  "TOTAL_PRECIPITATION", // tp (reused from weather)
  "RUNOFF", // ro (reused from weather)
  "SURFACE_RUNOFF", // sro (reused from weather)
  "SUB_SURFACE_RUNOFF", // ssro (reused from weather)
  "SNOWMELT", // smlt
]);

// Define measurement unit enum
export const energyUnitEnum = pgEnum("energy_unit_type", [
  "J_PER_M2", // J/m² for solar radiation
  "W_PER_M2", // W/m² for power flux
  "M_PER_S", // m/s for wind velocity
  "MM", // millimeters for precipitation
  "MM_PER_HOUR", // mm/hour for rates
  "KG_PER_M2", // kg/m² for other measurements
]);

export const energy = pgTable(
  "energy",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Date and time of measurement
    measurementDate: timestamp("measurement_date").notNull(),

    // Energy variable type
    variableType: energyVariableEnum("variable_type").notNull(),

    // Measurement value
    value: decimal("value", {
      precision: 12,
      scale: 4,
    }).notNull(),

    // Unit of measurement
    unit: energyUnitEnum("unit").notNull(),

    // Optional ward number for ward-specific data
    wardNumber: integer("ward_number"),

    // Optional location coordinates (if available)
    latitude: decimal("latitude", { precision: 8, scale: 6 }),
    longitude: decimal("longitude", { precision: 9, scale: 6 }),

    // Data source or station information
    dataSource: varchar("data_source", { length: 255 }),
    stationId: varchar("station_id", { length: 100 }),

    // Energy potential assessment
    energyPotential: varchar("energy_potential", { length: 50 }), // e.g., "HIGH", "MEDIUM", "LOW"
    capacityFactor: decimal("capacity_factor", { precision: 5, scale: 4 }), // 0-1 range

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type Energy = typeof energy.$inferSelect;
export type NewEnergy = typeof energy.$inferInsert; 