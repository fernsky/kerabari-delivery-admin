import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { languageTypeEnum } from "./ward-wise-mother-tongue-population";

export const municipalityWideMotherTonguePopulation = pgTable("municipality_wise_mother_tongue_population", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Mother tongue/language category
  motherTongue: languageTypeEnum("language_type").notNull(),

  // Total population count for this language across all wards
  population: integer("population").notNull().default(0),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type MunicipalityWideMotherTonguePopulation =
  typeof municipalityWideMotherTonguePopulation.$inferSelect;
export type NewMunicipalityWideMotherTonguePopulation =
  typeof municipalityWideMotherTonguePopulation.$inferInsert; 