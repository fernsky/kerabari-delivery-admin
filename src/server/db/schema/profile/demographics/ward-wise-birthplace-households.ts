import { pgTable } from "../../basic";
import { integer, pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";

// Define the birth place enum
export const birthPlaceEnum = pgEnum("birth_place", [
  "SAME_MUNICIPALITY", // यहि गापा/नपा
  "SAME_DISTRICT_ANOTHER_MUNICIPALITY", // यहि जिल्लाको अर्को गा.पा./न.पा
  "ANOTHER_DISTRICT", // अर्को जिल्ला
  "ABROAD", // विदेश
]);

export const wardWiseBirthplaceHouseholds = pgTable(
  "ward_wise_birthplace_households",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Reference to the ward entity
    wardNumber: integer("ward_number").notNull(),

    // Birth place category
    birthPlace: birthPlaceEnum("birth_place").notNull(),

    // Number of households in this demographic category
    households: integer("households").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseBirthplaceHouseholds = 
  typeof wardWiseBirthplaceHouseholds.$inferSelect;
export type NewWardWiseBirthplaceHouseholds = 
  typeof wardWiseBirthplaceHouseholds.$inferInsert;
