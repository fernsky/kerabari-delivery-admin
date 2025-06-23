import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, text, pgEnum, integer } from "drizzle-orm/pg-core";

// Define business type enum based on the data
export const businessTypeEnum = pgEnum("business_type_enum", [
  "VEGETABLE_FARMING", // तरकारी खेती
  "GOAT_FARMING", // बाख्रा पालन
  "POULTRY_FARMING", // कुखुरा पालन
  "FISH_FARMING", // माछा पालन
  "CATTLE_FARMING", // गाई/भैंसी पालन
  "ANIMAL_HUSBANDRY", // पशुपालन
  "LIVESTOCK_POULTRY", // पशुपंछी पालन
  "BEEKEEPING", // मौरी पालन
  "FRUIT_FARMING", // फलफूल खेती
  "MUSHROOM_FARMING", // च्याउ खेती
  "PIG_FARMING", // बंगुर पालन
  "NURSERY", // नर्सरी
  "DAIRY_FARMING", // दुग्ध उत्पादन
  "MIXED_FARMING", // मिश्रित खेती
  "AGRICULTURE", // कृषि
  "ORGANIC_FARMING", // जैविक खेती
  "OTHER", // अन्य
]);

export const municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup = pgTable(
  "municipality_wide_commercial_agricultural_animal_husbandry_farmers_group",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Basic information
    name: varchar("name", { length: 255 }).notNull(),
    wardNumber: integer("ward_number").notNull(),
    type: businessTypeEnum("type").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type MunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup =
  typeof municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup.$inferSelect;
export type NewMunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup =
  typeof municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup.$inferInsert;
