import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define road status type enum
export const roadStatusTypeEnum = pgEnum("road_status_type", [
  "BLACK_TOPPED",
  "GRAVELED",
  "DIRT",
  "GORETO",
  "OTHER",
]);

export const wardWiseRoadStatus = pgTable("ward_wise_road_status", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Type of road status
  roadStatus: roadStatusTypeEnum("road_status").notNull(),

  // Number of households with access to this road type
  households: integer("households").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseRoadStatus = typeof wardWiseRoadStatus.$inferSelect;
export type NewWardWiseRoadStatus = typeof wardWiseRoadStatus.$inferInsert;
