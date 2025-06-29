import { z } from "zod";

// Define the gender enum values
export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export type Gender = z.infer<typeof GenderEnum>;
export type GenderType = "MALE" | "FEMALE" | "OTHER";
// Schema for ward-wise house head gender data
export const wardWiseHouseHeadGenderSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().min(1).max(20),
  wardName: z.string().optional(),
  gender: GenderEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise house head gender data
export const wardWiseHouseHeadGenderFilterSchema = z.object({
  wardNumber: z.number().int().min(1).max(20).optional(),
  gender: GenderEnum.optional(),
});

export const updateWardWiseHouseHeadGenderSchema =
  wardWiseHouseHeadGenderSchema;

export type WardWiseHouseHeadGenderData = z.infer<
  typeof wardWiseHouseHeadGenderSchema
>;
export type UpdateWardWiseHouseHeadGenderData = WardWiseHouseHeadGenderData;
export type WardWiseHouseHeadGenderFilter = z.infer<
  typeof wardWiseHouseHeadGenderFilterSchema
>;
