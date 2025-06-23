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
import { buildingConditionEnum, accessibilityLevelEnum } from "../../common";

// Define resting place type enum
export const restingPlaceTypeEnum = pgEnum("resting_place_type", [
  "TRADITIONAL_CHAUTARI",
  "MODERN_WAITING_AREA",
  "BUS_STOP_SHELTER",
  "ROADSIDE_REST_AREA",
  "PARK_RESTING_AREA",
  "COVERED_PAVILION",
  "TOURIST_REST_STOP",
  "MARKET_WAITING_AREA",
  "TRANSIT_WAITING_AREA",
  "MULTIPURPOSE_REST_AREA",
  "PEDESTRIAN_REST_AREA",
  "OTHER",
]);

// Define construction type enum
export const restingPlaceConstructionTypeEnum = pgEnum(
  "resting_place_construction_type",
  [
    "TRADITIONAL_STONE_PLATFORM",
    "CONCRETE_STRUCTURE",
    "WOODEN_STRUCTURE",
    "STONE_AND_WOOD",
    "METAL_STRUCTURE",
    "BRICK_AND_CONCRETE",
    "BAMBOO_STRUCTURE",
    "MIXED_MATERIALS",
    "MODERN_PREFABRICATED",
    "OTHER",
  ],
);

// Define shade type enum
export const shadeTypeEnum = pgEnum("shade_type", [
  "NATURAL_TREE_SHADE",
  "PERMANENT_ROOF",
  "SEMI_PERMANENT_CANOPY",
  "THATCHED_ROOF",
  "METAL_ROOF",
  "TILED_ROOF",
  "CONCRETE_ROOF",
  "FABRIC_SHADE",
  "NO_SHADE",
  "OTHER",
]);

// Define management type enum
export const restingPlaceManagementTypeEnum = pgEnum(
  "resting_place_management_type",
  [
    "GOVERNMENT_MANAGED",
    "MUNICIPALITY_MANAGED",
    "COMMUNITY_MANAGED",
    "PRIVATELY_MANAGED",
    "USER_COMMITTEE_MANAGED",
    "UNMANAGED",
    "NGO_MANAGED",
    "TEMPLE_TRUST_MANAGED",
    "OTHER",
  ],
);

// Define usage frequency enum
export const restingPlaceUsageFrequencyEnum = pgEnum(
  "resting_place_usage_frequency",
  [
    "VERY_HIGH", // Constantly used
    "HIGH", // Multiple groups throughout day
    "MEDIUM", // Regular daily use
    "LOW", // Few users per day
    "VERY_LOW", // Occasionally used
    "SEASONAL", // Usage varies by season
  ],
);

// Define cultural significance enum
export const culturalSignificanceEnum = pgEnum("cultural_significance", [
  "HIGH_HISTORICAL_VALUE",
  "COMMUNITY_LANDMARK",
  "MODERN_SIGNIFICANCE",
  "RELIGIOUS_SIGNIFICANCE",
  "TRADITIONAL_GATHERING_PLACE",
  "TOURIST_ATTRACTION",
  "MINIMAL_SIGNIFICANCE",
  "NO_PARTICULAR_SIGNIFICANCE",
]);

