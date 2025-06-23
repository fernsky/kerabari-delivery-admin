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
import { drainageSystemEnum } from "./common";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define road type enum
export const roadTypeEnum = pgEnum("road_type", [
  "HIGHWAY",
  "URBAN",
  "RURAL",
  "GRAVEL",
  "EARTHEN",
  "AGRICULTURAL",
  "ALLEY",
  "BRIDGE",
]);

// Define road condition enum
export const roadConditionEnum = pgEnum("road_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "VERY_POOR",
  "UNDER_CONSTRUCTION",
]);

// Road table
export const road = pgTable("road", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  type: roadTypeEnum("type").notNull(),
  widthInMeters: integer("width_in_meters"),
  condition: roadConditionEnum("condition"),
  drainageSystem: drainageSystemEnum("drainage_system"),

  // Additional details
  maintenanceYear: varchar("maintenance_year", { length: 4 }), // Year of last maintenance
  length: integer("length_in_meters"), // Length in meters
  startPoint: text("start_point"), // Description of start point
  endPoint: text("end_point"), // Description of end point
  hasStreetLights: boolean("has_street_lights"),
  hasDivider: boolean("has_divider"),
  hasPedestrian: boolean("has_pedestrian_path"),
  hasBicycleLane: boolean("has_bicycle_lane"),

  // SEO fields
  metaTitle: text("meta_title"), // SEO meta title
  metaDescription: text("meta_description"), // SEO meta description
  keywords: text("keywords"), // SEO keywords

  // Geometry fields stored as PostGIS geometries
  // LineString for road path
  roadPath: geometry("road_path", { type: "LineString" }),
  // Point for representative point (can be start, middle or any significant point)
  representativePoint: geometry("representative_point", { type: "Point" }),

  // Status and metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type Road = typeof road.$inferSelect;
export type NewRoad = typeof road.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
