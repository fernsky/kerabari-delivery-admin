import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, text, pgEnum } from "drizzle-orm/pg-core";

// Define crop type enum
export const cropTypeEnum = pgEnum("crop_type_enum", [
  "RICE", // धान
  "WHEAT", // गहुँ
  "CORN", // मकै
  "VEGETABLES", // तरकारी
  "FRUITS", // फलफूल
  "OTHER", // अन्य
]);

export const municipalityWideCropDiseases = pgTable(
  "municipality_wide_crop_diseases",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Crop information
    crop: cropTypeEnum("crop").notNull(),

    // Pest and disease information
    majorPests: text("major_pests").notNull(), // प्रमुख शत्रु जीव
    majorDiseases: text("major_diseases").notNull(), // प्रमुख रोग

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type MunicipalityWideCropDiseases =
  typeof municipalityWideCropDiseases.$inferSelect;
export type NewMunicipalityWideCropDiseases =
  typeof municipalityWideCropDiseases.$inferInsert;
