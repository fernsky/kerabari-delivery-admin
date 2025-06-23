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
  digitalInfrastructureLevelEnum,
  servicePerformanceEnum,
} from "./municipality-offices";
import { buildingConditionEnum } from "../../common";

// Define administrative office type enum
export const administrativeOfficeTypeEnum = pgEnum(
  "administrative_office_type",
  [
    "DISTRICT_ADMINISTRATION_OFFICE",
    "DISTRICT_COORDINATION_COMMITTEE",
    "AREA_ADMINISTRATION_OFFICE",
    "REVENUE_OFFICE",
    "LAND_REVENUE_OFFICE",
    "DISTRICT_COURT",
    "TRANSPORTATION_MANAGEMENT_OFFICE",
    "DISTRICT_FOREST_OFFICE",
    "DISTRICT_AGRICULTURE_OFFICE",
    "DISTRICT_EDUCATION_OFFICE",
    "DISTRICT_HEALTH_OFFICE",
    "DISTRICT_VETERINARY_OFFICE",
    "DISTRICT_POSTAL_OFFICE",
    "DISTRICT_TREASURY_OFFICE",
    "DISTRICT_ELECTION_OFFICE",
    "DISTRICT_STATISTICS_OFFICE",
    "DISASTER_MANAGEMENT_OFFICE",
    "IMMIGRATION_OFFICE",
    "POLICE_OFFICE",
    "ARMED_POLICE_OFFICE",
    "ARMY_OFFICE",
    "DISTRICT_ATTORNEY_OFFICE",
    "DISTRICT_GOVERNMENT_ATTORNEY_OFFICE",
    "DISTRICT_LAND_SURVEY_OFFICE",
    "SMALL_COTTAGE_INDUSTRY_OFFICE",
    "INLAND_REVENUE_OFFICE",
    "IRRIGATION_OFFICE",
    "DRINKING_WATER_OFFICE",
    "ROAD_DIVISION_OFFICE",
    "ELECTRICITY_AUTHORITY_OFFICE",
    "TELECOMMUNICATIONS_OFFICE",
    "DISTRICT_DEVELOPMENT_COMMITTEE",
    "OTHER",
  ],
);

// Define jurisdiction level enum
export const jurisdictionLevelEnum = pgEnum("jurisdiction_level", [
  "DISTRICT_LEVEL",
  "SUB_DISTRICT_LEVEL",
  "MUNICIPAL_LEVEL",
  "WARD_LEVEL",
  "MULTI_DISTRICT_LEVEL",
  "PROVINCIAL_LEVEL",
  "FEDERAL_LEVEL",
]);

// Define case/service volume enum
export const serviceVolumeEnum = pgEnum("service_volume", [
  "VERY_HIGH",
  "HIGH",
  "MEDIUM",
  "LOW",
  "VERY_LOW",
  "VARIABLE",
]);

// Define workload capacity enum
export const workloadCapacityEnum = pgEnum("workload_capacity", [
  "ABOVE_CAPACITY",
  "AT_CAPACITY",
  "MODERATE_CAPACITY",
  "UNDER_CAPACITY",
  "SEVERELY_CONSTRAINED",
]);

