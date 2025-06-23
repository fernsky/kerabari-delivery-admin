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
import { mineOperationalStatusEnum, safetyRecordEnum } from "./metal-mines";
import { ownershipTypeEnum } from "../agricultural";
import { environmentalImpactLevelEnum } from "../common";

// Define quarry material type enum
export const quarryMaterialTypeEnum = pgEnum("quarry_material_type", [
  "CRUSHED_STONE",
  "SLATE",
  "GRAVEL",
  "SAND",
  "ORDINARY_STONE",
  "LIMESTONE",
  "MARBLE",
  "GRANITE",
  "SANDSTONE",
  "CLAY",
  "SHALE",
  "DOLOMITE",
  "LATERITE",
  "RIVER_STONE",
  "BALLAST",
  "PEBBLES",
  "BOULDER",
  "MIXED_AGGREGATES",
  "OTHER",
]);

// Define quarry extraction method enum
export const quarryExtractionMethodEnum = pgEnum("quarry_extraction_method", [
  "OPEN_PIT",
  "TERRACED",
  "STRIP_MINING",
  "RIVER_BED_EXTRACTION",
  "HILLSIDE_CUTTING",
  "BLASTING",
  "MECHANICAL_EXCAVATION",
  "MANUAL_EXTRACTION",
  "MIXED",
  "OTHER",
]);

// Define material quality enum
export const materialQualityEnum = pgEnum("material_quality", [
  "PREMIUM",
  "HIGH",
  "STANDARD",
  "LOW",
  "MIXED",
  "UNGRADED",
]);

// Define material use enum
export const materialUseEnum = pgEnum("material_use", [
  "CONSTRUCTION",
  "ROAD_BUILDING",
  "CONCRETE_PRODUCTION",
  "BRICK_MAKING",
  "DECORATIVE",
  "LANDSCAPING",
  "INDUSTRIAL",
  "CEMENT_PRODUCTION",
  "RAILWAY_BALLAST",
  "FOUNDATION_WORK",
  "MULTIPLE_USES",
  "OTHER",
]);

