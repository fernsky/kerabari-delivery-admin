import { z } from "zod";

// Define the married age group enum to match the database enum
export const MarriedAgeGroupEnum = z.enum([
  "AGE_BELOW_15",
  "AGE_15_19",
  "AGE_20_24",
  "AGE_25_29",
  "AGE_30_34",
  "AGE_35_39",
  "AGE_40_AND_ABOVE",
]);
export type MarriedAgeGroup = z.infer<typeof MarriedAgeGroupEnum>;

// Define the gender enum
export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export type Gender = z.infer<typeof GenderEnum>;

// Schema for ward-age-gender-wise married age data
export const wardAgeGenderWiseMarriedAgeSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  ageGroup: MarriedAgeGroupEnum,
  gender: GenderEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-age-gender-wise married age data
export const wardAgeGenderWiseMarriedAgeFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  ageGroup: MarriedAgeGroupEnum.optional(),
  gender: GenderEnum.optional(),
});

export const updateWardAgeGenderWiseMarriedAgeSchema =
  wardAgeGenderWiseMarriedAgeSchema;

export type WardAgeGenderWiseMarriedAgeData = z.infer<
  typeof wardAgeGenderWiseMarriedAgeSchema
>;
export type UpdateWardAgeGenderWiseMarriedAgeData =
  WardAgeGenderWiseMarriedAgeData;
export type WardAgeGenderWiseMarriedAgeFilter = z.infer<
  typeof wardAgeGenderWiseMarriedAgeFilterSchema
>;
