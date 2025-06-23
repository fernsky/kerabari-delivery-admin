import { z } from "zod";

// Define the enum for financial account types
export const financialAccountTypeEnum = z.enum([
  "BANK",
  "FINANCE",
  "MICRO_FINANCE",
  "COOPERATIVE",
  "NONE",
]);

// Schema for ward-wise financial accounts data
export const wardWiseFinancialAccountsSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  financialAccountType: financialAccountTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise financial accounts data
export const wardWiseFinancialAccountsFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  financialAccountType: financialAccountTypeEnum.optional(),
});

export const updateWardWiseFinancialAccountsSchema = 
  wardWiseFinancialAccountsSchema;

export type WardWiseFinancialAccountsData = z.infer<
  typeof wardWiseFinancialAccountsSchema
>;
export type UpdateWardWiseFinancialAccountsData = 
  WardWiseFinancialAccountsData;
export type WardWiseFinancialAccountsFilter = z.infer<
  typeof wardWiseFinancialAccountsFilterSchema
>;
export type FinancialAccountType = z.infer<
  typeof financialAccountTypeEnum
>;
