import { z } from "zod";

// Define loan use categories to match database enum
export const LoanUseEnum = z.enum([
  "AGRICULTURE",
  "BUSINESS",
  "HOUSEHOLD_EXPENSES",
  "FOREIGN_EMPLOYMENT",
  "EDUCATION",
  "HEALTH_TREATMENT",
  "HOME_CONSTRUCTION",
  "VEHICLE_PURCHASE",
  "CEREMONY",
  "OTHER",
]);

// Labels for loan use categories
export const loanUseLabels: Record<string, string> = {
  AGRICULTURE: "कृषि",
  BUSINESS: "व्यापार / व्यवसाय",
  HOUSEHOLD_EXPENSES: "घरायसी खर्च",
  FOREIGN_EMPLOYMENT: "वैदेशिक रोजगारी",
  EDUCATION: "शिक्षा",
  HEALTH_TREATMENT: "स्वास्थ्य उपचार",
  HOME_CONSTRUCTION: "घर निर्माण",
  VEHICLE_PURCHASE: "सवारी साधन खरिद",
  CEREMONY: "बिहे / विवाह",
  OTHER: "अन्य",
};

// Base schema for ward wise households loan use
export const wardWiseHouseholdsLoanUseBaseSchema = z.object({
  loanUse: LoanUseEnum,
  households: z.number(),
});

// Schema for adding ward wise households loan use
export const addWardWiseHouseholdsLoanUseSchema = z.object({
  wardNumber: z.number(),
  data: z.array(
    z.object({
      loanUse: LoanUseEnum,
      households: z.number(),
    }),
  ),
});

// Schema for getting ward wise households loan use
export const getWardWiseHouseholdsLoanUseSchema = z.object({
  wardNumber: z.number().optional(),
});

// Schema for batch adding ward wise households loan use
export const batchAddWardWiseHouseholdsLoanUseSchema = z.object({
  data: z.array(
    z.object({
      wardNumber: z.number(),
      loanUses: z.array(
        z.object({
          loanUse: LoanUseEnum,
          households: z.number(),
        }),
      ),
    }),
  ),
});
