import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, integer } from "drizzle-orm/pg-core";

export const municipalityWideAgricultureRelatedFarmersGroup = pgTable(
  "municipality_wide_agriculture_related_farmers_group",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Basic information
    name: varchar("name", { length: 255 }).notNull(),
    wardNumber: integer("ward_number").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type MunicipalityWideAgricultureRelatedFarmersGroup =
  typeof municipalityWideAgricultureRelatedFarmersGroup.$inferSelect;
export type NewMunicipalityWideAgricultureRelatedFarmersGroup =
  typeof municipalityWideAgricultureRelatedFarmersGroup.$inferInsert;
