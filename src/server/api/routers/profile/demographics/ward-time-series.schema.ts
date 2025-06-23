import { z } from "zod";

// Define transformers for handling both string and number inputs for decimal values
const decimalTransformer = z.union([
  z.string().transform((val) => parseFloat(val) || null),
  z.number(),
]);

// Schema for ward time series population data
export const wardTimeSeriesPopulationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().min(1).max(20),
  wardName: z.string().optional(),
  year: z.number().int().min(2000).max(2100),

  totalPopulation: z.number().int().nonnegative().optional(),
  malePopulation: z.number().int().nonnegative().optional(),
  femalePopulation: z.number().int().nonnegative().optional(),
  otherPopulation: z.number().int().nonnegative().optional(),

  totalHouseholds: z.number().int().nonnegative().optional(),
  averageHouseholdSize: decimalTransformer.optional(),

  population0To14: z.number().int().nonnegative().optional(),
  population15To59: z.number().int().nonnegative().optional(),
  population60AndAbove: z.number().int().nonnegative().optional(),

  literacyRate: decimalTransformer.optional(),
  maleLiteracyRate: decimalTransformer.optional(),
  femaleLiteracyRate: decimalTransformer.optional(),

  growthRate: decimalTransformer.optional(),
});

// Schema for filtering ward time series data
export const wardTimeSeriesFilterSchema = z.object({
  wardNumber: z.number().int().min(1).max(20).optional(),
  year: z.number().int().min(2000).max(2100).optional(),
});

export const updateWardTimeSeriesSchema = wardTimeSeriesPopulationSchema;

export type WardTimeSeriesPopulationData = z.infer<
  typeof wardTimeSeriesPopulationSchema
>;
export type UpdateWardTimeSeriesPopulationData = WardTimeSeriesPopulationData;
export type WardTimeSeriesFilter = z.infer<typeof wardTimeSeriesFilterSchema>;
