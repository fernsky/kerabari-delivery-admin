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
import { environmentalImpactLevelEnum } from "../common";

// Define landfill site type enum
export const landfillSiteTypeEnum = pgEnum("landfill_site_type", [
  "SANITARY_LANDFILL",
  "CONTROLLED_DUMP",
  "ENGINEERED_LANDFILL",
  "BIOREACTOR_LANDFILL",
  "SECURE_LANDFILL",
  "CONSTRUCTION_DEBRIS_LANDFILL",
  "TEMPORARY_LANDFILL",
  "OTHER",
]);

// Define landfill site status enum
export const landfillSiteStatusEnum = pgEnum("landfill_site_status", [
  "OPERATIONAL",
  "PLANNED",
  "UNDER_CONSTRUCTION",
  "CLOSED",
  "POST_CLOSURE_MONITORING",
  "FULL",
  "ABANDONED",
  "TEMPORARY_CLOSED",
  "REMEDIATION",
]);

// Define waste type enum
export const wasteTypeEnum = pgEnum("waste_type", [
  "MUNICIPAL_SOLID_WASTE",
  "CONSTRUCTION_DEBRIS",
  "INDUSTRIAL_NON_HAZARDOUS",
  "HAZARDOUS_WASTE",
  "BIOMEDICAL_WASTE",
  "MIXED_WASTE",
  "INERT_WASTE",
  "ORGANIC_WASTE",
  "OTHER",
]);

// Define operation frequency enum
export const operationFrequencyEnum = pgEnum("operation_frequency", [
  "DAILY",
  "WEEKDAYS_ONLY",
  "SPECIFIC_DAYS",
  "SEASONAL",
  "ON_DEMAND",
  "IRREGULAR",
]);

// Define liner type enum
export const linerTypeEnum = pgEnum("liner_type", [
  "CLAY",
  "GEOMEMBRANE",
  "COMPOSITE_LINER",
  "GCL",
  "HDPE",
  "NONE",
  "OTHER",
]);

