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

// Define natural pastures type enum
export const naturalPastureTypeEnum = pgEnum("natural_pasture_type", [
  "ALPINE_PASTURE",
  "GRASSLAND_PASTURE",
  "MEADOW_PASTURE",
  "FOREST_BASED_PASTURE",
  "SHRUBLAND_PASTURE",
  "WETLAND_PASTURE",
  "SEASONAL_PASTURE",
  "MIXED_PASTURE",
  "OTHER",
]);

// Define management type enum
export const pastureManagementTypeEnum = pgEnum("pasture_management_type", [
  "COMMUNITY_MANAGED",
  "GOVERNMENT_MANAGED",
  "TRADITIONAL_MANAGED",
  "PRIVATELY_MANAGED",
  "COOPERATIVE_MANAGED",
  "JOINTLY_MANAGED",
  "UNMANAGED",
  "OTHER",
]);

// Define vegetation condition enum
export const vegetationConditionEnum = pgEnum("vegetation_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "DEGRADED",
  "UNDER_REHABILITATION",
  "MIXED",
]);

// Define seasonal availability enum
export const seasonalAvailabilityEnum = pgEnum("seasonal_availability", [
  "YEAR_ROUND",
  "SUMMER_ONLY",
  "WINTER_ONLY",
  "MONSOON_SEASON",
  "DRY_SEASON",
  "SEASONAL_ROTATIONAL",
  "INTERMITTENT",
]);

// Define grazing pressure enum
export const grazingPressureEnum = pgEnum("grazing_pressure", [
  "NONE",
  "LIGHT",
  "MODERATE",
  "HEAVY",
  "EXCESSIVE",
  "CONTROLLED",
  "SEASONAL",
]);

