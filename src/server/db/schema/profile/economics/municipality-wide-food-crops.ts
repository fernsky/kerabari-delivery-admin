import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, decimal, pgEnum } from "drizzle-orm/pg-core";

// Define food crop type enum
export const foodCropEnum = pgEnum("food_crop_type", [
  "PADDY",
  "CORN",
  "WHEAT",
  "MILLET",
  "BARLEY",
  "PHAPAR",
  "JUNELO",
  "KAGUNO",
  "OTHER",
]);

export const municipalityWideFoodCrops = pgTable(
  "municipality_wide_food_crops",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Food crop type
    foodCrop: foodCropEnum("food_crop").notNull(),

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
  },
);

export type MunicipalityWideFoodCrops =
  typeof municipalityWideFoodCrops.$inferSelect;
export type NewMunicipalityWideFoodCrops =
  typeof municipalityWideFoodCrops.$inferInsert;
