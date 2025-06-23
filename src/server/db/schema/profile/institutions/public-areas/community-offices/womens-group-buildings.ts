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
import {
  buildingConstructionMaterialEnum,
  managementTypeEnum,
} from "./community-buildings";
import {
  accessibilityLevelEnum,
  buildingConditionEnum,
  usageFrequencyEnum,
} from "../../common";

// Define women's group building type enum
export const womensGroupBuildingTypeEnum = pgEnum(
  "womens_group_building_type",
  [
    "MOTHERS_GROUP_BUILDING",
    "WOMENS_COOPERATIVE",
    "WOMENS_CENTER",
    "WOMENS_SHELTER",
    "WOMEN_EMPOWERMENT_CENTER",
    "SKILL_DEVELOPMENT_CENTER",
    "WOMENS_SAVING_GROUP",
    "WOMEN_ENTERPRISE_CENTER",
    "WOMEN_HEALTH_CENTER",
    "MULTIPURPOSE_CENTER",
    "OTHER",
  ],
);

// Define women's group focus area enum
export const womenGroupFocusAreaEnum = pgEnum("women_group_focus_area", [
  "ECONOMIC_EMPOWERMENT",
  "HEALTH_AND_SANITATION",
  "EDUCATION",
  "RIGHTS_ADVOCACY",
  "GENDER_BASED_VIOLENCE",
  "SAVINGS_AND_CREDIT",
  "SKILL_DEVELOPMENT",
  "ENVIRONMENTAL_CONSERVATION",
  "HANDICRAFTS_PRODUCTION",
  "LEADERSHIP_DEVELOPMENT",
  "REPRODUCTIVE_HEALTH",
  "COMMUNITY_DEVELOPMENT",
  "MULTIPLE_FOCUS",
  "OTHER",
]);

