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
  mineOperationalStatusEnum,
  miningMethodEnum,
  safetyRecordEnum,
} from "./metal-mines";
import { ownershipTypeEnum } from "../agricultural";
import { environmentalImpactLevelEnum } from "../common";

// Define gemstone type enum
export const gemstoneTypeEnum = pgEnum("gemstone_type", [
  "DIAMOND",
  "RUBY",
  "SAPPHIRE",
  "EMERALD",
  "AQUAMARINE",
  "CRYSTAL",
  "WHITE_CRYSTAL",
  "AMETHYST",
  "JADE",
  "TOURMALINE",
  "GARNET",
  "TOPAZ",
  "TURQUOISE",
  "OPAL",
  "PERIDOT",
  "KYANITE",
  "QUARTZ",
  "BERYL",
  "TANZANITE",
  "OTHER",
]);

// Define gemstone quality enum
export const gemstoneQualityEnum = pgEnum("gemstone_quality", [
  "PREMIUM",
  "HIGH",
  "MEDIUM",
  "LOW",
  "MIXED",
  "UNGRADED",
]);

// Define extraction scale enum
export const extractionScaleEnum = pgEnum("extraction_scale", [
  "LARGE_SCALE",
  "MEDIUM_SCALE",
  "SMALL_SCALE",
  "ARTISANAL",
  "EXPLORATION",
]);

