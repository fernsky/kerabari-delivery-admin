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
  biodiversityLevelEnum,
  fireRiskLevelEnum,
  forestDensityEnum,
  topographyTypeEnum,
  ecosystemTypeEnum,
} from "./common";

// Define protected area type enum
export const protectedAreaTypeEnum = pgEnum("protected_area_type", [
  "NATIONAL_PARK",
  "WILDLIFE_RESERVE",
  "CONSERVATION_AREA",
  "STRICT_NATURE_RESERVE",
  "PROTECTED_FOREST",
  "NATURAL_MONUMENT",
  "WATERSHED_PROTECTION_AREA",
  "RAMSAR_SITE",
  "WORLD_HERITAGE_SITE",
  "OTHER",
]);

// Define management authority enum
export const managementAuthorityEnum = pgEnum("management_authority", [
  "DEPARTMENT_OF_NATIONAL_PARKS",
  "MINISTRY_OF_FORESTS",
  "PROVINCIAL_GOVERNMENT",
  "LOCAL_GOVERNMENT",
  "CONSERVATION_TRUST",
  "JOINT_MANAGEMENT",
  "INTERNATIONAL_BODY",
  "MILITARY",
  "OTHER",
]);

// Define protection status enum
export const protectionStatusEnum = pgEnum("protection_status", [
  "STRICTLY_PROTECTED",
  "MEDIUM_PROTECTION",
  "LOW_PROTECTION",
  "SEASONAL_PROTECTION",
  "MIXED_PROTECTION",
  "UNDER_REVIEW",
]);

