import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define time to market center type enum
export const timeToMarketCenterTypeEnum = pgEnum("time_to_market_center_type", [
  "UNDER_15_MIN",
  "UNDER_30_MIN",
  "UNDER_1_HOUR",
  "1_HOUR_OR_MORE",
]);

export const wardWiseTimeToMarketCenter = pgTable(
  "ward_wise_time_to_market_center",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Time category to reach market center
    timeToMarketCenter: timeToMarketCenterTypeEnum(
      "time_to_market_center",
    ).notNull(),

    // Number of households in this time category
    households: integer("households").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseTimeToMarketCenter =
  typeof wardWiseTimeToMarketCenter.$inferSelect;
export type NewWardWiseTimeToMarketCenter =
  typeof wardWiseTimeToMarketCenter.$inferInsert;
