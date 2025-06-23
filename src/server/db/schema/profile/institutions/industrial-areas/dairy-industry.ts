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

// Define dairy industry type enum
export const dairyIndustryTypeEnum = pgEnum("dairy_industry_type", [
  "MILK_COLLECTION_CENTER",
  "MILK_CHILLING_CENTER",
  "MILK_PROCESSING_PLANT",
  "CHEESE_FACTORY",
  "BUTTER_FACTORY",
  "YOGURT_PRODUCTION",
  "ICE_CREAM_FACTORY",
  "MILK_POWDER_PLANT",
  "CONDENSED_MILK_PLANT",
  "MIXED_DAIRY_PRODUCTS",
  "COOPERATIVE_DAIRY",
  "PRIVATE_DAIRY",
  "OTHER",
]);

// Define operation scale enum
export const dairyOperationScaleEnum = pgEnum("dairy_operation_scale", [
  "MICRO",
  "COTTAGE",
  "SMALL",
  "MEDIUM",
  "LARGE",
]);

// Define milk source enum
export const milkSourceEnum = pgEnum("milk_source", [
  "COW_MILK",
  "BUFFALO_MILK",
  "MIXED_MILK",
  "GOAT_MILK",
  "YAK_MILK",
  "IMPORTED_MILK",
  "MULTIPLE_SOURCES",
]);

