import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardTimeWiseHouseholdChores } from "@/server/db/schema/profile/economics/ward-time-wise-household-chores";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  addWardTimeWiseHouseholdChoresSchema,
  getWardTimeWiseHouseholdChoresSchema,
  batchAddWardTimeWiseHouseholdChoresSchema,
  TimeSpentEnum,
} from "./ward-time-wise-household-chores.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward time-wise household chores data with optional filtering
export const getAllWardTimeWiseHouseholdChores = publicProcedure
  .input(getWardTimeWiseHouseholdChoresSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardTimeWiseHouseholdChores);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardTimeWiseHouseholdChores.wardNumber, input.wardNumber),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number, time spent
        data = await queryWithFilters.orderBy(
          wardTimeWiseHouseholdChores.wardNumber,
          wardTimeWiseHouseholdChores.timeSpent,
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
            time_spent,
            population
          FROM 
            acme_ward_time_wise_household_chores
          ORDER BY 
            ward_number, time_spent
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            timeSpent: row.time_spent,
            population: parseInt(String(row.population || "0")),
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward time-wise household chores data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardTimeWiseHouseholdChoresByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardTimeWiseHouseholdChores)
      .where(eq(wardTimeWiseHouseholdChores.wardNumber, input.wardNumber))
      .orderBy(wardTimeWiseHouseholdChores.timeSpent);

    return data;
  });

// Add ward time-wise household chores data
export const addWardTimeWiseHouseholdChores = protectedProcedure
  .input(addWardTimeWiseHouseholdChoresSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can add ward time-wise household chores data",
      });
    }

    // Delete existing data for the ward before adding new data
    await ctx.db
      .delete(wardTimeWiseHouseholdChores)
      .where(eq(wardTimeWiseHouseholdChores.wardNumber, input.wardNumber));

    // Insert new data
    for (const item of input.data) {
      await ctx.db.insert(wardTimeWiseHouseholdChores).values({
        id: uuidv4(),
        wardNumber: input.wardNumber,
        timeSpent: item.timeSpent,
        population: item.population,
      });
    }

    return { success: true };
  });

// Batch add ward time-wise household chores data for multiple wards
export const batchAddWardTimeWiseHouseholdChores = protectedProcedure
  .input(batchAddWardTimeWiseHouseholdChoresSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can batch add ward time-wise household chores data",
      });
    }

    // Process each ward data entry
    for (const item of input.data) {
      // Delete existing data for this ward
      await ctx.db
        .delete(wardTimeWiseHouseholdChores)
        .where(eq(wardTimeWiseHouseholdChores.wardNumber, item.wardNumber));

      // Insert new data
      await ctx.db.insert(wardTimeWiseHouseholdChores).values({
        id: uuidv4(),
        wardNumber: item.wardNumber,
        timeSpent: item.timeSpent,
        population: item.population,
      });
    }

    return { success: true };
  });

// Delete ward time-wise household chores data for a specific ward
export const deleteWardTimeWiseHouseholdChores = protectedProcedure
  .input(z.object({ wardNumber: z.number() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward time-wise household chores data",
      });
    }

    // Delete all data for the ward
    await ctx.db
      .delete(wardTimeWiseHouseholdChores)
      .where(eq(wardTimeWiseHouseholdChores.wardNumber, input.wardNumber));

    return { success: true };
  });

// Get summary statistics
export const getWardTimeWiseHouseholdChoresSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by time spent category across all wards
      const summarySql = sql`
        SELECT 
          time_spent, 
          SUM(population) as total_population
        FROM 
          ward_time_wise_household_chores
        GROUP BY 
          time_spent
        ORDER BY 
          time_spent
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardTimeWiseHouseholdChoresSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward time-wise household chores summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardTimeWiseHouseholdChoresRouter = createTRPCRouter({
  getAll: getAllWardTimeWiseHouseholdChores,
  getByWard: getWardTimeWiseHouseholdChoresByWard,
  add: addWardTimeWiseHouseholdChores,
  batchAdd: batchAddWardTimeWiseHouseholdChores,
  delete: deleteWardTimeWiseHouseholdChores,
  summary: getWardTimeWiseHouseholdChoresSummary,
});
