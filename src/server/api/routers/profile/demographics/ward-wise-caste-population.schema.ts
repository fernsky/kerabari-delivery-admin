import { z } from "zod";
import { CasteTypes, casteTypeValues } from "../../../../db/schema/common/enums";

// Schema for ward-wise caste population data
export const wardWiseCastePopulationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().min(1).max(20),
  casteType: z.enum(casteTypeValues as [string, ...string[]]),
  population: z.number().int().nonnegative().optional(),
});

// Schema for filtering ward-wise caste population data
export const wardWiseCastePopulationFilterSchema = z.object({
  wardNumber: z.number().int().min(1).max(20).optional(),
  casteType: z.enum(casteTypeValues as [string, ...string[]]).optional(),
});

export const updateWardWiseCastePopulationSchema = wardWiseCastePopulationSchema;

export type WardWiseCastePopulationData = z.infer<
  typeof wardWiseCastePopulationSchema
>;
export type UpdateWardWiseCastePopulationData = WardWiseCastePopulationData;
export type WardWiseCastePopulationFilter = z.infer<typeof wardWiseCastePopulationFilterSchema>;

// Export the caste types for use in UI components
export const casteOptions = Object.entries(CasteTypes).map(([key, value]) => ({
  value: key,
  label: value,
}));
