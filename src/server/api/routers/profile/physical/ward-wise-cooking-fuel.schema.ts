import { z } from "zod";

// Define the cooking fuel type enum to match the database enum
export const CookingFuelTypeEnum = z.enum([
  "WOOD",
  "LP_GAS",
  "KEROSENE",
  "ELECTRICITY",
  "BIOGAS",
  "DUNGCAKE",
  "OTHER",
]);
export type CookingFuelType = z.infer<typeof CookingFuelTypeEnum>;

// Schema for ward-wise cooking fuel data
export const wardWiseCookingFuelSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  cookingFuel: CookingFuelTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise cooking fuel data
export const wardWiseCookingFuelFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  cookingFuel: CookingFuelTypeEnum.optional(),
});

export const updateWardWiseCookingFuelSchema = wardWiseCookingFuelSchema;

export type WardWiseCookingFuelData = z.infer<typeof wardWiseCookingFuelSchema>;
export type UpdateWardWiseCookingFuelData = WardWiseCookingFuelData;
export type WardWiseCookingFuelFilter = z.infer<
  typeof wardWiseCookingFuelFilterSchema
>;

// Export the cooking fuel type options for use in UI components
export const cookingFuelOptions = [
  { value: "WOOD", label: "Wood/Firewood/Coal (काठ/दाउरा/कोइला)" },
  { value: "LP_GAS", label: "LPG (एल.पी. ग्याँस)" },
  { value: "KEROSENE", label: "Kerosene (मट्टितेल)" },
  { value: "ELECTRICITY", label: "Electricity (विद्युत)" },
  { value: "BIOGAS", label: "Biogas (गोबर ग्याँस/बायोग्याँस)" },
  { value: "DUNGCAKE", label: "Dung cake (गोबर/गुँइठा)" },
  { value: "OTHER", label: "Other (अन्य)" },
];
