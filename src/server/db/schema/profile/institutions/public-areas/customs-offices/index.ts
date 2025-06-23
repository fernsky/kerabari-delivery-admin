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
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define customs office type enum
export const customsOfficeTypeEnum = pgEnum("customs_office_type", [
  "INTERNATIONAL_BORDER",
  "INLAND_CUSTOMS",
  "DRY_PORT",
  "CUSTOMS_CHECKPOINT",
  "SUB_CUSTOMS_OFFICE",
  "CUSTOMS_HOUSE",
  "TRANSIT_POINT",
  "TRADE_POINT",
  "OTHER",
]);

// Define customs office status enum
export const customsOfficeStatusEnum = pgEnum("customs_office_status", [
  "FULLY_OPERATIONAL",
  "PARTIALLY_OPERATIONAL",
  "UNDER_RENOVATION",
  "TEMPORARY_CLOSED",
  "SEASONAL_OPERATION",
  "PLANNED",
]);

// Define border connection enum
export const borderConnectionEnum = pgEnum("border_connection", [
  "INDIA",
  "CHINA",
  "BOTH",
  "NONE",
]);

// Define customs modernization level
export const modernizationLevelEnum = pgEnum("modernization_level", [
  "HIGHLY_MODERNIZED",
  "MODERATELY_MODERNIZED",
  "BASIC_FACILITIES",
  "NEEDS_MODERNIZATION",
  "UNDER_MODERNIZATION",
]);

// Define customs facility condition enum
export const facilityConditionEnum = pgEnum("facility_condition", [
  "EXCELLENT",
  "GOOD",
  "SATISFACTORY",
  "NEEDS_IMPROVEMENT",
  "POOR",
  "DILAPIDATED",
]);

// Define customs trade volume enum
export const tradeVolumeEnum = pgEnum("trade_volume", [
  "VERY_HIGH",
  "HIGH",
  "MEDIUM",
  "LOW",
  "VERY_LOW",
  "VARIABLE",
]);

