import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseDisabledPopulation } from "@/server/db/schema/profile/social/ward-wise-disabled-population";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseDisabledPopulationSchema,
  wardWiseDisabledPopulationFilterSchema,
  updateWardWiseDisabledPopulationSchema,
} from "./ward-wise-disabled-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise disabled population data with optional filtering
export const getAllWardWiseDisabledPopulation = publicProcedure
  .input(wardWiseDisabledPopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseDisabledPopulation);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseDisabledPopulation.wardNumber, input.wardNumber),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number
        data = await queryWithFilters.orderBy(
          wardWiseDisabledPopulation.wardNumber,
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
            ward_number,
            disabled_population,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_disabled_population
          ORDER BY 
            ward_number
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            disabledPopulation: parseInt(
              String(row.disabled_population || "0"),
            ),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-wise disabled population data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseDisabledPopulationByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseDisabledPopulation)
      .where(eq(wardWiseDisabledPopulation.wardNumber, input.wardNumber))
      .limit(1);

    return data[0] || null;
  });

// Create a new ward-wise disabled population entry
export const createWardWiseDisabledPopulation = protectedProcedure
  .input(wardWiseDisabledPopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise disabled population data",
      });
    }

    // Check if entry already exists for this ward
    const existing = await ctx.db
      .select({ id: wardWiseDisabledPopulation.id })
      .from(wardWiseDisabledPopulation)
      .where(eq(wardWiseDisabledPopulation.wardNumber, input.wardNumber))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseDisabledPopulation).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      disabledPopulation: input.disabledPopulation,
    });

    return { success: true };
  });

// Update an existing ward-wise disabled population entry
export const updateWardWiseDisabledPopulation = protectedProcedure
  .input(updateWardWiseDisabledPopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise disabled population data",
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
      .select({ id: wardWiseDisabledPopulation.id })
      .from(wardWiseDisabledPopulation)
      .where(eq(wardWiseDisabledPopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseDisabledPopulation)
      .set({
        wardNumber: input.wardNumber,
        disabledPopulation: input.disabledPopulation,
      })
      .where(eq(wardWiseDisabledPopulation.id, input.id));

    return { success: true };
  });

// Delete a ward-wise disabled population entry
export const deleteWardWiseDisabledPopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise disabled population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseDisabledPopulation)
      .where(eq(wardWiseDisabledPopulation.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseDisabledPopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total disabled population across all wards
      const summarySql = sql`
        SELECT 
          SUM(disabled_population) as total_disabled_population
        FROM 
          ward_wise_disabled_population
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return {
        totalDisabledPopulation: summaryData[0]?.total_disabled_population || 0,
      };
    } catch (error) {
      console.error("Error in getWardWiseDisabledPopulationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise disabled population summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseDisabledPopulationRouter = createTRPCRouter({
  getAll: getAllWardWiseDisabledPopulation,
  getByWard: getWardWiseDisabledPopulationByWard,
  create: createWardWiseDisabledPopulation,
  update: updateWardWiseDisabledPopulation,
  delete: deleteWardWiseDisabledPopulation,
  summary: getWardWiseDisabledPopulationSummary,
});
