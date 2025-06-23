import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseHealthInsuredHouseholds } from "@/server/db/schema/profile/health/ward-wise-health-insured-households";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseHealthInsuredHouseholdsSchema,
  wardWiseHealthInsuredHouseholdsFilterSchema,
  updateWardWiseHealthInsuredHouseholdsSchema,
} from "./ward-wise-health-insured-households.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise health insured households data with optional filtering
export const getAllWardWiseHealthInsuredHouseholds = publicProcedure
  .input(wardWiseHealthInsuredHouseholdsFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseHealthInsuredHouseholds);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseHealthInsuredHouseholds.wardNumber, input.wardNumber),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number
        data = await queryWithFilters.orderBy(
          wardWiseHealthInsuredHouseholds.wardNumber,
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
            insured_households,
            non_insured_households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_health_insured_households
          ORDER BY 
            ward_number
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            insuredHouseholds: parseInt(String(row.insured_households || "0")),
            nonInsuredHouseholds: parseInt(String(row.non_insured_households || "0")),
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
        "Error fetching ward-wise health insured households data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseHealthInsuredHouseholdsByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseHealthInsuredHouseholds)
      .where(eq(wardWiseHealthInsuredHouseholds.wardNumber, input.wardNumber))
      .limit(1);

    return data.length > 0 ? data[0] : null;
  });

// Create a new ward-wise health insured households entry
export const createWardWiseHealthInsuredHouseholds = protectedProcedure
  .input(wardWiseHealthInsuredHouseholdsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise health insured households data",
      });
    }

    // Check if entry already exists for this ward
    const existing = await ctx.db
      .select({ id: wardWiseHealthInsuredHouseholds.id })
      .from(wardWiseHealthInsuredHouseholds)
      .where(eq(wardWiseHealthInsuredHouseholds.wardNumber, input.wardNumber))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseHealthInsuredHouseholds).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      insuredHouseholds: input.insuredHouseholds,
      nonInsuredHouseholds: input.nonInsuredHouseholds,
    });

    return { success: true };
  });

// Update an existing ward-wise health insured households entry
export const updateWardWiseHealthInsuredHouseholds = protectedProcedure
  .input(updateWardWiseHealthInsuredHouseholdsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise health insured households data",
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
      .select({ id: wardWiseHealthInsuredHouseholds.id })
      .from(wardWiseHealthInsuredHouseholds)
      .where(eq(wardWiseHealthInsuredHouseholds.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseHealthInsuredHouseholds)
      .set({
        wardNumber: input.wardNumber,
        insuredHouseholds: input.insuredHouseholds,
        nonInsuredHouseholds: input.nonInsuredHouseholds,
      })
      .where(eq(wardWiseHealthInsuredHouseholds.id, input.id));

    return { success: true };
  });

// Delete a ward-wise health insured households entry
export const deleteWardWiseHealthInsuredHouseholds = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise health insured households data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseHealthInsuredHouseholds)
      .where(eq(wardWiseHealthInsuredHouseholds.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseHealthInsuredHouseholdsSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total insured households across all wards
      const summarySql = sql`
        SELECT 
          SUM(insured_households) as total_insured_households,
          SUM(non_insured_households) as total_non_insured_households,
          SUM(insured_households) + SUM(non_insured_households) as total_households
        FROM 
          acme_ward_wise_health_insured_households
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error(
        "Error in getWardWiseHealthInsuredHouseholdsSummary:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Failed to retrieve ward-wise health insured households summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseHealthInsuredHouseholdsRouter = createTRPCRouter({
  getAll: getAllWardWiseHealthInsuredHouseholds,
  getByWard: getWardWiseHealthInsuredHouseholdsByWard,
  create: createWardWiseHealthInsuredHouseholds,
  update: updateWardWiseHealthInsuredHouseholds,
  delete: deleteWardWiseHealthInsuredHouseholds,
  summary: getWardWiseHealthInsuredHouseholdsSummary,
});
