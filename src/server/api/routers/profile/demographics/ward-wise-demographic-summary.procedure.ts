import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseDemographicSummary } from "@/server/db/schema/profile/demographics/ward-wise-demographic-summary";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseDemographicSummarySchema,
  wardWiseDemographicSummaryFilterSchema,
  updateWardWiseDemographicSummarySchema,
} from "./ward-wise-demographic-summary.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise demographic summary data with optional filtering
export const getAllWardWiseDemographicSummary = publicProcedure
  .input(wardWiseDemographicSummaryFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(wardWiseDemographicSummary);

      let conditions = [];

      if (input?.wardNumber) {
        conditions.push(
          eq(wardWiseDemographicSummary.wardNumber, input.wardNumber),
        );
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      // Sort by ward number
      const data = await queryWithFilters.orderBy(
        wardWiseDemographicSummary.wardNumber,
      );

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise demographic summary data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get ward-wise demographic summary data for a specific ward
export const getWardWiseDemographicSummary = publicProcedure
  .input(z.object({ wardNumber: z.number().int().min(1) }))
  .query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db
        .select()
        .from(wardWiseDemographicSummary)
        .where(eq(wardWiseDemographicSummary.wardNumber, input.wardNumber))
        .limit(1);

      if (data.length === 0) {
        return null;
      }

      return data[0];
    } catch (error) {
      console.error("Error fetching ward demographic summary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward demographic data",
      });
    }
  });

// Create a new ward-wise demographic summary entry
export const createWardWiseDemographicSummary = protectedProcedure
  .input(wardWiseDemographicSummarySchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward demographic summary data",
      });
    }

    // Check if entry already exists for this ward
    const existing = await ctx.db
      .select({ id: wardWiseDemographicSummary.id })
      .from(wardWiseDemographicSummary)
      .where(eq(wardWiseDemographicSummary.wardNumber, input.wardNumber))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward ${input.wardNumber} already exists`,
      });
    }

    // Process the input to handle decimal fields correctly
    const processedInput: {
      id: string;
      wardNumber: number;
      wardName: string | undefined;
      totalPopulation?: number;
      populationMale?: number;
      populationFemale?: number;
      populationOther?: number;
      totalHouseholds?: number;
      averageHouseholdSize?: string;
      sexRatio?: string;
    } = {
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      wardName: input.wardName,
    };

    // Process numeric fields to ensure proper format for PostgreSQL
    if (input.totalPopulation !== undefined)
      processedInput.totalPopulation = input.totalPopulation;
    if (input.populationMale !== undefined)
      processedInput.populationMale = input.populationMale;
    if (input.populationFemale !== undefined)
      processedInput.populationFemale = input.populationFemale;
    if (input.populationOther !== undefined)
      processedInput.populationOther = input.populationOther;
    if (input.totalHouseholds !== undefined)
      processedInput.totalHouseholds = input.totalHouseholds;

    // Handle decimal fields specially (convert to strings for PostgreSQL)
    if (input.averageHouseholdSize !== undefined)
      processedInput.averageHouseholdSize = 
        input.averageHouseholdSize?.toString();
    if (input.sexRatio !== undefined)
      processedInput.sexRatio = input.sexRatio?.toString();

    // Create new record
    await ctx.db.insert(wardWiseDemographicSummary).values(processedInput);

    return { success: true, id: processedInput.id };
  });

// Update an existing ward-wise demographic summary entry
export const updateWardWiseDemographicSummary = protectedProcedure
  .input(updateWardWiseDemographicSummarySchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward demographic summary data",
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
      .select({ id: wardWiseDemographicSummary.id })
      .from(wardWiseDemographicSummary)
      .where(eq(wardWiseDemographicSummary.id, input.id))
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
    if (input.wardName !== undefined) 
      processedInput.wardName = input.wardName;
    if (input.totalPopulation !== undefined)
      processedInput.totalPopulation = input.totalPopulation;
    if (input.populationMale !== undefined)
      processedInput.populationMale = input.populationMale;
    if (input.populationFemale !== undefined)
      processedInput.populationFemale = input.populationFemale;
    if (input.populationOther !== undefined)
      processedInput.populationOther = input.populationOther;
    if (input.totalHouseholds !== undefined)
      processedInput.totalHouseholds = input.totalHouseholds;

    // Handle decimal fields specially (convert to strings for PostgreSQL)
    if (input.averageHouseholdSize !== undefined)
      processedInput.averageHouseholdSize = 
        input.averageHouseholdSize?.toString();
    if (input.sexRatio !== undefined)
      processedInput.sexRatio = input.sexRatio?.toString();

    // Update the record
    await ctx.db
      .update(wardWiseDemographicSummary)
      .set(processedInput)
      .where(eq(wardWiseDemographicSummary.id, input.id));

    return { success: true };
  });

// Delete a ward-wise demographic summary entry
export const deleteWardWiseDemographicSummary = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward demographic summary data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseDemographicSummary)
      .where(eq(wardWiseDemographicSummary.id, input.id));

    return { success: true };
  });

// Export the router with all procedures
export const wardWiseDemographicSummaryRouter = createTRPCRouter({
  getAll: getAllWardWiseDemographicSummary,
  getByWard: getWardWiseDemographicSummary,
  create: createWardWiseDemographicSummary,
  update: updateWardWiseDemographicSummary,
  delete: deleteWardWiseDemographicSummary,
});
