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

// Define hospital type enum
export const hospitalTypeEnum = pgEnum("hospital_type", [
  "GOVERNMENT",
  "PRIVATE",
  "COMMUNITY",
  "TEACHING",
  "SPECIALIZED",
  "MISSION",
  "NGO_OPERATED",
  "MILITARY",
  "AYURVEDIC",
  "OTHER",
]);

// Define hospital level enum
export const hospitalLevelEnum = pgEnum("hospital_level", [
  "HEALTH_POST",
  "PRIMARY_HOSPITAL",
  "SECONDARY_HOSPITAL",
  "TERTIARY_HOSPITAL",
  "SUPER_SPECIALTY",
  "DISTRICT_HOSPITAL",
  "ZONAL_HOSPITAL",
  "REGIONAL_HOSPITAL",
  "CENTRAL_HOSPITAL",
  "UNIVERSITY_HOSPITAL",
  "OTHER",
]);

// Define hospital facility level enum
export const facilityLevelEnum = pgEnum("facility_level", [
  "EXCELLENT",
  "GOOD",
  "ADEQUATE",
  "BASIC",
  "MINIMAL",
  "INADEQUATE",
]);

// Define hospital building condition enum
export const hospitalBuildingConditionEnum = pgEnum(
  "hospital_building_condition",
  [
    "EXCELLENT",
    "GOOD",
    "FAIR",
    "NEEDS_REPAIR",
    "NEEDS_RECONSTRUCTION",
    "UNDER_CONSTRUCTION",
    "TEMPORARY",
  ],
);

// Define hospital emergency service level enum
export const emergencyServiceLevelEnum = pgEnum("emergency_service_level", [
  "COMPREHENSIVE_24_7",
  "BASIC_24_7",
  "LIMITED_HOURS",
  "STABILIZATION_ONLY",
  "REFERRAL_ONLY",
  "NONE",
]);

// Define accreditation status enum
const accreditationStatusEnum = pgEnum("accreditation_status", [
  "FULLY_ACCREDITED",
  "PARTIALLY_ACCREDITED",
  "IN_PROCESS",
  "NOT_ACCREDITED",
  "ACCREDITATION_EXPIRED",
]);

