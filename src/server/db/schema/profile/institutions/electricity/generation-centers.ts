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
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define generation type enum
export const generationTypeEnum = pgEnum("generation_type", [
  "HYDROPOWER",
  "MICRO_HYDROPOWER",
  "MINI_HYDROPOWER",
  "SOLAR_FARM",
  "WIND_FARM",
  "THERMAL",
  "DIESEL_GENERATOR",
  "BIOMASS",
  "HYBRID",
  "OTHER",
]);

// Define operational status enum
export const operationalStatusEnum = pgEnum("operational_status", [
  "OPERATIONAL",
  "UNDER_CONSTRUCTION",
  "PLANNED",
  "UNDER_MAINTENANCE",
  "DECOMMISSIONED",
  "PARTIALLY_OPERATIONAL",
  "SEASONAL_OPERATION",
  "TESTING_PHASE",
]);

// Define ownership type enum
export const ownershipTypeEnum = pgEnum("ownership_type", [
  "GOVERNMENT",
  "PRIVATE",
  "COMMUNITY",
  "PUBLIC_PRIVATE_PARTNERSHIP",
  "COOPERATIVE",
  "FOREIGN_INVESTMENT",
  "JOINT_VENTURE",
  "NEA", // Nepal Electricity Authority
  "IPP", // Independent Power Producer
  "OTHER",
]);

