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

// Tourism park specific enums
export const parkTypeEnum = pgEnum("park_type", [
  "RECREATIONAL_PARK",
  "THEME_PARK",
  "ADVENTURE_PARK",
  "ECO_PARK",
  "WATER_PARK",
  "AMUSEMENT_PARK",
  "HERITAGE_PARK",
  "BOTANICAL_GARDEN",
  "ZOO",
  "SAFARI_PARK",
  "CHILDREN_PARK",
  "ENTERTAINMENT_PARK",
  "MIXED_USE",
  "OTHER",
]);

// Tourism Park table
export const tourismPark = pgTable("tourism_park", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  nameInLocalLanguage: text("name_in_local_language"),
  description: text("description"),
  parkType: parkTypeEnum("park_type").notNull(),

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

  // Operating information
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  openingDays: text("opening_days"), // e.g., "Sunday-Friday"
  isOpenAllYear: boolean("is_open_all_year").default(true),
  peakSeason: tourismSeasonEnum("peak_season"),
  seasonalOpeningDetails: text("seasonal_opening_details"),

  // Fees and tickets
  entranceFeeType: entranceFeeTypeEnum("entrance_fee_type").notNull(),
  adultFeeNPR: decimal("adult_fee_npr", { precision: 10, scale: 2 }),
  childFeeNPR: decimal("child_fee_npr", { precision: 10, scale: 2 }),
  foreignerFeeNPR: decimal("foreigner_fee_npr", { precision: 10, scale: 2 }),
  saarcFeeNPR: decimal("saarc_fee_npr", { precision: 10, scale: 2 }),
  discountCategories: text("discount_categories"),
  ticketBookingMethods: text("ticket_booking_methods"),

  // Attractions and facilities
  hasRides: boolean("has_rides").default(false),
  rideCount: integer("ride_count"),
  majorAttractions: text("major_attractions"),
  hasWaterFeatures: boolean("has_water_features").default(false),
  waterFeatureDetails: text("water_feature_details"),
  hasPlaygrounds: boolean("has_playgrounds").default(false),
  playgroundCount: integer("playground_count"),
  hasGardens: boolean("has_gardens").default(false),
  gardenDetails: text("garden_details"),
  hasZooSection: boolean("has_zoo_section").default(false),
  animalSpeciesCount: integer("animal_species_count"),
  majorAnimalAttractions: text("major_animal_attractions"),
  hasAquarium: boolean("has_aquarium").default(false),
  aquariumDetails: text("aquarium_details"),
  hasMuseum: boolean("has_museum").default(false),
  museumDetails: text("museum_details"),

  // Infrastructure and amenities
  hasToilets: boolean("has_toilets").default(true),
  toiletCount: integer("toilet_count"),
  hasDisabledToilets: boolean("has_disabled_toilets").default(false),
  hasDrinkingWater: boolean("has_drinking_water").default(false),
  hasRestaurants: boolean("has_restaurants").default(false),
  restaurantCount: integer("restaurant_count"),
  hasFood: boolean("has_food_court").default(false),
  foodCourtCapacity: integer("food_court_capacity"),
  hasFoodStalls: boolean("has_food_stalls").default(false),
  hasShops: boolean("has_shops").default(false),
  shopCount: integer("shop_count"),
  hasBenchesSeating: boolean("has_benches_seating").default(true),
  seatingCapacity: integer("seating_capacity"),
  hasLockers: boolean("has_lockers").default(false),
  hasFirstAid: boolean("has_first_aid").default(false),
  hasInformationCenter: boolean("has_information_center").default(false),

  // Accessibility and infrastructure
  hasParkingFacility: boolean("has_parking_facility").default(false),
  carParkingCapacity: integer("car_parking_capacity"),
  busParkingCapacity: integer("bus_parking_capacity"),
  bikeParkingCapacity: integer("bike_parking_capacity"),
  hasWheelchairAccess: boolean("has_wheelchair_access").default(false),
  wheelchairAccessDetails: text("wheelchair_access_details"),
  hasStrollerAccess: boolean("has_stroller_access").default(false),
  hasPavedPaths: boolean("has_paved_paths").default(false),
  totalPathLengthKm: decimal("total_path_length_km", {
    precision: 6,
    scale: 2,
  }),

  // Safety and security
  hasSecurityPersonnel: boolean("has_security_personnel").default(false),
  securityPersonnelCount: integer("security_personnel_count"),
  hasCCTV: boolean("has_cctv").default(false),
  cctvCameraCount: integer("cctv_camera_count"),
  hasLifeguards: boolean("has_lifeguards").default(false),
  lifeguardCount: integer("lifeguard_count"),
  accidentHistory: text("accident_history"),
  safetyMeasures: text("safety_measures"),

  // Visitor information
  averageDailyVisitors: integer("average_daily_visitors"),
  peakDailyVisitors: integer("peak_daily_visitors"),
  annualVisitorCount: integer("annual_visitor_count"),
  localVisitorPercentage: integer("local_visitor_percentage"),
  foreignVisitorPercentage: integer("foreign_visitor_percentage"),
  visitorSatisfactionLevel: visitorExperienceLevelEnum(
    "visitor_satisfaction_level",
  ),
  crowdLevel: attractionCrowdLevelEnum("crowd_level"),

  // Environmental aspects
  treeCount: integer("tree_count"),
  majorPlantSpecies: text("major_plant_species"),
  hasWasteManagement: boolean("has_waste_management").default(false),
  wasteManagementDetails: text("waste_management_details"),
  hasRecyclingBins: boolean("has_recycling_bins").default(false),
  recyclingBinCount: integer("recycling_bin_count"),
  isEnvironmentallyProtected: boolean("is_environmentally_protected").default(
    false,
  ),
  protectionDetails: text("protection_details"),

  // Staff and management
  totalStaffCount: integer("total_staff_count"),
  permanentStaffCount: integer("permanent_staff_count"),
  seasonalStaffCount: integer("seasonal_staff_count"),
  maintenanceStaffCount: integer("maintenance_staff_count"),
  hasDedicatedManager: boolean("has_dedicated_manager").default(false),

  // Financial aspects
  operatingBudgetNPR: decimal("operating_budget_npr", {
    precision: 18,
    scale: 2,
  }),
  annualMaintenanceCostNPR: decimal("annual_maintenance_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  annualRevenueNPR: decimal("annual_revenue_npr", { precision: 18, scale: 2 }),
  revenueSources: text("revenue_sources"),
  governmentFundingNPR: decimal("government_funding_npr", {
    precision: 14,
    scale: 2,
  }),

  // Cultural and educational aspects
  historicalSignificance: text("historical_significance"),
  culturalImportance: text("cultural_importance"),
  educationalValue: text("educational_value"),
  offersGuidedTours: boolean("offers_guided_tours").default(false),
  tourLanguages: text("tour_languages"),
  hasEducationalPrograms: boolean("has_educational_programs").default(false),
  educationalProgramDetails: text("educational_program_details"),

  // Special features
  specialFeatures: text("special_features"),
  uniqueSellingPoints: text("unique_selling_points"),
  awardsAndRecognitions: text("awards_and_recognitions"),

  // Events and activities
  regularEvents: text("regular_events"),
  annualEvents: text("annual_events"),
  hasEventVenue: boolean("has_event_venue").default(false),
  eventVenueCapacity: integer("event_venue_capacity"),
  outdoorActivityOptions: text("outdoor_activity_options"),

  // Maintenance and development
  maintenanceStatus: maintenanceStatusEnum("maintenance_status"),
  lastMajorRenovation: date("last_major_renovation"),
  plannedUpgrades: text("planned_upgrades"),
  expansionPlans: text("expansion_plans"),

  // Marketing and promotion
  marketingChannels: text("marketing_channels"),
  hasWebsite: boolean("has_website").default(false),
  websiteUrl: text("website_url"),
  socialMediaLinks: text("social_media_links"),
  hasOnlinePresence: boolean("has_online_presence").default(false),
  onlineRating: decimal("online_rating", { precision: 3, scale: 1 }),

  // Challenges and issues
  majorChallenges: text("major_challenges"),
  visitorComplaints: text("visitor_complaints"),
  improvementSuggestions: text("improvement_suggestions"),

  // Contact information
  contactPerson: text("contact_person"),
  contactPersonTitle: text("contact_person_title"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),

  // Linkages to other entities
  linkedRestaurants: jsonb("linked_restaurants").default(sql`'[]'::jsonb`),
  linkedAccommodations: jsonb("linked_accommodations").default(
    sql`'[]'::jsonb`,
  ),
  linkedTransportation: jsonb("linked_transportation").default(
    sql`'[]'::jsonb`,
  ),
  linkedAttractions: jsonb("linked_attractions").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  parkBoundary: geometry("park_boundary", { type: "Polygon" }),
  pathNetwork: geometry("path_network", { type: "MultiLineString" }),
  featurePoints: geometry("feature_points", { type: "MultiPoint" }),

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

export type TourismPark = typeof tourismPark.$inferSelect;
export type NewTourismPark = typeof tourismPark.$inferInsert;
