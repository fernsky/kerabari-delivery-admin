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
import { environmentalImpactLevelEnum } from "../common";

// Define metal type enum
export const metalTypeEnum = pgEnum("metal_type", [
  "IRON",
  "COPPER",
  "ZINC",
  "LEAD",
  "TIN",
  "GOLD",
  "SILVER",
  "ALUMINUM",
  "NICKEL",
  "COBALT",
  "MANGANESE",
  "CHROMIUM",
  "TITANIUM",
  "TUNGSTEN",
  "MOLYBDENUM",
  "URANIUM",
  "THORIUM",
  "LITHIUM",
  "RARE_EARTH",
  "OTHER",
]);

// Define mine operational status enum
export const mineOperationalStatusEnum = pgEnum("mine_operational_status", [
  "OPERATIONAL",
  "EXPLORATION",
  "DEVELOPMENT",
  "INACTIVE",
  "ABANDONED",
  "RECLAIMED",
  "CLOSED",
  "SEASONAL",
  "MAINTENANCE",
  "PLANNED",
]);

// Define mining method enum
export const miningMethodEnum = pgEnum("mining_method", [
  "OPEN_PIT",
  "UNDERGROUND",
  "PLACER",
  "IN_SITU_LEACHING",
  "SOLUTION",
  "HYDRAULIC",
  "STRIP_MINING",
  "MOUNTAIN_TOP_REMOVAL",
  "ARTISANAL",
  "MIXED",
  "OTHER",
]);

// Define ore grade enum
export const oreGradeEnum = pgEnum("ore_grade", [
  "HIGH_GRADE",
  "MEDIUM_GRADE",
  "LOW_GRADE",
  "VARIABLE",
  "UNASSESSED",
]);

// Define ownership type enum
export const mineOwnershipTypeEnum = pgEnum("ownership_type", [
  "GOVERNMENT",
  "PRIVATE",
  "PUBLIC_PRIVATE_PARTNERSHIP",
  "COOPERATIVE",
  "FOREIGN_INVESTMENT",
  "JOINT_VENTURE",
  "COMMUNITY_OWNED",
  "OTHER",
]);

// Define safety record enum
export const safetyRecordEnum = pgEnum("safety_record", [
  "EXCELLENT",
  "GOOD",
  "SATISFACTORY",
  "POOR",
  "HAZARDOUS",
  "UNASSESSED",
]);

