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
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define historical site type enum
export const historicalSiteTypeEnum = pgEnum("historical_site_type", [
  "PALACE",
  "FORT",
  "ANCIENT_SETTLEMENT",
  "ARCHAEOLOGICAL_SITE",
  "ANCIENT_MONUMENT",
  "HERITAGE_BUILDING",
  "HISTORIC_HOUSE",
  "MEDIEVAL_TOWN",
  "ROYAL_RESIDENCE",
  "HISTORIC_GARDEN",
  "HISTORIC_INFRASTRUCTURE",
  "BATTLEFIELD",
  "ANCIENT_RUINS",
  "HISTORIC_LANDMARK",
  "OTHER",
]);

// Define architectural style enum
export const historicalArchitecturalStyleEnum = pgEnum(
  "historical_architectural_style",
  [
    "TRADITIONAL_NEPALI",
    "PAGODA",
    "NEWAR",
    "MALLA",
    "SHAH",
    "RAI",
    "LIMBU",
    "MEDIEVAL",
    "COLONIAL",
    "GOTHIC",
    "MUGHAL",
    "RANA_PALACE",
    "SHIKHARA",
    "STUPA",
    "MIXED",
    "VERNACULAR",
    "OTHER",
  ],
);

// Define construction material enum
export const historicalConstructionMaterialEnum = pgEnum(
  "historical_construction_material",
  [
    "STONE",
    "BRICK",
    "WOOD",
    "MUD",
    "CLAY",
    "MARBLE",
    "METAL",
    "TERRACOTTA",
    "MIXED",
    "OTHER",
  ],
);

// Define historical significance level enum
export const historicalSignificanceEnum = pgEnum("historical_significance", [
  "LOCAL",
  "REGIONAL",
  "NATIONAL",
  "INTERNATIONAL",
]);

// Define preservation status enum
export const historicalPreservationStatusEnum = pgEnum(
  "historical_preservation_status",
  [
    "EXCELLENT",
    "GOOD",
    "FAIR",
    "POOR",
    "DAMAGED",
    "UNDER_RENOVATION",
    "PARTIAL_RUINS",
    "RUINS",
    "ARCHAEOLOGICAL_REMAINS",
  ],
);

// Define historical period enum
export const historicalPeriodEnum = pgEnum("historical_period", [
  "ANCIENT",
  "MEDIEVAL",
  "LICCHAVI",
  "MALLA",
  "SHAH",
  "RANA",
  "PRE_UNIFICATION",
  "COLONIAL",
  "MODERN",
  "CONTEMPORARY",
  "MULTIPLE_PERIODS",
  "OTHER",
]);

