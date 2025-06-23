import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, decimal, pgEnum } from "drizzle-orm/pg-core";

// Define animal product type enum
export const animalProductTypeEnum = pgEnum("animal_product_type_enum", [
  "MILK", // दुध
  "MILK_PRODUCT", // दुधजन्य वस्तु (ध्यू, चिज, मखन आदि)
  "EGG", // अण्डा
  "MEAT", // मासु
  "OTHER", // अन्य
]);

// Define measurement unit enum
export const measurementUnitEnum = pgEnum("measurement_unit_enum", [
  "TON", // टन
  "KG", // किलोग्राम
  "COUNT", // संख्या
  "LITER", // लिटर
  "OTHER", // अन्य
]);

export const municipalityWideAnimalProducts = pgTable(
  "municipality_wide_animal_products",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Animal product type
    animalProduct: animalProductTypeEnum("animal_product").notNull(),

    // Production and sales metrics
    productionAmount: decimal("production_amount", {
      precision: 14,
      scale: 2,
    }).notNull(),

    salesAmount: decimal("sales_amount", {
      precision: 14,
      scale: 2,
    }).notNull(),

    revenue: decimal("revenue_in_rs", {
      precision: 14,
      scale: 2,
    }).notNull(),

    // Measurement unit
    measurementUnit: measurementUnitEnum("measurement_unit").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type MunicipalityWideAnimalProducts =
  typeof municipalityWideAnimalProducts.$inferSelect;
export type NewMunicipalityWideAnimalProducts =
  typeof municipalityWideAnimalProducts.$inferInsert;
