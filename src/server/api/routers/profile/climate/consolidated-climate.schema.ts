import { z } from "zod";

// Define transformers to handle both string and number inputs for decimal values
const decimalTransformer = z.union([
  z.string().transform((val) => parseFloat(val) || 0),
  z.number(),
]).refine((val) => val !== null && val !== undefined, {
  message: "Value is required and cannot be null",
});

// Schema for creating consolidated climate data
export const consolidatedClimateSchema = z.object({
  id: z.string().optional(),
  measurementDate: z.date(),
  domain: z.enum([
    "WEATHER_EXTREMES",
    "AGRICULTURE_IRRIGATION", 
    "ENERGY",
    "CLIMATE_CHANGE",
    "DISASTER_RISK",
  ]),
  variableType: z.enum([
    // Weather Extremes
    "TOTAL_PRECIPITATION",
    "CONVECTIVE_PRECIPITATION",
    "LARGE_SCALE_PRECIPITATION",
    "MEAN_TOTAL_PRECIPITATION_RATE",
    "RUNOFF",
    "SURFACE_RUNOFF",
    "SUB_SURFACE_RUNOFF",
    "TEMPERATURE_2M",
    "MAXIMUM_TEMPERATURE_2M",
    "MINIMUM_TEMPERATURE_2M",
    "SKIN_TEMPERATURE",
    "WIND_U_COMPONENT_10M",
    "WIND_V_COMPONENT_10M",
    "WIND_GUST_10M",
    "INSTANTANEOUS_WIND_GUST_10M",
    "BOUNDARY_LAYER_HEIGHT",
    
    // Agriculture & Irrigation
    "VOLUMETRIC_SOIL_WATER_LAYER_1",
    "VOLUMETRIC_SOIL_WATER_LAYER_2",
    "VOLUMETRIC_SOIL_WATER_LAYER_3",
    "VOLUMETRIC_SOIL_WATER_LAYER_4",
    "EVAPORATION",
    "POTENTIAL_EVAPORATION",
    "SURFACE_LATENT_HEAT_FLUX",
    "MEAN_EVAPORATION_RATE",
    "MEAN_RUNOFF_RATE",
    "LEAF_AREA_INDEX_HIGH_VEGETATION",
    "LEAF_AREA_INDEX_LOW_VEGETATION",
    "HIGH_VEGETATION_COVER",
    "LOW_VEGETATION_COVER",
    "SOIL_TYPE",
    
    // Energy
    "SURFACE_SOLAR_RADIATION_DOWNWARDS",
    "TOA_INCIDENT_SOLAR_RADIATION",
    "SURFACE_NET_SOLAR_RADIATION",
    "CLEAR_SKY_DIRECT_SOLAR_RADIATION_AT_SURFACE",
    "WIND_U_COMPONENT_100M",
    "WIND_V_COMPONENT_100M",
    "FRICTION_VELOCITY",
    "SNOWMELT",
    
    // Climate Change
    "MEAN_SURFACE_NET_LONG_WAVE_RADIATION_FLUX",
    "MEAN_SURFACE_DOWNWARD_LONG_WAVE_RADIATION_FLUX",
    "MEAN_SURFACE_NET_SHORT_WAVE_RADIATION_FLUX",
    "TOTAL_CLOUD_COVER",
    "LOW_CLOUD_COVER",
    "HIGH_CLOUD_COVER",
    "ALBEDO_UV_DIFFUSE",
    "ALBEDO_UV_PARALLEL",
    "ALBEDO_NIR_DIFFUSE",
    "ALBEDO_NIR_PARALLEL",
    "TOTAL_COLUMN_WATER_VAPOUR",
    "VERTICAL_INTEGRAL_OF_TOTAL_ENERGY",
    "TOTAL_COLUMN_OZONE",
    
    // Disaster Risk
    "SURFACE_PRESSURE",
    "MEAN_SEA_LEVEL_PRESSURE",
    "CONVECTIVE_AVAILABLE_POTENTIAL_ENERGY",
    "CONVECTIVE_INHIBITION",
    "PRECIPITATION_TYPE",
    "CONVECTIVE_RAIN_RATE",
    "LARGE_SCALE_RAIN_RATE",
    "INSTANTANEOUS_LARGE_SCALE_SURFACE_PRECIPITATION_FRACTION",
  ]),
  value: decimalTransformer,
  unit: z.enum([
    "MM",
    "MM_PER_HOUR",
    "CELSIUS",
    "KELVIN",
    "M_PER_S",
    "M",
    "KG_PER_M2",
    "M3_PER_M3",
    "W_PER_M2",
    "M2_PER_M2",
    "PERCENTAGE",
    "UNITLESS",
    "J_PER_M2",
    "PA",
    "J_PER_KG",
  ]),
  wardNumber: z.number().int().positive().optional(),
  latitude: decimalTransformer.optional(),
  longitude: decimalTransformer.optional(),
  dataSource: z.string().max(255).optional(),
  stationId: z.string().max(100).optional(),
  additionalContext: z.string().optional(),
  qualityFlag: z.string().max(50).optional(),
  confidenceLevel: decimalTransformer.optional(),
});

