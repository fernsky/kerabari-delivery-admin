import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, decimal, pgEnum } from "drizzle-orm/pg-core";

// Define vegetable type enum
export const vegetableTypeEnum = pgEnum("vegetable_type_enum", [
  "POTATO", // आलु
  "CAULIFLOWER", // काउली
  "CABBAGE", // बन्दा
  "TOMATO", // गोलभेडा / टमाटर
  "RADISH", // मुला
  "CARROT", // गाँजर
  "TURNIP", // सलगम
  "CAPSICUM", // भेडे खुर्सानी
  "OKRA", // भिण्डी /रामतोरिया
  "BRINJAL", // भण्टा/भ्यान्टा
  "ONION", // प्याज
  "STRING_BEAN", // घिउ सिमी
  "RED_KIDNEY_BEAN", // राज्मा सिमी
  "CUCUMBER", // काक्रो
  "PUMPKIN", // फर्सी
  "BITTER_GOURD", // करेला
  "LUFFA", // घिरौला
  "SNAKE_GOURD", // चिचिन्ना
  "CALABASH", // लौका
  "BALSAM_APPLE", // बरेला
  "MUSHROOM", // च्याउ
  "SQUICE", // स्कुस
  "MUSTARD_GREENS", // रायोको साग
  "GARDEN_CRESS", // चम्सुरको साग
  "SPINACH", // पालुङ्गो साग
  "COLOCASIA", // पिडालु
  "YAM", // तरुल
  "OTHER", // अन्य तरकारी बाली
  "NONE", // कुनै तरकारी बाली उत्पदान गर्दिन
]);

export const municipalityWideVegetables = pgTable(
  "municipality_wide_vegetables",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Vegetable type
    vegetableType: vegetableTypeEnum("vegetable_type").notNull(),

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

export type MunicipalityWideVegetables =
  typeof municipalityWideVegetables.$inferSelect;
export type NewMunicipalityWideVegetables =
  typeof municipalityWideVegetables.$inferInsert;