// Define dairy industry table
export const dairyIndustry = pgTable("dairy_industry", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  industryType: dairyIndustryTypeEnum("industry_type").notNull(),
  operationScale: dairyOperationScaleEnum("operation_scale").notNull(),

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
  hasFoodLicense: boolean("has_food_license").default(false),
  foodLicenseNumber: varchar("food_license_number", { length: 50 }),

  // Ownership details
  ownershipType: text("ownership_type"), // Sole proprietorship, partnership, cooperative, etc.
  ownerName: text("owner_name"),
  ownerContactNumber: text("owner_contact_number"),
  ownerEmail: text("owner_email"),
  isWomanOwned: boolean("is_woman_owned").default(false),
  isCooperativeOwned: boolean("is_cooperative_owned").default(false),
  cooperativeDetails: text("cooperative_details"),
  farmerInvolvement: text("farmer_involvement"),

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
  buildingCount: integer("building_count"),
  buildingOwnership: text("building_ownership"), // Owned, rented, leased
  monthlyRentNPR: decimal("monthly_rent_npr", { precision: 10, scale: 2 }),
  processingAreaSqm: decimal("processing_area_sqm", {
    precision: 10,
    scale: 2,
  }),
  storageAreaSqm: decimal("storage_area_sqm", { precision: 10, scale: 2 }),
  coldStorageAreaSqm: decimal("cold_storage_area_sqm", {
    precision: 10,
    scale: 2,
  }),

  // Milk sourcing
  milkSource: milkSourceEnum("milk_source").notNull(),
  dailyMilkCollectionLiters: decimal("daily_milk_collection_liters", {
    precision: 10,
    scale: 2,
  }),
  milkCollectionCenters: integer("milk_collection_centers"),
  milkCollectionCenterLocations: text("milk_collection_center_locations"),
  servingFarmerCount: integer("serving_farmer_count"),
  averageMilkPricePerLiterNPR: decimal("average_milk_price_per_liter_npr", {
    precision: 8,
    scale: 2,
  }),
  milkProcurementSystem: text("milk_procurement_system"),
  milkQualityTestingMethod: text("milk_quality_testing_method"),
  milkPreservationMethod: text("milk_preservation_method"),
  hasChillingFacility: boolean("has_chilling_facility").default(false),
  chillingCapacityLiters: decimal("chilling_capacity_liters", {
    precision: 10,
    scale: 2,
  }),

  // Production details
  dailyProcessingCapacityLiters: decimal("daily_processing_capacity_liters", {
    precision: 10,
    scale: 2,
  }),
  actualDailyProcessingLiters: decimal("actual_daily_processing_liters", {
    precision: 10,
    scale: 2,
  }),
  operatingDaysPerWeek: integer("operating_days_per_week"),
  operatingHoursPerDay: integer("operating_hours_per_day"),
  seasonalityPattern: text("seasonality_pattern"),
  peakSeasonMonths: text("peak_season_months"),
  leanSeasonMonths: text("lean_season_months"),

  // Products
  productsManufactured: text("products_manufactured"),
  mainProductTypes: text("main_product_types"),
  packagingTypes: text("packaging_types"),
  shelfLifeDays: integer("shelf_life_days"),
  hasOwnBrand: boolean("has_own_brand").default(false),
  brandNames: text("brand_names"),
  productionCapacityDetails: text("production_capacity_details"),
  productCertifications: text("product_certifications"),
  hasPremiumProducts: boolean("has_premium_products").default(false),
  premiumProductDetails: text("premium_product_details"),

  // Equipment and technology
  hasPasteurization: boolean("has_pasteurization").default(true),
  pasteurizationMethod: text("pasteurization_method"),
  hasHomogenization: boolean("has_homogenization").default(false),
  hasAutomatedProcessing: boolean("has_automated_processing").default(false),
  automationLevel: text("automation_level"),
  majorEquipmentTypes: text("major_equipment_types"),
  laboratoryFacilities: text("laboratory_facilities"),
  qualityTestingEquipment: text("quality_testing_equipment"),
  packagingEquipment: text("packaging_equipment"),
  refrigerationCapacity: text("refrigeration_capacity"),
  technicalSupportAvailable: text("technical_support_available"),

  // Human resources
  totalEmployees: integer("total_employees"),
  permanentEmployees: integer("permanent_employees"),
  temporaryEmployees: integer("temporary_employees"),
  maleEmployees: integer("male_employees"),
  femaleEmployees: integer("female_employees"),
  technicalStaff: integer("technical_staff"),
  qualityControlStaff: integer("quality_control_staff"),
  administrativeStaff: integer("administrative_staff"),
  hasFoodTechnologyExpert: boolean("has_food_technology_expert").default(false),
  staffTrainingPrograms: text("staff_training_programs"),

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
  hasLoanFinancing: boolean("has_loan_financing").default(false),
  loanAmountNPR: decimal("loan_amount_npr", { precision: 14, scale: 2 }),
  loanSourceDetails: text("loan_source_details"),
  receivesSubsidies: boolean("receives_subsidies").default(false),
  subsidyDetails: text("subsidy_details"),

  // Quality control
  hasQualityControlSystem: boolean("has_quality_control_system").default(true),
  qualityStandards: text("quality_standards"),
  hasHACCP: boolean("has_haccp").default(false),
  hasISO: boolean("has_iso").default(false),
  isoCertificationType: text("iso_certification_type"),
  qualityTestingFrequency: text("quality_testing_frequency"),
  productsReturnRate: decimal("products_return_rate", {
    precision: 5,
    scale: 2,
  }),
  hasLaboratoryTesting: boolean("has_laboratory_testing").default(false),
  laboratoryTestingDetails: text("laboratory_testing_details"),

  // Utilities and infrastructure
  hasElectricity: boolean("has_electricity").default(true),
  electricitySource: text("electricity_source"), // Grid, generator, solar
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"),
  waterSourceType: text("water_source_type"),
  waterStorageCapacityLiters: integer("water_storage_capacity_liters"),
  waterTreatmentSystem: text("water_treatment_system"),
  wasteManagementSystem: text("waste_management_system"),

  // Cold chain
  hasColdChain: boolean("has_cold_chain").default(true),
  coldStorageCapacityLiters: decimal("cold_storage_capacity_liters", {
    precision: 10,
    scale: 2,
  }),
  refrigeratedTransportVehicles: integer("refrigerated_transport_vehicles"),
  temperatureMonitoringSystem: text("temperature_monitoring_system"),

  // Marketing and distribution
  marketingChannels: text("marketing_channels"),
  distributionNetwork: text("distribution_network"),
  geographicalCoverage: text("geographical_coverage"),
  exportMarketsIfAny: text("export_markets_if_any"),
  hasDirectRetailing: boolean("has_direct_retailing").default(false),
  retailOutletCount: integer("retail_outlet_count"),
  majorBuyers: text("major_buyers"),
  customerSegments: text("customer_segments"),

  // Challenges and competition
  majorChallenges: text("major_challenges"),
  competitionDetails: text("competition_details"),
  seasonalChallenges: text("seasonal_challenges"),
  milkSupplyChallenges: text("milk_supply_challenges"),
  qualityChallenges: text("quality_challenges"),
  marketChallenges: text("market_challenges"),

  // Support and assistance
  receivedTechnicalSupport: text("received_technical_support"),
  governmentSupportReceived: text("government_support_received"),
  ngoSupportReceived: text("ngo_support_received"),
  supportNeeded: text("support_needed"),
  trainingNeeds: text("training_needs"),

  // Future plans
  expansionPlans: text("expansion_plans"),
  productDiversificationPlans: text("product_diversification_plans"),
  technologyUpgradePlans: text("technology_upgrade_plans"),
  marketExpansionPlans: text("market_expansion_plans"),

  // Environmental aspects
  wasteGeneratedTypes: text("waste_generated_types"),
  wasteDisposalMethods: text("waste_disposal_methods"),
  hasRenewableEnergyUse: boolean("has_renewable_energy_use").default(false),
  renewableEnergyDetails: text("renewable_energy_details"),
  environmentalConcerns: text("environmental_concerns"),
  environmentalCertifications: text("environmental_certifications"),

  // Accessibility
  distanceFromMainRoadKm: decimal("distance_from_main_road_km", {
    precision: 6,
    scale: 2,
  }),
  distanceFromCityOrBazarKm: decimal("distance_from_city_or_bazar_km", {
    precision: 6,
    scale: 2,
  }),
  publicTransportAccessibility: text("public_transport_accessibility"),
  roadAccessQuality: text("road_access_quality"),

  // Innovation and research
  newProductDevelopment: text("new_product_development"),
  researchCollaborations: text("research_collaborations"),
  innovationInitiatives: text("innovation_initiatives"),

  // Safety and compliance
  foodSafetyMeasures: text("food_safety_measures"),
  workplaceSafetyMeasures: text("workplace_safety_measures"),
  hasRegularFoodSafetyInspection: boolean(
    "has_regular_food_safety_inspection",
  ).default(false),
  inspectionFrequency: text("inspection_frequency"),
  lastInspectionDate: date("last_inspection_date"),

  // Linkages and associations
  memberOfDairyAssociation: boolean("member_of_dairy_association").default(
    false,
  ),
  associationDetails: text("association_details"),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedFarmerGroups: jsonb("linked_farmer_groups").default(sql`'[]'::jsonb`),
  linkedMilkCollectionCenters: jsonb("linked_milk_collection_centers").default(
    sql`'[]'::jsonb`,
  ),
  linkedRetailers: jsonb("linked_retailers").default(sql`'[]'::jsonb`),

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

export type DairyIndustry = typeof dairyIndustry.$inferSelect;
export type NewDairyIndustry = typeof dairyIndustry.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
