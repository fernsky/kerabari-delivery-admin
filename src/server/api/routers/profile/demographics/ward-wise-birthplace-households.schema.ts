import { z } from "zod";

// Define the birth place enum for validation
export const BirthPlaceEnum = z.enum([
  "SAME_MUNICIPALITY",
  "SAME_DISTRICT_ANOTHER_MUNICIPALITY",
  "ANOTHER_DISTRICT",
  "ABROAD",
]);
export type BirthPlace = z.infer<typeof BirthPlaceEnum>;

// Schema for ward-wise birthplace households data
export const wardWiseBirthplaceHouseholdsSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  birthPlace: BirthPlaceEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise birthplace households data
export const wardWiseBirthplaceHouseholdsFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  birthPlace: BirthPlaceEnum.optional(),
});

export const updateWardWiseBirthplaceHouseholdsSchema = 
  wardWiseBirthplaceHouseholdsSchema;

export type WardWiseBirthplaceHouseholdsData = z.infer<
  typeof wardWiseBirthplaceHouseholdsSchema
>;
export type UpdateWardWiseBirthplaceHouseholdsData =
  WardWiseBirthplaceHouseholdsData;
export type WardWiseBirthplaceHouseholdsFilter = z.infer<
  typeof wardWiseBirthplaceHouseholdsFilterSchema
>;
