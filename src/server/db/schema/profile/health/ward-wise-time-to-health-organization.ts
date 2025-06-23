import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define time to health organization type enum
export const timeToHealthOrganizationTypeEnum = pgEnum(
  "time_to_health_organization_type",
  ["UNDER_15_MIN", "UNDER_30_MIN", "UNDER_1_HOUR", "1_HOUR_OR_MORE"],
);

export const wardWiseTimeToHealthOrganization = pgTable(
  "ward_wise_time_to_health_organization",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Ward reference
    wardNumber: integer("ward_number").notNull(),

    // Time category to reach health organization
    timeToHealthOrganization: timeToHealthOrganizationTypeEnum(
      "time_to_health_organization",
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

export type WardWiseTimeToHealthOrganization =
  typeof wardWiseTimeToHealthOrganization.$inferSelect;
export type NewWardWiseTimeToHealthOrganization =
  typeof wardWiseTimeToHealthOrganization.$inferInsert;
