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

// Define religious place type enum
export const religiousPlaceTypeEnum = pgEnum("religious_place_type", [
  "HINDU_TEMPLE",
  "BUDDHIST_TEMPLE",
  "MOSQUE",
  "CHURCH",
  "GURUDWARA",
  "SHRINE",
  "MONASTERY",
  "SYNAGOGUE",
  "JAIN_TEMPLE",
  "MEDITATION_CENTER",
  "PAGODA",
  "SACRED_GROVE",
  "SACRED_POND",
  "SACRED_RIVER",
  "SACRED_HILL",
  "PRAYER_HALL",
  "RELIGIOUS_COMPLEX",
  "OTHER",
]);

// Define architectural style enum
export const architecturalStyleEnum = pgEnum("architectural_style", [
  "TRADITIONAL_NEPALI",
  "PAGODA",
  "STUPA",
  "SHIKHARA",
  "MODERN",
  "COLONIAL",
  "GOTHIC",
  "MUGHAL",
  "DOME",
  "MIXED",
  "VERNACULAR",
  "OTHER",
]);

// Define construction material enum
export const constructionMaterialEnum = pgEnum("construction_material", [
  "STONE",
  "BRICK",
  "WOOD",
  "MUD",
  "CONCRETE",
  "MARBLE",
  "METAL",
  "MIXED",
  "OTHER",
]);

// Define the religious significance level enum
export const religiousSignificanceEnum = pgEnum("religious_significance", [
  "LOCAL",
  "REGIONAL",
  "NATIONAL",
  "INTERNATIONAL",
]);

// Define preservation status enum
export const preservationStatusEnum = pgEnum("preservation_status", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "DAMAGED",
  "UNDER_RENOVATION",
  "REBUILT",
]);

