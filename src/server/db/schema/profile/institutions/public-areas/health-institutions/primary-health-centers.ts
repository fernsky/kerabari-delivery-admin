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

// Define PHC type enum
export const phcTypeEnum = pgEnum("phc_type", [
  "GOVERNMENT",
  "COMMUNITY",
  "PRIVATE",
  "NGO_OPERATED",
  "PUBLIC_PRIVATE_PARTNERSHIP",
  "MUNICIPAL",
  "PROVINCIAL",
  "FEDERAL",
  "OTHER",
]);

// Define PHC level enum
export const phcLevelEnum = pgEnum("phc_level", [
  "PRIMARY_HEALTH_CENTER",
  "HEALTH_POST",
  "SUB_HEALTH_POST",
  "URBAN_HEALTH_CENTER",
  "COMMUNITY_HEALTH_UNIT",
  "BASIC_HEALTH_SERVICE_CENTER",
  "OTHER",
]);

// Define building condition enum
export const phcBuildingConditionEnum = pgEnum("phc_building_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_REPAIR",
  "NEEDS_RECONSTRUCTION",
  "UNDER_CONSTRUCTION",
  "TEMPORARY",
]);

// Define service availability enum
export const serviceAvailabilityEnum = pgEnum("service_availability", [
  "ALWAYS_AVAILABLE",
  "MOSTLY_AVAILABLE",
  "OCCASIONALLY_AVAILABLE",
  "RARELY_AVAILABLE",
  "NOT_AVAILABLE",
]);

// Define water source enum
export const phcWaterSourceEnum = pgEnum("phc_water_source", [
  "PIPED_WATER",
  "WELL",
  "PROTECTED_SPRING",
  "RAINWATER_COLLECTION",
  "WATER_TANKER",
  "BOTTLED_WATER",
  "NO_WATER_SOURCE",
  "OTHER",
]);

// Define power source enum
export const powerSourceEnum = pgEnum("power_source", [
  "GRID_CONNECTION",
  "SOLAR",
  "GENERATOR",
  "MIXED",
  "NONE",
]);

// Define staff availability enum
export const staffAvailabilityEnum = pgEnum("staff_availability", [
  "FULL_TIME",
  "PART_TIME",
  "VISITING",
  "ON_CALL",
  "NOT_AVAILABLE",
]);

