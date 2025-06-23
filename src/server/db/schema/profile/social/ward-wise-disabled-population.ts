import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const wardWiseDisabledPopulation = pgTable(
  "ward_wise_disabled_population",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Number of people with disabilities in this ward
    disabledPopulation: integer("disabled_population").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseDisabledPopulation =
  typeof wardWiseDisabledPopulation.$inferSelect;
export type NewWardWiseDisabledPopulation =
  typeof wardWiseDisabledPopulation.$inferInsert;
