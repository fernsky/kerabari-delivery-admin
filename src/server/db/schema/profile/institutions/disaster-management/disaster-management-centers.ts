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
  time,
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define center type enum
export const disasterCenterTypeEnum = pgEnum("disaster_center_type", [
  "EMERGENCY_OPERATIONS_CENTER",
  "COORDINATION_CENTER",
  "EVACUATION_CENTER",
  "RELIEF_DISTRIBUTION_CENTER",
  "EARLY_WARNING_CENTER",
  "MULTIPURPOSE_DISASTER_CENTER",
  "FIRE_STATION",
  "SEARCH_AND_RESCUE_CENTER",
  "HEALTH_EMERGENCY_CENTER",
  "TRAINING_AND_AWARENESS_CENTER",
  "OTHER",
]);

// Define management type enum
export const disasterCenterManagementEnum = pgEnum(
  "disaster_center_management",
  [
    "GOVERNMENT_MANAGED",
    "LOCAL_GOVERNMENT_MANAGED",
    "NGO_MANAGED",
    "RED_CROSS_MANAGED",
    "COMMUNITY_MANAGED",
    "JOINT_MANAGEMENT",
    "SECURITY_FORCES_MANAGED",
    "PRIVATE_SECTOR_MANAGED",
    "OTHER",
  ],
);

// Define operational status enum
export const operationalStatusEnum = pgEnum("operational_status", [
  "FULLY_OPERATIONAL",
  "PARTIALLY_OPERATIONAL",
  "UNDER_MAINTENANCE",
  "UNDER_CONSTRUCTION",
  "TEMPORARILY_CLOSED",
  "SEASONAL_OPERATION",
  "STANDBY_MODE",
  "OUT_OF_SERVICE",
]);

// Define facility condition enum
export const facilityConditionEnum = pgEnum("facility_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_MAINTENANCE",
  "NEEDS_MAJOR_REPAIR",
  "POOR",
  "UNDER_RENOVATION",
]);

