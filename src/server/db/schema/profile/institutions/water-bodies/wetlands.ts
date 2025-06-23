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
import { waterBodyConservationStatusEnum } from "./rivers";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define wetland type enum based on Ramsar classification
export const wetlandTypeEnum = pgEnum("wetland_type", [
  "MARSH",
  "SWAMP",
  "BOG",
  "FEN",
  "POND",
  "FLOODPLAIN",
  "MANGROVE",
  "ESTUARINE",
  "RIVERINE",
  "LACUSTRINE",
  "PEATLAND",
  "ARTIFICIAL_POND",
  "CONSTRUCTED_WETLAND",
  "RICE_FIELD",
  "SEASONAL_WETLAND",
  "OTHER",
]);

// Define seasonality enum
export const wetlandSeasonalityEnum = pgEnum("wetland_seasonality", [
  "PERMANENT", // Water present year-round
  "SEASONAL", // Water present during specific seasons
  "INTERMITTENT", // Water presence varies irregularly
  "EPHEMERAL", // Water present briefly after precipitation
  "FLUCTUATING", // Water levels vary significantly
  "UNKNOWN",
]);

// Define ecosystem health enum
export const ecosystemHealthEnum = pgEnum("ecosystem_health", [
  "PRISTINE",
  "HEALTHY",
  "MODERATE",
  "DEGRADED",
  "SEVERELY_DEGRADED",
  "COLLAPSED",
  "RECOVERING",
  "UNKNOWN",
]);

