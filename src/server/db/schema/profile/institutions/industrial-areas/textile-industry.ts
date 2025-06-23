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
  time,
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";
import { establishmentStatusEnum } from "./furniture-industry";

// Define textile industry type enum
export const textileIndustryTypeEnum = pgEnum("textile_industry_type", [
  "SPINNING_MILL",
  "WEAVING_MILL",
  "KNITTING_UNIT",
  "DYING_UNIT",
  "PRINTING_UNIT",
  "GARMENT_FACTORY",
  "HANDLOOM_UNIT",
  "CARPET_MANUFACTURING",
  "PASHMINA_PRODUCTION",
  "WOOLEN_TEXTILE",
  "COTTON_TEXTILE",
  "SYNTHETIC_TEXTILE",
  "TRADITIONAL_TEXTILE",
  "MIXED_TEXTILE",
  "OTHER",
]);

// Define operation scale enum
export const textileOperationScaleEnum = pgEnum("textile_operation_scale", [
  "MICRO",
  "COTTAGE",
  "SMALL",
  "MEDIUM",
  "LARGE",
]);

// Define production volume enum
export const textileProductionVolumeEnum = pgEnum("textile_production_volume", [
  "VERY_LOW",
  "LOW",
  "MODERATE",
  "HIGH",
  "VERY_HIGH",
]);

