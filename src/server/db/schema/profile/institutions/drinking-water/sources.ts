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
import { waterQualityEnum } from "../common";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define drinking water source type enum
export const drikingWaterSourceTypeEnum = pgEnum("drinking_water_source_type", [
  "SPRING",
  "STREAM",
  "RIVER",
  "LAKE",
  "WELL",
  "DEEP_BORING",
  "SHALLOW_TUBEWELL",
  "RAINWATER_HARVESTING",
  "MUNICIPAL_SUPPLY",
  "GLACIAL_MELT",
  "RESERVOIR",
  "TANKER_SUPPLY",
  "JAR_WATER",
  "SURFACE_WATER",
  "GROUNDWATER",
  "OTHER",
]);

// Define water source protection status enum
export const waterSourceProtectionStatusEnum = pgEnum(
  "water_source_protection_status",
  [
    "FULLY_PROTECTED",
    "PARTIALLY_PROTECTED",
    "MINIMAL_PROTECTION",
    "NO_PROTECTION",
    "UNDER_DEVELOPMENT",
  ],
);

// Define water source reliability enum
export const sourceReliabilityEnum = pgEnum("source_reliability", [
  "PERENNIAL",
  "SEASONAL",
  "INTERMITTENT",
  "UNRELIABLE",
  "DECLINING",
]);

// Define water treatment method enum
export const treatmentMethodEnum = pgEnum("treatment_method", [
  "CHLORINATION",
  "FILTRATION",
  "UV_TREATMENT",
  "BOILING",
  "SEDIMENTATION",
  "FLOCCULATION",
  "COAGULATION",
  "SLOW_SAND_FILTRATION",
  "RAPID_SAND_FILTRATION",
  "REVERSE_OSMOSIS",
  "SOLAR_DISINFECTION",
  "OZONATION",
  "NO_TREATMENT",
  "MULTIPLE_METHODS",
  "OTHER",
]);

// Define water source ownership enum
export const waterSourceOwnershipEnum = pgEnum("water_source_ownership", [
  "GOVERNMENT",
  "COMMUNITY",
  "PRIVATE",
  "WATER_USER_GROUP",
  "NGO",
  "MUNICIPALITY",
  "WATER_AUTHORITY",
  "MULTIPLE_OWNERSHIP",
  "DISPUTED",
  "OTHER",
]);

