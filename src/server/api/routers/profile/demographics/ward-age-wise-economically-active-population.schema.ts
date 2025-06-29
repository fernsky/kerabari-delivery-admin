import { z } from "zod";

// Define the economically active age group enum for validation
export const EconomicallyActiveAgeGroupEnum = z.enum([
  "AGE_0_TO_14",
  "AGE_15_TO_59",
  "AGE_60_PLUS",
]);
export type EconomicallyActiveAgeGroup = z.infer<typeof EconomicallyActiveAgeGroupEnum>;

// Define the gender enum for validation
export const GenderEnum = z.enum([
  "MALE",
  "FEMALE", 
  "OTHER",
]);
export type Gender = z.infer<typeof GenderEnum>;

// Schema for ward-age-wise economically active population data
export const wardAgeWiseEconomicallyActivePopulationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  ageGroup: EconomicallyActiveAgeGroupEnum,
  gender: GenderEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-age-wise economically active population data
export const wardAgeWiseEconomicallyActivePopulationFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  ageGroup: EconomicallyActiveAgeGroupEnum.optional(),
  gender: GenderEnum.optional(),
});

export const updateWardAgeWiseEconomicallyActivePopulationSchema = 
  wardAgeWiseEconomicallyActivePopulationSchema;

export type WardAgeWiseEconomicallyActivePopulationData = z.infer<
  typeof wardAgeWiseEconomicallyActivePopulationSchema
>;
export type UpdateWardAgeWiseEconomicallyActivePopulationData =
  WardAgeWiseEconomicallyActivePopulationData;
export type WardAgeWiseEconomicallyActivePopulationFilter = z.infer<
  typeof wardAgeWiseEconomicallyActivePopulationFilterSchema
>;
