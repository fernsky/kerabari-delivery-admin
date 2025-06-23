import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseHouseholdOuterWall } from "@/server/db/schema/profile/economics/ward-wise-household-outer-wall";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseHouseholdOuterWallSchema,
  wardWiseHouseholdOuterWallFilterSchema,
  updateWardWiseHouseholdOuterWallSchema,
  OuterWallTypeEnum,
} from "./ward-wise-household-outer-wall.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise household outer wall data with optional filtering
export const getAllWardWiseHouseholdOuterWall = publicProcedure
  .input(wardWiseHouseholdOuterWallFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseHouseholdOuterWall);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseHouseholdOuterWall.wardNumber, input.wardNumber),
          );
        }

        if (input?.wallType) {
          conditions.push(
            eq(wardWiseHouseholdOuterWall.wallType, input.wallType),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and wall type
        data = await queryWithFilters.orderBy(
          wardWiseHouseholdOuterWall.wardNumber,
          wardWiseHouseholdOuterWall.wallType,
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
            wall_type,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_household_outer_wall
          ORDER BY 
            ward_number, wall_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            wallType: row.wall_type,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.wallType) {
            data = data.filter((item) => item.wallType === input.wallType);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-wise household outer wall data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseHouseholdOuterWallByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseHouseholdOuterWall)
      .where(eq(wardWiseHouseholdOuterWall.wardNumber, input.wardNumber))
      .orderBy(wardWiseHouseholdOuterWall.wallType);

    return data;
  });

// Create a new ward-wise household outer wall entry
export const createWardWiseHouseholdOuterWall = protectedProcedure
  .input(wardWiseHouseholdOuterWallSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise household outer wall data",
      });
    }

    // Check if entry already exists for this ward and wall type
    const existing = await ctx.db
      .select({ id: wardWiseHouseholdOuterWall.id })
      .from(wardWiseHouseholdOuterWall)
      .where(
        and(
          eq(wardWiseHouseholdOuterWall.wardNumber, input.wardNumber),
          eq(wardWiseHouseholdOuterWall.wallType, input.wallType),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and wall type ${input.wallType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseHouseholdOuterWall).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      wallType: input.wallType,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise household outer wall entry
export const updateWardWiseHouseholdOuterWall = protectedProcedure
  .input(updateWardWiseHouseholdOuterWallSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise household outer wall data",
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
      .select({ id: wardWiseHouseholdOuterWall.id })
      .from(wardWiseHouseholdOuterWall)
      .where(eq(wardWiseHouseholdOuterWall.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseHouseholdOuterWall)
      .set({
        wardNumber: input.wardNumber,
        wallType: input.wallType,
        households: input.households,
      })
      .where(eq(wardWiseHouseholdOuterWall.id, input.id));

    return { success: true };
  });

// Delete a ward-wise household outer wall entry
export const deleteWardWiseHouseholdOuterWall = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise household outer wall data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseHouseholdOuterWall)
      .where(eq(wardWiseHouseholdOuterWall.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseHouseholdOuterWallSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by wall type across all wards
      const summarySql = sql`
        SELECT 
          wall_type, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_household_outer_wall
        GROUP BY 
          wall_type
        ORDER BY 
          wall_type
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseHouseholdOuterWallSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise household outer wall summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseHouseholdOuterWallRouter = createTRPCRouter({
  getAll: getAllWardWiseHouseholdOuterWall,
  getByWard: getWardWiseHouseholdOuterWallByWard,
  create: createWardWiseHouseholdOuterWall,
  update: updateWardWiseHouseholdOuterWall,
  delete: deleteWardWiseHouseholdOuterWall,
  summary: getWardWiseHouseholdOuterWallSummary,
});
