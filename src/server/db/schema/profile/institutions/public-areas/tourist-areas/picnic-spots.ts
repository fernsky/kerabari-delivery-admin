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
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";
import {
  attractionOwnershipEnum,
  attractionStatusEnum,
  attractionSizeEnum,
  tourismSeasonEnum,
  accessibilityLevelEnum,
  maintenanceStatusEnum,
  attractionCrowdLevelEnum,
  entranceFeeTypeEnum,
  visitorExperienceLevelEnum,
} from "./common";

// Picnic spot specific enums
export const picnicSpotLocationTypeEnum = pgEnum("picnic_spot_location_type", [
  "RIVERSIDE",
  "FOREST",
  "HILLTOP",
  "LAKESIDE",
  "GARDEN",
  "WATERFALL_VICINITY",
  "PARK_AREA",
  "FARMLAND",
  "MOUNTAIN_AREA",
  "VALLEY",
  "MEADOW",
  "OTHER",
]);

// Picnic Spot table
export const picnicSpot = pgTable("picnic_spot", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  nameInLocalLanguage: text("name_in_local_language"),
  description: text("description"),
  locationType: picnicSpotLocationTypeEnum("location_type").notNull(),

  // Basic information
  establishedYear: integer("established_year"),
  ownership: attractionOwnershipEnum("ownership").notNull(),
  managingAuthority: text("managing_authority"),
  status: attractionStatusEnum("status").notNull(),
  size: attractionSizeEnum("size"),
  areaInHectares: decimal("area_in_hectares", { precision: 10, scale: 2 }),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  latitude: decimal("latitude", { precision: 9, scale: 6 }),
  longitude: decimal("longitude", { precision: 9, scale: 6 }),
  elevationInMeters: decimal("elevation_in_meters", { precision: 7, scale: 2 }),
  accessibilityLevel: accessibilityLevelEnum("accessibility_level"),
  accessRoutes: text("access_routes"),
  distanceFromCityCenterKm: decimal("distance_from_city_center_km", {
    precision: 6,
    scale: 2,
  }),

  // Facilities and amenities
  shelterCount: integer("shelter_count"),
  hasRoofedShelters: boolean("has_roofed_shelters").default(false),
  hasOpenSpaces: boolean("has_open_spaces").default(true),
  tableCount: integer("table_count"),
  benchCount: integer("bench_count"),
  hasCookingAreas: boolean("has_cooking_areas").default(false),
  cookingAreaCount: integer("cooking_area_count"),
  hasBarbecuePits: boolean("has_barbecue_pits").default(false),
  barbecuePitCount: integer("barbecue_pit_count"),
  hasFirepits: boolean("has_firepits").default(false),
  firepitCount: integer("firepit_count"),
  hasToilets: boolean("has_toilets").default(false),
  toiletCount: integer("toilet_count"),
  hasCleaningService: boolean("has_cleaning_service").default(false),
  hasDrinkingWater: boolean("has_drinking_water").default(false),
  waterSourceType: text("water_source_type"), // Tap, Well, Natural spring, etc.
  hasElectricity: boolean("has_electricity").default(false),
  electricityDetails: text("electricity_details"),
  hasPlayArea: boolean("has_play_area").default(false),
  playAreaFacilities: text("play_area_facilities"),
  hasSwimmingOption: boolean("has_swimming_option").default(false),
  swimmingDetails: text("swimming_details"),

  // Access and usage
  isReservable: boolean("is_reservable").default(false),
  reservationProcess: text("reservation_process"),
  maxGroupSize: integer("max_group_size"),
  entranceFeeType: entranceFeeTypeEnum("entrance_fee_type").notNull(),
  entranceFeeNPR: decimal("entrance_fee_npr", { precision: 10, scale: 2 }),
  shelterRentFeeNPR: decimal("shelter_rent_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  isOpenAllYear: boolean("is_open_all_year").default(true),
  operatingHours: text("operating_hours"),
  openingDays: text("opening_days"), // e.g., "Sunday-Friday"
  bestVisitingTime: text("best_visiting_time"), // Time of day or season
  peakSeason: tourismSeasonEnum("peak_season"),

  // Visitor information
  maxCapacity: integer("max_capacity"),
  averageDailyVisitors: integer("average_daily_visitors"),
  peakDailyVisitors: integer("peak_daily_visitors"),
  visitorSatisfactionLevel: visitorExperienceLevelEnum(
    "visitor_satisfaction_level",
  ),
  crowdLevel: attractionCrowdLevelEnum("crowd_level"),
  popularActivities: text("popular_activities"),

  // Environmental aspects
  naturalSurroundings: text("natural_surroundings"),
  prominentVegetation: text("prominent_vegetation"),
  scenicViews: text("scenic_views"),
  hasWasteManagement: boolean("has_waste_management").default(false),
  wasteManagementDetails: text("waste_management_details"),
  wasteDisposalBins: integer("waste_disposal_bins"),
  isEnvironmentallySensitive: boolean("is_environmentally_sensitive").default(
    false,
  ),
  environmentalConcerns: text("environmental_concerns"),

  // Safety and regulations
  hasFireSafetyMeasures: boolean("has_fire_safety_measures").default(false),
  fireSafetyDetails: text("fire_safety_details"),
  alcoholAllowed: boolean("alcohol_allowed").default(true),
  musicAllowed: boolean("music_allowed").default(true),
  petAllowed: boolean("pet_allowed").default(false),
  noiseRestrictions: text("noise_restrictions"),
  otherRules: text("other_rules"),
  hasOverseer: boolean("has_overseer").default(false),
  overseerDetails: text("overseer_details"),

  // Parking and accessibility
  hasParkingFacility: boolean("has_parking_facility").default(false),
  carParkingCapacity: integer("car_parking_capacity"),
  busParkingCapacity: integer("bus_parking_capacity"),
  bikeParkingCapacity: integer("bike_parking_capacity"),
  hasDisabledAccess: boolean("has_disabled_access").default(false),
  disabledAccessDetails: text("disabled_access_details"),
  walkingPathsCondition: text("walking_paths_condition"),

  // Management and maintenance
  maintenanceFrequency: text("maintenance_frequency"),
  maintenanceStatus: maintenanceStatusEnum("maintenance_status"),
  cleaningSchedule: text("cleaning_schedule"),
  staffCount: integer("staff_count"),
  annualMaintenanceCostNPR: decimal("annual_maintenance_cost_npr", {
    precision: 14,
    scale: 2,
  }),

  // Services and rentals
  offersEquipmentRental: boolean("offers_equipment_rental").default(false),
  rentalEquipmentTypes: text("rental_equipment_types"),
  hasCateringServices: boolean("has_catering_services").default(false),
  cateringServiceDetails: text("catering_service_details"),
  nearbyFoodOptions: text("nearby_food_options"),

  // Visitor experience
  soundEnvironment: text("sound_environment"), // E.g., "Natural sounds", "Traffic noise"
  averageVisitDurationHours: decimal("average_visit_duration_hours", {
    precision: 4,
    scale: 2,
  }),
  bestSeason: text("best_season"),
  uniqueExperienceOffered: text("unique_experience_offered"),

  // Issues and challenges
  commonIssues: text("common_issues"),
  visitorComplaints: text("visitor_complaints"),
  maintenanceChallenges: text("maintenance_challenges"),

  // Future development
  plannedImprovements: text("planned_improvements"),
  expansionPlans: text("expansion_plans"),

  // Contact information
  contactPerson: text("contact_person"),
  contactPersonTitle: text("contact_person_title"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),

  // Linkages to other entities
  linkedNearbyAttractions: jsonb("linked_nearby_attractions").default(
    sql`'[]'::jsonb`,
  ),
  linkedAccommodations: jsonb("linked_accommodations").default(
    sql`'[]'::jsonb`,
  ),
  linkedFoodOptions: jsonb("linked_food_options").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  areaBoundary: geometry("area_boundary", { type: "Polygon" }),
  accessPaths: geometry("access_paths", { type: "MultiLineString" }),
  facilitiesPoints: geometry("facilities_points", { type: "MultiPoint" }),

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

export type PicnicSpot = typeof picnicSpot.$inferSelect;
export type NewPicnicSpot = typeof picnicSpot.$inferInsert;
