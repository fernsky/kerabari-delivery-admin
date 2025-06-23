import { z } from "zod";

// Define the educational level type enum to match the database enum
export const EducationalLevelTypeEnum = z.enum([
  "CHILD_DEVELOPMENT_CENTER",
  "NURSERY",
  "GRADE_1",
  "GRADE_2",
  "GRADE_3",
  "GRADE_4",
  "GRADE_5",
  "GRADE_6",
  "GRADE_7",
  "GRADE_8",
  "GRADE_9",
  "GRADE_10",
  "SLC_LEVEL",
  "CLASS_12_LEVEL",
  "BACHELOR_LEVEL",
  "MASTERS_LEVEL",
  "PHD_LEVEL",
  "INFORMAL_EDUCATION",
  "OTHER",
  "EDUCATED",
  "UNKNOWN",
]);
export type EducationalLevelType = z.infer<typeof EducationalLevelTypeEnum>;

// Schema for ward-wise educational level data
export const wardWiseEducationalLevelSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  educationalLevelType: EducationalLevelTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise educational level data
export const wardWiseEducationalLevelFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  educationalLevelType: EducationalLevelTypeEnum.optional(),
});

export const updateWardWiseEducationalLevelSchema =
  wardWiseEducationalLevelSchema;

export type WardWiseEducationalLevelData = z.infer<
  typeof wardWiseEducationalLevelSchema
>;
export type UpdateWardWiseEducationalLevelData = WardWiseEducationalLevelData;
export type WardWiseEducationalLevelFilter = z.infer<
  typeof wardWiseEducationalLevelFilterSchema
>;

// Export the educational level types for use in UI components
export const educationalLevelOptions = [
  {
    value: "CHILD_DEVELOPMENT_CENTER",
    label: "बालविकास केन्द्र / मंटेस्वोरी",
  },
  { value: "NURSERY", label: "नर्सरी/केजी" },
  { value: "GRADE_1", label: "कक्षा १" },
  { value: "GRADE_2", label: "कक्षा २" },
  { value: "GRADE_3", label: "कक्षा ३" },
  { value: "GRADE_4", label: "कक्षा ४" },
  { value: "GRADE_5", label: "कक्षा ५" },
  { value: "GRADE_6", label: "कक्षा ६" },
  { value: "GRADE_7", label: "कक्षा ७" },
  { value: "GRADE_8", label: "कक्षा ८" },
  { value: "GRADE_9", label: "कक्षा ९" },
  { value: "GRADE_10", label: "कक्षा १०" },
  { value: "SLC_LEVEL", label: "एसईई/एसएलसी/सो सरह" },
  {
    value: "CLASS_12_LEVEL",
    label: "कक्षा १२ वा PCL वा सो सरह",
  },
  { value: "BACHELOR_LEVEL", label: "स्नातक वा सो सरह" },
  { value: "MASTERS_LEVEL", label: "स्नातकोत्तर वा सो सरह" },
  { value: "PHD_LEVEL", label: "पीएचडी वा सो सरह" },
  {
    value: "INFORMAL_EDUCATION",
    label: "अनौपचारिक शिक्षा",
  },
  { value: "OTHER", label: "अन्य" },
  { value: "EDUCATED", label: "साक्षर" },
  { value: "UNKNOWN", label: "थाहा नभएको" },
];
