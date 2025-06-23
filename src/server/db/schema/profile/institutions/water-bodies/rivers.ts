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

// Define river type enum
export const riverTypeEnum = pgEnum("river_type", [
  "MAJOR_RIVER", // Large river that is a significant watercourse in the region
  "TRIBUTARY", // River or stream that flows into a larger river
  "SEASONAL_RIVER", // River that flows only during certain seasons
  "PERENNIAL_RIVER", // River that flows throughout the year
  "URBAN_RIVER", // River flowing through urban areas
  "BOUNDARY_RIVER", // River forming a boundary between administrative regions
  "BRAIDED_RIVER", // River with multiple channels separated by small islands
  "MEANDERING_RIVER", // River with pronounced bends/curves
  "MOUNTAIN_RIVER", // Fast-flowing river in mountainous terrain
  "OTHER",
]);

// Define river flow status enum
export const riverFlowStatusEnum = pgEnum("river_flow_status", [
  "PERENNIAL", // Flows year-round
  "SEASONAL", // Flows only in certain seasons
  "INTERMITTENT", // Flows irregularly
  "EPHEMERAL", // Flows only after precipitation
  "REGULATED", // Flow controlled by dams or other structures
  "VARIABLE", // Significant variation in flow throughout year
]);

// Define water quality status enum
export const waterQualityStatusEnum = pgEnum("water_quality_status", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "VERY_POOR",
  "POLLUTED",
  "UNKNOWN",
]);

// Define pollution level enum
export const pollutionLevelEnum = pgEnum("pollution_level", [
  "NONE",
  "LOW",
  "MODERATE",
  "HIGH",
  "SEVERE",
  "UNKNOWN",
]);

// Define flood risk level enum
export const floodRiskLevelEnum = pgEnum("flood_risk_level", [
  "MINIMAL",
  "LOW",
  "MODERATE",
  "HIGH",
  "EXTREME",
  "VARIABLE",
  "UNKNOWN",
]);

// Define conservation status enum
export const waterBodyConservationStatusEnum = pgEnum(
  "water_body_conservation_status",
  [
    "PROTECTED",
    "CONSERVATION_AREA",
    "MANAGED",
    "UNPROTECTED",
    "THREATENED",
    "CRITICAL",
    "RESTORED",
    "UNKNOWN",
  ],
);

