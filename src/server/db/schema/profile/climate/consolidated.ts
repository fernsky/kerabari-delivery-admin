import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, decimal, pgEnum, integer, text } from "drizzle-orm/pg-core";

// Define consolidated climate variable type enum (combines all domains)
export const consolidatedClimateVariableEnum = pgEnum("consolidated_climate_variable_type", [
  // Weather Extremes
  "TOTAL_PRECIPITATION", // tp
  "CONVECTIVE_PRECIPITATION", // cp
  "LARGE_SCALE_PRECIPITATION", // lsp
  "MEAN_TOTAL_PRECIPITATION_RATE", // avg_tprate
  "RUNOFF", // ro
  "SURFACE_RUNOFF", // sro
  "SUB_SURFACE_RUNOFF", // ssro
  "TEMPERATURE_2M", // 2t
  "MAXIMUM_TEMPERATURE_2M", // mx2t
  "MINIMUM_TEMPERATURE_2M", // mn2t
  "SKIN_TEMPERATURE", // skt
  "WIND_U_COMPONENT_10M", // 10u
  "WIND_V_COMPONENT_10M", // 10v
  "WIND_GUST_10M", // gust
  "INSTANTANEOUS_WIND_GUST_10M", // i10fg
  "BOUNDARY_LAYER_HEIGHT", // blh
  
  // Agriculture & Irrigation
  "VOLUMETRIC_SOIL_WATER_LAYER_1", // swvl1
  "VOLUMETRIC_SOIL_WATER_LAYER_2", // swvl2
  "VOLUMETRIC_SOIL_WATER_LAYER_3", // swvl3
  "VOLUMETRIC_SOIL_WATER_LAYER_4", // swvl4
  "EVAPORATION", // e
  "POTENTIAL_EVAPORATION", // pev
  "SURFACE_LATENT_HEAT_FLUX", // slhf
  "MEAN_EVAPORATION_RATE", // avg_ie
  "MEAN_RUNOFF_RATE", // avg_rorwe
  "LEAF_AREA_INDEX_HIGH_VEGETATION", // lai_hv
  "LEAF_AREA_INDEX_LOW_VEGETATION", // lai_lv
  "HIGH_VEGETATION_COVER", // cvh
  "LOW_VEGETATION_COVER", // cvl
  "SOIL_TYPE", // slt
  
  // Energy
  "SURFACE_SOLAR_RADIATION_DOWNWARDS", // ssrd
  "TOA_INCIDENT_SOLAR_RADIATION", // tisr
  "SURFACE_NET_SOLAR_RADIATION", // ssr
  "CLEAR_SKY_DIRECT_SOLAR_RADIATION_AT_SURFACE", // cdir
  "WIND_U_COMPONENT_100M", // 100u
  "WIND_V_COMPONENT_100M", // 100v
  "FRICTION_VELOCITY", // zust
  "SNOWMELT", // smlt
  
  // Climate Change
  "MEAN_SURFACE_NET_LONG_WAVE_RADIATION_FLUX", // avg_snlwrf
  "MEAN_SURFACE_DOWNWARD_LONG_WAVE_RADIATION_FLUX", // avg_sdlwrf
  "MEAN_SURFACE_NET_SHORT_WAVE_RADIATION_FLUX", // avg_snswrf
  "TOTAL_CLOUD_COVER", // tcc
  "LOW_CLOUD_COVER", // lcc
  "HIGH_CLOUD_COVER", // hcc
  "ALBEDO_UV_DIFFUSE", // aluvd
  "ALBEDO_UV_PARALLEL", // aluvp
  "ALBEDO_NIR_DIFFUSE", // alnid
  "ALBEDO_NIR_PARALLEL", // alnip
  "TOTAL_COLUMN_WATER_VAPOUR", // tcwv
  "VERTICAL_INTEGRAL_OF_TOTAL_ENERGY", // vitoe
  "TOTAL_COLUMN_OZONE", // tco3
  
  // Disaster Risk
  "SURFACE_PRESSURE", // sp
  "MEAN_SEA_LEVEL_PRESSURE", // msl
  "CONVECTIVE_AVAILABLE_POTENTIAL_ENERGY", // cape
  "CONVECTIVE_INHIBITION", // cin
  "PRECIPITATION_TYPE", // ptype
  "CONVECTIVE_RAIN_RATE", // crr
  "LARGE_SCALE_RAIN_RATE", // lsrr
  "INSTANTANEOUS_LARGE_SCALE_SURFACE_PRECIPITATION_FRACTION", // ilspf
]);

// Define domain enum for categorization
export const climateDomainEnum = pgEnum("climate_domain", [
  "WEATHER_EXTREMES",
  "AGRICULTURE_IRRIGATION", 
  "ENERGY",
  "CLIMATE_CHANGE",
  "DISASTER_RISK",
]);

// Define measurement unit enum
export const consolidatedUnitEnum = pgEnum("consolidated_unit_type", [
  "MM", // millimeters for precipitation
  "MM_PER_HOUR", // mm/hour for rates
  "CELSIUS", // degrees Celsius for temperature
  "KELVIN", // Kelvin for temperature
  "M_PER_S", // meters per second for wind
  "M", // meters for height
  "KG_PER_M2", // kg/m² for other measurements
  "M3_PER_M3", // m³/m³ for soil moisture
  "W_PER_M2", // W/m² for heat flux
  "M2_PER_M2", // m²/m² for leaf area index
  "PERCENTAGE", // percentage for cover
  "UNITLESS", // unitless for soil type
  "J_PER_M2", // J/m² for solar radiation
  "PA", // Pascal for pressure
  "J_PER_KG", // J/kg for CAPE/CIN
]);

export const consolidatedClimate = pgTable(
  "consolidated_climate",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Date and time of measurement
    measurementDate: timestamp("measurement_date").notNull(),

    // Climate domain for categorization
    domain: climateDomainEnum("domain").notNull(),

    // Climate variable type
    variableType: consolidatedClimateVariableEnum("variable_type").notNull(),

    // Measurement value
    value: decimal("value", {
      precision: 12,
      scale: 4,
    }).notNull(),

    // Unit of measurement
    unit: consolidatedUnitEnum("unit").notNull(),

    // Optional ward number for ward-specific data
    wardNumber: integer("ward_number"),

    // Optional location coordinates (if available)
    latitude: decimal("latitude", { precision: 8, scale: 6 }),
    longitude: decimal("longitude", { precision: 9, scale: 6 }),

    // Data source or station information
    dataSource: varchar("data_source", { length: 255 }),
    stationId: varchar("station_id", { length: 100 }),

    // Additional context fields
    additionalContext: text("additional_context"), // JSON or text for additional data
    qualityFlag: varchar("quality_flag", { length: 50 }), // Data quality indicator
    confidenceLevel: decimal("confidence_level", { precision: 3, scale: 2 }), // 0-1 range

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type ConsolidatedClimate = typeof consolidatedClimate.$inferSelect;
export type NewConsolidatedClimate = typeof consolidatedClimate.$inferInsert; 