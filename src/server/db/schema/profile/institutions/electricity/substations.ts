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
import { operationalStatusEnum, ownershipTypeEnum } from "./generation-centers";

// Define substation type enum
export const substationTypeEnum = pgEnum("substation_type", [
  "TRANSMISSION",
  "DISTRIBUTION",
  "SWITCHING",
  "STEP_UP",
  "STEP_DOWN",
  "COLLECTOR", // For renewable energy sources
  "GRID_INTERCONNECTION",
  "CONSUMER",
  "MOBILE",
  "OTHER",
]);

// Define substation classification enum
export const substationClassEnum = pgEnum("substation_class", [
  "PRIMARY",
  "SECONDARY",
  "GRID",
  "LOCAL",
  "INDUSTRIAL",
  "RURAL",
  "URBAN",
]);

// Electricity Substation table
export const electricitySubstation = pgTable("electricity_substation", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  substationType: substationTypeEnum("substation_type").notNull(),
  substationClass: substationClassEnum("substation_class").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"),
  address: text("address"),

  // Basic information
  primaryVoltage: integer("primary_voltage_kv").notNull(), // In kilovolts
  secondaryVoltage: integer("secondary_voltage_kv").notNull(), // In kilovolts
  transformationCapacityMVA: decimal("transformation_capacity_mva", {
    precision: 10,
    scale: 2,
  }).notNull(), // In Mega Volt Amperes
  operationalStatus: operationalStatusEnum("operational_status").notNull(),
  commissionedDate: date("commissioned_date"),
  ownershipType: ownershipTypeEnum("ownership_type").notNull(),
  ownerOrganization: text("owner_organization"),
  operatorOrganization: text("operator_organization"),

  // Technical specifications
  busConfiguration: text("bus_configuration"), // e.g., "Single Bus", "Double Bus", "Ring Bus", etc.
  numberOfBays: integer("number_of_bays"),
  numberOfTransformers: integer("number_of_transformers"),
  transformerDetails: text("transformer_details"),
  hasCapacitorBanks: boolean("has_capacitor_banks").default(false),
  capacitorBanksDetails: text("capacitor_banks_details"),
  hasReactors: boolean("has_reactors").default(false),
  reactorsDetails: text("reactors_details"),
  hasSwitchgear: boolean("has_switchgear").default(true),
  switchgearType: text("switchgear_type"), // e.g., "AIS", "GIS", "Hybrid"
  breakerCount: integer("breaker_count"),
  breakerType: text("breaker_type"), // e.g., "Air", "Oil", "SF6", "Vacuum"
  disconnectorCount: integer("disconnector_count"),
  hasEarthSwitch: boolean("has_earth_switch").default(true),
  hasSurgeArresters: boolean("has_surge_arresters").default(true),
  surgeArresterDetails: text("surge_arrester_details"),
  hasMeteringEquipment: boolean("has_metering_equipment").default(true),
  meteringEquipmentDetails: text("metering_equipment_details"),
  hasProtectionRelays: boolean("has_protection_relays").default(true),
  protectionRelaysType: text("protection_relays_type"), // e.g., "Electromechanical", "Numerical", "Digital"
  reliabilityIndex: decimal("reliability_index", { precision: 5, scale: 2 }),

  // Connectivity details
  incomingFeeders: integer("incoming_feeders"),
  outgoingFeeders: integer("outgoing_feeders"),
  incomingTransmissionLines: text("incoming_transmission_lines"),
  outgoingTransmissionLines: text("outgoing_transmission_lines"),
  connectedGenerationSources: text("connected_generation_sources"),
  connectedSubstations: text("connected_substations"),
  gridConnectivity: boolean("grid_connectivity").default(true),
  isolationCapability: boolean("isolation_capability").default(true),

  // Physical infrastructure
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
  hasBoundaryWall: boolean("has_boundary_wall").default(true),
  hasControlBuilding: boolean("has_control_building").default(true),
  buildingCondition: text("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),

  // Control and monitoring
  controlType: text("control_type"), // e.g., "Manual", "Automated", "Semi-Automated"
  hasScada: boolean("has_scada").default(false),
  scadaSystemDetails: text("scada_system_details"),
  hasRemoteControl: boolean("has_remote_control").default(false),
  hasDistanceTelemetry: boolean("has_distance_telemetry").default(false),
  communicationSystem: text("communication_system"), // e.g., "Fiber Optic", "Microwave", "PLC"
  hasDCS: boolean("has_dcs").default(false), // Distributed Control System
  automationLevel: text("automation_level"),
  monitoringParameters: text("monitoring_parameters"),

  // Safety and security
  hasFireProtection: boolean("has_fire_protection").default(true),
  fireProtectionSystem: text("fire_protection_system"),
  hasLightningProtection: boolean("has_lightning_protection").default(true),
  lightningProtectionDetails: text("lightning_protection_details"),
  securitySystem: text("security_system"),
  hasCCTV: boolean("has_cctv").default(false),
  hasPerimeterAlarm: boolean("has_perimeter_alarm").default(false),
  hasMannedSecurity: boolean("has_manned_security").default(true),
  securityPersonnelCount: integer("security_personnel_count"),
  emergencyResponseProcedure: boolean("emergency_response_procedure").default(
    false,
  ),
  safetyTrainings: text("safety_trainings"),
  accidentHistory: text("accident_history"),

  // Grounding and insulation
  groundingSystem: text("grounding_system"), // e.g., "Grid", "Ring", "Radial"
  groundingResistanceOhm: decimal("grounding_resistance_ohm", {
    precision: 6,
    scale: 2,
  }),
  insulationCoordinationLevel: text("insulation_coordination_level"),
  basicInsulationLevelKV: integer("basic_insulation_level_kv"),

  // Power quality
  powerQualityMonitoring: boolean("power_quality_monitoring").default(false),
  harmonicDistortionPercent: decimal("harmonic_distortion_percent", {
    precision: 5,
    scale: 2,
  }),
  voltageRegulationPercent: decimal("voltage_regulation_percent", {
    precision: 5,
    scale: 2,
  }),
  powerFactorCorrection: boolean("power_factor_correction").default(false),
  powerFactorValue: decimal("power_factor_value", { precision: 4, scale: 2 }),

  // Staff and management
  totalStaffCount: integer("total_staff_count"),
  technicalStaffCount: integer("technical_staff_count"),
  administrativeStaffCount: integer("administrative_staff_count"),
  securityStaffCount: integer("security_staff_count"),
  operationalShifts: integer("operational_shifts"),
  staffingPerShift: integer("staffing_per_shift"),

  // Environmental aspects
  hasSoundProofing: boolean("has_sound_proofing").default(false),
  noiseLevel: decimal("noise_level_db", { precision: 5, scale: 2 }),
  oilContainmentSystem: boolean("oil_containment_system").default(false),
  oilContainmentDetails: text("oil_containment_details"),
  pcbStatus: text("pcb_status"), // Polychlorinated biphenyls status
  sf6GasAmount: decimal("sf6_gas_amount_kg", { precision: 8, scale: 2 }),
  environmentalImpactAssessment: boolean(
    "environmental_impact_assessment",
  ).default(false),
  environmentalMitigationMeasures: text("environmental_mitigation_measures"),

  // Maintenance
  maintenanceSchedule: text("maintenance_schedule"),
  lastMajorMaintenance: date("last_major_maintenance"),
  plannedOutages: text("planned_outages"),
  unplannedOutages: text("unplanned_outages"),
  maintenanceResponsibility: text("maintenance_responsibility"), // e.g., "Owner", "Contractor", "NEA"
  conditionMonitoringSystem: text("condition_monitoring_system"),
  predictiveMaintenanceCapability: boolean(
    "predictive_maintenance_capability",
  ).default(false),

  // Financial aspects
  totalProjectCostNPR: decimal("total_project_cost_npr", {
    precision: 18,
    scale: 2,
  }),
  annualOperatingCostNPR: decimal("annual_operating_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  annualMaintenanceCostNPR: decimal("annual_maintenance_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  depreciationSchedule: text("depreciation_schedule"),
  assetLifeYears: integer("asset_life_years"),

  // Load details
  peakLoadMW: decimal("peak_load_mw", { precision: 10, scale: 2 }),
  averageLoadMW: decimal("average_load_mw", { precision: 10, scale: 2 }),
  loadFactor: decimal("load_factor", { precision: 5, scale: 2 }),
  loadGrowthRatePercent: decimal("load_growth_rate_percent", {
    precision: 5,
    scale: 2,
  }),
  loadProfile: text("load_profile"),

  // Outages and reliability
  annualOutageHours: decimal("annual_outage_hours", { precision: 8, scale: 2 }),
  plannedOutageHours: decimal("planned_outage_hours", {
    precision: 8,
    scale: 2,
  }),
  unplannedOutageHours: decimal("unplanned_outage_hours", {
    precision: 8,
    scale: 2,
  }),
  saidiMinutesPerYear: decimal("saidi_minutes_per_year", {
    precision: 8,
    scale: 2,
  }), // System Average Interruption Duration Index
  saifiInterruptionsPerYear: decimal("saifi_interruptions_per_year", {
    precision: 6,
    scale: 2,
  }), // System Average Interruption Frequency Index
  mainFailureCauses: text("main_failure_causes"),

  // Access and infrastructure
  accessRoadCondition: text("access_road_condition"),
  accessibilityDetails: text("accessibility_details"),
  nearestTownDistance: decimal("nearest_town_distance_km", {
    precision: 6,
    scale: 2,
  }),
  availableTransportationModes: text("available_transportation_modes"),

  // Utilities and amenities
  hasWaterSupply: boolean("has_water_supply").default(true),
  hasSanitation: boolean("has_sanitation").default(true),
  hasBackupPowerSupply: boolean("has_backup_power_supply").default(true),
  backupPowerType: text("backup_power_type"), // e.g., "Generator", "UPS", "Battery"
  hasStaffAccommodation: boolean("has_staff_accommodation").default(false),

  // Contact information
  inChargePersonName: text("in_charge_person_name"),
  contactPhone: text("contact_phone"),
  emergencyContactPhone: text("emergency_contact_phone"),
  email: text("email"),

  // Challenges and issues
  operationalChallenges: text("operational_challenges"),
  technicalChallenges: text("technical_challenges"),
  maintenanceChallenges: text("maintenance_challenges"),
  securityChallenges: text("security_challenges"),

  // Future development
  upgradePlans: text("upgrade_plans"),
  expansionPlans: text("expansion_plans"),
  futureCapacityMVA: decimal("future_capacity_mva", {
    precision: 10,
    scale: 2,
  }),

  // Linkages to other entities
  linkedGenerationCenters: jsonb("linked_generation_centers").default(
    sql`'[]'::jsonb`,
  ),
  linkedTransformers: jsonb("linked_transformers").default(sql`'[]'::jsonb`),
  linkedSubstations: jsonb("linked_substations").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  facilityArea: geometry("facility_area", { type: "Polygon" }),
  serviceAreaCoverage: geometry("service_area_coverage", {
    type: "MultiPolygon",
  }),

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

export type ElectricitySubstation = typeof electricitySubstation.$inferSelect;
export type NewElectricitySubstation =
  typeof electricitySubstation.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
