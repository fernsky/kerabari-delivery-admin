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

// Define viewpoint type enum
export const viewpointTypeEnum = pgEnum("viewpoint_type", [
  "MOUNTAIN_VIEWPOINT",
  "HILL_VIEWPOINT",
  "VALLEY_VIEWPOINT",
  "URBAN_VIEWPOINT",
  "SUNRISE_VIEWPOINT",
  "SUNSET_VIEWPOINT",
  "RIVER_VIEWPOINT",
  "LAKE_VIEWPOINT",
  "FOREST_VIEWPOINT",
  "TOWER_VIEWPOINT",
  "OBSERVATION_DECK",
  "PANORAMIC_VIEWPOINT",
  "OTHER",
]);

// Define view quality enum
export const viewQualityEnum = pgEnum("view_quality", [
  "SPECTACULAR",
  "EXCELLENT",
  "GOOD",
  "AVERAGE",
  "LIMITED",
  "DEPENDS_ON_WEATHER",
]);

// Define accessibility level enum
export const viewPointAccessibilityLevelEnum = pgEnum(
  "view_point_accessibility_level",
  [
    "VERY_EASY",
    "EASY",
    "MODERATE",
    "DIFFICULT",
    "VERY_DIFFICULT",
    "SEASONAL_ACCESS",
  ],
);

// Define development status enum
export const developmentStatusEnum = pgEnum("development_status", [
  "WELL_DEVELOPED",
  "DEVELOPED",
  "PARTIALLY_DEVELOPED",
  "MINIMAL_DEVELOPMENT",
  "UNDEVELOPED",
  "UNDER_DEVELOPMENT",
]);

// Define tourism potential enum
export const viewpointTourismPotentialEnum = pgEnum(
  "viewpoint_tourism_potential",
  ["HIGH", "MEDIUM", "LOW", "UNDEVELOPED", "OVERDEVELOPED"],
);

