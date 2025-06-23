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
  waterBodyConservationStatusEnum,
} from "./rivers";

// Define pond/lake type enum
export const waterBodyTypeEnum = pgEnum("water_body_type", [
  "NATURAL_LAKE",
  "ARTIFICIAL_LAKE",
  "RESERVOIR",
  "NATURAL_POND",
  "ARTIFICIAL_POND",
  "FISHERY_POND",
  "RETENTION_POND",
  "SHALLOW_POND",
  "SEASONAL_POOL",
  "OXBOW_LAKE",
  "CRATER_LAKE",
  "GLACIAL_LAKE",
  "TECTONIC_LAKE",
  "OTHER",
]);

// Define origin type for water bodies
export const waterBodyOriginEnum = pgEnum("water_body_origin", [
  "NATURAL",
  "ARTIFICIAL",
  "MODIFIED_NATURAL",
]);

// Define water body formation enum
export const waterBodyFormationEnum = pgEnum("water_body_formation", [
  "GLACIAL",
  "TECTONIC",
  "VOLCANIC",
  "FLUVIAL",
  "LANDSLIDE",
  "HUMAN_MADE",
  "ARTIFICIAL_EXCAVATION",
  "RAIN_HARVESTING",
  "RIVER_DIVERSION",
  "OTHER",
]);

// Define permanence type enum
export const waterBodyPermanenceEnum = pgEnum("water_body_permanence", [
  "PERMANENT",
  "SEASONAL",
  "INTERMITTENT",
]);

// Define ownership type enum
export const waterBodyOwnershipEnum = pgEnum("water_body_ownership", [
  "PUBLIC",
  "GOVERNMENT",
  "COMMUNITY",
  "PRIVATE",
  "RELIGIOUS_INSTITUTION",
  "NGO",
  "COOPERATIVE",
  "MIXED",
  "OTHER",
]);

