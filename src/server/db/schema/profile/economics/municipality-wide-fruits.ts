import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, decimal, pgEnum } from "drizzle-orm/pg-core";

// Define fruit type enum
export const fruitTypeEnum = pgEnum("fruit_type_enum", [
  "MANGO", // आँप
  "JACKFRUIT", // रुखकटहर
  "LITCHI", // लिची
  "BANANA", // केरा
  "LEMON", // कागती
  "ORANGE", // सुन्तला
  "NIBUWA", // निबुवा
  "SWEET_ORANGE", // जुनार
  "SWEET_LEMON", // मौसम
  "JYAMIR", // ज्यामिर
  "POMELO", // भोगटे
  "PINEAPPLE", // भूईकटहर
  "PAPAYA", // मेवा
  "AVOCADO", // एभोकाडो
  "KIWI", // किवी
  "GUAVA", // अम्बा
  "PLUM", // आरुबखडा
  "PEACH", // आरु
  "PEAR", // नासपाती
  "POMEGRANATE", // अनार
  "WALNUT", // ओखर
  "JAPANESE_PERSIMMON", // हलुवावेद
  "HOG_PLUM", // लप्सी
  "NONE", // कुनै फलफूलबाली उत्पदान गर्दिन
]);

export const municipalityWideFruits = pgTable("municipality_wide_fruits", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Fruit type
  fruitType: fruitTypeEnum("fruit_type").notNull(),

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

export type MunicipalityWideFruits = typeof municipalityWideFruits.$inferSelect;
export type NewMunicipalityWideFruits =
  typeof municipalityWideFruits.$inferInsert;
