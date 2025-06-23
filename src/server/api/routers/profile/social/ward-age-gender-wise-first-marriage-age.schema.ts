import { z } from "zod";

// Define the gender type enum to match the database enum
export const GenderTypeEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export type GenderType = z.infer<typeof GenderTypeEnum>;

// Define the first marriage age group enum to match the database enum
export const FirstMarriageAgeGroupEnum = z.enum([
  "AGE_0_14",
  "AGE_15_19",
  "AGE_20_24",
  "AGE_25_29",
  "AGE_30_34",
  "AGE_35_39",
  "AGE_40_44",
  "AGE_45_49",
  "AGE_50_54",
  "AGE_55_59",
  "AGE_60_AND_ABOVE",
]);
export type FirstMarriageAgeGroup = z.infer<typeof FirstMarriageAgeGroupEnum>;

// Schema for ward-age-gender-wise first marriage age data
export const wardAgeGenderWiseFirstMarriageAgeSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  firstMarriageAgeGroup: FirstMarriageAgeGroupEnum,
  gender: GenderTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-age-gender-wise first marriage age data
export const wardAgeGenderWiseFirstMarriageAgeFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  firstMarriageAgeGroup: FirstMarriageAgeGroupEnum.optional(),
  gender: GenderTypeEnum.optional(),
});

export const updateWardAgeGenderWiseFirstMarriageAgeSchema =
  wardAgeGenderWiseFirstMarriageAgeSchema;

export type WardAgeGenderWiseFirstMarriageAgeData = z.infer<
  typeof wardAgeGenderWiseFirstMarriageAgeSchema
>;
export type UpdateWardAgeGenderWiseFirstMarriageAgeData =
  WardAgeGenderWiseFirstMarriageAgeData;
export type WardAgeGenderWiseFirstMarriageAgeFilter = z.infer<
  typeof wardAgeGenderWiseFirstMarriageAgeFilterSchema
>;

// Export the gender options for use in UI components
export const genderOptions = [
  { value: "MALE", label: "Male (पुरुष)" },
  { value: "FEMALE", label: "Female (महिला)" },
  { value: "OTHER", label: "Other (अन्य)" },
];

// Export the first marriage age group options for use in UI components
export const firstMarriageAgeGroupOptions = [
  { value: "AGE_0_14", label: "0-14 years (0-14 वर्ष)" },
  { value: "AGE_15_19", label: "15-19 years (15-19 वर्ष)" },
  { value: "AGE_20_24", label: "20-24 years (20-24 वर्ष)" },
  { value: "AGE_25_29", label: "25-29 years (25-29 वर्ष)" },
  { value: "AGE_30_34", label: "30-34 years (30-34 वर्ष)" },
  { value: "AGE_35_39", label: "35-39 years (35-39 वर्ष)" },
  { value: "AGE_40_44", label: "40-44 years (40-44 वर्ष)" },
  { value: "AGE_45_49", label: "45-49 years (45-49 वर्ष)" },
  { value: "AGE_50_54", label: "50-54 years (50-54 वर्ष)" },
  { value: "AGE_55_59", label: "55-59 years (55-59 वर्ष)" },
  { value: "AGE_60_AND_ABOVE", label: "60 and above (60 वर्ष र माथि)" },
];
