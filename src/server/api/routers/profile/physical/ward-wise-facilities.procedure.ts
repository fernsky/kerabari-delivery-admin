import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseFacilities } from "@/server/db/schema/profile/physical/ward-wise-facilities";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseFacilitiesSchema,
  wardWiseFacilitiesFilterSchema,
  updateWardWiseFacilitiesSchema,
  FacilityTypeEnum,
} from "./ward-wise-facilities.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise facilities data with optional filtering
export const getAllWardWiseFacilities = publicProcedure
  .input(wardWiseFacilitiesFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseFacilities);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(eq(wardWiseFacilities.wardNumber, input.wardNumber));
        }

        if (input?.facility) {
          conditions.push(eq(wardWiseFacilities.facility, input.facility));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and facility type
        data = await queryWithFilters.orderBy(
          wardWiseFacilities.wardNumber,
          wardWiseFacilities.facility,
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
            facility,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_facilities
          ORDER BY 
            ward_number, facility
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            facility: row.facility,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.facility) {
            data = data.filter((item) => item.facility === input.facility);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise facilities data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseFacilitiesByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseFacilities)
      .where(eq(wardWiseFacilities.wardNumber, input.wardNumber))
      .orderBy(wardWiseFacilities.facility);

    return data;
  });

// Create a new ward-wise facilities entry
export const createWardWiseFacilities = protectedProcedure
  .input(wardWiseFacilitiesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise facilities data",
      });
    }

    // Check if entry already exists for this ward and facility type
    const existing = await ctx.db
      .select({ id: wardWiseFacilities.id })
      .from(wardWiseFacilities)
      .where(
        and(
          eq(wardWiseFacilities.wardNumber, input.wardNumber),
          eq(wardWiseFacilities.facility, input.facility),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and facility ${input.facility} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseFacilities).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      facility: input.facility,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise facilities entry
export const updateWardWiseFacilities = protectedProcedure
  .input(updateWardWiseFacilitiesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise facilities data",
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
      .select({ id: wardWiseFacilities.id })
      .from(wardWiseFacilities)
      .where(eq(wardWiseFacilities.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseFacilities)
      .set({
        wardNumber: input.wardNumber,
        facility: input.facility,
        households: input.households,
      })
      .where(eq(wardWiseFacilities.id, input.id));

    return { success: true };
  });

// Delete a ward-wise facilities entry
export const deleteWardWiseFacilities = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise facilities data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseFacilities)
      .where(eq(wardWiseFacilities.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseFacilitiesSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by facility type across all wards
      const summarySql = sql`
        SELECT 
          facility, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_facilities
        GROUP BY 
          facility
        ORDER BY 
          facility
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseFacilitiesSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise facilities summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseFacilitiesRouter = createTRPCRouter({
  getAll: getAllWardWiseFacilities,
  getByWard: getWardWiseFacilitiesByWard,
  create: createWardWiseFacilities,
  update: updateWardWiseFacilities,
  delete: deleteWardWiseFacilities,
  summary: getWardWiseFacilitiesSummary,
});
