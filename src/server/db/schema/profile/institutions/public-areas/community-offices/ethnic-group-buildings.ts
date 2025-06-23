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

// Define ethnic group building type enum
export const ethnicGroupBuildingTypeEnum = pgEnum(
  "ethnic_group_building_type",
  [
    "ETHNIC_COMMUNITY_CENTER",
    "CULTURAL_CENTER",
    "HERITAGE_PRESERVATION_CENTER",
    "TRADITIONAL_ART_CENTER",
    "TRADITIONAL_KNOWLEDGE_CENTER",
    "LANGUAGE_LEARNING_CENTER",
    "CRAFT_PRODUCTION_CENTER",
    "INDIGENOUS_KNOWLEDGE_CENTER",
    "MULTIPURPOSE_ETHNIC_CENTER",
    "OTHER",
  ],
);

// Define ethnic group focus area enum
export const ethnicGroupFocusAreaEnum = pgEnum("ethnic_group_focus_area", [
  "CULTURAL_HERITAGE_PRESERVATION",
  "LANGUAGE_PRESERVATION",
  "TRADITIONAL_ARTS_AND_CRAFTS",
  "COMMUNITY_DEVELOPMENT",
  "INDIGENOUS_KNOWLEDGE",
  "RIGHTS_ADVOCACY",
  "TRADITIONAL_MUSIC_AND_DANCE",
  "TRADITIONAL_HEALING_PRACTICES",
  "INTERGENERATIONAL_KNOWLEDGE_TRANSFER",
  "MULTIPLE_FOCUS",
  "OTHER",
]);

