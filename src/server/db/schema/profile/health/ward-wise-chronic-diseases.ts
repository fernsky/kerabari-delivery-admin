import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define chronic disease type enum
export const chronicDiseaseTypeEnum = pgEnum("chronic_disease_type", [
  "HEART_RELATED_DISEASE",
  "RESPIRATION_RELATED",
  "ASTHMA",
  "EPILEPSY",
  "TUMOR_CANCER",
  "DIABETES",
  "KIDNEY_RELATED",
  "LIVER_RELATED",
  "ARTHRITIS_JOINT_PAIN",
  "GYNECOLOGICAL_DISEASE",
  "OCCUPATIONAL_DISEASE",
  "BLOOD_PRESSURE_HIGH_LOW",
  "GASTRIC_ULCER_INTESTINE_DISEASE",
  "PARKINSON_ALZHEIMER",
  "MIGRAINE",
  "OTHER",
]);

export const wardWiseChronicDiseases = pgTable("ward_wise_chronic_diseases", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Type of chronic disease
  chronicDisease: chronicDiseaseTypeEnum("chronic_disease").notNull(),

  // Number of people with this disease in the ward
  population: integer("population").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseChronicDisease =
  typeof wardWiseChronicDiseases.$inferSelect;
export type NewWardWiseChronicDisease =
  typeof wardWiseChronicDiseases.$inferInsert;
