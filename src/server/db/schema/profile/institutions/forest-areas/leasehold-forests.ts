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

// Define leasehold forest condition enum
export const leaseholdForestConditionEnum = pgEnum(
  "leasehold_forest_condition",
  ["EXCELLENT", "GOOD", "FAIR", "POOR", "DEGRADED", "UNDER_RESTORATION"],
);

// Define leasehold forest type enum
export const leaseholdForestTypeEnum = pgEnum("leasehold_forest_type", [
  "POVERTY_ALLEVIATION",
  "INDUSTRIAL",
  "ECOTOURISM",
  "AGROFORESTRY",
  "CONSERVATION",
  "MIXED_USE",
  "OTHER",
]);

// Define terrain type enum
export const forestTerrainTypeEnum = pgEnum("forest_terrain_type", [
  "PLAIN",
  "HILL",
  "MOUNTAIN",
  "VALLEY",
  "SLOPE",
  "PLATEAU",
  "RIVERBANK",
  "MIXED",
]);

// Define management system enum
export const forestManagementSystemEnum = pgEnum("forest_management_system", [
  "TRADITIONAL",
  "SCIENTIFIC",
  "PARTICIPATORY",
  "ECOSYSTEM_BASED",
  "SUSTAINABLE",
  "MINIMAL_INTERVENTION",
  "OTHER",
]);

// Define benefit sharing mechanism enum
export const benefitSharingMechanismEnum = pgEnum("benefit_sharing_mechanism", [
  "EQUITABLE",
  "GROUP_BASED",
  "PERFORMANCE_BASED",
  "NEEDS_BASED",
  "CONTRIBUTION_BASED",
  "MIXED",
  "OTHER",
]);

