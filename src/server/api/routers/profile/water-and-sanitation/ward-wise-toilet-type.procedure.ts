import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseToiletType } from "@/server/db/schema/profile/water-and-sanitation/ward-wise-toilet-type";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseToiletTypeSchema,
  wardWiseToiletTypeFilterSchema,
  updateWardWiseToiletTypeSchema,
  ToiletTypeEnum,
} from "./ward-wise-toilet-type.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise toilet type data with optional filtering
export const getAllWardWiseToiletType = publicProcedure
  .input(wardWiseToiletTypeFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseToiletType);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(eq(wardWiseToiletType.wardNumber, input.wardNumber));
        }

        if (input?.toiletType) {
          conditions.push(eq(wardWiseToiletType.toiletType, input.toiletType));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and toilet type
        data = await queryWithFilters.orderBy(
          wardWiseToiletType.wardNumber,
          wardWiseToiletType.toiletType,
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
            toilet_type,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_toilet_type
          ORDER BY 
            ward_number, toilet_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            toiletType: row.toilet_type,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.toiletType) {
            data = data.filter((item) => item.toiletType === input.toiletType);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise toilet type data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseToiletTypeByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseToiletType)
      .where(eq(wardWiseToiletType.wardNumber, input.wardNumber))
      .orderBy(wardWiseToiletType.toiletType);

    return data;
  });

// Create a new ward-wise toilet type entry
export const createWardWiseToiletType = protectedProcedure
  .input(wardWiseToiletTypeSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise toilet type data",
      });
    }

    // Check if entry already exists for this ward and toilet type
    const existing = await ctx.db
      .select({ id: wardWiseToiletType.id })
      .from(wardWiseToiletType)
      .where(
        and(
          eq(wardWiseToiletType.wardNumber, input.wardNumber),
          eq(wardWiseToiletType.toiletType, input.toiletType),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and toilet type ${input.toiletType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseToiletType).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      toiletType: input.toiletType,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise toilet type entry
export const updateWardWiseToiletType = protectedProcedure
  .input(updateWardWiseToiletTypeSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise toilet type data",
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
      .select({ id: wardWiseToiletType.id })
      .from(wardWiseToiletType)
      .where(eq(wardWiseToiletType.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseToiletType)
      .set({
        wardNumber: input.wardNumber,
        toiletType: input.toiletType,
        households: input.households,
      })
      .where(eq(wardWiseToiletType.id, input.id));

    return { success: true };
  });

// Delete a ward-wise toilet type entry
export const deleteWardWiseToiletType = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise toilet type data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseToiletType)
      .where(eq(wardWiseToiletType.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseToiletTypeSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by toilet type across all wards
      const summarySql = sql`
        SELECT 
          toilet_type, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_toilet_type
        GROUP BY 
          toilet_type
        ORDER BY 
          toilet_type
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseToiletTypeSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise toilet type summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseToiletTypeRouter = createTRPCRouter({
  getAll: getAllWardWiseToiletType,
  getByWard: getWardWiseToiletTypeByWard,
  create: createWardWiseToiletType,
  update: updateWardWiseToiletType,
  delete: deleteWardWiseToiletType,
  summary: getWardWiseToiletTypeSummary,
});
