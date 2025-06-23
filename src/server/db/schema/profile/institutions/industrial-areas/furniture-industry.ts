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

// Define furniture industry type enum
export const furnitureIndustryTypeEnum = pgEnum("furniture_industry_type", [
  "WOODEN_FURNITURE",
  "METAL_FURNITURE",
  "PLASTIC_FURNITURE",
  "BAMBOO_FURNITURE",
  "CANE_FURNITURE",
  "UPHOLSTERY_WORKSHOP",
  "FURNITURE_PARTS",
  "OFFICE_FURNITURE",
  "HOME_FURNITURE",
  "CUSTOM_FURNITURE",
  "MIXED_MATERIALS",
  "FURNITURE_FINISHING",
  "OTHER",
]);

// Define operation scale enum
export const operationScaleEnum = pgEnum("operation_scale", [
  "MICRO",
  "COTTAGE",
  "SMALL",
  "MEDIUM",
  "LARGE",
]);

// Define production volume enum
export const productionVolumeEnum = pgEnum("production_volume", [
  "VERY_LOW",
  "LOW",
  "MODERATE",
  "HIGH",
  "VERY_HIGH",
]);

// Define establishment status enum
export const establishmentStatusEnum = pgEnum("establishment_status", [
  "OPERATIONAL",
  "PARTIALLY_OPERATIONAL",
  "UNDER_CONSTRUCTION",
  "TEMPORARILY_CLOSED",
  "CLOSED",
  "PLANNED",
]);