// Schema for updating consolidated climate data
export const updateConsolidatedClimateSchema = consolidatedClimateSchema.partial().extend({
  id: z.string(), // ID is required for updates
});

// Schema for filtering consolidated climate data
export const consolidatedClimateFilterSchema = z.object({
  domain: z.enum([
    "WEATHER_EXTREMES",
    "AGRICULTURE_IRRIGATION", 
    "ENERGY",
    "CLIMATE_CHANGE",
    "DISASTER_RISK",
  ]).optional(),
  variableType: z.string().optional(),
  wardNumber: z.number().int().positive().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  dataSource: z.string().optional(),
  stationId: z.string().optional(),
  qualityFlag: z.string().optional(),
});

// Schema for bulk operations
export const bulkConsolidatedClimateSchema = z.object({
  data: z.array(consolidatedClimateSchema),
});

// Schema for time series analysis
export const timeSeriesFilterSchema = z.object({
  variableType: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  wardNumber: z.number().int().positive().optional(),
  aggregation: z.enum(["HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).default("DAILY"),
});

// Schema for climate summary statistics
export const climateSummaryFilterSchema = z.object({
  domain: z.enum([
    "WEATHER_EXTREMES",
    "AGRICULTURE_IRRIGATION", 
    "ENERGY",
    "CLIMATE_CHANGE",
    "DISASTER_RISK",
  ]).optional(),
  wardNumber: z.number().int().positive().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

// Export types
export type ConsolidatedClimateData = z.infer<typeof consolidatedClimateSchema>;
export type UpdateConsolidatedClimateData = z.infer<typeof updateConsolidatedClimateSchema>;
export type ConsolidatedClimateFilter = z.infer<typeof consolidatedClimateFilterSchema>;
export type BulkConsolidatedClimateData = z.infer<typeof bulkConsolidatedClimateSchema>;
export type TimeSeriesFilter = z.infer<typeof timeSeriesFilterSchema>;
export type ClimateSummaryFilter = z.infer<typeof climateSummaryFilterSchema>;

// Domain labels for UI
export const DOMAIN_LABELS: Record<string, string> = {
  WEATHER_EXTREMES: "Weather Extremes",
  AGRICULTURE_IRRIGATION: "Agriculture & Irrigation",
  ENERGY: "Energy",
  CLIMATE_CHANGE: "Climate Change",
  DISASTER_RISK: "Disaster Risk",
};

// Variable type labels for UI
export const VARIABLE_TYPE_LABELS: Record<string, string> = {
  // Weather Extremes
  TOTAL_PRECIPITATION: "Total Precipitation",
  CONVECTIVE_PRECIPITATION: "Convective Precipitation",
  LARGE_SCALE_PRECIPITATION: "Large Scale Precipitation",
  MEAN_TOTAL_PRECIPITATION_RATE: "Mean Total Precipitation Rate",
  RUNOFF: "Runoff",
  SURFACE_RUNOFF: "Surface Runoff",
  SUB_SURFACE_RUNOFF: "Sub Surface Runoff",
  TEMPERATURE_2M: "Temperature (2m)",
  MAXIMUM_TEMPERATURE_2M: "Maximum Temperature (2m)",
  MINIMUM_TEMPERATURE_2M: "Minimum Temperature (2m)",
  SKIN_TEMPERATURE: "Skin Temperature",
  WIND_U_COMPONENT_10M: "Wind U Component (10m)",
  WIND_V_COMPONENT_10M: "Wind V Component (10m)",
  WIND_GUST_10M: "Wind Gust (10m)",
  INSTANTANEOUS_WIND_GUST_10M: "Instantaneous Wind Gust (10m)",
  BOUNDARY_LAYER_HEIGHT: "Boundary Layer Height",
  
  // Agriculture & Irrigation
  VOLUMETRIC_SOIL_WATER_LAYER_1: "Volumetric Soil Water Layer 1",
  VOLUMETRIC_SOIL_WATER_LAYER_2: "Volumetric Soil Water Layer 2",
  VOLUMETRIC_SOIL_WATER_LAYER_3: "Volumetric Soil Water Layer 3",
  VOLUMETRIC_SOIL_WATER_LAYER_4: "Volumetric Soil Water Layer 4",
  EVAPORATION: "Evaporation",
  POTENTIAL_EVAPORATION: "Potential Evaporation",
  SURFACE_LATENT_HEAT_FLUX: "Surface Latent Heat Flux",
  MEAN_EVAPORATION_RATE: "Mean Evaporation Rate",
  MEAN_RUNOFF_RATE: "Mean Runoff Rate",
  LEAF_AREA_INDEX_HIGH_VEGETATION: "Leaf Area Index High Vegetation",
  LEAF_AREA_INDEX_LOW_VEGETATION: "Leaf Area Index Low Vegetation",
  HIGH_VEGETATION_COVER: "High Vegetation Cover",
  LOW_VEGETATION_COVER: "Low Vegetation Cover",
  SOIL_TYPE: "Soil Type",
  
  // Energy
  SURFACE_SOLAR_RADIATION_DOWNWARDS: "Surface Solar Radiation Downwards",
  TOA_INCIDENT_SOLAR_RADIATION: "TOA Incident Solar Radiation",
  SURFACE_NET_SOLAR_RADIATION: "Surface Net Solar Radiation",
  CLEAR_SKY_DIRECT_SOLAR_RADIATION_AT_SURFACE: "Clear Sky Direct Solar Radiation at Surface",
  WIND_U_COMPONENT_100M: "Wind U Component (100m)",
  WIND_V_COMPONENT_100M: "Wind V Component (100m)",
  FRICTION_VELOCITY: "Friction Velocity",
  SNOWMELT: "Snowmelt",
  
  // Climate Change
  MEAN_SURFACE_NET_LONG_WAVE_RADIATION_FLUX: "Mean Surface Net Long Wave Radiation Flux",
  MEAN_SURFACE_DOWNWARD_LONG_WAVE_RADIATION_FLUX: "Mean Surface Downward Long Wave Radiation Flux",
  MEAN_SURFACE_NET_SHORT_WAVE_RADIATION_FLUX: "Mean Surface Net Short Wave Radiation Flux",
  TOTAL_CLOUD_COVER: "Total Cloud Cover",
  LOW_CLOUD_COVER: "Low Cloud Cover",
  HIGH_CLOUD_COVER: "High Cloud Cover",
  ALBEDO_UV_DIFFUSE: "Albedo UV Diffuse",
  ALBEDO_UV_PARALLEL: "Albedo UV Parallel",
  ALBEDO_NIR_DIFFUSE: "Albedo NIR Diffuse",
  ALBEDO_NIR_PARALLEL: "Albedo NIR Parallel",
  TOTAL_COLUMN_WATER_VAPOUR: "Total Column Water Vapour",
  VERTICAL_INTEGRAL_OF_TOTAL_ENERGY: "Vertical Integral of Total Energy",
  TOTAL_COLUMN_OZONE: "Total Column Ozone",
  
  // Disaster Risk
  SURFACE_PRESSURE: "Surface Pressure",
  MEAN_SEA_LEVEL_PRESSURE: "Mean Sea Level Pressure",
  CONVECTIVE_AVAILABLE_POTENTIAL_ENERGY: "Convective Available Potential Energy",
  CONVECTIVE_INHIBITION: "Convective Inhibition",
  PRECIPITATION_TYPE: "Precipitation Type",
  CONVECTIVE_RAIN_RATE: "Convective Rain Rate",
  LARGE_SCALE_RAIN_RATE: "Large Scale Rain Rate",
  INSTANTANEOUS_LARGE_SCALE_SURFACE_PRECIPITATION_FRACTION: "Instantaneous Large Scale Surface Precipitation Fraction",
};

// Unit labels for UI
export const UNIT_LABELS: Record<string, string> = {
  MM: "mm",
  MM_PER_HOUR: "mm/hour",
  CELSIUS: "°C",
  KELVIN: "K",
  M_PER_S: "m/s",
  M: "m",
  KG_PER_M2: "kg/m²",
  M3_PER_M3: "m³/m³",
  W_PER_M2: "W/m²",
  M2_PER_M2: "m²/m²",
  PERCENTAGE: "%",
  UNITLESS: "unitless",
  J_PER_M2: "J/m²",
  PA: "Pa",
  J_PER_KG: "J/kg",
};

// Export options for UI components
export const domainOptions = Object.entries(DOMAIN_LABELS).map(([key, value]) => ({
  value: key,
  label: value,
}));

export const variableTypeOptions = Object.entries(VARIABLE_TYPE_LABELS).map(([key, value]) => ({
  value: key,
  label: value,
}));

export const unitOptions = Object.entries(UNIT_LABELS).map(([key, value]) => ({
  value: key,
  label: value,
})); 