// River table
export const river = pgTable("river", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  localName: text("local_name"),
  alternativeNames: text("alternative_names"),
  description: text("description"),
  riverType: riverTypeEnum("river_type").notNull(),

  // Physical characteristics
  flowStatus: riverFlowStatusEnum("flow_status"),
  totalLengthKm: decimal("total_length_km", { precision: 10, scale: 2 }),
  lengthWithinMunicipalityKm: decimal("length_within_municipality_km", {
    precision: 10,
    scale: 2,
  }),
  averageWidthM: decimal("average_width_m", { precision: 8, scale: 2 }),
  maximumWidthM: decimal("maximum_width_m", { precision: 8, scale: 2 }),
  minimumWidthM: decimal("minimum_width_m", { precision: 8, scale: 2 }),
  averageDepthM: decimal("average_depth_m", { precision: 8, scale: 2 }),
  maximumDepthM: decimal("maximum_depth_m", { precision: 8, scale: 2 }),
  drainageAreaSqKm: decimal("drainage_area_sq_km", { precision: 12, scale: 2 }),
  averageDischargeM3S: decimal("average_discharge_m3s", {
    precision: 10,
    scale: 2,
  }), // cubic meters per second
  highestRecordedDischargeM3S: decimal("highest_recorded_discharge_m3s", {
    precision: 10,
    scale: 2,
  }),
  lowestRecordedDischargeM3S: decimal("lowest_recorded_discharge_m3s", {
    precision: 10,
    scale: 2,
  }),
  beginElevationM: decimal("begin_elevation_m", { precision: 8, scale: 2 }),
  endElevationM: decimal("end_elevation_m", { precision: 8, scale: 2 }),
  gradientPercent: decimal("gradient_percent", { precision: 6, scale: 3 }),
  mainSourceType: text("main_source_type"), // Glacier, Spring, Lake, etc.
  sourceLocation: text("source_location"),
  riverMouthLocation: text("river_mouth_location"),
  majorTributaries: text("major_tributaries"), // Names of tributary rivers/streams

  // Hydrological information
  catchmentArea: text("catchment_area"),
  annualRainfallMm: decimal("annual_rainfall_mm", { precision: 8, scale: 2 }),
  peakFlowMonth: text("peak_flow_month"),
  lowFlowMonth: text("low_flow_month"),
  floodRiskLevel: floodRiskLevelEnum("flood_risk_level"),
  lastMajorFloodDate: date("last_major_flood_date"),
  floodHistoryDetails: text("flood_history_details"),
  hasFloodControlMeasures: boolean("has_flood_control_measures").default(false),
  floodControlDetails: text("flood_control_details"),
  hasEarlyWarningSystem: boolean("has_early_warning_system").default(false),
  earlyWarningSystemDetails: text("early_warning_system_details"),
  sedimentTransportRateTonsYear: decimal("sediment_transport_rate_tons_year", {
    precision: 12,
    scale: 2,
  }),
  isSubjectToRiverbedExtraction: boolean(
    "is_subject_to_riverbed_extraction",
  ).default(false),
  riverbedExtractionDetails: text("riverbed_extraction_details"),

  // Water quality
  waterQualityStatus: waterQualityStatusEnum("water_quality_status"),
  waterQualityTestingFrequency: text("water_quality_testing_frequency"),
  lastWaterQualityTestDate: date("last_water_quality_test_date"),
  dissolvedOxygenMgL: decimal("dissolved_oxygen_mg_l", {
    precision: 6,
    scale: 2,
  }),
  phLevel: decimal("ph_level", { precision: 4, scale: 2 }),
  turbidityNTU: decimal("turbidity_ntu", { precision: 8, scale: 2 }), // Nephelometric Turbidity Units
  electricalConductivityMicroSCm: decimal(
    "electrical_conductivity_micro_s_cm",
    { precision: 8, scale: 2 },
  ),
  totalDissolvedSolidsMgL: decimal("total_dissolved_solids_mg_l", {
    precision: 8,
    scale: 2,
  }),
  pollutionLevel: pollutionLevelEnum("pollution_level"),
  pollutionSources: text("pollution_sources"),
  pollutionImpacts: text("pollution_impacts"),

  // Ecological information
  aquaticEcosystemType: text("aquatic_ecosystem_type"),
  nativeFishSpecies: text("native_fish_species"),
  endangeredSpecies: text("endangered_species"),
  invasiveSpecies: text("invasive_species"),
  riparianVegetation: text("riparian_vegetation"),
  riparianBufferWidthM: decimal("riparian_buffer_width_m", {
    precision: 6,
    scale: 2,
  }),
  conservationStatus: waterBodyConservationStatusEnum("conservation_status"),
  conservationEfforts: text("conservation_efforts"),
  conservedByOrganization: text("conserved_by_organization"),
  restorationProjects: text("restoration_projects"),
  hasWildlifeCorridors: boolean("has_wildlife_corridors").default(false),
  wildlifeCorridorDetails: text("wildlife_corridor_details"),

  // Human use
  mainUsage: text("main_usage"), // Drinking water, irrigation, recreation, etc.
  isDrinkingWaterSource: boolean("is_drinking_water_source").default(false),
  drinkingWaterExtractionLocationDetails: text(
    "drinking_water_extraction_location_details",
  ),
  isIrrigationSource: boolean("is_irrigation_source").default(false),
  irrigationAreaHectares: decimal("irrigation_area_hectares", {
    precision: 10,
    scale: 2,
  }),
  hasFishingActivities: boolean("has_fishing_activities").default(false),
  fishingDetails: text("fishing_details"),
  hasReligiousSignificance: boolean("has_religious_significance").default(
    false,
  ),
  religiousSignificanceDetails: text("religious_significance_details"),
  hasRecreationalUse: boolean("has_recreational_use").default(false),
  recreationalActivities: text("recreational_activities"),
  hasCulturalSignificance: boolean("has_cultural_significance").default(false),
  culturalSignificanceDetails: text("cultural_significance_details"),
  hasRiverbedMining: boolean("has_riverbed_mining").default(false),
  riverbedMiningDetails: text("riverbed_mining_details"),
  settlementNearRiver: text("settlement_near_river"),

  // Infrastructure
  hasBridges: boolean("has_bridges").default(false),
  bridgeCount: integer("bridge_count"),
  bridgeDetails: text("bridge_details"),
  hasDams: boolean("has_dams").default(false),
  damCount: integer("dam_count"),
  damDetails: text("dam_details"),
  hasWeirs: boolean("has_weirs").default(false),
  weirCount: integer("weir_count"),
  hasDredging: boolean("has_dredging").default(false),
  hasRiverbankStabilization: boolean("has_riverbank_stabilization").default(
    false,
  ),
  riverbankStabilizationDetails: text("riverbank_stabilization_details"),
  hasFloodDefenses: boolean("has_flood_defenses").default(false),
  floodDefenseDetails: text("flood_defense_details"),
  hasHydropowerPlants: boolean("has_hydropower_plants").default(false),
  hydropowerPlantCount: integer("hydropower_plant_count"),
  hydropowerDetails: text("hydropower_details"),
  totalHydropowerCapacityMW: decimal("total_hydropower_capacity_mw", {
    precision: 10,
    scale: 2,
  }),

  // Management and administration
  administrativeJurisdiction: text("administrative_jurisdiction"),
  localAdministrationAuthority: text("local_administration_authority"),
  managedByOrganization: text("managed_by_organization"),
  managementPlan: text("management_plan"),
  hasRiverBasinManagementPlan: boolean(
    "has_river_basin_management_plan",
  ).default(false),
  basinManagementDetails: text("basin_management_details"),
  hasWaterUserGroups: boolean("has_water_user_groups").default(false),
  waterUserGroupDetails: text("water_user_group_details"),

  // Environmental threats
  environmentalThreats: text("environmental_threats"),
  majorHazards: text("major_hazards"),
  floodRiskManagement: text("flood_risk_management"),
  droughtRisks: text("drought_risks"),
  climateChangeImpacts: text("climate_change_impacts"),
  encroachmentIssues: text("encroachment_issues"),
  invasiveSpeciesThreats: text("invasive_species_threats"),

  // Historical significance
  historicalSignificance: text("historical_significance"),
  historicalEvents: text("historical_events"),
  ancientUses: text("ancient_uses"),

  // Research and monitoring
  hasMonitoringStations: boolean("has_monitoring_stations").default(false),
  monitoringStationCount: integer("monitoring_station_count"),
  monitoringStationDetails: text("monitoring_station_details"),
  researchStudies: text("research_studies"),
  ongoingResearchProjects: text("ongoing_research_projects"),

  // Restoration and conservation plans
  restorationPlans: text("restoration_plans"),
  conservationPlans: text("conservation_plans"),
  futureProjects: text("future_projects"),
  communityStewardshipPrograms: text("community_stewardship_programs"),

  // Legal and policy aspects
  protectedStatus: text("protected_status"),
  relevantLegislation: text("relevant_legislation"),
  waterRightSettings: text("water_right_settings"),
  disputeResolutionMechanism: text("dispute_resolution_mechanism"),

  // Additional information
  additionalNotes: text("additional_notes"),
  dataSource: text("data_source"),
  lastSurveyDate: date("last_survey_date"),
  surveyedBy: text("surveyed_by"),

  // SEO metadata
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  riverSource: geometry("river_source", { type: "Point" }),
  riverMouth: geometry("river_mouth", { type: "Point" }),
  riverCenterline: geometry("river_centerline", { type: "LineString" }),
  riverPolygon: geometry("river_polygon", { type: "MultiPolygon" }),
  drainageBasin: geometry("drainage_basin", { type: "MultiPolygon" }),
  floodplain: geometry("floodplain", { type: "MultiPolygon" }),

  // Linked entities
  linkedWatersheds: jsonb("linked_watersheds").default(sql`'[]'::jsonb`),
  linkedTributaries: jsonb("linked_tributaries").default(sql`'[]'::jsonb`),
  linkedDams: jsonb("linked_dams").default(sql`'[]'::jsonb`),
  linkedIrrigationCanals: jsonb("linked_irrigation_canals").default(
    sql`'[]'::jsonb`,
  ),
  linkedWaterProjects: jsonb("linked_water_projects").default(sql`'[]'::jsonb`),
  linkedSettlements: jsonb("linked_settlements").default(sql`'[]'::jsonb`),

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

export type River = typeof river.$inferSelect;
export type NewRiver = typeof river.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
