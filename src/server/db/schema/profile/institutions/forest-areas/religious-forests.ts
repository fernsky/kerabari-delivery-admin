import { pgTable } from "../../../../schema/basic";
import {
  integer,
  timestamp,
  varchar,
  text,
  boolean,
  decimal,
  jsonb,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";
import {
  forestConditionEnum,
  forestManagementStatusEnum,
  biodiversityLevelEnum,
  fireRiskLevelEnum,
  forestDensityEnum,
  topographyTypeEnum,
  ecosystemTypeEnum,
  forestAccessibilityEnum,
  landTenureEnum,
} from "./common";

// Define religious significance enum
export const forestReligiousSignificanceEnum = pgEnum(
  "forest_religious_significance",
  ["EXTREMELY_HIGH", "HIGH", "MODERATE", "LOW"],
);

// Define religious forest type enum
export const religiousForestTypeEnum = pgEnum("religious_forest_type", [
  "TEMPLE_FOREST",
  "MONASTERY_FOREST",
  "SACRED_GROVE",
  "CREMATION_SITE",
  "CHURCH_FOREST",
  "MOSQUE_FOREST",
  "PILGRIMAGE_SITE",
  "HISTORICAL_RELIGIOUS_SITE",
  "OTHER",
]);

// Religious Forest table
export const religiousForest = pgTable("religious_forest", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // General location name
  address: text("address"),

  // Religious details
  religiousForestType: religiousForestTypeEnum(
    "religious_forest_type",
  ).notNull(),
  associatedReligion: text("associated_religion"), // Hinduism, Buddhism, etc.
  religiousSignificance: forestReligiousSignificanceEnum(
    "religious_significance",
  ),
  religiousSignificanceDetails: text("religious_significance_details"),
  associatedDeity: text("associated_deity"),
  religiousPractices: text("religious_practices"),
  religiousHistoryDetails: text("religious_history_details"),
  historicalPeriod: text("historical_period"),
  estimatedAge: text("estimated_age"),
  annualFestivalsCount: integer("annual_festivals_count"),
  majorFestivalsDetails: text("major_festivals_details"),
  pilgrimageImportance: text("pilgrimage_importance"),
  annualVisitorsCount: integer("annual_visitors_count"),
  peakVisitationPeriods: text("peak_visitation_periods"),
  religiousStructuresPresent: boolean("religious_structures_present").default(
    false,
  ),
  religiousStructuresDetails: text("religious_structures_details"),

  // Registration and management details
  registrationNumber: varchar("registration_number", { length: 50 }),
  registrationDate: date("registration_date"),
  handoverDate: date("handover_date"), // Date when forest was handed over to religious institution
  registeredWithOffice: text("registered_with_office"),
  certificateNumber: varchar("certificate_number", { length: 50 }),
  hasManagementPlan: boolean("has_management_plan").default(false),
  managementPlanPeriod: text("management_plan_period"), // E.g., "2020-2030"

  // Management group details
  managingInstitution: text("managing_institution"), // Temple, monastery, etc.
  managementCommitteeExists: boolean("management_committee_exists").default(
    true,
  ),
  managementCommitteeSize: integer("management_committee_size"),
  chairpersonName: text("chairperson_name"),
  secretaryName: text("secretary_name"),
  religiousLeaderName: text("religious_leader_name"),
  religiousLeaderTitle: text("religious_leader_title"),
  managementCommitteeFormationDate: date("management_committee_formation_date"),

  // Forest details
  totalAreaHectares: decimal("total_area_hectares", {
    precision: 10,
    scale: 2,
  }),
  forestCoveragePercent: decimal("forest_coverage_percent", {
    precision: 5,
    scale: 2,
  }),
  openAreaPercent: decimal("open_area_percent", { precision: 5, scale: 2 }),
  forestCondition: forestConditionEnum("forest_condition"),
  forestDensity: forestDensityEnum("forest_density"),
  forestManagementStatus: forestManagementStatusEnum(
    "forest_management_status",
  ),
  forestType: text("forest_type"), // Natural, planted, mixed
  forestEstablishmentYear: integer("forest_establishment_year"),
  biodiversityLevel: biodiversityLevelEnum("biodiversity_level"),
  fireRiskLevel: fireRiskLevelEnum("fire_risk_level"),

  // Topography and ecosystem
  elevationRangeMeters: text("elevation_range_meters"), // E.g., "500-1200"
  slopePercent: decimal("slope_percent", { precision: 5, scale: 2 }),
  aspectDirection: text("aspect_direction"), // E.g., "North-facing", "South-facing"
  topography: topographyTypeEnum("topography"),
  soilType: text("soil_type"),
  ecosystemType: ecosystemTypeEnum("ecosystem_type"),
  watershedName: text("watershed_name"),
  nearestWaterBodyName: text("nearest_water_body_name"),
  distanceToWaterBodyKm: decimal("distance_to_water_body_km", {
    precision: 6,
    scale: 2,
  }),

  // Flora and fauna
  dominantTreeSpecies: jsonb("dominant_tree_species").default(sql`'[]'::jsonb`),
  dominantShrubSpecies: jsonb("dominant_shrub_species").default(
    sql`'[]'::jsonb`,
  ),
  nativeSpeciesCount: integer("native_species_count"),
  invasiveSpeciesCount: integer("invasive_species_count"),
  invasiveSpeciesNames: jsonb("invasive_species_names").default(
    sql`'[]'::jsonb`,
  ),
  medicinalPlantSpeciesCount: integer("medicinal_plant_species_count"),
  notableMedicinalPlants: jsonb("notable_medicinal_plants").default(
    sql`'[]'::jsonb`,
  ),
  sacredPlantSpecies: jsonb("sacred_plant_species").default(sql`'[]'::jsonb`),
  endangeredFloraCount: integer("endangered_flora_count"),
  endangeredFaunaCount: integer("endangered_fauna_count"),
  wildlifePresent: jsonb("wildlife_present").default(sql`'[]'::jsonb`),
  sacredAnimalSpecies: jsonb("sacred_animal_species").default(sql`'[]'::jsonb`),

  // Sacred areas within forest
  hasSacredGroves: boolean("has_sacred_groves").default(false),
  sacredGrovesDetails: text("sacred_groves_details"),
  hasSacredTrees: boolean("has_sacred_trees").default(false),
  sacredTreesDetails: text("sacred_trees_details"),
  hasSacredWaterBodies: boolean("has_sacred_water_bodies").default(false),
  sacredWaterBodiesDetails: text("sacred_water_bodies_details"),
  hasPrayerSites: boolean("has_prayer_sites").default(false),
  prayerSitesDetails: text("prayer_sites_details"),

  // Cultural and traditional practices
  traditionalPractices: text("traditional_practices"),
  culturalImportance: text("cultural_importance"),
  communityInvolvement: text("community_involvement"),
  localBeliefSystems: text("local_belief_systems"),
  ritualsPerformed: text("rituals_performed"),

  // Conservation status
  conservationStatus: text("conservation_status"),
  conservationMeasures: text("conservation_measures"),
  hasProtectedSpecies: boolean("has_protected_species").default(false),
  protectedSpeciesDetails: text("protected_species_details"),
  restrictionsOnResourceUse: text("restrictions_on_resource_use"),
  hasTaboos: boolean("has_taboos").default(true),
  taboosDetails: text("taboos_details"),

  // Harvesting and utilization
  allowsHarvesting: boolean("allows_harvesting").default(false),
  harvestingRestrictions: text("harvesting_restrictions"),
  allowedHarvestProducts: jsonb("allowed_harvest_products").default(
    sql`'[]'::jsonb`,
  ),
  harvestingForReligiousPurposes: boolean(
    "harvesting_for_religious_purposes",
  ).default(true),
  harvestingForReligiousPurposesDetails: text(
    "harvesting_for_religious_purposes_details",
  ),

  // Financial aspects
  hasDedicatedFund: boolean("has_dedicated_fund").default(false),
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 14, scale: 2 }),
  fundingSourcesDetails: text("funding_sources_details"),
  hasDonotionBox: boolean("has_donation_box").default(true),
  estimatedAnnualDonationsNPR: decimal("estimated_annual_donations_npr", {
    precision: 14,
    scale: 2,
  }),

  // Forest management activities
  hasSilviculturalActivities: boolean("has_silvicultural_activities").default(
    false,
  ),
  silviculturalActivitiesDetails: text("silvicultural_activities_details"),
  hasPlantationActivities: boolean("has_plantation_activities").default(false),
  plantationAreaHectares: decimal("plantation_area_hectares", {
    precision: 10,
    scale: 2,
  }),
  plantationYear: integer("plantation_year"),
  plantedSpecies: jsonb("planted_species").default(sql`'[]'::jsonb`),

  // Conservation and protection
  hasFireProtectionMeasures: boolean("has_fire_protection_measures").default(
    false,
  ),
  fireProtectionDetails: text("fire_protection_details"),
  employesForestGuards: boolean("employs_forest_guards").default(false),
  forestGuardCount: integer("forest_guard_count"),
  hasBoundaryFencing: boolean("has_boundary_fencing").default(false),
  boundaryFencingType: text("boundary_fencing_type"),

  // Threats and challenges
  majorThreats: jsonb("major_threats").default(sql`'[]'::jsonb`),
  encroachmentIssues: boolean("encroachment_issues").default(false),
  encroachmentDetails: text("encroachment_details"),
  illegalActivitiesReported: boolean("illegal_activities_reported").default(
    false,
  ),
  illegalActivitiesDetails: text("illegal_activities_details"),

  // External support and coordination
  receivesGovernmentSupport: boolean("receives_government_support").default(
    false,
  ),
  governmentSupportDetails: text("government_support_details"),
  receivesNgoSupport: boolean("receives_ngo_support").default(false),
  ngoSupportDetails: text("ngo_support_details"),

  // Research and documentation
  hasResearchStudies: boolean("has_research_studies").default(false),
  researchStudyDetails: text("research_study_details"),
  hasDocumentedHistory: boolean("has_documented_history").default(false),
  documentedHistoryDetails: text("documented_history_details"),
  hasDigitizedRecords: boolean("has_digitized_records").default(false),

  // Tourism aspects
  promotedAsTouristDestination: boolean(
    "promoted_as_tourist_destination",
  ).default(false),
  annualTouristCount: integer("annual_tourist_count"),
  hasTouristFacilities: boolean("has_tourist_facilities").default(false),
  touristFacilitiesDetails: text("tourist_facilities_details"),
  tourismImpacts: text("tourism_impacts"),

  // Accessibility
  accessibility: forestAccessibilityEnum("accessibility"),
  distanceFromRoadKm: decimal("distance_from_road_km", {
    precision: 6,
    scale: 2,
  }),
  distanceFromSettlementKm: decimal("distance_from_settlement_km", {
    precision: 6,
    scale: 2,
  }),
  publicTransportAvailability: boolean("public_transport_availability").default(
    false,
  ),
  accessRestrictionsDetails: text("access_restrictions_details"),

  // Contact information
  contactPersonName: text("contact_person_name"),
  contactPersonRole: text("contact_person_role"),
  contactPhone: text("contact_phone"),
  alternateContactPhone: text("alternate_contact_phone"),
  emailAddress: text("email_address"),

  // Tenure and boundaries
  landTenure: landTenureEnum("land_tenure"),
  hasBoundaryDisputes: boolean("has_boundary_disputes").default(false),
  boundaryDisputeDetails: text("boundary_dispute_details"),
  hasBoundaryMarkers: boolean("has_boundary_markers").default(false),
  boundaryMarkerType: text("boundary_marker_type"),

  // Linkages to other entities
  linkedReligiousInstitutions: jsonb("linked_religious_institutions").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedSettlements: jsonb("linked_settlements").default(sql`'[]'::jsonb`),
  linkedWaterbodies: jsonb("linked_waterbodies").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  forestBoundary: geometry("forest_boundary", { type: "MultiPolygon" }),
  sacredSites: geometry("sacred_sites", { type: "MultiPoint" }),
  accessPoints: geometry("access_points", { type: "MultiPoint" }),

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

export type ReligiousForest = typeof religiousForest.$inferSelect;
export type NewReligiousForest = typeof religiousForest.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
