import { pgTable } from "../../../../schema/basic";
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
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define research center type enum
export const researchCenterTypeEnum = pgEnum("research_center_type", [
  "AGRICULTURAL",
  "INDUSTRIAL",
  "TECHNOLOGICAL",
  "MEDICAL",
  "ENVIRONMENTAL",
  "SCIENTIFIC",
  "ECONOMIC",
  "SOCIAL_SCIENCE",
  "EDUCATIONAL",
  "INNOVATION_HUB",
  "MIXED",
  "OTHER",
]);

// Define research center management type enum
export const researchCenterManagementEnum = pgEnum(
  "research_center_management",
  [
    "GOVERNMENT",
    "UNIVERSITY",
    "PRIVATE_SECTOR",
    "NON_PROFIT",
    "INTERNATIONAL_ORGANIZATION",
    "PUBLIC_PRIVATE_PARTNERSHIP",
    "COOPERATIVE",
    "AUTONOMOUS",
    "OTHER",
  ],
);

// Define facility condition enum
export const researchFacilityConditionEnum = pgEnum(
  "research_facility_condition",
  ["EXCELLENT", "GOOD", "FAIR", "NEEDS_IMPROVEMENT", "POOR"],
);

// Define funding source enum
export const fundingSourceEnum = pgEnum("funding_source", [
  "GOVERNMENT_REGULAR",
  "GOVERNMENT_PROJECT",
  "PRIVATE_SECTOR",
  "DONOR_FUNDED",
  "INTERNATIONAL_ORGANIZATION",
  "SELF_FUNDING",
  "MIXED_FUNDING",
  "OTHER",
]);

