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
import { waterQualityStatusEnum } from "./rivers";

// Define canal type enum
export const canalTypeEnum = pgEnum("canal_type", [
  "MAIN_CANAL",
  "BRANCH_CANAL",
  "SECONDARY_CANAL",
  "TERTIARY_CANAL",
  "DISTRIBUTION_CANAL",
  "FEEDER_CANAL",
  "DRAINAGE_CANAL",
  "MULTIPURPOSE_CANAL",
  "OTHER",
]);

// Define canal construction type enum
export const canalConstructionTypeEnum = pgEnum("canal_construction_type", [
  "EARTHEN",
  "LINED_CONCRETE",
  "LINED_STONE",
  "LINED_BRICK",
  "LINED_PLASTIC",
  "COMPOSITE",
  "PIPED",
  "OTHER",
]);

// Define canal condition enum
export const canalConditionEnum = pgEnum("canal_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "VERY_POOR",
  "DAMAGED",
  "UNDER_CONSTRUCTION",
  "UNDER_MAINTENANCE",
  "ABANDONED",
]);

// Define flow control mechanism enum
export const flowControlMechanismEnum = pgEnum("flow_control_mechanism", [
  "GATES",
  "WEIRS",
  "VALVES",
  "PUMPS",
  "SIPHONS",
  "MANUAL",
  "AUTOMATED",
  "NONE",
  "OTHER",
]);

// Define management type enum
export const irrigationManagementTypeEnum = pgEnum(
  "irrigation_management_type",
  [
    "GOVERNMENT",
    "COMMUNITY",
    "WATER_USER_ASSOCIATION",
    "PRIVATE",
    "COOPERATIVE",
    "JOINT_MANAGEMENT",
    "PUBLIC_PRIVATE_PARTNERSHIP",
    "OTHER",
  ],
);

