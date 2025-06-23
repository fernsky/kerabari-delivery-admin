import { pgTable } from "../../../../schema/basic";
import {
  integer,
  timestamp,
  varchar,
  text,
  boolean,
  pgEnum,
  time,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define public transport type enum
export const publicTransportTypeEnum = pgEnum("public_transport_type", [
  "BUS",
  "MINIBUS",
  "MICROBUS",
  "TEMPO",
  "AUTO_RICKSHAW",
  "TAXI",
  "E_RICKSHAW",
  "OTHER",
]);

// Define vehicle condition enum (reused from other transportation types)
export const vehicleConditionEnum = pgEnum("vehicle_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "VERY_POOR",
  "UNDER_MAINTENANCE",
]);

// Define frequency enum for scheduling
export const frequencyEnum = pgEnum("frequency", [
  "DAILY",
  "WEEKDAYS_ONLY",
  "WEEKENDS_ONLY",
  "OCCASIONAL",
  "SEASONAL",
]);

// PublicTransport table
export const publicTransport = pgTable("public_transport", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(), // E.g. "Nepal Yatayat", "Bagmati Yatayat"
  slug: text("slug").notNull(), // SEO-friendly URL slug
  description: text("description"),
  type: publicTransportTypeEnum("type").notNull(),

  // Operator details
  operatorName: text("operator_name"), // Company or organization that runs this transport
  operatorContact: text("operator_contact"),
  operatorEmail: text("operator_email"),
  operatorWebsite: text("operator_website"),

  // Route details
  routeName: text("route_name"), // E.g. "Kathmandu to Pokhara", "Ring Road Circuit"
  startPoint: text("start_point"),
  endPoint: text("end_point"),
  viaPoints: text("via_points"), // Comma separated list of major stops
  estimatedDuration: integer("estimated_duration_minutes"), // Duration in minutes

  // Schedule details
  frequency: frequencyEnum("frequency"),
  startTime: time("start_time"), // First departure time
  endTime: time("end_time"), // Last departure time
  intervalMinutes: integer("interval_minutes"), // How often this transport runs (e.g. every 15 min)

  // Vehicle details
  vehicleCount: integer("vehicle_count"), // Number of vehicles on this route
  seatingCapacity: integer("seating_capacity"), // Average seating capacity per vehicle
  vehicleCondition: vehicleConditionEnum("vehicle_condition"),
  hasAirConditioning: boolean("has_air_conditioning").default(false),
  hasWifi: boolean("has_wifi").default(false),
  isAccessible: boolean("is_accessible").default(false), // Accessible for people with disabilities

  // Fare details
  fareAmount: integer("fare_amount"), // Base fare in local currency
  fareDescription: text("fare_description"), // Additional fare information

  // Related entities
  servingRoadIds: text("serving_road_ids"), // Comma-separated list of road IDs this transport serves
  parkingFacilityIds: text("parking_facility_ids"), // Comma-separated list of parking facilities this transport uses

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  routePath: geometry("route_path", { type: "LineString" }), // GeoJSON LineString for the route
  stopPoints: geometry("stop_points", { type: "MultiPoint" }), // GeoJSON MultiPoint for all stops

  // Status and metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type PublicTransport = typeof publicTransport.$inferSelect;
export type NewPublicTransport = typeof publicTransport.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
