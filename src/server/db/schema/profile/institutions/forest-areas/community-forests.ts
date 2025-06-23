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

// Community Forest table
export const communityForest = pgTable("community_forest", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),

  // Location details
  wardNumbers: jsonb("ward_numbers").default(sql`'[]'::jsonb`), // Forest may span multiple wards
  location: text("location"), // General location name
  address: text("address"),

  // Registration and management details
  registrationNumber: varchar("registration_number", { length: 50 }),
  registrationDate: date("registration_date"),
  handoverDate: date("handover_date"), // Date when forest was handed over to community
  forestOfficeRegisteredWith: text("forest_office_registered_with"),
  certificateNumber: varchar("certificate_number", { length: 50 }),
  forestManagementPlan: boolean("forest_management_plan").default(false),
  managementPlanPeriod: text("management_plan_period"), // E.g., "2020-2030"
  renewalDate: date("renewal_date"),

  // Forest user group details
  hasForestUserGroup: boolean("has_forest_user_group").default(true),
  userGroupName: text("user_group_name"),
  userGroupRegistrationNumber: varchar("user_group_registration_number", {
    length: 50,
  }),
  userGroupFormationDate: date("user_group_formation_date"),
  totalUserHouseholds: integer("total_user_households"),
  totalBeneficiaries: integer("total_beneficiaries"),
  maleMembers: integer("male_members"),
  femaleMembers: integer("female_members"),
  dalitHouseholds: integer("dalit_households"),
  janajatiHouseholds: integer("janajati_households"),
  brahminChhetriHouseholds: integer("brahmin_chhetri_households"),
  otherEthnicHouseholds: integer("other_ethnic_households"),
  executiveCommitteeSize: integer("executive_committee_size"),
  femalesInExecutive: integer("females_in_executive"),
  executiveCommitteeFormationDate: date("executive_committee_formation_date"),
  executiveCommitteeElectionFrequencyYears: integer(
    "executive_committee_election_frequency_years",
  ),
  chairpersonName: text("chairperson_name"),
  secretaryName: text("secretary_name"),
  treasurerName: text("treasurer_name"),

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
  encroachmentAreaHectares: decimal("encroachment_area_hectares", {
    precision: 10,
    scale: 2,
  }),
  forestCondition: forestConditionEnum("forest_condition"),
  forestDensity: forestDensityEnum("forest_density"),
  forestManagementStatus: forestManagementStatusEnum(
    "forest_management_status",
  ),
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
  nativeSpeciesCount: integer("native_species_count"),
  invasiveSpeciesCount: integer("invasive_species_count"),
  invasiveSpeciesNames: jsonb("invasive_species_names").default(
    sql`'[]'::jsonb`,
  ),
  medicinalPlantSpeciesCount: integer("medicinal_plant_species_count"),
  notableMedicinalPlants: jsonb("notable_medicinal_plants").default(
    sql`'[]'::jsonb`,
  ),
  endangeredFloraCount: integer("endangered_flora_count"),
  endangeredFaunaCount: integer("endangered_fauna_count"),
  endangeredSpecies: jsonb("endangered_species").default(sql`'[]'::jsonb`),
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
  averageDbhCm: decimal("average_dbh_cm", { precision: 6, scale: 2 }), // Diameter at breast height
  timberVolumeEstimateCubicMeters: decimal(
    "timber_volume_estimate_cubic_meters",
    { precision: 10, scale: 2 },
  ),

  // Harvesting and utilization
  allowsHarvesting: boolean("allows_harvesting").default(true),
  annualAllowableHarvestCubicMeters: decimal(
    "annual_allowable_harvest_cubic_meters",
    { precision: 10, scale: 2 },
  ),
  lastHarvestDate: date("last_harvest_date"),
  lastHarvestVolumeCubicMeters: decimal("last_harvest_volume_cubic_meters", {
    precision: 10,
    scale: 2,
  }),
  harvestingSystem: text("harvesting_system"), // E.g., "Selection cutting", "Clear cutting", etc.
  majorForestProducts: jsonb("major_forest_products").default(sql`'[]'::jsonb`), // Timber, firewood, fodder, etc.
  annualTimberProductionCubicMeters: decimal(
    "annual_timber_production_cubic_meters",
    { precision: 10, scale: 2 },
  ),
  annualFirewoodProductionKg: decimal("annual_firewood_production_kg", {
    precision: 10,
    scale: 2,
  }),
  annualFodderProductionKg: decimal("annual_fodder_production_kg", {
    precision: 10,
    scale: 2,
  }),
  otherForestProductsHarvested: text("other_forest_products_harvested"),

  // Financial aspects
  annualRevenueNPR: decimal("annual_revenue_npr", { precision: 14, scale: 2 }),
  timberRevenueNPR: decimal("timber_revenue_npr", { precision: 14, scale: 2 }),
  ntfpRevenueNPR: decimal("ntfp_revenue_npr", { precision: 14, scale: 2 }), // Non-timber forest products
  otherIncomeSourcesNPR: decimal("other_income_sources_npr", {
    precision: 14,
    scale: 2,
  }),
  annualOperationalCostNPR: decimal("annual_operational_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  hasBank: boolean("has_bank_account").default(true),
  bankAccountDetails: text("bank_account_details"),
  totalSavingsNPR: decimal("total_savings_npr", { precision: 14, scale: 2 }),
  receivesExternalFunding: boolean("receives_external_funding").default(false),
  externalFundingSourcesNPR: decimal("external_funding_sources_npr", {
    precision: 14,
    scale: 2,
  }),
  fundingOrganizations: jsonb("funding_organizations").default(
    sql`'[]'::jsonb`,
  ),

  // Forest management activities
  hasSilviculturalActivities: boolean("has_silvicultural_activities").default(
    false,
  ),
  silviculturalActivitiesDetails: text("silvicultural_activities_details"),
  hasPlantationActivities: boolean("has_plantation_activities").default(false),
  plantationAreaHectares: decimal("plantation_area_hectares", {
    precision: 10,
    scale: 2,
  }),
  plantationYear: integer("plantation_year"),
  plantedSpecies: jsonb("planted_species").default(sql`'[]'::jsonb`),
  plantingSurvivalRatePercent: decimal("planting_survival_rate_percent", {
    precision: 5,
    scale: 2,
  }),
  hasNursery: boolean("has_nursery").default(false),
  nurseryCapacitySeedlings: integer("nursery_capacity_seedlings"),

  // Conservation and protection
  hasFirelines: boolean("has_firelines").default(false),
  firelineLengthKm: decimal("fireline_length_km", { precision: 6, scale: 2 }),
  hasWatchTower: boolean("has_watch_tower").default(false),
  watchTowerCount: integer("watch_tower_count"),
  forestFireIncidentsLastFiveYears: integer(
    "forest_fire_incidents_last_five_years",
  ),
  lastForestFireDate: date("last_forest_fire_date"),
  employesForestGuards: boolean("employes_forest_guards").default(false),
  forestGuardCount: integer("forest_guard_count"),
  hasEncroachmentIssues: boolean("has_encroachment_issues").default(false),
  encroachmentDetails: text("encroachment_details"),
  illegalLoggingIncidentsLastYear: integer(
    "illegal_logging_incidents_last_year",
  ),

  // Community development
  hasCommunityDevelopmentFund: boolean(
    "has_community_development_fund",
  ).default(false),
  developmentFundAllocationPercent: decimal(
    "development_fund_allocation_percent",
    { precision: 5, scale: 2 },
  ),
  developsLocalInfrastructure: boolean("develops_local_infrastructure").default(
    false,
  ),
  infrastructureDevelopmentDetails: text("infrastructure_development_details"),
  providesEducationalSupport: boolean("provides_educational_support").default(
    false,
  ),
  educationalSupportDetails: text("educational_support_details"),
  livelihoodSupportActivities: text("livelihood_support_activities"),
  hasEquitableDistributionSystem: boolean(
    "has_equitable_distribution_system",
  ).default(false),
  distributionSystemDetails: text("distribution_system_details"),

  // Governance and regulations
  hasConstitution: boolean("has_constitution").default(true),
  hasOperationalPlan: boolean("has_operational_plan").default(true),
  operationalPlanPeriodYears: integer("operational_plan_period_years"),
  hasHarvestingRules: boolean("has_harvesting_rules").default(true),
  harvestingRulesDetails: text("harvesting_rules_details"),
  hasMonitoringSystem: boolean("has_monitoring_system").default(false),
  monitoringSystemDetails: text("monitoring_system_details"),
  hasConflictResolutionMechanism: boolean(
    "has_conflict_resolution_mechanism",
  ).default(false),
  conflictResolutionDetails: text("conflict_resolution_details"),
  majorConflictTypes: jsonb("major_conflict_types").default(sql`'[]'::jsonb`),

  // External support and coordination
  receivesGovernmentSupport: boolean("receives_government_support").default(
    false,
  ),
  governmentSupportDetails: text("government_support_details"),
  receivesNgoSupport: boolean("receives_ngo_support").default(false),
  ngoSupportDetails: text("ngo_support_details"),
  coordinatesWithLocalGovernment: boolean(
    "coordinates_with_local_government",
  ).default(true),
  coordinationMechanisms: text("coordination_mechanisms"),

  // Challenges and needs
  majorChallenges: jsonb("major_challenges").default(sql`'[]'::jsonb`),
  technicalNeeds: text("technical_needs"),
  capacityBuildingNeeds: text("capacity_building_needs"),
  financialNeeds: text("financial_needs"),

  // Future plans
  hasExpansionPlan: boolean("has_expansion_plan").default(false),
  expansionPlanDetails: text("expansion_plan_details"),
  sustainabilityMeasures: text("sustainability_measures"),
  climateChangeAdaptationMeasures: text("climate_change_adaptation_measures"),

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
  hasFootTrails: boolean("has_foot_trails").default(false),
  footTrailLengthKm: decimal("foot_trail_length_km", {
    precision: 6,
    scale: 2,
  }),
  hasEcotourismActivities: boolean("has_ecotourism_activities").default(false),
  ecotourismActivitiesDetails: text("ecotourism_activities_details"),
  annualVisitorsCount: integer("annual_visitors_count"),

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
  lastBoundaryVerificationDate: date("last_boundary_verification_date"),

  // Linkages to other entities
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedSettlements: jsonb("linked_settlements").default(sql`'[]'::jsonb`),
  linkedWaterbodies: jsonb("linked_waterbodies").default(sql`'[]'::jsonb`),
  linkedProtectedAreas: jsonb("linked_protected_areas").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  forestBoundary: geometry("forest_boundary", { type: "MultiPolygon" }),
  guardPostLocations: geometry("guard_post_locations", { type: "MultiPoint" }),
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

export type CommunityForest = typeof communityForest.$inferSelect;
export type NewCommunityForest = typeof communityForest.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
