import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseRemittance } from "@/server/db/schema/profile/economics/ward-wise-remittance";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseRemittanceSchema,
  wardWiseRemittanceFilterSchema,
  updateWardWiseRemittanceSchema,
  RemittanceAmountGroupEnum,
} from "./ward-wise-remittance.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise remittance data with optional filtering
export const getAllWardWiseRemittance = publicProcedure
  .input(wardWiseRemittanceFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseRemittance);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseRemittance.wardNumber, input.wardNumber),
          );
        }

        if (input?.amountGroup) {
          conditions.push(eq(wardWiseRemittance.amountGroup, input.amountGroup));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and amount group
        data = await queryWithFilters.orderBy(
          wardWiseRemittance.wardNumber,
          wardWiseRemittance.amountGroup,
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
            amount_group,
            sending_population,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_remittance
          ORDER BY 
            ward_number, amount_group
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            amountGroup: row.amount_group,
            sendingPopulation: parseInt(String(row.sending_population || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.amountGroup) {
            data = data.filter((item) => item.amountGroup === input.amountGroup);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise remittance data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseRemittanceByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseRemittance)
      .where(eq(wardWiseRemittance.wardNumber, input.wardNumber))
      .orderBy(wardWiseRemittance.amountGroup);

    return data;
  });

// Create a new ward-wise remittance entry
export const createWardWiseRemittance = protectedProcedure
  .input(wardWiseRemittanceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise remittance data",
      });
    }

    // Check if entry already exists for this ward and amount group
    const existing = await ctx.db
      .select({ id: wardWiseRemittance.id })
      .from(wardWiseRemittance)
      .where(
        and(
          eq(wardWiseRemittance.wardNumber, input.wardNumber),
          eq(wardWiseRemittance.amountGroup, input.amountGroup),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and amount group ${input.amountGroup} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseRemittance).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      amountGroup: input.amountGroup,
      sendingPopulation: input.sendingPopulation,
    });

    return { success: true };
  });

// Update an existing ward-wise remittance entry
export const updateWardWiseRemittance = protectedProcedure
  .input(updateWardWiseRemittanceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise remittance data",
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
      .select({ id: wardWiseRemittance.id })
      .from(wardWiseRemittance)
      .where(eq(wardWiseRemittance.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseRemittance)
      .set({
        wardNumber: input.wardNumber,
        amountGroup: input.amountGroup,
        sendingPopulation: input.sendingPopulation,
      })
      .where(eq(wardWiseRemittance.id, input.id));

    return { success: true };
  });

// Delete a ward-wise remittance entry
export const deleteWardWiseRemittance = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise remittance data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseRemittance)
      .where(eq(wardWiseRemittance.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseRemittanceSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by amount group across all wards
      const summarySql = sql`
        SELECT 
          amount_group, 
          SUM(sending_population) as total_population
        FROM 
          acme_ward_wise_remittance
        GROUP BY 
          amount_group
        ORDER BY 
          amount_group
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseRemittanceSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise remittance summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseRemittanceRouter = createTRPCRouter({
  getAll: getAllWardWiseRemittance,
  getByWard: getWardWiseRemittanceByWard,
  create: createWardWiseRemittance,
  update: updateWardWiseRemittance,
  delete: deleteWardWiseRemittance,
  summary: getWardWiseRemittanceSummary,
});
