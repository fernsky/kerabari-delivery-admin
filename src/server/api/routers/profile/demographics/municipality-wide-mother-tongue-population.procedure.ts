import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import {
  municipalityWideMotherTonguePopulationSchema,
  municipalityWideMotherTonguePopulationFilterSchema,
  updateMunicipalityWideMotherTonguePopulationSchema,
  MunicipalityWideMotherTonguePopulationData,
  MunicipalityWideMotherTonguePopulationFilter,
  MOTHER_TONGUE_LABELS,
} from "./municipality-wide-mother-tongue-population.schema";
import { eq, sql } from "drizzle-orm";
import { municipalityWideMotherTonguePopulation } from "../../../../db/schema/profile/demographics/municipality-wide-mother-tongue-population";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all municipality-wide mother tongue population data with optional filtering
export const getAllMunicipalityWideMotherTonguePopulation = publicProcedure
  .input(municipalityWideMotherTonguePopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(municipalityWideMotherTonguePopulation);

      let conditions = [];

      if (input?.motherTongue) {
        conditions.push(
          eq(municipalityWideMotherTonguePopulation.motherTongue, input.motherTongue),
        );
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(conditions[0])
        : baseQuery;

      // Sort by population in descending order
      const data = await queryWithFilters.orderBy(
        sql`${municipalityWideMotherTonguePopulation.population} DESC`,
      );

      // Transform the data to include Nepali language names
      return data.map(item => ({
        ...item,
        motherTongueDisplay: MOTHER_TONGUE_LABELS[item.motherTongue] || item.motherTongue,
      }));
    } catch (error) {
      console.error("Error fetching municipality-wide mother tongue population data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get summary of mother tongue population with detailed statistics
export const getMunicipalityWideMotherTonguePopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      const data = await ctx.db
        .select()
        .from(municipalityWideMotherTonguePopulation)
        .orderBy(sql`${municipalityWideMotherTonguePopulation.population} DESC`);

      // Calculate total population
      const totalPopulation = data.reduce((sum, item) => sum + (item.population || 0), 0);

      // Add percentage calculations and display names
      const summaryData = data.map(item => ({
        ...item,
        motherTongueDisplay: MOTHER_TONGUE_LABELS[item.motherTongue] || item.motherTongue,
        percentage: totalPopulation > 0 ? ((item.population || 0) / totalPopulation) * 100 : 0,
      }));

      return {
        data: summaryData,
        totalPopulation,
        totalLanguages: data.length,
      };
    } catch (error) {
      console.error("Error in getMunicipalityWideMotherTonguePopulationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve summary of municipality-wide mother tongue population",
      });
    }
  }
);

// Create a new municipality-wide mother tongue population entry
export const createMunicipalityWideMotherTonguePopulation = protectedProcedure
  .input(municipalityWideMotherTonguePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create municipality-wide mother tongue population data",
      });
    }

    // Check if entry already exists for this mother tongue
    const existing = await ctx.db
      .select({ id: municipalityWideMotherTonguePopulation.id })
      .from(municipalityWideMotherTonguePopulation)
      .where(eq(municipalityWideMotherTonguePopulation.motherTongue, input.motherTongue))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for mother tongue ${input.motherTongue} already exists`,
      });
    }

    const processedInput = {
      id: input.id || uuidv4(),
      motherTongue: input.motherTongue,
      population: input.population,
    };

    // Create new record
    await ctx.db.insert(municipalityWideMotherTonguePopulation).values(processedInput);

    return { success: true, id: processedInput.id };
  });

// Update an existing municipality-wide mother tongue population entry
export const updateMunicipalityWideMotherTonguePopulation = protectedProcedure
  .input(updateMunicipalityWideMotherTonguePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update municipality-wide mother tongue population data",
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
      .select({ id: municipalityWideMotherTonguePopulation.id })
      .from(municipalityWideMotherTonguePopulation)
      .where(eq(municipalityWideMotherTonguePopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    const processedInput: Record<string, unknown> = { id: input.id };

    if (input.motherTongue !== undefined) processedInput.motherTongue = input.motherTongue;
    if (input.population !== undefined) processedInput.population = input.population;

    // Update the record
    await ctx.db
      .update(municipalityWideMotherTonguePopulation)
      .set(processedInput)
      .where(eq(municipalityWideMotherTonguePopulation.id, input.id));

    return { success: true };
  });

// Delete a municipality-wide mother tongue population entry
export const deleteMunicipalityWideMotherTonguePopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete municipality-wide mother tongue population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWideMotherTonguePopulation)
      .where(eq(municipalityWideMotherTonguePopulation.id, input.id));

    return { success: true };
  });

// Export the router with all procedures
export const municipalityWideMotherTonguePopulationRouter = createTRPCRouter({
  getAll: getAllMunicipalityWideMotherTonguePopulation,
  summary: getMunicipalityWideMotherTonguePopulationSummary,
  create: createMunicipalityWideMotherTonguePopulation,
  update: updateMunicipalityWideMotherTonguePopulation,
  delete: deleteMunicipalityWideMotherTonguePopulation,
});
