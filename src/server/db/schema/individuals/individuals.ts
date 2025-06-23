import {
  pgTable,
  text,
  integer,
  timestamp,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { postgis } from "../../postgis";
import { households } from "../households/households";

// Enum for education levels
export const educationLevelEnum = pgEnum("education_level_enum", [
  "none",
  "primary",
  "secondary",
  "higher_secondary",
  "bachelor",
  "masters",
  "phd",
  "other",
]);

// Main individuals table
export const individuals = pgTable("acme_khajura_individuals", {
  // Primary identification
  id: text("id").primaryKey().notNull(),
  tenantId: text("tenant_id"),
  parentId: text("parent_id").notNull().references(() => households.id),
  wardNo: integer("ward_no").notNull(),
  deviceId: text("device_id"),
  
  // Personal information
  name: text("name").notNull(),
  gender: text("gender").notNull(),
  age: integer("age"),
  familyRole: text("family_role"),
  
  // Citizenship and demographics
  citizenOf: text("citizen_of"),
  citizenOfOther: text("citizen_of_other"),
  caste: text("caste"),
  casteOther: text("caste_other"),
  
  // Language and religion
  ancestorLanguage: text("ancestor_language"),
  ancestorLanguageOther: text("ancestor_language_other"),
  primaryMotherTongue: text("primary_mother_tongue"),
  primaryMotherTongueOther: text("primary_mother_tongue_other"),
  religion: text("religion"),
  religionOther: text("religion_other"),
  
  // Marital status
  maritalStatus: text("marital_status"),
  marriedAge: integer("married_age"),
  
  // Health information
  hasChronicDisease: text("has_chronic_disease"),
  primaryChronicDisease: text("primary_chronic_disease"),
  isSanitized: text("is_sanitized"),
  
  // Disability information
  isDisabled: text("is_disabled"),
  disabilityType: text("disability_type"),
  disabilityTypeOther: text("disability_type_other"),
  disabilityCause: text("disability_cause"),
  
  // Birth and children information
  hasBirthCertificate: text("has_birth_certificate"),
  gaveLiveBirth: text("gave_live_birth"),
  aliveSons: integer("alive_sons"),
  aliveDaughters: integer("alive_daughters"),
  totalBornChildren: integer("total_born_children"),
  hasDeadChildren: text("has_dead_children"),
  deadSons: integer("dead_sons"),
  deadDaughters: integer("dead_daughters"),
  totalDeadChildren: integer("total_dead_children"),
  
  // Recent childbirth information
  gaveRecentLiveBirth: text("gave_recent_live_birth"),
  recentBornSons: integer("recent_born_sons"),
  recentBornDaughters: integer("recent_born_daughters"),
  totalRecentChildren: integer("total_recent_children"),
  recentDeliveryLocation: text("recent_delivery_location"),
  prenatalCheckups: integer("prenatal_checkups"),
  firstDeliveryAge: integer("first_delivery_age"),
  
  // Presence and absence information
  isPresent: text("is_present"),
  absenteeAge: integer("absentee_age"),
  absenteeEducationalLevel: text("absentee_educational_level"),
  absenceReason: text("absence_reason"),
  absenteeLocation: text("absentee_location"),
  absenteeProvince: text("absentee_province"),
  absenteeDistrict: text("absentee_district"),
  absenteeCountry: text("absentee_country"),
  absenteeHasSentCash: text("absentee_has_sent_cash"),
  absenteeCashAmount: integer("absentee_cash_amount"),
  
  // Education information
  literacyStatus: text("literacy_status"),
  schoolPresenceStatus: text("school_presence_status"),
  educationalLevel: text("educational_level"),
  primarySubject: text("primary_subject"),
  goesSchool: text("goes_school"),
  schoolBarrier: text("school_barrier"),
  
  // Skills and training
  hasTraining: text("has_training"),
  training: text("training"),
  monthsTrained: integer("months_trained"),
  primarySkill: text("primary_skill"),
  
  // Internet access
  hasInternetAccess: text("has_internet_access"),
  
  // Employment information
  financialWorkDuration: text("financial_work_duration"),
  primaryOccupation: text("primary_occupation"),
  workBarrier: text("work_barrier"),
  workAvailability: text("work_availability"),
  
  // GIS data
  geom: postgis("geom"),
});

// Staging table for data validation
export const stagingIndividuals = pgTable("staging_acme_khajura_individuals", {
  // Copy the same structure as the main individuals table
  id: text("id").primaryKey().notNull(),
  tenantId: text("tenant_id"),
  parentId: text("parent_id").notNull(),
  wardNo: integer("ward_no").notNull(),
  deviceId: text("device_id"),
  
  name: text("name").notNull(),
  gender: text("gender").notNull(),
  age: integer("age"),
  familyRole: text("family_role"),
  
  citizenOf: text("citizen_of"),
  citizenOfOther: text("citizen_of_other"),
  caste: text("caste"),
  casteOther: text("caste_other"),
  
  ancestorLanguage: text("ancestor_language"),
  ancestorLanguageOther: text("ancestor_language_other"),
  primaryMotherTongue: text("primary_mother_tongue"),
  primaryMotherTongueOther: text("primary_mother_tongue_other"),
  religion: text("religion"),
  religionOther: text("religion_other"),
  
  maritalStatus: text("marital_status"),
  marriedAge: integer("married_age"),
  
  hasChronicDisease: text("has_chronic_disease"),
  primaryChronicDisease: text("primary_chronic_disease"),
  isSanitized: text("is_sanitized"),
  
  isDisabled: text("is_disabled"),
  disabilityType: text("disability_type"),
  disabilityTypeOther: text("disability_type_other"),
  disabilityCause: text("disability_cause"),
  
  hasBirthCertificate: text("has_birth_certificate"),
  gaveLiveBirth: text("gave_live_birth"),
  aliveSons: integer("alive_sons"),
  aliveDaughters: integer("alive_daughters"),
  totalBornChildren: integer("total_born_children"),
  hasDeadChildren: text("has_dead_children"),
  deadSons: integer("dead_sons"),
  deadDaughters: integer("dead_daughters"),
  totalDeadChildren: integer("total_dead_children"),
  
  gaveRecentLiveBirth: text("gave_recent_live_birth"),
  recentBornSons: integer("recent_born_sons"),
  recentBornDaughters: integer("recent_born_daughters"),
  totalRecentChildren: integer("total_recent_children"),
  recentDeliveryLocation: text("recent_delivery_location"),
  prenatalCheckups: integer("prenatal_checkups"),
  firstDeliveryAge: integer("first_delivery_age"),
  
  isPresent: text("is_present"),
  absenteeAge: integer("absentee_age"),
  absenteeEducationalLevel: text("absentee_educational_level"),
  absenceReason: text("absence_reason"),
  absenteeLocation: text("absentee_location"),
  absenteeProvince: text("absentee_province"),
  absenteeDistrict: text("absentee_district"),
  absenteeCountry: text("absentee_country"),
  absenteeHasSentCash: text("absentee_has_sent_cash"),
  absenteeCashAmount: integer("absentee_cash_amount"),
  
  literacyStatus: text("literacy_status"),
  schoolPresenceStatus: text("school_presence_status"),
  educationalLevel: text("educational_level"),
  primarySubject: text("primary_subject"),
  goesSchool: text("goes_school"),
  schoolBarrier: text("school_barrier"),
  
  hasTraining: text("has_training"),
  training: text("training"),
  monthsTrained: integer("months_trained"),
  primarySkill: text("primary_skill"),
  
  hasInternetAccess: text("has_internet_access"),
  
  financialWorkDuration: text("financial_work_duration"),
  primaryOccupation: text("primary_occupation"),
  workBarrier: text("work_barrier"),
  workAvailability: text("work_availability"),
  
  geom: postgis("geom"),
});

// Individual edit requests table
export const individualEditRequests = pgTable("acme_khajura_individual_edit_requests", {
  id: varchar("id", { length: 48 }).primaryKey(),
  individualId: varchar("individual_id", { length: 48 }).references(() => individuals.id),
  message: text("message").notNull(),
  requestedAt: timestamp("requested_at").defaultNow(),
});

// Export types for TypeScript
export type Individual = typeof individuals.$inferSelect;
export type NewIndividual = typeof individuals.$inferInsert;
export type StagingIndividual = typeof stagingIndividuals.$inferSelect;
export type IndividualEditRequest = typeof individualEditRequests.$inferSelect;
