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

// Define market center type enum
export const marketCenterTypeEnum = pgEnum("market_center_type", [
  "BUSINESS_COMPLEX",
  "SHOPPING_MALL",
  "COMMERCIAL_CENTER",
  "TRADE_CENTER",
  "WHOLESALE_MARKET",
  "RETAIL_MARKET",
  "MIXED_USE_MARKET",
  "TRADITIONAL_MARKET",
  "SPECIALIZED_MARKET",
  "OTHER",
]);

// Define market scale enum
export const marketScaleEnum = pgEnum("market_scale", [
  "LOCAL",
  "WARD_LEVEL",
  "MUNICIPAL",
  "DISTRICT_LEVEL",
  "REGIONAL",
  "PROVINCIAL",
  "NATIONAL",
  "INTERNATIONAL",
]);

// Define market ownership enum
export const marketOwnershipEnum = pgEnum("market_ownership", [
  "GOVERNMENT_OWNED",
  "MUNICIPALITY_OWNED",
  "PRIVATE",
  "COOPERATIVE",
  "PUBLIC_PRIVATE_PARTNERSHIP",
  "COMMUNITY_OWNED",
  "MIXED_OWNERSHIP",
  "OTHER",
]);

// Define market structure enum
export const marketStructureEnum = pgEnum("market_structure", [
  "FORMAL_BUILDING",
  "SEMI_PERMANENT",
  "TEMPORARY_STRUCTURES",
  "OPEN_AIR",
  "MIXED",
]);

