import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseTimeToFinancialOrganization } from "@/server/db/schema/profile/economics/ward-wise-time-to-financial-organization";
import { eq, and, sql } from "drizzle-orm";
import {
  wardWiseTimeToFinancialOrganizationSchema,
  wardWiseTimeToFinancialOrganizationFilterSchema,
  updateWardWiseTimeToFinancialOrganizationSchema,
} from "./ward-wise-time-to-financial-organization.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise time to financial organization data with optional filtering
export const getAllWardWiseTimeToFinancialOrganization = publicProcedure
  .input(wardWiseTimeToFinancialOrganizationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseTimeToFinancialOrganization);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseTimeToFinancialOrganization.wardNumber, input.wardNumber),
          );
        }

        if (input?.timeToFinancialOrganizationType) {
          conditions.push(
            eq(wardWiseTimeToFinancialOrganization.timeToFinancialOrganizationType, input.timeToFinancialOrganizationType),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and time type
        data = await queryWithFilters.orderBy(
          wardWiseTimeToFinancialOrganization.wardNumber,
          wardWiseTimeToFinancialOrganization.timeToFinancialOrganizationType,
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
            time_to_financial_organization_type,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_time_to_financial_organization
          ORDER BY 
            ward_number,
            time_to_financial_organization_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            timeToFinancialOrganizationType: row.time_to_financial_organization_type,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.timeToFinancialOrganizationType) {
            data = data.filter((item) => item.timeToFinancialOrganizationType === input.timeToFinancialOrganizationType);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise time to financial organization data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseTimeToFinancialOrganizationByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseTimeToFinancialOrganization)
      .where(eq(wardWiseTimeToFinancialOrganization.wardNumber, input.wardNumber));

    return data;
  });

// Create a new ward-wise time to financial organization entry
export const createWardWiseTimeToFinancialOrganization = protectedProcedure
  .input(wardWiseTimeToFinancialOrganizationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise time to financial organization data",
      });
    }

    // Check if entry already exists for this ward and time type
    const existing = await ctx.db
      .select({ id: wardWiseTimeToFinancialOrganization.id })
      .from(wardWiseTimeToFinancialOrganization)
      .where(
        and(
          eq(wardWiseTimeToFinancialOrganization.wardNumber, input.wardNumber),
          eq(wardWiseTimeToFinancialOrganization.timeToFinancialOrganizationType, input.timeToFinancialOrganizationType)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} with time type ${input.timeToFinancialOrganizationType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseTimeToFinancialOrganization).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      timeToFinancialOrganizationType: input.timeToFinancialOrganizationType,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise time to financial organization entry
export const updateWardWiseTimeToFinancialOrganization = protectedProcedure
  .input(updateWardWiseTimeToFinancialOrganizationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise time to financial organization data",
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
      .select({ id: wardWiseTimeToFinancialOrganization.id })
      .from(wardWiseTimeToFinancialOrganization)
      .where(eq(wardWiseTimeToFinancialOrganization.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseTimeToFinancialOrganization)
      .set({
        wardNumber: input.wardNumber,
        timeToFinancialOrganizationType: input.timeToFinancialOrganizationType,
        households: input.households,
      })
      .where(eq(wardWiseTimeToFinancialOrganization.id, input.id));

    return { success: true };
  });

// Delete a ward-wise time to financial organization entry
export const deleteWardWiseTimeToFinancialOrganization = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise time to financial organization data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseTimeToFinancialOrganization)
      .where(eq(wardWiseTimeToFinancialOrganization.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseTimeToFinancialOrganizationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get counts by time type across all wards
      const summarySql = sql`
        SELECT 
          time_to_financial_organization_type as type,
          SUM(households) as total_households
        FROM 
          acme_ward_wise_time_to_financial_organization
        GROUP BY
          time_to_financial_organization_type
        ORDER BY
          CASE 
            WHEN time_to_financial_organization_type = 'UNDER_15_MIN' THEN 1
            WHEN time_to_financial_organization_type = 'UNDER_30_MIN' THEN 2
            WHEN time_to_financial_organization_type = 'UNDER_1_HOUR' THEN 3
            WHEN time_to_financial_organization_type = '1_HOUR_OR_MORE' THEN 4
            ELSE 5
          END
      `;

      const summaryData = await ctx.db.execute(summarySql);

      // Get total households
      const totalSql = sql`
        SELECT SUM(households) as total
        FROM acme_ward_wise_time_to_financial_organization
      `;

      const totalResult = await ctx.db.execute(totalSql);
      const total = totalResult?.[0]?.total || 0;

      // Calculate percentages
      const summaryWithPercentages = summaryData.map(item => ({
        type: item.type,
        households: parseInt(String(item.total_households || "0")),
        percentage: parseFloat(((parseInt(String(item.total_households || "0")) / (total as unknown as number)) * 100).toFixed(2))
      }));

      return { 
        summary: summaryWithPercentages,
        total
      };
    } catch (error) {
      console.error("Error in getWardWiseTimeToFinancialOrganizationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise time to financial organization summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseTimeToFinancialOrganizationRouter = createTRPCRouter({
  getAll: getAllWardWiseTimeToFinancialOrganization,
  getByWard: getWardWiseTimeToFinancialOrganizationByWard,
  create: createWardWiseTimeToFinancialOrganization,
  update: updateWardWiseTimeToFinancialOrganization,
  delete: deleteWardWiseTimeToFinancialOrganization,
  summary: getWardWiseTimeToFinancialOrganizationSummary,
});
