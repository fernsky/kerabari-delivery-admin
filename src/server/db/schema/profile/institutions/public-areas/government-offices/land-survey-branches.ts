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
import { buildingConditionEnum } from "../../common";

import { digitalInfrastructureLevelEnum } from "./municipality-offices";

// Define survey office type enum
export const surveyOfficeTypeEnum = pgEnum("survey_office_type", [
  "SURVEY_DEPARTMENT",
  "DISTRICT_SURVEY_OFFICE",
  "LAND_SURVEY_BRANCH",
  "CADASTRAL_SURVEY_BRANCH",
  "GEODETIC_SURVEY_BRANCH",
  "TOPOGRAPHICAL_SURVEY_BRANCH",
  "BOUNDARY_SURVEY_BRANCH",
  "OTHER",
]);

// Define service capacity enum
const serviceCapacityEnum = pgEnum("service_capacity", [
  "HIGH",
  "MEDIUM",
  "LOW",
  "INSUFFICIENT",
]);

// Define equipment condition enum
const equipmentConditionEnum = pgEnum("equipment_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_MAINTENANCE",
  "OUTDATED",
  "NON_FUNCTIONAL",
]);

// Define accuracy level enum
export const accuracyLevelEnum = pgEnum("accuracy_level", [
  "VERY_HIGH",
  "HIGH",
  "STANDARD",
  "BASIC",
  "LIMITED",
]);

// Define service efficiency enum
const serviceEfficiencyEnum = pgEnum("service_efficiency", [
  "EXCELLENT",
  "GOOD",
  "SATISFACTORY",
  "NEEDS_IMPROVEMENT",
  "POOR",
]);

