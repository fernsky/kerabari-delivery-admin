import { pgTable } from "../../../../schema/basic";
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
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define industrial sector type enum
export const industrialSectorTypeEnum = pgEnum("industrial_sector_type", [
  "INDUSTRIAL_ESTATE",
  "SPECIAL_ECONOMIC_ZONE",
  "EXPORT_PROCESSING_ZONE",
  "INDUSTRIAL_CORRIDOR",
  "INDUSTRIAL_VILLAGE",
  "INDUSTRIAL_PARK",
  "TECHNOLOGY_PARK",
  "INDUSTRIAL_CLUSTER",
  "AGRICULTURAL_INDUSTRIAL_ZONE",
  "TOURISM_INDUSTRIAL_ZONE",
  "OTHER",
]);

// Define development status enum
export const developmentStatusEnum = pgEnum("development_status", [
  "CONCEPTUAL",
  "FEASIBILITY_STUDY",
  "MASTER_PLANNING",
  "UNDER_DEVELOPMENT",
  "PARTIALLY_OPERATIONAL",
  "FULLY_OPERATIONAL",
  "EXPANSION_PHASE",
  "RENOVATION_PHASE",
  "STALLED",
]);

// Define facility condition enum
export const facilityConditionEnum = pgEnum("facility_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_IMPROVEMENT",
  "POOR",
]);

