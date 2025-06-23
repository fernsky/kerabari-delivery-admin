import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseHouseholdsLoanUse } from "@/server/db/schema/profile/economics/ward-wise-households-loan-use";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  addWardWiseHouseholdsLoanUseSchema,
  getWardWiseHouseholdsLoanUseSchema,
  batchAddWardWiseHouseholdsLoanUseSchema,
  LoanUseEnum,
} from "./ward-wise-households-loan-use.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward wise households loan use data with optional filtering
export const getAllWardWiseHouseholdsLoanUse = publicProcedure
  .input(getWardWiseHouseholdsLoanUseSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseHouseholdsLoanUse);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseHouseholdsLoanUse.wardNumber, input.wardNumber),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number, loan use
        data = await queryWithFilters.orderBy(
          wardWiseHouseholdsLoanUse.wardNumber,
          wardWiseHouseholdsLoanUse.loanUse,
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
            loan_use,
            households
          FROM 
            acme_ward_wise_households_loan_use
          ORDER BY 
            ward_number, loan_use
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            loanUse: row.loan_use,
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
        "Error fetching ward wise households loan use data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseHouseholdsLoanUseByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseHouseholdsLoanUse)
      .where(eq(wardWiseHouseholdsLoanUse.wardNumber, input.wardNumber))
      .orderBy(wardWiseHouseholdsLoanUse.loanUse);

    return data;
  });

// Add ward wise households loan use data
export const addWardWiseHouseholdsLoanUse = protectedProcedure
  .input(addWardWiseHouseholdsLoanUseSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can add ward wise households loan use data",
      });
    }

    // Delete existing data for the ward before adding new data
    await ctx.db
      .delete(wardWiseHouseholdsLoanUse)
      .where(eq(wardWiseHouseholdsLoanUse.wardNumber, input.wardNumber));

    // Insert new data
    for (const item of input.data) {
      await ctx.db.insert(wardWiseHouseholdsLoanUse).values({
        id: uuidv4(),
        wardNumber: input.wardNumber,
        loanUse: item.loanUse,
        households: item.households,
      });
    }

    return { success: true };
  });

// Batch add ward wise households loan use data for multiple wards
export const batchAddWardWiseHouseholdsLoanUse = protectedProcedure
  .input(batchAddWardWiseHouseholdsLoanUseSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can batch add ward wise households loan use data",
      });
    }

    // Process each ward data entry
    for (const item of input.data) {
      // Delete existing data for this ward
      await ctx.db
        .delete(wardWiseHouseholdsLoanUse)
        .where(eq(wardWiseHouseholdsLoanUse.wardNumber, item.wardNumber));

      // Insert new data for each loan use
      for (const loanUseItem of item.loanUses) {
        await ctx.db.insert(wardWiseHouseholdsLoanUse).values({
          id: uuidv4(),
          wardNumber: item.wardNumber,
          loanUse: loanUseItem.loanUse,
          households: loanUseItem.households,
        });
      }
    }

    return { success: true };
  });

// Delete ward wise households loan use data for a specific ward
export const deleteWardWiseHouseholdsLoanUse = protectedProcedure
  .input(z.object({ wardNumber: z.number() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward wise households loan use data",
      });
    }

    // Delete all data for the ward
    await ctx.db
      .delete(wardWiseHouseholdsLoanUse)
      .where(eq(wardWiseHouseholdsLoanUse.wardNumber, input.wardNumber));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseHouseholdsLoanUseSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by loan use category across all wards
      const summarySql = sql`
        SELECT 
          loan_use, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_households_loan_use
        GROUP BY 
          loan_use
        ORDER BY 
          loan_use
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseHouseholdsLoanUseSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward wise households loan use summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseHouseholdsLoanUseRouter = createTRPCRouter({
  getAll: getAllWardWiseHouseholdsLoanUse,
  getByWard: getWardWiseHouseholdsLoanUseByWard,
  add: addWardWiseHouseholdsLoanUse,
  batchAdd: batchAddWardWiseHouseholdsLoanUse,
  delete: deleteWardWiseHouseholdsLoanUse,
  summary: getWardWiseHouseholdsLoanUseSummary,
});
