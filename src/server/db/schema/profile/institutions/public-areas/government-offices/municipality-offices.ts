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

// Define municipality classification enum
export const municipalityClassificationEnum = pgEnum(
  "municipality_classification",
  [
    "METROPOLITAN_CITY",
    "SUB_METROPOLITAN_CITY",
    "MUNICIPALITY",
    "RURAL_MUNICIPALITY",
  ],
);

// Define office digital infrastructure level
export const digitalInfrastructureLevelEnum = pgEnum(
  "digital_infrastructure_level",
  ["ADVANCED", "MODERATE", "BASIC", "MINIMAL", "NONE"],
);

// Define service satisfaction enum
export const servicePerformanceEnum = pgEnum("service_performance", [
  "EXCELLENT",
  "GOOD",
  "SATISFACTORY",
  "NEEDS_IMPROVEMENT",
  "POOR",
]);

// Municipality Office table
export const municipalityOffice = pgTable("municipality_office", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  classification: municipalityClassificationEnum("classification").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  municipalityCode: varchar("municipality_code", { length: 20 }), // Official code
  establishedDate: date("established_date"),
  provinceNumber: integer("province_number"),
  districtName: text("district_name"),
  localLevelType: text("local_level_type"), // Additional categorization if needed

  // Administrative details
  totalWards: integer("total_wards"),
  totalAreaSqKm: decimal("total_area_sq_km", { precision: 10, scale: 2 }),
  populationCount: integer("population_count"),
  populationYear: varchar("population_year", { length: 4 }), // Year of population data
  populationDensity: decimal("population_density", { precision: 10, scale: 2 }), // People per sq km

  // Leadership and management
  mayorName: text("mayor_name"), // Or chairperson for rural municipalities
  deputyMayorName: text("deputy_mayor_name"), // Or vice-chairperson
  chiefAdministrativeOfficerName: text("chief_administrative_officer_name"),
  electionLastHeldDate: date("election_last_held_date"),

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
  instagramHandle: text("instagram_handle"),
  youtubeChannel: text("youtube_channel"),

  // Operating hours
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  isOpenOnWeekends: boolean("is_open_on_weekends").default(false),
  weeklyOffDays: text("weekly_off_days"), // E.g., "Saturday" or "Sunday"
  holidaySchedule: text("holiday_schedule"), // Description of holiday closures

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
  buildingAmenities: text("building_amenities"),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"), // E.g., "Generator", "Solar", "UPS"
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterSourceType: text("water_source_type"), // E.g., "Municipal", "Well", "Tanker"
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetType: text("internet_type"), // E.g., "Fiber", "DSL", "4G"
  internetSpeed: text("internet_speed"), // E.g., "10 Mbps", "100 Mbps"

  // Public facilities
  hasPublicWaitingArea: boolean("has_public_waiting_area").default(false),
  waitingAreaCapacity: integer("waiting_area_capacity"),
  hasPublicToilets: boolean("has_public_toilets").default(false),
  hasHandicapToilets: boolean("has_handicap_toilets").default(false),
  hasPublicWifi: boolean("has_public_wifi").default(false),
  hasDrinkingWater: boolean("has_drinking_water").default(false),
  hasHelpDesk: boolean("has_help_desk").default(false),
  hasTokenSystem: boolean("has_token_system").default(false),
  hasFeedbackSystem: boolean("has_feedback_system").default(false),
  hasInformationDesk: boolean("has_information_desk").default(false),
  hasNoticeBoard: boolean("has_notice_board").default(true),

  // Digital infrastructure
  digitalInfrastructureLevel: digitalInfrastructureLevelEnum(
    "digital_infrastructure_level",
  ),
  hasBiometricAttendance: boolean("has_biometric_attendance").default(false),
  hasCctv: boolean("has_cctv").default(false),
  hasEGovernance: boolean("has_e_governance").default(false),
  eGovernanceDetails: text("e_governance_details"),
  hasDigitalPayment: boolean("has_digital_payment").default(false),
  digitalPaymentMethods: text("digital_payment_methods"),
  hasOnlineApplications: boolean("has_online_applications").default(false),
  onlineServicesOffered: text("online_services_offered"),
  hasDigitalRecordKeeping: boolean("has_digital_record_keeping").default(false),
  hasWebPortal: boolean("has_web_portal").default(false),
  webPortalServices: text("web_portal_services"),
  hasMobileApp: boolean("has_mobile_app").default(false),
  mobileAppServices: text("mobile_app_services"),
  hasGrievancePortal: boolean("has_grievance_portal").default(false),

  // Staff details
  totalStaffCount: integer("total_staff_count"),
  permanentStaffCount: integer("permanent_staff_count"),
  temporaryStaffCount: integer("temporary_staff_count"),
  contractStaffCount: integer("contract_staff_count"),
  maleStaffCount: integer("male_staff_count"),
  femaleStaffCount: integer("female_staff_count"),
  otherGenderStaffCount: integer("other_gender_staff_count"),
  staffingAdequacy: text("staffing_adequacy"), // Assessment of staffing levels

  // Services offered
  vitalRegistrationServices: boolean("vital_registration_services").default(
    true,
  ),
  propertyTaxCollection: boolean("property_tax_collection").default(true),
  businessRegistration: boolean("business_registration").default(true),
  buildingPermits: boolean("building_permits").default(true),
  recommendationLetters: boolean("recommendation_letters").default(true),
  socialSecurityDistribution: boolean("social_security_distribution").default(
    true,
  ),
  disasterResponseServices: boolean("disaster_response_services").default(true),
  agriculturalExtensionServices: boolean(
    "agricultural_extension_services",
  ).default(false),
  environmentalServices: boolean("environmental_services").default(false),
  healthServices: boolean("health_services").default(false),
  educationalServices: boolean("educational_services").default(false),
  othersServicesOffered: text("others_services_offered"),

  // Service performance metrics
  averageServiceTimeMinutes: integer("average_service_time_minutes"),
  dailyVisitorCount: integer("daily_visitor_count"),
  monthlyServiceDeliveryCount: integer("monthly_service_delivery_count"),
  servicePerformanceRating: servicePerformanceEnum(
    "service_performance_rating",
  ),
  citizenSatisfactionPercent: integer("citizen_satisfaction_percent"), // 0-100
  serviceInnovations: text("service_innovations"),

  // Budget and finance
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  revenueCollectionNPR: decimal("revenue_collection_npr", {
    precision: 18,
    scale: 2,
  }),
  budgetFiscalYear: varchar("budget_fiscal_year", { length: 9 }), // E.g., "2079/080"
  majorIncomeSourcesDetails: text("major_income_sources_details"),
  majorExpenditureDetails: text("major_expenditure_details"),
  externalFundingSources: text("external_funding_sources"),
  hasBudgetPublicDisclosure: boolean("has_budget_public_disclosure").default(
    false,
  ),

  // Development activities
  developmentBudgetNPR: decimal("development_budget_npr", {
    precision: 18,
    scale: 2,
  }),
  ongoingDevelopmentProjects: text("ongoing_development_projects"),
  completedDevelopmentProjects: text("completed_development_projects"),
  majorInfrastructureProjects: text("major_infrastructure_projects"),
  publicPrivatePartnerships: text("public_private_partnerships"),

  // Governance and transparency
  annualPlanPublished: boolean("annual_plan_published").default(false),
  publicHearingsHeld: boolean("public_hearings_held").default(false),
  publicHearingsFrequency: text("public_hearings_frequency"),
  transparencyMechanisms: text("transparency_mechanisms"),
  antiCorruptionMeasures: text("anti_corruption_measures"),
  rightToInformationOfficer: boolean("right_to_information_officer").default(
    false,
  ),

  // Committees and governance structures
  hasJudicialCommittee: boolean("has_judicial_committee").default(true),
  hasDisputeResolutionMechanism: boolean(
    "has_dispute_resolution_mechanism",
  ).default(false),
  hasConsumerCommittee: boolean("has_consumer_committee").default(false),
  hasProcurementCommittee: boolean("has_procurement_committee").default(true),
  executiveCommitteeSize: integer("executive_committee_size"),
  womenInExecutiveCommittee: integer("women_in_executive_committee"),
  dalitsInExecutiveCommittee: integer("dalits_in_executive_committee"),

  // Resources and assets
  vehicleCount: integer("vehicle_count"),
  heavyEquipmentCount: integer("heavy_equipment_count"),
  computerCount: integer("computer_count"),
  assetManagementSystem: boolean("asset_management_system").default(false),
  landHoldingsDetails: text("land_holdings_details"),

  // Partnership and coordination
  ngoCommunityPartnerships: text("ngo_community_partnerships"),
  coordinationWithProvinceGov: text("coordination_with_province_gov"),
  coordinationWithFederalGov: text("coordination_with_federal_gov"),
  interMunicipalCooperation: text("inter_municipal_cooperation"),
  internationalPartnerships: text("international_partnerships"),

  // Challenges and needs
  institutionalChallenges: text("institutional_challenges"),
  resourceChallenges: text("resource_challenges"),
  capacityChallenges: text("capacity_challenges"),
  developmentPriorities: text("development_priorities"),

  // Future plans and strategic vision
  strategicPlan: boolean("strategic_plan").default(false),
  strategicPlanPeriod: text("strategic_plan_period"), // E.g., "2022-2027"
  visionStatement: text("vision_statement"),
  futureExpansionPlans: text("future_expansion_plans"),
  digitizationPlans: text("digitization_plans"),
  capacityBuildingPlans: text("capacity_building_plans"),

  // Awards and recognitions
  awardsReceived: text("awards_received"),
  certificationsObtained: text("certifications_obtained"),
  bestPracticesImplemented: text("best_practices_implemented"),

  // Publications and communications
  periodicPublications: text("periodic_publications"),
  communicationStrategy: text("communication_strategy"),
  publicAwarenessPrograms: text("public_awareness_programs"),

  // Special facilities or programs
  specialPrograms: text("special_programs"),
  facilityForElderly: boolean("facility_for_elderly").default(false),
  facilityForChildren: boolean("facility_for_children").default(false),
  facilityForWomen: boolean("facility_for_women").default(false),
  facilityForDisabled: boolean("facility_for_disabled").default(false),
  disasterManagementPlans: boolean("disaster_management_plans").default(false),

  // Linkages to other entities
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedHealthInstitutions: jsonb("linked_health_institutions").default(
    sql`'[]'::jsonb`,
  ),
  linkedEducationalInstitutions: jsonb(
    "linked_educational_institutions",
  ).default(sql`'[]'::jsonb`),
  linkedInfrastructureProjects: jsonb("linked_infrastructure_projects").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  jurisdictionArea: geometry("jurisdiction_area", { type: "MultiPolygon" }),

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

export type MunicipalityOffice = typeof municipalityOffice.$inferSelect;
export type NewMunicipalityOffice = typeof municipalityOffice.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
