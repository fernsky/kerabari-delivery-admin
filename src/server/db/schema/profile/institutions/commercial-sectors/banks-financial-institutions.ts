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

// Define bank/financial institution types
export const financialInstitutionTypeEnum = pgEnum(
  "financial_institution_type",
  [
    "COMMERCIAL_BANK",
    "DEVELOPMENT_BANK",
    "FINANCE_COMPANY",
    "MICROFINANCE_INSTITUTION",
    "PAYMENT_SERVICE_PROVIDER",
    "REMITTANCE_COMPANY",
    "INSURANCE_COMPANY",
    "CAPITAL_MARKET_INSTITUTION",
    "OTHER",
  ],
);

// Define ownership type enum
export const financialInstitutionOwnershipEnum = pgEnum(
  "financial_institution_ownership",
  [
    "GOVERNMENT_OWNED",
    "PRIVATE",
    "JOINT_VENTURE",
    "FOREIGN",
    "PUBLIC_PRIVATE_PARTNERSHIP",
    "COMMUNITY_OWNED",
    "COOPERATIVE",
    "OTHER",
  ],
);

// Define branch size enum
export const branchSizeEnum = pgEnum("branch_size", [
  "HEAD_OFFICE",
  "REGIONAL_OFFICE",
  "PROVINCIAL_OFFICE",
  "MAIN_BRANCH",
  "LARGE_BRANCH",
  "MEDIUM_BRANCH",
  "SMALL_BRANCH",
  "EXTENSION_COUNTER",
  "ATM_ONLY",
  "AGENCY",
  "OTHER",
]);

// Define branch service level enum
export const branchServiceLevelEnum = pgEnum("branch_service_level", [
  "FULL_SERVICE",
  "LIMITED_SERVICE",
  "SPECIALIZED_SERVICE",
  "SELF_SERVICE",
  "BASIC",
  "OTHER",
]);

