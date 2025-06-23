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

// Define flood severity enum
export const floodSeverityEnum = pgEnum("flood_severity", [
  "MINOR",
  "MODERATE",
  "MAJOR",
  "SEVERE",
  "CATASTROPHIC",
]);

// Define flood frequency enum
export const floodFrequencyEnum = pgEnum("flood_frequency", [
  "RARE", // Once in 50+ years
  "OCCASIONAL", // Once in 10-50 years
  "FREQUENT", // Once in 2-10 years
  "ANNUAL", // Almost every year
  "SEASONAL", // Multiple times a year in specific seasons
  "UNKNOWN",
]);

// Define flood cause enum
export const floodCauseEnum = pgEnum("flood_cause", [
  "HEAVY_RAINFALL",
  "RIVERINE_OVERFLOW",
  "FLASH_FLOOD",
  "GLACIAL_LAKE_OUTBURST",
  "DAM_FAILURE",
  "POOR_DRAINAGE",
  "STORM_SURGE",
  "SNOWMELT",
  "MULTIPLE_CAUSES",
  "OTHER",
]);

// Flooded Area table
export const floodedArea = pgTable("flooded_area", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  locationDescription: text("location_description"),

  // Flood characteristics
  floodSeverity: floodSeverityEnum("flood_severity").notNull(),
  floodFrequency: floodFrequencyEnum("flood_frequency"),
  primaryFloodCause: floodCauseEnum("primary_flood_cause"),
  secondaryFloodCauses: text("secondary_flood_causes"),
  mostRecentFloodDate: date("most_recent_flood_date"),
  lastMajorFloodDate: date("last_major_flood_date"),

  // Physical attributes
  areaAffectedSqKm: decimal("area_affected_sq_km", { precision: 10, scale: 6 }),
  maximumDepthM: decimal("maximum_depth_m", { precision: 6, scale: 2 }),
  averageDepthM: decimal("average_depth_m", { precision: 6, scale: 2 }),
  floodDurationHours: integer("flood_duration_hours"),
  typicalInundationPeriodDays: decimal("typical_inundation_period_days", {
    precision: 5,
    scale: 1,
  }),
  waterSourceName: text("water_source_name"), // Name of river, stream, etc.
  waterSourceType: text("water_source_type"),
  floodReturnPeriodYears: integer("flood_return_period_years"), // 10-year flood, 100-year flood, etc.

  // Hydrological factors
  rainfallMm: decimal("rainfall_mm", { precision: 7, scale: 2 }),
  rainfallDurationHours: integer("rainfall_duration_hours"),
  rainfallIntensityMmPerHour: decimal("rainfall_intensity_mm_per_hour", {
    precision: 7,
    scale: 2,
  }),
  peakWaterLevelM: decimal("peak_water_level_m", { precision: 6, scale: 2 }),
  normalWaterLevelM: decimal("normal_water_level_m", {
    precision: 6,
    scale: 2,
  }),
  peakDischargeCumecs: decimal("peak_discharge_cumecs", {
    precision: 10,
    scale: 2,
  }),
  soilInfiltrationRate: text("soil_infiltration_rate"),

  // Impact assessment
  populationAffected: integer("population_affected"),
  householdsAffected: integer("households_affected"),
  casualtiesCount: integer("casualties_count"),
  injuriesCount: integer("injuries_count"),
  missingPersonsCount: integer("missing_persons_count"),
  displacedPeopleCount: integer("displaced_people_count"),
  buildingsDamagedCount: integer("buildings_damaged_count"),
  buildingsDestroyedCount: integer("buildings_destroyed_count"),
  schoolsAffectedCount: integer("schools_affected_count"),
  healthFacilitiesAffectedCount: integer("health_facilities_affected_count"),

  // Agricultural and economic impact
  cropsAffectedHectares: decimal("crops_affected_hectares", {
    precision: 10,
    scale: 2,
  }),
  cropDamageValueNPR: decimal("crop_damage_value_npr", {
    precision: 14,
    scale: 2,
  }),
  livestockLostCount: integer("livestock_lost_count"),
  agriculturalLandAffectedHectares: decimal(
    "agricultural_land_affected_hectares",
    { precision: 10, scale: 2 },
  ),
  forestAreaAffectedHectares: decimal("forest_area_affected_hectares", {
    precision: 10,
    scale: 2,
  }),
  businessesAffectedCount: integer("businesses_affected_count"),
  totalEconomicLossNPR: decimal("total_economic_loss_npr", {
    precision: 18,
    scale: 2,
  }),

  // Infrastructure impact
  roadsAffectedKm: decimal("roads_affected_km", { precision: 8, scale: 2 }),
  bridgesDamagedCount: integer("bridges_damaged_count"),
  waterSupplySystemsAffected: text("water_supply_systems_affected"),
  electricalInfrastructureAffected: text("electrical_infrastructure_affected"),
  communicationSystemsAffected: text("communication_systems_affected"),
  irrigationSystemsAffected: text("irrigation_systems_affected"),

  // Risk factors
  vulnerabilityFactors: text("vulnerability_factors"),
  criticalFacilitiesAtRisk: text("critical_facilities_at_risk"),
  settlementPatternIssues: text("settlement_pattern_issues"),
  landUseContributingFactors: text("land_use_contributing_factors"),
  populationAtRisk: integer("population_at_risk"),
  futureRiskProjection: text("future_risk_projection"),
  climateChangeConsiderations: text("climate_change_considerations"),

  // Monitoring details
  isMonitored: boolean("is_monitored").default(false),
  monitoringMethods: text("monitoring_methods"), // Gauges, remote sensing, etc.
  monitoringFrequency: text("monitoring_frequency"),
  waterLevelMonitoringStations: text("water_level_monitoring_stations"),
  hasFloodForecastingSystem: boolean("has_flood_forecasting_system").default(
    false,
  ),
  forecastingSystemDetails: text("forecasting_system_details"),
  earlyWarningSystemDetails: text("early_warning_system_details"),
  warningDisseminationMethods: text("warning_dissemination_methods"),
  evacuationPlans: text("evacuation_plans"),

  // Mitigation and management
  structuralMeasuresImplemented: text("structural_measures_implemented"),
  nonStructuralMeasuresImplemented: text("non_structural_measures_implemented"),
  floodDefenseType: text("flood_defense_type"),
  embankmentDetails: text("embankment_details"),
  embankmentLengthKm: decimal("embankment_length_km", {
    precision: 8,
    scale: 2,
  }),
  drainageSystemImprovements: text("drainage_system_improvements"),
  retentionBasinsDetails: text("retention_basins_details"),
  floodplainManagement: text("floodplain_management"),
  landUseRegulations: text("land_use_regulations"),

  // Response and recovery
  emergencyResponseActions: text("emergency_response_actions"),
  evacuationEffectiveness: text("evacuation_effectiveness"),
  temporaryShelterDetails: text("temporary_shelter_details"),
  reliefMeasures: text("relief_measures"),
  rehabilitationMeasures: text("rehabilitation_measures"),
  recoveryTimeMonths: decimal("recovery_time_months", {
    precision: 5,
    scale: 1,
  }),
  compensationProvidedNPR: decimal("compensation_provided_npr", {
    precision: 14,
    scale: 2,
  }),

  // Responsible authorities
  leadAgency: text("lead_agency"),
  supportingAgencies: text("supporting_agencies"),
  localDisasterManagementCommittee: text("local_disaster_management_committee"),
  localContactPerson: text("local_contact_person"),
  localContactPhone: text("local_contact_phone"),

  // Community aspects
  communityPreparedness: text("community_preparedness"),
  communityAwarenessPrograms: text("community_awareness_programs"),
  localKnowledgeAndPractices: text("local_knowledge_and_practices"),
  communityBasedEarlyWarning: text("community_based_early_warning"),
  communityDrills: text("community_drills"),

  // Environmental impacts
  environmentalImpacts: text("environmental_impacts"),
  waterContaminationIssues: text("water_contamination_issues"),
  ecologicalChanges: text("ecological_changes"),
  soilErosionImpacts: text("soil_erosion_impacts"),
  sedimentDeposition: text("sediment_deposition"),

  // Financial aspects
  mitigationMeasuresCostNPR: decimal("mitigation_measures_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  annualMaintenanceCostNPR: decimal("annual_maintenance_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  insuranceCoverageDetails: text("insurance_coverage_details"),
  allocatedDisasterFundNPR: decimal("allocated_disaster_fund_npr", {
    precision: 14,
    scale: 2,
  }),

  // Reconstruction status
  reconstructionStatus: text("reconstruction_status"),
  infrastructureRepairStatus: text("infrastructure_repair_status"),
  housingReconstructionStatus: text("housing_reconstruction_status"),
  pendingReconstructionNeeds: text("pending_reconstruction_needs"),

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
  linkedRiverErosionAreas: jsonb("linked_river_erosion_areas").default(
    sql`'[]'::jsonb`,
  ),

  // Research and documentation
  scientificStudiesConducted: text("scientific_studies_conducted"),
  researchInstitutionsInvolved: text("research_institutions_involved"),
  historicalFloodData: text("historical_flood_data"),
  floodDocumentation: text("flood_documentation"),
  floodRiskModels: text("flood_risk_models"),

  // Notes and additional information
  additionalNotes: text("additional_notes"),
  seasonalConsiderations: text("seasonal_considerations"),
  referenceMaterials: text("reference_materials"),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  floodPlain: geometry("flood_plain", { type: "Polygon" }),
  floodExtent: geometry("flood_extent", { type: "Polygon" }),
  drainageSystem: geometry("drainage_system", { type: "MultiLineString" }),
  floodDefenseStructures: geometry("flood_defense_structures", {
    type: "MultiLineString",
  }),
  evacuationRoutes: geometry("evacuation_routes", { type: "MultiLineString" }),

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

export type FloodedArea = typeof floodedArea.$inferSelect;
export type NewFloodedArea = typeof floodedArea.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
