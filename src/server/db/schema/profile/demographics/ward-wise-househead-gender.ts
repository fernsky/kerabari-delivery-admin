import { pgTable } from "../../../schema/basic";
import { integer, varchar, pgEnum } from "drizzle-orm/pg-core";
import { genderEnum } from "./common";

// Define the ward wise house head gender table
export const wardWiseHouseHeadGender = pgTable("ward_wise_househead_gender", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward information
  wardNumber: integer("ward_number").notNull(),
  wardName: varchar("ward_name", { length: 100 }),

  // Gender of the household head
  gender: genderEnum("gender").notNull(),

  // Count of households with this gender as head
  population: integer("population").notNull().default(0),
});

export type WardWiseHouseHeadGender =
  typeof wardWiseHouseHeadGender.$inferSelect;
export type NewWardWiseHouseHeadGender =
  typeof wardWiseHouseHeadGender.$inferInsert;
