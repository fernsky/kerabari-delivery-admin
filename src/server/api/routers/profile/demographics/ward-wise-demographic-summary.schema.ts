import { z } from "zod";

// Define transformers for handling both string and number inputs for decimal values
const decimalTransformer = z.union([
  z.string().transform((val) => parseFloat(val) || null),
  z.number(),
]);

// Schema for ward-wise demographic summary data
export const wardWiseDemographicSummarySchema = z.object({
  id: z.string().optional(),
  
  // Ward identification
  wardNumber: z.number().int().min(1).max(20),
  wardName: z.string().optional(),
  areaSqKm: decimalTransformer.optional(),
  
  // Population statistics
  totalPopulation: z.number().int().nonnegative().optional(),
  populationMale: z.number().int().nonnegative().optional(),
  populationFemale: z.number().int().nonnegative().optional(),
  populationOther: z.number().int().nonnegative().optional(),
  
  // Household data
  totalHouseholds: z.number().int().nonnegative().optional(),
  averageHouseholdSize: decimalTransformer.optional(),
  
  // Demographic ratios
  sexRatio: decimalTransformer.optional(),
});

// Schema for filtering ward-wise demographic summary data
export const wardWiseDemographicSummaryFilterSchema = z.object({
  wardNumber: z.number().int().min(1).max(20).optional(),
});

// Use the same schema for updates
export const updateWardWiseDemographicSummarySchema = wardWiseDemographicSummarySchema;

// Export TypeScript types for use in the application
export type WardWiseDemographicSummaryData = z.infer<typeof wardWiseDemographicSummarySchema>;
export type UpdateWardWiseDemographicSummaryData = WardWiseDemographicSummaryData;
export type WardWiseDemographicSummaryFilter = z.infer<typeof wardWiseDemographicSummaryFilterSchema>;
