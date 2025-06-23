import { z } from "zod";

// Define the drinking water source type enum to match the database enum
export const DrinkingWaterSourceTypeEnum = z.enum([
  "TAP_INSIDE_HOUSE",
  "TAP_OUTSIDE_HOUSE",
  "TUBEWELL",
  "COVERED_WELL",
  "OPEN_WELL",
  "AQUIFIER_MOOL",
  "RIVER",
  "JAR",
  "OTHER",
]);
export type DrinkingWaterSourceType = z.infer<
  typeof DrinkingWaterSourceTypeEnum
>;

// Schema for ward-wise drinking water source data
export const wardWiseDrinkingWaterSourceSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  drinkingWaterSource: DrinkingWaterSourceTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise drinking water source data
export const wardWiseDrinkingWaterSourceFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  drinkingWaterSource: DrinkingWaterSourceTypeEnum.optional(),
});

export const updateWardWiseDrinkingWaterSourceSchema =
  wardWiseDrinkingWaterSourceSchema;

export type WardWiseDrinkingWaterSourceData = z.infer<
  typeof wardWiseDrinkingWaterSourceSchema
>;
export type UpdateWardWiseDrinkingWaterSourceData =
  WardWiseDrinkingWaterSourceData;
export type WardWiseDrinkingWaterSourceFilter = z.infer<
  typeof wardWiseDrinkingWaterSourceFilterSchema
>;

// Export the water source options for use in UI components
export const drinkingWaterSourceOptions = [
  {
    value: "TAP_INSIDE_HOUSE",
    label: "Tap/piped water inside house (धारा/पाइप (घरपरिसर भित्र))",
  },
  {
    value: "TAP_OUTSIDE_HOUSE",
    label: "Tap/piped water outside house (धारा/पाइप (घरपरिसर) बाहिर))",
  },
  { value: "TUBEWELL", label: "Tube well/hand pump (ट्युबवेल/हाते पम्प)" },
  { value: "COVERED_WELL", label: "Covered well/spring (ढाकिएको इनार/कुवा)" },
  { value: "OPEN_WELL", label: "Open well/spring (खुला इनार/कुवा)" },
  { value: "AQUIFIER_MOOL", label: "Spring source (मूल धारा)" },
  { value: "RIVER", label: "River/stream (नदी/खोला)" },
  { value: "JAR", label: "Jar/bottle (जार/बोतल)" },
  { value: "OTHER", label: "Other sources (अन्य)" },
];
