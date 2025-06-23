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

// Define library type enum
export const libraryTypeEnum = pgEnum("library_type", [
  "PUBLIC_LIBRARY",
  "COMMUNITY_LIBRARY",
  "SCHOOL_LIBRARY",
  "COLLEGE_LIBRARY",
  "UNIVERSITY_LIBRARY",
  "SPECIALIZED_LIBRARY",
  "MOBILE_LIBRARY",
  "DIGITAL_LIBRARY",
  "CHILDREN_LIBRARY",
  "OTHER",
]);

// Define library management type enum
export const libraryManagementTypeEnum = pgEnum("library_management_type", [
  "GOVERNMENT_MANAGED",
  "COMMUNITY_MANAGED",
  "NGO_MANAGED",
  "PRIVATELY_MANAGED",
  "EDUCATIONAL_INSTITUTION_MANAGED",
  "COOPERATIVE_MANAGED",
  "TRUST_MANAGED",
  "MIXED_MANAGEMENT",
  "OTHER",
]);

// Define library building condition enum
export const libraryBuildingConditionEnum = pgEnum(
  "library_building_condition",
  [
    "EXCELLENT",
    "GOOD",
    "FAIR",
    "NEEDS_REPAIR",
    "NEEDS_RECONSTRUCTION",
    "UNDER_CONSTRUCTION",
    "TEMPORARY",
  ],
);

// Define collection size category enum
export const collectionSizeCategoryEnum = pgEnum("collection_size_category", [
  "VERY_SMALL", // < 1,000 items
  "SMALL", // 1,000 - 5,000 items
  "MEDIUM", // 5,001 - 15,000 items
  "LARGE", // 15,001 - 50,000 items
  "VERY_LARGE", // > 50,000 items
]);

// Define automation level enum
export const automationLevelEnum = pgEnum("automation_level", [
  "FULLY_AUTOMATED",
  "PARTIALLY_AUTOMATED",
  "BASIC_AUTOMATION",
  "MANUAL_SYSTEM",
  "UNDER_AUTOMATION",
  "NO_AUTOMATION",
]);

// Define usage frequency enum
export const libraryUsageFrequencyEnum = pgEnum("usage_frequency", [
  "VERY_HIGH", // > 100 users daily
  "HIGH", // 50-100 users daily
  "MODERATE", // 20-50 users daily
  "LOW", // 5-20 users daily
  "VERY_LOW", // < 5 users daily
  "SEASONAL", // Usage varies by season
]);

