import { z } from "zod";

// Define the economically active age group enum for validation
export const EconomicallyActiveAgeGroupEnum = z.enum([
  "AGE_0_TO_14",
  "AGE_15_TO_59",
  "AGE_60_PLUS",
]);
export type EconomicallyActiveAgeGroup = z.infer<
  typeof EconomicallyActiveAgeGroupEnum
>;

// Reuse the Gender enum from the existing schema
export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export type Gender = z.infer<typeof GenderEnum>;

// Schema for ward-age-gender-wise economically active population data
export const wardAgeGenderWiseEconomicallyActivePopulationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  ageGroup: EconomicallyActiveAgeGroupEnum,
  gender: GenderEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-age-gender-wise economically active population data
export const wardAgeGenderWiseEconomicallyActivePopulationFilterSchema =
  z.object({
    wardNumber: z.number().int().positive().optional(),
    ageGroup: EconomicallyActiveAgeGroupEnum.optional(),
    gender: GenderEnum.optional(),
  });

export const updateWardAgeGenderWiseEconomicallyActivePopulationSchema =
  wardAgeGenderWiseEconomicallyActivePopulationSchema;

export type WardAgeGenderWiseEconomicallyActivePopulationData = z.infer<
  typeof wardAgeGenderWiseEconomicallyActivePopulationSchema
>;
export type UpdateWardAgeGenderWiseEconomicallyActivePopulationData =
  WardAgeGenderWiseEconomicallyActivePopulationData;
export type WardAgeGenderWiseEconomicallyActivePopulationFilter = z.infer<
  typeof wardAgeGenderWiseEconomicallyActivePopulationFilterSchema
>;