// Metal Mine table
export const metalMine = pgTable("metal_mine", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  metalType: metalTypeEnum("metal_type").notNull(),
  otherMetalTypes: jsonb("other_metal_types").default(sql`'[]'::jsonb`), // Secondary metals found

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Specific area name
  address: text("address"),
  elevation: decimal("elevation", { precision: 10, scale: 2 }), // Elevation in meters

  // Operational details
  operationalStatus: mineOperationalStatusEnum("operational_status").notNull(),
  discoveryYear: integer("discovery_year"),
  operationStartYear: integer("operation_start_year"),
  estimatedLifespanYears: integer("estimated_lifespan_years"),
  miningMethod: miningMethodEnum("mining_method").notNull(),
  oreGrade: oreGradeEnum("ore_grade"),

  // Ownership and management
  ownershipType: mineOwnershipTypeEnum("ownership_type").notNull(),
  ownerOrganization: text("owner_organization"),
  operatorOrganization: text("operator_organization"),
  licenseNumber: varchar("license_number", { length: 50 }),
  licenseIssueDate: date("license_issue_date"),
  licenseExpiryDate: date("license_expiry_date"),
  licensingAuthority: text("licensing_authority"),
  foreignInvestmentPercentage: decimal("foreign_investment_percentage", {
    precision: 5,
    scale: 2,
  }),
  foreignInvestorCountry: text("foreign_investor_country"),

  // Production data
  inProduction: boolean("in_production").default(false),
  annualProductionTons: decimal("annual_production_tons", {
    precision: 12,
    scale: 2,
  }),
  productionCapacityTons: decimal("production_capacity_tons", {
    precision: 12,
    scale: 2,
  }),
  totalReserveEstimateTons: decimal("total_reserve_estimate_tons", {
    precision: 14,
    scale: 2,
  }),
  metalContentPercentage: decimal("metal_content_percentage", {
    precision: 6,
    scale: 3,
  }),
  recoveryRatePercentage: decimal("recovery_rate_percentage", {
    precision: 6,
    scale: 2,
  }),
  annualOutputValueNPR: decimal("annual_output_value_npr", {
    precision: 18,
    scale: 2,
  }),

  // Processing details
  hasOnSiteProcessing: boolean("has_on_site_processing").default(false),
  processingMethodDetails: text("processing_method_details"),
  transportationMethods: text("transportation_methods"),
  exportDestinations: text("export_destinations"),

  // Employment
  totalEmployeeCount: integer("total_employee_count"),
  localEmployeeCount: integer("local_employee_count"),
  femaleEmployeeCount: integer("female_employee_count"),
  technicalStaffCount: integer("technical_staff_count"),
  administrativeStaffCount: integer("administrative_staff_count"),
  laborerCount: integer("laborer_count"),
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
  hasStorageFacilities: boolean("has_storage_facilities").default(false),
  hasMinerAccommodation: boolean("has_miner_accommodation").default(false),
  accommodationCapacity: integer("accommodation_capacity"),
  accessRoadType: text("access_road_type"),
  distanceFromHighwayKm: decimal("distance_from_highway_km", {
    precision: 8,
    scale: 2,
  }),

  // Equipment
  majorEquipmentTypes: text("major_equipment_types"),
  drillingEquipmentCount: integer("drilling_equipment_count"),
  excavationEquipmentCount: integer("excavation_equipment_count"),
  transportationEquipmentCount: integer("transportation_equipment_count"),
  processingEquipmentDetails: text("processing_equipment_details"),
  usesExplosives: boolean("uses_explosives").default(false),
  explosiveStorageDetails: text("explosive_storage_details"),

  // Environmental aspects
  environmentalImpactLevel: environmentalImpactLevelEnum(
    "environmental_impact_level",
  ),
  hasEnvironmentalPermit: boolean("has_environmental_permit").default(false),
  environmentalPermitDetails: text("environmental_permit_details"),
  lastEnvironmentalAssessmentDate: date("last_environmental_assessment_date"),
  waterPollutionMitigationMeasures: text("water_pollution_mitigation_measures"),
  airPollutionMitigationMeasures: text("air_pollution_mitigation_measures"),
  noisePollutionMitigationMeasures: text("noise_pollution_mitigation_measures"),
  landReclamationPlan: text("land_reclamation_plan"),
  hasWasteManagementPlan: boolean("has_waste_management_plan").default(false),
  wasteManagementDetails: text("waste_management_details"),
  tailingsManagementMethod: text("tailings_management_method"),
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
  hasOnSiteMedicalFacilities: boolean("has_on_site_medical_facilities").default(
    false,
  ),
  occupationalHealthMonitoring: boolean(
    "occupational_health_monitoring",
  ).default(false),

  // Community relations
  localCommunityEngagement: text("local_community_engagement"),
  communityDevelopmentInitiatives: text("community_development_initiatives"),
  annualCSRBudgetNPR: decimal("annual_csr_budget_npr", {
    precision: 14,
    scale: 2,
  }),
  employmentOpportunitiesForLocals: text("employment_opportunities_for_locals"),
  communityComplaintsMechanism: text("community_complaints_mechanism"),
  displacedFamiliesCount: integer("displaced_families_count"),
  compensationMeasures: text("compensation_measures"),

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

  // Future development
  expansionPlans: text("expansion_plans"),
  investmentPlansNPR: decimal("investment_plans_npr", {
    precision: 18,
    scale: 2,
  }),
  expectedFutureProduction: text("expected_future_production"),

  // Challenges and needs
  operationalChallenges: text("operational_challenges"),
  technologicalChallenges: text("technological_challenges"),
  regulatoryChallenges: text("regulatory_challenges"),
  infrastructureNeeds: text("infrastructure_needs"),

  // Contact information
  contactPersonName: text("contact_person_name"),
  contactPersonPosition: text("contact_person_position"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),

  // Research and studies
  geologicalStudies: text("geological_studies"),
  researchPartnerships: text("research_partnerships"),

  // External linkages
  linkedTransportationRoutes: jsonb("linked_transportation_routes").default(
    sql`'[]'::jsonb`,
  ),
  linkedProcessingFacilities: jsonb("linked_processing_facilities").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedCommunityCenters: jsonb("linked_community_centers").default(
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

export type MetalMine = typeof metalMine.$inferSelect;
export type NewMetalMine = typeof metalMine.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
