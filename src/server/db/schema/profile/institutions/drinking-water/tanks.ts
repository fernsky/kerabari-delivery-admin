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

// Define water tank type enum
export const waterTankTypeEnum = pgEnum("water_tank_type", [
  "STORAGE_TANK",
  "BREAK_PRESSURE_TANK",
  "DISTRIBUTION_TANK",
  "COLLECTION_TANK",
  "SEDIMENTATION_TANK",
  "GROUND_LEVEL_RESERVOIR",
  "OVERHEAD_TANK",
  "UNDERGROUND_RESERVOIR",
  "CLEAR_WATER_RESERVOIR",
  "FILTERED_WATER_RESERVOIR",
  "RAW_WATER_TANK",
  "COMMUNITY_TANK",
  "HOUSEHOLD_TANK",
  "OTHER",
]);

// Define tank construction material enum
export const tankConstructionMaterialEnum = pgEnum(
  "tank_construction_material",
  [
    "REINFORCED_CONCRETE",
    "FERROCEMENT",
    "BRICK_AND_CEMENT",
    "STONE_MASONRY",
    "PLASTIC",
    "METAL",
    "FIBERGLASS",
    "HDPE",
    "PVC",
    "GALVANIZED_IRON",
    "STAINLESS_STEEL",
    "INTZE_TYPE",
    "MIXED_MATERIAL",
    "OTHER",
  ],
);

// Define tank condition enum
export const tankConditionEnum = pgEnum("tank_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_REPAIR",
  "NEEDS_REPLACEMENT",
  "UNDER_CONSTRUCTION",
  "NON_FUNCTIONING",
  "ABANDONED",
]);

// Define tank ownership enum
export const tankOwnershipEnum = pgEnum("tank_ownership", [
  "GOVERNMENT",
  "MUNICIPALITY",
  "WATER_USER_GROUP",
  "COMMUNITY",
  "PRIVATE",
  "NGO",
  "WATER_AUTHORITY",
  "MIXED_OWNERSHIP",
  "OTHER",
]);

