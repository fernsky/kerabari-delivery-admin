import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityWidePulses } from "@/server/db/schema/profile/economics/municipality-wide-pulses";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  municipalityWidePulsesSchema,
  municipalityWidePulsesFilterSchema,
  updateMunicipalityWidePulsesSchema,
  PulseTypeEnum,
} from "./municipality-wide-pulses.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all municipality-wide pulses data with optional filtering
export const getAllMunicipalityWidePulses = publicProcedure
  .input(municipalityWidePulsesFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(municipalityWidePulses);

        let conditions = [];

        if (input?.pulse) {
          conditions.push(eq(municipalityWidePulses.pulse, input.pulse));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by pulse type
        data = await queryWithFilters.orderBy(municipalityWidePulses.pulse);
      } catch (err) {
        console.log("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            pulse,
            production_in_tonnes,
            sales_in_tonnes,
            revenue_in_rs,
            updated_at,
            created_at
          FROM 
            acme_municipality_wide_pulses
          ORDER BY 
            pulse
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            pulse: row.pulse,
            productionInTonnes: parseFloat(
              String(row.production_in_tonnes || "0"),
            ),
            salesInTonnes: parseFloat(String(row.sales_in_tonnes || "0")),
            revenueInRs: parseFloat(String(row.revenue_in_rs || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.pulse) {
            data = data.filter((item) => item.pulse === input.pulse);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching municipality-wide pulses data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific pulse type
export const getMunicipalityWidePulsesByType = publicProcedure
  .input(z.object({ pulse: PulseTypeEnum }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(municipalityWidePulses)
      .where(eq(municipalityWidePulses.pulse, input.pulse));

    return data;
  });

// Create a new municipality-wide pulses entry
export const createMunicipalityWidePulses = protectedProcedure
  .input(municipalityWidePulsesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create municipality-wide pulses data",
      });
    }

    // Check if entry already exists for this pulse
    const existing = await ctx.db
      .select({ id: municipalityWidePulses.id })
      .from(municipalityWidePulses)
      .where(eq(municipalityWidePulses.pulse, input.pulse))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for pulse type ${input.pulse} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(municipalityWidePulses).values({
      id: input.id || uuidv4(),
      pulse: input.pulse,
      productionInTonnes: input.productionInTonnes.toString(),
      salesInTonnes: input.salesInTonnes.toString(),
      revenueInRs: input.revenueInRs.toString(),
    });

    return { success: true };
  });

// Update an existing municipality-wide pulses entry
export const updateMunicipalityWidePulses = protectedProcedure
  .input(updateMunicipalityWidePulsesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update municipality-wide pulses data",
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
      .select({ id: municipalityWidePulses.id })
      .from(municipalityWidePulses)
      .where(eq(municipalityWidePulses.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(municipalityWidePulses)
      .set({
        pulse: input.pulse,
        productionInTonnes: input.productionInTonnes.toString(),
        salesInTonnes: input.salesInTonnes.toString(),
        revenueInRs: input.revenueInRs.toString(),
      })
      .where(eq(municipalityWidePulses.id, input.id));

    return { success: true };
  });

// Delete a municipality-wide pulses entry
export const deleteMunicipalityWidePulses = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete municipality-wide pulses data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWidePulses)
      .where(eq(municipalityWidePulses.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getMunicipalityWidePulsesSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total production, sales, and revenue by pulse type
      const summarySql = sql`
        SELECT 
          pulse, 
          SUM(production_in_tonnes) as total_production,
          SUM(sales_in_tonnes) as total_sales,
          SUM(revenue_in_rs) as total_revenue
        FROM 
          acme_municipality_wide_pulses
        GROUP BY 
          pulse
        ORDER BY 
          total_production DESC
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getMunicipalityWidePulsesSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve municipality-wide pulses summary",
      });
    }
  },
);

// Export the router with all procedures
export const municipalityWidePulsesRouter = createTRPCRouter({
  getAll: getAllMunicipalityWidePulses,
  getByType: getMunicipalityWidePulsesByType,
  create: createMunicipalityWidePulses,
  update: updateMunicipalityWidePulses,
  delete: deleteMunicipalityWidePulses,
  summary: getMunicipalityWidePulsesSummary,
});