// Women's Group Building table
export const womensGroupBuilding = pgTable("womens_group_building", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  buildingType: womensGroupBuildingTypeEnum("building_type").notNull(),
  groupFocusArea: womenGroupFocusAreaEnum("group_focus_area").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  establishedYear: integer("established_year"),
  groupEstablishedYear: integer("group_established_year"), // Year when the women's group was established
  managementType: managementTypeEnum("management_type").notNull(),
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // Which govt body it's registered with
  registrationDate: date("registration_date"),
  lastRenewalDate: date("last_renewal_date"),
  isAffiliatedWithFederation: boolean("is_affiliated_with_federation").default(
    false,
  ),
  federationAffiliationDetails: text("federation_affiliation_details"),

  // Group composition
  totalMemberCount: integer("total_member_count"),
  activeMemberCount: integer("active_member_count"),
  daditMemberCount: integer("dalit_member_count"),
  janajatiMemberCount: integer("janajati_member_count"),
  brahminChhetriMemberCount: integer("brahmin_chhetri_member_count"),
  madhesiMemberCount: integer("madhesi_member_count"),
  muslimMemberCount: integer("muslim_member_count"),
  otherEthnicityMemberCount: integer("other_ethnicity_member_count"),
  pwdMemberCount: integer("pwd_member_count"), // Members with disabilities
  singleWomenMemberCount: integer("single_women_member_count"),
  youthMemberCount: integer("youth_member_count"),
  seniorMemberCount: integer("senior_member_count"),

  // Physical infrastructure
  hasDedicatedBuilding: boolean("has_dedicated_building").default(true),
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", "Shared", etc.
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
  buildingCondition: buildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  constructionMaterial: buildingConstructionMaterialEnum(
    "construction_material",
  ),
  lastRenovatedYear: integer("last_renovated_year"),
  totalFloors: integer("total_floors"),
  totalRooms: integer("total_rooms"),
  meetingHallCapacity: integer("meeting_hall_capacity"), // Number of people
  hasTrainingHall: boolean("has_training_hall").default(false),
  trainingHallCapacity: integer("training_hall_capacity"),
  hasOfficeSpace: boolean("has_office_space").default(false),
  hasStorage: boolean("has_storage").default(false),
  hasKitchen: boolean("has_kitchen").default(false),
  hasChildcareSpace: boolean("has_childcare_space").default(false),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  hasWaterSupply: boolean("has_water_supply").default(true),
  hasToilets: boolean("has_toilets").default(true),
  hasMenstrualHygieneManagement: boolean(
    "has_menstrual_hygiene_management",
  ).default(false),
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),

  // Equipment and resources
  hasComputers: boolean("has_computers").default(false),
  computerCount: integer("computer_count"),
  hasTrainingEquipment: boolean("has_training_equipment").default(false),
  trainingEquipmentDetails: text("training_equipment_details"),
  hasProductionEquipment: boolean("has_production_equipment").default(false),
  productionEquipmentDetails: text("production_equipment_details"),
  hasOfficeFurniture: boolean("has_office_furniture").default(false),
  hasAudioVisualEquipment: boolean("has_audio_visual_equipment").default(false),

  // Activities and operations
  meetingFrequency: text("meeting_frequency"), // E.g., "Monthly", "Weekly"
  regularActivities: text("regular_activities"),
  skillTrainingOffered: text("skill_training_offered"),
  awarenessProgramsOrganized: text("awareness_programs_organized"),
  incomeGenerationActivities: text("income_generation_activities"),
  healthActivities: text("health_activities"),
  educationActivities: text("education_activities"),
  advocacyActivities: text("advocacy_activities"),
  majorAnnualEvents: text("major_annual_events"),
  usageFrequency: usageFrequencyEnum("usage_frequency"),

  // Economic activities
  hasSavingCreditProgram: boolean("has_saving_credit_program").default(false),
  totalSavingsNPR: decimal("total_savings_npr", { precision: 18, scale: 2 }),
  loanPortfolioSizeNPR: decimal("loan_portfolio_size_npr", {
    precision: 18,
    scale: 2,
  }),
  interestRatePercent: decimal("interest_rate_percent", {
    precision: 5,
    scale: 2,
  }),
  defaultRatePercent: decimal("default_rate_percent", {
    precision: 5,
    scale: 2,
  }),
  hasEnterpriseActivities: boolean("has_enterprise_activities").default(false),
  enterpriseActivitiesDetails: text("enterprise_activities_details"),
  annualTurnoverNPR: decimal("annual_turnover_npr", {
    precision: 18,
    scale: 2,
  }),
  majorProductsProduced: text("major_products_produced"),
  marketLinkages: text("market_linkages"),

  // Financial aspects
  hasBank: boolean("has_bank_account").default(false),
  bankAccountDetails: text("bank_account_details"),
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  maintenanceFundNPR: decimal("maintenance_fund_npr", {
    precision: 14,
    scale: 2,
  }),
  fundingSources: text("funding_sources"),
  hasAnnualAudit: boolean("has_annual_audit").default(false),
  lastAuditDate: date("last_audit_date"),
  receivesExternalFunding: boolean("receives_external_funding").default(false),
  externalFundingSources: text("external_funding_sources"),
  hasInsurance: boolean("has_insurance").default(false),
  insuranceDetails: text("insurance_details"),

  // Governance and leadership
  hasWrittenConstitution: boolean("has_written_constitution").default(false),
  hasStrategicPlan: boolean("has_strategic_plan").default(false),
  executiveCommitteeSize: integer("executive_committee_size"),
  executiveCommitteeSelectionProcess: text(
    "executive_committee_selection_process",
  ),
  lastExecutiveElectionDate: date("last_executive_election_date"),
  decisionMakingProcess: text("decision_making_process"),
  leadershipRotationPolicy: text("leadership_rotation_policy"),
  hasSubcommittees: boolean("has_subcommittees").default(false),
  subcommitteeDetails: text("subcommittee_details"),
  hasOperationalManual: boolean("has_operational_manual").default(false),
  recordKeepingSystem: text("record_keeping_system"),

  // Staff and human resources
  hasFullTimeStaff: boolean("has_full_time_staff").default(false),
  fullTimeStaffCount: integer("full_time_staff_count"),
  hasPartTimeStaff: boolean("has_part_time_staff").default(false),
  partTimeStaffCount: integer("part_time_staff_count"),
  hasTrainedFacilitators: boolean("has_trained_facilitators").default(false),
  facilitatorCount: integer("facilitator_count"),
  staffTrainingDetails: text("staff_training_details"),
  volunteerCount: integer("volunteer_count"),

  // Partnerships and networks
  hasPartnershipWithLocalGovernment: boolean(
    "has_partnership_with_local_government",
  ).default(false),
  localGovernmentPartnershipDetails: text(
    "local_government_partnership_details",
  ),
  hasNgoPartnerships: boolean("has_ngo_partnerships").default(false),
  ngoPartnershipDetails: text("ngo_partnership_details"),
  hasPrivateSectorPartnerships: boolean(
    "has_private_sector_partnerships",
  ).default(false),
  privateSectorPartnershipDetails: text("private_sector_partnership_details"),
  networkMemberships: text("network_memberships"),

  // Accessibility and inclusion
  accessibilityLevel: accessibilityLevelEnum("accessibility_level"),
  distanceFromMainRoadKm: decimal("distance_from_main_road_km", {
    precision: 6,
    scale: 2,
  }),
  distanceFromCityOrBazarKm: decimal("distance_from_city_or_bazar_km", {
    precision: 6,
    scale: 2,
  }),
  publicTransportAccessibility: text("public_transport_accessibility"),
  inclusionPolicies: text("inclusion_policies"),
  inclusionChallenges: text("inclusion_challenges"),

  // Impact and achievements
  majorAchievements: text("major_achievements"),
  communityImpact: text("community_impact"),
  successStories: text("success_stories"),
  improvementsInWomensLives: text("improvements_in_womens_lives"),
  advocacySuccesses: text("advocacy_successes"),
  awardsAndRecognition: text("awards_and_recognition"),

  // Challenges and needs
  infrastructureChallenges: text("infrastructure_challenges"),
  capacityChallenges: text("capacity_challenges"),
  financialChallenges: text("financial_challenges"),
  socialChallenges: text("social_challenges"),
  maintenanceNeeds: text("maintenance_needs"),
  trainingNeeds: text("training_needs"),
  equipmentNeeds: text("equipment_needs"),
  fundingNeeds: text("funding_needs"),

  // Future plans
  strategicPriorities: text("strategic_priorities"),
  expansionPlans: text("expansion_plans"),
  sustainabilityPlans: text("sustainability_plans"),
  futureProjectsPlanned: text("future_projects_planned"),

  // Security and safety
  hasSafetyProtocol: boolean("has_safety_protocol").default(false),
  safetyProtocolDetails: text("safety_protocol_details"),
  hasGbvResponseMechanism: boolean("has_gbv_response_mechanism").default(false), // Gender-based violence
  gbvResponseDetails: text("gbv_response_details"),
  securityChallenges: text("security_challenges"),
  hasBoundaryWall: boolean("has_boundary_wall").default(false),

  // Contact information
  chairpersonName: text("chairperson_name"),
  secretaryName: text("secretary_name"),
  treasurerName: text("treasurer_name"),
  contactPhone: text("contact_phone"),
  alternateContactPhone: text("alternate_contact_phone"),
  contactEmail: text("contact_email"),

  // Digital presence
  hasSocialMediaPresence: boolean("has_social_media_presence").default(false),
  facebookPage: text("facebook_page"),
  websiteUrl: text("website_url"),
  otherSocialMedia: text("other_social_media"),

  // Linkages to other entities
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedCommunityGroups: jsonb("linked_community_groups").default(
    sql`'[]'::jsonb`,
  ),
  linkedHealthFacilities: jsonb("linked_health_facilities").default(
    sql`'[]'::jsonb`,
  ),
  linkedSchools: jsonb("linked_schools").default(sql`'[]'::jsonb`),
  linkedNGOs: jsonb("linked_ngos").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  compoundArea: geometry("compound_area", { type: "Polygon" }),

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

export type WomensGroupBuilding = typeof womensGroupBuilding.$inferSelect;
export type NewWomensGroupBuilding = typeof womensGroupBuilding.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
