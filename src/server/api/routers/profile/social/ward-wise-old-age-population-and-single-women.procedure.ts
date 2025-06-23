import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseOldAgePopulationAndSingleWomen } from "@/server/db/schema/profile/social/ward-wise-old-age-population-and-single-women";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseOldAgePopulationAndSingleWomenSchema,
  wardWiseOldAgePopulationAndSingleWomenFilterSchema,
  updateWardWiseOldAgePopulationAndSingleWomenSchema,
} from "./ward-wise-old-age-population-and-single-women.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise old age population and single women data with optional filtering
export const getAllWardWiseOldAgePopulationAndSingleWomen = publicProcedure
  .input(wardWiseOldAgePopulationAndSingleWomenFilterSchema.optional())
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
          .from(wardWiseOldAgePopulationAndSingleWomen);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(
              wardWiseOldAgePopulationAndSingleWomen.wardNumber,
              input.wardNumber,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number
        data = await queryWithFilters.orderBy(
          wardWiseOldAgePopulationAndSingleWomen.wardNumber,
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
            male_old_age_population,
            female_old_age_population,
            single_women_population,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_old_age_population_and_single_women
          ORDER BY 
            ward_number
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            maleOldAgePopulation: parseInt(
              String(row.male_old_age_population || "0"),
            ),
            femaleOldAgePopulation: parseInt(
              String(row.female_old_age_population || "0"),
            ),
            singleWomenPopulation: parseInt(
              String(row.single_women_population || "0"),
            ),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
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
        "Error fetching ward-wise old age population and single women data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseOldAgePopulationAndSingleWomenByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseOldAgePopulationAndSingleWomen)
      .where(
        eq(wardWiseOldAgePopulationAndSingleWomen.wardNumber, input.wardNumber),
      )
      .limit(1);

    return data[0] || null;
  });

// Create a new ward-wise old age population and single women entry
export const createWardWiseOldAgePopulationAndSingleWomen = protectedProcedure
  .input(wardWiseOldAgePopulationAndSingleWomenSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise old age population and single women data",
      });
    }

    // Check if entry already exists for this ward
    const existing = await ctx.db
      .select({ id: wardWiseOldAgePopulationAndSingleWomen.id })
      .from(wardWiseOldAgePopulationAndSingleWomen)
      .where(
        eq(wardWiseOldAgePopulationAndSingleWomen.wardNumber, input.wardNumber),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseOldAgePopulationAndSingleWomen).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      maleOldAgePopulation: input.maleOldAgePopulation,
      femaleOldAgePopulation: input.femaleOldAgePopulation,
      singleWomenPopulation: input.singleWomenPopulation,
    });

    return { success: true };
  });

// Update an existing ward-wise old age population and single women entry
export const updateWardWiseOldAgePopulationAndSingleWomen = protectedProcedure
  .input(updateWardWiseOldAgePopulationAndSingleWomenSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise old age population and single women data",
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
      .select({ id: wardWiseOldAgePopulationAndSingleWomen.id })
      .from(wardWiseOldAgePopulationAndSingleWomen)
      .where(eq(wardWiseOldAgePopulationAndSingleWomen.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseOldAgePopulationAndSingleWomen)
      .set({
        wardNumber: input.wardNumber,
        maleOldAgePopulation: input.maleOldAgePopulation,
        femaleOldAgePopulation: input.femaleOldAgePopulation,
        singleWomenPopulation: input.singleWomenPopulation,
      })
      .where(eq(wardWiseOldAgePopulationAndSingleWomen.id, input.id));

    return { success: true };
  });

// Delete a ward-wise old age population and single women entry
export const deleteWardWiseOldAgePopulationAndSingleWomen = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise old age population and single women data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseOldAgePopulationAndSingleWomen)
      .where(eq(wardWiseOldAgePopulationAndSingleWomen.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseOldAgePopulationAndSingleWomenSummary =
  publicProcedure.query(async ({ ctx }) => {
    try {
      // Get total counts across all wards
      const summarySql = sql`
        SELECT 
          SUM(male_old_age_population) as total_male_old_age_population,
          SUM(female_old_age_population) as total_female_old_age_population,
          SUM(single_women_population) as total_single_women_population,
          SUM(male_old_age_population + female_old_age_population) as total_old_age_population
        FROM 
          ward_wise_old_age_population_and_single_women
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return (
        summaryData[0] || {
          total_male_old_age_population: 0,
          total_female_old_age_population: 0,
          total_single_women_population: 0,
          total_old_age_population: 0,
        }
      );
    } catch (error) {
      console.error(
        "Error in getWardWiseOldAgePopulationAndSingleWomenSummary:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Failed to retrieve ward-wise old age population and single women summary",
      });
    }
  });

// Export the router with all procedures
export const wardWiseOldAgePopulationAndSingleWomenRouter = createTRPCRouter({
  getAll: getAllWardWiseOldAgePopulationAndSingleWomen,
  getByWard: getWardWiseOldAgePopulationAndSingleWomenByWard,
  create: createWardWiseOldAgePopulationAndSingleWomen,
  update: updateWardWiseOldAgePopulationAndSingleWomen,
  delete: deleteWardWiseOldAgePopulationAndSingleWomen,
  summary: getWardWiseOldAgePopulationAndSingleWomenSummary,
});
