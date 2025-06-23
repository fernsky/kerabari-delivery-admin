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

// Define clinic type enum
export const clinicTypeEnum = pgEnum("clinic_type", [
  "GENERAL_CLINIC",
  "DENTAL_CLINIC",
  "EYE_CLINIC",
  "MATERNAL_CHILD_HEALTH_CLINIC",
  "SPECIALIST_CLINIC",
  "POLYCLINIC",
  "DIAGNOSTIC_CLINIC",
  "AYURVEDIC_CLINIC",
  "HOMEOPATHIC_CLINIC",
  "PHYSIOTHERAPY_CLINIC",
  "MENTAL_HEALTH_CLINIC",
  "FAMILY_PLANNING_CLINIC",
  "VACCINATION_CLINIC",
  "MOBILE_CLINIC",
  "TELEMEDICINE_CLINIC",
  "OTHER",
]);

// Define ownership type enum
export const clinicOwnershipEnum = pgEnum("clinic_ownership", [
  "GOVERNMENT",
  "PRIVATE",
  "COMMUNITY",
  "NGO",
  "COOPERATIVE",
  "RELIGIOUS",
  "PUBLIC_PRIVATE_PARTNERSHIP",
  "UNIVERSITY",
  "INSURANCE_COMPANY",
  "OTHER",
]);

// Define building condition enum
export const clinicBuildingConditionEnum = pgEnum("clinic_building_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_MAINTENANCE",
  "POOR",
  "UNDER_CONSTRUCTION",
  "UNDER_RENOVATION",
  "TEMPORARY",
]);

// Define service availability enum
export const clinicServiceAvailabilityEnum = pgEnum("service_availability", [
  "ALWAYS_AVAILABLE",
  "REGULAR_HOURS",
  "SCHEDULED_DAYS",
  "ON_CALL",
  "LIMITED_HOURS",
  "SEASONAL",
  "NOT_CURRENTLY_AVAILABLE",
]);

// Define accessibility level enum
export const clinicAccessibilityEnum = pgEnum("clinic_accessibility", [
  "HIGHLY_ACCESSIBLE",
  "MODERATELY_ACCESSIBLE",
  "LIMITED_ACCESSIBILITY",
  "POORLY_ACCESSIBLE",
  "NOT_ACCESSIBLE",
]);

// Define quality standard enum
export const qualityStandardEnum = pgEnum("quality_standard", [
  "EXCELLENT",
  "GOOD",
  "SATISFACTORY",
  "NEEDS_IMPROVEMENT",
  "POOR",
  "NOT_ASSESSED",
]);

