import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityWideOilSeeds } from "@/server/db/schema/profile/economics/municipality-wide-oil-seeds";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  municipalityWideOilSeedsSchema,
  municipalityWideOilSeedsFilterSchema,
  updateMunicipalityWideOilSeedsSchema,
  OilSeedTypeEnum,
} from "./municipality-wide-oil-seeds.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all municipality-wide oil seeds data with optional filtering
export const getAllMunicipalityWideOilSeeds = publicProcedure
  .input(municipalityWideOilSeedsFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(municipalityWideOilSeeds);

        let conditions = [];

        if (input?.oilSeed) {
          conditions.push(eq(municipalityWideOilSeeds.oilSeed, input.oilSeed));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by oil seed type
        data = await queryWithFilters.orderBy(municipalityWideOilSeeds.oilSeed);
      } catch (err) {
        console.log("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            oil_seed,
            production_in_tonnes,
            sales_in_tonnes,
            revenue_in_rs,
            updated_at,
            created_at
          FROM 
            acme_municipality_wide_oil_seeds
          ORDER BY 
            oil_seed
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            oilSeed: row.oil_seed,
            productionInTonnes: parseFloat(
              String(row.production_in_tonnes || "0"),
            ),
            salesInTonnes: parseFloat(String(row.sales_in_tonnes || "0")),
            revenueInRs: parseFloat(String(row.revenue_in_rs || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.oilSeed) {
            data = data.filter((item) => item.oilSeed === input.oilSeed);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching municipality-wide oil seeds data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific oil seed type
export const getMunicipalityWideOilSeedsByType = publicProcedure
  .input(z.object({ oilSeed: OilSeedTypeEnum }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(municipalityWideOilSeeds)
      .where(eq(municipalityWideOilSeeds.oilSeed, input.oilSeed));

    return data;
  });

// Create a new municipality-wide oil seeds entry
export const createMunicipalityWideOilSeeds = protectedProcedure
  .input(municipalityWideOilSeedsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create municipality-wide oil seeds data",
      });
    }

    // Check if entry already exists for this oil seed
    const existing = await ctx.db
      .select({ id: municipalityWideOilSeeds.id })
      .from(municipalityWideOilSeeds)
      .where(eq(municipalityWideOilSeeds.oilSeed, input.oilSeed))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for oil seed type ${input.oilSeed} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(municipalityWideOilSeeds).values({
      id: input.id || uuidv4(),
      oilSeed: input.oilSeed,
      productionInTonnes: input.productionInTonnes.toString(),
      salesInTonnes: input.salesInTonnes.toString(),
      revenueInRs: input.revenueInRs.toString(),
    });

    return { success: true };
  });

// Update an existing municipality-wide oil seeds entry
export const updateMunicipalityWideOilSeeds = protectedProcedure
  .input(updateMunicipalityWideOilSeedsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update municipality-wide oil seeds data",
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
      .select({ id: municipalityWideOilSeeds.id })
      .from(municipalityWideOilSeeds)
      .where(eq(municipalityWideOilSeeds.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(municipalityWideOilSeeds)
      .set({
        oilSeed: input.oilSeed,
        productionInTonnes: input.productionInTonnes.toString(),
        salesInTonnes: input.salesInTonnes.toString(),
        revenueInRs: input.revenueInRs.toString(),
      })
      .where(eq(municipalityWideOilSeeds.id, input.id));

    return { success: true };
  });

// Delete a municipality-wide oil seeds entry
export const deleteMunicipalityWideOilSeeds = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete municipality-wide oil seeds data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWideOilSeeds)
      .where(eq(municipalityWideOilSeeds.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getMunicipalityWideOilSeedsSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total production, sales, and revenue by oil seed type
      const summarySql = sql`
        SELECT 
          oil_seed, 
          SUM(production_in_tonnes) as total_production,
          SUM(sales_in_tonnes) as total_sales,
          SUM(revenue_in_rs) as total_revenue
        FROM 
          acme_municipality_wide_oil_seeds
        GROUP BY 
          oil_seed
        ORDER BY 
          total_production DESC
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getMunicipalityWideOilSeedsSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve municipality-wide oil seeds summary",
      });
    }
  },
);

// Export the router with all procedures
export const municipalityWideOilSeedsRouter = createTRPCRouter({
  getAll: getAllMunicipalityWideOilSeeds,
  getByType: getMunicipalityWideOilSeedsByType,
  create: createMunicipalityWideOilSeeds,
  update: updateMunicipalityWideOilSeeds,
  delete: deleteMunicipalityWideOilSeeds,
  summary: getMunicipalityWideOilSeedsSummary,
});
