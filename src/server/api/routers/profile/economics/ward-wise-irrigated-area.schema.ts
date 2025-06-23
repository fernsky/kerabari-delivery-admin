import { z } from "zod";

// Schema for ward-wise irrigated area data
export const wardWiseIrrigatedAreaSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  irrigatedAreaHectares: z.number().nonnegative(),
  unirrigatedAreaHectares: z.number().nonnegative(),
});

// Schema for filtering ward-wise irrigated area data
export const wardWiseIrrigatedAreaFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
});

export const updateWardWiseIrrigatedAreaSchema = wardWiseIrrigatedAreaSchema;

export type WardWiseIrrigatedAreaData = z.infer<typeof wardWiseIrrigatedAreaSchema>;
export type UpdateWardWiseIrrigatedAreaData = WardWiseIrrigatedAreaData;
export type WardWiseIrrigatedAreaFilter = z.infer<typeof wardWiseIrrigatedAreaFilterSchema>;
