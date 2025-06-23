import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseTimeToActiveRoad } from "@/server/db/schema/profile/physical/ward-wise-time-to-active-road";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseTimeToActiveRoadSchema,
  wardWiseTimeToActiveRoadFilterSchema,
  updateWardWiseTimeToActiveRoadSchema,
  TimeToActiveRoadTypeEnum,
} from "./ward-wise-time-to-active-road.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise time to active road data with optional filtering
export const getAllWardWiseTimeToActiveRoad = publicProcedure
  .input(wardWiseTimeToActiveRoadFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseTimeToActiveRoad);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseTimeToActiveRoad.wardNumber, input.wardNumber),
          );
        }

        if (input?.timeToActiveRoad) {
          conditions.push(
            eq(
              wardWiseTimeToActiveRoad.timeToActiveRoad,
              input.timeToActiveRoad,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and time category
        data = await queryWithFilters.orderBy(
          wardWiseTimeToActiveRoad.wardNumber,
          wardWiseTimeToActiveRoad.timeToActiveRoad,
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
            time_to_active_road,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_time_to_active_road
          ORDER BY 
            ward_number, time_to_active_road
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            timeToActiveRoad: row.time_to_active_road,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.timeToActiveRoad) {
            data = data.filter(
              (item) => item.timeToActiveRoad === input.timeToActiveRoad,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-wise time to active road data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseTimeToActiveRoadByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseTimeToActiveRoad)
      .where(eq(wardWiseTimeToActiveRoad.wardNumber, input.wardNumber))
      .orderBy(wardWiseTimeToActiveRoad.timeToActiveRoad);

    return data;
  });

// Create a new ward-wise time to active road entry
export const createWardWiseTimeToActiveRoad = protectedProcedure
  .input(wardWiseTimeToActiveRoadSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise time to active road data",
      });
    }

    // Check if entry already exists for this ward and time category
    const existing = await ctx.db
      .select({ id: wardWiseTimeToActiveRoad.id })
      .from(wardWiseTimeToActiveRoad)
      .where(
        and(
          eq(wardWiseTimeToActiveRoad.wardNumber, input.wardNumber),
          eq(wardWiseTimeToActiveRoad.timeToActiveRoad, input.timeToActiveRoad),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and time category ${input.timeToActiveRoad} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseTimeToActiveRoad).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      timeToActiveRoad: input.timeToActiveRoad,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise time to active road entry
export const updateWardWiseTimeToActiveRoad = protectedProcedure
  .input(updateWardWiseTimeToActiveRoadSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise time to active road data",
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
      .select({ id: wardWiseTimeToActiveRoad.id })
      .from(wardWiseTimeToActiveRoad)
      .where(eq(wardWiseTimeToActiveRoad.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseTimeToActiveRoad)
      .set({
        wardNumber: input.wardNumber,
        timeToActiveRoad: input.timeToActiveRoad,
        households: input.households,
      })
      .where(eq(wardWiseTimeToActiveRoad.id, input.id));

    return { success: true };
  });

// Delete a ward-wise time to active road entry
export const deleteWardWiseTimeToActiveRoad = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise time to active road data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseTimeToActiveRoad)
      .where(eq(wardWiseTimeToActiveRoad.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseTimeToActiveRoadSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by time category across all wards
      const summarySql = sql`
        SELECT 
          time_to_active_road, 
          SUM(households) as total_households
        FROM 
          ward_wise_time_to_active_road
        GROUP BY 
          time_to_active_road
        ORDER BY 
          time_to_active_road
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseTimeToActiveRoadSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise time to active road summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseTimeToActiveRoadRouter = createTRPCRouter({
  getAll: getAllWardWiseTimeToActiveRoad,
  getByWard: getWardWiseTimeToActiveRoadByWard,
  create: createWardWiseTimeToActiveRoad,
  update: updateWardWiseTimeToActiveRoad,
  delete: deleteWardWiseTimeToActiveRoad,
  summary: getWardWiseTimeToActiveRoadSummary,
});
