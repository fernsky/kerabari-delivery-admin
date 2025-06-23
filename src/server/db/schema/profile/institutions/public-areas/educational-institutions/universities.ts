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

// Define university type enum
export const universityTypeEnum = pgEnum("university_type", [
  "PUBLIC",
  "PRIVATE",
  "COMMUNITY",
  "AFFILIATED",
  "DEEMED",
  "AUTONOMOUS",
  "INTERNATIONAL",
  "BRANCH_CAMPUS",
  "SPECIALIZED",
  "TECHNICAL",
  "RELIGIOUS",
  "OTHER",
]);

// Define university category enum
export const universityCategoryEnum = pgEnum("university_category", [
  "COMPREHENSIVE",
  "SPECIALIZED",
  "TECHNICAL",
  "RESEARCH",
  "TEACHING",
  "OPEN",
  "AGRICULTURE",
  "MEDICAL",
  "TECHNICAL",
  "ENGINEERING",
  "BUSINESS",
  "LAW",
  "ARTS",
  "OTHER",
]);

// Define campus status enum
export const campusStatusEnum = pgEnum("campus_status", [
  "CENTRAL",
  "CONSTITUENT",
  "AFFILIATED",
  "BRANCH",
]);

// Define instruction medium enum
export const instructionMediumEnum = pgEnum("instruction_medium", [
  "NEPALI",
  "ENGLISH",
  "DUAL_LANGUAGE",
  "MULTILINGUAL",
  "LOCAL_LANGUAGE",
  "OTHER",
]);

// Define accreditation status enum
export const accreditationStatusEnum = pgEnum("accreditation_status", [
  "FULLY_ACCREDITED",
  "PROVISIONALLY_ACCREDITED",
  "IN_PROCESS",
  "NOT_ACCREDITED",
  "ACCREDITATION_EXPIRED",
]);

// Define building condition enum
export const universityBuildingConditionEnum = pgEnum(
  "university_building_condition",
  [
    "EXCELLENT",
    "GOOD",
    "FAIR",
    "NEEDS_REPAIR",
    "NEEDS_RECONSTRUCTION",
    "UNDER_CONSTRUCTION",
    "EXPANDED_RECENTLY",
    "HISTORIC_PRESERVED",
  ],
);

// Define facility status enum
export const universityFacilityStatusEnum = pgEnum(
  "university_facility_status",
  [
    "EXCELLENT",
    "GOOD",
    "ADEQUATE",
    "LIMITED",
    "INADEQUATE",
    "UNDER_DEVELOPMENT",
  ],
);

// Define research activity level enum
export const researchActivityLevelEnum = pgEnum("research_activity_level", [
  "VERY_HIGH",
  "HIGH",
  "MODERATE",
  "LOW",
  "MINIMAL",
  "NONE",
]);

// Define faculty qualification level enum
export const facultyQualificationLevelEnum = pgEnum(
  "faculty_qualification_level",
  [
    "HIGHLY_QUALIFIED",
    "WELL_QUALIFIED",
    "ADEQUATELY_QUALIFIED",
    "NEEDS_IMPROVEMENT",
    "INSUFFICIENT",
  ],
);

