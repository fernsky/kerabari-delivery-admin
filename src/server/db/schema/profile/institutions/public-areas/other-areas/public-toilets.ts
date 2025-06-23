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

// Define public toilet type enum
export const publicToiletTypeEnum = pgEnum("public_toilet_type", [
  "PERMANENT_FACILITY",
  "PORTABLE_FACILITY",
  "MOBILE_FACILITY",
  "URINALS_ONLY",
  "FULL_SERVICE",
  "PAY_AND_USE",
  "FREE_FACILITY",
  "ECO_TOILET",
  "BIODIGESTER_TOILET",
  "DISABILITY_FRIENDLY",
  "SMART_TOILET",
  "OTHER",
]);

// Define cleanliness level enum
export const cleanlinessLevelEnum = pgEnum("cleanliness_level", [
  "EXCELLENT",
  "GOOD",
  "SATISFACTORY",
  "NEEDS_IMPROVEMENT",
  "POOR",
]);

// Define management type enum
export const toiletManagementTypeEnum = pgEnum("toilet_management_type", [
  "GOVERNMENT_MANAGED",
  "MUNICIPALITY_MANAGED",
  "COMMUNITY_MANAGED",
  "PRIVATE_OPERATED",
  "PUBLIC_PRIVATE_PARTNERSHIP",
  "NGO_MANAGED",
  "USER_COMMITTEE_MANAGED",
  "OTHER",
]);

// Define usage frequency enum
export const toiletUsageFrequencyEnum = pgEnum("toilet_usage_frequency", [
  "VERY_HIGH", // >200 users daily
  "HIGH", // 100-200 users daily
  "MEDIUM", // 50-100 users daily
  "LOW", // 10-50 users daily
  "VERY_LOW", // <10 users daily
  "SEASONAL", // Usage varies by season
]);

// Define sewage management system enum
export const sewageManagementSystemEnum = pgEnum("sewage_management_system", [
  "CENTRALIZED_SEWERAGE",
  "SEPTIC_TANK",
  "BIODIGESTER",
  "COMPOSTING_SYSTEM",
  "ECOLOGICAL_SANITATION",
  "CONVENTIONAL_PIT_LATRINE",
  "POUR_FLUSH_TOILET",
  "CONNECTION_TO_TREATMENT_PLANT",
  "OTHER",
]);

