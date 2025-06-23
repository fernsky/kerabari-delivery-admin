import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseRemittanceExpenses } from "@/server/db/schema/profile/economics/ward-wise-remittance-expenses";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseRemittanceExpensesSchema,
  wardWiseRemittanceExpensesFilterSchema,
  updateWardWiseRemittanceExpensesSchema,
  RemittanceExpenseTypeEnum,
} from "./ward-wise-remittance-expenses.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise remittance expenses data with optional filtering
export const getAllWardWiseRemittanceExpenses = publicProcedure
  .input(wardWiseRemittanceExpensesFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseRemittanceExpenses);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseRemittanceExpenses.wardNumber, input.wardNumber),
          );
        }

        if (input?.remittanceExpense) {
          conditions.push(
            eq(
              wardWiseRemittanceExpenses.remittanceExpense,
              input.remittanceExpense,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and remittance expense type
        data = await queryWithFilters.orderBy(
          wardWiseRemittanceExpenses.wardNumber,
          wardWiseRemittanceExpenses.remittanceExpense,
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
            remittance_expense,
            households
          FROM 
            acme_ward_wise_remittance_expenses
          ORDER BY 
            ward_number, remittance_expense
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            remittanceExpense: row.remittance_expense,
            households: parseInt(String(row.households || "0")),
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.remittanceExpense) {
            data = data.filter(
              (item) => item.remittanceExpense === input.remittanceExpense,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-wise remittance expenses data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseRemittanceExpensesByWard = publicProcedure
  .input(z.object({ wardNumber: z.number().int().positive() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseRemittanceExpenses)
      .where(eq(wardWiseRemittanceExpenses.wardNumber, input.wardNumber))
      .orderBy(wardWiseRemittanceExpenses.remittanceExpense);

    return data;
  });

// Create a new ward-wise remittance expenses entry
export const createWardWiseRemittanceExpenses = protectedProcedure
  .input(wardWiseRemittanceExpensesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise remittance expenses data",
      });
    }

    // Check if entry already exists for this ward and remittance expense type
    const existing = await ctx.db
      .select({ id: wardWiseRemittanceExpenses.id })
      .from(wardWiseRemittanceExpenses)
      .where(
        and(
          eq(wardWiseRemittanceExpenses.wardNumber, input.wardNumber),
          eq(
            wardWiseRemittanceExpenses.remittanceExpense,
            input.remittanceExpense,
          ),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and remittance expense ${input.remittanceExpense} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseRemittanceExpenses).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      remittanceExpense: input.remittanceExpense,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise remittance expenses entry
export const updateWardWiseRemittanceExpenses = protectedProcedure
  .input(updateWardWiseRemittanceExpensesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise remittance expenses data",
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
      .select({ id: wardWiseRemittanceExpenses.id })
      .from(wardWiseRemittanceExpenses)
      .where(eq(wardWiseRemittanceExpenses.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseRemittanceExpenses)
      .set({
        wardNumber: input.wardNumber,
        remittanceExpense: input.remittanceExpense,
        households: input.households,
      })
      .where(eq(wardWiseRemittanceExpenses.id, input.id));

    return { success: true };
  });

// Delete a ward-wise remittance expenses entry
export const deleteWardWiseRemittanceExpenses = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise remittance expenses data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseRemittanceExpenses)
      .where(eq(wardWiseRemittanceExpenses.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseRemittanceExpensesSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by remittance expense type across all wards
      const summarySql = sql`
        SELECT 
          remittance_expense, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_remittance_expenses
        GROUP BY 
          remittance_expense
        ORDER BY 
          remittance_expense
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseRemittanceExpensesSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise remittance expenses summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseRemittanceExpensesRouter = createTRPCRouter({
  getAll: getAllWardWiseRemittanceExpenses,
  getByWard: getWardWiseRemittanceExpensesByWard,
  create: createWardWiseRemittanceExpenses,
  update: updateWardWiseRemittanceExpenses,
  delete: deleteWardWiseRemittanceExpenses,
  summary: getWardWiseRemittanceExpensesSummary,
});
