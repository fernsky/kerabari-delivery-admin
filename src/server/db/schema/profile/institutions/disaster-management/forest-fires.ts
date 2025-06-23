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
  time,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define forest fire severity enum
export const forestFireSeverityEnum = pgEnum("forest_fire_severity", [
  "LOW",
  "MODERATE",
  "HIGH",
  "VERY_HIGH",
  "EXTREME",
  "CATASTROPHIC",
]);

// Define forest fire status enum
export const forestFireStatusEnum = pgEnum("forest_fire_status", [
  "ACTIVE",
  "CONTAINED",
  "CONTROLLED",
  "EXTINGUISHED",
  "MONITORING",
  "RECURRENT",
]);

// Define forest fire cause enum
export const forestFireCauseEnum = pgEnum("forest_fire_cause", [
  "NATURAL_LIGHTNING",
  "HUMAN_NEGLIGENCE",
  "AGRICULTURE_BURNING",
  "INTENTIONAL",
  "ELECTRICAL_FAULT",
  "FOREST_MANAGEMENT",
  "UNCERTAIN",
  "OTHER",
]);

// Define forest type enum
export const forestTypeEnum = pgEnum("forest_type", [
  "CONIFEROUS",
  "BROADLEAF",
  "MIXED",
  "SUBTROPICAL",
  "TEMPERATE",
  "ALPINE",
  "PLANTATION",
  "SHRUBLAND",
  "OTHER",
]);

