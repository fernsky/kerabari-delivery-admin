import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, text, pgEnum } from "drizzle-orm/pg-core";

// Define vegetable and fruit type enum
export const vegetableFruitTypeEnum = pgEnum("vegetable_fruit_type_enum", [
  "TOMATO", // गोलभेडा
  "CAULIFLOWER", // काउली
  "CABBAGE", // बन्दा
  "POTATO", // आलु
  "MUSTARD", // रायो
  "OTHER", // अन्य
]);

export const municipalityWideVegetablesAndFruitsDiseases = pgTable(
  "municipality_wide_vegetables_and_fruits_diseases",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Crop type
    crop: vegetableFruitTypeEnum("crop").notNull(),

    // Pests and diseases information
    majorPests: text("major_pests").notNull(),
    majorDiseases: text("major_diseases").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type MunicipalityWideVegetablesAndFruitsDiseases =
  typeof municipalityWideVegetablesAndFruitsDiseases.$inferSelect;
export type NewMunicipalityWideVegetablesAndFruitsDiseases =
  typeof municipalityWideVegetablesAndFruitsDiseases.$inferInsert;
