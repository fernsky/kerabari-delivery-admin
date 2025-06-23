import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardTimeSeriesPopulation } from "@/server/db/schema/profile/demographics/ward-time-series-population";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardTimeSeriesPopulationSchema,
  wardTimeSeriesFilterSchema,
  updateWardTimeSeriesSchema,
} from "./ward-time-series.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward time series data with optional filtering
export const getAllWardTimeSeries = publicProcedure
  .input(wardTimeSeriesFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(wardTimeSeriesPopulation);

      let conditions = [];

      if (input?.wardNumber) {
        conditions.push(
          eq(wardTimeSeriesPopulation.wardNumber, input.wardNumber),
        );
      }

      if (input?.year) {
        conditions.push(eq(wardTimeSeriesPopulation.year, input.year));
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      // Sort by ward number and year
      const data = await queryWithFilters.orderBy(
        wardTimeSeriesPopulation.wardNumber,
        desc(wardTimeSeriesPopulation.year),
      );

      return data;
    } catch (error) {
      console.error("Error fetching ward time series data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get ward time series data for a specific ward
export const getWardTimeSeries = publicProcedure
  .input(z.object({ wardNumber: z.number().int().min(1) }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardTimeSeriesPopulation)
      .where(eq(wardTimeSeriesPopulation.wardNumber, input.wardNumber))
      .orderBy(desc(wardTimeSeriesPopulation.year));

    return data;
  });

// Create a new ward time series entry
export const createWardTimeSeries = protectedProcedure
  .input(wardTimeSeriesPopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward time series data",
      });
    }

    // Check if entry already exists for this ward and year
    const existing = await ctx.db
      .select({ id: wardTimeSeriesPopulation.id })
      .from(wardTimeSeriesPopulation)
      .where(
        and(
          eq(wardTimeSeriesPopulation.wardNumber, input.wardNumber),
          eq(wardTimeSeriesPopulation.year, input.year),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward ${input.wardNumber} in year ${input.year} already exists`,
      });
    }

    // Process the input to handle decimal fields correctly
    const processedInput: {
      id: string;
      wardNumber: number;
      wardName: string | undefined;
      year: number;
      totalPopulation?: number;
      malePopulation?: number;
      femalePopulation?: number;
      otherPopulation?: number;
      totalHouseholds?: number;
      population0To14?: number;
      population15To59?: number;
      population60AndAbove?: number;
      averageHouseholdSize?: string;
      literacyRate?: string;
      maleLiteracyRate?: string;
      femaleLiteracyRate?: string;
      growthRate?: string;
    } = {
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      wardName: input.wardName,
      year: input.year,
    };

    // Process numeric fields to ensure proper format for PostgreSQL
    if (input.totalPopulation !== undefined)
      processedInput.totalPopulation = input.totalPopulation;
    if (input.malePopulation !== undefined)
      processedInput.malePopulation = input.malePopulation;
    if (input.femalePopulation !== undefined)
      processedInput.femalePopulation = input.femalePopulation;
    if (input.otherPopulation !== undefined)
      processedInput.otherPopulation = input.otherPopulation;
    if (input.totalHouseholds !== undefined)
      processedInput.totalHouseholds = input.totalHouseholds;
    if (input.population0To14 !== undefined)
      processedInput.population0To14 = input.population0To14;
    if (input.population15To59 !== undefined)
      processedInput.population15To59 = input.population15To59;
    if (input.population60AndAbove !== undefined)
      processedInput.population60AndAbove = input.population60AndAbove;

    // Handle decimal fields specially (convert to strings for PostgreSQL)
    if (input.averageHouseholdSize !== undefined)
      processedInput.averageHouseholdSize =
        input.averageHouseholdSize?.toString();
    if (input.literacyRate !== undefined)
      processedInput.literacyRate = input.literacyRate?.toString();
    if (input.maleLiteracyRate !== undefined)
      processedInput.maleLiteracyRate = input.maleLiteracyRate?.toString();
    if (input.femaleLiteracyRate !== undefined)
      processedInput.femaleLiteracyRate = input.femaleLiteracyRate?.toString();
    if (input.growthRate !== undefined)
      processedInput.growthRate = input.growthRate?.toString();

    // Create new record
    await ctx.db.insert(wardTimeSeriesPopulation).values(processedInput);

    return { success: true, id: processedInput.id };
  });

// Update an existing ward time series entry
export const updateWardTimeSeries = protectedProcedure
  .input(updateWardTimeSeriesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward time series data",
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
      .select({ id: wardTimeSeriesPopulation.id })
      .from(wardTimeSeriesPopulation)
      .where(eq(wardTimeSeriesPopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Process the input to handle decimal fields correctly
    const processedInput: Record<string, unknown> = { id: input.id };

    // Copy all non-decimal fields directly
    if (input.wardNumber !== undefined)
      processedInput.wardNumber = input.wardNumber;
    if (input.wardName !== undefined) processedInput.wardName = input.wardName;
    if (input.year !== undefined) processedInput.year = input.year;
    if (input.totalPopulation !== undefined)
      processedInput.totalPopulation = input.totalPopulation;
    if (input.malePopulation !== undefined)
      processedInput.malePopulation = input.malePopulation;
    if (input.femalePopulation !== undefined)
      processedInput.femalePopulation = input.femalePopulation;
    if (input.otherPopulation !== undefined)
      processedInput.otherPopulation = input.otherPopulation;
    if (input.totalHouseholds !== undefined)
      processedInput.totalHouseholds = input.totalHouseholds;
    if (input.population0To14 !== undefined)
      processedInput.population0To14 = input.population0To14;
    if (input.population15To59 !== undefined)
      processedInput.population15To59 = input.population15To59;
    if (input.population60AndAbove !== undefined)
      processedInput.population60AndAbove = input.population60AndAbove;

    // Handle decimal fields specially (convert to strings for PostgreSQL)
    if (input.averageHouseholdSize !== undefined)
      processedInput.averageHouseholdSize =
        input.averageHouseholdSize?.toString();
    if (input.literacyRate !== undefined)
      processedInput.literacyRate = input.literacyRate?.toString();
    if (input.maleLiteracyRate !== undefined)
      processedInput.maleLiteracyRate = input.maleLiteracyRate?.toString();
    if (input.femaleLiteracyRate !== undefined)
      processedInput.femaleLiteracyRate = input.femaleLiteracyRate?.toString();
    if (input.growthRate !== undefined)
      processedInput.growthRate = input.growthRate?.toString();

    // Update the record
    await ctx.db
      .update(wardTimeSeriesPopulation)
      .set(processedInput)
      .where(eq(wardTimeSeriesPopulation.id, input.id));

    return { success: true };
  });

// Delete a ward time series entry
export const deleteWardTimeSeries = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward time series data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardTimeSeriesPopulation)
      .where(eq(wardTimeSeriesPopulation.id, input.id));

    return { success: true };
  });

// Get summary of all wards with latest population data
export const getWardPopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // This query gets all ward time series data
      const wardData = await ctx.db
        .select()
        .from(wardTimeSeriesPopulation)
        .orderBy(
          wardTimeSeriesPopulation.wardNumber,
          desc(wardTimeSeriesPopulation.year),
        );

      // Process data to get the latest year's data for each ward
      const wardMap = new Map();
      wardData.forEach((entry) => {
        if (
          !wardMap.has(entry.wardNumber) ||
          wardMap.get(entry.wardNumber).year < entry.year
        ) {
          wardMap.set(entry.wardNumber, entry);
        }
      });

      return Array.from(wardMap.values());
    } catch (error) {
      console.error("Error in getWardPopulationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward population summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardTimeSeriesRouter = createTRPCRouter({
  getAll: getAllWardTimeSeries,
  getByWard: getWardTimeSeries,
  create: createWardTimeSeries,
  update: updateWardTimeSeries,
  delete: deleteWardTimeSeries,
  summary: getWardPopulationSummary,
});
