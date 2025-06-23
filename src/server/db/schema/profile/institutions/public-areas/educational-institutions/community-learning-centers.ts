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
import { facilityStatusEnum } from "./schools";
import { buildingConditionEnum } from "../../common";

// Define community learning center type enum
export const clcTypeEnum = pgEnum("clc_type", [
  "GOVERNMENT_RUN",
  "COMMUNITY_MANAGED",
  "NGO_OPERATED",
  "MUNICIPALITY_SUPPORTED",
  "PRIVATE_PUBLIC_PARTNERSHIP",
  "RELIGIOUS_ORGANIZATION",
  "INTERNATIONAL_ORGANIZATION",
  "OTHER",
]);

// Define medium of instruction enum
export const clcMediumOfInstructionEnum = pgEnum("clc_medium_of_instruction", [
  "NEPALI",
  "ENGLISH",
  "LOCAL_LANGUAGE",
  "BILINGUAL",
  "MULTILINGUAL",
  "OTHER",
]);

// Define program type enum
export const clcProgramTypeEnum = pgEnum("clc_program_type", [
  "ADULT_LITERACY",
  "VOCATIONAL_TRAINING",
  "LIFE_SKILLS",
  "INCOME_GENERATION",
  "HEALTH_EDUCATION",
  "EARLY_CHILDHOOD",
  "REMEDIAL_EDUCATION",
  "DIGITAL_LITERACY",
  "ENTREPRENEURSHIP",
  "COMMUNITY_DEVELOPMENT",
  "ENVIRONMENTAL_EDUCATION",
  "MULTIPLE_PROGRAMS",
  "OTHER",
]);

// Define performance level enum
export const clcPerformanceLevelEnum = pgEnum("clc_performance_level", [
  "EXCELLENT",
  "GOOD",
  "AVERAGE",
  "BELOW_AVERAGE",
  "POOR",
]);