// Define textile industry table
export const textileIndustry = pgTable("textile_industry", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  industryType: textileIndustryTypeEnum("industry_type").notNull(),
  operationScale: textileOperationScaleEnum("operation_scale").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  landmark: text("landmark"),

  // Registration details
  establishmentStatus: establishmentStatusEnum("establishment_status").default(
    "OPERATIONAL",
  ),
  establishedYear: integer("established_year"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  panNumber: varchar("pan_number", { length: 20 }),
  registeredWith: text("registered_with"), // Which govt body it's registered with
  registrationDate: date("registration_date"),
  lastRenewalDate: date("last_renewal_date"),
  vatRegistered: boolean("vat_registered").default(false),

  // Ownership details
  ownershipType: text("ownership_type"), // Sole proprietorship, partnership, etc.
  ownerName: text("owner_name"),
  ownerContactNumber: text("owner_contact_number"),
  ownerEmail: text("owner_email"),
  isWomanOwned: boolean("is_woman_owned").default(false),
  isMinorityOwned: boolean("is_minority_owned").default(false),
  ownershipEthnicity: text("ownership_ethnicity"),

  // Contact information
  contactPerson: text("contact_person"),
  contactPosition: text("contact_position"),
  contactPhone: text("contact_phone"),
  alternateContactPhone: text("alternate_contact_phone"),
  contactEmail: text("contact_email"),
  websiteUrl: text("website_url"),

  // Physical infrastructure
  totalLandAreaSqm: decimal("total_land_area_sqm", { precision: 10, scale: 2 }),
  coveredAreaSqm: decimal("covered_area_sqm", { precision: 10, scale: 2 }),
  factoryFloorAreaSqm: decimal("factory_floor_area_sqm", {
    precision: 10,
    scale: 2,
  }),
  storageAreaSqm: decimal("storage_area_sqm", { precision: 10, scale: 2 }),
  buildingCount: integer("building_count"),
  buildingOwnership: text("building_ownership"), // Owned, rented, leased
  monthlyRentNPR: decimal("monthly_rent_npr", { precision: 10, scale: 2 }),
  hasShowroom: boolean("has_showroom").default(false),
  showroomAreaSqm: decimal("showroom_area_sqm", { precision: 10, scale: 2 }),

  // Production details
  productionVolumeCategory: textileProductionVolumeEnum(
    "production_volume_category",
  ),
  rawMaterialsUsed: text("raw_materials_used"),
  mainFiberTypes: text("main_fiber_types"), // Cotton, wool, synthetic, mixed, etc.
  productionCapacityKgPerDay: decimal("production_capacity_kg_per_day", {
    precision: 10,
    scale: 2,
  }),
  actualProductionKgPerDay: decimal("actual_production_kg_per_day", {
    precision: 10,
    scale: 2,
  }),
  productionCapacityUnitsPerDay: integer("production_capacity_units_per_day"), // For garments
  majorProductCategories: text("major_product_categories"),
  traditionalDesignsUsed: text("traditional_designs_used"),
  modernDesignsRatio: decimal("modern_designs_ratio", {
    precision: 5,
    scale: 2,
  }),
  traditionalDesignsRatio: decimal("traditional_designs_ratio", {
    precision: 5,
    scale: 2,
  }),

  // For spinning/weaving mills
  spinningCapacityKgPerDay: decimal("spinning_capacity_kg_per_day", {
    precision: 10,
    scale: 2,
  }),
  weavingLoomsCount: integer("weaving_looms_count"),
  loomTypes: text("loom_types"), // Power loom, handloom, semi-auto
  yarnCountRange: text("yarn_count_range"),
  fabricTypesProduce: text("fabric_types_produce"),

  // For garment manufacturing
  garmentTypesProduced: text("garment_types_produced"),
  dailyProductionCapacityPieces: integer("daily_production_capacity_pieces"),
  sewingMachineCount: integer("sewing_machine_count"),
  cuttingTablesCount: integer("cutting_tables_count"),
  hasPatternMakingFacility: boolean("has_pattern_making_facility").default(
    false,
  ),
  hasComputerizedDesign: boolean("has_computerized_design").default(false),

  // For dyeing/finishing
  dyeingCapacityKgPerDay: decimal("dyeing_capacity_kg_per_day", {
    precision: 10,
    scale: 2,
  }),
  dyeingProcessTypes: text("dyeing_process_types"),
  finishingProcessTypes: text("finishing_process_types"),
  printingCapacityMPerDay: decimal("printing_capacity_m_per_day", {
    precision: 10,
    scale: 2,
  }),
  printingTechniquesUsed: text("printing_techniques_used"),

  // Machinery details
  majorMachineryTypes: text("major_machinery_types"),
  hasModernMachinery: boolean("has_modern_machinery").default(false),
  machineryCondition: text("machinery_condition"), // Excellent, good, fair, poor, etc.
  machineryAgeTenYears: boolean("machinery_age_ten_years").default(false), // True if mostly older than 10 years
  automationLevel: text("automation_level"),
  maintenanceFrequency: text("maintenance_frequency"),
  estimatedMachineryValueNPR: decimal("estimated_machinery_value_npr", {
    precision: 14,
    scale: 2,
  }),

  // Human resources
  totalEmployees: integer("total_employees"),
  permanentEmployees: integer("permanent_employees"),
  temporaryEmployees: integer("temporary_employees"),
  maleEmployees: integer("male_employees"),
  femaleEmployees: integer("female_employees"),
  otherGenderEmployees: integer("other_gender_employees"),
  skilledLaborers: integer("skilled_laborers"),
  unskilledLaborers: integer("unskilled_laborers"),
  designersCount: integer("designers_count"),
  qualityControlStaffCount: integer("quality_control_staff_count"),
  averageMonthlyWageNPR: decimal("average_monthly_wage_npr", {
    precision: 10,
    scale: 2,
  }),
  employeesBenefits: text("employees_benefits"),
  hasTrainingPrograms: boolean("has_training_programs").default(false),
  trainingProgramDetails: text("training_program_details"),
  employeeRetentionRatePercent: decimal("employee_retention_rate_percent", {
    precision: 5,
    scale: 2,
  }),

  // Financial details
  initialInvestmentNPR: decimal("initial_investment_npr", {
    precision: 14,
    scale: 2,
  }),
  annualTurnoverNPR: decimal("annual_turnover_npr", {
    precision: 14,
    scale: 2,
  }),
  annualProfitNPR: decimal("annual_profit_npr", { precision: 14, scale: 2 }),
  exportPercentage: decimal("export_percentage", { precision: 5, scale: 2 }),
  domesticSalePercentage: decimal("domestic_sale_percentage", {
    precision: 5,
    scale: 2,
  }),
  hasLoanFinancing: boolean("has_loan_financing").default(false),
  loanAmountNPR: decimal("loan_amount_npr", { precision: 14, scale: 2 }),
  financingSources: text("financing_sources"),
  receivesSubsidies: boolean("receives_subsidies").default(false),
  subsidyDetails: text("subsidy_details"),

  // Raw materials and supply chain
  rawMaterialSourceDomestic: decimal("raw_material_source_domestic", {
    precision: 5,
    scale: 2,
  }),
  rawMaterialSourceImported: decimal("raw_material_source_imported", {
    precision: 5,
    scale: 2,
  }),
  importSourceCountries: text("import_source_countries"),
  rawMaterialChallenges: text("raw_material_challenges"),
  inventoryManagementSystem: text("inventory_management_system"),
  averageRawMaterialInventoryDays: integer(
    "average_raw_material_inventory_days",
  ),
  averageFinishedGoodsInventoryDays: integer(
    "average_finished_goods_inventory_days",
  ),

  // Utilities and infrastructure
  hasElectricity: boolean("has_electricity").default(true),
  electricitySource: text("electricity_source"), // Grid, generator, solar
  powerCapacityKW: decimal("power_capacity_kw", { precision: 10, scale: 2 }),
  monthlyElectricityConsumptionUnits: integer(
    "monthly_electricity_consumption_units",
  ),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"),
  hasWaterTreatment: boolean("has_water_treatment").default(false),
  waterConsumptionLitersPerDay: integer("water_consumption_liters_per_day"),
  hasEffluentTreatment: boolean("has_effluent_treatment").default(false),
  effluentTreatmentDetails: text("effluent_treatment_details"),

  // Quality control and certifications
  hasQualityControlDepartment: boolean(
    "has_quality_control_department",
  ).default(false),
  qualityControlProcesses: text("quality_control_processes"),
  qualityStandards: text("quality_standards"),
  hasISOCertification: boolean("has_iso_certification").default(false),
  isoCertificationType: text("iso_certification_type"),
  otherCertifications: text("other_certifications"),
  qualityIssuesPercent: decimal("quality_issues_percent", {
    precision: 5,
    scale: 2,
  }),

  // Market and distribution
  majorMarkets: text("major_markets"),
  exportMarkets: text("export_markets"),
  exportProductTypes: text("export_product_types"),
  domesticMarketRegions: text("domestic_market_regions"),
  distributionChannels: text("distribution_channels"),
  hasDirectRetail: boolean("has_direct_retail").default(false),
  retailOutlets: integer("retail_outlets"),
  majorClientTypes: text("major_client_types"), // Fashion brands, exporters, etc.
  retailPriceRangeNPR: text("retail_price_range_npr"),
  brandPosition: text("brand_position"), // Economy, mid-range, premium
  majorCompetitors: text("major_competitors"),

  // Marketing and branding
  hasRegisteredBrands: boolean("has_registered_brands").default(false),
  brandNames: text("brand_names"),
  marketingChannels: text("marketing_channels"),
  hasOnlinePresence: boolean("has_online_presence").default(false),
  eCommercePresence: text("e_commerce_presence"),
  socialMediaPresence: text("social_media_presence"),
  participatesInExhibitions: boolean("participates_in_exhibitions").default(
    false,
  ),
  exhibitionDetails: text("exhibition_details"),

  // Design and innovation
  hasInHouseDesign: boolean("has_in_house_design").default(false),
  designRenewalFrequency: text("design_renewal_frequency"),
  innovationFocus: text("innovation_focus"),
  usesTrendForecast: boolean("uses_trend_forecast").default(false),
  collaboratesWithDesigners: boolean("collaborates_with_designers").default(
    false,
  ),
  designerCollaborationDetails: text("designer_collaboration_details"),
  newProductDevelopmentFrequency: text("new_product_development_frequency"),

  // Challenges and support
  majorBusinessChallenges: text("major_business_challenges"),
  infrastructureChallenges: text("infrastructure_challenges"),
  marketChallenges: text("market_challenges"),
  skillChallenges: text("skill_challenges"),
  competitionChallenges: text("competition_challenges"),
  governmentSupportReceived: text("government_support_received"),
  governmentSupportNeeded: text("government_support_needed"),
  industryAssociationSupport: text("industry_association_support"),

  // Future plans
  expansionPlans: text("expansion_plans"),
  diversificationPlans: text("diversification_plans"),
  technologyUpgradePlans: text("technology_upgrade_plans"),
  marketExpansionPlans: text("market_expansion_plans"),
  sustainabilityPlans: text("sustainability_plans"),

  // Environmental aspects
  wasteGenerationTypes: text("waste_generation_types"),
  wasteManagementPractices: text("waste_management_practices"),
  hasEnvironmentalPolicy: boolean("has_environmental_policy").default(false),
  environmentalChallenges: text("environmental_challenges"),
  waterConservationMeasures: text("water_conservation_measures"),
  energyConservationMeasures: text("energy_conservation_measures"),
  usesRenewableEnergy: boolean("uses_renewable_energy").default(false),
  renewableEnergyDetails: text("renewable_energy_details"),

  // Social responsibility
  laborComplianceMeasures: text("labor_compliance_measures"),
  hasChildLaborPolicy: boolean("has_child_labor_policy").default(false),
  workplaceHealthSafetyMeasures: text("workplace_health_safety_measures"),
  communityEngagement: text("community_engagement"),
  fairTradeInvolvement: boolean("fair_trade_involvement").default(false),

  // Traditional preservation (if applicable)
  preservesTraditionalTechniques: boolean(
    "preserves_traditional_techniques",
  ).default(false),
  traditionalTechniquesDetails: text("traditional_techniques_details"),
  employsArtisans: boolean("employs_artisans").default(false),
  artisanCount: integer("artisan_count"),
  culturalSignificance: text("cultural_significance"),

  // Linkages to other entities
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedIndustries: jsonb("linked_industries").default(sql`'[]'::jsonb`),
  linkedSuppliers: jsonb("linked_suppliers").default(sql`'[]'::jsonb`),
  linkedRetailers: jsonb("linked_retailers").default(sql`'[]'::jsonb`),
  linkedExporters: jsonb("linked_exporters").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  premisesBoundary: geometry("premises_boundary", { type: "Polygon" }),
  buildingFootprints: geometry("building_footprints", { type: "MultiPolygon" }),

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

export type TextileIndustry = typeof textileIndustry.$inferSelect;
export type NewTextileIndustry = typeof textileIndustry.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
