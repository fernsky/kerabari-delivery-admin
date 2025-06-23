import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseLandOwnership } from "@/server/db/schema/profile/economics/ward-wise-land-ownership";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseLandOwnershipSchema,
  wardWiseLandOwnershipFilterSchema,
  updateWardWiseLandOwnershipSchema,
  LandOwnershipTypeEnum,
} from "./ward-wise-land-ownership.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise land ownership data with optional filtering
export const getAllWardWiseLandOwnership = publicProcedure
  .input(wardWiseLandOwnershipFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseLandOwnership);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseLandOwnership.wardNumber, input.wardNumber),
          );
        }

        if (input?.landOwnershipType) {
          conditions.push(eq(wardWiseLandOwnership.landOwnershipType, input.landOwnershipType));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and land ownership type
        data = await queryWithFilters.orderBy(
          wardWiseLandOwnership.wardNumber,
          wardWiseLandOwnership.landOwnershipType,
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
            land_ownership_type,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_land_ownership
          ORDER BY 
            ward_number, land_ownership_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            landOwnershipType: row.land_ownership_type,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.landOwnershipType) {
            data = data.filter((item) => item.landOwnershipType === input.landOwnershipType);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise land ownership data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseLandOwnershipByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseLandOwnership)
      .where(eq(wardWiseLandOwnership.wardNumber, input.wardNumber))
      .orderBy(wardWiseLandOwnership.landOwnershipType);

    return data;
  });

// Create a new ward-wise land ownership entry
export const createWardWiseLandOwnership = protectedProcedure
  .input(wardWiseLandOwnershipSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise land ownership data",
      });
    }

    // Check if entry already exists for this ward and land ownership type
    const existing = await ctx.db
      .select({ id: wardWiseLandOwnership.id })
      .from(wardWiseLandOwnership)
      .where(
        and(
          eq(wardWiseLandOwnership.wardNumber, input.wardNumber),
          eq(wardWiseLandOwnership.landOwnershipType, input.landOwnershipType),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and land ownership type ${input.landOwnershipType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseLandOwnership).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      landOwnershipType: input.landOwnershipType,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise land ownership entry
export const updateWardWiseLandOwnership = protectedProcedure
  .input(updateWardWiseLandOwnershipSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise land ownership data",
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
      .select({ id: wardWiseLandOwnership.id })
      .from(wardWiseLandOwnership)
      .where(eq(wardWiseLandOwnership.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseLandOwnership)
      .set({
        wardNumber: input.wardNumber,
        landOwnershipType: input.landOwnershipType,
        households: input.households,
      })
      .where(eq(wardWiseLandOwnership.id, input.id));

    return { success: true };
  });

// Delete a ward-wise land ownership entry
export const deleteWardWiseLandOwnership = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise land ownership data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseLandOwnership)
      .where(eq(wardWiseLandOwnership.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseLandOwnershipSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by land ownership type across all wards
      const summarySql = sql`
        SELECT 
          land_ownership_type, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_land_ownership
        GROUP BY 
          land_ownership_type
        ORDER BY 
          total_households DESC
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseLandOwnershipSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise land ownership summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseLandOwnershipRouter = createTRPCRouter({
  getAll: getAllWardWiseLandOwnership,
  getByWard: getWardWiseLandOwnershipByWard,
  create: createWardWiseLandOwnership,
  update: updateWardWiseLandOwnership,
  delete: deleteWardWiseLandOwnership,
  summary: getWardWiseLandOwnershipSummary,
});
