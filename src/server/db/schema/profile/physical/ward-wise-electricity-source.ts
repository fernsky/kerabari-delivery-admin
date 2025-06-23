import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define electricity source type enum
export const electricitySourceTypeEnum = pgEnum("electricity_source_type", [
  "ELECTRICITY",
  "SOLAR",
  "KEROSENE",
  "BIOGAS",
  "OTHER",
]);

export const wardWiseElectricitySource = pgTable(
  "ward_wise_electricity_source",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Type of electricity source
    electricitySource:
      electricitySourceTypeEnum("electricity_source").notNull(),

    // Number of households using this electricity source
    households: integer("households").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseElectricitySource =
  typeof wardWiseElectricitySource.$inferSelect;
export type NewWardWiseElectricitySource =
  typeof wardWiseElectricitySource.$inferInsert;
