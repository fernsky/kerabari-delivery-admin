import { z } from "zod";
import { CasteTypes, casteTypeValues } from "../../../../db/schema/common/enums";

// Schema for municipality-wide caste population data
export const municipalityWideCastePopulationSchema = z.object({
  id: z.string().optional(),
  casteType: z.enum(casteTypeValues as [string, ...string[]]),
  population: z.number().int().nonnegative(),
});

// Schema for filtering municipality-wide caste population data
export const municipalityWideCastePopulationFilterSchema = z.object({
  casteType: z.enum(casteTypeValues as [string, ...string[]]).optional(),
});

export const updateMunicipalityWideCastePopulationSchema = municipalityWideCastePopulationSchema;

export type MunicipalityWideCastePopulationData = z.infer<
  typeof municipalityWideCastePopulationSchema
>;
export type UpdateMunicipalityWideCastePopulationData = MunicipalityWideCastePopulationData;
export type MunicipalityWideCastePopulationFilter = z.infer<typeof municipalityWideCastePopulationFilterSchema>;

// Export the caste types for use in UI components
export const casteOptions = Object.entries(CasteTypes).map(([key, value]) => ({
  value: key,
  label: value,
})); 