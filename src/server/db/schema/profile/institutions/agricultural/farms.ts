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
import { generateSlug } from "@/server/utils/slug-helpers";

// Define farm type enum
export const farmTypeEnum = pgEnum("farm_type", [
  "CROP_FARM",
  "LIVESTOCK_FARM",
  "MIXED_FARM",
  "POULTRY_FARM",
  "DAIRY_FARM",
  "AQUACULTURE_FARM",
  "HORTICULTURE_FARM",
  "APICULTURE_FARM",
  "SERICULTURE_FARM",
  "ORGANIC_FARM",
  "COMMERCIAL_FARM",
  "SUBSISTENCE_FARM",
  "AGROFORESTRY",
  "OTHER",
]);

// Define farming system enum
export const farmingSystemEnum = pgEnum("farming_system", [
  "CONVENTIONAL",
  "ORGANIC",
  "INTEGRATED",
  "CONSERVATION",
  "HYDROPONIC",
  "PERMACULTURE",
  "BIODYNAMIC",
  "TRADITIONAL",
  "MIXED",
]);

// Define irrigation type enum
export const irrigationTypeEnum = pgEnum("irrigation_type", [
  "RAINFED",
  "CANAL",
  "DRIP",
  "SPRINKLER",
  "FLOOD",
  "GROUNDWATER",
  "RAINWATER_HARVESTING",
  "NONE",
  "MIXED",
]);

// Define soil type enum
export const soilTypeEnum = pgEnum("soil_type", [
  "CLAY",
  "SANDY",
  "LOAM",
  "SILT",
  "CLAY_LOAM",
  "SANDY_LOAM",
  "SILTY_CLAY",
  "ROCKY",
  "PEATY",
  "CHALKY",
  "MIXED",
]);

// Define livestock housing enum
export const livestockHousingEnum = pgEnum("livestock_housing", [
  "OPEN_SHED",
  "BARN",
  "FREE_STALL",
  "TIE_STALL",
  "DEEP_LITTER",
  "CAGE_SYSTEM",
  "FREE_RANGE",
  "MOVABLE_PEN",
  "ZERO_GRAZING",
  "MIXED",
]);

// Define land ownership enum
export const landOwnershipEnum = pgEnum("land_ownership", [
  "OWNED",
  "LEASED",
  "COMMUNITY",
  "SHARED",
  "GOVERNMENT",
  "MIXED",
]);

