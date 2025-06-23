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
import { phcBuildingConditionEnum } from "./primary-health-centers";

// Define urban health center type enum
export const uhcTypeEnum = pgEnum("uhc_type", [
  "GOVERNMENT",
  "MUNICIPAL",
  "COMMUNITY",
  "PRIVATE",
  "NGO_OPERATED",
  "PUBLIC_PRIVATE_PARTNERSHIP",
  "PROVINCIAL",
  "FEDERAL",
  "OTHER",
]);

// Define urban health center level enum
export const uhcLevelEnum = pgEnum("uhc_level", [
  "PRIMARY_URBAN_HEALTH_CENTER",
  "STANDARD_URBAN_HEALTH_CENTER",
  "COMPREHENSIVE_URBAN_HEALTH_CENTER",
  "SPECIALIZED_URBAN_HEALTH_CENTER",
  "SATELLITE_CLINIC",
  "OUTREACH_CENTER",
  "OTHER",
]);

// Define service capacity enum
export const serviceCapacityEnum = pgEnum("service_capacity", [
  "HIGH",
  "MEDIUM",
  "LOW",
  "INSUFFICIENT",
]);

// Urban Health Center table
export const urbanHealthCenter = pgTable("urban_health_center", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  centerType: uhcTypeEnum("center_type").notNull(),
  centerLevel: uhcLevelEnum("center_level").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  establishedDate: date("established_date"),
  parentInstitutionId: varchar("parent_institution_id", { length: 36 }), // For hierarchical relationship
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // Which govt body it's registered with
  populationServed: integer("population_served"), // Estimated population served
  catchmentAreaDescription: text("catchment_area_description"),
  serviceAreaSqKm: decimal("service_area_sq_km", { precision: 10, scale: 2 }),

  // Leadership and management
  chiefName: text("chief_name"),
  chiefQualification: text("chief_qualification"),
  chiefContactNumber: text("chief_contact_number"),
  managementCommitteeExists: boolean("management_committee_exists").default(
    true,
  ),
  managementCommitteeSize: integer("management_committee_size"),
  managementCommitteeFemaleMembers: integer(
    "management_committee_female_members",
  ),
  managementCommitteeDalitMembers: integer(
    "management_committee_dalit_members",
  ),
  managementCommitteeMarginalizedMembers: integer(
    "management_committee_marginalized_members",
  ),
  managementCommitteeFormationDate: date("management_committee_formation_date"),
  managementCommitteeMeetingFrequency: text(
    "management_committee_meeting_frequency",
  ),

  // Contact information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  emergencyContactNumber: text("emergency_contact_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Social media
  facebookHandle: text("facebook_handle"),
  instagramHandle: text("instagram_handle"),
  twitterHandle: text("twitter_handle"),

  // Operating hours
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  is24HourService: boolean("is_24_hour_service").default(false),
  emergencyServiceAvailable: boolean("emergency_service_available").default(
    true,
  ),
  openOnWeekends: boolean("open_on_weekends").default(true),
  weeklyOffDays: text("weekly_off_days"),
  serviceAvailabilityDetails: text("service_availability_details"),

  // Infrastructure details
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", etc.
  buildingCondition: phcBuildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovationYear: integer("last_renovation_year"),
  totalFloors: integer("total_floors"),
  totalRooms: integer("total_rooms"),
  totalAreaSqm: decimal("total_area_sqm", { precision: 10, scale: 2 }),
  hasAdequateSpace: boolean("has_adequate_space").default(true),
  hasWaitingArea: boolean("has_waiting_area").default(true),
  waitingAreaCapacity: integer("waiting_area_capacity"),
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterSupplySource: text("water_supply_source"),
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"),
  hasHeating: boolean("has_heating").default(false),
  hasCooling: boolean("has_cooling").default(false),
  hasInternetAccess: boolean("has_internet_access").default(false),
  internetConnectionType: text("internet_connection_type"),
  hasTelephoneConnection: boolean("has_telephone_connection").default(true),
  hasParking: boolean("has_parking").default(true),
  hasAmbulanceParking: boolean("has_ambulance_parking").default(false),
  hasRamp: boolean("has_ramp").default(false),
  hasDisabledFriendlyToilets: boolean("has_disabled_friendly_toilets").default(
    false,
  ),
  hasProperSignage: boolean("has_proper_signage").default(true),
  hasReception: boolean("has_reception").default(true),
  hasFireSafetyEquipment: boolean("has_fire_safety_equipment").default(false),
  hasSecuritySystem: boolean("has_security_system").default(false),
  hasCCTV: boolean("has_cctv").default(false),

  // Health services
  generalHealthCheckupAvailable: boolean(
    "general_health_checkup_available",
  ).default(true),
  maternalHealthServicesAvailable: boolean(
    "maternal_health_services_available",
  ).default(true),
  childHealthServicesAvailable: boolean(
    "child_health_services_available",
  ).default(true),
  familyPlanningServicesAvailable: boolean(
    "family_planning_services_available",
  ).default(true),
  immunizationServicesAvailable: boolean(
    "immunization_services_available",
  ).default(true),
  tbProgramAvailable: boolean("tb_program_available").default(true),
  hivProgramAvailable: boolean("hiv_program_available").default(false),
  malariaProgramAvailable: boolean("malaria_program_available").default(false),
  ncdsServicesAvailable: boolean("ncds_services_available").default(true), // Non-communicable diseases
  mentalHealthServicesAvailable: boolean(
    "mental_health_services_available",
  ).default(false),
  laboratoryServicesAvailable: boolean("laboratory_services_available").default(
    true,
  ),
  laboratoryServiceLevel: text("laboratory_service_level"),
  pharmacyAvailable: boolean("pharmacy_available").default(true),
  pharmacyServiceType: text("pharmacy_service_type"),
  emergencyServicesAvailable: boolean("emergency_services_available").default(
    true,
  ),
  ambulanceServiceAvailable: boolean("ambulance_service_available").default(
    false,
  ),
  ambulanceCount: integer("ambulance_count"),
  referralServicesAvailable: boolean("referral_services_available").default(
    true,
  ),
  referralCenters: text("referral_centers"),
  dentalServicesAvailable: boolean("dental_services_available").default(false),
  eyeCareServicesAvailable: boolean("eye_care_services_available").default(
    false,
  ),
  physiotherapyAvailable: boolean("physiotherapy_available").default(false),
  ultrasonographyAvailable: boolean("ultrasonography_available").default(false),
  xrayAvailable: boolean("xray_available").default(false),
  ecgAvailable: boolean("ecg_available").default(false),
  nutritionProgramAvailable: boolean("nutrition_program_available").default(
    true,
  ),
  outreachServicesAvailable: boolean("outreach_services_available").default(
    true,
  ),
  healthEducationServicesAvailable: boolean(
    "health_education_services_available",
  ).default(true),
  specializedServicesAvailable: boolean(
    "specialized_services_available",
  ).default(false),
  specializedServicesDetails: text("specialized_services_details"),
  otherServicesOffered: text("other_services_offered"),

  // Infrastructure and equipment
  hasAdequateEquipment: boolean("has_adequate_equipment").default(true),
  equipmentCondition: text("equipment_condition"),
  hasFunctionalRefrigerator: boolean("has_functional_refrigerator").default(
    true,
  ),
  hasVaccineColdChain: boolean("has_vaccine_cold_chain").default(true),
  hasMedicineStorage: boolean("has_medicine_storage").default(true),
  hasLaboratoryEquipment: boolean("has_laboratory_equipment").default(true),
  laborartoryEquipmentDetails: text("laboratory_equipment_details"),
  hasSterilizationEquipment: boolean("has_sterilization_equipment").default(
    true,
  ),
  hasDeliveryKit: boolean("has_delivery_kit").default(true),
  hasEmergencyEquipment: boolean("has_emergency_equipment").default(true),
  emergencyEquipmentDetails: text("emergency_equipment_details"),
  hasAdequateFurniture: boolean("has_adequate_furniture").default(true),
  hasComputerSystem: boolean("has_computer_system").default(false),
  computerCount: integer("computer_count"),
  usesPaperRecords: boolean("uses_paper_records").default(true),
  usesElectronicRecords: boolean("uses_electronic_records").default(false),
  electronicRecordSystemDetails: text("electronic_record_system_details"),

  // Inpatient services if available
  hasInpatientServices: boolean("has_inpatient_services").default(false),
  totalInpatientBeds: integer("total_inpatient_beds"),
  maleWardBedCount: integer("male_ward_bed_count"),
  femaleWardBedCount: integer("female_ward_bed_count"),
  childWardBedCount: integer("child_ward_bed_count"),
  maternityBedCount: integer("maternity_bed_count"),
  emergencyBedCount: integer("emergency_bed_count"),
  hasIsolationBeds: boolean("has_isolation_beds").default(false),
  isolationBedCount: integer("isolation_bed_count"),
  icuBedCount: integer("icu_bed_count"),
  ventilatorCount: integer("ventilator_count"),
  oxygenSupplyAvailable: boolean("oxygen_supply_available").default(false),
  oxygenSupplyType: text("oxygen_supply_type"),

  // Human resources
  totalStaffCount: integer("total_staff_count"),
  medicalOfficerCount: integer("medical_officer_count"),
  specialistDoctorCount: integer("specialist_doctor_count"),
  specialistTypes: text("specialist_types"),
  nurseCount: integer("nurse_count"),
  anmCount: integer("anm_count"), // Auxiliary Nurse Midwife
  haCount: integer("ha_count"), // Health Assistant
  ahaCount: integer("aha_count"), // Assistant Health Assistant
  labTechnicianCount: integer("lab_technician_count"),
  pharmacistCount: integer("pharmacist_count"),
  publicHealthOfficerCount: integer("public_health_officer_count"),
  administrationStaffCount: integer("administration_staff_count"),
  supportStaffCount: integer("support_staff_count"),
  femaleStaffCount: integer("female_staff_count"),
  maleStaffCount: integer("male_staff_count"),
  sanctionedPositionsCount: integer("sanctioned_positions_count"),
  filledPositionsCount: integer("filled_positions_count"),
  vacantPositionsCount: integer("vacant_positions_count"),
  contractualStaffCount: integer("contractual_staff_count"),
  permanentStaffCount: integer("permanent_staff_count"),
  staffingAdequacy: text("staffing_adequacy"),
  staffTrainingStatus: text("staff_training_status"),
  staffAccommodationAvailable: boolean("staff_accommodation_available").default(
    false,
  ),
  staffAccommodationDetails: text("staff_accommodation_details"),

  // Service statistics
  averageDailyOpd: integer("average_daily_opd"), // Outpatient Department visits
  averageMonthlyOpd: integer("average_monthly_opd"),
  averageMonthlyIpd: integer("average_monthly_ipd"), // Inpatient Department admissions
  averageMonthlyLabTests: integer("average_monthly_lab_tests"),
  averageMonthlyXrays: integer("average_monthly_xrays"),
  averageMonthlyUltrasounds: integer("average_monthly_ultrasounds"),
  annualPatientCount: integer("annual_patient_count"),
  referralRatePercent: decimal("referral_rate_percent", {
    precision: 5,
    scale: 2,
  }),
  bedOccupancyRatePercent: decimal("bed_occupancy_rate_percent", {
    precision: 5,
    scale: 2,
  }),
  averageLengthOfStayDays: decimal("average_length_of_stay_days", {
    precision: 5,
    scale: 2,
  }),
  serviceUtilizationTrend: text("service_utilization_trend"),
  mostCommonDiseases: text("most_common_diseases"),
  seasonalDiseasePatterns: text("seasonal_disease_patterns"),
  serviceCapacity: serviceCapacityEnum("service_capacity"),

  // Finance
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  governmentFundingNPR: decimal("government_funding_npr", {
    precision: 18,
    scale: 2,
  }),
  localGovernmentFundingNPR: decimal("local_government_funding_npr", {
    precision: 18,
    scale: 2,
  }),
  donorFundingNPR: decimal("donor_funding_npr", { precision: 18, scale: 2 }),
  communityContributionNPR: decimal("community_contribution_npr", {
    precision: 18,
    scale: 2,
  }),
  patientFeesIncomeNPR: decimal("patient_fees_income_npr", {
    precision: 18,
    scale: 2,
  }),
  otherIncomeNPR: decimal("other_income_npr", { precision: 18, scale: 2 }),
  annualOperationalCostNPR: decimal("annual_operational_cost_npr", {
    precision: 18,
    scale: 2,
  }),
  annualMedicineExpenseNPR: decimal("annual_medicine_expense_npr", {
    precision: 18,
    scale: 2,
  }),
  annualSalaryExpenseNPR: decimal("annual_salary_expense_npr", {
    precision: 18,
    scale: 2,
  }),
  annualEquipmentExpenseNPR: decimal("annual_equipment_expense_npr", {
    precision: 18,
    scale: 2,
  }),
  hasHealthInsuranceSystem: boolean("has_health_insurance_system").default(
    false,
  ),
  insuranceEnrollmentCount: integer("insurance_enrollment_count"),
  freeServiceAvailable: boolean("free_service_available").default(true),
  freeServiceDetails: text("free_service_details"),
  healthInsuranceDetails: text("health_insurance_details"),

  // Medicine and supplies
  hasEssentialMedicinesList: boolean("has_essential_medicines_list").default(
    true,
  ),
  essentialMedicinesAvailabilityPercent: integer(
    "essential_medicines_availability_percent",
  ),
  medicineStockoutFrequency: text("medicine_stockout_frequency"),
  medicineSupplySource: text("medicine_supply_source"),
  hasProperInventorySystem: boolean("has_proper_inventory_system").default(
    true,
  ),
  inventoryManagementDetails: text("inventory_management_details"),

  // Quality and monitoring
  hasQualityAssuranceSystem: boolean("has_quality_assurance_system").default(
    false,
  ),
  qualityAssuranceDetails: text("quality_assurance_details"),
  hasCitizenCharter: boolean("has_citizen_charter").default(true),
  monitoringMechanismExists: boolean("monitoring_mechanism_exists").default(
    true,
  ),
  lastExternalAssessmentDate: date("last_external_assessment_date"),
  assessmentFindings: text("assessment_findings"),
  hasRegularReportingSystem: boolean("has_regular_reporting_system").default(
    true,
  ),
  reportingFrequency: text("reporting_frequency"),
  reportsToEntities: text("reports_to_entities"),
  hasPatientFeedbackSystem: boolean("has_patient_feedback_system").default(
    false,
  ),
  patientSatisfactionLevel: text("patient_satisfaction_level"),
  complaintResolutionMechanism: text("complaint_resolution_mechanism"),

  // Community engagement
  hasFcHv: boolean("has_fchv").default(true), // Female Community Health Volunteers
  fcHvCount: integer("fchv_count"),
  hasCommunityHealthWorkers: boolean("has_community_health_workers").default(
    true,
  ),
  communityHealthWorkerCount: integer("community_health_worker_count"),
  communityAwarenessActivities: text("community_awareness_activities"),
  communityOutreachFrequency: text("community_outreach_frequency"),
  communityParticipationLevel: text("community_participation_level"),
  hasSchoolHealthProgram: boolean("has_school_health_program").default(false),
  participationInCampaigns: text("participation_in_campaigns"),

  // Urban-specific services
  hasUrbanPoorServices: boolean("has_urban_poor_services").default(false),
  urbanPoorServicesDetails: text("urban_poor_services_details"),
  hasSlumOutreachPrograms: boolean("has_slum_outreach_programs").default(false),
  slumOutreachDetails: text("slum_outreach_details"),
  hasMigrantPopulationServices: boolean(
    "has_migrant_population_services",
  ).default(false),
  migrantServicesDetails: text("migrant_services_details"),
  hasOccupationalHealthServices: boolean(
    "has_occupational_health_services",
  ).default(false),
  occupationalHealthDetails: text("occupational_health_details"),
  hasAirPollutionMonitoring: boolean("has_air_pollution_monitoring").default(
    false,
  ),
  environmentalHealthPrograms: text("environmental_health_programs"),
  hasLifestyleDiseasePrograms: boolean(
    "has_lifestyle_disease_programs",
  ).default(false),
  lifestyleDiseaseDetails: text("lifestyle_disease_details"),

  // Challenges and future plans
  majorChallenges: text("major_challenges"),
  infrastructureNeeds: text("infrastructure_needs"),
  equipmentNeeds: text("equipment_needs"),
  humanResourceNeeds: text("human_resource_needs"),
  serviceExpansionPlans: text("service_expansion_plans"),
  upgradePlans: text("upgrade_plans"),

  // Coordination and support
  coordinationWithLocalGovernment: text("coordination_with_local_government"),
  coordinationWithProvincialGovernment: text(
    "coordination_with_provincial_government",
  ),
  coordinationWithFederalGovernment: text(
    "coordination_with_federal_government",
  ),
  partnerOrganizations: text("partner_organizations"),
  technicalSupportSources: text("technical_support_sources"),

  // Disaster preparedness
  hasDisasterPreparednessProtocol: boolean(
    "has_disaster_preparedness_protocol",
  ).default(false),
  disasterResponseCapacity: text("disaster_response_capacity"),
  hasEmergencyResponseTeam: boolean("has_emergency_response_team").default(
    false,
  ),
  massCasualtyManagementCapacity: text("mass_casualty_management_capacity"),

  // Special programs
  coveredByHealthInsurance: boolean("covered_by_health_insurance").default(
    false,
  ),
  safeMotherhoodProgram: boolean("safe_motherhood_program").default(true),
  nutritionProgram: boolean("nutrition_program").default(true),
  immunizationProgram: boolean("immunization_program").default(true),
  familyPlanningProgram: boolean("family_planning_program").default(true),
  tuberculosisProgram: boolean("tuberculosis_program").default(true),
  hivProgram: boolean("hiv_program").default(false),
  leprosy: boolean("leprosy_program").default(false),
  malaria: boolean("malaria_program").default(false),
  filariasis: boolean("filariasis_program").default(false),
  snakebite: boolean("snakebite_treatment").default(false),
  mentalHealthProgram: boolean("mental_health_program").default(false),
  geriatricCare: boolean("geriatric_care").default(false),
  adolescentHealthServices: boolean("adolescent_health_services").default(true),
  specialProgramDetails: text("special_program_details"),

  // Linkages to other entities
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedMunicipalityOffices: jsonb("linked_municipality_offices").default(
    sql`'[]'::jsonb`,
  ),
  linkedHealthInstitutions: jsonb("linked_health_institutions").default(
    sql`'[]'::jsonb`,
  ),
  linkedEducationalInstitutions: jsonb(
    "linked_educational_institutions",
  ).default(sql`'[]'::jsonb`),
  linkedCbos: jsonb("linked_cbos").default(sql`'[]'::jsonb`), // Community Based Organizations

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  serviceAreaPolygon: geometry("service_area_polygon", {
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

export type UrbanHealthCenter = typeof urbanHealthCenter.$inferSelect;
export type NewUrbanHealthCenter = typeof urbanHealthCenter.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
