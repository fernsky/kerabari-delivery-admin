import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define remittance amount group enum
export const remittanceAmountGroupEnum = pgEnum("remittance_amount_group", [
  "RS_0_TO_49999",
  "RS_50000_TO_99999",
  "RS_100000_TO_149999",
  "RS_150000_TO_199999",
  "RS_200000_TO_249999",
  "RS_250000_TO_299999",
  "RS_300000_TO_349999",
  "RS_350000_TO_399999",
  "RS_400000_TO_449999",
  "RS_450000_TO_499999",
  "RS_500000_PLUS",
]);

export const wardWiseRemittance = pgTable("ward_wise_sent_remittance", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Remittance amount group
  amountGroup: remittanceAmountGroupEnum("amount_group").notNull(),

  // Population sending this amount
  sendingPopulation: integer("sending_population").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseRemittance = typeof wardWiseRemittance.$inferSelect;
export type NewWardWiseRemittance = typeof wardWiseRemittance.$inferInsert;
