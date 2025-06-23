import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseForeignEmploymentCountries } from "@/server/db/schema/profile/economics/ward-wise-foreign-employment-countries";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseForeignEmploymentCountriesSchema,
  wardWiseForeignEmploymentCountriesFilterSchema,
  updateWardWiseForeignEmploymentCountriesSchema,
  ForeignEmploymentCountryEnum,
} from "./ward-wise-foreign-employment-countries.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise foreign employment countries data with optional filtering
export const getAllWardWiseForeignEmploymentCountries = publicProcedure
  .input(wardWiseForeignEmploymentCountriesFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseForeignEmploymentCountries);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseForeignEmploymentCountries.wardNumber, input.wardNumber),
          );
        }

        if (input?.country) {
          conditions.push(eq(wardWiseForeignEmploymentCountries.country, input.country));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and country
        data = await queryWithFilters.orderBy(
          wardWiseForeignEmploymentCountries.wardNumber,
          wardWiseForeignEmploymentCountries.country,
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
            country,
            population,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_foreign_employment_countries
          ORDER BY 
            ward_number, country
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            country: row.country,
            population: parseInt(String(row.population || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.country) {
            data = data.filter((item) => item.country === input.country);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise foreign employment countries data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseForeignEmploymentCountriesByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseForeignEmploymentCountries)
      .where(eq(wardWiseForeignEmploymentCountries.wardNumber, input.wardNumber))
      .orderBy(wardWiseForeignEmploymentCountries.country);

    return data;
  });

// Create a new ward-wise foreign employment countries entry
export const createWardWiseForeignEmploymentCountries = protectedProcedure
  .input(wardWiseForeignEmploymentCountriesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise foreign employment countries data",
      });
    }

    // Check if entry already exists for this ward and country
    const existing = await ctx.db
      .select({ id: wardWiseForeignEmploymentCountries.id })
      .from(wardWiseForeignEmploymentCountries)
      .where(
        and(
          eq(wardWiseForeignEmploymentCountries.wardNumber, input.wardNumber),
          eq(wardWiseForeignEmploymentCountries.country, input.country),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and country ${input.country} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseForeignEmploymentCountries).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      country: input.country,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward-wise foreign employment countries entry
export const updateWardWiseForeignEmploymentCountries = protectedProcedure
  .input(updateWardWiseForeignEmploymentCountriesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise foreign employment countries data",
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
      .select({ id: wardWiseForeignEmploymentCountries.id })
      .from(wardWiseForeignEmploymentCountries)
      .where(eq(wardWiseForeignEmploymentCountries.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseForeignEmploymentCountries)
      .set({
        wardNumber: input.wardNumber,
        country: input.country,
        population: input.population,
      })
      .where(eq(wardWiseForeignEmploymentCountries.id, input.id));

    return { success: true };
  });

// Delete a ward-wise foreign employment countries entry
export const deleteWardWiseForeignEmploymentCountries = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise foreign employment countries data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseForeignEmploymentCountries)
      .where(eq(wardWiseForeignEmploymentCountries.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseForeignEmploymentCountriesSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by country across all wards
      const summarySql = sql`
        SELECT 
          country, 
          SUM(population) as total_population
        FROM 
          acme_ward_wise_foreign_employment_countries
        GROUP BY 
          country
        ORDER BY 
          total_population DESC
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseForeignEmploymentCountriesSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise foreign employment countries summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseForeignEmploymentCountriesRouter = createTRPCRouter({
  getAll: getAllWardWiseForeignEmploymentCountries,
  getByWard: getWardWiseForeignEmploymentCountriesByWard,
  create: createWardWiseForeignEmploymentCountries,
  update: updateWardWiseForeignEmploymentCountries,
  delete: deleteWardWiseForeignEmploymentCountries,
  summary: getWardWiseForeignEmploymentCountriesSummary,
});
