import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseEducationalLevel } from "@/server/db/schema/profile/education/ward-wise-educational-level";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseEducationalLevelSchema,
  wardWiseEducationalLevelFilterSchema,
  updateWardWiseEducationalLevelSchema,
  EducationalLevelTypeEnum,
} from "./ward-wise-educational-level.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise educational level data with optional filtering
export const getAllWardWiseEducationalLevel = publicProcedure
  .input(wardWiseEducationalLevelFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseEducationalLevel);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseEducationalLevel.wardNumber, input.wardNumber),
          );
        }

        if (input?.educationalLevelType) {
          conditions.push(
            eq(
              wardWiseEducationalLevel.educationalLevelType,
              input.educationalLevelType,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and educational level type
        data = await queryWithFilters.orderBy(
          wardWiseEducationalLevel.wardNumber,
          wardWiseEducationalLevel.educationalLevelType,
        );
      } catch (err) {
        console.log("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            ward_number,
            educational_level_type,
            population,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_educational_level
          ORDER BY 
            ward_number, educational_level_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            educationalLevelType: row.educational_level_type,
            population: parseInt(String(row.population || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.educationalLevelType) {
            data = data.filter(
              (item) =>
                item.educationalLevelType === input.educationalLevelType,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise educational level data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseEducationalLevelByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseEducationalLevel)
      .where(eq(wardWiseEducationalLevel.wardNumber, input.wardNumber))
      .orderBy(wardWiseEducationalLevel.educationalLevelType);

    return data;
  });

// Create a new ward-wise educational level entry
export const createWardWiseEducationalLevel = protectedProcedure
  .input(wardWiseEducationalLevelSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise educational level data",
      });
    }

    // Check if entry already exists for this ward and educational level type
    const existing = await ctx.db
      .select({ id: wardWiseEducationalLevel.id })
      .from(wardWiseEducationalLevel)
      .where(
        and(
          eq(wardWiseEducationalLevel.wardNumber, input.wardNumber),
          eq(
            wardWiseEducationalLevel.educationalLevelType,
            input.educationalLevelType,
          ),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and educational level ${input.educationalLevelType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseEducationalLevel).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      educationalLevelType: input.educationalLevelType,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward-wise educational level entry
export const updateWardWiseEducationalLevel = protectedProcedure
  .input(updateWardWiseEducationalLevelSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise educational level data",
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
      .select({ id: wardWiseEducationalLevel.id })
      .from(wardWiseEducationalLevel)
      .where(eq(wardWiseEducationalLevel.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseEducationalLevel)
      .set({
        wardNumber: input.wardNumber,
        educationalLevelType: input.educationalLevelType,
        population: input.population,
      })
      .where(eq(wardWiseEducationalLevel.id, input.id));

    return { success: true };
  });

// Delete a ward-wise educational level entry
export const deleteWardWiseEducationalLevel = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise educational level data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseEducationalLevel)
      .where(eq(wardWiseEducationalLevel.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseEducationalLevelSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by educational level type across all wards
      const summarySql = sql`
        SELECT 
          educational_level_type, 
          SUM(population) as total_population
        FROM 
          acme_ward_wise_educational_level
        GROUP BY 
          educational_level_type
        ORDER BY 
          educational_level_type
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseEducationalLevelSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise educational level summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseEducationalLevelRouter = createTRPCRouter({
  getAll: getAllWardWiseEducationalLevel,
  getByWard: getWardWiseEducationalLevelByWard,
  create: createWardWiseEducationalLevel,
  update: updateWardWiseEducationalLevel,
  delete: deleteWardWiseEducationalLevel,
  summary: getWardWiseEducationalLevelSummary,
});
