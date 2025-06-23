import { pgTable } from "../../../../../schema/basic";
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
import { geometry } from "../../../../../geographical";
import { waterQualityEnum } from "../../common";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define water supply institution type enum
export const waterSupplyTypeEnum = pgEnum("water_supply_type", [
  "PUBLIC_UTILITY",
  "COMMUNITY_MANAGED",
  "PRIVATE_OPERATOR",
  "NGO_MANAGED",
  "MUNICIPAL_DEPARTMENT",
  "FEDERAL_PROJECT",
  "PROVINCIAL_PROJECT",
  "MIXED",
  "OTHER",
]);

// Define water source type enum
export const waterSourceTypeEnum = pgEnum("water_source_type", [
  "SPRING",
  "RIVER",
  "GROUNDWATER",
  "RESERVOIR",
  "DEEP_TUBE_WELL",
  "SHALLOW_TUBE_WELL",
  "RAINWATER_HARVESTING",
  "GLACIER_MELT",
  "MIXED",
]);

// Define treatment type enum
export const treatmentTypeEnum = pgEnum("treatment_type", [
  "NONE",
  "BASIC_FILTRATION",
  "CHLORINATION",
  "SEDIMENTATION",
  "FULL_TREATMENT_PLANT",
  "UV_TREATMENT",
  "OZONATION",
  "MIXED",
]);

// Define distribution system enum
export const distributionSystemEnum = pgEnum("distribution_system", [
  "GRAVITY_FLOW",
  "PUMPED",
  "HYBRID",
  "TANKER_SUPPLY",
  "PUBLIC_TAPS",
  "DIRECT_CONNECTION",
  "OTHER",
]);

// Define service regularity enum
export const serviceRegularityEnum = pgEnum("service_regularity", [
  "CONTINUOUS",
  "DAILY",
  "ALTERNATE_DAYS",
  "WEEKLY",
  "IRREGULAR",
  "SEASONAL",
]);

// Define building condition enum (reusing from other files)
export const waterBuildingConditionEnum = pgEnum("water_building_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_MAINTENANCE",
  "POOR",
  "UNDER_CONSTRUCTION",
  "UNDER_RENOVATION",
  "TEMPORARY",
]);

// Define financial health enum
export const financialHealthEnum = pgEnum("financial_health", [
  "EXCELLENT",
  "SUSTAINABLE",
  "ADEQUATE",
  "STRUGGLING",
  "POOR",
  "DEPENDENT_ON_SUBSIDIES",
]);

