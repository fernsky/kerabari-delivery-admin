import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardAgeWiseEconomicallyActivePopulation } from "@/server/db/schema/profile/demographics/ward-age-wise-economically-active-population";
import { eq, and, sql } from "drizzle-orm";
import {
  wardAgeWiseEconomicallyActivePopulationSchema,
  wardAgeWiseEconomicallyActivePopulationFilterSchema,
  updateWardAgeWiseEconomicallyActivePopulationSchema,
  EconomicallyActiveAgeGroupEnum,
} from "./ward-age-wise-economically-active-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Function to normalize age group values from ACME table
function normalizeAgeGroupFromACME(ageGroup: unknown): string {
  const ageGroupStr = String(ageGroup);
  const normalized = ageGroupStr.toUpperCase();
  // Map ACME table values to expected enum values
  const mapping: Record<string, string> = {
    'AGE_0_TO_14': 'AGE_0_TO_14',
    'AGE_15_TO_59': 'AGE_15_TO_59',
    'AGE_60_PLUS': 'AGE_60_PLUS',
    '0_TO_14': 'AGE_0_TO_14',
    '15_TO_59': 'AGE_15_TO_59',
    '60_PLUS': 'AGE_60_PLUS',
    '0-14': 'AGE_0_TO_14',
    '15-59': 'AGE_15_TO_59',
    '60+': 'AGE_60_PLUS',
  };
  return mapping[normalized] || ageGroupStr;
}

// Get all ward-age-wise economically active population data with optional filtering
export const getAllWardAgeWiseEconomicallyActivePopulation = publicProcedure
  .input(wardAgeWiseEconomicallyActivePopulationFilterSchema.optional())
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
          .from(wardAgeWiseEconomicallyActivePopulation);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(
              wardAgeWiseEconomicallyActivePopulation.wardNumber,
              input.wardNumber,
            ),
          );
        }

        if (input?.ageGroup) {
          conditions.push(
            eq(
              wardAgeWiseEconomicallyActivePopulation.ageGroup,
              input.ageGroup,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and age group
        data = await queryWithFilters.orderBy(
          wardAgeWiseEconomicallyActivePopulation.wardNumber,
          wardAgeWiseEconomicallyActivePopulation.ageGroup,
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
            age_group,
            gender,
            population
          FROM 
            acme_ward_age_gender_wise_economically_active_population
          ORDER BY 
            ward_number, age_group, gender
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            ageGroup: normalizeAgeGroupFromACME(row.age_group),
            gender: String(row.gender || 'MALE'), // Default to MALE if gender is missing
            population: parseInt(String(row.population || "0")),
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.ageGroup) {
            data = data.filter((item) => item.ageGroup === input.ageGroup);
          }

          if (input?.gender) {
            data = data.filter((item) => item.gender === input.gender);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-age-wise economically active population data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardAgeWiseEconomicallyActivePopulationByWard = publicProcedure
  .input(z.object({ wardNumber: z.number().int().positive() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardAgeWiseEconomicallyActivePopulation)
      .where(
        eq(
          wardAgeWiseEconomicallyActivePopulation.wardNumber,
          input.wardNumber,
        ),
      )
      .orderBy(
        wardAgeWiseEconomicallyActivePopulation.ageGroup,
      );

    return data;
  });

// Create a new ward-age-wise economically active population entry
export const createWardAgeWiseEconomicallyActivePopulation = protectedProcedure
  .input(wardAgeWiseEconomicallyActivePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-age-wise economically active population data",
      });
    }

    // Check if entry already exists for this ward and age group
    const existing = await ctx.db
      .select({ id: wardAgeWiseEconomicallyActivePopulation.id })
      .from(wardAgeWiseEconomicallyActivePopulation)
      .where(
        and(
          eq(
            wardAgeWiseEconomicallyActivePopulation.wardNumber,
            input.wardNumber,
          ),
          eq(
            wardAgeWiseEconomicallyActivePopulation.ageGroup,
            input.ageGroup,
          ),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and age group ${input.ageGroup} already exists`,
      });
    }

    // Create new record
    await ctx.db
      .insert(wardAgeWiseEconomicallyActivePopulation)
      .values({
        id: input.id || uuidv4(),
        wardNumber: input.wardNumber,
        ageGroup: input.ageGroup,
        population: input.population,
      });

    return { success: true };
  });

// Update an existing ward-age-wise economically active population entry
export const updateWardAgeWiseEconomicallyActivePopulation = protectedProcedure
  .input(updateWardAgeWiseEconomicallyActivePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-age-wise economically active population data",
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
      .select({ id: wardAgeWiseEconomicallyActivePopulation.id })
      .from(wardAgeWiseEconomicallyActivePopulation)
      .where(eq(wardAgeWiseEconomicallyActivePopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardAgeWiseEconomicallyActivePopulation)
      .set({
        wardNumber: input.wardNumber,
        ageGroup: input.ageGroup,
        population: input.population,
      })
      .where(eq(wardAgeWiseEconomicallyActivePopulation.id, input.id));

    return { success: true };
  });

// Delete a ward-age-wise economically active population entry
export const deleteWardAgeWiseEconomicallyActivePopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-age-wise economically active population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardAgeWiseEconomicallyActivePopulation)
      .where(eq(wardAgeWiseEconomicallyActivePopulation.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardAgeWiseEconomicallyActivePopulationSummary = publicProcedure
  .query(async ({ ctx }) => {
    try {
      // Get total counts by age group across all wards
      const summarySql = sql`
        SELECT 
          age_group, 
          SUM(population) as total_population
        FROM 
          ward_age_wise_economically_active_population
        GROUP BY 
          age_group
        ORDER BY 
          age_group
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error(
        "Error in getWardAgeWiseEconomicallyActivePopulationSummary:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-age-wise economically active population summary",
      });
    }
  });

// Export the router with all procedures
export const wardAgeWiseEconomicallyActivePopulationRouter = createTRPCRouter({
  getAll: getAllWardAgeWiseEconomicallyActivePopulation,
  getByWard: getWardAgeWiseEconomicallyActivePopulationByWard,
  create: createWardAgeWiseEconomicallyActivePopulation,
  update: updateWardAgeWiseEconomicallyActivePopulation,
  delete: deleteWardAgeWiseEconomicallyActivePopulation,
  summary: getWardAgeWiseEconomicallyActivePopulationSummary,
});
