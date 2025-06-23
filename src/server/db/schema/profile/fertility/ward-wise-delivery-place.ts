import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define delivery place type enum
export const deliveryPlaceTypeEnum = pgEnum("delivery_place_type", [
  "HOUSE",
  "GOVERNMENTAL_HEALTH_INSTITUTION",
  "PRIVATE_HEALTH_INSTITUTION",
  "OTHER",
]);

export const wardWiseDeliveryPlaces = pgTable("ward_wise_delivery_place", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Type of delivery place
  deliveryPlace: deliveryPlaceTypeEnum("delivery_place").notNull(),

  // Number of births at this location type in the ward
  population: integer("population").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseDeliveryPlace = typeof wardWiseDeliveryPlaces.$inferSelect;
export type NewWardWiseDeliveryPlace =
  typeof wardWiseDeliveryPlaces.$inferInsert;
