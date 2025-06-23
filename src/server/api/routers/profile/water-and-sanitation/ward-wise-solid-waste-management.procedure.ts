import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseSolidWasteManagement } from "@/server/db/schema/profile/water-and-sanitation/ward-wise-solid-waste-management";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseSolidWasteManagementSchema,
  wardWiseSolidWasteManagementFilterSchema,
  updateWardWiseSolidWasteManagementSchema,
  SolidWasteManagementTypeEnum,
} from "./ward-wise-solid-waste-management.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise solid waste management data with optional filtering
export const getAllWardWiseSolidWasteManagement = publicProcedure
  .input(wardWiseSolidWasteManagementFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseSolidWasteManagement);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseSolidWasteManagement.wardNumber, input.wardNumber),
          );
        }

        if (input?.solidWasteManagement) {
          conditions.push(
            eq(
              wardWiseSolidWasteManagement.solidWasteManagement,
              input.solidWasteManagement,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and waste management type
        data = await queryWithFilters.orderBy(
          wardWiseSolidWasteManagement.wardNumber,
          wardWiseSolidWasteManagement.solidWasteManagement,
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
            solid_waste_management,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_solid_waste_management
          ORDER BY 
            ward_number, solid_waste_management
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            solidWasteManagement: row.solid_waste_management,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.solidWasteManagement) {
            data = data.filter(
              (item) =>
                item.solidWasteManagement === input.solidWasteManagement,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-wise solid waste management data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseSolidWasteManagementByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseSolidWasteManagement)
      .where(eq(wardWiseSolidWasteManagement.wardNumber, input.wardNumber))
      .orderBy(wardWiseSolidWasteManagement.solidWasteManagement);

    return data;
  });

// Create a new ward-wise solid waste management entry
export const createWardWiseSolidWasteManagement = protectedProcedure
  .input(wardWiseSolidWasteManagementSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise solid waste management data",
      });
    }

    // Check if entry already exists for this ward and waste management method
    const existing = await ctx.db
      .select({ id: wardWiseSolidWasteManagement.id })
      .from(wardWiseSolidWasteManagement)
      .where(
        and(
          eq(wardWiseSolidWasteManagement.wardNumber, input.wardNumber),
          eq(
            wardWiseSolidWasteManagement.solidWasteManagement,
            input.solidWasteManagement,
          ),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and waste management method ${input.solidWasteManagement} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseSolidWasteManagement).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      solidWasteManagement: input.solidWasteManagement,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise solid waste management entry
export const updateWardWiseSolidWasteManagement = protectedProcedure
  .input(updateWardWiseSolidWasteManagementSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise solid waste management data",
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
      .select({ id: wardWiseSolidWasteManagement.id })
      .from(wardWiseSolidWasteManagement)
      .where(eq(wardWiseSolidWasteManagement.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseSolidWasteManagement)
      .set({
        wardNumber: input.wardNumber,
        solidWasteManagement: input.solidWasteManagement,
        households: input.households,
      })
      .where(eq(wardWiseSolidWasteManagement.id, input.id));

    return { success: true };
  });

// Delete a ward-wise solid waste management entry
export const deleteWardWiseSolidWasteManagement = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise solid waste management data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseSolidWasteManagement)
      .where(eq(wardWiseSolidWasteManagement.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseSolidWasteManagementSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by waste management method across all wards
      const summarySql = sql`
        SELECT 
          solid_waste_management, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_solid_waste_management
        GROUP BY 
          acme_solid_waste_management
        ORDER BY 
          solid_waste_management
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseSolidWasteManagementSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise solid waste management summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseSolidWasteManagementRouter = createTRPCRouter({
  getAll: getAllWardWiseSolidWasteManagement,
  getByWard: getWardWiseSolidWasteManagementByWard,
  create: createWardWiseSolidWasteManagement,
  update: updateWardWiseSolidWasteManagement,
  delete: deleteWardWiseSolidWasteManagement,
  summary: getWardWiseSolidWasteManagementSummary,
});
