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

// Define child development center type enum
export const childDevelopmentCenterTypeEnum = pgEnum(
  "child_development_center_type",
  [
    "MONTESSORI",
    "DAYCARE",
    "PRESCHOOL",
    "ECD_CENTER",
    "KINDERGARTEN",
    "PLAY_GROUP",
    "COMMUNITY_BASED",
    "GOVERNMENT_RUN",
    "PRIVATE",
    "NGO_OPERATED",
    "RELIGIOUS_AFFILIATED",
    "SPECIAL_NEEDS",
    "OTHER",
  ],
);

// Define management type enum
export const childCenterManagementTypeEnum = pgEnum(
  "child_center_management_type",
  [
    "GOVERNMENT",
    "PRIVATE",
    "COMMUNITY",
    "NGO",
    "INGO",
    "RELIGIOUS_ORGANIZATION",
    "COOPERATIVE",
    "PUBLIC_PRIVATE_PARTNERSHIP",
    "OTHER",
  ],
);

// Define facility condition enum
export const childCenterFacilityConditionEnum = pgEnum(
  "child_center_facility_condition",
  [
    "EXCELLENT",
    "GOOD",
    "FAIR",
    "NEEDS_IMPROVEMENT",
    "POOR",
    "UNDER_CONSTRUCTION",
    "UNDER_RENOVATION",
  ],
);

// Define infrastructure adequacy enum
export const infrastructureAdequacyEnum = pgEnum("infrastructure_adequacy", [
  "HIGHLY_ADEQUATE",
  "ADEQUATE",
  "SOMEWHAT_ADEQUATE",
  "INADEQUATE",
  "HIGHLY_INADEQUATE",
]);

// Define safety level enum
export const safetyLevelEnum = pgEnum("safety_level", [
  "VERY_SAFE",
  "SAFE",
  "MODERATE",
  "SOMEWHAT_UNSAFE",
  "UNSAFE",
]);

