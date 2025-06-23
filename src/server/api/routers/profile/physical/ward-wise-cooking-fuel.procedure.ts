import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseCookingFuel } from "@/server/db/schema/profile/physical/ward-wise-cooking-fuel";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseCookingFuelSchema,
  wardWiseCookingFuelFilterSchema,
  updateWardWiseCookingFuelSchema,
  CookingFuelTypeEnum,
} from "./ward-wise-cooking-fuel.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise cooking fuel data with optional filtering
export const getAllWardWiseCookingFuel = publicProcedure
  .input(wardWiseCookingFuelFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseCookingFuel);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(eq(wardWiseCookingFuel.wardNumber, input.wardNumber));
        }

        if (input?.cookingFuel) {
          conditions.push(
            eq(wardWiseCookingFuel.cookingFuel, input.cookingFuel),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and cooking fuel type
        data = await queryWithFilters.orderBy(
          wardWiseCookingFuel.wardNumber,
          wardWiseCookingFuel.cookingFuel,
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
            cooking_fuel,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_cooking_fuel
          ORDER BY 
            ward_number, cooking_fuel
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            cookingFuel: row.cooking_fuel,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.cookingFuel) {
            data = data.filter(
              (item) => item.cookingFuel === input.cookingFuel,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise cooking fuel data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseCookingFuelByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseCookingFuel)
      .where(eq(wardWiseCookingFuel.wardNumber, input.wardNumber))
      .orderBy(wardWiseCookingFuel.cookingFuel);

    return data;
  });

// Create a new ward-wise cooking fuel entry
export const createWardWiseCookingFuel = protectedProcedure
  .input(wardWiseCookingFuelSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise cooking fuel data",
      });
    }

    // Check if entry already exists for this ward and cooking fuel type
    const existing = await ctx.db
      .select({ id: wardWiseCookingFuel.id })
      .from(wardWiseCookingFuel)
      .where(
        and(
          eq(wardWiseCookingFuel.wardNumber, input.wardNumber),
          eq(wardWiseCookingFuel.cookingFuel, input.cookingFuel),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and cooking fuel ${input.cookingFuel} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseCookingFuel).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      cookingFuel: input.cookingFuel,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise cooking fuel entry
export const updateWardWiseCookingFuel = protectedProcedure
  .input(updateWardWiseCookingFuelSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise cooking fuel data",
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
      .select({ id: wardWiseCookingFuel.id })
      .from(wardWiseCookingFuel)
      .where(eq(wardWiseCookingFuel.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseCookingFuel)
      .set({
        wardNumber: input.wardNumber,
        cookingFuel: input.cookingFuel,
        households: input.households,
      })
      .where(eq(wardWiseCookingFuel.id, input.id));

    return { success: true };
  });

// Delete a ward-wise cooking fuel entry
export const deleteWardWiseCookingFuel = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise cooking fuel data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseCookingFuel)
      .where(eq(wardWiseCookingFuel.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseCookingFuelSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by cooking fuel type across all wards
      const summarySql = sql`
        SELECT 
          cooking_fuel, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_cooking_fuel
        GROUP BY 
          cooking_fuel
        ORDER BY 
          cooking_fuel
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseCookingFuelSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise cooking fuel summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseCookingFuelRouter = createTRPCRouter({
  getAll: getAllWardWiseCookingFuel,
  getByWard: getWardWiseCookingFuelByWard,
  create: createWardWiseCookingFuel,
  update: updateWardWiseCookingFuel,
  delete: deleteWardWiseCookingFuel,
  summary: getWardWiseCookingFuelSummary,
});
