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
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";
import {
  biodiversityLevelEnum,
  fireRiskLevelEnum,
  forestDensityEnum,
  topographyTypeEnum,
  ecosystemTypeEnum,
} from "./common";

// Define buffer zone type enum
export const bufferZoneTypeEnum = pgEnum("buffer_zone_type", [
  "NATIONAL_PARK_BUFFER_ZONE",
  "WILDLIFE_RESERVE_BUFFER_ZONE",
  "CONSERVATION_AREA_BUFFER_ZONE",
  "PROTECTED_FOREST_BUFFER_ZONE",
  "MIXED_USE_BUFFER_ZONE",
  "TRANSITION_ZONE",
  "OTHER",
]);

// Define buffer zone management enum
export const bufferZoneManagementEnum = pgEnum("buffer_zone_management", [
  "BUFFER_ZONE_MANAGEMENT_COMMITTEE",
  "COMMUNITY_FOREST_USER_GROUP",
  "PARK_ADMINISTRATION",
  "LOCAL_GOVERNMENT",
  "JOINT_MANAGEMENT",
  "OTHER",
]);

// Define land use type enum
export const landUseTypeEnum = pgEnum("land_use_type", [
  "SETTLEMENT",
  "AGRICULTURE",
  "FOREST",
  "GRAZING_LAND",
  "WETLAND",
  "BARREN_LAND",
  "MIXED_USE",
  "OTHER",
]);

