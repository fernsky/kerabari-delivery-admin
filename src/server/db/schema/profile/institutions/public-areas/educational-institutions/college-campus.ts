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

// Define college type enum
export const collegeTypeEnum = pgEnum("college_type", [
  "COMMUNITY",
  "PRIVATE",
  "CONSTITUENT",
  "PUBLIC",
  "AFFILIATED",
  "AUTONOMOUS",
  "RELIGIOUS",
  "OTHER",
]);

// Define college level enum
export const collegeLevelEnum = pgEnum("college_level", [
  "INTERMEDIATE",
  "BACHELORS",
  "MASTERS",
  "DOCTORATE",
  "TECHNICAL",
  "PROFESSIONAL",
  "VOCATIONAL",
  "MULTIPLE_LEVELS",
]);

// Define medium of instruction enum
export const collegeInstructionMediumEnum = pgEnum(
  "college_instruction_medium",
  [
    "NEPALI",
    "ENGLISH",
    "DUAL_LANGUAGE",
    "MULTILINGUAL",
    "LOCAL_LANGUAGE",
    "OTHER",
  ],
);

// Define building condition enum
export const collegeBuildingConditionEnum = pgEnum(
  "college_building_condition",
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

// Define facility status enum
export const collegeFacilityStatusEnum = pgEnum("college_facility_status", [
  "EXCELLENT",
  "ADEQUATE",
  "LIMITED",
  "INADEQUATE",
  "NONE",
]);

// Define performance level enum
export const collegePerformanceLevelEnum = pgEnum("college_performance_level", [
  "EXCELLENT",
  "GOOD",
  "AVERAGE",
  "BELOW_AVERAGE",
  "POOR",
]);

// Define affiliation enum
export const collegeAffiliationEnum = pgEnum("college_affiliation", [
  "TRIBHUVAN_UNIVERSITY",
  "KATHMANDU_UNIVERSITY",
  "PURBANCHAL_UNIVERSITY",
  "POKHARA_UNIVERSITY",
  "NEPAL_SANSKRIT_UNIVERSITY",
  "FAR_WESTERN_UNIVERSITY",
  "MID_WESTERN_UNIVERSITY",
  "AGRICULTURE_AND_FORESTRY_UNIVERSITY",
  "LUMBINI_BUDDHIST_UNIVERSITY",
  "RAJARSHI_JANAK_UNIVERSITY",
  "NEPAL_OPEN_UNIVERSITY",
  "CTEVT",
  "INTERNATIONAL",
  "NOT_AFFILIATED",
  "OTHER",
]);

// Define faculty type enum
export const collegeFacultyTypeEnum = pgEnum("college_faculty_type", [
  "SCIENCE",
  "MANAGEMENT",
  "HUMANITIES",
  "EDUCATION",
  "LAW",
  "MEDICINE",
  "ENGINEERING",
  "FORESTRY",
  "AGRICULTURE",
  "VETERINARY",
  "FINE_ARTS",
  "SOCIAL_SCIENCES",
  "COMPUTER_SCIENCE",
  "NURSING",
  "PHARMACY",
  "HOSPITALITY_MANAGEMENT",
  "OTHER",
]);

// College Campus table
export const collegeCampus = pgTable("college_campus", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  collegeType: collegeTypeEnum("college_type").notNull(),
  collegeLevel: collegeLevelEnum("college_level").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Basic information
  establishedDate: date("established_date"),
  principalName: text("principal_name"),
  affiliatedWith: collegeAffiliationEnum("affiliated_with"),
  affiliationYear: integer("affiliation_year"),
  qaaAccredited: boolean("qaa_accredited").default(false), // Quality Assurance and Accreditation
  qaaAccreditationYear: integer("qaa_accreditation_year"),
  institutionCode: varchar("institution_code", { length: 50 }),
  instructionMedium: collegeInstructionMediumEnum("instruction_medium"),

  // Contact information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  faxNumber: text("fax_number"),
  email: text("email"),
  websiteUrl: text("website_url"),

  // Social media and online presence
  facebookHandle: text("facebook_handle"),
  twitterHandle: text("twitter_handle"),
  instagramHandle: text("instagram_handle"),
  youtubeChannel: text("youtube_channel"),

  // Operating hours and schedule
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  operatingDays: text("operating_days"),
  shiftsOffered: text("shifts_offered"), // "Morning", "Day", "Evening"
  hasWeekendClasses: boolean("has_weekend_classes").default(false),
  academicCalendarDetails: text("academic_calendar_details"),

  // Infrastructure details
  campusAreaSqm: decimal("campus_area_sq_m", { precision: 10, scale: 2 }),
  buildingCount: integer("building_count"),
  totalFloorsSqm: decimal("total_floors_sq_m", { precision: 10, scale: 2 }),
  classroomCount: integer("classroom_count"),
  averageClassSizeSqm: decimal("average_class_size_sq_m", {
    precision: 8,
    scale: 2,
  }),
  buildingCondition: collegeBuildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  lastRenovatedYear: integer("last_renovated_year"),
  hasAuditorium: boolean("has_auditorium").default(false),
  auditoriumCapacity: integer("auditorium_capacity"),
  hasConferenceRoom: boolean("has_conference_room").default(false),
  conferenceRoomCount: integer("conference_room_count"),
  hasSeminarHall: boolean("has_seminar_hall").default(false),
  seminarHallCount: integer("seminar_hall_count"),

  // Academic details
  offeredFaculties: jsonb("offered_faculties").default(sql`'[]'::jsonb`), // Array of collegeFacultyTypeEnum values
  offeredPrograms: text("offered_programs"), // Description of specific programs
  totalPrograms: integer("total_programs"),
  shorterCourses: text("shorter_courses"), // Non-degree courses offered
  specializations: text("specializations"), // Areas of specialization
  hasDistanceLearning: boolean("has_distance_learning").default(false),
  distanceLearningDetails: text("distance_learning_details"),

  // Student details
  totalStudentCapacity: integer("total_student_capacity"),
  currentEnrollment: integer("current_enrollment"),
  maleStudentCount: integer("male_student_count"),
  femaleStudentCount: integer("female_student_count"),
  otherGenderStudentCount: integer("other_gender_student_count"),
  foreignStudentCount: integer("foreign_student_count"),
  scholarshipStudentCount: integer("scholarship_student_count"),
  dailyAttendancePercent: decimal("daily_attendance_percent", {
    precision: 5,
    scale: 2,
  }),
  annualGraduationRate: decimal("annual_graduation_rate", {
    precision: 5,
    scale: 2,
  }),
  employmentRate: decimal("employment_rate", { precision: 5, scale: 2 }),
  studentTeacherRatio: decimal("student_teacher_ratio", {
    precision: 6,
    scale: 2,
  }),

  // Faculty and staff
  totalFacultyCount: integer("total_faculty_count"),
  fullTimeFacultyCount: integer("full_time_faculty_count"),
  partTimeFacultyCount: integer("part_time_faculty_count"),
  phdFacultyCount: integer("phd_faculty_count"),
  mastersFacultyCount: integer("masters_faculty_count"),
  bachelorsFacultyCount: integer("bachelors_faculty_count"),
  maleFacultyCount: integer("male_faculty_count"),
  femaleFacultyCount: integer("female_faculty_count"),
  administrativeStaffCount: integer("administrative_staff_count"),
  supportStaffCount: integer("support_staff_count"),
  facultyVacancyCount: integer("faculty_vacancy_count"),
  facultyTurnoverRate: decimal("faculty_turnover_rate", {
    precision: 5,
    scale: 2,
  }),
  averageFacultyExperienceYears: decimal("average_faculty_experience_years", {
    precision: 5,
    scale: 2,
  }),

  // Facilities and resources
  libraryStatus: collegeFacilityStatusEnum("library_status"),
  bookCount: integer("book_count"),
  hasELibrary: boolean("has_e_library").default(false),
  eResourceSubscriptions: text("e_resource_subscriptions"),
  librarySeatingCapacity: integer("library_seating_capacity"),
  hasComputerLab: boolean("has_computer_lab").default(false),
  computerLabCount: integer("computer_lab_count"),
  computerCount: integer("computer_count"),
  internetSpeed: text("internet_speed"), // E.g., "100 Mbps"
  hasWifi: boolean("has_wifi").default(false),
  wifiCoverage: text("wifi_coverage"), // "Full Campus", "Partial", etc.
  hasScientificLabs: boolean("has_scientific_labs").default(false),
  scientificLabCount: integer("scientific_lab_count"),
  labEquipmentStatus: collegeFacilityStatusEnum("lab_equipment_status"),
  hasEngineering: boolean("has_engineering_workshop").default(false),
  hasLanguageLab: boolean("has_language_lab").default(false),

  // Sports and extracurricular
  hasSportsGround: boolean("has_sports_ground").default(false),
  sportsGroundAreaSqm: decimal("sports_ground_area_sq_m", {
    precision: 10,
    scale: 2,
  }),
  indoorSportsFacilities: text("indoor_sports_facilities"),
  outdoorSportsFacilities: text("outdoor_sports_facilities"),
  hasGym: boolean("has_gym").default(false),
  hasHostel: boolean("has_hostel").default(false),
  maleHostelCapacity: integer("male_hostel_capacity"),
  femaleHostelCapacity: integer("female_hostel_capacity"),
  hasCanteen: boolean("has_canteen").default(false),
  canteenCapacity: integer("canteen_capacity"),
  hasTransportService: boolean("has_transport_service").default(false),
  transportServiceDetails: text("transport_service_details"),

  // Basic facilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"), // Generator, UPS, etc.
  hasWaterSupply: boolean("has_water_supply").default(true),
  waterSourceType: text("water_source_type"), // Municipal, Boring, etc.
  toiletCount: integer("toilet_count"),
  hasDisabledFriendlyToilets: boolean("has_disabled_friendly_toilets").default(
    false,
  ),
  hasDisabledAccess: boolean("has_disabled_access").default(false),
  disabledAccessDetails: text("disabled_access_details"),

  // Health and safety
  hasHealthClinic: boolean("has_health_clinic").default(false),
  hasMentalHealthServices: boolean("has_mental_health_services").default(false),
  hasFireSafetySystem: boolean("has_fire_safety_system").default(false),
  fireSafetyDetails: text("fire_safety_details"),
  hasEmergencyExits: boolean("has_emergency_exits").default(false),
  hasCCTV: boolean("has_cctv").default(false),
  cctvCameraCount: integer("cctv_camera_count"),
  securityPersonnelCount: integer("security_personnel_count"),

  // Financial aspects
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  averageTuitionFeeNPR: decimal("average_tuition_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  scholarshipBudgetPercent: decimal("scholarship_budget_percent", {
    precision: 5,
    scale: 2,
  }),
  researchBudgetPercent: decimal("research_budget_percent", {
    precision: 5,
    scale: 2,
  }),
  infrastructureBudgetPercent: decimal("infrastructure_budget_percent", {
    precision: 5,
    scale: 2,
  }),
  hasFinancialAid: boolean("has_financial_aid").default(false),
  financialAidDetails: text("financial_aid_details"),

  // Academic performance and quality
  performanceLevel: collegePerformanceLevelEnum("performance_level"),
  passingRatePercent: decimal("passing_rate_percent", {
    precision: 5,
    scale: 2,
  }),
  researchPublicationsCount: integer("research_publications_count"),
  researchProjects: text("research_projects"),
  industryCollaborations: text("industry_collaborations"),
  academicAchievements: text("academic_achievements"),
  qualityAssuranceMeasures: text("quality_assurance_measures"),
  hasCareerCounseling: boolean("has_career_counseling").default(false),
  careerCounselingDetails: text("career_counseling_details"),
  studentSupportServices: text("student_support_services"),

  // Alumni and placement
  hasAlumniAssociation: boolean("has_alumni_association").default(false),
  alumniCount: integer("alumni_count"),
  notableAlumni: text("notable_alumni"),
  placementServices: boolean("placement_services").default(false),
  placementCompaniesCount: integer("placement_companies_count"),
  placementRatePercent: decimal("placement_rate_percent", {
    precision: 5,
    scale: 2,
  }),
  averageStartingSalaryNPR: decimal("average_starting_salary_npr", {
    precision: 10,
    scale: 2,
  }),

  // Governance and administration
  hasGoverningBoard: boolean("has_governing_board").default(true),
  governingBoardSize: integer("governing_board_size"),
  femaleInGoverningBoard: integer("female_in_governing_board"),
  administrativeStructure: text("administrative_structure"),
  hasStudentUnion: boolean("has_student_union").default(false),
  studentUnionDetails: text("student_union_details"),

  // Future plans and development
  developmentPlans: text("development_plans"),
  expansionPlans: text("expansion_plans"),
  newProgramsPlanned: text("new_programs_planned"),
  infrastructureImprovementPlans: text("infrastructure_improvement_plans"),

  // Challenges and needs
  academicChallenges: text("academic_challenges"),
  infrastructureChallenges: text("infrastructure_challenges"),
  financialChallenges: text("financial_challenges"),
  humanResourceChallenges: text("human_resource_challenges"),

  // Linkages to other entities
  linkedMunicipalityOffices: jsonb("linked_municipality_offices").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedSchools: jsonb("linked_schools").default(sql`'[]'::jsonb`),
  linkedUniversities: jsonb("linked_universities").default(sql`'[]'::jsonb`),
  linkedIndustries: jsonb("linked_industries").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  campusArea: geometry("campus_area", { type: "MultiPolygon" }),

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

export type CollegeCampus = typeof collegeCampus.$inferSelect;
export type NewCollegeCampus = typeof collegeCampus.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
