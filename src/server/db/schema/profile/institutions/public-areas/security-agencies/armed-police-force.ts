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
import {
  equipmentStatusEnum,
  vehicleStatusEnum,
  workloadLevelEnum,
} from "./nepal-police";

// Define APF facility type enum
export const apfFacilityTypeEnum = pgEnum("apf_facility_type", [
  "APF_HEADQUARTERS",
  "PROVINCIAL_APF_HEADQUARTERS",
  "APF_BRIGADE_HEADQUARTERS",
  "APF_BATTALION_HEADQUARTERS",
  "APF_COMPANY_BASE",
  "APF_BORDER_OUTPOST",
  "APF_TRAINING_CENTER",
  "APF_SECURITY_BASE",
  "APF_DISASTER_MANAGEMENT_CENTER",
  "APF_SPECIAL_TASK_FORCE",
  "APF_INDUSTRIAL_SECURITY_UNIT",
  "APF_RIOT_CONTROL_UNIT",
  "APF_MOBILE_UNIT",
  "APF_RESERVE_UNIT",
  "APF_LOGISTICAL_UNIT",
  "APF_AIRPORT_SECURITY_UNIT",
  "APF_HIGHWAY_SECURITY_UNIT",
  "OTHER",
]);

// Define APF jurisdiction type enum
export const apfJurisdictionTypeEnum = pgEnum("apf_jurisdiction_type", [
  "FEDERAL",
  "PROVINCIAL",
  "DISTRICT",
  "MUNICIPALITY",
  "RURAL_MUNICIPALITY",
  "BORDER_AREA",
  "INDUSTRIAL_COMPLEX",
  "CRITICAL_INFRASTRUCTURE",
  "SPECIAL_SECURITY_ZONE",
]);

// Define building condition enum
export const apfBuildingConditionEnum = pgEnum("apf_building_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_MAINTENANCE",
  "POOR",
  "UNDER_CONSTRUCTION",
  "UNDER_RENOVATION",
  "TEMPORARY",
]);

// Define service efficiency enum
export const apfServiceEfficiencyEnum = pgEnum("apf_service_efficiency", [
  "EXCELLENT",
  "GOOD",
  "SATISFACTORY",
  "NEEDS_IMPROVEMENT",
  "POOR",
]);

