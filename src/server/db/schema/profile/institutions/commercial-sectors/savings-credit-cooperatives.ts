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

// Define cooperative type enum
export const cooperativeTypeEnum = pgEnum("cooperative_type", [
  "AGRICULTURE",
  "SAVINGS_AND_CREDIT",
  "WOMENS",
  "MULTIPURPOSE",
  "EDUCATION",
  "HEALTH",
  "DAIRY",
  "CONSUMER",
  "PRODUCTION",
  "ENERGY",
  "TOURISM",
  "TRANSPORTATION",
  "COMMUNICATION",
  "WORKER",
  "OTHER",
]);

// Define cooperative scale enum
export const cooperativeScaleEnum = pgEnum("cooperative_scale", [
  "PRIMARY",
  "DISTRICT_LEVEL",
  "PROVINCIAL_LEVEL",
  "NATIONAL_LEVEL",
]);

// Define primary business focus enum
export const primaryBusinessFocusEnum = pgEnum("primary_business_focus", [
  "SAVINGS_MOBILIZATION",
  "CREDIT_PROVISION",
  "AGRICULTURAL_PRODUCTION",
  "AGRICULTURAL_MARKETING",
  "CONSUMER_RETAIL",
  "HEALTHCARE_SERVICES",
  "EDUCATION_SERVICES",
  "MANUFACTURING",
  "MARKETING",
  "MIXED",
  "OTHER",
]);

