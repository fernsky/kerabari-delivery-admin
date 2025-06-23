import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseDrinkingWaterSource } from "@/server/db/schema/profile/water-and-sanitation/ward-wise-drinking-water-source";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseDrinkingWaterSourceSchema,
  wardWiseDrinkingWaterSourceFilterSchema,
  updateWardWiseDrinkingWaterSourceSchema,
  DrinkingWaterSourceTypeEnum,
} from "./ward-wise-drinking-water-source.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise drinking water source data with optional filtering
export const getAllWardWiseDrinkingWaterSource = publicProcedure
  .input(wardWiseDrinkingWaterSourceFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseDrinkingWaterSource);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseDrinkingWaterSource.wardNumber, input.wardNumber),
          );
        }

        if (input?.drinkingWaterSource) {
          conditions.push(
            eq(
              wardWiseDrinkingWaterSource.drinkingWaterSource,
              input.drinkingWaterSource,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and water source type
        data = await queryWithFilters.orderBy(
          wardWiseDrinkingWaterSource.wardNumber,
          wardWiseDrinkingWaterSource.drinkingWaterSource,
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
            drinking_water_source,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_drinking_water_source
          ORDER BY 
            ward_number, drinking_water_source
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            drinkingWaterSource: row.drinking_water_source,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.drinkingWaterSource) {
            data = data.filter(
              (item) => item.drinkingWaterSource === input.drinkingWaterSource,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-wise drinking water source data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseDrinkingWaterSourceByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseDrinkingWaterSource)
      .where(eq(wardWiseDrinkingWaterSource.wardNumber, input.wardNumber))
      .orderBy(wardWiseDrinkingWaterSource.drinkingWaterSource);

    return data;
  });

// Create a new ward-wise drinking water source entry
export const createWardWiseDrinkingWaterSource = protectedProcedure
  .input(wardWiseDrinkingWaterSourceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise drinking water source data",
      });
    }

    // Check if entry already exists for this ward and water source
    const existing = await ctx.db
      .select({ id: wardWiseDrinkingWaterSource.id })
      .from(wardWiseDrinkingWaterSource)
      .where(
        and(
          eq(wardWiseDrinkingWaterSource.wardNumber, input.wardNumber),
          eq(
            wardWiseDrinkingWaterSource.drinkingWaterSource,
            input.drinkingWaterSource,
          ),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and water source ${input.drinkingWaterSource} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseDrinkingWaterSource).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      drinkingWaterSource: input.drinkingWaterSource,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise drinking water source entry
export const updateWardWiseDrinkingWaterSource = protectedProcedure
  .input(updateWardWiseDrinkingWaterSourceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise drinking water source data",
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
      .select({ id: wardWiseDrinkingWaterSource.id })
      .from(wardWiseDrinkingWaterSource)
      .where(eq(wardWiseDrinkingWaterSource.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseDrinkingWaterSource)
      .set({
        wardNumber: input.wardNumber,
        drinkingWaterSource: input.drinkingWaterSource,
        households: input.households,
      })
      .where(eq(wardWiseDrinkingWaterSource.id, input.id));

    return { success: true };
  });

// Delete a ward-wise drinking water source entry
export const deleteWardWiseDrinkingWaterSource = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise drinking water source data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseDrinkingWaterSource)
      .where(eq(wardWiseDrinkingWaterSource.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseDrinkingWaterSourceSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by water source type across all wards
      const summarySql = sql`
        SELECT 
          drinking_water_source, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_drinking_water_source
        GROUP BY 
          drinking_water_source
        ORDER BY 
          drinking_water_source
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseDrinkingWaterSourceSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise drinking water source summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseDrinkingWaterSourceRouter = createTRPCRouter({
  getAll: getAllWardWiseDrinkingWaterSource,
  getByWard: getWardWiseDrinkingWaterSourceByWard,
  create: createWardWiseDrinkingWaterSource,
  update: updateWardWiseDrinkingWaterSource,
  delete: deleteWardWiseDrinkingWaterSource,
  summary: getWardWiseDrinkingWaterSourceSummary,
});
