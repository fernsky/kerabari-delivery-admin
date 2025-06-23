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
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define haat bazaar frequency enum
export const haatBazaarFrequencyEnum = pgEnum("haat_bazaar_frequency", [
  "DAILY",
  "WEEKLY",
  "BIWEEKLY",
  "FORTNIGHTLY",
  "MONTHLY",
  "SEASONAL",
  "OTHER",
]);

// Define haat bazaar scale enum
export const haatBazaarScaleEnum = pgEnum("haat_bazaar_scale", [
  "SMALL",
  "MEDIUM",
  "LARGE",
  "VERY_LARGE",
]);

// Define haat bazaar primary product enum
export const haatBazaarPrimaryProductEnum = pgEnum(
  "haat_bazaar_primary_product",
  [
    "AGRICULTURAL",
    "LIVESTOCK",
    "HANDICRAFT",
    "TEXTILES",
    "GENERAL_MERCHANDISE",
    "FOOD",
    "MIXED",
    "SPECIALIZED",
    "OTHER",
  ],
);

// Define operating space enum
export const operatingSpaceEnum = pgEnum("operating_space", [
  "OPEN_GROUND",
  "COVERED_SHED",
  "STREET",
  "MIXED",
  "PURPOSE_BUILT",
  "TEMPORARY_STRUCTURES",
  "OTHER",
]);

