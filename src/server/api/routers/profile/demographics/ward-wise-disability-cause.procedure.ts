import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseDisabilityCause } from "@/server/db/schema/profile/demographics/ward-wise-disability-cause";
import { eq, and, sql } from "drizzle-orm";
import {
  wardWiseDisabilityCauseSchema,
  wardWiseDisabilityCauseFilterSchema,
  updateWardWiseDisabilityCauseSchema,
  DisabilityCauseEnum,
} from "./ward-wise-disability-cause.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Function to normalize disability cause enum values
function normalizeDisabilityCause(cause: string): "CONGENITAL" | "ACCIDENT" | "MALNUTRITION" | "DISEASE" | "CONFLICT" | "OTHER" {
  const normalized = cause.toLowerCase();
  const mapping: Record<string, "CONGENITAL" | "ACCIDENT" | "MALNUTRITION" | "DISEASE" | "CONFLICT" | "OTHER"> = {
    'congenital': 'CONGENITAL',
    'accident': 'ACCIDENT',
    'malnutrition': 'MALNUTRITION',
    'disease': 'DISEASE',
    'conflict': 'CONFLICT',
    'other': 'OTHER',
    'unknown': 'OTHER', // Map unknown to OTHER
  };
  return mapping[normalized] || 'OTHER';
}

// Get all ward-wise disability cause data with optional filtering
export const getAllWardWiseDisabilityCause = publicProcedure
  .input(wardWiseDisabilityCauseFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db
          .select()
          .from(wardWiseDisabilityCause);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(
              wardWiseDisabilityCause.wardNumber,
              input.wardNumber,
            ),
          );
        }

        if (input?.disabilityCause) {
          conditions.push(
            eq(
              wardWiseDisabilityCause.disabilityCause,
              input.disabilityCause as "CONGENITAL" | "ACCIDENT" | "MALNUTRITION" | "DISEASE" | "CONFLICT" | "OTHER",
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and disability cause
        data = await queryWithFilters.orderBy(
          wardWiseDisabilityCause.wardNumber,
          wardWiseDisabilityCause.disabilityCause,
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
            disability_cause,
            population
          FROM 
            acme_ward_wise_disability_cause
          ORDER BY 
            ward_number, disability_cause
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            disabilityCause: normalizeDisabilityCause(String(row.disability_cause)),
            population: parseInt(String(row.population || "0")),
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.disabilityCause) {
            data = data.filter((item) => item.disabilityCause === input.disabilityCause);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-wise disability cause data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseDisabilityCauseByWard = publicProcedure
  .input(z.object({ wardNumber: z.number().int().positive() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseDisabilityCause)
      .where(
        eq(
          wardWiseDisabilityCause.wardNumber,
          input.wardNumber,
        ),
      )
      .orderBy(
        wardWiseDisabilityCause.disabilityCause,
      );

    return data;
  });

// Create a new ward-wise disability cause entry
export const createWardWiseDisabilityCause = protectedProcedure
  .input(wardWiseDisabilityCauseSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise disability cause data",
      });
    }

    // Check if entry already exists for this ward and disability cause
    const existing = await ctx.db
      .select({ id: wardWiseDisabilityCause.id })
      .from(wardWiseDisabilityCause)
      .where(
        and(
          eq(
            wardWiseDisabilityCause.wardNumber,
            input.wardNumber,
          ),
          eq(
            wardWiseDisabilityCause.disabilityCause,
            input.disabilityCause as "CONGENITAL" | "ACCIDENT" | "MALNUTRITION" | "DISEASE" | "CONFLICT" | "OTHER",
          ),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and disability cause ${input.disabilityCause} already exists`,
      });
    }

    // Create new record
    await ctx.db
      .insert(wardWiseDisabilityCause)
      .values({
        id: input.id || uuidv4(),
        wardNumber: input.wardNumber,
        disabilityCause: input.disabilityCause as "CONGENITAL" | "ACCIDENT" | "MALNUTRITION" | "DISEASE" | "CONFLICT" | "OTHER",
        population: input.population,
      });

    return { success: true };
  });

// Update an existing ward-wise disability cause entry
export const updateWardWiseDisabilityCause = protectedProcedure
  .input(updateWardWiseDisabilityCauseSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise disability cause data",
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
      .select({ id: wardWiseDisabilityCause.id })
      .from(wardWiseDisabilityCause)
      .where(eq(wardWiseDisabilityCause.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseDisabilityCause)
      .set({
        wardNumber: input.wardNumber,
        disabilityCause: input.disabilityCause as "CONGENITAL" | "ACCIDENT" | "MALNUTRITION" | "DISEASE" | "CONFLICT" | "OTHER",
        population: input.population,
      })
      .where(eq(wardWiseDisabilityCause.id, input.id));

    return { success: true };
  });

// Delete a ward-wise disability cause entry
export const deleteWardWiseDisabilityCause = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise disability cause data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseDisabilityCause)
      .where(eq(wardWiseDisabilityCause.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseDisabilityCauseSummary = publicProcedure
  .query(async ({ ctx }) => {
    try {
      // Get total counts by disability cause across all wards
      const summarySql = sql`
        SELECT 
          disability_cause, 
          SUM(population) as total_population
        FROM 
          acme_ward_wise_disability_cause
        GROUP BY 
          disability_cause
        ORDER BY 
          disability_cause
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error(
        "Error in getWardWiseDisabilityCauseSummary:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise disability cause summary",
      });
    }
  });

// Export the router with all procedures
export const wardWiseDisabilityCauseRouter = createTRPCRouter({
  getAll: getAllWardWiseDisabilityCause,
  getByWard: getWardWiseDisabilityCauseByWard,
  create: createWardWiseDisabilityCause,
  update: updateWardWiseDisabilityCause,
  delete: deleteWardWiseDisabilityCause,
  summary: getWardWiseDisabilityCauseSummary,
});
