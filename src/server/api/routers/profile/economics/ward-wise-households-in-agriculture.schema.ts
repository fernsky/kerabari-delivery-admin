import { z } from "zod";

// Schema for ward-wise households in agriculture data
export const wardWiseHouseholdsInAgricultureSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  involvedInAgriculture: z.number().int().nonnegative(),
  nonInvolvedInAgriculture: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise households in agriculture data
export const wardWiseHouseholdsInAgricultureFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
});

export const updateWardWiseHouseholdsInAgricultureSchema = wardWiseHouseholdsInAgricultureSchema;

export type WardWiseHouseholdsInAgricultureData = z.infer<
  typeof wardWiseHouseholdsInAgricultureSchema
>;
export type UpdateWardWiseHouseholdsInAgricultureData = WardWiseHouseholdsInAgricultureData;
export type WardWiseHouseholdsInAgricultureFilter = z.infer<
  typeof wardWiseHouseholdsInAgricultureFilterSchema
>;
