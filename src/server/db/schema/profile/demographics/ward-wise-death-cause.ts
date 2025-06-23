import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const wardWiseDeathCause = pgTable("acme_ward_wise_death_cause", {
  id: uuid("id").defaultRandom().primaryKey(),
  wardNumber: integer("ward_number").notNull(),
  deathCause: text("death_cause").notNull(),
  population: integer("population").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type WardWiseDeathCause = typeof wardWiseDeathCause.$inferSelect;
export type NewWardWiseDeathCause = typeof wardWiseDeathCause.$inferInsert;