// Land Survey Branch table
export const landSurveyBranch = pgTable("land_survey_branch", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  officeType: surveyOfficeTypeEnum("office_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  officeCode: varchar("office_code", { length: 20 }), // Official code
  establishedDate: date("established_date"),
  parentOfficeId: varchar("parent_office_id", { length: 36 }), // For hierarchical relationship
  jurisdictionArea: text("jurisdiction_area"), // Areas covered by this office
  centralOfficeDistance: decimal("central_office_distance", {
    precision: 8,
    scale: 2,
  }), // Distance from central office in km

  // Leadership and management
  officeHeadName: text("office_head_name"),
  officeHeadTitle: text("office_head_title"), // Chief Survey Officer, etc.
  officeHeadAppointmentDate: date("office_head_appointment_date"),

  // Contact information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  faxNumber: text("fax_number"),
  email: text("email"),
  websiteUrl: text("website_url"),
  poBoxNumber: text("po_box_number"),

  // Social media and online presence
  facebookHandle: text("facebook_handle"),
  twitterHandle: text("twitter_handle"),

  // Operating hours
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  isOpenOnWeekends: boolean("is_open_on_weekends").default(false),
  weeklyOffDays: text("weekly_off_days"), // E.g., "Saturday" or "Sunday"

  // Office infrastructure
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", etc.
  buildingType: text("building_type"), // E.g., "Modern", "Traditional", "Hybrid"
  buildingCondition: buildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  totalFloors: integer("total_floors"),
  totalRooms: integer("total_rooms"),
  totalOfficeAreaSqm: decimal("total_office_area_sqm", {
    precision: 10,
    scale: 2,
  }),
  hasDisabledAccess: boolean("has_disabled_access").default(false),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"), // E.g., "Generator", "Solar", "UPS"
  hasWaterSupply: boolean("has_water_supply").default(true),
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetType: text("internet_type"), // E.g., "Fiber", "DSL", "4G"
  internetSpeed: text("internet_speed"), // E.g., "10 Mbps", "100 Mbps"

  // Public facilities
  hasPublicWaitingArea: boolean("has_public_waiting_area").default(false),
  waitingAreaCapacity: integer("waiting_area_capacity"),
  hasPublicToilets: boolean("has_public_toilets").default(false),
  hasPublicWifi: boolean("has_public_wifi").default(false),
  hasDrinkingWater: boolean("has_drinking_water").default(false),
  hasHelpDesk: boolean("has_help_desk").default(false),
  hasTokenSystem: boolean("has_token_system").default(false),
  hasFeedbackSystem: boolean("has_feedback_system").default(false),
  hasNoticeBoard: boolean("has_notice_board").default(true),
  hasParking: boolean("has_parking").default(false),
  parkingCapacity: integer("parking_capacity"),

  // Survey and technical equipment
  hasSurveyingEquipment: boolean("has_surveying_equipment").default(true),
  totalStationCount: integer("total_station_count"),
  totalStationCondition: equipmentConditionEnum("total_station_condition"),
  gpsEquipmentCount: integer("gps_equipment_count"),
  gpsEquipmentCondition: equipmentConditionEnum("gps_equipment_condition"),
  rtgpsAvailable: boolean("rtgps_available").default(false), // Real-time GPS
  traditionalTheodoliteCount: integer("traditional_theodolite_count"),
  levelingEquipmentCount: integer("leveling_equipment_count"),
  draftingEquipmentAvailable: boolean("drafting_equipment_available").default(
    true,
  ),
  equipmentLastUpdatedYear: integer("equipment_last_updated_year"),
  equipmentAdequacy: text("equipment_adequacy"),
  droneSurveyCapability: boolean("drone_survey_capability").default(false),
  droneCount: integer("drone_count"),
  lidarCapability: boolean("lidar_capability").default(false),
  aerialPhotographyCapability: boolean("aerial_photography_capability").default(
    false,
  ),
  dGpsAvailable: boolean("dgps_available").default(false), // Differential GPS
  gnssBaseStationAvailable: boolean("gnss_base_station_available").default(
    false,
  ), // Global Navigation Satellite System

  // Digital infrastructure
  digitalInfrastructureLevel: digitalInfrastructureLevelEnum(
    "digital_infrastructure_level",
  ),
  hasBiometricAttendance: boolean("has_biometric_attendance").default(false),
  hasCctv: boolean("has_cctv").default(false),
  hasDigitalRecordKeeping: boolean("has_digital_record_keeping").default(false),
  hasGisLab: boolean("has_gis_lab").default(false),
  gisLabDetails: text("gis_lab_details"),
  computerCount: integer("computer_count"),
  digitizationStatus: text("digitization_status"),
  digitalMappingCapability: boolean("digital_mapping_capability").default(
    false,
  ),
  hasPlotters: boolean("has_plotters").default(false),
  plotterCount: integer("plotter_count"),
  hasScanners: boolean("has_scanners").default(false),
  scannerCount: integer("scanner_count"),
  hasDigitalDataBackup: boolean("has_digital_data_backup").default(false),
  backupFrequency: text("backup_frequency"),
  landRecordsDigitized: boolean("land_records_digitized").default(false),
  landRecordsDigitizationPercent: integer("land_records_digitization_percent"), // 0-100
  mapsDigitized: boolean("maps_digitized").default(false),
  mapsDigitizationPercent: integer("maps_digitization_percent"), // 0-100

  // Software systems
  hasLandInformationSystem: boolean("has_land_information_system").default(
    false,
  ),
  landInformationSystemDetails: text("land_information_system_details"),
  hasCadastralDatabase: boolean("has_cadastral_database").default(false),
  cadastralDatabaseDetails: text("cadastral_database_details"),
  hasGisSystem: boolean("has_gis_system").default(false),
  gisSystemDetails: text("gis_system_details"),
  softwareUsed: text("software_used"), // Types of software used
  onlineServiceAvailability: boolean("online_service_availability").default(
    false,
  ),
  onlineServicesDetails: text("online_services_details"),

  // Service capacity
  landParcelsCovered: integer("land_parcels_covered"), // Number of total land parcels in jurisdiction
  averageSurveyTimePerParcel: decimal("average_survey_time_per_parcel", {
    precision: 8,
    scale: 2,
  }), // In hours
  annualSurveyCapacity: integer("annual_survey_capacity"), // Parcels per year
  averageApplicationProcessingTime: integer(
    "average_application_processing_time",
  ), // In days
  backlogCases: integer("backlog_cases"), // Number of pending cases
  oldestPendingCaseDate: date("oldest_pending_case_date"),
  surveyAccuracyLevel: accuracyLevelEnum("survey_accuracy_level"),
  serviceCapacity: serviceCapacityEnum("service_capacity"),
  serviceEfficiency: serviceEfficiencyEnum("service_efficiency"),

  // Service types and volume
  landTitleSurvey: boolean("land_title_survey").default(true),
  boundarySurvey: boolean("boundary_survey").default(true),
  topographicalSurvey: boolean("topographical_survey").default(true),
  subdivisionServices: boolean("subdivision_services").default(true),
  landDisputeResolution: boolean("land_dispute_resolution").default(true),
  mapPreparation: boolean("map_preparation").default(true),
  coordinateReferencing: boolean("coordinate_referencing").default(true),
  landValuation: boolean("land_valuation").default(false),
  geodeticControl: boolean("geodetic_control").default(false),
  monthlyApplicationsReceived: integer("monthly_applications_received"),
  monthlyServicesCompleted: integer("monthly_services_completed"),
  servicesOffered: text("services_offered"),

  // Staff details
  totalStaffCount: integer("total_staff_count"),
  surveyorCount: integer("surveyor_count"),
  technicianCount: integer("technician_count"),
  engineerCount: integer("engineer_count"),
  administrativeStaffCount: integer("administrative_staff_count"),
  supportStaffCount: integer("support_staff_count"),
  vacantPositions: integer("vacant_positions"),
  permanentStaffCount: integer("permanent_staff_count"),
  temporaryStaffCount: integer("temporary_staff_count"),
  maleStaffCount: integer("male_staff_count"),
  femaleStaffCount: integer("female_staff_count"),
  staffTrainingFrequency: text("staff_training_frequency"),
  staffingAdequacy: text("staffing_adequacy"), // Assessment of staffing levels

  // Security and data management
  hasSecuritySystem: boolean("has_security_system").default(false),
  securitySystemDetails: text("security_system_details"),
  fireProtectionSystem: boolean("fire_protection_system").default(false),
  hasDataPrivacyPolicy: boolean("has_data_privacy_policy").default(false),
  hasDisasterRecoveryPlan: boolean("has_disaster_recovery_plan").default(false),
  recordStorageSecurity: text("record_storage_security"),

  // Historical records
  historicalMapsAvailable: boolean("historical_maps_available").default(false),
  oldestMapYear: integer("oldest_map_year"),
  historicalRecordsDigitized: boolean("historical_records_digitized").default(
    false,
  ),
  hasArchive: boolean("has_archive").default(true),
  archiveCondition: text("archive_condition"),

  // Budget and finance
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  equipmentBudgetNPR: decimal("equipment_budget_npr", {
    precision: 14,
    scale: 2,
  }),
  maintenanceBudgetNPR: decimal("maintenance_budget_npr", {
    precision: 14,
    scale: 2,
  }),
  trainingBudgetNPR: decimal("training_budget_npr", {
    precision: 14,
    scale: 2,
  }),
  annualRevenueNPR: decimal("annual_revenue_npr", { precision: 18, scale: 2 }),
  revenueFromServiceFeesNPR: decimal("revenue_from_service_fees_npr", {
    precision: 18,
    scale: 2,
  }),
  budgetAdequacy: text("budget_adequacy"),
  budgetFiscalYear: varchar("budget_fiscal_year", { length: 9 }), // E.g., "2079/080"

  // Fees and service charges
  surveyCostPerParcelNPR: decimal("survey_cost_per_parcel_npr", {
    precision: 10,
    scale: 2,
  }),
  mapPrintingFeeNPR: decimal("map_printing_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  landTitleSurveyFeeNPR: decimal("land_title_survey_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  subdivisionFeeNPR: decimal("subdivision_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  boundarySurveyFeeNPR: decimal("boundary_survey_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  feeStructureDetails: text("fee_structure_details"),
  subsidizedServices: boolean("subsidized_services").default(false),
  subsidizedServicesDetails: text("subsidized_services_details"),

  // Challenges and needs
  technicalChallenges: text("technical_challenges"),
  infrastructureChallenges: text("infrastructure_challenges"),
  equipmentNeeds: text("equipment_needs"),
  trainingNeeds: text("training_needs"),
  softwareNeeds: text("software_needs"),
  otherChallenges: text("other_challenges"),

  // Coordination and networking
  coordWithMunicipalOffice: boolean("coord_with_municipal_office").default(
    true,
  ),
  coordWithLandRevenueOffice: boolean("coord_with_land_revenue_office").default(
    true,
  ),
  coordWithCourtSystem: boolean("coord_with_court_system").default(false),
  coordWithDepartmentSurvey: boolean("coord_with_department_survey").default(
    true,
  ),
  externalCoordination: text("external_coordination"),
  dataSharing: text("data_sharing"),

  // Projects and initiatives
  ongoingProjects: text("ongoing_projects"),
  plannedProjectsUpgrades: text("planned_projects_upgrades"),
  innovationInitiatives: text("innovation_initiatives"),
  modernizationEfforts: text("modernization_efforts"),

  // Future development plans
  expansionPlans: text("expansion_plans"),
  technologyUpgradePlans: text("technology_upgrade_plans"),
  serviceImprovementPlans: text("service_improvement_plans"),

  // Training and capacity building
  trainingFacilitiesAvailable: boolean("training_facilities_available").default(
    false,
  ),
  trainingProgramsOffered: text("training_programs_offered"),
  annualTrainingBudgetNPR: decimal("annual_training_budget_npr", {
    precision: 14,
    scale: 2,
  }),
  trainingFrequency: text("training_frequency"),

  // Public awareness
  publicAwarenessPrograms: boolean("public_awareness_programs").default(false),
  outreachActivities: text("outreach_activities"),
  publicInformationMaterials: boolean("public_information_materials").default(
    false,
  ),
  serviceChartsAvailable: boolean("service_charts_available").default(true),

  // Transparency and governance
  transparencyMechanisms: text("transparency_mechanisms"),
  antiCorruptionMeasures: text("anti_corruption_measures"),
  publicGrievanceSystem: boolean("public_grievance_system").default(false),

  // Linkages to other entities
  linkedLandRevenueOffices: jsonb("linked_land_revenue_offices").default(
    sql`'[]'::jsonb`,
  ),
  linkedMunicipalityOffices: jsonb("linked_municipality_offices").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedForestOffices: jsonb("linked_forest_offices").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  jurisdictionAreaGeometry: geometry("jurisdiction_area_geometry", {
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

export type LandSurveyBranch = typeof landSurveyBranch.$inferSelect;
export type NewLandSurveyBranch = typeof landSurveyBranch.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
