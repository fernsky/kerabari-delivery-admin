import { pgTable } from "../../basic";
import { integer, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";

// Define the migrated from enum
export const migratedFromEnum = pgEnum("migrated_from", [
  "ANOTHER_DISTRICT", // नेपालको अर्को जिल्ला
  "SAME_DISTRICT_ANOTHER_MUNICIPALITY", // यही जिल्लाको अर्को स्थानीय तह
  "ABROAD", // विदेश
]);

export const wardWiseMigratedHouseholds = pgTable(
  "acme_ward_wise_migrated_households",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Reference to the ward entity
    wardNumber: integer("ward_number").notNull(),

    // Migration origin category
    migratedFrom: migratedFromEnum("migrated_from").notNull(),

    // Number of households in this demographic category
    households: integer("households").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseMigratedHouseholds = 
  typeof wardWiseMigratedHouseholds.$inferSelect;
export type NewWardWiseMigratedHouseholds = 
  typeof wardWiseMigratedHouseholds.$inferInsert;