// Market Center table
export const marketCenter = pgTable("market_center", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  nameInLocalLanguage: text("name_in_local_language"),
  marketType: marketCenterTypeEnum("market_type").notNull(),
  marketScale: marketScaleEnum("market_scale").notNull(),
  ownershipType: marketOwnershipEnum("ownership_type").notNull(),
  marketStructure: marketStructureEnum("market_structure").notNull(),
  description: text("description"),
  shortDescription: text("short_description"),

  // Basic information
  establishedYear: integer("established_year"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"),
  panNumber: varchar("pan_number", { length: 20 }),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  landmark: text("landmark"),

  // Contact information
  managementOfficePhone: text("management_office_phone"),
  alternatePhoneNumber: text("alternate_phone_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Social media
  facebookUrl: text("facebook_url"),
  otherSocialMedia: text("other_social_media"),

  // Operating hours
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  weeklyOffDay: text("weekly_off_day"),
  hasSeasonalSchedule: boolean("has_seasonal_schedule").default(false),
  seasonalScheduleDetails: text("seasonal_schedule_details"),

  // Physical infrastructure
  totalAreaSqm: decimal("total_area_sq_m", { precision: 12, scale: 2 }),
  builtUpAreaSqm: decimal("built_up_area_sq_m", { precision: 12, scale: 2 }),
  openSpaceAreaSqm: decimal("open_space_area_sq_m", {
    precision: 12,
    scale: 2,
  }),
  buildingFloors: integer("building_floors"),
  totalShops: integer("total_shops"),
  totalStalls: integer("total_stalls"),
  occupiedShops: integer("occupied_shops"),
  vacantShops: integer("vacant_shops"),
  minimumShopAreaSqm: decimal("minimum_shop_area_sq_m", {
    precision: 8,
    scale: 2,
  }),
  maximumShopAreaSqm: decimal("maximum_shop_area_sq_m", {
    precision: 8,
    scale: 2,
  }),
  hasOpenVendingSpace: boolean("has_open_vending_space").default(false),
  openVendingSpotCount: integer("open_vending_spot_count"),
  hasWarehouse: boolean("has_warehouse").default(false),
  warehouseAreaSqm: decimal("warehouse_area_sq_m", { precision: 10, scale: 2 }),
  loadingUnloadingAreaSqm: decimal("loading_unloading_area_sq_m", {
    precision: 10,
    scale: 2,
  }),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"),
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterSourceType: text("water_source_type"),
  hasPublicToilets: boolean("has_public_toilets").default(true),
  publicToiletCount: integer("public_toilet_count"),
  hasSeparateToiletsForGenders: boolean(
    "has_separate_toilets_for_genders",
  ).default(false),
  hasDisabledAccessibleToilets: boolean(
    "has_disabled_accessible_toilets",
  ).default(false),
  hasWasteManagementSystem: boolean("has_waste_management_system").default(
    false,
  ),
  wasteManagementDetails: text("waste_management_details"),
  hasFireSafetySystem: boolean("has_fire_safety_system").default(false),
  fireSafetyDetails: text("fire_safety_details"),

  // Accessibility and parking
  hasParking: boolean("has_parking").default(false),
  parkingCapacity: integer("parking_capacity"),
  hasBikeParking: boolean("has_bike_parking").default(false),
  bikeParkingCapacity: integer("bike_parking_capacity"),
  isWheelchairAccessible: boolean("is_wheelchair_accessible").default(false),
  publicTransportAccessibility: text("public_transport_accessibility"),

  // Business composition
  retailShopCount: integer("retail_shop_count"),
  wholesaleShopCount: integer("wholesale_shop_count"),
  foodServiceCount: integer("food_service_count"),
  groceryShopCount: integer("grocery_shop_count"),
  clothingStoreCount: integer("clothing_store_count"),
  electronicsShopCount: integer("electronics_shop_count"),
  applianceShopCount: integer("appliance_shop_count"),
  furnitureStoreCount: integer("furniture_store_count"),
  hardwareStoreCount: integer("hardware_store_count"),
  cosmeticsStoreCount: integer("cosmetics_store_count"),
  phoneShopCount: integer("phone_shop_count"),
  servicesShopCount: integer("services_shop_count"),
  bankingServiceCount: integer("banking_service_count"),
  entertainmentVenueCount: integer("entertainment_venue_count"),
  otherBusinessTypes: text("other_business_types"),

  // Economic data
  estimatedDailyVisitorsCount: integer("estimated_daily_visitors_count"),
  estimatedMonthlyTransactionVolumeNPR: decimal(
    "estimated_monthly_transaction_volume_npr",
    { precision: 18, scale: 2 },
  ),
  averageRentPerSqmNPR: decimal("average_rent_per_sqm_npr", {
    precision: 10,
    scale: 2,
  }),
  averageShopSizeSquareMeters: decimal("average_shop_size_square_meters", {
    precision: 8,
    scale: 2,
  }),
  averageShopDepositNPR: decimal("average_shop_deposit_npr", {
    precision: 12,
    scale: 2,
  }),
  totalEmploymentEstimate: integer("total_employment_estimate"),

  // Management details
  managementType: text("management_type"), // Private company, cooperative, committee, etc.
  managementCompanyName: text("management_company_name"),
  hasManagementCommittee: boolean("has_management_committee").default(false),
  managementCommitteeDetails: text("management_committee_details"),
  securityPersonnelCount: integer("security_personnel_count"),
  cleaningStaffCount: integer("cleaning_staff_count"),
  hasMarketAssociation: boolean("has_market_association").default(false),
  marketAssociationName: text("market_association_name"),

  // Services and amenities
  hasAtm: boolean("has_atm").default(false),
  atmCount: integer("atm_count"),
  hasFoodCourt: boolean("has_food_court").default(false),
  foodCourtCapacity: integer("food_court_capacity"),
  hasChildCareCenter: boolean("has_child_care_center").default(false),
  hasRestArea: boolean("has_rest_area").default(false),
  hasPrayerRoom: boolean("has_prayer_room").default(false),
  hasWifi: boolean("has_wifi").default(false),
  hasTaxiStand: boolean("has_taxi_stand").default(false),
  hasInformationCenter: boolean("has_information_center").default(false),
  otherAmenities: text("other_amenities"),

  // Security features
  hasSecurityGuard: boolean("has_security_guard").default(false),
  hasCctv: boolean("has_cctv").default(false),
  cctvCameraCount: integer("cctv_camera_count"),

  // Environmental aspects
  isEcoFriendly: boolean("is_eco_friendly").default(false),
  ecoFriendlyFeatures: text("eco_friendly_features"),
  hasRainwaterHarvesting: boolean("has_rainwater_harvesting").default(false),
  hasSolarPower: boolean("has_solar_power").default(false),

  // Challenges and development
  majorChallenges: text("major_challenges"),
  plannedImprovements: text("planned_improvements"),
  expansionPlans: text("expansion_plans"),

  // Linkages to other entities
  linkedBusinessAssociations: jsonb("linked_business_associations").default(
    sql`'[]'::jsonb`,
  ),
  linkedMarkets: jsonb("linked_markets").default(sql`'[]'::jsonb`),
  linkedTransportHubs: jsonb("linked_transport_hubs").default(sql`'[]'::jsonb`),

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

export type MarketCenter = typeof marketCenter.$inferSelect;
export type NewMarketCenter = typeof marketCenter.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