// University table
export const university = pgTable("university", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  universityType: universityTypeEnum("university_type").notNull(),
  universityCategory: universityCategoryEnum("university_category").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  district: text("district"),
  province: text("province"),

  // Basic information
  establishedDate: date("established_date"),
  registrationNumber: varchar("registration_number", { length: 100 }),
  registeredWith: text("registered_with"),
  ugcRegistrationNumber: varchar("ugc_registration_number", { length: 100 }),
  campusStatus: campusStatusEnum("campus_status"),
  parentUniversityId: varchar("parent_university_id", { length: 36 }),
  isMainCampus: boolean("is_main_campus").default(false),

  // Leadership and management
  vicechancellorName: text("vicechancellor_name"),
  rectorName: text("rector_name"),
  registrarName: text("registrar_name"),
  deanNames: jsonb("dean_names").default(sql`'[]'::jsonb`), // Array of dean names by faculty
  campusChiefName: text("campus_chief_name"),

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
  linkedinHandle: text("linkedin_handle"),

  // Operating hours
  officeOpeningTime: time("office_opening_time"),
  officeClosingTime: time("office_closing_time"),
  classHours: text("class_hours"), // Description of class schedule
  libraryHours: text("library_hours"),
  weeklyOffDays: text("weekly_off_days"),

  // Academic details
  accreditationStatus: accreditationStatusEnum("accreditation_status"),
  accreditationBody: text("accreditation_body"),
  lastAccreditationYear: integer("last_accreditation_year"),
  instructionMedium: instructionMediumEnum("instruction_medium"),
  academicCalendar: text("academic_calendar"), // Semester, Trimester, Annual, etc.
  totalFaculties: integer("total_faculties"), // Number of faculties/schools
  facultiesOffered: jsonb("faculties_offered").default(sql`'[]'::jsonb`), // List of faculties
  departmentsCount: integer("departments_count"),
  departmentsList: jsonb("departments_list").default(sql`'[]'::jsonb`),
  researchCentersCount: integer("research_centers_count"),
  researchCentersList: jsonb("research_centers_list").default(sql`'[]'::jsonb`),

  // Programs and courses
  undergraduateProgramsCount: integer("undergraduate_programs_count"),
  undergraduateProgramsList: jsonb("undergraduate_programs_list").default(
    sql`'[]'::jsonb`,
  ),
  graduateProgramsCount: integer("graduate_programs_count"),
  graduateProgramsList: jsonb("graduate_programs_list").default(
    sql`'[]'::jsonb`,
  ),
  doctoratesProgramsCount: integer("doctorates_programs_count"),
  doctoratesProgramsList: jsonb("doctorates_programs_list").default(
    sql`'[]'::jsonb`,
  ),
  certificateCoursesCount: integer("certificate_courses_count"),
  certificateCoursesList: jsonb("certificate_courses_list").default(
    sql`'[]'::jsonb`,
  ),
  offersDistanceLearning: boolean("offers_distance_learning").default(false),
  offersOnlineCourses: boolean("offers_online_courses").default(false),
  offersContinuingEducation: boolean("offers_continuing_education").default(
    false,
  ),

  // Student details
  totalStudentCount: integer("total_student_count"),
  undergraduateStudentCount: integer("undergraduate_student_count"),
  graduateStudentCount: integer("graduate_student_count"),
  doctorateStudentCount: integer("doctorate_student_count"),
  certificateProgramStudentCount: integer("certificate_program_student_count"),
  maleStudentCount: integer("male_student_count"),
  femaleStudentCount: integer("female_student_count"),
  otherGenderStudentCount: integer("other_gender_student_count"),
  internationalStudentCount: integer("international_student_count"),
  scholarshipRecipientCount: integer("scholarship_recipient_count"),
  annualGraduationRate: decimal("annual_graduation_rate", {
    precision: 5,
    scale: 2,
  }),
  employmentRateAfterGraduation: decimal("employment_rate_after_graduation", {
    precision: 5,
    scale: 2,
  }),
  averageEnrollmentPerYear: integer("average_enrollment_per_year"),
  totalAlumniCount: integer("total_alumni_count"),

  // Faculty and staff details
  totalFacultyCount: integer("total_faculty_count"),
  fullTimeFacultyCount: integer("full_time_faculty_count"),
  partTimeFacultyCount: integer("part_time_faculty_count"),
  visitingFacultyCount: integer("visiting_faculty_count"),
  maleFacultyCount: integer("male_faculty_count"),
  femaleFacultyCount: integer("female_faculty_count"),
  facultyWithPhDCount: integer("faculty_with_phd_count"),
  facultyWithMastersCount: integer("faculty_with_masters_count"),
  facultyStudentRatio: decimal("faculty_student_ratio", {
    precision: 5,
    scale: 2,
  }),
  totalAdministrativeStaffCount: integer("total_administrative_staff_count"),
  totalSupportStaffCount: integer("total_support_staff_count"),
  facultyQualificationLevel: facultyQualificationLevelEnum(
    "faculty_qualification_level",
  ),

  // Infrastructure and facilities
  totalLandAreaSqm: decimal("total_land_area_sqm", { precision: 12, scale: 2 }),
  totalBuiltAreaSqm: decimal("total_built_area_sqm", {
    precision: 12,
    scale: 2,
  }),
  totalBuildingCount: integer("total_building_count"),
  buildingCondition: universityBuildingConditionEnum("building_condition"),
  classroomCount: integer("classroom_count"),
  averageClassSize: integer("average_class_size"),
  laboratoryCount: integer("laboratory_count"),
  computerLabCount: integer("computer_lab_count"),
  totalComputerCount: integer("total_computer_count"),
  hasLibrary: boolean("has_library").default(true),
  libraryBookCount: integer("library_book_count"),
  hasDigitalLibrary: boolean("has_digital_library").default(false),
  hasWifi: boolean("has_wifi").default(false),
  wifiCoverage: text("wifi_coverage"),
  internetBandwidth: text("internet_bandwidth"), // E.g., "100 Mbps"
  hasAuditorium: boolean("has_auditorium").default(false),
  auditoriumCapacity: integer("auditorium_capacity"),
  hasConferenceHall: boolean("has_conference_hall").default(false),
  conferenceHallCount: integer("conference_hall_count"),
  hasSportsComplex: boolean("has_sports_complex").default(false),
  sportsFacilities: jsonb("sports_facilities").default(sql`'[]'::jsonb`),
  hasPlayground: boolean("has_playground").default(false),
  hasIndoorGames: boolean("has_indoor_games").default(false),
  hasGym: boolean("has_gym").default(false),
  hasMedicalFacility: boolean("has_medical_facility").default(false),
  medicalFacilityDetails: text("medical_facility_details"),
  hasCafeteria: boolean("has_cafeteria").default(false),
  cafeteriaCapacity: integer("cafeteria_capacity"),
  hasStudentHostel: boolean("has_student_hostel").default(false),
  maleHostelCapacity: integer("male_hostel_capacity"),
  femaleHostelCapacity: integer("female_hostel_capacity"),
  hasFacultyHousing: boolean("has_faculty_housing").default(false),
  facultyHousingUnits: integer("faculty_housing_units"),
  hasParkingFacility: boolean("has_parking_facility").default(false),
  parkingCapacity: integer("parking_capacity"),
  hasATMFacility: boolean("has_atm_facility").default(false),
  hasSolarPower: boolean("has_solar_power").default(false),
  solarCapacityKW: decimal("solar_capacity_kw", { precision: 8, scale: 2 }),
  hasRainwaterHarvesting: boolean("has_rainwater_harvesting").default(false),
  hasElevator: boolean("has_elevator").default(false),
  hasAccessForDisabled: boolean("has_access_for_disabled").default(false),
  hasELearningFacilities: boolean("has_elearning_facilities").default(false),
  eLearningDetails: text("elearning_details"),
  overallFacilityStatus: universityFacilityStatusEnum(
    "overall_facility_status",
  ),

  // Research and publications
  researchActivityLevel: researchActivityLevelEnum("research_activity_level"),
  annualResearchBudgetNPR: decimal("annual_research_budget_npr", {
    precision: 14,
    scale: 2,
  }),
  annualPublicationCount: integer("annual_publication_count"),
  intellectualPropertyCount: integer("intellectual_property_count"),
  researchCollaborations: text("research_collaborations"),
  majorResearchAreas: text("major_research_areas"),
  researchFundingSources: text("research_funding_sources"),

  // Special programs and services
  careerCounselingServices: boolean("career_counseling_services").default(
    false,
  ),
  studentExchangePrograms: boolean("student_exchange_programs").default(false),
  internshipPrograms: boolean("internship_programs").default(false),
  industryLinkages: text("industry_linkages"),
  communityOutreachPrograms: text("community_outreach_programs"),
  alumniEngagementPrograms: text("alumni_engagement_programs"),
  extracurricularActivities: text("extracurricular_activities"),
  studentClubsCount: integer("student_clubs_count"),
  studentClubsList: jsonb("student_clubs_list").default(sql`'[]'::jsonb`),

  // Financial aspects
  annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
  fundingSources: text("funding_sources"),
  undergraduateTuitionNPR: decimal("undergraduate_tuition_npr", {
    precision: 12,
    scale: 2,
  }),
  graduateTuitionNPR: decimal("graduate_tuition_npr", {
    precision: 12,
    scale: 2,
  }),
  scholarshipBudgetNPR: decimal("scholarship_budget_npr", {
    precision: 14,
    scale: 2,
  }),
  hasEndowmentFund: boolean("has_endowment_fund").default(false),
  endowmentSizeNPR: decimal("endowment_size_npr", { precision: 18, scale: 2 }),
  hasFinancialAidProgram: boolean("has_financial_aid_program").default(false),
  financialAidDetails: text("financial_aid_details"),

  // International collaborations
  hasInternationalCollaborations: boolean(
    "has_international_collaborations",
  ).default(false),
  internationalPartnerCount: integer("international_partner_count"),
  internationalPartners: jsonb("international_partners").default(
    sql`'[]'::jsonb`,
  ),
  exchangeProgramDetails: text("exchange_program_details"),
  internationalAccreditation: text("international_accreditation"),

  // Quality assurance and ranking
  hasInternalQualityAssurance: boolean(
    "has_internal_quality_assurance",
  ).default(false),
  qualityAssuranceDetails: text("quality_assurance_details"),
  nationalRanking: text("national_ranking"),
  internationalRanking: text("international_ranking"),
  majorAwards: text("major_awards"),

  // Governance and management
  hasStrategicPlan: boolean("has_strategic_plan").default(false),
  currentStrategicPlanPeriod: text("current_strategic_plan_period"),
  governanceStructure: text("governance_structure"),
  hasAutomatedManagementSystem: boolean(
    "has_automated_management_system",
  ).default(false),
  managementSystemDetails: text("management_system_details"),

  // Challenges and development
  majorChallenges: text("major_challenges"),
  developmentPlans: text("development_plans"),
  expansionPlans: text("expansion_plans"),

  // Community engagement
  communityServicePrograms: text("community_service_programs"),
  publicLectureSeriesFrequency: text("public_lecture_series_frequency"),
  communityDevelopmentInitiatives: text("community_development_initiatives"),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  campusArea: geometry("campus_area", { type: "Polygon" }),
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

export type University = typeof university.$inferSelect;
export type NewUniversity = typeof university.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
