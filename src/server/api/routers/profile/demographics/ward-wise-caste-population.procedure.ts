import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseCastePopulation } from "@/server/db/schema/profile/demographics/ward-wise-caste-population";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseCastePopulationSchema,
  wardWiseCastePopulationFilterSchema,
  updateWardWiseCastePopulationSchema,
  casteOptions,
} from "./ward-wise-caste-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { CasteTypes } from "@/server/db/schema/common/enums";

// Get all ward-wise caste population data with optional filtering
export const getAllWardWiseCastePopulation = publicProcedure
  .input(wardWiseCastePopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(wardWiseCastePopulation);

      let conditions = [];

      if (input?.wardNumber) {
        conditions.push(
          eq(wardWiseCastePopulation.wardNumber, input.wardNumber),
        );
      }

      if (input?.casteType) {
              conditions.push(eq(wardWiseCastePopulation.casteType, input.casteType as keyof typeof CasteTypes));
            }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      // Sort by ward number and caste type
      const data = await queryWithFilters.orderBy(
        wardWiseCastePopulation.wardNumber,
        wardWiseCastePopulation.casteType,
      );

      // Transform the data to include Nepali caste names
      return data.map(item => ({
        ...item,
        casteTypeDisplay: CasteTypes[item.casteType as keyof typeof CasteTypes] || item.casteType,
      }));
    } catch (error) {
      console.error("Error fetching ward-wise caste population data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get ward-wise caste population data for a specific ward
export const getWardWiseCastePopulation = publicProcedure
  .input(z.object({ wardNumber: z.number().int().min(1) }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseCastePopulation)
      .where(eq(wardWiseCastePopulation.wardNumber, input.wardNumber))
      .orderBy(wardWiseCastePopulation.casteType);

    // Transform data to include Nepali caste names
    return data.map(item => ({
      ...item,
      casteTypeDisplay: CasteTypes[item.casteType as keyof typeof CasteTypes] || item.casteType,
    }));
  });

// Create a new ward-wise caste population entry
export const createWardWiseCastePopulation = protectedProcedure
  .input(wardWiseCastePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise caste population data",
      });
    }

    // Check if entry already exists for this ward and caste type
    const existing = await ctx.db
      .select({ id: wardWiseCastePopulation.id })
      .from(wardWiseCastePopulation)
      .where(
        and(
          eq(wardWiseCastePopulation.wardNumber, input.wardNumber),
          eq(wardWiseCastePopulation.casteType, input.casteType as keyof typeof CasteTypes),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward ${input.wardNumber} and caste type ${input.casteType} already exists`,
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
      wardNumber: input.wardNumber,
      casteType: input.casteType as keyof typeof CasteTypes,
      population: input.population,
    };

    // Create new record
    await ctx.db.insert(wardWiseCastePopulation).values(processedInput);

    return { success: true, id: processedInput.id };
  });

// Update an existing ward-wise caste population entry
export const updateWardWiseCastePopulation = protectedProcedure
  .input(updateWardWiseCastePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise caste population data",
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
      .select({ id: wardWiseCastePopulation.id })
      .from(wardWiseCastePopulation)
      .where(eq(wardWiseCastePopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    const processedInput: Record<string, unknown> = { id: input.id };

    if (input.wardNumber !== undefined) processedInput.wardNumber = input.wardNumber;
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
      .update(wardWiseCastePopulation)
      .set(processedInput)
      .where(eq(wardWiseCastePopulation.id, input.id));

    return { success: true };
  });

// Delete a ward-wise caste population entry
export const deleteWardWiseCastePopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise caste population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseCastePopulation)
      .where(eq(wardWiseCastePopulation.id, input.id));

    return { success: true };
  });

// Get summary of caste population across all wards
export const getCastePopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get all caste population data
      const casteData = await ctx.db
        .select()
        .from(wardWiseCastePopulation)
        .orderBy(
          wardWiseCastePopulation.casteType,
          wardWiseCastePopulation.wardNumber
        );

      // Group by caste type and calculate total population
      const summaryMap = new Map();
      casteData.forEach((entry) => {
        if (!summaryMap.has(entry.casteType)) {
          summaryMap.set(entry.casteType, {
            casteType: entry.casteType,
            casteTypeDisplay: CasteTypes[entry.casteType as keyof typeof CasteTypes] || entry.casteType,
            totalPopulation: 0,
            wardDistribution: [],
          });
        }
        
        const summary = summaryMap.get(entry.casteType);
        if (entry.population) {
          summary.totalPopulation += entry.population;
        }
        
        summary.wardDistribution.push({
          wardNumber: entry.wardNumber,
          population: entry.population,
        });
      });

      return Array.from(summaryMap.values());
    } catch (error) {
      console.error("Error in getCastePopulationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve caste population summary",
      });
    }
  }
);

// Export the router with all procedures
export const wardWiseCastePopulationRouter = createTRPCRouter({
  getAll: getAllWardWiseCastePopulation,
  getByWard: getWardWiseCastePopulation,
  create: createWardWiseCastePopulation,
  update: updateWardWiseCastePopulation,
  delete: deleteWardWiseCastePopulation,
  summary: getCastePopulationSummary,
});
