import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, decimal, pgEnum, integer } from "drizzle-orm/pg-core";

// Define weather variable type enum
export const weatherVariableEnum = pgEnum("weather_variable_type", [
  // Precipitation & Flooding
  "TOTAL_PRECIPITATION", // tp
  "CONVECTIVE_PRECIPITATION", // cp
  "LARGE_SCALE_PRECIPITATION", // lsp
  "MEAN_TOTAL_PRECIPITATION_RATE", // avg_tprate
  "RUNOFF", // ro
  "SURFACE_RUNOFF", // sro
  "SUB_SURFACE_RUNOFF", // ssro
  
  // Temperature Extremes
  "TEMPERATURE_2M", // 2t
  "MAXIMUM_TEMPERATURE_2M", // mx2t
  "MINIMUM_TEMPERATURE_2M", // mn2t
  "SKIN_TEMPERATURE", // skt
  
  // Wind & Storms
  "WIND_U_COMPONENT_10M", // 10u
  "WIND_V_COMPONENT_10M", // 10v
  "WIND_GUST_10M", // gust
  "INSTANTANEOUS_WIND_GUST_10M", // i10fg
  "BOUNDARY_LAYER_HEIGHT", // blh
]);

// Define measurement unit enum
export const weatherUnitEnum = pgEnum("weather_unit_type", [
  "MM", // millimeters for precipitation
  "MM_PER_HOUR", // mm/hour for rates
  "CELSIUS", // degrees Celsius for temperature
  "KELVIN", // Kelvin for temperature
  "M_PER_S", // meters per second for wind
  "M", // meters for height
  "KG_PER_M2", // kg/m² for other measurements
]);

export const weatherExtremes = pgTable(
  "weather_extremes",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Date and time of measurement
    measurementDate: timestamp("measurement_date").notNull(),

    // Weather variable type
    variableType: weatherVariableEnum("variable_type").notNull(),

    // Measurement value
    value: decimal("value", {
      precision: 10,
      scale: 4,
    }).notNull(),

    // Unit of measurement
    unit: weatherUnitEnum("unit").notNull(),

    // Optional ward number for ward-specific data
    wardNumber: integer("ward_number"),

    // Optional location coordinates (if available)
    latitude: decimal("latitude", { precision: 8, scale: 6 }),
    longitude: decimal("longitude", { precision: 9, scale: 6 }),

    // Data source or station information
    dataSource: varchar("data_source", { length: 255 }),
    stationId: varchar("station_id", { length: 100 }),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WeatherExtreme = typeof weatherExtremes.$inferSelect;
export type NewWeatherExtreme = typeof weatherExtremes.$inferInsert; 