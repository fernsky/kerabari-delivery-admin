import { z } from "zod";

// Base schema for exported products
export const exportedProductBaseSchema = z.object({
  productName: z.string(),
});

// Schema for adding a single exported product
export const addExportedProductSchema = z.object({
  productName: z.string(),
});

// Schema for getting exported products (optionally by id or name)
export const getExportedProductSchema = z.object({
  id: z.string().uuid().optional(),
  productName: z.string().optional(),
});

// Schema for batch adding exported products
export const batchAddExportedProductsSchema = z.object({
  data: z.array(
    z.object({
      productName: z.string(),
    })
  ),
});
