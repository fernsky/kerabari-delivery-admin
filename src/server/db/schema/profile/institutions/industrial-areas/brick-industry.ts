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

// Define brick kiln type enum
export const brickKilnTypeEnum = pgEnum("brick_kiln_type", [
  "FIXED_CHIMNEY_BULL_TRENCH_KILN",
  "ZIGZAG_KILN",
  "VERTICAL_SHAFT_BRICK_KILN",
  "HOFFMAN_KILN",
  "TUNNEL_KILN",
  "CLAMP_KILN",
  "MOVING_CHIMNEY_BULL_TRENCH_KILN",
  "HYBRID_HOFFMAN_KILN",
  "OTHER",
]);

// Define brick industry status enum
export const brickIndustryStatusEnum = pgEnum("brick_industry_status", [
  "OPERATIONAL",
  "SEASONAL_OPERATION",
  "TEMPORARILY_CLOSED",
  "PERMANENTLY_CLOSED",
  "UNDER_CONSTRUCTION",
  "UNDER_MAINTENANCE",
]);

// Define technology level enum
export const brickTechnologyLevelEnum = pgEnum("brick_technology_level", [
  "TRADITIONAL",
  "SEMI_IMPROVED",
  "IMPROVED",
  "MODERN",
  "ADVANCED",
]);

// Define air pollution level enum
export const airPollutionLevelEnum = pgEnum("air_pollution_level", [
  "LOW",
  "MODERATE",
  "HIGH",
  "VERY_HIGH",
  "CRITICAL",
]);

