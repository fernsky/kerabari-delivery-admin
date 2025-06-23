import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseHouseholdsOnLoan } from "@/server/db/schema/profile/economics/ward-wise-households-on-loan";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  addWardWiseHouseholdsOnLoanSchema,
  getWardWiseHouseholdsOnLoanSchema,
  batchAddWardWiseHouseholdsOnLoanSchema,
} from "./ward-wise-households-on-loan.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward wise households on loan data with optional filtering
export const getAllWardWiseHouseholdsOnLoan = publicProcedure
  .input(getWardWiseHouseholdsOnLoanSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(wardWiseHouseholdsOnLoan);

      let conditions = [];

      if (input?.wardNumber) {
        conditions.push(
          eq(wardWiseHouseholdsOnLoan.wardNumber, input.wardNumber),
        );
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      // Sort by ward number
      const data = await queryWithFilters.orderBy(
        wardWiseHouseholdsOnLoan.wardNumber,
      );

      return data;
    } catch (error) {
      console.error("Error fetching ward wise households on loan data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseHouseholdsOnLoanByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseHouseholdsOnLoan)
      .where(eq(wardWiseHouseholdsOnLoan.wardNumber, input.wardNumber));

    return data;
  });

// Add ward wise households on loan data
export const addWardWiseHouseholdsOnLoan = protectedProcedure
  .input(addWardWiseHouseholdsOnLoanSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can add ward wise households on loan data",
      });
    }

    // Delete existing data for the ward before adding new data
    await ctx.db
      .delete(wardWiseHouseholdsOnLoan)
      .where(eq(wardWiseHouseholdsOnLoan.wardNumber, input.wardNumber));

    // Insert new data
    await ctx.db.insert(wardWiseHouseholdsOnLoan).values({
      wardNumber: input.wardNumber,
      households: input.households,
    });

    return { success: true };
  });

// Batch add ward wise households on loan data for multiple wards
export const batchAddWardWiseHouseholdsOnLoan = protectedProcedure
  .input(batchAddWardWiseHouseholdsOnLoanSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can batch add ward wise households on loan data",
      });
    }

    // Process each ward data entry
    for (const item of input.data) {
      // Delete existing data for this ward
      await ctx.db
        .delete(wardWiseHouseholdsOnLoan)
        .where(eq(wardWiseHouseholdsOnLoan.wardNumber, item.wardNumber));

      // Insert new data
      await ctx.db.insert(wardWiseHouseholdsOnLoan).values({
        wardNumber: item.wardNumber,
        households: item.households,
      });
    }

    return { success: true };
  });

// Delete ward wise households on loan data for a specific ward
export const deleteWardWiseHouseholdsOnLoan = protectedProcedure
  .input(z.object({ wardNumber: z.number() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward wise households on loan data",
      });
    }

    // Delete all data for the ward
    await ctx.db
      .delete(wardWiseHouseholdsOnLoan)
      .where(eq(wardWiseHouseholdsOnLoan.wardNumber, input.wardNumber));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseHouseholdsOnLoanSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total count of households on loan across all wards
      const summarySql = sql`
        SELECT 
          SUM(households) as total_households_on_loan
        FROM 
          acme_ward_wise_households_on_loan
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData[0] || { total_households_on_loan: 0 };
    } catch (error) {
      console.error("Error in getWardWiseHouseholdsOnLoanSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward wise households on loan summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseHouseholdsOnLoanRouter = createTRPCRouter({
  getAll: getAllWardWiseHouseholdsOnLoan,
  getByWard: getWardWiseHouseholdsOnLoanByWard,
  add: addWardWiseHouseholdsOnLoan,
  batchAdd: batchAddWardWiseHouseholdsOnLoan,
  delete: deleteWardWiseHouseholdsOnLoan,
  summary: getWardWiseHouseholdsOnLoanSummary,
});
