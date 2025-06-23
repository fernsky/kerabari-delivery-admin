import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, decimal, pgEnum } from "drizzle-orm/pg-core";

// Define irrigation source type enum
export const irrigationSourceEnum = pgEnum("irrigation_source_type", [
  "LAKE_OR_RESERVOIR",
  "IRRIGATION_CANAL",
  "RAINWATER_COLLECTION",
  "ELECTRIC_LIFT_IRRIGATION",
  "CANAL",
  "PUMPING_SET",
  "UNDERGROUND_IRRIGATION",
  "OTHER",
]);

export const municipalityWideIrrigationSource = pgTable(
  "municipality_wide_irrigation_source",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Irrigation source type
    irrigationSource: irrigationSourceEnum("irrigation_source").notNull(),

    // Coverage area
    coverageInHectares: decimal("coverage_in_hectares", {
      precision: 10,
      scale: 2,
    }).notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type MunicipalityWideIrrigationSource =
  typeof municipalityWideIrrigationSource.$inferSelect;
export type NewMunicipalityWideIrrigationSource =
  typeof municipalityWideIrrigationSource.$inferInsert;
