import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardAgeGenderWiseDeceasedPopulation } from "@/server/db/schema/profile/demographics/ward-age-gender-wise-deceased-population";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardAgeGenderWiseDeceasedPopulationSchema,
  wardAgeGenderWiseDeceasedPopulationFilterSchema,
  updateWardAgeGenderWiseDeceasedPopulationSchema,
} from "./ward-age-gender-wise-deceased-population.schema";
import { AgeGroup, Gender } from "./ward-age-wise-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward age-gender-wise deceased population data with optional filtering
export const getAllWardAgeGenderWiseDeceasedPopulation = publicProcedure
  .input(wardAgeGenderWiseDeceasedPopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(wardAgeGenderWiseDeceasedPopulation);

      let conditions = [];

      if (input?.wardNumber) {
        conditions.push(
          eq(wardAgeGenderWiseDeceasedPopulation.wardNumber, input.wardNumber)
        );
      }

      if (input?.ageGroup) {
        conditions.push(
          eq(wardAgeGenderWiseDeceasedPopulation.ageGroup, input.ageGroup)
        );
      }

      if (input?.gender) {
        conditions.push(
          eq(wardAgeGenderWiseDeceasedPopulation.gender, input.gender)
        );
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      // Sort by ward number, age group, and gender
      const data = await queryWithFilters.orderBy(
        wardAgeGenderWiseDeceasedPopulation.wardNumber,
        wardAgeGenderWiseDeceasedPopulation.ageGroup,
        wardAgeGenderWiseDeceasedPopulation.gender
      );

      return data;
    } catch (error) {
      console.error("Error fetching ward age-gender-wise deceased population data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardAgeGenderWiseDeceasedPopulationByWard = publicProcedure
  .input(z.object({ wardNumber: z.number().int().min(1) }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardAgeGenderWiseDeceasedPopulation)
      .where(eq(wardAgeGenderWiseDeceasedPopulation.wardNumber, input.wardNumber))
      .orderBy(wardAgeGenderWiseDeceasedPopulation.ageGroup, wardAgeGenderWiseDeceasedPopulation.gender);

    return data;
  });

// Create a new ward age-gender-wise deceased population entry
export const createWardAgeGenderWiseDeceasedPopulation = protectedProcedure
  .input(wardAgeGenderWiseDeceasedPopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward age-gender-wise deceased population data",
      });
    }

    // Check if entry already exists for this ward, age group, and gender
    const existing = await ctx.db
      .select({ id: wardAgeGenderWiseDeceasedPopulation.id })
      .from(wardAgeGenderWiseDeceasedPopulation)
      .where(
        and(
          eq(wardAgeGenderWiseDeceasedPopulation.wardNumber, input.wardNumber),
          eq(wardAgeGenderWiseDeceasedPopulation.ageGroup, input.ageGroup as AgeGroup),
          eq(wardAgeGenderWiseDeceasedPopulation.gender, input.gender as Gender)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward ${input.wardNumber}, age group ${input.ageGroup}, and gender ${input.gender} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardAgeGenderWiseDeceasedPopulation).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      ageGroup: input.ageGroup as AgeGroup,
      gender: input.gender as Gender,
      deceasedPopulation: input.deceasedPopulation,
    });

    return { success: true };
  });

// Update an existing ward age-gender-wise deceased population entry
export const updateWardAgeGenderWiseDeceasedPopulation = protectedProcedure
  .input(updateWardAgeGenderWiseDeceasedPopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward age-gender-wise deceased population data",
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
      .select({ id: wardAgeGenderWiseDeceasedPopulation.id })
      .from(wardAgeGenderWiseDeceasedPopulation)
      .where(eq(wardAgeGenderWiseDeceasedPopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardAgeGenderWiseDeceasedPopulation)
      .set({
        wardNumber: input.wardNumber,
        ageGroup: input.ageGroup as AgeGroup,
        gender: input.gender as Gender,
        deceasedPopulation: input.deceasedPopulation,
      })
      .where(eq(wardAgeGenderWiseDeceasedPopulation.id, input.id));

    return { success: true };
  });

// Delete a ward age-gender-wise deceased population entry
export const deleteWardAgeGenderWiseDeceasedPopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward age-gender-wise deceased population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardAgeGenderWiseDeceasedPopulation)
      .where(eq(wardAgeGenderWiseDeceasedPopulation.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardAgeGenderWiseDeceasedPopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get totals by age group and gender
      const summarySql = sql`
        SELECT 
          age_group,
          gender, 
          SUM(deceased_population) as total_deceased
        FROM 
          acme_ward_age_gender_wise_deceased_population
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
          SUM(deceased_population) as total_deceased
        FROM 
          acme_ward_age_gender_wise_deceased_population
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
      console.error("Error in getWardAgeGenderWiseDeceasedPopulationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward age-gender-wise deceased population summary",
      });
    }
  }
);

// Export the router with all procedures
export const wardAgeGenderWiseDeceasedPopulationRouter = createTRPCRouter({
  getAll: getAllWardAgeGenderWiseDeceasedPopulation,
  getByWard: getWardAgeGenderWiseDeceasedPopulationByWard,
  create: createWardAgeGenderWiseDeceasedPopulation,
  update: updateWardAgeGenderWiseDeceasedPopulation,
  delete: deleteWardAgeGenderWiseDeceasedPopulation,
  summary: getWardAgeGenderWiseDeceasedPopulationSummary,
});