// Define child development center table
export const childDevelopmentCenter = pgTable("child_development_center", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  centerType: childDevelopmentCenterTypeEnum("center_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  establishedDate: date("established_date"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // Which govt body it's registered with
  panNumber: varchar("pan_number", { length: 20 }),
  managementType: childCenterManagementTypeEnum("management_type").notNull(),
  affiliatedSchoolId: varchar("affiliated_school_id", { length: 36 }),
  affiliatedSchoolName: text("affiliated_school_name"),
  operatingHoursStart: time("operating_hours_start"),
  operatingHoursEnd: time("operating_hours_end"),
  operatingDays: text("operating_days"), // E.g., "Sunday-Friday"
  isYearRoundOperation: boolean("is_year_round_operation").default(true),
  holidaySchedule: text("holiday_schedule"),
  hasAfterHoursProgram: boolean("has_after_hours_program").default(false),
  afterHoursProgramDetails: text("after_hours_program_details"),

  // Contact information
  principalName: text("principal_name"),
  contactPersonName: text("contact_person_name"),
  contactPersonRole: text("contact_person_role"),
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  emergencyContactNumber: text("emergency_contact_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Social media and online presence
  facebookHandle: text("facebook_handle"),
  otherSocialMedia: text("other_social_media"),

  // Enrollment and capacity
  totalStudentCapacity: integer("total_student_capacity"),
  currentEnrollment: integer("current_enrollment"),
  waitlistCount: integer("waitlist_count"),
  minimumAgeMonths: integer("minimum_age_months"),
  maximumAgeYears: integer("maximum_age_years"),
  hasAgeGroupSegregation: boolean("has_age_group_segregation").default(true),
  ageGroupDetails: text("age_group_details"),
  toddlerCount: integer("toddler_count"), // Children aged 1-2 years
  preSchoolerCount: integer("pre_schooler_count"), // Children aged 3-5 years
  boysCount: integer("boys_count"),
  girlsCount: integer("girls_count"),
  specialNeedsChildrenCount: integer("special_needs_children_count"),
  scholarshipSeatsCount: integer("scholarship_seats_count"),
  freeLunchProvidedCount: integer("free_lunch_provided_count"),

  // Staff details
  totalStaffCount: integer("total_staff_count"),
  teacherCount: integer("teacher_count"),
  assistantCount: integer("assistant_count"),
  caregiverCount: integer("caregiver_count"),
  administrativeStaffCount: integer("administrative_staff_count"),
  supportStaffCount: integer("support_staff_count"),
  maleStaffCount: integer("male_staff_count"),
  femaleStaffCount: integer("female_staff_count"),
  trainedStaffCount: integer("trained_staff_count"),
  ecdeTrainedCount: integer("ecde_trained_count"), // Early Childhood Development Education
  montessoriTrainedCount: integer("montessori_trained_count"),
  firstAidTrainedCount: integer("first_aid_trained_count"),
  staffChildRatio: text("staff_child_ratio"),
  staffQualificationsDetails: text("staff_qualifications_details"),
  staffTrainingFrequency: text("staff_training_frequency"),

  // Facilities
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
  indoorAreaSqm: decimal("indoor_area_sq_m", { precision: 10, scale: 2 }),
  outdoorAreaSqm: decimal("outdoor_area_sq_m", { precision: 10, scale: 2 }),
  buildingCondition: childCenterFacilityConditionEnum("building_condition"),
  buildingOwnership: text("building_ownership"), // "Owned", "Rented", etc.
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  totalClassrooms: integer("total_classrooms"),
  hasPlayground: boolean("has_playground").default(false),
  playgroundEquipped: boolean("playground_equipped").default(false),
  playgroundEquipmentDetails: text("playground_equipment_details"),
  hasIndoorPlayArea: boolean("has_indoor_play_area").default(false),
  hasDedicatedNapArea: boolean("has_dedicated_nap_area").default(false),
  hasKitchen: boolean("has_kitchen").default(false),
  hasDiningSpace: boolean("has_dining_space").default(false),
  hasLibraryCorner: boolean("has_library_corner").default(false),
  bookCount: integer("book_count"),
  hasSpecialNeedsFacilities: boolean("has_special_needs_facilities").default(
    false,
  ),
  specialNeedsFacilitiesDetails: text("special_needs_facilities_details"),
  hasToiletForChildren: boolean("has_toilet_for_children").default(true),
  childrenToiletCount: integer("children_toilet_count"),
  hasSeparateToiletsForStaff: boolean("has_separate_toilets_for_staff").default(
    false,
  ),
  staffToiletCount: integer("staff_toilet_count"),
  hasHandwashingStation: boolean("has_handwashing_station").default(true),
  handwashingStationCount: integer("handwashing_station_count"),
  hasDrinkingWater: boolean("has_drinking_water").default(true),
  waterSourceType: text("water_source_type"), // E.g., "Tap", "Well", "Filtered"
  hasElectricity: boolean("has_electricity").default(true),
  infrastructureAdequacy: infrastructureAdequacyEnum("infrastructure_adequacy"),

  // Educational approach and curriculum
  curriculumType: text("curriculum_type"),
  teachingMethodology: text("teaching_methodology"),
  languageOfInstruction: text("language_of_instruction"),
  additionalLanguagesTaught: text("additional_languages_taught"),
  hasStructuredCurriculum: boolean("has_structured_curriculum").default(true),
  curriculumDetails: text("curriculum_details"),
  dailyScheduleDescription: text("daily_schedule_description"),
  hasOutdoorActivities: boolean("has_outdoor_activities").default(true),
  outdoorActivitiesFrequency: text("outdoor_activities_frequency"),
  hasArtActivities: boolean("has_art_activities").default(true),
  hasMusicActivities: boolean("has_music_activities").default(true),
  hasPhysicalActivities: boolean("has_physical_activities").default(true),
  hasStorytellingActivities: boolean("has_storytelling_activities").default(
    true,
  ),
  hasPlannedActivitySchedule: boolean("has_planned_activity_schedule").default(
    true,
  ),
  performanceAssessmentMethod: text("performance_assessment_method"),
  parentTeacherMeetingFrequency: text("parent_teacher_meeting_frequency"),

  // Safety and health
  safetyLevel: safetyLevelEnum("safety_level"),
  hasFireSafetyEquipment: boolean("has_fire_safety_equipment").default(false),
  fireSafetyEquipmentDetails: text("fire_safety_equipment_details"),
  hasFirstAidKit: boolean("has_first_aid_kit").default(true),
  medicalEmergencyProcedure: text("medical_emergency_procedure"),
  hasChildSafetyPolicy: boolean("has_child_safety_policy").default(false),
  childSafetyPolicyDetails: text("child_safety_policy_details"),
  hasChildProtectionPolicy: boolean("has_child_protection_policy").default(
    false,
  ),
  conductsCriminalRecordCheck: boolean(
    "conducts_criminal_record_check",
  ).default(false),
  hasSecureEntrySystem: boolean("has_secure_entry_system").default(false),
  entrySystemDetails: text("entry_system_details"),
  hasPerimeterFencing: boolean("has_perimeter_fencing").default(false),
  hasCCTV: boolean("has_cctv").default(false),
  cctvCameraCount: integer("cctv_camera_count"),
  hasDailyAttendanceRecord: boolean("has_daily_attendance_record").default(
    true,
  ),
  childPickupProcedure: text("child_pickup_procedure"),
  healthCheckupFrequency: text("health_checkup_frequency"),
  immunizationRequirements: text("immunization_requirements"),
  sickChildPolicy: text("sick_child_policy"),

  // Nutrition and meals
  providesSnacks: boolean("provides_snacks").default(false),
  providesLunch: boolean("provides_lunch").default(false),
  mealsSourced: text("meals_sourced"), // E.g., "Prepared on-site", "Catered", "Home-brought"
  hasNutritionGuidelines: boolean("has_nutrition_guidelines").default(false),
  nutritionGuidelinesDetails: text("nutrition_guidelines_details"),
  accommodatesDietaryRestrictions: boolean(
    "accommodates_dietary_restrictions",
  ).default(false),
  mealsIncludedInFees: boolean("meals_included_in_fees").default(false),
  mealFeesStructure: text("meal_fees_structure"),

  // Fees and financial aspects
  registrationFeeNPR: decimal("registration_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  monthlyFeeNPR: decimal("monthly_fee_npr", { precision: 10, scale: 2 }),
  annualFeeNPR: decimal("annual_fee_npr", { precision: 10, scale: 2 }),
  otherFeesDetails: text("other_fees_details"),
  hasScholarshipProgram: boolean("has_scholarship_program").default(false),
  scholarshipProgramDetails: text("scholarship_program_details"),
  feeWaiverAvailable: boolean("fee_waiver_available").default(false),
  feeWaiverConditions: text("fee_waiver_conditions"),
  hasInclusionPolicy: boolean("has_inclusion_policy").default(false),
  inclusionPolicyDetails: text("inclusion_policy_details"),
  receivesGovernmentFunding: boolean("receives_government_funding").default(
    false,
  ),
  governmentFundingDetails: text("government_funding_details"),
  receivesNGOFunding: boolean("receives_ngo_funding").default(false),
  ngoFundingDetails: text("ngo_funding_details"),

  // Parent involvement
  hasParentTeacherAssociation: boolean(
    "has_parent_teacher_association",
  ).default(false),
  parentInvolvementLevel: text("parent_involvement_level"),
  parentVolunteerProgram: boolean("parent_volunteer_program").default(false),
  parentEducationProgram: boolean("parent_education_program").default(false),
  regularParentCommunicationMethod: text("regular_parent_communication_method"),

  // Community engagement
  communityOutreachPrograms: text("community_outreach_programs"),
  collaboratesWithHealthServices: boolean(
    "collaborates_with_health_services",
  ).default(false),
  healthServicesCollaborationDetails: text(
    "health_services_collaboration_details",
  ),
  collaboratesWithSchools: boolean("collaborates_with_schools").default(false),
  schoolCollaborationDetails: text("school_collaboration_details"),

  // Monitoring and evaluation
  hasQualityStandardsCertification: boolean(
    "has_quality_standards_certification",
  ).default(false),
  certificationDetails: text("certification_details"),
  lastInspectionDate: date("last_inspection_date"),
  inspectionResult: text("inspection_result"),
  governmentMonitoringFrequency: text("government_monitoring_frequency"),
  internalEvaluationSystem: text("internal_evaluation_system"),
  parentFeedbackMechanism: text("parent_feedback_mechanism"),
  improventMeasures: text("improvement_measures"),

  // Challenges and needs
  majorChallenges: text("major_challenges"),
  resourceNeeds: text("resource_needs"),
  infrastructureNeeds: text("infrastructure_needs"),
  trainingNeeds: text("training_needs"),

  // Future plans
  expansionPlans: text("expansion_plans"),
  qualityImprovementPlans: text("quality_improvement_plans"),
  futurePrograms: text("future_programs"),

  // Linkages to other entities
  linkedSchools: jsonb("linked_schools").default(sql`'[]'::jsonb`),
  linkedHealthFacilities: jsonb("linked_health_facilities").default(
    sql`'[]'::jsonb`,
  ),
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
  compoundArea: geometry("compound_area", { type: "Polygon" }),

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

export type ChildDevelopmentCenter = typeof childDevelopmentCenter.$inferSelect;
export type NewChildDevelopmentCenter =
  typeof childDevelopmentCenter.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
