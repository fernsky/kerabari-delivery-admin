import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityWideSpices } from "@/server/db/schema/profile/economics/municipality-wide-spices";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  municipalityWideSpicesSchema,
  municipalityWideSpicesFilterSchema,
  updateMunicipalityWideSpicesSchema,
  SpiceTypeEnum,
} from "./municipality-wide-spices.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all municipality-wide spices data with optional filtering
export const getAllMunicipalityWideSpices = publicProcedure
  .input(municipalityWideSpicesFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(municipalityWideSpices);

        let conditions = [];

        if (input?.spiceType) {
          conditions.push(
            eq(municipalityWideSpices.spiceType, input.spiceType),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by spice type
        data = await queryWithFilters.orderBy(municipalityWideSpices.spiceType);
      } catch (err) {
        console.log("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            spice_type,
            production_in_tonnes,
            sales_in_tonnes,
            revenue_in_rs,
            updated_at,
            created_at
          FROM 
            acme_municipality_wide_spices
          ORDER BY 
            spice_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            spiceType: row.spice_type,
            productionInTonnes: parseFloat(
              String(row.production_in_tonnes || "0"),
            ),
            salesInTonnes: parseFloat(String(row.sales_in_tonnes || "0")),
            revenueInRs: parseFloat(String(row.revenue_in_rs || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.spiceType) {
            data = data.filter((item) => item.spiceType === input.spiceType);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching municipality-wide spices data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific spice type
export const getMunicipalityWideSpicesByType = publicProcedure
  .input(z.object({ spiceType: SpiceTypeEnum }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(municipalityWideSpices)
      .where(eq(municipalityWideSpices.spiceType, input.spiceType));

    return data;
  });

// Create a new municipality-wide spices entry
export const createMunicipalityWideSpices = protectedProcedure
  .input(municipalityWideSpicesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create municipality-wide spices data",
      });
    }

    // Check if entry already exists for this spice type
    const existing = await ctx.db
      .select({ id: municipalityWideSpices.id })
      .from(municipalityWideSpices)
      .where(eq(municipalityWideSpices.spiceType, input.spiceType))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for spice type ${input.spiceType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(municipalityWideSpices).values({
      id: input.id || uuidv4(),
      spiceType: input.spiceType,
      productionInTonnes: input.productionInTonnes.toString(),
      salesInTonnes: input.salesInTonnes.toString(),
      revenueInRs: input.revenueInRs.toString(),
    });

    return { success: true };
  });

// Update an existing municipality-wide spices entry
export const updateMunicipalityWideSpices = protectedProcedure
  .input(updateMunicipalityWideSpicesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update municipality-wide spices data",
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
      .select({ id: municipalityWideSpices.id })
      .from(municipalityWideSpices)
      .where(eq(municipalityWideSpices.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(municipalityWideSpices)
      .set({
        spiceType: input.spiceType,
        productionInTonnes: input.productionInTonnes.toString(),
        salesInTonnes: input.salesInTonnes.toString(),
        revenueInRs: input.revenueInRs.toString(),
      })
      .where(eq(municipalityWideSpices.id, input.id));

    return { success: true };
  });

// Delete a municipality-wide spices entry
export const deleteMunicipalityWideSpices = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete municipality-wide spices data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWideSpices)
      .where(eq(municipalityWideSpices.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getMunicipalityWideSpicesSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total production, sales, and revenue by spice type
      const summarySql = sql`
        SELECT 
          spice_type, 
          SUM(production_in_tonnes) as total_production,
          SUM(sales_in_tonnes) as total_sales,
          SUM(revenue_in_rs) as total_revenue
        FROM 
          acme_municipality_wide_spices
        GROUP BY 
          spice_type
        ORDER BY 
          total_production DESC
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getMunicipalityWideSpicesSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve municipality-wide spices summary",
      });
    }
  },
);

// Export the router with all procedures
export const municipalityWideSpicesRouter = createTRPCRouter({
  getAll: getAllMunicipalityWideSpices,
  getByType: getMunicipalityWideSpicesByType,
  create: createMunicipalityWideSpices,
  update: updateMunicipalityWideSpices,
  delete: deleteMunicipalityWideSpices,
  summary: getMunicipalityWideSpicesSummary,
});
