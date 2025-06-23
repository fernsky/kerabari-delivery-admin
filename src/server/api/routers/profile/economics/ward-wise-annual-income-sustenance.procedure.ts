import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseAnnualIncomeSustenance } from "@/server/db/schema/profile/economics/ward-wise-annual-income-sustenance";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  addWardWiseAnnualIncomeSustenanceSchema,
  getWardWiseAnnualIncomeSustenanceSchema,
  batchAddWardWiseAnnualIncomeSustenanceSchema,
  MonthsSustainedEnum,
} from "./ward-wise-annual-income-sustenance.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward wise annual income sustenance data with optional filtering
export const getAllWardWiseAnnualIncomeSustenance = publicProcedure
  .input(getWardWiseAnnualIncomeSustenanceSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseAnnualIncomeSustenance);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseAnnualIncomeSustenance.wardNumber, input.wardNumber),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number, months sustained
        data = await queryWithFilters.orderBy(
          wardWiseAnnualIncomeSustenance.wardNumber,
          wardWiseAnnualIncomeSustenance.monthsSustained,
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
            months_sustained,
            households
          FROM 
            acme_ward_wise_annual_income_sustenance
          ORDER BY 
            ward_number, months_sustained
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            monthsSustained: row.months_sustained,
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
        "Error fetching ward wise annual income sustenance data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get ward wise annual income sustenance data for a specific ward
export const getWardWiseAnnualIncomeSustenanceByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        data = await ctx.db
          .select()
          .from(wardWiseAnnualIncomeSustenance)
          .where(
            eq(wardWiseAnnualIncomeSustenance.wardNumber, input.wardNumber),
          )
          .orderBy(wardWiseAnnualIncomeSustenance.monthsSustained);
      } catch (err) {
        console.log(
          `Failed to query main schema for ward ${input.wardNumber}:`,
          err,
        );
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            ward_number,
            months_sustained,
            households
          FROM 
            acme_ward_wise_annual_income_sustenance
          WHERE
            ward_number = ${input.wardNumber}
          ORDER BY 
            months_sustained
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            monthsSustained: row.months_sustained,
            households: parseInt(String(row.households || "0")),
          }));
        }
      }

      return data;
    } catch (error) {
      console.error(
        `Error fetching ward ${input.wardNumber} annual income sustenance data:`,
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data for the specified ward",
      });
    }
  });

// Add ward wise annual income sustenance data
export const addWardWiseAnnualIncomeSustenance = protectedProcedure
  .input(addWardWiseAnnualIncomeSustenanceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can add ward wise annual income sustenance data",
      });
    }

    // Delete existing data for the ward before adding new data
    await ctx.db
      .delete(wardWiseAnnualIncomeSustenance)
      .where(eq(wardWiseAnnualIncomeSustenance.wardNumber, input.wardNumber));

    // Insert new data
    for (const item of input.data) {
      await ctx.db.insert(wardWiseAnnualIncomeSustenance).values({
        id: uuidv4(),
        wardNumber: input.wardNumber,
        monthsSustained: item.monthsSustained,
        households: item.households,
      });
    }

    return { success: true };
  });

// Batch add ward wise annual income sustenance data for multiple wards
export const batchAddWardWiseAnnualIncomeSustenance = protectedProcedure
  .input(batchAddWardWiseAnnualIncomeSustenanceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can batch add ward wise annual income sustenance data",
      });
    }

    // Process each ward data entry
    for (const item of input.data) {
      // Delete existing data for this ward
      await ctx.db
        .delete(wardWiseAnnualIncomeSustenance)
        .where(eq(wardWiseAnnualIncomeSustenance.wardNumber, item.wardNumber));

      // Insert new data
      await ctx.db.insert(wardWiseAnnualIncomeSustenance).values({
        id: uuidv4(),
        wardNumber: item.wardNumber,
        monthsSustained: item.monthsSustained,
        households: item.households,
      });
    }

    return { success: true };
  });

// Delete ward wise annual income sustenance data for a specific ward
export const deleteWardWiseAnnualIncomeSustenance = protectedProcedure
  .input(z.object({ wardNumber: z.number() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward wise annual income sustenance data",
      });
    }

    // Delete all data for the ward
    await ctx.db
      .delete(wardWiseAnnualIncomeSustenance)
      .where(eq(wardWiseAnnualIncomeSustenance.wardNumber, input.wardNumber));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseAnnualIncomeSustenanceSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by months sustained category across all wards
      const summarySql = sql`
        SELECT 
          months_sustained, 
          SUM(households) as total_households
        FROM 
          ward_wise_annual_income_sustenance
        GROUP BY 
          months_sustained
        ORDER BY 
          months_sustained
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error(
        "Error in getWardWiseAnnualIncomeSustenanceSummary:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Failed to retrieve ward wise annual income sustenance summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseAnnualIncomeSustenanceRouter = createTRPCRouter({
  getAll: getAllWardWiseAnnualIncomeSustenance,
  getByWard: getWardWiseAnnualIncomeSustenanceByWard,
  add: addWardWiseAnnualIncomeSustenance,
  batchAdd: batchAddWardWiseAnnualIncomeSustenance,
  delete: deleteWardWiseAnnualIncomeSustenance,
  summary: getWardWiseAnnualIncomeSustenanceSummary,
});
