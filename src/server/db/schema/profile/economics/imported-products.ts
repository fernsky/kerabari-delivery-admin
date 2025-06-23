import { 
  pgTable, 
  uuid, 
  text, 
  timestamp 
} from "drizzle-orm/pg-core";

export const importedProducts = pgTable("imported_products", {
  id: uuid("id").defaultRandom().primaryKey(),
  productName: text("product_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ImportedProduct = typeof importedProducts.$inferSelect;
export type NewImportedProduct = typeof importedProducts.$inferInsert;