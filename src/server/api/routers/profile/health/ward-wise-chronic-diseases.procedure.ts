import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseChronicDiseases } from "@/server/db/schema/profile/health/ward-wise-chronic-diseases";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseChronicDiseasesSchema,
  wardWiseChronicDiseasesFilterSchema,
  updateWardWiseChronicDiseasesSchema,
  ChronicDiseaseTypeEnum,
} from "./ward-wise-chronic-diseases.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise chronic diseases data with optional filtering
export const getAllWardWiseChronicDiseases = publicProcedure
  .input(wardWiseChronicDiseasesFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseChronicDiseases);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseChronicDiseases.wardNumber, input.wardNumber),
          );
        }

        if (input?.chronicDisease) {
          conditions.push(
            eq(wardWiseChronicDiseases.chronicDisease, input.chronicDisease),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and chronic disease type
        data = await queryWithFilters.orderBy(
          wardWiseChronicDiseases.wardNumber,
          wardWiseChronicDiseases.chronicDisease,
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
            chronic_disease,
            population,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_chronic_diseases
          ORDER BY 
            ward_number, chronic_disease
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            chronicDisease: row.chronic_disease,
            population: parseInt(String(row.population || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.chronicDisease) {
            data = data.filter(
              (item) => item.chronicDisease === input.chronicDisease,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise chronic diseases data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseChronicDiseasesByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseChronicDiseases)
      .where(eq(wardWiseChronicDiseases.wardNumber, input.wardNumber))
      .orderBy(wardWiseChronicDiseases.chronicDisease);

    return data;
  });

// Create a new ward-wise chronic diseases entry
export const createWardWiseChronicDiseases = protectedProcedure
  .input(wardWiseChronicDiseasesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise chronic diseases data",
      });
    }

    // Check if entry already exists for this ward and chronic disease type
    const existing = await ctx.db
      .select({ id: wardWiseChronicDiseases.id })
      .from(wardWiseChronicDiseases)
      .where(
        and(
          eq(wardWiseChronicDiseases.wardNumber, input.wardNumber),
          eq(wardWiseChronicDiseases.chronicDisease, input.chronicDisease),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and chronic disease ${input.chronicDisease} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseChronicDiseases).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      chronicDisease: input.chronicDisease,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward-wise chronic diseases entry
export const updateWardWiseChronicDiseases = protectedProcedure
  .input(updateWardWiseChronicDiseasesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise chronic diseases data",
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
      .select({ id: wardWiseChronicDiseases.id })
      .from(wardWiseChronicDiseases)
      .where(eq(wardWiseChronicDiseases.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseChronicDiseases)
      .set({
        wardNumber: input.wardNumber,
        chronicDisease: input.chronicDisease,
        population: input.population,
      })
      .where(eq(wardWiseChronicDiseases.id, input.id));

    return { success: true };
  });

// Delete a ward-wise chronic diseases entry
export const deleteWardWiseChronicDiseases = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise chronic diseases data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseChronicDiseases)
      .where(eq(wardWiseChronicDiseases.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseChronicDiseasesSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by chronic disease type across all wards
      const summarySql = sql`
        SELECT 
          chronic_disease, 
          SUM(population) as total_population
        FROM 
          ward_wise_chronic_diseases
        GROUP BY 
          chronic_disease
        ORDER BY 
          chronic_disease
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseChronicDiseasesSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise chronic diseases summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseChronicDiseasesRouter = createTRPCRouter({
  getAll: getAllWardWiseChronicDiseases,
  getByWard: getWardWiseChronicDiseasesByWard,
  create: createWardWiseChronicDiseases,
  update: updateWardWiseChronicDiseases,
  delete: deleteWardWiseChronicDiseases,
  summary: getWardWiseChronicDiseasesSummary,
});
