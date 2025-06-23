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

// Define basic health unit type enum
export const basicHealthUnitTypeEnum = pgEnum("basic_health_unit_type", [
  "BASIC_HEALTH_UNIT",
  "SATELLITE_CLINIC",
  "MOBILE_CLINIC",
  "OUTREACH_CENTER",
  "PRIMARY_CARE_UNIT",
  "COMMUNITY_HEALTH_OUTPOST",
  "OTHER",
]);

// Define building condition enum
export const bhuBuildingConditionEnum = pgEnum("bhu_building_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_REPAIR",
  "NEEDS_RECONSTRUCTION",
  "UNDER_CONSTRUCTION",
  "TEMPORARY",
]);

// Define facility adequacy enum
export const facilityAdequacyEnum = pgEnum("facility_adequacy", [
  "EXCELLENT",
  "ADEQUATE",
  "LIMITED",
  "INADEQUATE",
  "NONE",
]);

// Define service availability enum
export const bhuServiceAvailabilityEnum = pgEnum("service_availability", [
  "ALWAYS_AVAILABLE",
  "REGULARLY_AVAILABLE",
  "OCCASIONALLY_AVAILABLE",
  "RARELY_AVAILABLE",
  "NOT_AVAILABLE",
]);

// Define water source type enum
const waterSourceTypeEnum = pgEnum("water_source_type", [
  "PIPED_WATER",
  "TUBE_WELL",
  "PROTECTED_WELL",
  "UNPROTECTED_WELL",
  "SPRING_WATER",
  "RAINWATER",
  "TANKER_TRUCK",
  "SURFACE_WATER",
  "BOTTLED_WATER",
  "NO_WATER_SOURCE",
]);

