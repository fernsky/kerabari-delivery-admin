import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardAgeWisePopulation } from "@/server/db/schema/profile/demographics/ward-age-wise-population";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardAgeWisePopulationSchema,
  wardAgeWisePopulationFilterSchema,
  updateWardAgeWisePopulationSchema,
  AgeGroup,
  Gender,
} from "./ward-age-wise-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward age-wise population data with optional filtering
export const getAllWardAgeWisePopulation = publicProcedure
  .input(wardAgeWisePopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(wardAgeWisePopulation);

      let conditions = [];

      if (input?.wardNumber) {
        conditions.push(eq(wardAgeWisePopulation.wardNumber, input.wardNumber));
      }

      if (input?.ageGroup) {
        conditions.push(eq(wardAgeWisePopulation.ageGroup, input.ageGroup));
      }

      if (input?.gender) {
        conditions.push(eq(wardAgeWisePopulation.gender, input.gender));
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      // Sort by ward number, age group, and gender
      const data = await queryWithFilters.orderBy(
        wardAgeWisePopulation.wardNumber,
        wardAgeWisePopulation.ageGroup,
        wardAgeWisePopulation.gender,
      );

      return data;
    } catch (error) {
      console.error("Error fetching ward age-wise population data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardAgeWisePopulationByWard = publicProcedure
  .input(z.object({ wardNumber: z.number().int().min(1) }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardAgeWisePopulation)
      .where(eq(wardAgeWisePopulation.wardNumber, input.wardNumber))
      .orderBy(wardAgeWisePopulation.ageGroup, wardAgeWisePopulation.gender);

    return data;
  });

// Create a new ward age-wise population entry
export const createWardAgeWisePopulation = protectedProcedure
  .input(wardAgeWisePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward age-wise population data",
      });
    }

    // Check if entry already exists for this ward, age group, and gender
    const existing = await ctx.db
      .select({ id: wardAgeWisePopulation.id })
      .from(wardAgeWisePopulation)
      .where(
        and(
          eq(wardAgeWisePopulation.wardNumber, input.wardNumber),
          eq(wardAgeWisePopulation.ageGroup, input.ageGroup as AgeGroup),
          eq(wardAgeWisePopulation.gender, input.gender as Gender),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward ${input.wardNumber}, age group ${input.ageGroup}, and gender ${input.gender} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardAgeWisePopulation).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      ageGroup: input.ageGroup as AgeGroup,
      gender: input.gender as Gender,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward age-wise population entry
export const updateWardAgeWisePopulation = protectedProcedure
  .input(updateWardAgeWisePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward age-wise population data",
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
      .select({ id: wardAgeWisePopulation.id })
      .from(wardAgeWisePopulation)
      .where(eq(wardAgeWisePopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardAgeWisePopulation)
      .set({
        wardNumber: input.wardNumber,
        ageGroup: input.ageGroup as AgeGroup,
        gender: input.gender as Gender,
        population: input.population,
      })
      .where(eq(wardAgeWisePopulation.id, input.id));

    return { success: true };
  });

// Delete a ward age-wise population entry
export const deleteWardAgeWisePopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward age-wise population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardAgeWisePopulation)
      .where(eq(wardAgeWisePopulation.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardAgeWisePopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get totals by age group and gender
      const summarySql = sql`
        SELECT 
          age_group,
          gender, 
          SUM(population) as total_population
        FROM 
          acme_ward_age_wise_population
        GROUP BY 
          age_group, gender
        ORDER BY 
          age_group, gender
      `;

      const summaryData = await ctx.db.execute(summarySql);

      // Get total by ward
      const wardSummarySql = sql`
        SELECT 
          ward_number,
          gender, 
          SUM(population) as total_population
        FROM 
          acme_ward_age_wise_population
        GROUP BY 
          ward_number, gender
        ORDER BY 
          ward_number, gender
      `;

      const wardSummaryData = await ctx.db.execute(wardSummarySql);

      return {
        byAgeAndGender: summaryData,
        byWardAndGender: wardSummaryData,
      };
    } catch (error) {
      console.error("Error in getWardAgeWisePopulationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward age-wise population summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardAgeWisePopulationRouter = createTRPCRouter({
  getAll: getAllWardAgeWisePopulation,
  getByWard: getWardAgeWisePopulationByWard,
  create: createWardAgeWisePopulation,
  update: updateWardAgeWisePopulation,
  delete: deleteWardAgeWisePopulation,
  summary: getWardAgeWisePopulationSummary,
});