// Community Learning Center table
export const communityLearningCenter = pgTable("community_learning_center", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  centerType: clcTypeEnum("center_type").notNull(),
  establishedDate: date("established_date"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // Which govt body it's registered with
  mainProgramType: clcProgramTypeEnum("main_program_type").notNull(),
  otherProgramTypes: jsonb("other_program_types").default(sql`'[]'::jsonb`),
  isOperational: boolean("is_operational").default(true),
  operationalStatus: text("operational_status"),

  // Management details
  managingOrganization: text("managing_organization"),
  chairpersonName: text("chairperson_name"),
  managerName: text("manager_name"),
  managementCommitteeSize: integer("management_committee_size"),
  womenInManagementCommittee: integer("women_in_management_committee"),
  marginalisedGroupsInCommittee: integer("marginalised_groups_in_committee"),

  // Learner information
  totalLearners: integer("total_learners"),
  femaleLearnerCount: integer("female_learner_count"),
  maleLearnerCount: integer("male_learner_count"),
  childrenLearnerCount: integer("children_learner_count"),
  youthLearnerCount: integer("youth_learner_count"),
  adultLearnerCount: integer("adult_learner_count"),
  seniorLearnerCount: integer("senior_learner_count"),
  dalitLearnerCount: integer("dalit_learner_count"),
  janajatiLearnerCount: integer("janajati_learner_count"),
  madhesiLearnerCount: integer("madhesi_learner_count"),
  muslimLearnerCount: integer("muslim_learner_count"),
  brahminChhetriLearnerCount: integer("brahmin_chhetri_learner_count"),
  otherEthnicityLearnerCount: integer("other_ethnicity_learner_count"),
  pwdLearnerCount: integer("pwd_learner_count"), // Persons with disabilities

  // Programs and courses
  literacyProgramsOffered: boolean("literacy_programs_offered").default(false),
  postLiteracyProgramsOffered: boolean(
    "post_literacy_programs_offered",
  ).default(false),
  incomeGenerationProgramsOffered: boolean(
    "income_generation_programs_offered",
  ).default(false),
  skillTrainingOffered: boolean("skill_training_offered").default(false),
  skillTrainingTypes: text("skill_training_types"), // E.g., "Sewing, Carpentry, Electronics"
  equivalencyProgramsOffered: boolean("equivalency_programs_offered").default(
    false,
  ),
  equivalencyProgramDetails: text("equivalency_program_details"),
  communityDevelopmentActivities: text("community_development_activities"),
  lifeLongLearningActivities: text("life_long_learning_activities"),
  annualProgramCount: integer("annual_program_count"),
  averageProgramDurationDays: integer("average_program_duration_days"),

  // Medium of instruction
  mediumOfInstruction: clcMediumOfInstructionEnum("medium_of_instruction"),
  localLanguagesUsed: text("local_languages_used"),

  // Staff details
  fullTimeStaffCount: integer("full_time_staff_count"),
  partTimeStaffCount: integer("part_time_staff_count"),
  femaleStaffCount: integer("female_staff_count"),
  maleStaffCount: integer("male_staff_count"),
  volunteersCount: integer("volunteers_count"),
  facilitatorsCount: integer("facilitators_count"),
  facilitatorTrainingFrequency: text("facilitator_training_frequency"),
  staffQualificationDetails: text("staff_qualification_details"),

  // Physical infrastructure
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", "Shared", etc.
  isSharedFacility: boolean("is_shared_facility").default(false),
  sharedWithDetails: text("shared_with_details"), // Details if shared with another institution
  buildingCondition: buildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  totalRooms: integer("total_rooms"),
  classroomCount: integer("classroom_count"),
  hasAssemblyHall: boolean("has_assembly_hall").default(false),
  hasLibrarySpace: boolean("has_library_space").default(false),
  hasComputerLab: boolean("has_computer_lab").default(false),
  hasResourceCorner: boolean("has_resource_corner").default(false),
  hasAdministrativeRoom: boolean("has_administrative_room").default(false),
  hasCounselingRoom: boolean("has_counseling_room").default(false),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  hasDrinkingWater: boolean("has_drinking_water").default(false),
  hasToilets: boolean("has_toilets").default(true),
  hasSeparateToiletsForGenders: boolean(
    "has_separate_toilets_for_genders",
  ).default(false),
  hasHandwashingFacilities: boolean("has_handwashing_facilities").default(
    false,
  ),
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetType: text("internet_type"), // E.g. "Fiber", "Wireless", "Mobile data"

  // Learning resources and equipment
  computerCount: integer("computer_count"),
  tabletCount: integer("tablet_count"),
  bookCount: integer("book_count"),
  hasAudioVisualEquipment: boolean("has_audio_visual_equipment").default(false),
  hasTeachingLearningMaterials: boolean(
    "has_teaching_learning_materials",
  ).default(true),
  teachingMaterialsStatus: facilityStatusEnum("teaching_materials_status"),
  hasIncomingGeneratingEquipment: boolean(
    "has_incoming_generating_equipment",
  ).default(false),
  incomeGeneratingEquipmentDetails: text("income_generating_equipment_details"),
  resourceMaterialsAvailability: text("resource_materials_availability"),

  // Financial aspects
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  governmentFundingNPR: decimal("government_funding_npr", {
    precision: 18,
    scale: 2,
  }),
  donorFundingNPR: decimal("donor_funding_npr", { precision: 18, scale: 2 }),
  communityContributionNPR: decimal("community_contribution_npr", {
    precision: 18,
    scale: 2,
  }),
  incomeGenerationNPR: decimal("income_generation_npr", {
    precision: 18,
    scale: 2,
  }),
  hasEndowmentFund: boolean("has_endowment_fund").default(false),
  endowmentFundSizeNPR: decimal("endowment_fund_size_npr", {
    precision: 18,
    scale: 2,
  }),
  majorDonors: text("major_donors"),
  hasAnnualAudit: boolean("has_annual_audit").default(false),
  lastAuditDate: date("last_audit_date"),

  // Performance and achievements
  completionRatePercent: decimal("completion_rate_percent", {
    precision: 5,
    scale: 2,
  }),
  dropoutRatePercent: decimal("dropout_rate_percent", {
    precision: 5,
    scale: 2,
  }),
  employmentSuccessRatePercent: decimal("employment_success_rate_percent", {
    precision: 5,
    scale: 2,
  }),
  annualGraduatesCount: integer("annual_graduates_count"),
  successStories: text("success_stories"),
  performanceLevel: clcPerformanceLevelEnum("performance_level"),
  monitoringMechanism: text("monitoring_mechanism"),
  lastInspectionDate: date("last_inspection_date"),
  inspectionAuthority: text("inspection_authority"),

  // Community engagement
  communityContributionTypes: text("community_contribution_types"), // Labor, cash, materials, etc.
  communityMobilizationActivities: text("community_mobilization_activities"),
  networkPartnership: text("network_partnership"),
  collaboratingOrganizations: jsonb("collaborating_organizations").default(
    sql`'[]'::jsonb`,
  ),

  // Contact information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  email: text("email"),
  websiteUrl: text("website_url"),
  facebookPage: text("facebook_page"),

  // Operating hours
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  operatingDaysPerWeek: integer("operating_days_per_week"),
  operatingMonthsPerYear: integer("operating_months_per_year"),

  // Future plans and challenges
  majorChallenges: text("major_challenges"),
  developmentPlans: text("development_plans"),
  sustainabilityPlans: text("sustainability_plans"),
  supportNeeds: text("support_needs"),
  innovationPractices: text("innovation_practices"),

  // Linkages to other entities
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedSchools: jsonb("linked_schools").default(sql`'[]'::jsonb`),
  linkedHealthFacilities: jsonb("linked_health_facilities").default(
    sql`'[]'::jsonb`,
  ),
  linkedNGOs: jsonb("linked_ngos").default(sql`'[]'::jsonb`),

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

export type CommunityLearningCenter =
  typeof communityLearningCenter.$inferSelect;
export type NewCommunityLearningCenter =
  typeof communityLearningCenter.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