// Precious Gemstone Mine table
export const preciousGemstoneMine = pgTable("precious_gemstone_mine", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  gemstoneType: gemstoneTypeEnum("gemstone_type").notNull(),
  otherGemstoneTypes: jsonb("other_gemstone_types").default(sql`'[]'::jsonb`), // Secondary gemstones found

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Specific area name
  address: text("address"),
  elevation: decimal("elevation", { precision: 10, scale: 2 }), // Elevation in meters
  terrainType: text("terrain_type"), // Mountainous, river bed, etc.

  // Operational details
  operationalStatus: mineOperationalStatusEnum("operational_status").notNull(),
  discoveryYear: integer("discovery_year"),
  operationStartYear: integer("operation_start_year"),
  estimatedLifespanYears: integer("estimated_lifespan_years"),
  miningMethod: miningMethodEnum("mining_method").notNull(),
  extractionScale: extractionScaleEnum("extraction_scale").notNull(),
  gemstoneQuality: gemstoneQualityEnum("gemstone_quality"),
  geologicalFormation: text("geological_formation"),
  depositType: text("deposit_type"), // Primary, secondary (alluvial), etc.

  // Ownership and management
  ownershipType: ownershipTypeEnum("ownership_type").notNull(),
  ownerOrganization: text("owner_organization"),
  operatorOrganization: text("operator_organization"),
  licenseNumber: varchar("license_number", { length: 50 }),
  licenseIssueDate: date("license_issue_date"),
  licenseExpiryDate: date("license_expiry_date"),
  licensingAuthority: text("licensing_authority"),
  artisanalMinersCount: integer("artisanal_miners_count"),
  foreignInvestmentPercentage: decimal("foreign_investment_percentage", {
    precision: 5,
    scale: 2,
  }),
  foreignInvestorCountry: text("foreign_investor_country"),

  // Production data
  inProduction: boolean("in_production").default(false),
  annualProductionCarats: decimal("annual_production_carats", {
    precision: 12,
    scale: 2,
  }),
  annualProductionKg: decimal("annual_production_kg", {
    precision: 12,
    scale: 2,
  }),
  annualProductionPieces: integer("annual_production_pieces"),
  productionCapacity: text("production_capacity"),
  totalReserveEstimate: text("total_reserve_estimate"),
  gemstoneCharacteristics: text("gemstone_characteristics"), // Color, clarity, etc.
  annualOutputValueNPR: decimal("annual_output_value_npr", {
    precision: 18,
    scale: 2,
  }),

  // Processing details
  hasOnSiteProcessing: boolean("has_on_site_processing").default(false),
  processingMethodDetails: text("processing_method_details"),
  cuttingFacilities: boolean("cutting_facilities").default(false),
  polishingFacilities: boolean("polishing_facilities").default(false),
  gradingFacilities: boolean("grading_facilities").default(false),
  marketingChannels: text("marketing_channels"),
  exportDestinations: text("export_destinations"),

  // Employment
  totalEmployeeCount: integer("total_employee_count"),
  localEmployeeCount: integer("local_employee_count"),
  femaleEmployeeCount: integer("female_employee_count"),
  technicalStaffCount: integer("technical_staff_count"),
  artisansCount: integer("artisans_count"), // Skilled gem cutters, etc.
  laborerCount: integer("laborer_count"),
  averageMonthlyWageNPR: decimal("average_monthly_wage_npr", {
    precision: 10,
    scale: 2,
  }),
  traditionalSkills: text("traditional_skills"), // Traditional gemstone working methods

  // Infrastructure
  hasPowerSupply: boolean("has_power_supply").default(false),
  powerSupplySource: text("power_supply_source"),
  hasWaterSupply: boolean("has_water_supply").default(false),
  waterSourceType: text("water_source_type"),
  waterUsageLitersPerDay: decimal("water_usage_liters_per_day", {
    precision: 14,
    scale: 2,
  }),
  hasAdminBuilding: boolean("has_admin_building").default(false),
  hasWorkshops: boolean("has_workshops").default(false),
  hasSecurityInfrastructure: boolean("has_security_infrastructure").default(
    false,
  ),
  securityMeasures: text("security_measures"),
  accessRoadType: text("access_road_type"),
  distanceFromHighwayKm: decimal("distance_from_highway_km", {
    precision: 8,
    scale: 2,
  }),

  // Equipment
  majorEquipmentTypes: text("major_equipment_types"),
  specializedToolsUsed: text("specialized_tools_used"),
  traditionalToolsUsed: text("traditional_tools_used"),
  processingEquipmentDetails: text("processing_equipment_details"),

  // Environmental aspects
  environmentalImpactLevel: environmentalImpactLevelEnum(
    "environmental_impact_level",
  ),
  hasEnvironmentalPermit: boolean("has_environmental_permit").default(false),
  environmentalPermitDetails: text("environmental_permit_details"),
  lastEnvironmentalAssessmentDate: date("last_environmental_assessment_date"),
  waterPollutionImpact: text("water_pollution_impact"),
  landDegradationImpact: text("land_degradation_impact"),
  hasReclamationPlan: boolean("has_reclamation_plan").default(false),
  reclamationPlanDetails: text("reclamation_plan_details"),
  usesHazardousChemicals: boolean("uses_hazardous_chemicals").default(false),
  chemicalUsageDetails: text("chemical_usage_details"),

  // Safety and health
  safetyRecord: safetyRecordEnum("safety_record"),
  accidentCountLastYear: integer("accident_count_last_year"),
  fatalitiesCountLastYear: integer("fatalities_count_last_year"),
  hasSafetyTraining: boolean("has_safety_training").default(false),
  hasPersonalProtectiveEquipment: boolean(
    "has_personal_protective_equipment",
  ).default(false),
  commonHealthIssues: text("common_health_issues"),

  // Certification and compliance
  hasFairTradeCompliance: boolean("has_fair_trade_compliance").default(false),
  hasSustainableMiningCertification: boolean(
    "has_sustainable_mining_certification",
  ).default(false),
  certificationDetails: text("certification_details"),
  hasFormalizedArtisanalMining: boolean(
    "has_formalized_artisanal_mining",
  ).default(false),
  formalizationDetails: text("formalization_details"),
  hasTraceabilitySystem: boolean("has_traceability_system").default(false),
  traceabilitySystemDetails: text("traceability_system_details"),

  // Community relations
  localCommunityEngagement: text("local_community_engagement"),
  communityDevelopmentInitiatives: text("community_development_initiatives"),
  annualCSRBudgetNPR: decimal("annual_csr_budget_npr", {
    precision: 14,
    scale: 2,
  }),
  employmentOpportunitiesForLocals: text("employment_opportunities_for_locals"),
  communityComplaintsMechanism: text("community_complaints_mechanism"),
  traditionalRightsMaintenance: text("traditional_rights_maintenance"),
  impactOnLocalCulture: text("impact_on_local_culture"),

  // Economic contribution
  annualRoyaltyPaidNPR: decimal("annual_royalty_paid_npr", {
    precision: 14,
    scale: 2,
  }),
  annualTaxesPaidNPR: decimal("annual_taxes_paid_npr", {
    precision: 14,
    scale: 2,
  }),
  contributionToLocalEconomy: text("contribution_to_local_economy"),
  valueAdditionInCountry: text("value_addition_in_country"), // % of gemstones processed locally
  valueChainDevelopment: text("value_chain_development"),

  // Market and value
  typicalGemstoneValue: text("typical_gemstone_value"),
  largestGemstoneFound: text("largest_gemstone_found"),
  mostValuableGemstoneFound: text("most_valuable_gemstone_found"),
  marketingStrategy: text("marketing_strategy"),
  hasDirectSales: boolean("has_direct_sales").default(false),
  hasTouristVisits: boolean("has_tourist_visits").default(false),
  touristVisitDetails: text("tourist_visit_details"),

  // Future development
  expansionPlans: text("expansion_plans"),
  investmentPlansNPR: decimal("investment_plans_npr", {
    precision: 18,
    scale: 2,
  }),
  expectedFutureProduction: text("expected_future_production"),
  valueAdditionPlans: text("value_addition_plans"),

  // Challenges and needs
  operationalChallenges: text("operational_challenges"),
  technologicalChallenges: text("technological_challenges"),
  marketAccessChallenges: text("market_access_challenges"),
  illegalMiningIssues: text("illegal_mining_issues"),
  trainingNeeds: text("training_needs"),

  // Contact information
  contactPersonName: text("contact_person_name"),
  contactPersonPosition: text("contact_person_position"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  websiteUrl: text("website_url"),

  // Historical and cultural significance
  historicalSignificance: text("historical_significance"),
  culturalSignificance: text("cultural_significance"),
  traditionalBeliefs: text("traditional_beliefs"), // Cultural beliefs related to the gemstones

  // External linkages
  linkedTransportationRoutes: jsonb("linked_transportation_routes").default(
    sql`'[]'::jsonb`,
  ),
  linkedProcessingCenters: jsonb("linked_processing_centers").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedCommunityCenters: jsonb("linked_community_centers").default(
    sql`'[]'::jsonb`,
  ),
  linkedMarketsAndBazaars: jsonb("linked_markets_and_bazaars").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  miningArea: geometry("mining_area", { type: "Polygon" }),
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

export type PreciousGemstoneMine = typeof preciousGemstoneMine.$inferSelect;
export type NewPreciousGemstoneMine = typeof preciousGemstoneMine.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
