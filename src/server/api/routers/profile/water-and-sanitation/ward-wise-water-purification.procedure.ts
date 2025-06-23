import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseWaterPurification } from "@/server/db/schema/profile/water-and-sanitation/ward-wise-water-purification";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseWaterPurificationSchema,
  wardWiseWaterPurificationFilterSchema,
  updateWardWiseWaterPurificationSchema,
  WaterPurificationTypeEnum,
} from "./ward-wise-water-purification.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise water purification data with optional filtering
export const getAllWardWiseWaterPurification = publicProcedure
  .input(wardWiseWaterPurificationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseWaterPurification);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseWaterPurification.wardNumber, input.wardNumber),
          );
        }

        if (input?.waterPurification) {
          conditions.push(
            eq(
              wardWiseWaterPurification.waterPurification,
              input.waterPurification,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and water purification type
        data = await queryWithFilters.orderBy(
          wardWiseWaterPurification.wardNumber,
          wardWiseWaterPurification.waterPurification,
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
            water_purification,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_water_purification
          ORDER BY 
            ward_number, water_purification
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            waterPurification: row.water_purification,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.waterPurification) {
            data = data.filter(
              (item) => item.waterPurification === input.waterPurification,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise water purification data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseWaterPurificationByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseWaterPurification)
      .where(eq(wardWiseWaterPurification.wardNumber, input.wardNumber))
      .orderBy(wardWiseWaterPurification.waterPurification);

    return data;
  });

// Create a new ward-wise water purification entry
export const createWardWiseWaterPurification = protectedProcedure
  .input(wardWiseWaterPurificationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise water purification data",
      });
    }

    // Check if entry already exists for this ward and water purification method
    const existing = await ctx.db
      .select({ id: wardWiseWaterPurification.id })
      .from(wardWiseWaterPurification)
      .where(
        and(
          eq(wardWiseWaterPurification.wardNumber, input.wardNumber),
          eq(
            wardWiseWaterPurification.waterPurification,
            input.waterPurification,
          ),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and water purification method ${input.waterPurification} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseWaterPurification).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      waterPurification: input.waterPurification,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise water purification entry
export const updateWardWiseWaterPurification = protectedProcedure
  .input(updateWardWiseWaterPurificationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise water purification data",
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
      .select({ id: wardWiseWaterPurification.id })
      .from(wardWiseWaterPurification)
      .where(eq(wardWiseWaterPurification.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseWaterPurification)
      .set({
        wardNumber: input.wardNumber,
        waterPurification: input.waterPurification,
        households: input.households,
      })
      .where(eq(wardWiseWaterPurification.id, input.id));

    return { success: true };
  });

// Delete a ward-wise water purification entry
export const deleteWardWiseWaterPurification = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise water purification data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseWaterPurification)
      .where(eq(wardWiseWaterPurification.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseWaterPurificationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by water purification method across all wards
      const summarySql = sql`
        SELECT 
          water_purification, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_water_purification
        GROUP BY 
          water_purification
        ORDER BY 
          water_purification
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseWaterPurificationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise water purification summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseWaterPurificationRouter = createTRPCRouter({
  getAll: getAllWardWiseWaterPurification,
  getByWard: getWardWiseWaterPurificationByWard,
  create: createWardWiseWaterPurification,
  update: updateWardWiseWaterPurification,
  delete: deleteWardWiseWaterPurification,
  summary: getWardWiseWaterPurificationSummary,
});
