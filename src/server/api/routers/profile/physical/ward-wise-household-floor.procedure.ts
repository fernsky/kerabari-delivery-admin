import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseHouseholdFloor } from "@/server/db/schema/profile/physical/ward-wise-household-floor";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseHouseholdFloorSchema,
  wardWiseHouseholdFloorFilterSchema,
  updateWardWiseHouseholdFloorSchema,
  FloorTypeEnum,
} from "./ward-wise-household-floor.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise household floor data with optional filtering
export const getAllWardWiseHouseholdFloor = publicProcedure
  .input(wardWiseHouseholdFloorFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseHouseholdFloor);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseHouseholdFloor.wardNumber, input.wardNumber),
          );
        }

        if (input?.floorType) {
          conditions.push(
            eq(wardWiseHouseholdFloor.floorType, input.floorType),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and floor type
        data = await queryWithFilters.orderBy(
          wardWiseHouseholdFloor.wardNumber,
          wardWiseHouseholdFloor.floorType,
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
            floor_type,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_household_floor
          ORDER BY 
            ward_number, floor_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            floorType: row.floor_type,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.floorType) {
            data = data.filter((item) => item.floorType === input.floorType);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise household floor data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseHouseholdFloorByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseHouseholdFloor)
      .where(eq(wardWiseHouseholdFloor.wardNumber, input.wardNumber))
      .orderBy(wardWiseHouseholdFloor.floorType);

    return data;
  });

// Create a new ward-wise household floor entry
export const createWardWiseHouseholdFloor = protectedProcedure
  .input(wardWiseHouseholdFloorSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise household floor data",
      });
    }

    // Check if entry already exists for this ward and floor type
    const existing = await ctx.db
      .select({ id: wardWiseHouseholdFloor.id })
      .from(wardWiseHouseholdFloor)
      .where(
        and(
          eq(wardWiseHouseholdFloor.wardNumber, input.wardNumber),
          eq(wardWiseHouseholdFloor.floorType, input.floorType),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and floor type ${input.floorType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseHouseholdFloor).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      floorType: input.floorType,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise household floor entry
export const updateWardWiseHouseholdFloor = protectedProcedure
  .input(updateWardWiseHouseholdFloorSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise household floor data",
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
      .select({ id: wardWiseHouseholdFloor.id })
      .from(wardWiseHouseholdFloor)
      .where(eq(wardWiseHouseholdFloor.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseHouseholdFloor)
      .set({
        wardNumber: input.wardNumber,
        floorType: input.floorType,
        households: input.households,
      })
      .where(eq(wardWiseHouseholdFloor.id, input.id));

    return { success: true };
  });

// Delete a ward-wise household floor entry
export const deleteWardWiseHouseholdFloor = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise household floor data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseHouseholdFloor)
      .where(eq(wardWiseHouseholdFloor.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseHouseholdFloorSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by floor type across all wards
      const summarySql = sql`
        SELECT 
          floor_type, 
          SUM(households) as total_households
        FROM 
          ward_wise_household_floor
        GROUP BY 
          floor_type
        ORDER BY 
          floor_type
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseHouseholdFloorSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise household floor summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseHouseholdFloorRouter = createTRPCRouter({
  getAll: getAllWardWiseHouseholdFloor,
  getByWard: getWardWiseHouseholdFloorByWard,
  create: createWardWiseHouseholdFloor,
  update: updateWardWiseHouseholdFloor,
  delete: deleteWardWiseHouseholdFloor,
  summary: getWardWiseHouseholdFloorSummary,
});
