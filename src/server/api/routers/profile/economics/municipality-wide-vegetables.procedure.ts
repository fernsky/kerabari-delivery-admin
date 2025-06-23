import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityWideVegetables } from "@/server/db/schema/profile/economics/municipality-wide-vegetables";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  municipalityWideVegetablesSchema,
  municipalityWideVegetablesFilterSchema,
  updateMunicipalityWideVegetablesSchema,
  VegetableTypeEnum,
} from "./municipality-wide-vegetables.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all municipality-wide vegetables data with optional filtering
export const getAllMunicipalityWideVegetables = publicProcedure
  .input(municipalityWideVegetablesFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(municipalityWideVegetables);

        let conditions = [];

        if (input?.vegetableType) {
          conditions.push(
            eq(municipalityWideVegetables.vegetableType, input.vegetableType),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by vegetable type
        data = await queryWithFilters.orderBy(
          municipalityWideVegetables.vegetableType,
        );
      } catch (err) {
        console.log("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            vegetable_type,
            production_in_tonnes,
            sales_in_tonnes,
            revenue_in_rs,
            updated_at,
            created_at
          FROM 
            acme_municipality_wide_vegetables
          ORDER BY 
            vegetable_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            vegetableType: row.vegetable_type,
            productionInTonnes: parseFloat(
              String(row.production_in_tonnes || "0"),
            ),
            salesInTonnes: parseFloat(String(row.sales_in_tonnes || "0")),
            revenueInRs: parseFloat(String(row.revenue_in_rs || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.vegetableType) {
            data = data.filter(
              (item) => item.vegetableType === input.vegetableType,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching municipality-wide vegetables data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific vegetable type
export const getMunicipalityWideVegetablesByType = publicProcedure
  .input(z.object({ vegetableType: VegetableTypeEnum }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(municipalityWideVegetables)
      .where(eq(municipalityWideVegetables.vegetableType, input.vegetableType));

    return data;
  });

// Create a new municipality-wide vegetables entry
export const createMunicipalityWideVegetables = protectedProcedure
  .input(municipalityWideVegetablesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create municipality-wide vegetables data",
      });
    }

    // Check if entry already exists for this vegetable type
    const existing = await ctx.db
      .select({ id: municipalityWideVegetables.id })
      .from(municipalityWideVegetables)
      .where(eq(municipalityWideVegetables.vegetableType, input.vegetableType))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for vegetable type ${input.vegetableType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(municipalityWideVegetables).values({
      id: input.id || uuidv4(),
      vegetableType: input.vegetableType,
      productionInTonnes: input.productionInTonnes.toString(),
      salesInTonnes: input.salesInTonnes.toString(),
      revenueInRs: input.revenueInRs.toString(),
    });

    return { success: true };
  });

// Update an existing municipality-wide vegetables entry
export const updateMunicipalityWideVegetables = protectedProcedure
  .input(updateMunicipalityWideVegetablesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update municipality-wide vegetables data",
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
      .select({ id: municipalityWideVegetables.id })
      .from(municipalityWideVegetables)
      .where(eq(municipalityWideVegetables.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(municipalityWideVegetables)
      .set({
        vegetableType: input.vegetableType,
        productionInTonnes: input.productionInTonnes.toString(),
        salesInTonnes: input.salesInTonnes.toString(),
        revenueInRs: input.revenueInRs.toString(),
      })
      .where(eq(municipalityWideVegetables.id, input.id));

    return { success: true };
  });

// Delete a municipality-wide vegetables entry
export const deleteMunicipalityWideVegetables = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete municipality-wide vegetables data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWideVegetables)
      .where(eq(municipalityWideVegetables.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getMunicipalityWideVegetablesSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total production, sales, and revenue by vegetable type
      const summarySql = sql`
        SELECT 
          vegetable_type, 
          SUM(production_in_tonnes) as total_production,
          SUM(sales_in_tonnes) as total_sales,
          SUM(revenue_in_rs) as total_revenue
        FROM 
          acme_municipality_wide_vegetables
        GROUP BY 
          vegetable_type
        ORDER BY 
          total_production DESC
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getMunicipalityWideVegetablesSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve municipality-wide vegetables summary",
      });
    }
  },
);

// Export the router with all procedures
export const municipalityWideVegetablesRouter = createTRPCRouter({
  getAll: getAllMunicipalityWideVegetables,
  getByType: getMunicipalityWideVegetablesByType,
  create: createMunicipalityWideVegetables,
  update: updateMunicipalityWideVegetables,
  delete: deleteMunicipalityWideVegetables,
  summary: getMunicipalityWideVegetablesSummary,
});
