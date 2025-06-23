import { z } from "zod";

// Define the enum for time to financial organization types
export const timeToFinancialOrganizationTypeEnum = z.enum([
  "UNDER_15_MIN",
  "UNDER_30_MIN",
  "UNDER_1_HOUR",
  "1_HOUR_OR_MORE",
]);

// Schema for ward-wise time to financial organization data
export const wardWiseTimeToFinancialOrganizationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  timeToFinancialOrganizationType: timeToFinancialOrganizationTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise time to financial organization data
export const wardWiseTimeToFinancialOrganizationFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  timeToFinancialOrganizationType: timeToFinancialOrganizationTypeEnum.optional(),
});

export const updateWardWiseTimeToFinancialOrganizationSchema = 
  wardWiseTimeToFinancialOrganizationSchema;

export type WardWiseTimeToFinancialOrganizationData = z.infer<
  typeof wardWiseTimeToFinancialOrganizationSchema
>;
export type UpdateWardWiseTimeToFinancialOrganizationData = 
  WardWiseTimeToFinancialOrganizationData;
export type WardWiseTimeToFinancialOrganizationFilter = z.infer<
  typeof wardWiseTimeToFinancialOrganizationFilterSchema
>;
export type TimeToFinancialOrganizationType = z.infer<
  typeof timeToFinancialOrganizationTypeEnum
>;
