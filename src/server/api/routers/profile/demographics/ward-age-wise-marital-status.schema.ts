import { z } from "zod";

// Define the age group enum to match the database enum
export const AgeGroupEnum = z.enum([
  "AGE_BELOW_15",
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
export type AgeGroup = z.infer<typeof AgeGroupEnum>;

// Define the marital status enum to match the database enum
export const MaritalStatusEnum = z.enum([
  "SINGLE",
  "MARRIED",
  "DIVORCED",
  "WIDOWED",
  "SEPARATED",
  "NOT_STATED",
]);
export type MaritalStatus = z.infer<typeof MaritalStatusEnum>;

// Schema for age-wise marital status data
export const ageWiseMaritalStatusSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int(),
  ageGroup: AgeGroupEnum,
  maritalStatus: MaritalStatusEnum,
  population: z.number().int().nonnegative(),
  malePopulation: z.number().int().nonnegative().optional(),
  femalePopulation: z.number().int().nonnegative().optional(),
  otherPopulation: z.number().int().nonnegative().optional(),
});

// Schema for filtering age-wise marital status data
export const ageWiseMaritalStatusFilterSchema = z.object({
  wardNumber: z.number().int().optional(),
  ageGroup: AgeGroupEnum.optional(),
  maritalStatus: MaritalStatusEnum.optional(),
});

export const updateAgeWiseMaritalStatusSchema = ageWiseMaritalStatusSchema;

export type AgeWiseMaritalStatusData = z.infer<
  typeof ageWiseMaritalStatusSchema
>;
export type UpdateAgeWiseMaritalStatusData = AgeWiseMaritalStatusData;
export type AgeWiseMaritalStatusFilter = z.infer<
  typeof ageWiseMaritalStatusFilterSchema
>;

// Helper functions to get display names
export const getAgeGroupDisplayName = (ageGroup: AgeGroup): string => {
  const displayNames: Record<AgeGroup, string> = {
    AGE_BELOW_15: "15 वर्ष भन्दा कम",
    AGE_15_19: "15-19 वर्ष",
    AGE_20_24: "20-24 वर्ष",
    AGE_25_29: "25-29 वर्ष",
    AGE_30_34: "30-34 वर्ष",
    AGE_35_39: "35-39 वर्ष",
    AGE_40_44: "40-44 वर्ष",
    AGE_45_49: "45-49 वर्ष",
    AGE_50_54: "50-54 वर्ष",
    AGE_55_59: "55-59 वर्ष",
    AGE_60_64: "60-64 वर्ष",
    AGE_65_69: "65-69 वर्ष",
    AGE_70_74: "70-74 वर्ष",
    AGE_75_AND_ABOVE: "75 वर्ष र माथि",
  };
  return displayNames[ageGroup] || ageGroup;
};

export const getMaritalStatusDisplayName = (status: MaritalStatus): string => {
  const displayNames: Record<MaritalStatus, string> = {
    SINGLE: "विवाह नभएको",
    MARRIED: "विवाहित",
    DIVORCED: "पारपाचुके",
    WIDOWED: "विधुर/विधवा",
    SEPARATED: "छुट्टिएको",
    NOT_STATED: "उल्लेख नभएको",
  };
  return displayNames[status] || status;
};
