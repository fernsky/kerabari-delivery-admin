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
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../../geographical";
import { waterQualityEnum } from "../../common";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define lake/wetland type enum
export const lakeWetlandTypeEnum = pgEnum("lake_wetland_type", [
  "NATURAL_LAKE",
  "ARTIFICIAL_LAKE",
  "RESERVOIR",
  "POND",
  "WETLAND",
  "MARSH",
  "SWAMP",
  "RIVER_OXBOW",
  "FLOODPLAIN",
  "WATER_STORAGE_AREA",
  "OTHER",
]);

// Define water source enum
export const wetlandWaterSourceEnum = pgEnum("wetland_water_source", [
  "RIVER_FED",
  "SPRING_FED",
  "RAIN_FED",
  "GROUNDWATER_FED",
  "GLACIER_FED",
  "RIVER_DIVERSION",
  "CANAL_FED",
  "MIXED_SOURCE",
  "UNKNOWN",
]);

// Define conservation status enum
export const conservationStatusEnum = pgEnum("conservation_status", [
  "PROTECTED",
  "RAMSAR_SITE",
  "CONSERVATION_AREA",
  "BUFFER_ZONE",
  "COMMUNITY_MANAGED",
  "GOVERNMENT_MANAGED",
  "UNPROTECTED",
  "THREATENED",
  "ENDANGERED",
]);

// Define tourism potential enum
export const tourismPotentialEnum = pgEnum("tourism_potential", [
  "HIGH",
  "MEDIUM",
  "LOW",
  "UNDEVELOPED",
  "OVERDEVELOPED",
]);

