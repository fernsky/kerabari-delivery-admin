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
import {
  digitalInfrastructureLevelEnum,
  servicePerformanceEnum,
} from "./municipality-offices";

// Define ward location enum
export const wardLocationTypeEnum = pgEnum("ward_location_type", [
  "URBAN",
  "SEMI_URBAN",
  "RURAL",
  "REMOTE",
]);

// Ward Office table
export const wardOffice = pgTable("ward_office", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),

  // Location details
  wardNumber: integer("ward_number").notNull(),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  locationType: wardLocationTypeEnum("location_type"),

  // Basic information
  municipalityOfficeId: varchar("municipality_office_id", { length: 36 }), // Foreign key to municipality
  establishedDate: date("established_date"),
  populationCount: integer("population_count"),
  populationYear: varchar("population_year", { length: 4 }), // Year of population data
  householdCount: integer("household_count"),
  totalAreaSqKm: decimal("total_area_sq_km", { precision: 10, scale: 2 }),

  // Leadership and management
  wardChairpersonName: text("ward_chairperson_name"),
  electionLastHeldDate: date("election_last_held_date"),
  wardSecretaryName: text("ward_secretary_name"), // Government appointed official

  // Contact information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  faxNumber: text("fax_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

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
  hasNoticeBoard: boolean("has_notice_board").default(true),

  // Digital infrastructure
  digitalInfrastructureLevel: digitalInfrastructureLevelEnum(
    "digital_infrastructure_level",
  ),
  hasBiometricAttendance: boolean("has_biometric_attendance").default(false),
  hasCctv: boolean("has_cctv").default(false),
  hasEGovernance: boolean("has_e_governance").default(false),
  hasDigitalPayment: boolean("has_digital_payment").default(false),
  digitalPaymentMethods: text("digital_payment_methods"),
  hasOnlineApplications: boolean("has_online_applications").default(false),
  onlineServicesOffered: text("online_services_offered"),
  hasDigitalRecordKeeping: boolean("has_digital_record_keeping").default(false),

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
  disasterResponseServices: boolean("disaster_response_services").default(
    false,
  ),
  othersServicesOffered: text("others_services_offered"),

  // Service performance metrics
  averageServiceTimeMinutes: integer("average_service_time_minutes"),
  dailyVisitorCount: integer("daily_visitor_count"),
  monthlyServiceDeliveryCount: integer("monthly_service_delivery_count"),
  servicePerformanceRating: servicePerformanceEnum(
    "service_performance_rating",
  ),
  citizenSatisfactionPercent: integer("citizen_satisfaction_percent"), // 0-100

  // Budget and finance
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  budgetFiscalYear: varchar("budget_fiscal_year", { length: 9 }), // E.g., "2079/080"
  majorExpenditureDetails: text("major_expenditure_details"),

  // Development activities
  developmentBudgetNPR: decimal("development_budget_npr", {
    precision: 18,
    scale: 2,
  }),
  ongoingDevelopmentProjects: text("ongoing_development_projects"),
  completedDevelopmentProjects: text("completed_development_projects"),

  // Governance and transparency
  publicHearingsHeld: boolean("public_hearings_held").default(false),
  publicHearingsFrequency: text("public_hearings_frequency"),

  // Committees
  hasConsumerCommittee: boolean("has_consumer_committee").default(false),
  wardCommitteeSize: integer("ward_committee_size"),
  womenInWardCommittee: integer("women_in_ward_committee"),
  dalitsInWardCommittee: integer("dalits_in_ward_committee"),

  // Challenges and needs
  institutionalChallenges: text("institutional_challenges"),
  resourceChallenges: text("resource_challenges"),
  developmentPriorities: text("development_priorities"),

  // Linkages to other entities
  linkedCommunityGroups: jsonb("linked_community_groups").default(
    sql`'[]'::jsonb`,
  ),
  linkedHealthInstitutions: jsonb("linked_health_institutions").default(
    sql`'[]'::jsonb`,
  ),
  linkedEducationalInstitutions: jsonb(
    "linked_educational_institutions",
  ).default(sql`'[]'::jsonb`),
  linkedReligiousPlaces: jsonb("linked_religious_places").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  wardBoundary: geometry("ward_boundary", { type: "MultiPolygon" }),

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

export type WardOffice = typeof wardOffice.$inferSelect;
export type NewWardOffice = typeof wardOffice.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
