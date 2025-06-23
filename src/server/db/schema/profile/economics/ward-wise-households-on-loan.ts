import { pgTable, uuid, integer, text, timestamp } from "drizzle-orm/pg-core";

export const wardWiseHouseholdsOnLoan = pgTable(
  "acme_ward_wise_households_on_loan",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    wardNumber: integer("ward_number").notNull(),
    households: integer("households").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
);

export type WardWiseHouseholdsOnLoan =
  typeof wardWiseHouseholdsOnLoan.$inferSelect;
export type NewWardWiseHouseholdsOnLoan =
  typeof wardWiseHouseholdsOnLoan.$inferInsert;
