import { pgTable } from "../../../../../schema/basic";
import {
  integer,
  timestamp,
  varchar,
  text,
  boolean,
  pgEnum,
  decimal,
  jsonb,
  time,
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define police facility type enum
export const policeFacilityTypeEnum = pgEnum("police_facility_type", [
  "CENTRAL_POLICE_OFFICE", // Police Headquarters
  "PROVINCIAL_POLICE_OFFICE", // Provincial Police Office
  "DISTRICT_POLICE_OFFICE", // District Police Office
  "AREA_POLICE_OFFICE", // Area Police Office
  "SECTOR_POLICE_OFFICE", // Sector Police Office
  "POLICE_STATION", // Police Station (Thana)
  "POLICE_POST", // Police Post (Chowki)
  "POLICE_BEAT", // Police Beat
  "TRAFFIC_POLICE_UNIT", // Traffic Police Office
  "METROPOLITAN_POLICE", // Metropolitan Police
  "BORDER_POLICE_UNIT", // Border Police Unit
  "TOURIST_POLICE_UNIT", // Tourist Police Unit
  "WOMEN_AND_CHILDREN_SERVICE_CENTER", // Women and Children Service Center
  "FORENSIC_LABORATORY", // Forensic Laboratory
  "INVESTIGATIVE_BUREAU", // Investigative Bureau
  "TRAINING_ACADEMY", // Training Academy
  "SPECIAL_TASK_FORCE", // Special Task Force
  "CANINE_UNIT", // Canine Unit
  "JAIL_FACILITY", // Jail/Detention Facility
  "OTHER", // Other police facilities
]);

// Define police jurisdiction type enum
export const policeJurisdictionTypeEnum = pgEnum("police_jurisdiction_type", [
  "FEDERAL",
  "PROVINCIAL",
  "DISTRICT",
  "MUNICIPALITY",
  "RURAL_MUNICIPALITY",
  "WARD",
  "SECTOR",
  "SPECIALIZED", // For specialized units with functional jurisdiction
]);

// Define building condition enum
export const policeBuildingConditionEnum = pgEnum("police_building_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_MAINTENANCE",
  "POOR",
  "UNDER_CONSTRUCTION",
  "UNDER_RENOVATION",
  "TEMPORARY",
]);

// Define vehicle status enum
export const vehicleStatusEnum = pgEnum("vehicle_status", [
  "EXCELLENT",
  "GOOD",
  "OPERATIONAL",
  "NEEDS_MAINTENANCE",
  "NON_OPERATIONAL",
]);

// Define equipment status enum
export const equipmentStatusEnum = pgEnum("equipment_status", [
  "EXCELLENT",
  "GOOD",
  "OPERATIONAL",
  "NEEDS_MAINTENANCE",
  "NON_OPERATIONAL",
  "OUTDATED",
]);

// Define workload level enum
export const workloadLevelEnum = pgEnum("workload_level", [
  "VERY_HIGH",
  "HIGH",
  "MODERATE",
  "LOW",
  "VARIABLE",
]);

// Define service efficiency enum
export const serviceEfficiencyEnum = pgEnum("service_efficiency", [
  "EXCELLENT",
  "GOOD",
  "SATISFACTORY",
  "NEEDS_IMPROVEMENT",
  "POOR",
]);

