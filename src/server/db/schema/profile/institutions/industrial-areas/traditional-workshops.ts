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

// Define traditional workshop type enum
export const traditionalWorkshopTypeEnum = pgEnum("traditional_workshop_type", [
  "BLACKSMITH",
  "POTTERY",
  "WOODWORKING",
  "WEAVING",
  "METALWORKING",
  "STONE_CARVING",
  "HANDLOOM",
  "BAMBOO_CRAFTS",
  "LEATHERWORK",
  "JEWELRY_MAKING",
  "MASK_MAKING",
  "THANGKA_PAINTING",
  "CARPET_MAKING",
  "PAPER_MAKING",
  "MUSICAL_INSTRUMENT_MAKING",
  "OTHER",
]);

// Define heritage significance enum
export const heritageSignificanceEnum = pgEnum("heritage_significance", [
  "HIGHLY_SIGNIFICANT",
  "SIGNIFICANT",
  "MODERATE",
  "LIMITED",
]);

// Define transmission status enum
export const knowledgeTransmissionEnum = pgEnum("knowledge_transmission", [
  "ACTIVE_TRANSMISSION",
  "LIMITED_TRANSMISSION",
  "ENDANGERED",
  "CRITICAL",
  "DISCONTINUED",
]);

// Traditional Workshop table
export const traditionalWorkshop = pgTable("traditional_workshop", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),

  // Basic information
  workshopType: traditionalWorkshopTypeEnum("workshop_type").notNull(),
  heritageSignificance: heritageSignificanceEnum("heritage_significance"),
  knowledgeTransmissionStatus: knowledgeTransmissionEnum(
    "knowledge_transmission_status",
  ),
  establishedYear: integer("established_year"),
  generationsInBusiness: integer("generations_in_business"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  isInformalSector: boolean("is_informal_sector").default(true),
  registrationAuthority: text("registration_authority"),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  landmarkDescription: text("landmark_description"),

  // Contact information
  masterCraftsmanName: text("master_craftsman_name"),
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  email: text("email"),

  // Products and crafts
  mainCraftsProduced: text("main_crafts_produced"),
  traditionalTechniquesUsed: text("traditional_techniques_used"),
  rawMaterialsUsed: text("raw_materials_used"),
  rawMaterialSources: text("raw_material_sources"),
  traditionalToolsUsed: text("traditional_tools_used"),
  modernToolsAdopted: text("modern_tools_adopted"),
  productsPerMonth: integer("products_per_month"),
  productionCapacity: text("production_capacity"),
  qualityStandards: text("quality_standards"),
  productPriceRangeNPR: text("product_price_range_npr"),
  hasCustomOrders: boolean("has_custom_orders").default(true),

  // Cultural and heritage aspects
  communitySignificance: text("community_significance"),
  culturalPracticesAssociated: text("cultural_practices_associated"),
  ethnicCommunityAssociated: text("ethnic_community_associated"),
  traditionalKnowledgeDetails: text("traditional_knowledge_details"),
  uniqueCraftFeatures: text("unique_craft_features"),
  historicalNotes: text("historical_notes"),
  intangibleHeritageElements: text("intangible_heritage_elements"),

  // Human resources
  totalArtisans: integer("total_artisans"),
  masterCraftsmen: integer("master_craftsmen"),
  apprentices: integer("apprentices"),
  familyMembersInvolved: integer("family_members_involved"),
  hiredArtisans: integer("hired_artisans"),
  maleArtisans: integer("male_artisans"),
  femaleArtisans: integer("female_artisans"),
  youthInvolved: integer("youth_involved"),

  // Physical infrastructure
  workshopAreaSqm: decimal("workshop_area_sqm", { precision: 10, scale: 2 }),
  hasTraditionalStructure: boolean("has_traditional_structure").default(false),
  buildingType: text("building_type"),
  isHomeBasedWorkshop: boolean("is_home_based_workshop").default(true),
  hasDisplay: boolean("has_display_area").default(false),
  displayAreaSqm: decimal("display_area_sqm", { precision: 10, scale: 2 }),
  hasStorage: boolean("has_storage").default(false),
  storageAreaSqm: decimal("storage_area_sqm", { precision: 10, scale: 2 }),

  // Market and distribution
  marketCoverage: text("market_coverage"), // Local, National, International
  majorMarkets: text("major_markets"),
  sellsToTourists: boolean("sells_to_tourists").default(false),
  touristPercentage: decimal("tourist_percentage", { precision: 5, scale: 2 }),
  hasExportMarket: boolean("has_export_market").default(false),
  exportMarkets: text("export_markets"),
  marketingChannels: text("marketing_channels"),
  sellingLocations: text("selling_locations"), // Shops, markets, fairs
  hasOnlineSales: boolean("has_online_sales").default(false),
  onlinePlatformsUsed: text("online_platforms_used"),

  // Financial aspects
  averageMonthlyIncomeNPR: decimal("average_monthly_income_npr", {
    precision: 10,
    scale: 2,
  }),
  profitabilityStatus: text("profitability_status"), // Good, Average, Poor
  seasonalIncomeVariation: text("seasonal_income_variation"),
  hasAccessToCredit: boolean("has_access_to_credit").default(false),
  creditSourceDetails: text("credit_source_details"),
  hasInsurance: boolean("has_insurance").default(false),

  // Transmission of knowledge
  knowledgeTransferMethod: text("knowledge_transfer_method"),
  apprenticeshipSystem: text("apprenticeship_system"),
  hasStructuredTraining: boolean("has_structured_training").default(false),
  trainingDetails: text("training_details"),
  teachesInSchools: boolean("teaches_in_schools").default(false),
  documentationOfTechniques: boolean("documentation_of_techniques").default(
    false,
  ),
  documentationDetails: text("documentation_details"),

  // Challenges and threats
  majorChallenges: text("major_challenges"),
  modernCompetitionImpact: text("modern_competition_impact"),
  rawMaterialChallenges: text("raw_material_challenges"),
  marketingChallenges: text("marketing_challenges"),
  skillTransferChallenges: text("skill_transfer_challenges"),
  financialChallenges: text("financial_challenges"),

  // Support and recognition
  governmentSupportReceived: boolean("government_support_received").default(
    false,
  ),
  governmentSupportDetails: text("government_support_details"),
  ngoSupportReceived: boolean("ngo_support_received").default(false),
  ngoSupportDetails: text("ngo_support_details"),
  associationMembership: text("association_membership"),
  certificationReceived: text("certification_received"),
  awardsReceived: text("awards_received"),
  mediaExposure: text("media_exposure"),

  // Innovations and adaptations
  modernAdaptations: text("modern_adaptations"),
  designInnovations: text("design_innovations"),
  technologyIntegration: text("technology_integration"),
  newMaterialsAdopted: text("new_materials_adopted"),
  productDiversification: text("product_diversification"),

  // Conservation efforts
  conservationInitiatives: text("conservation_initiatives"),
  documentationProjects: text("documentation_projects"),
  revivalEfforts: text("revival_efforts"),
  collaborationWithInstitutions: text("collaboration_with_institutions"),

  // Future outlook
  successorAvailable: boolean("successor_available").default(false),
  successorDetails: text("successor_details"),
  continuityProspects: text("continuity_prospects"),
  expansionPlans: text("expansion_plans"),
  diversificationPlans: text("diversification_plans"),
  futureChallenges: text("future_challenges"),

  // Tourism potential
  touristVisitsPerMonth: integer("tourist_visits_per_month"),
  offersDemonstrations: boolean("offers_demonstrations").default(false),
  offersWorkshops: boolean("offers_workshops").default(false),
  workingWithTourOperators: boolean("working_with_tour_operators").default(
    false,
  ),
  tourismPotentialAssessment: text("tourism_potential_assessment"),

  // Intellectual property
  hasTrademarkRegistered: boolean("has_trademark_registered").default(false),
  hasGeographicalIndication: boolean("has_geographical_indication").default(
    false,
  ),
  intellectualPropertyChallenges: text("intellectual_property_challenges"),
  counterfeiting: boolean("faces_counterfeiting").default(false),

  // Linkages to other entities
  linkedCulturalGroups: jsonb("linked_cultural_groups").default(
    sql`'[]'::jsonb`,
  ),
  linkedTourismSites: jsonb("linked_tourism_sites").default(sql`'[]'::jsonb`),
  linkedMarkets: jsonb("linked_markets").default(sql`'[]'::jsonb`),
  linkedWorkshops: jsonb("linked_workshops").default(sql`'[]'::jsonb`),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

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

export type TraditionalWorkshop = typeof traditionalWorkshop.$inferSelect;
export type NewTraditionalWorkshop = typeof traditionalWorkshop.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
