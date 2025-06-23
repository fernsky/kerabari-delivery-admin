import { z } from "zod";

// Define the electricity source type enum to match the database enum
export const ElectricitySourceTypeEnum = z.enum([
  "ELECTRICITY",
  "SOLAR",
  "KEROSENE",
  "BIOGAS",
  "OTHER",
]);
export type ElectricitySourceType = z.infer<typeof ElectricitySourceTypeEnum>;

// Schema for ward-wise electricity source data
export const wardWiseElectricitySourceSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  electricitySource: ElectricitySourceTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise electricity source data
export const wardWiseElectricitySourceFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  electricitySource: ElectricitySourceTypeEnum.optional(),
});

export const updateWardWiseElectricitySourceSchema =
  wardWiseElectricitySourceSchema;

export type WardWiseElectricitySourceData = z.infer<
  typeof wardWiseElectricitySourceSchema
>;
export type UpdateWardWiseElectricitySourceData = WardWiseElectricitySourceData;
export type WardWiseElectricitySourceFilter = z.infer<
  typeof wardWiseElectricitySourceFilterSchema
>;

// Export the electricity source options for use in UI components
export const electricitySourceOptions = [
  { value: "ELECTRICITY", label: "Electricity grid (विद्युत)" },
  { value: "SOLAR", label: "Solar power (सोलार)" },
  { value: "KEROSENE", label: "Kerosene (मट्टितेल)" },
  { value: "BIOGAS", label: "Biogas (बायोग्याँस)" },
  { value: "OTHER", label: "Other sources (अन्य)" },
];
