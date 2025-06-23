import { pgTable } from "../../../../../schema/basic";
import {
  integer,
  timestamp,
  varchar,
  text,
  boolean,
  pgEnum,
  decimal,
  jsonb,
  time,
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define health post type enum
export const healthPostTypeEnum = pgEnum("health_post_type", [
  "PRIMARY_HEALTH_POST",
  "SUB_HEALTH_POST",
  "COMMUNITY_HEALTH_UNIT",
  "URBAN_HEALTH_CENTER",
  "HEALTH_POST_WITH_BIRTHING_CENTER",
  "AYURVEDIC_HEALTH_POST",
  "MOBILE_HEALTH_POST",
  "OTHER",
]);

// Define facility condition enum
export const healthPostConditionEnum = pgEnum("health_post_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_MAINTENANCE",
  "POOR",
  "UNDER_CONSTRUCTION",
  "UNDER_RENOVATION",
  "TEMPORARY",
]);

// Define service availability enum
export const healthPostServiceAvailabilityEnum = pgEnum(
  "service_availability",
  [
    "DAILY",
    "WEEKDAYS_ONLY",
    "SPECIFIC_DAYS",
    "EMERGENCY_ONLY",
    "SEASONAL",
    "LIMITED_HOURS",
    "TWENTY_FOUR_HOURS",
  ],
);

// Define management type enum
export const healthPostManagementEnum = pgEnum("health_post_management", [
  "GOVERNMENT",
  "COMMUNITY_MANAGED",
  "PRIVATE_PUBLIC_PARTNERSHIP",
  "NGO_MANAGED",
  "FAITH_BASED",
  "OTHER",
]);

// Define equipment condition enum
export const equipmentConditionEnum = pgEnum("equipment_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_MAINTENANCE",
  "OUTDATED",
  "NON_FUNCTIONAL",
]);

// Define service adequacy enum
export const serviceAdequacyEnum = pgEnum("service_adequacy", [
  "HIGHLY_ADEQUATE",
  "ADEQUATE",
  "SOMEWHAT_ADEQUATE",
  "INADEQUATE",
  "SEVERELY_INADEQUATE",
]);

