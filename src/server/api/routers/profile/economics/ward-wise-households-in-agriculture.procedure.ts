import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseHouseholdsInAgriculture } from "@/server/db/schema/profile/economics/ward-wise-households-in-agriculture";
import { eq, and, sql } from "drizzle-orm";
import {
  wardWiseHouseholdsInAgricultureSchema,
  wardWiseHouseholdsInAgricultureFilterSchema,
  updateWardWiseHouseholdsInAgricultureSchema,
} from "./ward-wise-households-in-agriculture.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise households in agriculture data with optional filtering
export const getAllWardWiseHouseholdsInAgriculture = publicProcedure
  .input(wardWiseHouseholdsInAgricultureFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseHouseholdsInAgriculture);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseHouseholdsInAgriculture.wardNumber, input.wardNumber),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number
        data = await queryWithFilters.orderBy(
          wardWiseHouseholdsInAgriculture.wardNumber,
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
            involved_in_agriculture,
            non_involved_in_agriculture,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_households_in_agriculture
          ORDER BY 
            ward_number
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            involvedInAgriculture: parseInt(String(row.involved_in_agriculture || "0")),
            nonInvolvedInAgriculture: parseInt(String(row.non_involved_in_agriculture || "0")),
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
      console.error("Error fetching ward-wise households in agriculture data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseHouseholdsInAgricultureByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseHouseholdsInAgriculture)
      .where(eq(wardWiseHouseholdsInAgriculture.wardNumber, input.wardNumber));

    return data;
  });

// Create a new ward-wise households in agriculture entry
export const createWardWiseHouseholdsInAgriculture = protectedProcedure
  .input(wardWiseHouseholdsInAgricultureSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise households in agriculture data",
      });
    }

    // Check if entry already exists for this ward
    const existing = await ctx.db
      .select({ id: wardWiseHouseholdsInAgriculture.id })
      .from(wardWiseHouseholdsInAgriculture)
      .where(eq(wardWiseHouseholdsInAgriculture.wardNumber, input.wardNumber))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseHouseholdsInAgriculture).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      involvedInAgriculture: input.involvedInAgriculture,
      nonInvolvedInAgriculture: input.nonInvolvedInAgriculture,
    });

    return { success: true };
  });

// Update an existing ward-wise households in agriculture entry
export const updateWardWiseHouseholdsInAgriculture = protectedProcedure
  .input(updateWardWiseHouseholdsInAgricultureSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise households in agriculture data",
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
      .select({ id: wardWiseHouseholdsInAgriculture.id })
      .from(wardWiseHouseholdsInAgriculture)
      .where(eq(wardWiseHouseholdsInAgriculture.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseHouseholdsInAgriculture)
      .set({
        wardNumber: input.wardNumber,
        involvedInAgriculture: input.involvedInAgriculture,
        nonInvolvedInAgriculture: input.nonInvolvedInAgriculture,
      })
      .where(eq(wardWiseHouseholdsInAgriculture.id, input.id));

    return { success: true };
  });

// Delete a ward-wise households in agriculture entry
export const deleteWardWiseHouseholdsInAgriculture = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise households in agriculture data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseHouseholdsInAgriculture)
      .where(eq(wardWiseHouseholdsInAgriculture.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseHouseholdsInAgricultureSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts across all wards
      const summarySql = sql`
        SELECT 
          SUM(involved_in_agriculture) as total_involved,
          SUM(non_involved_in_agriculture) as total_non_involved,
          SUM(involved_in_agriculture + non_involved_in_agriculture) as total_households
        FROM 
          acme_ward_wise_households_in_agriculture
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseHouseholdsInAgricultureSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise households in agriculture summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseHouseholdsInAgricultureRouter = createTRPCRouter({
  getAll: getAllWardWiseHouseholdsInAgriculture,
  getByWard: getWardWiseHouseholdsInAgricultureByWard,
  create: createWardWiseHouseholdsInAgriculture,
  update: updateWardWiseHouseholdsInAgriculture,
  delete: deleteWardWiseHouseholdsInAgriculture,
  summary: getWardWiseHouseholdsInAgricultureSummary,
});
