import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseTimeToMarketCenter } from "@/server/db/schema/profile/physical/ward-wise-time-to-market-center";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseTimeToMarketCenterSchema,
  wardWiseTimeToMarketCenterFilterSchema,
  updateWardWiseTimeToMarketCenterSchema,
  TimeToMarketCenterTypeEnum,
} from "./ward-wise-time-to-market-center.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise time to market center data with optional filtering
export const getAllWardWiseTimeToMarketCenter = publicProcedure
  .input(wardWiseTimeToMarketCenterFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseTimeToMarketCenter);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseTimeToMarketCenter.wardNumber, input.wardNumber),
          );
        }

        if (input?.timeToMarketCenter) {
          conditions.push(
            eq(
              wardWiseTimeToMarketCenter.timeToMarketCenter,
              input.timeToMarketCenter,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and time category
        data = await queryWithFilters.orderBy(
          wardWiseTimeToMarketCenter.wardNumber,
          wardWiseTimeToMarketCenter.timeToMarketCenter,
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
            time_to_market_center,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_time_to_market_center
          ORDER BY 
            ward_number, time_to_market_center
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            timeToMarketCenter: row.time_to_market_center,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.timeToMarketCenter) {
            data = data.filter(
              (item) => item.timeToMarketCenter === input.timeToMarketCenter,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-wise time to market center data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseTimeToMarketCenterByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseTimeToMarketCenter)
      .where(eq(wardWiseTimeToMarketCenter.wardNumber, input.wardNumber))
      .orderBy(wardWiseTimeToMarketCenter.timeToMarketCenter);

    return data;
  });

// Create a new ward-wise time to market center entry
export const createWardWiseTimeToMarketCenter = protectedProcedure
  .input(wardWiseTimeToMarketCenterSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise time to market center data",
      });
    }

    // Check if entry already exists for this ward and time category
    const existing = await ctx.db
      .select({ id: wardWiseTimeToMarketCenter.id })
      .from(wardWiseTimeToMarketCenter)
      .where(
        and(
          eq(wardWiseTimeToMarketCenter.wardNumber, input.wardNumber),
          eq(
            wardWiseTimeToMarketCenter.timeToMarketCenter,
            input.timeToMarketCenter,
          ),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and time category ${input.timeToMarketCenter} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseTimeToMarketCenter).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      timeToMarketCenter: input.timeToMarketCenter,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise time to market center entry
export const updateWardWiseTimeToMarketCenter = protectedProcedure
  .input(updateWardWiseTimeToMarketCenterSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise time to market center data",
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
      .select({ id: wardWiseTimeToMarketCenter.id })
      .from(wardWiseTimeToMarketCenter)
      .where(eq(wardWiseTimeToMarketCenter.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseTimeToMarketCenter)
      .set({
        wardNumber: input.wardNumber,
        timeToMarketCenter: input.timeToMarketCenter,
        households: input.households,
      })
      .where(eq(wardWiseTimeToMarketCenter.id, input.id));

    return { success: true };
  });

// Delete a ward-wise time to market center entry
export const deleteWardWiseTimeToMarketCenter = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise time to market center data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseTimeToMarketCenter)
      .where(eq(wardWiseTimeToMarketCenter.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseTimeToMarketCenterSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by time category across all wards
      const summarySql = sql`
        SELECT 
          time_to_market_center, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_time_to_market_center
        GROUP BY 
          time_to_market_center
        ORDER BY 
          time_to_market_center
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseTimeToMarketCenterSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise time to market center summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseTimeToMarketCenterRouter = createTRPCRouter({
  getAll: getAllWardWiseTimeToMarketCenter,
  getByWard: getWardWiseTimeToMarketCenterByWard,
  create: createWardWiseTimeToMarketCenter,
  update: updateWardWiseTimeToMarketCenter,
  delete: deleteWardWiseTimeToMarketCenter,
  summary: getWardWiseTimeToMarketCenterSummary,
});