// Disaster Management Center table
export const disasterManagementCenter = pgTable("disaster_management_center", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  centerType: disasterCenterTypeEnum("center_type").notNull(),
  description: text("description"),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  establishedYear: integer("established_year"),
  managementType: disasterCenterManagementEnum("management_type").notNull(),
  operationalStatus: operationalStatusEnum("operational_status").notNull(),
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"),
  coverageAreaDescription: text("coverage_area_description"),
  populationCovered: integer("population_covered"),

  // Contact information
  headOfficerName: text("head_officer_name"),
  headOfficerPosition: text("head_officer_position"),
  phoneNumber: text("phone_number"),
  emergencyPhoneNumber: text("emergency_phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  email: text("email"),
  websiteUrl: text("website_url"),
  radioFrequency: text("radio_frequency"),

  // Operating hours
  isOpen24Hours: boolean("is_open_24_hours").default(true),
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  weeklyOffDays: text("weekly_off_days"),

  // Physical infrastructure
  facilityCondition: facilityConditionEnum("facility_condition"),
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
  buildingAreaSqm: decimal("building_area_sq_m", { precision: 10, scale: 2 }),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  totalFloors: integer("total_floors"),
  totalRooms: integer("total_rooms"),
  hasEmergencyOperationRoom: boolean("has_emergency_operation_room").default(
    false,
  ),
  hasControlRoom: boolean("has_control_room").default(false),
  hasMeetingRoom: boolean("has_meeting_room").default(false),
  hasTrainingRoom: boolean("has_training_room").default(false),
  hasWarehouse: boolean("has_warehouse").default(false),
  warehouseCapacitySqm: decimal("warehouse_capacity_sqm", {
    precision: 10,
    scale: 2,
  }),
  hasShelterSpace: boolean("has_shelter_space").default(false),
  shelterCapacityPersons: integer("shelter_capacity_persons"),
  hasKitchen: boolean("has_kitchen").default(false),
  hasDormitory: boolean("has_dormitory").default(false),
  dormitoryCapacityPersons: integer("dormitory_capacity_persons"),

  // Resources and equipment
  hasEmergencyVehicles: boolean("has_emergency_vehicles").default(false),
  emergencyVehicleTypes: text("emergency_vehicle_types"),
  emergencyVehicleCount: integer("emergency_vehicle_count"),
  hasDisasterResponseEquipment: boolean(
    "has_disaster_response_equipment",
  ).default(false),
  equipmentDetails: text("equipment_details"),
  hasSearchRescueEquipment: boolean("has_search_rescue_equipment").default(
    false,
  ),
  searchRescueEquipmentDetails: text("search_rescue_equipment_details"),
  hasEarlyWarningSystem: boolean("has_early_warning_system").default(false),
  earlyWarningSystemDetails: text("early_warning_system_details"),
  hasEmergencyCommunicationSystem: boolean(
    "has_emergency_communication_system",
  ).default(false),
  communicationSystemDetails: text("communication_system_details"),
  hasDisasterManagementPlan: boolean("has_disaster_management_plan").default(
    false,
  ),
  disasterManagementPlanDetails: text("disaster_management_plan_details"),
  hasEmergencyShelterKit: boolean("has_emergency_shelter_kit").default(false),
  shelterKitCount: integer("shelter_kit_count"),
  hasEmergencyFoodSupply: boolean("has_emergency_food_supply").default(false),
  foodSupplyDetails: text("food_supply_details"),
  hasMedicalSupplies: boolean("has_medical_supplies").default(false),
  medicalSuppliesDetails: text("medical_supplies_details"),

  // Staff and human resources
  totalStaffCount: integer("total_staff_count"),
  permanentStaffCount: integer("permanent_staff_count"),
  temporaryStaffCount: integer("temporary_staff_count"),
  volunteerCount: integer("volunteer_count"),
  trainedResponderCount: integer("trained_responder_count"),
  searchRescuePersonnelCount: integer("search_rescue_personnel_count"),
  medicalTeamMemberCount: integer("medical_team_member_count"),
  fireFighterCount: integer("fire_fighter_count"),
  logisticsTeamCount: integer("logistics_team_count"),
  communicationTeamCount: integer("communication_team_count"),
  adminStaffCount: integer("admin_staff_count"),
  staffTrainingFrequency: text("staff_training_frequency"),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(true),
  powerBackupType: text("power_backup_type"), // Generator, Solar, etc.
  powerBackupCapacityKW: decimal("power_backup_capacity_kw", {
    precision: 8,
    scale: 2,
  }),
  hasFuelStorage: boolean("has_fuel_storage").default(false),
  fuelStorageCapacityLiters: integer("fuel_storage_capacity_liters"),
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterStorageCapacityLiters: integer("water_storage_capacity_liters"),
  hasToilets: boolean("has_toilets").default(true),
  toiletCount: integer("toilet_count"),
  hasShowers: boolean("has_showers").default(false),
  showerCount: integer("shower_count"),
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetBackup: boolean("internet_backup").default(false),
  internetBackupType: text("internet_backup_type"),
  hasSatellitePhone: boolean("has_satellite_phone").default(false),
  satellitePhoneCount: integer("satellite_phone_count"),

  // Services offered
  providesDisasterResponse: boolean("provides_disaster_response").default(true),
  providesSearchRescue: boolean("provides_search_rescue").default(false),
  providesEmergencyShelter: boolean("provides_emergency_shelter").default(
    false,
  ),
  providesEmergencyFoodRelief: boolean(
    "provides_emergency_food_relief",
  ).default(false),
  providesFirstAid: boolean("provides_first_aid").default(false),
  providesTraumaSupport: boolean("provides_trauma_support").default(false),
  providesDisasterTraining: boolean("provides_disaster_training").default(
    false,
  ),
  providesAwarenessPrograms: boolean("provides_awareness_programs").default(
    false,
  ),
  providesCommunityDrills: boolean("provides_community_drills").default(false),
  providesEarlyWarning: boolean("provides_early_warning").default(false),
  providesHazardMapping: boolean("provides_hazard_mapping").default(false),
  providesVulnerabilityAssessment: boolean(
    "provides_vulnerability_assessment",
  ).default(false),
  serviceDetails: text("service_details"),

  // Disaster response capabilities
  floodResponseCapability: boolean("flood_response_capability").default(false),
  earthquakeResponseCapability: boolean(
    "earthquake_response_capability",
  ).default(false),
  landslideResponseCapability: boolean("landslide_response_capability").default(
    false,
  ),
  fireResponseCapability: boolean("fire_response_capability").default(false),
  cycloneResponseCapability: boolean("cyclone_response_capability").default(
    false,
  ),
  avalancheResponseCapability: boolean("avalanche_response_capability").default(
    false,
  ),
  droughtResponseCapability: boolean("drought_response_capability").default(
    false,
  ),
  epidemicResponseCapability: boolean("epidemic_response_capability").default(
    false,
  ),
  otherResponseCapabilities: text("other_response_capabilities"),

  // Coordination and networks
  coordinatesWithLocalGovernment: boolean(
    "coordinates_with_local_government",
  ).default(true),
  coordinatesWithProvincialGovernment: boolean(
    "coordinates_with_provincial_government",
  ).default(false),
  coordinatesWithFederalGovernment: boolean(
    "coordinates_with_federal_government",
  ).default(false),
  coordinatesWithNGOs: boolean("coordinates_with_ngos").default(false),
  coordinatesWithSecurityForces: boolean(
    "coordinates_with_security_forces",
  ).default(true),
  coordinatesWithInternationalAgencies: boolean(
    "coordinates_with_international_agencies",
  ).default(false),
  partOfDisasterNetwork: boolean("part_of_disaster_network").default(false),
  networkDetails: text("network_details"),
  hasEmergencyProtocols: boolean("has_emergency_protocols").default(true),
  protocolDetails: text("protocol_details"),

  // Disaster history and experience
  majorDisastersResponded: jsonb("major_disasters_responded").default(
    sql`'[]'::jsonb`,
  ),
  disasterResponseFrequency: text("disaster_response_frequency"),
  yearlyResponseCount: integer("yearly_response_count"),
  lastMajorResponseDate: date("last_major_response_date"),
  lastMajorResponseDetails: text("last_major_response_details"),

  // Financial aspects
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  fundingSources: text("funding_sources"),
  governmentFundingPercentage: integer("government_funding_percentage"),
  donorFundingPercentage: integer("donor_funding_percentage"),
  hasEmergencyFund: boolean("has_emergency_fund").default(false),
  emergencyFundAmountNPR: decimal("emergency_fund_amount_npr", {
    precision: 14,
    scale: 2,
  }),

  // Monitoring and evaluation
  monitoringMechanism: text("monitoring_mechanism"),
  lastEvaluationDate: date("last_evaluation_date"),
  evaluationResults: text("evaluation_results"),

  // Challenges and needs
  majorChallenges: text("major_challenges"),
  resourceNeeds: text("resource_needs"),
  equipmentNeeds: text("equipment_needs"),
  trainingNeeds: text("training_needs"),

  // Future plans
  expansionPlans: text("expansion_plans"),
  capacityEnhancementPlans: text("capacity_enhancement_plans"),
  fundingRequirements: text("funding_requirements"),

  // Linkages to other entities
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedHealthFacilities: jsonb("linked_health_facilities").default(
    sql`'[]'::jsonb`,
  ),
  linkedPoliceStations: jsonb("linked_police_stations").default(
    sql`'[]'::jsonb`,
  ),
  linkedFireStations: jsonb("linked_fire_stations").default(sql`'[]'::jsonb`),

  // Social media and online presence
  facebookPage: text("facebook_page"),
  twitterHandle: text("twitter_handle"),
  otherSocialMedia: text("other_social_media"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  coverageArea: geometry("coverage_area", { type: "MultiPolygon" }),
  facilityArea: geometry("facility_area", { type: "Polygon" }),

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

export type DisasterManagementCenter =
  typeof disasterManagementCenter.$inferSelect;
export type NewDisasterManagementCenter =
  typeof disasterManagementCenter.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
