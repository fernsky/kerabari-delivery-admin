import { pgTable } from "../../basic";
import { integer, varchar, doublePrecision, timestamp, pgEnum } from "drizzle-orm/pg-core";

// Fiscal year enum (should match the schema file)
export const immunizationFiscalYearEnum = pgEnum("immunization_fiscal_year", [
  "FY_2079_2080",
  "FY_2080_2081",
  "FY_2081_2082",
  "FY_2082_2083",
  "FY_2083_2084",
  "FY_2084_2085",
  "FY_2085_2086",
]);

// Indicator enum (should match the schema file)
export const immunizationIndicatorEnum = pgEnum("immunization_indicator", [
  "DPT_HEPB_HIB1_COVERAGE",
  "OPV1_COVERAGE",
  "PCV1_COVERAGE",
  "ROTA1_COVERAGE",
  "DPT_HEPB_HIB3_COVERAGE",
  "OPV3_COVERAGE",
  "ROTA2_COVERAGE",
  "PLANNED_IMMUNIZATION_SESSIONS_CONDUCTED",
  "PLANNED_IMMUNIZATION_CLINICS_CONDUCTED",
  "HYGIENE_PROMOTION_SESSION_AMONG_ROUTINE_IMMUNIZATION",
  "PCV3_COVERAGE",
  "MEASLES_RUBELLA1_COVERAGE",
  "MEASLES_RUBELLA2_COVERAGE",
  "FULLY_IMMUNIZED_NIP_SCHEDULE",
  "BCG_COVERAGE",
  "TCV_COVERAGE",
  "JE_COVERAGE",
  "FIPV1_COVERAGE",
  "TD2_TD2PLUS_COMPLETED_PREGNANT_WOMEN",
  "VACCINE_WASTAGE_BCG",
  "TD2PLUS_PREGNANT_WOMEN",
  "FIPV2_COVERAGE",
  "TD2_PREGNANT_WOMEN",
  "VACCINE_WASTAGE_JE",
  "VACCINE_WASTAGE_MR",
  "VACCINE_WASTAGE_FIPV",
  "VACCINE_WASTAGE_TCV",
  "MEASLES_INCIDENCE_RATE",
  "VACCINE_WASTAGE_TD",
  "VACCINE_WASTAGE_OPV",
  "VACCINE_WASTAGE_DPT_HEPB_HIB",
  "DPT_HEPB_HIB1_VS_MR2_DROPOUT",
  "PCV_DROPOUT",
  "VACCINE_WASTAGE_PCV",
  "DPT_HEPB_HIB_DROPOUT",
  "VACCINE_WASTAGE_ROTA",
  "HPV1_COVERAGE",
  "HPV2_COVERAGE",
  "MEASLES_RUBELLA_DROPOUT",
  "SERIOUS_AEFI_PERCENT",
  "AES_RATE",
  "NEONATAL_TETANUS_RATE",
  "HPV_DROPOUT",
]);

export const immunizationIndicators = pgTable("immunization_indicators", {
  id: varchar("id", { length: 36 }).primaryKey(),
  fiscalYear: immunizationFiscalYearEnum("fiscal_year").notNull(),
  indicator: immunizationIndicatorEnum("indicator").notNull(),
  value: doublePrecision("value"),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ImmunizationIndicators = typeof immunizationIndicators.$inferSelect;
export type NewImmunizationIndicators = typeof immunizationIndicators.$inferInsert;