// Cooperative table
export const cooperative = pgTable("cooperative", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  nameInLocalLanguage: text("name_in_local_language"),
  cooperativeType: cooperativeTypeEnum("cooperative_type").notNull(),
  cooperativeScale: cooperativeScaleEnum("cooperative_scale").notNull(),
  primaryBusinessFocus: primaryBusinessFocusEnum(
    "primary_business_focus",
  ).notNull(),
  description: text("description"),
  shortDescription: text("short_description"),

  // Registration and licenses
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // E.g., "Division Cooperative Office"
  registrationDate: date("registration_date"),
  lastRenewalDate: date("last_renewal_date"),
  panNumber: varchar("pan_number", { length: 20 }),
  logoUrl: text("logo_url"),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  landmark: text("landmark"),

  // Contact information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  faxNumber: text("fax_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Social media
  facebookUrl: text("facebook_url"),
  otherSocialMedia: text("other_social_media"),

  // Operating hours
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  weeklyOffDays: text("weekly_off_days"),

  // Physical infrastructure
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", etc.
  floorAreaSqm: decimal("floor_area_sq_m", { precision: 10, scale: 2 }),
  hasCounters: boolean("has_counters").default(true),
  counterCount: integer("counter_count"),
  hasWaitingArea: boolean("has_waiting_area").default(true),

  // Membership details
  totalMemberCount: integer("total_member_count"),
  maleMemberCount: integer("male_member_count"),
  femaleMemberCount: integer("female_member_count"),
  otherGenderMemberCount: integer("other_gender_member_count"),
  dalitMemberCount: integer("dalit_member_count"),
  janajatiMemberCount: integer("janajati_member_count"),
  brahminChhetriMemberCount: integer("brahmin_chhetri_member_count"),
  madhesiMemberCount: integer("madhesi_member_count"),
  muslimMemberCount: integer("muslim_member_count"),
  otherEthnicityMemberCount: integer("other_ethnicity_member_count"),
  membershipFeeNPR: decimal("membership_fee_npr", { precision: 10, scale: 2 }),
  minimumMandatorySavingsNPR: decimal("minimum_mandatory_savings_npr", {
    precision: 10,
    scale: 2,
  }),
  monthlySavingRequirementNPR: decimal("monthly_saving_requirement_npr", {
    precision: 10,
    scale: 2,
  }),

  // Governance
  boardMemberCount: integer("board_member_count"),
  femaleBoardMemberCount: integer("female_board_member_count"),
  boardElectionFrequencyYears: integer("board_election_frequency_years"),
  lastBoardElectionDate: date("last_board_election_date"),
  chairpersonName: text("chairperson_name"),
  managerName: text("manager_name"),
  hasAccountsCommittee: boolean("has_accounts_committee").default(true),
  hasLoanCommittee: boolean("has_loan_committee").default(true),
  hasEducationCommittee: boolean("has_education_committee").default(false),
  otherCommittees: text("other_committees"),

  // Staff details
  totalStaffCount: integer("total_staff_count"),
  permanentStaffCount: integer("permanent_staff_count"),
  contractStaffCount: integer("contract_staff_count"),
  maleStaffCount: integer("male_staff_count"),
  femaleStaffCount: integer("female_staff_count"),

  // Financial data
  establishedDate: date("established_date"),
  fiscalYearEnd: varchar("fiscal_year_end", { length: 10 }), // E.g., "Ashad End"
  shareCapitalNPR: decimal("share_capital_npr", { precision: 18, scale: 2 }),
  reserveFundNPR: decimal("reserve_fund_npr", { precision: 18, scale: 2 }),
  totalSavingsNPR: decimal("total_savings_npr", { precision: 18, scale: 2 }),
  totalLoansNPR: decimal("total_loans_npr", { precision: 18, scale: 2 }),
  totalAssetsNPR: decimal("total_assets_npr", { precision: 18, scale: 2 }),
  lastYearProfitNPR: decimal("last_year_profit_npr", {
    precision: 18,
    scale: 2,
  }),
  annualTurnoverNPR: decimal("annual_turnover_npr", {
    precision: 18,
    scale: 2,
  }),
  nonPerformingLoanPercentage: decimal("non_performing_loan_percentage", {
    precision: 5,
    scale: 2,
  }),
  lastAuditDate: date("last_audit_date"),
  isAudited: boolean("is_audited").default(true),
  auditorName: text("auditor_name"),

  // Products and services
  savingsProducts: text("savings_products"),
  loanProducts: text("loan_products"),
  insuranceServices: text("insurance_services"),
  remittanceServices: text("remittance_services"),
  savingInterestRateRange: text("saving_interest_rate_range"),
  loanInterestRateRange: text("loan_interest_rate_range"),

  // Digital services
  hasDigitalBanking: boolean("has_digital_banking").default(false),
  hasMobileBanking: boolean("has_mobile_banking").default(false),
  hasSms: boolean("has_sms_alerts").default(false),
  usesComputerizedAccounting: boolean("uses_computerized_accounting").default(
    false,
  ),
  accountingSoftware: text("accounting_software"),

  // Agricultural cooperative specific
  agriculturalSectorsServed: text("agricultural_sectors_served"),
  majorCropsSupported: text("major_crops_supported"),
  providesAgricultureInputs: boolean("provides_agriculture_inputs").default(
    false,
  ),
  agriculturalInputServices: text("agricultural_input_services"),
  providesTechnicalSupport: boolean("provides_technical_support").default(
    false,
  ),
  technicalSupportDetails: text("technical_support_details"),

  // Market linkages
  hasMarketLinkages: boolean("has_market_linkages").default(false),
  marketLinkageDetails: text("market_linkage_details"),
  hasBuybackGuarantee: boolean("has_buyback_guarantee").default(false),
  majorMarkets: text("major_markets"),

  // Trainings and capacity building
  providesTrainingToMembers: boolean("provides_training_to_members").default(
    false,
  ),
  trainingFrequency: text("training_frequency"),
  trainingTypes: text("training_types"),
  financialLiteracyPrograms: text("financial_literacy_programs"),

  // Affiliations and networks
  isAffiliatedWithFederation: boolean("is_affiliated_with_federation").default(
    false,
  ),
  federationAffiliationDetails: text("federation_affiliation_details"),
  networkMemberships: text("network_memberships"),

  // Community engagement
  communityServicePrograms: text("community_service_programs"),
  corporateSocialResponsibilityActivities: text(
    "corporate_social_responsibility_activities",
  ),

  // Challenges and plans
  majorChallenges: text("major_challenges"),
  futurePlans: text("future_plans"),
  businessExpansionPlans: text("business_expansion_plans"),

  // For women's cooperatives
  womenEmpowermentPrograms: text("women_empowerment_programs"),
  womenEntrepreneurshipActivities: text("women_entrepreneurship_activities"),

  // For health cooperatives
  healthServicesOffered: text("health_services_offered"),
  healthInfrastructure: text("health_infrastructure"),

  // For education cooperatives
  educationServicesOffered: text("education_services_offered"),
  scholarshipPrograms: text("scholarship_programs"),

  // Security features
  hasSecurityGuard: boolean("has_security_guard").default(false),
  hasCctv: boolean("has_cctv").default(false),

  // Linkages to other entities
  linkedFederations: jsonb("linked_federations").default(sql`'[]'::jsonb`),
  linkedCooperatives: jsonb("linked_cooperatives").default(sql`'[]'::jsonb`),
  linkedBusinesses: jsonb("linked_businesses").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  serviceArea: geometry("service_area", { type: "Polygon" }),

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

export type Cooperative = typeof cooperative.$inferSelect;
export type NewCooperative = typeof cooperative.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
