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

// Define school type enum
export const schoolTypeEnum = pgEnum("school_type", [
  "COMMUNITY_PUBLIC",
  "INSTITUTIONAL_PRIVATE",
  "RELIGIOUS",
  "GOVERNMENT_AIDED",
  "COMMUNITY_AIDED",
  "SPECIAL_EDUCATION",
  "TECHNICAL",
  "VOCATIONAL",
  "ALTERNATIVE",
  "OTHER",
]);

// Define school level enum
export const schoolLevelEnum = pgEnum("school_level", [
  "PRE_PRIMARY",
  "PRIMARY",
  "LOWER_SECONDARY",
  "BASIC",
  "SECONDARY",
  "HIGHER_SECONDARY",
  "INTEGRATED",
  "SPECIAL_NEEDS",
]);

// Define medium of instruction enum
export const mediumOfInstructionEnum = pgEnum("medium_of_instruction", [
  "NEPALI",
  "ENGLISH",
  "DUAL_LANGUAGE",
  "MULTILINGUAL",
  "LOCAL_LANGUAGE",
  "OTHER",
]);

// Define building condition enum
export const schoolBuildingConditionEnum = pgEnum("school_building_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_REPAIR",
  "NEEDS_RECONSTRUCTION",
  "UNDER_CONSTRUCTION",
  "TEMPORARY",
]);

// Define facility status enum
export const facilityStatusEnum = pgEnum("facility_status", [
  "EXCELLENT",
  "ADEQUATE",
  "LIMITED",
  "INADEQUATE",
  "NONE",
]);

// Define performance level enum
export const performanceLevelEnum = pgEnum("performance_level", [
  "EXCELLENT",
  "GOOD",
  "AVERAGE",
  "BELOW_AVERAGE",
  "POOR",
]);

// Define earthquake safety standard enum
export const earthquakeSafetyEnum = pgEnum("earthquake_safety", [
  "FULLY_COMPLIANT",
  "RETROFITTED",
  "PARTIALLY_COMPLIANT",
  "NON_COMPLIANT",
  "UNDER_RETROFITTING",
  "NOT_ASSESSED",
]);