// Public Toilet table
export const publicToilet = pgTable("public_toilet", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  toiletType: publicToiletTypeEnum("toilet_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  landmark: text("landmark"), // Nearby landmark for easy identification
  locationType: text("location_type"), // Bus stand, market, park, etc.

  // Basic information
  establishedYear: integer("established_year"),
  managementType: toiletManagementTypeEnum("management_type").notNull(),
  managingBody: text("managing_body"), // Name of the committee/organization managing

  // Physical infrastructure
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
  buildingCondition: buildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),

  // Toilet facilities
  maleSectionAvailable: boolean("male_section_available").default(true),
  femaleSectionAvailable: boolean("female_section_available").default(true),
  thirdGenderSectionAvailable: boolean(
    "third_gender_section_available",
  ).default(false),
  genderNeutralAvailable: boolean("gender_neutral_available").default(false),

  // Toilet counts
  maleToiletCount: integer("male_toilet_count"),
  femaleToiletCount: integer("female_toilet_count"),
  urinalCount: integer("urinal_count"),
  handicapAccessibleToiletCount: integer("handicap_accessible_toilet_count"),
  familyToiletCount: integer("family_toilet_count"),
  childrenToiletCount: integer("children_toilet_count"),

  // Additional facilities
  hasSinks: boolean("has_sinks").default(true),
  sinkCount: integer("sink_count"),
  hasHandDryers: boolean("has_hand_dryers").default(false),
  handDryerCount: integer("hand_dryer_count"),
  hasMirrors: boolean("has_mirrors").default(false),
  mirrorCount: integer("mirror_count"),
  hasBabyChangingStation: boolean("has_baby_changing_station").default(false),
  babyChangingStationCount: integer("baby_changing_station_count"),
  hasShowers: boolean("has_showers").default(false),
  showerCount: integer("shower_count"),
  hasSanitaryNapkinVendingMachine: boolean(
    "has_sanitary_napkin_vending_machine",
  ).default(false),
  hasSanitaryNapkinDisposal: boolean("has_sanitary_napkin_disposal").default(
    false,
  ),
  hasToiletPaperDispenser: boolean("has_toilet_paper_dispenser").default(false),
  hasSoapDispenser: boolean("has_soap_dispenser").default(false),

  // Water and sanitation
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterSupplyType: text("water_supply_type"), // Municipal, tanker, well, etc.
  waterStorageFacility: boolean("water_storage_facility").default(false),
  waterStorageCapacityLiters: integer("water_storage_capacity_liters"),
  sewageManagementSystem: sewageManagementSystemEnum(
    "sewage_management_system",
  ),
  septicTankCleaningFrequency: text("septic_tank_cleaning_frequency"),
  lastSepticTankCleaningDate: date("last_septic_tank_cleaning_date"),

  // Utilities
  hasElectricity: boolean("has_electricity").default(true),
  hasProperLighting: boolean("has_proper_lighting").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  hasProperVentilation: boolean("has_proper_ventilation").default(true),
  hasWasteManagementSystem: boolean("has_waste_management_system").default(
    true,
  ),
  wasteManagementDetails: text("waste_management_details"),

  // Usage and operations
  operatingHours: text("operating_hours"),
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  is24Hours: boolean("is_24_hours").default(false),
  usageFrequency: toiletUsageFrequencyEnum("usage_frequency"),
  averageDailyUsers: integer("average_daily_users"),

  // Accessibility
  accessibilityLevel: accessibilityLevelEnum("accessibility_level"),
  hasRamp: boolean("has_ramp").default(false),
  hasWheelchairAccess: boolean("has_wheelchair_access").default(false),
  hasHandrails: boolean("has_handrails").default(false),
  hasWideEntranceDoors: boolean("has_wide_entrance_doors").default(false),
  hasAdequateManeuveringSpace: boolean(
    "has_adequate_maneuvering_space",
  ).default(false),
  hasVisualSignage: boolean("has_visual_signage").default(false),
  hasBrailleSignage: boolean("has_braille_signage").default(false),
  distanceFromMainRoadMeters: integer("distance_from_main_road_meters"),

  // Fees and financial aspects
  hasUsageFee: boolean("has_usage_fee").default(false),
  usageFeeNPR: decimal("usage_fee_npr", { precision: 10, scale: 2 }),
  feeDifferentiatedByGender: boolean("fee_differentiated_by_gender").default(
    false,
  ),
  feeCollectionMethod: text("fee_collection_method"),
  monthlyMaintenanceCostNPR: decimal("monthly_maintenance_cost_npr", {
    precision: 10,
    scale: 2,
  }),
  annualOperatingCostNPR: decimal("annual_operating_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  fundingSource: text("funding_source"),
  isFinanciallySustainable: boolean("is_financially_sustainable").default(
    false,
  ),

  // Maintenance and cleaning
  dailyCleaningFrequency: integer("daily_cleaning_frequency"),
  cleaningSchedule: text("cleaning_schedule"),
  hasCleaningStaff: boolean("has_cleaning_staff").default(false),
  cleaningStaffCount: integer("cleaning_staff_count"),
  cleanlinessLevel: cleanlinessLevelEnum("cleanliness_level"),
  maintenanceResponsibility: text("maintenance_responsibility"),
  hasComplaintSystem: boolean("has_complaint_system").default(false),
  complaintResolutionProcess: text("complaint_resolution_process"),

  // Safety and security
  hasCaretaker: boolean("has_caretaker").default(false),
  caretakerPresenceHours: text("caretaker_presence_hours"),
  securityMeasures: text("security_measures"),
  hasDedicatedSecurity: boolean("has_dedicated_security").default(false),
  hasErgencyLight: boolean("has_emergency_light").default(false),
  hasEmergencyContact: boolean("has_emergency_contact").default(false),
  emergencyContactDetails: text("emergency_contact_details"),
  hasFirstAidKit: boolean("has_first_aid_kit").default(false),

  // Hygiene promotion
  hasHandwashingInstructions: boolean("has_handwashing_instructions").default(
    false,
  ),
  hasHygienePromotionMaterials: boolean(
    "has_hygiene_promotion_materials",
  ).default(false),
  conductAwarenessPrograms: boolean("conduct_awareness_programs").default(
    false,
  ),
  awarenessFrequency: text("awareness_frequency"),

  // Environmental aspects
  hasEcoFriendlyFeatures: boolean("has_eco_friendly_features").default(false),
  ecoFriendlyFeatureDetails: text("eco_friendly_feature_details"),
  hasWaterConservationMeasures: boolean(
    "has_water_conservation_measures",
  ).default(false),
  waterConservationDetails: text("water_conservation_details"),

  // Challenges and needs
  infrastructureChallenges: text("infrastructure_challenges"),
  maintenanceChallenges: text("maintenance_challenges"),
  userBehaviorChallenges: text("user_behavior_challenges"),
  financialChallenges: text("financial_challenges"),
  futureImprovementPlans: text("future_improvement_plans"),
  necessaryUpgrades: text("necessary_upgrades"),

  // Community involvement
  communitySensitizationEfforts: text("community_sensitization_efforts"),
  feedbackMechanism: text("feedback_mechanism"),
  userSatisfactionLevel: text("user_satisfaction_level"),
  communityContribution: text("community_contribution"),

  // Contact information
  contactPersonName: text("contact_person_name"),
  contactPersonDesignation: text("contact_person_designation"),
  contactPhone: text("contact_phone"),
  alternateContactPhone: text("alternate_contact_phone"),

  // Linkages to other entities
  linkedRoads: jsonb("linked_roads").default(sql`'[]'::jsonb`),
  linkedPublicSpaces: jsonb("linked_public_spaces").default(sql`'[]'::jsonb`),
  linkedBusStands: jsonb("linked_bus_stands").default(sql`'[]'::jsonb`),
  linkedMarkets: jsonb("linked_markets").default(sql`'[]'::jsonb`),
  linkedParkingAreas: jsonb("linked_parking_areas").default(sql`'[]'::jsonb`),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),

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

export type PublicToilet = typeof publicToilet.$inferSelect;
export type NewPublicToilet = typeof publicToilet.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
