import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityWideReligionPopulation } from "@/server/db/schema/profile/demographics/municipality-wide-religion-population";
import { wardWiseReligionPopulation } from "@/server/db/schema/profile/demographics/ward-wise-religion-population";
import { eq, and, desc, sql, sum } from "drizzle-orm";
import {
  municipalityWideReligionPopulationSchema,
  municipalityWideReligionPopulationFilterSchema,
  updateMunicipalityWideReligionPopulationSchema,
  religionOptions,
  RELIGION_LABELS,
} from "./municipality-wide-religion-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all municipality-wide religion population data with optional filtering
export const getAllMunicipalityWideReligionPopulation = publicProcedure
  .input(municipalityWideReligionPopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try to get data from municipality-wide table
      let data: any[];
      try {
        const baseQuery = ctx.db.select().from(municipalityWideReligionPopulation);

        let conditions = [];
        if (input?.religionType) {
          conditions.push(eq(municipalityWideReligionPopulation.religionType, input.religionType));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        data = await queryWithFilters.orderBy(municipalityWideReligionPopulation.religionType);
      } catch (err) {
        console.log("Municipality-wide table not available, aggregating from ward-wise data:", err);
        data = [];
      }

      // If no data from municipality-wide table, aggregate from ward-wise data
      if (!data || data.length === 0) {
        try {
          const aggregatedData = await ctx.db
            .select({
              religionType: wardWiseReligionPopulation.religionType,
              population: sum(wardWiseReligionPopulation.population).as('total_population'),
            })
            .from(wardWiseReligionPopulation)
            .groupBy(wardWiseReligionPopulation.religionType)
            .orderBy(wardWiseReligionPopulation.religionType);

          data = aggregatedData.map(item => ({
            id: `aggregated_${item.religionType}`,
            religionType: item.religionType,
            population: parseInt(String(item.population || 0)),
            updatedAt: new Date(),
            createdAt: new Date(),
          }));

          // Apply filters if needed
          if (input?.religionType) {
            data = data.filter(item => item.religionType === input.religionType);
          }
        } catch (aggregateErr) {
          console.error("Failed to aggregate ward-wise data:", aggregateErr);
          data = [];
        }
      }

      // Transform the data to include Nepali religion names
      return data.map(item => ({
        ...item,
        religionTypeDisplay: RELIGION_LABELS[item.religionType] || item.religionType,
      }));
    } catch (error) {
      console.error("Error fetching municipality-wide religion population data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get summary of religion population with detailed statistics
export const getMunicipalityWideReligionPopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try to get data from municipality-wide table
      let data: any[];
      try {
        const baseQuery = ctx.db.select().from(municipalityWideReligionPopulation);
        data = await baseQuery.orderBy(municipalityWideReligionPopulation.religionType);
      } catch (err) {
        console.log("Municipality-wide table not available, aggregating from ward-wise data:", err);
        data = [];
      }

      // If no data from municipality-wide table, aggregate from ward-wise data
      if (!data || data.length === 0) {
        try {
          const aggregatedData = await ctx.db
            .select({
              religionType: wardWiseReligionPopulation.religionType,
              population: sum(wardWiseReligionPopulation.population).as('total_population'),
            })
            .from(wardWiseReligionPopulation)
            .groupBy(wardWiseReligionPopulation.religionType)
            .orderBy(wardWiseReligionPopulation.religionType);

          data = aggregatedData.map(item => ({
            id: `aggregated_${item.religionType}`,
            religionType: item.religionType,
            population: parseInt(String(item.population || 0)),
            updatedAt: new Date(),
            createdAt: new Date(),
          }));
        } catch (aggregateErr) {
          console.error("Failed to aggregate ward-wise data:", aggregateErr);
          data = [];
        }
      }

      // Transform the data to include Nepali religion names
      const religionData = data.map(item => ({
        ...item,
        religionTypeDisplay: RELIGION_LABELS[item.religionType] || item.religionType,
      }));

      // Calculate total population
      const totalPopulation = religionData.reduce((sum: number, item: any) => sum + (item.population || 0), 0);

      // Process data with percentages and rankings
      const summaryData = religionData
        .filter((item: any) => (item.population || 0) > 0)
        .map((item: any) => ({
          ...item,
          percentage: totalPopulation > 0 ? ((item.population || 0) / totalPopulation) * 100 : 0,
        }))
        .sort((a: any, b: any) => (b.population || 0) - (a.population || 0));

      return {
        totalPopulation,
        religionData: summaryData,
        totalReligions: summaryData.length,
        majorReligions: summaryData.filter((item: any) => item.percentage >= 5), // Religions with 5% or more
        minorReligions: summaryData.filter((item: any) => item.percentage < 5 && item.percentage >= 1), // 1-5%
        otherReligions: summaryData.filter((item: any) => item.percentage < 1), // Less than 1%
      };
    } catch (error) {
      console.error("Error in getMunicipalityWideReligionPopulationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve religion population summary",
      });
    }
  }
);

// Create a new municipality-wide religion population entry
export const createMunicipalityWideReligionPopulation = protectedProcedure
  .input(municipalityWideReligionPopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create municipality-wide religion population data",
      });
    }

    // Check if entry already exists for this religion type
    const existing = await ctx.db
      .select({ id: municipalityWideReligionPopulation.id })
      .from(municipalityWideReligionPopulation)
      .where(eq(municipalityWideReligionPopulation.religionType, input.religionType))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for religion type ${input.religionType} already exists`,
      });
    }

    const processedInput = {
      id: input.id || uuidv4(),
      religionType: input.religionType,
      population: input.population,
    };

    // Create new record
    await ctx.db.insert(municipalityWideReligionPopulation).values(processedInput);

    return { success: true, id: processedInput.id };
  });

// Update an existing municipality-wide religion population entry
export const updateMunicipalityWideReligionPopulation = protectedProcedure
  .input(updateMunicipalityWideReligionPopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update municipality-wide religion population data",
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
      .select({ id: municipalityWideReligionPopulation.id })
      .from(municipalityWideReligionPopulation)
      .where(eq(municipalityWideReligionPopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    const processedInput: Record<string, unknown> = { id: input.id };

    if (input.religionType !== undefined) processedInput.religionType = input.religionType;
    if (input.population !== undefined) processedInput.population = input.population;

    // Update the record
    await ctx.db
      .update(municipalityWideReligionPopulation)
      .set(processedInput)
      .where(eq(municipalityWideReligionPopulation.id, input.id));

    return { success: true };
  });

// Delete a municipality-wide religion population entry
export const deleteMunicipalityWideReligionPopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete municipality-wide religion population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWideReligionPopulation)
      .where(eq(municipalityWideReligionPopulation.id, input.id));

    return { success: true };
  });

// Export the router with all procedures
export const municipalityWideReligionPopulationRouter = createTRPCRouter({
  getAll: getAllMunicipalityWideReligionPopulation,
  summary: getMunicipalityWideReligionPopulationSummary,
  create: createMunicipalityWideReligionPopulation,
  update: updateMunicipalityWideReligionPopulation,
  delete: deleteMunicipalityWideReligionPopulation,
}); 