// Primary Health Center table
export const primaryHealthCenter = pgTable("primary_health_center", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  phcType: phcTypeEnum("phc_type").notNull(),
  phcLevel: phcLevelEnum("phc_level").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  establishedDate: date("established_date"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // Ministry of Health, etc.
  panNumber: varchar("pan_number", { length: 20 }),
  ownership: text("ownership"),
  catchmentPopulation: integer("catchment_population"), // Population served
  catchmentAreaSqKm: decimal("catchment_area_sq_km", {
    precision: 10,
    scale: 2,
  }),
  catchmentVDCs: text("catchment_vdcs"), // Village Development Committees covered
  catchmentWards: text("catchment_wards"), // Ward numbers covered

  // Contact information
  phoneNumber: text("phone_number"),
  emergencyNumber: text("emergency_number"),
  faxNumber: text("fax_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Social media
  facebookHandle: text("facebook_handle"),
  twitterHandle: text("twitter_handle"),

  // Operating hours
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  isOpen24Hours: boolean("is_open_24_hours").default(false),
  weeklyOffDays: text("weekly_off_days"),
  emergencyHoursDetails: text("emergency_hours_details"),

  // Physical infrastructure
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
  buildingCount: integer("building_count"),
  totalFloors: integer("total_floors"),
  buildingCondition: phcBuildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  hasStaffQuarters: boolean("has_staff_quarters").default(false),
  staffQuartersCondition: text("staff_quarters_condition"),
  staffQuartersCount: integer("staff_quarters_count"),
  hasCompound: boolean("has_compound").default(false),
  hasBoundaryWall: boolean("has_boundary_wall").default(false),

  // Capacity and infrastructure
  totalRoomCount: integer("total_room_count"),
  examinationRoomCount: integer("examination_room_count"),
  consultationRoomCount: integer("consultation_room_count"),
  procedureRoomCount: integer("procedure_room_count"),
  dispensaryRoomCount: integer("dispensary_room_count"),
  laboratoryRoomCount: integer("laboratory_room_count"),
  administrationRoomCount: integer("administration_room_count"),
  waitingRoomCount: integer("waiting_room_count"),
  waitingRoomCapacity: integer("waiting_room_capacity"), // Number of people
  observationBedCount: integer("observation_bed_count"),
  deliveryBedCount: integer("delivery_bed_count"),
  toiletCount: integer("toilet_count"),
  hasSeparateToiletsForGenders: boolean(
    "has_separate_toilets_for_genders",
  ).default(false),
  hasPatientToilets: boolean("has_patient_toilets").default(false),
  hasWaitingArea: boolean("has_waiting_area").default(false),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  powerSource: powerSourceEnum("power_source"),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"), // E.g., "Generator", "Solar", "Inverter"
  powerAvailabilityHoursPerDay: integer("power_availability_hours_per_day"),
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterSource: phcWaterSourceEnum("water_source"),
  waterAvailability: serviceAvailabilityEnum("water_availability"),
  hasHandwashingStations: boolean("has_handwashing_stations").default(false),
  handwashingStationCount: integer("handwashing_station_count"),
  hasWasteDisposalSystem: boolean("has_waste_disposal_system").default(false),
  wasteDisposalSystemType: text("waste_disposal_system_type"),
  hasPlacentaPit: boolean("has_placenta_pit").default(false),
  hasIncinerator: boolean("has_incinerator").default(false),

  // Service availability
  providesGeneralOutpatientServices: boolean(
    "provides_general_outpatient_services",
  ).default(true),
  providesBirthingServices: boolean("provides_birthing_services").default(
    false,
  ),
  providesAntenatalServices: boolean("provides_antenatal_services").default(
    false,
  ),
  providesPostnatalServices: boolean("provides_postnatal_services").default(
    false,
  ),
  providesImmunizationServices: boolean(
    "provides_immunization_services",
  ).default(false),
  providesFamilyPlanningServices: boolean(
    "provides_family_planning_services",
  ).default(false),
  providesNutritionServices: boolean("provides_nutrition_services").default(
    false,
  ),
  providesMaternalHealthServices: boolean(
    "provides_maternal_health_services",
  ).default(false),
  providesChildHealthServices: boolean(
    "provides_child_health_services",
  ).default(false),
  providesAdolescentHealthServices: boolean(
    "provides_adolescent_health_services",
  ).default(false),
  providesGeriatricServices: boolean("provides_geriatric_services").default(
    false,
  ),
  providesEmergencyServices: boolean("provides_emergency_services").default(
    false,
  ),
  providesReferralServices: boolean("provides_referral_services").default(true),
  providesMentalHealthServices: boolean(
    "provides_mental_health_services",
  ).default(false),
  providesDentalServices: boolean("provides_dental_services").default(false),
  providesPhysiotherapyServices: boolean(
    "provides_physiotherapy_services",
  ).default(false),
  outpatientDaysPerWeek: integer("outpatient_days_per_week"),
  immunizationDaysPerMonth: integer("immunization_days_per_month"),
  clinicDaysPerMonth: integer("clinic_days_per_month"),
  averageDailyOutpatientCount: integer("average_daily_outpatient_count"),
  annualPatientCount: integer("annual_patient_count"),
  annualDeliveryCount: integer("annual_delivery_count"),
  top5Diseases: text("top5_diseases"),

  // Laboratory and diagnostic facilities
  hasBasicLaboratory: boolean("has_basic_laboratory").default(false),
  laboratoryTests: text("laboratory_tests"), // List of tests available
  hasBloodTestingFacility: boolean("has_blood_testing_facility").default(false),
  hasUrineTestingFacility: boolean("has_urine_testing_facility").default(false),
  hasStoolTestingFacility: boolean("has_stool_testing_facility").default(false),
  hasMalariaTestingFacility: boolean("has_malaria_testing_facility").default(
    false,
  ),
  hasTBTestingFacility: boolean("has_tb_testing_facility").default(false),
  hasPregnancyTestingFacility: boolean(
    "has_pregnancy_testing_facility",
  ).default(false),
  hasHIVTestingFacility: boolean("has_hiv_testing_facility").default(false),
  hasBloodGlucoseTestingFacility: boolean(
    "has_blood_glucose_testing_facility",
  ).default(false),
  hasUltrasound: boolean("has_ultrasound").default(false),
  hasXRay: boolean("has_x_ray").default(false),
  hasECG: boolean("has_ecg").default(false),
  otherDiagnosticFacilities: text("other_diagnostic_facilities"),

  // Medicines and supplies
  hasMedicineDispensary: boolean("has_medicine_dispensary").default(false),
  essentialMedicinesAvailability: serviceAvailabilityEnum(
    "essential_medicines_availability",
  ),
  hasVaccineRefrigerator: boolean("has_vaccine_refrigerator").default(false),
  vaccineColdChainFunctioning: boolean(
    "vaccine_cold_chain_functioning",
  ).default(false),
  hasMedicineStorage: boolean("has_medicine_storage").default(false),
  medicineStorageCondition: text("medicine_storage_condition"),
  hasMedicineSupplyShortages: boolean("has_medicine_supply_shortages").default(
    false,
  ),
  medicineSupplyShortageDetails: text("medicine_supply_shortage_details"),

  // Equipment
  hasBasicEquipment: boolean("has_basic_equipment").default(false),
  hasBloodPressureApparatus: boolean("has_blood_pressure_apparatus").default(
    false,
  ),
  hasStethoscope: boolean("has_stethoscope").default(false),
  hasThermometer: boolean("has_thermometer").default(false),
  hasWeighingScale: boolean("has_weighing_scale").default(false),
  hasHeightMeasuringDevice: boolean("has_height_measuring_device").default(
    false,
  ),
  hasFetoscope: boolean("has_fetoscope").default(false),
  hasExaminationTable: boolean("has_examination_table").default(false),
  hasDeliveryTable: boolean("has_delivery_table").default(false),
  hasAutoclave: boolean("has_autoclave").default(false),
  hasNebulizer: boolean("has_nebulizer").default(false),
  hasOxygenCylinder: boolean("has_oxygen_cylinder").default(false),
  hasSuctionMachine: boolean("has_suction_machine").default(false),
  hasAmbulance: boolean("has_ambulance").default(false),
  ambulanceCount: integer("ambulance_count"),
  equipmentCondition: text("equipment_condition"),
  equipmentMaintenanceLastDate: date("equipment_maintenance_last_date"),

  // Staff details
  totalStaffCount: integer("total_staff_count"),
  doctorCount: integer("doctor_count"),
  doctorAvailability: staffAvailabilityEnum("doctor_availability"),
  healthAssistantCount: integer("health_assistant_count"),
  staffNurseCount: integer("staff_nurse_count"),
  anmCount: integer("anm_count"), // Auxiliary Nurse Midwife
  ahmCount: integer("ahm_count"), // Auxiliary Health Worker
  labTechnicianCount: integer("lab_technician_count"),
  pharmacistCount: integer("pharmacist_count"),
  administrationStaffCount: integer("administration_staff_count"),
  supportStaffCount: integer("support_staff_count"),
  femaleStaffCount: integer("female_staff_count"),
  maleStaffCount: integer("male_staff_count"),
  vacantPositionsCount: integer("vacant_positions_count"),
  staffShortageCriticalAreas: text("staff_shortage_critical_areas"),
  mostRecentTraining: text("most_recent_training"),
  trainingNeeds: text("training_needs"),

  // Management and governance
  hasManagementCommittee: boolean("has_management_committee").default(false),
  managementCommitteeSize: integer("management_committee_size"),
  managementCommitteeFemaleCount: integer("management_committee_female_count"),
  managementCommitteeFrequency: text("management_committee_frequency"),
  lastManagementMeetingDate: date("last_management_meeting_date"),
  hasCitizenCharter: boolean("has_citizen_charter").default(false),
  hasSuggestionBox: boolean("has_suggestion_box").default(false),
  implementsQualityImprovementMeasures: boolean(
    "implements_quality_improvement_measures",
  ).default(false),
  qualityImprovementDetails: text("quality_improvement_details"),
  hasEmergencyPlan: boolean("has_emergency_plan").default(false),
  hasReferralProtocol: boolean("has_referral_protocol").default(false),
  hasMonthlyReportingSystem: boolean("has_monthly_reporting_system").default(
    false,
  ),

  // Digital infrastructure
  hasComputerSystem: boolean("has_computer_system").default(false),
  computerCount: integer("computer_count"),
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetType: text("internet_type"), // E.g., "Fiber", "DSL", "4G"
  hasElectronicHealthRecord: boolean("has_electronic_health_record").default(
    false,
  ),
  ehrSystemName: text("ehr_system_name"),
  hasHMIS: boolean("has_hmis").default(false), // Health Management Information System
  hmisType: text("hmis_type"),
  hasTelemedicine: boolean("has_telemedicine").default(false),
  telemedicineDetails: text("telemedicine_details"),
  hasMobileHealthServices: boolean("has_mobile_health_services").default(false),
  mobileHealthDetails: text("mobile_health_details"),

  // Financial aspects
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  governmentFundingPercentage: integer("government_funding_percentage"),
  communityFundingPercentage: integer("community_funding_percentage"),
  donorFundingPercentage: integer("donor_funding_percentage"),
  annualOperationalCostNPR: decimal("annual_operational_cost_npr", {
    precision: 18,
    scale: 2,
  }),
  hasUserFees: boolean("has_user_fees").default(false),
  userFeesDetails: text("user_fees_details"),
  hasExemptionScheme: boolean("has_exemption_scheme").default(false),
  exemptionSchemeDetails: text("exemption_scheme_details"),
  hasInsuranceScheme: boolean("has_insurance_scheme").default(false),
  insuranceDetails: text("insurance_details"),
  percentPeopleInsured: integer("percent_people_insured"),

  // Community engagement
  hasCommunityOutreachPrograms: boolean(
    "has_community_outreach_programs",
  ).default(false),
  communityProgramDetails: text("community_program_details"),
  hasFCHVs: boolean("has_fchvs").default(false), // Female Community Health Volunteers
  fchvCount: integer("fchv_count"),
  hasAwarenessPrograms: boolean("has_awareness_programs").default(false),
  awarenessProgramDetails: text("awareness_program_details"),
  hasCommunityFeedbackMechanism: boolean(
    "has_community_feedback_mechanism",
  ).default(false),
  feedbackMechanismDetails: text("feedback_mechanism_details"),

  // Public health programs
  implementsImmunizationPrograms: boolean(
    "implements_immunization_programs",
  ).default(false),
  immunizationCoveragePercent: integer("immunization_coverage_percent"),
  implementsNutritionPrograms: boolean("implements_nutrition_programs").default(
    false,
  ),
  nutritionProgramDetails: text("nutrition_program_details"),
  implementsMaternalHealthPrograms: boolean(
    "implements_maternal_health_programs",
  ).default(false),
  maternalProgramDetails: text("maternal_program_details"),
  implementsChildHealthPrograms: boolean(
    "implements_child_health_programs",
  ).default(false),
  childProgramDetails: text("child_program_details"),
  implementsFamilyPlanningPrograms: boolean(
    "implements_family_planning_programs",
  ).default(false),
  familyPlanningDetails: text("family_planning_details"),
  implementsDiseaseSurveillance: boolean(
    "implements_disease_surveillance",
  ).default(false),
  implementsSchoolHealthPrograms: boolean(
    "implements_school_health_programs",
  ).default(false),

  // Challenges and needs
  infrastructureChallenges: text("infrastructure_challenges"),
  equipmentChallenges: text("equipment_challenges"),
  staffingChallenges: text("staffing_challenges"),
  medicineChallenges: text("medicine_challenges"),
  fundingChallenges: text("funding_challenges"),
  communityEngagementChallenges: text("community_engagement_challenges"),
  otherChallenges: text("other_challenges"),
  immediateNeeds: text("immediate_needs"),

  // Future development
  expansionPlans: text("expansion_plans"),
  upgradeNeeds: text("upgrade_needs"),
  futureServices: text("future_services"),

  // Health indicators
  maternalMortalityRate: decimal("maternal_mortality_rate", {
    precision: 10,
    scale: 2,
  }),
  infantMortalityRate: decimal("infant_mortality_rate", {
    precision: 10,
    scale: 2,
  }),
  under5MortalityRate: decimal("under5_mortality_rate", {
    precision: 10,
    scale: 2,
  }),
  institutionalDeliveryRate: decimal("institutional_delivery_rate", {
    precision: 5,
    scale: 2,
  }),
  immunizationCoverageRate: decimal("immunization_coverage_rate", {
    precision: 5,
    scale: 2,
  }),
  contraceptivePrevalenceRate: decimal("contraceptive_prevalence_rate", {
    precision: 5,
    scale: 2,
  }),
  antenatalCareVisit4Rate: decimal("antenatal_care_visit4_rate", {
    precision: 5,
    scale: 2,
  }),

  // External support
  receivesExternalSupport: boolean("receives_external_support").default(false),
  supportingOrganizations: text("supporting_organizations"),
  supportTypes: text("support_types"),
  partOfHealthNetwork: boolean("part_of_health_network").default(false),
  healthNetworkDetails: text("health_network_details"),

  // Referral system
  hasReferralSystem: boolean("has_referral_system").default(false),
  referredToHospitals: text("referred_to_hospitals"),
  referralTransportMeans: text("referral_transport_means"),
  averageReferralTimeMinutes: integer("average_referral_time_minutes"),
  emergencyResponseProcess: text("emergency_response_process"),

  // Linkages to other entities
  linkedMunicipalityOffices: jsonb("linked_municipality_offices").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedHealthInstitutions: jsonb("linked_health_institutions").default(
    sql`'[]'::jsonb`,
  ),
  linkedSchools: jsonb("linked_schools").default(sql`'[]'::jsonb`),
  linkedCommunityGroups: jsonb("linked_community_groups").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  catchmentAreaGeometry: geometry("catchment_area_geometry", {
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

export type PrimaryHealthCenter = typeof primaryHealthCenter.$inferSelect;
export type NewPrimaryHealthCenter = typeof primaryHealthCenter.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