// Quarry table
export const quarry = pgTable("quarry", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  materialType: quarryMaterialTypeEnum("material_type").notNull(),
  otherMaterialTypes: jsonb("other_material_types").default(sql`'[]'::jsonb`), // Secondary materials extracted

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Specific area name
  address: text("address"),
  elevation: decimal("elevation", { precision: 10, scale: 2 }), // Elevation in meters
  terrainType: text("terrain_type"),

  // Operational details
  operationalStatus: mineOperationalStatusEnum("operational_status").notNull(),
  operationStartYear: integer("operation_start_year"),
  estimatedLifespanYears: integer("estimated_lifespan_years"),
  extractionMethod: quarryExtractionMethodEnum("extraction_method").notNull(),
  materialQuality: materialQualityEnum("material_quality"),
  primaryUse: materialUseEnum("primary_use").notNull(),
  secondaryUses: jsonb("secondary_uses").default(sql`'[]'::jsonb`),
  geologicalFormation: text("geological_formation"),

  // Ownership and management
  ownershipType: ownershipTypeEnum("ownership_type").notNull(),
  ownerOrganization: text("owner_organization"),
  operatorOrganization: text("operator_organization"),
  licenseNumber: varchar("license_number", { length: 50 }),
  licenseIssueDate: date("license_issue_date"),
  licenseExpiryDate: date("license_expiry_date"),
  licensingAuthority: text("licensing_authority"),
  isLocalGovernmentApproved: boolean("is_local_government_approved").default(
    false,
  ),
  operationSchedule: text("operation_schedule"), // E.g., "Seasonal", "Year-round", "Daytime only"

  // Production data
  inProduction: boolean("in_production").default(false),
  annualProductionCubicMeters: decimal("annual_production_cubic_meters", {
    precision: 12,
    scale: 2,
  }),
  annualProductionTons: decimal("annual_production_tons", {
    precision: 12,
    scale: 2,
  }),
  productionCapacityCubicMeters: decimal("production_capacity_cubic_meters", {
    precision: 12,
    scale: 2,
  }),
  totalReserveEstimateCubicMeters: decimal(
    "total_reserve_estimate_cubic_meters",
    { precision: 14, scale: 2 },
  ),
  materialSpecifications: text("material_specifications"), // Size, composition, etc.
  annualOutputValueNPR: decimal("annual_output_value_npr", {
    precision: 18,
    scale: 2,
  }),

  // Processing and logistics
  hasOnSiteProcessing: boolean("has_on_site_processing").default(false),
  processingMethodDetails: text("processing_method_details"),
  hasCrusher: boolean("has_crusher").default(false),
  hasScreeningUnit: boolean("has_screening_unit").default(false),
  hasWashingUnit: boolean("has_washing_unit").default(false),
  hasSorter: boolean("has_sorter").default(false),
  transportationMethods: text("transportation_methods"),
  averageHaulDistanceKm: decimal("average_haul_distance_km", {
    precision: 8,
    scale: 2,
  }),
  marketDistributionAreas: text("market_distribution_areas"),

  // Employment
  totalEmployeeCount: integer("total_employee_count"),
  localEmployeeCount: integer("local_employee_count"),
  femaleEmployeeCount: integer("female_employee_count"),
  technicalStaffCount: integer("technical_staff_count"),
  administrativeStaffCount: integer("administrative_staff_count"),
  laborerCount: integer("laborer_count"),
  seasonalWorkerCount: integer("seasonal_worker_count"),
  averageMonthlyWageNPR: decimal("average_monthly_wage_npr", {
    precision: 10,
    scale: 2,
  }),

  // Infrastructure
  hasPowerSupply: boolean("has_power_supply").default(false),
  powerSupplySource: text("power_supply_source"),
  powerUsageKWH: decimal("power_usage_kwh", { precision: 12, scale: 2 }),
  hasWaterSupply: boolean("has_water_supply").default(false),
  waterSourceType: text("water_source_type"),
  waterUsageLitersPerDay: decimal("water_usage_liters_per_day", {
    precision: 14,
    scale: 2,
  }),
  hasAdminBuilding: boolean("has_admin_building").default(false),
  hasWorkshops: boolean("has_workshops").default(false),
  hasWeighbridge: boolean("has_weighbridge").default(false),
  hasMaterialStorageYard: boolean("has_material_storage_yard").default(false),
  storageCapacityCubicMeters: decimal("storage_capacity_cubic_meters", {
    precision: 12,
    scale: 2,
  }),
  accessRoadType: text("access_road_type"),
  accessRoadCondition: text("access_road_condition"),
  distanceFromHighwayKm: decimal("distance_from_highway_km", {
    precision: 8,
    scale: 2,
  }),

  // Equipment
  majorEquipmentTypes: text("major_equipment_types"),
  excavatorCount: integer("excavator_count"),
  loaderCount: integer("loader_count"),
  dumpTruckCount: integer("dump_truck_count"),
  crusherCapacityTonsPerHour: decimal("crusher_capacity_tons_per_hour", {
    precision: 10,
    scale: 2,
  }),
  usesExplosives: boolean("uses_explosives").default(false),
  explosiveUsageDetails: text("explosive_usage_details"),

  // Environmental aspects
  environmentalImpactLevel: environmentalImpactLevelEnum(
    "environmental_impact_level",
  ),
  hasEnvironmentalPermit: boolean("has_environmental_permit").default(false),
  environmentalPermitDetails: text("environmental_permit_details"),
  lastEnvironmentalAssessmentDate: date("last_environmental_assessment_date"),
  dustSuppressionMeasures: text("dust_suppression_measures"),
  noiseControlMeasures: text("noise_control_measures"),
  waterPollutionControlMeasures: text("water_pollution_control_measures"),
  hasReclamationPlan: boolean("has_reclamation_plan").default(false),
  reclamationPlanDetails: text("reclamation_plan_details"),
  hasProgressiveRehabilitation: boolean(
    "has_progressive_rehabilitation",
  ).default(false),
  erosionControlMeasures: text("erosion_control_measures"),
  annualEnvironmentalComplianceBudgetNPR: decimal(
    "annual_environmental_compliance_budget_npr",
    { precision: 14, scale: 2 },
  ),

  // Safety and health
  safetyRecord: safetyRecordEnum("safety_record"),
  accidentCountLastYear: integer("accident_count_last_year"),
  fatalitiesCountLastYear: integer("fatalities_count_last_year"),
  hasSafetyManagementSystem: boolean("has_safety_management_system").default(
    false,
  ),
  safetyTrainingFrequency: text("safety_training_frequency"),
  hasEmergencyResponsePlan: boolean("has_emergency_response_plan").default(
    false,
  ),
  hasDustProtectionMeasures: boolean("has_dust_protection_measures").default(
    false,
  ),
  dustProtectionDetails: text("dust_protection_details"),
  hasNoiseProtectionMeasures: boolean("has_noise_protection_measures").default(
    false,
  ),
  noiseProtectionDetails: text("noise_protection_details"),

  // Community relations
  distanceToNearestSettlementKm: decimal("distance_to_nearest_settlement_km", {
    precision: 6,
    scale: 2,
  }),
  impactOnLocalCommunity: text("impact_on_local_community"),
  communityEngagementActivities: text("community_engagement_activities"),
  communityBenefitSharing: text("community_benefit_sharing"),
  localComplaintsRecorded: integer("local_complaints_recorded"),
  complaintResolutionMechanism: text("complaint_resolution_mechanism"),

  // Economic contribution
  annualRoyaltyPaidNPR: decimal("annual_royalty_paid_npr", {
    precision: 14,
    scale: 2,
  }),
  annualTaxesPaidNPR: decimal("annual_taxes_paid_npr", {
    precision: 14,
    scale: 2,
  }),
  contributionToLocalInfrastructure: text(
    "contribution_to_local_infrastructure",
  ),
  localProcurementPercentage: decimal("local_procurement_percentage", {
    precision: 5,
    scale: 2,
  }),
  subsidiaryBusinessCreated: text("subsidiary_business_created"),

  // Market information
  majorCustomers: text("major_customers"), // Construction companies, cement factories, etc.
  averageSellingPricePerCubicMeterNPR: decimal(
    "average_selling_price_per_cubic_meter_npr",
    { precision: 10, scale: 2 },
  ),
  averageSellingPricePerTonNPR: decimal("average_selling_price_per_ton_npr", {
    precision: 10,
    scale: 2,
  }),
  seasonalPriceVariation: text("seasonal_price_variation"),
  marketDemandTrends: text("market_demand_trends"),

  // Future development
  expansionPlans: text("expansion_plans"),
  investmentPlansNPR: decimal("investment_plans_npr", {
    precision: 18,
    scale: 2,
  }),
  expectedFutureProduction: text("expected_future_production"),
  valueAdditionPlans: text("value_addition_plans"), // Processing facilities, etc.

  // Challenges and needs
  operationalChallenges: text("operational_challenges"),
  technologicalChallenges: text("technological_challenges"),
  regulatoryChallenges: text("regulatory_challenges"),
  marketChallenges: text("market_challenges"),
  infrastructureNeeds: text("infrastructure_needs"),

  // Contact information
  contactPersonName: text("contact_person_name"),
  contactPersonPosition: text("contact_person_position"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  operationOfficeAddress: text("operation_office_address"),

  // Additional information
  qualityTestingProcedures: text("quality_testing_procedures"),
  certificationStandards: text("certification_standards"),
  sustainabilityMeasures: text("sustainability_measures"),

  // External linkages
  linkedTransportationRoutes: jsonb("linked_transportation_routes").default(
    sql`'[]'::jsonb`,
  ),
  linkedConstructionSites: jsonb("linked_construction_sites").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedCommunityCenters: jsonb("linked_community_centers").default(
    sql`'[]'::jsonb`,
  ),
  linkedRivers: jsonb("linked_rivers").default(sql`'[]'::jsonb`), // For riverbed extraction

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  quarryArea: geometry("quarry_area", { type: "Polygon" }),
  concessionBoundary: geometry("concession_boundary", { type: "Polygon" }),

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

export type Quarry = typeof quarry.$inferSelect;
export type NewQuarry = typeof quarry.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