// Haat Bazaar table
export const haatBazaar = pgTable("haat_bazaar", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  nameInLocalLanguage: text("name_in_local_language"),
  frequency: haatBazaarFrequencyEnum("frequency").notNull(),
  scale: haatBazaarScaleEnum("scale").notNull(),
  primaryProduct: haatBazaarPrimaryProductEnum("primary_product").notNull(),
  operatingSpace: operatingSpaceEnum("operating_space").notNull(),
  description: text("description"),
  shortDescription: text("short_description"),

  // Basic information
  establishedYear: integer("established_year"),
  operatingDays: text("operating_days"), // Specific days like "Monday", "Sunday and Thursday"
  registrationStatus: text("registration_status"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  landmark: text("landmark"),

  // Contact information
  contactPerson: text("contact_person"), // Market manager or local authority
  contactPhone: text("contact_phone"),
  alternatePhone: text("alternate_phone"),

  // Operating hours
  startTime: time("start_time"),
  endTime: time("end_time"),
  peakHours: text("peak_hours"),
  setupTime: time("setup_time"), // When vendors start setting up

  // Area and infrastructure
  totalAreaSqm: decimal("total_area_sq_m", { precision: 12, scale: 2 }),
  hasDesignatedBoundary: boolean("has_designated_boundary").default(false),
  hasPermanentStructures: boolean("has_permanent_structures").default(false),
  hasCoveredArea: boolean("has_covered_area").default(false),
  coveredAreaPercent: integer("covered_area_percent"),
  hasDrainageSystem: boolean("has_drainage_system").default(false),
  hasElectricity: boolean("has_electricity").default(false),
  electricityType: text("electricity_type"), // Grid, generator, solar
  hasWaterSupply: boolean("has_water_supply").default(false),
  waterSupplyType: text("water_supply_type"),

  // Vendor information
  estimatedVendorCount: integer("estimated_vendor_count"),
  registeredVendorCount: integer("registered_vendor_count"),
  regularVendorCount: integer("regular_vendor_count"),
  seasonalVendorCount: integer("seasonal_vendor_count"),
  femaleVendorPercent: integer("female_vendor_percent"),
  vendorsFromOtherDistrictsPercent: integer(
    "vendors_from_other_districts_percent",
  ),
  vendorRegistrationFeeNPR: decimal("vendor_registration_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  dailyTaxPerVendorNPR: decimal("daily_tax_per_vendor_npr", {
    precision: 10,
    scale: 2,
  }),
  averageVendorEarningPerDayNPR: decimal("average_vendor_earning_per_day_npr", {
    precision: 10,
    scale: 2,
  }),

  // Products and services
  agriculturalProduceSoldTypes: text("agricultural_produce_sold_types"),
  livestockSoldTypes: text("livestock_sold_types"),
  handicraftSoldTypes: text("handicraft_sold_types"),
  manufacturedGoodsSoldTypes: text("manufactured_goods_sold_types"),
  foodServiceTypes: text("food_service_types"),
  hasReadyToEatFood: boolean("has_ready_to_eat_food").default(true),
  hasLiveAnimalTrading: boolean("has_live_animal_trading").default(false),
  specializedProducts: text("specialized_products"),
  localSpecialties: text("local_specialties"),
  serviceLeverage: text("service_leverage"), // Services like mobile repairs, haircuts, etc.

  // Visitors and economic activity
  estimatedDailyFootfall: integer("estimated_daily_footfall"),
  peakSeasonMonths: text("peak_season_months"),
  lowSeasonMonths: text("low_season_months"),
  visitorDemographics: text("visitor_demographics"),
  estimatedDailyTransactionVolumeNPR: decimal(
    "estimated_daily_transaction_volume_npr",
    { precision: 18, scale: 2 },
  ),
  averagePurchaseValueNPR: decimal("average_purchase_value_npr", {
    precision: 10,
    scale: 2,
  }),
  economicImportance: text("economic_importance"),

  // Management and operations
  managedBy: text("managed_by"), // Local government, community committee, etc.
  hasMarketCommittee: boolean("has_market_committee").default(false),
  marketCommitteeDetails: text("market_committee_details"),
  hasTaxCollection: boolean("has_tax_collection").default(false),
  taxCollectionMethod: text("tax_collection_method"),
  estimatedTaxRevenuePerEventNPR: decimal(
    "estimated_tax_revenue_per_event_npr",
    { precision: 14, scale: 2 },
  ),
  annualRevenueEstimateNPR: decimal("annual_revenue_estimate_npr", {
    precision: 18,
    scale: 2,
  }),
  revenueUsedFor: text("revenue_used_for"),

  // Amenities and facilities
  hasPublicToilets: boolean("has_public_toilets").default(false),
  toiletCount: integer("toilet_count"),
  hasHandwashingStations: boolean("has_handwashing_stations").default(false),
  handwashingStationCount: integer("handwashing_station_count"),
  hasWasteCollection: boolean("has_waste_collection").default(false),
  wasteCollectionDetails: text("waste_collection_details"),
  hasDesignatedParkingSpace: boolean("has_designated_parking_space").default(
    false,
  ),
  parkingCapacity: integer("parking_capacity"),
  hasLoadingUnloadingArea: boolean("has_loading_unloading_area").default(false),
  hasRestingArea: boolean("has_resting_area").default(false),

  // Accessibility
  distanceFromMainRoadKm: decimal("distance_from_main_road_km", {
    precision: 6,
    scale: 2,
  }),
  distanceFromNearestCityKm: decimal("distance_from_nearest_city_km", {
    precision: 6,
    scale: 2,
  }),
  accessibilityRating: text("accessibility_rating"),
  publicTransportAvailability: text("public_transport_availability"),
  roadCondition: text("road_condition"),

  // Security and safety
  securityArrangement: text("security_arrangement"),
  hasSecurityPersonnel: boolean("has_security_personnel").default(false),
  securityPersonnelCount: integer("security_personnel_count"),
  hasFireSafetyMeasures: boolean("has_fire_safety_measures").default(false),
  safetyIssues: text("safety_issues"),

  // Cultural and social aspects
  culturalSignificance: text("cultural_significance"),
  traditionalPractices: text("traditional_practices"),
  socialGatheringImportance: text("social_gathering_importance"),
  communityEvents: text("community_events"),

  // Supply chain connections
  sourceOfProducts: text("source_of_products"), // Where products come from
  productDestinations: text("product_destinations"), // Where products go after market
  supplyChainRole: text("supply_chain_role"),
  connectedMarkets: text("connected_markets"),

  // Weather and climate impact
  allWeatherOperational: boolean("all_weather_operational").default(false),
  weatherVulnerabilities: text("weather_vulnerabilities"),
  seasonalVariations: text("seasonal_variations"),

  // Challenges and development
  majorChallenges: text("major_challenges"),
  infrastructureNeeds: text("infrastructure_needs"),
  developmentPlans: text("development_plans"),
  supportRequiredFrom: text("support_required_from"),

  // Linkages to other entities
  linkedMarketCenters: jsonb("linked_market_centers").default(sql`'[]'::jsonb`),
  linkedAgricultureAreas: jsonb("linked_agriculture_areas").default(
    sql`'[]'::jsonb`,
  ),
  linkedTransportRoutes: jsonb("linked_transport_routes").default(
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

export type HaatBazaar = typeof haatBazaar.$inferSelect;
export type NewHaatBazaar = typeof haatBazaar.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
