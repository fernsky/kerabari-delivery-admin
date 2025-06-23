import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseHouseOwnership } from "@/server/db/schema/profile/economics/ward-wise-house-ownership";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseHouseOwnershipSchema,
  wardWiseHouseOwnershipFilterSchema,
  updateWardWiseHouseOwnershipSchema,
  HouseOwnershipTypeEnum,
} from "./ward-wise-house-ownership.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise house ownership data with optional filtering
export const getAllWardWiseHouseOwnership = publicProcedure
  .input(wardWiseHouseOwnershipFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseHouseOwnership);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseHouseOwnership.wardNumber, input.wardNumber),
          );
        }

        if (input?.ownershipType) {
          conditions.push(
            eq(wardWiseHouseOwnership.ownershipType, input.ownershipType),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and ownership type
        data = await queryWithFilters.orderBy(
          wardWiseHouseOwnership.wardNumber,
          wardWiseHouseOwnership.ownershipType,
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
            ownership_type,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_house_ownership
          ORDER BY 
            ward_number, ownership_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            ownershipType: row.ownership_type,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.ownershipType) {
            data = data.filter(
              (item) => item.ownershipType === input.ownershipType,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise house ownership data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseHouseOwnershipByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseHouseOwnership)
      .where(eq(wardWiseHouseOwnership.wardNumber, input.wardNumber))
      .orderBy(wardWiseHouseOwnership.ownershipType);

    return data;
  });

// Create a new ward-wise house ownership entry
export const createWardWiseHouseOwnership = protectedProcedure
  .input(wardWiseHouseOwnershipSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise house ownership data",
      });
    }

    // Check if entry already exists for this ward and ownership type
    const existing = await ctx.db
      .select({ id: wardWiseHouseOwnership.id })
      .from(wardWiseHouseOwnership)
      .where(
        and(
          eq(wardWiseHouseOwnership.wardNumber, input.wardNumber),
          eq(wardWiseHouseOwnership.ownershipType, input.ownershipType),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and ownership type ${input.ownershipType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseHouseOwnership).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      ownershipType: input.ownershipType,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise house ownership entry
export const updateWardWiseHouseOwnership = protectedProcedure
  .input(updateWardWiseHouseOwnershipSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise house ownership data",
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
      .select({ id: wardWiseHouseOwnership.id })
      .from(wardWiseHouseOwnership)
      .where(eq(wardWiseHouseOwnership.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseHouseOwnership)
      .set({
        wardNumber: input.wardNumber,
        ownershipType: input.ownershipType,
        households: input.households,
      })
      .where(eq(wardWiseHouseOwnership.id, input.id));

    return { success: true };
  });

// Delete a ward-wise house ownership entry
export const deleteWardWiseHouseOwnership = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise house ownership data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseHouseOwnership)
      .where(eq(wardWiseHouseOwnership.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseHouseOwnershipSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by ownership type across all wards
      const summarySql = sql`
        SELECT 
          ownership_type, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_house_ownership
        GROUP BY 
          ownership_type
        ORDER BY 
          ownership_type
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseHouseOwnershipSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise house ownership summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseHouseOwnershipRouter = createTRPCRouter({
  getAll: getAllWardWiseHouseOwnership,
  getByWard: getWardWiseHouseOwnershipByWard,
  create: createWardWiseHouseOwnership,
  update: updateWardWiseHouseOwnership,
  delete: deleteWardWiseHouseOwnership,
  summary: getWardWiseHouseOwnershipSummary,
});