// Landfill Site table
export const landfillSite = pgTable("landfill_site", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  landfillType: landfillSiteTypeEnum("landfill_type").notNull(),
  status: landfillSiteStatusEnum("status").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  establishedYear: integer("established_year"),
  plannedClosureYear: integer("planned_closure_year"),
  actualClosureYear: integer("actual_closure_year"),
  operatorName: text("operator_name"), // Entity operating the landfill
  operatorType: text("operator_type"), // Municipal, Private, PPP, etc.
  licenseNumber: varchar("license_number", { length: 100 }),
  licensingAuthority: text("licensing_authority"),
  licenseIssueDate: date("license_issue_date"),
  licenseExpiryDate: date("license_expiry_date"),
  environmentalClearanceNumber: varchar("environmental_clearance_number", {
    length: 100,
  }),
  environmentalClearanceDate: date("environmental_clearance_date"),
  hasEIA: boolean("has_eia").default(false), // Environmental Impact Assessment
  eiaDetails: text("eia_details"),

  // Site specifications
  totalAreaSqm: decimal("total_area_sq_m", { precision: 14, scale: 2 }),
  totalActiveAreaSqm: decimal("total_active_area_sq_m", {
    precision: 14,
    scale: 2,
  }),
  totalCellCount: integer("total_cell_count"),
  activeCellCount: integer("active_cell_count"),
  closedCellCount: integer("closed_cell_count"),
  totalCapacityTons: decimal("total_capacity_tons", {
    precision: 14,
    scale: 2,
  }),
  remainingCapacityTons: decimal("remaining_capacity_tons", {
    precision: 14,
    scale: 2,
  }),
  estimatedRemainingLifeYears: decimal("estimated_remaining_life_years", {
    precision: 5,
    scale: 2,
  }),
  maximumHeightM: decimal("maximum_height_m", { precision: 8, scale: 2 }),
  wasteDepthM: decimal("waste_depth_m", { precision: 8, scale: 2 }),

  // Waste specifications
  acceptedWasteTypes: jsonb("accepted_waste_types").default(sql`'[]'::jsonb`), // Array of wasteTypeEnum values
  primaryWasteType: wasteTypeEnum("primary_waste_type"),
  dailyWasteReceiptTons: decimal("daily_waste_receipt_tons", {
    precision: 10,
    scale: 2,
  }),
  annualWasteReceiptTons: decimal("annual_waste_receipt_tons", {
    precision: 14,
    scale: 2,
  }),
  wasteCompactionDensityKgM3: decimal("waste_compaction_density_kg_m3", {
    precision: 8,
    scale: 2,
  }),
  wasteDiversionPercentage: decimal("waste_diversion_percentage", {
    precision: 5,
    scale: 2,
  }),
  hasWasteSorting: boolean("has_waste_sorting").default(false),
  wasteSortingMethod: text("waste_sorting_method"),
  hasRecyclingProgram: boolean("has_recycling_program").default(false),
  recyclingDetails: text("recycling_details"),
  hasCompostingProgram: boolean("has_composting_program").default(false),
  compostingDetails: text("composting_details"),

  // Technical specifications
  hasLiner: boolean("has_liner").default(false),
  linerType: linerTypeEnum("liner_type"),
  linerThicknessMm: decimal("liner_thickness_mm", { precision: 6, scale: 2 }),
  hasLeachateCollection: boolean("has_leachate_collection").default(false),
  leachateCollectionSystem: text("leachate_collection_system"),
  leachateTreatmentMethod: text("leachate_treatment_method"),
  leachateGenerationLitresDay: decimal("leachate_generation_litres_day", {
    precision: 10,
    scale: 2,
  }),
  hasGasCollection: boolean("has_gas_collection").default(false),
  gasCollectionSystem: text("gas_collection_system"),
  gasUtilizationMethod: text("gas_utilization_method"),
  methaneGenerationEstimateM3Day: decimal(
    "methane_generation_estimate_m3_day",
    {
      precision: 10,
      scale: 2,
    },
  ),
  hasEnergyGeneration: boolean("has_energy_generation").default(false),
  energyGenerationCapacityKW: decimal("energy_generation_capacity_kw", {
    precision: 10,
    scale: 2,
  }),
  hasGroundwaterMonitoring: boolean("has_groundwater_monitoring").default(
    false,
  ),
  monitoringWellCount: integer("monitoring_well_count"),
  hasSurfaceWaterMonitoring: boolean("has_surface_water_monitoring").default(
    false,
  ),
  hasGasMonitoring: boolean("has_gas_monitoring").default(false),
  hasSettlementMonitoring: boolean("has_settlement_monitoring").default(false),
  hasFinalCover: boolean("has_final_cover").default(false),
  finalCoverType: text("final_cover_type"),
  finalCoverThicknessCm: decimal("final_cover_thickness_cm", {
    precision: 6,
    scale: 2,
  }),
  hasDailyCover: boolean("has_daily_cover").default(false),
  dailyCoverMaterial: text("daily_cover_material"),

  // Environmental factors
  distanceToNearestSettlementM: decimal("distance_to_nearest_settlement_m", {
    precision: 10,
    scale: 2,
  }),
  distanceToNearestWaterBodyM: decimal("distance_to_nearest_water_body_m", {
    precision: 10,
    scale: 2,
  }),
  distanceToNearestAquiferM: decimal("distance_to_nearest_aquifer_m", {
    precision: 10,
    scale: 2,
  }),
  depthToGroundwaterM: decimal("depth_to_groundwater_m", {
    precision: 8,
    scale: 2,
  }),
  annualRainfallMm: decimal("annual_rainfall_mm", { precision: 8, scale: 2 }),
  floodRisk: text("flood_risk"),
  hasFloodControl: boolean("has_flood_control").default(false),
  floodControlMeasures: text("flood_control_measures"),
  soilType: text("soil_type"),
  geologicalFormation: text("geological_formation"),
  environmentalImpactLevel: environmentalImpactLevelEnum(
    "environmental_impact_level",
  ),
  knownContaminationIssues: text("known_contamination_issues"),
  remediationEfforts: text("remediation_efforts"),

  // Operations
  operatingHours: text("operating_hours"),
  operationFrequency: operationFrequencyEnum("operation_frequency"),
  equipmentOnSite: text("equipment_on_site"),
  vehicleCount: integer("vehicle_count"),
  staffCount: integer("staff_count"),
  hasWeighbridge: boolean("has_weighbridge").default(false),
  weighbridgeDetails: text("weighbridge_details"),
  wasteTrackingSystem: text("waste_tracking_system"),
  maintenanceSchedule: text("maintenance_schedule"),
  operationalChallenges: text("operational_challenges"),

  // Safety and security
  hasFencing: boolean("has_fencing").default(false),
  fencingType: text("fencing_type"),
  hasGate: boolean("has_gate").default(false),
  hasSecurityPersonnel: boolean("has_security_personnel").default(false),
  securityPersonnelCount: integer("security_personnel_count"),
  hasFireControlSystem: boolean("has_fire_control_system").default(false),
  fireControlDetails: text("fire_control_details"),
  hasEmergencyResponsePlan: boolean("has_emergency_response_plan").default(
    false,
  ),
  emergencyResponseDetails: text("emergency_response_details"),
  hasHealthSafetyProcedures: boolean("has_health_safety_procedures").default(
    false,
  ),
  onsiteAccidentHistory: text("onsite_accident_history"),
  hasPestControl: boolean("has_pest_control").default(false),
  pestControlMeasures: text("pest_control_measures"),

  // Community relations
  distanceToNearestCommunityKm: decimal("distance_to_nearest_community_km", {
    precision: 6,
    scale: 2,
  }),
  communityConsultationProcess: text("community_consultation_process"),
  hasReceivedComplaints: boolean("has_received_complaints").default(false),
  complaintTypes: text("complaint_types"),
  complaintResolutionProcess: text("complaint_resolution_process"),
  communityBenefitPrograms: text("community_benefit_programs"),
  publicAccessStatus: text("public_access_status"),
  publicAwarenessPrograms: text("public_awareness_programs"),

  // Financial aspects
  establishmentCostNPR: decimal("establishment_cost_npr", {
    precision: 18,
    scale: 2,
  }),
  annualOperatingCostNPR: decimal("annual_operating_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  costPerTonNPR: decimal("cost_per_ton_npr", { precision: 10, scale: 2 }),
  fundingSource: text("funding_source"),
  hasTippingFee: boolean("has_tipping_fee").default(false),
  tippingFeeStructure: text("tipping_fee_structure"),
  averageTippingFeePerTonNPR: decimal("average_tipping_fee_per_ton_npr", {
    precision: 10,
    scale: 2,
  }),
  annualRevenueNPR: decimal("annual_revenue_npr", { precision: 14, scale: 2 }),
  hasClosureFund: boolean("has_closure_fund").default(false),
  closureFundAmountNPR: decimal("closure_fund_amount_npr", {
    precision: 14,
    scale: 2,
  }),
  postClosureMaintenancePlanExists: boolean(
    "post_closure_maintenance_plan_exists",
  ).default(false),
  postClosureBudgetNPR: decimal("post_closure_budget_npr", {
    precision: 14,
    scale: 2,
  }),

  // Compliance and monitoring
  complianceStatus: text("compliance_status"),
  regulatoryInspectionFrequency: text("regulatory_inspection_frequency"),
  lastInspectionDate: date("last_inspection_date"),
  inspectionFindings: text("inspection_findings"),
  environmentalMonitoringFrequency: text("environmental_monitoring_frequency"),
  environmentalMonitoringParameters: text(
    "environmental_monitoring_parameters",
  ),
  airQualityMonitoring: text("air_quality_monitoring"),
  waterQualityMonitoring: text("water_quality_monitoring"),
  complianceReporting: text("compliance_reporting"),
  violationHistory: text("violation_history"),

  // Future plans
  expansionPlans: text("expansion_plans"),
  expectedClosureDate: date("expected_closure_date"),
  postClosureLandUseplan: text("post_closure_land_use_plan"),
  improvementPlans: text("improvement_plans"),
  wasteReductionTargets: text("waste_reduction_targets"),
  longTermManagementStrategy: text("long_term_management_strategy"),

  // Contact information
  contactPerson: text("contact_person"),
  contactDesignation: text("contact_designation"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  alternateContactInfo: text("alternate_contact_info"),

  // Linkages to other entities
  linkedWasteCollectionCenters: jsonb(
    "linked_waste_collection_centers",
  ).default(sql`'[]'::jsonb`),
  linkedRecyclingFacilities: jsonb("linked_recycling_facilities").default(
    sql`'[]'::jsonb`,
  ),
  linkedTransferStations: jsonb("linked_transfer_stations").default(
    sql`'[]'::jsonb`,
  ),
  linkedWasteTreatmentFacilities: jsonb(
    "linked_waste_treatment_facilities",
  ).default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  sitePerimeter: geometry("site_perimeter", { type: "Polygon" }),
  cellBoundaries: geometry("cell_boundaries", { type: "MultiPolygon" }),
  accessRoads: geometry("access_roads", { type: "MultiLineString" }),

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

export type LandfillSite = typeof landfillSite.$inferSelect;
export type NewLandfillSite = typeof landfillSite.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
