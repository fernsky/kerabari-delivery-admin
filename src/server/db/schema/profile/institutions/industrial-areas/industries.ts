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

// Define industry scale enum
export const industryScaleEnum = pgEnum("industry_scale", [
  "LARGE",
  "MEDIUM",
  "SMALL",
  "MICRO",
  "COTTAGE",
  "HOUSEHOLD",
]);

// Define industry type enum
export const industryTypeEnum = pgEnum("industry_type", [
  "MANUFACTURING",
  "PROCESSING",
  "ASSEMBLY",
  "EXTRACTION",
  "AGRO_BASED",
  "FOREST_BASED",
  "MINERAL_BASED",
  "ENERGY_BASED",
  "SERVICE_BASED",
  "TOURISM_BASED",
  "INFORMATION_TECHNOLOGY",
  "CONSTRUCTION_MATERIAL",
  "OTHER",
]);

// Define industry status enum
export const industryStatusEnum = pgEnum("industry_status", [
  "OPERATIONAL",
  "UNDER_CONSTRUCTION",
  "TEMPORARILY_CLOSED",
  "PERMANENTLY_CLOSED",
  "PLANNING_STAGE",
  "SEASONAL_OPERATION",
]);

// Define ownership type enum
export const ownershipTypeEnum = pgEnum("ownership_type", [
  "PRIVATE_LIMITED",
  "PUBLIC_LIMITED",
  "SOLE_PROPRIETORSHIP",
  "PARTNERSHIP",
  "COOPERATIVE",
  "STATE_OWNED",
  "MULTINATIONAL",
  "JOINT_VENTURE",
  "FOREIGN_DIRECT_INVESTMENT",
  "OTHER",
]);

// Define technology level enum
export const technologyLevelEnum = pgEnum("technology_level", [
  "MANUAL",
  "SEMI_AUTOMATED",
  "AUTOMATED",
  "ADVANCED",
  "HIGH_TECH",
]);

// Define pollution level enum
export const pollutionLevelEnum = pgEnum("pollution_level", [
  "NONE",
  "LOW",
  "MEDIUM",
  "HIGH",
  "SEVERE",
]);