// Pond/Lake table
export const pondLake = pgTable("pond_lake", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  localName: text("local_name"),
  alternativeNames: text("alternative_names"),
  description: text("description"),
  waterBodyType: waterBodyTypeEnum("water_body_type").notNull(),
  originType: waterBodyOriginEnum("origin_type").notNull(),
  formationType: waterBodyFormationEnum("formation_type"),
  permanenceType: waterBodyPermanenceEnum("permanence_type").notNull(),

  // Location and administrative details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  nearestSettlement: text("nearest_settlement"),
  ownershipType: waterBodyOwnershipEnum("ownership_type").notNull(),
  ownerDetails: text("owner_details"),
  managedBy: text("managed_by"),

  // Physical characteristics
  surfaceAreaSqM: decimal("surface_area_sq_m", { precision: 12, scale: 2 }),
  maximumLengthM: decimal("maximum_length_m", { precision: 8, scale: 2 }),
  maximumWidthM: decimal("maximum_width_m", { precision: 8, scale: 2 }),
  shoreLengthM: decimal("shore_length_m", { precision: 10, scale: 2 }),
  averageDepthM: decimal("average_depth_m", { precision: 6, scale: 2 }),
  maximumDepthM: decimal("maximum_depth_m", { precision: 6, scale: 2 }),
  waterVolumeM3: decimal("water_volume_m3", { precision: 14, scale: 2 }),
  elevationM: decimal("elevation_m", { precision: 8, scale: 2 }),
  catchmentAreaSqKm: decimal("catchment_area_sq_km", {
    precision: 10,
    scale: 2,
  }),

  // Hydrological characteristics
  waterSourceType: text("water_source_type"), // Rain, Spring, Stream, etc.
  waterSourceDetails: text("water_source_details"),
  hasInflow: boolean("has_inflow").default(false),
  inflowDetails: text("inflow_details"),
  hasOutflow: boolean("has_outflow").default(false),
  outflowDetails: text("outflow_details"),
  waterLevelFluctuationM: decimal("water_level_fluctuation_m", {
    precision: 6,
    scale: 2,
  }),
  highestWaterLevelMonth: text("highest_water_level_month"),
  lowestWaterLevelMonth: text("lowest_water_level_month"),
  isSubjectToFlooding: boolean("is_subject_to_flooding").default(false),
  floodingDetails: text("flooding_details"),
  isDrying: boolean("is_drying").default(false),
  dryingDetails: text("drying_details"),
  hasWaterLevelMonitoring: boolean("has_water_level_monitoring").default(false),
  waterLevelMonitoringDetails: text("water_level_monitoring_details"),
  evaporationRate: text("evaporation_rate"),

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
  waterTemperatureC: decimal("water_temperature_c", { precision: 5, scale: 2 }),
  pollutionLevel: pollutionLevelEnum("pollution_level"),
  pollutionSources: text("pollution_sources"),
  pollutionImpacts: text("pollution_impacts"),
  eutrophicationStatus: text("eutrophication_status"), // Oligotrophic, Mesotrophic, Eutrophic, Hypereutrophic
  algalBloomFrequency: text("algal_bloom_frequency"),

  // Ecological characteristics
  aquaticEcosystemType: text("aquatic_ecosystem_type"),
  dominantFloraSpecies: text("dominant_flora_species"),
  dominantFaunaSpecies: text("dominant_fauna_species"),
  fishSpecies: text("fish_species"),
  endangeredSpecies: text("endangered_species"),
  invasiveSpecies: text("invasive_species"),
  microbialDiversity: text("microbial_diversity"),
  shorelineVegetation: text("shoreline_vegetation"),
  conservationStatus: waterBodyConservationStatusEnum("conservation_status"),
  conservationEfforts: text("conservation_efforts"),
  conservedByOrganization: text("conserved_by_organization"),
  restorationProjects: text("restoration_projects"),
  hasWetlandFeatures: boolean("has_wetland_features").default(false),
  wetlandDescription: text("wetland_description"),

  // Human use and cultural significance
  primaryUse: text("primary_use"), // Irrigation, Drinking, Recreation, etc.
  secondaryUses: text("secondary_uses"),
  irrigationAreaHectares: decimal("irrigation_area_hectares", {
    precision: 10,
    scale: 2,
  }),
  waterExtractionRateM3Day: decimal("water_extraction_rate_m3_day", {
    precision: 10,
    scale: 2,
  }),
  isDrinkingWaterSource: boolean("is_drinking_water_source").default(false),
  drinkingWaterDetails: text("drinking_water_details"),
  populationServed: integer("population_served"),
  hasFishFarming: boolean("has_fish_farming").default(false),
  fishFarmingDetails: text("fish_farming_details"),
  annualFishProductionKg: decimal("annual_fish_production_kg", {
    precision: 10,
    scale: 2,
  }),
  fishSpeciesCultivated: text("fish_species_cultivated"),
  hasRecreationalUse: boolean("has_recreational_use").default(false),
  recreationalActivities: text("recreational_activities"),
  tourismSignificance: text("tourism_significance"),
  visitorStatistics: text("visitor_statistics"),
  hasReligiousSignificance: boolean("has_religious_significance").default(
    false,
  ),
  religiousSignificanceDetails: text("religious_significance_details"),
  hasCulturalSignificance: boolean("has_cultural_significance").default(false),
  culturalSignificanceDetails: text("cultural_significance_details"),
  traditionalPractices: text("traditional_practices"),
  localBeliefs: text("local_beliefs"),

  // Infrastructure
  hasDams: boolean("has_dams").default(false),
  damDetails: text("dam_details"),
  hasEmbankments: boolean("has_embankments").default(false),
  embankmentDetails: text("embankment_details"),
  hasWaterSupplyInfrastructure: boolean(
    "has_water_supply_infrastructure",
  ).default(false),
  waterSupplyInfrastructureDetails: text("water_supply_infrastructure_details"),
  hasRecreationalInfrastructure: boolean(
    "has_recreational_infrastructure",
  ).default(false),
  recreationalInfrastructureDetails: text(
    "recreational_infrastructure_details",
  ),
  hasWaterTreatmentFacilities: boolean(
    "has_water_treatment_facilities",
  ).default(false),
  waterTreatmentDetails: text("water_treatment_details"),
  hasBoatingFacilities: boolean("has_boating_facilities").default(false),
  boatingFacilitiesDetails: text("boating_facilities_details"),
  hasFishingPlatforms: boolean("has_fishing_platforms").default(false),
  fishingPlatformsDetails: text("fishing_platforms_details"),
  accessibilityDetails: text("accessibility_details"),

  // Management and administration
  hasManagementCommittee: boolean("has_management_committee").default(false),
  managementCommitteeDetails: text("management_committee_details"),
  hasManagementPlan: boolean("has_management_plan").default(false),
  managementPlanDetails: text("management_plan_details"),
  annualMaintenanceCostNPR: decimal("annual_maintenance_cost_npr", {
    precision: 12,
    scale: 2,
  }),
  fundingSource: text("funding_source"),
  communityInvolvementDescription: text("community_involvement_description"),
  regularMonitoring: boolean("regular_monitoring").default(false),
  monitoringDetails: text("monitoring_details"),
  hasDredgingProgram: boolean("has_dredging_program").default(false),
  dredgingFrequency: text("dredging_frequency"),
  waterQualityManagementPractices: text("water_quality_management_practices"),

  // Environmental threats and challenges
  majorThreats: text("major_threats"),
  encroachmentIssues: text("encroachment_issues"),
  wasteDumpingIssues: text("waste_dumping_issues"),
  siltationRate: text("siltation_rate"),
  climateChangeImpacts: text("climate_change_impacts"),
  eutrophicationIssues: text("eutrophication_issues"),
  waterHyacinthIssues: text("water_hyacinth_issues"),
  invasiveSpeciesManagement: text("invasive_species_management"),
  droughtVulnerability: text("drought_vulnerability"),

  // History and formation
  formationYear: integer("formation_year"),
  ageEstimateYears: integer("age_estimate_years"),
  historicalEvents: text("historical_events"),
  originStory: text("origin_story"),
  historicalSignificance: text("historical_significance"),
  traditionalNameOrigin: text("traditional_name_origin"),
  constructionDetails: text("construction_details"), // For artificial ponds/lakes

  // Economic aspects
  economicImportance: text("economic_importance"),
  jobsCreated: integer("jobs_created"),
  annualEconomicValueNPR: decimal("annual_economic_value_npr", {
    precision: 12,
    scale: 2,
  }),
  touristRevenueNPR: decimal("tourist_revenue_npr", {
    precision: 12,
    scale: 2,
  }),
  fisheryRevenueNPR: decimal("fishery_revenue_npr", {
    precision: 12,
    scale: 2,
  }),
  irrigationEconomicBenefitNPR: decimal("irrigation_economic_benefit_npr", {
    precision: 12,
    scale: 2,
  }),

  // Restoration and future plans
  restorationNeeds: text("restoration_needs"),
  plannedImprovements: text("planned_improvements"),
  expansionPlans: text("expansion_plans"),
  communityVision: text("community_vision"),
  proposedProjects: text("proposed_projects"),

  // Research and education
  researchStudies: text("research_studies"),
  educationalValue: text("educational_value"),
  educationalProgramsOffered: text("educational_programs_offered"),

  // Legal status
  legalProtectionStatus: text("legal_protection_status"),
  relevantLegislation: text("relevant_legislation"),
  waterRightsIssues: text("water_rights_issues"),

  // SEO metadata
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  waterBodyPolygon: geometry("water_body_polygon", { type: "Polygon" }),
  catchmentAreaPolygon: geometry("catchment_area_polygon", {
    type: "MultiPolygon",
  }),
  waterLevelHighPolygon: geometry("water_level_high_polygon", {
    type: "Polygon",
  }),
  waterLevelLowPolygon: geometry("water_level_low_polygon", {
    type: "Polygon",
  }),

  // Linked entities
  linkedWatersheds: jsonb("linked_watersheds").default(sql`'[]'::jsonb`),
  linkedRivers: jsonb("linked_rivers").default(sql`'[]'::jsonb`),
  linkedStreams: jsonb("linked_streams").default(sql`'[]'::jsonb`),
  linkedIrrigationCanals: jsonb("linked_irrigation_canals").default(
    sql`'[]'::jsonb`,
  ),
  linkedWetlands: jsonb("linked_wetlands").default(sql`'[]'::jsonb`),
  linkedWaterProjects: jsonb("linked_water_projects").default(sql`'[]'::jsonb`),
  linkedSettlements: jsonb("linked_settlements").default(sql`'[]'::jsonb`),

  // Media content
  imageGallery: jsonb("image_gallery").default(sql`'[]'::jsonb`),
  videos: jsonb("videos").default(sql`'[]'::jsonb`),
  documents: jsonb("documents").default(sql`'[]'::jsonb`),

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

export type PondLake = typeof pondLake.$inferSelect;
export type NewPondLake = typeof pondLake.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