// Basic Health Unit table
export const basicHealthUnit = pgTable("basic_health_unit", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  unitType: basicHealthUnitTypeEnum("unit_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  establishedDate: date("established_date"),
  catchmentPopulation: integer("catchment_population"), // Population served
  catchmentAreaSqKm: decimal("catchment_area_sq_km", {
    precision: 10,
    scale: 2,
  }),
  distanceFromNearestHealthPostKm: decimal(
    "distance_from_nearest_health_post_km",
    {
      precision: 6,
      scale: 2,
    },
  ),
  distanceFromNearestRoadKm: decimal("distance_from_nearest_road_km", {
    precision: 6,
    scale: 2,
  }),
  referralFacilityName: text("referral_facility_name"),
  referralFacilityDistance: decimal("referral_facility_distance", {
    precision: 6,
    scale: 2,
  }),

  // Management and oversight
  managementType: text("management_type"), // Government, NGO, Community, etc.
  parentHealthFacilityId: varchar("parent_health_facility_id", { length: 36 }),
  supervisingAgency: text("supervising_agency"),
  localGovernmentSupport: text("local_government_support"),

  // Operating hours
  isOpen24Hours: boolean("is_open_24_hours").default(false),
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  weeklyOffDays: text("weekly_off_days"),
  emergencyServiceAvailability: boolean(
    "emergency_service_availability",
  ).default(false),
  servicesFrequency: text("services_frequency"), // Daily, weekly, monthly, etc.

  // Building and infrastructure
  hasDedicatedBuilding: boolean("has_dedicated_building").default(true),
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", etc.
  buildingCondition: bhuBuildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  totalFloors: integer("total_floors"),
  totalRooms: integer("total_rooms"),
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(false),
  electricitySource: text("electricity_source"), // Grid, solar, generator, etc.
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"), // Generator, solar, etc.
  hasWaterSupply: boolean("has_water_supply").default(false),
  waterSourceType: waterSourceTypeEnum("water_source_type"),
  hasFunctionalToilets: boolean("has_functional_toilets").default(false),
  hasPatientToilet: boolean("has_patient_toilet").default(false),
  hasStaffToilet: boolean("has_staff_toilet").default(false),
  hasWaitingArea: boolean("has_waiting_area").default(false),
  waitingAreaCapacity: integer("waiting_area_capacity"),
  hasWasteDisposalSystem: boolean("has_waste_disposal_system").default(false),
  wasteDisposalMethod: text("waste_disposal_method"),

  // Communication facilities
  hasTelephone: boolean("has_telephone").default(false),
  telephoneNumber: text("telephone_number"),
  hasMobileCoverage: boolean("has_mobile_coverage").default(false),
  mobileNetworkProviders: text("mobile_network_providers"),
  hasInternetAccess: boolean("has_internet_access").default(false),
  internetType: text("internet_type"), // Broadband, wireless, etc.

  // Clinical facilities and equipment
  hasConsultationRoom: boolean("has_consultation_room").default(false),
  consultationRoomCount: integer("consultation_room_count"),
  hasTreatmentRoom: boolean("has_treatment_room").default(false),
  hasInjectionRoom: boolean("has_injection_room").default(false),
  hasDressingRoom: boolean("has_dressing_room").default(false),
  hasLaboratoryCorner: boolean("has_laboratory_corner").default(false),
  hasPharmacyCorner: boolean("has_pharmacy_corner").default(false),
  hasMedicineRefrigerator: boolean("has_medicine_refrigerator").default(false),
  hasBirthingFacilities: boolean("has_birthing_facilities").default(false),
  hasBasicEmergencyEquipment: boolean("has_basic_emergency_equipment").default(
    false,
  ),
  hasObservationBeds: boolean("has_observation_beds").default(false),
  observationBedCount: integer("observation_bed_count"),
  basicEquipmentAvailability: facilityAdequacyEnum(
    "basic_equipment_availability",
  ),
  equipmentFunctionalityStatus: text("equipment_functionality_status"),

  // Services provided
  providesGeneralConsultation: boolean("provides_general_consultation").default(
    true,
  ),
  providesAntenatalCare: boolean("provides_antenatal_care").default(false),
  providesPostnatalCare: boolean("provides_postnatal_care").default(false),
  providesDeliveryServices: boolean("provides_delivery_services").default(
    false,
  ),
  providesImmunization: boolean("provides_immunization").default(false),
  immunizationFrequency: text("immunization_frequency"),
  providesWoundCare: boolean("provides_wound_care").default(false),
  providesBasicTesting: boolean("provides_basic_testing").default(false),
  testingServiceDetails: text("testing_service_details"),
  providesFamilyPlanning: boolean("provides_family_planning").default(false),
  familyPlanningDetails: text("family_planning_details"),
  providesNutritionServices: boolean("provides_nutrition_services").default(
    false,
  ),
  providesHealthEducation: boolean("provides_health_education").default(false),
  healthEducationFrequency: text("health_education_frequency"),
  providesOutreach: boolean("provides_outreach").default(false),
  outreachFrequency: text("outreach_frequency"),
  outreachCoverageArea: text("outreach_coverage_area"),
  referralServices: text("referral_services"),
  additionalSpecialServicesOffered: text("additional_special_services_offered"),

  // Medicines and supplies
  medicineAvailability: facilityAdequacyEnum("medicine_availability"),
  essentialDrugsList: boolean("essential_drugs_list").default(false),
  medicineSupplyFrequency: text("medicine_supply_frequency"),
  hasStockOutsInLast3Months: boolean("has_stock_outs_in_last_3_months").default(
    false,
  ),
  stockOutDetails: text("stock_out_details"),
  daysOfStockOutPerMonthAverage: integer("days_of_stock_out_per_month_average"),
  supplyChainChallenges: text("supply_chain_challenges"),

  // Staff details
  inChargeDesignation: text("in_charge_designation"), // ANM, HA, etc.
  inChargeName: text("in_charge_name"),
  inChargeContactNumber: text("in_charge_contact_number"),
  totalStaffCount: integer("total_staff_count"),
  healthAssistantCount: integer("health_assistant_count"),
  nurseCount: integer("nurse_count"),
  anmCount: integer("anm_count"), // Auxiliary Nurse Midwife
  mchworkerCount: integer("mchw_count"), // Maternal Child Health Worker
  supportStaffCount: integer("support_staff_count"),
  femaleStaffCount: integer("female_staff_count"),
  maleStaffCount: integer("male_staff_count"),
  staffVacancyCount: integer("staff_vacancy_count"),
  staffingAdequacy: facilityAdequacyEnum("staffing_adequacy"),
  staffAttendanceRate: integer("staff_attendance_rate"), // Percentage
  staffAccommodationAvailable: boolean("staff_accommodation_available").default(
    false,
  ),

  // Utilization statistics
  averageMonthlyPatients: integer("average_monthly_patients"),
  averageDailyOutpatients: integer("average_daily_outpatients"),
  topThreeMorbidities: text("top_three_morbidities"),
  patientReferralRatePercent: decimal("patient_referral_rate_percent", {
    precision: 5,
    scale: 2,
  }),
  annualServiceStatistics: jsonb("annual_service_statistics").default(
    sql`'[]'::jsonb`,
  ),

  // Financial aspects
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 14, scale: 2 }),
  budgetSource: text("budget_source"),
  hasCostSharingMechanism: boolean("has_cost_sharing_mechanism").default(false),
  costSharingDetails: text("cost_sharing_details"),
  hasCommunitySupportFund: boolean("has_community_support_fund").default(false),

  // Community engagement
  hasHealthCommittee: boolean("has_health_committee").default(false),
  healthCommitteeMeetingFrequency: text("health_committee_meeting_frequency"),
  communityEngagementActivities: text("community_engagement_activities"),
  femahlHealthVolunteersCount: integer("femahl_health_volunteers_count"),
  femahlVolunteersActivePercent: integer("femahl_volunteers_active_percent"),

  // Monitoring and quality
  supervisionFrequency: text("supervision_frequency"),
  lastSupervisionDate: date("last_supervision_date"),
  hasQualityImprovementProcess: boolean(
    "has_quality_improvement_process",
  ).default(false),
  reportingCompliancePercent: integer("reporting_compliance_percent"),

  // Challenges and needs
  majorChallenges: text("major_challenges"),
  priorityNeeds: text("priority_needs"),
  infrastructureNeeds: text("infrastructure_needs"),
  equipmentNeeds: text("equipment_needs"),
  medicineNeeds: text("medicine_needs"),
  staffingNeeds: text("staffing_needs"),

  // Future plans
  expansionPlans: text("expansion_plans"),
  serviceImprovementPlans: text("service_improvement_plans"),

  // Disaster preparedness
  hasDisasterPreparednessPlans: boolean(
    "has_disaster_preparedness_plans",
  ).default(false),
  disasterKitAvailable: boolean("disaster_kit_available").default(false),
  servesAsEmergencyShelter: boolean("serves_as_emergency_shelter").default(
    false,
  ),

  // Linkages and networks
  linkedWithHealthPost: boolean("linked_with_health_post").default(false),
  linkedWithPHCC: boolean("linked_with_phcc").default(false), // Primary Health Care Center
  linkedWithHospital: boolean("linked_with_hospital").default(false),
  ngoPartnershipDetails: text("ngo_partnership_details"),
  communityLinkages: text("community_linkages"),
  linkedHealthFacilities: jsonb("linked_health_facilities").default(
    sql`'[]'::jsonb`,
  ),
  linkedSchools: jsonb("linked_schools").default(sql`'[]'::jsonb`),
  linkedCommunityGroups: jsonb("linked_community_groups").default(
    sql`'[]'::jsonb`,
  ),

  // Accessibility
  accessibilityInMonsoon: text("accessibility_in_monsoon"),
  transportationOptions: text("transportation_options"),
  servicesForDisabled: text("services_for_disabled"),
  servicesForElderly: text("services_for_elderly"),

  // Program implementation
  implementedHealthPrograms: text("implemented_health_programs"),
  programSuccesses: text("program_successes"),
  programChallenges: text("program_challenges"),

  // Data management
  recordKeepingSystem: text("record_keeping_system"), // Paper-based, digital, mixed
  hasHMIS: boolean("has_hmis").default(false), // Health Management Information System
  hmisUsageLevel: text("hmis_usage_level"),
  dataQualityAssessment: text("data_quality_assessment"),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  catchmentArea: geometry("catchment_area", { type: "MultiPolygon" }),

  // Status and metadata
  serviceStatus: bhuServiceAvailabilityEnum("service_status").default(
    "REGULARLY_AVAILABLE",
  ),
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  verificationDate: timestamp("verification_date"),
  verifiedBy: varchar("verified_by", { length: 36 }),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type BasicHealthUnit = typeof basicHealthUnit.$inferSelect;
export type NewBasicHealthUnit = typeof basicHealthUnit.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
