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
  buildingConditionEnum,
  usageFrequencyEnum,
  accessibilityLevelEnum,
} from "../../common";
import {
  buildingConstructionMaterialEnum,
  managementTypeEnum,
} from "./community-buildings";

// Define CBO building type enum
export const cboBuildingTypeEnum = pgEnum("cbo_building_type", [
  "NGO_OFFICE",
  "COOPERATIVE_BUILDING",
  "DEVELOPMENT_ORGANIZATION",
  "SOCIAL_SERVICE_CENTER",
  "MICROFINANCE_INSTITUTION",
  "FARMER_GROUP_BUILDING",
  "FOREST_USER_GROUP_BUILDING",
  "WATER_USER_GROUP_BUILDING",
  "COMMUNITY_DISASTER_MANAGEMENT_CENTER",
  "CIVIL_SOCIETY_ORGANIZATION",
  "MULTIPURPOSE_CBO_BUILDING",
  "OTHER",
]);

// Define CBO focus area enum
export const cboFocusAreaEnum = pgEnum("cbo_focus_area", [
  "POVERTY_REDUCTION",
  "AGRICULTURE",
  "EDUCATION",
  "HEALTH",
  "GENDER_EQUALITY",
  "NATURAL_RESOURCE_MANAGEMENT",
  "MICROFINANCE",
  "DISASTER_MANAGEMENT",
  "LIVELIHOOD_IMPROVEMENT",
  "INFRASTRUCTURE_DEVELOPMENT",
  "CLIMATE_CHANGE_ADAPTATION",
  "WATER_AND_SANITATION",
  "RIGHTS_ADVOCACY",
  "MULTIPLE_FOCUS",
  "OTHER",
]);