// Customs Office table
export const customsOffice = pgTable("customs_office", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  type: customsOfficeTypeEnum("type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Status and operational details
  status: customsOfficeStatusEnum("status").notNull(),
  establishedYear: integer("established_year"),
  borderConnection: borderConnectionEnum("border_connection"),
  borderCountryName: text("border_country_name"), // Name of the bordering country if applicable
  borderPointName: text("border_point_name"), // Name of the specific border point
  distanceFromBorderKm: decimal("distance_from_border_km", {
    precision: 6,
    scale: 2,
  }),

  // Office details
  headOfficerTitle: text("head_officer_title"), // E.g. "Chief Customs Officer"
  officeCode: text("office_code"), // Official code number/ID of the office
  parentCustomsOfficeId: varchar("parent_customs_office_id", { length: 36 }),
  jurisdictionArea: text("jurisdiction_area"), // Areas covered by this customs office
  administrativeHierarchy: text("administrative_hierarchy"), // Reporting structure within customs department

  // Contact information
  phoneNumber: text("phone_number"),
  faxNumber: text("fax_number"),
  email: text("email"),
  websiteUrl: text("website_url"),
  poBoxNumber: text("po_box_number"),

  // Operating hours
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  isOpenAllDay: boolean("is_open_all_day").default(false),
  is24HourOperation: boolean("is_24_hour_operation").default(false),
  weeklyOffDays: text("weekly_off_days"), // E.g., "Saturday" or "Sunday, Saturday"
  holidaySchedule: text("holiday_schedule"), // Description of holiday closures
  hasSeasonalHours: boolean("has_seasonal_hours").default(false),
  seasonalHoursDetails: text("seasonal_hours_details"),

  // Facility details

  facilityCondition: facilityConditionEnum("facility_condition"),
  yearLastRenovated: integer("year_last_renovated"),
  buildingCount: integer("building_count"),
  hasWarehouse: boolean("has_warehouse").default(false),
  warehouseAreaSquareMeters: decimal("warehouse_area_square_meters", {
    precision: 10,
    scale: 2,
  }),
  hasLaboratory: boolean("has_laboratory").default(false),
  laboratoryType: text("laboratory_type"),
  hasScanners: boolean("has_scanners").default(false),
  scannerTypes: text("scanner_types"), // E.g., "X-ray, Container Scanner"
  hasDetectionEquipment: boolean("has_detection_equipment").default(false),
  detectionEquipmentTypes: text("detection_equipment_types"), // E.g., "Drug detection, Radiation detection"
  hasWeighbridge: boolean("has_weighbridge").default(false),
  weighbridgeCapacity: text("weighbridge_capacity"),
  hasQuarantineFacility: boolean("has_quarantine_facility").default(false),
  quarantineFacilityType: text("quarantine_facility_type"),
  hasCustomsLaboratory: boolean("has_customs_laboratory").default(false),

  // Infrastructure and amenities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  hasWaterSupply: boolean("has_water_supply").default(true),
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetSpeed: text("internet_speed"), // E.g., "10 Mbps", "100 Mbps"
  hasEdi: boolean("has_edi").default(false), // Electronic Data Interchange
  hasAsycuda: boolean("has_asycuda").default(false), // Automated System for Customs Data
  customsSoftwareDetails: text("customs_software_details"),
  hasPublicToilets: boolean("has_public_toilets").default(false),
  hasWaitingArea: boolean("has_waiting_area").default(false),
  waitingAreaCapacity: integer("waiting_area_capacity"),
  hasInformationDesk: boolean("has_information_desk").default(false),
  hasPublicDisplaySystem: boolean("has_public_display_system").default(false),
  hasPaymentCounter: boolean("has_payment_counter").default(false),

  // Transport and access
  accessRoadCondition: text("access_road_condition"),
  nearestHighwayName: text("nearest_highway_name"),
  distanceToHighwayKm: decimal("distance_to_highway_km", {
    precision: 6,
    scale: 2,
  }),
  nearestCityName: text("nearest_city_name"),
  distanceToCityKm: decimal("distance_to_city_km", { precision: 6, scale: 2 }),
  nearestPortName: text("nearest_port_name"),
  distanceToPortKm: decimal("distance_to_port_km", { precision: 6, scale: 2 }),
  hasPublicTransport: boolean("has_public_transport").default(false),
  publicTransportDetails: text("public_transport_details"),
  hasParking: boolean("has_parking").default(false),
  parkingCapacityVehicles: integer("parking_capacity_vehicles"),
  hasTruckYard: boolean("has_truck_yard").default(false),
  truckYardCapacity: integer("truck_yard_capacity"),

  // Staff details
  totalStaffCount: integer("total_staff_count"),
  customsOfficerCount: integer("customs_officer_count"),
  supportStaffCount: integer("support_staff_count"),
  securityPersonnelCount: integer("security_personnel_count"),
  hasCustomsPolice: boolean("has_customs_police").default(false),
  customsPoliceCount: integer("customs_police_count"),
  hasFemaleStaff: boolean("has_female_staff").default(false),
  femaleStaffPercentage: integer("female_staff_percentage"),
  staffingAdequacy: text("staffing_adequacy"), // Assessment of staffing levels

  // Trade volume and statistics
  annualTradeVolumeNPR: decimal("annual_trade_volume_npr", {
    precision: 18,
    scale: 2,
  }),
  importVolumeNPR: decimal("import_volume_npr", { precision: 18, scale: 2 }),
  exportVolumeNPR: decimal("export_volume_npr", { precision: 18, scale: 2 }),
  recordedFiscalYear: varchar("recorded_fiscal_year", { length: 9 }), // E.g., "2079/080"
  averageMonthlyDeclarations: integer("average_monthly_declarations"),
  mainImportItems: text("main_import_items"),
  mainExportItems: text("main_export_items"),
  tradeVolume: tradeVolumeEnum("trade_volume"),
  seasonalTradePatterns: text("seasonal_trade_patterns"),

  // Revenue collection
  annualRevenueCollectionNPR: decimal("annual_revenue_collection_npr", {
    precision: 18,
    scale: 2,
  }),
  importDutyCollectionNPR: decimal("import_duty_collection_npr", {
    precision: 18,
    scale: 2,
  }),
  exciseDutyCollectionNPR: decimal("excise_duty_collection_npr", {
    precision: 18,
    scale: 2,
  }),
  vatCollectionNPR: decimal("vat_collection_npr", { precision: 18, scale: 2 }),
  otherTaxCollectionNPR: decimal("other_tax_collection_npr", {
    precision: 18,
    scale: 2,
  }),
  revenueCollectionGrowthRate: decimal("revenue_collection_growth_rate", {
    precision: 5,
    scale: 2,
  }), // Percentage

  // Services
  averageCustomsClearanceTimeHours: decimal(
    "average_customs_clearance_time_hours",
    { precision: 6, scale: 2 },
  ),
  expeditedServiceAvailable: boolean("expedited_service_available").default(
    false,
  ),
  expeditedServiceDetails: text("expedited_service_details"),
  electronicFilingAvailable: boolean("electronic_filing_available").default(
    false,
  ),
  electronicPaymentAvailable: boolean("electronic_payment_available").default(
    false,
  ),
  paymentMethodsAccepted: text("payment_methods_accepted"), // E.g., "Cash, Bank Draft, Electronic Transfer"
  hasAutomatedRiskManagement: boolean("has_automated_risk_management").default(
    false,
  ),
  hasSingleWindowSystem: boolean("has_single_window_system").default(false),
  hasPostClearanceAudit: boolean("has_post_clearance_audit").default(false),
  hasAdvanceRuling: boolean("has_advance_ruling").default(false),
  hasAuthorizedEconomicOperator: boolean(
    "has_authorized_economic_operator",
  ).default(false),
  availableServices: text("available_services"), // List of services offered

  // Modernization and development
  modernizationLevel: modernizationLevelEnum("modernization_level"),
  ongoingModernizationProjects: text("ongoing_modernization_projects"),
  plannedUpgrades: text("planned_upgrades"),
  recentImprovements: text("recent_improvements"),

  // Compliance and regulations
  hasIsoQualityCertification: boolean("has_iso_quality_certification").default(
    false,
  ),
  isoCertificationDetails: text("iso_certification_details"),
  implementsWcoStandards: boolean("implements_wco_standards").default(false), // World Customs Organization
  implementsWtoTfa: boolean("implements_wto_tfa").default(false), // WTO Trade Facilitation Agreement
  tradeAgreementsHonored: text("trade_agreements_honored"),

  // Challenges and needs
  infrastructureChallenges: text("infrastructure_challenges"),
  staffingChallenges: text("staffing_challenges"),
  technologicalChallenges: text("technological_challenges"),
  developmentNeeds: text("development_needs"),

  // Coordination with other agencies
  coordinatingAgencies: text("coordinating_agencies"), // Other agencies working at this customs
  hasImmigration: boolean("has_immigration").default(false),
  hasQuarantine: boolean("has_quarantine").default(false),
  hasBankBranch: boolean("has_bank_branch").default(false),
  bankBranchDetails: text("bank_branch_details"),
  hasClearingAgents: boolean("has_clearing_agents").default(false),
  clearingAgentCount: integer("clearing_agent_count"),

  // Security
  securityMeasures: text("security_measures"),
  hasCctv: boolean("has_cctv").default(false),
  cctvCameraCount: integer("cctv_camera_count"),
  hasArmedSecurity: boolean("has_armed_security").default(false),
  hasPerimeterFencing: boolean("has_perimeter_fence").default(false),
  hasSecurityScanning: boolean("has_security_scanning").default(false),

  // Public facilities
  hasHelpDesk: boolean("has_help_desk").default(false),
  hasPublicInformationSystem: boolean("has_public_information_system").default(
    false,
  ),
  hasGrievanceSystem: boolean("has_grievance_system").default(false),
  publicFeedbackMechanism: text("public_feedback_mechanism"),

  // Governance and transparency
  transparencyMeasures: text("transparency_measures"),
  antiCorruptionMeasures: text("anti_corruption_measures"),
  hasPublicServiceStandards: boolean("has_public_service_standards").default(
    false,
  ),

  // Linkages to other entities
  linkedRoads: jsonb("linked_roads").default(sql`'[]'::jsonb`),
  linkedParkingFacilities: jsonb("linked_parking_facilities").default(
    sql`'[]'::jsonb`,
  ),
  linkedGovernmentOffices: jsonb("linked_government_offices").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  facilityArea: geometry("facility_area", { type: "Polygon" }),

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

export type CustomsOffice = typeof customsOffice.$inferSelect;
export type NewCustomsOffice = typeof customsOffice.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
