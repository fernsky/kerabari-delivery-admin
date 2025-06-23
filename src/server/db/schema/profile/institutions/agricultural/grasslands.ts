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

// Define grassland type enum
export const grasslandTypeEnum = pgEnum("grassland_type", [
  "NATURAL_MEADOW",
  "IMPROVED_PASTURE",
  "RANGELAND",
  "SILVOPASTURE",
  "WETLAND_GRAZING",
  "ALPINE_GRASSLAND",
  "COMMON_GRAZING_LAND",
  "OTHER",
]);

// Define vegetation density enum
export const vegetationDensityEnum = pgEnum("vegetation_density", [
  "VERY_DENSE",
  "DENSE",
  "MODERATE",
  "SPARSE",
  "VERY_SPARSE",
]);

// Define grassland management type enum
export const grasslandManagementEnum = pgEnum("grassland_management", [
  "ROTATIONAL_GRAZING",
  "CONTINUOUS_GRAZING",
  "DEFERRED_GRAZING",
  "HAY_PRODUCTION",
  "CONSERVATION",
  "UNMANAGED",
  "MIXED",
]);

// Grassland table
export const grassland = pgTable("grassland", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  type: grasslandTypeEnum("type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Physical details
  areaInHectares: decimal("area_in_hectares", { precision: 10, scale: 2 }),
  elevationInMeters: integer("elevation_in_meters"),
  vegetationDensity: vegetationDensityEnum("vegetation_density"),
  managementType: grasslandManagementEnum("grassland_management"),

  // Grassland specific details
  dominantSpecies: text("dominant_species"), // Comma-separated list of dominant grass/plant species
  carryingCapacity: integer("carrying_capacity"), // Livestock units supported per hectare
  grazingPeriod: text("grazing_period"), // E.g., "Apr-Oct", "Year-round"
  annualFodderYield: decimal("annual_fodder_yield", {
    precision: 10,
    scale: 2,
  }), // In metric tons
  yieldYear: varchar("yield_year", { length: 4 }), // Year of yield data

  // Management details
  isGovernmentOwned: boolean("is_government_owned").default(false),
  ownerName: text("owner_name"), // Individual or organization that owns this grassland
  ownerContact: text("owner_contact"),
  caretakerName: text("caretaker_name"), // Person responsible for maintenance
  caretakerContact: text("caretaker_contact"),

  // Additional information
  hasWaterSource: boolean("has_water_source").default(false),
  waterSourceType: text("water_source_type"), // E.g., "Stream", "Pond", "Well"
  isFenced: boolean("is_fenced").default(false),
  hasGrazingRights: boolean("has_grazing_rights").default(false),

  // Conservation status
  hasProtectedStatus: boolean("has_protected_status").default(false),
  protectionType: text("protection_type"), // E.g., "Wildlife reserve", "Community protected"
  biodiversityValue: text("biodiversity_value"), // Description of ecological importance

  // SEO fields
  metaTitle: text("meta_title"), // SEO meta title
  metaDescription: text("meta_description"), // SEO meta description
  keywords: text("keywords"), // SEO keywords

  // Geometry fields stored as PostGIS geometries
  // Point for representative location
  locationPoint: geometry("location_point", { type: "Point" }),
  // Polygon for zone boundary
  areaPolygon: geometry("area_polygon", { type: "Polygon" }),

  // Status and metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type Grassland = typeof grassland.$inferSelect;
export type NewGrassland = typeof grassland.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
