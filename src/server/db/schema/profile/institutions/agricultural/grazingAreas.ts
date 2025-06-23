import { pgTable } from "../../../../schema/basic";
import {
  integer,
  timestamp,
  varchar,
  text,
  boolean,
  pgEnum,
  decimal,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define grazing area type enum
export const grazingAreaTypeEnum = pgEnum("grazing_area_type", [
  "OPEN_RANGE",
  "ALPINE_MEADOW",
  "COMMUNITY_PASTURE",
  "FOREST_UNDERSTORY",
  "FLOODPLAIN",
  "SEASONAL_PASTURE",
  "DRY_SEASON_RESERVE",
  "ROTATIONAL_PADDOCK",
  "MIXED",
  "OTHER",
]);

// Define terrain type enum
export const terrainTypeEnum = pgEnum("terrain_type", [
  "FLAT",
  "ROLLING",
  "HILLY",
  "MOUNTAINOUS",
  "VALLEY",
  "RIVERINE",
  "MIXED",
]);

// Define accessibility enum
export const accessibilityEnum = pgEnum("accessibility_level", [
  "EASILY_ACCESSIBLE",
  "MODERATELY_ACCESSIBLE",
  "DIFFICULT_ACCESS",
  "SEASONAL_ACCESS",
  "REMOTE",
]);

// Define ground cover enum
export const groundCoverEnum = pgEnum("ground_cover", [
  "PRIMARILY_GRASSES",
  "SHRUB_DOMINANT",
  "MIXED_VEGETATION",
  "FORBS_DOMINANT",
  "TREE_SCATTERED",
  "DEGRADED",
]);

// Define utilization level enum
export const utilizationLevelEnum = pgEnum("utilization_level", [
  "UNDERUTILIZED",
  "OPTIMAL_USE",
  "OVERUTILIZED",
  "SEVERELY_DEGRADED",
  "PROTECTED",
]);

// Grazing Area table
export const grazingArea = pgTable("grazing_area", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  type: grazingAreaTypeEnum("type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Physical details
  areaInHectares: decimal("area_in_hectares", { precision: 10, scale: 2 }),
  elevationInMeters: integer("elevation_in_meters"),
  terrain: terrainTypeEnum("terrain_type"),
  groundCover: groundCoverEnum("ground_cover"),
  accessibility: accessibilityEnum("accessibility_level"),

  // Grazing specific details
  livestockCapacity: integer("livestock_capacity"), // Number of livestock it can support
  primaryLivestockType: text("primary_livestock_type"), // E.g. "Cattle, Sheep, Goats"
  grazingSeasons: text("grazing_seasons"), // E.g. "Summer only", "Year-round", "Winter"
  grazingDuration: text("grazing_duration"), // E.g. "3 months", "6 months"
  rotationalSystem: boolean("rotational_system").default(false),
  restPeriod: text("rest_period"), // Period when grazing is prohibited for recovery
  utilizationLevel: utilizationLevelEnum("utilization_level"),

  // Water resources
  hasWaterSource: boolean("has_water_source").default(false),
  waterSourceTypes: text("water_source_types"), // E.g., "Stream, Pond, Well"
  waterAvailability: text("water_availability"), // E.g., "Year-round", "Seasonal"
  waterSourceDistance: integer("water_source_distance"), // Distance in meters

  // Management details
  isGovernmentOwned: boolean("is_government_owned").default(false),
  ownerName: text("owner_name"), // Individual or organization that owns this area
  ownerContact: text("owner_contact"),
  caretakerName: text("caretaker_name"), // Person responsible for maintenance
  caretakerContact: text("caretaker_contact"),
  permitRequired: boolean("permit_required").default(false),
  permitInfo: text("permit_info"),

  // Infrastructure
  hasFencing: boolean("has_fencing").default(false),
  hasWindbreaks: boolean("has_windbreaks").default(false),
  hasShelters: boolean("has_shelters").default(false),
  infrastructureNotes: text("infrastructure_notes"),

  // Health and sustainability
  invasiveSpecies: text("invasive_species"),
  erosionIssues: boolean("erosion_issues").default(false),
  conservationStatus: text("conservation_status"),
  restorationEfforts: text("restoration_efforts"),

  // Cultural significance
  traditionalUse: text("traditional_use"),
  culturalSignificance: text("cultural_significance"),

  // SEO fields
  metaTitle: text("meta_title"), // SEO meta title
  metaDescription: text("meta_description"), // SEO meta description
  keywords: text("keywords"), // SEO keywords

  // Geometry fields stored as PostGIS geometries
  // Point for representative location
  locationPoint: geometry("location_point", { type: "Point" }),
  // Polygon for grazing area boundary
  areaPolygon: geometry("area_polygon", { type: "Polygon" }),

  // Status and metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type GrazingArea = typeof grazingArea.$inferSelect;
export type NewGrazingArea = typeof grazingArea.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
