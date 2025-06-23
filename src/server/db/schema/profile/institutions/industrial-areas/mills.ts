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
  time,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define mill type enum
export const millTypeEnum = pgEnum("mill_type", [
  "RICE_MILL",
  "GRINDING_MILL",
  "OIL_MILL",
  "WATER_MILL",
  "FLOUR_MILL",
  "SPICE_MILL",
  "PULSE_MILL",
  "MULTIPURPOSE_MILL",
  "SAW_MILL",
  "OTHER",
]);

// Define power source enum
export const millPowerSourceEnum = pgEnum("mill_power_source", [
  "ELECTRICITY",
  "DIESEL",
  "WATER",
  "SOLAR",
  "HYBRID",
  "MANUAL",
  "ANIMAL",
  "OTHER",
]);

// Define operational status enum
export const millOperationalStatusEnum = pgEnum("mill_operational_status", [
  "FULLY_OPERATIONAL",
  "PARTIALLY_OPERATIONAL",
  "SEASONAL_OPERATION",
  "TEMPORARILY_CLOSED",
  "PERMANENTLY_CLOSED",
  "UNDER_MAINTENANCE",
  "UNDER_RENOVATION",
]);

// Define technology level enum
export const millTechnologyLevelEnum = pgEnum("mill_technology_level", [
  "TRADITIONAL",
  "SEMI_IMPROVED",
  "IMPROVED",
  "MODERN",
  "ADVANCED",
]);

