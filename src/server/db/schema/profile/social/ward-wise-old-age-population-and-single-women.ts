import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const wardWiseOldAgePopulationAndSingleWomen = pgTable(
  "ward_wise_old_age_population_and_single_women",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Population data
    maleOldAgePopulation: integer("male_old_age_population").notNull(),
    femaleOldAgePopulation: integer("female_old_age_population").notNull(),
    singleWomenPopulation: integer("single_women_population").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseOldAgePopulationAndSingleWomen =
  typeof wardWiseOldAgePopulationAndSingleWomen.$inferSelect;
export type NewWardWiseOldAgePopulationAndSingleWomen =
  typeof wardWiseOldAgePopulationAndSingleWomen.$inferInsert;