// Viewpoint table
export const viewpoint = pgTable("viewpoint", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  localName: text("local_name"),
  description: text("description"),
  type: viewpointTypeEnum("type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  directions: text("directions"),
  nearestLandmark: text("nearest_landmark"),
  distanceFromCityCenterKm: decimal("distance_from_city_center_km", {
    precision: 6,
    scale: 2,
  }),

  // Physical characteristics
  elevationM: decimal("elevation_m", { precision: 6, scale: 1 }),
  visibilityRangeKm: decimal("visibility_range_km", { precision: 6, scale: 1 }),
  viewQuality: viewQualityEnum("view_quality"),
  viewDescription: text("view_description"),
  visibleLandmarks: text("visible_landmarks"),
  viewAngleDegrees: integer("view_angle_degrees"),
  compassDirection: text("compass_direction"), // North, South, Northeast, etc.
  bestTimeOfDay: text("best_time_of_day"),
  bestSeasonToVisit: text("best_season_to_visit"),
  weatherConsiderations: text("weather_considerations"),

  // Access information
  accessibilityLevel: viewPointAccessibilityLevelEnum("accessibility_level"),
  hikingTimeMinutes: integer("hiking_time_minutes"),
  trailCondition: text("trail_condition"),
  trailLength: decimal("trail_length_km", { precision: 6, scale: 2 }),
  verticalClimbM: decimal("vertical_climb_m", { precision: 6, scale: 1 }),
  requiredFitness: text("required_fitness"),
  isSuiteForChildren: boolean("is_suite_for_children").default(true),
  isSuitableForElderly: boolean("is_suitable_for_elderly").default(false),
  accessRestrictions: text("access_restrictions"),
  permitRequired: boolean("permit_required").default(false),
  permitDetails: text("permit_details"),

  // Facilities and infrastructure
  hasPlatform: boolean("has_platform").default(false),
  platformMaterial: text("platform_material"),
  platformCondition: text("platform_condition"),
  platformCapacity: integer("platform_capacity"),
  hasRailings: boolean("has_railings").default(false),
  hasSeating: boolean("has_seating").default(false),
  seatingCapacity: integer("seating_capacity"),
  hasShelter: boolean("has_shelter").default(false),
  shelterDetails: text("shelter_details"),
  hasBinoculars: boolean("has_binoculars").default(false),
  hasCoinOperatedBinoculars: boolean("has_coin_operated_binoculars").default(
    false,
  ),
  hasInformationalSigns: boolean("has_informational_signs").default(false),
  hasDirectionalMarkers: boolean("has_directional_markers").default(false),
  hasInterpretationPanels: boolean("has_interpretation_panels").default(false),
  hasFlagpole: boolean("has_flagpole").default(false),
  hasLighting: boolean("has_lighting").default(false),

  // Additional facilities
  hasRestrooms: boolean("has_restrooms").default(false),
  hasTrashBins: boolean("has_trash_bins").default(false),
  hasFoodStalls: boolean("has_food_stalls").default(false),
  foodStallCount: integer("food_stall_count"),
  hasSouvenirShops: boolean("has_souvenir_shops").default(false),
  souvenirShopCount: integer("souvenir_shop_count"),
  hasParkingArea: boolean("has_parking_area").default(false),
  parkingCapacity: integer("parking_capacity"),
  hasCampingFacilities: boolean("has_camping_facilities").default(false),
  campingDetails: text("camping_details"),

  // Visitor information
  estimatedVisitorsDaily: integer("estimated_visitors_daily"),
  peakVisitationTimes: text("peak_visitation_times"),
  entranceFeeNPR: decimal("entrance_fee_npr", { precision: 10, scale: 2 }),
  foreignerEntranceFeeNPR: decimal("foreigner_entrance_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  operatingHoursStart: time("operating_hours_start"),
  operatingHoursEnd: time("operating_hours_end"),
  isOpen24Hours: boolean("is_open_24_hours").default(false),
  isSeasonal: boolean("is_seasonal").default(false),
  seasonalDetails: text("seasonal_details"),

  // Cultural and historical significance
  culturalSignificance: text("cultural_significance"),
  historicalEvents: text("historical_events"),
  religiousSignificance: text("religious_significance"),
  associatedTemples: text("associated_temples"),
  traditionalUses: text("traditional_uses"),
  localFestivals: text("local_festivals"),

  // Tourism aspects
  tourismPotential: viewpointTourismPotentialEnum("tourism_potential"),
  photographyValue: text("photography_value"),
  tourPackagesAvailable: boolean("tour_packages_available").default(false),
  tourPackageDetails: text("tour_package_details"),
  guideServicesAvailable: boolean("guide_services_available").default(false),
  guideServiceDetails: text("guide_service_details"),
  developmentStatus: developmentStatusEnum("development_status"),

  // Management
  managingAuthority: text("managing_authority"),
  maintenanceResponsibility: text("maintenance_responsibility"),
  lastRenovationYear: integer("last_renovation_year"),
  developmentPlans: text("development_plans"),
  communityInvolvement: text("community_involvement"),
  fundingSources: text("funding_sources"),

  // Environmental aspects
  environmentalConcerns: text("environmental_concerns"),
  erosionRisk: text("erosion_risk"),
  wasteManagementSystem: text("waste_management_system"),
  vegetationManagement: text("vegetation_management"),
  surroundingEcosystem: text("surrounding_ecosystem"),

  // Safety aspects
  safetyMeasures: text("safety_measures"),
  knownHazards: text("known_hazards"),
  warningSignsPosted: boolean("warning_signs_posted").default(false),
  hasAccidentHistory: boolean("has_accident_history").default(false),
  accidentHistoryDetails: text("accident_history_details"),
  emergencyContactInfo: text("emergency_contact_info"),
  cellPhoneReception: text("cell_phone_reception"),

  // Transportation options
  publicTransportAvailable: boolean("public_transport_available").default(
    false,
  ),
  publicTransportDetails: text("public_transport_details"),
  nearestBusStopKm: decimal("nearest_bus_stop_km", { precision: 6, scale: 2 }),
  taxiAccessible: boolean("taxi_accessible").default(false),
  recommendedTransportation: text("recommended_transportation"),

  // Nearby services
  nearestFoodServiceKm: decimal("nearest_food_service_km", {
    precision: 6,
    scale: 2,
  }),
  nearestAccommodationKm: decimal("nearest_accommodation_km", {
    precision: 6,
    scale: 2,
  }),
  nearestMedicalServiceKm: decimal("nearest_medical_service_km", {
    precision: 6,
    scale: 2,
  }),
  nearbyAttractions: text("nearby_attractions"),
  suggestedItineraries: text("suggested_itineraries"),

  // Visitor experience
  averageTimeSpentMinutes: integer("average_time_spent_minutes"),
  bestSunriseTime: text("best_sunrise_time"),
  bestSunsetTime: text("best_sunset_time"),
  stargazingQuality: text("stargazing_quality"),
  bestPhotographySpots: text("best_photography_spots"),
  visitorReviews: text("visitor_reviews"),

  // Community benefits
  localEmploymentGenerated: integer("local_employment_generated"),
  benefitSharingMechanism: text("benefit_sharing_mechanism"),
  localBusinessOpportunities: text("local_business_opportunities"),

  // Activities
  availableActivities: text("available_activities"),
  hikingTrailsAvailable: boolean("hiking_trails_available").default(false),
  hikingTrailDetails: text("hiking_trail_details"),
  paraglideBaseAvailable: boolean("paraglide_base_available").default(false),

  // Contact information
  contactOffice: text("contact_office"),
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  websiteUrl: text("website_url"),

  // Social media and online presence
  facebookPage: text("facebook_page"),
  instagramHandle: text("instagram_handle"),
  tripAdvisorLink: text("trip_advisor_link"),
  googleMapsLink: text("google_maps_link"),

  // Media
  hasVirtualTour: boolean("has_virtual_tour").default(false),
  virtualTourLink: text("virtual_tour_link"),
  panoramicImagesAvailable: boolean("panoramic_images_available").default(
    false,
  ),

  // Development needs and challenges
  developmentNeeds: text("development_needs"),
  challengesFaced: text("challenges_faced"),
  visitorFeedbackSummary: text("visitor_feedback_summary"),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Linkages to other entities
  linkedTrails: jsonb("linked_trails").default(sql`'[]'::jsonb`),
  linkedAccommodations: jsonb("linked_accommodations").default(
    sql`'[]'::jsonb`,
  ),
  linkedRestaurants: jsonb("linked_restaurants").default(sql`'[]'::jsonb`),
  linkedTours: jsonb("linked_tours").default(sql`'[]'::jsonb`),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  viewsheds: geometry("viewsheds", { type: "MultiPolygon" }),
  accessRoutes: geometry("access_routes", { type: "MultiLineString" }),
  platformArea: geometry("platform_area", { type: "Polygon" }),

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

export type Viewpoint = typeof viewpoint.$inferSelect;
export type NewViewpoint = typeof viewpoint.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
