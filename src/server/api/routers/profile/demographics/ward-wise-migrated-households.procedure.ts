import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseMigratedHouseholds } from "@/server/db/schema/profile/demographics/ward-wise-migrated-households";
import { eq, and, sql } from "drizzle-orm";
import {
  wardWiseMigratedHouseholdsSchema,
  wardWiseMigratedHouseholdsFilterSchema,
  updateWardWiseMigratedHouseholdsSchema,
  MigratedFromEnum,
} from "./ward-wise-migrated-households.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise migrated households data with optional filtering
export const getAllWardWiseMigratedHouseholds = publicProcedure
  .input(wardWiseMigratedHouseholdsFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db
          .select()
          .from(wardWiseMigratedHouseholds);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(
              wardWiseMigratedHouseholds.wardNumber,
              input.wardNumber,
            ),
          );
        }

        if (input?.migratedFrom) {
          conditions.push(
            eq(
              wardWiseMigratedHouseholds.migratedFrom,
              input.migratedFrom,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and migrated from
        data = await queryWithFilters.orderBy(
          wardWiseMigratedHouseholds.wardNumber,
          wardWiseMigratedHouseholds.migratedFrom,
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
            migrated_from,
            households
          FROM 
            acme_ward_wise_migrated_households
          ORDER BY 
            ward_number, migrated_from
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            migratedFrom: row.migrated_from,
            households: parseInt(String(row.households || "0")),
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.migratedFrom) {
            data = data.filter((item) => item.migratedFrom === input.migratedFrom);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-wise migrated households data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseMigratedHouseholdsByWard = publicProcedure
  .input(z.object({ wardNumber: z.number().int().positive() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseMigratedHouseholds)
      .where(
        eq(
          wardWiseMigratedHouseholds.wardNumber,
          input.wardNumber,
        ),
      )
      .orderBy(
        wardWiseMigratedHouseholds.migratedFrom,
      );

    return data;
  });

// Create a new ward-wise migrated households entry
export const createWardWiseMigratedHouseholds = protectedProcedure
  .input(wardWiseMigratedHouseholdsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise migrated households data",
      });
    }

    // Check if entry already exists for this ward and migrated from
    const existing = await ctx.db
      .select({ id: wardWiseMigratedHouseholds.id })
      .from(wardWiseMigratedHouseholds)
      .where(
        and(
          eq(
            wardWiseMigratedHouseholds.wardNumber,
            input.wardNumber,
          ),
          eq(
            wardWiseMigratedHouseholds.migratedFrom,
            input.migratedFrom,
          ),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and migrated from ${input.migratedFrom} already exists`,
      });
    }

    // Create new record
    await ctx.db
      .insert(wardWiseMigratedHouseholds)
      .values({
        id: input.id || uuidv4(),
        wardNumber: input.wardNumber,
        migratedFrom: input.migratedFrom,
        households: input.households,
      });

    return { success: true };
  });

// Update an existing ward-wise migrated households entry
export const updateWardWiseMigratedHouseholds = protectedProcedure
  .input(updateWardWiseMigratedHouseholdsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise migrated households data",
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
      .select({ id: wardWiseMigratedHouseholds.id })
      .from(wardWiseMigratedHouseholds)
      .where(eq(wardWiseMigratedHouseholds.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseMigratedHouseholds)
      .set({
        wardNumber: input.wardNumber,
        migratedFrom: input.migratedFrom,
        households: input.households,
      })
      .where(eq(wardWiseMigratedHouseholds.id, input.id));

    return { success: true };
  });

// Delete a ward-wise migrated households entry
export const deleteWardWiseMigratedHouseholds = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise migrated households data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseMigratedHouseholds)
      .where(eq(wardWiseMigratedHouseholds.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseMigratedHouseholdsSummary = publicProcedure
  .query(async ({ ctx }) => {
    try {
      // Get total counts by migrated from across all wards
      const summarySql = sql`
        SELECT 
          migrated_from, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_migrated_households
        GROUP BY 
          migrated_from
        ORDER BY 
          migrated_from
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error(
        "Error in getWardWiseMigratedHouseholdsSummary:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise migrated households summary",
      });
    }
  });

// Export the router with all procedures
export const wardWiseMigratedHouseholdsRouter = createTRPCRouter({
  getAll: getAllWardWiseMigratedHouseholds,
  getByWard: getWardWiseMigratedHouseholdsByWard,
  create: createWardWiseMigratedHouseholds,
  update: updateWardWiseMigratedHouseholds,
  delete: deleteWardWiseMigratedHouseholds,
  summary: getWardWiseMigratedHouseholdsSummary,
});
