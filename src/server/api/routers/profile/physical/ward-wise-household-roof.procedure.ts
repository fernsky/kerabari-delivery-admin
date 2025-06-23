import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseHouseholdRoof } from "@/server/db/schema/profile/physical/ward-wise-household-roof";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseHouseholdRoofSchema,
  wardWiseHouseholdRoofFilterSchema,
  updateWardWiseHouseholdRoofSchema,
  RoofTypeEnum,
} from "./ward-wise-household-roof.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise household roof data with optional filtering
export const getAllWardWiseHouseholdRoof = publicProcedure
  .input(wardWiseHouseholdRoofFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseHouseholdRoof);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseHouseholdRoof.wardNumber, input.wardNumber),
          );
        }

        if (input?.roofType) {
          conditions.push(eq(wardWiseHouseholdRoof.roofType, input.roofType));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and roof type
        data = await queryWithFilters.orderBy(
          wardWiseHouseholdRoof.wardNumber,
          wardWiseHouseholdRoof.roofType,
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
            roof_type,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_household_roof
          ORDER BY 
            ward_number, roof_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            roofType: row.roof_type,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.roofType) {
            data = data.filter((item) => item.roofType === input.roofType);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise household roof data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseHouseholdRoofByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseHouseholdRoof)
      .where(eq(wardWiseHouseholdRoof.wardNumber, input.wardNumber))
      .orderBy(wardWiseHouseholdRoof.roofType);

    return data;
  });

// Create a new ward-wise household roof entry
export const createWardWiseHouseholdRoof = protectedProcedure
  .input(wardWiseHouseholdRoofSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise household roof data",
      });
    }

    // Check if entry already exists for this ward and roof type
    const existing = await ctx.db
      .select({ id: wardWiseHouseholdRoof.id })
      .from(wardWiseHouseholdRoof)
      .where(
        and(
          eq(wardWiseHouseholdRoof.wardNumber, input.wardNumber),
          eq(wardWiseHouseholdRoof.roofType, input.roofType),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and roof type ${input.roofType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseHouseholdRoof).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      roofType: input.roofType,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise household roof entry
export const updateWardWiseHouseholdRoof = protectedProcedure
  .input(updateWardWiseHouseholdRoofSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise household roof data",
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
      .select({ id: wardWiseHouseholdRoof.id })
      .from(wardWiseHouseholdRoof)
      .where(eq(wardWiseHouseholdRoof.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseHouseholdRoof)
      .set({
        wardNumber: input.wardNumber,
        roofType: input.roofType,
        households: input.households,
      })
      .where(eq(wardWiseHouseholdRoof.id, input.id));

    return { success: true };
  });

// Delete a ward-wise household roof entry
export const deleteWardWiseHouseholdRoof = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise household roof data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseHouseholdRoof)
      .where(eq(wardWiseHouseholdRoof.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseHouseholdRoofSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by roof type across all wards
      const summarySql = sql`
        SELECT 
          roof_type, 
          SUM(households) as total_households
        FROM 
          ward_wise_household_roof
        GROUP BY 
          roof_type
        ORDER BY 
          roof_type
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseHouseholdRoofSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise household roof summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseHouseholdRoofRouter = createTRPCRouter({
  getAll: getAllWardWiseHouseholdRoof,
  getByWard: getWardWiseHouseholdRoofByWard,
  create: createWardWiseHouseholdRoof,
  update: updateWardWiseHouseholdRoof,
  delete: deleteWardWiseHouseholdRoof,
  summary: getWardWiseHouseholdRoofSummary,
});
