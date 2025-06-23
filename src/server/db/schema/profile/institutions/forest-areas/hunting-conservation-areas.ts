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

// Define hunting conservation area type enum
export const huntingAreaTypeEnum = pgEnum("hunting_area_type", [
  "CONTROLLED_HUNTING_AREA",
  "TROPHY_HUNTING_SITE",
  "GAME_RESERVE",
  "HUNTING_CONCESSION",
  "MIXED_USE_CONSERVATION_AREA",
  "OTHER",
]);

// Define hunting management enum
export const huntingManagementEnum = pgEnum("hunting_management", [
  "GOVERNMENT_MANAGED",
  "COMMUNITY_MANAGED",
  "PRIVATE_OPERATOR",
  "JOINT_MANAGEMENT",
  "NGO_MANAGED",
  "OTHER",
]);

// Define hunting season enum
export const huntingSeasonEnum = pgEnum("hunting_season", [
  "YEAR_ROUND",
  "SEASONAL",
  "LIMITED_PERIOD",
  "ROTATING",
  "QUOTA_BASED",
  "CLOSED",
]);

// Hunting Conservation Area table
export const huntingConservationArea = pgTable("hunting_conservation_area", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  areaType: huntingAreaTypeEnum("area_type").notNull(),

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
  hasDemarcationMarkers: boolean("has_demarcation_markers").default(false),
  markerCount: integer("marker_count"),

  // Administration and management
  establishmentYear: integer("establishment_year"),
  legalStatus: text("legal_status"),
  gazetteNotificationDate: date("gazette_notification_date"),
  gazetteReference: text("gazette_reference"),
  managementType: huntingManagementEnum("management_type"),
  managingEntityName: text("managing_entity_name"),
  managingOfficeLocation: text("managing_office_location"),
  concessionPeriodYears: integer("concession_period_years"),
  concessionStartDate: date("concession_start_date"),
  concessionEndDate: date("concession_end_date"),
  annualRevenueNPR: decimal("annual_revenue_npr", { precision: 14, scale: 2 }),
  annualOperatingBudgetNPR: decimal("annual_operating_budget_npr", {
    precision: 14,
    scale: 2,
  }),
  staffCount: integer("staff_count"),
  gameWardenCount: integer("game_warden_count"),

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
  majorWildlifeSpecies: text("major_wildlife_species"),
  endangeredSpeciesPresent: boolean("endangered_species_present").default(
    false,
  ),
  endangeredSpeciesList: text("endangered_species_list"),

  // Hunting information
  huntingSeason: huntingSeasonEnum("hunting_season"),
  seasonStartMonth: text("season_start_month"),
  seasonEndMonth: text("season_end_month"),
  huntingDaysPerYear: integer("hunting_days_per_year"),
  allowedHuntingMethods: text("allowed_hunting_methods"),
  prohibitedHuntingMethods: text("prohibited_hunting_methods"),
  permitSystem: boolean("permit_system").default(true),
  permitIssuingAuthority: text("permit_issuing_authority"),
  localHuntingPermitFeeNPR: decimal("local_hunting_permit_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  foreignHuntingPermitFeeNPR: decimal("foreign_hunting_permit_fee_npr", {
    precision: 10,
    scale: 2,
  }),

  // Game and species management
  targetSpeciesList: text("target_species_list"),
  annualHarvestQuota: jsonb("annual_harvest_quota").default(sql`'{}'::jsonb`),
  hasAnnualGameCount: boolean("has_annual_game_count").default(false),
  lastGameCountDate: date("last_game_count_date"),
  majorGamePopulationTrends: text("major_game_population_trends"),
  hasSpeciesManagementPlan: boolean("has_species_management_plan").default(
    false,
  ),
  speciesIntroduced: boolean("species_introduced").default(false),
  introducedSpeciesList: text("introduced_species_list"),
  trophyHandlingProcedures: text("trophy_handling_procedures"),
  taxidermyFacilities: boolean("taxidermy_facilities").default(false),

  // Infrastructure and facilities
  hasManagementPlan: boolean("has_management_plan").default(false),
  managementPlanPeriod: text("management_plan_period"),
  hasHuntingCamps: boolean("has_hunting_camps").default(false),
  huntingCampCount: integer("hunting_camp_count"),
  huntingCampCapacity: integer("hunting_camp_capacity"),
  hasLodgeFacilities: boolean("has_lodge_facilities").default(false),
  lodgeCapacity: integer("lodge_capacity"),
  hasRoads: boolean("has_roads").default(false),
  roadKilometers: decimal("road_kilometers", { precision: 8, scale: 2 }),
  hasWatchTowers: boolean("has_watch_towers").default(false),
  watchTowerCount: integer("watch_tower_count"),
  hasTrackingFacilities: boolean("has_tracking_facilities").default(false),
  hasGuideFacilities: boolean("has_guide_facilities").default(false),
  guideCount: integer("guide_count"),
  hasShootingRanges: boolean("has_shooting_ranges").default(false),
  fireRiskLevel: fireRiskLevelEnum("fire_risk_level"),

  // Tourism and non-hunting activities
  allowsNonHuntingTourism: boolean("allows_non_hunting_tourism").default(false),
  nonHuntingActivities: text("non_hunting_activities"),
  photoTourismFacilities: text("photo_tourism_facilities"),
  annualVisitorCount: integer("annual_visitor_count"),
  visitorFacilities: text("visitor_facilities"),

  // Conservation and sustainability
  sustainabilityMeasures: text("sustainability_measures"),
  habitatManagementPractices: text("habitat_management_practices"),
  conservationProjects: text("conservation_projects"),
  populationMonitoringMethods: text("population_monitoring_methods"),
  illegalHuntingPreventionMeasures: text("illegal_hunting_prevention_measures"),
  poachingIncidents: integer("poaching_incidents"),
  hasConservationFund: boolean("has_conservation_fund").default(false),
  conservationFundDetails: text("conservation_fund_details"),

  // Local communities and benefits
  localCommunityInvolvement: text("local_community_involvement"),
  communityBenefitSharingPercent: decimal("community_benefit_sharing_percent", {
    precision: 5,
    scale: 2,
  }),
  localEmploymentCount: integer("local_employment_count"),
  hasConflictWithCommunities: boolean("has_conflict_with_communities").default(
    false,
  ),
  conflictNature: text("conflict_nature"),
  conflictResolutionMechanisms: text("conflict_resolution_mechanisms"),

  // Research and monitoring
  hasResearchProgram: boolean("has_research_program").default(false),
  currentResearchProjects: text("current_research_projects"),
  hasMonitoringSystem: boolean("has_monitoring_system").default(false),
  monitoringParameters: text("monitoring_parameters"),
  researchCollaborators: text("research_collaborators"),
  publicationsList: text("publications_list"),

  // Challenges and future plans
  majorChallenges: text("major_challenges"),
  futureManagementPlans: text("future_management_plans"),
  expansionPlans: boolean("expansion_plans").default(false),
  expansionDetails: text("expansion_details"),
  sustainabilityIssues: text("sustainability_issues"),

  // Certification and standards
  hasCertification: boolean("has_certification").default(false),
  certificationTypes: text("certification_types"),
  internationalStandardsCompliance: text("international_standards_compliance"),
  sustainablePracticesRating: text("sustainable_practices_rating"),

  // Contact information
  officeName: text("office_name"),
  officeAddress: text("office_address"),
  contactPerson: text("contact_person"),
  contactPersonTitle: text("contact_person_title"),
  phoneNumber: text("phone_number"),
  emailAddress: text("email_address"),
  websiteUrl: text("website_url"),
  bookingInformation: text("booking_information"),

  // Linkages to other entities
  linkedProtectedAreas: jsonb("linked_protected_areas").default(
    sql`'[]'::jsonb`,
  ),
  linkedForestAreas: jsonb("linked_forest_areas").default(sql`'[]'::jsonb`),
  linkedWaterBodies: jsonb("linked_water_bodies").default(sql`'[]'::jsonb`),
  linkedTourismServices: jsonb("linked_tourism_services").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  boundaryPolygon: geometry("boundary_polygon", { type: "MultiPolygon" }),
  huntingZones: geometry("hunting_zones", { type: "MultiPolygon" }),
  facilitiesLocations: geometry("facilities_locations", { type: "MultiPoint" }),

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

export type HuntingConservationArea =
  typeof huntingConservationArea.$inferSelect;
export type NewHuntingConservationArea =
  typeof huntingConservationArea.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
