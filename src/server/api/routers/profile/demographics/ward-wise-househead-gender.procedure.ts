import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseHouseHeadGender } from "@/server/db/schema/profile/demographics/ward-wise-househead-gender";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseHouseHeadGenderSchema,
  wardWiseHouseHeadGenderFilterSchema,
  updateWardWiseHouseHeadGenderSchema,
} from "./ward-wise-househead-gender.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise house head gender data with optional filtering
export const getAllWardWiseHouseHeadGender = publicProcedure
  .input(wardWiseHouseHeadGenderFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db.select().from(wardWiseHouseHeadGender);

      let conditions = [];

      if (input?.wardNumber) {
        conditions.push(
          eq(wardWiseHouseHeadGender.wardNumber, input.wardNumber),
        );
      }

      if (input?.gender) {
        conditions.push(eq(wardWiseHouseHeadGender.gender, input.gender));
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      // Sort by ward number
      const data = await queryWithFilters.orderBy(
        wardWiseHouseHeadGender.wardNumber,
        wardWiseHouseHeadGender.gender,
      );

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise house head gender data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseHouseHeadGenderByWard = publicProcedure
  .input(z.object({ wardNumber: z.number().int().min(1) }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseHouseHeadGender)
      .where(eq(wardWiseHouseHeadGender.wardNumber, input.wardNumber))
      .orderBy(wardWiseHouseHeadGender.gender);

    return data;
  });

// Create a new ward-wise house head gender entry
export const createWardWiseHouseHeadGender = protectedProcedure
  .input(wardWiseHouseHeadGenderSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise house head gender data",
      });
    }

    // Check if entry already exists for this ward and gender
    const existing = await ctx.db
      .select({ id: wardWiseHouseHeadGender.id })
      .from(wardWiseHouseHeadGender)
      .where(
        and(
          eq(wardWiseHouseHeadGender.wardNumber, input.wardNumber),
          eq(wardWiseHouseHeadGender.gender, input.gender),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward ${input.wardNumber} and gender ${input.gender} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseHouseHeadGender).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      wardName: input.wardName,
      gender: input.gender,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward-wise house head gender entry
export const updateWardWiseHouseHeadGender = protectedProcedure
  .input(updateWardWiseHouseHeadGenderSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise house head gender data",
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
      .select({ id: wardWiseHouseHeadGender.id })
      .from(wardWiseHouseHeadGender)
      .where(eq(wardWiseHouseHeadGender.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseHouseHeadGender)
      .set({
        wardNumber: input.wardNumber,
        wardName: input.wardName,
        gender: input.gender,
        population: input.population,
      })
      .where(eq(wardWiseHouseHeadGender.id, input.id));

    return { success: true };
  });

// Delete a ward-wise house head gender entry
export const deleteWardWiseHouseHeadGender = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise house head gender data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseHouseHeadGender)
      .where(eq(wardWiseHouseHeadGender.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseHouseHeadGenderSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by gender across all wards
      const summarySql = sql`
        SELECT 
          gender, 
          SUM(population) as total_population
        FROM 
          ward_wise_househead_gender
        GROUP BY 
          gender
        ORDER BY 
          gender
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseHouseHeadGenderSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise house head gender summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseHouseHeadGenderRouter = createTRPCRouter({
  getAll: getAllWardWiseHouseHeadGender,
  getByWard: getWardWiseHouseHeadGenderByWard,
  create: createWardWiseHouseHeadGender,
  update: updateWardWiseHouseHeadGender,
  delete: deleteWardWiseHouseHeadGender,
  summary: getWardWiseHouseHeadGenderSummary,
});
