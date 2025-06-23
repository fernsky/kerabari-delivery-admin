import { z } from "zod";

// Define the religion type enum to match the database enum
export const ReligionTypeEnum = z.enum([
  "HINDU",
  "BUDDHIST",
  "KIRANT",
  "CHRISTIAN",
  "ISLAM",
  "NATURE",
  "BON",
  "JAIN",
  "BAHAI",
  "SIKH",
  "OTHER",
]);
export type ReligionType = z.infer<typeof ReligionTypeEnum>;

// Schema for ward-wise religion population data
export const wardWiseReligionPopulationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  religionType: ReligionTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise religion population data
export const wardWiseReligionPopulationFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  religionType: ReligionTypeEnum.optional(),
});

export const updateWardWiseReligionPopulationSchema =
  wardWiseReligionPopulationSchema;

export type WardWiseReligionPopulationData = z.infer<
  typeof wardWiseReligionPopulationSchema
>;
export type UpdateWardWiseReligionPopulationData =
  WardWiseReligionPopulationData;
export type WardWiseReligionPopulationFilter = z.infer<
  typeof wardWiseReligionPopulationFilterSchema
>;
