import { z } from "zod";

// Define the migration origin enum for validation
export const MigratedFromEnum = z.enum([
  "ANOTHER_DISTRICT",
  "SAME_DISTRICT_ANOTHER_MUNICIPALITY",
  "ABROAD",
]);
export type MigratedFrom = z.infer<typeof MigratedFromEnum>;

// Schema for ward-wise migrated households data
export const wardWiseMigratedHouseholdsSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  migratedFrom: MigratedFromEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise migrated households data
export const wardWiseMigratedHouseholdsFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  migratedFrom: MigratedFromEnum.optional(),
});

export const updateWardWiseMigratedHouseholdsSchema = 
  wardWiseMigratedHouseholdsSchema;

export type WardWiseMigratedHouseholdsData = z.infer<
  typeof wardWiseMigratedHouseholdsSchema
>;
export type UpdateWardWiseMigratedHouseholdsData =
  WardWiseMigratedHouseholdsData;
export type WardWiseMigratedHouseholdsFilter = z.infer<
  typeof wardWiseMigratedHouseholdsFilterSchema
>;
