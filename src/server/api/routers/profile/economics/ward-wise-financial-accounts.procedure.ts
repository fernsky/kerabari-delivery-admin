import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseFinancialAccounts } from "@/server/db/schema/profile/economics/ward-wise-financial-accounts";
import { eq, and, sql } from "drizzle-orm";
import {
  wardWiseFinancialAccountsSchema,
  wardWiseFinancialAccountsFilterSchema,
  updateWardWiseFinancialAccountsSchema,
} from "./ward-wise-financial-accounts.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise financial accounts data with optional filtering
export const getAllWardWiseFinancialAccounts = publicProcedure
  .input(wardWiseFinancialAccountsFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseFinancialAccounts);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseFinancialAccounts.wardNumber, input.wardNumber),
          );
        }

        if (input?.financialAccountType) {
          conditions.push(
            eq(wardWiseFinancialAccounts.financialAccountType, input.financialAccountType),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and account type
        data = await queryWithFilters.orderBy(
          wardWiseFinancialAccounts.wardNumber,
          wardWiseFinancialAccounts.financialAccountType,
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
            financial_account_type,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_financial_accounts
          ORDER BY 
            ward_number,
            financial_account_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            financialAccountType: row.financial_account_type,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.financialAccountType) {
            data = data.filter((item) => item.financialAccountType === input.financialAccountType);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise financial accounts data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseFinancialAccountsByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseFinancialAccounts)
      .where(eq(wardWiseFinancialAccounts.wardNumber, input.wardNumber));

    return data;
  });

// Create a new ward-wise financial accounts entry
export const createWardWiseFinancialAccounts = protectedProcedure
  .input(wardWiseFinancialAccountsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise financial accounts data",
      });
    }

    // Check if entry already exists for this ward and account type
    const existing = await ctx.db
      .select({ id: wardWiseFinancialAccounts.id })
      .from(wardWiseFinancialAccounts)
      .where(
        and(
          eq(wardWiseFinancialAccounts.wardNumber, input.wardNumber),
          eq(wardWiseFinancialAccounts.financialAccountType, input.financialAccountType)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} with account type ${input.financialAccountType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseFinancialAccounts).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      financialAccountType: input.financialAccountType,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise financial accounts entry
export const updateWardWiseFinancialAccounts = protectedProcedure
  .input(updateWardWiseFinancialAccountsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise financial accounts data",
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
      .select({ id: wardWiseFinancialAccounts.id })
      .from(wardWiseFinancialAccounts)
      .where(eq(wardWiseFinancialAccounts.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseFinancialAccounts)
      .set({
        wardNumber: input.wardNumber,
        financialAccountType: input.financialAccountType,
        households: input.households,
      })
      .where(eq(wardWiseFinancialAccounts.id, input.id));

    return { success: true };
  });

// Delete a ward-wise financial accounts entry
export const deleteWardWiseFinancialAccounts = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise financial accounts data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseFinancialAccounts)
      .where(eq(wardWiseFinancialAccounts.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseFinancialAccountsSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get counts by account type across all wards
      const summarySql = sql`
        SELECT 
          financial_account_type as type,
          SUM(households) as total_households
        FROM 
          acme_ward_wise_financial_accounts
        GROUP BY
          financial_account_type
        ORDER BY
          CASE 
            WHEN financial_account_type = 'BANK' THEN 1
            WHEN financial_account_type = 'FINANCE' THEN 2
            WHEN financial_account_type = 'MICRO_FINANCE' THEN 3
            WHEN financial_account_type = 'COOPERATIVE' THEN 4
            WHEN financial_account_type = 'NONE' THEN 5
            ELSE 6
          END
      `;

      const summaryData = await ctx.db.execute(summarySql);

      // Get total households
      const totalSql = sql`
        SELECT SUM(households) as total
        FROM acme_ward_wise_financial_accounts
      `;

      const totalResult = await ctx.db.execute(totalSql);
      const total = parseInt(String(totalResult?.[0]?.total || "0"));

      // Calculate percentages
      const summaryWithPercentages = summaryData.map(item => ({
        type: item.type,
        households: parseInt(String(item.total_households || "0")),
        percentage: parseFloat((parseInt(String(item.total_households || "0")) / total * 100).toFixed(2))
      }));

      return { 
        summary: summaryWithPercentages,
        total
      };
    } catch (error) {
      console.error("Error in getWardWiseFinancialAccountsSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise financial accounts summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseFinancialAccountsRouter = createTRPCRouter({
  getAll: getAllWardWiseFinancialAccounts,
  getByWard: getWardWiseFinancialAccountsByWard,
  create: createWardWiseFinancialAccounts,
  update: updateWardWiseFinancialAccounts,
  delete: deleteWardWiseFinancialAccounts,
  summary: getWardWiseFinancialAccountsSummary,
});