// Historical Site table
export const historicalSite = pgTable("historical_site", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  type: historicalSiteTypeEnum("type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Physical details
  areaInSquareMeters: decimal("area_in_square_meters", {
    precision: 10,
    scale: 2,
  }),
  architecturalStyle: historicalArchitecturalStyleEnum("architectural_style"),
  constructionMaterial: historicalConstructionMaterialEnum(
    "construction_material",
  ),
  historicalPeriod: historicalPeriodEnum("historical_period"),
  yearEstablished: integer("year_established"), // Estimated or known year of construction
  yearAbandoned: integer("year_abandoned"), // If applicable
  lastRestorationYear: integer("last_restoration_year"), // Year of latest major restoration

  // Historical context
  historicalSignificance: historicalSignificanceEnum("historical_significance"),
  originalFunction: text("original_function"), // Original purpose of the site
  notablePeople: text("notable_people"), // Historical figures associated with the site
  historicalEvents: text("historical_events"), // Major events that occurred here
  dynastyOrRulership: text("dynasty_or_rulership"), // Dynasty/ruler who built or ruled from this site
  changeOfOwnership: text("change_of_ownership"), // History of ownership changes

  // Cultural and archaeological significance
  culturalSignificance: text("cultural_significance"),
  archaeologicalRemains: text("archaeological_remains"),
  artifactsFound: text("artifacts_found"), // Summary of important discoveries
  excavationHistory: text("excavation_history"),
  excavationYear: integer("excavation_year"), // Year of major excavation, if applicable

  // Heritage status
  isHeritageSite: boolean("is_heritage_site").default(false),
  heritageDesignation: text("heritage_designation"), // E.g., "UNESCO World Heritage", "National Monument"
  heritageListingYear: integer("heritage_listing_year"),
  heritageReferenceId: text("heritage_reference_id"), // Reference ID in heritage listings

  // Inscriptions and documentation
  hasInscriptions: boolean("has_inscriptions").default(false),
  inscriptionDetails: text("inscription_details"),
  hasHistoricalDocuments: boolean("has_historical_documents").default(false),
  documentationDetails: text("documentation_details"),

  // Management and operations
  managedBy: text("managed_by"), // Organization or committee name
  contactPerson: text("contact_person"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  websiteUrl: text("website_url"),
  dailyOpeningTime: text("daily_opening_time"),
  dailyClosingTime: text("daily_closing_time"),
  isOpenAllDay: boolean("is_open_all_day").default(false),
  weeklyClosedDays: text("weekly_closed_days"), // E.g., "Monday, Tuesday"
  entryFeeNPR: integer("entry_fee_npr"),
  entryFeeDetailsForeigners: text("entry_fee_details_foreigners"),

  // Physical infrastructure
  totalStructureCount: integer("total_structure_count"),
  hasMainBuilding: boolean("has_main_building").default(false),
  hasDefensiveWalls: boolean("has_defensive_walls").default(false),
  hasTowers: boolean("has_towers").default(false),
  hasMoat: boolean("has_moat").default(false),
  hasGardens: boolean("has_gardens").default(false),
  hasCourtyards: boolean("has_courtyards").default(false),
  structureDetails: text("structure_details"),

  // Features and architectural elements
  notableFeatures: text("notable_features"),
  architecturalElements: text("architectural_elements"),
  hasUndergroundStructures: boolean("has_underground_structures").default(
    false,
  ),
  undergroundDetails: text("underground_details"),
  hasDurbar: boolean("has_durbar").default(false), // For palaces
  hasTemple: boolean("has_temple").default(false),
  hasArtificialWaterBody: boolean("has_artificial_water_body").default(false),
  waterBodyDetails: text("water_body_details"),

  // Facilities and amenities
  hasParking: boolean("has_parking").default(false),
  parkingCapacity: integer("parking_capacity"),
  hasToilets: boolean("has_toilets").default(false),
  hasHandicapAccess: boolean("has_handicap_access").default(false),
  hasElectricity: boolean("has_electricity").default(true),
  hasWaterSupply: boolean("has_water_supply").default(true),
  hasCafeteria: boolean("has_cafeteria").default(false),
  hasGiftShop: boolean("has_gift_shop").default(false),

  // Preservation and restoration
  preservationStatus: historicalPreservationStatusEnum("preservation_status"),
  restorationDetails: text("restoration_details"),
  hasRegularMaintenance: boolean("has_regular_maintenance").default(false),
  maintenanceDetails: text("maintenance_details"),
  fundingSource: text("funding_source"), // Where restoration/maintenance funds come from
  conservationChallenges: text("conservation_challenges"),

  // Research and education
  researchValue: text("research_value"),
  ongoingResearch: text("ongoing_research"),
  educationalPrograms: text("educational_programs"),
  publicationReferences: text("publication_references"), // Key publications about this site

  // Visitor information
  estimatedDailyVisitors: integer("estimated_daily_visitors"),
  estimatedYearlyVisitors: integer("estimated_yearly_visitors"),
  peakVisitationMonths: text("peak_visitation_months"),
  hasOverseasVisitors: boolean("has_overseas_visitors").default(false),
  guidesAvailable: boolean("guides_available").default(false),
  hasTourismInfrastructure: boolean("has_tourism_infrastructure").default(
    false,
  ),
  tourismDetails: text("tourism_details"),
  visitorFacilities: text("visitor_facilities"),
  photoAllowed: boolean("photo_allowed").default(true),
  photoRestrictions: text("photo_restrictions"),
  visitDuration: text("visit_duration"), // Typical time needed to visit

  // Community engagement
  localCommunityInvolvement: text("local_community_involvement"),
  communityBenefits: text("community_benefits"),
  educationalActivities: text("educational_activities"),

  // Economic aspects
  annualMaintenanceCost: decimal("annual_maintenance_cost", {
    precision: 14,
    scale: 2,
  }),
  annualRevenue: decimal("annual_revenue", {
    precision: 14,
    scale: 2,
  }),
  economicImpact: text("economic_impact"), // How it contributes to local economy
  employmentGenerated: integer("employment_generated"),

  // Cultural and ceremonial use
  traditionalUses: text("traditional_uses"),
  ceremonialImportance: text("ceremonial_importance"),
  culturalEvents: text("cultural_events"), // Events regularly held at the site
  localMyths: text("local_myths"), // Associated folklore or legends

  // Safety and security
  hasSecurityPersonnel: boolean("has_security_personnel").default(false),
  hasCCTV: boolean("has_cctv").default(false),
  hasFireSafety: boolean("has_fire_safety").default(false),
  safetyMeasures: text("safety_measures"),
  disasterPreparedness: text("disaster_preparedness"), // Measures for earthquakes, floods, etc.

  // Artifacts and collections
  hasArchaeologicalArtifacts: boolean("has_archaeological_artifacts").default(
    false,
  ),
  artifactStorageLocation: text("artifact_storage_location"),
  hasOnSiteMuseum: boolean("has_on_site_museum").default(false),
  museumDetails: text("museum_details"),
  notableCollections: text("notable_collections"),

  // Damages and threats
  damageHistory: text("damage_history"), // Historical damage from wars, natural disasters, etc.
  currentThreats: text("current_threats"), // Environmental, human, or developmental threats
  encroachmentIssues: text("encroachment_issues"),
  naturalDisasterRisk: text("natural_disaster_risk"),

  // Development and future plans
  developmentProjects: text("development_projects"),
  futureConservationPlans: text("future_conservation_plans"),
  proposedImprovements: text("proposed_improvements"),

  // Linkages to other entities
  linkedCulturalEvents: jsonb("linked_cultural_events").default(
    sql`'[]'::jsonb`,
  ),
  linkedCulturalOrganizations: jsonb("linked_cultural_organizations").default(
    sql`'[]'::jsonb`,
  ),
  linkedReligiousPlaces: jsonb("linked_religious_places").default(
    sql`'[]'::jsonb`,
  ),
  linkedHistoricalSites: jsonb("linked_historical_sites").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"), // SEO meta title
  metaDescription: text("meta_description"), // SEO meta description
  keywords: text("keywords"), // SEO keywords

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  siteBoundary: geometry("site_boundary", { type: "Polygon" }),
  structureFootprints: geometry("structure_footprints", {
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

export type HistoricalSite = typeof historicalSite.$inferSelect;
export type NewHistoricalSite = typeof historicalSite.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
