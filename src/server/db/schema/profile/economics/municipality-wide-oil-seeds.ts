import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, decimal, pgEnum } from "drizzle-orm/pg-core";

// Define oil seed type enum
export const oilSeedEnum = pgEnum("oil_seed_type", [
  "MUSTARD",
  "FLAX",
  "SUNFLOWER",
  "OTHER",
  "NONE",
]);

export const municipalityWideOilSeeds = pgTable("municipality_wide_oil_seeds", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Oil seed type
  oilSeed: oilSeedEnum("oil_seed").notNull(),

  // Production and sales metrics
  productionInTonnes: decimal("production_in_tonnes", {
    precision: 10,
    scale: 2,
  }).notNull(),

  salesInTonnes: decimal("sales_in_tonnes", {
    precision: 10,
    scale: 2,
  }).notNull(),

  revenueInRs: decimal("revenue_in_rs", {
    precision: 14,
    scale: 2,
  }).notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type MunicipalityWideOilSeeds =
  typeof municipalityWideOilSeeds.$inferSelect;
export type NewMunicipalityWideOilSeeds =
  typeof municipalityWideOilSeeds.$inferInsert;