// Industry table
export const industry = pgTable("industry", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),

  // Basic information
  industryScale: industryScaleEnum("industry_scale").notNull(),
  industryType: industryTypeEnum("industry_type").notNull(),
  status: industryStatusEnum("industry_status").notNull(),
  establishedDate: date("established_date"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  panNumber: varchar("pan_number", { length: 20 }),
  vatNumber: varchar("vat_number", { length: 20 }),

  // Classification
  productCategories: text("product_categories"),
  mainProducts: text("main_products"),
  secondaryProducts: text("secondary_products"),
  industrialClassification: text("industrial_classification"), // ISIC or national classification code

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  landmarkDescription: text("landmark_description"),

  // Contact information
  contactPerson: text("contact_person"),
  designation: text("designation"),
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Social media presence
  facebookPage: text("facebook_page"),
  linkedInPage: text("linkedin_page"),
  otherSocialMedia: text("other_social_media"),

  // Ownership and management
  ownershipType: ownershipTypeEnum("ownership_type").notNull(),
  ownerName: text("owner_name"),
  affiliatedGroup: text("affiliated_group"), // Parent company or business group
  foreignInvestmentPercent: decimal("foreign_investment_percent", {
    precision: 5,
    scale: 2,
  }),
  foreignInvestmentCountry: text("foreign_investment_country"),
  familyOwnedBusiness: boolean("family_owned_business").default(false),
  isFormallyRegistered: boolean("is_formally_registered").default(true),
  registrationAuthority: text("registration_authority"),

  // Physical infrastructure
  totalLandAreaSqm: decimal("total_land_area_sqm", { precision: 12, scale: 2 }),
  builtUpAreaSqm: decimal("built_up_area_sqm", { precision: 12, scale: 2 }),
  productionAreaSqm: decimal("production_area_sqm", {
    precision: 12,
    scale: 2,
  }),
  storageAreaSqm: decimal("storage_area_sqm", { precision: 12, scale: 2 }),
  officeAreaSqm: decimal("office_area_sqm", { precision: 12, scale: 2 }),
  landOwnership: text("land_ownership"), // Owned, Leased, etc.
  buildingCount: integer("building_count"),
  constructionYear: integer("construction_year"),

  // Human resources
  totalEmployees: integer("total_employees"),
  permanentEmployees: integer("permanent_employees"),
  contractEmployees: integer("contract_employees"),
  seasonalEmployees: integer("seasonal_employees"),
  maleEmployees: integer("male_employees"),
  femaleEmployees: integer("female_employees"),
  otherGenderEmployees: integer("other_gender_employees"),
  technicalStaff: integer("technical_staff"),
  administrativeStaff: integer("administrative_staff"),
  skilledLabor: integer("skilled_labor"),
  unskilledLabor: integer("unskilled_labor"),
  foreignEmployees: integer("foreign_employees"),
  localEmployees: integer("local_employees"),
  minimumWageAdherence: boolean("minimum_wage_adherence").default(true),

  // Production details
  productionCapacityPerYear: text("production_capacity_per_year"),
  actualProductionPerYear: text("actual_production_per_year"),
  capacityUtilizationPercent: decimal("capacity_utilization_percent", {
    precision: 5,
    scale: 2,
  }),
  workingHoursPerDay: decimal("working_hours_per_day", {
    precision: 4,
    scale: 1,
  }),
  workingDaysPerWeek: integer("working_days_per_week"),
  shiftsPerDay: integer("shifts_per_day"),
  hasQualityControlSystem: boolean("has_quality_control_system").default(false),
  qualityStandards: text("quality_standards"), // ISO, HACCP, etc.
  qualityCertifications: text("quality_certifications"),
  productTesting: boolean("product_testing").default(false),
  testingFacilities: text("testing_facilities"),

  // Technology and machinery
  technologyLevel: technologyLevelEnum("technology_level"),
  keyMachineryTypes: text("key_machinery_types"),
  machineryImportSources: text("machinery_import_sources"),
  hasProprietaryTechnology: boolean("has_proprietary_technology").default(
    false,
  ),
  automationLevel: text("automation_level"),
  researchDevelopmentActivities: text("research_development_activities"),
  hasComputerizedSystems: boolean("has_computerized_systems").default(false),
  maintenanceSystem: text("maintenance_system"),

  // Raw materials
  mainRawMaterials: text("main_raw_materials"),
  rawMaterialSources: text("raw_material_sources"),
  importedRawMaterialsPercent: decimal("imported_raw_materials_percent", {
    precision: 5,
    scale: 2,
  }),
  localRawMaterialsPercent: decimal("local_raw_materials_percent", {
    precision: 5,
    scale: 2,
  }),
  rawMaterialStorageFacilities: text("raw_material_storage_facilities"),

  // Market and distribution
  marketCoverage: text("market_coverage"), // Local, National, International
  majorMarkets: text("major_markets"),
  exportingCountries: text("exporting_countries"),
  exportPercentage: decimal("export_percentage", { precision: 5, scale: 2 }),
  marketingChannels: text("marketing_channels"),
  distributionNetwork: text("distribution_network"),
  majorClients: text("major_clients"),
  hasWebBasedSales: boolean("has_web_based_sales").default(false),
  competitiveAdvantage: text("competitive_advantage"),

  // Financial aspects
  capitalInvestmentNPR: decimal("capital_investment_npr", {
    precision: 18,
    scale: 2,
  }),
  fixedInvestmentNPR: decimal("fixed_investment_npr", {
    precision: 18,
    scale: 2,
  }),
  workingCapitalNPR: decimal("working_capital_npr", {
    precision: 18,
    scale: 2,
  }),
  annualTurnoverNPR: decimal("annual_turnover_npr", {
    precision: 18,
    scale: 2,
  }),
  annualProfitNPR: decimal("annual_profit_npr", { precision: 18, scale: 2 }),
  financingSource: text("financing_source"), // Self, Bank, Investors, etc.
  bankLoanNPR: decimal("bank_loan_npr", { precision: 18, scale: 2 }),
  subsidiesReceivedNPR: decimal("subsidies_received_npr", {
    precision: 18,
    scale: 2,
  }),
  subsidyType: text("subsidy_type"),
  taxExemptions: text("tax_exemptions"),

  // Energy and utilities
  powerSourceType: text("power_source_type"), // Grid, Generator, Solar, etc.
  powerConsumptionKWH: decimal("power_consumption_kwh", {
    precision: 12,
    scale: 2,
  }),
  hasBackupPower: boolean("has_backup_power").default(false),
  backupPowerType: text("backup_power_type"),
  waterSourceType: text("water_source_type"),
  waterConsumptionLitersPerDay: decimal("water_consumption_liters_per_day", {
    precision: 12,
    scale: 2,
  }),
  fuelTypesUsed: text("fuel_types_used"),
  monthlyFuelConsumption: text("monthly_fuel_consumption"),

  // Environmental aspects
  hasEnvironmentalClearance: boolean("has_environmental_clearance").default(
    false,
  ),
  environmentalClearanceDetails: text("environmental_clearance_details"),
  pollutionLevel: pollutionLevelEnum("pollution_level"),
  wasteGenerationTypes: text("waste_generation_types"),
  wasteManagementSystem: text("waste_management_system"),
  effluentTreatmentPlant: boolean("effluent_treatment_plant").default(false),
  airPollutionControlMeasures: text("air_pollution_control_measures"),
  hasEnvironmentalMonitoring: boolean("has_environmental_monitoring").default(
    false,
  ),
  environmentalComplianceStatus: text("environmental_compliance_status"),
  carbonFootprintInitiatives: text("carbon_footprint_initiatives"),

  // Safety and workplace
  hasOccupationalSafety: boolean("has_occupational_safety").default(false),
  safetyEquipmentProvided: boolean("safety_equipment_provided").default(false),
  safetyTrainingFrequency: text("safety_training_frequency"),
  accidentRecordsLastYear: integer("accident_records_last_year"),
  hasFireSafetyEquipment: boolean("has_fire_safety_equipment").default(false),
  hasEmergencyExits: boolean("has_emergency_exits").default(false),
  laborLawCompliance: boolean("labor_law_compliance").default(true),
  hasEmployeeInsurance: boolean("has_employee_insurance").default(false),
  hasEmployeeHealthCheck: boolean("has_employee_health_check").default(false),

  // Support services
  industryAssociationMember: boolean("industry_association_member").default(
    false,
  ),
  associationNames: text("association_names"),
  receivesGovernmentSupport: boolean("receives_government_support").default(
    false,
  ),
  governmentSupportType: text("government_support_type"),
  receivesNGOSupport: boolean("receives_ngo_support").default(false),
  ngoSupportDetails: text("ngo_support_details"),
  linkagesWithAcademia: text("linkages_with_academia"),

  // Future plans
  expansionPlans: text("expansion_plans"),
  diversificationPlans: text("diversification_plans"),
  modernizationPlans: text("modernization_plans"),
  investmentPlans: text("investment_plans"),

  // Challenges and needs
  majorChallenges: text("major_challenges"),
  infrastructuralNeeds: text("infrastructural_needs"),
  policyNeeds: text("policy_needs"),
  financialNeeds: text("financial_needs"),
  marketingNeeds: text("marketing_needs"),
  technicalNeeds: text("technical_needs"),

  // Impact assessment
  communityImpact: text("community_impact"),
  environmentalImpact: text("environmental_impact"),
  economicImpact: text("economic_impact"),
  jobCreationImpact: text("job_creation_impact"),
  skillDevelopmentContribution: text("skill_development_contribution"),
  localEconomyContribution: text("local_economy_contribution"),

  // Compliance and inspections
  lastInspectionDate: date("last_inspection_date"),
  inspectionAuthority: text("inspection_authority"),
  inspectionFindings: text("inspection_findings"),
  complianceStatus: text("compliance_status"),
  renewalRequirements: text("renewal_requirements"),

  // Corporate social responsibility
  hasCsrActivities: boolean("has_csr_activities").default(false),
  csrActivitiesDetails: text("csr_activities_details"),
  csrBudgetNPR: decimal("csr_budget_npr", { precision: 18, scale: 2 }),
  communityDevelopmentInitiatives: text("community_development_initiatives"),

  // Linkages to other entities
  linkedIndustrialAreas: jsonb("linked_industrial_areas").default(
    sql`'[]'::jsonb`,
  ),
  linkedRawMaterialSuppliers: jsonb("linked_raw_material_suppliers").default(
    sql`'[]'::jsonb`,
  ),
  linkedDistributors: jsonb("linked_distributors").default(sql`'[]'::jsonb`),
  linkedRetailers: jsonb("linked_retailers").default(sql`'[]'::jsonb`),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  premisesBoundary: geometry("premises_boundary", { type: "Polygon" }),
  buildingFootprints: geometry("building_footprints", { type: "MultiPolygon" }),

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

export type Industry = typeof industry.$inferSelect;
export type NewIndustry = typeof industry.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