// Forest Fire table
export const forestFire = pgTable("forest_fire", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  locationDescription: text("location_description"),
  forestName: text("forest_name"),
  forestType: forestTypeEnum("forest_type"),
  forestOwnership: text("forest_ownership"), // National, community, private, etc.

  // Fire characteristics
  forestFireSeverity: forestFireSeverityEnum("forest_fire_severity").notNull(),
  forestFireStatus: forestFireStatusEnum("forest_fire_status").notNull(),
  forestFireCause: forestFireCauseEnum("forest_fire_cause"),
  ignitionPointDescription: text("ignition_point_description"),
  startDate: date("start_date"),
  startTime: time("start_time"),
  containmentDate: date("containment_date"),
  extinguishedDate: date("extinguished_date"),
  durationHours: integer("duration_hours"),

  // Physical attributes
  areaAffectedHectares: decimal("area_affected_hectares", {
    precision: 10,
    scale: 2,
  }),
  perimeterKm: decimal("perimeter_km", { precision: 8, scale: 2 }),
  spreadRateKmPerHour: decimal("spread_rate_km_per_hour", {
    precision: 6,
    scale: 2,
  }),
  flameHeightM: decimal("flame_height_m", { precision: 6, scale: 2 }),
  fireIntensity: text("fire_intensity"),

  // Environmental conditions during fire
  temperatureC: decimal("temperature_c", { precision: 5, scale: 2 }),
  humidity: integer("humidity"),
  windSpeedKmh: decimal("wind_speed_kmh", { precision: 6, scale: 1 }),
  windDirection: text("wind_direction"),
  precipitationMm: decimal("precipitation_mm", { precision: 6, scale: 2 }),
  droughtConditions: text("drought_conditions"),
  fuelMoistureContent: text("fuel_moisture_content"),
  fuelType: text("fuel_type"), // Description of vegetation/fuel

  // Impact assessment
  casualtiesCount: integer("casualties_count"),
  injuriesCount: integer("injuries_count"),
  evacuationsCount: integer("evacuations_count"),
  buildingsDestroyedCount: integer("buildings_destroyed_count"),
  livestockLostCount: integer("livestock_lost_count"),
  criticalInfrastructureAffected: text("critical_infrastructure_affected"),
  economicLossEstimateNPR: decimal("economic_loss_estimate_npr", {
    precision: 14,
    scale: 2,
  }),

  // Ecological impact
  timberVolumeAffectedCubicM: decimal("timber_volume_affected_cubic_m", {
    precision: 14,
    scale: 2,
  }),
  carbonReleaseEstimateTons: decimal("carbon_release_estimate_tons", {
    precision: 14,
    scale: 2,
  }),
  endangeredSpeciesAffected: text("endangered_species_affected"),
  habitatDestruction: text("habitat_destruction"),
  soilErosionRisk: text("soil_erosion_risk"),
  watershedImpact: text("watershed_impact"),
  biodiversityLoss: text("biodiversity_loss"),
  regenerationProspect: text("regeneration_prospect"),
  longTermEcologicalImpact: text("long_term_ecological_impact"),
  airQualityImpact: text("air_quality_impact"),

  // Response and suppression
  detectionMethod: text("detection_method"),
  detectionTime: timestamp("detection_time"),
  reportingDelayMinutes: integer("reporting_delay_minutes"),
  initialResponseTime: timestamp("initial_response_time"),
  responseTimeMinutes: integer("response_time_minutes"),
  suppressionMethods: text("suppression_methods"),
  equipmentUsed: text("equipment_used"),
  firefightersCount: integer("firefighters_count"),
  waterSourcesUsed: text("water_sources_used"),
  waterUsedLiters: decimal("water_used_liters", { precision: 14, scale: 2 }),
  aircraftDeployment: boolean("aircraft_deployment").default(false),
  aircraftDetails: text("aircraft_details"),
  firebreaksCreatedKm: decimal("firebreaks_created_km", {
    precision: 8,
    scale: 2,
  }),
  controlStrategies: text("control_strategies"),
  logisticalChallenges: text("logistical_challenges"),

  // Responsible authorities
  leadResponseAgency: text("lead_response_agency"),
  supportingAgencies: text("supporting_agencies"),
  communityInvolvement: text("community_involvement"),
  coordinationEffectiveness: text("coordination_effectiveness"),
  incidentCommanderName: text("incident_commander_name"),
  commandStructure: text("command_structure"),

  // Prevention and preparedness
  preFirePreparedness: text("pre_fire_preparedness"),
  existingPreventionMeasures: text("existing_prevention_measures"),
  earlyWarningSystemDetails: text("early_warning_system_details"),
  fireDangerRatingSystem: boolean("fire_danger_rating_system").default(false),
  fireBreaksPreExisting: boolean("fire_breaks_pre_existing").default(false),
  communityAwarenessLevel: text("community_awareness_level"),
  preventionCampaigns: text("prevention_campaigns"),

  // Recovery and rehabilitation
  postFireManagementPlan: text("post_fire_management_plan"),
  rehabilitationMeasures: text("rehabilitation_measures"),
  revegetationPlans: text("revegetation_plans"),
  soilStabilizationMeasures: text("soil_stabilization_measures"),
  communityRecoveryInitiatives: text("community_recovery_initiatives"),
  compensationProvidedNPR: decimal("compensation_provided_npr", {
    precision: 14,
    scale: 2,
  }),

  // Financial aspects
  suppressionCostNPR: decimal("suppression_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  rehabilitationCostNPR: decimal("rehabilitation_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  fundingSourcesForRehabilitation: text("funding_sources_for_rehabilitation"),
  insuranceCoverage: text("insurance_coverage"),

  // Risk factors for future fires
  riskFactors: text("risk_factors"),
  vulnerableAreas: text("vulnerable_areas"),
  recurrenceRisk: text("recurrence_risk"),
  climateChangeConsiderations: text("climate_change_considerations"),

  // Monitoring details
  postFireMonitoring: text("post_fire_monitoring"),
  monitoringFrequency: text("monitoring_frequency"),
  hotspotIdentification: text("hotspot_identification"),
  satelliteSurveillance: boolean("satellite_surveillance").default(false),
  groundPatrols: boolean("ground_patrols").default(false),
  fireWatchTowers: boolean("fire_watch_towers").default(false),
  fireWatchTowerCount: integer("fire_watch_tower_count"),

  // Community engagement
  communityTraining: text("community_training"),
  publicEducationCampaigns: text("public_education_campaigns"),
  volunteerFirefighterCount: integer("volunteer_firefighter_count"),
  localFireResponseTeam: boolean("local_fire_response_team").default(false),
  localFireResponseTeamDetails: text("local_fire_response_team_details"),

  // Linkages to other entities and assets
  linkedDisasterManagementCenters: jsonb(
    "linked_disaster_management_centers",
  ).default(sql`'[]'::jsonb`),
  linkedHealthFacilities: jsonb("linked_health_facilities").default(
    sql`'[]'::jsonb`,
  ),
  linkedWaterSources: jsonb("linked_water_sources").default(sql`'[]'::jsonb`),
  linkedRoads: jsonb("linked_roads").default(sql`'[]'::jsonb`),
  linkedSettlements: jsonb("linked_settlements").default(sql`'[]'::jsonb`),
  linkedForestAreas: jsonb("linked_forest_areas").default(sql`'[]'::jsonb`),

  // Research and documentation
  scientificStudiesConducted: text("scientific_studies_conducted"),
  researchInstitutionsInvolved: text("research_institutions_involved"),
  fireDataCollection: text("fire_data_collection"),
  lessonsLearned: text("lessons_learned"),

  // Notes and additional information
  additionalNotes: text("additional_notes"),
  historicalFirePatterns: text("historical_fire_patterns"),
  referenceMaterials: text("reference_materials"),
  imageDocumentation: text("image_documentation"),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  ignitionPoint: geometry("ignition_point", { type: "Point" }),
  burnArea: geometry("burn_area", { type: "Polygon" }),
  firePerimeter: geometry("fire_perimeter", { type: "LineString" }),
  firebreakLines: geometry("firebreak_lines", { type: "MultiLineString" }),
  evacuationZones: geometry("evacuation_zones", { type: "MultiPolygon" }),
  firespreadTimeZones: geometry("firespread_time_zones", {
    type: "MultiPolygon",
  }), // Zones showing fire spread over time

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

export type ForestFire = typeof forestFire.$inferSelect;
export type NewForestFire = typeof forestFire.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
