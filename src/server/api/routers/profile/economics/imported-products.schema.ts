import { z } from "zod";

// Base schema for imported products
export const importedProductBaseSchema = z.object({
  productName: z.string(),
});

// Schema for adding a single imported product
export const addImportedProductSchema = z.object({
  productName: z.string(),
});

// Schema for getting imported products (optionally by id or name)
export const getImportedProductSchema = z.object({
  id: z.string().uuid().optional(),
  productName: z.string().optional(),
});

// Schema for batch adding imported products
export const batchAddImportedProductsSchema = z.object({
  data: z.array(
    z.object({
      productName: z.string(),
    })
  ),
});
