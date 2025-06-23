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

// Define transformer type enum
export const transformerTypeEnum = pgEnum("transformer_type", [
  "DISTRIBUTION",
  "POWER",
  "AUTO",
  "STEP_UP",
  "STEP_DOWN",
  "ISOLATING",
  "INSTRUMENT",
  "CURRENT",
  "VOLTAGE",
  "POLE_MOUNTED",
  "PAD_MOUNTED",
  "GROUNDING",
  "OTHER",
]);

// Define cooling type enum
export const transformerCoolingEnum = pgEnum("transformer_cooling", [
  "OIL_NATURAL_AIR_NATURAL", // ONAN
  "OIL_NATURAL_AIR_FORCED", // ONAF
  "OIL_FORCED_AIR_FORCED", // OFAF
  "OIL_FORCED_WATER_FORCED", // OFWF
  "DRY_TYPE",
  "CAST_RESIN",
  "SEALED",
  "NON_SEALED",
  "OTHER",
]);

// Define insulation type enum
export const insulationTypeEnum = pgEnum("insulation_type", [
  "OIL_IMMERSED",
  "DRY_TYPE",
  "SF6_GAS",
  "AIR_CORE",
  "VACUUM",
  "RESIN_IMPREGNATED",
  "OTHER",
]);

// Electricity Transformer table
export const electricityTransformer = pgTable("electricity_transformer", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  transformerType: transformerTypeEnum("transformer_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"),
  address: text("address"),
  installedAtSubstationId: varchar("installed_at_substation_id", {
    length: 36,
  }),
  installedAtSubstationName: text("installed_at_substation_name"),
  isPoleMount: boolean("is_pole_mount").default(false),
  isGroundMount: boolean("is_ground_mount").default(false),
  hasDedicatedEnclosure: boolean("has_dedicated_enclosure").default(false),

  // Basic information
  serialNumber: varchar("serial_number", { length: 100 }),
  manufacturer: text("manufacturer"),
  manufacturingYear: integer("manufacturing_year"),
  capacityKVA: decimal("capacity_kva", { precision: 10, scale: 2 }).notNull(), // In Kilo Volt Amperes
  primaryVoltage: integer("primary_voltage_v").notNull(), // In volts
  secondaryVoltage: integer("secondary_voltage_v").notNull(), // In volts
  tertiaryVoltage: integer("tertiary_voltage_v"), // In volts (if applicable)
  phases: integer("phases").notNull(), // Usually 1 or 3
  frequency: integer("frequency_hz").notNull(), // In Hertz, typically 50 or 60
  operationalStatus: operationalStatusEnum("operational_status").notNull(),
  installationDate: date("installation_date"),
  commissionedDate: date("commissioned_date"),
  ownershipType: ownershipTypeEnum("ownership_type").notNull(),
  ownerOrganization: text("owner_organization"),
  operatorOrganization: text("operator_organization"),

  // Technical specifications
  impedancePercent: decimal("impedance_percent", { precision: 5, scale: 2 }),
  coolingType: transformerCoolingEnum("cooling_type").notNull(),
  insulationType: insulationTypeEnum("insulation_type").notNull(),
  insulationClass: text("insulation_class"), // e.g., "A", "B", "F", "H"
  temperatureRiseLimit: integer("temperature_rise_limit_celsius"), // In degrees Celsius
  vectorGroup: text("vector_group"), // e.g., "Dyn11", "YNyn0", etc.
  tapChangerType: text("tap_changer_type"), // e.g., "OLTC", "DETC", "None"
  tapPositions: integer("tap_positions"),
  tapRange: text("tap_range"), // e.g., "+/- 10%"
  noLoadLossesWatts: decimal("no_load_losses_watts", {
    precision: 10,
    scale: 2,
  }),
  loadLossesWatts: decimal("load_losses_watts", { precision: 10, scale: 2 }),
  efficiencyPercent: decimal("efficiency_percent", { precision: 5, scale: 2 }),
  weightKg: decimal("weight_kg", { precision: 10, scale: 2 }),
  oilWeightKg: decimal("oil_weight_kg", { precision: 10, scale: 2 }),
  oilType: text("oil_type"), // e.g., "Mineral", "Synthetic", "Bio-degradable"
  hasBushings: boolean("has_bushings").default(true),
  bushingType: text("bushing_type"),
  hasConservator: boolean("has_conservator").default(false),
  hasBreatherSystem: boolean("has_breather_system").default(false),
  hasBuchholzRelay: boolean("has_buchholz_relay").default(false),
  hasPressureReliefDevice: boolean("has_pressure_relief_device").default(false),
  hasOilLevelIndicator: boolean("has_oil_level_indicator").default(false),
  hasTemperatureIndicator: boolean("has_temperature_indicator").default(false),
  hasCoolingFans: boolean("has_cooling_fans").default(false),
  hasOilPump: boolean("has_oil_pump").default(false),

  // Protection devices
  hasFuses: boolean("has_fuses").default(false),
  fuseRating: text("fuse_rating"),
  hasCircuitBreaker: boolean("has_circuit_breaker").default(false),
  circuitBreakerType: text("circuit_breaker_type"),
  hasLightningArresters: boolean("has_lightning_arresters").default(false),
  lightningArresterType: text("lightning_arrester_type"),
  hasEarthingProtection: boolean("has_earthing_protection").default(true),
  earthingDetails: text("earthing_details"),
  hasOverloadProtection: boolean("has_overload_protection").default(true),
  hasShortCircuitProtection: boolean("has_short_circuit_protection").default(
    true,
  ),

  // Metering and monitoring
  hasMeter: boolean("has_meter").default(false),
  meterType: text("meter_type"),
  hasRemoteMonitoring: boolean("has_remote_monitoring").default(false),
  monitoringParameters: text("monitoring_parameters"), // e.g., "Temperature, Oil level, Load"
  hasAlarmSystem: boolean("has_alarm_system").default(false),
  alarmSystemDetails: text("alarm_system_details"),

  // Load details
  maximumLoadKVA: decimal("maximum_load_kva", { precision: 10, scale: 2 }),
  averageLoadKVA: decimal("average_load_kva", { precision: 10, scale: 2 }),
  loadFactorPercent: decimal("load_factor_percent", { precision: 5, scale: 2 }),
  numberOfConsumers: integer("number_of_consumers"),
  peakLoadTime: text("peak_load_time"), // e.g., "Evening 6-8 PM"
  loadProfile: text("load_profile"),

  // Maintenance
  maintenanceSchedule: text("maintenance_schedule"),
  lastMaintenanceDate: date("last_maintenance_date"),
  maintenanceResponsibility: text("maintenance_responsibility"), // e.g., "NEA", "Local Authority", "Private Contractor"
  oilTestFrequency: text("oil_test_frequency"), // e.g., "Annual", "Bi-annual"
  lastOilTest: date("last_oil_test"),
  oilCondition: text("oil_condition"),
  insulationResistanceMegaOhms: decimal("insulation_resistance_mega_ohms", {
    precision: 10,
    scale: 2,
  }),
  lastInsulationTest: date("last_insulation_test"),

  // Financial aspects
  acquisitionCostNPR: decimal("acquisition_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  installationCostNPR: decimal("installation_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  annualMaintenanceCostNPR: decimal("annual_maintenance_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  depreciation: text("depreciation"), // Depreciation method or rate
  estimatedLifeYears: integer("estimated_life_years"),
  remainingLifeYears: integer("remaining_life_years"),

  // Environmental aspects
  environmentallyCertified: boolean("environmentally_certified").default(false),
  environmentalCertificationType: text("environmental_certification_type"),
  pcbFree: boolean("pcb_free").default(true), // Polychlorinated biphenyls
  containmentSystem: boolean("containment_system").default(false), // For oil leakages
  containmentDetails: text("containment_details"),
  noiseLevel: decimal("noise_level_db", { precision: 5, scale: 2 }),

  // Safety and security
  fencedEnclosure: boolean("fenced_enclosure").default(false),
  lockedEnclosure: boolean("locked_enclosure").default(false),
  warningSignsPosted: boolean("warning_signs_posted").default(true),
  securityMeasures: text("security_measures"),
  fireProtection: text("fire_protection"),
  accidentHistory: text("accident_history"),

  // Service area
  residentialAreaServed: boolean("residential_area_served").default(false),
  commercialAreaServed: boolean("commercial_area_served").default(false),
  industrialAreaServed: boolean("industrial_area_served").default(false),
  serviceAreaDescription: text("service_area_description"),
  householdsServed: integer("households_served"),

  // Contact information
  responsiblePersonName: text("responsible_person_name"),
  contactPhone: text("contact_phone"),
  emergencyContactPhone: text("emergency_contact_phone"),
  email: text("email"),

  // Issues and challenges
  operationalIssues: text("operational_issues"),
  overloadingIssues: boolean("overloading_issues").default(false),
  voltageFluctuationIssues: boolean("voltage_fluctuation_issues").default(
    false,
  ),
  frequentFailures: boolean("frequent_failures").default(false),
  failureCauses: text("failure_causes"),

  // Future plans
  replacementPlanned: boolean("replacement_planned").default(false),
  plannedReplacementYear: integer("planned_replacement_year"),
  upgradePlanned: boolean("upgrade_planned").default(false),
  plannedUpgradeCapacityKVA: decimal("planned_upgrade_capacity_kva", {
    precision: 10,
    scale: 2,
  }),

  // Linkages to other entities
  linkedSubstation: jsonb("linked_substation").default(sql`'[]'::jsonb`),
  linkedPoles: jsonb("linked_poles").default(sql`'[]'::jsonb`),
  linkedFeeders: jsonb("linked_feeders").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
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

export type ElectricityTransformer = typeof electricityTransformer.$inferSelect;
export type NewElectricityTransformer =
  typeof electricityTransformer.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