// Wetland table
export const wetland = pgTable("wetland", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  nameInLocalLanguage: text("name_in_local_language"),
  description: text("description"),
  wetlandType: wetlandTypeEnum("wetland_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  elevationRangeMinM: decimal("elevation_range_min_m", {
    precision: 8,
    scale: 2,
  }),
  elevationRangeMaxM: decimal("elevation_range_max_m", {
    precision: 8,
    scale: 2,
  }),

  // Physical characteristics
  totalAreaHectares: decimal("total_area_hectares", {
    precision: 10,
    scale: 2,
  }),
  waterSurfaceAreaHectares: decimal("water_surface_area_hectares", {
    precision: 10,
    scale: 2,
  }),
  averageDepthM: decimal("average_depth_m", { precision: 6, scale: 2 }),
  maximumDepthM: decimal("maximum_depth_m", { precision: 6, scale: 2 }),
  seasonality: wetlandSeasonalityEnum("seasonality"),
  waterSource: text("water_source"), // Rainfall, river, groundwater, etc.
  waterColor: text("water_color"),
  waterPH: decimal("water_ph", { precision: 4, scale: 2 }),
  waterTemperatureRangeC: text("water_temperature_range_c"),
  hasFluctuatingWaterLevels: boolean("has_fluctuating_water_levels").default(
    true,
  ),
  waterLevelFluctuationM: decimal("water_level_fluctuation_m", {
    precision: 4,
    scale: 2,
  }),
  sedimentType: text("sediment_type"), // Clay, silt, organic, etc.
  soilType: text("soil_type"),
  hydrologyNotes: text("hydrology_notes"),

  // Biodiversity and ecological aspects
  dominantVegetation: text("dominant_vegetation"),
  vegetationCoverPercent: integer("vegetation_cover_percent"),
  significantFloraSpecies: text("significant_flora_species"),
  significantFaunaSpecies: text("significant_fauna_species"),
  fishSpecies: text("fish_species"),
  birdSpecies: text("bird_species"),
  reptileAmphibianSpecies: text("reptile_amphibian_species"),
  mammalSpecies: text("mammal_species"),
  invertebrateSpecies: text("invertebrate_species"),
  endangeredSpecies: text("endangered_species"),
  invasiveSpecies: text("invasive_species"),
  migratorySiteFor: text("migratory_site_for"),
  habitatTypes: text("habitat_types"),
  ecologicalSuccessionStage: text("ecological_succession_stage"),
  ecosystemServices: text("ecosystem_services"),
  biodiversityAssessmentDate: date("biodiversity_assessment_date"),
  biodiversityAssessmentBy: text("biodiversity_assessment_by"),

  // Conservation status and management
  conservationStatus: waterBodyConservationStatusEnum("conservation_status"),
  protectionYear: integer("protection_year"),
  protectionLegalStatus: text("protection_legal_status"),
  managedBy: text("managed_by"),
  managementPlanExists: boolean("management_plan_exists").default(false),
  managementPlanDetails: text("management_plan_details"),
  hasBuffer: boolean("has_buffer_zone").default(false),
  bufferZoneSizeHectares: decimal("buffer_zone_size_hectares", {
    precision: 10,
    scale: 2,
  }),
  isRamsarSite: boolean("is_ramsar_site").default(false),
  ramsarSiteNumber: text("ramsar_site_number"),
  ramsarDesignationDate: date("ramsar_designation_date"),
  conservationChallenges: text("conservation_challenges"),

  // Current condition and threats
  ecosystemHealth: ecosystemHealthEnum("ecosystem_health"),
  threatsAndPressures: text("threats_and_pressures"),
  pollutionSources: text("pollution_sources"),
  humanImpacts: text("human_impacts"),
  invasiveSpeciesImpacts: text("invasive_species_impacts"),
  climateChangeImpacts: text("climate_change_impacts"),
  drainageIssues: text("drainage_issues"),
  encroachmentIssues: text("encroachment_issues"),
  wasteDumpingIssues: text("waste_dumping_issues"),

  // Restoration and conservation efforts
  restorationActivities: text("restoration_activities"),
  restorationStartDate: date("restoration_start_date"),
  restorationOrganization: text("restoration_organization"),
  restorationCostNPR: decimal("restoration_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  conservationMeasures: text("conservation_measures"),
  communityConservationEfforts: text("community_conservation_efforts"),

  // Usage and socioeconomic aspects
  primaryUses: text("primary_uses"), // Fishing, irrigation, tourism, etc.
  communityDependence: text("community_dependence"),
  economicActivities: text("economic_activities"),
  resourceHarvesting: text("resource_harvesting"),
  fishingActivities: text("fishing_activities"),
  agricultureAround: text("agriculture_around"),
  tourismValue: text("tourism_value"),
  annualVisitorCount: integer("annual_visitor_count"),
  localBeneficiaries: integer("local_beneficiaries"),

  // Cultural and historical significance
  culturalImportance: text("cultural_importance"),
  culturalPractices: text("cultural_practices"),
  religiousSignificance: text("religious_significance"),
  historicalSignificance: text("historical_significance"),
  traditionalUses: text("traditional_uses"),
  localMyths: text("local_myths"),
  archaeologicalFindings: text("archaeological_findings"),

  // Accessibility and infrastructure
  accessibilityNotes: text("accessibility_notes"),
  distanceFromNearestRoadKm: decimal("distance_from_nearest_road_km", {
    precision: 6,
    scale: 2,
  }),
  hasAccessPath: boolean("has_access_path").default(true),
  accessPathCondition: text("access_path_condition"),
  hasTourismInfrastructure: boolean("has_tourism_infrastructure").default(
    false,
  ),
  tourismInfrastructureDetails: text("tourism_infrastructure_details"),
  hasViewingPlatforms: boolean("has_viewing_platforms").default(false),
  hasBoardwalks: boolean("has_boardwalks").default(false),
  hasInformationCenters: boolean("has_information_centers").default(false),
  hasVisitorFacilities: boolean("has_visitor_facilities").default(false),
  visitorFacilitiesDetails: text("visitor_facilities_details"),

  // Education and research
  educationalValue: text("educational_value"),
  educationalProgramsOffered: text("educational_programs_offered"),
  researchConducted: boolean("research_conducted").default(false),
  researchInstitutions: text("research_institutions"),
  significantResearchFindings: text("significant_research_findings"),
  monitoringPrograms: text("monitoring_programs"),
  monitoringFrequency: text("monitoring_frequency"),

  // Government and policy
  governmentPolicies: text("government_policies"),
  localRegulations: text("local_regulations"),
  includedInLandUsePlans: boolean("included_in_land_use_plans").default(false),
  landUsePlanDetails: text("land_use_plan_details"),

  // Project and funding
  ongoingProjects: text("ongoing_projects"),
  fundingSourcesForConservation: text("funding_sources_for_conservation"),
  annualBudgetForManagementNPR: decimal("annual_budget_for_management_npr", {
    precision: 14,
    scale: 2,
  }),
  hasEndowmentFund: boolean("has_endowment_fund").default(false),
  endowmentFundValueNPR: decimal("endowment_fund_value_npr", {
    precision: 14,
    scale: 2,
  }),

  // Climate and natural factors
  climaticConditions: text("climatic_conditions"),
  averageAnnualRainfallMm: decimal("average_annual_rainfall_mm", {
    precision: 8,
    scale: 2,
  }),
  floodFrequency: text("flood_frequency"),
  droughtFrequency: text("drought_frequency"),
  naturalDisturbanceHistory: text("natural_disturbance_history"),

  // Water quality and monitoring
  waterQualityStatus: text("water_quality_status"),
  waterQualityParameters: text("water_quality_parameters"),
  lastWaterQualityTestDate: date("last_water_quality_test_date"),
  waterQualityTestingFrequency: text("water_quality_testing_frequency"),
  pollutantLevels: text("pollutant_levels"),

  // Community engagement
  communityAwarenessLevel: text("community_awareness_level"),
  communityParticipation: text("community_participation"),
  stakeholderGroups: text("stakeholder_groups"),
  conflictIssues: text("conflict_issues"),

  // Future plans and sustainability
  futurePlans: text("future_plans"),
  sustainabilityStrategy: text("sustainability_strategy"),
  adaptationToClimateChange: text("adaptation_to_climate_change"),

  // Contact information
  managementContactPerson: text("management_contact_person"),
  managementContactPhone: text("management_contact_phone"),
  localContactPerson: text("local_contact_person"),
  localContactPhone: text("local_contact_phone"),

  // Media and documentation
  hasPhotos: boolean("has_photos").default(false),
  hasVideos: boolean("has_videos").default(false),
  hasMaps: boolean("has_maps").default(false),
  hasResearchPublications: boolean("has_research_publications").default(false),

  // Carbon sequestration and climate regulation
  carbonSequestrationData: text("carbon_sequestration_data"),
  climateRegulationValue: text("climate_regulation_value"),

  // Linkages to other entities
  linkedWaterBodies: jsonb("linked_water_bodies").default(sql`'[]'::jsonb`),
  linkedConservationAreas: jsonb("linked_conservation_areas").default(
    sql`'[]'::jsonb`,
  ),
  linkedCommunities: jsonb("linked_communities").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  wetlandArea: geometry("wetland_area", { type: "MultiPolygon" }),
  bufferZoneArea: geometry("buffer_zone_area", { type: "MultiPolygon" }),

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

export type Wetland = typeof wetland.$inferSelect;
export type NewWetland = typeof wetland.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