// Drinking Water Source table
export const drinkingWaterSource = pgTable("drinking_water_source", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  sourceType: drikingWaterSourceTypeEnum("source_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  elevationMeters: decimal("elevation_meters", { precision: 9, scale: 2 }),

  // Source details
  sourceCode: text("source_code"), // Unique identification code if exists
  averageYieldLPM: decimal("average_yield_lpm", { precision: 10, scale: 2 }), // Liters Per Minute
  minimumYieldLPM: decimal("minimum_yield_lpm", { precision: 10, scale: 2 }),
  maximumYieldLPM: decimal("maximum_yield_lpm", { precision: 10, scale: 2 }),
  yieldMeasurementDate: date("yield_measurement_date"),
  reliability: sourceReliabilityEnum("reliability"),
  seasonalVariation: text("seasonal_variation"), // Description of how yield varies by season
  catchmentAreaSqKm: decimal("catchment_area_sq_km", {
    precision: 10,
    scale: 2,
  }),

  // Water quality
  waterQuality: waterQualityEnum("water_quality"),
  lastTestedDate: date("last_tested_date"),
  testingFrequency: text("testing_frequency"), // E.g., "Monthly", "Quarterly", etc.
  testingParameters: text("testing_parameters"), // Which parameters are regularly tested
  eColiPresent: boolean("e_coli_present"),
  turbidityNTU: decimal("turbidity_ntu", { precision: 7, scale: 2 }), // Nephelometric Turbidity Units
  pHLevel: decimal("ph_level", { precision: 4, scale: 2 }),
  tdsLevelPPM: integer("tds_level_ppm"), // Total Dissolved Solids (Parts Per Million)
  arsenicLevelPPB: decimal("arsenic_level_ppb", { precision: 7, scale: 2 }), // Parts Per Billion
  ironContentPPM: decimal("iron_content_ppm", { precision: 7, scale: 2 }),
  fluorideContentPPM: decimal("fluoride_content_ppm", {
    precision: 7,
    scale: 2,
  }),
  nitrateContentPPM: decimal("nitrate_content_ppm", { precision: 7, scale: 2 }),
  hardnessPPM: decimal("hardness_ppm", { precision: 7, scale: 2 }),
  chlorineResidualPPM: decimal("chlorine_residual_ppm", {
    precision: 7,
    scale: 2,
  }),
  otherContaminants: text("other_contaminants"),
  qualityIssues: text("quality_issues"), // Description of any known quality issues

  // Treatment
  hasTreatmentSystem: boolean("has_treatment_system").default(false),
  treatmentMethods: jsonb("treatment_methods").default(sql`'[]'::jsonb`), // Array of treatment methods
  treatmentCapacityLPM: decimal("treatment_capacity_lpm", {
    precision: 10,
    scale: 2,
  }),
  treatmentEfficiency: text("treatment_efficiency"),
  treatmentSystemInstallDate: date("treatment_system_install_date"),
  treatmentSystemCondition: text("treatment_system_condition"),

  // Protection and conservation
  protectionStatus: waterSourceProtectionStatusEnum("protection_status"),
  protectionMeasures: text("protection_measures"),
  hasSourceFencing: boolean("has_source_fencing").default(false),
  hasVegetationBuffer: boolean("has_vegetation_buffer").default(false),
  bufferZoneRadiusM: decimal("buffer_zone_radius_m", {
    precision: 7,
    scale: 2,
  }),
  contaminationRisks: text("contamination_risks"),
  conservationEfforts: text("conservation_efforts"),
  watershedManagementPractices: text("watershed_management_practices"),

  // Infrastructure at source
  hasIntakeDam: boolean("has_intake_dam").default(false),
  intakeConstructionYear: integer("intake_construction_year"),
  intakeStructureDetails: text("intake_structure_details"),
  hasScreening: boolean("has_screening").default(false),
  hasSedimentation: boolean("has_sedimentation").default(false),
  hasCollectionChamber: boolean("has_collection_chamber").default(false),
  collectionChamberCapacityLitres: decimal(
    "collection_chamber_capacity_litres",
    { precision: 10, scale: 2 },
  ),
  hasMeteringSystem: boolean("has_metering_system").default(false),
  meterType: text("meter_type"),

  // Management and governance
  ownership: waterSourceOwnershipEnum("ownership"),
  managedBy: text("managed_by"), // Organization name
  yearIdentified: integer("year_identified"),
  yearDeveloped: integer("year_developed"),
  developedBy: text("developed_by"), // Organization that developed the source
  hasWaterUserCommittee: boolean("has_water_user_committee").default(false),
  waterUserCommitteeName: text("water_user_committee_name"),
  committeeFormationDate: date("committee_formation_date"),
  committeeMemberCount: integer("committee_member_count"),
  femaleCommitteeMembers: integer("female_committee_members"),
  accessRights: text("access_rights"), // Who has rights to access the source
  waterRightsCertificate: boolean("water_rights_certificate").default(false),

  // Usage
  servesPopulation: integer("serves_population"),
  servesHouseholds: integer("serves_households"),
  primaryUse: text("primary_use"), // E.g., "Drinking", "Multiple Use", etc.
  secondaryUses: text("secondary_uses"),
  isSharedResource: boolean("is_shared_resource").default(false),
  sharingArrangement: text("sharing_arrangement"),
  hasUsageConflicts: boolean("has_usage_conflicts").default(false),
  conflictDetails: text("conflict_details"),

  // Maintenance
  maintenanceResponsibility: text("maintenance_responsibility"),
  maintenanceFrequency: text("maintenance_frequency"),
  lastMaintenanceDate: date("last_maintenance_date"),
  maintenanceChallenges: text("maintenance_challenges"),
  annualMaintenanceCostNPR: decimal("annual_maintenance_cost_npr", {
    precision: 14,
    scale: 2,
  }),

  // Distribution
  isConnectedToNetwork: boolean("is_connected_to_network").default(false),
  connectedNetworkDetails: text("connected_network_details"),
  transportsWaterTo: text("transports_water_to"),
  transportMethodType: text("transport_method_type"), // Gravity flow, pumping, manual transport
  distanceToNearestTankM: decimal("distance_to_nearest_tank_m", {
    precision: 10,
    scale: 2,
  }),
  distanceToNearestUserM: decimal("distance_to_nearest_user_m", {
    precision: 10,
    scale: 2,
  }),

  // Pumping (if applicable)
  hasPumpingSystem: boolean("has_pumping_system").default(false),
  pumpType: text("pump_type"),
  pumpCapacityLPS: decimal("pump_capacity_lps", { precision: 8, scale: 2 }), // Liters Per Second
  pumpPowerSourceType: text("pump_power_source_type"), // Electricity, Solar, Diesel, Manual, etc.
  pumpInstallationYear: integer("pump_installation_year"),
  pumpBrand: text("pump_brand"),
  pumpCondition: text("pump_condition"),

  // Geographical and meteorological factors
  waterTableDepthM: decimal("water_table_depth_m", { precision: 8, scale: 2 }),
  waterTableFluctuationM: decimal("water_table_fluctuation_m", {
    precision: 7,
    scale: 2,
  }),
  affectedByDrought: boolean("affected_by_drought").default(false),
  droughtImpactDetails: text("drought_impact_details"),
  affectedByFlooding: boolean("affected_by_flooding").default(false),
  floodingImpactDetails: text("flooding_impact_details"),
  climateChangeImpacts: text("climate_change_impacts"),

  // Financial aspects
  developmentCostNPR: decimal("development_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  fundingSource: text("funding_source"),
  operatingCostMonthlyNPR: decimal("operating_cost_monthly_npr", {
    precision: 14,
    scale: 2,
  }),
  revenueSources: text("revenue_sources"),
  hasMaintenanceFund: boolean("has_maintenance_fund").default(false),
  maintenanceFundSizeNPR: decimal("maintenance_fund_size_npr", {
    precision: 14,
    scale: 2,
  }),
  waterPricingStructure: text("water_pricing_structure"),

  // Challenges and needs
  currentChallenges: text("current_challenges"),
  waterScarcityIssues: text("water_scarcity_issues"),
  qualityChallenges: text("quality_challenges"),
  infrastructureNeeds: text("infrastructure_needs"),
  managementChallenges: text("management_challenges"),

  // Future plans
  upgradePlans: text("upgrade_plans"),
  expansionPlans: text("expansion_plans"),
  protectionPlans: text("protection_plans"),
  sustainabilityMeasures: text("sustainability_measures"),

  // Contact information
  contactPersonName: text("contact_person_name"),
  contactPersonRole: text("contact_person_role"),
  contactPhone: text("contact_phone"),
  alternateContactName: text("alternate_contact_name"),
  alternateContactPhone: text("alternate_contact_phone"),

  // Linkages to other entities
  linkedWaterTanks: jsonb("linked_water_tanks").default(sql`'[]'::jsonb`),
  linkedTreatmentPlants: jsonb("linked_treatment_plants").default(
    sql`'[]'::jsonb`,
  ),
  linkedDistributionNetworks: jsonb("linked_distribution_networks").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),

  // Media and documentation
  hasSourceDocumentation: boolean("has_source_documentation").default(false),
  documentationDetails: text("documentation_details"),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  sourceArea: geometry("source_area", { type: "Polygon" }),
  catchmentArea: geometry("catchment_area", { type: "Polygon" }),

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

export type DrinkingWaterSource = typeof drinkingWaterSource.$inferSelect;
export type NewDrinkingWaterSource = typeof drinkingWaterSource.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
