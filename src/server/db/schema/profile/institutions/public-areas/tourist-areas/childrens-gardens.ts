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

// Children's garden specific enums
export const childrenGardenTypeEnum = pgEnum("children_garden_type", [
  "ADVENTURE_PLAYGROUND",
  "EDUCATIONAL_GARDEN",
  "SENSORY_GARDEN",
  "NATURE_PLAYGROUND",
  "THEMED_GARDEN",
  "WATER_PLAY_GARDEN",
  "INCLUSIVE_PLAYGROUND",
  "COMMUNITY_GARDEN",
  "SCHOOL_GARDEN",
  "THERAPEUTIC_GARDEN",
  "MIXED_TYPE",
  "OTHER",
]);

export const playEquipmentSafetyLevelEnum = pgEnum(
  "play_equipment_safety_level",
  [
    "EXCELLENT",
    "GOOD",
    "ADEQUATE",
    "NEEDS_IMPROVEMENT",
    "POOR",
    "UNDER_REPAIR",
  ],
);

// Children's Garden table
export const childrensGarden = pgTable("childrens_garden", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  nameInLocalLanguage: text("name_in_local_language"),
  description: text("description"),
  gardenType: childrenGardenTypeEnum("garden_type").notNull(),

  // Basic information
  establishedYear: integer("established_year"),
  ownership: attractionOwnershipEnum("ownership").notNull(),
  managingAuthority: text("managing_authority"),
  status: attractionStatusEnum("status").notNull(),
  size: attractionSizeEnum("size"),
  areaInSquareMeters: decimal("area_in_square_meters", {
    precision: 10,
    scale: 2,
  }),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  latitude: decimal("latitude", { precision: 9, scale: 6 }),
  longitude: decimal("longitude", { precision: 9, scale: 6 }),
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
  seasonalOpeningDetails: text("seasonal_opening_details"),

  // Fees and access
  entranceFeeType: entranceFeeTypeEnum("entrance_fee_type").notNull(),
  childFeeNPR: decimal("child_fee_npr", { precision: 10, scale: 2 }),
  adultFeeNPR: decimal("adult_fee_npr", { precision: 10, scale: 2 }),
  groupDiscounts: boolean("group_discounts").default(false),
  discountDetails: text("discount_details"),

  // Target age groups
  suitableForAgeMin: integer("suitable_for_age_min"),
  suitableForAgeMax: integer("suitable_for_age_max"),
  separateToddlerArea: boolean("separate_toddler_area").default(false),
  toddlerAreaFacilities: text("toddler_area_facilities"),

  // Play equipment and facilities
  swingCount: integer("swing_count"),
  slideCount: integer("slide_count"),
  seesaw: integer("seesaw_count"),
  climbingStructures: integer("climbing_structures_count"),
  sandpitCount: integer("sandpit_count"),
  merry: integer("merry_go_round_count"),
  balanceEquipmentCount: integer("balance_equipment_count"),
  springRiderCount: integer("spring_rider_count"),
  waterPlayFeatures: boolean("water_play_features").default(false),
  waterPlayDetails: text("water_play_details"),
  hasThemeArea: boolean("has_themed_areas").default(false),
  themeAreaDetails: text("themed_area_details"),
  educationalElements: text("educational_elements"),
  artsAndCraftsArea: boolean("arts_and_crafts_area").default(false),
  indoorPlayArea: boolean("indoor_play_area").default(false),
  indoorPlayAreaSizeSquareMeters: decimal(
    "indoor_play_area_size_square_meters",
    { precision: 8, scale: 2 },
  ),

  // Sensory and educational features
  hasSensoryElements: boolean("has_sensory_elements").default(false),
  sensoryElementDetails: text("sensory_element_details"),
  hasMusicElements: boolean("has_music_elements").default(false),
  musicElementDetails: text("music_element_details"),
  hasGardeningArea: boolean("has_gardening_area").default(false),
  gardeningAreaDetails: text("gardening_area_details"),
  hasWildlifeHabitats: boolean("has_wildlife_habitats").default(false),
  wildlifeHabitatDetails: text("wildlife_habitat_details"),

  // Surface and safety
  groundSurfaceTypes: text("ground_surface_types"), // E.g., "Rubber, Sand, Grass"
  fallAttenuationSurface: boolean("fall_attenuation_surface").default(false),
  fallSurfaceDetails: text("fall_surface_details"),
  equipmentSafetyLevel: playEquipmentSafetyLevelEnum("equipment_safety_level"),
  lastSafetyInspectionDate: timestamp("last_safety_inspection_date"),
  inspectionFrequency: text("inspection_frequency"),
  childrenSafetyFeatures: text("children_safety_features"),
  isFullyFenced: boolean("is_fully_fenced").default(false),
  gateDetails: text("gate_details"),

  // Inclusive design
  isWheelchairAccessible: boolean("is_wheelchair_accessible").default(false),
  hasAccessiblePlayEquipment: boolean("has_accessible_play_equipment").default(
    false,
  ),
  accessibleEquipmentDetails: text("accessible_equipment_details"),
  hasSpecialNeedsAccommodations: boolean(
    "has_special_needs_accommodations",
  ).default(false),
  specialNeedsDetails: text("special_needs_details"),

  // Amenities for children and guardians
  hasShadeStructures: boolean("has_shade_structures").default(false),
  shadeStructureCount: integer("shade_structure_count"),
  hasToilets: boolean("has_toilets").default(false),
  hasChildSizedToilets: boolean("has_child_sized_toilets").default(false),
  hasChangingTables: boolean("has_changing_tables").default(false),
  hasDrinkingWater: boolean("has_drinking_water").default(false),
  hasHandwashingStations: boolean("has_handwashing_stations").default(false),
  hasSeatingForAdults: boolean("has_seating_for_adults").default(false),
  seatingCapacity: integer("seating_capacity"),
  hasPicnicTables: boolean("has_picnic_tables").default(false),
  picnicTableCount: integer("picnic_table_count"),
  hasCafeteria: boolean("has_cafeteria").default(false),
  hasSnackVending: boolean("has_snack_vending").default(false),

  // Transportation and accessibility
  hasParkingFacility: boolean("has_parking_facility").default(false),
  carParkingCapacity: integer("car_parking_capacity"),
  hasStrollerAccess: boolean("has_stroller_access").default(true),
  hasStrollerParking: boolean("has_stroller_parking").default(false),
  publicTransportNearby: boolean("public_transport_nearby").default(false),
  publicTransportDetails: text("public_transport_details"),

  // Usage and visitors
  averageDailyVisitors: integer("average_daily_visitors"),
  peakDailyVisitors: integer("peak_daily_visitors"),
  bustiestTimes: text("busiest_times"),
  visitorSatisfactionLevel: visitorExperienceLevelEnum(
    "visitor_satisfaction_level",
  ),
  crowdLevel: attractionCrowdLevelEnum("crowd_level"),

  // Programs and activities
  hasProgrammedActivities: boolean("has_programmed_activities").default(false),
  scheduledActivities: text("scheduled_activities"),
  hasEducationalPrograms: boolean("has_educational_programs").default(false),
  educationalProgramDetails: text("educational_program_details"),
  hasRegularEvents: boolean("has_regular_events").default(false),
  eventDetails: text("event_details"),

  // Staff and supervision
  hasStaffPresence: boolean("has_staff_presence").default(false),
  staffCount: integer("staff_count"),
  hasFirstAidTrained: boolean("has_first_aid_trained_staff").default(false),
  supervisoryExpectations: text("supervisory_expectations"), // E.g., "Adult supervision required"

  // Maintenance and cleanliness
  maintenanceFrequency: text("maintenance_frequency"),
  maintenanceStatus: maintenanceStatusEnum("maintenance_status"),
  cleaningFrequency: text("cleaning_frequency"),
  cleaningStatus: text("cleaning_status"),
  annualMaintenanceCostNPR: decimal("annual_maintenance_cost_npr", {
    precision: 14,
    scale: 2,
  }),

  // Environmental aspects
  treeCount: integer("tree_count"),
  hasShadeTree: boolean("has_shade_trees").default(false),
  flowerBedCount: integer("flower_bed_count"),
  plantSpecies: text("plant_species"),
  hasEnvironmentalEducation: boolean("has_environmental_education").default(
    false,
  ),
  environmentalEducationElements: text("environmental_education_elements"),

  // Community involvement
  communityDonations: boolean("community_donations").default(false),
  communityVolunteers: boolean("community_volunteers").default(false),
  communityProgramming: text("community_programming"),

  // Challenges and issues
  commonIssues: text("common_issues"),
  maintenanceChallenges: text("maintenance_challenges"),
  safetyIncidents: text("safety_incidents"),

  // Plans and improvements
  plannedUpgrades: text("planned_upgrades"),
  requestedImprovements: text("requested_improvements"),
  fundingNeeds: text("funding_needs"),

  // Contact information
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),

  // Linkages to other entities
  linkedSchools: jsonb("linked_schools").default(sql`'[]'::jsonb`),
  linkedParks: jsonb("linked_parks").default(sql`'[]'::jsonb`),
  linkedCommunityGroups: jsonb("linked_community_groups").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  gardenBoundary: geometry("garden_boundary", { type: "Polygon" }),
  playEquipmentLocations: geometry("play_equipment_locations", {
    type: "MultiPoint",
  }),
  paths: geometry("paths", { type: "MultiLineString" }),

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

export type ChildrensGarden = typeof childrensGarden.$inferSelect;
export type NewChildrensGarden = typeof childrensGarden.$inferInsert;
