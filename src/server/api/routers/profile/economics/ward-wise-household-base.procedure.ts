import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseHouseholdBase } from "@/server/db/schema/profile/economics/ward-wise-household-base";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseHouseholdBaseSchema,
  wardWiseHouseholdBaseFilterSchema,
  updateWardWiseHouseholdBaseSchema,
  HouseholdBaseTypeEnum,
} from "./ward-wise-household-base.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise household base data with optional filtering
export const getAllWardWiseHouseholdBase = publicProcedure
  .input(wardWiseHouseholdBaseFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseHouseholdBase);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseHouseholdBase.wardNumber, input.wardNumber),
          );
        }

        if (input?.baseType) {
          conditions.push(eq(wardWiseHouseholdBase.baseType, input.baseType));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and base type
        data = await queryWithFilters.orderBy(
          wardWiseHouseholdBase.wardNumber,
          wardWiseHouseholdBase.baseType,
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
            base_type,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_household_base
          ORDER BY 
            ward_number, base_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            baseType: row.base_type,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.baseType) {
            data = data.filter((item) => item.baseType === input.baseType);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise household base data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseHouseholdBaseByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseHouseholdBase)
      .where(eq(wardWiseHouseholdBase.wardNumber, input.wardNumber))
      .orderBy(wardWiseHouseholdBase.baseType);

    return data;
  });

// Create a new ward-wise household base entry
export const createWardWiseHouseholdBase = protectedProcedure
  .input(wardWiseHouseholdBaseSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise household base data",
      });
    }

    // Check if entry already exists for this ward and base type
    const existing = await ctx.db
      .select({ id: wardWiseHouseholdBase.id })
      .from(wardWiseHouseholdBase)
      .where(
        and(
          eq(wardWiseHouseholdBase.wardNumber, input.wardNumber),
          eq(wardWiseHouseholdBase.baseType, input.baseType),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and base type ${input.baseType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseHouseholdBase).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      baseType: input.baseType,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise household base entry
export const updateWardWiseHouseholdBase = protectedProcedure
  .input(updateWardWiseHouseholdBaseSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise household base data",
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
      .select({ id: wardWiseHouseholdBase.id })
      .from(wardWiseHouseholdBase)
      .where(eq(wardWiseHouseholdBase.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseHouseholdBase)
      .set({
        wardNumber: input.wardNumber,
        baseType: input.baseType,
        households: input.households,
      })
      .where(eq(wardWiseHouseholdBase.id, input.id));

    return { success: true };
  });

// Delete a ward-wise household base entry
export const deleteWardWiseHouseholdBase = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise household base data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseHouseholdBase)
      .where(eq(wardWiseHouseholdBase.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseHouseholdBaseSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by base type across all wards
      const summarySql = sql`
        SELECT 
          base_type, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_household_base
        GROUP BY 
          base_type
        ORDER BY 
          base_type
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseHouseholdBaseSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise household base summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseHouseholdBaseRouter = createTRPCRouter({
  getAll: getAllWardWiseHouseholdBase,
  getByWard: getWardWiseHouseholdBaseByWard,
  create: createWardWiseHouseholdBase,
  update: updateWardWiseHouseholdBase,
  delete: deleteWardWiseHouseholdBase,
  summary: getWardWiseHouseholdBaseSummary,
});