// Water Supply Institution table
export const waterSupplyInstitution = pgTable("water_supply_institution", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  institutionType: waterSupplyTypeEnum("institution_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  establishedDate: date("established_date"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // Which govt body it's registered with
  coverage: text("coverage"), // Area covered (wards, specific areas)
  coveragePopulation: integer("coverage_population"), // Population served
  totalCustomers: integer("total_customers"), // Number of connections
  totalHouseholdConnections: integer("total_household_connections"),
  totalInstitutionalConnections: integer("total_institutional_connections"),
  totalCommercialConnections: integer("total_commercial_connections"),

  // Leadership and management
  chairpersonName: text("chairperson_name"),
  managerName: text("manager_name"),
  managementType: text("management_type"), // Board, committee, etc.
  committeeSizeTotal: integer("committee_size_total"),
  committeeFemaleMembers: integer("committee_female_members"),
  committeeDalitMembers: integer("committee_dalit_members"),
  committeeMarginalizedMembers: integer("committee_marginalized_members"),

  // Contact information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  emergencyContactNumber: text("emergency_contact_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Social media and online presence
  facebookHandle: text("facebook_handle"),
  otherSocialMedia: text("other_social_media"),

  // Operating hours
  operatingDays: text("operating_days"),
  officeOpeningTime: time("office_opening_time"),
  officeClosingTime: time("office_closing_time"),
  customerServiceHours: text("customer_service_hours"),
  hasEmergencyService: boolean("has_emergency_service").default(false),
  emergencyServiceDetails: text("emergency_service_details"),

  // Office infrastructure
  hasOfficeBuilding: boolean("has_office_building").default(true),
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", etc.
  buildingType: text("building_type"), // E.g., "Modern", "Traditional", "Hybrid"
  buildingCondition: waterBuildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovation_year"),
  totalOfficeAreaSqm: decimal("total_office_area_sqm", {
    precision: 10,
    scale: 2,
  }),
  hasCustomerServiceCenter: boolean("has_customer_service_center").default(
    false,
  ),

  // Water supply system details
  waterSource: waterSourceTypeEnum("water_source"),
  waterSourceDetails: text("water_source_details"),
  waterSourceCapacityLPD: integer("water_source_capacity_lpd"), // Liters per day
  waterSourceDistance: decimal("water_source_distance", {
    precision: 8,
    scale: 2,
  }), // Distance in km
  waterRightsStatus: text("water_rights_status"), // Legal status of water rights
  watershedProtection: boolean("watershed_protection").default(false),
  watershedProtectionDetails: text("watershed_protection_details"),

  // Treatment and quality
  treatmentType: treatmentTypeEnum("treatment_type"),
  treatmentDetails: text("treatment_details"),
  treatmentCapacityLPD: integer("treatment_capacity_lpd"), // Liters per day
  waterQualityTesting: boolean("water_quality_testing").default(false),
  waterQualityTestingFrequency: text("water_quality_testing_frequency"), // Monthly, quarterly, etc.
  waterQuality: waterQualityEnum("water_quality"),
  qualityParameters: text("quality_parameters"), // Parameters tested
  qualityIssues: text("quality_issues"), // Known quality issues

  // Storage and distribution
  hasTreatmentPlant: boolean("has_treatment_plant").default(false),
  treatmentPlantCapacity: integer("treatment_plant_capacity"), // Cubic meters
  hasStorageTank: boolean("has_storage_tank").default(false),
  storageTankCapacity: integer("storage_tank_capacity"), // Cubic meters
  storageTankCount: integer("storage_tank_count"),
  storageTankDetails: text("storage_tank_details"),
  distributionSystem: distributionSystemEnum("distribution_system"),
  pipelineLength: decimal("pipeline_length", { precision: 10, scale: 2 }), // In kilometers
  pipelineMaterial: text("pipeline_material"), // PVC, HDPE, GI, etc.
  pipelineCondition: text("pipeline_condition"),
  publicTapCount: integer("public_tap_count"),
  hasPressureManagement: boolean("has_pressure_management").default(false),
  pressureManagementDetails: text("pressure_management_details"),

  // Service details
  serviceRegularity: serviceRegularityEnum("service_regularity"),
  supplyHoursPerDay: decimal("supply_hours_per_day", {
    precision: 4,
    scale: 2,
  }),
  supplyDaysPerWeek: integer("supply_days_per_week"),
  averageSupplyLPCD: decimal("average_supply_lpcd", { precision: 8, scale: 2 }), // Liters per capita per day
  isMetered: boolean("is_metered").default(false),
  meteringCoverage: integer("metering_coverage"), // Percentage
  nonRevenueWaterPercent: decimal("non_revenue_water_percent", {
    precision: 5,
    scale: 2,
  }),

  // Tariff and billing
  hasTariffSystem: boolean("has_tariff_system").default(true),
  tariffStructure: text("tariff_structure"), // Description of tariff slabs/structure
  minimumMonthlyChargeNPR: decimal("minimum_monthly_charge_npr", {
    precision: 10,
    scale: 2,
  }),
  averageMonthlyBillNPR: decimal("average_monthly_bill_npr", {
    precision: 10,
    scale: 2,
  }),
  connectionFeeNPR: decimal("connection_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  billingFrequency: text("billing_frequency"), // Monthly, quarterly, etc.
  billingMethod: text("billing_method"), // How bills are delivered
  paymentMethods: text("payment_methods"), // Cash, online, bank, etc.
  hasDigitalPayment: boolean("has_digital_payment").default(false),
  digitalPaymentMethods: text("digital_payment_methods"),
  billCollectionRate: decimal("bill_collection_rate", {
    precision: 5,
    scale: 2,
  }), // Percentage

  // Staff details
  totalStaffCount: integer("total_staff_count"),
  technicalStaffCount: integer("technical_staff_count"),
  administrativeStaffCount: integer("administrative_staff_count"),
  permanentStaffCount: integer("permanent_staff_count"),
  contractStaffCount: integer("contract_staff_count"),
  femaleStaffCount: integer("female_staff_count"),
  staffTrainingStatus: text("staff_training_status"),

  // Operations and maintenance
  hasOAndMPlan: boolean("has_o_and_m_plan").default(false),
  maintenanceBudgetNPR: decimal("maintenance_budget_npr", {
    precision: 14,
    scale: 2,
  }),
  preventiveMaintenanceSchedule: text("preventive_maintenance_schedule"),
  breakdownResponseTime: text("breakdown_response_time"), // Average time to respond to issues
  equipmentAvailability: text("equipment_availability"),
  hasSparePartsInventory: boolean("has_spare_parts_inventory").default(false),
  maintenanceStaffCapacity: text("maintenance_staff_capacity"),
  hasServiceVehicles: boolean("has_service_vehicles").default(false),
  serviceVehicleCount: integer("service_vehicle_count"),

  // Financial aspects
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  annualRevenueNPR: decimal("annual_revenue_npr", { precision: 18, scale: 2 }),
  operatingCostNPR: decimal("operating_cost_npr", { precision: 18, scale: 2 }),
  financialSustainability: financialHealthEnum("financial_sustainability"),
  hasEmergencyFund: boolean("has_emergency_fund").default(false),
  emergencyFundAmountNPR: decimal("emergency_fund_amount_npr", {
    precision: 18,
    scale: 2,
  }),
  receivesExternalFunding: boolean("receives_external_funding").default(false),
  externalFundingSources: text("external_funding_sources"),
  hasAccountingSystem: boolean("has_accounting_system").default(false),
  accountingSystemDetails: text("accounting_system_details"),
  lastAuditDate: date("last_audit_date"),

  // Consumer relations
  hasConsumerCommittee: boolean("has_consumer_committee").default(false),
  consumerMeetingFrequency: text("consumer_meeting_frequency"),
  hasGrievanceSystem: boolean("has_grievance_system").default(false),
  grievanceResolutionProcess: text("grievance_resolution_process"),
  annualComplaintsCount: integer("annual_complaints_count"),
  customerSatisfactionLevel: text("customer_satisfaction_level"),
  hasAwarenessPrograms: boolean("has_awareness_programs").default(false),
  awarenessTopics: text("awareness_topics"), // Water conservation, hygiene, etc.

  // Technical details
  pumpingCapacity: decimal("pumping_capacity", {
    precision: 10,
    scale: 2,
  }), // In liters per second
  hasGeneratorBackup: boolean("has_generator_backup").default(false),
  generatorCapacity: text("generator_capacity"),
  energySourcePrimary: text("energy_source_primary"), // Grid, solar, diesel, etc.
  energySourceBackup: text("energy_source_backup"),
  monthlyEnergyConsumption: decimal("monthly_energy_consumption", {
    precision: 10,
    scale: 2,
  }), // kWh
  hasAutomationSystem: boolean("has_automation_system").default(false),
  automationDetails: text("automation_details"),

  // Water conservation and management
  hasWaterConservationProgram: boolean(
    "has_water_conservation_program",
  ).default(false),
  waterConservationMeasures: text("water_conservation_measures"),
  leakageDetectionSystem: boolean("leakage_detection_system").default(false),
  leakagePercentage: decimal("leakage_percentage", { precision: 5, scale: 2 }),
  waterReuseRecycling: boolean("water_reuse_recycling").default(false),
  waterReuseDetails: text("water_reuse_details"),

  // Digital and technological aspects
  hasDigitalBilling: boolean("has_digital_billing").default(false),
  hasCustomerDatabase: boolean("has_customer_database").default(false),
  hasSCADA: boolean("has_scada").default(false), // Supervisory Control And Data Acquisition
  hasGISMapping: boolean("has_gis_mapping").default(false),
  technologiesUsed: text("technologies_used"),
  digitizationPlans: text("digitization_plans"),

  // Challenges and needs
  majorChallenges: text("major_challenges"),
  infrastructureNeeds: text("infrastructure_needs"),
  capacityBuildingNeeds: text("capacity_building_needs"),
  futureExpansionPlans: text("future_expansion_plans"),
  climateChangeAdaptation: text("climate_change_adaptation"), // Measures for climate resilience
  disasterPreparedness: text("disaster_preparedness"),

  // Sanitation components (if applicable)
  managesSanitationServices: boolean("manages_sanitation_services").default(
    false,
  ),
  sanitationServices: text("sanitation_services"), // Public toilets, sewerage, etc.
  sewerageNetwork: boolean("sewerage_network").default(false),
  sewerageNetworkCoverage: integer("sewerage_network_coverage"), // Percentage
  hasWastewaterTreatment: boolean("has_wastewater_treatment").default(false),
  wastewaterTreatmentDetails: text("wastewater_treatment_details"),
  septageManagement: boolean("septage_management").default(false),
  septageManagementDetails: text("septage_management_details"),

  // Governance and transparency
  publicMeetingsHeld: boolean("public_meetings_held").default(false),
  meetingFrequency: text("meeting_frequency"),
  publicReportPublished: boolean("public_report_published").default(false),
  hasTransparencyMechanisms: boolean("has_transparency_mechanisms").default(
    false,
  ),
  transparencyMechanisms: text("transparency_mechanisms"),
  hasComplaintHandlingSystem: boolean("has_complaint_handling_system").default(
    false,
  ),

  // External relationships
  coordinationWithLocalGov: text("coordination_with_local_gov"),
  coordinationWithProvincialGov: text("coordination_with_provincial_gov"),
  coordinationWithFederalGov: text("coordination_with_federal_gov"),
  partnerOrganizations: text("partner_organizations"), // NGOs, donors working with

  // Linkages to other entities
  linkedMunicipalityOffices: jsonb("linked_municipality_offices").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedHealthInstitutions: jsonb("linked_health_institutions").default(
    sql`'[]'::jsonb`,
  ),
  linkedEducationalInstitutions: jsonb(
    "linked_educational_institutions",
  ).default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  serviceAreaPolygon: geometry("service_area_polygon", {
    type: "MultiPolygon",
  }),
  pipelineNetwork: geometry("pipeline_network", { type: "MultiLineString" }),

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

export type WaterSupplyInstitution = typeof waterSupplyInstitution.$inferSelect;
export type NewWaterSupplyInstitution =
  typeof waterSupplyInstitution.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
