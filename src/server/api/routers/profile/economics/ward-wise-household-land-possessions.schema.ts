import { z } from "zod";

// Base schema for ward wise household land possessions
export const wardWiseHouseholdLandPossessionsBaseSchema = z.object({
  households: z.number().int().nonnegative(),
});

// Schema for adding ward wise household land possessions
export const addWardWiseHouseholdLandPossessionsSchema = z.object({
  wardNumber: z.number().int().nonnegative(),
  households: z.number().int().nonnegative(),
});

// Schema for getting ward wise household land possessions
export const getWardWiseHouseholdLandPossessionsSchema = z.object({
  wardNumber: z.number().int().nonnegative().optional(),
});

// Schema for batch adding ward wise household land possessions
export const batchAddWardWiseHouseholdLandPossessionsSchema = z.object({
  data: z.array(
    z.object({
      wardNumber: z.number().int().nonnegative(),
      households: z.number().int().nonnegative(),
    }),
  ),
});

// Schema for updating ward wise household land possessions
export const updateWardWiseHouseholdLandPossessionsSchema = z.object({
  id: z.string().uuid(),
  households: z.number().int().nonnegative(),
});

// Schema for deleting ward wise household land possessions
export const deleteWardWiseHouseholdLandPossessionsSchema = z.object({
  id: z.string().uuid(),
});