// Financial Institution table
export const financialInstitution = pgTable("financial_institution", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  nameInLocalLanguage: text("name_in_local_language"),
  institutionType: financialInstitutionTypeEnum("institution_type").notNull(),
  ownershipType: financialInstitutionOwnershipEnum("ownership_type").notNull(),
  branchSize: branchSizeEnum("branch_size").notNull(),
  serviceLevel: branchServiceLevelEnum("service_level").notNull(),
  description: text("description"),
  shortDescription: text("short_description"),

  // Brand & parent organization
  parentOrganizationName: text("parent_organization_name"),
  parentOrganizationId: varchar("parent_organization_id", { length: 36 }),
  branchCode: varchar("branch_code", { length: 50 }),
  branchManagerName: text("branch_manager_name"),
  logoUrl: text("logo_url"),

  // Registration and licenses
  swiftCode: varchar("swift_code", { length: 20 }),
  licensedBy: text("licensed_by"), // Usually "Nepal Rastra Bank"
  licenseNumber: varchar("license_number", { length: 50 }),
  licenseIssuedDate: date("license_issued_date"),
  licenseRenewalDate: date("license_renewal_date"),
  panNumber: varchar("pan_number", { length: 20 }),
  registrationNumber: varchar("registration_number", { length: 50 }),
  registrationDate: date("registration_date"),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  landmark: text("landmark"),

  // Contact information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  tollFreeNumber: text("toll_free_number"),
  faxNumber: text("fax_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Social media
  facebookUrl: text("facebook_url"),
  twitterHandle: text("twitter_handle"),
  instagramHandle: text("instagram_handle"),
  linkedinUrl: text("linkedin_url"),
  youtubeChannel: text("youtube_channel"),

  // Operating hours
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  weeklyOffDays: text("weekly_off_days"),
  isOpen24Hours: boolean("is_open_24_hours").default(false),
  hasExtendedHours: boolean("has_extended_hours").default(false),
  extendedHoursDetails: text("extended_hours_details"),

  // Staff details
  totalStaffCount: integer("total_staff_count"),
  maleStaffCount: integer("male_staff_count"),
  femaleStaffCount: integer("female_staff_count"),
  otherGenderStaffCount: integer("other_gender_staff_count"),

  // Physical infrastructure
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", etc.
  floorAreaSqm: decimal("floor_area_sq_m", { precision: 10, scale: 2 }),
  numberOfCounters: integer("number_of_counters"),
  numberOfCabins: integer("number_of_cabins"),
  hasCustomerWaitingArea: boolean("has_customer_waiting_area").default(true),
  customerWaitingCapacity: integer("customer_waiting_capacity"),

  // Digital infrastructure and services
  hasOnlineBanking: boolean("has_online_banking").default(true),
  hasMobileBanking: boolean("has_mobile_banking").default(true),
  hasInternetBanking: boolean("has_internet_banking").default(true),
  hasQrPayments: boolean("has_qr_payments").default(false),
  hasCreditCardService: boolean("has_credit_card_service").default(false),
  hasDebitCardService: boolean("has_debit_card_service").default(true),
  onlineBankingUrl: text("online_banking_url"),
  mobileAppName: text("mobile_app_name"),
  mobileAppDownloadUrl: text("mobile_app_download_url"),

  // ATM services
  hasAtm: boolean("has_atm").default(false),
  atmCount: integer("atm_count"),
  atm24Hours: boolean("atm_24_hours").default(false),
  atmLocationsDescription: text("atm_locations_description"),
  supportedAtmNetworks: text("supported_atm_networks"), // Visa, MasterCard, Nepal EFT, etc.

  // Services offered
  offersSavingsAccounts: boolean("offers_savings_accounts").default(true),
  offersCurrentAccounts: boolean("offers_current_accounts").default(true),
  offersFixedDeposits: boolean("offers_fixed_deposits").default(true),
  offersRecurringDeposits: boolean("offers_recurring_deposits").default(true),
  offersMicroFinancingLoans: boolean("offers_micro_financing_loans").default(
    false,
  ),
  offersHomeLoans: boolean("offers_home_loans").default(false),
  offersVehicleLoans: boolean("offers_vehicle_loans").default(false),
  offersEducationLoans: boolean("offers_education_loans").default(false),
  offersBusinessLoans: boolean("offers_business_loans").default(false),
  offersAgricultureLoans: boolean("offers_agriculture_loans").default(false),
  offersRemittanceServices: boolean("offers_remittance_services").default(true),
  offersInsuranceServices: boolean("offers_insurance_services").default(false),
  offersLocker: boolean("offers_locker").default(false),
  lockerCount: integer("locker_count"),
  offersForeignExchange: boolean("offers_foreign_exchange").default(false),
  offersInvestmentServices: boolean("offers_investment_services").default(
    false,
  ),
  offersMerchantServices: boolean("offers_merchant_services").default(false),
  offersPensionServices: boolean("offers_pension_services").default(false),
  offersAdvisoryServices: boolean("offers_advisory_services").default(false),
  specializedServices: text("specialized_services"),

  // Business performance
  establishedDate: date("established_date"),
  totalDepositAmountNPR: decimal("total_deposit_amount_npr", {
    precision: 18,
    scale: 2,
  }),
  totalLoanAmountNPR: decimal("total_loan_amount_npr", {
    precision: 18,
    scale: 2,
  }),
  totalCustomerCount: integer("total_customer_count"),
  annualTransactionCount: integer("annual_transaction_count"),
  averageMonthlyTransactionCount: integer("average_monthly_transaction_count"),
  asOfDate: date("as_of_date"), // When financial data was last reported

  // Community and accessibility
  hasWheelchairAccess: boolean("has_wheelchair_access").default(false),
  hasParking: boolean("has_parking").default(false),
  parkingCapacity: integer("parking_capacity"),
  hasPublicTransportNearby: boolean("has_public_transport_nearby").default(
    true,
  ),
  hasBrailleServices: boolean("has_braille_services").default(false),
  hasSignLanguageStaff: boolean("has_sign_language_staff").default(false),
  distanceFromCityCenter: decimal("distance_from_city_center_km", {
    precision: 5,
    scale: 2,
  }),

  // Security
  hasSecurityGuard: boolean("has_security_guard").default(true),
  securityGuardCount: integer("security_guard_count"),
  hasCctv: boolean("has_cctv").default(true),
  cctvCameraCount: integer("cctv_camera_count"),
  hasEmergencyAlarm: boolean("has_emergency_alarm").default(true),

  // Financial inclusion initiatives
  hasBranchlessServices: boolean("has_branchless_services").default(false),
  branchlessServiceDetails: text("branchless_service_details"),
  branchlessServicePoints: integer("branchless_service_points"),
  hasFinancialLiteracyPrograms: boolean(
    "has_financial_literacy_programs",
  ).default(false),
  financialLiteracyDetails: text("financial_literacy_details"),
  hasSpecializedProgramsForWomen: boolean(
    "has_specialized_programs_for_women",
  ).default(false),
  womenProgramsDetails: text("women_programs_details"),
  hasDigitalFinancialEducation: boolean(
    "has_digital_financial_education",
  ).default(false),
  digitalFinancialEducationDetails: text("digital_financial_education_details"),

  // Customer support
  customerSupportPhone: text("customer_support_phone"),
  customerSupportEmail: text("customer_support_email"),
  hasInPersonCustomerSupport: boolean("has_in_person_customer_support").default(
    true,
  ),
  hasVirtualCustomerSupport: boolean("has_virtual_customer_support").default(
    false,
  ),
  customerSupportHours: text("customer_support_hours"),
  hasComplaintBox: boolean("has_complaint_box").default(true),

  // For microfinance institutions
  targetGroup: text("target_group"),
  groupLendingMethodology: text("group_lending_methodology"),
  selfHelpGroupsCount: integer("self_help_groups_count"),
  centerMeetingFrequency: text("center_meeting_frequency"),
  fieldOfficerCount: integer("field_officer_count"),

  // Linkages to other entities
  linkedParentOrganization: jsonb("linked_parent_organization").default(
    sql`'[]'::jsonb`,
  ),
  linkedBranches: jsonb("linked_branches").default(sql`'[]'::jsonb`),
  linkedAtms: jsonb("linked_atms").default(sql`'[]'::jsonb`),
  linkedAgents: jsonb("linked_agents").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  catchmentArea: geometry("catchment_area", { type: "Polygon" }),

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

export type FinancialInstitution = typeof financialInstitution.$inferSelect;
export type NewFinancialInstitution = typeof financialInstitution.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
