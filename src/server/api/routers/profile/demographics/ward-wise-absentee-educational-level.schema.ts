import { z } from "zod";
import { educationalLevelEnum } from "@/server/db/schema/profile/demographics/ward-wise-absentee-educational-level";

// Schema for ward-wise absentee educational level data
export const wardWiseAbsenteeEducationalLevelSchema = z.object({
  id: z.string().optional(),

  // Ward number
  wardNumber: z.number().int().positive(),

  // Educational level category
  educationalLevel: z.enum(educationalLevelEnum.enumValues),

  // Population statistics
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise absentee educational level data
export const wardWiseAbsenteeEducationalLevelFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  educationalLevel: z.enum(educationalLevelEnum.enumValues).optional(),
});

// Schema for creating multiple entries at once (bulk creation)
export const bulkWardWiseAbsenteeEducationalLevelSchema = z.object({
  wardNumber: z.number().int().positive(),
  educationalLevels: z.array(
    z.object({
      educationalLevel: z.enum(educationalLevelEnum.enumValues),
      population: z.number().int().nonnegative(),
    }),
  ),
});

// Use the same schema for updates
export const updateWardWiseAbsenteeEducationalLevelSchema =
  wardWiseAbsenteeEducationalLevelSchema;

// Export TypeScript types for use in the application
export type WardWiseAbsenteeEducationalLevelData = z.infer<
  typeof wardWiseAbsenteeEducationalLevelSchema
>;
export type UpdateWardWiseAbsenteeEducationalLevelData =
  WardWiseAbsenteeEducationalLevelData;
export type WardWiseAbsenteeEducationalLevelFilter = z.infer<
  typeof wardWiseAbsenteeEducationalLevelFilterSchema
>;
export type BulkWardWiseAbsenteeEducationalLevelData = z.infer<
  typeof bulkWardWiseAbsenteeEducationalLevelSchema
>;
