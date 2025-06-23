import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardAgeGenderWiseFirstMarriageAge } from "@/server/db/schema/profile/social/ward-age-gender-wise-first-marriage-age";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardAgeGenderWiseFirstMarriageAgeSchema,
  wardAgeGenderWiseFirstMarriageAgeFilterSchema,
  updateWardAgeGenderWiseFirstMarriageAgeSchema,
  FirstMarriageAgeGroupEnum,
  GenderTypeEnum,
} from "./ward-age-gender-wise-first-marriage-age.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-age-gender-wise first marriage age data with optional filtering
export const getAllWardAgeGenderWiseFirstMarriageAge = publicProcedure
  .input(wardAgeGenderWiseFirstMarriageAgeFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db
          .select()
          .from(wardAgeGenderWiseFirstMarriageAge);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardAgeGenderWiseFirstMarriageAge.wardNumber, input.wardNumber),
          );
        }

        if (input?.firstMarriageAgeGroup) {
          conditions.push(
            eq(
              wardAgeGenderWiseFirstMarriageAge.firstMarriageAgeGroup,
              input.firstMarriageAgeGroup,
            ),
          );
        }

        if (input?.gender) {
          conditions.push(
            eq(wardAgeGenderWiseFirstMarriageAge.gender, input.gender),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number, gender, and age group
        data = await queryWithFilters.orderBy(
          wardAgeGenderWiseFirstMarriageAge.wardNumber,
          wardAgeGenderWiseFirstMarriageAge.gender,
          wardAgeGenderWiseFirstMarriageAge.firstMarriageAgeGroup,
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
            first_marriage_age_group,
            gender,
            population,
            updated_at,
            created_at
          FROM 
            acme_ward_age_gender_wise_first_marriage_age
          ORDER BY 
            ward_number, gender, first_marriage_age_group
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            firstMarriageAgeGroup: row.first_marriage_age_group,
            gender: row.gender,
            population: parseInt(String(row.population || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.firstMarriageAgeGroup) {
            data = data.filter(
              (item) =>
                item.firstMarriageAgeGroup === input.firstMarriageAgeGroup,
            );
          }

          if (input?.gender) {
            data = data.filter((item) => item.gender === input.gender);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-age-gender-wise first marriage age data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardAgeGenderWiseFirstMarriageAgeByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardAgeGenderWiseFirstMarriageAge)
      .where(eq(wardAgeGenderWiseFirstMarriageAge.wardNumber, input.wardNumber))
      .orderBy(
        wardAgeGenderWiseFirstMarriageAge.gender,
        wardAgeGenderWiseFirstMarriageAge.firstMarriageAgeGroup,
      );

    return data;
  });

// Create a new ward-age-gender-wise first marriage age entry
export const createWardAgeGenderWiseFirstMarriageAge = protectedProcedure
  .input(wardAgeGenderWiseFirstMarriageAgeSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-age-gender-wise first marriage age data",
      });
    }

    // Check if entry already exists for this ward, age group, and gender
    const existing = await ctx.db
      .select({ id: wardAgeGenderWiseFirstMarriageAge.id })
      .from(wardAgeGenderWiseFirstMarriageAge)
      .where(
        and(
          eq(wardAgeGenderWiseFirstMarriageAge.wardNumber, input.wardNumber),
          eq(
            wardAgeGenderWiseFirstMarriageAge.firstMarriageAgeGroup,
            input.firstMarriageAgeGroup,
          ),
          eq(wardAgeGenderWiseFirstMarriageAge.gender, input.gender),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber}, age group ${input.firstMarriageAgeGroup}, and gender ${input.gender} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardAgeGenderWiseFirstMarriageAge).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      firstMarriageAgeGroup: input.firstMarriageAgeGroup,
      gender: input.gender,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward-age-gender-wise first marriage age entry
export const updateWardAgeGenderWiseFirstMarriageAge = protectedProcedure
  .input(updateWardAgeGenderWiseFirstMarriageAgeSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-age-gender-wise first marriage age data",
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
      .select({ id: wardAgeGenderWiseFirstMarriageAge.id })
      .from(wardAgeGenderWiseFirstMarriageAge)
      .where(eq(wardAgeGenderWiseFirstMarriageAge.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardAgeGenderWiseFirstMarriageAge)
      .set({
        wardNumber: input.wardNumber,
        firstMarriageAgeGroup: input.firstMarriageAgeGroup,
        gender: input.gender,
        population: input.population,
      })
      .where(eq(wardAgeGenderWiseFirstMarriageAge.id, input.id));

    return { success: true };
  });

// Delete a ward-age-gender-wise first marriage age entry
export const deleteWardAgeGenderWiseFirstMarriageAge = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-age-gender-wise first marriage age data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardAgeGenderWiseFirstMarriageAge)
      .where(eq(wardAgeGenderWiseFirstMarriageAge.id, input.id));

    return { success: true };
  });

// Get summary statistics by gender and age group
export const getWardAgeGenderWiseFirstMarriageAgeSummary =
  publicProcedure.query(async ({ ctx }) => {
    try {
      // Get total population by gender and age group across all wards
      const summarySql = sql`
        SELECT 
          gender,
          first_marriage_age_group, 
          SUM(population) as total_population
        FROM 
          ward_age_gender_wise_first_marriage_age
        GROUP BY 
          gender, first_marriage_age_group
        ORDER BY 
          gender, first_marriage_age_group
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error(
        "Error in getWardAgeGenderWiseFirstMarriageAgeSummary:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Failed to retrieve ward-age-gender-wise first marriage age summary",
      });
    }
  });

// Export the router with all procedures
export const wardAgeGenderWiseFirstMarriageAgeRouter = createTRPCRouter({
  getAll: getAllWardAgeGenderWiseFirstMarriageAge,
  getByWard: getWardAgeGenderWiseFirstMarriageAgeByWard,
  create: createWardAgeGenderWiseFirstMarriageAge,
  update: updateWardAgeGenderWiseFirstMarriageAge,
  delete: deleteWardAgeGenderWiseFirstMarriageAge,
  summary: getWardAgeGenderWiseFirstMarriageAgeSummary,
});
