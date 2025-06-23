import { pgTable } from "../../basic";
import { integer, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";

// Define the disability cause enum
export const disabilityCauseEnum = pgEnum("disability_cause", [
  "CONGENITAL", // जन्मजात
  "ACCIDENT", // दुर्घटना
  "MALNUTRITION", // कुपोषण
  "DISEASE", // रोगको कारण
  "CONFLICT", // द्वन्द्वको कारण
  "OTHER", // अन्य(खुलाऊनुहोस्)
]);

export const wardWiseDisabilityCause = pgTable(
  "ward_wise_disability_cause",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Reference to the ward entity
    wardNumber: integer("ward_number").notNull(),

    // Disability cause category
    disabilityCause: disabilityCauseEnum("disability_cause").notNull(),

    // Number of people in this demographic category
    population: integer("population").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseDisabilityCause = 
  typeof wardWiseDisabilityCause.$inferSelect;
export type NewWardWiseDisabilityCause = 
  typeof wardWiseDisabilityCause.$inferInsert;
