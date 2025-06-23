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

// Define dam type enum
export const damTypeEnum = pgEnum("dam_type", [
  "STORAGE",
  "DIVERSION",
  "DETENTION",
  "DEBRIS",
  "GRAVITY",
  "EMBANKMENT",
  "ROCK_FILL",
  "CONCRETE",
  "ARCH",
  "BUTTRESS",
  "RUN_OF_RIVER",
  "CANAL_HEAD",
  "BARRAGE",
  "EARTHEN",
  "OTHER",
]);

// Define dam purpose enum
export const damPurposeEnum = pgEnum("dam_purpose", [
  "IRRIGATION",
  "HYDROPOWER",
  "WATER_SUPPLY",
  "FLOOD_CONTROL",
  "RECREATION",
  "NAVIGATION",
  "FISHERY",
  "MULTI_PURPOSE",
  "GROUNDWATER_RECHARGE",
  "OTHER",
]);

// Define dam condition enum
export const damConditionEnum = pgEnum("dam_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "CRITICAL",
  "UNDER_CONSTRUCTION",
  "ABANDONED",
  "BREACHED",
]);

// Define dam hazard classification enum
export const damHazardClassificationEnum = pgEnum("dam_hazard_classification", [
  "HIGH",
  "SIGNIFICANT",
  "LOW",
  "UNDETERMINED",
]);

// Define dam regulatory status enum
export const damRegulatoryStatusEnum = pgEnum("dam_regulatory_status", [
  "REGULATED",
  "UNREGULATED",
  "EXEMPTED",
  "UNDER_REVIEW",
  "NON_JURISDICTIONAL",
]);

// Define dam ownership type enum
export const damOwnershipTypeEnum = pgEnum("dam_ownership_type", [
  "FEDERAL_GOVERNMENT",
  "PROVINCIAL_GOVERNMENT",
  "LOCAL_GOVERNMENT",
  "COMMUNITY",
  "PRIVATE",
  "PUBLIC_PRIVATE",
  "UTILITY_COMPANY",
  "IRRIGATION_DISTRICT",
  "OTHER",
]);

