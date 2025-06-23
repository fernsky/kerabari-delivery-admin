import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseHouseMapPassed } from "@/server/db/schema/profile/physical/ward-wise-house-map-passed";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseHouseMapPassedSchema,
  wardWiseHouseMapPassedFilterSchema,
  updateWardWiseHouseMapPassedSchema,
  MapPassedStatusTypeEnum,
} from "./ward-wise-house-map-passed.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise house map passed data with optional filtering
export const getAllWardWiseHouseMapPassed = publicProcedure
  .input(wardWiseHouseMapPassedFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseHouseMapPassed);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseHouseMapPassed.wardNumber, input.wardNumber),
          );
        }

        if (input?.mapPassedStatus) {
          conditions.push(
            eq(wardWiseHouseMapPassed.mapPassedStatus, input.mapPassedStatus),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and map passed status
        data = await queryWithFilters.orderBy(
          wardWiseHouseMapPassed.wardNumber,
          wardWiseHouseMapPassed.mapPassedStatus,
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
            map_passed_status,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_house_map_passed
          ORDER BY 
            ward_number, map_passed_status
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            mapPassedStatus: row.map_passed_status,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.mapPassedStatus) {
            data = data.filter(
              (item) => item.mapPassedStatus === input.mapPassedStatus,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise house map passed data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseHouseMapPassedByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseHouseMapPassed)
      .where(eq(wardWiseHouseMapPassed.wardNumber, input.wardNumber))
      .orderBy(wardWiseHouseMapPassed.mapPassedStatus);

    return data;
  });

// Create a new ward-wise house map passed entry
export const createWardWiseHouseMapPassed = protectedProcedure
  .input(wardWiseHouseMapPassedSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise house map passed data",
      });
    }

    // Check if entry already exists for this ward and map passed status
    const existing = await ctx.db
      .select({ id: wardWiseHouseMapPassed.id })
      .from(wardWiseHouseMapPassed)
      .where(
        and(
          eq(wardWiseHouseMapPassed.wardNumber, input.wardNumber),
          eq(wardWiseHouseMapPassed.mapPassedStatus, input.mapPassedStatus),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and map passed status ${input.mapPassedStatus} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseHouseMapPassed).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      mapPassedStatus: input.mapPassedStatus,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise house map passed entry
export const updateWardWiseHouseMapPassed = protectedProcedure
  .input(updateWardWiseHouseMapPassedSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise house map passed data",
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
      .select({ id: wardWiseHouseMapPassed.id })
      .from(wardWiseHouseMapPassed)
      .where(eq(wardWiseHouseMapPassed.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseHouseMapPassed)
      .set({
        wardNumber: input.wardNumber,
        mapPassedStatus: input.mapPassedStatus,
        households: input.households,
      })
      .where(eq(wardWiseHouseMapPassed.id, input.id));

    return { success: true };
  });

// Delete a ward-wise house map passed entry
export const deleteWardWiseHouseMapPassed = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise house map passed data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseHouseMapPassed)
      .where(eq(wardWiseHouseMapPassed.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseHouseMapPassedSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by map passed status across all wards
      const summarySql = sql`
        SELECT 
          map_passed_status, 
          SUM(households) as total_households
        FROM 
          ward_wise_house_map_passed
        GROUP BY 
          map_passed_status
        ORDER BY 
          map_passed_status
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseHouseMapPassedSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise house map passed summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseHouseMapPassedRouter = createTRPCRouter({
  getAll: getAllWardWiseHouseMapPassed,
  getByWard: getWardWiseHouseMapPassedByWard,
  create: createWardWiseHouseMapPassed,
  update: updateWardWiseHouseMapPassed,
  delete: deleteWardWiseHouseMapPassed,
  summary: getWardWiseHouseMapPassedSummary,
});
