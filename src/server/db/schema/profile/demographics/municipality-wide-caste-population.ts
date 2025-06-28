import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { CasteType, casteTypeValues } from "../../common/enums";

export const municipalityWideCastePopulation = pgTable("municipality_wise_caste_population", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Caste or ethnic group - using the enum values
  casteType: varchar("caste_type", { length: 100 })
    .$type<CasteType>()
    .notNull(),

  // Total population count for this caste across all wards
  population: integer("population").notNull().default(0),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type MunicipalityWideCastePopulation =
  typeof municipalityWideCastePopulation.$inferSelect;
export type NewMunicipalityWideCastePopulation =
  typeof municipalityWideCastePopulation.$inferInsert; 