// Library table
export const library = pgTable("library", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  type: libraryTypeEnum("type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  establishedDate: date("established_date"),
  managementType: libraryManagementTypeEnum("management_type").notNull(),
  managingAuthority: text("managing_authority"), // Name of managing committee/organization/institution
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // Which govt body it's registered with
  panNumber: varchar("pan_number", { length: 20 }),
  isAffiliatedWithNetwork: boolean("is_affiliated_with_network").default(false),
  affiliationDetails: text("affiliation_details"),

  // Contact information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Social media presence
  facebookPage: text("facebook_page"),
  otherSocialMedia: text("other_social_media"),

  // Operating hours
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  isOpenOnWeekends: boolean("is_open_on_weekends").default(false),
  weeklyOffDays: text("weekly_off_days"), // E.g., "Saturday" or "Sunday"

  // Building infrastructure
  hasDedicatedBuilding: boolean("has_dedicated_building").default(true),
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", "Shared", etc.
  monthlyRentNPR: decimal("monthly_rent_npr", { precision: 10, scale: 2 }),
  buildingCondition: libraryBuildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  totalFloorAreaSqm: decimal("total_floor_area_sq_m", {
    precision: 10,
    scale: 2,
  }),
  totalFloors: integer("total_floors"),
  totalRooms: integer("total_rooms"),

  // Reading facilities
  readingRoomCapacity: integer("reading_room_capacity"), // Number of seats
  hasChildrenReadingSection: boolean("has_children_reading_section").default(
    false,
  ),
  hasReferenceSection: boolean("has_reference_section").default(false),
  hasPeriodicalSection: boolean("has_periodical_section").default(false),
  hasDigitalSection: boolean("has_digital_section").default(false),
  hasGroupStudySpace: boolean("has_group_study_space").default(false),
  hasIndividualStudyCarrels: boolean("has_individual_study_carrels").default(
    false,
  ),
  studyCarrelCount: integer("study_carrel_count"),
  hasOutdoorReadingSpace: boolean("has_outdoor_reading_space").default(false),

  // Furniture and equipment
  tableCount: integer("table_count"),
  chairCount: integer("chair_count"),
  shelvingUnitCount: integer("shelving_unit_count"),
  hasLockers: boolean("has_lockers").default(false),
  lockerCount: integer("locker_count"),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"), // E.g., "Generator", "Solar", "UPS"
  hasWaterSupply: boolean("has_water_supply").default(true),
  hasToilets: boolean("has_toilets").default(true),
  hasDisabledAccessibleToilets: boolean(
    "has_disabled_accessible_toilets",
  ).default(false),
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetType: text("internet_type"), // E.g., "Fiber", "DSL", "4G"
  internetSpeed: text("internet_speed"), // E.g., "10 Mbps"
  hasWifi: boolean("has_wifi").default(false),
  hasHeatingSystem: boolean("has_heating_system").default(false),
  hasCoolingSystem: boolean("has_cooling_system").default(false),

  // Library collection
  totalBooksCount: integer("total_books_count"),
  nepaliLanguageBooksCount: integer("nepali_language_books_count"),
  englishLanguageBooksCount: integer("english_language_books_count"),
  otherLanguageBooksCount: integer("other_language_books_count"),
  childrenBooksCount: integer("children_books_count"),
  referenceBooksCount: integer("reference_books_count"),
  textbookCount: integer("textbook_count"),
  fictionBooksCount: integer("fiction_books_count"),
  nonFictionBooksCount: integer("non_fiction_books_count"),
  rarebooksCount: integer("rarebooks_count"),
  antiqueBooksCount: integer("antique_books_count"),
  localHistoryBooksCount: integer("local_history_books_count"),
  periodicalSubscriptionsCount: integer("periodical_subscriptions_count"),
  newspaperSubscriptionsCount: integer("newspaper_subscriptions_count"),
  magazineSubscriptionsCount: integer("magazine_subscriptions_count"),
  audioVisualMaterialsCount: integer("audio_visual_materials_count"),
  digitalResourcesCount: integer("digital_resources_count"),
  collectionSizeCategory: collectionSizeCategoryEnum(
    "collection_size_category",
  ),
  lastInventoryDate: date("last_inventory_date"),
  annualNewAcquisitionsCount: integer("annual_new_acquisitions_count"),
  totalCollectionValueNPR: decimal("total_collection_value_npr", {
    precision: 14,
    scale: 2,
  }),

  // Cataloging and classification
  hasOrganizedCatalog: boolean("has_organized_catalog").default(false),
  catalogSystem: text("catalog_system"), // E.g., "Dewey Decimal", "Library of Congress", "Custom"
  hasCatalogCards: boolean("has_catalog_cards").default(false),
  hasDigitalCatalog: boolean("has_digital_catalog").default(false),
  catalogSoftware: text("catalog_software"), // Name of software if used

  // Circulation and lending
  hasMembershipSystem: boolean("has_membership_system").default(true),
  totalMembersCount: integer("total_members_count"),
  studentMembersCount: integer("student_members_count"),
  teacherMembersCount: integer("teacher_members_count"),
  communityMembersCount: integer("community_members_count"),
  lifetimeMembersCount: integer("lifetime_members_count"),
  annualMembershipFeeNPR: decimal("annual_membership_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  studentMembershipFeeNPR: decimal("student_membership_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  maxBooksPerMember: integer("max_books_per_member"),
  maxLoanPeriodDays: integer("max_loan_period_days"),
  lateFeePerDayNPR: decimal("late_fee_per_day_npr", { precision: 6, scale: 2 }),
  averageMonthlyCirculation: integer("average_monthly_circulation"),

  // Automation and digital resources
  automationLevel: automationLevelEnum("automation_level"),
  hasComputerizedCatalog: boolean("has_computerized_catalog").default(false),
  hasBarcodingSystem: boolean("has_barcoding_system").default(false),
  hasRFIDSystem: boolean("has_rfid_system").default(false),
  digitalResourceAccess: boolean("digital_resource_access").default(false),
  subscribeToDigitalResources: boolean(
    "subscribe_to_digital_resources",
  ).default(false),
  digitalResourceDetails: text("digital_resource_details"),
  hasDigitalRepository: boolean("has_digital_repository").default(false),
  digitalRepositoryDetails: text("digital_repository_details"),

  // Computer and digital facilities
  hasComputers: boolean("has_computers").default(false),
  computerCount: integer("computer_count"),
  computersForPublicUseCount: integer("computers_for_public_use_count"),
  computersForStaffUseCount: integer("computers_for_staff_use_count"),
  hasPrinters: boolean("has_printers").default(false),
  printerCount: integer("printer_count"),
  hasPhotocopiers: boolean("has_photocopiers").default(false),
  photocopierCount: integer("photocopier_count"),
  hasScanners: boolean("has_scanners").default(false),
  scannerCount: integer("scanner_count"),

  // Staff and human resources
  totalStaffCount: integer("total_staff_count"),
  permanentStaffCount: integer("permanent_staff_count"),
  temporaryStaffCount: integer("temporary_staff_count"),
  volunteerStaffCount: integer("volunteer_staff_count"),
  trainedLibrarianCount: integer("trained_librarian_count"),
  untranedStaffCount: integer("untraned_staff_count"),
  maleStaffCount: integer("male_staff_count"),
  femaleStaffCount: integer("female_staff_count"),
  otherGenderStaffCount: integer("other_gender_staff_count"),
  chiefLibrarianQualification: text("chief_librarian_qualification"),
  staffTrainingStatus: text("staff_training_status"),

  // Services offered
  offersReferenceService: boolean("offers_reference_service").default(true),
  offersInterLibraryLoan: boolean("offers_inter_library_loan").default(false),
  offersMobileLibraryService: boolean("offers_mobile_library_service").default(
    false,
  ),
  offersOnlineResourceAccess: boolean("offers_online_resource_access").default(
    false,
  ),
  offersCommunityPrograms: boolean("offers_community_programs").default(false),
  communityProgramDetails: text("community_program_details"),
  offersReadingPrograms: boolean("offers_reading_programs").default(false),
  readingProgramDetails: text("reading_program_details"),
  offersSkillTraining: boolean("offers_skill_training").default(false),
  skillTrainingDetails: text("skill_training_details"),
  offersResearchSupport: boolean("offers_research_support").default(false),
  offersBibliographyService: boolean("offers_bibliography_service").default(
    false,
  ),
  offersDigitizationService: boolean("offers_digitization_service").default(
    false,
  ),
  offersPrintingService: boolean("offers_printing_service").default(false),
  offersCopyingService: boolean("offers_copying_service").default(false),
  offersScanningService: boolean("offers_scanning_service").default(false),

  // Usage and performance
  averageDailyVisitorsCount: integer("average_daily_visitors_count"),
  peakHourVisitorsCount: integer("peak_hour_visitors_count"),
  annualVisitorsCount: integer("annual_visitors_count"),
  usageFrequency: libraryUsageFrequencyEnum("usage_frequency"),
  userSatisfactionLevel: text("user_satisfaction_level"),
  collectionUsageRate: decimal("collection_usage_rate", {
    precision: 5,
    scale: 2,
  }),
  spaceUtilizationRate: decimal("space_utilization_rate", {
    precision: 5,
    scale: 2,
  }),

  // Financial aspects
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  collectionBudgetNPR: decimal("collection_budget_npr", {
    precision: 14,
    scale: 2,
  }),
  salaryBudgetNPR: decimal("salary_budget_npr", { precision: 14, scale: 2 }),
  facilitiesBudgetNPR: decimal("facilities_budget_npr", {
    precision: 14,
    scale: 2,
  }),
  hasGeneratedIncome: boolean("has_generated_income").default(false),
  annualIncomeNPR: decimal("annual_income_npr", { precision: 14, scale: 2 }),
  incomeSources: text("income_sources"),
  receivesGovernmentFunding: boolean("receives_government_funding").default(
    false,
  ),
  governmentFundingDetailsNPR: decimal("government_funding_details_npr", {
    precision: 14,
    scale: 2,
  }),
  receivesDonorFunding: boolean("receives_donor_funding").default(false),
  donorFundingDetailsNPR: decimal("donor_funding_details_npr", {
    precision: 14,
    scale: 2,
  }),
  donorOrganizations: text("donor_organizations"),

  // Management and governance
  hasManagementCommittee: boolean("has_management_committee").default(false),
  managementCommitteeSize: integer("management_committee_size"),
  femaleCommitteeMembers: integer("female_committee_members"),
  committeeMeetingFrequency: text("committee_meeting_frequency"),
  hasPoliciesAndProcedures: boolean("has_policies_and_procedures").default(
    false,
  ),
  hasStrategicPlan: boolean("has_strategic_plan").default(false),
  hasAnnualWorkPlan: boolean("has_annual_work_plan").default(false),
  hasUserFeedbackSystem: boolean("has_user_feedback_system").default(false),
  lastManagerElectionDate: date("last_manager_election_date"),

  // Collaboration and partnerships
  collaboratingInstitutions: text("collaborating_institutions"),
  partnershipDetails: text("partnership_details"),

  // Security and safety
  hasSecuritySystem: boolean("has_security_system").default(false),
  securitySystemDetails: text("security_system_details"),
  hasFireSafetyEquipment: boolean("has_fire_safety_equipment").default(false),
  fireSafetyDetails: text("fire_safety_details"),
  hasDisasterManagementPlan: boolean("has_disaster_management_plan").default(
    false,
  ),

  // Challenges and needs
  majorChallenges: text("major_challenges"),
  collectionDevelopmentNeeds: text("collection_development_needs"),
  infrastructureNeeds: text("infrastructure_needs"),
  staffingNeeds: text("staffing_needs"),
  technologicalNeeds: text("technological_needs"),

  // Future plans
  expansionPlans: text("expansion_plans"),
  digitizationPlans: text("digitization_plans"),
  serviceImprovementPlans: text("service_improvement_plans"),

  // Historical significance
  historicalNotes: text("historical_notes"),
  culturalSignificance: text("cultural_significance"),
  specialCollections: text("special_collections"),
  notableAchievements: text("notable_achievements"),

  // Community impact
  communityEngagementActivities: text("community_engagement_activities"),
  educationalImpact: text("educational_impact"),
  culturalPreservationEfforts: text("cultural_preservation_efforts"),

  // Linkages to other entities
  linkedSchools: jsonb("linked_schools").default(sql`'[]'::jsonb`),
  linkedColleges: jsonb("linked_colleges").default(sql`'[]'::jsonb`),
  linkedCommunityOrganizations: jsonb("linked_community_organizations").default(
    sql`'[]'::jsonb`,
  ),
  linkedGovernmentOffices: jsonb("linked_government_offices").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),

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

export type Library = typeof library.$inferSelect;
export type NewLibrary = typeof library.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
