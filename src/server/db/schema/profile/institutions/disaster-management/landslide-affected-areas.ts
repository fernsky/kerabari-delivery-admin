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

// Define landslide severity enum
export const landslideSeverityEnum = pgEnum("landslide_severity", [
  "VERY_LOW",
  "LOW",
  "MODERATE",
  "HIGH",
  "VERY_HIGH",
  "CATASTROPHIC",
]);

// Define landslide status enum
export const landslideStatusEnum = pgEnum("landslide_status", [
  "ACTIVE",
  "DORMANT",
  "STABILIZED",
  "MITIGATED",
  "MONITORED",
]);

// Define landslide type enum
export const landslideTypeEnum = pgEnum("landslide_type", [
  "ROTATIONAL",
  "TRANSLATIONAL",
  "DEBRIS_FLOW",
  "ROCKFALL",
  "EARTHFLOW",
  "MUDFLOW",
  "CREEP",
  "COMPLEX",
  "OTHER",
]);

// Define trigger mechanism enum
export const triggerMechanismEnum = pgEnum("trigger_mechanism", [
  "RAINFALL",
  "EARTHQUAKE",
  "SNOWMELT",
  "HUMAN_ACTIVITY",
  "EROSION",
  "VOLCANIC_ACTIVITY",
  "MULTIPLE_CAUSES",
  "UNKNOWN",
]);

// Landslide Affected Area table
export const landslideAffectedArea = pgTable("landslide_affected_area", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  locationDescription: text("location_description"),
  nearestLandmark: text("nearest_landmark"),

  // Landslide characteristics
  landslideType: landslideTypeEnum("landslide_type").notNull(),
  severity: landslideSeverityEnum("severity").notNull(),
  status: landslideStatusEnum("status").notNull(),
  triggerMechanism: triggerMechanismEnum("trigger_mechanism"),
  initialOccurrenceDate: date("initial_occurrence_date"),
  mostRecentActivityDate: date("most_recent_activity_date"),

  // Physical attributes
  areaSqKm: decimal("area_sq_km", { precision: 10, scale: 6 }),
  lengthM: decimal("length_m", { precision: 10, scale: 2 }),
  widthM: decimal("width_m", { precision: 10, scale: 2 }),
  depthM: decimal("depth_m", { precision: 8, scale: 2 }),
  volumeEstimateCubicM: decimal("volume_estimate_cubic_m", {
    precision: 14,
    scale: 2,
  }),
  slopeAngleDegrees: decimal("slope_angle_degrees", { precision: 5, scale: 2 }),
  elevationRangeM: text("elevation_range_m"),
  aspectDirection: text("aspect_direction"), // N, NE, E, SE, etc.

  // Geology and soil
  geologicalFormation: text("geological_formation"),
  rockTypes: text("rock_types"),
  soilTypes: text("soil_types"),
  groundwaterConditions: text("groundwater_conditions"),

  // Impact assessment
  casualtiesCount: integer("casualties_count"),
  injuriesCount: integer("injuries_count"),
  missingPersonsCount: integer("missing_persons_count"),
  affectedFamiliesCount: integer("affected_families_count"),
  displacedPeopleCount: integer("displaced_people_count"),
  livesEndangeredCount: integer("lives_endangered_count"),

  // Infrastructure damage
  buildingsDamagedCount: integer("buildings_damaged_count"),
  buildingsDestroyedCount: integer("buildings_destroyed_count"),
  roadsDamagedKm: decimal("roads_damaged_km", { precision: 8, scale: 2 }),
  bridgesDamagedCount: integer("bridges_damaged_count"),
  criticalInfrastructureDamaged: text("critical_infrastructure_damaged"),
  economicLossEstimateNPR: decimal("economic_loss_estimate_npr", {
    precision: 14,
    scale: 2,
  }),
  agriculturalLandDamagedHectares: decimal(
    "agricultural_land_damaged_hectares",
    { precision: 10, scale: 2 },
  ),
  forestAreaDamagedHectares: decimal("forest_area_damaged_hectares", {
    precision: 10,
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
  monitoringMethods: text("monitoring_methods"), // GPS, inclinometers, etc.
  monitoringFrequency: text("monitoring_frequency"),
  lastInspectionDate: date("last_inspection_date"),
  movementRateMmPerYear: decimal("movement_rate_mm_per_year", {
    precision: 8,
    scale: 2,
  }),
  hasEarlyWarningSystem: boolean("has_early_warning_system").default(false),
  earlyWarningSystemDetails: text("early_warning_system_details"),

  // Mitigation and management
  mitigationMeasuresTaken: text("mitigation_measures_taken"),
  mitigationEffectiveness: text("mitigation_effectiveness"),
  proposedFutureMeasures: text("proposed_future_measures"),
  stabilizationMethodsUsed: text("stabilization_methods_used"),
  drainageImprovements: text("drainage_improvements"),
  vegetationManagement: text("vegetation_management"),
  evacuationPlanExists: boolean("evacuation_plan_exists").default(false),
  evacuationPlanDetails: text("evacuation_plan_details"),

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

  // Environmental factors
  environmentalImpacts: text("environmental_impacts"),
  hydrologicalChanges: text("hydrological_changes"),
  proximityToWaterBodies: text("proximity_to_water_bodies"),

  // Research and documentation
  scientificStudiesConducted: text("scientific_studies_conducted"),
  researchInstitutionsInvolved: text("research_institutions_involved"),
  hasGeotechnicalData: boolean("has_geotechnical_data").default(false),
  hasDroneImagery: boolean("has_drone_imagery").default(false),
  hasSatelliteImagery: boolean("has_satellite_imagery").default(false),

  // Community engagement
  communityAwarenessLevel: text("community_awareness_level"),
  communityMitigationParticipation: text("community_mitigation_participation"),
  communityTrainingConducted: boolean("community_training_conducted").default(
    false,
  ),
  communityTrainingDetails: text("community_training_details"),

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

  // Notes and additional information
  additionalNotes: text("additional_notes"),
  historicalIncidents: text("historical_incidents"),
  referenceMaterials: text("reference_materials"),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  affectedArea: geometry("affected_area", { type: "Polygon" }),
  dangerZone: geometry("danger_zone", { type: "Polygon" }),
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

export type LandslideAffectedArea = typeof landslideAffectedArea.$inferSelect;
export type NewLandslideAffectedArea =
  typeof landslideAffectedArea.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
