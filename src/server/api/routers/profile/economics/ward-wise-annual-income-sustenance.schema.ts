import { z } from "zod";

// Months sustained enum values matching the database
export const MonthsSustainedEnum = z.enum([
  "UPTO_THREE_MONTHS",
  "THREE_TO_SIX_MONTHS",
  "SIX_TO_NINE_MONTHS",
  "TWELVE_MONTHS",
]);

export const monthsSustainedLabels = {
  UPTO_THREE_MONTHS: "३ महिनासम्म",
  THREE_TO_SIX_MONTHS: "३-६ महिना",
  SIX_TO_NINE_MONTHS: "६-९ महिना",
  TWELVE_MONTHS: "वर्षभरि",
};

// Base schema for ward wise annual income sustenance
export const wardWiseAnnualIncomeSustenanceBaseSchema = z.object({
  monthsSustained: MonthsSustainedEnum,
  households: z.number(),
});

// Schema for adding ward wise annual income sustenance
export const addWardWiseAnnualIncomeSustenanceSchema = z.object({
  wardNumber: z.number(),
  data: z.array(wardWiseAnnualIncomeSustenanceBaseSchema),
});

// Schema for getting ward wise annual income sustenance
export const getWardWiseAnnualIncomeSustenanceSchema = z.object({
  wardNumber: z.number().optional(),
});

// Schema for batch adding ward wise annual income sustenance
export const batchAddWardWiseAnnualIncomeSustenanceSchema = z.object({
  palika: z.string(), // Kept for reference but not used in DB operations
  data: z.array(
    z.object({
      wardNumber: z.number(),
      monthsSustained: MonthsSustainedEnum,
      households: z.number(),
    }),
  ),
});
