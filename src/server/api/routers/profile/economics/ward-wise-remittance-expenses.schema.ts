import { z } from "zod";

// Define the remittance expense type enum for validation
export const RemittanceExpenseTypeEnum = z.enum([
  "EDUCATION",
  "HEALTH",
  "HOUSEHOLD_USE",
  "FESTIVALS",
  "LOAN_PAYMENT",
  "LOANED_OTHERS",
  "SAVING",
  "HOUSE_CONSTRUCTION",
  "LAND_OWNERSHIP",
  "JEWELRY_PURCHASE",
  "GOODS_PURCHASE",
  "BUSINESS_INVESTMENT",
  "OTHER",
  "UNKNOWN",
]);
export type RemittanceExpenseType = z.infer<typeof RemittanceExpenseTypeEnum>;

// Define Nepali remittance expense names for display
export const remittanceExpenseLabels: Record<string, string> = {
  EDUCATION: "शिक्षा",
  HEALTH: "स्वास्थ्य",
  HOUSEHOLD_USE: "घरायसी प्रयोग",
  FESTIVALS: "चाडपर्व",
  LOAN_PAYMENT: "ऋण भुक्तानी",
  LOANED_OTHERS: "अरूलाई ऋण दिएको",
  SAVING: "बचत",
  HOUSE_CONSTRUCTION: "घर निर्माण",
  LAND_OWNERSHIP: "जग्गा खरिद",
  JEWELRY_PURCHASE: "गहना खरिद",
  GOODS_PURCHASE: "सामान खरिद",
  BUSINESS_INVESTMENT: "व्यवसायमा लगानी",
  OTHER: "अन्य",
  UNKNOWN: "थाहा छैन",
};

// Schema for ward-wise remittance expense data
export const wardWiseRemittanceExpensesSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  remittanceExpense: RemittanceExpenseTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise remittance expense data
export const wardWiseRemittanceExpensesFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  remittanceExpense: RemittanceExpenseTypeEnum.optional(),
});

export const updateWardWiseRemittanceExpensesSchema =
  wardWiseRemittanceExpensesSchema;

export type WardWiseRemittanceExpensesData = z.infer<
  typeof wardWiseRemittanceExpensesSchema
>;
export type UpdateWardWiseRemittanceExpensesData =
  WardWiseRemittanceExpensesData;
export type WardWiseRemittanceExpensesFilter = z.infer<
  typeof wardWiseRemittanceExpensesFilterSchema
>;
