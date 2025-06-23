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

// Define government forest type enum
export const governmentForestTypeEnum = pgEnum("government_forest_type", [
  "NATIONAL_FOREST",
  "PROTECTED_FOREST",
  "CONSERVATION_AREA",
  "BUFFER_ZONE_FOREST",
  "RESERVED_FOREST",
  "SCIENTIFIC_FOREST",
  "PLANTATION_FOREST",
  "OTHER",
]);

// Define forest condition enum
export const forestConditionEnum = pgEnum("forest_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "DEGRADED",
  "SEVERELY_DEGRADED",
  "UNDER_RESTORATION",
]);

// Define management status enum
export const managementStatusEnum = pgEnum("management_status", [
  "WELL_MANAGED",
  "PARTIALLY_MANAGED",
  "NEEDS_INTERVENTION",
  "UNDER_DEVELOPMENT",
  "NEGLECTED",
]);

// Define fire risk level enum
export const fireRiskLevelEnum = pgEnum("fire_risk_level", [
  "VERY_HIGH",
  "HIGH",
  "MODERATE",
  "LOW",
  "VERY_LOW",
]);

// Government Forest table
export const governmentForest = pgTable("government_forest", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  forestType: governmentForestTypeEnum("forest_type").notNull(),

  // Basic information
  description: text("description"),
  forestAreaHectares: decimal("forest_area_hectares", {
    precision: 12,
    scale: 2,
  }),
  gazetteNotificationNumber: varchar("gazette_notification_number", {
    length: 50,
  }),
  gazetteNotificationDate: date("gazette_notification_date"),
  notifiedAreaHectares: decimal("notified_area_hectares", {
    precision: 12,
    scale: 2,
  }),

  // Location details
  wardNumbers: jsonb("ward_numbers").default(sql`'[]'::jsonb`), // Array of ward numbers this forest spans
  location: text("location"), // General location description
  boundaryDescription: text("boundary_description"),
  elevationRangeMeters: text("elevation_range_meters"), // e.g., "500-1200"
  minElevationMeters: integer("min_elevation_meters"),
  maxElevationMeters: integer("max_elevation_meters"),

  // Management details
  managingDivision: text("managing_division"), // Forest division office responsible
  divisionOfficeLocation: text("division_office_location"),
  managementStatus: managementStatusEnum("management_status"),
  hasManagementPlan: boolean("has_management_plan").default(false),
  managementPlanPeriod: text("management_plan_period"), // e.g., "2020-2030"
  lastInventoryYear: integer("last_inventory_year"),
  forestOfficerInCharge: text("forest_officer_in_charge"),
  forestGuardCount: integer("forest_guard_count"),
  forestRangerCount: integer("forest_ranger_count"),
  totalStaffCount: integer("total_staff_count"),
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 14, scale: 2 }),
  implementingPartners: text("implementing_partners"),

  // Forest characteristics
  forestCondition: forestConditionEnum("forest_condition"),
  dominantSpecies: jsonb("dominant_species").default(sql`'[]'::jsonb`), // Array of tree species names
  keyFloraSpecies: jsonb("key_flora_species").default(sql`'[]'::jsonb`),
  keyFaunaSpecies: jsonb("key_fauna_species").default(sql`'[]'::jsonb`),
  hasEndangeredSpecies: boolean("has_endangered_species").default(false),
  endangeredSpeciesList: jsonb("endangered_species_list").default(
    sql`'[]'::jsonb`,
  ),
  forestDensityPercent: decimal("forest_density_percent", {
    precision: 5,
    scale: 2,
  }),
  ageStructure: text("age_structure"), // Description of the forest age structure
  soilType: text("soil_type"),
  watershedDetails: text("watershed_details"),
  hasWaterBodies: boolean("has_water_bodies").default(false),
  waterBodiesDetails: text("water_bodies_details"),

  // Ecological significance
  biodiversityRichness: text("biodiversity_richness"),
  ecologicalSignificance: text("ecological_significance"),
  ecosystemServices: text("ecosystem_services"),
  carbonStockAssessment: text("carbon_stock_assessment"),
  researchValue: text("research_value"),
  hasRareHabitats: boolean("has_rare_habitats").default(false),
  rareHabitatsDetails: text("rare_habitats_details"),

  // Threats and challenges
  encroachmentStatus: text("encroachment_status"),
  encroachmentAreaHectares: decimal("encroachment_area_hectares", {
    precision: 10,
    scale: 2,
  }),
  illegalLoggingIntensity: text("illegal_logging_intensity"), // Low, Medium, High
  poachingIntensity: text("poaching_intensity"), // Low, Medium, High
  fireRiskLevel: fireRiskLevelEnum("fire_risk_level"),
  fireIncidentsLastFiveYears: integer("fire_incidents_last_five_years"),
  diseasesAndPests: text("diseases_and_pests"),
  invasiveSpecies: text("invasive_species"),
  grazing: boolean("grazing").default(false),
  grazingIntensity: text("grazing_intensity"),
  otherThreats: text("other_threats"),

  // Conservation efforts
  hasFirelines: boolean("has_firelines").default(false),
  firelineKilometers: decimal("fireline_kilometers", {
    precision: 8,
    scale: 2,
  }),
  hasFirewatchers: boolean("has_firewatchers").default(false),
  firewatcherCount: integer("firewatcher_count"),
  hasFirefightingEquipment: boolean("has_firefighting_equipment").default(
    false,
  ),
  firefightingEquipmentDetails: text("firefighting_equipment_details"),
  annualPlantationHectares: decimal("annual_plantation_hectares", {
    precision: 10,
    scale: 2,
  }),
  soilConservationMeasures: text("soil_conservation_measures"),
  watershedConservationActivities: text("watershed_conservation_activities"),
  wildlifeConservationMeasures: text("wildlife_conservation_measures"),

  // Infrastructure
  hasRoadsWithin: boolean("has_roads_within").default(false),
  roadKilometers: decimal("road_kilometers", { precision: 8, scale: 2 }),
  hasCheckposts: boolean("has_checkposts").default(false),
  checkpostCount: integer("checkpost_count"),
  hasWatchtowers: boolean("has_watchtowers").default(false),
  watchtowerCount: integer("watchtower_count"),
  hasNursery: boolean("has_nursery").default(false),
  nurseryCapacity: integer("nursery_capacity"),
  hasRangerPost: boolean("has_ranger_post").default(false),
  rangerPostCount: integer("ranger_post_count"),
  infrastructureNeeds: text("infrastructure_needs"),

  // Resource utilization
  annualTimberHarvestCubicMeters: decimal(
    "annual_timber_harvest_cubic_meters",
    { precision: 10, scale: 2 },
  ),
  annualFirewoodCollectionCubicMeters: decimal(
    "annual_firewood_collection_cubic_meters",
    { precision: 10, scale: 2 },
  ),
  ntfpCollection: boolean("ntfp_collection").default(false), // Non-timber forest products
  ntfpDetails: text("ntfp_details"),
  medicinalHerbCollection: boolean("medicinal_herb_collection").default(false),
  medicinalHerbDetails: text("medicinal_herb_details"),
  annualRevenueNPR: decimal("annual_revenue_npr", { precision: 14, scale: 2 }),
  revenueSharing: text("revenue_sharing"),

  // Community interface
  adjacentCommunities: jsonb("adjacent_communities").default(sql`'[]'::jsonb`),
  communityAccessRights: text("community_access_rights"),
  hasResourceDependentCommunities: boolean(
    "has_resource_dependent_communities",
  ).default(false),
  resourceDependentCommunityDetails: text(
    "resource_dependent_community_details",
  ),
  communityConflicts: text("community_conflicts"),
  hasCommunityOutreach: boolean("has_community_outreach").default(false),
  communityOutreachActivities: text("community_outreach_activities"),

  // Policy and governance
  governingLegislation: text("governing_legislation"),
  hasLegalDisputes: boolean("has_legal_disputes").default(false),
  legalDisputeDetails: text("legal_dispute_details"),
  policyIssues: text("policy_issues"),

  // Cultural significance
  culturalSignificance: text("cultural_significance"),
  religiousSignificance: text("religious_significance"),
  historicalSignificance: text("historical_significance"),
  indigenousKnowledge: text("indigenous_knowledge"),

  // Tourism aspects
  hasTourismPotential: boolean("has_tourism_potential").default(false),
  tourismActivities: text("tourism_activities"),
  annualVisitorCount: integer("annual_visitor_count"),
  touristFacilities: text("tourist_facilities"),
  trekkingroutes: boolean("trekking_routes").default(false),
  trekkingRouteDetails: text("trekking_route_details"),

  // Future plans
  developmentPlans: text("development_plans"),
  restorationPlans: text("restoration_plans"),
  expansionPlans: text("expansion_plans"),
  researchPriorities: text("research_priorities"),

  // Contact information
  contactOfficeName: text("contact_office_name"),
  contactOfficeAddress: text("contact_office_address"),
  contactOfficerName: text("contact_officer_name"),
  contactOfficerDesignation: text("contact_officer_designation"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),

  // Linkages to other entities
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedWaterbodies: jsonb("linked_waterbodies").default(sql`'[]'::jsonb`),
  linkedCommunityForests: jsonb("linked_community_forests").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }), // Representative point
  forestBoundary: geometry("forest_boundary", { type: "MultiPolygon" }), // Actual forest boundary

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

export type GovernmentForest = typeof governmentForest.$inferSelect;
export type NewGovernmentForest = typeof governmentForest.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
