import { z } from "zod";

// Schema for ward-wise old age population and single women data
export const wardWiseOldAgePopulationAndSingleWomenSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  maleOldAgePopulation: z.number().int().nonnegative(),
  femaleOldAgePopulation: z.number().int().nonnegative(),
  singleWomenPopulation: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise old age population and single women data
export const wardWiseOldAgePopulationAndSingleWomenFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
});

export const updateWardWiseOldAgePopulationAndSingleWomenSchema =
  wardWiseOldAgePopulationAndSingleWomenSchema;

export type WardWiseOldAgePopulationAndSingleWomenData = z.infer<
  typeof wardWiseOldAgePopulationAndSingleWomenSchema
>;
export type UpdateWardWiseOldAgePopulationAndSingleWomenData =
  WardWiseOldAgePopulationAndSingleWomenData;
export type WardWiseOldAgePopulationAndSingleWomenFilter = z.infer<
  typeof wardWiseOldAgePopulationAndSingleWomenFilterSchema
>;
