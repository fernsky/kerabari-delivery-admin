import { z } from "zod";

// Define the valid enum values for gender and age groups
export const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export type Gender = z.infer<typeof genderEnum>;

export const ageGroupEnum = z.enum([
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
  "AGE_50_54",
  "AGE_55_59",
  "AGE_60_64",
  "AGE_65_69",
  "AGE_70_74",
  "AGE_75_AND_ABOVE",
]);
export type AgeGroup = z.infer<typeof ageGroupEnum>;

export const wardAgeWisePopulationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().min(1, "वडा नम्बर आवश्यक छ"),
  ageGroup: ageGroupEnum,
  gender: genderEnum,
  population: z
    .number()
    .int()
    .nonnegative("जनसंख्या शून्य वा त्यो भन्दा बढी हुनुपर्छ"),
});

export const wardAgeWisePopulationFilterSchema = z.object({
  wardNumber: z.number().int().min(1).optional(),
  ageGroup: ageGroupEnum.optional(),
  gender: genderEnum.optional(),
});

export const updateWardAgeWisePopulationSchema = wardAgeWisePopulationSchema;

export type WardAgeWisePopulationData = z.infer<
  typeof wardAgeWisePopulationSchema
>;
export type UpdateWardAgeWisePopulationData = WardAgeWisePopulationData;
export type WardAgeWisePopulationFilter = z.infer<
  typeof wardAgeWisePopulationFilterSchema
>;
