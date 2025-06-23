import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const wardWiseChildBearers = pgTable("ward_wise_child_bearers", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull().unique(),

  // Number of women aged 15-49 who have given birth
  age15to49ChildBearers: integer("age_15_to_49_child_bearers").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseChildBearer = typeof wardWiseChildBearers.$inferSelect;
export type NewWardWiseChildBearer = typeof wardWiseChildBearers.$inferInsert;