// Armed Police Force table
export const armedPoliceForce = pgTable("armed_police_force", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  facilityType: apfFacilityTypeEnum("facility_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  officeCode: varchar("office_code", { length: 20 }), // Official code
  establishedDate: date("established_date"),
  jurisdictionType: apfJurisdictionTypeEnum("jurisdiction_type").notNull(),
  jurisdictionAreaDescription: text("jurisdiction_area_description"), // Textual description of jurisdiction area
  jurisdictionAreaSqKm: decimal("jurisdiction_area_sq_km", {
    precision: 10,
    scale: 2,
  }),
  populationServed: integer("population_served"),
  parentApfOfficeId: varchar("parent_apf_office_id", { length: 36 }),
  reportingHierarchy: text("reporting_hierarchy"), // Description of reporting chain

  // Leadership and command
  inChargeRank: text("in_charge_rank"), // SSP, SP, DSP, etc.
  inChargeName: text("in_charge_name"),
  inChargeAppointmentDate: date("in_charge_appointment_date"),
  inChargeContactNumber: text("in_charge_contact_number"),
  deputyInChargeRank: text("deputy_in_charge_rank"),
  deputyInChargeName: text("deputy_in_charge_name"),

  // Contact information
  phoneNumber: text("phone_number"),
  emergencyContactNumber: text("emergency_contact_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  faxNumber: text("fax_number"),
  email: text("email"),
  websiteUrl: text("website_url"),
  controlRoomNumber: text("control_room_number"),

  // Social media and online presence
  facebookHandle: text("facebook_handle"),
  twitterHandle: text("twitter_handle"),
  otherSocialMedia: text("other_social_media"),

  // Operating hours
  isOpenAllDay: boolean("is_open_all_day").default(true), // Most APF facilities are 24/7
  officeOpeningTime: time("office_opening_time"), // For administrative work
  officeClosingTime: time("office_closing_time"), // For administrative work
  hasPublicInquiryDesk: boolean("has_public_inquiry_desk").default(false),
  inquiryDeskHours: text("inquiry_desk_hours"),

  // Facility infrastructure
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", etc.
  buildingType: text("building_type"), // "Permanent", "Temporary", etc.
  buildingCondition: apfBuildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  totalFloors: integer("total_floors"),
  totalRooms: integer("total_rooms"),
  totalOfficeAreaSqm: decimal("total_office_area_sqm", {
    precision: 10,
    scale: 2,
  }),
  hasCompound: boolean("has_compound").default(true),
  compoundAreaSqm: decimal("compound_area_sq_m", { precision: 10, scale: 2 }),
  hasBarrack: boolean("has_barrack").default(true),
  barrackCapacity: integer("barrack_capacity"),
  hasMess: boolean("has_mess").default(true),
  hasTrainingGround: boolean("has_training_ground").default(false),
  trainingGroundAreaSqm: decimal("training_ground_area_sq_m", {
    precision: 10,
    scale: 2,
  }),
  hasHelipads: boolean("has_helipads").default(false),
  helipadCount: integer("helipad_count"),
  hasArmory: boolean("has_armory").default(true),
  hasObservationTower: boolean("has_observation_tower").default(false),
  observationTowerCount: integer("observation_tower_count"),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(true),
  powerBackupType: text("power_backup_type"), // E.g., "Generator", "Solar", "UPS"
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterSourceType: text("water_source_type"), // E.g., "Municipal", "Well", "Tanker"
  hasToilets: boolean("has_toilets").default(true),
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetType: text("internet_type"), // E.g., "Fiber", "DSL", "4G"
  internetSpeed: text("internet_speed"), // E.g., "10 Mbps"
  hasSatelliteCommunication: boolean("has_satellite_communication").default(
    false,
  ),

  // Staff and personnel
  totalPersonnelCount: integer("total_personnel_count"),
  malePersonnelCount: integer("male_personnel_count"),
  femalePersonnelCount: integer("female_personnel_count"),
  officersCount: integer("officers_count"), // Gazetted officers
  juniorOfficersCount: integer("junior_officers_count"), // Non-gazetted officers
  otherRanksCount: integer("other_ranks_count"),
  combatTrainedCount: integer("combat_trained_count"),
  specialOperationsTrainedCount: integer("special_operations_trained_count"),
  disasterResponseTrainedCount: integer("disaster_response_trained_count"),
  riotControlTrainedCount: integer("riot_control_trained_count"),
  vipProtectionTrainedCount: integer("vip_protection_trained_count"),
  medicalStaffCount: integer("medical_staff_count"),
  technicalStaffCount: integer("technical_staff_count"),
  administrativeStaffCount: integer("administrative_staff_count"),
  staffingAdequacy: text("staffing_adequacy"), // Assessment of staffing levels

  // Operational resources and equipment
  hasFourWheelerVehicle: boolean("has_four_wheeler_vehicle").default(true),
  fourWheelerCount: integer("four_wheeler_count"),
  fourWheelerStatus: vehicleStatusEnum("four_wheeler_status"),
  hasTwoWheelerVehicle: boolean("has_two_wheeler_vehicle").default(true),
  twoWheelerCount: integer("two_wheeler_count"),
  twoWheelerStatus: vehicleStatusEnum("two_wheeler_status"),
  hasArmoredVehicle: boolean("has_armored_vehicle").default(false),
  armoredVehicleCount: integer("armored_vehicle_count"),
  armoredVehicleStatus: vehicleStatusEnum("armored_vehicle_status"),
  hasWaterCannon: boolean("has_water_cannon").default(false),
  waterCannonCount: integer("water_cannon_count"),
  hasSpecializedVehicle: boolean("has_specialized_vehicle").default(false),
  specializedVehicleDetails: text("specialized_vehicle_details"),
  fuelBudgetAdequacy: text("fuel_budget_adequacy"),

  // Communication and technology
  hasRadioEquipment: boolean("has_radio_equipment").default(true),
  radioEquipmentCount: integer("radio_equipment_count"),
  radioEquipmentStatus: equipmentStatusEnum("radio_equipment_status"),
  hasEncryptedCommunication: boolean("has_encrypted_communication").default(
    false,
  ),
  hasComputerEquipment: boolean("has_computer_equipment").default(true),
  computerCount: integer("computer_count"),
  computerEquipmentStatus: equipmentStatusEnum("computer_equipment_status"),
  hasCctv: boolean("has_cctv").default(true),
  cctvCameraCount: integer("cctv_camera_count"),
  hasThermalImagers: boolean("has_thermal_imagers").default(false),
  thermalImagersCount: integer("thermal_imagers_count"),
  hasNightVisionEquipment: boolean("has_night_vision_equipment").default(false),
  nightVisionEquipmentCount: integer("night_vision_equipment_count"),
  hasDrones: boolean("has_drones").default(false),
  droneCount: integer("drone_count"),
  hasMetalDetectors: boolean("has_metal_detectors").default(true),
  metalDetectorCount: integer("metal_detector_count"),
  hasExplosiveDetectors: boolean("has_explosive_detectors").default(false),
  explosiveDetectorCount: integer("explosive_detector_count"),

  // Detention facilities
  hasDetentionFacility: boolean("has_detention_facility").default(false),
  detentionCellsCount: integer("detention_cells_count"),
  detentionCapacity: integer("detention_capacity"),
  detentionFacilityCondition: text("detention_facility_condition"),

  // Special capabilities and units
  hasRapidResponseTeam: boolean("has_rapid_response_team").default(false),
  rapidResponseTeamStrength: integer("rapid_response_team_strength"),
  hasSpecialTaskForce: boolean("has_special_task_force").default(false),
  specialTaskForceStrength: integer("special_task_force_strength"),
  hasSearchRescueTeam: boolean("has_search_rescue_team").default(false),
  searchRescueTeamStrength: integer("search_rescue_team_strength"),
  hasExplosiveDisposalUnit: boolean("has_explosive_disposal_unit").default(
    false,
  ),
  hasK9Unit: boolean("has_k9_unit").default(false),
  k9UnitStrength: integer("k9_unit_strength"),
  specialUnits: text("special_units"), // Description of any other special units

  // Operations and workload
  primaryOperationalRole: text("primary_operational_role"),
  secondaryOperationalRoles: text("secondary_operational_roles"),
  majorOperationalActivities: text("major_operational_activities"),
  annualOperationsCount: integer("annual_operations_count"),
  recordedFiscalYear: varchar("recorded_fiscal_year", { length: 9 }), // E.g., "2079/080"
  workloadLevel: workloadLevelEnum("workload_level"),
  patrolFrequency: text("patrol_frequency"),
  hasPatrolSchedule: boolean("has_patrol_schedule").default(true),

  // Border security (if applicable)
  borderSecurityResponsibility: boolean(
    "border_security_responsibility",
  ).default(false),
  borderPostCount: integer("border_post_count"),
  borderPatrollingFrequency: text("border_patrolling_frequency"),
  borderCrossingPointsMonitored: integer("border_crossing_points_monitored"),
  borderSecurityChallenges: text("border_security_challenges"),

  // Industrial and critical infrastructure security
  securityIndustries: text("security_industries"), // Industries protected
  criticalInfrastructureProtected: text("critical_infrastructure_protected"), // Key infrastructure protected
  vipSecurityResponsibility: boolean("vip_security_responsibility").default(
    false,
  ),
  vipSecurityDetails: text("vip_security_details"),

  // Disaster management
  disasterManagementRole: boolean("disaster_management_role").default(false),
  disasterResponseEquipment: text("disaster_response_equipment"),
  disasterManagementDetails: text("disaster_management_details"),
  rescueOperationsCapability: text("rescue_operations_capability"),
  hasDisasterResponseTeam: boolean("has_disaster_response_team").default(false),
  disasterResponseTeamStrength: integer("disaster_response_team_strength"),
  disasterResponseTrainingFrequency: text(
    "disaster_response_training_frequency",
  ),

  // Service and response
  averageResponseTimeMinutes: decimal("average_response_time_minutes", {
    precision: 6,
    scale: 2,
  }),
  serviceEfficiency: apfServiceEfficiencyEnum("service_efficiency"),
  hasEmergencyResponsePlan: boolean("has_emergency_response_plan").default(
    true,
  ),
  emergencyResponsePlanLastUpdated: date(
    "emergency_response_plan_last_updated",
  ),

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

  // Training
  hasTrainingFacility: boolean("has_training_facility").default(false),
  trainingFacilityType: text("training_facility_type"),
  annualTrainingPrograms: integer("annual_training_programs"),
  personnelTrainedAnnually: integer("personnel_trained_annually"),
  specializedTrainingOffered: text("specialized_training_offered"),

  // Community relations
  communityOutreachPrograms: text("community_outreach_programs"),
  conductsCivilianTraining: boolean("conducts_civilian_training").default(
    false,
  ),
  civilianTrainingDetails: text("civilian_training_details"),
  publicPerceptionDetails: text("public_perception_details"),

  // Challenges and needs
  majorChallenges: text("major_challenges"),
  infrastructureNeeds: text("infrastructure_needs"),
  equipmentNeeds: text("equipment_needs"),
  staffingNeeds: text("staffing_needs"),
  trainingNeeds: text("training_needs"),

  // Future plans
  developmentPlans: text("development_plans"),
  modernizationPlans: text("modernization_plans"),
  expansionPlans: text("expansion_plans"),

  // Coordination with other agencies
  coordinatesWithPolice: boolean("coordinates_with_police").default(true),
  coordinatesWithArmy: boolean("coordinates_with_army").default(true),
  coordinatesWithLocalGovernment: boolean(
    "coordinates_with_local_government",
  ).default(true),
  coordinationMechanisms: text("coordination_mechanisms"),
  jointOperationsHistory: text("joint_operations_history"),
  jointTrainingPrograms: text("joint_training_programs"),

  // Linkages to other entities
  linkedMunicipalityOffices: jsonb("linked_municipality_offices").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedPoliceUnits: jsonb("linked_police_units").default(sql`'[]'::jsonb`),
  linkedArmyUnits: jsonb("linked_army_units").default(sql`'[]'::jsonb`),
  linkedCriticalInfrastructure: jsonb("linked_critical_infrastructure").default(
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

export type ArmedPoliceForce = typeof armedPoliceForce.$inferSelect;
export type NewArmedPoliceForce = typeof armedPoliceForce.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