// Religious Place table
export const religiousPlace = pgTable("religious_place", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  type: religiousPlaceTypeEnum("type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Physical details
  areaInSquareMeters: decimal("area_in_square_meters", {
    precision: 10,
    scale: 2,
  }),
  architecturalStyle: architecturalStyleEnum("architectural_style"),
  constructionMaterial: constructionMaterialEnum("construction_material"),
  yearEstablished: integer("year_established"), // Year it was first built
  yearRenovated: integer("year_renovated"), // Year of latest major renovation

  // Religious details
  mainDeity: text("main_deity"), // Primary deity or figure worshipped
  secondaryDeities: text("secondary_deities"),
  religiousTradition: text("religious_tradition"), // E.g., "Shaivism", "Vaishnavism", "Sufism"
  religiousSignificance: religiousSignificanceEnum("religious_significance"),
  religiousStory: text("religious_story"), // Mythology or story associated with the place

  // Cultural and historical significance
  historicalSignificance: text("historical_significance"),
  culturalSignificance: text("cultural_significance"),
  isHeritageSite: boolean("is_heritage_site").default(false),
  heritageDesignation: text("heritage_designation"), // E.g., "UNESCO World Heritage", "National Monument"
  inscriptions: text("inscriptions"), // Details about any inscriptions
  hasArchaeologicalValue: boolean("has_archaeological_value").default(false),
  archaeologicalDetails: text("archaeological_details"),

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
  totalBuildingCount: integer("total_building_count"),
  hasMainHall: boolean("has_main_hall").default(false),
  mainHallCapacity: integer("main_hall_capacity"),
  hasCommunitySpace: boolean("has_community_space").default(false),
  hasAccommodation: boolean("has_accommodation").default(false),
  accommodationCapacity: integer("accommodation_capacity"),
  hasKitchen: boolean("has_kitchen").default(false),
  hasDiningHall: boolean("has_dining_hall").default(false),
  diningCapacity: integer("dining_capacity"),
  hasLibrary: boolean("has_library").default(false),
  hasMuseum: boolean("has_museum").default(false),

  // Facilities and amenities
  hasParking: boolean("has_parking").default(false),
  parkingCapacity: integer("parking_capacity"),
  hasToilets: boolean("has_toilets").default(false),
  hasHandicapAccess: boolean("has_handicap_access").default(false),
  hasElectricity: boolean("has_electricity").default(true),
  hasWaterSupply: boolean("has_water_supply").default(true),
  hasDrinkingWater: boolean("has_drinking_water").default(false),
  hasFootwear: boolean("has_footwear_facility").default(false), // For storage of shoes/footwear
  hasClothStorage: boolean("has_cloth_storage").default(false),

  // Preservation and restoration
  preservationStatus: preservationStatusEnum("preservation_status"),
  lastRestorationYear: integer("last_restoration_year"),
  restorationDetails: text("restoration_details"),
  hasRegularMaintenance: boolean("has_regular_maintenance").default(false),
  maintenanceDetails: text("maintenance_details"),
  fundingSource: text("funding_source"), // Where restoration/maintenance funds come from

  // Religious activities
  regularPrayers: text("regular_prayers"), // Details about regular prayer times
  specialRituals: text("special_rituals"), // Specific rituals performed
  annualFestivals: text("annual_festivals"), // Major annual events
  festivalMonths: text("festival_months"), // E.g., "Baisakh, Dashain, Tihar"
  festivalDetails: text("festival_details"),
  specialOfferings: text("special_offerings"), // E.g., "Prasad, Flowers, Incense"

  // Visitor information
  estimatedDailyVisitors: integer("estimated_daily_visitors"),
  estimatedYearlyVisitors: integer("estimated_yearly_visitors"),
  peakVisitationMonths: text("peak_visitation_months"),
  hasOverseasVisitors: boolean("has_overseas_visitors").default(false),
  guidesAvailable: boolean("guides_available").default(false),
  visitorDressCode: text("visitor_dress_code"),
  photoAllowed: boolean("photo_allowed").default(true),
  photoRestrictions: text("photo_restrictions"),

  // Community engagement
  communityBenefits: text("community_benefits"),
  socialServicesOffered: text("social_services_offered"),
  educationalActivities: text("educational_activities"),

  // Economic aspects
  hasShops: boolean("has_shops").default(false),
  shopCount: integer("shop_count"),
  shopTypes: text("shop_types"), // E.g., "Religious items, Souvenirs, Food"
  economicImpact: text("economic_impact"), // How it contributes to local economy
  totalAnnualRevenue: decimal("total_annual_revenue", {
    precision: 14,
    scale: 2,
  }),
  annualOperatingBudget: decimal("annual_operating_budget", {
    precision: 14,
    scale: 2,
  }),

  // Environmental aspects
  hasGarden: boolean("has_garden").default(false),
  gardenAreaInSquareMeters: decimal("garden_area_in_square_meters", {
    precision: 10,
    scale: 2,
  }),
  hasSignificantTrees: boolean("has_significant_trees").default(false),
  significantTreeDetails: text("significant_tree_details"),
  hasWaterBody: boolean("has_water_body").default(false),
  waterBodyDetails: text("water_body_details"),

  // Safety and security
  hasSecurityPersonnel: boolean("has_security_personnel").default(false),
  hasCCTV: boolean("has_cctv").default(false),
  hasFireSafety: boolean("has_fire_safety").default(false),
  disasterPreparedness: text("disaster_preparedness"), // Measures for earthquakes, floods, etc.

  // Artworks and treasures
  hasSignificantArtwork: boolean("has_significant_artwork").default(false),
  artworkDetails: text("artwork_details"), // Details about murals, paintings, statues
  hasHistoricalArtifacts: boolean("has_historical_artifacts").default(false),
  artifactsDetails: text("artifacts_details"),
  hasRegisteredTreasures: boolean("has_registered_treasures").default(false),
  treasureDetails: text("treasure_details"),

  // Challenges and needs
  currentChallenges: text("current_challenges"),
  conservationNeeds: text("conservation_needs"),
  developmentPlans: text("development_plans"),

  // Linkages to other entities
  linkedCulturalEvents: jsonb("linked_cultural_events").default(
    sql`'[]'::jsonb`,
  ),
  linkedCulturalOrganizations: jsonb("linked_cultural_organizations").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"), // SEO meta title
  metaDescription: text("meta_description"), // SEO meta description
  keywords: text("keywords"), // SEO keywords

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  complexBoundary: geometry("complex_boundary", { type: "Polygon" }),

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

export type ReligiousPlace = typeof religiousPlace.$inferSelect;
export type NewReligiousPlace = typeof religiousPlace.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
