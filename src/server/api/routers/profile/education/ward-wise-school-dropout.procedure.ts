import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseSchoolDropout } from "@/server/db/schema/profile/education/ward-wise-school-dropout";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseSchoolDropoutSchema,
  wardWiseSchoolDropoutFilterSchema,
  updateWardWiseSchoolDropoutSchema,
  SchoolDropoutCauseTypeEnum,
} from "./ward-wise-school-dropout.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise school dropout data with optional filtering
export const getAllWardWiseSchoolDropout = publicProcedure
  .input(wardWiseSchoolDropoutFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseSchoolDropout);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseSchoolDropout.wardNumber, input.wardNumber),
          );
        }

        if (input?.cause) {
          conditions.push(eq(wardWiseSchoolDropout.cause, input.cause));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and cause
        data = await queryWithFilters.orderBy(
          wardWiseSchoolDropout.wardNumber,
          wardWiseSchoolDropout.cause,
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
            cause,
            population,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_school_dropout
          ORDER BY 
            ward_number, cause
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            cause: row.cause,
            population: parseInt(String(row.population || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.cause) {
            data = data.filter((item) => item.cause === input.cause);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise school dropout data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseSchoolDropoutByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseSchoolDropout)
      .where(eq(wardWiseSchoolDropout.wardNumber, input.wardNumber))
      .orderBy(wardWiseSchoolDropout.cause);

    return data;
  });

// Create a new ward-wise school dropout entry
export const createWardWiseSchoolDropout = protectedProcedure
  .input(wardWiseSchoolDropoutSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise school dropout data",
      });
    }

    // Check if entry already exists for this ward and cause
    const existing = await ctx.db
      .select({ id: wardWiseSchoolDropout.id })
      .from(wardWiseSchoolDropout)
      .where(
        and(
          eq(wardWiseSchoolDropout.wardNumber, input.wardNumber),
          eq(wardWiseSchoolDropout.cause, input.cause),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and cause ${input.cause} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseSchoolDropout).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      cause: input.cause,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward-wise school dropout entry
export const updateWardWiseSchoolDropout = protectedProcedure
  .input(updateWardWiseSchoolDropoutSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise school dropout data",
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
      .select({ id: wardWiseSchoolDropout.id })
      .from(wardWiseSchoolDropout)
      .where(eq(wardWiseSchoolDropout.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseSchoolDropout)
      .set({
        wardNumber: input.wardNumber,
        cause: input.cause,
        population: input.population,
      })
      .where(eq(wardWiseSchoolDropout.id, input.id));

    return { success: true };
  });

// Delete a ward-wise school dropout entry
export const deleteWardWiseSchoolDropout = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise school dropout data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseSchoolDropout)
      .where(eq(wardWiseSchoolDropout.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseSchoolDropoutSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by dropout cause across all wards
      const summarySql = sql`
        SELECT 
          cause, 
          SUM(population) as total_population
        FROM 
          acme_ward_wise_school_dropout
        GROUP BY 
          cause
        ORDER BY 
          cause
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseSchoolDropoutSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise school dropout summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseSchoolDropoutRouter = createTRPCRouter({
  getAll: getAllWardWiseSchoolDropout,
  getByWard: getWardWiseSchoolDropoutByWard,
  create: createWardWiseSchoolDropout,
  update: updateWardWiseSchoolDropout,
  delete: deleteWardWiseSchoolDropout,
  summary: getWardWiseSchoolDropoutSummary,
});