// Define furniture industry table
export const furnitureIndustry = pgTable("furniture_industry", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  industryType: furnitureIndustryTypeEnum("industry_type").notNull(),
  operationScale: operationScaleEnum("operation_scale").notNull(),

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
  openAreaSqm: decimal("open_area_sqm", { precision: 10, scale: 2 }),
  buildingCount: integer("building_count"),
  buildingOwnership: text("building_ownership"), // Owned, rented, leased
  monthlyRentNPR: decimal("monthly_rent_npr", { precision: 10, scale: 2 }),
  hasShowroom: boolean("has_showroom").default(false),
  showroomAreaSqm: decimal("showroom_area_sqm", { precision: 10, scale: 2 }),
  hasWorkshop: boolean("has_workshop").default(true),
  workshopAreaSqm: decimal("workshop_area_sqm", { precision: 10, scale: 2 }),
  hasStorage: boolean("has_storage").default(true),
  storageAreaSqm: decimal("storage_area_sqm", { precision: 10, scale: 2 }),

  // Operations details
  productionVolumeCategory: productionVolumeEnum("production_volume_category"),
  monthlyProductionCapacity: text("monthly_production_capacity"),
  majorProductsProduced: text("major_products_produced"),
  productCategories: text("product_categories"),
  materialsSourcing: text("materials_sourcing"),
  majorRawMaterials: text("major_raw_materials"),
  woodTypes: text("wood_types"),
  otherMaterials: text("other_materials"),
  qualityStandards: text("quality_standards"),
  certifications: text("certifications"),
  operatingHours: text("operating_hours"),
  workingDays: text("working_days"),

  // Machinery and equipment
  hasPowerTools: boolean("has_power_tools").default(true),
  powerToolDetails: text("power_tool_details"),
  hasWoodworkingMachines: boolean("has_woodworking_machines").default(true),
  woodworkingMachineTypes: text("woodworking_machine_types"),
  hasFinishingEquipment: boolean("has_finishing_equipment").default(true),
  finishingEquipmentDetails: text("finishing_equipment_details"),
  hasUpholsteryEquipment: boolean("has_upholstery_equipment").default(false),
  upholsteryEquipmentDetails: text("upholstery_equipment_details"),
  hasCNCMachines: boolean("has_cnc_machines").default(false),
  cncMachineCount: integer("cnc_machine_count"),
  estimatedEquipmentValueNPR: decimal("estimated_equipment_value_npr", {
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
  averageMonthlyWageNPR: decimal("average_monthly_wage_npr", {
    precision: 10,
    scale: 2,
  }),
  employeesBenefits: text("employees_benefits"),
  hasTrainingPrograms: boolean("has_training_programs").default(false),
  trainingProgramDetails: text("training_program_details"),

  // Financial details
  investmentAmountNPR: decimal("investment_amount_npr", {
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
  hasLoanFacility: boolean("has_loan_facility").default(false),
  loanAmountNPR: decimal("loan_amount_npr", { precision: 14, scale: 2 }),
  financingSource: text("financing_source"),

  // Utilities and infrastructure
  hasElectricity: boolean("has_electricity").default(true),
  electricitySource: text("electricity_source"), // Grid, generator, solar, etc.
  powerCapacityKW: decimal("power_capacity_kw", { precision: 10, scale: 2 }),
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterSource: text("water_source"),
  hasWasteManagement: boolean("has_waste_management").default(false),
  wasteManagementType: text("waste_management_type"),
  hasFireSafetySystem: boolean("has_fire_safety_system").default(false),
  fireSafetyDetails: text("fire_safety_details"),
  hasDustCollection: boolean("has_dust_collection").default(false),
  dustCollectionDetails: text("dust_collection_details"),
  hasVentilationSystem: boolean("has_ventilation_system").default(false),
  ventilationSystemDetails: text("ventilation_system_details"),

  // Marketing and sales
  majorMarkets: text("major_markets"),
  salesChannels: text("sales_channels"),
  hasRetailOutlet: boolean("has_retail_outlet").default(false),
  retailOutletCount: integer("retail_outlet_count"),
  retailOutletLocations: text("retail_outlet_locations"),
  exportMarkets: text("export_markets"),
  majorCustomers: text("major_customers"),
  offerCustomOrders: boolean("offer_custom_orders").default(true),
  hasOnlinePresence: boolean("has_online_presence").default(false),
  eCommerceDetails: text("e_commerce_details"),
  marketingStrategies: text("marketing_strategies"),

  // Supply chain
  supplyChainChallenges: text("supply_chain_challenges"),
  rawMaterialSourceRegion: text("raw_material_source_region"),
  importedMaterialPercentage: decimal("imported_material_percentage", {
    precision: 5,
    scale: 2,
  }),
  localMaterialPercentage: decimal("local_material_percentage", {
    precision: 5,
    scale: 2,
  }),
  mainSuppliersDetails: text("main_suppliers_details"),
  inventoryManagementSystem: text("inventory_management_system"),

  // Innovation and design
  hasInHouseDesign: boolean("has_in_house_design").default(false),
  designCapabilities: text("design_capabilities"),
  newProductFrequency: text("new_product_frequency"),
  innovationPractices: text("innovation_practices"),
  usesCADSoftware: boolean("uses_cad_software").default(false),
  cadSoftwareDetails: text("cad_software_details"),

  // Sustainability practices
  usesSustainableMaterials: boolean("uses_sustainable_materials").default(
    false,
  ),
  sustainableMaterialsDetails: text("sustainable_materials_details"),
  usesRenewableEnergy: boolean("uses_renewable_energy").default(false),
  renewableEnergyDetails: text("renewable_energy_details"),
  hasWoodSourceCertification: boolean("has_wood_source_certification").default(
    false,
  ),
  woodCertificationType: text("wood_certification_type"),
  environmentalChallenges: text("environmental_challenges"),
  environmentalInitiatives: text("environmental_initiatives"),

  // Challenges and support
  majorChallenges: text("major_challenges"),
  governmentSupportReceived: text("government_support_received"),
  supportNeeded: text("support_needed"),
  futureExpansionPlans: text("future_expansion_plans"),
  competitionChallenges: text("competition_challenges"),

  // Social and community engagement
  communityEngagementActivities: text("community_engagement_activities"),
  apprenticeshipPrograms: boolean("apprenticeship_programs").default(false),
  apprenticeshipDetails: text("apprenticeship_details"),
  collaborationsWithOtherBusinesses: text(
    "collaborations_with_other_businesses",
  ),
  industryAssociationMemberships: text("industry_association_memberships"),

  // Digital adoption
  hasComputerizedSystem: boolean("has_computerized_system").default(false),
  softwareUsed: text("software_used"),
  digitalMarketingChannels: text("digital_marketing_channels"),
  onlineOrderingSystem: boolean("online_ordering_system").default(false),

  // Safety and compliance
  hasHealthSafetyCertification: boolean(
    "has_health_safety_certification",
  ).default(false),
  safetyMeasures: text("safety_measures"),
  accidentHistoryLastYear: integer("accident_history_last_year"),
  workerInsuranceProvided: boolean("worker_insurance_provided").default(false),
  complaintsReceivedLastYear: integer("complaints_received_last_year"),

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

  // Linkages to other entities
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedIndustries: jsonb("linked_industries").default(sql`'[]'::jsonb`),
  linkedSuppliersCompanies: jsonb("linked_suppliers_companies").default(
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

export type FurnitureIndustry = typeof furnitureIndustry.$inferSelect;
export type NewFurnitureIndustry = typeof furnitureIndustry.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