// Hospital table
export const hospital = pgTable("hospital", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  hospitalType: hospitalTypeEnum("hospital_type").notNull(),
  hospitalLevel: hospitalLevelEnum("hospital_level").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  establishedDate: date("established_date"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // Ministry of Health, etc.
  panNumber: varchar("pan_number", { length: 20 }),
  ownership: text("ownership"), // Government, private company name, etc.
  affiliatedInstitution: text("affiliated_institution"), // University or larger hospital system

  // Contact information
  phoneNumber: text("phone_number"),
  emergencyNumber: text("emergency_number"),
  ambulanceNumber: text("ambulance_number"),
  faxNumber: text("fax_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Social media and online presence
  facebookHandle: text("facebook_handle"),
  twitterHandle: text("twitter_handle"),
  instagramHandle: text("instagram_handle"),

  // Operating hours
  isOpen24Hours: boolean("is_open_24_hours").default(true),
  outpatientOpeningTime: time("outpatient_opening_time"),
  outpatientClosingTime: time("outpatient_closing_time"),
  outpatientOpenDays: text("outpatient_open_days"),
  emergencyHours: text("emergency_hours"),

  // Physical infrastructure
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
  buildingCount: integer("building_count"),
  mainBuildingFloors: integer("main_building_floors"),
  buildingCondition: hospitalBuildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  hasEmergencyBuilding: boolean("has_emergency_building").default(false),
  hasOutpatientBuilding: boolean("has_outpatient_building").default(false),
  hasAdministrativeBuilding: boolean("has_administrative_building").default(
    false,
  ),
  hasStaffQuarters: boolean("has_staff_quarters").default(false),
  hasOtherBuildings: boolean("has_other_buildings").default(false),
  otherBuildingsDetails: text("other_buildings_details"),

  // Capacity and beds
  totalBedCount: integer("total_bed_count"),
  generalBedCount: integer("general_bed_count"),
  privateBedCount: integer("private_bed_count"),
  icuBedCount: integer("icu_bed_count"),
  nicuBedCount: integer("nicu_bed_count"),
  picuBedCount: integer("picu_bed_count"),
  emergencyBedCount: integer("emergency_bed_count"),
  maternityBedCount: integer("maternity_bed_count"),
  isolationBedCount: integer("isolation_bed_count"),
  ventilatorCount: integer("ventilator_count"),
  bedOccupancyRatePercent: decimal("bed_occupancy_rate_percent", {
    precision: 5,
    scale: 2,
  }),
  averageLengthOfStayDays: decimal("average_length_of_stay_days", {
    precision: 5,
    scale: 2,
  }),
  annualAdmissionCount: integer("annual_admission_count"),
  annualOutpatientCount: integer("annual_outpatient_count"),
  annualEmergencyCount: integer("annual_emergency_count"),
  annualSurgeryCount: integer("annual_surgery_count"),
  annualDeliveryCount: integer("annual_delivery_count"),

  // Departments and services
  hasCasualtyDepartment: boolean("has_casualty_department").default(false),
  hasGeneralMedicine: boolean("has_general_medicine").default(false),
  hasGeneralSurgery: boolean("has_general_surgery").default(false),
  hasObstetrics: boolean("has_obstetrics").default(false),
  hasGynecology: boolean("has_gynecology").default(false),
  hasPediatrics: boolean("has_pediatrics").default(false),
  hasOrthopedics: boolean("has_orthopedics").default(false),
  hasENT: boolean("has_ent").default(false),
  hasOphthalmology: boolean("has_ophthalmology").default(false),
  hasDermatology: boolean("has_dermatology").default(false),
  hasPsychiatry: boolean("has_psychiatry").default(false),
  hasDentalServices: boolean("has_dental_services").default(false),
  hasCardiology: boolean("has_cardiology").default(false),
  hasNeurology: boolean("has_neurology").default(false),
  hasOncology: boolean("has_oncology").default(false),
  hasNICU: boolean("has_nicu").default(false),
  hasICU: boolean("has_icu").default(false),
  hasCCU: boolean("has_ccu").default(false),
  hasHDU: boolean("has_hdu").default(false),
  hasPathology: boolean("has_pathology").default(false),
  hasRadiology: boolean("has_radiology").default(false),
  hasPhysiotherapy: boolean("has_physiotherapy").default(false),
  hasEmergencyServices: boolean("has_emergency_services").default(false),
  emergencyServiceLevel: emergencyServiceLevelEnum("emergency_service_level"),
  otherDepartments: text("other_departments"),

  // Diagnostic facilities
  hasLaboratory: boolean("has_laboratory").default(false),
  hasXRay: boolean("has_x_ray").default(false),
  hasUltrasound: boolean("has_ultrasound").default(false),
  hasCTScan: boolean("has_ct_scan").default(false),
  hasMRI: boolean("has_mri").default(false),
  hasECG: boolean("has_ecg").default(false),
  hasEEG: boolean("has_eeg").default(false),
  hasMammography: boolean("has_mammography").default(false),
  hasEndoscopy: boolean("has_endoscopy").default(false),
  hasDialysis: boolean("has_dialysis").default(false),
  dialysisUnitCount: integer("dialysis_unit_count"),
  otherDiagnosticFacilities: text("other_diagnostic_facilities"),

  // Surgery and specialized services
  hasOperationTheater: boolean("has_operation_theater").default(false),
  operationTheaterCount: integer("operation_theater_count"),
  hasLaparoscopy: boolean("has_laparoscopy").default(false),
  hasBloodBank: boolean("has_blood_bank").default(false),
  bloodBankType: text("blood_bank_type"),
  hasAmbulanceService: boolean("has_ambulance_service").default(false),
  ambulanceCount: integer("ambulance_count"),

  // Staff details
  totalStaffCount: integer("total_staff_count"),
  doctorCount: integer("doctor_count"),
  specialistDoctorCount: integer("specialist_doctor_count"),
  nurseCount: integer("nurse_count"),
  paramedicCount: integer("paramedic_count"),
  labTechnicianCount: integer("lab_technician_count"),
  radiographerCount: integer("radiographer_count"),
  pharmacistCount: integer("pharmacist_count"),
  administrativeStaffCount: integer("administrative_staff_count"),
  supportStaffCount: integer("support_staff_count"),
  femaleStaffPercentage: integer("female_staff_percentage"),
  vacantPositions: integer("vacant_positions"),
  doctorBedsRatio: decimal("doctor_beds_ratio", { precision: 6, scale: 2 }),
  nurseBedsRatio: decimal("nurse_beds_ratio", { precision: 6, scale: 2 }),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"), // E.g., "Generator", "Solar", "UPS"
  powerBackupCapacityKW: decimal("power_backup_capacity_kw", {
    precision: 10,
    scale: 2,
  }),
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterSourceType: text("water_source_type"), // E.g., "Municipal", "Well", "Tanker"
  hasWaterTreatment: boolean("has_water_treatment").default(false),
  hasHeating: boolean("has_heating").default(false),
  hasCooling: boolean("has_cooling").default(false),
  hasOxygenSupply: boolean("has_oxygen_supply").default(false),
  oxygenSupplyType: text("oxygen_supply_type"), // Central, cylinders, concentrators
  hasOxygenPlant: boolean("has_oxygen_plant").default(false),
  oxygenPlantCapacity: text("oxygen_plant_capacity"),

  // Facility improvements
  hasWaitingArea: boolean("has_waiting_area").default(false),
  waitingAreaCapacity: integer("waiting_area_capacity"),
  hasPublicToilets: boolean("has_public_toilets").default(false),
  toiletCount: integer("toilet_count"),
  hasCanteen: boolean("has_canteen").default(false),
  hasPharmacy: boolean("has_pharmacy").default(false),
  isPharmacy24Hours: boolean("is_pharmacy_24_hours").default(false),
  hasATM: boolean("has_atm").default(false),
  hasParking: boolean("has_parking").default(false),
  parkingCapacity: integer("parking_capacity"),
  hasAmbulanceParking: boolean("has_ambulance_parking").default(false),
  hasHelicopterLandingFacility: boolean(
    "has_helicopter_landing_facility",
  ).default(false),

  // Digital infrastructure
  hasElectronicHealthRecords: boolean("has_electronic_health_records").default(
    false,
  ),
  ehrSystemName: text("ehr_system_name"),
  hasHospitalManagementSystem: boolean(
    "has_hospital_management_system",
  ).default(false),
  hmsSystemName: text("hms_system_name"),
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetType: text("internet_type"), // E.g., "Fiber", "DSL", "4G"
  internetSpeed: text("internet_speed"), // E.g., "10 Mbps", "100 Mbps"
  hasTelemedecineService: boolean("has_telemedecine_service").default(false),
  telemedicineDetails: text("telemedicine_details"),
  hasPACSSystem: boolean("has_pacs_system").default(false), // Picture archiving and communication system
  hasBiometricAttendance: boolean("has_biometric_attendance").default(false),
  hasCCTVCoverage: boolean("has_cctv_coverage").default(false),

  // Quality and standards
  accreditationStatus: accreditationStatusEnum("accreditation_status"),
  accreditingBody: text("accrediting_body"),
  lastAccreditationYear: integer("last_accreditation_year"),
  hasInfectionControl: boolean("has_infection_control").default(false),
  infectionControlProtocols: text("infection_control_protocols"),
  hasQualityAssuranceTeam: boolean("has_quality_assurance_team").default(false),
  qualityAssuranceDetails: text("quality_assurance_details"),
  hasWasteManagement: boolean("has_waste_management").default(false),
  wasteManagementDetails: text("waste_management_details"),
  hasMortalityReview: boolean("has_mortality_review").default(false),
  patientSatisfactionMeasurement: boolean(
    "patient_satisfaction_measurement",
  ).default(false),
  patientSatisfactionPercent: integer("patient_satisfaction_percent"),

  // Financial aspects
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  governmentFundingPercentage: integer("government_funding_percentage"),
  donorFundingPercentage: integer("donor_funding_percentage"),
  patientFeePercentage: integer("patient_fee_percentage"),
  hasInsuranceAcceptance: boolean("has_insurance_acceptance").default(false),
  acceptedInsuranceProviders: text("accepted_insurance_providers"),
  hasFreeServices: boolean("has_free_services").default(false),
  freeServicesDetails: text("free_services_details"),
  hasSubsidyPrograms: boolean("has_subsidy_programs").default(false),
  subsidyDetails: text("subsidy_details"),
  averageOutpatientFeeNPR: decimal("average_outpatient_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  averageInpatientDailyFeeNPR: decimal("average_inpatient_daily_fee_npr", {
    precision: 10,
    scale: 2,
  }),

  // Public health activities
  providesImmunization: boolean("provides_immunization").default(false),
  providesFamilyPlanning: boolean("provides_family_planning").default(false),
  providesAntenatalCare: boolean("provides_antenatal_care").default(false),
  providesNutritionPrograms: boolean("provides_nutrition_programs").default(
    false,
  ),
  providesHealthEducation: boolean("provides_health_education").default(false),
  providesOutreachPrograms: boolean("provides_outreach_programs").default(
    false,
  ),
  outreachProgramDetails: text("outreach_program_details"),
  runsCommunityPrograms: boolean("runs_community_programs").default(false),
  communityProgramDetails: text("community_program_details"),

  // Teaching and research
  isTeachingHospital: boolean("is_teaching_hospital").default(false),
  teachingPrograms: text("teaching_programs"),
  hasResearchActivities: boolean("has_research_activities").default(false),
  researchFocusAreas: text("research_focus_areas"),
  publishedPapersCount: integer("published_papers_count"),

  // Disasters and emergencies
  hasDisasterManagementPlan: boolean("has_disaster_management_plan").default(
    false,
  ),
  disasterManagementDetails: text("disaster_management_details"),
  hasMassCalsualty: boolean("has_mass_calsualty_management").default(false),
  hasEarthquakeResistantBuilding: boolean(
    "has_earthquake_resistant_building",
  ).default(false),
  earthquakeProtectionDetails: text("earthquake_protection_details"),

  // Challenges and needs
  infrastructureChallenges: text("infrastructure_challenges"),
  equipmentChallenges: text("equipment_challenges"),
  staffingChallenges: text("staffing_challenges"),
  supplyChainChallenges: text("supply_chain_challenges"),
  fundingChallenges: text("funding_challenges"),
  qualityChallenges: text("quality_challenges"),
  otherChallenges: text("other_challenges"),
  immediateNeeds: text("immediate_needs"),

  // Future development
  expansionPlans: text("expansion_plans"),
  upgradeNeeds: text("upgrade_needs"),
  futureDepartments: text("future_departments"),
  technologyImprovementPlans: text("technology_improvement_plans"),

  // Hospital specialty and focus areas
  specialtyAreas: text("specialty_areas"),
  centerOfExcellenceAreas: text("center_of_excellence_areas"),
  uniqueServices: text("unique_services"),

  // Coordination and referrals
  referralHospitals: text("referral_hospitals"),
  collaboratingInstitutions: text("collaborating_institutions"),
  partOfHealthNetwork: boolean("part_of_health_network").default(false),
  healthNetworkDetails: text("health_network_details"),

  // Recent significant changes
  recentUpgrades: text("recent_upgrades"),
  recentEquipmentAdditions: text("recent_equipment_additions"),
  recentStaffChanges: text("recent_staff_changes"),

  // External support and linkages
  externalDonorSupport: text("external_donor_support"),
  ngoPartnerships: text("ngo_partnerships"),
  internationalAffiliations: text("international_affiliations"),

  // Linkages to other entities
  linkedMunicipalityOffices: jsonb("linked_municipality_offices").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedHealthInstitutions: jsonb("linked_health_institutions").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  campusArea: geometry("campus_area", { type: "Polygon" }),

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

export type Hospital = typeof hospital.$inferSelect;
export type NewHospital = typeof hospital.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
