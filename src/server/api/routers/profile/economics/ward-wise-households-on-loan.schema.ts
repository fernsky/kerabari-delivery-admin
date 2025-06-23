import { z } from "zod";

// Base schema for ward wise households on loan
export const wardWiseHouseholdsOnLoanBaseSchema = z.object({
  households: z.number(),
});

// Schema for adding ward wise households on loan
export const addWardWiseHouseholdsOnLoanSchema = z.object({
  wardNumber: z.number(),
  households: z.number(),
});

// Schema for getting ward wise households on loan
export const getWardWiseHouseholdsOnLoanSchema = z.object({
  wardNumber: z.number().optional(),
});

// Schema for batch adding ward wise households on loan
export const batchAddWardWiseHouseholdsOnLoanSchema = z.object({
  data: z.array(
    z.object({
      wardNumber: z.number(),
      households: z.number(),
    }),
  ),
});