// Administrative Office table
export const administrativeOffice = pgTable("administrative_office", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  officeType: administrativeOfficeTypeEnum("office_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  officeCode: varchar("office_code", { length: 20 }), // Official code
  establishedDate: date("established_date"),
  parentOfficeId: varchar("parent_office_id", { length: 36 }), // For hierarchical relationship
  parentMinistry: text("parent_ministry"), // Which ministry it reports to
  jurisdictionLevel: jurisdictionLevelEnum("jurisdiction_level").notNull(),
  jurisdictionAreas: text("jurisdiction_areas"), // Description of areas covered
  populationServed: integer("population_served"), // Estimated population served

  // Leadership and management
  officeHeadName: text("office_head_name"),
  officeHeadTitle: text("office_head_title"), // Chief District Officer, etc.
  officeHeadAppointmentDate: date("office_head_appointment_date"),
  officeHeadContactNumber: text("office_head_contact_number"),

  // Contact information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  emergencyContactNumber: text("emergency_contact_number"),
  faxNumber: text("fax_number"),
  email: text("email"),
  websiteUrl: text("website_url"),
  poBoxNumber: text("po_box_number"),

  // Social media and online presence
  facebookHandle: text("facebook_handle"),
  twitterHandle: text("twitter_handle"),
  otherSocialMedia: text("other_social_media"),

  // Operating hours
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  isOpenOnWeekends: boolean("is_open_on_weekends").default(false),
  weeklyOffDays: text("weekly_off_days"), // E.g., "Saturday" or "Sunday"
  holidaySchedule: text("holiday_schedule"), // Description of holiday closures

  // Office infrastructure
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", etc.
  buildingType: text("building_type"), // E.g., "Modern", "Traditional", "Hybrid"
  buildingCondition: buildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  totalFloors: integer("total_floors"),
  totalRooms: integer("total_rooms"),
  totalOfficeAreaSqm: decimal("total_office_area_sqm", {
    precision: 10,
    scale: 2,
  }),
  hasDisabledAccess: boolean("has_disabled_access").default(false),
  securityInfrastructure: text("security_infrastructure"),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"), // E.g., "Generator", "Solar", "UPS"
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterSourceType: text("water_source_type"), // E.g., "Municipal", "Well", "Tanker"
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetType: text("internet_type"), // E.g., "Fiber", "DSL", "4G"
  internetSpeed: text("internet_speed"), // E.g., "10 Mbps", "100 Mbps"
  hasHeatingSystem: boolean("has_heating_system").default(false),
  hasCoolingSystem: boolean("has_cooling_system").default(false),

  // Public facilities
  hasPublicWaitingArea: boolean("has_public_waiting_area").default(false),
  waitingAreaCapacity: integer("waiting_area_capacity"),
  hasPublicToilets: boolean("has_public_toilets").default(false),
  hasHandicapToilets: boolean("has_handicap_toilets").default(false),
  hasPublicWifi: boolean("has_public_wifi").default(false),
  hasDrinkingWater: boolean("has_drinking_water").default(false),
  hasHelpDesk: boolean("has_help_desk").default(false),
  hasTokenSystem: boolean("has_token_system").default(false),
  hasFeedbackSystem: boolean("has_feedback_system").default(false),
  hasNoticeBoard: boolean("has_notice_board").default(true),
  hasCafeteria: boolean("has_cafeteria").default(false),
  hasChildcareArea: boolean("has_childcare_area").default(false),

  // Digital infrastructure
  digitalInfrastructureLevel: digitalInfrastructureLevelEnum(
    "digital_infrastructure_level",
  ),
  hasBiometricAttendance: boolean("has_biometric_attendance").default(false),
  hasCctv: boolean("has_cctv").default(false),
  cctvCameraCount: integer("cctv_camera_count"),
  hasEGovernance: boolean("has_e_governance").default(false),
  eGovernanceDetails: text("e_governance_details"),
  hasDigitalPayment: boolean("has_digital_payment").default(false),
  digitalPaymentMethods: text("digital_payment_methods"),
  hasOnlineApplications: boolean("has_online_applications").default(false),
  onlineServicesOffered: text("online_services_offered"),
  hasDigitalRecordKeeping: boolean("has_digital_record_keeping").default(false),
  digitalRecordPercentage: integer("digital_record_percentage"), // 0-100
  hasWebPortal: boolean("has_web_portal").default(false),
  webPortalServices: text("web_portal_services"),
  hasMobileApp: boolean("has_mobile_app").default(false),
  mobileAppServices: text("mobile_app_services"),
  hasVideoConferencing: boolean("has_video_conferencing").default(false),

  // Staff details
  totalStaffCount: integer("total_staff_count"),
  gazetedOfficersCount: integer("gazeted_officers_count"),
  nonGazetedStaffCount: integer("non_gazeted_staff_count"),
  technicalStaffCount: integer("technical_staff_count"),
  administrativeStaffCount: integer("administrative_staff_count"),
  supportStaffCount: integer("support_staff_count"),
  contractStaffCount: integer("contract_staff_count"),
  vacantPositions: integer("vacant_positions"),
  maleStaffCount: integer("male_staff_count"),
  femaleStaffCount: integer("female_staff_count"),
  otherGenderStaffCount: integer("other_gender_staff_count"),
  staffTrainingFrequency: text("staff_training_frequency"),
  staffingAdequacy: text("staffing_adequacy"), // Assessment of staffing levels
  staffQualificationDetails: text("staff_qualification_details"),

  // Services and workload
  serviceVolumeLevel: serviceVolumeEnum("service_volume_level"),
  averageDailyCitizensServed: integer("average_daily_citizens_served"),
  averageCaseProcessingTimeHours: decimal(
    "average_case_processing_time_hours",
    {
      precision: 6,
      scale: 2,
    },
  ),
  monthlyAverageApplications: integer("monthly_average_applications"),
  monthlyAverageCasesResolved: integer("monthly_average_cases_resolved"),
  pendingCasesCount: integer("pending_cases_count"),
  oldestPendingCaseMonths: integer("oldest_pending_case_months"),
  workloadCapacity: workloadCapacityEnum("workload_capacity"),
  serviceEfficiency: servicePerformanceEnum("service_efficiency"),

  // Services offered (will vary by office type)
  mainServicesOffered: text("main_services_offered"),
  servicesCategorization: text("services_categorization"),
  hasOnlineServiceTracking: boolean("has_online_service_tracking").default(
    false,
  ),
  hasServiceQualityStandards: boolean("has_service_quality_standards").default(
    false,
  ),
  averageServiceTimeMinutes: integer("average_service_time_minutes"),
  citizenCharterDisplay: boolean("citizen_charter_display").default(true),
  serviceImprovementInitiatives: text("service_improvement_initiatives"),

  // Fees and revenue
  collectionAuthorized: boolean("collection_authorized").default(false),
  revenueCollectionTypeDetails: text("revenue_collection_type_details"),
  annualRevenueCollectionNPR: decimal("annual_revenue_collection_npr", {
    precision: 18,
    scale: 2,
  }),
  feeScheduleDetails: text("fee_schedule_details"),
  revenueGrowthPercent: decimal("revenue_growth_percent", {
    precision: 5,
    scale: 2,
  }), // Year-over-year percentage

  // Budget and finance
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  budgetFiscalYear: varchar("budget_fiscal_year", { length: 9 }), // E.g., "2079/080"
  capitalExpenditureNPR: decimal("capital_expenditure_npr", {
    precision: 18,
    scale: 2,
  }),
  operationalExpenditureNPR: decimal("operational_expenditure_npr", {
    precision: 18,
    scale: 2,
  }),
  externalFundingSources: text("external_funding_sources"),
  fundUtilizationRate: decimal("fund_utilization_rate", {
    precision: 5,
    scale: 2,
  }), // Percentage of allocated budget actually spent

  // Assets and equipment
  vehicleCount: integer("vehicle_count"),
  motorbikeCount: integer("motorbike_count"),
  computerCount: integer("computer_count"),
  printerCount: integer("printer_count"),
  photocopierCount: integer("photocopier_count"),
  generatorCount: integer("generator_count"),
  specializedEquipment: text("specialized_equipment"), // Office-specific equipment
  assetManagementSystem: boolean("asset_management_system").default(false),

  // Regulations and compliance
  governingLaws: text("governing_laws"), // List of key laws governing this office
  keyRegulations: text("key_regulations"),
  complianceStatus: text("compliance_status"),
  lastAuditDate: date("last_audit_date"),
  auditComplianceStatus: text("audit_compliance_status"),
  hasCitizenComplaintMechanism: boolean(
    "has_citizen_complaint_mechanism",
  ).default(false),
  complaintResolutionMechanism: text("complaint_resolution_mechanism"),
  annualComplaintsCount: integer("annual_complaints_count"),
  complaintsResolvedPercent: integer("complaints_resolved_percent"), // 0-100

  // Coordination and relationships
  coordinationWithLocalGov: text("coordination_with_local_gov"),
  coordinationWithProvinceGov: text("coordination_with_province_gov"),
  coordinationWithFederalGov: text("coordination_with_federal_gov"),
  interOfficeCoordination: text("inter_office_coordination"),
  coordinatingAgencies: text("coordinating_agencies"), // List of key agencies worked with

  // Public engagement
  publicInformationAvailability: text("public_information_availability"),
  publicAwarenessPrograms: boolean("public_awareness_programs").default(false),
  publicAwarenessProgramDetails: text("public_awareness_program_details"),
  communityOutreachActivities: text("community_outreach_activities"),
  publicConsultationMechanisms: text("public_consultation_mechanisms"),

  // Transparency and anti-corruption
  transparencyMechanisms: text("transparency_mechanisms"),
  antiCorruptionMeasures: text("anti_corruption_measures"),
  rightToInformationOfficer: boolean("right_to_information_officer").default(
    false,
  ),
  publiclyAvailableDocuments: text("publicly_available_documents"),
  hasProactiveDisclosure: boolean("has_proactive_disclosure").default(false),
  disclosureFrequency: text("disclosure_frequency"),

  // Performance and monitoring
  performanceIndicators: text("performance_indicators"),
  monitoringMechanisms: text("monitoring_mechanisms"),
  lastPerformanceEvaluationDate: date("last_performance_evaluation_date"),
  performanceRating: text("performance_rating"),
  citizenSatisfactionPercent: integer("citizen_satisfaction_percent"), // 0-100
  recentAchievements: text("recent_achievements"),

  // Challenges and needs
  majorChallenges: text("major_challenges"),
  infrastructuralNeeds: text("infrastructural_needs"),
  staffingNeeds: text("staffing_needs"),
  technicalNeeds: text("technical_needs"),
  capacityBuildingNeeds: text("capacity_building_needs"),
  fundingNeeds: text("funding_needs"),
  policyReformNeeds: text("policy_reform_needs"),

  // Future plans and strategies
  strategicPlan: boolean("strategic_plan").default(false),
  strategicPlanPeriod: text("strategic_plan_period"), // E.g., "2022-2027"
  futureExpansionPlans: text("future_expansion_plans"),
  digitizationPlans: text("digitization_plans"),
  serviceModernizationPlans: text("service_modernization_plans"),

  // Safety and disaster preparedness
  hasFireSafetyMeasures: boolean("has_fire_safety_measures").default(false),
  fireSafetyMeasuresDetails: text("fire_safety_measures_details"),
  hasEmergencyExits: boolean("has_emergency_exits").default(false),
  emergencyExitCount: integer("emergency_exit_count"),
  hasDisasterPreparednessPlans: boolean(
    "has_disaster_preparedness_plans",
  ).default(false),
  disasterPreparednessDetails: text("disaster_preparedness_details"),
  hasSecurityPersonnel: boolean("has_security_personnel").default(false),
  securityPersonnelCount: integer("security_personnel_count"),

  // For court or justice-related offices
  averageCasePendingMonths: decimal("average_case_pending_months", {
    precision: 6,
    scale: 2,
  }),
  caseDisposalRate: decimal("case_disposal_rate", {
    precision: 5,
    scale: 2,
  }), // Percentage
  hasLegalAidServices: boolean("has_legal_aid_services").default(false),
  legalAidServicesDetails: text("legal_aid_services_details"),
  annualCasesFiledCount: integer("annual_cases_filed_count"),
  annualCasesResolvedCount: integer("annual_cases_resolved_count"),
  totalPendingCases: integer("total_pending_cases"),

  // For security-related offices
  jurisdictionArea: decimal("jurisdiction_area", {
    precision: 10,
    scale: 2,
  }), // Area in sq km
  populationPerOfficerRatio: decimal("population_per_officer_ratio", {
    precision: 10,
    scale: 2,
  }),
  crimeStatisticsAvailable: boolean("crime_statistics_available").default(
    false,
  ),
  crimeRateDetails: text("crime_rate_details"),
  communityPolicingPrograms: boolean("community_policing_programs").default(
    false,
  ),
  communityPolicingDetails: text("community_policing_details"),

  // For land/revenue offices
  annualTransactionsCount: integer("annual_transactions_count"),
  averageTransactionProcessingDays: decimal(
    "average_transaction_processing_days",
    {
      precision: 5,
      scale: 2,
    },
  ),
  hasLandRecordsDigitized: boolean("has_land_records_digitized").default(false),
  landRecordsDigitizationPercent: integer("land_records_digitization_percent"), // 0-100

  // For agriculture/forestry offices
  areaServedHectares: decimal("area_served_hectares", {
    precision: 10,
    scale: 2,
  }),
  farmersServedCount: integer("farmers_served_count"),
  extensionServicesDetails: text("extension_services_details"),
  officeProjectsCount: integer("office_projects_count"),
  beneficiariesCount: integer("beneficiaries_count"),

  // For education/health offices
  institutionsOverseen: integer("institutions_overseen"), // Number of schools/health facilities
  studentsOrPatientsServed: integer("students_or_patients_served"),
  qualityMonitoringMechanisms: text("quality_monitoring_mechanisms"),
  programImplementationDetails: text("program_implementation_details"),

  // Publications and resources
  periodicPublications: text("periodic_publications"),
  publicationsFrequency: text("publications_frequency"),
  hasResourceCenter: boolean("has_resource_center").default(false),
  resourceCenterDetails: text("resource_center_details"),

  // Linkages to other entities
  linkedMunicipalityOffices: jsonb("linked_municipality_offices").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedServiceProviders: jsonb("linked_service_providers").default(
    sql`'[]'::jsonb`,
  ),
  linkedInstitutions: jsonb("linked_institutions").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  jurisdictionAreaGeometry: geometry("jurisdiction_area_geometry", {
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

export type AdministrativeOffice = typeof administrativeOffice.$inferSelect;
export type NewAdministrativeOffice = typeof administrativeOffice.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
