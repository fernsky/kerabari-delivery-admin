import { z } from "zod";

// Income source enum values matching the database
export const IncomeSourceEnum = z.enum([
  "JOB",
  "AGRICULTURE",
  "BUSINESS",
  "INDUSTRY",
  "FOREIGN_EMPLOYMENT",
  "LABOUR",
  "OTHER",
]);



export const incomeSourceLabels = {
  JOB: "नोकरी/जागिर",
  AGRICULTURE: "कृषि",
  BUSINESS: "व्यापार व्यवसाय",
  INDUSTRY: "उद्योग",
  FOREIGN_EMPLOYMENT: "वैदेशिक रोजगारी",
  LABOUR: "ज्याला मजदुरी",
  OTHER: "अन्य",
};



// Base schema for ward wise household income source
export const wardWiseHouseholdIncomeSourceBaseSchema = z.object({
  incomeSource: IncomeSourceEnum,
  households: z.number(),
});

// Schema for adding ward wise household income source
export const addWardWiseHouseholdIncomeSourceSchema = z.object({
  wardNumber: z.number(),
  data: z.array(wardWiseHouseholdIncomeSourceBaseSchema),
});

// Schema for getting ward wise household income source
export const getWardWiseHouseholdIncomeSourceSchema = z.object({
  wardNumber: z.number().optional(),
});

// Schema for batch adding ward wise household income source
export const batchAddWardWiseHouseholdIncomeSourceSchema = z.object({
  data: z.array(
    z.object({
      wardNumber: z.number(),
      incomeSource: IncomeSourceEnum,
      households: z.number(),
    }),
  ),
});