// Clinic table
export const clinic = pgTable("clinic", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  clinicType: clinicTypeEnum("clinic_type").notNull(),
  specialization: text("specialization"), // Additional specialization details

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // Which govt body it's registered with
  establishedDate: date("established_date"),
  ownership: clinicOwnershipEnum("ownership").notNull(),
  ownerName: text("owner_name"),
  parentInstitutionId: varchar("parent_institution_id", { length: 36 }), // If part of a larger health facility
  parentInstitutionName: text("parent_institution_name"),
  isStandalone: boolean("is_standalone").default(true),
  catchmentPopulation: integer("catchment_population"), // Estimated population served
  catchmentAreaDescription: text("catchment_area_description"),

  // Contact information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  emergencyContactNumber: text("emergency_contact_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Social media and online presence
  facebookHandle: text("facebook_handle"),
  twitterHandle: text("twitter_handle"),
  instagramHandle: text("instagram_handle"),
  youtubeChannel: text("youtube_channel"),
  hasOnlineAppointment: boolean("has_online_appointment").default(false),
  onlineAppointmentDetails: text("online_appointment_details"),

  // Operating hours
  operatingDays: text("operating_days"), // E.g., "Monday-Friday"
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  hasShiftSystem: boolean("has_shift_system").default(false),
  shiftDetails: text("shift_details"),
  is24HourService: boolean("is_24_hour_service").default(false),
  averageWaitTimeMinutes: integer("average_wait_time_minutes"),
  appointmentSystem: boolean("appointment_system").default(false),
  appointmentSystemDetails: text("appointment_system_details"),

  // Infrastructure
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", "Donated", etc.
  buildingCondition: clinicBuildingConditionEnum("building_condition"),
  totalFloors: integer("total_floors"),
  totalRooms: integer("total_rooms"),
  buildingAreaSqm: decimal("building_area_sq_m", { precision: 10, scale: 2 }),
  constructionYear: integer("construction_year"),
  lastRenovationYear: integer("last_renovation_year"),
  consultationRoomsCount: integer("consultation_rooms_count"),
  procedureRoomsCount: integer("procedure_rooms_count"),
  waitingAreaCapacity: integer("waiting_area_capacity"),
  hasReceptionArea: boolean("has_reception_area").default(true),
  hasSeparateConsultationRooms: boolean(
    "has_separate_consultation_rooms",
  ).default(true),
  hasWaitingRoom: boolean("has_waiting_room").default(true),
  hasPatientToilets: boolean("has_patient_toilets").default(true),
  hasSeparateToiletsForGenders: boolean(
    "has_separate_toilets_for_genders",
  ).default(false),
  hasRamp: boolean("has_ramp").default(false),
  hasWheelchairAccess: boolean("has_wheelchair_access").default(false),
  hasAdequateVentilation: boolean("has_adequate_ventilation").default(true),
  hasProperLighting: boolean("has_proper_lighting").default(true),

  // Basic utilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"), // Generator, inverter, etc.
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterSourceType: text("water_source_type"), // Municipal, well, etc.
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetSpeed: text("internet_speed"), // E.g., "10 Mbps"
  hasWasteManagementSystem: boolean("has_waste_management_system").default(
    false,
  ),
  wasteManagementDetails: text("waste_management_details"),
  hasBiomedicalWasteManagement: boolean(
    "has_biomedical_waste_management",
  ).default(false),

  // Services
  primaryServices: text("primary_services"), // Main services offered, comma-separated
  hasLaboratoryServices: boolean("has_laboratory_services").default(false),
  laboratoryServicesDetails: text("laboratory_services_details"),
  hasDiagnosticServices: boolean("has_diagnostic_services").default(false),
  diagnosticServicesDetails: text("diagnostic_services_details"),
  hasPharmacy: boolean("has_pharmacy").default(false),
  pharmacyDetails: text("pharmacy_details"),
  hasVaccinationServices: boolean("has_vaccination_services").default(false),
  vaccinationServicesDetails: text("vaccination_services_details"),
  hasMaternalServices: boolean("has_maternal_services").default(false),
  maternalServicesDetails: text("maternal_services_details"),
  hasChildHealthServices: boolean("has_child_health_services").default(false),
  childHealthServicesDetails: text("child_health_services_details"),
  hasEmergencyServices: boolean("has_emergency_services").default(false),
  emergencyServicesDetails: text("emergency_services_details"),
  hasReferralSystem: boolean("has_referral_system").default(false),
  referralSystemDetails: text("referral_system_details"),
  commonTreatmentsProvided: text("common_treatments_provided"),
  additionalSpecializedServices: text("additional_specialized_services"),
  communityOutreachActivities: text("community_outreach_activities"),
  healthEducationPrograms: text("health_education_programs"),

  // Medical equipment
  hasMedicalEquipment: boolean("has_medical_equipment").default(true),
  basicEquipmentList: text("basic_equipment_list"),
  specializedEquipmentList: text("specialized_equipment_list"),
  equipmentCondition: text("equipment_condition"),
  equipmentMaintenanceProcess: text("equipment_maintenance_process"),
  mainEquipmentNeeds: text("main_equipment_needs"),

  // Human resources
  totalStaffCount: integer("total_staff_count"),
  doctorCount: integer("doctor_count"),
  specialistDoctorCount: integer("specialist_doctor_count"),
  specialistDetails: text("specialist_details"),
  nurseCount: integer("nurse_count"),
  healthAssistantCount: integer("health_assistant_count"),
  labTechnicianCount: integer("lab_technician_count"),
  pharmacistCount: integer("pharmacist_count"),
  receptionStaffCount: integer("reception_staff_count"),
  otherStaffCount: integer("other_staff_count"),
  femaleMedicalStaffCount: integer("female_medical_staff_count"),
  administrativeStaffCount: integer("administrative_staff_count"),
  staffingAdequacy: text("staffing_adequacy"), // Assessment of staffing levels
  mainStaffingChallenges: text("main_staffing_challenges"),

  // Patient statistics
  averageDailyPatients: integer("average_daily_patients"),
  annualPatientCount: integer("annual_patient_count"),
  femalePatientPercentage: integer("female_patient_percentage"),
  childPatientPercentage: integer("child_patient_percentage"),
  elderlyPatientPercentage: integer("elderly_patient_percentage"),
  mostCommonDiagnoses: text("most_common_diagnoses"),
  patientRecordSystem: text("patient_record_system"), // Paper-based, digital, etc.
  hasElectronicRecords: boolean("has_electronic_records").default(false),
  electronicRecordSystemDetails: text("electronic_record_system_details"),

  // Fees and financial aspects
  consultationFeeRange: text("consultation_fee_range"), // E.g., "NPR 200-500"
  averageConsultationFeeNPR: decimal("average_consultation_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  hasInsuranceAcceptance: boolean("has_insurance_acceptance").default(false),
  insuranceDetails: text("insurance_details"),
  acceptedPaymentMethods: text("accepted_payment_methods"),
  hasDigitalPayment: boolean("has_digital_payment").default(false),
  digitalPaymentDetails: text("digital_payment_details"),
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  revenueSourcesDetails: text("revenue_sources_details"),
  financialSustainabilityStatus: text("financial_sustainability_status"),

  // Quality and standards
  isRegisteredWithNMC: boolean("is_registered_with_nmc").default(false), // Nepal Medical Council
  nmcRegistrationDetails: text("nmc_registration_details"),
  hasCertifications: boolean("has_certifications").default(false),
  certificationDetails: text("certification_details"),
  qualityAssuranceMechanisms: text("quality_assurance_mechanisms"),
  infectionControlProtocols: text("infection_control_protocols"),
  patientSafetyMeasures: text("patient_safety_measures"),
  serviceQualityStandard: qualityStandardEnum("service_quality_standard"),
  lastQualityAssessmentDate: date("last_quality_assessment_date"),
  qualityImprovementPlans: text("quality_improvement_plans"),

  // Medicine and supplies
  essentialMedicineAvailability: text("essential_medicine_availability"),
  medicineSourceDetails: text("medicine_source_details"),
  hasAdequateSupplyChain: boolean("has_adequate_supply_chain").default(true),
  supplyChainChallenges: text("supply_chain_challenges"),
  medicineStorageCondition: text("medicine_storage_condition"),
  coldChainAvailability: boolean("cold_chain_availability").default(false),
  coldChainDetails: text("cold_chain_details"),

  // Accessibility and inclusion
  accessibilityLevel: clinicAccessibilityEnum("accessibility_level"),
  distanceFromMainRoadKm: decimal("distance_from_main_road_km", {
    precision: 6,
    scale: 2,
  }),
  distanceFromNearestHospitalKm: decimal("distance_from_nearest_hospital_km", {
    precision: 6,
    scale: 2,
  }),
  publicTransportAccessibility: text("public_transport_accessibility"),
  hasParkingFacility: boolean("has_parking_facility").default(false),
  parkingCapacity: integer("parking_capacity"),
  genderSensitiveServices: text("gender_sensitive_services"),
  disabilityFriendlyFeatures: text("disability_friendly_features"),
  affordabilityMeasures: text("affordability_measures"),

  // Challenges and needs
  infrastructureChallenges: text("infrastructure_challenges"),
  serviceChallenges: text("service_challenges"),
  equipmentChallenges: text("equipment_challenges"),
  humanResourceChallenges: text("human_resource_challenges"),
  financialChallenges: text("financial_challenges"),
  priorityNeeds: text("priority_needs"),
  supportRequired: text("support_required"),

  // Future plans
  expansionPlans: text("expansion_plans"),
  serviceImprovementPlans: text("service_improvement_plans"),
  technologyUpgradePlans: text("technology_upgrade_plans"),
  staffCapacityBuildingPlans: text("staff_capacity_building_plans"),

  // Community engagement
  communityFeedbackMechanism: boolean("community_feedback_mechanism").default(
    false,
  ),
  communityFeedbackDetails: text("community_feedback_details"),
  patientSatisfactionLevel: text("patient_satisfaction_level"), // High, moderate, low
  communityOutreachPrograms: text("community_outreach_programs"),
  preventiveHealthPrograms: text("preventive_health_programs"),
  healthAwarenessActivities: text("health_awareness_activities"),

  // COVID-19 and emergency response
  covidResponseMeasures: text("covid_response_measures"),
  hasCovid19Testing: boolean("has_covid19_testing").default(false),
  covid19VaccinationAvailable: boolean("covid19_vaccination_available").default(
    false,
  ),
  disasterPreparednessLevel: text("disaster_preparedness_level"), // High, moderate, low
  emergencyResponseProtocols: text("emergency_response_protocols"),

  // Linkages to other health systems
  referralHospitals: text("referral_hospitals"),
  linkedHealthNetworks: text("linked_health_networks"),
  publicPrivatePartnership: text("public_private_partnership"),
  linkedAmbulanceServices: text("linked_ambulance_services"),
  governmentProgramParticipation: text("government_program_participation"),

  // Linkages to other entities
  linkedHealthFacilities: jsonb("linked_health_facilities").default(
    sql`'[]'::jsonb`,
  ),
  linkedPharmacies: jsonb("linked_pharmacies").default(sql`'[]'::jsonb`),
  linkedSchools: jsonb("linked_schools").default(sql`'[]'::jsonb`),
  linkedCommunityGroups: jsonb("linked_community_groups").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  serviceAreaPolygon: geometry("service_area_polygon", {
    type: "MultiPolygon",
  }),

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

export type Clinic = typeof clinic.$inferSelect;
export type NewClinic = typeof clinic.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
