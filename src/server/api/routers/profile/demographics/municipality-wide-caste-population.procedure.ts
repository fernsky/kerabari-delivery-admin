import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityWideCastePopulation } from "@/server/db/schema/profile/demographics/municipality-wide-caste-population";
import { wardWiseCastePopulation } from "@/server/db/schema/profile/demographics/ward-wise-caste-population";
import { eq, and, desc, sql, sum } from "drizzle-orm";
import {
  municipalityWideCastePopulationSchema,
  municipalityWideCastePopulationFilterSchema,
  updateMunicipalityWideCastePopulationSchema,
  casteOptions,
} from "./municipality-wide-caste-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { CasteTypes } from "@/server/db/schema/common/enums";

// Get all municipality-wide caste population data with optional filtering
export const getAllMunicipalityWideCastePopulation = publicProcedure
  .input(municipalityWideCastePopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try to get data from municipality-wide table
      let data: any[];
      try {
        const baseQuery = ctx.db.select().from(municipalityWideCastePopulation);

        let conditions = [];
        if (input?.casteType) {
          conditions.push(eq(municipalityWideCastePopulation.casteType, input.casteType as keyof typeof CasteTypes));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        data = await queryWithFilters.orderBy(municipalityWideCastePopulation.casteType);
      } catch (err) {
        console.log("Municipality-wide table not available, aggregating from ward-wise data:", err);
        data = [];
      }

      // If no data from municipality-wide table, aggregate from ward-wise data
      if (!data || data.length === 0) {
        try {
          const aggregatedData = await ctx.db
            .select({
              casteType: wardWiseCastePopulation.casteType,
              population: sum(wardWiseCastePopulation.population).as('total_population'),
            })
            .from(wardWiseCastePopulation)
            .groupBy(wardWiseCastePopulation.casteType)
            .orderBy(wardWiseCastePopulation.casteType);

          data = aggregatedData.map(item => ({
            id: `aggregated_${item.casteType}`,
            casteType: item.casteType,
            population: parseInt(String(item.population || 0)),
            updatedAt: new Date(),
            createdAt: new Date(),
          }));

          // Apply filters if needed
          if (input?.casteType) {
            data = data.filter(item => item.casteType === input.casteType);
          }
        } catch (aggregateErr) {
          console.error("Failed to aggregate ward-wise data:", aggregateErr);
          data = [];
        }
      }

      // Transform the data to include Nepali caste names
      return data.map(item => ({
        ...item,
        casteTypeDisplay: CasteTypes[item.casteType as keyof typeof CasteTypes] || item.casteType,
      }));
    } catch (error) {
      console.error("Error fetching municipality-wide caste population data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get summary of caste population with detailed statistics
export const getMunicipalityWideCastePopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try to get data from municipality-wide table
      let data: any[];
      try {
        const baseQuery = ctx.db.select().from(municipalityWideCastePopulation);
        data = await baseQuery.orderBy(municipalityWideCastePopulation.casteType);
      } catch (err) {
        console.log("Municipality-wide table not available, aggregating from ward-wise data:", err);
        data = [];
      }

      // If no data from municipality-wide table, aggregate from ward-wise data
      if (!data || data.length === 0) {
        try {
          const aggregatedData = await ctx.db
            .select({
              casteType: wardWiseCastePopulation.casteType,
              population: sum(wardWiseCastePopulation.population).as('total_population'),
            })
            .from(wardWiseCastePopulation)
            .groupBy(wardWiseCastePopulation.casteType)
            .orderBy(wardWiseCastePopulation.casteType);

          data = aggregatedData.map(item => ({
            id: `aggregated_${item.casteType}`,
            casteType: item.casteType,
            population: parseInt(String(item.population || 0)),
            updatedAt: new Date(),
            createdAt: new Date(),
          }));
        } catch (aggregateErr) {
          console.error("Failed to aggregate ward-wise data:", aggregateErr);
          data = [];
        }
      }

      // Transform the data to include Nepali caste names
      const casteData = data.map(item => ({
        ...item,
        casteTypeDisplay: CasteTypes[item.casteType as keyof typeof CasteTypes] || item.casteType,
      }));

      // Calculate total population
      const totalPopulation = casteData.reduce((sum: number, item: any) => sum + (item.population || 0), 0);

      // Process data with percentages and rankings
      const summaryData = casteData
        .filter((item: any) => (item.population || 0) > 0)
        .map((item: any) => ({
          ...item,
          percentage: totalPopulation > 0 ? ((item.population || 0) / totalPopulation) * 100 : 0,
        }))
        .sort((a: any, b: any) => (b.population || 0) - (a.population || 0));

      return {
        totalPopulation,
        casteData: summaryData,
        totalCastes: summaryData.length,
        majorCastes: summaryData.filter((item: any) => item.percentage >= 5), // Castes with 5% or more
        minorCastes: summaryData.filter((item: any) => item.percentage < 5 && item.percentage >= 1), // 1-5%
        otherCastes: summaryData.filter((item: any) => item.percentage < 1), // Less than 1%
      };
    } catch (error) {
      console.error("Error in getMunicipalityWideCastePopulationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve caste population summary",
      });
    }
  }
);

// Create a new municipality-wide caste population entry
export const createMunicipalityWideCastePopulation = protectedProcedure
  .input(municipalityWideCastePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create municipality-wide caste population data",
      });
    }

    // Check if entry already exists for this caste type
    const existing = await ctx.db
      .select({ id: municipalityWideCastePopulation.id })
      .from(municipalityWideCastePopulation)
      .where(eq(municipalityWideCastePopulation.casteType, input.casteType as keyof typeof CasteTypes))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for caste type ${input.casteType} already exists`,
      });
    }

    // Verify caste type is valid
    if (!Object.keys(CasteTypes).includes(input.casteType)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Invalid caste type: ${input.casteType}`,
      });
    }

    const processedInput = {
      id: input.id || uuidv4(),
      casteType: input.casteType as keyof typeof CasteTypes,
      population: input.population,
    };

    // Create new record
    await ctx.db.insert(municipalityWideCastePopulation).values(processedInput);

    return { success: true, id: processedInput.id };
  });

// Update an existing municipality-wide caste population entry
export const updateMunicipalityWideCastePopulation = protectedProcedure
  .input(updateMunicipalityWideCastePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update municipality-wide caste population data",
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
      .select({ id: municipalityWideCastePopulation.id })
      .from(municipalityWideCastePopulation)
      .where(eq(municipalityWideCastePopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    const processedInput: Record<string, unknown> = { id: input.id };

    if (input.casteType !== undefined) {
      // Verify caste type is valid
      if (!Object.keys(CasteTypes).includes(input.casteType)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid caste type: ${input.casteType}`,
        });
      }
      processedInput.casteType = input.casteType;
    }
    if (input.population !== undefined) processedInput.population = input.population;

    // Update the record
    await ctx.db
      .update(municipalityWideCastePopulation)
      .set(processedInput)
      .where(eq(municipalityWideCastePopulation.id, input.id));

    return { success: true };
  });

// Delete a municipality-wide caste population entry
export const deleteMunicipalityWideCastePopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete municipality-wide caste population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWideCastePopulation)
      .where(eq(municipalityWideCastePopulation.id, input.id));

    return { success: true };
  });

// Export the router with all procedures
export const municipalityWideCastePopulationRouter = createTRPCRouter({
  getAll: getAllMunicipalityWideCastePopulation,
  summary: getMunicipalityWideCastePopulationSummary,
  create: createMunicipalityWideCastePopulation,
  update: updateMunicipalityWideCastePopulation,
  delete: deleteMunicipalityWideCastePopulation,
}); 