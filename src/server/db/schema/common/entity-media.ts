import { pgTable } from "../../schema/basic";
import {
  integer,
  timestamp,
  varchar,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { media } from "./media";

// Define entity type enum for different types of entities that can have media
export const entityTypeEnum = pgEnum("entity_type", [
  // Local Areas
  "LOCATION",
  "WARD",
  "SETTLEMENT",
  "SQUATTER_AREA",
  "AGRICULTURAL_AREA",
  "BUSINESS_AREA",
  "INDUSTRIAL_AREA",

  // Roads
  "ROAD",
  "PARKING_FACILITY",
  "PUBLIC_TRANSPORT",
  "PETROL_PUMP",

  // Agricultural
  "AGRIC_ZONE",
  "FARM",
  "FISH_FARM",
  "GRASSLAND",
  "GRAZING_AREA",

  // Cultural
  "CULTURAL_HERITAGE",
  "HISTORICAL_SITE",
  "RELIGIOUS_PLACE",
]);

// Entity-Media relationship table
export const entityMedia = pgTable("entity_media", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Entity information
  entityId: varchar("entity_id", { length: 36 }).notNull(),
  entityType: entityTypeEnum("entity_type").notNull(),

  // Media reference
  mediaId: varchar("media_id", { length: 36 })
    .notNull()
    .references(() => media.id),

  // Primary flag (to mark a media as the primary one for the entity)
  isPrimary: boolean("is_primary").default(false),

  // Order for controlling the display sequence
  displayOrder: integer("display_order").default(0),

  // Metadata
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type EntityMedia = typeof entityMedia.$inferSelect;
export type NewEntityMedia = typeof entityMedia.$inferInsert;