// Research Center table
export const researchCenter = pgTable("research_center", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  nameInLocalLanguage: text("name_in_local_language"),
  description: text("description"),
  centerType: researchCenterTypeEnum("center_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"),
  address: text("address"),

  // Basic information
  establishedDate: date("established_date"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  panNumber: varchar("pan_number", { length: 20 }),
  licenseNumber: varchar("license_number", { length: 50 }),
  managementType: researchCenterManagementEnum("management_type").notNull(),
  parentOrganization: text("parent_organization"),
  affiliatedInstitutions: text("affiliated_institutions"),
  researchFocus: text("research_focus"), // Main areas of research
  visionStatement: text("vision_statement"),
  missionStatement: text("mission_statement"),

  // Contact information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  email: text("email"),
  websiteUrl: text("website_url"),
  faxNumber: text("fax_number"),

  // Social media
  facebookPage: text("facebook_page"),
  twitterHandle: text("twitter_handle"),
  instagramHandle: text("instagram_handle"),
  linkedInPage: text("linked_in_page"),
  youtubeChannel: text("youtube_channel"),

  // Leadership & Management
  headName: text("head_name"), // Director/CEO/Head
  headDesignation: text("head_designation"),
  headQualification: text("head_qualification"),
  headContactNumber: text("head_contact_number"),
  headEmail: text("head_email"),
  hasGoverningBody: boolean("has_governing_body").default(false),
  governingBodyDetails: text("governing_body_details"),
  hasAdvisoryCommittee: boolean("has_advisory_committee").default(false),
  advisoryCommitteeDetails: text("advisory_committee_details"),

  // Operating hours
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  weeklyOffDays: text("weekly_off_days"),

  // Physical Infrastructure
  totalLandAreaSqm: decimal("total_land_area_sqm", { precision: 10, scale: 2 }),
  coveredAreaSqm: decimal("covered_area_sqm", { precision: 10, scale: 2 }),
  totalBuildingCount: integer("total_building_count"),
  buildingCondition: researchFacilityConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovationYear: integer("last_renovation_year"),
  hasCompoundWall: boolean("has_compound_wall").default(false),

  // Research facilities
  hasLaboratories: boolean("has_laboratories").default(false),
  laboratoryCount: integer("laboratory_count"),
  laboratoryTypes: text("laboratory_types"), // Types of labs available
  hasAdvancedEquipment: boolean("has_advanced_equipment").default(false),
  majorEquipmentList: text("major_equipment_list"),
  hasFieldResearchFacilities: boolean("has_field_research_facilities").default(
    false,
  ),
  fieldResearchDetails: text("field_research_details"),
  hasLibrary: boolean("has_library").default(false),
  libraryCollectionSize: integer("library_collection_size"),
  hasDatabase: boolean("has_database").default(false),
  databaseDetails: text("database_details"),
  hasConferenceHall: boolean("has_conference_hall").default(false),
  conferenceHallCapacity: integer("conference_hall_capacity"),
  hasSeminarRooms: boolean("has_seminar_rooms").default(false),
  seminarRoomCount: integer("seminar_room_count"),
  hasTrainingFacilities: boolean("has_training_facilities").default(false),
  trainingFacilitiesDetails: text("training_facilities_details"),
  hasHostel: boolean("has_hostel").default(false),
  hostelCapacity: integer("hostel_capacity"),
  hasCanteen: boolean("has_canteen").default(false),
  facilityCondition: researchFacilityConditionEnum("facility_condition"),

  // Basic Facilities
  hasElectricity: boolean("has_electricity").default(true),
  electricitySourceType: text("electricity_source_type"),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"),
  hasDrinkingWater: boolean("has_drinking_water").default(true),
  waterSourceType: text("water_source_type"),
  hasToilets: boolean("has_toilets").default(true),
  toaletsCount: integer("toilets_count"),
  hasSeparateToiletsForGenders: boolean(
    "has_separate_toilets_for_genders",
  ).default(false),
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetType: text("internet_type"),
  internetSpeed: text("internet_speed"), // in Mbps
  hasWifi: boolean("has_wifi").default(false),

  // Staff details
  totalStaffCount: integer("total_staff_count"),
  researchStaffCount: integer("research_staff_count"),
  administrativeStaffCount: integer("administrative_staff_count"),
  technicalStaffCount: integer("technical_staff_count"),
  supportStaffCount: integer("support_staff_count"),
  phdHoldersCount: integer("phd_holders_count"),
  mastersHoldersCount: integer("masters_holders_count"),
  bachelorsHoldersCount: integer("bachelors_holders_count"),
  maleStaffCount: integer("male_staff_count"),
  femaleStaffCount: integer("female_staff_count"),
  otherGenderStaffCount: integer("other_gender_staff_count"),
  partTimeResearchersCount: integer("part_time_researchers_count"),
  internshipPositionsCount: integer("internship_positions_count"),

  // Research activities
  currentResearchProjects: integer("current_research_projects"),
  completedResearchProjects: integer("completed_research_projects"),
  majorResearchAreas: text("major_research_areas"),
  publicationsCount: integer("publications_count"),
  patentsFiledCount: integer("patents_filed_count"),
  patentsGrantedCount: integer("patents_granted_count"),
  annualResearchBudgetNPR: decimal("annual_research_budget_npr", {
    precision: 18,
    scale: 2,
  }),
  researchCollaborations: text("research_collaborations"),
  internationalCollaborations: text("international_collaborations"),

  // Knowledge dissemination
  conductsPeriodicalPublications: boolean(
    "conducts_periodical_publications",
  ).default(false),
  periodicalPublicationDetails: text("periodical_publication_details"),
  conductsSeminars: boolean("conducts_seminars").default(false),
  seminarFrequency: text("seminar_frequency"),
  conductsTrainings: boolean("conducts_trainings").default(false),
  trainingDetails: text("training_details"),
  conductsPublicOutreach: boolean("conducts_public_outreach").default(false),
  publicOutreachDetails: text("public_outreach_details"),
  hasOpenAccessPolicy: boolean("has_open_access_policy").default(false),

  // Financial aspects
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  fundingSource: fundingSourceEnum("funding_source"),
  governmentFundingPercentage: decimal("government_funding_percentage", {
    precision: 5,
    scale: 2,
  }),
  privateFundingPercentage: decimal("private_funding_percentage", {
    precision: 5,
    scale: 2,
  }),
  donorFundingPercentage: decimal("donor_funding_percentage", {
    precision: 5,
    scale: 2,
  }),
  selfGeneratedFundingPercentage: decimal("self_generated_funding_percentage", {
    precision: 5,
    scale: 2,
  }),
  majorDonors: text("major_donors"),
  hasEndowmentFund: boolean("has_endowment_fund").default(false),
  endowmentFundSizeNPR: decimal("endowment_fund_size_npr", {
    precision: 18,
    scale: 2,
  }),

  // Impact and achievements
  majorResearchFindings: text("major_research_findings"),
  policyInfluenceDetails: text("policy_influence_details"),
  communityImpact: text("community_impact"),
  awards: text("awards"),
  recognitions: text("recognitions"),

  // Challenges and development needs
  researchChallenges: text("research_challenges"),
  infrastructureChallenges: text("infrastructure_challenges"),
  fundingChallenges: text("funding_challenges"),
  humanResourceChallenges: text("human_resource_challenges"),
  developmentPlans: text("development_plans"),

  // Partnerships and collaborations
  academicPartners: text("academic_partners"),
  industryPartners: text("industry_partners"),
  governmentPartners: text("government_partners"),
  ngoPartners: text("ngo_partners"),
  internationalPartners: text("international_partners"),

  // Community engagement
  communityServicePrograms: text("community_service_programs"),
  technologyTransferActivities: text("technology_transfer_activities"),
  farmerEngagementPrograms: text("farmer_engagement_programs"), // For agricultural research centers
  industryEngagementPrograms: text("industry_engagement_programs"),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Linkages to other entities
  linkedInstitutions: jsonb("linked_institutions").default(sql`'[]'::jsonb`),
  linkedUniversities: jsonb("linked_universities").default(sql`'[]'::jsonb`),
  linkedIndustries: jsonb("linked_industries").default(sql`'[]'::jsonb`),
  linkedGovernmentOffices: jsonb("linked_government_offices").default(
    sql`'[]'::jsonb`,
  ),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  campusBoundary: geometry("campus_boundary", { type: "Polygon" }),

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

export type ResearchCenter = typeof researchCenter.$inferSelect;
export type NewResearchCenter = typeof researchCenter.$inferInsert;

export { generateSlug } from "@/server/utils/slug-helpers";