// Resting Place (Chautari) / Waiting Area table
export const restingPlace = pgTable("resting_place", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  restingPlaceType: restingPlaceTypeEnum("resting_place_type").notNull(),
  localName: text("local_name"), // Local name like "Chautari", "Chautara", etc.

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  landmark: text("landmark"), // Nearby landmark for easy identification
  locationType: text("location_type"), // Road junction, trail point, marketplace, etc.

  // Basic information
  establishedYear: integer("established_year"),
  constructionType:
    restingPlaceConstructionTypeEnum("construction_type").notNull(),
  managementType: restingPlaceManagementTypeEnum("management_type"),
  managingBody: text("managing_body"), // Name of the committee/organization managing if any
  hasDedicatedCaretaker: boolean("has_dedicated_caretaker").default(false),

  // Historical and cultural significance
  historicalBackground: text("historical_background"),
  culturalSignificance: culturalSignificanceEnum("cultural_significance"),
  associatedStories: text("associated_stories"),
  designSignificance: text("design_significance"),
  isHeritageStructure: boolean("is_heritage_structure").default(false),
  heritageDesignationDetails: text("heritage_designation_details"),

  // Physical infrastructure
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
  platformHeightCm: integer("platform_height_cm"), // Especially for Chautari
  seatingCapacity: integer("seating_capacity"),
  shadeType: shadeTypeEnum("shade_type"),
  hasTreePlantation: boolean("has_tree_plantation").default(false),
  treeCount: integer("tree_count"),
  treeSpecies: text("tree_species"),
  treeAgeEstimateYears: integer("tree_age_estimate_years"),
  buildingCondition: buildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),

  // Facilities
  hasSeatingBenches: boolean("has_seating_benches").default(true),
  benchCount: integer("bench_count"),
  benchMaterial: text("bench_material"),
  hasWaterFacility: boolean("has_water_facility").default(false),
  waterFacilityType: text("water_facility_type"),
  hasTrashBins: boolean("has_trash_bins").default(false),
  trashBinCount: integer("trash_bin_count"),
  hasInformationBoard: boolean("has_information_board").default(false),
  informationBoardDetails: text("information_board_details"),
  hasElectricity: boolean("has_electricity").default(false),
  hasLighting: boolean("has_lighting").default(false),
  lightingType: text("lighting_type"),
  hasWifi: boolean("has_wifi").default(false),
  hasMobileChargingStation: boolean("has_mobile_charging_station").default(
    false,
  ),
  hasToiletNearby: boolean("has_toilet_nearby").default(false),
  distanceToNearestToiletMeters: integer("distance_to_nearest_toilet_meters"),
  hasShopsNearby: boolean("has_shops_nearby").default(false),
  shopTypes: text("shop_types"),

  // Additional features
  hasPublicPhone: boolean("has_public_phone").default(false),
  hasEmergencyContactInfo: boolean("has_emergency_contact_info").default(false),
  hasShelterFromRain: boolean("has_shelter_from_rain").default(false),
  hasViewPoint: boolean("has_view_point").default(false),
  viewDescription: text("view_description"),
  hasGardenArea: boolean("has_garden_area").default(false),
  gardenAreaSqm: decimal("garden_area_sq_m", { precision: 10, scale: 2 }),
  hasPublicArt: boolean("has_public_art").default(false),
  publicArtDescription: text("public_art_description"),

  // Accessibility
  accessibilityLevel: accessibilityLevelEnum("accessibility_level"),
  distanceFromMainRoadMeters: integer("distance_from_main_road_meters"),
  hasWheelchairAccess: boolean("has_wheelchair_access").default(false),
  hasClearDirectionalSigns: boolean("has_clear_directional_signs").default(
    false,
  ),
  publicTransportAccessibility: text("public_transport_accessibility"),

  // Usage and function
  usageFrequency: restingPlaceUsageFrequencyEnum("usage_frequency"),
  primaryUserGroups: text("primary_user_groups"), // Local residents, travelers, etc.
  usedForCommunityGatherings: boolean("used_for_community_gatherings").default(
    false,
  ),
  communityGatheringTypes: text("community_gathering_types"),
  usedForCommercialPurposes: boolean("used_for_commercial_purposes").default(
    false,
  ),
  commercialUseDetails: text("commercial_use_details"),
  seasonalUsagePattern: text("seasonal_usage_pattern"),

  // Maintenance and upkeep
  maintenanceResponsibility: text("maintenance_responsibility"),
  maintenanceFrequency: text("maintenance_frequency"),
  lastMaintenanceDate: date("last_maintenance_date"),
  cleanlinessLevel: text("cleanliness_level"),
  hasRegularCleaning: boolean("has_regular_cleaning").default(false),
  cleaningSchedule: text("cleaning_schedule"),
  annualMaintenanceBudgetNPR: decimal("annual_maintenance_budget_npr", {
    precision: 10,
    scale: 2,
  }),
  maintenanceFundingSource: text("maintenance_funding_source"),

  // Safety and security
  safetyRating: text("safety_rating"),
  lightingAfterDark: boolean("lighting_after_dark").default(false),
  securityConcerns: text("security_concerns"),
  hasNearbyPolicePost: boolean("has_nearby_police_post").default(false),
  distanceToNearestPolicePostKm: decimal("distance_to_nearest_police_post_km", {
    precision: 5,
    scale: 2,
  }),

  // Environmental aspects
  environmentalConcerns: text("environmental_concerns"),
  drainageFacility: boolean("drainage_facility").default(false),
  drainageCondition: text("drainage_condition"),
  floodRiskLevel: text("flood_risk_level"),
  hasAntilitteringMeasures: boolean("has_antilittering_measures").default(
    false,
  ),

  // Challenges and needs
  infrastructureChallenges: text("infrastructure_challenges"),
  maintenanceChallenges: text("maintenance_challenges"),
  userChallenges: text("user_challenges"),
  improvementNeeds: text("improvement_needs"),

  // Future plans
  plannedUpgrades: text("planned_upgrades"),
  communityRecommendations: text("community_recommendations"),
  localGovernmentPlans: text("local_government_plans"),

  // Related attractions
  nearbyAttractions: text("nearby_attractions"),
  distanceToNearestTouristSpotKm: decimal(
    "distance_to_nearest_tourist_spot_km",
    { precision: 5, scale: 2 },
  ),
  partOfTrailNetwork: boolean("part_of_trail_network").default(false),
  trailNetworkDetails: text("trail_network_details"),

  // Contact information
  contactPersonName: text("contact_person_name"),
  contactPhone: text("contact_phone"),
  alternateContactDetails: text("alternate_contact_details"),

  // Community involvement
  communityContributionHistory: text("community_contribution_history"),
  volunteerInvolvement: text("volunteer_involvement"),
  localSupportLevel: text("local_support_level"),

  // Linkages to other entities
  linkedRoads: jsonb("linked_roads").default(sql`'[]'::jsonb`),
  linkedTrails: jsonb("linked_trails").default(sql`'[]'::jsonb`),
  linkedTouristSites: jsonb("linked_tourist_sites").default(sql`'[]'::jsonb`),
  linkedPublicToilets: jsonb("linked_public_toilets").default(sql`'[]'::jsonb`),
  linkedTransportStops: jsonb("linked_transport_stops").default(
    sql`'[]'::jsonb`,
  ),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  structureFootprint: geometry("structure_footprint", { type: "Polygon" }),

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

export type RestingPlace = typeof restingPlace.$inferSelect;
export type NewRestingPlace = typeof restingPlace.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
