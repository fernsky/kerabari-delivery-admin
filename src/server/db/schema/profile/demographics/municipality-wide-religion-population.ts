import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { religionTypeEnum } from "./ward-wise-religion-population";

export const municipalityWideReligionPopulation = pgTable("municipality_wise_religion_population", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Religion category
  religionType: religionTypeEnum("religion_type").notNull(),

  // Total population count for this religion across all wards
  population: integer("population").notNull().default(0),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type MunicipalityWideReligionPopulation =
  typeof municipalityWideReligionPopulation.$inferSelect;
export type NewMunicipalityWideReligionPopulation =
  typeof municipalityWideReligionPopulation.$inferInsert; 