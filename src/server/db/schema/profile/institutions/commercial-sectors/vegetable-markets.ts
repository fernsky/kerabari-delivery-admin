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

// Define market type enum
export const marketTypeEnum = pgEnum("market_type", [
  "WHOLESALE",
  "RETAIL",
  "MIXED",
  "FARMERS_MARKET",
  "ORGANIC_MARKET",
  "SEASONAL_MARKET",
  "PERMANENT_MARKET",
  "STREET_MARKET",
  "OTHER",
]);

// Define market frequency enum
export const marketFrequencyEnum = pgEnum("market_frequency", [
  "DAILY",
  "WEEKLY",
  "BIWEEKLY",
  "MONTHLY",
  "SEASONAL",
  "OCCASIONAL",
  "OTHER",
]);

// Define market management type enum
export const marketManagementTypeEnum = pgEnum("market_management_type", [
  "MUNICIPAL_MANAGED",
  "PRIVATE_MANAGED",
  "COMMUNITY_MANAGED",
  "COOPERATIVE_MANAGED",
  "NGO_MANAGED",
  "SELF_MANAGED",
  "PUBLIC_PRIVATE_PARTNERSHIP",
  "OTHER",
]);

// Define infrastructure condition enum
export const infrastructureConditionEnum = pgEnum("infrastructure_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "VERY_POOR",
  "UNDER_CONSTRUCTION",
  "UNDER_MAINTENANCE",
]);

// Define food safety level enum
export const foodSafetyLevelEnum = pgEnum("food_safety_level", [
  "HIGH",
  "MODERATE",
  "BASIC",
  "MINIMAL",
  "POOR",
  "NOT_ASSESSED",
]);