// Government Announced Industrial Sector table
export const governmentAnnouncedIndustrialSector = pgTable(
  "government_announced_industrial_sector",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    nameInLocalLanguage: text("name_in_local_language"),
    description: text("description"),
    sectorType: industrialSectorTypeEnum("sector_type").notNull(),

    // Location details
    wardNumber: integer("ward_number"),
    location: text("location"),
    address: text("address"),

    // Basic information
    announcementDate: date("announcement_date"),
    establishedDate: date("established_date"),
    operationalDate: date("operational_date"),
    governmentDecreeNumber: varchar("government_decree_number", { length: 50 }),
    developmentStatus: developmentStatusEnum("development_status").notNull(),
    implementingAgency: text("implementing_agency"),
    managingAuthority: text("managing_authority"),
    masterPlanExists: boolean("master_plan_exists").default(false),

    // Contact information
    phoneNumber: text("phone_number"),
    alternatePhoneNumber: text("alternate_phone_number"),
    email: text("email"),
    websiteUrl: text("website_url"),

    // Social media
    facebookPage: text("facebook_page"),
    twitterHandle: text("twitter_handle"),

    // Leadership & Management
    directorName: text("director_name"),
    directorContactNumber: text("director_contact_number"),
    managementStructure: text("management_structure"),
    hasManagementBoard: boolean("has_management_board").default(false),
    managementBoardDetails: text("management_board_details"),

    // Area details
    totalLandAreaHectares: decimal("total_land_area_hectares", {
      precision: 10,
      scale: 2,
    }),
    developedAreaHectares: decimal("developed_area_hectares", {
      precision: 10,
      scale: 2,
    }),
    undevelopedAreaHectares: decimal("undeveloped_area_hectares", {
      precision: 10,
      scale: 2,
    }),
    expandableAreaHectares: decimal("expandable_area_hectares", {
      precision: 10,
      scale: 2,
    }),
    greenAreaHectares: decimal("green_area_hectares", {
      precision: 10,
      scale: 2,
    }),

    // Land details
    landAcquisitionStatus: text("land_acquisition_status"),
    landOwnershipPattern: text("land_ownership_pattern"),
    landDisputesExists: boolean("land_disputes_exists").default(false),
    landDisputesDetails: text("land_disputes_details"),

    // Plots and tenants
    totalPlots: integer("total_plots"),
    allocatedPlots: integer("allocated_plots"),
    availablePlots: integer("available_plots"),
    plotSizeRangesSqm: text("plot_size_ranges_sqm"),
    totalIndustriesOperating: integer("total_industries_operating"),
    totalIndustriesUnderConstruction: integer(
      "total_industries_under_construction",
    ),
    plotAllocationProcess: text("plot_allocation_process"),
    landLeaseRatePerSqmNPR: decimal("land_lease_rate_per_sqm_npr", {
      precision: 10,
      scale: 2,
    }),
    landPurchaseRatePerSqmNPR: decimal("land_purchase_rate_per_sqm_npr", {
      precision: 10,
      scale: 2,
    }),

    // Industry types
    focusIndustryTypes: text("focus_industry_types"),
    allowedIndustryTypes: text("allowed_industry_types"),
    restrictedIndustryTypes: text("restricted_industry_types"),
    majorIndustriesPresent: text("major_industries_present"),
    flagshipIndustries: text("flagship_industries"),

    // Infrastructure
    roadInfrastructureStatus: facilityConditionEnum(
      "road_infrastructure_status",
    ),
    internalRoadsKm: decimal("internal_roads_km", { precision: 6, scale: 2 }),
    hasAccessToHighway: boolean("has_access_to_highway").default(false),
    distanceToHighwayKm: decimal("distance_to_highway_km", {
      precision: 6,
      scale: 2,
    }),
    waterSupplyStatus: facilityConditionEnum("water_supply_status"),
    waterSupplyCapacityLitersPerDay: integer(
      "water_supply_capacity_liters_per_day",
    ),
    electricitySupplyStatus: facilityConditionEnum("electricity_supply_status"),
    powerSupplyCapacityMW: decimal("power_supply_capacity_mw", {
      precision: 8,
      scale: 2,
    }),
    hasDedicatedPowerSubstation: boolean(
      "has_dedicated_power_substation",
    ).default(false),
    powerSubstationCapacityMVA: decimal("power_substation_capacity_mva", {
      precision: 8,
      scale: 2,
    }),
    wasteManagementStatus: facilityConditionEnum("waste_management_status"),
    wasteTreatmentFacilitiesDetails: text("waste_treatment_facilities_details"),
    internetConnectivityStatus: facilityConditionEnum(
      "internet_connectivity_status",
    ),
    hasIndustrialSewerage: boolean("has_industrial_sewerage").default(false),
    sewerageCapacity: text("sewerage_capacity"),

    // Transportation and logistics
    distanceToNearestCityKm: decimal("distance_to_nearest_city_km", {
      precision: 6,
      scale: 2,
    }),
    nearestCityName: text("nearest_city_name"),
    distanceToAirportKm: decimal("distance_to_airport_km", {
      precision: 6,
      scale: 2,
    }),
    nearestAirportName: text("nearest_airport_name"),
    distanceToRailwayKm: decimal("distance_to_railway_km", {
      precision: 6,
      scale: 2,
    }),
    nearestRailwayStationName: text("nearest_railway_station_name"),
    distanceToDryPortKm: decimal("distance_to_dry_port_km", {
      precision: 6,
      scale: 2,
    }),
    nearestDryPortName: text("nearest_dry_port_name"),
    hasTransportationFacilities: boolean(
      "has_transportation_facilities",
    ).default(false),
    transportationFacilitiesDetails: text("transportation_facilities_details"),
    hasCustomsClearanceCenter: boolean("has_customs_clearance_center").default(
      false,
    ),
    hasWarehouseFacilities: boolean("has_warehouse_facilities").default(false),
    warehouseCapacityDetails: text("warehouse_capacity_details"),
    hasLogisticsCenter: boolean("has_logistics_center").default(false),

    // Supporting facilities
    hasAdministrativeBuilding: boolean("has_administrative_building").default(
      false,
    ),
    hasBankBranches: boolean("has_bank_branches").default(false),
    bankBranchesCount: integer("bank_branches_count"),
    hasCustomsOffice: boolean("has_customs_office").default(false),
    hasOneStopServiceCenter: boolean("has_one_stop_service_center").default(
      false,
    ),
    oneStopServicesDetails: text("one_stop_services_details"),
    hasTrainingCenter: boolean("has_training_center").default(false),
    hasConferenceCenter: boolean("has_conference_center").default(false),
    hasExhibitionCenter: boolean("has_exhibition_center").default(false),
    hasResearchFacilities: boolean("has_research_facilities").default(false),
    hasHealthFacilities: boolean("has_health_facilities").default(false),
    hasFireStation: boolean("has_fire_station").default(false),

    // Business services
    hasBusinessIncubationCenter: boolean(
      "has_business_incubation_center",
    ).default(false),
    hasBusinessAccelerator: boolean("has_business_accelerator").default(false),
    hasConsultingServices: boolean("has_consulting_services").default(false),
    hasLaborRecruitmentCenter: boolean("has_labor_recruitment_center").default(
      false,
    ),

    // Living facilities
    hasHousingFacilities: boolean("has_housing_facilities").default(false),
    housingUnitsCount: integer("housing_units_count"),
    hasSchools: boolean("has_schools").default(false),
    hasDaycareFacilities: boolean("has_daycare_facilities").default(false),
    hasShoppingFacilities: boolean("has_shopping_facilities").default(false),
    hasRecreationalFacilities: boolean("has_recreational_facilities").default(
      false,
    ),

    // Economic impact
    totalInvestmentAmountNPR: decimal("total_investment_amount_npr", {
      precision: 18,
      scale: 2,
    }),
    foreignInvestmentAmountNPR: decimal("foreign_investment_amount_npr", {
      precision: 18,
      scale: 2,
    }),
    domesticInvestmentAmountNPR: decimal("domestic_investment_amount_npr", {
      precision: 18,
      scale: 2,
    }),
    annualProductionValueNPR: decimal("annual_production_value_npr", {
      precision: 18,
      scale: 2,
    }),
    annualExportValueNPR: decimal("annual_export_value_npr", {
      precision: 18,
      scale: 2,
    }),
    totalJobsCreated: integer("total_jobs_created"),
    directEmploymentCount: integer("direct_employment_count"),
    indirectEmploymentCount: integer("indirect_employment_count"),
    expectedAdditionalJobs: integer("expected_additional_jobs"),
    contributionToLocalEconomyDetails: text(
      "contribution_to_local_economy_details",
    ),

    // Incentives and benefits
    taxIncentives: text("tax_incentives"),
    customDutyExemptions: text("custom_duty_exemptions"),
    landSubsidies: text("land_subsidies"),
    infrastructureSubsidies: text("infrastructure_subsidies"),
    otherIncentives: text("other_incentives"),
    eligibilityRequirements: text("eligibility_requirements"),

    // Governance and regulation
    applicableLaws: text("applicable_laws"),
    specialRegulations: text("special_regulations"),
    environmentalComplianceRequirements: text(
      "environmental_compliance_requirements",
    ),
    hasEnvironmentalMonitoring: boolean("has_environmental_monitoring").default(
      false,
    ),
    environmentalMonitoringDetails: text("environmental_monitoring_details"),

    // Development and expansion
    developmentPhase: text("development_phase"),
    developmentTimelineYears: integer("development_timeline_years"),
    currentDevelopmentStatus: text("current_development_status"),
    totalDevelopmentCostNPR: decimal("total_development_cost_npr", {
      precision: 18,
      scale: 2,
    }),
    investedAmountSoFarNPR: decimal("invested_amount_so_far_npr", {
      precision: 18,
      scale: 2,
    }),
    fundingSourcesForDevelopment: text("funding_sources_for_development"),
    hasExpansionPlans: boolean("has_expansion_plans").default(false),
    expansionPlansDetails: text("expansion_plans_details"),

    // Challenges and issues
    majorChallenges: text("major_challenges"),
    infrastructureChallenges: text("infrastructure_challenges"),
    regulatoryChallenges: text("regulatory_challenges"),
    marketAccessChallenges: text("market_access_challenges"),
    humanResourceChallenges: text("human_resource_challenges"),

    // Community relations
    impactOnLocalCommunity: text("impact_on_local_community"),
    communityDevelopmentInitiatives: text("community_development_initiatives"),
    localSkillDevelopmentPrograms: text("local_skill_development_programs"),
    hasDisplacementIssues: boolean("has_displacement_issues").default(false),
    displacementMitigationMeasures: text("displacement_mitigation_measures"),

    // SEO fields
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    keywords: text("keywords"),

    // Linkages to other entities
    linkedIndustries: jsonb("linked_industries").default(sql`'[]'::jsonb`),
    linkedMunicipalityOffices: jsonb("linked_municipality_offices").default(
      sql`'[]'::jsonb`,
    ),
    linkedGovernmentOffices: jsonb("linked_government_offices").default(
      sql`'[]'::jsonb`,
    ),
    linkedResearchCenters: jsonb("linked_research_centers").default(
      sql`'[]'::jsonb`,
    ),

    // Geometry fields
    locationPoint: geometry("location_point", { type: "Point" }),
    sectorBoundary: geometry("sector_boundary", { type: "Polygon" }),
    infrastructureNetwork: geometry("infrastructure_network", {
      type: "MultiLineString",
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
  },
);

export type GovernmentAnnouncedIndustrialSector =
  typeof governmentAnnouncedIndustrialSector.$inferSelect;
export type NewGovernmentAnnouncedIndustrialSector =
  typeof governmentAnnouncedIndustrialSector.$inferInsert;

export { generateSlug } from "@/server/utils/slug-helpers";
