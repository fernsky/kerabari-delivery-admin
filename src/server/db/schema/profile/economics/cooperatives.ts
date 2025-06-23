import { pgTable } from "../../../schema/basic";
import { timestamp, varchar, text, pgEnum, integer } from "drizzle-orm/pg-core";

// Define cooperative type enum based on the data
export const cooperativeTypeEnum = pgEnum("cooperative_type_enum", [
  "SAVINGS_CREDIT", // बचत तथा ऋण
  "MULTI_PURPOSE", // बहुउद्देश्यीय
  "AGRICULTURE", // कृषि
  "DAIRY", // दुग्ध
  "COMMUNITY", // सामुदायिक
  "WOMENS", // महिला
  "FARMERS", // किसान
  "VEGETABLE", // तरकारी
  "OTHER", // अन्य
]);

export const cooperatives = pgTable(
  "cooperatives",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Basic information
    cooperativeName: varchar("cooperative_name", { length: 255 }).notNull(),
    wardNumber: integer("ward_number").notNull(),
    cooperativeType: cooperativeTypeEnum("cooperative_type").notNull(),
    phoneNumber: varchar("phone_number", { length: 20 }),
    remarks: text("remarks"),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type Cooperative = typeof cooperatives.$inferSelect;
export type NewCooperative = typeof cooperatives.$inferInsert;
