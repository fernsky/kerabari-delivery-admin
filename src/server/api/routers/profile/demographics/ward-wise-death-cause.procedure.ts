import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseDeathCause } from "@/server/db/schema/profile/demographics/ward-wise-death-cause";
import { eq, and, sql } from "drizzle-orm";
import {
  wardWiseDeathCauseSchema,
  wardWiseDeathCauseFilterSchema,
  updateWardWiseDeathCauseSchema,
  DeathCauseTypeEnum,
} from "./ward-wise-death-cause.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise death cause data with optional filtering
export const getAllWardWiseDeathCause = publicProcedure
  .input(wardWiseDeathCauseFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseDeathCause);

        let conditions = [];

        if (input?.wardNumber !== undefined) {
          conditions.push(
            eq(wardWiseDeathCause.wardNumber, input.wardNumber),
          );
        }

        if (input?.deathCause) {
          conditions.push(
            eq(wardWiseDeathCause.deathCause, input.deathCause),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and death cause
        data = await queryWithFilters.orderBy(
          wardWiseDeathCause.wardNumber,
          wardWiseDeathCause.deathCause,
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
            death_cause,
            population
          FROM 
            acme_ward_wise_death_cause
          ORDER BY 
            ward_number, death_cause
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            deathCause: row.death_cause,
            population: parseInt(String(row.population || "0")),
          }));

          // Apply filters if needed
          if (input?.wardNumber !== undefined) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.deathCause) {
            data = data.filter((item) => item.deathCause === input.deathCause);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise death cause data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseDeathCauseByWard = publicProcedure
  .input(z.object({ wardNumber: z.number().int() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseDeathCause)
      .where(eq(wardWiseDeathCause.wardNumber, input.wardNumber))
      .orderBy(wardWiseDeathCause.deathCause);

    return data;
  });

// Create a new ward-wise death cause entry
export const createWardWiseDeathCause = protectedProcedure
  .input(wardWiseDeathCauseSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise death cause data",
      });
    }

    // Check if entry already exists for this ward and death cause type
    const existing = await ctx.db
      .select({ id: wardWiseDeathCause.id })
      .from(wardWiseDeathCause)
      .where(
        and(
          eq(wardWiseDeathCause.wardNumber, input.wardNumber),
          eq(wardWiseDeathCause.deathCause, input.deathCause),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and death cause ${input.deathCause} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseDeathCause).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      deathCause: input.deathCause,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward-wise death cause entry
export const updateWardWiseDeathCause = protectedProcedure
  .input(updateWardWiseDeathCauseSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise death cause data",
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
      .select({ id: wardWiseDeathCause.id })
      .from(wardWiseDeathCause)
      .where(eq(wardWiseDeathCause.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseDeathCause)
      .set({
        wardNumber: input.wardNumber,
        deathCause: input.deathCause,
        population: input.population,
      })
      .where(eq(wardWiseDeathCause.id, input.id));

    return { success: true };
  });

// Delete a ward-wise death cause entry
export const deleteWardWiseDeathCause = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise death cause data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseDeathCause)
      .where(eq(wardWiseDeathCause.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseDeathCauseSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by death cause type across all wards
      const summarySql = sql`
        SELECT 
          death_cause, 
          SUM(population) as total_population
        FROM 
          acme_ward_wise_death_cause
        GROUP BY 
          death_cause
        ORDER BY 
          death_cause
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseDeathCauseSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise death cause summary",
      });
    }
  }
);

// Export the router with all procedures
export const wardWiseDeathCauseRouter = createTRPCRouter({
  getAll: getAllWardWiseDeathCause,
  getByWard: getWardWiseDeathCauseByWard,
  create: createWardWiseDeathCause,
  update: updateWardWiseDeathCause,
  delete: deleteWardWiseDeathCause,
  summary: getWardWiseDeathCauseSummary,
});
