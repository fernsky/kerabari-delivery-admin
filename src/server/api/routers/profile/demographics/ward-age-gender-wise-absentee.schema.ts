import { z } from "zod";

// Define the absentee age group enum for validation
export const AbsenteeAgeGroupEnum = z.enum([
  "AGE_0_4",
  "AGE_5_9",
  "AGE_10_14",
  "AGE_15_19",
  "AGE_20_24",
  "AGE_25_29",
  "AGE_30_34",
  "AGE_35_39",
  "AGE_40_44",
  "AGE_45_49",
  "AGE_50_AND_ABOVE",
]);
export type AbsenteeAgeGroup = z.infer<typeof AbsenteeAgeGroupEnum>;

// Reuse the Gender enum from the existing schema
export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export type Gender = z.infer<typeof GenderEnum>;

// Schema for ward-age-gender-wise absentee data
export const wardAgeGenderWiseAbsenteeSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  ageGroup: AbsenteeAgeGroupEnum,
  gender: GenderEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-age-gender-wise absentee data
export const wardAgeGenderWiseAbsenteeFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  ageGroup: AbsenteeAgeGroupEnum.optional(),
  gender: GenderEnum.optional(),
});

export const updateWardAgeGenderWiseAbsenteeSchema =
  wardAgeGenderWiseAbsenteeSchema;

export type WardAgeGenderWiseAbsenteeData = z.infer<
  typeof wardAgeGenderWiseAbsenteeSchema
>;
export type UpdateWardAgeGenderWiseAbsenteeData = WardAgeGenderWiseAbsenteeData;
export type WardAgeGenderWiseAbsenteeFilter = z.infer<
  typeof wardAgeGenderWiseAbsenteeFilterSchema
>;
