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
import {
  waterQualityStatusEnum,
  pollutionLevelEnum,
  floodRiskLevelEnum,
  waterBodyConservationStatusEnum,
} from "./rivers";

// Define stream type enum
export const streamTypeEnum = pgEnum("stream_type", [
  "PERENNIAL", // Flows year-round
  "SEASONAL", // Flows only in certain seasons
  "INTERMITTENT", // Flows irregularly
  "EPHEMERAL", // Flows only after precipitation
  "HEADWATER", // Stream forming the source of a river
  "RAVINE", // Stream in a narrow valley
  "CREEK", // Small to medium stream
  "BROOK", // Small stream
  "MOUNTAIN_STREAM", // Stream in mountainous terrain
  "FOREST_STREAM", // Stream flowing through forested area
  "ARTIFICIAL", // Human-made stream
  "OTHER",
]);

// Stream table
export const stream = pgTable("stream", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  localName: text("local_name"),
  description: text("description"),
  streamType: streamTypeEnum("stream_type").notNull(),

  // Physical characteristics
  totalLengthKm: decimal("total_length_km", { precision: 8, scale: 2 }),
  lengthWithinMunicipalityKm: decimal("length_within_municipality_km", {
    precision: 8,
    scale: 2,
  }),
  averageWidthM: decimal("average_width_m", { precision: 6, scale: 2 }),
  maximumWidthM: decimal("maximum_width_m", { precision: 6, scale: 2 }),
  averageDepthM: decimal("average_depth_m", { precision: 6, scale: 2 }),
  maximumDepthM: decimal("maximum_depth_m", { precision: 6, scale: 2 }),
  drainageAreaSqKm: decimal("drainage_area_sq_km", { precision: 10, scale: 2 }),
  averageFlowRateM3S: decimal("average_flow_rate_m3s", {
    precision: 8,
    scale: 3,
  }), // cubic meters per second
  beginElevationM: decimal("begin_elevation_m", { precision: 8, scale: 2 }),
  endElevationM: decimal("end_elevation_m", { precision: 8, scale: 2 }),
  gradientPercent: decimal("gradient_percent", { precision: 6, scale: 3 }),
  mainSourceType: text("main_source_type"), // Spring, Rainfall, Glacier melt, etc.
  sourceLocation: text("source_location"),
  flowsInto: text("flows_into"), // Name of the river/water body it flows into
  isFlowPermanent: boolean("is_flow_permanent").default(false),
  flowMonthsCount: integer("flow_months_count"), // Number of months with active flow
  flowSeasonDescription: text("flow_season_description"),
  streamBedComposition: text("stream_bed_composition"), // Sand, gravel, rock, etc.
  bankStability: text("bank_stability"), // Stable, Eroding, etc.

  // Hydrological information
  catchmentDescription: text("catchment_description"),
  annualRainfallMm: decimal("annual_rainfall_mm", { precision: 8, scale: 2 }),
  peakFlowMonth: text("peak_flow_month"),
  lowFlowMonth: text("low_flow_month"),
  floodRiskLevel: floodRiskLevelEnum("flood_risk_level"),
  lastFloodingEvent: date("last_flooding_event"),
  floodingHistory: text("flooding_history"),
  hasFloodControlMeasures: boolean("has_flood_control_measures").default(false),
  floodControlDetails: text("flood_control_details"),

  // Water quality
  waterQualityStatus: waterQualityStatusEnum("water_quality_status"),
  lastWaterQualityTestDate: date("last_water_quality_test_date"),
  waterQualityParameters: text("water_quality_parameters"),
  pollutionLevel: pollutionLevelEnum("pollution_level"),
  pollutionSources: text("pollution_sources"),
  pollutionImpacts: text("pollution_impacts"),
  hasPollutionPrevention: boolean("has_pollution_prevention").default(false),
  pollutionPreventionMeasures: text("pollution_prevention_measures"),

  // Ecological information
  aquaticSpecies: text("aquatic_species"),
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
  wildlifeSignificance: text("wildlife_significance"),

  // Human use
  mainUsage: text("main_usage"), // Drinking water, irrigation, etc.
  isDrinkingWaterSource: boolean("is_drinking_water_source").default(false),
  drinkingWaterDetails: text("drinking_water_details"),
  isIrrigationSource: boolean("is_irrigation_source").default(false),
  irrigationAreaHectares: decimal("irrigation_area_hectares", {
    precision: 8,
    scale: 2,
  }),
  waterExtractionSystems: text("water_extraction_systems"),
  waterHarvestingDetails: text("water_harvesting_details"),
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
  settlementProximity: text("settlement_proximity"),

  // Infrastructure
  hasBridges: boolean("has_bridges").default(false),
  bridgeCount: integer("bridge_count"),
  bridgeDetails: text("bridge_details"),
  hasCheckDams: boolean("has_check_dams").default(false),
  checkDamCount: integer("check_dam_count"),
  checkDamPurpose: text("check_dam_purpose"),
  hasWaterMills: boolean("has_water_mills").default(false),
  waterMillCount: integer("water_mill_count"),
  hasStreamChannelization: boolean("has_stream_channelization").default(false),
  channelizationDetails: text("channelization_details"),
  hasBankStabilization: boolean("has_bank_stabilization").default(false),
  bankStabilizationDetails: text("bank_stabilization_details"),
  hasWaterDiversionStructures: boolean(
    "has_water_diversion_structures",
  ).default(false),
  waterDiversionDetails: text("water_diversion_details"),

  // Management and administration
  administrativeJurisdiction: text("administrative_jurisdiction"),
  localAdministrationAuthority: text("local_administration_authority"),
  managedByOrganization: text("managed_by_organization"),
  managementApproach: text("management_approach"),
  hasWaterUserGroups: boolean("has_water_user_groups").default(false),
  waterUserGroupDetails: text("water_user_group_details"),
  communityInvolvementDescription: text("community_involvement_description"),

  // Environmental threats
  environmentalThreats: text("environmental_threats"),
  encroachmentIssues: text("encroachment_issues"),
  wasteDumpingIssues: text("waste_dumping_issues"),
  deforestationImpacts: text("deforestation_impacts"),
  climateChangeImpacts: text("climate_change_impacts"),
  landUseChangeImpacts: text("land_use_change_impacts"),

  // Historical significance
  historicalSignificance: text("historical_significance"),
  historicalUses: text("historical_uses"),

  // Monitoring and research
  hasMonitoringProgram: boolean("has_monitoring_program").default(false),
  monitoringFrequency: text("monitoring_frequency"),
  monitoredBy: text("monitored_by"),
  researchStudies: text("research_studies"),

  // Restoration and conservation
  restorationNeeds: text("restoration_needs"),
  conservationPriority: text("conservation_priority"), // High, Medium, Low
  restorationPlans: text("restoration_plans"),
  communityBasedConservation: text("community_based_conservation"),

  // Local knowledge and practices
  traditionalManagementPractices: text("traditional_management_practices"),
  indigenousKnowledge: text("indigenous_knowledge"),
  localBeliefsSurroundingStream: text("local_beliefs_surrounding_stream"),

  // Challenges and issues
  mainChallenges: text("main_challenges"),
  conflictIssues: text("conflict_issues"),
  proposedSolutions: text("proposed_solutions"),

  // SEO metadata
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  streamSource: geometry("stream_source", { type: "Point" }),
  streamOutlet: geometry("stream_outlet", { type: "Point" }),
  streamCenterline: geometry("stream_centerline", { type: "LineString" }),
  streamPolygon: geometry("stream_polygon", { type: "MultiPolygon" }),
  catchmentArea: geometry("catchment_area", { type: "MultiPolygon" }),

  // Linked entities
  linkedRivers: jsonb("linked_rivers").default(sql`'[]'::jsonb`),
  linkedSprings: jsonb("linked_springs").default(sql`'[]'::jsonb`),
  linkedSettlements: jsonb("linked_settlements").default(sql`'[]'::jsonb`),
  linkedIrrigationCanals: jsonb("linked_irrigation_canals").default(
    sql`'[]'::jsonb`,
  ),
  linkedWaterProjects: jsonb("linked_water_projects").default(sql`'[]'::jsonb`),

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

export type Stream = typeof stream.$inferSelect;
export type NewStream = typeof stream.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
