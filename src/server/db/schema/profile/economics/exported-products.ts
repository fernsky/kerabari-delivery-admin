import { 
  pgTable, 
  uuid, 
  text, 
  timestamp 
} from "drizzle-orm/pg-core";

export const exportedProducts = pgTable("exported_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  productName: text("product_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ExportedProduct = typeof exportedProducts.$inferSelect;
export type NewExportedProduct = typeof exportedProducts.$inferInsert;
