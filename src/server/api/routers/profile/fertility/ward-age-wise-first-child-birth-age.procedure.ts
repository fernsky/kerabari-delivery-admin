import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardAgeWiseFirstChildBirthAge } from "@/server/db/schema/profile/fertility/ward-age-wise-first-child-birth-age";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardAgeWiseFirstChildBirthAgeSchema,
  wardAgeWiseFirstChildBirthAgeFilterSchema,
  updateWardAgeWiseFirstChildBirthAgeSchema,
  FirstChildBirthAgeGroupEnum,
} from "./ward-age-wise-first-child-birth-age.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-age-wise first child birth age data with optional filtering
export const getAllWardAgeWiseFirstChildBirthAge = publicProcedure
  .input(wardAgeWiseFirstChildBirthAgeFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardAgeWiseFirstChildBirthAge);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardAgeWiseFirstChildBirthAge.wardNumber, input.wardNumber),
          );
        }

        if (input?.firstChildBirthAgeGroup) {
          conditions.push(
            eq(
              wardAgeWiseFirstChildBirthAge.firstChildBirthAgeGroup,
              input.firstChildBirthAgeGroup,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and first child birth age group
        data = await queryWithFilters.orderBy(
          wardAgeWiseFirstChildBirthAge.wardNumber,
          wardAgeWiseFirstChildBirthAge.firstChildBirthAgeGroup,
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
            first_child_birth_age_group,
            population,
            updated_at,
            created_at
          FROM 
            acme_ward_age_wise_first_child_birth_age
          ORDER BY 
            ward_number, first_child_birth_age_group
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            firstChildBirthAgeGroup: row.first_child_birth_age_group,
            population: parseInt(String(row.population || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.firstChildBirthAgeGroup) {
            data = data.filter(
              (item) =>
                item.firstChildBirthAgeGroup === input.firstChildBirthAgeGroup,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-age-wise first child birth age data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardAgeWiseFirstChildBirthAgeByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardAgeWiseFirstChildBirthAge)
      .where(eq(wardAgeWiseFirstChildBirthAge.wardNumber, input.wardNumber))
      .orderBy(wardAgeWiseFirstChildBirthAge.firstChildBirthAgeGroup);

    return data;
  });

// Create a new ward-age-wise first child birth age entry
export const createWardAgeWiseFirstChildBirthAge = protectedProcedure
  .input(wardAgeWiseFirstChildBirthAgeSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-age-wise first child birth age data",
      });
    }

    // Check if entry already exists for this ward and age group
    const existing = await ctx.db
      .select({ id: wardAgeWiseFirstChildBirthAge.id })
      .from(wardAgeWiseFirstChildBirthAge)
      .where(
        and(
          eq(wardAgeWiseFirstChildBirthAge.wardNumber, input.wardNumber),
          eq(
            wardAgeWiseFirstChildBirthAge.firstChildBirthAgeGroup,
            input.firstChildBirthAgeGroup,
          ),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and age group ${input.firstChildBirthAgeGroup} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardAgeWiseFirstChildBirthAge).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      firstChildBirthAgeGroup: input.firstChildBirthAgeGroup,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward-age-wise first child birth age entry
export const updateWardAgeWiseFirstChildBirthAge = protectedProcedure
  .input(updateWardAgeWiseFirstChildBirthAgeSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-age-wise first child birth age data",
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
      .select({ id: wardAgeWiseFirstChildBirthAge.id })
      .from(wardAgeWiseFirstChildBirthAge)
      .where(eq(wardAgeWiseFirstChildBirthAge.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardAgeWiseFirstChildBirthAge)
      .set({
        wardNumber: input.wardNumber,
        firstChildBirthAgeGroup: input.firstChildBirthAgeGroup,
        population: input.population,
      })
      .where(eq(wardAgeWiseFirstChildBirthAge.id, input.id));

    return { success: true };
  });

// Delete a ward-age-wise first child birth age entry
export const deleteWardAgeWiseFirstChildBirthAge = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-age-wise first child birth age data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardAgeWiseFirstChildBirthAge)
      .where(eq(wardAgeWiseFirstChildBirthAge.id, input.id));

    return { success: true };
  });

// Get summary statistics by age group
export const getWardAgeWiseFirstChildBirthAgeSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by age group across all wards
      const summarySql = sql`
        SELECT 
          first_child_birth_age_group, 
          SUM(population) as total_population
        FROM 
          ward_age_wise_first_child_birth_age
        GROUP BY 
          first_child_birth_age_group
        ORDER BY 
          first_child_birth_age_group
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardAgeWiseFirstChildBirthAgeSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Failed to retrieve ward-age-wise first child birth age summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardAgeWiseFirstChildBirthAgeRouter = createTRPCRouter({
  getAll: getAllWardAgeWiseFirstChildBirthAge,
  getByWard: getWardAgeWiseFirstChildBirthAgeByWard,
  create: createWardAgeWiseFirstChildBirthAge,
  update: updateWardAgeWiseFirstChildBirthAge,
  delete: deleteWardAgeWiseFirstChildBirthAge,
  summary: getWardAgeWiseFirstChildBirthAgeSummary,
});
