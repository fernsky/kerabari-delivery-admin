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
import { wasteTypeEnum, operationFrequencyEnum } from "./landfill-sites";
import { environmentalImpactLevelEnum } from "../common";

// Define dumping site type enum
export const dumpingSiteTypeEnum = pgEnum("dumping_site_type", [
  "OPEN_DUMP",
  "CONTROLLED_DUMP",
  "TEMPORARY_COLLECTION_POINT",
  "UNAUTHORIZED_DUMP",
  "EMERGENCY_DUMP",
  "RIVERSIDE_DUMP",
  "ROADSIDE_DUMP",
  "QUARRY_DUMP",
  "LOW_LYING_AREA_FILLING",
  "MIXED_WASTE_DUMP",
  "OTHER",
]);

// Define dumping site status enum
export const dumpingSiteStatusEnum = pgEnum("dumping_site_status", [
  "ACTIVE",
  "INACTIVE",
  "CLOSED",
  "REMEDIATED",
  "UNDER_REMEDIATION",
  "UNAUTHORIZED",
  "MONITORED",
  "SEASONAL",
  "OCCASIONAL",
]);

// Define site management level enum
export const siteManagementLevelEnum = pgEnum("site_management_level", [
  "WELL_MANAGED",
  "BASIC_MANAGEMENT",
  "MINIMAL_MANAGEMENT",
  "UNMANAGED",
  "ABANDONED",
]);

// Define ownership type enum
export const wasteMgmtOwnershipTypeEnum = pgEnum("wate_mgmt_ownership_type", [
  "MUNICIPAL",
  "WARD_LEVEL",
  "PRIVATE",
  "COMMUNITY",
  "UNAUTHORIZED",
  "GOVERNMENT",
  "MIXED",
  "UNIDENTIFIED",
  "OTHER",
]);