// Vegetable Market table
export const vegetableMarket = pgTable("vegetable_market", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  marketType: marketTypeEnum("market_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  nearestLandmark: text("nearest_landmark"),

  // Basic information
  establishedYear: integer("established_year"),
  managementType: marketManagementTypeEnum("management_type").notNull(),
  managingEntity: text("managing_entity"), // Name of organization/committee that manages
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // Which govt body it's registered with
  marketFrequency: marketFrequencyEnum("market_frequency"),
  weeklySchedule: text("weekly_schedule"), // If weekly, which day(s)
  operatingHours: text("operating_hours"),
  seasonalityDetails: text("seasonality_details"), // Details if market is seasonal

  // Area and capacity
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
  coveredAreaSqm: decimal("covered_area_sq_m", { precision: 10, scale: 2 }),
  openAreaSqm: decimal("open_area_sq_m", { precision: 10, scale: 2 }),
  totalStallCount: integer("total_stall_count"),
  permanentStallCount: integer("permanent_stall_count"),
  temporaryStallCount: integer("temporary_stall_count"),
  averageStallSizeSqm: decimal("average_stall_size_sq_m", {
    precision: 6,
    scale: 2,
  }),

  // Vendor information
  registeredVendorCount: integer("registered_vendor_count"),
  averageDailyVendorCount: integer("average_daily_vendor_count"),
  maleVendorCount: integer("male_vendor_count"),
  femaleVendorCount: integer("female_vendor_count"),
  vendorOrganizationExists: boolean("vendor_organization_exists").default(
    false,
  ),
  vendorOrganizationName: text("vendor_organization_name"),
  vendorOrganizationMemberCount: integer("vendor_organization_member_count"),

  // Products and trade
  primaryProductsTraded: text("primary_products_traded"),
  organicProduceAvailable: boolean("organic_produce_available").default(false),
  localProducePercentage: integer("local_produce_percentage"),
  importedProducePercentage: integer("imported_produce_percentage"),
  averageDailyTradeVolumeKg: decimal("average_daily_trade_volume_kg", {
    precision: 10,
    scale: 2,
  }),
  peakTradingMonths: text("peak_trading_months"),
  lowTradingMonths: text("low_trading_months"),
  averageDailyCustomerCount: integer("average_daily_customer_count"),
  weeklyPeakDays: text("weekly_peak_days"),
  dailyPeakHours: text("daily_peak_hours"),

  // Infrastructure
  infrastructureCondition: infrastructureConditionEnum(
    "infrastructure_condition",
  ),
  hasRoof: boolean("has_roof").default(false),
  hasConcreteFloor: boolean("has_concrete_floor").default(false),
  hasDrainageSystem: boolean("has_drainage_system").default(false),
  hasSeparateSection: boolean("has_separate_section").default(false),
  separateSectionDetails: text("separate_section_details"), // Details of separate sections (vegetable, fruit, meat, etc.)
  hasStorageFacilities: boolean("has_storage_facilities").default(false),
  storageFacilitiesDetails: text("storage_facilities_details"),
  hasColdStorage: boolean("has_cold_storage").default(false),
  coldStorageCapacityKg: decimal("cold_storage_capacity_kg", {
    precision: 10,
    scale: 2,
  }),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(false),
  hasWaterSupply: boolean("has_water_supply").default(false),
  waterSourceType: text("water_source_type"), // Municipal, well, etc.
  hasToilets: boolean("has_toilets").default(false),
  toiletCount: integer("toilet_count"),
  hasSeparateToiletsForGenders: boolean(
    "has_separate_toilets_for_genders",
  ).default(false),
  hasHandwashingStations: boolean("has_handwashing_stations").default(false),
  handwashingStationCount: integer("handwashing_station_count"),
  hasWasteManagementSystem: boolean("has_waste_management_system").default(
    false,
  ),
  wasteManagementDetails: text("waste_management_details"),
  wasteCollectionFrequency: text("waste_collection_frequency"),

  // Food safety and quality control
  hasFoodSafetyMeasures: boolean("has_food_safety_measures").default(false),
  foodSafetyLevel: foodSafetyLevelEnum("food_safety_level"),
  hasQualityControlSystem: boolean("has_quality_control_system").default(false),
  qualityControlDetails: text("quality_control_details"),
  hasWeighingEquipment: boolean("has_weighing_equipment").default(false),
  weighingEquipmentDetails: text("weighing_equipment_details"),
  hasPesticideTestingFacility: boolean(
    "has_pesticide_testing_facility",
  ).default(false),

  // Financial aspects
  stallRentalFeeStructure: text("stall_rental_fee_structure"),
  averageMonthlyStallRentNPR: decimal("average_monthly_stall_rent_npr", {
    precision: 10,
    scale: 2,
  }),
  hasEntranceFee: boolean("has_entrance_fee").default(false),
  entranceFeeNPR: decimal("entrance_fee_npr", { precision: 6, scale: 2 }),
  annualRevenueNPR: decimal("annual_revenue_npr", { precision: 14, scale: 2 }),
  financialManagementSystem: text("financial_management_system"),
  revenueCollection: text("revenue_collection"),

  // Transportation and logistics
  loadingUnloadingFacilities: boolean("loading_unloading_facilities").default(
    false,
  ),
  loadingUnloadingDetails: text("loading_unloading_details"),
  hasDesignatedParkingArea: boolean("has_designated_parking_area").default(
    false,
  ),
  parkingCapacity: integer("parking_capacity"),
  transportAvailability: text("transport_availability"),
  majorSupplyRoutes: text("major_supply_routes"),

  // Support services
  hasMarketInformationSystem: boolean("has_market_information_system").default(
    false,
  ),
  marketInformationDetails: text("market_information_details"),
  hasPriceDisplayBoards: boolean("has_price_display_boards").default(false),
  hasMicrofinanceServices: boolean("has_microfinance_services").default(false),
  microfinanceServiceDetails: text("microfinance_service_details"),
  hasVeterinaryServices: boolean("has_veterinary_services").default(false),
  hasAgricultureExtensionServices: boolean(
    "has_agriculture_extension_services",
  ).default(false),

  // Security and management
  hasSecurityPersonnel: boolean("has_security_personnel").default(false),
  securityPersonnelCount: integer("security_personnel_count"),
  hasCctv: boolean("has_cctv").default(false),
  cctvCameraCount: integer("cctv_camera_count"),
  hasMarketManagementCommittee: boolean(
    "has_market_management_committee",
  ).default(false),
  managementCommitteeDetails: text("management_committee_details"),
  managementStaffCount: integer("management_staff_count"),
  hasDesignatedManager: boolean("has_designated_manager").default(false),
  managerContactInfo: text("manager_contact_info"),
  hasDisputeResolutionMechanism: boolean(
    "has_dispute_resolution_mechanism",
  ).default(false),

  // Environmental impact
  environmentalConcerns: text("environmental_concerns"),
  wasteGenerationPerDayKg: decimal("waste_generation_per_day_kg", {
    precision: 8,
    scale: 2,
  }),
  wasteSegregationPractices: text("waste_segregation_practices"),
  recyclingInitiatives: text("recycling_initiatives"),

  // Social impact and inclusivity
  employmentGenerated: integer("employment_generated"),
  womenParticipationPercentage: integer("women_participation_percentage"),
  marginalizedGroupsParticipation: text("marginalized_groups_participation"),
  accessibilityForDisabled: text("accessibility_for_disabled"),

  // Governance and regulations
  hasOperatingGuidelines: boolean("has_operating_guidelines").default(false),
  hasVendorRegistrationSystem: boolean(
    "has_vendor_registration_system",
  ).default(false),
  inspectionFrequency: text("inspection_frequency"), // How often inspections occur
  lastInspectionDate: date("last_inspection_date"),
  complianceWithRegulations: text("compliance_with_regulations"),

  // Challenges and improvements
  majorChallenges: text("major_challenges"),
  plannedImprovements: text("planned_improvements"),
  developmentNeeds: text("development_needs"),
  successStories: text("success_stories"),

  // Connectivity and accessibility
  distanceFromCityOrBazarKm: decimal("distance_from_city_or_bazar_km", {
    precision: 6,
    scale: 2,
  }),
  accessRoadCondition: text("access_road_condition"),
  publicTransportAccessibility: text("public_transport_accessibility"),

  // Contact information
  contactPersonName: text("contact_person_name"),
  contactPersonDesignation: text("contact_person_designation"),
  contactPhone: text("contact_phone"),
  alternateContactPhone: text("alternate_contact_phone"),
  contactEmail: text("contact_email"),

  // Social media and online presence
  hasOnlinePresence: boolean("has_online_presence").default(false),
  websiteUrl: text("website_url"),
  facebookPage: text("facebook_page"),
  otherSocialMedia: text("other_social_media"),

  // Linkages to other entities
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedFarmerGroups: jsonb("linked_farmer_groups").default(sql`'[]'::jsonb`),
  linkedCooperatives: jsonb("linked_cooperatives").default(sql`'[]'::jsonb`),
  linkedTransportProviders: jsonb("linked_transport_providers").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  marketArea: geometry("market_area", { type: "Polygon" }),

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

export type VegetableMarket = typeof vegetableMarket.$inferSelect;
export type NewVegetableMarket = typeof vegetableMarket.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
