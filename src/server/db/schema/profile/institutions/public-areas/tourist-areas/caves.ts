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

// Cave specific enums
export const caveTypeEnum = pgEnum("cave_type", [
  "LIMESTONE_CAVE",
  "LAVA_TUBE",
  "SANDSTONE_CAVE",
  "ICE_CAVE",
  "ROCK_SHELTER",
  "SEA_CAVE",
  "SOLUTION_CAVE",
  "TECTONIC_CAVE",
  "TALUS_CAVE",
  "EROSION_CAVE",
  "OTHER",
]);

export const difficultyLevelEnum = pgEnum("difficulty_level", [
  "EASY",
  "MODERATE",
  "CHALLENGING",
  "DIFFICULT",
  "EXPERT_ONLY",
  "VARIABLE",
]);

// Cave table
export const cave = pgTable("cave", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  nameInLocalLanguage: text("name_in_local_language"),
  description: text("description"),
  caveType: caveTypeEnum("cave_type").notNull(),

  // Basic information
  discoveredYear: integer("discovered_year"),
  geologicalFormation: text("geological_formation"),
  geologicalAgeEstimate: text("geological_age_estimate"),
  ownership: attractionOwnershipEnum("ownership").notNull(),
  managingAuthority: text("managing_authority"),
  status: attractionStatusEnum("status").notNull(),

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
  hikingTimeMinutes: integer("hiking_time_minutes"),

  // Operating information
  isOpen: boolean("is_open").default(true),
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  openingDays: text("opening_days"), // e.g., "Sunday-Friday"
  isOpenAllYear: boolean("is_open_all_year").default(true),
  seasonalAvailability: tourismSeasonEnum("seasonal_availability"),
  seasonalOpeningDetails: text("seasonal_opening_details"),

  // Physical characteristics
  totalLengthMeters: decimal("total_length_meters", { precision: 9, scale: 2 }),
  maxWidthMeters: decimal("max_width_meters", { precision: 7, scale: 2 }),
  maxHeightMeters: decimal("max_height_meters", { precision: 7, scale: 2 }),
  verticalExtentMeters: decimal("vertical_extent_meters", {
    precision: 7,
    scale: 2,
  }),
  numberOfChambers: integer("number_of_chambers"),
  numberOfLevels: integer("number_of_levels"),
  hasUndergroundRiver: boolean("has_underground_river").default(false),
  hasUndergroundLake: boolean("has_underground_lake").default(false),
  waterFeatureDetails: text("water_feature_details"),

  // Cave features
  hasStalactites: boolean("has_stalactites").default(false),
  hasStalagmites: boolean("has_stalagmites").default(false),
  hasColumns: boolean("has_columns").default(false),
  hasFlowstone: boolean("has_flowstone").default(false),
  hasHelictites: boolean("has_helictites").default(false),
  hasCrystals: boolean("has_crystals").default(false),
  geologicalFeatures: text("geological_features"),
  mineralDeposits: text("mineral_deposits"),
  uniqueFormations: text("unique_formations"),

  // Biology
  hasBats: boolean("has_bats").default(false),
  batSpecies: text("bat_species"),
  batColonySize: text("bat_colony_size"),
  cavernicolousSpecies: text("cavernicolous_species"), // Cave-dwelling species
  biologicalSignificance: text("biological_significance"),

  // Archaeological and cultural significance
  hasArchaeologicalFinds: boolean("has_archaeological_finds").default(false),
  archaeologicalDetails: text("archaeological_details"),
  hasRockArt: boolean("has_rock_art").default(false),
  rockArtDetails: text("rock_art_details"),
  culturalSignificance: text("cultural_significance"),
  traditionalBeliefs: text("traditional_beliefs"),
  historicalContext: text("historical_context"),

  // Access and exploration
  difficultyLevel: difficultyLevelEnum("difficulty_level"),
  requiresTour: boolean("requires_tour").default(false),
  requiresPermission: boolean("requires_permission").default(false),
  permissionDetails: text("permission_details"),
  requiredEquipment: text("required_equipment"),
  recommendedExperienceLevel: text("recommended_experience_level"),
  guidesAvailable: boolean("guides_available").default(false),
  guideContactDetails: text("guide_contact_details"),
  tourDurationMinutes: integer("tour_duration_minutes"),

  // Fees and pricing
  entranceFeeType: entranceFeeTypeEnum("entrance_fee_type").notNull(),
  adultFeeNPR: decimal("adult_fee_npr", { precision: 10, scale: 2 }),
  childFeeNPR: decimal("child_fee_npr", { precision: 10, scale: 2 }),
  foreignerFeeNPR: decimal("foreigner_fee_npr", { precision: 10, scale: 2 }),
  guideFeesNPR: decimal("guide_fees_npr", { precision: 10, scale: 2 }),
  equipmentRentalFeesNPR: decimal("equipment_rental_fees_npr", {
    precision: 10,
    scale: 2,
  }),

  // Amenities and facilities
  hasLighting: boolean("has_lighting").default(false),
  lightingDetails: text("lighting_details"),
  hasWalkways: boolean("has_walkways").default(false),
  walkwayDetails: text("walkway_details"),
  hasHandrails: boolean("has_handrails").default(false),
  hasVisitorCenter: boolean("has_visitor_center").default(false),
  visitorCenterDetails: text("visitor_center_details"),
  hasInterpretiveDisplays: boolean("has_interpretive_displays").default(false),
  hasToilets: boolean("has_toilets").default(false),
  hasParking: boolean("has_parking").default(false),
  parkingCapacity: integer("parking_capacity"),
  foodAvailable: boolean("food_available").default(false),
  foodDetails: text("food_details"),

  // Safety and conditions
  safetyPrecautions: text("safety_precautions"),
  safetyEquipmentProvided: text("safety_equipment_provided"),
  safetyIncidents: text("safety_incidents"),
  rescueProtocolsExist: boolean("rescue_protocols_exist").default(false),
  rescueContactDetails: text("rescue_contact_details"),
  temperatureRangeCelsius: text("temperature_range_celsius"),
  humidityPercentage: integer("humidity_percentage"),
  airQualityConcerns: text("air_quality_concerns"),
  floodRisk: text("flood_risk"),
  rockfallRisk: text("rockfall_risk"),

  // Visitor information
  averageDailyVisitors: integer("average_daily_visitors"),
  peakDailyVisitors: integer("peak_daily_visitors"),
  annualVisitorCount: integer("annual_visitor_count"),
  visitorSatisfactionLevel: visitorExperienceLevelEnum(
    "visitor_satisfaction_level",
  ),
  crowdLevel: attractionCrowdLevelEnum("crowd_level"),
  bestTimeToVisit: text("best_time_to_visit"),

  // Conservation status
  isProtected: boolean("is_protected").default(false),
  protectionStatus: text("protection_status"),
  conservationChallenges: text("conservation_challenges"),
  visitorImpacts: text("visitor_impacts"),
  conservationMeasures: text("conservation_measures"),
  restorationEfforts: text("restoration_efforts"),

  // Research and education
  scientificStudies: text("scientific_studies"),
  researchPermitRequired: boolean("research_permit_required").default(false),
  educationalValue: text("educational_value"),
  hasEducationalPrograms: boolean("has_educational_programs").default(false),
  educationalProgramDetails: text("educational_program_details"),

  // Management and maintenance
  maintenanceSchedule: text("maintenance_schedule"),
  maintenanceStatus: maintenanceStatusEnum("maintenance_status"),
  monitoringPrograms: text("monitoring_programs"),
  staffCount: integer("staff_count"),
  managementChallenges: text("management_challenges"),

  // Development plans
  plannedImprovements: text("planned_improvements"),
  developmentProjects: text("development_projects"),
  estimatedDevelopmentCostNPR: decimal("estimated_development_cost_npr", {
    precision: 18,
    scale: 2,
  }),

  // Contact information
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),

  // Multimedia and documentation
  hasMap: boolean("has_map").default(false),
  has3DModel: boolean("has_3d_model").default(false),
  documentationQuality: text("documentation_quality"),

  // Linkages to other entities
  linkedNearbyAttractions: jsonb("linked_nearby_attractions").default(
    sql`'[]'::jsonb`,
  ),
  linkedAccommodations: jsonb("linked_accommodations").default(
    sql`'[]'::jsonb`,
  ),
  linkedTourOperators: jsonb("linked_tour_operators").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  entrancePoint: geometry("entrance_point", { type: "Point" }),
  approximateCaveExtent: geometry("approximate_cave_extent", {
    type: "Polygon",
  }),
  accessTrail: geometry("access_trail", { type: "LineString" }),

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

export type Cave = typeof cave.$inferSelect;
export type NewCave = typeof cave.$inferInsert;
