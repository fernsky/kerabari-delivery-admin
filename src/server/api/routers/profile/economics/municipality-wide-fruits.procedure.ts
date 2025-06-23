import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityWideFruits } from "@/server/db/schema/profile/economics/municipality-wide-fruits";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  municipalityWideFruitsSchema,
  municipalityWideFruitsFilterSchema,
  updateMunicipalityWideFruitsSchema,
  FruitTypeEnum,
} from "./municipality-wide-fruits.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all municipality-wide fruits data with optional filtering
export const getAllMunicipalityWideFruits = publicProcedure
  .input(municipalityWideFruitsFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(municipalityWideFruits);

        let conditions = [];

        if (input?.fruitType) {
          conditions.push(
            eq(municipalityWideFruits.fruitType, input.fruitType),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by fruit type
        data = await queryWithFilters.orderBy(municipalityWideFruits.fruitType);
      } catch (err) {
        console.log("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            fruit_type,
            production_in_tonnes,
            sales_in_tonnes,
            revenue_in_rs,
            updated_at,
            created_at
          FROM 
            acme_municipality_wide_fruits
          ORDER BY 
            fruit_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            fruitType: row.fruit_type,
            productionInTonnes: parseFloat(
              String(row.production_in_tonnes || "0"),
            ),
            salesInTonnes: parseFloat(String(row.sales_in_tonnes || "0")),
            revenueInRs: parseFloat(String(row.revenue_in_rs || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.fruitType) {
            data = data.filter((item) => item.fruitType === input.fruitType);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching municipality-wide fruits data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific fruit type
export const getMunicipalityWideFruitsByType = publicProcedure
  .input(z.object({ fruitType: FruitTypeEnum }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(municipalityWideFruits)
      .where(eq(municipalityWideFruits.fruitType, input.fruitType));

    return data;
  });

// Create a new municipality-wide fruits entry
export const createMunicipalityWideFruits = protectedProcedure
  .input(municipalityWideFruitsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create municipality-wide fruits data",
      });
    }

    // Check if entry already exists for this fruit type
    const existing = await ctx.db
      .select({ id: municipalityWideFruits.id })
      .from(municipalityWideFruits)
      .where(eq(municipalityWideFruits.fruitType, input.fruitType))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for fruit type ${input.fruitType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(municipalityWideFruits).values({
      id: input.id || uuidv4(),
      fruitType: input.fruitType,
      productionInTonnes: input.productionInTonnes.toString(),
      salesInTonnes: input.salesInTonnes.toString(),
      revenueInRs: input.revenueInRs.toString(),
    });

    return { success: true };
  });

// Update an existing municipality-wide fruits entry
export const updateMunicipalityWideFruits = protectedProcedure
  .input(updateMunicipalityWideFruitsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update municipality-wide fruits data",
      });
    }

    if (!input.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "ID is required for update",
      });
    }

    // Check if the record exists
    const existing = await ctx.db
      .select({ id: municipalityWideFruits.id })
      .from(municipalityWideFruits)
      .where(eq(municipalityWideFruits.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(municipalityWideFruits)
      .set({
        fruitType: input.fruitType,
        productionInTonnes: input.productionInTonnes.toString(),
        salesInTonnes: input.salesInTonnes.toString(),
        revenueInRs: input.revenueInRs.toString(),
      })
      .where(eq(municipalityWideFruits.id, input.id));

    return { success: true };
  });

// Delete a municipality-wide fruits entry
export const deleteMunicipalityWideFruits = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete municipality-wide fruits data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWideFruits)
      .where(eq(municipalityWideFruits.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getMunicipalityWideFruitsSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total production, sales, and revenue by fruit type
      const summarySql = sql`
        SELECT 
          fruit_type, 
          SUM(production_in_tonnes) as total_production,
          SUM(sales_in_tonnes) as total_sales,
          SUM(revenue_in_rs) as total_revenue
        FROM 
          acme_municipality_wide_fruits
        GROUP BY 
          fruit_type
        ORDER BY 
          total_production DESC
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getMunicipalityWideFruitsSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve municipality-wide fruits summary",
      });
    }
  },
);

// Export the router with all procedures
export const municipalityWideFruitsRouter = createTRPCRouter({
  getAll: getAllMunicipalityWideFruits,
  getByType: getMunicipalityWideFruitsByType,
  create: createMunicipalityWideFruits,
  update: updateMunicipalityWideFruits,
  delete: deleteMunicipalityWideFruits,
  summary: getMunicipalityWideFruitsSummary,
});