// School table
export const school = pgTable("school", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  nameInLocalLanguage: text("name_in_local_language"),
  description: text("description"),
  schoolType: schoolTypeEnum("school_type").notNull(),

  // Basic Information
  schoolLevel: schoolLevelEnum("school_level").notNull(),
  establishedDate: date("established_date"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  panNumber: varchar("pan_number", { length: 20 }),
  affiliationNumber: varchar("affiliation_number", { length: 50 }), // Government registration/affiliation
  affiliatedBoard: text("affiliated_board"), // E.g., "Nepal Education Board", "CBSE"
  mediumOfInstruction: mediumOfInstructionEnum(
    "medium_of_instruction",
  ).notNull(),
  isCoEducational: boolean("is_co_educational").default(true),
  hasHostel: boolean("has_hostel").default(false),
  isResidential: boolean("is_residential").default(false),
  offersDayBoarding: boolean("offers_day_boarding").default(false),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  nearestLandmark: text("nearest_landmark"),

  // Contact Information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Social media
  facebookPage: text("facebook_page"),
  twitterHandle: text("twitter_handle"),
  instagramHandle: text("instagram_handle"),
  youtubeChannel: text("youtube_channel"),

  // Leadership & Management
  principalName: text("principal_name"),
  principalQualification: text("principal_qualification"),
  principalContactNumber: text("principal_contact_number"),
  principalEmail: text("principal_email"),
  chairpersonName: text("chairperson_name"), // For school management committee
  managementType: text("management_type"), // E.g., "Board of Trustees", "Community Committee"

  // Operating hours
  schoolStartTime: time("school_start_time"),
  schoolEndTime: time("school_end_time"),
  weeklyOffDays: text("weekly_off_days"), // E.g., "Saturday" or "Saturday, Sunday"
  shiftsCount: integer("shifts_count"),
  shiftsDetails: text("shifts_details"),

  // Physical Infrastructure
  totalLandAreaSqm: decimal("total_land_area_sqm", { precision: 10, scale: 2 }),
  coveredAreaSqm: decimal("covered_area_sqm", { precision: 10, scale: 2 }),
  playgroundAreaSqm: decimal("playground_area_sqm", {
    precision: 10,
    scale: 2,
  }),
  totalBuildingCount: integer("total_building_count"),
  totalClassroomsCount: integer("total_classrooms_count"),
  totalFloorsCount: integer("total_floors_count"),
  buildingCondition: schoolBuildingConditionEnum("building_condition"),
  constructionType: text("construction_type"), // E.g., "RCC", "Brick and Mortar", "Temporary"
  constructionYear: integer("construction_year"),
  lastRenovationYear: integer("last_renovation_year"),
  hasCompoundWall: boolean("has_compound_wall").default(false),
  hasPlayground: boolean("has_playground").default(false),
  playgroundFacilities: text("playground_facilities"),
  hasSportsField: boolean("has_sports_field").default(false),
  sportsFieldDetails: text("sports_field_details"),

  // Safety and Security
  earthquakeSafetyStandard: earthquakeSafetyEnum("earthquake_safety_standard"),
  hasFireSafetyEquipment: boolean("has_fire_safety_equipment").default(false),
  hasFirstAidKit: boolean("has_first_aid_kit").default(true),
  hasSecurityGuard: boolean("has_security_guard").default(false),
  securityGuardCount: integer("security_guard_count"),
  hasCctv: boolean("has_cctv").default(false),
  cctvCameraCount: integer("cctv_camera_count"),
  hasEmergencyExits: boolean("has_emergency_exits").default(false),
  hasPerimeterFencing: boolean("has_perimeter_fencing").default(false),
  fencingType: text("fencing_type"),
  hasSafetyTraining: boolean("has_safety_training").default(false),

  // Basic Facilities
  hasElectricity: boolean("has_electricity").default(true),
  electricitySourceType: text("electricity_source_type"), // E.g., "Grid", "Solar", "Generator"
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"), // E.g., "Generator", "Inverter", "Solar"
  hasDrinkingWater: boolean("has_drinking_water").default(true),
  waterSourceType: text("water_source_type"), // E.g., "Municipal Supply", "Well", "Tanker"
  hasToilets: boolean("has_toilets").default(true),
  toaletsCount: integer("toilets_count"),
  hasSeparateToiletsForGirls: boolean("has_separate_toilets_for_girls").default(
    false,
  ),
  hasSeparateToiletsForStaff: boolean("has_separate_toilets_for_staff").default(
    false,
  ),
  hasHandwashingFacilities: boolean("has_handwashing_facilities").default(
    false,
  ),
  hasInternetConnectivity: boolean("has_internet_connectivity").default(false),
  internetType: text("internet_type"), // E.g., "Fiber", "DSL", "4G"
  hasCanteen: boolean("has_canteen").default(false),
  hasMidDayMealProgram: boolean("has_mid_day_meal_program").default(false),
  midDayMealDetails: text("mid_day_meal_details"),
  hasDisabledFriendlyAccess: boolean("has_disabled_friendly_access").default(
    false,
  ),
  disabledFriendlyFacilities: text("disabled_friendly_facilities"),

  // Educational Facilities
  hasLibrary: boolean("has_library").default(false),
  libraryBooksCount: integer("library_books_count"),
  libraryAreaSqm: decimal("library_area_sqm", { precision: 8, scale: 2 }),
  hasReadingRoom: boolean("has_reading_room").default(false),
  hasAudioVisualRoom: boolean("has_audio_visual_room").default(false),
  hasScienceLab: boolean("has_science_lab").default(false),
  scienceLabDetails: text("science_lab_details"),
  hasComputerLab: boolean("has_computer_lab").default(false),
  computerLabComputerCount: integer("computer_lab_computer_count"),
  hasChemistryLab: boolean("has_chemistry_lab").default(false),
  hasPhysicsLab: boolean("has_physics_lab").default(false),
  hasBiologyLab: boolean("has_biology_lab").default(false),
  hasLanguageLab: boolean("has_language_lab").default(false),
  hasGeographyLab: boolean("has_geography_lab").default(false),
  hasArtsAndCraftsRoom: boolean("has_arts_and_crafts_room").default(false),
  hasMusicRoom: boolean("has_music_room").default(false),
  hasDanceRoom: boolean("has_dance_room").default(false),
  hasSmartClasses: boolean("has_smart_classes").default(false),
  smartClassesCount: integer("smart_classes_count"),
  smartClassesDetails: text("smart_classes_details"),
  hasProjectors: boolean("has_projectors").default(false),
  projectorsCount: integer("projectors_count"),
  hasTeachingAids: boolean("has_teaching_aids").default(false),
  teachingAidsDetails: text("teaching_aids_details"),

  // Academic Program
  gradesOffered: text("grades_offered"), // E.g., "1-10", "Nursery-12"
  lowestGrade: text("lowest_grade"),
  highestGrade: text("highest_grade"),
  streamOfferings: text("stream_offerings"), // E.g., "Science, Management, Humanities"
  otherSpecialPrograms: text("other_special_programs"),
  hasPrePrimary: boolean("has_pre_primary").default(false),
  prePrimaryDetails: text("pre_primary_details"),
  hasSpecialNeedsProgram: boolean("has_special_needs_program").default(false),
  specialNeedsProgramDetails: text("special_needs_program_details"),

  // Staff details
  totalTeachingStaffCount: integer("total_teaching_staff_count"),
  maleTeachingStaffCount: integer("male_teaching_staff_count"),
  femaleTeachingStaffCount: integer("female_teaching_staff_count"),
  otherGenderTeachingStaffCount: integer("other_gender_teaching_staff_count"),
  permanentTeachingStaffCount: integer("permanent_teaching_staff_count"),
  contractTeachingStaffCount: integer("contract_teaching_staff_count"),
  totalAdministrativeStaffCount: integer("total_administrative_staff_count"),
  totalSupportStaffCount: integer("total_support_staff_count"),
  teacherStudentRatio: text("teacher_student_ratio"), // E.g., "1:25"
  teachersWithProfessionalDegree: integer("teachers_with_professional_degree"),
  teachersTrainingDetails: text("teachers_training_details"),

  // Student Enrollment
  totalStudentCount: integer("total_student_count"),
  maleStudentCount: integer("male_student_count"),
  femaleStudentCount: integer("female_student_count"),
  otherGenderStudentCount: integer("other_gender_student_count"),
  studentsByGradeDetails: text("students_by_grade_details"), // JSON or text representation
  dayscholarsCount: integer("dayscholars_count"),
  boardersCount: integer("boarders_count"),
  specialNeedsStudentsCount: integer("special_needs_students_count"),
  scholarshipStudentsCount: integer("scholarship_students_count"),
  dropoutRate: decimal("dropout_rate", { precision: 5, scale: 2 }), // Percentage
  admissionProcessDetails: text("admission_process_details"),

  // Performance Metrics
  attendanceRate: decimal("attendance_rate", { precision: 5, scale: 2 }), // Percentage
  passRate: decimal("pass_rate", { precision: 5, scale: 2 }), // Percentage
  averageAcademicPerformance: text("average_academic_performance"),
  performanceLevel: performanceLevelEnum("performance_level"),
  nationalExamPerformance: text("national_exam_performance"),
  districtRank: integer("district_rank"),
  extraCurricularAchievements: text("extra_curricular_achievements"),
  significantAlumni: text("significant_alumni"),

  // Extra-curricular Activities
  sportsOffered: text("sports_offered"),
  culturalActivitiesOffered: text("cultural_activities_offered"),
  clubsAndSocieties: text("clubs_and_societies"),
  annualEvents: text("annual_events"),
  communityOutreachPrograms: text("community_outreach_programs"),

  // Financial Aspects
  annualFeesStructure: text("annual_fees_structure"),
  averageAnnualFeesPrimary: decimal("average_annual_fees_primary", {
    precision: 12,
    scale: 2,
  }),
  averageAnnualFeesSecondary: decimal("average_annual_fees_secondary", {
    precision: 12,
    scale: 2,
  }),
  scholarshipProvisions: text("scholarship_provisions"),
  governmentFundedPrograms: text("government_funded_programs"),
  annualBudget: decimal("annual_budget", { precision: 18, scale: 2 }),
  fundingSources: text("funding_sources"),

  // Health and Nutrition
  hasHealthCheckup: boolean("has_health_checkup").default(false),
  healthCheckupFrequency: text("health_checkup_frequency"),
  hasSchoolNurse: boolean("has_school_nurse").default(false),
  hasHealthRoom: boolean("has_health_room").default(false),
  healthEducationPrograms: text("health_education_programs"),
  nutritionPrograms: text("nutrition_programs"),

  // Community and Parent Engagement
  hasPTA: boolean("has_pta").default(false), // Parent-Teacher Association
  ptaMeetingFrequency: text("pta_meeting_frequency"),
  communityInvolvementLevel: text("community_involvement_level"),
  localAuthoritySupport: text("local_authority_support"),
  parentFeedbackMechanism: text("parent_feedback_mechanism"),

  // Transportation
  providesTransportation: boolean("provides_transportation").default(false),
  transportationDetails: text("transportation_details"),
  schoolBusCount: integer("school_bus_count"),
  vanCount: integer("van_count"),
  transportationCoverage: text("transportation_coverage"), // Areas covered

  // Hostel Facilities (if applicable)
  hostelCapacity: integer("hostel_capacity"),
  boysHostelCapacity: integer("boys_hostel_capacity"),
  girlsHostelCapacity: integer("girls_hostel_capacity"),
  hostelFacilities: text("hostel_facilities"),
  hostelsCount: integer("hostels_count"),
  mealsProvidedDaily: integer("meals_provided_daily"),

  // Environmental Aspects
  hasGarden: boolean("has_garden").default(false),
  hasGreenInitiatives: boolean("has_green_initiatives").default(false),
  greenInitiativesDetails: text("green_initiatives_details"),
  hasRainwaterHarvesting: boolean("has_rainwater_harvesting").default(false),
  hasSolarPower: boolean("has_solar_power").default(false),
  wasteManagementSystem: text("waste_management_system"),

  // Challenges and Development Needs
  infrastructureChallenges: text("infrastructure_challenges"),
  academicChallenges: text("academic_challenges"),
  developmentPlans: text("development_plans"),
  fundingNeeds: text("funding_needs"),

  // Partnerships
  governmentPartnerships: text("government_partnerships"),
  ngoPartnerships: text("ngo_partnerships"),
  corporatePartnerships: text("corporate_partnerships"),
  internationalPartnerships: text("international_partnerships"),

  // ICT Integration
  ictInfrastructureLevel: text("ict_infrastructure_level"),
  hasDigitalLearningResources: boolean(
    "has_digital_learning_resources",
  ).default(false),
  digitalLearningDetails: text("digital_learning_details"),
  teacherIctProficiency: text("teacher_ict_proficiency"),
  studentIctAccessLevel: text("student_ict_access_level"),

  // Evaluation and Quality Assurance
  hasInternalQualityAssurance: boolean(
    "has_internal_quality_assurance",
  ).default(false),
  externalEvaluationFrequency: text("external_evaluation_frequency"),
  accreditationStatus: text("accreditation_status"),
  accreditingBody: text("accrediting_body"),
  qualityImprovementInitiatives: text("quality_improvement_initiatives"),

  // Future Plans
  expansionPlans: text("expansion_plans"),
  infrastructureUpgrades: text("infrastructure_upgrades"),
  academicEnhancementPlans: text("academic_enhancement_plans"),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Linkages to other entities
  linkedHealthFacilities: jsonb("linked_health_facilities").default(
    sql`'[]'::jsonb`,
  ),
  linkedLibraries: jsonb("linked_libraries").default(sql`'[]'::jsonb`),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedSportsComplexes: jsonb("linked_sports_complexes").default(
    sql`'[]'::jsonb`,
  ),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  campusBoundary: geometry("campus_boundary", { type: "Polygon" }),
  buildingFootprints: geometry("building_footprints", { type: "MultiPolygon" }),

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

export type School = typeof school.$inferSelect;
export type NewSchool = typeof school.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