// Mill table
export const mill = pgTable("mill", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),

  // Basic information
  millType: millTypeEnum("mill_type").notNull(),
  powerSource: millPowerSourceEnum("power_source").notNull(),
  operationalStatus: millOperationalStatusEnum("operational_status").notNull(),
  technologyLevel: millTechnologyLevelEnum("technology_level"),
  establishedYear: integer("established_year"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  registrationAuthority: text("registration_authority"),
  isPanRegistered: boolean("is_pan_registered").default(false),
  panNumber: varchar("pan_number", { length: 20 }),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  landmarkDescription: text("landmark_description"),

  // Contact information
  ownerName: text("owner_name"),
  operatorName: text("operator_name"),
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  email: text("email"),

  // Operational details
  operationHoursStart: time("operation_hours_start"),
  operationHoursEnd: time("operation_hours_end"),
  operationalDaysPerWeek: integer("operational_days_per_week"),
  isSeasonalOperation: boolean("is_seasonal_operation").default(false),
  seasonalOperationDetails: text("seasonal_operation_details"),
  weeklyOffDay: text("weekly_off_day"),

  // Capacity and production
  processingCapacity: text("processing_capacity"), // E.g. "500 kg per hour"
  processingCapacityKgPerHour: decimal("processing_capacity_kg_per_hour", {
    precision: 8,
    scale: 2,
  }),
  averageDailyProductionKg: decimal("average_daily_production_kg", {
    precision: 8,
    scale: 2,
  }),
  averageMonthlyProductionKg: decimal("average_monthly_production_kg", {
    precision: 10,
    scale: 2,
  }),

  // For rice mills
  riceVarietiesProcessed: text("rice_varieties_processed"),
  byproductUtilization: text("byproduct_utilization"), // Husk, bran usage
  hasParboilingUnit: boolean("has_parboiling_unit").default(false),
  hasMoistureTestingEquipment: boolean(
    "has_moisture_testing_equipment",
  ).default(false),
  hasColorSorter: boolean("has_color_sorter").default(false),
  polishingType: text("polishing_type"),

  // For oil mills
  oilSeedsProcessed: text("oil_seeds_processed"),
  oilExtractionEfficiencyPercent: decimal("oil_extraction_efficiency_percent", {
    precision: 5,
    scale: 2,
  }),
  oilFilteringProcess: text("oil_filtering_process"),
  oilStorageCapacityLiters: decimal("oil_storage_capacity_liters", {
    precision: 10,
    scale: 2,
  }),

  // For water mills
  waterSourceName: text("water_source_name"),
  distanceFromWaterSourceM: decimal("distance_from_water_source_m", {
    precision: 8,
    scale: 2,
  }),
  waterFlowRateLitersPerSecond: decimal("water_flow_rate_liters_per_second", {
    precision: 8,
    scale: 2,
  }),
  isTraditionalGhatta: boolean("is_traditional_ghatta").default(false),
  isImprovedGhatta: boolean("is_improved_ghatta").default(false),
  improvementType: text("improvement_type"),
  turbineType: text("turbine_type"),

  // For grinding mills
  grainsProcessed: text("grains_processed"),
  spicesProcessed: text("spices_processed"),
  grindingMechanismType: text("grinding_mechanism_type"),
  stoneType: text("stone_type"),

  // Infrastructure
  facilityAreaSqm: decimal("facility_area_sqm", { precision: 10, scale: 2 }),
  buildingType: text("building_type"), // Permanent, Semi-permanent, Temporary
  buildingOwnership: text("building_ownership"), // Owned, Rented, etc.
  hasStorageFacility: boolean("has_storage_facility").default(false),
  storageCapacityKg: decimal("storage_capacity_kg", {
    precision: 10,
    scale: 2,
  }),
  hasWeighingScale: boolean("has_weighing_scale").default(false),
  weighingScaleType: text("weighing_scale_type"),

  // Equipment and machinery
  mainMachineryType: text("main_machinery_type"),
  machineryBrand: text("machinery_brand"),
  machineryOrigin: text("machinery_origin"), // Country/place
  machineryAgeYears: integer("machinery_age_years"),
  machineryCondition: text("machinery_condition"),
  lastMaintenanceDate: date("last_maintenance_date"),
  maintenanceFrequency: text("maintenance_frequency"),
  hasSparePartStock: boolean("has_spare_part_stock").default(false),

  // Energy and utilities
  powerConsumptionKWH: decimal("power_consumption_kwh", {
    precision: 8,
    scale: 2,
  }),
  fuelConsumptionLitersPerMonth: decimal("fuel_consumption_liters_per_month", {
    precision: 8,
    scale: 2,
  }),
  waterConsumptionLitersPerDay: decimal("water_consumption_liters_per_day", {
    precision: 10,
    scale: 2,
  }),
  hasEnergyEfficiencyMeasures: boolean(
    "has_energy_efficiency_measures",
  ).default(false),
  energyEfficiencyDetails: text("energy_efficiency_details"),

  // Human resources
  permanentEmployees: integer("permanent_employees"),
  temporaryEmployees: integer("temporary_employees"),
  familyMembersInvolved: integer("family_members_involved"),
  maleEmployees: integer("male_employees"),
  femaleEmployees: integer("female_employees"),
  skillRequirements: text("skill_requirements"),

  // Market and customers
  customerBase: text("customer_base"), // Local farmers, traders, etc.
  serviceAreaRadiusKm: decimal("service_area_radius_km", {
    precision: 6,
    scale: 2,
  }),
  villagesServed: text("villages_served"),
  householdsServed: integer("households_served"),
  hasHomeDelivery: boolean("has_home_delivery").default(false),
  majorCompetitors: text("major_competitors"),

  // Services and pricing
  servicesOffered: text("services_offered"),
  processingChargeDetails: text("processing_charge_details"),
  averageProcessingChargePerKgNPR: decimal(
    "average_processing_charge_per_kg_npr",
    { precision: 6, scale: 2 },
  ),
  paymentMethods: text("payment_methods"), // Cash, in-kind, credit
  hasInKindPayment: boolean("has_in_kind_payment").default(false),
  inKindPaymentDetails: text("in_kind_payment_details"),

  // Financial aspects
  setupInvestmentNPR: decimal("setup_investment_npr", {
    precision: 12,
    scale: 2,
  }),
  monthlyOperatingCostNPR: decimal("monthly_operating_cost_npr", {
    precision: 10,
    scale: 2,
  }),
  monthlyIncomeNPR: decimal("monthly_income_npr", { precision: 10, scale: 2 }),
  profitabilityStatus: text("profitability_status"),
  hasBusinessLoan: boolean("has_business_loan").default(false),
  loanSourceDetails: text("loan_source_details"),

  // Quality and safety
  hasQualityControlMeasures: boolean("has_quality_control_measures").default(
    false,
  ),
  qualityControlDetails: text("quality_control_details"),
  hygienicConditions: text("hygienic_conditions"),
  hasWasteManagementSystem: boolean("has_waste_management_system").default(
    false,
  ),
  wasteManagementDetails: text("waste_management_details"),
  hasSafetyMeasures: boolean("has_safety_measures").default(false),
  safetyMeasureDetails: text("safety_measure_details"),

  // Challenges and needs
  operationalChallenges: text("operational_challenges"),
  maintenanceChallenges: text("maintenance_challenges"),
  marketingChallenges: text("marketing_challenges"),
  upgradationNeeds: text("upgradation_needs"),

  // Support and assistance
  receivesGovernmentSupport: boolean("receives_government_support").default(
    false,
  ),
  governmentSupportDetails: text("government_support_details"),
  receivesNGOSupport: boolean("receives_ngo_support").default(false),
  ngoSupportDetails: text("ngo_support_details"),
  trainingReceived: text("training_received"),
  trainingNeeds: text("training_needs"),

  // Historical and cultural aspects
  historicalSignificance: text("historical_significance"),
  culturalSignificance: text("cultural_significance"),
  traditionalPractices: text("traditional_practices"),
  modernizationSteps: text("modernization_steps"),

  // Future plans
  hasExpansionPlans: boolean("has_expansion_plans").default(false),
  expansionDetails: text("expansion_details"),
  hasModernizationPlans: boolean("has_modernization_plans").default(false),
  modernizationDetails: text("modernization_details"),
  successorAvailable: boolean("successor_available").default(false),

  // Environmental aspects
  environmentalImpact: text("environmental_impact"),
  pollutionMitigation: text("pollution_mitigation"),
  wasteUtilization: text("waste_utilization"),
  ecofriendlyMeasures: text("ecofriendly_measures"),

  // Community impact
  employmentGeneration: text("employment_generation"),
  serviceToFarmers: text("service_to_farmers"),
  womenInvolvement: text("women_involvement"),
  contributionToLocalEconomy: text("contribution_to_local_economy"),

  // Linkages to other entities
  linkedFarmers: jsonb("linked_farmers").default(sql`'[]'::jsonb`),
  linkedAgriBusinesses: jsonb("linked_agri_businesses").default(
    sql`'[]'::jsonb`,
  ),
  linkedMarkets: jsonb("linked_markets").default(sql`'[]'::jsonb`),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),

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

export type Mill = typeof mill.$inferSelect;
export type NewMill = typeof mill.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