// Agricultural and Livestock Farm table
export const farm = pgTable("farm", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  farmType: farmTypeEnum("farm_type").notNull(),
  farmingSystem: farmingSystemEnum("farming_system"),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Land details
  totalAreaInHectares: decimal("total_area_in_hectares", {
    precision: 10,
    scale: 2,
  }),
  cultivatedAreaInHectares: decimal("cultivated_area_in_hectares", {
    precision: 10,
    scale: 2,
  }),
  landOwnership: landOwnershipEnum("land_ownership"),
  soilType: soilTypeEnum("soil_type"),
  irrigationType: irrigationTypeEnum("irrigation_type"),
  irrigationSourceDetails: text("irrigation_source_details"),
  irrigatedAreaInHectares: decimal("irrigated_area_in_hectares", {
    precision: 10,
    scale: 2,
  }),

  // Crops
  mainCrops: text("main_crops"), // E.g., "Rice, Wheat, Maize"
  secondaryCrops: text("secondary_crops"), // E.g., "Vegetables, Pulses"
  cropRotation: boolean("crop_rotation").default(false),
  cropRotationDetails: text("crop_rotation_details"),
  intercropping: boolean("intercropping").default(false),
  croppingSeasons: text("cropping_seasons"), // E.g., "Summer, Winter, Year-round"
  annualCropYieldMT: decimal("annual_crop_yield_mt", {
    precision: 10,
    scale: 2,
  }), // Metric Tons
  recordedYearCrops: varchar("recorded_year_crops", { length: 4 }),

  // Livestock
  hasLivestock: boolean("has_livestock").default(false),
  livestockTypes: text("livestock_types"), // E.g., "Cattle, Goats, Poultry"
  cattleCount: integer("cattle_count"),
  buffaloCount: integer("buffalo_count"),
  goatCount: integer("goat_count"),
  sheepCount: integer("sheep_count"),
  pigCount: integer("pig_count"),
  poultryCount: integer("poultry_count"),
  otherLivestockCount: integer("other_livestock_count"),
  otherLivestockDetails: text("other_livestock_details"),
  livestockHousingType: livestockHousingEnum("livestock_housing_type"),
  livestockManagementDetails: text("livestock_management_details"),
  annualMilkProductionLiters: decimal("annual_milk_production_liters", {
    precision: 12,
    scale: 2,
  }),
  annualEggProduction: integer("annual_egg_production"),
  annualMeatProductionKg: decimal("annual_meat_production_kg", {
    precision: 10,
    scale: 2,
  }),
  recordedYearLivestock: varchar("recorded_year_livestock", { length: 4 }),

  // Farmer details
  ownerName: text("owner_name"),
  ownerContact: text("owner_contact"),
  farmerType: text("farmer_type"), // E.g., "Commercial, Subsistence, Cooperative member"
  farmerEducation: text("farmer_education"), // Highest education level
  farmerExperienceYears: integer("farmer_experience_years"),
  hasCooperativeMembership: boolean("has_cooperative_membership").default(
    false,
  ),
  cooperativeName: text("cooperative_name"),

  // Labor and economics
  familyLaborCount: integer("family_labor_count"),
  hiredLaborCount: integer("hired_labor_count"),
  annualInvestmentNPR: decimal("annual_investment_npr", {
    precision: 14,
    scale: 2,
  }),
  annualIncomeNPR: decimal("annual_income_npr", {
    precision: 14,
    scale: 2,
  }),
  profitableOperation: boolean("profitable_operation").default(true),
  marketAccessDetails: text("market_access_details"),
  majorBuyerTypes: text("major_buyer_types"), // E.g., "Local market, Wholesalers, Cooperatives"

  // Infrastructure
  hasFarmHouse: boolean("has_farm_house").default(false),
  hasStorage: boolean("has_storage").default(false),
  storageCapacityMT: decimal("storage_capacity_mt", {
    precision: 10,
    scale: 2,
  }),
  hasFarmEquipment: boolean("has_farm_equipment").default(false),
  equipmentDetails: text("equipment_details"),
  hasElectricity: boolean("has_electricity").default(false),
  hasRoadAccess: boolean("has_road_access").default(false),
  roadAccessType: text("road_access_type"), // E.g., "Paved, Dirt, Seasonal"

  // Sustainability and practices
  usesChemicalFertilizer: boolean("uses_chemical_fertilizer").default(false),
  usesPesticides: boolean("uses_pesticides").default(false),
  usesOrganicMethods: boolean("uses_organic_methods").default(false),
  composting: boolean("composting").default(false),
  soilConservationPractices: text("soil_conservation_practices"),
  rainwaterHarvesting: boolean("rainwater_harvesting").default(false),
  manureManagement: text("manure_management"),
  hasCertifications: boolean("has_certifications").default(false),
  certificationDetails: text("certification_details"),

  // Technical support and training
  receivesExtensionServices: boolean("receives_extension_services").default(
    false,
  ),
  extensionServiceProvider: text("extension_service_provider"),
  trainingReceived: text("training_received"),
  technicalSupportNeeds: text("technical_support_needs"),

  // Challenges and opportunities
  majorChallenges: text("major_challenges"),
  disasterVulnerabilities: text("disaster_vulnerabilities"), // E.g., "Floods, Drought, Landslides"
  growthOpportunities: text("growth_opportunities"),
  futureExpansionPlans: text("future_expansion_plans"),

  // Linkages to other entities
  linkedGrazingAreas: jsonb("linked_grazing_areas").default(sql`'[]'::jsonb`),
  linkedProcessingCenters: jsonb("linked_processing_centers").default(
    sql`'[]'::jsonb`,
  ),
  linkedAgricZones: jsonb("linked_agric_zones").default(sql`'[]'::jsonb`),
  linkedGrasslands: jsonb("linked_grasslands").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"), // SEO meta title
  metaDescription: text("meta_description"), // SEO meta description
  keywords: text("keywords"), // SEO keywords

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  farmBoundary: geometry("farm_boundary", { type: "Polygon" }),

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

export type Farm = typeof farm.$inferSelect;
export type NewFarm = typeof farm.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