// Natural pastures table
export const naturalPasture = pgTable("natural_pasture", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  localName: text("local_name"),
  description: text("description"),
  pastureType: naturalPastureTypeEnum("pasture_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  elevationMinMeters: decimal("elevation_min_meters", {
    precision: 8,
    scale: 2,
  }),
  elevationMaxMeters: decimal("elevation_max_meters", {
    precision: 8,
    scale: 2,
  }),
  aspect: text("aspect"), // N, NE, E, SE, S, SW, W, NW
  slope: text("slope"),

  // Physical characteristics
  totalAreaHectares: decimal("total_area_hectares", {
    precision: 10,
    scale: 2,
  }),
  grasslandAreaPercentage: decimal("grassland_area_percentage", {
    precision: 5,
    scale: 2,
  }),
  shrublandAreaPercentage: decimal("shrubland_area_percentage", {
    precision: 5,
    scale: 2,
  }),
  wetlandAreaPercentage: decimal("wetland_area_percentage", {
    precision: 5,
    scale: 2,
  }),
  rockyAreaPercentage: decimal("rocky_area_percentage", {
    precision: 5,
    scale: 2,
  }),
  forestCoverPercentage: decimal("forest_cover_percentage", {
    precision: 5,
    scale: 2,
  }),
  vegetationCondition: vegetationConditionEnum("vegetation_condition"),
  soilType: text("soil_type"),
  waterSourcesPresent: text("water_sources_present"),
  naturalWaterBodiesCount: integer("natural_water_bodies_count"),

  // Biological characteristics
  dominantGrassSpecies: text("dominant_grass_species"),
  dominantShrubSpecies: text("dominant_shrub_species"),
  dominantHerbSpecies: text("dominant_herb_species"),
  invasiveSpeciesPresent: text("invasive_species_present"),
  endemicPlantSpeciesPresent: text("endemic_plant_species_present"),
  speciesRichness: text("species_richness"),
  biodiversityValue: text("biodiversity_value"),
  ecosystemServices: text("ecosystem_services"),
  floraStudyConducted: boolean("flora_study_conducted").default(false),
  floraDiversity: text("flora_diversity"),

  // Wildlife characteristics
  wildlifePresent: text("wildlife_present"),
  endangeredSpeciesPresent: text("endangered_species_present"),
  migratoryCorridor: boolean("migratory_corridor").default(false),
  migratorySpecies: text("migratory_species"),
  faunaStudyConducted: boolean("fauna_study_conducted").default(false),
  faunaDiversity: text("fauna_diversity"),

  // Management details
  managementType: pastureManagementTypeEnum("management_type").notNull(),
  managingAuthority: text("managing_authority"),
  managementPlanExists: boolean("management_plan_exists").default(false),
  managementPlanDetails: text("management_plan_details"),
  managementCommitteeExists: boolean("management_committee_exists").default(
    false,
  ),
  committeeMemberCount: integer("committee_member_count"),
  womenInCommitteeCount: integer("women_in_committee_count"),
  registrationStatus: text("registration_status"),
  registrationNumber: text("registration_number"),
  registrationDate: date("registration_date"),
  renewalDate: date("renewal_date"),

  // Accessibility and usage
  accessRestrictions: text("access_restrictions"),
  seasonalAccessibility: text("seasonal_accessibility"),
  distanceFromSettlementKm: decimal("distance_from_settlement_km", {
    precision: 6,
    scale: 2,
  }),
  accessRoadAvailable: boolean("access_road_available").default(false),
  trailsAvailable: boolean("trails_available").default(false),
  seasonalAvailability: seasonalAvailabilityEnum("seasonal_availability"),
  grazingRestrictions: text("grazing_restrictions"),
  grazingPermitRequired: boolean("grazing_permit_required").default(false),
  grazingPermitCost: decimal("grazing_permit_cost", {
    precision: 10,
    scale: 2,
  }),
  grazingTaxCollected: boolean("grazing_tax_collected").default(false),
  annualGrazingTaxNPR: decimal("annual_grazing_tax_npr", {
    precision: 12,
    scale: 2,
  }),

  // Utilization details
  currentUses: text("current_uses"), // Grazing, fodder collection, recreation, etc.
  grazingPressure: grazingPressureEnum("grazing_pressure"),
  grazingUnitCapacity: integer("grazing_unit_capacity"),
  annualGrazingDays: integer("annual_grazing_days"),
  averageAnnualLivestockCount: integer("average_annual_livestock_count"),
  cattlePercentage: decimal("cattle_percentage", { precision: 5, scale: 2 }),
  buffaloPercentage: decimal("buffalo_percentage", { precision: 5, scale: 2 }),
  sheepPercentage: decimal("sheep_percentage", { precision: 5, scale: 2 }),
  goatPercentage: decimal("goat_percentage", { precision: 5, scale: 2 }),
  horsePercentage: decimal("horse_percentage", { precision: 5, scale: 2 }),
  yakPercentage: decimal("yak_percentage", { precision: 5, scale: 2 }),
  chauri: decimal("chauri_percentage", { precision: 5, scale: 2 }), // Yak-cow crossbreed
  otherLivestockPercentage: decimal("other_livestock_percentage", {
    precision: 5,
    scale: 2,
  }),
  otherLivestockTypes: text("other_livestock_types"),
  annualFodderProductionKg: decimal("annual_fodder_production_kg", {
    precision: 12,
    scale: 2,
  }),

  // Beneficiaries
  beneficiaryHouseholdCount: integer("beneficiary_household_count"),
  beneficiaryPopulation: integer("beneficiary_population"),
  primaryUserGroups: text("primary_user_groups"),
  traditionalUsageRights: text("traditional_usage_rights"),
  indigenousPeopleDependence: text("indigenous_people_dependence"),
  livelihoodDependency: text("livelihood_dependency"),

  // Economic value
  economicValueNPR: decimal("economic_value_npr", { precision: 14, scale: 2 }),
  annualFodderValueNPR: decimal("annual_fodder_value_npr", {
    precision: 14,
    scale: 2,
  }),
  annualMedicinalHerbsValueNPR: decimal("annual_medicinal_herbs_value_npr", {
    precision: 14,
    scale: 2,
  }),
  annualEcotourismValueNPR: decimal("annual_ecotourism_value_npr", {
    precision: 14,
    scale: 2,
  }),
  otherEconomicBenefitsNPR: decimal("other_economic_benefits_npr", {
    precision: 14,
    scale: 2,
  }),
  otherEconomicBenefitDetails: text("other_economic_benefit_details"),

  // Conservation and improvement
  conservationStatus: text("conservation_status"),
  conservationMeasures: text("conservation_measures"),
  hasFireControlMeasures: boolean("has_fire_control_measures").default(false),
  fireControlMeasuresDetails: text("fire_control_measures_details"),
  improvementActivities: text("improvement_activities"),
  invasiveControlMeasures: text("invasive_control_measures"),
  seedingPractices: text("seeding_practices"),
  fencingStatus: text("fencing_status"),
  waterDevelopmentMeasures: text("water_development_measures"),
  fodderDevelopmentActivities: text("fodder_development_activities"),
  rotationalGrazingPracticed: boolean("rotational_grazing_practiced").default(
    false,
  ),
  rotationalGrazingDetails: text("rotational_grazing_details"),

  // Challenges and threats
  majorThreats: text("major_threats"),
  invasiveSpeciesThreats: text("invasive_species_threats"),
  naturalDisasterThreats: text("natural_disaster_threats"),
  landUseChangeThreats: text("land_use_change_threats"),
  climateChangeImpacts: text("climate_change_impacts"),
  conflictsEncountered: text("conflicts_encountered"),
  conflictResolutionMechanisms: text("conflict_resolution_mechanisms"),
  sustainabilityChallenges: text("sustainability_challenges"),

  // Scientific research
  researchConducted: boolean("research_conducted").default(false),
  researchDetails: text("research_details"),
  monitoringActivities: text("monitoring_activities"),
  traditionalKnowledge: text("traditional_knowledge"),
  documentedKnowledge: text("documented_knowledge"),

  // Future plans
  developmentPlans: text("development_plans"),
  sustainabilityPlans: text("sustainability_plans"),
  requiredSupport: text("required_support"),
  improvementPriorities: text("improvement_priorities"),
  futureThreats: text("future_threats"),

  // Cultural significance
  culturalImportance: text("cultural_importance"),
  spiritualSignificance: text("spiritual_significance"),
  traditionsPracticed: text("traditions_practiced"),
  festivalsCelebrated: text("festivals_celebrated"),
  historicalSignificance: text("historical_significance"),

  // Climate and environmental data
  annualRainfallMm: decimal("annual_rainfall_mm", { precision: 8, scale: 2 }),
  averageTemperatureC: decimal("average_temperature_c", {
    precision: 5,
    scale: 2,
  }),
  carbonSequestrationPotential: text("carbon_sequestration_potential"),
  watershedValue: text("watershed_value"),
  climateResilienceValue: text("climate_resilience_value"),
  environmentalSignificance: text("environmental_significance"),

  // Contact and management
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  managementContactEmail: text("management_contact_email"),
  nearestGovernmentOffice: text("nearest_government_office"),

  // Linkages to other entities
  linkedForestAreas: jsonb("linked_forest_areas").default(sql`'[]'::jsonb`),
  linkedWaterBodies: jsonb("linked_water_bodies").default(sql`'[]'::jsonb`),
  linkedSettlements: jsonb("linked_settlements").default(sql`'[]'::jsonb`),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  pastureArea: geometry("pasture_area", { type: "Polygon" }),
  trailsNetwork: geometry("trails_network", { type: "MultiLineString" }),
  waterSources: geometry("water_sources", { type: "MultiPoint" }),

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

export type NaturalPasture = typeof naturalPasture.$inferSelect;
export type NewNaturalPasture = typeof naturalPasture.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
