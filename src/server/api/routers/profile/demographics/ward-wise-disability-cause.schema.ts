import { z } from "zod";

// Define the disability cause enum for validation - only include values supported by database
export const DisabilityCauseEnum = z.enum([
  "CONGENITAL",
  "ACCIDENT",
  "MALNUTRITION",
  "DISEASE",
  "CONFLICT",
  "OTHER",
]);
export type DisabilityCause = z.infer<typeof DisabilityCauseEnum>;

// Schema for ward-wise disability cause data
export const wardWiseDisabilityCauseSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  disabilityCause: DisabilityCauseEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise disability cause data
export const wardWiseDisabilityCauseFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  disabilityCause: DisabilityCauseEnum.optional(),
});

export const updateWardWiseDisabilityCauseSchema = 
  wardWiseDisabilityCauseSchema;

export type WardWiseDisabilityCauseData = z.infer<
  typeof wardWiseDisabilityCauseSchema
>;
export type UpdateWardWiseDisabilityCauseData =
  WardWiseDisabilityCauseData;
export type WardWiseDisabilityCauseFilter = z.infer<
  typeof wardWiseDisabilityCauseFilterSchema
>;
