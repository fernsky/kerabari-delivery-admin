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
import { ownershipTypeEnum } from "./common";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define center type enum
export const centerTypeEnum = pgEnum("center_type", [
  "COLLECTION_CENTER",
  "STORAGE_FACILITY",
  "PROCESSING_UNIT",
  "MULTIPURPOSE_CENTER",
  "MARKET_CENTER",
  "COLD_STORAGE",
  "WAREHOUSE",
  "OTHER",
]);

// Define storage type enum
export const storageTypeEnum = pgEnum("storage_type", [
  "AMBIENT",
  "COLD_STORAGE",
  "CONTROLLED_ATMOSPHERE",
  "SILO",
  "WAREHOUSE",
  "GRANARY",
  "MIXED",
  "OTHER",
]);

// Define processing level enum
export const processingLevelEnum = pgEnum("processing_level", [
  "PRIMARY_PROCESSING",
  "SECONDARY_PROCESSING",
  "TERTIARY_PROCESSING",
  "MINIMAL_PROCESSING",
  "COMPREHENSIVE_PROCESSING",
  "NOT_APPLICABLE",
]);

// Agricultural Processing Center table
export const agriProcessingCenter = pgTable("agri_processing_center", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  centerType: centerTypeEnum("center_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),

  // Physical properties
  areaInSquareMeters: decimal("area_in_square_meters", {
    precision: 10,
    scale: 2,
  }),
  buildingYearConstructed: integer("building_year_constructed"),
  isOperational: boolean("is_operational").default(true),
  operationalStatus: text("operational_status"), // E.g., "Fully operational", "Under maintenance"
  operationStartYear: integer("operation_start_year"),

  // Storage details
  hasStorageFacility: boolean("has_storage_facility").default(false),
  storageType: storageTypeEnum("storage_type"),
  storageTotalCapacityMT: decimal("storage_total_capacity_mt", {
    precision: 10,
    scale: 2,
  }), // In metric tons
  storageCurrentUsageMT: decimal("storage_current_usage_mt", {
    precision: 10,
    scale: 2,
  }),
  temperatureControlled: boolean("temperature_controlled").default(false),
  temperatureRangeMin: decimal("temperature_range_min", {
    precision: 5,
    scale: 2,
  }),
  temperatureRangeMax: decimal("temperature_range_max", {
    precision: 5,
    scale: 2,
  }),
  humidityControlled: boolean("humidity_controlled").default(false),

  // Processing capabilities
  hasProcessingUnit: boolean("has_processing_unit").default(false),
  processingLevel: processingLevelEnum("processing_level"),
  processingCapacityMTPerDay: decimal("processing_capacity_mt_per_day", {
    precision: 10,
    scale: 2,
  }),
  mainProcessingActivities: text("main_processing_activities"), // E.g., "Drying, Sorting, Packaging"
  valueAdditionActivities: text("value_addition_activities"), // E.g., "Cleaning, Grading, Packaging"

  // Products and commodities
  primaryCommodities: text("primary_commodities"), // Main products handled
  secondaryCommodities: text("secondary_commodities"), // Secondary products handled
  seasonalAvailability: text("seasonal_availability"), // When the center is most active

  // Quality control
  hasQualityControlLab: boolean("has_quality_control_lab").default(false),
  qualityStandards: text("quality_standards"), // E.g., "HACCP, ISO 22000"
  certifications: text("certifications"), // E.g., "Organic, Fair Trade"

  // Management and ownership
  ownershipType: ownershipTypeEnum("ownership_type"),
  ownerName: text("owner_name"),
  ownerContact: text("owner_contact"),
  managerName: text("manager_name"),
  managerContact: text("manager_contact"),

  // Staffing
  totalStaffCount: integer("total_staff_count"),
  technicalStaffCount: integer("technical_staff_count"),

  // Connectivity and services
  hasElectricity: boolean("has_electricity").default(true),
  hasWaterSupply: boolean("has_water_supply").default(true),
  hasWasteManagementSystem: boolean("has_waste_management_system").default(
    false,
  ),
  hasInternet: boolean("has_internet").default(false),

  // Capacity and utilization
  annualThroughputMT: decimal("annual_throughput_mt", {
    precision: 12,
    scale: 2,
  }), // Annual volume processed
  capacityUtilizationPercent: integer("capacity_utilization_percent"), // 0-100
  recordedYear: varchar("recorded_year", { length: 4 }), // Year of the recorded data

  // Economic impact
  employmentGenerated: integer("employment_generated"),
  serviceAreaRadiusKM: decimal("service_area_radius_km", {
    precision: 6,
    scale: 2,
  }),
  farmersServedCount: integer("farmers_served_count"),
  womenFarmersPercent: integer("women_farmers_percent"),

  // Linkages to other entities
  linkedGrazingAreas: jsonb("linked_grazing_areas").default(sql`'[]'::jsonb`), // Array of grazing area IDs
  linkedAgricZones: jsonb("linked_agric_zones").default(sql`'[]'::jsonb`), // Array of agricultural zone IDs
  linkedGrasslands: jsonb("linked_grasslands").default(sql`'[]'::jsonb`), // Array of grassland IDs

  // Financial aspects
  establishmentCostNPR: decimal("establishment_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  annualOperatingCostNPR: decimal("annual_operating_cost_npr", {
    precision: 14,
    scale: 2,
  }),
  annualRevenueNPR: decimal("annual_revenue_npr", { precision: 14, scale: 2 }),
  profitableOperation: boolean("profitable_operation").default(true),

  // Challenges and needs
  majorConstraints: text("major_constraints"),
  developmentNeeds: text("development_needs"),

  // SEO fields
  metaTitle: text("meta_title"), // SEO meta title
  metaDescription: text("meta_description"), // SEO meta description
  keywords: text("keywords"), // SEO keywords

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  facilityFootprint: geometry("facility_footprint", { type: "Polygon" }),

  // Status and metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type AgriProcessingCenter = typeof agriProcessingCenter.$inferSelect;
export type NewAgriProcessingCenter = typeof agriProcessingCenter.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
