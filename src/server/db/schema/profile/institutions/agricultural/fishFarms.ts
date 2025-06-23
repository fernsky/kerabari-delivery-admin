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
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";
import { ownershipTypeEnum } from "./common";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define fish farm type enum
export const fishFarmTypeEnum = pgEnum("fish_farm_type", [
  "POND_CULTURE",
  "CAGE_CULTURE",
  "TANK_CULTURE",
  "RACEWAY_CULTURE",
  "RECIRCULATING_AQUACULTURE_SYSTEM",
  "HATCHERY",
  "NURSERY",
  "INTEGRATED_FARMING",
  "RICE_FISH_CULTURE",
  "ORNAMENTAL_FISH_FARM",
  "RESEARCH_FACILITY",
  "MIXED",
  "OTHER",
]);

// Define water source enum
export const fishFarmWaterSourceEnum = pgEnum("fish_water_source_type", [
  "RIVER",
  "STREAM",
  "SPRING",
  "WELL",
  "GROUNDWATER",
  "RAINWATER",
  "CANAL",
  "RESERVOIR",
  "LAKE",
  "MIXED",
]);

// Define feeding system enum
export const feedingSystemEnum = pgEnum("feeding_system", [
  "MANUAL",
  "AUTOMATIC",
  "DEMAND_FEEDER",
  "SUPPLEMENTARY",
  "NATURAL_FOOD_ONLY",
  "MIXED",
]);

// Define water management system enum
export const waterManagementEnum = pgEnum("water_management_system", [
  "STATIC",
  "FLOW_THROUGH",
  "RECIRCULATING",
  "AERATED",
  "INTEGRATED",
  "MIXED",
]);

// Define culture system enum
export const cultureSystemEnum = pgEnum("culture_system", [
  "EXTENSIVE",
  "SEMI_INTENSIVE",
  "INTENSIVE",
  "SUPER_INTENSIVE",
  "POLYCULTURE",
  "MONOCULTURE",
]);

