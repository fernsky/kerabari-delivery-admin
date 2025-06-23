import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, decimal, pgEnum } from "drizzle-orm/pg-core";

// Define pulse type enum
export const pulseEnum = pgEnum("pulse_type", [
  "LENTIL",
  "CHICKPEA",
  "PEA",
  "PIGEON_PEA",
  "BLACK_GRAM",
  "SOYABEAN",
  "SNAKE_BEAN",
  "BEAN",
  "HORSE_GRAM",
  "OTHER",
  "NONE",
]);

export const municipalityWidePulses = pgTable("municipality_wide_pulses", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Pulse type
  pulse: pulseEnum("pulse").notNull(),

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

export type MunicipalityWidePulses = typeof municipalityWidePulses.$inferSelect;
export type NewMunicipalityWidePulses =
  typeof municipalityWidePulses.$inferInsert;
