import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseReligionPopulation } from "@/server/db/schema/profile/demographics/ward-wise-religion-population";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseReligionPopulationSchema,
  wardWiseReligionPopulationFilterSchema,
  updateWardWiseReligionPopulationSchema,
  ReligionTypeEnum,
} from "./ward-wise-religion-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise religion population data with optional filtering
export const getAllWardWiseReligionPopulation = publicProcedure
  .input(wardWiseReligionPopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseReligionPopulation);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseReligionPopulation.wardNumber, input.wardNumber),
          );
        }

        if (input?.religionType) {
          conditions.push(
            eq(wardWiseReligionPopulation.religionType, input.religionType),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and religion type
        data = await queryWithFilters.orderBy(
          wardWiseReligionPopulation.wardNumber,
          wardWiseReligionPopulation.religionType,
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
            religion_type,
            population,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_religion_population
          ORDER BY 
            ward_number, religion_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            religionType: row.religion_type,
            population: parseInt(String(row.population || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.religionType) {
            data = data.filter(
              (item) => item.religionType === input.religionType,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-wise religion population data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseReligionPopulationByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseReligionPopulation)
      .where(eq(wardWiseReligionPopulation.wardNumber, input.wardNumber))
      .orderBy(wardWiseReligionPopulation.religionType);

    return data;
  });

// Create a new ward-wise religion population entry
export const createWardWiseReligionPopulation = protectedProcedure
  .input(wardWiseReligionPopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise religion population data",
      });
    }

    // Check if entry already exists for this ward and religion type
    const existing = await ctx.db
      .select({ id: wardWiseReligionPopulation.id })
      .from(wardWiseReligionPopulation)
      .where(
        and(
          eq(wardWiseReligionPopulation.wardNumber, input.wardNumber),
          eq(wardWiseReligionPopulation.religionType, input.religionType),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and religion ${input.religionType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseReligionPopulation).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      religionType: input.religionType,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward-wise religion population entry
export const updateWardWiseReligionPopulation = protectedProcedure
  .input(updateWardWiseReligionPopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise religion population data",
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
      .select({ id: wardWiseReligionPopulation.id })
      .from(wardWiseReligionPopulation)
      .where(eq(wardWiseReligionPopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseReligionPopulation)
      .set({
        wardNumber: input.wardNumber,
        religionType: input.religionType,
        population: input.population,
      })
      .where(eq(wardWiseReligionPopulation.id, input.id));

    return { success: true };
  });

// Delete a ward-wise religion population entry
export const deleteWardWiseReligionPopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise religion population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseReligionPopulation)
      .where(eq(wardWiseReligionPopulation.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseReligionPopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by religion type across all wards
      const summarySql = sql`
        SELECT 
          religion_type, 
          SUM(population) as total_population
        FROM 
          acme_ward_wise_religion_population
        GROUP BY 
          religion_type
        ORDER BY 
          religion_type
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseReligionPopulationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise religion population summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseReligionPopulationRouter = createTRPCRouter({
  getAll: getAllWardWiseReligionPopulation,
  getByWard: getWardWiseReligionPopulationByWard,
  create: createWardWiseReligionPopulation,
  update: updateWardWiseReligionPopulation,
  delete: deleteWardWiseReligionPopulation,
  summary: getWardWiseReligionPopulationSummary,
});
