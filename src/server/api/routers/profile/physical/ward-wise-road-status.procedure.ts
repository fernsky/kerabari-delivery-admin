import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseRoadStatus } from "@/server/db/schema/profile/physical/ward-wise-road-status";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseRoadStatusSchema,
  wardWiseRoadStatusFilterSchema,
  updateWardWiseRoadStatusSchema,
  RoadStatusTypeEnum,
} from "./ward-wise-road-status.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise road status data with optional filtering
export const getAllWardWiseRoadStatus = publicProcedure
  .input(wardWiseRoadStatusFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseRoadStatus);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(eq(wardWiseRoadStatus.wardNumber, input.wardNumber));
        }

        if (input?.roadStatus) {
          conditions.push(eq(wardWiseRoadStatus.roadStatus, input.roadStatus));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and road status type
        data = await queryWithFilters.orderBy(
          wardWiseRoadStatus.wardNumber,
          wardWiseRoadStatus.roadStatus,
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
            road_status,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_road_status
          ORDER BY 
            ward_number, road_status
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            roadStatus: row.road_status,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.roadStatus) {
            data = data.filter((item) => item.roadStatus === input.roadStatus);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise road status data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseRoadStatusByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseRoadStatus)
      .where(eq(wardWiseRoadStatus.wardNumber, input.wardNumber))
      .orderBy(wardWiseRoadStatus.roadStatus);

    return data;
  });

// Create a new ward-wise road status entry
export const createWardWiseRoadStatus = protectedProcedure
  .input(wardWiseRoadStatusSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise road status data",
      });
    }

    // Check if entry already exists for this ward and road status type
    const existing = await ctx.db
      .select({ id: wardWiseRoadStatus.id })
      .from(wardWiseRoadStatus)
      .where(
        and(
          eq(wardWiseRoadStatus.wardNumber, input.wardNumber),
          eq(wardWiseRoadStatus.roadStatus, input.roadStatus),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and road status ${input.roadStatus} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseRoadStatus).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      roadStatus: input.roadStatus,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise road status entry
export const updateWardWiseRoadStatus = protectedProcedure
  .input(updateWardWiseRoadStatusSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise road status data",
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
      .select({ id: wardWiseRoadStatus.id })
      .from(wardWiseRoadStatus)
      .where(eq(wardWiseRoadStatus.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseRoadStatus)
      .set({
        wardNumber: input.wardNumber,
        roadStatus: input.roadStatus,
        households: input.households,
      })
      .where(eq(wardWiseRoadStatus.id, input.id));

    return { success: true };
  });

// Delete a ward-wise road status entry
export const deleteWardWiseRoadStatus = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise road status data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseRoadStatus)
      .where(eq(wardWiseRoadStatus.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseRoadStatusSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by road status type across all wards
      const summarySql = sql`
        SELECT 
          road_status, 
          SUM(households) as total_households
        FROM 
          ward_wise_road_status
        GROUP BY 
          road_status
        ORDER BY 
          road_status
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseRoadStatusSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise road status summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseRoadStatusRouter = createTRPCRouter({
  getAll: getAllWardWiseRoadStatus,
  getByWard: getWardWiseRoadStatusByWard,
  create: createWardWiseRoadStatus,
  update: updateWardWiseRoadStatus,
  delete: deleteWardWiseRoadStatus,
  summary: getWardWiseRoadStatusSummary,
});
