import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseElectricitySource } from "@/server/db/schema/profile/physical/ward-wise-electricity-source";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseElectricitySourceSchema,
  wardWiseElectricitySourceFilterSchema,
  updateWardWiseElectricitySourceSchema,
  ElectricitySourceTypeEnum,
} from "./ward-wise-electricity-source.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise electricity source data with optional filtering
export const getAllWardWiseElectricitySource = publicProcedure
  .input(wardWiseElectricitySourceFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseElectricitySource);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseElectricitySource.wardNumber, input.wardNumber),
          );
        }

        if (input?.electricitySource) {
          conditions.push(
            eq(
              wardWiseElectricitySource.electricitySource,
              input.electricitySource,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and electricity source
        data = await queryWithFilters.orderBy(
          wardWiseElectricitySource.wardNumber,
          wardWiseElectricitySource.electricitySource,
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
            electricity_source,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_electricity_source
          ORDER BY 
            ward_number, electricity_source
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            electricitySource: row.electricity_source,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.electricitySource) {
            data = data.filter(
              (item) => item.electricitySource === input.electricitySource,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise electricity source data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseElectricitySourceByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseElectricitySource)
      .where(eq(wardWiseElectricitySource.wardNumber, input.wardNumber))
      .orderBy(wardWiseElectricitySource.electricitySource);

    return data;
  });

// Create a new ward-wise electricity source entry
export const createWardWiseElectricitySource = protectedProcedure
  .input(wardWiseElectricitySourceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise electricity source data",
      });
    }

    // Check if entry already exists for this ward and electricity source
    const existing = await ctx.db
      .select({ id: wardWiseElectricitySource.id })
      .from(wardWiseElectricitySource)
      .where(
        and(
          eq(wardWiseElectricitySource.wardNumber, input.wardNumber),
          eq(
            wardWiseElectricitySource.electricitySource,
            input.electricitySource,
          ),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and electricity source ${input.electricitySource} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseElectricitySource).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      electricitySource: input.electricitySource,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise electricity source entry
export const updateWardWiseElectricitySource = protectedProcedure
  .input(updateWardWiseElectricitySourceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise electricity source data",
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
      .select({ id: wardWiseElectricitySource.id })
      .from(wardWiseElectricitySource)
      .where(eq(wardWiseElectricitySource.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseElectricitySource)
      .set({
        wardNumber: input.wardNumber,
        electricitySource: input.electricitySource,
        households: input.households,
      })
      .where(eq(wardWiseElectricitySource.id, input.id));

    return { success: true };
  });

// Delete a ward-wise electricity source entry
export const deleteWardWiseElectricitySource = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise electricity source data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseElectricitySource)
      .where(eq(wardWiseElectricitySource.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseElectricitySourceSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by electricity source across all wards
      const summarySql = sql`
        SELECT 
          electricity_source, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_electricity_source
        GROUP BY 
          electricity_source
        ORDER BY 
          electricity_source
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseElectricitySourceSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise electricity source summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseElectricitySourceRouter = createTRPCRouter({
  getAll: getAllWardWiseElectricitySource,
  getByWard: getWardWiseElectricitySourceByWard,
  create: createWardWiseElectricitySource,
  update: updateWardWiseElectricitySource,
  delete: deleteWardWiseElectricitySource,
  summary: getWardWiseElectricitySourceSummary,
});
