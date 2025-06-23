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

// Define erosion severity enum
export const erosionSeverityEnum = pgEnum("erosion_severity", [
  "MINIMAL",
  "MILD",
  "MODERATE",
  "SEVERE",
  "EXTREME",
  "CATASTROPHIC",
]);

// Define erosion status enum
export const erosionStatusEnum = pgEnum("erosion_status", [
  "ACTIVE",
  "STABILIZED",
  "MITIGATED",
  "MONITORED",
  "WORSENING",
  "RECOVERING",
]);

// Define river type enum
export const riverTypeEnum = pgEnum("river_type", [
  "MAJOR_RIVER",
  "MEDIUM_RIVER",
  "SMALL_RIVER",
  "STREAM",
  "TRIBUTARY",
  "SEASONAL_RIVER",
  "GLACIER_FED",
  "RAIN_FED",
]);

// River Erosion Area table
export const riverErosionArea = pgTable("river_erosion_area", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  locationDescription: text("location_description"),
  riverName: text("river_name").notNull(),
  riverSection: text("river_section"),
  riverType: riverTypeEnum("river_type"),

  // Erosion characteristics
  erosionSeverity: erosionSeverityEnum("erosion_severity").notNull(),
  erosionStatus: erosionStatusEnum("erosion_status").notNull(),
  initialOccurrenceDate: date("initial_occurrence_date"),
  mostRecentAssessmentDate: date("most_recent_assessment_date"),

  // Physical attributes
  affectedLengthM: decimal("affected_length_m", { precision: 10, scale: 2 }),
  erodedAreaSqM: decimal("eroded_area_sq_m", { precision: 14, scale: 2 }),
  averageErosionRateMPerYear: decimal("average_erosion_rate_m_per_year", {
    precision: 6,
    scale: 2,
  }),
  maximumErosionRateMPerYear: decimal("maximum_erosion_rate_m_per_year", {
    precision: 6,
    scale: 2,
  }),
  bankHeightM: decimal("bank_height_m", { precision: 6, scale: 2 }),
  channelWidthM: decimal("channel_width_m", { precision: 8, scale: 2 }),
  averageWaterVelocityMPS: decimal("average_water_velocity_mps", {
    precision: 6,
    scale: 2,
  }),
  riverBedMaterial: text("river_bed_material"),
  riverBankMaterial: text("river_bank_material"),

  // Hydrological factors
  averageFlowCumecsDry: decimal("average_flow_cumecs_dry", {
    precision: 10,
    scale: 3,
  }),
  averageFlowCumecsWet: decimal("average_flow_cumecs_wet", {
    precision: 10,
    scale: 3,
  }),
  floodFrequency: text("flood_frequency"),
  lastMajorFloodDate: date("last_major_flood_date"),
  floodRecurrence: text("flood_recurrence"),
  sedimentLoadDescription: text("sediment_load_description"),

  // Impact assessment
  landAreaLostSqM: decimal("land_area_lost_sq_m", { precision: 14, scale: 2 }),
  agriculturalLandLostSqM: decimal("agricultural_land_lost_sq_m", {
    precision: 14,
    scale: 2,
  }),
  residentialLandLostSqM: decimal("residential_land_lost_sq_m", {
    precision: 14,
    scale: 2,
  }),
  forestLandLostSqM: decimal("forest_land_lost_sq_m", {
    precision: 14,
    scale: 2,
  }),
  publicLandLostSqM: decimal("public_land_lost_sq_m", {
    precision: 14,
    scale: 2,
  }),
  affectedFamiliesCount: integer("affected_families_count"),
  displacedPeopleCount: integer("displaced_people_count"),
  buildingsAtRiskCount: integer("buildings_at_risk_count"),
  buildingsLostCount: integer("buildings_lost_count"),

  // Infrastructure impact
  infrastructureAffected: text("infrastructure_affected"),
  roadsAffectedKm: decimal("roads_affected_km", { precision: 8, scale: 2 }),
  bridgesAffected: text("bridges_affected"),
  waterSupplyAffected: text("water_supply_affected"),
  irrigationCanalsAffectedKm: decimal("irrigation_canals_affected_km", {
    precision: 8,
    scale: 2,
  }),
  electricalInfrastructureAffected: text("electrical_infrastructure_affected"),
  economicLossEstimateNPR: decimal("economic_loss_estimate_npr", {
    precision: 14,
    scale: 2,
  }),

  // Risk factors
  riskLevel: text("risk_level"), // High, Medium, Low
  futureRiskAssessment: text("future_risk_assessment"),
  vulnerableStructures: text("vulnerable_structures"),
  potentialImpactZone: text("potential_impact_zone"),
  estimatedRiskPopulation: integer("estimated_risk_population"),

  // Monitoring details
  isBeingMonitored: boolean("is_being_monitored").default(false),
  monitoringMethods: text("monitoring_methods"), // Surveys, remote sensing, etc.
  monitoringFrequency: text("monitoring_frequency"),
  lastInspectionDate: date("last_inspection_date"),
  hasRiverGauges: boolean("has_river_gauges").default(false),
  gaugeLocations: text("gauge_locations"),
  hasEarlyWarningSystem: boolean("has_early_warning_system").default(false),
  earlyWarningSystemDetails: text("early_warning_system_details"),

  // Mitigation and management
  mitigationMeasuresTaken: text("mitigation_measures_taken"),
  mitigationEffectiveness: text("mitigation_effectiveness"),
  embankmentDetails: text("embankment_details"),
  embankmentLengthM: decimal("embankment_length_m", {
    precision: 10,
    scale: 2,
  }),
  gabionBoxesInstalled: boolean("gabion_boxes_installed").default(false),
  gabionBoxLengthM: decimal("gabion_box_length_m", { precision: 10, scale: 2 }),
  bioEngineeringSolutions: text("bio_engineering_solutions"),
  channelRegulationWorks: text("channel_regulation_works"),
  spursDetails: text("spurs_details"),
  spursCount: integer("spurs_count"),
  vegetationPlanting: text("vegetation_planting"),
  otherControlMeasures: text("other_control_measures"),
  proposedFutureMeasures: text("proposed_future_measures"),

  // Response and recovery
  emergencyResponseActions: text("emergency_response_actions"),
  recoveryEfforts: text("recovery_efforts"),
  reliefProvidedDetails: text("relief_provided_details"),
  resettlementDetails: text("resettlement_details"),
  compensationProvidedNPR: decimal("compensation_provided_npr", {
    precision: 14,
    scale: 2,
  }),

  // Responsible authorities
  leadAgency: text("lead_agency"),
  supportingAgencies: text("supporting_agencies"),
  localContactPerson: text("local_contact_person"),
  localContactPhone: text("local_contact_phone"),

  // Community aspects
  communityAwarenessLevel: text("community_awareness_level"),
  communityMitigationParticipation: text("community_mitigation_participation"),
  communityTrainingConducted: boolean("community_training_conducted").default(
    false,
  ),
  communityTrainingDetails: text("community_training_details"),

  // Environmental impacts
  environmentalImpacts: text("environmental_impacts"),
  biodiversityImpacts: text("biodiversity_impacts"),
  aquaticEcosystemChanges: text("aquatic_ecosystem_changes"),
  waterQualityChanges: text("water_quality_changes"),
  sedimentationIssues: text("sedimentation_issues"),

  // Financial aspects
  estimatedMitigationCostNPR: decimal("estimated_mitigation_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  allocatedBudgetNPR: decimal("allocated_budget_npr", {
    precision: 14,
    scale: 2,
  }),
  fundingSource: text("funding_source"),
  annualMaintenanceCostNPR: decimal("annual_maintenance_cost_npr", {
    precision: 14,
    scale: 2,
  }),

  // Linkages to other entities and assets
  linkedDisasterManagementCenters: jsonb(
    "linked_disaster_management_centers",
  ).default(sql`'[]'::jsonb`),
  linkedHealthFacilities: jsonb("linked_health_facilities").default(
    sql`'[]'::jsonb`,
  ),
  linkedEvacuationCenters: jsonb("linked_evacuation_centers").default(
    sql`'[]'::jsonb`,
  ),
  linkedRoads: jsonb("linked_roads").default(sql`'[]'::jsonb`),
  linkedSettlements: jsonb("linked_settlements").default(sql`'[]'::jsonb`),
  linkedRivers: jsonb("linked_rivers").default(sql`'[]'::jsonb`),
  linkedFloodedAreas: jsonb("linked_flooded_areas").default(sql`'[]'::jsonb`),

  // Research and documentation
  scientificStudiesConducted: text("scientific_studies_conducted"),
  researchInstitutionsInvolved: text("research_institutions_involved"),
  historicalErosionData: text("historical_erosion_data"),

  // Notes and additional information
  additionalNotes: text("additional_notes"),
  seasonalVariations: text("seasonal_variations"),
  referenceMaterials: text("reference_materials"),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  affectedArea: geometry("affected_area", { type: "Polygon" }),
  erosionLine: geometry("erosion_line", { type: "LineString" }),
  protectionStructures: geometry("protection_structures", {
    type: "MultiLineString",
  }),
  monitoringPoints: geometry("monitoring_points", { type: "MultiPoint" }),

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

export type RiverErosionArea = typeof riverErosionArea.$inferSelect;
export type NewRiverErosionArea = typeof riverErosionArea.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
