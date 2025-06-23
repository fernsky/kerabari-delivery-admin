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
import { equipmentStatusEnum, vehicleStatusEnum } from "./nepal-police";

// Define army facility type enum
export const armyFacilityTypeEnum = pgEnum("army_facility_type", [
  "ARMY_HEADQUARTERS",
  "DIVISION_HEADQUARTERS",
  "BRIGADE_HEADQUARTERS",
  "BATTALION_HEADQUARTERS",
  "COMPANY_BASE",
  "TRAINING_CENTER",
  "MILITARY_ACADEMY",
  "MILITARY_HOSPITAL",
  "LOGISTICS_BASE",
  "SIGNAL_UNIT",
  "ENGINEERING_UNIT",
  "AVIATION_UNIT",
  "ARTILLERY_UNIT",
  "ARMORED_UNIT",
  "SPECIAL_FORCES_BASE",
  "INFANTRY_BASE",
  "MILITARY_POLICE_UNIT",
  "RECRUITMENT_CENTER",
  "MILITARY_SCHOOL",
  "WELFARE_CENTER",
  "DISASTER_MANAGEMENT_CENTER",
  "RESEARCH_AND_DEVELOPMENT_CENTER",
  "AMMUNITION_DEPOT",
  "BORDER_OUTPOST",
  "CEREMONIAL_UNIT",
  "OTHER",
]);

// Define army jurisdiction type enum
export const armyJurisdictionTypeEnum = pgEnum("army_jurisdiction_type", [
  "NATIONAL",
  "PROVINCIAL",
  "DIVISIONAL",
  "BRIGADE",
  "BATTALION",
  "COMPANY",
  "SPECIALIZED",
]);

// Define building condition enum
export const armyBuildingConditionEnum = pgEnum("army_building_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_MAINTENANCE",
  "POOR",
  "UNDER_CONSTRUCTION",
  "UNDER_RENOVATION",
  "HISTORICAL",
  "TEMPORARY",
]);

// Define operational readiness level enum
export const operationalReadinessEnum = pgEnum("operational_readiness", [
  "FULLY_OPERATIONAL",
  "HIGH_READINESS",
  "STANDARD_READINESS",
  "LIMITED_OPERATIONAL",
  "TRAINING_STATUS",
  "MAINTENANCE_STATUS",
  "RESERVE_STATUS",
]);

