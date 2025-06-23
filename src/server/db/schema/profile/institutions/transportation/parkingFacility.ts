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

// Define parking facility type enum
export const parkingFacilityTypeEnum = pgEnum("parking_facility_type", [
  "BUS_PARK",
  "TAXI_PARK",
  "TEMPO_PARK",
  "AUTO_RICKSHAW_PARK",
  "CAR_PARK",
  "BIKE_PARK",
  "MULTIPURPOSE_PARK",
  "OTHER",
]);

// Define parking condition enum
export const parkingConditionEnum = pgEnum("parking_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "VERY_POOR",
  "UNDER_CONSTRUCTION",
]);

// ParkingFacility table
export const parkingFacility = pgTable("parking_facility", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  type: parkingFacilityTypeEnum("type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Physical details
  areaInSquareMeters: integer("area_in_square_meters"),
  vehicleCapacity: integer("vehicle_capacity"),
  condition: parkingConditionEnum("condition"),
  drainageSystem: drainageSystemEnum("drainage_system"),

  // Additional facilities and features
  hasRoof: boolean("has_roof").default(false),
  hasToilet: boolean("has_toilet").default(false),
  hasWaitingArea: boolean("has_waiting_area").default(false),
  hasTicketCounter: boolean("has_ticket_counter").default(false),
  hasFoodStalls: boolean("has_food_stalls").default(false),
  hasSecurityPersonnel: boolean("has_security_personnel").default(false),
  hasCCTV: boolean("has_cctv").default(false),
  operatingHours: text("operating_hours"),

  // Management details
  operator: text("operator"), // Who operates the facility (municipality, private company, etc.)
  contactInfo: text("contact_info"),
  establishedYear: varchar("established_year", { length: 4 }),

  // SEO fields
  metaTitle: text("meta_title"), // SEO meta title
  metaDescription: text("meta_description"), // SEO meta description
  keywords: text("keywords"), // SEO keywords

  // Geometry fields stored as PostGIS geometries
  // Point for location
  locationPoint: geometry("location_point", { type: "Point" }),
  // Polygon for parking area boundary
  areaPolygon: geometry("area_polygon", { type: "Polygon" }),

  // Status and metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type ParkingFacility = typeof parkingFacility.$inferSelect;
export type NewParkingFacility = typeof parkingFacility.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
