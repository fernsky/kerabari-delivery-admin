import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Define the ward age wise population table
export const wardAgeWisePopulation = pgTable("ward_age_wise_population", {
  id: varchar("id", { length: 36 }).primaryKey(),
  wardNumber: integer("ward_number").notNull(),
  ageGroup: varchar("age_group")
    .notNull()
    .$type<
      | "AGE_0_4"
      | "AGE_5_9"
      | "AGE_10_14"
      | "AGE_15_19"
      | "AGE_20_24"
      | "AGE_25_29"
      | "AGE_30_34"
      | "AGE_35_39"
      | "AGE_40_44"
      | "AGE_45_49"
      | "AGE_50_54"
      | "AGE_55_59"
      | "AGE_60_64"
      | "AGE_65_69"
      | "AGE_70_74"
      | "AGE_75_AND_ABOVE"
    >(),
  gender: varchar("gender").notNull().$type<"MALE" | "FEMALE" | "OTHER">(),
  population: integer("population").notNull().default(0),
  updatedAt: timestamp("updated_at")
    .default(sql`NOW()`)
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").default(sql`NOW()`),
});

export type WardAgeWisePopulation = typeof wardAgeWisePopulation.$inferSelect;
export type NewWardAgeWisePopulation =
  typeof wardAgeWisePopulation.$inferInsert;