// Leasehold Forest table
export const leaseholdForest = pgTable("leasehold_forest", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  forestType: leaseholdForestTypeEnum("forest_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Area/Tole name
  address: text("address"),

  // Administrative details
  forestRegistrationNumber: varchar("forest_registration_number", {
    length: 50,
  }),
  leaseAgreementNumber: varchar("lease_agreement_number", { length: 50 }),
  leaseStartDate: date("lease_start_date"),
  leaseDurationYears: integer("lease_duration_years"),
  leaseEndDate: date("lease_end_date"),
  isRenewable: boolean("is_renewable").default(true),
  renewalConditions: text("renewal_conditions"),
  lastRenewalDate: date("last_renewal_date"),
  nextRenewalDate: date("next_renewal_date"),
  administeredBy: text("administered_by"), // Department name
  issuingAuthority: text("issuing_authority"),
  renterGroupName: text("renter_group_name"), // Name of the group leasing the forest
  renterGroupRegistrationNumber: varchar("renter_group_registration_number", {
    length: 50,
  }),
  renterGroupFormationDate: date("renter_group_formation_date"),

  // Physical characteristics
  totalAreaHectares: decimal("total_area_hectares", {
    precision: 10,
    scale: 2,
  }),
  boundaryLength: decimal("boundary_length", { precision: 10, scale: 2 }), // in KM
  elevationRangeMin: integer("elevation_range_min"), // in meters
  elevationRangeMax: integer("elevation_range_max"), // in meters
  terrainType: forestTerrainTypeEnum("terrain_type"),
  slopePercentage: decimal("slope_percentage", { precision: 5, scale: 2 }),
  soilType: text("soil_type"),
  majorWatershed: text("major_watershed"),
  forestCondition: leaseholdForestConditionEnum("forest_condition"),
  canopyCoverPercentage: decimal("canopy_cover_percentage", {
    precision: 5,
    scale: 2,
  }),
  hasEncroachment: boolean("has_encroachment").default(false),
  encroachmentDetails: text("encroachment_details"),
  hasBoundaryDisputes: boolean("has_boundary_disputes").default(false),
  boundaryDisputeDetails: text("boundary_dispute_details"),

  // Biological details
  dominantTreeSpecies: text("dominant_tree_species"),
  dominantShrubSpecies: text("dominant_shrub_species"),
  dominantHerbSpecies: text("dominant_herb_species"),
  endangeredSpecies: text("endangered_species"),
  medicinalPlants: text("medicinal_plants"),
  wildlifeDiversity: text("wildlife_diversity"),
  biodiversityIndex: decimal("biodiversity_index", { precision: 5, scale: 2 }),
  treeCount: integer("tree_count"),
  treeCountYear: integer("tree_count_year"), // Year when tree count was done
  treeCountMethod: text("tree_count_method"),
  estimatedTimberVolumeCubicMeter: decimal(
    "estimated_timber_volume_cubic_meter",
    { precision: 10, scale: 2 },
  ),

  // Management details
  hasOperationalPlan: boolean("has_operational_plan").default(true),
  operationalPlanStartDate: date("operational_plan_start_date"),
  operationalPlanEndDate: date("operational_plan_end_date"),
  annualAllowableCutCubicMeter: decimal("annual_allowable_cut_cubic_meter", {
    precision: 10,
    scale: 2,
  }),
  managementSystem: forestManagementSystemEnum("management_system"),
  hasForestryTechnicalStaff: boolean("has_forestry_technical_staff").default(
    false,
  ),
  technicalStaffDetails: text("technical_staff_details"),
  cuttingCycle: integer("cutting_cycle"), // in years
  hasFireProtection: boolean("has_fire_protection").default(false),
  fireProtectionMeasures: text("fire_protection_measures"),
  hasPestDiseaseControl: boolean("has_pest_disease_control").default(false),
  pestDiseaseControlMeasures: text("pest_disease_control_measures"),
  monitoringFrequency: text("monitoring_frequency"),
  lastInventoryDate: date("last_inventory_date"),
  lastMonitoringDate: date("last_monitoring_date"),

  // Group details
  totalGroupMembers: integer("total_group_members"),
  maleMembers: integer("male_members"),
  femaleMembers: integer("female_members"),
  otherGenderMembers: integer("other_gender_members"),
  householdsRepresented: integer("households_represented"),
  dalitHouseholds: integer("dalit_households"),
  janajatiHouseholds: integer("janajati_households"),
  brahminChhetriHouseholds: integer("brahmin_chhetri_households"),
  muslimHouseholds: integer("muslim_households"),
  otherEthnicityHouseholds: integer("other_ethnicity_households"),
  poorHouseholds: integer("poor_households"),
  executiveCommitteeSize: integer("executive_committee_size"),
  womenInExecutiveCommittee: integer("women_in_executive_committee"),
  marginalisedGroupsInCommittee: integer("marginalised_groups_in_committee"),
  hasConstitution: boolean("has_constitution").default(true),
  hasEquitableBenefitSharing: boolean("has_equitable_benefit_sharing").default(
    true,
  ),
  benefitSharingMechanism: benefitSharingMechanismEnum(
    "benefit_sharing_mechanism",
  ),
  conflictResolutionMechanism: text("conflict_resolution_mechanism"),

  // Financial aspects
  annualRevenueLow: decimal("annual_revenue_low", { precision: 12, scale: 2 }), // Low estimate in NPR
  annualRevenueHigh: decimal("annual_revenue_high", {
    precision: 12,
    scale: 2,
  }), // High estimate in NPR
  annualInvestmentAmount: decimal("annual_investment_amount", {
    precision: 12,
    scale: 2,
  }), // in NPR
  hasSavingCreditScheme: boolean("has_saving_credit_scheme").default(false),
  totalSavingsNPR: decimal("total_savings_npr", { precision: 12, scale: 2 }),
  annualLeasePaymentNPR: decimal("annual_lease_payment_npr", {
    precision: 12,
    scale: 2,
  }),
  hasBank: boolean("has_bank_account").default(true),
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  forestDevelopmentFundNPR: decimal("forest_development_fund_npr", {
    precision: 12,
    scale: 2,
  }),
  lastAuditDate: date("last_audit_date"),

  // Products and utilization
  timberProductionCubicMeterPerYear: decimal(
    "timber_production_cubic_meter_per_year",
    { precision: 10, scale: 2 },
  ),
  firewoodProductionTonPerYear: decimal("firewood_production_ton_per_year", {
    precision: 10,
    scale: 2,
  }),
  fodderProductionTonPerYear: decimal("fodder_production_ton_per_year", {
    precision: 10,
    scale: 2,
  }),
  ntfpProduction: text("ntfp_production"), // Non-timber forest products
  ntfpSpecies: text("ntfp_species"),
  ntfpHarvestingRules: text("ntfp_harvesting_rules"),
  medicinalPlantUtilization: text("medicinal_plant_utilization"),
  ecotourismActivities: text("ecotourism_activities"),
  timberSalesPolicyRules: text("timber_sales_policy_rules"),
  grazing: text("grazing_rules"),

  // Conservation activities
  hasConservationPlan: boolean("has_conservation_plan").default(false),
  conservationActivities: text("conservation_activities"),
  conservationChallenges: text("conservation_challenges"),
  hasWatershedConservation: boolean("has_watershed_conservation").default(
    false,
  ),
  watershedConservationActivities: text("watershed_conservation_activities"),
  hasSeedlingsNursery: boolean("has_seedlings_nursery").default(false),
  seedlingsNurseryDetails: text("seedlings_nursery_details"),
  annualPlantingAreaHectare: decimal("annual_planting_area_hectare", {
    precision: 10,
    scale: 2,
  }),
  plantingSurvivalRatePercent: decimal("planting_survival_rate_percent", {
    precision: 5,
    scale: 2,
  }),
  treePlantingSinceEstablishment: integer("tree_planting_since_establishment"),

  // Social aspects
  communityDevelopmentActivities: text("community_development_activities"),
  skillDevelopmentActivities: text("skill_development_activities"),
  povertyAlleviationMeasures: text("poverty_alleviation_measures"),
  womenEmpowermentActivities: text("women_empowerment_activities"),
  conflictsWithinGroup: text("conflicts_within_group"),
  conflictsWithOtherCommunities: text("conflicts_with_other_communities"),

  // Livelihood impacts
  improvedLivelihoodCount: integer("improved_livelihood_count"), // Number of households with improved livelihood
  enterpriseDevelopment: text("enterprise_development"),
  livelihoodDiversification: text("livelihood_diversification"),
  employmentGenerated: integer("employment_generated"), // Person-days per year
  incomeLevelChangePercent: decimal("income_level_change_percent", {
    precision: 5,
    scale: 2,
  }),
  foodSecurityImpact: text("food_security_impact"),

  // Challenges and needs
  majorChallenges: text("major_challenges"),
  technicalNeeds: text("technical_needs"),
  financialNeeds: text("financial_needs"),
  policyConstraints: text("policy_constraints"),
  naturalDisasterVulnerability: text("natural_disaster_vulnerability"),
  climateChangeImpacts: text("climate_change_impacts"),

  // Future plans
  expansionPlans: text("expansion_plans"),
  sustainabilityMeasures: text("sustainability_measures"),
  valueAdditionPlans: text("value_addition_plans"),
  marketLinkagePlans: text("market_linkage_plans"),
  technologyAdoptionPlans: text("technology_adoption_plans"),

  // Contact information
  chairpersonName: text("chairperson_name"),
  chairpersonContact: text("chairperson_contact"),
  secretaryName: text("secretary_name"),
  secretaryContact: text("secretary_contact"),
  treasurerName: text("treasurer_name"),
  treasurerContact: text("treasurer_contact"),
  forestryOfficerName: text("forestry_officer_name"),
  forestryOfficerContact: text("forestry_officer_contact"),

  // External linkages
  governmentSupport: text("government_support"),
  ngoSupportDetails: text("ngo_support_details"),
  researchCollaboration: text("research_collaboration"),
  trainingReceived: text("training_received"),
  certificationsAchieved: text("certifications_achieved"),
  awardsRecognition: text("awards_recognition"),

  // Linkages to other entities
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedForestryOffices: jsonb("linked_forestry_offices").default(
    sql`'[]'::jsonb`,
  ),
  linkedNgos: jsonb("linked_ngos").default(sql`'[]'::jsonb`),
  linkedRuralMunicipalities: jsonb("linked_rural_municipalities").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  forestBoundary: geometry("forest_boundary", { type: "Polygon" }),
  watersPoints: geometry("waters_points", { type: "MultiPoint" }), // Water sources
  infrastructurePoints: geometry("infrastructure_points", {
    type: "MultiPoint",
  }), // Various infrastructure points

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

export type LeaseholdForest = typeof leaseholdForest.$inferSelect;
export type NewLeaseholdForest = typeof leaseholdForest.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
