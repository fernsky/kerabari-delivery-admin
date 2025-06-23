import { z } from "zod";

// Schema for ward-wise disabled population data
export const wardWiseDisabledPopulationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  disabledPopulation: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise disabled population data
export const wardWiseDisabledPopulationFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
});

export const updateWardWiseDisabledPopulationSchema =
  wardWiseDisabledPopulationSchema;

export type WardWiseDisabledPopulationData = z.infer<
  typeof wardWiseDisabledPopulationSchema
>;
export type UpdateWardWiseDisabledPopulationData =
  WardWiseDisabledPopulationData;
export type WardWiseDisabledPopulationFilter = z.infer<
  typeof wardWiseDisabledPopulationFilterSchema
>;