// Nepal Army table
export const nepalArmy = pgTable("nepal_army", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  facilityType: armyFacilityTypeEnum("facility_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  unitCode: varchar("unit_code", { length: 20 }), // Official code
  establishedDate: date("established_date"),
  jurisdictionType: armyJurisdictionTypeEnum("jurisdiction_type"),
  commandStructure: text("command_structure"), // Which division/brigade it belongs to
  historicalSignificance: text("historical_significance"), // Any historical significance of the unit
  parentUnitId: varchar("parent_unit_id", { length: 36 }),
  reportingHierarchy: text("reporting_hierarchy"), // Description of reporting chain

  // Leadership
  commandingOfficerRank: text("commanding_officer_rank"), // General, Colonel, Lt. Colonel, etc.
  commandingOfficerName: text("commanding_officer_name"),
  commandingOfficerAppointmentDate: date("commanding_officer_appointment_date"),
  deputyCommanderRank: text("deputy_commander_rank"),
  deputyCommanderName: text("deputy_commander_name"),

  // Contact information
  phoneNumber: text("phone_number"),
  emergencyContactNumber: text("emergency_contact_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  faxNumber: text("fax_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Social media and online presence
  facebookHandle: text("facebook_handle"),
  twitterHandle: text("twitter_handle"),
  otherSocialMedia: text("other_social_media"),

  // Operating hours for administrative purposes
  adminOfficeOpeningTime: time("admin_office_opening_time"),
  adminOfficeClosingTime: time("admin_office_closing_time"),
  hasPublicInquiryOffice: boolean("has_public_inquiry_office").default(false),
  publicInquiryHours: text("public_inquiry_hours"),

  // Facility infrastructure
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", etc.
  buildingType: text("building_type"), // "Permanent", "Temporary", etc.
  buildingCondition: armyBuildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  historicalBuilding: boolean("historical_building").default(false),
  historicalBuildingDetails: text("historical_building_details"),
  totalFloors: integer("total_floors"),
  totalRooms: integer("total_rooms"),
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
  hasPerimeterWall: boolean("has_perimeter_wall").default(true),
  wallHeightMeters: decimal("wall_height_meters", { precision: 5, scale: 2 }),
  hasWatchTowers: boolean("has_watch_towers").default(false),
  watchTowerCount: integer("watch_tower_count"),

  // Barracks and accommodation
  hasBarracks: boolean("has_barracks").default(true),
  barracksBuildingCount: integer("barracks_building_count"),
  barracksCapacity: integer("barracks_capacity"),
  hasFamilyQuarters: boolean("has_family_quarters").default(false),
  familyQuartersCount: integer("family_quarters_count"),
  hasOfficersQuarters: boolean("has_officers_quarters").default(false),
  officersQuartersCount: integer("officers_quarters_count"),
  hasJCOQuarters: boolean("has_jco_quarters").default(false),
  jcoQuartersCount: integer("jco_quarters_count"),
  hasGuesthouse: boolean("has_guesthouse").default(false),
  guesthouseCapacity: integer("guesthouse_capacity"),

  // Facilities
  hasMess: boolean("has_mess").default(true),
  messCapacity: integer("mess_capacity"),
  hasParadeGround: boolean("has_parade_ground").default(true),
  paradeGroundAreaSqm: decimal("parade_ground_area_sq_m", {
    precision: 10,
    scale: 2,
  }),
  hasTrainingArea: boolean("has_training_area").default(true),
  trainingAreaSqm: decimal("training_area_sq_m", { precision: 10, scale: 2 }),
  hasSimulatorFacility: boolean("has_simulator_facility").default(false),
  hasShootingRange: boolean("has_shooting_range").default(false),
  shootingRangeDetails: text("shooting_range_details"),
  hasObstacleCourse: boolean("has_obstacle_course").default(false),
  hasHelipad: boolean("has_helipad").default(false),
  helipadCount: integer("helipad_count"),
  hasArmory: boolean("has_armory").default(true),
  armorySecurityLevel: text("armory_security_level"),
  hasWorkshop: boolean("has_workshop").default(false),
  workshopType: text("workshop_type"),
  hasStorageFacility: boolean("has_storage_facility").default(true),
  storageFacilityType: text("storage_facility_type"),
  hasFitnessCenter: boolean("has_fitness_center").default(false),
  hasSportsGround: boolean("has_sports_ground").default(false),
  sportsGroundType: text("sports_ground_type"),
  hasSwimmingPool: boolean("has_swimming_pool").default(false),
  hasAuditorium: boolean("has_auditorium").default(false),
  auditoriumCapacity: integer("auditorium_capacity"),

  // Basic infrastructure
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(true),
  powerBackupType: text("power_backup_type"), // E.g., "Generator", "Solar", "UPS"
  powerBackupCapacity: text("power_backup_capacity"),
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterSourceType: text("water_source_type"), // E.g., "Municipal", "Well", "Tanker"
  waterStorageCapacity: text("water_storage_capacity"),
  hasSewageTreatment: boolean("has_sewage_treatment").default(false),
  hasWasteManagement: boolean("has_waste_management").default(false),
  wasteManagementType: text("waste_management_type"),
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetType: text("internet_type"), // E.g., "Fiber", "Satellite", etc.
  hasSecureCommunication: boolean("has_secure_communication").default(true),
  secureCommunicationType: text("secure_communication_type"),

  // Medical facilities
  hasMedicalFacility: boolean("has_medical_facility").default(true),
  medicalFacilityType: text("medical_facility_type"), // Dispensary, MI Room, Hospital
  medicalFacilityBedCapacity: integer("medical_facility_bed_capacity"),
  hasMedicalOfficer: boolean("has_medical_officer").default(false),
  medicalOfficerCount: integer("medical_officer_count"),
  hasAmbulance: boolean("has_ambulance").default(false),
  ambulanceCount: integer("ambulance_count"),

  // Personnel
  totalPersonnelCount: integer("total_personnel_count"),
  officersCount: integer("officers_count"),
  jcoCount: integer("jco_count"), // Junior Commissioned Officers
  otherRanksCount: integer("other_ranks_count"),
  civilianStaffCount: integer("civilian_staff_count"),
  combatUnitsCount: integer("combat_units_count"),
  supportUnitsCount: integer("support_units_count"),
  femalePersonnelCount: integer("female_personnel_count"),
  specialForcesCount: integer("special_forces_count"),
  personnelCapacity: integer("personnel_capacity"), // Maximum capacity
  staffingStatus: text("staffing_status"), // Assessment of staffing levels

  // Operational resources
  hasFourWheelerVehicle: boolean("has_four_wheeler_vehicle").default(true),
  fourWheelerCount: integer("four_wheeler_count"),
  fourWheelerStatus: vehicleStatusEnum("four_wheeler_status"),
  hasTroopCarriers: boolean("has_troop_carriers").default(false),
  troopCarrierCount: integer("troop_carrier_count"),
  hasArmoredVehicles: boolean("has_armored_vehicles").default(false),
  armoredVehicleCount: integer("armored_vehicle_count"),
  hasArtilleryEquipment: boolean("has_artillery_equipment").default(false),
  artilleryEquipmentDetails: text("artillery_equipment_details"),
  hasEngineeringEquipment: boolean("has_engineering_equipment").default(false),
  engineeringEquipmentDetails: text("engineering_equipment_details"),
  hasSpecializedEquipment: boolean("has_specialized_equipment").default(false),
  specializedEquipmentDetails: text("specialized_equipment_details"),
  equipmentMaintenanceStatus: text("equipment_maintenance_status"),
  vehicleMaintenanceStatus: vehicleStatusEnum("vehicle_maintenance_status"),

  // Communication and technology
  hasRadioEquipment: boolean("has_radio_equipment").default(true),
  radioEquipmentCount: integer("radio_equipment_count"),
  radioEquipmentStatus: equipmentStatusEnum("radio_equipment_status"),
  hasComputerEquipment: boolean("has_computer_equipment").default(true),
  computerCount: integer("computer_count"),
  computerEquipmentStatus: equipmentStatusEnum("computer_equipment_status"),
  hasCctv: boolean("has_cctv").default(true),
  cctvCameraCount: integer("cctv_camera_count"),
  hasDrones: boolean("has_drones").default(false),
  droneCount: integer("drone_count"),
  hasSurveillanceEquipment: boolean("has_surveillance_equipment").default(
    false,
  ),
  surveillanceEquipmentDetails: text("surveillance_equipment_details"),
  hasNightVisionCapability: boolean("has_night_vision_capability").default(
    false,
  ),
  nightVisionEquipmentCount: integer("night_vision_equipment_count"),
  hasSatelliteCommunication: boolean("has_satellite_communication").default(
    false,
  ),

  // Special units and capabilities
  specialUnits: text("special_units"), // Description of special units stationed here
  specialCapabilities: text("special_capabilities"), // Special capabilities like mountain warfare, disaster response
  operationalReadiness: operationalReadinessEnum("operational_readiness"),
  combatReadinessRating: text("combat_readiness_rating"),
  hasRapidDeploymentTeam: boolean("has_rapid_deployment_team").default(false),
  hasSpecialForces: boolean("has_special_forces").default(false),
  specialForcesDetails: text("special_forces_details"),

  // Training
  providesBasicTraining: boolean("provides_basic_training").default(false),
  providesAdvancedTraining: boolean("provides_advanced_training").default(
    false,
  ),
  providesSpecializedTraining: boolean("provides_specialized_training").default(
    false,
  ),
  specializedTrainingTypes: text("specialized_training_types"),
  annualTraineesCapacity: integer("annual_trainees_capacity"),
  trainingFacilityQuality: text("training_facility_quality"),
  trainingInstructorsCount: integer("training_instructors_count"),

  // Disaster management and civil support
  disasterManagementRole: boolean("disaster_management_role").default(true),
  disasterResponseEquipment: text("disaster_response_equipment"),
  disasterResponseCapabilities: text("disaster_response_capabilities"),
  civilApproachPolicy: text("civil_approach_policy"),
  communitySupportActivities: text("community_support_activities"),
  publicWelfareInitiatives: text("public_welfare_initiatives"),

  // Security
  securityMeasures: text("security_measures"),
  physicalSecurityRating: text("physical_security_rating"),
  electronicSurveillance: boolean("electronic_surveillance").default(true),
  guardPostCount: integer("guard_post_count"),
  securityPatrolFrequency: text("security_patrol_frequency"),
  hasQuickReactionTeam: boolean("has_quick_reaction_team").default(true),
  securityChallenges: text("security_challenges"),

  // National defense and operations
  nationalDefenseRole: text("national_defense_role"),
  borderSecurityRole: boolean("border_security_role").default(false),
  borderSecurityDetails: text("border_security_details"),
  counterInsurgencyRole: boolean("counter_insurgency_role").default(false),
  counterInsurgencyDetails: text("counter_insurgency_details"),
  internalSecurityRole: boolean("internal_security_role").default(false),
  internalSecurityDetails: text("internal_security_details"),
  peacekeepingExperience: boolean("peacekeeping_experience").default(false),
  peacekeepingMissionDetails: text("peacekeeping_mission_details"),

  // Budget and resources
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  operationalBudgetNPR: decimal("operational_budget_npr", {
    precision: 18,
    scale: 2,
  }),
  maintenanceBudgetNPR: decimal("maintenance_budget_npr", {
    precision: 18,
    scale: 2,
  }),
  trainingBudgetNPR: decimal("training_budget_npr", {
    precision: 18,
    scale: 2,
  }),
  infrastructureBudgetNPR: decimal("infrastructure_budget_npr", {
    precision: 18,
    scale: 2,
  }),
  budgetAdequacy: text("budget_adequacy"),
  budgetFiscalYear: varchar("budget_fiscal_year", { length: 9 }), // E.g., "2079/080"

  // Welfare
  hasWelfareDepartment: boolean("has_welfare_department").default(false),
  veteransAssistancePrograms: boolean("veterans_assistance_programs").default(
    false,
  ),
  familySupportPrograms: boolean("family_support_programs").default(false),
  educationFacilities: boolean("education_facilities").default(false),
  educationFacilitiesDetails: text("education_facilities_details"),
  recreationalFacilities: boolean("recreational_facilities").default(false),
  recreationalFacilitiesDetails: text("recreational_facilities_details"),

  // Community relations
  communityEngagementActivities: text("community_engagement_activities"),
  civilMilitaryCooperationProjects: text("civil_military_cooperation_projects"),
  publicPerception: text("public_perception"),
  communityOutreachFrequency: text("community_outreach_frequency"),

  // Challenges and needs
  majorChallenges: text("major_challenges"),
  infrastructureNeeds: text("infrastructure_needs"),
  equipmentNeeds: text("equipment_needs"),
  trainingNeeds: text("training_needs"),
  deploymentChallenges: text("deployment_challenges"),

  // Future plans
  developmentPlans: text("development_plans"),
  modernizationPlans: text("modernization_plans"),
  expansionPlans: text("expansion_plans"),
  futureInitiatives: text("future_initiatives"),

  // Coordination with other agencies
  coordinatesWithPolice: boolean("coordinates_with_police").default(true),
  coordinatesWithArmedPolice: boolean("coordinates_with_armed_police").default(
    true,
  ),
  coordinatesWithLocalGovernment: boolean(
    "coordinates_with_local_government",
  ).default(true),
  coordinationMechanisms: text("coordination_mechanisms"),
  jointOperationsHistory: text("joint_operations_history"),
  jointExercisesFrequency: text("joint_exercises_frequency"),

  // Linkages to other entities
  linkedMunicipalityOffices: jsonb("linked_municipality_offices").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedPoliceUnits: jsonb("linked_police_units").default(sql`'[]'::jsonb`),
  linkedArmedPoliceUnits: jsonb("linked_armed_police_units").default(
    sql`'[]'::jsonb`,
  ),
  linkedOtherArmyUnits: jsonb("linked_other_army_units").default(
    sql`'[]'::jsonb`,
  ),
  linkedStrategicLocations: jsonb("linked_strategic_locations").default(
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
  operationalArea: geometry("operational_area", { type: "MultiPolygon" }),
  trainingArea: geometry("training_area", { type: "Polygon" }),

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

export type NepalArmy = typeof nepalArmy.$inferSelect;
export type NewNepalArmy = typeof nepalArmy.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