// Irrigation Canal table
export const irrigationCanal = pgTable("irrigation_canal", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  localName: text("local_name"),
  description: text("description"),
  canalType: canalTypeEnum("canal_type").notNull(),

  // Physical characteristics
  totalLengthKm: decimal("total_length_km", { precision: 8, scale: 3 }),
  averageWidthM: decimal("average_width_m", { precision: 6, scale: 2 }),
  maximumWidthM: decimal("maximum_width_m", { precision: 6, scale: 2 }),
  minimumWidthM: decimal("minimum_width_m", { precision: 6, scale: 2 }),
  averageDepthM: decimal("average_depth_m", { precision: 6, scale: 2 }),
  maximumDepthM: decimal("maximum_depth_m", { precision: 6, scale: 2 }),
  constructionType: canalConstructionTypeEnum("construction_type").notNull(),
  canalCondition: canalConditionEnum("canal_condition"),
  canalGradient: decimal("canal_gradient", { precision: 6, scale: 4 }), // Slope in percentage
  bedMaterial: text("bed_material"),
  bankMaterial: text("bank_material"),
  hasLining: boolean("has_lining").default(false),
  liningType: text("lining_type"), // Concrete, stone, brick, etc.
  liningCondition: text("lining_condition"),
  liningThicknessM: decimal("lining_thickness_m", { precision: 5, scale: 3 }),
  percentLinedSection: integer("percent_lined_section"), // 0-100

  // Technical details
  designDischargeM3S: decimal("design_discharge_m3s", {
    precision: 8,
    scale: 3,
  }), // cubic meters per second
  actualDischargeM3S: decimal("actual_discharge_m3s", {
    precision: 8,
    scale: 3,
  }),
  waterSourceName: text("water_source_name"), // Name of river, stream, reservoir, etc.
  waterSourceType: text("water_source_type"), // River, Stream, Reservoir, etc.
  sourceLocationDescription: text("source_location_description"),
  flowControlMechanism: flowControlMechanismEnum("flow_control_mechanism"),
  flowControlDetails: text("flow_control_details"),
  crossSectionType: text("cross_section_type"), // Rectangular, Trapezoidal, etc.
  crossSectionDetails: text("cross_section_details"),
  waterLossPercent: decimal("water_loss_percent", { precision: 5, scale: 2 }),
  waterLossReasons: text("water_loss_reasons"),

  // Construction and maintenance
  constructionYear: integer("construction_year"),
  lastMajorRehabilitationYear: integer("last_major_rehabilitation_year"),
  constructedBy: text("constructed_by"),
  constructionProjectName: text("construction_project_name"),
  constructionCostNPR: decimal("construction_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  fundingSource: text("funding_source"),
  designLifeYears: integer("design_life_years"),
  lastMaintenanceDate: date("last_maintenance_date"),
  maintenanceFrequency: text("maintenance_frequency"),
  annualMaintenanceCostNPR: decimal("annual_maintenance_cost_npr", {
    precision: 12,
    scale: 2,
  }),
  maintenanceFundingSource: text("maintenance_funding_source"),

  // Service area and usage
  totalIrrigatedAreaHectares: decimal("total_irrigated_area_hectares", {
    precision: 12,
    scale: 2,
  }),
  commandAreaHectares: decimal("command_area_hectares", {
    precision: 12,
    scale: 2,
  }),
  actualIrrigatedAreaRainy: decimal("actual_irrigated_area_rainy", {
    precision: 12,
    scale: 2,
  }),
  actualIrrigatedAreaWinter: decimal("actual_irrigated_area_winter", {
    precision: 12,
    scale: 2,
  }),
  actualIrrigatedAreaSpring: decimal("actual_irrigated_area_spring", {
    precision: 12,
    scale: 2,
  }),
  beneficiaryHouseholdCount: integer("beneficiary_household_count"),
  beneficiaryPopulation: integer("beneficiary_population"),
  majorCropsIrrigated: text("major_crops_irrigated"),
  croppingIntensityPercent: integer("cropping_intensity_percent"), // 100-300
  waterAvailabilityStatus: text("water_availability_status"), // Adequate, Inadequate, etc.
  waterDistributionMethod: text("water_distribution_method"), // Rotation, Continuous, On-demand
  irrigationScheduleDetails: text("irrigation_schedule_details"),
  waterUseEfficiencyPercent: integer("water_use_efficiency_percent"),
  secondaryUsage: text("secondary_usage"), // Drinking, Livestock, Fishery, etc.

  // Management and administration
  managementType: irrigationManagementTypeEnum("management_type").notNull(),
  managingAuthority: text("managing_authority"),
  waterUserAssociationName: text("water_user_association_name"),
  waterUserCommitteeSize: integer("water_user_committee_size"),
  womenInCommitteeCount: integer("women_in_committee_count"),
  yearOfWUAFormation: integer("year_of_wua_formation"),
  wuaRegistrationNumber: text("wua_registration_number"),
  wuaRegistrationDate: date("wua_registration_date"),
  hasWaterFeeSystem: boolean("has_water_fee_system").default(false),
  waterFeeStructure: text("water_fee_structure"),
  annualWaterFeeCollectionNPR: decimal("annual_water_fee_collection_npr", {
    precision: 12,
    scale: 2,
  }),
  feeCollectionRate: decimal("fee_collection_rate", { precision: 5, scale: 2 }), // Percentage
  hasOperationPlan: boolean("has_operation_plan").default(false),
  operationPlanDetails: text("operation_plan_details"),
  hasMeetings: boolean("has_meetings").default(false),
  meetingFrequency: text("meeting_frequency"),

  // Water quality
  waterQualityStatus: waterQualityStatusEnum("water_quality_status"),
  lastWaterQualityTestDate: date("last_water_quality_test_date"),
  waterQualityIssues: text("water_quality_issues"),
  waterQualityMonitoring: boolean("water_quality_monitoring").default(false),
  monitoringFrequency: text("monitoring_frequency"),

  // Environmental aspects
  environmentalFlowProvision: boolean("environmental_flow_provision").default(
    false,
  ),
  environmentalFlowDetails: text("environmental_flow_details"),
  hasAquaticLife: boolean("has_aquatic_life").default(false),
  aquaticLifeDetails: text("aquatic_life_details"),
  sedimentationIssues: text("sedimentation_issues"),
  erosionIssues: text("erosion_issues"),
  waterloggingIssues: text("waterlogging_issues"),
  salinityIssues: text("salinity_issues"),
  hasBioengineering: boolean("has_bioengineering").default(false),
  bioengineeringDetails: text("bioengineering_details"),

  // Infrastructure
  hasIntakes: boolean("has_intakes").default(true),
  intakeCount: integer("intake_count"),
  intakeType: text("intake_type"), // Fixed, Temporary, Barrage, etc.
  hasDivertingDam: boolean("has_diverting_dam").default(false),
  divertingDamDetails: text("diverting_dam_details"),
  hasAqueducts: boolean("has_aqueducts").default(false),
  aqueductCount: integer("aqueduct_count"),
  hasCulverts: boolean("has_culverts").default(false),
  culvertCount: integer("culvert_count"),
  hasSyphons: boolean("has_syphons").default(false),
  syphonCount: integer("syphon_count"),
  hasEscapes: boolean("has_escapes").default(false),
  escapeCount: integer("escape_count"),
  hasDropStructures: boolean("has_drop_structures").default(false),
  dropStructureCount: integer("drop_structure_count"),
  hasDesilting: boolean("has_desilting").default(false),
  desiltingDetails: text("desilting_details"),
  hasMeasuringDevices: boolean("has_measuring_devices").default(false),
  measuringDeviceDetails: text("measuring_device_details"),
  hasRoadCrossings: boolean("has_road_crossings").default(false),
  roadCrossingCount: integer("road_crossing_count"),
  structureCondition: text("structure_condition"),

  // Performance and challenges
  irrigationEfficiencyPercent: integer("irrigation_efficiency_percent"),
  conveyanceEfficiencyPercent: integer("conveyance_efficiency_percent"),
  applicationEfficiencyPercent: integer("application_efficiency_percent"),
  majorProblems: text("major_problems"),
  waterScarcityIssues: text("water_scarcity_issues"),
  conflictIssues: text("conflict_issues"),
  conflictResolutionMechanism: text("conflict_resolution_mechanism"),
  missingInfrastructure: text("missing_infrastructure"),

  // Impact on agriculture
  preIrrigationYieldData: text("pre_irrigation_yield_data"),
  postIrrigationYieldData: text("post_irrigation_yield_data"),
  croppingPatternChanges: text("cropping_pattern_changes"),
  agriculturalIncomeImpact: text("agricultural_income_impact"),
  farmGateValueIncrease: text("farm_gate_value_increase"),

  // Modernization and improvement
  rehabilitationNeeds: text("rehabilitation_needs"),
  modernizationPlans: text("modernization_plans"),
  upgradeProposals: text("upgrade_proposals"),
  proposedExpansionAreaHa: decimal("proposed_expansion_area_ha", {
    precision: 10,
    scale: 2,
  }),
  estimatedUpgradeCostNPR: decimal("estimated_upgrade_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  hasPressurizedIrrigationSystems: boolean(
    "has_pressurized_irrigation_systems",
  ).default(false),
  pressurizedIrrigationDetails: text("pressurized_irrigation_details"),

  // Historical context
  historicalSignificance: text("historical_significance"),
  traditionalManagementPractices: text("traditional_management_practices"),
  changesInManagement: text("changes_in_management"),

  // Social impact
  hasImprovedLivelihood: boolean("has_improved_livelihood").default(false),
  livelihoodImpactDetails: text("livelihood_impact_details"),
  socialChanges: text("social_changes"),
  genderParticipation: text("gender_participation"),
  inclusiveParticipation: text("inclusive_participation"),

  // Climate resilience
  climateVulnerability: text("climate_vulnerability"),
  adaptationMeasures: text("adaptation_measures"),
  droughtResilienceRating: text("drought_resilience_rating"),
  floodResilienceRating: text("flood_resilience_rating"),

  // Legal and policy aspects
  legalStatus: text("legal_status"),
  waterRightsIssues: text("water_rights_issues"),
  policyImplementation: text("policy_implementation"),

  // SEO metadata
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  canalStartPoint: geometry("canal_start_point", { type: "Point" }),
  canalEndPoint: geometry("canal_end_point", { type: "Point" }),
  canalAlignment: geometry("canal_alignment", { type: "LineString" }),
  canalWidthLine: geometry("canal_width_line", { type: "MultiLineString" }),
  commandArea: geometry("command_area", { type: "MultiPolygon" }),
  irrigationNetworkArea: geometry("irrigation_network_area", {
    type: "MultiPolygon",
  }),

  // Linked entities
  linkedWaterSource: jsonb("linked_water_source").default(sql`'[]'::jsonb`), // River, reservoir, etc.
  linkedSubcanals: jsonb("linked_subcanals").default(sql`'[]'::jsonb`),
  linkedParentCanal: jsonb("linked_parent_canal").default(sql`'[]'::jsonb`),
  linkedWaterProjects: jsonb("linked_water_projects").default(sql`'[]'::jsonb`),
  linkedSettlements: jsonb("linked_settlements").default(sql`'[]'::jsonb`),
  linkedAgricultureLands: jsonb("linked_agriculture_lands").default(
    sql`'[]'::jsonb`,
  ),

  // Status and metadata
  isActive: boolean("is_active").default(true),
  isOperational: boolean("is_operational").default(true),
  operationalStatus: text("operational_status"),
  isVerified: boolean("is_verified").default(false),
  verificationDate: timestamp("verification_date"),
  verifiedBy: varchar("verified_by", { length: 36 }),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type IrrigationCanal = typeof irrigationCanal.$inferSelect;
export type NewIrrigationCanal = typeof irrigationCanal.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