// Drinking Water Tank table
export const drinkingWaterTank = pgTable("drinking_water_tank", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  tankType: waterTankTypeEnum("tank_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  elevationMeters: decimal("elevation_meters", { precision: 9, scale: 2 }),

  // Physical characteristics
  capacityLitres: decimal("capacity_litres", { precision: 12, scale: 2 }),
  lengthM: decimal("length_m", { precision: 6, scale: 2 }),
  widthM: decimal("width_m", { precision: 6, scale: 2 }),
  heightM: decimal("height_m", { precision: 6, scale: 2 }),
  diameterM: decimal("diameter_m", { precision: 6, scale: 2 }), // For circular tanks
  constructionMaterial: tankConstructionMaterialEnum("construction_material"),
  tankCondition: tankConditionEnum("tank_condition"),
  constructionYear: integer("construction_year"),
  lastRehabilitationYear: integer("last_rehabilitation_year"),
  tankShape: text("tank_shape"), // Rectangular, circular, oval, custom, etc.
  compartmentCount: integer("compartment_count"), // Number of internal divisions
  wallThicknessCM: decimal("wall_thickness_cm", { precision: 5, scale: 2 }),

  // Installation and structure details
  isElevated: boolean("is_elevated").default(false),
  heightAboveGroundM: decimal("height_above_ground_m", {
    precision: 6,
    scale: 2,
  }),
  supportStructureType: text("support_structure_type"), // Columns, tower, platform, etc.
  isUnderground: boolean("is_underground").default(false),
  depthBelowGroundM: decimal("depth_below_ground_m", {
    precision: 6,
    scale: 2,
  }),
  hasRoof: boolean("has_roof").default(true),
  roofMaterial: text("roof_material"),
  hasFencing: boolean("has_fencing").default(false),
  compoundAreaSqM: decimal("compound_area_sq_m", { precision: 8, scale: 2 }),

  // Functional characteristics
  inletCount: integer("inlet_count"),
  inletSizeInches: text("inlet_size_inches"),
  outletCount: integer("outlet_count"),
  outletSizeInches: text("outlet_size_inches"),
  hasOverflow: boolean("has_overflow").default(true),
  overflowSizeInches: text("overflow_size_inches"),
  overflowDischargeLocation: text("overflow_discharge_location"),
  hasWashout: boolean("has_washout").default(true),
  washoutSizeInches: text("washout_size_inches"),
  washoutDischargeLocation: text("washout_discharge_location"),
  hasVentilation: boolean("has_ventilation").default(true),
  ventilationType: text("ventilation_type"),
  hasWaterLevelIndicator: boolean("has_water_level_indicator").default(false),
  waterLevelIndicatorType: text("water_level_indicator_type"),

  // Water system integration
  isPartOfNetwork: boolean("is_part_of_network").default(true),
  networkName: text("network_name"),
  networkRole: text("network_role"), // Main storage, intermediate, terminal, etc.
  waterSource: text("water_source"), // Where water comes from
  waterSourceDistance: decimal("water_source_distance_m", {
    precision: 10,
    scale: 2,
  }),
  serviceAreaCoverage: text("service_area_coverage"), // Areas served by this tank
  servesPopulation: integer("serves_population"),
  servesHouseholds: integer("serves_households"),

  // Flow characteristics
  averageInflowLPM: decimal("average_inflow_lpm", { precision: 10, scale: 2 }), // Liters per minute
  peakInflowLPM: decimal("peak_inflow_lpm", { precision: 10, scale: 2 }),
  averageOutflowLPM: decimal("average_outflow_lpm", {
    precision: 10,
    scale: 2,
  }),
  peakOutflowLPM: decimal("peak_outflow_lpm", { precision: 10, scale: 2 }),
  flowMeasurementDate: date("flow_measurement_date"),
  hasFlowMeters: boolean("has_flow_meters").default(false),
  inflowMeterType: text("inflow_meter_type"),
  outflowMeterType: text("outflow_meter_type"),

  // Water treatment
  hasTreatmentSystem: boolean("has_treatment_system").default(false),
  treatmentSystemType: text("treatment_system_type"),
  hasChlorination: boolean("has_chlorination").default(false),
  chlorinationType: text("chlorination_type"), // Manual, automatic, etc.
  chlorinationFrequency: text("chlorination_frequency"),
  otherTreatmentMethods: text("other_treatment_methods"),
  hasWaterQualityTesting: boolean("has_water_quality_testing").default(false),
  testingFrequency: text("testing_frequency"),
  lastTestedDate: date("last_tested_date"),

  // Automation and monitoring
  hasAutomatedControls: boolean("has_automated_controls").default(false),
  controlSystemDetails: text("control_system_details"),
  hasRemoteMonitoring: boolean("has_remote_monitoring").default(false),
  monitoringParameters: text("monitoring_parameters"), // Level, flow, quality, etc.
  hasAlarmSystem: boolean("has_alarm_system").default(false),
  alarmSystemDetails: text("alarm_system_details"),

  // Management and governance
  ownership: tankOwnershipEnum("ownership"),
  managedBy: text("managed_by"), // Organization name
  managingGroupName: text("managing_group_name"),
  yearConstructed: integer("year_constructed"),
  constructedBy: text("constructed_by"), // Organization that built the tank
  fundingSource: text("funding_source"),
  projectName: text("project_name"),
  constructionCostNPR: decimal("construction_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  rehabilitationCostNPR: decimal("rehabilitation_cost_npr", {
    precision: 14,
    scale: 2,
  }),

  // Maintenance
  maintenanceResponsibility: text("maintenance_responsibility"),
  maintenanceFrequency: text("maintenance_frequency"),
  cleaningFrequency: text("cleaning_frequency"),
  lastMaintenanceDate: date("last_maintenance_date"),
  lastCleaningDate: date("last_cleaning_date"),
  maintenanceChallenges: text("maintenance_challenges"),
  annualMaintenanceCostNPR: decimal("annual_maintenance_cost_npr", {
    precision: 14,
    scale: 2,
  }),

  // Security and safety
  hasSecuritySystem: boolean("has_security_system").default(false),
  securitySystemType: text("security_system_type"),
  hasAccessControl: boolean("has_access_control").default(false),
  accessControlMethod: text("access_control_method"),
  hasLighting: boolean("has_lighting").default(false),
  lightingType: text("lighting_type"),
  hasCCTV: boolean("has_cctv").default(false),
  hasCaretaker: boolean("has_caretaker").default(false),
  caretakerName: text("caretaker_name"),
  caretakerContactNumber: text("caretaker_contact_number"),

  // Energy and power
  requiresElectricity: boolean("requires_electricity").default(false),
  powerSource: text("power_source"), // Grid, solar, etc.
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"),
  monthlyEnergyConsumptionKWh: decimal("monthly_energy_consumption_kwh", {
    precision: 10,
    scale: 2,
  }),
  monthlyEnergyCostNPR: decimal("monthly_energy_cost_npr", {
    precision: 10,
    scale: 2,
  }),

  // Environmental aspects
  environmentalConcerns: text("environmental_concerns"),
  drainageSystem: text("drainage_system"),
  landscapingFeatures: text("landscaping_features"),
  hasErosionControl: boolean("has_erosion_control").default(false),
  erosionControlMeasures: text("erosion_control_measures"),

  // Challenges and issues
  structuralIssues: text("structural_issues"),
  leakageIssues: text("leakage_issues"),
  operationalChallenges: text("operational_challenges"),
  contaminationRisks: text("contamination_risks"),
  reportedProblems: text("reported_problems"),

  // Future plans
  plannedUpgrades: text("planned_upgrades"),
  expansionPlans: text("expansion_plans"),
  replacementPlans: text("replacement_plans"),
  estimatedRemainingLifeYears: integer("estimated_remaining_life_years"),

  // Contact information
  contactPersonName: text("contact_person_name"),
  contactPersonRole: text("contact_person_role"),
  contactPhone: text("contact_phone"),
  alternateContactName: text("alternate_contact_name"),
  alternateContactPhone: text("alternate_contact_phone"),

  // Linkages to other entities
  linkedWaterSources: jsonb("linked_water_sources").default(sql`'[]'::jsonb`),
  linkedDistributionNetworks: jsonb("linked_distribution_networks").default(
    sql`'[]'::jsonb`,
  ),
  linkedTreatmentFacilities: jsonb("linked_treatment_facilities").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  tankFootprint: geometry("tank_footprint", { type: "Polygon" }),
  compoundBoundary: geometry("compound_boundary", { type: "Polygon" }),

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

export type DrinkingWaterTank = typeof drinkingWaterTank.$inferSelect;
export type NewDrinkingWaterTank = typeof drinkingWaterTank.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