// Ethnic Group Building table
export const ethnicGroupBuilding = pgTable("ethnic_group_building", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  buildingType: ethnicGroupBuildingTypeEnum("building_type").notNull(),
  focusArea: ethnicGroupFocusAreaEnum("focus_area").notNull(),
  ethnicGroup: text("ethnic_group").notNull(), // Name of the ethnic group

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  establishedYear: integer("established_year"),
  groupEstablishedYear: integer("group_established_year"), // Year when the ethnic group organization was established
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
  maleMemberCount: integer("male_member_count"),
  femaleMemberCount: integer("female_member_count"),
  otherGenderMemberCount: integer("other_gender_member_count"),
  youthMemberCount: integer("youth_member_count"),
  adultMemberCount: integer("adult_member_count"),
  elderlyMemberCount: integer("elderly_member_count"),
  pwdMemberCount: integer("pwd_member_count"), // Members with disabilities

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
  hasPerformanceSpace: boolean("has_performance_space").default(false),
  performanceSpaceCapacity: integer("performance_space_capacity"),
  hasCulturalDisplayArea: boolean("has_cultural_display_area").default(false),
  hasMuseumSection: boolean("has_museum_section").default(false),
  hasLibrarySpace: boolean("has_library_space").default(false),
  hasTrainingSpace: boolean("has_training_space").default(false),
  hasOfficeSpace: boolean("has_office_space").default(false),
  hasStorage: boolean("has_storage").default(false),
  hasKitchen: boolean("has_kitchen").default(false),
  hasTraditionalArchitecturalElements: boolean(
    "has_traditional_architectural_elements",
  ).default(false),
  traditionalElementsDetails: text("traditional_elements_details"),

  // Cultural artifacts and collections
  hasCulturalArtifacts: boolean("has_cultural_artifacts").default(false),
  artifactCollectionSize: integer("artifact_collection_size"),
  hasDocumentedHistory: boolean("has_documented_history").default(false),
  hasAudioVisualArchives: boolean("has_audio_visual_archives").default(false),
  hasTraditionalCostumeCollection: boolean(
    "has_traditional_costume_collection",
  ).default(false),
  costumeCollectionDetails: text("costume_collection_details"),
  hasTraditionalInstruments: boolean("has_traditional_instruments").default(
    false,
  ),
  instrumentCollectionDetails: text("instrument_collection_details"),
  hasManuscripts: boolean("has_manuscripts").default(false),
  manuscriptCollectionDetails: text("manuscript_collection_details"),
  collectionPreservationStatus: text("collection_preservation_status"),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  hasWaterSupply: boolean("has_water_supply").default(true),
  hasToilets: boolean("has_toilets").default(true),
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),

  // Equipment and resources
  hasComputers: boolean("has_computers").default(false),
  computerCount: integer("computer_count"),
  hasAudioRecordingEquipment: boolean("has_audio_recording_equipment").default(
    false,
  ),
  hasVideoRecordingEquipment: boolean("has_video_recording_equipment").default(
    false,
  ),
  hasProjector: boolean("has_projector").default(false),
  hasSoundSystem: boolean("has_sound_system").default(false),
  hasTraditionalCraftTools: boolean("has_traditional_craft_tools").default(
    false,
  ),
  traditionalToolsDetails: text("traditional_tools_details"),
  hasProductionEquipment: boolean("has_production_equipment").default(false),
  productionEquipmentDetails: text("production_equipment_details"),

  // Activities and operations
  meetingFrequency: text("meeting_frequency"), // E.g., "Monthly", "Weekly"
  regularActivities: text("regular_activities"),
  culturalEventsFrequency: text("cultural_events_frequency"),
  offersCulturalTraining: boolean("offers_cultural_training").default(false),
  culturalTrainingTypes: text("cultural_training_types"),
  offersLanguageLessons: boolean("offers_language_lessons").default(false),
  languageLessonDetails: text("language_lesson_details"),
  offersCraftTraining: boolean("offers_craft_training").default(false),
  craftTrainingDetails: text("craft_training_details"),
  hasOralHistoryProgram: boolean("has_oral_history_program").default(false),
  oralHistoryProgramDetails: text("oral_history_program_details"),
  hasCulturalExchanges: boolean("has_cultural_exchanges").default(false),
  majorAnnualEvents: text("major_annual_events"),
  usageFrequency: usageFrequencyEnum("usage_frequency"),

  // Product creation and marketing
  producesTraditionalProducts: boolean("produces_traditional_products").default(
    false,
  ),
  traditionalProductTypes: text("traditional_product_types"),
  hasSalesOutlet: boolean("has_sales_outlet").default(false),
  marketLinkages: text("market_linkages"),
  annualProductionValueNPR: decimal("annual_production_value_npr", {
    precision: 14,
    scale: 2,
  }),

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
  receivesGovernmentGrants: boolean("receives_government_grants").default(
    false,
  ),
  governmentGrantDetails: text("government_grant_details"),
  receivesInternationalSupport: boolean(
    "receives_international_support",
  ).default(false),
  internationalSupportDetails: text("international_support_details"),

  // Governance and leadership
  hasWrittenConstitution: boolean("has_written_constitution").default(false),
  hasStrategicPlan: boolean("has_strategic_plan").default(false),
  executiveCommitteeSize: integer("executive_committee_size"),
  executiveCommitteeElectionFrequencyYears: integer(
    "executive_committee_election_frequency_years",
  ),
  lastExecutiveElectionDate: date("last_executive_election_date"),
  femaleInExecutiveCommittee: integer("female_in_executive_committee"),
  youthInExecutiveCommittee: integer("youth_in_executive_committee"),
  hasElders: boolean("has_elders_council").default(false),
  eldersCouncilDetails: text("elders_council_details"),
  decisionMakingProcess: text("decision_making_process"),
  hasSubcommittees: boolean("has_subcommittees").default(false),
  subcommitteeDetails: text("subcommittee_details"),

  // Staff and human resources
  hasFullTimeStaff: boolean("has_full_time_staff").default(false),
  fullTimeStaffCount: integer("full_time_staff_count"),
  hasPartTimeStaff: boolean("has_part_time_staff").default(false),
  partTimeStaffCount: integer("part_time_staff_count"),
  hasTraditionalKnowledgeHolders: boolean(
    "has_traditional_knowledge_holders",
  ).default(false),
  traditionalKnowledgeHolderCount: integer(
    "traditional_knowledge_holder_count",
  ),
  hasLanguageTeachers: boolean("has_language_teachers").default(false),
  languageTeacherCount: integer("language_teacher_count"),
  hasMasterArtisans: boolean("has_master_artisans").default(false),
  masterArtisanCount: integer("master_artisan_count"),
  hasCulturalPerformers: boolean("has_cultural_performers").default(false),
  culturalPerformerCount: integer("cultural_performer_count"),
  volunteerCount: integer("volunteer_count"),

  // Partnerships and networks
  hasPartnershipWithLocalGovernment: boolean(
    "has_partnership_with_local_government",
  ).default(false),
  localGovernmentPartnershipDetails: text(
    "local_government_partnership_details",
  ),
  hasPartnershipWithSchools: boolean("has_partnership_with_schools").default(
    false,
  ),
  schoolPartnershipDetails: text("school_partnership_details"),
  hasPartnershipWithUniversities: boolean(
    "has_partnership_with_universities",
  ).default(false),
  universityPartnershipDetails: text("university_partnership_details"),
  hasPartnershipWithMuseums: boolean("has_partnership_with_museums").default(
    false,
  ),
  museumPartnershipDetails: text("museum_partnership_details"),
  hasPartnershipWithNGOs: boolean("has_partnership_with_ngos").default(false),
  ngoPartnershipDetails: text("ngo_partnership_details"),
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
  culturalPreservationImpact: text("cultural_preservation_impact"),
  languageRevitalizationEfforts: text("language_revitalization_efforts"),
  knowledgeDocumentationAchievements: text(
    "knowledge_documentation_achievements",
  ),
  policyInfluenceAchievements: text("policy_influence_achievements"),
  awardsAndRecognition: text("awards_and_recognition"),
  publicationsProduced: text("publications_produced"),

  // Challenges and needs
  infrastructureChallenges: text("infrastructure_challenges"),
  culturalPreservationChallenges: text("cultural_preservation_challenges"),
  languagePreservationChallenges: text("language_preservation_challenges"),
  financialChallenges: text("financial_challenges"),
  socialChallenges: text("social_challenges"),
  maintenanceNeeds: text("maintenance_needs"),
  trainingNeeds: text("training_needs"),
  documentationNeeds: text("documentation_needs"),
  fundingNeeds: text("funding_needs"),

  // Future plans
  strategicPriorities: text("strategic_priorities"),
  expansionPlans: text("expansion_plans"),
  sustainabilityPlans: text("sustainability_plans"),
  futureProjectsPlanned: text("future_projects_planned"),
  nextGenerationEngagementPlans: text("next_generation_engagement_plans"),
  digitalPreservationPlans: text("digital_preservation_plans"),

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
  youtubeChannel: text("youtube_channel"),
  otherSocialMedia: text("other_social_media"),

  // Linkages to other entities
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedCommunityGroups: jsonb("linked_community_groups").default(
    sql`'[]'::jsonb`,
  ),
  linkedSchools: jsonb("linked_schools").default(sql`'[]'::jsonb`),
  linkedEthnicGroups: jsonb("linked_ethnic_groups").default(sql`'[]'::jsonb`),
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

export type EthnicGroupBuilding = typeof ethnicGroupBuilding.$inferSelect;
export type NewEthnicGroupBuilding = typeof ethnicGroupBuilding.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