// Protected Area table
export const protectedArea = pgTable("protected_area", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  areaType: protectedAreaTypeEnum("area_type").notNull(),

  // Location and boundary details
  province: text("province"),
  district: text("district"),
  municipality: text("municipality"),
  wardNumbers: jsonb("ward_numbers").default(sql`'[]'::jsonb`),
  nearestSettlement: text("nearest_settlement"),
  totalAreaHectares: decimal("total_area_hectares", {
    precision: 12,
    scale: 2,
  }).notNull(),
  boundaryDescription: text("boundary_description"),
  isGpsMarked: boolean("is_gps_marked").default(false),
  hasDemarcationPillars: boolean("has_demarcation_pillars").default(false),
  pillarCount: integer("pillar_count"),

  // Administration details
  establishmentYear: integer("establishment_year"),
  legalStatus: text("legal_status"),
  gazetteNotificationDate: date("gazette_notification_date"),
  gazetteReference: text("gazette_reference"),
  managementAuthority: managementAuthorityEnum("management_authority"),
  managingOfficeLocation: text("managing_office_location"),
  protectionStatus: protectionStatusEnum("protection_status"),
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 14, scale: 2 }),
  hasDedicatedStaff: boolean("has_dedicated_staff").default(true),
  staffCount: integer("staff_count"),
  rangerCount: integer("ranger_count"),

  // Ecological characteristics
  biodiversityLevel: biodiversityLevelEnum("biodiversity_level"),
  ecosystemType: ecosystemTypeEnum("ecosystem_type"),
  forestDensity: forestDensityEnum("forest_density"),
  topographyType: topographyTypeEnum("topography_type"),
  elevationRangeLow: decimal("elevation_range_low", { precision: 8, scale: 2 }),
  elevationRangeHigh: decimal("elevation_range_high", {
    precision: 8,
    scale: 2,
  }),
  majorVegetationTypes: text("major_vegetation_types"),
  keyFloraSpecies: text("key_flora_species"),
  keyFaunaSpecies: text("key_fauna_species"),
  endangeredSpeciesCount: integer("endangered_species_count"),
  watershedArea: boolean("watershed_area").default(false),
  watershedDetails: text("watershed_details"),

  // Management and infrastructure
  hasManagementPlan: boolean("has_management_plan").default(false),
  managementPlanPeriod: text("management_plan_period"),
  zonationSystem: boolean("zonation_system").default(false),
  zonationDetails: text("zonation_details"),
  hasVisitorCenter: boolean("has_visitor_center").default(false),
  hasInterpretationCenter: boolean("has_interpretation_center").default(false),
  hasRangerPosts: boolean("has_ranger_posts").default(false),
  rangerPostCount: integer("ranger_post_count"),
  hasWatchTowers: boolean("has_watch_towers").default(false),
  watchTowerCount: integer("watch_tower_count"),
  hasFirelines: boolean("has_firelines").default(false),
  firelineKilometers: decimal("fireline_kilometers", {
    precision: 8,
    scale: 2,
  }),
  fireRiskLevel: fireRiskLevelEnum("fire_risk_level"),
  firePrevention: text("fire_prevention"),
  fireIncidentsFiveYears: integer("fire_incidents_five_years"),
  hasPatrollingSystem: boolean("has_patrolling_system").default(true),
  patrollingFrequency: text("patrolling_frequency"),

  // Research and monitoring
  hasResearchProgram: boolean("has_research_program").default(false),
  currentResearchProjects: text("current_research_projects"),
  hasMonitoringSystem: boolean("has_monitoring_system").default(false),
  monitoringParameters: text("monitoring_parameters"),
  researchCollaborators: text("research_collaborators"),
  hasWildlifeMonitoring: boolean("has_wildlife_monitoring").default(false),

  // Tourism and visitor management
  isOpenForTourism: boolean("is_open_for_tourism").default(true),
  annualVisitorCount: integer("annual_visitor_count"),
  entryFeeNPR: decimal("entry_fee_npr", { precision: 8, scale: 2 }),
  foreignVisitorCharge: decimal("foreign_visitor_charge", {
    precision: 8,
    scale: 2,
  }),
  tourismInfrastructure: text("tourism_infrastructure"),
  hasDesignatedTrails: boolean("has_designated_trails").default(false),
  trailKilometers: decimal("trail_kilometers", { precision: 8, scale: 2 }),

  // Local communities and conservation
  bufferZoneAreaHectares: decimal("buffer_zone_area_hectares", {
    precision: 12,
    scale: 2,
  }),
  hasBufferZoneManagement: boolean("has_buffer_zone_management").default(false),
  bufferZoneManagementDetails: text("buffer_zone_management_details"),
  communityInvolvement: text("community_involvement"),
  localCommunitiesCount: integer("local_communities_count"),
  hasBenefitSharingMechanism: boolean("has_benefit_sharing_mechanism").default(
    false,
  ),
  benefitSharingDetails: text("benefit_sharing_details"),
  hasConflictWithCommunities: boolean("has_conflict_with_communities").default(
    false,
  ),
  conflictNature: text("conflict_nature"),

  // Conservation threats and challenges
  majorThreats: text("major_threats"),
  encroachmentLevel: text("encroachment_level"),
  illegalLoggingCases: integer("illegal_logging_cases"),
  poachingIncidents: integer("poaching_incidents"),
  humanWildlifeConflictIncidents: integer("human_wildlife_conflict_incidents"),
  conservationChallenges: text("conservation_challenges"),

  // Climate change and adaptation
  climateChangeImpacts: text("climate_change_impacts"),
  adaptationMeasures: text("adaptation_measures"),
  carbonSequestrationData: text("carbon_sequestration_data"),
  hasREDDPlus: boolean("has_redd_plus").default(false),

  // International status
  hasInternationalDesignation: boolean("has_international_designation").default(
    false,
  ),
  iucnCategory: text("iucn_category"),
  worldHeritageStatus: boolean("world_heritage_status").default(false),
  ramsarStatus: boolean("ramsar_status").default(false),
  biosphereReserveStatus: boolean("biosphere_reserve_status").default(false),
  internationalDesignationDetails: text("international_designation_details"),
  designationYear: integer("designation_year"),

  // Future plans and notes
  expansionPlans: text("expansion_plans"),
  conservationPlans: text("conservation_plans"),
  researchPriorities: text("research_priorities"),
  additionalNotes: text("additional_notes"),

  // Contact information
  officeName: text("office_name"),
  officeAddress: text("office_address"),
  contactPerson: text("contact_person"),
  contactPersonTitle: text("contact_person_title"),
  phoneNumber: text("phone_number"),
  emailAddress: text("email_address"),
  websiteUrl: text("website_url"),

  // Linkages to other entities
  linkedMunicipalities: jsonb("linked_municipalities").default(
    sql`'[]'::jsonb`,
  ),
  linkedWaterBodies: jsonb("linked_water_bodies").default(sql`'[]'::jsonb`),
  linkedForestAreas: jsonb("linked_forest_areas").default(sql`'[]'::jsonb`),
  linkedBufferZones: jsonb("linked_buffer_zones").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  boundaryPolygon: geometry("boundary_polygon", { type: "MultiPolygon" }),

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

export type ProtectedArea = typeof protectedArea.$inferSelect;
export type NewProtectedArea = typeof protectedArea.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
