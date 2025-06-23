import { pgTable } from "../../../../schema/basic";
import {
  integer,
  timestamp,
  varchar,
  text,
  boolean,
  decimal,
  jsonb,
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";
import {
  forestConditionEnum,
  forestManagementStatusEnum,
  biodiversityLevelEnum,
  fireRiskLevelEnum,
  forestDensityEnum,
  topographyTypeEnum,
  ecosystemTypeEnum,
  forestAccessibilityEnum,
  landTenureEnum,
} from "./common";

// Private Forest table
export const privateForest = pgTable("private_forest", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // General location name
  address: text("address"),

  // Registration and ownership details
  registrationNumber: varchar("registration_number", { length: 50 }),
  registrationDate: date("registration_date"),
  registeredWithOffice: text("registered_with_office"),
  certificateNumber: varchar("certificate_number", { length: 50 }),
  ownershipType: text("ownership_type"), // E.g., "Individual", "Family", "Company"
  ownerName: text("owner_name"),
  ownershipDocumentType: text("ownership_document_type"), // E.g., "Land Certificate"
  landCertificateNumber: varchar("land_certificate_number", { length: 50 }),

  // Forest management details
  hasManagementPlan: boolean("has_management_plan").default(false),
  managementPlanPeriod: text("management_plan_period"), // E.g., "2020-2030"
  managementObjectives: jsonb("management_objectives").default(
    sql`'[]'::jsonb`,
  ), // Timber, conservation, recreation, etc.
  forestManagementStatus: forestManagementStatusEnum(
    "forest_management_status",
  ),
  receivesExpertSupport: boolean("receives_expert_support").default(false),
  expertSupportDetails: text("expert_support_details"),

  // Forest details
  totalAreaHectares: decimal("total_area_hectares", {
    precision: 10,
    scale: 2,
  }),
  forestCoveragePercent: decimal("forest_coverage_percent", {
    precision: 5,
    scale: 2,
  }),
  openAreaPercent: decimal("open_area_percent", { precision: 5, scale: 2 }),
  forestCondition: forestConditionEnum("forest_condition"),
  forestDensity: forestDensityEnum("forest_density"),
  forestType: text("forest_type"), // Natural, planted, mixed
  forestEstablishmentYear: integer("forest_establishment_year"),
  isPlantation: boolean("is_plantation").default(false),
  plantationYear: integer("plantation_year"),
  biodiversityLevel: biodiversityLevelEnum("biodiversity_level"),
  fireRiskLevel: fireRiskLevelEnum("fire_risk_level"),

  // Topography and ecosystem
  elevationRangeMeters: text("elevation_range_meters"), // E.g., "500-1200"
  slopePercent: decimal("slope_percent", { precision: 5, scale: 2 }),
  aspectDirection: text("aspect_direction"), // E.g., "North-facing", "South-facing"
  topography: topographyTypeEnum("topography"),
  soilType: text("soil_type"),
  ecosystemType: ecosystemTypeEnum("ecosystem_type"),
  watershedName: text("watershed_name"),
  nearestWaterBodyName: text("nearest_water_body_name"),
  distanceToWaterBodyKm: decimal("distance_to_water_body_km", {
    precision: 6,
    scale: 2,
  }),

  // Flora and fauna
  dominantTreeSpecies: jsonb("dominant_tree_species").default(sql`'[]'::jsonb`),
  dominantShrubSpecies: jsonb("dominant_shrub_species").default(
    sql`'[]'::jsonb`,
  ),
  treeSpeciesCount: integer("tree_species_count"),
  plantedSpecies: jsonb("planted_species").default(sql`'[]'::jsonb`),
  nativeSpeciesCount: integer("native_species_count"),
  invasiveSpeciesCount: integer("invasive_species_count"),
  invasiveSpeciesNames: jsonb("invasive_species_names").default(
    sql`'[]'::jsonb`,
  ),
  medicinalPlantsPresent: boolean("medicinal_plants_present").default(false),
  medicinalPlantDetails: text("medicinal_plant_details"),
  wildlifePresent: jsonb("wildlife_present").default(sql`'[]'::jsonb`),

  // Forest inventory details
  lastInventoryYear: integer("last_inventory_year"),
  estimatedAnnualGrowthPercent: decimal("estimated_annual_growth_percent", {
    precision: 5,
    scale: 2,
  }),
  estimatedCarbonStockTonnes: decimal("estimated_carbon_stock_tonnes", {
    precision: 10,
    scale: 2,
  }),
  totalTreeCount: integer("total_tree_count"),
  averageTreeAge: integer("average_tree_age"),
  averageTreeHeightMeters: decimal("average_tree_height_meters", {
    precision: 6,
    scale: 2,
  }),
  timberVolumeEstimateCubicMeters: decimal(
    "timber_volume_estimate_cubic_meters",
    { precision: 10, scale: 2 },
  ),

  // Harvesting and utilization
  harvestForPersonalUse: boolean("harvest_for_personal_use").default(true),
  harvestForCommercialUse: boolean("harvest_for_commercial_use").default(false),
  annualHarvestVolumeCubicMeters: decimal(
    "annual_harvest_volume_cubic_meters",
    { precision: 10, scale: 2 },
  ),
  lastHarvestDate: date("last_harvest_date"),
  harvestingSystem: text("harvesting_system"), // E.g., "Selection cutting", "Clear cutting", etc.
  majorForestProducts: jsonb("major_forest_products").default(sql`'[]'::jsonb`), // Timber, firewood, fodder, etc.
  hasPermitForTimberHarvest: boolean("has_permit_for_timber_harvest").default(
    false,
  ),
  permitDetails: text("permit_details"),

  // Financial aspects
  annualRevenueNPR: decimal("annual_revenue_npr", { precision: 14, scale: 2 }),
  annualOperationalCostNPR: decimal("annual_operational_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  receivesSubsidies: boolean("receives_subsidies").default(false),
  subsidyDetails: text("subsidy_details"),
  hasLoanForForestry: boolean("has_loan_for_forestry").default(false),
  loanDetails: text("loan_details"),

  // Management activities
  hasSilviculturalActivities: boolean("has_silvicultural_activities").default(
    false,
  ),
  silviculturalActivitiesDetails: text("silvicultural_activities_details"),
  hasThinningActivities: boolean("has_thinning_activities").default(false),
  thinningFrequency: text("thinning_frequency"),
  hasPruningActivities: boolean("has_pruning_activities").default(false),
  pruningFrequency: text("pruning_frequency"),
  hasNursery: boolean("has_nursery").default(false),
  nurseryCapacitySeedlings: integer("nursery_capacity_seedlings"),
  seedlingsSoldAnnually: integer("seedlings_sold_annually"),

  // Conservation and protection
  hasFireProtectionMeasures: boolean("has_fire_protection_measures").default(
    false,
  ),
  fireProtectionDetails: text("fire_protection_details"),
  hasPestDiseaseControlMeasures: boolean(
    "has_pest_disease_control_measures",
  ).default(false),
  pestDiseaseControlDetails: text("pest_disease_control_details"),
  fencingType: text("fencing_type"),
  hasWatchman: boolean("has_watchman").default(false),
  watchmanCount: integer("watchman_count"),
  forestFireIncidentsLastFiveYears: integer(
    "forest_fire_incidents_last_five_years",
  ),
  lastForestFireDate: date("last_forest_fire_date"),

  // Land conversion and legal aspects
  hasLandUseChangePermit: boolean("has_land_use_change_permit").default(false),
  landUseChangeDetails: text("land_use_change_details"),
  hasLegalChallenges: boolean("has_legal_challenges").default(false),
  legalChallengesDetails: text("legal_challenges_details"),
  taxExemptStatus: boolean("tax_exempt_status").default(false),
  taxExemptionDetails: text("tax_exemption_details"),

  // External support and coordination
  receivesGovernmentSupport: boolean("receives_government_support").default(
    false,
  ),
  governmentSupportDetails: text("government_support_details"),
  receivesNgoSupport: boolean("receives_ngo_support").default(false),
  ngoSupportDetails: text("ngo_support_details"),
  participatesInForestryPrograms: boolean(
    "participates_in_forestry_programs",
  ).default(false),
  forestryProgramDetails: text("forestry_program_details"),

  // Challenges and needs
  majorChallenges: jsonb("major_challenges").default(sql`'[]'::jsonb`),
  technicalNeeds: text("technical_needs"),
  financialNeeds: text("financial_needs"),

  // Future plans
  hasExpansionPlan: boolean("has_expansion_plan").default(false),
  expansionPlanDetails: text("expansion_plan_details"),
  futureHarvestingPlans: text("future_harvesting_plans"),
  successorPlan: text("successor_plan"), // Who will manage forest in the future

  // Accessibility and tourism
  accessibility: forestAccessibilityEnum("accessibility"),
  distanceFromRoadKm: decimal("distance_from_road_km", {
    precision: 6,
    scale: 2,
  }),
  distanceFromSettlementKm: decimal("distance_from_settlement_km", {
    precision: 6,
    scale: 2,
  }),
  hasEcotourismActivities: boolean("has_ecotourism_activities").default(false),
  ecotourismActivitiesDetails: text("ecotourism_activities_details"),

  // Contact information
  contactPersonName: text("contact_person_name"),
  contactPersonRole: text("contact_person_role"),
  contactPhone: text("contact_phone"),
  alternateContactPhone: text("alternate_contact_phone"),
  emailAddress: text("email_address"),

  // Tenure and boundaries
  landTenure: landTenureEnum("land_tenure"),
  hasBoundaryDisputes: boolean("has_boundary_disputes").default(false),
  boundaryDisputeDetails: text("boundary_dispute_details"),
  hasBoundaryMarkers: boolean("has_boundary_markers").default(false),
  boundaryMarkerType: text("boundary_marker_type"),

  // Linkages to other entities
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedSettlements: jsonb("linked_settlements").default(sql`'[]'::jsonb`),
  linkedWaterbodies: jsonb("linked_waterbodies").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  forestBoundary: geometry("forest_boundary", { type: "MultiPolygon" }),
  accessPoints: geometry("access_points", { type: "MultiPoint" }),

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

export type PrivateForest = typeof privateForest.$inferSelect;
export type NewPrivateForest = typeof privateForest.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