// Electricity Generation Center table
export const electricityGenerationCenter = pgTable(
  "electricity_generation_center",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    generationType: generationTypeEnum("generation_type").notNull(),

    // Location details
    wardNumber: integer("ward_number"),
    location: text("location"),
    address: text("address"),
    riverBasin: text("river_basin"), // For hydropower
    riverName: text("river_name"), // For hydropower

    // Basic information
    capacity: decimal("capacity_mw", { precision: 10, scale: 3 }).notNull(), // In Megawatts
    operationalStatus: operationalStatusEnum("operational_status").notNull(),
    commissionedDate: date("commissioned_date"),
    licenseNumber: varchar("license_number", { length: 50 }),
    licensingAuthority: text("licensing_authority"),
    licenseIssueDate: date("license_issue_date"),
    licenseExpiryDate: date("license_expiry_date"),
    ownershipType: ownershipTypeEnum("ownership_type").notNull(),
    ownerOrganization: text("owner_organization"),
    operatorOrganization: text("operator_organization"),

    // Technical specifications
    designDischarge: decimal("design_discharge_cumecs", {
      precision: 10,
      scale: 3,
    }), // For hydropower, cubic meters per second
    grossHead: decimal("gross_head_m", { precision: 10, scale: 2 }), // For hydropower, in meters
    netHead: decimal("net_head_m", { precision: 10, scale: 2 }), // For hydropower, in meters
    turbineType: text("turbine_type"), // For hydropower (e.g., Francis, Pelton, Kaplan)
    turbineCount: integer("turbine_count"),
    generatorCapacityKVA: decimal("generator_capacity_kva", {
      precision: 10,
      scale: 2,
    }),
    generatorType: text("generator_type"),
    generatorCount: integer("generator_count"),
    transformerCount: integer("transformer_count"),
    mainTransformerCapacityMVA: decimal("main_transformer_capacity_mva", {
      precision: 10,
      scale: 2,
    }),
    hasReservoir: boolean("has_reservoir").default(false), // For hydropower
    reservoirCapacityMillionCubicMeters: decimal(
      "reservoir_capacity_million_cubic_meters",
      { precision: 12, scale: 3 },
    ),
    hasDam: boolean("has_dam").default(false), // For hydropower
    damHeight: decimal("dam_height_m", { precision: 8, scale: 2 }), // For hydropower, in meters
    damLength: decimal("dam_length_m", { precision: 8, scale: 2 }), // For hydropower, in meters
    damType: text("dam_type"), // For hydropower
    canalLengthMeters: decimal("canal_length_meters", {
      precision: 10,
      scale: 2,
    }), // For hydropower
    penstock: boolean("has_penstock").default(false), // For hydropower
    penstockLengthMeters: decimal("penstock_length_meters", {
      precision: 10,
      scale: 2,
    }), // For hydropower
    penstockDiameterMeters: decimal("penstock_diameter_meters", {
      precision: 6,
      scale: 2,
    }), // For hydropower
    penstockMaterial: text("penstock_material"), // For hydropower
    designEfficiency: decimal("design_efficiency_percent", {
      precision: 5,
      scale: 2,
    }),

    // For micro-hydro
    isMicroHydro: boolean("is_micro_hydro").default(false),
    serviceAreaDetails: text("service_area_details"),
    householdsServed: integer("households_served"),
    beneficiaryPopulation: integer("beneficiary_population"),
    communityContribution: text("community_contribution"),

    // Power generation and transmission
    annualGenerationGWh: decimal("annual_generation_gwh", {
      precision: 12,
      scale: 3,
    }), // Gigawatt-hours
    designEnergyGWh: decimal("design_energy_gwh", { precision: 12, scale: 3 }), // Gigawatt-hours
    powerFactorPercent: decimal("power_factor_percent", {
      precision: 5,
      scale: 2,
    }),
    gridConnected: boolean("grid_connected").default(true),
    voltageLevel: integer("voltage_level_kv").notNull(), // In kilovolts
    transmissionLineDetails: text("transmission_line_details"),
    transmissionLineLengthKm: decimal("transmission_line_length_km", {
      precision: 8,
      scale: 2,
    }),
    interconnectionSubstation: text("interconnection_substation"),

    // Environmental aspects
    environmentalImpactAssessment: boolean(
      "environmental_impact_assessment",
    ).default(false),
    environmentalMitigationMeasures: text("environmental_mitigation_measures"),
    minimumFlowReleasePercent: decimal("minimum_flow_release_percent", {
      precision: 5,
      scale: 2,
    }), // For hydropower
    fishLadder: boolean("fish_ladder").default(false), // For hydropower
    treePlantingCompensation: integer("tree_planting_compensation"), // Number of trees
    carbonOffset: decimal("carbon_offset_tons_per_year", {
      precision: 10,
      scale: 2,
    }),

    // Staff and management
    totalStaffCount: integer("total_staff_count"),
    technicalStaffCount: integer("technical_staff_count"),
    administrativeStaffCount: integer("administrative_staff_count"),
    securityStaffCount: integer("security_staff_count"),
    localEmploymentCount: integer("local_employment_count"),

    // Financial aspects
    totalProjectCostNPR: decimal("total_project_cost_npr", {
      precision: 18,
      scale: 2,
    }),
    annualRevenueMillion: decimal("annual_revenue_million_npr", {
      precision: 14,
      scale: 2,
    }),
    powerPurchaseAgreement: boolean("power_purchase_agreement").default(false),
    powerPurchaseRate: decimal("power_purchase_rate_npr_per_unit", {
      precision: 8,
      scale: 4,
    }),
    powerPurchaseAgreementExpiryDate: date(
      "power_purchase_agreement_expiry_date",
    ),
    royaltyPaymentMillion: decimal("royalty_payment_million_npr", {
      precision: 14,
      scale: 2,
    }),

    // Safety and security
    hasSecuritySystem: boolean("has_security_system").default(true),
    securitySystemDetails: text("security_system_details"),
    hasFireSafetyMeasures: boolean("has_fire_safety_measures").default(true),
    fireSafetyDetails: text("fire_safety_details"),
    emergencyResponsePlan: boolean("emergency_response_plan").default(false),
    safetyTrainings: text("safety_trainings"),
    hasAccidentHistory: boolean("has_accident_history").default(false),
    accidentDetails: text("accident_details"),

    // Operation and maintenance
    maintenanceSchedule: text("maintenance_schedule"),
    lastMajorMaintenance: date("last_major_maintenance"),
    plannedOutages: text("planned_outages"),
    performanceIssues: text("performance_issues"),
    upgradePlans: text("upgrade_plans"),
    refurbishmentHistory: text("refurbishment_history"),

    // Community relations
    localBenefitSharingMechanism: text("local_benefit_sharing_mechanism"),
    communityDevelopmentPrograms: text("community_development_programs"),
    localComplaintMechanism: text("local_complaint_mechanism"),
    corporateSocialResponsibility: text("corporate_social_responsibility"),

    // Access and infrastructure
    accessRoadCondition: text("access_road_condition"),
    accessibilityDetails: text("accessibility_details"),
    nearestTownDistance: decimal("nearest_town_distance_km", {
      precision: 6,
      scale: 2,
    }),

    // Monitoring and automation
    hasScada: boolean("has_scada").default(false),
    automationLevel: text("automation_level"),
    remoteOperationCapability: boolean("remote_operation_capability").default(
      false,
    ),
    monitoringSystem: text("monitoring_system"),

    // Contact information
    plantManagerName: text("plant_manager_name"),
    contactPhone: text("contact_phone"),
    emergencyContactPhone: text("emergency_contact_phone"),
    email: text("email"),
    websiteUrl: text("website_url"),

    // Challenges and issues
    operationalChallenges: text("operational_challenges"),
    environmentalChallenges: text("environmental_challenges"),
    socialChallenges: text("social_challenges"),
    technicalChallenges: text("technical_challenges"),

    // Future development
    expansionPlans: text("expansion_plans"),
    futureCapacityMW: decimal("future_capacity_mw", {
      precision: 10,
      scale: 3,
    }),
    rehabilitationNeeds: text("rehabilitation_needs"),

    // Linkages to other entities
    linkedSubstations: jsonb("linked_substations").default(sql`'[]'::jsonb`),
    linkedTransformers: jsonb("linked_transformers").default(sql`'[]'::jsonb`),
    linkedWaterBodies: jsonb("linked_water_bodies").default(sql`'[]'::jsonb`),

    // SEO fields
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    keywords: text("keywords"),

    // Geometry fields
    locationPoint: geometry("location_point", { type: "Point" }),
    facilityArea: geometry("facility_area", { type: "Polygon" }),
    reservoirArea: geometry("reservoir_area", { type: "Polygon" }),
    serviceAreaCoverage: geometry("service_area_coverage", {
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
  },
);

export type ElectricityGenerationCenter =
  typeof electricityGenerationCenter.$inferSelect;
export type NewElectricityGenerationCenter =
  typeof electricityGenerationCenter.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
