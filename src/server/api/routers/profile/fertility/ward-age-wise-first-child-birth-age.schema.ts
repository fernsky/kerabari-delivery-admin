import { z } from "zod";

// Define the first child birth age group enum to match the database enum
export const FirstChildBirthAgeGroupEnum = z.enum([
  "AGE_15_19", // Ages 15 to 19 years
  "AGE_20_24", // Ages 20 to 24 years
  "AGE_25_29", // Ages 25 to 29 years
  "AGE_30_34", // Ages 30 to 34 years
  "AGE_35_39", // Ages 35 to 39 years
  "AGE_40_44", // Ages 40 to 44 years
  "AGE_45_49", // Ages 45 to 49 years
]);
export type FirstChildBirthAgeGroup = z.infer<
  typeof FirstChildBirthAgeGroupEnum
>;

// Schema for ward-age-wise first child birth age data
export const wardAgeWiseFirstChildBirthAgeSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  firstChildBirthAgeGroup: FirstChildBirthAgeGroupEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-age-wise first child birth age data
export const wardAgeWiseFirstChildBirthAgeFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  firstChildBirthAgeGroup: FirstChildBirthAgeGroupEnum.optional(),
});

export const updateWardAgeWiseFirstChildBirthAgeSchema =
  wardAgeWiseFirstChildBirthAgeSchema;

export type WardAgeWiseFirstChildBirthAgeData = z.infer<
  typeof wardAgeWiseFirstChildBirthAgeSchema
>;
export type UpdateWardAgeWiseFirstChildBirthAgeData =
  WardAgeWiseFirstChildBirthAgeData;
export type WardAgeWiseFirstChildBirthAgeFilter = z.infer<
  typeof wardAgeWiseFirstChildBirthAgeFilterSchema
>;

// Export the first child birth age group options for use in UI components
export const firstChildBirthAgeGroupOptions = [
  { value: "AGE_15_19", label: "15-19 years" },
  { value: "AGE_20_24", label: "20-24 years" },
  { value: "AGE_25_29", label: "25-29 years" },
  { value: "AGE_30_34", label: "30-34 years" },
  { value: "AGE_35_39", label: "35-39 years" },
  { value: "AGE_40_44", label: "40-44 years" },
  { value: "AGE_45_49", label: "45-49 years" },
];
