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

// Define youth club building type enum
export const youthClubBuildingTypeEnum = pgEnum("youth_club_building_type", [
  "YOUTH_CLUB",
  "SPORTS_CLUB",
  "MULTIPURPOSE_YOUTH_CENTER",
  "YOUTH_INFORMATION_CENTER",
  "YOUTH_TRAINING_CENTER",
  "YOUTH_ACTIVITY_CENTER",
  "YOUTH_INNOVATION_HUB",
  "YOUTH_RESOURCE_CENTER",
  "YOUTH_COUNCIL_BUILDING",
  "OTHER",
]);

// Define youth club focus area enum
export const youthClubFocusAreaEnum = pgEnum("youth_club_focus_area", [
  "SPORTS",
  "EDUCATION",
  "SKILL_DEVELOPMENT",
  "LEADERSHIP_DEVELOPMENT",
  "COMMUNITY_SERVICE",
  "ENTREPRENEURSHIP",
  "ARTS_AND_CULTURE",
  "ENVIRONMENT",
  "TECHNOLOGY",
  "CIVIC_ENGAGEMENT",
  "HEALTH_AWARENESS",
  "DISASTER_MANAGEMENT",
  "MULTIPLE_FOCUS",
  "OTHER",
]);

// Youth Club Building table
export const youthClubBuilding = pgTable("youth_club_building", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  buildingType: youthClubBuildingTypeEnum("building_type").notNull(),
  clubFocusArea: youthClubFocusAreaEnum("club_focus_area").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  establishedYear: integer("established_year"),
  clubEstablishedYear: integer("club_established_year"), // Year when the youth club was established
  managementType: managementTypeEnum("management_type").notNull(),
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // Which govt body it's registered with
  registrationDate: date("registration_date"),
  lastRenewalDate: date("last_renewal_date"),
  isAffiliatedWithNationalYouthCouncil: boolean(
    "is_affiliated_with_national_youth_council",
  ).default(false),
  affiliationDetails: text("affiliation_details"),

  // Membership details
  totalMemberCount: integer("total_member_count"),
  activeMemberCount: integer("active_member_count"),
  maleMemberCount: integer("male_member_count"),
  femaleMemberCount: integer("female_member_count"),
  otherGenderMemberCount: integer("other_gender_member_count"),
  dalitMemberCount: integer("dalit_member_count"),
  janajatiMemberCount: integer("janajati_member_count"),
  brahminChhetriMemberCount: integer("brahmin_chhetri_member_count"),
  madhesiMemberCount: integer("madhesi_member_count"),
  muslimMemberCount: integer("muslim_member_count"),
  otherEthnicityMemberCount: integer("other_ethnicity_member_count"),
  pwdMemberCount: integer("pwd_member_count"), // Members with disabilities
  ageGroup1518Count: integer("age_group_15_18_count"),
  ageGroup1924Count: integer("age_group_19_24_count"),
  ageGroup2530Count: integer("age_group_25_30_count"),
  ageGroup31PlusCount: integer("age_group_31_plus_count"),
  membershipFeeNPR: decimal("membership_fee_npr", { precision: 10, scale: 2 }),
  membershipRenewalFrequency: text("membership_renewal_frequency"),

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
  hasLibrarySpace: boolean("has_library_space").default(false),
  hasOfficeSpace: boolean("has_office_space").default(false),
  hasStorage: boolean("has_storage").default(false),
  hasIndoorSportsArea: boolean("has_indoor_sports_area").default(false),
  indoorSportsAreaDetails: text("indoor_sports_area_details"),
  hasOutdoorSportsArea: boolean("has_outdoor_sports_area").default(false),
  outdoorSportsAreaDetails: text("outdoor_sports_area_details"),
  hasRecreationArea: boolean("has_recreation_area").default(false),
  recreationAreaDetails: text("recreation_area_details"),

  // Sports facilities
  hasFootballGround: boolean("has_football_ground").default(false),
  hasVolleyballCourt: boolean("has_volleyball_court").default(false),
  hasBasketballCourt: boolean("has_basketball_court").default(false),
  hasCricketGround: boolean("has_cricket_ground").default(false),
  hasTableTennis: boolean("has_table_tennis").default(false),
  hasCarromBoard: boolean("has_carrom_board").default(false),
  hasChessBoards: boolean("has_chess_boards").default(false),
  hasGym: boolean("has_gym").default(false),
  gymEquipmentDetails: text("gym_equipment_details"),
  otherSportsFacilities: text("other_sports_facilities"),
  sportingEquipmentInventory: text("sporting_equipment_inventory"),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  hasWaterSupply: boolean("has_water_supply").default(true),
  hasToilets: boolean("has_toilets").default(true),
  hasSeparateToiletsForGenders: boolean(
    "has_separate_toilets_for_genders",
  ).default(false),
  hasChangingRooms: boolean("has_changing_rooms").default(false),
  hasShowers: boolean("has_showers").default(false),
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  hasCafeteria: boolean("has_cafeteria").default(false),

  // Equipment and resources
  hasComputers: boolean("has_computers").default(false),
  computerCount: integer("computer_count"),
  hasAudioVisualEquipment: boolean("has_audio_visual_equipment").default(false),
  hasLibraryBooks: boolean("has_library_books").default(false),
  bookCount: integer("book_count"),
  hasTrainingMaterials: boolean("has_training_materials").default(false),
  trainingMaterialsDetails: text("training_materials_details"),

  // Activities and operations
  meetingFrequency: text("meeting_frequency"), // E.g., "Monthly", "Weekly"
  regularActivities: text("regular_activities"),
  sportsActivities: text("sports_activities"),
  skillTrainingOffered: text("skill_training_offered"),
  awarenessProgramsOrganized: text("awareness_programs_organized"),
  communityServiceActivities: text("community_service_activities"),
  tournamentsOrganized: text("tournaments_organized"),
  culturalActivities: text("cultural_activities"),
  majorAnnualEvents: text("major_annual_events"),
  usageFrequency: usageFrequencyEnum("usage_frequency"),

  // Financial aspects
  hasBank: boolean("has_bank_account").default(false),
  bankAccountDetails: text("bank_account_details"),
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  maintenanceFundNPR: decimal("maintenance_fund_npr", {
    precision: 14,
    scale: 2,
  }),
  fundingSources: text("funding_sources"),
  membershipFeesIncomeNPR: decimal("membership_fees_income_npr", {
    precision: 14,
    scale: 2,
  }),
  eventIncomeNPR: decimal("event_income_npr", { precision: 14, scale: 2 }),
  donationsNPR: decimal("donations_npr", { precision: 14, scale: 2 }),
  localGovernmentFundingNPR: decimal("local_government_funding_npr", {
    precision: 14,
    scale: 2,
  }),
  hasAnnualAudit: boolean("has_annual_audit").default(false),
  lastAuditDate: date("last_audit_date"),
  receivesExternalFunding: boolean("receives_external_funding").default(false),
  externalFundingSources: text("external_funding_sources"),
  incomeSustainabilityPlans: text("income_sustainability_plans"),

  // Governance and leadership
  hasWrittenConstitution: boolean("has_written_constitution").default(false),
  hasStrategicPlan: boolean("has_strategic_plan").default(false),
  executiveCommitteeSize: integer("executive_committee_size"),
  femaleInExecutiveCommittee: integer("female_in_executive_committee"),
  marginalisedGroupsInExecutiveCommittee: integer(
    "marginalised_groups_in_executive_committee",
  ),
  executiveCommitteeSelectionProcess: text(
    "executive_committee_selection_process",
  ),
  lastExecutiveElectionDate: date("last_executive_election_date"),
  executiveCommitteeTerm: integer("executive_committee_term"), // In years
  decisionMakingProcess: text("decision_making_process"),
  hasSubcommittees: boolean("has_subcommittees").default(false),
  subcommitteeDetails: text("subcommittee_details"),
  hasYouthParticipationPolicy: boolean(
    "has_youth_participation_policy",
  ).default(false),
  recordKeepingSystem: text("record_keeping_system"),

  // Staff and human resources
  hasFullTimeStaff: boolean("has_full_time_staff").default(false),
  fullTimeStaffCount: integer("full_time_staff_count"),
  hasPartTimeStaff: boolean("has_part_time_staff").default(false),
  partTimeStaffCount: integer("part_time_staff_count"),
  hasTrainers: boolean("has_trainers").default(false),
  trainerCount: integer("trainer_count"),
  trainerSpecialties: text("trainer_specialties"),
  hasYouthLeadershipProgram: boolean("has_youth_leadership_program").default(
    false,
  ),
  youthLeadershipDetails: text("youth_leadership_details"),
  volunteerManagementSystem: text("volunteer_management_system"),
  volunteerCount: integer("volunteer_count"),

  // Partnerships and networks
  hasPartnershipWithLocalGovernment: boolean(
    "has_partnership_with_local_government",
  ).default(false),
  localGovernmentPartnershipDetails: text(
    "local_government_partnership_details",
  ),
  hasSchoolPartnerships: boolean("has_school_partnerships").default(false),
  schoolPartnershipDetails: text("school_partnership_details"),
  hasSportsAssociationAffiliations: boolean(
    "has_sports_association_affiliations",
  ).default(false),
  sportsAssociationDetails: text("sports_association_details"),
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
  genderEquality: text("gender_equality_measures"),
  facilitiesForDisabled: text("facilities_for_disabled"),
  inclusionChallenges: text("inclusion_challenges"),

  // Impact and achievements
  majorAchievements: text("major_achievements"),
  communityImpact: text("community_impact"),
  successStories: text("success_stories"),
  sportsAchievements: text("sports_achievements"),
  skillDevelopmentOutcomes: text("skill_development_outcomes"),
  youthEmploymentContribution: text("youth_employment_contribution"),
  awardsAndRecognition: text("awards_and_recognition"),

  // Challenges and needs
  infrastructureChallenges: text("infrastructure_challenges"),
  capacityChallenges: text("capacity_challenges"),
  financialChallenges: text("financial_challenges"),
  participationChallenges: text("participation_challenges"),
  maintenanceNeeds: text("maintenance_needs"),
  trainingNeeds: text("training_needs"),
  equipmentNeeds: text("equipment_needs"),
  fundingNeeds: text("funding_needs"),

  // Future plans
  strategicPriorities: text("strategic_priorities"),
  expansionPlans: text("expansion_plans"),
  sustainabilityPlans: text("sustainability_plans"),
  futureProjectsPlanned: text("future_projects_planned"),
  youthEngagementStrategies: text("youth_engagement_strategies"),

  // Security and safety
  hasSafetyProtocol: boolean("has_safety_protocol").default(false),
  safetyProtocolDetails: text("safety_protocol_details"),
  hasFirstAidFacilities: boolean("has_first_aid_facilities").default(false),
  firstAidDetails: text("first_aid_details"),
  hasSportsInjuryManagement: boolean("has_sports_injury_management").default(
    false,
  ),
  injuryManagementDetails: text("injury_management_details"),
  hasBoundaryWall: boolean("has_boundary_wall").default(false),
  securityArrangements: text("security_arrangements"),

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
  linkedSchools: jsonb("linked_schools").default(sql`'[]'::jsonb`),
  linkedSportsAssociations: jsonb("linked_sports_associations").default(
    sql`'[]'::jsonb`,
  ),
  linkedYouthClubs: jsonb("linked_youth_clubs").default(sql`'[]'::jsonb`),
  linkedNGOs: jsonb("linked_ngos").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  compoundArea: geometry("compound_area", { type: "Polygon" }),
  sportsFieldsArea: geometry("sports_fields_area", { type: "MultiPolygon" }),

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

export type YouthClubBuilding = typeof youthClubBuilding.$inferSelect;
export type NewYouthClubBuilding = typeof youthClubBuilding.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