// Fish Farm table
export const fishFarm = pgTable("fish_farm", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  farmType: fishFarmTypeEnum("farm_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Physical details
  ownershipType: ownershipTypeEnum("ownership_type"),
  totalAreaInHectares: decimal("total_area_in_hectares", {
    precision: 10,
    scale: 2,
  }),
  waterSurfaceAreaInHectares: decimal("water_surface_area_in_hectares", {
    precision: 10,
    scale: 2,
  }),
  operationalSince: integer("operational_since"), // Year

  // Water body characteristics
  totalPondCount: integer("total_pond_count"),
  activePondCount: integer("active_pond_count"),
  averagePondSizeInSquareMeters: decimal("average_pond_size_in_square_meters", {
    precision: 10,
    scale: 2,
  }),
  averageWaterDepthInMeters: decimal("average_water_depth_in_meters", {
    precision: 5,
    scale: 2,
  }),
  totalWaterVolumeInCubicMeters: decimal("total_water_volume_in_cubic_meters", {
    precision: 12,
    scale: 2,
  }),
  waterSource: fishFarmWaterSourceEnum("water_source"),
  waterSourceDetails: text("water_source_details"),
  waterAvailabilityIssues: text("water_availability_issues"),
  hasWaterQualityMonitoring: boolean("has_water_quality_monitoring").default(
    false,
  ),
  waterQualityParameters: text("water_quality_parameters"), // E.g., "pH, DO, Temperature, Ammonia"

  // Culture and management details
  cultureSystem: cultureSystemEnum("culture_system"),
  primaryFishSpecies: text("primary_fish_species"), // E.g., "Carp, Tilapia, Catfish"
  secondaryFishSpecies: text("secondary_fish_species"),
  seedSourceDetails: text("seed_source_details"),
  stockingDensityPerSquareMeter: decimal("stocking_density_per_square_meter", {
    precision: 8,
    scale: 2,
  }),
  growoutPeriodInMonths: integer("growout_period_in_months"),
  feedingSystem: feedingSystemEnum("feeding_system"),
  feedTypes: text("feed_types"), // E.g., "Commercial pellet, Farm-made, Natural"
  feedConversionRatio: decimal("feed_conversion_ratio", {
    precision: 5,
    scale: 2,
  }),
  annualFeedUsageInKg: decimal("annual_feed_usage_in_kg", {
    precision: 10,
    scale: 2,
  }),

  // Water management
  waterManagementSystem: waterManagementEnum("water_management_system"),
  usesProbiotics: boolean("uses_probiotics").default(false),
  usesAeration: boolean("uses_aeration").default(false),
  aerationType: text("aeration_type"), // E.g., "Paddle wheel, Air diffuser, Jet aerator"
  waterExchangeFrequency: text("water_exchange_frequency"), // E.g., "Daily, Weekly, Monthly"
  waterExchangePercentage: integer("water_exchange_percentage"), // 0-100
  effluentManagementDetails: text("effluent_management_details"),

  // Production details
  annualProductionInKg: decimal("annual_production_in_kg", {
    precision: 12,
    scale: 2,
  }),
  averageYieldPerHectareInKg: decimal("average_yield_per_hectare_in_kg", {
    precision: 10,
    scale: 2,
  }),
  survivalRatePercentage: integer("survival_rate_percentage"), // 0-100
  averageFishSizeInGrams: decimal("average_fish_size_in_grams", {
    precision: 8,
    scale: 2,
  }),
  recordedYearProduction: varchar("recorded_year_production", { length: 4 }),
  productionCycles: integer("production_cycles_per_year"), // Number of harvests per year

  // Infrastructure and equipment
  hasFarmHouse: boolean("has_farm_house").default(false),
  hasHatchery: boolean("has_hatchery").default(false),
  hatcheryCapacity: integer("hatchery_capacity_million_fry"), // Capacity in million fry
  hasNursery: boolean("has_nursery").default(false),
  nurseryAreaInSquareMeters: decimal("nursery_area_in_square_meters", {
    precision: 10,
    scale: 2,
  }),
  hasFeedStorage: boolean("has_feed_storage").default(false),
  hasEquipment: boolean("has_equipment").default(false),
  equipmentDetails: text("equipment_details"),
  hasLaboratory: boolean("has_laboratory").default(false),
  laboratoryPurpose: text("laboratory_purpose"),
  hasIceProduction: boolean("has_ice_production").default(false),
  hasProcessingArea: boolean("has_processing_area").default(false),
  hasElectricity: boolean("has_electricity").default(false),
  hasGenerator: boolean("has_generator").default(false),
  hasFencing: boolean("has_fencing").default(false),
  hasSecuritySystem: boolean("has_security_system").default(false),

  // Personnel and management
  ownerName: text("owner_name"),
  ownerContact: text("owner_contact"),
  managerName: text("manager_name"),
  managerContact: text("manager_contact"),
  technicalStaffCount: integer("technical_staff_count"),
  regularStaffCount: integer("regular_staff_count"),
  seasonalLaborCount: integer("seasonal_labor_count"),
  hasTrainedStaff: boolean("has_trained_staff").default(false),
  trainingDetails: text("training_details"),

  // Economic aspects
  annualOperatingCostNPR: decimal("annual_operating_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  annualRevenueNPR: decimal("annual_revenue_npr", { precision: 14, scale: 2 }),
  profitableOperation: boolean("profitable_operation").default(true),
  marketAccessDetails: text("market_access_details"),
  majorBuyerTypes: text("major_buyer_types"), // E.g., "Local market, Wholesalers, Exports"
  averageSellingPricePerKg: decimal("average_selling_price_per_kg", {
    precision: 8,
    scale: 2,
  }),

  // Health management
  commonDiseases: text("common_diseases"),
  diseasePreventionMethods: text("disease_prevention_methods"),
  usesChemicals: boolean("uses_chemicals").default(false),
  chemicalUsageDetails: text("chemical_usage_details"),
  mortalityPercentage: integer("mortality_percentage"), // 0-100
  healthMonitoringFrequency: text("health_monitoring_frequency"), // E.g., "Daily, Weekly, Monthly"

  // Sustainability aspects
  hasEnvironmentalImpactAssessment: boolean(
    "has_environmental_impact_assessment",
  ).default(false),
  usesRenewableEnergy: boolean("uses_renewable_energy").default(false),
  renewableEnergyDetails: text("renewable_energy_details"),
  wasteManagementPractices: text("waste_management_practices"),
  hasCertifications: boolean("has_certifications").default(false),
  certificationDetails: text("certification_details"), // E.g., "Organic, BAP, ASC"

  // Challenges and support
  majorConstraints: text("major_constraints"),
  disasterVulnerabilities: text("disaster_vulnerabilities"), // E.g., "Floods, Drought, Disease"
  receivesGovernmentSupport: boolean("receives_government_support").default(
    false,
  ),
  governmentSupportDetails: text("government_support_details"),
  receivesNGOSupport: boolean("receives_ngo_support").default(false),
  ngoSupportDetails: text("ngo_support_details"),
  technicalSupportNeeds: text("technical_support_needs"),

  // Future plans
  expansionPlans: text("expansion_plans"),
  diversificationPlans: text("diversification_plans"),
  technologyUpgradePlans: text("technology_upgrade_plans"),

  // Linkages to other entities
  linkedProcessingCenters: jsonb("linked_processing_centers").default(
    sql`'[]'::jsonb`,
  ),
  linkedWaterBodies: jsonb("linked_water_bodies").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"), // SEO meta title
  metaDescription: text("meta_description"), // SEO meta description
  keywords: text("keywords"), // SEO keywords

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  farmBoundary: geometry("farm_boundary", { type: "Polygon" }),
  pondPolygons: geometry("pond_polygons", { type: "MultiPolygon" }), // Multiple pond boundaries

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

export type FishFarm = typeof fishFarm.$inferSelect;
export type NewFishFarm = typeof fishFarm.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
