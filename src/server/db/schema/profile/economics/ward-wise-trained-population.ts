import { pgTable, uuid, integer, text, timestamp } from "drizzle-orm/pg-core";

export const wardWiseTrainedPopulation = pgTable(
  "acme_ward_wise_trained_population",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    wardNumber: integer("ward_number").notNull(),
    trainedPopulation: integer("trained_population").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
);

export type WardWiseTrainedPopulation =
  typeof wardWiseTrainedPopulation.$inferSelect;
export type NewWardWiseTrainedPopulation =
  typeof wardWiseTrainedPopulation.$inferInsert;