// Buffer Zone table
export const bufferZone = pgTable("buffer_zone", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  bufferZoneType: bufferZoneTypeEnum("buffer_zone_type").notNull(),

  // Location and boundary details
  province: text("province"),
  district: text("district"),
  municipality: text("municipality"),
  wardNumbers: jsonb("ward_numbers").default(sql`'[]'::jsonb`),
  adjacentProtectedAreaId: varchar("adjacent_protected_area_id", {
    length: 36,
  }),
  adjacentProtectedAreaName: text("adjacent_protected_area_name"),
  totalAreaHectares: decimal("total_area_hectares", {
    precision: 12,
    scale: 2,
  }).notNull(),
  boundaryDescription: text("boundary_description"),
  isGpsMarked: boolean("is_gps_marked").default(false),
  hasDemarcationMarkers: boolean("has_demarcation_markers").default(false),

  // Administration and management
  establishmentYear: integer("establishment_year"),
  legalStatus: text("legal_status"),
  gazetteNotificationDate: date("gazette_notification_date"),
  gazetteReference: text("gazette_reference"),
  managementType: bufferZoneManagementEnum("management_type"),
  managementBodyName: text("management_body_name"),
  managementOfficeLocation: text("management_office_location"),
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 14, scale: 2 }),

  // Management committee details
  hasManagementCommittee: boolean("has_management_committee").default(true),
  committeeFormationDate: date("committee_formation_date"),
  committeeMembersCount: integer("committee_members_count"),
  committeeFemaleCount: integer("committee_female_count"),
  committeeMarginalizedCount: integer("committee_marginalized_count"),
  committeeMeetingFrequency: text("committee_meeting_frequency"),

  // Community and demographics
  villagesCount: integer("villages_count"),
  householdCount: integer("household_count"),
  populationTotal: integer("population_total"),
  populationFemale: integer("population_female"),
  populationMale: integer("population_male"),
  dependencyOnForestResourcesPercent: decimal(
    "dependency_on_forest_resources_percent",
    { precision: 5, scale: 2 },
  ),

  // Land use and resources
  forestAreaHectares: decimal("forest_area_hectares", {
    precision: 12,
    scale: 2,
  }),
  agricultureAreaHectares: decimal("agriculture_area_hectares", {
    precision: 12,
    scale: 2,
  }),
  settlementAreaHectares: decimal("settlement_area_hectares", {
    precision: 12,
    scale: 2,
  }),
  otherLandUseAreaHectares: decimal("other_land_use_area_hectares", {
    precision: 12,
    scale: 2,
  }),
  landUseComposition: jsonb("land_use_composition").default(sql`'{}'::jsonb`),
  dominantLandUseType: landUseTypeEnum("dominant_land_use_type"),
  forestDensity: forestDensityEnum("forest_density"),
  majorVegetationTypes: text("major_vegetation_types"),

  // Community forest groups
  communityForestGroupsCount: integer("community_forest_groups_count"),
  communityForestAreaHectares: decimal("community_forest_area_hectares", {
    precision: 12,
    scale: 2,
  }),
  cfugMemberHouseholds: integer("cfug_member_households"),

  // Ecological information
  biodiversityLevel: biodiversityLevelEnum("biodiversity_level"),
  ecosystemType: ecosystemTypeEnum("ecosystem_type"),
  topographyType: topographyTypeEnum("topography_type"),
  elevationRangeLow: decimal("elevation_range_low", { precision: 8, scale: 2 }),
  elevationRangeHigh: decimal("elevation_range_high", {
    precision: 8,
    scale: 2,
  }),
  keyFloraSpecies: text("key_flora_species"),
  keyFaunaSpecies: text("key_fauna_species"),
  wildlifeCorridorPresent: boolean("wildlife_corridor_present").default(false),
  corridorDetails: text("corridor_details"),

  // Conservation and resource use
  allowedResourceCollectionTypes: text("allowed_resource_collection_types"),
  restrictedActivities: text("restricted_activities"),
  hasPermitSystem: boolean("has_permit_system").default(true),
  permitIssuingAuthority: text("permit_issuing_authority"),
  resourceHarvestSchedule: text("resource_harvest_schedule"),
  sustainableHarvestGuidelines: text("sustainable_harvest_guidelines"),

  // Human-wildlife conflict
  humanWildlifeConflictLevel: text("human_wildlife_conflict_level"),
  conflictIncidentsAnnually: integer("conflict_incidents_annually"),
  majorConflictSpecies: text("major_conflict_species"),
  mitigationMeasures: text("mitigation_measures"),
  compensationSchemeExists: boolean("compensation_scheme_exists").default(
    false,
  ),
  compensationDetails: text("compensation_details"),
  annualCompensationAmountNPR: decimal("annual_compensation_amount_npr", {
    precision: 12,
    scale: 2,
  }),

  // Conservation and development interventions
  conservationActivities: text("conservation_activities"),
  afforestationProgrammes: text("afforestation_programmes"),
  habitatRestorationActivities: text("habitat_restoration_activities"),
  alternateLivelihoodPrograms: text("alternate_livelihood_programs"),
  skillDevelopmentTrainings: text("skill_development_trainings"),
  microFinanceInitiatives: text("micro_finance_initiatives"),
  energyAlternativesProvided: text("energy_alternatives_provided"),

  // Income and revenue generation
  revenueSourceTypes: text("revenue_source_types"),
  annualRevenueNPR: decimal("annual_revenue_npr", { precision: 14, scale: 2 }),
  tourismContributionPercent: decimal("tourism_contribution_percent", {
    precision: 5,
    scale: 2,
  }),
  forestProductContributionPercent: decimal(
    "forest_product_contribution_percent",
    { precision: 5, scale: 2 },
  ),
  otherIncomeSourcesPercent: decimal("other_income_sources_percent", {
    precision: 5,
    scale: 2,
  }),

  // Tourism and facilities
  annualTouristCount: integer("annual_tourist_count"),
  homestayFacilities: integer("homestay_facilities"),
  natureTourismActivities: text("nature_tourism_activities"),
  ecotourismInitiatives: text("ecotourism_initiatives"),

  // Infrastructure in buffer zone
  schoolCount: integer("school_count"),
  healthFacilityCount: integer("health_facility_count"),
  roadAccessKilometers: decimal("road_access_kilometers", {
    precision: 8,
    scale: 2,
  }),
  irrigationSchemesCount: integer("irrigation_schemes_count"),
  drinkingWaterSchemesCount: integer("drinking_water_schemes_count"),

  // Monitoring and evaluation
  hasMonitoringSystem: boolean("has_monitoring_system").default(false),
  monitoringParameters: text("monitoring_parameters"),
  monitoringFrequency: text("monitoring_frequency"),
  hasBaseline: boolean("has_baseline").default(false),
  baselineYear: integer("baseline_year"),
  monitoringResponsibility: text("monitoring_responsibility"),

  // Plans and policies
  hasManagementPlan: boolean("has_management_plan").default(true),
  managementPlanPeriod: text("management_plan_period"),
  lastManagementPlanReviewDate: date("last_management_plan_review_date"),
  operationalPlansExist: boolean("operational_plans_exist").default(false),
  byeLawsExist: boolean("bye_laws_exist").default(false),
  byeLawDetails: text("bye_law_details"),

  // Challenges and needs
  majorChallenges: text("major_challenges"),
  resourceNeeds: text("resource_needs"),
  capacityDevelopmentNeeds: text("capacity_development_needs"),

  // Success stories and achievements
  majorAchievements: text("major_achievements"),
  successStories: text("success_stories"),
  innovativePractices: text("innovative_practices"),

  // Future plans
  futureDevelopmentPlans: text("future_development_plans"),
  futureConservationPlans: text("future_conservation_plans"),

  // Contact information
  officeName: text("office_name"),
  officeAddress: text("office_address"),
  chairpersonName: text("chairperson_name"),
  secretaryName: text("secretary_name"),
  phoneNumber: text("phone_number"),
  emailAddress: text("email_address"),

  // Linkages to other entities
  linkedProtectedAreas: jsonb("linked_protected_areas").default(
    sql`'[]'::jsonb`,
  ),
  linkedCommunityForests: jsonb("linked_community_forests").default(
    sql`'[]'::jsonb`,
  ),
  linkedSettlements: jsonb("linked_settlements").default(sql`'[]'::jsonb`),
  linkedInfrastructure: jsonb("linked_infrastructure").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  boundaryPolygon: geometry("boundary_polygon", { type: "MultiPolygon" }),
  settlementLocations: geometry("settlement_locations", { type: "MultiPoint" }),

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

export type BufferZone = typeof bufferZone.$inferSelect;
export type NewBufferZone = typeof bufferZone.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
