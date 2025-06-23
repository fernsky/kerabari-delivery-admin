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

// Define petrol pump type enum
export const petrolPumpTypeEnum = pgEnum("petrol_pump_type", [
  "PETROL",
  "DIESEL",
  "PETROL_DIESEL",
  "CNG",
  "EV_CHARGING",
  "MULTIPURPOSE",
]);

// PetrolPump table
export const petrolPump = pgTable("petrol_pump", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // SEO-friendly URL slug
  description: text("description"),
  type: petrolPumpTypeEnum("type").notNull(),

  // Location details
  wardNumber: integer("ward_number").notNull(),
  locality: text("locality"), // Village/Tole/Area name
  address: text("address"),

  // Owner details
  ownerName: text("owner_name"),
  ownerContact: text("owner_contact"),
  ownerEmail: text("owner_email"),
  ownerWebsite: text("owner_website"),

  // Facilities
  hasEVCharging: boolean("has_ev_charging").default(false),
  hasCarWash: boolean("has_car_wash").default(false),
  hasConvenienceStore: boolean("has_convenience_store").default(false),
  hasRestroom: boolean("has_restroom").default(false),
  hasAirFilling: boolean("has_air_filling").default(false),
  operatingHours: text("operating_hours"),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),

  // Status and metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type PetrolPump = typeof petrolPump.$inferSelect;
export type NewPetrolPump = typeof petrolPump.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