// Dumping Site table
export const dumpingSite = pgTable("dumping_site", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  dumpingType: dumpingSiteTypeEnum("dumping_type").notNull(),
  status: dumpingSiteStatusEnum("status").notNull(),
  managementLevel: siteManagementLevelEnum("management_level").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  nearestLandmark: text("nearest_landmark"),

  // Basic information
  startedYear: integer("started_year"),
  ownershipType: wasteMgmtOwnershipTypeEnum("ownership_type").notNull(),
  operatorName: text("operator_name"), // Entity operating the site
  hasLegalPermission: boolean("has_legal_permission").default(false),
  permissionDetails: text("permission_details"),
  isDesignatedSite: boolean("is_designated_site").default(false),
  isTemporary: boolean("is_temporary").default(false),
  plannedEndDate: date("planned_end_date"),
  hasClosure: boolean("has_closure").default(false),
  closureYear: integer("closure_year"),

  // Site specifications
  totalAreaSqm: decimal("total_area_sq_m", { precision: 14, scale: 2 }),
  activeAreaSqm: decimal("active_area_sq_m", { precision: 14, scale: 2 }),
  estimatedWasteVolumeCubicM: decimal("estimated_waste_volume_cubic_m", {
    precision: 14,
    scale: 2,
  }),
  estimatedWasteHeightM: decimal("estimated_waste_height_m", {
    precision: 8,
    scale: 2,
  }),
  estimatedWasteWeightTons: decimal("estimated_waste_weight_tons", {
    precision: 14,
    scale: 2,
  }),
  wasteAccumulationRate: decimal("waste_accumulation_rate", {
    precision: 10,
    scale: 2,
  }), // tons per month/year

  // Waste specifications
  wasteTypes: jsonb("waste_types").default(sql`'[]'::jsonb`), // Array of wasteTypeEnum values
  predominantWasteType: wasteTypeEnum("predominant_waste_type"),
  hasDomesticWaste: boolean("has_domestic_waste").default(true),
  hasCommercialWaste: boolean("has_commercial_waste").default(false),
  hasConstructionWaste: boolean("has_construction_waste").default(false),
  hasIndustrialWaste: boolean("has_industrial_waste").default(false),
  hasHazardousWaste: boolean("has_hazardous_waste").default(false),
  hazardousWasteDetails: text("hazardous_waste_details"),
  hasMedicalWaste: boolean("has_medical_waste").default(false),
  medicalWasteDetails: text("medical_waste_details"),
  hasElectronicWaste: boolean("has_electronic_waste").default(false),
  hasWasteSorting: boolean("has_waste_sorting").default(false),
  wasteSortingDetails: text("waste_sorting_details"),
  hasInformalRecycling: boolean("has_informal_recycling").default(false),
  informalRecyclingDetails: text("informal_recycling_details"),
  hasWastePicking: boolean("has_waste_picking").default(false),
  wastePickerCount: integer("waste_picker_count"),

  // Environmental impact
  environmentalImpactLevel: environmentalImpactLevelEnum(
    "environmental_impact_level",
  ),
  hasContaminationEvidence: boolean("has_contamination_evidence").default(
    false,
  ),
  contaminationDetails: text("contamination_details"),
  hasLeachateGeneration: boolean("has_leachate_generation").default(false),
  leachateManagement: text("leachate_management"),
  hasLeachateCollectionSystem: boolean(
    "has_leachate_collection_system",
  ).default(false),
  hasVisibleWaterPollution: boolean("has_visible_water_pollution").default(
    false,
  ),
  waterPollutionDetails: text("water_pollution_details"),
  hasOffSiteLeachateFlow: boolean("has_off_site_leachate_flow").default(false),
  hasOdorIssues: boolean("has_odor_issues").default(false),
  odorDescription: text("odor_description"),
  odorRange: text("odor_range"),
  hasVerminPresence: boolean("has_vermin_presence").default(false),
  verminTypes: text("vermin_types"),
  hasDustIssues: boolean("has_dust_issues").default(false),
  hasVisualImpact: boolean("has_visual_impact").default(false),
  visualImpactDetails: text("visual_impact_details"),
  hasWasteBurning: boolean("has_waste_burning").default(false),
  wasteBurningFrequency: text("waste_burning_frequency"),

  // Environmental context
  topographyType: text("topography_type"),
  soilType: text("soil_type"),
  landUseBeforeDumping: text("land_use_before_dumping"),
  surroundingLandUse: text("surrounding_land_use"),
  distanceToNearestResidenceM: decimal("distance_to_nearest_residence_m", {
    precision: 10,
    scale: 2,
  }),
  distanceToNearestWaterBodyM: decimal("distance_to_nearest_water_body_m", {
    precision: 10,
    scale: 2,
  }),
  waterBodyType: text("water_body_type"),
  distanceToNearestFarmlandM: decimal("distance_to_nearest_farmland_m", {
    precision: 10,
    scale: 2,
  }),
  distanceToNearestRoadM: decimal("distance_to_nearest_road_m", {
    precision: 10,
    scale: 2,
  }),
  distanceToNearestProtectedAreaM: decimal(
    "distance_to_nearest_protected_area_m",
    {
      precision: 10,
      scale: 2,
    },
  ),
  isInFloodProneArea: boolean("is_in_flood_prone_area").default(false),
  isInLandslidePronArea: boolean("is_in_landslide_prone_area").default(false),
  groundwaterTableDepthM: decimal("groundwater_table_depth_m", {
    precision: 8,
    scale: 2,
  }),
  floodHistory: text("flood_history"),

  // Operations
  operatingStatus: text("operating_status"),
  operationFrequency: operationFrequencyEnum("operation_frequency"),
  operatingDays: text("operating_days"),
  accessControl: boolean("access_control").default(false),
  accessControlType: text("access_control_type"),
  hasWasteCompaction: boolean("has_waste_compaction").default(false),
  compactionMethod: text("compaction_method"),
  hasCoverMaterial: boolean("has_cover_material").default(false),
  coverMaterialType: text("cover_material_type"),
  coverFrequency: text("cover_frequency"),
  accessRoadExists: boolean("access_road_exists").default(false),
  accessRoadCondition: text("access_road_condition"),
  equipmentUsed: text("equipment_used"),
  vehicleMovementsPerDay: integer("vehicle_movements_per_day"),
  majorWasteSources: text("major_waste_sources"),
  averageDailyWasteReceiptTons: decimal("average_daily_waste_receipt_tons", {
    precision: 10,
    scale: 2,
  }),

  // Safety and security
  hasFencing: boolean("has_fencing").default(false),
  fencingCondition: text("fencing_condition"),
  fencingType: text("fencing_type"),
  hasGate: boolean("has_gate").default(false),
  hasSecurityPersonnel: boolean("has_security_personnel").default(false),
  securitySchedule: text("security_schedule"),
  hasSafetySignage: boolean("has_safety_signage").default(false),
  hasFirePrevention: boolean("has_fire_prevention").default(false),
  firePreventionDetails: text("fire_prevention_details"),
  hasFireIncidents: boolean("has_fire_incidents").default(false),
  fireIncidentsFrequency: text("fire_incidents_frequency"),
  lastFireIncidentDate: date("last_fire_incident_date"),

  // Community relations
  communityComplaintsReceived: boolean("community_complaints_received").default(
    false,
  ),
  complaintTypes: text("complaint_types"),
  complaintFrequency: text("complaint_frequency"),
  complaintResolutionProcess: text("complaint_resolution_process"),
  communityAwarenessPrograms: text("community_awareness_programs"),
  communityConsultationProcess: text("community_consultation_process"),
  affectedCommunities: text("affected_communities"),
  publicPerceptionLevel: text("public_perception_level"),

  // Financial aspects
  maintenanceCostNPR: decimal("maintenance_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  fundingSource: text("funding_source"),
  fundsAllocatedNPR: decimal("funds_allocated_npr", {
    precision: 14,
    scale: 2,
  }),
  actualExpenditureNPR: decimal("actual_expenditure_npr", {
    precision: 14,
    scale: 2,
  }),
  userFeesCollected: boolean("user_fees_collected").default(false),
  userFeeDetails: text("user_fee_details"),
  hasFormalBudget: boolean("has_formal_budget").default(false),

  // Management and governance
  hasDesignatedManager: boolean("has_designated_manager").default(false),
  managerDetails: text("manager_details"),
  hasWasteManagementPlan: boolean("has_waste_management_plan").default(false),
  managementPlanDetails: text("management_plan_details"),
  hasMonitoringSystem: boolean("has_monitoring_system").default(false),
  monitoringFrequency: text("monitoring_frequency"),
  monitoringParameters: text("monitoring_parameters"),
  hasReportingSystem: boolean("has_reporting_system").default(false),
  reportingFrequency: text("reporting_frequency"),
  governanceStructure: text("governance_structure"),

  // Remediation and future plans
  hasRemediationPlan: boolean("has_remediation_plan").default(false),
  remediationPlanDetails: text("remediation_plan_details"),
  remediationStartDate: date("remediation_start_date"),
  remediationCompletionDate: date("remediation_completion_date"),
  estimatedRemediationCostNPR: decimal("estimated_remediation_cost_npr", {
    precision: 18,
    scale: 2,
  }),
  futureSitePlans: text("future_site_plans"),
  plannedUpgrades: text("planned_upgrades"),
  conversionPlans: text("conversion_plans"),
  timelineForImprovements: text("timeline_for_improvements"),

  // Health impacts
  reportedHealthIssues: boolean("reported_health_issues").default(false),
  healthIssuesDetails: text("health_issues_details"),
  hasHealthStudies: boolean("has_health_studies").default(false),
  healthStudyFindings: text("health_study_findings"),
  hasHealthProtectionMeasures: boolean(
    "has_health_protection_measures",
  ).default(false),
  healthProtectionDetails: text("health_protection_details"),

  // Contact information
  contactPerson: text("contact_person"),
  contactDesignation: text("contact_designation"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  wardContactPerson: text("ward_contact_person"),
  wardContactPhone: text("ward_contact_phone"),

  // Local governance information
  wardAwarenessLevel: text("ward_awareness_level"),
  wardInterventionLevel: text("ward_intervention_level"),
  wardActionTaken: text("ward_action_taken"),
  municipalActionTaken: text("municipal_action_taken"),

  // Technical support
  receivedTechnicalSupport: boolean("received_technical_support").default(
    false,
  ),
  technicalSupportSource: text("technical_support_source"),
  technicalSupportDetails: text("technical_support_details"),
  requestedSupport: text("requested_support"),

  // Linkages to other entities
  linkedWasteCollectionCenters: jsonb(
    "linked_waste_collection_centers",
  ).default(sql`'[]'::jsonb`),
  linkedTransferStations: jsonb("linked_transfer_stations").default(
    sql`'[]'::jsonb`,
  ),
  linkedLandfills: jsonb("linked_landfills").default(sql`'[]'::jsonb`),
  linkedWastePickers: jsonb("linked_waste_pickers").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  sitePerimeter: geometry("site_perimeter", { type: "Polygon" }),
  wasteExtent: geometry("waste_extent", { type: "Polygon" }),
  accessRoutes: geometry("access_routes", { type: "MultiLineString" }),

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

export type DumpingSite = typeof dumpingSite.$inferSelect;
export type NewDumpingSite = typeof dumpingSite.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
