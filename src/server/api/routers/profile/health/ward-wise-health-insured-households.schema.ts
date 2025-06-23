import { z } from "zod";

// Schema for ward-wise health insured households data
export const wardWiseHealthInsuredHouseholdsSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  insuredHouseholds: z.number().int().nonnegative(),
  nonInsuredHouseholds: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise health insured households data
export const wardWiseHealthInsuredHouseholdsFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
});

export const updateWardWiseHealthInsuredHouseholdsSchema =
  wardWiseHealthInsuredHouseholdsSchema;

export type WardWiseHealthInsuredHouseholdsData = z.infer<
  typeof wardWiseHealthInsuredHouseholdsSchema
>;
export type UpdateWardWiseHealthInsuredHouseholdsData =
  WardWiseHealthInsuredHouseholdsData;
export type WardWiseHealthInsuredHouseholdsFilter = z.infer<
  typeof wardWiseHealthInsuredHouseholdsFilterSchema
>;