// Community-Based Organization Building table
export const communityBasedOrganizationBuilding = pgTable(
  "community_based_organization_building",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(), // For SEO-friendly URLs
    description: text("description"),
    buildingType: cboBuildingTypeEnum("building_type").notNull(),
    focusArea: cboFocusAreaEnum("focus_area").notNull(),

    // Location details
    wardNumber: integer("ward_number"),
    location: text("location"), // Village/Tole/Area name
    address: text("address"),

    // Basic information
    establishedYear: integer("established_year"),
    organizationEstablishedYear: integer("organization_established_year"), // Year when the CBO was established
    managementType: managementTypeEnum("management_type").notNull(),
    registrationNumber: varchar("registration_number", { length: 50 }),
    panNumber: varchar("pan_number", { length: 20 }),
    registeredWith: text("registered_with"), // Which govt body it's registered with
    registrationDate: date("registration_date"),
    lastRenewalDate: date("last_renewal_date"),
    isAffiliatedWithFederation: boolean(
      "is_affiliated_with_federation",
    ).default(false),
    federationAffiliationDetails: text("federation_affiliation_details"),

    // Organization details
    organizationalVision: text("organizational_vision"),
    organizationalMission: text("organizational_mission"),
    organizationalObjectives: text("organizational_objectives"),
    targetBeneficiaries: text("target_beneficiaries"),
    geographicalCoverage: text("geographical_coverage"),
    hasStrategicPlan: boolean("has_strategic_plan").default(false),
    strategicPlanPeriod: text("strategic_plan_period"),
    legalStatus: text("legal_status"), // NGO, Cooperative, etc.
    annualReportAvailable: boolean("annual_report_available").default(false),

    // Membership details
    isMembershipBased: boolean("is_membership_based").default(false),
    totalMemberCount: integer("total_member_count"),
    activeMemberCount: integer("active_member_count"),
    maleMemberCount: integer("male_member_count"),
    femaleMemberCount: integer("female_member_count"),
    otherGenderMemberCount: integer("other_gender_member_count"),
    dalitMemberCount: integer("dalit_member_count"),
    janajatiMemberCount: integer("janajati_member_count"),
    brahminChhetriMemberCount: integer("brahmin_chhetri_member_count"),
    madhesiMemberCount: integer("madhesi_member_count"),
    muslimMemberCount: integer("muslim_member_count"),
    otherEthnicityMemberCount: integer("other_ethnicity_member_count"),
    pwdMemberCount: integer("pwd_member_count"), // Members with disabilities
    youthMemberCount: integer("youth_member_count"),
    womenMemberCount: integer("women_member_count"),
    membershipFeeNPR: decimal("membership_fee_npr", {
      precision: 10,
      scale: 2,
    }),

    // Physical infrastructure
    hasDedicatedBuilding: boolean("has_dedicated_building").default(true),
    buildingOwnership: text("building_ownership"), // "Owned", "Rented", "Shared", etc.
    monthlyRentNPR: decimal("monthly_rent_npr", { precision: 10, scale: 2 }),
    totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
    buildingCondition: buildingConditionEnum("building_condition"),
    constructionYear: integer("construction_year"),
    constructionMaterial: buildingConstructionMaterialEnum(
      "construction_material",
    ),
    lastRenovatedYear: integer("last_renovated_year"),
    totalFloors: integer("total_floors"),
    totalRooms: integer("total_rooms"),
    meetingHallCapacity: integer("meeting_hall_capacity"), // Number of people
    hasTrainingHall: boolean("has_training_hall").default(false),
    trainingHallCapacity: integer("training_hall_capacity"),
    hasOfficeSpace: boolean("has_office_space").default(false),
    hasReceptionArea: boolean("has_reception_area").default(false),
    hasWaitingArea: boolean("has_waiting_area").default(false),
    hasStorage: boolean("has_storage").default(false),
    hasKitchen: boolean("has_kitchen").default(false),

    // Basic facilities
    hasElectricity: boolean("has_electricity").default(true),
    hasPowerBackup: boolean("has_power_backup").default(false),
    powerBackupType: text("power_backup_type"),
    hasWaterSupply: boolean("has_water_supply").default(true),
    hasToilets: boolean("has_toilets").default(true),
    hasSeparateToiletsForGenders: boolean(
      "has_separate_toilets_for_genders",
    ).default(false),
    hasInternetConnectivity: boolean("has_internet_connectivity").default(
      false,
    ),
    internetType: text("internet_type"),
    internetSpeed: text("internet_speed"),

    // Equipment and resources
    hasComputers: boolean("has_computers").default(false),
    computerCount: integer("computer_count"),
    hasLaptops: boolean("has_laptops").default(false),
    laptopCount: integer("laptop_count"),
    hasPrinters: boolean("has_printers").default(false),
    printerCount: integer("printer_count"),
    hasPhotocopiers: boolean("has_photocopiers").default(false),
    photocopierCount: integer("photocopier_count"),
    hasProjector: boolean("has_projector").default(false),
    hasVehicles: boolean("has_vehicles").default(false),
    vehicleTypes: text("vehicle_types"),
    vehicleCount: integer("vehicle_count"),
    hasMotorbikes: boolean("has_motorbikes").default(false),
    motorbikeCount: integer("motorbike_count"),
    hasTechnicalEquipment: boolean("has_technical_equipment").default(false),
    technicalEquipmentDetails: text("technical_equipment_details"),

    // Activities and operations
    meetingFrequency: text("meeting_frequency"), // E.g., "Monthly", "Weekly"
    regularPrograms: text("regular_programs"),
    annualProgramCount: integer("annual_program_count"),
    beneficiariesServedAnnually: integer("beneficiaries_served_annually"),
    majorServices: text("major_services"),
    communityOutreachActivities: text("community_outreach_activities"),
    advocacyActivities: text("advocacy_activities"),
    skillDevelopmentPrograms: text("skill_development_programs"),
    majorAnnualEvents: text("major_annual_events"),
    usageFrequency: usageFrequencyEnum("usage_frequency"),
    officeOpeningTime: time("office_opening_time"),
    officeClosingTime: time("office_closing_time"),
    weeklyOffDays: text("weekly_off_days"),

    // Financial aspects
    hasBank: boolean("has_bank_account").default(true),
    bankAccountDetails: text("bank_account_details"),
    annualBudgetNPR: decimal("annual_budget_npr", { precision: 18, scale: 2 }),
    annualOperatingCostNPR: decimal("annual_operating_cost_npr", {
      precision: 18,
      scale: 2,
    }),
    annualProgramCostNPR: decimal("annual_program_cost_npr", {
      precision: 18,
      scale: 2,
    }),
    fundingSources: text("funding_sources"),
    hasMultipleYearFunding: boolean("has_multiple_year_funding").default(false),
    hasEndowmentFund: boolean("has_endowment_fund").default(false),
    endowmentFundSizeNPR: decimal("endowment_fund_size_npr", {
      precision: 18,
      scale: 2,
    }),
    hasEmergencyFund: boolean("has_emergency_fund").default(false),
    hasAnnualAudit: boolean("has_annual_audit").default(true),
    lastAuditDate: date("last_audit_date"),
    receivesExternalFunding: boolean("receives_external_funding").default(
      false,
    ),
    externalFundingSources: text("external_funding_sources"),
    receivesGovernmentFunding: boolean("receives_government_funding").default(
      false,
    ),
    governmentFundingDetails: text("government_funding_details"),
    hasIncomingGeneratingActivities: boolean(
      "has_incoming_generating_activities",
    ).default(false),
    incomeGeneratingActivitiesDetails: text(
      "income_generating_activities_details",
    ),

    // For cooperatives and microfinance
    hasSavingCreditProgram: boolean("has_saving_credit_program").default(false),
    totalSavingsNPR: decimal("total_savings_npr", { precision: 18, scale: 2 }),
    loanPortfolioSizeNPR: decimal("loan_portfolio_size_npr", {
      precision: 18,
      scale: 2,
    }),
    interestRatePercent: decimal("interest_rate_percent", {
      precision: 5,
      scale: 2,
    }),
    defaultRatePercent: decimal("default_rate_percent", {
      precision: 5,
      scale: 2,
    }),
    activeBorrowerCount: integer("active_borrower_count"),
    femaleBorrowerPercent: integer("female_borrower_percent"),
    performingLoanPercent: integer("performing_loan_percent"),

    // Governance and leadership
    hasWrittenConstitution: boolean("has_written_constitution").default(true),
    hasOperationalManual: boolean("has_operational_manual").default(false),
    hasHumanResourcePolicy: boolean("has_human_resource_policy").default(false),
    hasFinancialPolicy: boolean("has_financial_policy").default(false),
    hasProcurementPolicy: boolean("has_procurement_policy").default(false),
    hasChildProtectionPolicy: boolean("has_child_protection_policy").default(
      false,
    ),
    hasGenderPolicy: boolean("has_gender_policy").default(false),
    boardSize: integer("board_size"),
    femaleInBoard: integer("female_in_board"),
    marginalisedGroupsInBoard: integer("marginalised_groups_in_board"),
    boardSelectionProcess: text("board_selection_process"),
    boardTermYears: integer("board_term_years"),
    lastBoardElectionDate: date("last_board_election_date"),
    hasGeneralAssembly: boolean("has_general_assembly").default(true),
    generalAssemblyFrequency: text("general_assembly_frequency"),
    decisionMakingProcess: text("decision_making_process"),
    hasSubcommittees: boolean("has_subcommittees").default(false),
    subcommitteeDetails: text("subcommittee_details"),
    hasConflictOfInterestPolicy: boolean(
      "has_conflict_of_interest_policy",
    ).default(false),

    // Staff and human resources
    hasFullTimeStaff: boolean("has_full_time_staff").default(false),
    fullTimeStaffCount: integer("full_time_staff_count"),
    hasPartTimeStaff: boolean("has_part_time_staff").default(false),
    partTimeStaffCount: integer("part_time_staff_count"),
    maleStaffCount: integer("male_staff_count"),
    femaleStaffCount: integer("female_staff_count"),
    inclusiveStaffingPolicy: boolean("inclusive_staffing_policy").default(
      false,
    ),
    staffTurnoverRatePercent: decimal("staff_turnover_rate_percent", {
      precision: 5,
      scale: 2,
    }),
    staffTrainingBudgetPercent: decimal("staff_training_budget_percent", {
      precision: 5,
      scale: 2,
    }),
    volunteerCount: integer("volunteer_count"),
    usesExternalConsultants: boolean("uses_external_consultants").default(
      false,
    ),
    hasSocialSecurity: boolean("has_social_security").default(false),
    hasInsuranceForStaff: boolean("has_insurance_for_staff").default(false),

    // Project and program management
    ongoingProjectCount: integer("ongoing_project_count"),
    completedProjectCount: integer("completed_project_count"),
    hasLogicalFramework: boolean("has_logical_framework").default(false),
    hasMonitoringEvaluationSystem: boolean(
      "has_monitoring_evaluation_system",
    ).default(false),
    monitoringEvaluationDetails: text("monitoring_evaluation_details"),
    hasBaselineData: boolean("has_baseline_data").default(false),
    conductsBeneficiarySatisfactionSurvey: boolean(
      "conducts_beneficiary_satisfaction_survey",
    ).default(false),
    hasExternalEvaluation: boolean("has_external_evaluation").default(false),
    majorProjectDetails: text("major_project_details"),
    projectSuccessRate: integer("project_success_rate"),

    // Partnerships and networks
    hasPartnershipWithLocalGovernment: boolean(
      "has_partnership_with_local_government",
    ).default(false),
    localGovernmentPartnershipDetails: text(
      "local_government_partnership_details",
    ),
    hasPartnershipWithProvincialGovernment: boolean(
      "has_partnership_with_provincial_government",
    ).default(false),
    provincialGovernmentPartnershipDetails: text(
      "provincial_government_partnership_details",
    ),
    hasPartnershipWithFederalGovernment: boolean(
      "has_partnership_with_federal_government",
    ).default(false),
    federalGovernmentPartnershipDetails: text(
      "federal_government_partnership_details",
    ),
    hasPartnershipWithINGOs: boolean("has_partnership_with_ingos").default(
      false,
    ),
    ingoPartnershipDetails: text("ingo_partnership_details"),
    hasPartnershipWithPrivateSector: boolean(
      "has_partnership_with_private_sector",
    ).default(false),
    privateSectorPartnershipDetails: text("private_sector_partnership_details"),
    hasPartnershipWithAcademia: boolean(
      "has_partnership_with_academia",
    ).default(false),
    academiaPartnershipDetails: text("academia_partnership_details"),
    networkMemberships: text("network_memberships"),

    // Accessibility and inclusion
    accessibilityLevel: accessibilityLevelEnum("accessibility_level"),
    distanceFromMainRoadKm: decimal("distance_from_main_road_km", {
      precision: 6,
      scale: 2,
    }),
    distanceFromCityOrBazarKm: decimal("distance_from_city_or_bazar_km", {
      precision: 6,
      scale: 2,
    }),
    publicTransportAccessibility: text("public_transport_accessibility"),
    inclusionPolicies: text("inclusion_policies"),
    inclusionChallenges: text("inclusion_challenges"),
    genderMainstreaming: text("gender_mainstreaming"),
    disabledAccessibility: text("disabled_accessibility"),

    // Impact and achievements
    majorAchievements: text("major_achievements"),
    communityImpact: text("community_impact"),
    successStories: text("success_stories"),
    innovationInitiatives: text("innovation_initiatives"),
    goodPractices: text("good_practices"),
    awardsAndRecognition: text("awards_and_recognition"),
    researchPublications: text("research_publications"),

    // Challenges and needs
    infrastructureChallenges: text("infrastructure_challenges"),
    technicalChallenges: text("technical_challenges"),
    financialChallenges: text("financial_challenges"),
    socialChallenges: text("social_challenges"),
    governanceChallenges: text("governance_challenges"),
    capacityBuildingNeeds: text("capacity_building_needs"),
    fundingNeeds: text("funding_needs"),

    // Future plans
    strategicPriorities: text("strategic_priorities"),
    expansionPlans: text("expansion_plans"),
    sustainabilityPlans: text("sustainability_plans"),
    futureProjectsPlanned: text("future_projects_planned"),
    partnershipPlans: text("partnership_plans"),
    innovationPlans: text("innovation_plans"),

    // Security and safety
    hasSafetyProtocol: boolean("has_safety_protocol").default(false),
    safetyProtocolDetails: text("safety_protocol_details"),
    hasFirstAidKit: boolean("has_first_aid_kit").default(false),
    hasFireExtinguisher: boolean("has_fire_extinguisher").default(false),
    hasEmergencyExits: boolean("has_emergency_exits").default(false),
    hasSecurityGuard: boolean("has_security_guard").default(false),
    hasCCTV: boolean("has_cctv").default(false),
    hasBoundaryWall: boolean("has_boundary_wall").default(false),

    // Contact information
    contactPersonName: text("contact_person_name"),
    contactPersonDesignation: text("contact_person_designation"),
    chairpersonName: text("chairperson_name"),
    executiveDirectorName: text("executive_director_name"),
    contactPhone: text("contact_phone"),
    alternateContactPhone: text("alternate_contact_phone"),
    contactEmail: text("contact_email"),
    officialEmail: text("official_email"),

    // Digital presence
    hasSocialMediaPresence: boolean("has_social_media_presence").default(false),
    facebookPage: text("facebook_page"),
    websiteUrl: text("website_url"),
    otherSocialMedia: text("other_social_media"),
    hasDigitalDatabase: boolean("has_digital_database").default(false),
    usesAccountingSoftware: boolean("uses_accounting_software").default(false),
    accountingSoftwareDetails: text("accounting_software_details"),
    usesHRSoftware: boolean("uses_hr_software").default(false),
    usesProgramManagementSoftware: boolean(
      "uses_program_management_software",
    ).default(false),
    softwareDetails: text("software_details"),

    // Linkages to other entities
    linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
    linkedCommunityGroups: jsonb("linked_community_groups").default(
      sql`'[]'::jsonb`,
    ),
    linkedSchools: jsonb("linked_schools").default(sql`'[]'::jsonb`),
    linkedHealthFacilities: jsonb("linked_health_facilities").default(
      sql`'[]'::jsonb`,
    ),
    linkedNGOs: jsonb("linked_ngos").default(sql`'[]'::jsonb`),
    linkedPrivateSector: jsonb("linked_private_sector").default(
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
  },
);

export type CommunityBasedOrganizationBuilding =
  typeof communityBasedOrganizationBuilding.$inferSelect;
export type NewCommunityBasedOrganizationBuilding =
  typeof communityBasedOrganizationBuilding.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
