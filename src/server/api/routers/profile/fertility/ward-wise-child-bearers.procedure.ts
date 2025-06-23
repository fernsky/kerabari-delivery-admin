import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseChildBearers } from "@/server/db/schema/profile/fertility/ward-wise-child-bearers";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseChildBearersSchema,
  wardWiseChildBearersFilterSchema,
  updateWardWiseChildBearersSchema,
} from "./ward-wise-child-bearers.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise child bearers data with optional filtering
export const getAllWardWiseChildBearers = publicProcedure
  .input(wardWiseChildBearersFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseChildBearers);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseChildBearers.wardNumber, input.wardNumber),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number
        data = await queryWithFilters.orderBy(wardWiseChildBearers.wardNumber);
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
            age_15_to_49_child_bearers,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_child_bearers
          ORDER BY 
            ward_number
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            age15to49ChildBearers: parseInt(
              String(row.age_15_to_49_child_bearers || "0"),
            ),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise child bearers data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseChildBearersByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseChildBearers)
      .where(eq(wardWiseChildBearers.wardNumber, input.wardNumber))
      .limit(1);

    return data.length > 0 ? data[0] : null;
  });

// Create a new ward-wise child bearers entry
export const createWardWiseChildBearers = protectedProcedure
  .input(wardWiseChildBearersSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise child bearers data",
      });
    }

    // Check if entry already exists for this ward
    const existing = await ctx.db
      .select({ id: wardWiseChildBearers.id })
      .from(wardWiseChildBearers)
      .where(eq(wardWiseChildBearers.wardNumber, input.wardNumber))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseChildBearers).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      age15to49ChildBearers: input.age15to49ChildBearers,
    });

    return { success: true };
  });

// Update an existing ward-wise child bearers entry
export const updateWardWiseChildBearers = protectedProcedure
  .input(updateWardWiseChildBearersSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise child bearers data",
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
      .select({ id: wardWiseChildBearers.id })
      .from(wardWiseChildBearers)
      .where(eq(wardWiseChildBearers.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseChildBearers)
      .set({
        wardNumber: input.wardNumber,
        age15to49ChildBearers: input.age15to49ChildBearers,
      })
      .where(eq(wardWiseChildBearers.id, input.id));

    return { success: true };
  });

// Delete a ward-wise child bearers entry
export const deleteWardWiseChildBearers = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise child bearers data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseChildBearers)
      .where(eq(wardWiseChildBearers.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseChildBearersSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total child bearers across all wards
      const summarySql = sql`
        SELECT 
          SUM(age_15_to_49_child_bearers) as total_child_bearers
        FROM 
          ward_wise_child_bearers
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseChildBearersSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise child bearers summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseChildBearersRouter = createTRPCRouter({
  getAll: getAllWardWiseChildBearers,
  getByWard: getWardWiseChildBearersByWard,
  create: createWardWiseChildBearers,
  update: updateWardWiseChildBearers,
  delete: deleteWardWiseChildBearers,
  summary: getWardWiseChildBearersSummary,
});
