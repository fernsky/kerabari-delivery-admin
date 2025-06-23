import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { exportedProducts } from "@/server/db/schema/profile/economics/exported-products";
import { eq, sql } from "drizzle-orm";
import {
  addExportedProductSchema,
  getExportedProductSchema,
  batchAddExportedProductsSchema,
} from "./exported-products.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all exported products with optional filtering
export const getAllExportedProducts = publicProcedure
  .input(getExportedProductSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      const data = await ctx.db
        .select()
        .from(exportedProducts)
        .where(
          input?.id
            ? eq(exportedProducts.id, input.id)
            : input?.productName
              ? eq(exportedProducts.productName, input.productName)
              : undefined,
        )
        .orderBy(exportedProducts.productName);
      return data;
    } catch (error) {
      console.error("Error fetching exported products:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve exported products",
      });
    }
  });

// Get exported product by id
export const getExportedProductById = publicProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(exportedProducts)
      .where(eq(exportedProducts.id, input.id));
    return data;
  });

// Add a single exported product
export const addExportedProduct = protectedProcedure
  .input(addExportedProductSchema)
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can add exported products",
      });
    }
    await ctx.db.insert(exportedProducts).values({
      id: uuidv4(),
      productName: input.productName,
    });
    return { success: true };
  });

// Batch add exported products
export const batchAddExportedProducts = protectedProcedure
  .input(batchAddExportedProductsSchema)
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can batch add exported products",
      });
    }
    for (const item of input.data) {
      await ctx.db.insert(exportedProducts).values({
        id: uuidv4(),
        productName: item.productName,
      });
    }
    return { success: true };
  });

// Delete exported product by id
export const deleteExportedProduct = protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete exported products",
      });
    }
    await ctx.db
      .delete(exportedProducts)
      .where(eq(exportedProducts.id, input.id));
    return { success: true };
  });

// Get summary statistics (e.g., total count)
export const getExportedProductsSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      const summarySql = sql`
        SELECT 
          COUNT(*) as total_exported_products
        FROM 
          acme_exported_products
      `;
      const summaryData = await ctx.db.execute(summarySql);
      return summaryData[0] || { total_exported_products: 0 };
    } catch (error) {
      console.error("Error in getExportedProductsSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve exported products summary",
      });
    }
  },
);

// Export the router with all procedures
export const exportedProductsRouter = createTRPCRouter({
  getAll: getAllExportedProducts,
  getById: getExportedProductById,
  add: addExportedProduct,
  batchAdd: batchAddExportedProducts,
  delete: deleteExportedProduct,
  summary: getExportedProductsSummary,
});
