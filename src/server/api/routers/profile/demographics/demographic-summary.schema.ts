import { z } from "zod";

// Define transformers to handle both string and number inputs for decimal values
const decimalTransformer = z.union([
  z.string().transform((val) => parseFloat(val) || null),
  z.number(),
]);

export const demographicSummarySchema = z.object({
  // Population statistics
  totalPopulation: z.number().int().nonnegative().optional(),
  populationMale: z.number().int().nonnegative().optional(),
  populationFemale: z.number().int().nonnegative().optional(),
  populationOther: z.number().int().nonnegative().optional(),

  // Absentee population
  populationAbsenteeTotal: z.number().int().nonnegative().optional(),
  populationMaleAbsentee: z.number().int().nonnegative().optional(),
  populationFemaleAbsentee: z.number().int().nonnegative().optional(),
  populationOtherAbsentee: z.number().int().nonnegative().optional(),

  // Demographic ratios and averages
  sexRatio: decimalTransformer.optional(),
  totalHouseholds: z.number().int().nonnegative().optional(),
  averageHouseholdSize: decimalTransformer.optional(),
  populationDensity: decimalTransformer.optional(),

  // New fields
  totalWards: z.number().int().nonnegative().optional(),
  totalLandArea: decimalTransformer.optional(),

  // Age groups
  population0To14: z.number().int().nonnegative().optional(),
  population15To59: z.number().int().nonnegative().optional(),
  population60AndAbove: z.number().int().nonnegative().optional(),

  // Growth and literacy rates (percentages)
  growthRate: decimalTransformer.optional(),
  literacyRateAbove15: decimalTransformer.optional(),
  literacyRate15To24: decimalTransformer.optional(),
});

export const updateDemographicSummarySchema = demographicSummarySchema;

export type DemographicSummaryData = z.infer<typeof demographicSummarySchema>;
export type UpdateDemographicSummaryData = DemographicSummaryData;