// Health Post table
export const healthPost = pgTable("health_post", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  healthPostType: healthPostTypeEnum("health_post_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  establishedDate: date("established_date"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  managementType: healthPostManagementEnum("management_type").notNull(),
  parentFacilityId: varchar("parent_facility_id", { length: 36 }), // Linked to district hospital or PHC
  catchmentPopulation: integer("catchment_population"),
  catchmentAreaDescription: text("catchment_area_description"),
  serviceAvailability: healthPostServiceAvailabilityEnum(
    "service_availability",
  ),

  // Leadership and management
  inChargeTitle: text("in_charge_title"), // e.g., "Health Assistant"
  inChargeName: text("in_charge_name"),
  inChargeContactNumber: text("in_charge_contact_number"),
  supervisingOfficer: text("supervising_officer"),
  supervisingEntity: text("supervising_entity"), // e.g., "District Health Office"
  hasManagementCommittee: boolean("has_management_committee").default(false),
  managementCommitteeDetails: text("management_committee_details"),

  // Contact information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  emergencyContactNumber: text("emergency_contact_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Operating hours
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  is24HourService: boolean("is_24_hour_service").default(false),
  weeklyOffDay: text("weekly_off_day"), // E.g., "Saturday" or "Sunday"
  serviceHoursPerWeek: integer("service_hours_per_week"),
  hasEmergencyServices: boolean("has_emergency_services").default(false),
  emergencyServiceDetails: text("emergency_service_details"),

  // Facility details
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", etc.
  buildingCondition: healthPostConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  totalFloors: integer("total_floors"),
  totalRooms: integer("total_rooms"),
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
  hasAdequateWaitingArea: boolean("has_adequate_waiting_area").default(false),
  hasToilets: boolean("has_toilets").default(true),
  hasSeparateToiletsForGenders: boolean(
    "has_separate_toilets_for_genders",
  ).default(false),
  hasPatientPrivacy: boolean("has_patient_privacy").default(false),
  hasWheelchairAccess: boolean("has_wheelchair_access").default(false),
  hasElectricity: boolean("has_electricity").default(true),
  electricityAvailabilityHoursPerDay: integer(
    "electricity_availability_hours_per_day",
  ),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"), // E.g., "Generator", "Solar", "UPS"
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterSourceType: text("water_source_type"), // E.g., "Piped", "Well", "Tanker"
  waterAvailability: text("water_availability"),
  hasBirthing: boolean("has_birthing_center").default(false),
  hasLaboratory: boolean("has_laboratory").default(false),
  hasPharmacy: boolean("has_pharmacy").default(false),
  hasWasteManagement: boolean("has_waste_management").default(false),
  wasteManagementDetails: text("waste_management_details"),
  hasHandwashingFacility: boolean("has_handwashing_facility").default(false),
  isCovid19Ready: boolean("is_covid19_ready").default(false),
  facilityCondition: text("facility_condition"),
  hasFurniture: boolean("has_furniture").default(true),
  furnitureCondition: text("furniture_condition"),

  // Staff details
  totalStaffCount: integer("total_staff_count"),
  healthAssistantCount: integer("health_assistant_count"),
  anmCount: integer("anm_count"), // Auxiliary Nurse Midwife
  ahwCount: integer("ahw_count"), // Auxiliary Health Worker
  mchWorkerCount: integer("mch_worker_count"), // Maternal Child Health Worker
  vaccinatorCount: integer("vaccinator_count"),
  supportStaffCount: integer("support_staff_count"),
  volunteerCount: integer("volunteer_count"),
  femaleChtCount: integer("female_cht_count"), // Community Health Worker
  maleChtCount: integer("male_cht_count"),
  anyStaffShortageCurrent: boolean("any_staff_shortage_current").default(false),
  staffShortageDetails: text("staff_shortage_details"),
  staffTrainingStatus: text("staff_training_status"),
  staffResidencyAvailable: boolean("staff_residency_available").default(false),

  // Services offered
  generalHealthServices: boolean("general_health_services").default(true),
  maternalHealthServices: boolean("maternal_health_services").default(true),
  childHealthServices: boolean("child_health_services").default(true),
  immunizationServices: boolean("immunization_services").default(true),
  familyPlanningServices: boolean("family_planning_services").default(true),
  nutritionServices: boolean("nutrition_services").default(true),
  tuberculosisServices: boolean("tuberculosis_services").default(true),
  hivServices: boolean("hiv_services").default(false),
  mentalHealthServices: boolean("mental_health_services").default(false),
  geriatricServices: boolean("geriatric_services").default(false),
  laboratoryConductsTests: boolean("laboratory_conducts_tests").default(false),
  laboratoryTestTypes: text("laboratory_test_types"),
  regularVaccinationDays: text("regular_vaccination_days"),
  antenatalCareServices: boolean("antenatal_care_services").default(true),
  postNatalCareServices: boolean("post_natal_care_services").default(true),
  outreachClinicsHeldMonthly: integer("outreach_clinics_held_monthly"),
  offersTelemedicine: boolean("offers_telemedicine").default(false),
  telemedicineDetails: text("telemedicine_details"),
  referralServices: boolean("referral_services").default(true),
  referralDestination: text("referral_destination"),
  ambulanceAccessible: boolean("ambulance_accessible").default(false),
  ambulanceContactNumber: text("ambulance_contact_number"),
  hasReferralProtocols: boolean("has_referral_protocols").default(false),
  additionalServices: text("additional_services"),

  // Equipment and medications
  hasBasicEquipment: boolean("has_basic_equipment").default(true),
  basicEquipmentCondition: equipmentConditionEnum("basic_equipment_condition"),
  hasDiagnosticEquipment: boolean("has_diagnostic_equipment").default(false),
  diagnosticEquipmentDetail: text("diagnostic_equipment_detail"),
  hasColdChain: boolean("has_cold_chain").default(false),
  coldChainCondition: equipmentConditionEnum("cold_chain_condition"),
  hasEssentialMedicines: boolean("has_essential_medicines").default(true),
  essentialMedicinesAvailability: text("essential_medicines_availability"),
  medicineStockoutFrequency: text("medicine_stockout_frequency"),
  hasPrenatalVitamins: boolean("has_prenatal_vitamins").default(true),
  hasOralRehydrationTherapy: boolean("has_oral_rehydration_therapy").default(
    true,
  ),
  hasAntibiotics: boolean("has_antibiotics").default(true),
  hasAntimalarials: boolean("has_antimalarials").default(false),
  hasBasicAnesthesia: boolean("has_basic_anesthesia").default(false),
  hasOxygenSupply: boolean("has_oxygen_supply").default(false),
  drugInventorySystem: text("drug_inventory_system"),
  regularMedicineSupplyFrequency: text("regular_medicine_supply_frequency"),

  // Performance and utilization
  averageMonthlyOutpatients: integer("average_monthly_outpatients"),
  averageMonthlyAntenatalVisits: integer("average_monthly_antenatal_visits"),
  averageMonthlyDeliveries: integer("average_monthly_deliveries"),
  averageMonthlyChildCheckups: integer("average_monthly_child_checkups"),
  averageMonthlyFamilyPlanning: integer("average_monthly_family_planning"),
  averageMonthlyImmunization: integer("average_monthly_immunization"),
  serviceUtilizationTrend: text("service_utilization_trend"),
  performanceEvaluationSystem: text("performance_evaluation_system"),
  lastPerformanceReviewDate: date("last_performance_review_date"),
  patientSatisfactionMeasured: boolean("patient_satisfaction_measured").default(
    false,
  ),
  patientSatisfactionLevel: text("patient_satisfaction_level"),

  // Health information system
  hasRecordKeepingSystem: boolean("has_record_keeping_system").default(true),
  recordKeepingType: text("record_keeping_type"), // Paper-based, Electronic, Mixed
  hasElectronicHealthRecords: boolean("has_electronic_health_records").default(
    false,
  ),
  electronicSystemDetails: text("electronic_system_details"),
  usesHMIS: boolean("uses_hmis").default(false), // Health Management Information System
  hasInternetForReporting: boolean("has_internet_for_reporting").default(false),
  reportingFrequency: text("reporting_frequency"),
  lastReportingDate: date("last_reporting_date"),
  hasSurveillanceSystem: boolean("has_surveillance_system").default(false),
  surveillanceDetails: text("surveillance_details"),

  // Community engagement
  hasCommunityOutreach: boolean("has_community_outreach").default(false),
  outreachActivities: text("outreach_activities"),
  fchvCount: integer("fchv_count"), // Female Community Health Volunteer
  fchvActivePercent: decimal("fchv_active_percent", { precision: 5, scale: 2 }),
  motherGroupsActive: boolean("mother_groups_active").default(false),
  motherGroupCount: integer("mother_group_count"),
  healthEducationSessions: boolean("health_education_sessions").default(false),
  healthEducationFrequency: text("health_education_frequency"),
  schoolHealthProgram: boolean("school_health_program").default(false),
  communityBasedActivities: text("community_based_activities"),
  communityFeedbackMechanism: boolean("community_feedback_mechanism").default(
    false,
  ),
  feedbackMechanismDetails: text("feedback_mechanism_details"),

  // Budget and finance
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  budgetFiscalYear: varchar("budget_fiscal_year", { length: 9 }), // E.g., "2079/080"
  governmentFundingPercent: decimal("government_funding_percent", {
    precision: 5,
    scale: 2,
  }),
  donorFundingPercent: decimal("donor_funding_percent", {
    precision: 5,
    scale: 2,
  }),
  localFundingPercent: decimal("local_funding_percent", {
    precision: 5,
    scale: 2,
  }),
  userFeesCollected: boolean("user_fees_collected").default(false),
  freeServiceAvailability: text("free_service_availability"),
  annualExpenditureNPR: decimal("annual_expenditure_npr", {
    precision: 18,
    scale: 2,
  }),
  financialManagementSystem: text("financial_management_system"),

  // Supplies and logistics
  supplyChainMechanism: text("supply_chain_mechanism"),
  medicineSupplierType: text("medicine_supplier_type"), // Government, Private, Mixed
  supplyFrequency: text("supply_frequency"),
  stockoutFrequency: text("stockout_frequency"), // Rarely, Sometimes, Often, etc.
  inventoryManagementSystem: text("inventory_management_system"),
  logisticsSupport: text("logistics_support"),
  lastSupplyReceivedDate: date("last_supply_received_date"),

  // Challenges and needs
  infrastructureChallenges: text("infrastructure_challenges"),
  staffingChallenges: text("staffing_challenges"),
  supplyChallenges: text("supply_challenges"),
  serviceChallenges: text("service_challenges"),
  otherChallenges: text("other_challenges"),
  priorityNeeds: text("priority_needs"),
  serviceImprovementPlans: text("service_improvement_plans"),

  // Monitoring and quality assurance
  regulatoryCompliance: boolean("regulatory_compliance").default(true),
  lastSupervisionDate: date("last_supervision_date"),
  supervisionFrequency: text("supervision_frequency"),
  supervisingAuthority: text("supervising_authority"),
  qualityImprovementSystem: boolean("quality_improvement_system").default(
    false,
  ),
  qualityImprovementDetails: text("quality_improvement_details"),
  patientSafetyMeasures: text("patient_safety_measures"),
  infectionControlProtocols: boolean("infection_control_protocols").default(
    false,
  ),
  wasteDisposalSystem: text("waste_disposal_system"),

  // Partnerships and coordination
  partnershipWithNGOs: boolean("partnership_with_ngos").default(false),
  partnerNGODetails: text("partner_ngo_details"),
  localCoordinationMechanism: text("local_coordination_mechanism"),
  healthSystemIntegration: text("health_system_integration"),
  privateSectorCoordination: boolean("private_sector_coordination").default(
    false,
  ),
  communityGroupCoordination: boolean("community_group_coordination").default(
    false,
  ),
  referralNetworkStrength: text("referral_network_strength"),

  // Service adequacy and quality
  serviceAdequacy: serviceAdequacyEnum("service_adequacy"),
  serviceQuality: text("service_quality"),
  patientFeedback: text("patient_feedback"),
  communityPerception: text("community_perception"),
  staffSatisfaction: text("staff_satisfaction"),

  // Disaster preparedness
  disasterPreparedness: boolean("disaster_preparedness").default(false),
  disasterPlanDetails: text("disaster_plan_details"),
  emergencyResponseCapability: text("emergency_response_capability"),
  disasterTrainingForStaff: boolean("disaster_training_for_staff").default(
    false,
  ),
  emergencySuppliesAvailable: boolean("emergency_supplies_available").default(
    false,
  ),

  // Future development
  expansionPlans: text("expansion_plans"),
  plannedUpgrades: text("planned_upgrades"),
  serviceEnhancementPlans: text("service_enhancement_plans"),
  communityFuturePlans: text("community_future_plans"),
  sustainabilityPlans: text("sustainability_plans"),

  // Linkages to other entities
  linkedReferralCenters: jsonb("linked_referral_centers").default(
    sql`'[]'::jsonb`,
  ),
  linkedCommunityCenters: jsonb("linked_community_centers").default(
    sql`'[]'::jsonb`,
  ),
  linkedSchools: jsonb("linked_schools").default(sql`'[]'::jsonb`),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  catchmentAreaPolygon: geometry("catchment_area_polygon", {
    type: "MultiPolygon",
  }),

  // Status and metadata
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  verificationDate: timestamp("verification_date"),
  verifiedBy: varchar("verified_by", { length: 36 }),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type HealthPost = typeof healthPost.$inferSelect;
export type NewHealthPost = typeof healthPost.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
