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

// Define fire incident type enum
export const fireIncidentTypeEnum = pgEnum("fire_incident_type", [
  "RESIDENTIAL_FIRE",
  "COMMERCIAL_FIRE",
  "INDUSTRIAL_FIRE",
  "FOREST_FIRE",
  "VEHICLE_FIRE",
  "ELECTRICAL_FIRE",
  "GAS_LEAKAGE_FIRE",
  "KITCHEN_FIRE",
  "STORAGE_FACILITY_FIRE",
  "PUBLIC_BUILDING_FIRE",
  "RELIGIOUS_BUILDING_FIRE",
  "OTHER",
]);

// Define fire incident severity enum
export const fireIncidentSeverityEnum = pgEnum("fire_incident_severity", [
  "MINOR",
  "MODERATE",
  "MAJOR",
  "CATASTROPHIC",
]);

// Fire Incident table
export const fireIncident = pgTable("fire_incident", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  incidentType: fireIncidentTypeEnum("incident_type").notNull(),
  severity: fireIncidentSeverityEnum("severity").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Temporal information
  incidentDate: date("incident_date").notNull(),
  incidentTime: timestamp("incident_time"),
  reportedTime: timestamp("reported_time"),
  responseTime: timestamp("response_time"),
  containedTime: timestamp("contained_time"),
  extinguishedTime: timestamp("extinguished_time"),

  // Incident details
  incidentDescription: text("incident_description"),
  probableCause: text("probable_cause"),
  fireSource: text("fire_source"),
  affectedAreaSqm: decimal("affected_area_sqm", { precision: 10, scale: 2 }),

  // Impact assessment
  casualtiesCount: integer("casualties_count").default(0),
  injuriesCount: integer("injuries_count").default(0),
  missingCount: integer("missing_count").default(0),
  affectedFamiliesCount: integer("affected_families_count").default(0),
  affectedPopulationCount: integer("affected_population_count").default(0),
  displacedCount: integer("displaced_count").default(0),
  animalsLostCount: integer("animals_lost_count").default(0),

  // Damage assessment
  propertyDamageDescription: text("property_damage_description"),
  estimatedLossNPR: decimal("estimated_loss_npr", { precision: 14, scale: 2 }),
  residentialStructuresDamaged: integer(
    "residential_structures_damaged",
  ).default(0),
  commercialStructuresDamaged: integer("commercial_structures_damaged").default(
    0,
  ),
  publicBuildingsDamaged: integer("public_buildings_damaged").default(0),
  vehiclesDamaged: integer("vehicles_damaged").default(0),
  infrastructureDamageDetails: text("infrastructure_damage_details"),

  // Response details
  responseAgencies: jsonb("response_agencies").default(sql`'[]'::jsonb`),
  fireFightersDeployed: integer("fire_fighters_deployed").default(0),
  fireEnginesDeployed: integer("fire_engines_deployed").default(0),
  waterTankersUsed: integer("water_tankers_used").default(0),
  policeForcesDeployed: integer("police_forces_deployed").default(0),
  ambulancesDeployed: integer("ambulances_deployed").default(0),
  rescueTeamsDeployed: integer("rescue_teams_deployed").default(0),
  volunteerCount: integer("volunteer_count").default(0),
  responseDescription: text("response_description"),
  waterSourcesUsed: text("water_sources_used"),
  specialEquipmentUsed: text("special_equipment_used"),

  // Evacuation details
  evacuationRequired: boolean("evacuation_required").default(false),
  evacuationDetails: text("evacuation_details"),
  evacuationCenterUsed: boolean("evacuation_center_used").default(false),
  evacuationCenterDetails: text("evacuation_center_details"),

  // Relief and recovery
  reliefProvidedDescription: text("relief_provided_description"),
  reliefAgencies: jsonb("relief_agencies").default(sql`'[]'::jsonb`),
  compensationProvidedNPR: decimal("compensation_provided_npr", {
    precision: 14,
    scale: 2,
  }),
  rehabilitationMeasures: text("rehabilitation_measures"),
  recoveryStatus: text("recovery_status"),

  // Challenges faced
  responseDelayFactors: text("response_delay_factors"),
  waterSupplyChallenges: text("water_supply_challenges"),
  accessChallenges: text("access_challenges"),
  otherChallenges: text("other_challenges"),

  // Lessons and prevention
  lessonsLearned: text("lessons_learned"),
  recommendedPreventions: text("recommended_preventions"),
  followUpActions: text("follow_up_actions"),

  // Insurance and legal
  wasInsured: boolean("was_insured").default(false),
  insuranceDetails: text("insurance_details"),
  insuranceClaimAmountNPR: decimal("insurance_claim_amount_npr", {
    precision: 14,
    scale: 2,
  }),
  legalProceedingInitiated: boolean("legal_proceeding_initiated").default(
    false,
  ),
  legalDetails: text("legal_details"),

  // Documentation
  hasPhotos: boolean("has_photos").default(false),
  hasIncidentReport: boolean("has_incident_report").default(false),
  hasNewsCoverage: boolean("has_news_coverage").default(false),
  mediaLinks: jsonb("media_links").default(sql`'[]'::jsonb`),
  reportLinks: jsonb("report_links").default(sql`'[]'::jsonb`),

  // Linkages to other entities
  linkedFireStations: jsonb("linked_fire_stations").default(sql`'[]'::jsonb`),
  linkedHealthFacilities: jsonb("linked_health_facilities").default(
    sql`'[]'::jsonb`,
  ),
  linkedPoliceStations: jsonb("linked_police_stations").default(
    sql`'[]'::jsonb`,
  ),
  linkedDisasterManagementCenters: jsonb(
    "linked_disaster_management_centers",
  ).default(sql`'[]'::jsonb`),

  // Notes and metadata
  notes: text("notes"),
  investigationStatus: text("investigation_status"),
  caseClosureStatus: text("case_closure_status"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  affectedArea: geometry("affected_area", { type: "Polygon" }),

  // Status and metadata
  isVerified: boolean("is_verified").default(false),
  verificationDate: timestamp("verification_date"),
  verifiedBy: varchar("verified_by", { length: 36 }),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type FireIncident = typeof fireIncident.$inferSelect;
export type NewFireIncident = typeof fireIncident.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
