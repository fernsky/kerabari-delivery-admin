import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseHouseholdIncomeSource } from "@/server/db/schema/profile/economics/ward-wise-household-income-source";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  addWardWiseHouseholdIncomeSourceSchema,
  getWardWiseHouseholdIncomeSourceSchema,
  batchAddWardWiseHouseholdIncomeSourceSchema,
  IncomeSourceEnum,
} from "./ward-wise-household-income-source.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward wise household income source data with optional filtering
export const getAllWardWiseHouseholdIncomeSource = publicProcedure
  .input(getWardWiseHouseholdIncomeSourceSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseHouseholdIncomeSource);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseHouseholdIncomeSource.wardNumber, input.wardNumber),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number, income source
        data = await queryWithFilters.orderBy(
          wardWiseHouseholdIncomeSource.wardNumber,
          wardWiseHouseholdIncomeSource.incomeSource,
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
            income_source,
            households
          FROM 
            acme_ward_wise_household_income_source
          ORDER BY 
            ward_number, income_source
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            incomeSource: row.income_source,
            households: parseInt(String(row.households || "0")),
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward wise household income source data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseHouseholdIncomeSourceByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseHouseholdIncomeSource)
      .where(eq(wardWiseHouseholdIncomeSource.wardNumber, input.wardNumber))
      .orderBy(wardWiseHouseholdIncomeSource.incomeSource);

    return data;
  });

// Add ward wise household income source data
export const addWardWiseHouseholdIncomeSource = protectedProcedure
  .input(addWardWiseHouseholdIncomeSourceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can add ward wise household income source data",
      });
    }

    // Delete existing data for the ward before adding new data
    await ctx.db
      .delete(wardWiseHouseholdIncomeSource)
      .where(eq(wardWiseHouseholdIncomeSource.wardNumber, input.wardNumber));

    // Insert new data
    for (const item of input.data) {
      await ctx.db.insert(wardWiseHouseholdIncomeSource).values({
        id: uuidv4(),
        wardNumber: input.wardNumber,
        incomeSource: item.incomeSource,
        households: item.households,
      });
    }

    return { success: true };
  });

// Batch add ward wise household income source data for multiple wards
export const batchAddWardWiseHouseholdIncomeSource = protectedProcedure
  .input(batchAddWardWiseHouseholdIncomeSourceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can batch add ward wise household income source data",
      });
    }

    // Process each ward data entry
    for (const item of input.data) {
      // Delete existing data for this ward
      await ctx.db
        .delete(wardWiseHouseholdIncomeSource)
        .where(eq(wardWiseHouseholdIncomeSource.wardNumber, item.wardNumber));

      // Insert new data
      await ctx.db.insert(wardWiseHouseholdIncomeSource).values({
        id: uuidv4(),
        wardNumber: item.wardNumber,
        incomeSource: item.incomeSource,
        households: item.households,
      });
    }

    return { success: true };
  });

// Delete ward wise household income source data for a specific ward
export const deleteWardWiseHouseholdIncomeSource = protectedProcedure
  .input(z.object({ wardNumber: z.number() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward wise household income source data",
      });
    }

    // Delete all data for the ward
    await ctx.db
      .delete(wardWiseHouseholdIncomeSource)
      .where(eq(wardWiseHouseholdIncomeSource.wardNumber, input.wardNumber));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseHouseholdIncomeSourceSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by income source category across all wards
      const summarySql = sql`
        SELECT 
          income_source, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_household_income_source
        GROUP BY 
          income_source
        ORDER BY 
          income_source
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseHouseholdIncomeSourceSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward wise household income source summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseHouseholdIncomeSourceRouter = createTRPCRouter({
  getAll: getAllWardWiseHouseholdIncomeSource,
  getByWard: getWardWiseHouseholdIncomeSourceByWard,
  add: addWardWiseHouseholdIncomeSource,
  batchAdd: batchAddWardWiseHouseholdIncomeSource,
  delete: deleteWardWiseHouseholdIncomeSource,
  summary: getWardWiseHouseholdIncomeSourceSummary,
});
