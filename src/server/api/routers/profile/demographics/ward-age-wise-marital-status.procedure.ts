import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseMaritalStatus } from "@/server/db/schema/profile/demographics/ward-age-wise-marital-status";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  ageWiseMaritalStatusSchema,
  ageWiseMaritalStatusFilterSchema,
  updateAgeWiseMaritalStatusSchema,
  AgeGroupEnum,
  MaritalStatusEnum,
} from "./ward-age-wise-marital-status.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all age-wise marital status data with optional filtering
export const getAllAgeWiseMaritalStatus = publicProcedure
  .input(ageWiseMaritalStatusFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(wardWiseMaritalStatus);

      let conditions = [];

      if (input?.wardNumber) {
        conditions.push(eq(wardWiseMaritalStatus.wardNumber, input.wardNumber));
      }

      if (input?.ageGroup) {
        conditions.push(eq(wardWiseMaritalStatus.ageGroup, input.ageGroup));
      }

      if (input?.maritalStatus) {
        // Type assertion to ensure compatibility with database enum type
        conditions.push(
          eq(wardWiseMaritalStatus.maritalStatus, input.maritalStatus as any),
        );
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      // Sort by ward number, age group, and marital status
      const data = await queryWithFilters.orderBy(
        wardWiseMaritalStatus.wardNumber,
        wardWiseMaritalStatus.ageGroup,
        wardWiseMaritalStatus.maritalStatus,
      );

      return data;
    } catch (error) {
      console.error("Error fetching age-wise marital status data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getAgeWiseMaritalStatusByWard = publicProcedure
  .input(z.object({ wardNumber: z.number().int() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseMaritalStatus)
      .where(eq(wardWiseMaritalStatus.wardNumber, input.wardNumber))
      .orderBy(
        wardWiseMaritalStatus.ageGroup,
        wardWiseMaritalStatus.maritalStatus,
      );

    return data;
  });

// Create a new age-wise marital status entry
export const createAgeWiseMaritalStatus = protectedProcedure
  .input(ageWiseMaritalStatusSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create age-wise marital status data",
      });
    }

    // Check if entry already exists for this ward, age group, and marital status
    const existing = await ctx.db
      .select({ id: wardWiseMaritalStatus.id })
      .from(wardWiseMaritalStatus)
      .where(
        and(
          eq(wardWiseMaritalStatus.wardNumber, input.wardNumber),
          eq(wardWiseMaritalStatus.ageGroup, input.ageGroup),
          eq(wardWiseMaritalStatus.maritalStatus, input.maritalStatus as any),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber}, age group ${input.ageGroup}, and marital status ${input.maritalStatus} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseMaritalStatus).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      ageGroup: input.ageGroup,
      maritalStatus: input.maritalStatus as any,
      population: input.population,
      malePopulation: input.malePopulation,
      femalePopulation: input.femalePopulation,
      otherPopulation: input.otherPopulation,
    });

    return { success: true };
  });

// Update an existing age-wise marital status entry
export const updateAgeWiseMaritalStatus = protectedProcedure
  .input(updateAgeWiseMaritalStatusSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update age-wise marital status data",
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
      .select({ id: wardWiseMaritalStatus.id })
      .from(wardWiseMaritalStatus)
      .where(eq(wardWiseMaritalStatus.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseMaritalStatus)
      .set({
        wardNumber: input.wardNumber,
        ageGroup: input.ageGroup,
        maritalStatus: input.maritalStatus as any,
        population: input.population,
        malePopulation: input.malePopulation,
        femalePopulation: input.femalePopulation,
        otherPopulation: input.otherPopulation,
      })
      .where(eq(wardWiseMaritalStatus.id, input.id));

    return { success: true };
  });

// Delete an age-wise marital status entry
export const deleteAgeWiseMaritalStatus = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete age-wise marital status data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseMaritalStatus)
      .where(eq(wardWiseMaritalStatus.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getAgeWiseMaritalStatusSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by marital status across all wards and age groups
      const summarySql = sql`
        SELECT 
          marital_status, 
          SUM(population) as total_population
        FROM 
          acme_ward_wise_marital_status
        GROUP BY 
          marital_status
        ORDER BY 
          marital_status
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getAgeWiseMaritalStatusSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve age-wise marital status summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardAgeWiseMaritalStatusRouter = createTRPCRouter({
  getAll: getAllAgeWiseMaritalStatus,
  getByWard: getAgeWiseMaritalStatusByWard,
  create: createAgeWiseMaritalStatus,
  update: updateAgeWiseMaritalStatus,
  delete: deleteAgeWiseMaritalStatus,
  summary: getAgeWiseMaritalStatusSummary,
});