// Lake and wetland table
export const lakeWetland = pgTable("lake_wetland", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  localName: text("local_name"),
  description: text("description"),
  type: lakeWetlandTypeEnum("type").notNull(),

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
  areaSqKm: decimal("area_sq_km", { precision: 10, scale: 4 }),
  maximumDepthM: decimal("maximum_depth_m", { precision: 6, scale: 2 }),
  averageDepthM: decimal("average_depth_m", { precision: 6, scale: 2 }),
  shorelineKm: decimal("shoreline_km", { precision: 6, scale: 2 }),
  elevationM: decimal("elevation_m", { precision: 6, scale: 1 }),
  waterSource: wetlandWaterSourceEnum("water_source"),
  waterColor: text("water_color"),
  waterQuality: waterQualityEnum("water_quality"),
  waterQualityDetails: text("water_quality_details"),
  isSeasonal: boolean("is_seasonal").default(false),
  seasonalDetails: text("seasonal_details"),
  waterLevelFluctuation: text("water_level_fluctuation"),
  bottomType: text("bottom_type"), // Muddy, rocky, sandy, etc.
  surroundingLandscape: text("surrounding_landscape"),

  // Ecological information
  majorFloraSpecies: text("major_flora_species"),
  majorFaunaSpecies: text("major_fauna_species"),
  birdSpecies: text("bird_species"),
  fishSpecies: text("fish_species"),
  importantHabitats: text("important_habitats"),
  invasiveSpecies: text("invasive_species"),
  ecologicalSignificance: text("ecological_significance"),
  conservationStatus: conservationStatusEnum("conservation_status"),
  protectedSince: date("protected_since"),
  managingAuthority: text("managing_authority"),
  conservationEfforts: text("conservation_efforts"),
  environmentalThreats: text("environmental_threats"),
  pollutionSources: text("pollution_sources"),

  // Cultural and historical significance
  culturalSignificance: text("cultural_significance"),
  historicalInformation: text("historical_information"),
  religiousSignificance: text("religious_significance"),
  associatedTemples: text("associated_temples"),
  localMyths: text("local_myths"),
  traditionalUses: text("traditional_uses"),
  localFestivals: text("local_festivals"),

  // Economic and utility aspects
  economicImportance: text("economic_importance"),
  fishingStatus: text("fishing_status"),
  irrigationUse: text("irrigation_use"),
  waterSupplyUse: text("water_supply_use"),
  hydroelectricUse: text("hydroelectric_use"),
  agriculturalUse: text("agricultural_use"),
  livestockUse: text("livestock_use"),

  // Tourism and recreation
  tourismStatus: text("tourism_status"),
  tourismPotential: tourismPotentialEnum("tourism_potential"),
  visitorCount: integer("visitor_count"),
  visitationPattern: text("visitation_pattern"), // Seasonal, year-round, etc.
  peakSeasonMonths: text("peak_season_months"),
  bestTimeToVisit: text("best_time_to_visit"),
  entranceFeeNPR: decimal("entrance_fee_npr", { precision: 10, scale: 2 }),
  foreignerEntranceFeeNPR: decimal("foreigner_entrance_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  operatingHours: text("operating_hours"),

  // Recreational activities
  allowsBoating: boolean("allows_boating").default(false),
  boatingFacilities: text("boating_facilities"),
  boatTypesAvailable: text("boat_types_available"),
  boatRentalCostNPR: decimal("boat_rental_cost_npr", {
    precision: 10,
    scale: 2,
  }),
  allowsFishing: boolean("allows_fishing").default(false),
  fishingPermitRequired: boolean("fishing_permit_required").default(false),
  fishingPermitCostNPR: decimal("fishing_permit_cost_npr", {
    precision: 10,
    scale: 2,
  }),
  allowsSwimming: boolean("allows_swimming").default(false),
  swimmingriskLevel: text("swimming_risk_level"),
  hasBirdwatching: boolean("has_birdwatching").default(false),
  birdwatchingSpots: text("birdwatching_spots"),
  allowsCamping: boolean("allows_camping").default(false),
  campingFacilities: text("camping_facilities"),
  hasWalkingTrails: boolean("has_walking_trails").default(false),
  walkingTrailsDetails: text("walking_trails_details"),
  otherRecreationalActivities: text("other_recreational_activities"),

  // Infrastructure and facilities
  hasViewingDeck: boolean("has_viewing_deck").default(false),
  hasPicnicAreas: boolean("has_picnic_areas").default(false),
  picnicFacilities: text("picnic_facilities"),
  hasRestaurants: boolean("has_restaurants").default(false),
  restaurantCount: integer("restaurant_count"),
  foodOptions: text("food_options"),
  hasAccommodation: boolean("has_accommodation").default(false),
  accommodationDetails: text("accommodation_details"),
  hasToilets: boolean("has_toilets").default(false),
  hasChangingRooms: boolean("has_changing_rooms").default(false),
  hasParking: boolean("has_parking").default(false),
  parkingCapacity: integer("parking_capacity"),
  hasPublicTransport: boolean("has_public_transport").default(false),
  publicTransportDetails: text("public_transport_details"),
  hasInformationCenter: boolean("has_information_center").default(false),
  hasSignage: boolean("has_signage").default(false),
  hasSouvenirsShops: boolean("has_souvenirs_shops").default(false),
  accessibilityForDisabled: text("accessibility_for_disabled"),

  // Safety aspects
  safetyMeasures: text("safety_measures"),
  rescueFacilities: text("rescue_facilities"),
  warningSignsPosted: boolean("warning_signs_posted").default(false),
  lifeGuardsAvailable: boolean("life_guards_available").default(false),
  lifeguardCount: integer("lifeguard_count"),
  safetyEquipment: text("safety_equipment"),
  emergencyContactInfo: text("emergency_contact_info"),
  recordedAccidents: text("recorded_accidents"),

  // Management and conservation
  managementPlan: text("management_plan"),
  managementChallenges: text("management_challenges"),
  communityInvolvement: text("community_involvement"),
  ngosInvolved: text("ngos_involved"),
  restorationProjects: text("restoration_projects"),
  developmentPlans: text("development_plans"),
  fundingSources: text("funding_sources"),

  // Environmental monitoring
  waterQualityMonitoring: boolean("water_quality_monitoring").default(false),
  monitoringFrequency: text("monitoring_frequency"),
  monitoringAuthority: text("monitoring_authority"),
  recentFindings: text("recent_findings"),
  biodiversityAssessments: text("biodiversity_assessments"),

  // Community benefits
  localEmploymentGenerated: integer("local_employment_generated"),
  benefitSharingMechanism: text("benefit_sharing_mechanism"),
  localBusinessOpportunities: text("local_business_opportunities"),
  communityPerceptions: text("community_perceptions"),

  // Sustainability and challenges
  environmentalChallenges: text("environmental_challenges"),
  sustainabilityMeasures: text("sustainability_measures"),
  climateChangeImpacts: text("climate_change_impacts"),
  wasteManagementSystem: text("waste_management_system"),
  visitorImpacts: text("visitor_impacts"),

  // Contact information
  contactOffice: text("contact_office"),
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  websiteUrl: text("website_url"),

  // Social media and online presence
  facebookPage: text("facebook_page"),
  instagramHandle: text("instagram_handle"),
  twitterHandle: text("twitter_handle"),
  youtubeChannel: text("youtube_channel"),
  tripAdvisorLink: text("trip_advisor_link"),
  googleMapsLink: text("google_maps_link"),

  // Media
  hasVirtualTour: boolean("has_virtual_tour").default(false),
  virtualTourLink: text("virtual_tour_link"),
  documentaryLinks: text("documentary_links"),

  // Research information
  researchConducted: boolean("research_conducted").default(false),
  researchTopics: text("research_topics"),
  publishedPapers: text("published_papers"),
  researchInstitutionsInvolved: text("research_institutions_involved"),

  // Nearby attractions
  nearbyAttractions: text("nearby_attractions"),
  suggestedItineraries: text("suggested_itineraries"),
  distanceToNearestTouristSpotKm: decimal(
    "distance_to_nearest_tourist_spot_km",
    {
      precision: 6,
      scale: 2,
    },
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Linkages to other entities
  linkedParks: jsonb("linked_parks").default(sql`'[]'::jsonb`),
  linkedRestaurants: jsonb("linked_restaurants").default(sql`'[]'::jsonb`),
  linkedAccommodations: jsonb("linked_accommodations").default(
    sql`'[]'::jsonb`,
  ),
  linkedTours: jsonb("linked_tours").default(sql`'[]'::jsonb`),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  waterBodyArea: geometry("water_body_area", { type: "Polygon" }),
  catchmentArea: geometry("catchment_area", { type: "Polygon" }),
  accessRoads: geometry("access_roads", { type: "MultiLineString" }),

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

export type LakeWetland = typeof lakeWetland.$inferSelect;
export type NewLakeWetland = typeof lakeWetland.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