// Dam schema
export const dam = pgTable("dam", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),

  // Basic information
  damType: damTypeEnum("dam_type").notNull(),
  primaryPurpose: damPurposeEnum("primary_purpose").notNull(),
  secondaryPurposes: jsonb("secondary_purposes").default(sql`'[]'::jsonb`),
  condition: damConditionEnum("condition"),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  nearestSettlement: text("nearest_settlement"),

  // Physical characteristics
  heightMeters: decimal("height_meters", { precision: 10, scale: 2 }),
  lengthMeters: decimal("length_meters", { precision: 10, scale: 2 }),
  crownWidthMeters: decimal("crown_width_meters", { precision: 10, scale: 2 }),
  baseWidthMeters: decimal("base_width_meters", { precision: 10, scale: 2 }),
  reservoirCapacityCubicMeters: decimal("reservoir_capacity_cubic_meters", {
    precision: 18,
    scale: 2,
  }),
  surfaceAreaSquareMeters: decimal("surface_area_square_meters", {
    precision: 18,
    scale: 2,
  }),
  drainageAreaSquareKilometers: decimal("drainage_area_square_kilometers", {
    precision: 10,
    scale: 2,
  }),
  normalWaterLevelMeters: decimal("normal_water_level_meters", {
    precision: 10,
    scale: 2,
  }),
  maximumWaterLevelMeters: decimal("maximum_water_level_meters", {
    precision: 10,
    scale: 2,
  }),
  minimumOperatingLevelMeters: decimal("minimum_operating_level_meters", {
    precision: 10,
    scale: 2,
  }),

  // Construction details
  constructionStartDate: date("construction_start_date"),
  constructionCompletionDate: date("construction_completion_date"),
  constructionMaterials: text("construction_materials"),
  designLifeYears: integer("design_life_years"),

  // Operational information
  operationalStatus: text("operational_status"),
  commissioningDate: date("commissioning_date"),
  operatorName: text("operator_name"),
  operatorContactInfo: text("operator_contact_info"),
  annualMaintenanceBudgetNPR: decimal("annual_maintenance_budget_npr", {
    precision: 14,
    scale: 2,
  }),
  lastMajorMaintenanceDate: date("last_major_maintenance_date"),
  nextScheduledMaintenanceDate: date("next_scheduled_maintenance_date"),

  // Ownership and regulation
  ownershipType: damOwnershipTypeEnum("ownership_type"),
  ownerName: text("owner_name"),
  ownerContactInfo: text("owner_contact_info"),
  regulatoryStatus: damRegulatoryStatusEnum("regulatory_status"),
  regulatoryAuthority: text("regulatory_authority"),
  permitNumber: text("permit_number"),
  permitIssueDate: date("permit_issue_date"),
  permitExpiryDate: date("permit_expiry_date"),

  // Safety and risk
  hazardClassification: damHazardClassificationEnum("hazard_classification"),
  emergencyActionPlan: boolean("emergency_action_plan").default(false),
  emergencyContactInfo: text("emergency_contact_info"),
  lastInspectionDate: date("last_inspection_date"),
  inspectionFrequencyMonths: integer("inspection_frequency_months"),
  safetyIssues: text("safety_issues"),
  remediationPlans: text("remediation_plans"),

  // Hydrology and water management
  waterSourceType: text("water_source_type"), // River, stream, rainfall, etc.
  waterSourceName: text("water_source_name"),
  averageInflowCubicMetersPerSecond: decimal(
    "average_inflow_cubic_meters_per_second",
    { precision: 10, scale: 3 },
  ),
  designFloodCubicMetersPerSecond: decimal(
    "design_flood_cubic_meters_per_second",
    { precision: 10, scale: 3 },
  ),
  spillwayType: text("spillway_type"),
  spillwayCapacityCubicMetersPerSecond: decimal(
    "spillway_capacity_cubic_meters_per_second",
    { precision: 10, scale: 3 },
  ),
  floodControlMeasures: text("flood_control_measures"),
  waterReleaseSchedule: text("water_release_schedule"),

  // Environmental aspects
  environmentalFlowRequirementsCubicMetersPerSecond: decimal(
    "environmental_flow_requirements_cubic_meters_per_second",
    { precision: 10, scale: 3 },
  ),
  fishPassageType: text("fish_passage_type"),
  environmentalImpactStudy: boolean("environmental_impact_study").default(
    false,
  ),
  environmentalMitigationMeasures: text("environmental_mitigation_measures"),
  sedimentManagementPractices: text("sediment_management_practices"),

  // Irrigation details (if applicable)
  irrigationCommandAreaHectares: decimal("irrigation_command_area_hectares", {
    precision: 10,
    scale: 2,
  }),
  irrigationCanalLengthKilometers: decimal(
    "irrigation_canal_length_kilometers",
    { precision: 10, scale: 2 },
  ),
  irrigationBeneficiaries: integer("irrigation_beneficiaries"),
  cropsIrrigated: text("crops_irrigated"),

  // Hydropower details (if applicable)
  installedCapacityMW: decimal("installed_capacity_mw", {
    precision: 10,
    scale: 2,
  }),
  annualGenerationGWh: decimal("annual_generation_gwh", {
    precision: 10,
    scale: 2,
  }),
  turbineType: text("turbine_type"),
  turbineCount: integer("turbine_count"),
  minimumOperationalFlowCubicMetersPerSecond: decimal(
    "minimum_operational_flow_cubic_meters_per_second",
    { precision: 10, scale: 3 },
  ),
  generationEfficiencyPercent: decimal("generation_efficiency_percent", {
    precision: 5,
    scale: 2,
  }),

  // Water supply details (if applicable)
  waterSupplyPopulationServed: integer("water_supply_population_served"),
  waterTreatmentCapacityLitersPerDay: decimal(
    "water_treatment_capacity_liters_per_day",
    { precision: 14, scale: 2 },
  ),
  waterQualityMonitoring: boolean("water_quality_monitoring").default(false),
  waterQualityParameters: text("water_quality_parameters"),

  // Recreational facilities (if applicable)
  allowsRecreation: boolean("allows_recreation").default(false),
  recreationalActivities: text("recreational_activities"),
  visitorFacilities: text("visitor_facilities"),
  annualVisitorCount: integer("annual_visitor_count"),

  // Socioeconomic impact
  populationDisplaced: integer("population_displaced"),
  resettlementPlan: boolean("resettlement_plan").default(false),
  compensationDetails: text("compensation_details"),
  communityBenefitPrograms: text("community_benefit_programs"),
  localEmploymentGenerated: integer("local_employment_generated"),

  // Financial aspects
  constructionCostNPR: decimal("construction_cost_npr", {
    precision: 18,
    scale: 2,
  }),
  annualOperatingCostNPR: decimal("annual_operating_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  revenueSourceDetails: text("revenue_source_details"),
  annualRevenueNPR: decimal("annual_revenue_npr", { precision: 14, scale: 2 }),
  financialSustainability: text("financial_sustainability"),

  // Challenges and future plans
  currentChallenges: text("current_challenges"),
  futureDevelopmentPlans: text("future_development_plans"),
  rehabilitationNeeds: text("rehabilitation_needs"),
  climateChangeAdaptationMeasures: text("climate_change_adaptation_measures"),

  // Governance and management
  managementCommitteeDetails: text("management_committee_details"),
  communityInvolvementLevel: text("community_involvement_level"),
  conflictResolutionMechanism: text("conflict_resolution_mechanism"),
  waterUserAssociations: text("water_user_associations"),

  // Linkages to other entities
  linkedRivers: jsonb("linked_rivers").default(sql`'[]'::jsonb`),
  linkedIrrigationCanals: jsonb("linked_irrigation_canals").default(
    sql`'[]'::jsonb`,
  ),
  linkedSettlements: jsonb("linked_settlements").default(sql`'[]'::jsonb`),
  linkedHydropowerPlants: jsonb("linked_hydropower_plants").default(
    sql`'[]'::jsonb`,
  ),

  // Media and documentation
  hasPhotos: boolean("has_photos").default(false),
  hasDesignDocuments: boolean("has_design_documents").default(false),
  hasOperationManual: boolean("has_operation_manual").default(false),
  documentationNotes: text("documentation_notes"),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  damFootprint: geometry("dam_footprint", { type: "LineString" }),
  reservoirArea: geometry("reservoir_area", { type: "Polygon" }),

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

export type Dam = typeof dam.$inferSelect;
export type NewDam = typeof dam.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
