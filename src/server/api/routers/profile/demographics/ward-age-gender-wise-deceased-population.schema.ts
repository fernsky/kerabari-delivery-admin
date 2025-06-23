import { z } from "zod";
import { genderEnum, ageGroupEnum } from "./ward-age-wise-population.schema";

// Reusing the gender and age group enums from ward-age-wise-population.schema.ts

export const wardAgeGenderWiseDeceasedPopulationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().min(1, "वडा नम्बर आवश्यक छ"),
  ageGroup: ageGroupEnum,
  gender: genderEnum,
  deceasedPopulation: z
    .number()
    .int()
    .nonnegative("मृत्यु संख्या शून्य वा त्यो भन्दा बढी हुनुपर्छ"),
});

export const wardAgeGenderWiseDeceasedPopulationFilterSchema = z.object({
  wardNumber: z.number().int().min(1).optional(),
  ageGroup: ageGroupEnum.optional(),
  gender: genderEnum.optional(),
});

export const updateWardAgeGenderWiseDeceasedPopulationSchema =
  wardAgeGenderWiseDeceasedPopulationSchema;

export type WardAgeGenderWiseDeceasedPopulationData = z.infer<
  typeof wardAgeGenderWiseDeceasedPopulationSchema
>;
export type UpdateWardAgeGenderWiseDeceasedPopulationData =
  WardAgeGenderWiseDeceasedPopulationData;
export type WardAgeGenderWiseDeceasedPopulationFilter = z.infer<
  typeof wardAgeGenderWiseDeceasedPopulationFilterSchema
>;
