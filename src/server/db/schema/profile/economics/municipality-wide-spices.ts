import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, decimal, pgEnum } from "drizzle-orm/pg-core";

// Define spice type enum
export const spiceTypeEnum = pgEnum("spice_type_enum", [
  "GARLIC", // लसुन
  "TURMERIC", // बेसार
  "CHILI_PEPPER", // खुर्सानी
  "GINGER", // अदुवा
  "CORIANDER", // धनिया
  "SICHUAN_PEPPER", // टिमुर
  "BLACK_PEPPER", // मरिच
  "CINNAMOMUM_TAMALA", // तेजपात
  "CUMIN", // जीरा
  "FENUGREEK", // मेथी
  "OTHER", // अन्य मसलाबाली
  "NONE", // कुनै मसलाबाली उत्पदान गर्दिन
]);

export const municipalityWideSpices = pgTable("municipality_wide_spices", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Spice type
  spiceType: spiceTypeEnum("spice_type").notNull(),

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

export type MunicipalityWideSpices = typeof municipalityWideSpices.$inferSelect;
export type NewMunicipalityWideSpices =
  typeof municipalityWideSpices.$inferInsert;
