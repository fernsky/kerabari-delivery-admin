import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseBirthplaceHouseholds } from "@/server/db/schema/profile/demographics/ward-wise-birthplace-households";
import { eq, and, sql } from "drizzle-orm";
import {
  wardWiseBirthplaceHouseholdsSchema,
  wardWiseBirthplaceHouseholdsFilterSchema,
  updateWardWiseBirthplaceHouseholdsSchema,
  BirthPlaceEnum,
} from "./ward-wise-birthplace-households.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise birthplace households data with optional filtering
export const getAllWardWiseBirthplaceHouseholds = publicProcedure
  .input(wardWiseBirthplaceHouseholdsFilterSchema.optional())
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
          .from(wardWiseBirthplaceHouseholds);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(
              wardWiseBirthplaceHouseholds.wardNumber,
              input.wardNumber,
            ),
          );
        }

        if (input?.birthPlace) {
          conditions.push(
            eq(
              wardWiseBirthplaceHouseholds.birthPlace,
              input.birthPlace,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and birth place
        data = await queryWithFilters.orderBy(
          wardWiseBirthplaceHouseholds.wardNumber,
          wardWiseBirthplaceHouseholds.birthPlace,
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
            birth_place,
            households
          FROM 
            acme_ward_wise_birthplace_households
          ORDER BY 
            ward_number, birth_place
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            birthPlace: row.birth_place,
            households: parseInt(String(row.households || "0")),
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.birthPlace) {
            data = data.filter((item) => item.birthPlace === input.birthPlace);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-wise birthplace households data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseBirthplaceHouseholdsByWard = publicProcedure
  .input(z.object({ wardNumber: z.number().int().positive() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseBirthplaceHouseholds)
      .where(
        eq(
          wardWiseBirthplaceHouseholds.wardNumber,
          input.wardNumber,
        ),
      )
      .orderBy(
        wardWiseBirthplaceHouseholds.birthPlace,
      );

    return data;
  });

// Create a new ward-wise birthplace households entry
export const createWardWiseBirthplaceHouseholds = protectedProcedure
  .input(wardWiseBirthplaceHouseholdsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise birthplace households data",
      });
    }

    // Check if entry already exists for this ward and birth place
    const existing = await ctx.db
      .select({ id: wardWiseBirthplaceHouseholds.id })
      .from(wardWiseBirthplaceHouseholds)
      .where(
        and(
          eq(
            wardWiseBirthplaceHouseholds.wardNumber,
            input.wardNumber,
          ),
          eq(
            wardWiseBirthplaceHouseholds.birthPlace,
            input.birthPlace,
          ),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and birth place ${input.birthPlace} already exists`,
      });
    }

    // Create new record
    await ctx.db
      .insert(wardWiseBirthplaceHouseholds)
      .values({
        id: input.id || uuidv4(),
        wardNumber: input.wardNumber,
        birthPlace: input.birthPlace,
        households: input.households,
      });

    return { success: true };
  });

// Update an existing ward-wise birthplace households entry
export const updateWardWiseBirthplaceHouseholds = protectedProcedure
  .input(updateWardWiseBirthplaceHouseholdsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise birthplace households data",
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
      .select({ id: wardWiseBirthplaceHouseholds.id })
      .from(wardWiseBirthplaceHouseholds)
      .where(eq(wardWiseBirthplaceHouseholds.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseBirthplaceHouseholds)
      .set({
        wardNumber: input.wardNumber,
        birthPlace: input.birthPlace,
        households: input.households,
      })
      .where(eq(wardWiseBirthplaceHouseholds.id, input.id));

    return { success: true };
  });

// Delete a ward-wise birthplace households entry
export const deleteWardWiseBirthplaceHouseholds = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise birthplace households data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseBirthplaceHouseholds)
      .where(eq(wardWiseBirthplaceHouseholds.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseBirthplaceHouseholdsSummary = publicProcedure
  .query(async ({ ctx }) => {
    try {
      // Get total counts by birth place across all wards
      const summarySql = sql`
        SELECT 
          birth_place, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_birthplace_households
        GROUP BY 
          birth_place
        ORDER BY 
          birth_place
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error(
        "Error in getWardWiseBirthplaceHouseholdsSummary:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise birthplace households summary",
      });
    }
  });

// Export the router with all procedures
export const wardWiseBirthplaceHouseholdsRouter = createTRPCRouter({
  getAll: getAllWardWiseBirthplaceHouseholds,
  getByWard: getWardWiseBirthplaceHouseholdsByWard,
  create: createWardWiseBirthplaceHouseholds,
  update: updateWardWiseBirthplaceHouseholds,
  delete: deleteWardWiseBirthplaceHouseholds,
  summary: getWardWiseBirthplaceHouseholdsSummary,
});
