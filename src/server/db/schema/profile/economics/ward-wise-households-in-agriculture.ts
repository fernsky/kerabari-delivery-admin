import { pgTable } from "../../basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const wardWiseHouseholdsInAgriculture = pgTable(
  "ward_wise_households_in_agriculture",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Households involved in agriculture or animal husbandry
    involvedInAgriculture: integer("involved_in_agriculture").notNull(),

    // Households not involved in agriculture or animal husbandry
    nonInvolvedInAgriculture: integer("non_involved_in_agriculture").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseHouseholdsInAgriculture = 
  typeof wardWiseHouseholdsInAgriculture.$inferSelect;
export type NewWardWiseHouseholdsInAgriculture = 
  typeof wardWiseHouseholdsInAgriculture.$inferInsert;
