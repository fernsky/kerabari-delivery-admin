import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define religion type enum based on the provided religion values
export const religionTypeEnum = pgEnum("religion_type", [
  "HINDU",
  "BUDDHIST",
  "KIRANT",
  "CHRISTIAN",
  "ISLAM",
  "NATURE",
  "BON",
  "JAIN",
  "BAHAI",
  "SIKH",
  "OTHER",
]);

export const wardWiseReligionPopulation = pgTable(
  "ward_wise_religion_population",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Reference to the ward entity through the demographic summary
    wardNumber: integer("ward_number").notNull(),

    // Religion category
    religionType: religionTypeEnum("religion_type").notNull(),

    // Number of people practicing the specified religion in the ward
    population: integer("population").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseReligionPopulation =
  typeof wardWiseReligionPopulation.$inferSelect;
export type NewWardWiseReligionPopulation =
  typeof wardWiseReligionPopulation.$inferInsert;
