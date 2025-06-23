import { timestamp, pgTable, varchar, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { geometry } from "@/server/db/geographical";

const connectionString =
  "postgres://crepeclan:OQt1h83yx2HmPVw3uisSQUD5yO936OFT@163.172.84.132:48432/khajura";
const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool);

export const parts = pgTable("parts", {
  id: varchar("id", { length: 15 }).primaryKey(),
  title_en: varchar("title_en", { length: 255 }).notNull(),
  title_ne: varchar("title_ne", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(
    () => new Date(),
  ),
});

export const chapters = pgTable("chapters", {
  id: varchar("id", { length: 15 }).primaryKey(),
  title_en: varchar("title_en", { length: 255 }).notNull(),
  title_ne: varchar("title_ne", { length: 255 }).notNull(),

  part_id: varchar("part_id", { length: 15 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(
    () => new Date(),
  ),
});

export const chapterRelations = relations(chapters, ({ one }) => ({
  part: one(parts, {
    fields: [chapters.part_id],
    references: [parts.id],
  }),
}));

export const sections = pgTable("sections", {
  id: varchar("id", { length: 15 }).primaryKey(),
  title_en: varchar("title_en", { length: 255 }).notNull(),
  title_ne: varchar("title_ne", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),

  content_schema: json("content_schema").notNull().default({}),
  chapter_id: varchar("chapter_id", { length: 15 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(
    () => new Date(),
  ),
});

export const sectionRelations = relations(sections, ({ one }) => ({
  chapter: one(chapters, {
    fields: [sections.chapter_id],
    references: [chapters.id],
  }),
}));

export const municipalityBoundaries = pgTable("municipality_boundaries", {
  id: varchar("id", { length: 15 }).primaryKey(),
  name_en: varchar("name_en", { length: 255 }).notNull(),
  name_ne: varchar("name_ne", { length: 255 }).notNull(),
  geometry: geometry("geometry", { type: "Polygon" }).notNull(),
});

export const health = pgTable("health", {
  id: varchar("id", { length: 15 }).primaryKey(),
  name_en: varchar("name_en", { length: 255 }).notNull(),
  name_ne: varchar("name_ne", { length: 255 }).notNull(),
  geometry: geometry("geometry", { type: "Point" }).notNull(),
});

export const municipalityOffices = pgTable("municipality_offices", {
  id: varchar("id", { length: 15 }).primaryKey(),
  name_en: varchar("name_en", { length: 255 }).notNull(),
  name_ne: varchar("name_ne", { length: 255 }).notNull(),
  geometry: geometry("geometry", { type: "Point" }).notNull(),
});

export const physicalInfrastructures = pgTable("physical_infrastructures", {
  id: varchar("id", { length: 15 }).primaryKey(),
  name_en: varchar("name_en", { length: 255 }).notNull(),
  name_ne: varchar("name_ne", { length: 255 }).notNull(),
  geometry: geometry("geometry", { type: "Point" }).notNull(),
});

export const schools = pgTable("schools", {
  id: varchar("id", { length: 15 }).primaryKey(),
  name_en: varchar("name_en", { length: 255 }).notNull(),
  name_ne: varchar("name_ne", { length: 255 }).notNull(),
  geometry: geometry("geometry", { type: "Point" }).notNull(),
});

export const touristPlaces = pgTable("tourist_places", {
  id: varchar("id", { length: 15 }).primaryKey(),
  name_en: varchar("name_en", { length: 255 }).notNull(),
  name_ne: varchar("name_ne", { length: 255 }).notNull(),
  geometry: geometry("geometry", { type: "Point" }).notNull(),
});

export const wardBoundaries = pgTable("ward_boundaries", {
  id: varchar("id", { length: 15 }).primaryKey(),
  name_en: varchar("name_en", { length: 255 }).notNull(),
  name_ne: varchar("name_ne", { length: 255 }).notNull(),
  geometry: geometry("geometry", { type: "Polygon" }).notNull(),
});

export const wardOffices = pgTable("ward_offices", {
  id: varchar("id", { length: 15 }).primaryKey(),
  name_en: varchar("name_en", { length: 255 }).notNull(),
  name_ne: varchar("name_ne", { length: 255 }).notNull(),
  geometry: geometry("geometry", { type: "Point" }).notNull(),
});

export const aspect = pgTable("aspect", {
  id: varchar("id", { length: 15 }).primaryKey(),
  type_en: varchar("type_en", { length: 255 }).notNull(),
  type_ne: varchar("type_ne", { length: 255 }).notNull(),
  geometry: geometry("geometry", { type: "Point" }).notNull(),
});

export const elevation = pgTable("elevation", {
  id: varchar("id", { length: 15 }).primaryKey(),
  elevation_en: varchar("elevation_en", { length: 255 }).notNull(),
  elevation_ne: varchar("elevation_ne", { length: 255 }).notNull(),
  geometry: geometry("geometry", { type: "MultiPolygon" }).notNull(),
});

export const highway = pgTable("highway", {
  id: varchar("id", { length: 15 }).primaryKey(),
  road_name_en: varchar("road_name_en", { length: 255 }).notNull(),
  road_name_ne: varchar("road_name_ne", { length: 255 }).notNull(),
  geometry: geometry("geometry", { type: "LineString" }).notNull(),
});

export const landUse = pgTable("land_use", {
  id: varchar("id", { length: 15 }).primaryKey(),
  land_use_en: varchar("land_use_en", { length: 255 }).notNull(),
  land_use_ne: varchar("land_use_ne", { length: 255 }).notNull(),
  geometry: geometry("geometry", { type: "MultiPolygon" }).notNull(),
});

export const roads = pgTable("roads", {
  id: varchar("id", { length: 15 }).primaryKey(),
  geometry: geometry("geometry", { type: "MultiLineString" }).notNull(),
});

export const slope = pgTable("slope", {
  id: varchar("id", { length: 15 }).primaryKey(),
  angle_en: varchar("angle_en", { length: 255 }).notNull(),
  angle_ne: varchar("angle_ne", { length: 255 }).notNull(),
  geometry: geometry("geometry", { type: "MultiPolygon" }).notNull(),
});

export const springs = pgTable("springs", {
  id: varchar("id", { length: 15 }).primaryKey(),
  geometry: geometry("geometry", { type: "LineString" }).notNull(),
});

export const villages = pgTable("villages", {
  id: varchar("id", { length: 15 }).primaryKey(),
  name_en: varchar("name_en", { length: 255 }).notNull(),
  name_ne: varchar("name_ne", { length: 255 }).notNull(),
  geometry: geometry("geometry", { type: "Point" }).notNull(),
});

export async function getAllMunicipalityBoundaries() {
  return await db.select().from(municipalityBoundaries);
}

export async function getAllHealthData() {
  return await db.select().from(health);
}

export type Part = typeof parts.$inferSelect;
export type NewPart = typeof parts.$inferInsert;

export type Chapter = typeof chapters.$inferSelect;
export type NewChapter = typeof chapters.$inferInsert;

export type Section = typeof sections.$inferSelect;
export type NewSection = typeof sections.$inferInsert;

export type MunicipalityBoundary = typeof municipalityBoundaries.$inferSelect;
export type NewMunicipalityBoundary =
  typeof municipalityBoundaries.$inferInsert;

export type Health = typeof health.$inferSelect;
export type NewHealth = typeof health.$inferInsert;

// export type MunicipalityOffice = typeof municipalityOffices.$inferSelect;
// export type NewMunicipalityOffice = typeof municipalityOffices.$inferInsert;

export type PhysicalInfrastructure =
  typeof physicalInfrastructures.$inferSelect;
export type NewPhysicalInfrastructure =
  typeof physicalInfrastructures.$inferInsert;

// export type School = typeof schools.$inferSelect;
// export type NewSchool = typeof schools.$inferInsert;

export type TouristPlace = typeof touristPlaces.$inferSelect;
export type NewTouristPlace = typeof touristPlaces.$inferInsert;

export type WardBoundary = typeof wardBoundaries.$inferSelect;
export type NewWardBoundary = typeof wardBoundaries.$inferInsert;

// export type WardOffice = typeof wardOffices.$inferSelect;
// export type NewWardOffice = typeof wardOffices.$inferInsert;

export type Aspect = typeof aspect.$inferSelect;
export type NewAspect = typeof aspect.$inferInsert;

export type Elevation = typeof elevation.$inferSelect;
export type NewElevation = typeof elevation.$inferInsert;

export type Highway = typeof highway.$inferSelect;
export type NewHighway = typeof highway.$inferInsert;

export type LandUse = typeof landUse.$inferSelect;
export type NewLandUse = typeof landUse.$inferInsert;

// export type Road = typeof roads.$inferSelect;
// export type NewRoad = typeof roads.$inferInsert;

export type Slope = typeof slope.$inferSelect;
export type NewSlope = typeof slope.$inferInsert;

// export type Spring = typeof springs.$inferSelect;
// export type NewSpring = typeof springs.$inferInsert;

export type Village = typeof villages.$inferSelect;
export type NewVillage = typeof villages.$inferInsert;
