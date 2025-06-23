import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { importedProducts } from "@/server/db/schema/profile/economics/imported-products";
import { eq, sql } from "drizzle-orm";
import {
  addImportedProductSchema,
  getImportedProductSchema,
  batchAddImportedProductsSchema,
} from "./imported-products.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all imported products with optional filtering
export const getAllImportedProducts = publicProcedure
  .input(getImportedProductSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      const data = await ctx.db
        .select()
        .from(importedProducts)
        .where(
          input?.id
            ? eq(importedProducts.id, input.id)
            : input?.productName
              ? eq(importedProducts.productName, input.productName)
              : undefined,
        )
        .orderBy(importedProducts.productName);
      return data;
    } catch (error) {
      console.error("Error fetching imported products:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve imported products",
      });
    }
  });

// Get imported product by id
export const getImportedProductById = publicProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(importedProducts)
      .where(eq(importedProducts.id, input.id));
    return data;
  });

// Add a single imported product
export const addImportedProduct = protectedProcedure
  .input(addImportedProductSchema)
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can add imported products",
      });
    }
    await ctx.db.insert(importedProducts).values({
      id: uuidv4(),
      productName: input.productName,
    });
    return { success: true };
  });

// Batch add imported products
export const batchAddImportedProducts = protectedProcedure
  .input(batchAddImportedProductsSchema)
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can batch add imported products",
      });
    }
    for (const item of input.data) {
      await ctx.db.insert(importedProducts).values({
        id: uuidv4(),
        productName: item.productName,
      });
    }
    return { success: true };
  });

// Delete imported product by id
export const deleteImportedProduct = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete imported products",
      });
    }
    await ctx.db
      .delete(importedProducts)
      .where(eq(importedProducts.id, input.id));
    return { success: true };
  });

// Get summary statistics (e.g., total count)
export const getImportedProductsSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      const summarySql = sql`
        SELECT 
          COUNT(*) as total_imported_products
        FROM 
          acme_imported_products
      `;
      const summaryData = await ctx.db.execute(summarySql);
      return summaryData[0] || { total_imported_products: 0 };
    } catch (error) {
      console.error("Error in getImportedProductsSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve imported products summary",
      });
    }
  },
);

// Export the router with all procedures
export const importedProductsRouter = createTRPCRouter({
  getAll: getAllImportedProducts,
  getById: getImportedProductById,
  add: addImportedProduct,
  batchAdd: batchAddImportedProducts,
  delete: deleteImportedProduct,
  summary: getImportedProductsSummary,
});
