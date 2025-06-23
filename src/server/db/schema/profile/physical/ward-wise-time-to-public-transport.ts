import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define time to public transport type enum
export const timeToPublicTransportTypeEnum = pgEnum(
  "time_to_public_transport_type",
  ["UNDER_15_MIN", "UNDER_30_MIN", "UNDER_1_HOUR", "1_HOUR_OR_MORE"],
);

export const wardWiseTimeToPublicTransport = pgTable(
  "ward_wise_time_to_public_transport",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Time category to reach public transport
    timeToPublicTransport: timeToPublicTransportTypeEnum(
      "time_to_public_transport",
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

export type WardWiseTimeToPublicTransport =
  typeof wardWiseTimeToPublicTransport.$inferSelect;
export type NewWardWiseTimeToPublicTransport =
  typeof wardWiseTimeToPublicTransport.$inferInsert;
