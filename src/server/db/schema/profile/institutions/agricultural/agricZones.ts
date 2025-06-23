import { pgTable } from "../../../../schema/basic";
import {
  integer,
  timestamp,
  varchar,
  text,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define agricultural zone type enum
export const agricZoneTypeEnum = pgEnum("agric_zone_type", [
  "PULSES",
  "OILSEEDS",
  "COMMERCIAL_FLOWER",
  "SEASONAL_CROPS",
  "SUPER_ZONE",
  "POCKET_AREA",
  "MIXED",
  "OTHER",
]);

// Define soil quality enum
export const soilQualityEnum = pgEnum("soil_quality", [
  "EXCELLENT",
  "GOOD",
  "AVERAGE",
  "POOR",
  "VERY_POOR",
]);

// Define irrigation system enum
export const irrigationSystemEnum = pgEnum("irrigation_system", [
  "CANAL",
  "SPRINKLER",
  "DRIP",
  "GROUNDWATER",
  "RAINWATER_HARVESTING",
  "SEASONAL_RIVER",
  "NONE",
  "MIXED",
]);

// Agricultural Zone table
export const agricZone = pgTable("agric_zone", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  type: agricZoneTypeEnum("type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Physical details
  areaInHectares: integer("area_in_hectares"),
  soilQuality: soilQualityEnum("soil_quality"),
  irrigationSystem: irrigationSystemEnum("irrigation_system"),

  // Agricultural details
  majorCrops: text("major_crops"), // Comma-separated list of major crops
  seasonalAvailability: text("seasonal_availability"), // E.g., "Winter, Summer"
  annualProduction: integer("annual_production"), // In metric tons
  productionYear: varchar("production_year", { length: 4 }), // Year of production data

  // Management details
  isGovernmentOwned: boolean("is_government_owned").default(false),
  ownerName: text("owner_name"), // Individual or organization that owns this zone
  ownerContact: text("owner_contact"),
  caretakerName: text("caretaker_name"), // Person responsible for maintenance
  caretakerContact: text("caretaker_contact"),

  // Additional facilities
  hasStorage: boolean("has_storage").default(false),
  hasProcessingUnit: boolean("has_processing_unit").default(false),
  hasFarmersCooperative: boolean("has_farmers_cooperative").default(false),

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

export type AgricZone = typeof agricZone.$inferSelect;
export type NewAgricZone = typeof agricZone.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
