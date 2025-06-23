import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define time to active road type enum
export const timeToActiveRoadTypeEnum = pgEnum("time_to_active_road_type", [
  "UNDER_15_MIN",
  "UNDER_30_MIN",
  "UNDER_1_HOUR",
  "1_HOUR_OR_MORE",
]);

export const wardWiseTimeToActiveRoad = pgTable(
  "ward_wise_time_to_active_road",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Time category to reach active road
    timeToActiveRoad: timeToActiveRoadTypeEnum("time_to_active_road").notNull(),

    // Number of households in this time category
    households: integer("households").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseTimeToActiveRoad =
  typeof wardWiseTimeToActiveRoad.$inferSelect;
export type NewWardWiseTimeToActiveRoad =
  typeof wardWiseTimeToActiveRoad.$inferInsert;