// Brick Industry table
export const brickIndustry = pgTable("brick_industry", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),

  // Basic information
  kilnType: brickKilnTypeEnum("kiln_type").notNull(),
  status: brickIndustryStatusEnum("status").notNull(),
  technologyLevel: brickTechnologyLevelEnum("technology_level"),
  establishedYear: integer("established_year"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  panNumber: varchar("pan_number", { length: 20 }),
  vatNumber: varchar("vat_number", { length: 20 }),
  registrationAuthority: text("registration_authority"),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  landmarkDescription: text("landmark_description"),

  // Contact information
  ownerName: text("owner_name"),
  managerName: text("manager_name"),
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  email: text("email"),

  // Physical infrastructure
  totalLandAreaSqm: decimal("total_land_area_sqm", { precision: 12, scale: 2 }),
  kilnAreaSqm: decimal("kiln_area_sqm", { precision: 12, scale: 2 }),
  moldeAreaSqm: decimal("molde_area_sqm", { precision: 12, scale: 2 }),
  dryingAreaSqm: decimal("drying_area_sqm", { precision: 12, scale: 2 }),
  storageAreaSqm: decimal("storage_area_sqm", { precision: 12, scale: 2 }),
  chimneyHeightM: decimal("chimney_height_m", { precision: 6, scale: 2 }),
  chimneyDiameterM: decimal("chimney_diameter_m", { precision: 6, scale: 2 }),
  hasStackEmissionControl: boolean("has_stack_emission_control").default(false),
  emissionControlDetails: text("emission_control_details"),

  // Production capacity
  annualProductionCapacityCount: integer("annual_production_capacity_count"), // Number of bricks
  actualAnnualProductionCount: integer("actual_annual_production_count"),
  capacityUtilizationPercent: decimal("capacity_utilization_percent", {
    precision: 5,
    scale: 2,
  }),
  operationalMonthsPerYear: integer("operational_months_per_year"),
  operationalDaysPerSeason: integer("operational_days_per_season"),
  seasonalStartMonth: text("seasonal_start_month"),
  seasonalEndMonth: text("seasonal_end_month"),

  // Brick types and products
  primaryBrickType: text("primary_brick_type"),
  brickSizeStandards: text("brick_size_standards"),
  brickColors: text("brick_colors"),
  specializedBricks: text("specialized_bricks"),
  brickQualityStandards: text("brick_quality_standards"),
  hasBrickTesting: boolean("has_brick_testing").default(false),
  testingFacilities: text("testing_facilities"),

  // Raw materials
  claySourceType: text("clay_source_type"),
  distanceToClaySourceKm: decimal("distance_to_clay_source_km", {
    precision: 6,
    scale: 2,
  }),
  annualClayConsumptionTons: decimal("annual_clay_consumption_tons", {
    precision: 10,
    scale: 2,
  }),
  hasPermissionForClaySourcing: boolean(
    "has_permission_for_clay_sourcing",
  ).default(false),
  otherRawMaterials: text("other_raw_materials"),
  rawMaterialSourcingChallenges: text("raw_material_sourcing_challenges"),

  // Fuel and energy
  primaryFuelType: text("primary_fuel_type"), // Coal, wood, etc.
  secondaryFuelType: text("secondary_fuel_type"),
  annualFuelConsumptionTons: decimal("annual_fuel_consumption_tons", {
    precision: 10,
    scale: 2,
  }),
  fuelSourceDetails: text("fuel_source_details"),
  fuelCost: decimal("fuel_cost_per_ton_npr", { precision: 10, scale: 2 }),
  electricityConsumptionKWH: decimal("electricity_consumption_kwh", {
    precision: 10,
    scale: 2,
  }),
  hasAltEnergySource: boolean("has_alt_energy_source").default(false),
  altEnergySourceDetails: text("alt_energy_source_details"),

  // Water usage
  waterSourceType: text("water_source_type"),
  waterConsumptionLitersPerDay: decimal("water_consumption_liters_per_day", {
    precision: 10,
    scale: 2,
  }),
  hasWaterConservationMeasures: boolean(
    "has_water_conservation_measures",
  ).default(false),
  waterConservationDetails: text("water_conservation_details"),

  // Human resources
  permanentEmployees: integer("permanent_employees"),
  seasonalEmployees: integer("seasonal_employees"),
  maleEmployees: integer("male_employees"),
  femaleEmployees: integer("female_employees"),
  childLaborIssues: text("child_labor_issues"),
  localEmployeePercentage: decimal("local_employee_percentage", {
    precision: 5,
    scale: 2,
  }),
  migrantEmployeePercentage: decimal("migrant_employee_percentage", {
    precision: 5,
    scale: 2,
  }),
  migrantEmployeeOrigin: text("migrant_employee_origin"),
  hasMoldingMachines: boolean("has_molding_machines").default(false),
  manualMoldingWorkers: integer("manual_molding_workers"),
  machineMoldingWorkers: integer("machine_molding_workers"),

  // Labor welfare
  housingProvided: boolean("housing_provided").default(true),
  housingCondition: text("housing_condition"),
  drinkingWaterProvided: boolean("drinking_water_provided").default(true),
  sanitationFacilities: text("sanitation_facilities"),
  safetyEquipmentProvided: boolean("safety_equipment_provided").default(false),
  safetyMeasures: text("safety_measures"),
  healthIssuesReported: text("health_issues_reported"),
  wageRatePerThousandBricksNPR: decimal("wage_rate_per_thousand_bricks_npr", {
    precision: 10,
    scale: 2,
  }),

  // Environmental aspects
  environmentalClearanceStatus: text("environmental_clearance_status"),
  hasEnvironmentalAssessment: boolean("has_environmental_assessment").default(
    false,
  ),
  airPollutionLevel: airPollutionLevelEnum("air_pollution_level"),
  hasPollutionControlMeasures: boolean(
    "has_pollution_control_measures",
  ).default(false),
  pollutionControlMeasureDetails: text("pollution_control_measures_details"),
  dustSuppressionMethods: text("dust_suppression_methods"),
  topsoilPreservationMethod: text("topsoil_preservation_method"),
  landReclamationPlan: boolean("land_reclamation_plan").default(false),
  landReclamationDetails: text("land_reclamation_details"),

  // Financial aspects
  setupInvestmentNPR: decimal("setup_investment_npr", {
    precision: 14,
    scale: 2,
  }),
  annualOperatingCostNPR: decimal("annual_operating_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  annualTurnoverNPR: decimal("annual_turnover_npr", {
    precision: 14,
    scale: 2,
  }),
  annualProfitNPR: decimal("annual_profit_npr", { precision: 14, scale: 2 }),
  averageSellingPricePerBrickNPR: decimal(
    "average_selling_price_per_brick_npr",
    { precision: 6, scale: 2 },
  ),
  hasBankLoan: boolean("has_bank_loan").default(false),
  loanAmountNPR: decimal("loan_amount_npr", { precision: 14, scale: 2 }),

  // Market and distribution
  majorMarkets: text("major_markets"),
  brickTransportMethod: text("brick_transport_method"),
  hasOwnTransportVehicles: boolean("has_own_transport_vehicles").default(false),
  transportVehicleCount: integer("transport_vehicle_count"),
  averageMonthlyDispatchThousands: integer(
    "average_monthly_dispatch_thousands",
  ),
  storeageCapacityThousands: integer("storage_capacity_thousands"),
  supplyChainChallenges: text("supply_chain_challenges"),

  // Technology and efficiency
  hasMoldingMachinery: boolean("has_molding_machinery").default(false),
  moldingMachineryType: text("molding_machinery_type"),
  hasMechanizedClaySourcing: boolean("has_mechanized_clay_sourcing").default(
    false,
  ),
  hasMechanizedTransport: boolean("has_mechanized_transport").default(false),
  fuelEfficiencyMeasures: text("fuel_efficiency_measures"),
  energyConservationMeasures: text("energy_conservation_measures"),

  // Compliance and regulations
  hasOperatingPermit: boolean("has_operating_permit").default(true),
  permitValidityDate: date("permit_validity_date"),
  lastInspectionDate: date("last_inspection_date"),
  inspectionAuthority: text("inspection_authority"),
  complianceStatus: text("compliance_status"),
  regulatoryIssuesFaced: text("regulatory_issues_faced"),

  // Technology upgrading
  upgradationHistory: text("upgradation_history"),
  futureUpgradationPlans: text("future_upgradation_plans"),
  cleanerProductionInterest: boolean("cleaner_production_interest").default(
    false,
  ),
  technicalAssistanceNeeds: text("technical_assistance_needs"),

  // Climate change aspects
  annualCO2EmissionsTons: decimal("annual_co2_emissions_tons", {
    precision: 10,
    scale: 2,
  }),
  hasEmissionReductionTargets: boolean(
    "has_emission_reduction_targets",
  ).default(false),
  emissionReductionDetails: text("emission_reduction_details"),
  climateChangeVulnerability: text("climate_change_vulnerability"),
  adaptationMeasures: text("adaptation_measures"),

  // Social and community aspects
  relationWithLocalCommunity: text("relation_with_local_community"),
  communityComplaintsReceived: text("community_complaints_received"),
  communityDevelopmentInitiatives: text("community_development_initiatives"),
  hasCsr: boolean("has_csr").default(false),
  csrActivities: text("csr_activities"),

  // Association and support
  industryAssociationMembership: text("industry_association_membership"),
  governmentSupportReceived: boolean("government_support_received").default(
    false,
  ),
  governmentSupportDetails: text("government_support_details"),
  ngoSupportReceived: boolean("ngo_support_received").default(false),
  ngoSupportDetails: text("ngo_support_details"),

  // Challenges and needs
  majorChallenges: text("major_challenges"),
  policyConstraints: text("policy_constraints"),
  technologyConstraints: text("technology_constraints"),
  financialConstraints: text("financial_constraints"),
  marketConstraints: text("market_constraints"),

  // Future outlook
  expansionPlans: text("expansion_plans"),
  diversificationPlans: text("diversification_plans"),
  sustainabilityPlans: text("sustainability_plans"),
  successionPlanning: text("succession_planning"),

  // Linkages to other entities
  linkedConstructionProjects: jsonb("linked_construction_projects").default(
    sql`'[]'::jsonb`,
  ),
  linkedBuilderSuppliers: jsonb("linked_builder_suppliers").default(
    sql`'[]'::jsonb`,
  ),
  linkedTransporters: jsonb("linked_transporters").default(sql`'[]'::jsonb`),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  facilityBoundary: geometry("facility_boundary", { type: "Polygon" }),
  kilnLocation: geometry("kiln_location", { type: "Point" }),
  chimneyLocation: geometry("chimney_location", { type: "Point" }),
  claySourcingArea: geometry("clay_sourcing_area", { type: "MultiPolygon" }),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

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

export type BrickIndustry = typeof brickIndustry.$inferSelect;
export type NewBrickIndustry = typeof brickIndustry.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
