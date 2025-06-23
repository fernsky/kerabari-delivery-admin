import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum, real } from "drizzle-orm/pg-core";

// Define safe motherhood indicator type enum
export const safeMotherhoodIndicatorTypeEnum = pgEnum(
  "safe_motherhood_indicator_type",
  [
    "POSTPARTUM_MOTHERS_TWO_PNC_HOME_VISITS",         // 1.18 - % of postpartum mother receiving two PNC home visits
    "PREGNANT_WOMEN_AT_LEAST_ONE_ANC_CHECKUP",        // 1.1 - % of pregnant women who had at least one ANC checkup
    "PREGNANT_WOMEN_RECEIVED_ANTHELMINTHICS",         // 1.4 - Percentage of pregnant women who received anthelminthics
    "POSTPARTUM_WOMEN_REFERRED_OBSTETRIC_COMPLICATIONS", // 1.31 - % of postpartum women referred out due to obstetric complications
    "NORMAL_VAGINAL_DELIVERIES",                      // 1.11 - % of normal vaginal deliveries among reported deliveries
    "NEWBORNS_CHX_APPLIED_AFTER_BIRTH",               // 1.39 - % of newborns who had CHX applied immediately after birth
    "POSTPARTUM_MOTHERS_45DAYS_IRON_FOLIC_ACID",      // 1.19 - % of postpartum mother who received 45 days supply of iron folic acid suppliment
    "POSTPARTUM_MOTHERS_VITAMIN_A",                   // 1.20 - % of postpartum mother who received vitamin A suppliment
    "WOMEN_CONTRACEPTIVES_AFTER_ABORTION",            // 1.45 - % of women who received contraceptives after abortion
    "WOMEN_180DAYS_IRON_FOLIC_ACID_PREGNANCY",        // 1.3 - Percentage of women who received a 180 day supply of Iron Folic Acid during pregnancy
    "PREGNANT_WOMEN_FOUR_ANC_CHECKUPS_PROTOCOL",      // Percentage of pregnant women who had four ANC checkups as per protocol
    "WOMEN_FIRST_ANC_CHECKUP_PROTOCOL",               // 1.47 Percentage of women who had first ANC checkup as per protocol
    "WOMEN_180_CALCIUM_TABLETS_PREGNANCY",            // 1.5 - Percentage of women who received 180 calcium tablets during pregnancy
    "INSTITUTIONAL_DELIVERIES",                       // 1.6 - % of institutional deliveries
    "BIRTHS_ATTENDED_SBA_TRAINED_ANMS",               // 1.8 - % of births attended by a skilled birth attendant (SBA trained ANMs)
    "WOMEN_PNC_WITHIN_24HRS_DELIVERY",                // 1.16 - % of women who received a PNC within 24 hours of delivery
    "NEWBORNS_CHECKUP_24HRS_BIRTH",                   // 1.40 - % of newborns who received a check-up at 24 hours of birth
    "WOMEN_FOUR_POSTNATAL_CHECKUPS_PROTOCOL",         // 1.17 - % of women who had four postnatal check-ups as per protocol
    "NEONATES_FOUR_CHECKUPS_PNC_PROTOCOL",            // 1.41 - % of neonates who received four checkups as per PNC protocol
    "PREGNANT_WOMEN_EIGHT_ANC_VISITS_PROTOCOL",       // 1.2 - Percentage of pregnant women who had at least eight ANC visits as per protocol
    "PREGNANCIES_TERMINATED_INDUCED_PROCEDURE",       // 1.44 - % of pregnancies terminated by induced procedure at health facility
    "NEWBORNS_LOW_BIRTH_WEIGHT",                      // 1.35 - % of newborns with low birth weight (<2.5KG)
    "DELIVERIES_BELOW_20_YEARS_INSTITUTIONAL",        // 1.7 - % of deliveries below 20 years of age among total institutional deliveries
    "NEONATES_BIRTH_ASPHYXIA",                        // 1.37 - % of neonates with birth asphyxia
    "PRETERM_BIRTH",                                  // 1.36 - % of preterm birth
    "STILL_BIRTHS",                                   // 1.42 - % of still births
    "BIRTHS_ATTENDED_NON_SBA_SHP",                    // 1.10 - % of births attended by a health worker other than SBA and SHP
    "NEONATES_CONGENITAL_ANOMALIES",                  // 1.38 - % of neonates with conginital anomalies
    "NEONATAL_MORTALITY_HEALTH_FACILITY",             // 1.43 - % of neonatal mortality (health facility)
    "ASSISTED_VACUUM_FORCEPS_DELIVERIES",             // 1.12 - % of assisted (vaccum or forceps) deliveries
    "DELIVERIES_CAESAREAN_SECTION_REPORTED",          // 1.13 - % of deliveries by caesarean section among reported deliveries
    "DELIVERY_BY_CAESAREAN_SECTION",                  // 1.14 - % of delivery by caesarean section
    "PREGNANT_WOMEN_HOME_BIRTH_MISOPROSTAL",          // 1.15 - % of pregnant women who gave birth at home and used misoprostal
    "WOMEN_TREATED_HAEMORRHAGE",                      // 1.22 - Number of women treated for haemorrhage
    "WOMEN_TREATED_ANTEPARTUM_HAEMORRHAGE",           // 1.22.1 Number of women treated for Antepartum Haemorrhage (APH)
    "WOMEN_TREATED_POSTPARTUM_HAEMORRHAGE",           // 1.22.2 Number of women treated for Postpartum Haemorrhage (PPH)
    "WOMEN_TREATED_ECTOPIC_PREGNANCY",                // 1.23 - Number of women treated for Ectopic pregnancy
    "WOMEN_TREATED_RUPTURED_UTERUS",                  // 1.25 - Number of women treated for ruptured uterus
    "WOMEN_TREATED_PREECLAMPSIA",                     // 1.26 - Number of women treated for Pre-eclampsia
    "WOMEN_TREATED_ECLAMPSIA",                        // 1.27 - Number of women treated for Eclampsia
    "WOMEN_TREATED_RETAINED_PLACENTA",                // 1.28 - Number of women treated for retained Placenta
    "WOMEN_TREATED_PUERPERAL_SEPSIS",                 // 1.29 - Number of women treated for Puerperal Sepsis
    "WOMEN_TREATED_ABORTION_COMPLICATIONS",           // 1.30 - Number of women treated for abortion complications
    "WOMEN_OBSTETRIC_COMPLICATIONS_BLOOD_TRANSFUSION", // 1.32 - % of women with obstetric complication who received a blood transfusion for haemorrage
    "REPORTED_MATERNAL_DEATHS_HEALTH_FACILITY",       // 1.34 - Number of reported maternal deaths at health facility
    "WOMEN_COMPLICATIONS_INDUCED_ABORTION",           // 1.46 - % of women with complications from induced abortion
    "BIRTHS_ATTENDED_SKILLED_HEALTH_PERSONNEL",       // 1.9 - % of births attended by a skilled health personnel (SHP)
    "PREGNANT_WOMEN_FIRST_ANC_CHECKUP_PROTOCOL",      // Percentage of pregnant women who had First ANC checkup as protocal
    "MET_NEED_EMERGENCY_OBSTETRIC_CARE",              // 1.21 - Met need for emergency obstetric care
    "WOMEN_TREATED_PROLONGED_OBSTRUCTED_LABOR",       // 1.24 - Number of women treated for prolonged/ obstructed labor
    "POSTPARTUM_MOTHERS_CS_WOUND_INFECTION"           // 1.33 - % of postpartum mothers with C/S wound infection
  ],
);

export const safeMotherhoodIndicators = pgTable("safe_motherhood_indicators", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Type of safe motherhood indicator
  indicator: safeMotherhoodIndicatorTypeEnum("indicator").notNull(),

  // Year of measurement
  year: integer("year").notNull(),

  // Value of the indicator (percentage or numerical value)
  value: real("value").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type SafeMotherhoodIndicator =
  typeof safeMotherhoodIndicators.$inferSelect;
export type NewSafeMotherhoodIndicator =
  typeof safeMotherhoodIndicators.$inferInsert;