// Nepal Police table
export const nepalPolice = pgTable("nepal_police", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  facilityType: policeFacilityTypeEnum("facility_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  officeCode: varchar("office_code", { length: 20 }), // Official code
  establishedDate: date("established_date"),
  jurisdictionType: policeJurisdictionTypeEnum("jurisdiction_type").notNull(),
  jurisdictionAreaDescription: text("jurisdiction_area_description"), // Textual description of jurisdiction area
  jurisdictionAreaSqKm: decimal("jurisdiction_area_sq_km", {
    precision: 10,
    scale: 2,
  }),
  populationServed: integer("population_served"),
  parentPoliceOfficeId: varchar("parent_police_office_id", { length: 36 }),
  reportingHierarchy: text("reporting_hierarchy"), // Description of reporting chain

  // Leadership and command
  inChargeRank: text("in_charge_rank"), // SP, DSP, Inspector, etc.
  inChargeName: text("in_charge_name"),
  inChargeAppointmentDate: date("in_charge_appointment_date"),
  inChargeContactNumber: text("in_charge_contact_number"),
  deputyInChargeRank: text("deputy_in_charge_rank"),
  deputyInChargeName: text("deputy_in_charge_name"),

  // Contact information
  phoneNumber: text("phone_number"),
  emergencyContactNumber: text("emergency_contact_number"), // Often 100
  alternatePhoneNumber: text("alternate_phone_number"),
  faxNumber: text("fax_number"),
  email: text("email"),
  websiteUrl: text("website_url"),
  controlRoomNumber: text("control_room_number"),

  // Social media and online presence
  facebookHandle: text("facebook_handle"),
  twitterHandle: text("twitter_handle"),
  otherSocialMedia: text("other_social_media"),
  onlineCommunicationChannels: text("online_communication_channels"), // e.g., WhatsApp groups, community portals

  // Operating hours
  isOpenAllDay: boolean("is_open_all_day").default(true), // Most police facilities are 24/7
  officeOpeningTime: time("office_opening_time"), // For administrative work
  officeClosingTime: time("office_closing_time"), // For administrative work
  hasDedicatedHelpDesk: boolean("has_dedicated_help_desk").default(false),
  helpDeskHours: text("help_desk_hours"),

  // Facility infrastructure
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", etc.
  buildingType: text("building_type"), // "Permanent", "Temporary", etc.
  buildingCondition: policeBuildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  totalFloors: integer("total_floors"),
  totalRooms: integer("total_rooms"),
  totalOfficeAreaSqm: decimal("total_office_area_sqm", {
    precision: 10,
    scale: 2,
  }),
  hasCompound: boolean("has_compound").default(false),
  compoundAreaSqm: decimal("compound_area_sq_m", { precision: 10, scale: 2 }),
  hasBarrack: boolean("has_barrack").default(false),
  barrackCapacity: integer("barrack_capacity"),
  hasMess: boolean("has_mess").default(false),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"), // E.g., "Generator", "Solar", "UPS"
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterSourceType: text("water_source_type"), // E.g., "Municipal", "Well", "Tanker"
  hasToilets: boolean("has_toilets").default(true),
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetType: text("internet_type"), // E.g., "Fiber", "DSL", "4G"
  internetSpeed: text("internet_speed"), // E.g., "10 Mbps"

  // Staff and personnel
  totalOfficersCount: integer("total_officers_count"),
  maleOfficersCount: integer("male_officers_count"),
  femaleOfficersCount: integer("female_officers_count"),
  otherGenderOfficersCount: integer("other_gender_officers_count"),
  inspectorAboveRankCount: integer("inspector_above_rank_count"),
  subInspectorRankCount: integer("sub_inspector_rank_count"),
  assistantSubInspectorRankCount: integer("assistant_sub_inspector_rank_count"),
  headConstablesCount: integer("head_constables_count"),
  constablesCount: integer("constables_count"),
  otherStaffCount: integer("other_staff_count"),
  foreignTrainedStaffCount: integer("foreign_trained_staff_count"),
  specializedTrainedStaffCount: integer("specialized_trained_staff_count"),
  staffingAdequacy: text("staffing_adequacy"), // Assessment of staffing levels
  staffTrainingNeeds: text("staff_training_needs"),

  // Operational resources
  hasFourWheelerVehicle: boolean("has_four_wheeler_vehicle").default(false),
  fourWheelerCount: integer("four_wheeler_count"),
  fourWheelerStatus: vehicleStatusEnum("four_wheeler_status"),
  hasTwoWheelerVehicle: boolean("has_two_wheeler_vehicle").default(false),
  twoWheelerCount: integer("two_wheeler_count"),
  twoWheelerStatus: vehicleStatusEnum("two_wheeler_status"),
  hasSpecializedVehicle: boolean("has_specialized_vehicle").default(false),
  specializedVehicleDetails: text("specialized_vehicle_details"),
  fuelBudgetAdequacy: text("fuel_budget_adequacy"),
  hasRadioEquipment: boolean("has_radio_equipment").default(false),
  radioEquipmentCount: integer("radio_equipment_count"),
  radioEquipmentStatus: equipmentStatusEnum("radio_equipment_status"),
  hasComputerEquipment: boolean("has_computer_equipment").default(false),
  computerCount: integer("computer_count"),
  computerEquipmentStatus: equipmentStatusEnum("computer_equipment_status"),
  hasInternetForInvestigation: boolean(
    "has_internet_for_investigation",
  ).default(false),
  hasCctv: boolean("has_cctv").default(false),
  cctvCameraCount: integer("cctv_camera_count"),
  hasFingerprintingEquipment: boolean("has_fingerprinting_equipment").default(
    false,
  ),

  // Detention facilities
  hasDetentionFacility: boolean("has_detention_facility").default(false),
  detentionCellsCount: integer("detention_cells_count"),
  detentionCapacity: integer("detention_capacity"),
  maleCellsCount: integer("male_cells_count"),
  femaleCellsCount: integer("female_cells_count"),
  juvenileCellsCount: integer("juvenile_cells_count"),
  detentionFacilityCondition: text("detention_facility_condition"),

  // Special facilities and units
  hasWomenCell: boolean("has_women_cell").default(false),
  hasJuvenileUnit: boolean("has_juvenile_unit").default(false),
  hasTrafficUnit: boolean("has_traffic_unit").default(false),
  trafficUnitStaffCount: integer("traffic_unit_staff_count"),
  hasCyberCrimeUnit: boolean("has_cyber_crime_unit").default(false),
  hasIntelligenceUnit: boolean("has_intelligence_unit").default(false),
  specialUnits: text("special_units"), // Description of any other special units

  // Crime statistics and workload
  annualCasesRegisteredCount: integer("annual_cases_registered_count"),
  casesRegisteredLastYear: integer("cases_registered_last_year"),
  annualCasesSolvedCount: integer("annual_cases_solved_count"),
  casesSolvedLastYear: integer("cases_solved_last_year"),
  registeredFiscalYear: varchar("registered_fiscal_year", { length: 9 }), // E.g., "2079/080"
  majorCrimeTypes: text("major_crime_types"),
  crimeTrendDescription: text("crime_trend_description"),
  averageDailyComplaints: integer("average_daily_complaints"),
  pendingCasesCount: integer("pending_cases_count"),
  workloadLevel: workloadLevelEnum("workload_level"),
  patrolFrequency: text("patrol_frequency"),
  hasPatrolSchedule: boolean("has_patrol_schedule").default(false),

  // Community policing
  hasCommunityPolicingProgram: boolean(
    "has_community_policing_program",
  ).default(false),
  communityPolicingDetails: text("community_policing_details"),
  communityRelationRating: text("community_relation_rating"), // Assessment of police-community relations
  conductsCommunityAwareness: boolean("conducts_community_awareness").default(
    false,
  ),
  conductsCommunityMeetings: boolean("conducts_community_meetings").default(
    false,
  ),
  communityProgramFrequency: text("community_program_frequency"),

  // Service and response
  averageResponseTimeMinutes: decimal("average_response_time_minutes", {
    precision: 6,
    scale: 2,
  }),
  serviceEfficiency: serviceEfficiencyEnum("service_efficiency"),
  hasEmergencyResponsePlan: boolean("has_emergency_response_plan").default(
    false,
  ),
  hasDisasterManagementRole: boolean("has_disaster_management_role").default(
    false,
  ),
  disasterManagementDetails: text("disaster_management_details"),
  citizenSatisfactionLevel: text("citizen_satisfaction_level"), // If any surveys have been conducted

  // Budget and resources
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  operationalBudgetNPR: decimal("operational_budget_npr", {
    precision: 18,
    scale: 2,
  }),
  equipmentBudgetNPR: decimal("equipment_budget_npr", {
    precision: 18,
    scale: 2,
  }),
  infrastructureBudgetNPR: decimal("infrastructure_budget_npr", {
    precision: 18,
    scale: 2,
  }),
  budgetAdequacy: text("budget_adequacy"),
  budgetFiscalYear: varchar("budget_fiscal_year", { length: 9 }), // E.g., "2079/080"

  // Challenges and needs
  majorChallenges: text("major_challenges"),
  infrastructureNeeds: text("infrastructure_needs"),
  equipmentNeeds: text("equipment_needs"),
  staffingNeeds: text("staffing_needs"),
  trainingNeeds: text("training_needs"),
  communityRelationsNeeds: text("community_relations_needs"),

  // Future plans
  developmentPlans: text("development_plans"),
  modernizationPlans: text("modernization_plans"),
  communityEngagementPlans: text("community_engagement_plans"),

  // Coordination with other agencies
  coordinatesWithArmedPolice: boolean("coordinates_with_armed_police").default(
    false,
  ),
  coordinatesWithArmy: boolean("coordinates_with_army").default(false),
  coordinatesWithLocalGovernment: boolean(
    "coordinates_with_local_government",
  ).default(false),
  coordinatesWithNGOs: boolean("coordinates_with_ngos").default(false),
  coordinationMechanisms: text("coordination_mechanisms"),
  jointOperationsHistory: text("joint_operations_history"),

  // Additional security information
  securitySensitiveZones: text("security_sensitive_zones"), // Sensitive areas in jurisdiction
  borderSecurityResponsibility: boolean(
    "border_security_responsibility",
  ).default(false),
  borderSecurityDetails: text("border_security_details"),
  vipSecurityResponsibility: boolean("vip_security_responsibility").default(
    false,
  ),
  criticalInfrastructureProtection: text("critical_infrastructure_protection"),

  // Linkages to other entities
  linkedMunicipalityOffices: jsonb("linked_municipality_offices").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedHealthFacilities: jsonb("linked_health_facilities").default(
    sql`'[]'::jsonb`,
  ),
  linkedEducationalInstitutions: jsonb(
    "linked_educational_institutions",
  ).default(sql`'[]'::jsonb`),
  linkedOtherPoliceUnits: jsonb("linked_other_police_units").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  compoundArea: geometry("compound_area", { type: "Polygon" }),
  jurisdictionArea: geometry("jurisdiction_area", { type: "MultiPolygon" }),
  patrollingRoutes: geometry("patrolling_routes", { type: "MultiLineString" }),

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

export type NepalPolice = typeof nepalPolice.$inferSelect;
export type NewNepalPolice = typeof nepalPolice.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
