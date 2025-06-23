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
import { waterQualityEnum } from "../common";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define spring type enum
export const springTypeEnum = pgEnum("spring_type", [
  "GRAVITY_SPRING",
  "ARTESIAN_SPRING",
  "HOT_SPRING",
  "MINERAL_SPRING",
  "THERMAL_SPRING",
  "GEYSER",
  "SEEP",
  "KARST_SPRING",
  "CONTACT_SPRING",
  "FAULT_SPRING",
  "FRACTURE_SPRING",
  "DEPRESSION_SPRING",
  "OTHER",
]);

// Define spring flow consistency enum
export const springFlowConsistencyEnum = pgEnum("spring_flow_consistency", [
  "PERENNIAL", // Flows year-round
  "SEASONAL", // Flows only during certain seasons
  "INTERMITTENT", // Flows irregularly
  "EPHEMERAL", // Flows only after rainfall
  "VARIABLE", // Flow varies significantly
  "UNKNOWN",
]);

// Define current status enum
export const springStatusEnum = pgEnum("spring_status", [
  "FLOWING",
  "REDUCED_FLOW",
  "DRIED_UP",
  "CONTAMINATED",
  "PROTECTED",
  "DEVELOPED",
  "THREATENED",
  "RESTORED",
  "UNKNOWN",
]);

// Spring table
export const spring = pgTable("spring", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  nameInLocalLanguage: text("name_in_local_language"),
  description: text("description"),
  springType: springTypeEnum("spring_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  elevationM: decimal("elevation_m", { precision: 8, scale: 2 }),

  // Physical characteristics
  flowRateLitersPerMinute: decimal("flow_rate_liters_per_minute", {
    precision: 10,
    scale: 2,
  }),
  flowConsistency: springFlowConsistencyEnum("flow_consistency"),
  waterTemperatureC: decimal("water_temperature_c", { precision: 5, scale: 2 }),
  catchmentAreaSqKm: decimal("catchment_area_sq_km", {
    precision: 10,
    scale: 2,
  }),
  hasVisibleSource: boolean("has_visible_source").default(true),
  waterColor: text("water_color"),
  waterClarity: text("water_clarity"), // Clear, cloudy, turbid, etc.
  hasMineralContent: boolean("has_mineral_content").default(false),
  mineralContentDetails: text("mineral_content_details"),
  hasMedicinalProperties: boolean("has_medicinal_properties").default(false),
  medicinalPropertiesDetails: text("medicinal_properties_details"),

  // Environmental context
  surroundingEcosystem: text("surrounding_ecosystem"),
  surroundingVegetation: text("surrounding_vegetation"),
  geologicalFormation: text("geological_formation"),
  biodiversityNotes: text("biodiversity_notes"),
  associatedWildlife: text("associated_wildlife"),

  // Status and condition
  currentStatus: springStatusEnum("current_status"),
  waterQuality: waterQualityEnum("water_quality"),
  isWaterTested: boolean("is_water_tested").default(false),
  lastTestedDate: date("last_tested_date"),
  waterTestResults: text("water_test_results"),
  contaminationIssues: text("contamination_issues"),
  environmentalThreats: text("environmental_threats"),

  // Development and infrastructure
  isProtected: boolean("is_protected").default(false),
  protectionMethod: text("protection_method"),
  hasTapSystem: boolean("has_tap_system").default(false),
  tapSystemDetails: text("tap_system_details"),
  hasWaterCollection: boolean("has_water_collection").default(false),
  collectionStructure: text("collection_structure"),
  hasDistributionSystem: boolean("has_distribution_system").default(false),
  distributionSystemDetails: text("distribution_system_details"),

  // Usage and importance
  primaryUsage: text("primary_usage"), // Drinking, irrigation, ritual, etc.
  estimatedBeneficiaries: integer("estimated_beneficiaries"),
  householdsServed: integer("households_served"),
  isUsedForDrinking: boolean("is_used_for_drinking").default(true),
  isUsedForIrrigation: boolean("is_used_for_irrigation").default(false),
  irrigationAreaHectares: decimal("irrigation_area_hectares", {
    precision: 10,
    scale: 2,
  }),
  isUsedForLivestock: boolean("is_used_for_livestock").default(false),
  isUsedForReligious: boolean("is_used_for_religious").default(false),
  religiousSignificance: text("religious_significance"),
  culturalImportance: text("cultural_importance"),

  // Management and governance
  managedBy: text("managed_by"), // Who manages the spring
  managementSystem: text("management_system"),
  hasWaterUserCommittee: boolean("has_water_user_committee").default(false),
  waterUserCommitteeDetails: text("water_user_committee_details"),
  hasFees: boolean("has_fees").default(false),
  feeStructure: text("fee_structure"),

  // Restoration and conservation
  restorationEfforts: text("restoration_efforts"),
  restorationDate: date("restoration_date"),
  restorationOrganization: text("restoration_organization"),
  conservationMeasures: text("conservation_measures"),
  hasLocalRegulations: boolean("has_local_regulations").default(false),
  localRegulationsDetails: text("local_regulations_details"),

  // Accessibility and facilities
  accessibilityNotes: text("accessibility_notes"),
  distanceFromNearestRoadKm: decimal("distance_from_nearest_road_km", {
    precision: 6,
    scale: 2,
  }),
  hasAccessPath: boolean("has_access_path").default(true),
  accessPathCondition: text("access_path_condition"),
  hasRestingPlace: boolean("has_resting_place").default(false),
  hasSanitationFacilities: boolean("has_sanitation_facilities").default(false),

  // Historical aspects
  historicalNotes: text("historical_notes"),
  estimatedAgeYears: integer("estimated_age_years"),
  hasTraditionalKnowledge: boolean("has_traditional_knowledge").default(false),
  traditionalKnowledgeDetails: text("traditional_knowledge_details"),
  localMyths: text("local_myths"),

  // Climate and seasonal factors
  seasonalVariations: text("seasonal_variations"),
  rainfallDependency: text("rainfall_dependency"),
  affectedByClimateChange: boolean("affected_by_climate_change").default(false),
  climateChangeImpacts: text("climate_change_impacts"),

  // Monitoring and research
  hasMonitoringSystem: boolean("has_monitoring_system").default(false),
  monitoringFrequency: text("monitoring_frequency"),
  monitoringOrganization: text("monitoring_organization"),
  researchConducted: boolean("research_conducted").default(false),
  researchDetails: text("research_details"),

  // Community engagement
  communityInvolvement: text("community_involvement"),
  awarenessPrograms: text("awareness_programs"),
  localPractices: text("local_practices"),

  // Ownership and legal status
  ownershipType: text("ownership_type"), // Public, private, community, etc.
  legalProtectionStatus: text("legal_protection_status"),
  protectionDate: date("protection_date"),
  governmentRecognition: boolean("government_recognition").default(false),

  // Future plans
  developmentPlans: text("development_plans"),
  conservationPlans: text("conservation_plans"),

  // Contact information
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  alternateContactPerson: text("alternate_contact_person"),
  alternateContactPhone: text("alternate_contact_phone"),

  // Media and documentation
  hasPhotos: boolean("has_photos").default(false),
  hasVideoDocumentation: boolean("has_video_documentation").default(false),
  hasScientificStudies: boolean("has_scientific_studies").default(false),

  // Linkages to other entities
  linkedWaterSystems: jsonb("linked_water_systems").default(sql`'[]'::jsonb`),
  linkedCommunities: jsonb("linked_communities").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  catchmentArea: geometry("catchment_area", { type: "Polygon" }),

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

export type Spring = typeof spring.$inferSelect;
export type NewSpring = typeof spring.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
