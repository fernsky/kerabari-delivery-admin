import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseLiteracyStatus } from "@/server/db/schema/profile/education/ward-wise-literacy-status";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseLiteracyStatusSchema,
  wardWiseLiteracyStatusFilterSchema,
  updateWardWiseLiteracyStatusSchema,
  LiteracyTypeEnum,
} from "./ward-wise-literacy-status.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise literacy status data with optional filtering
export const getAllWardWiseLiteracyStatus = publicProcedure
  .input(wardWiseLiteracyStatusFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseLiteracyStatus);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseLiteracyStatus.wardNumber, input.wardNumber),
          );
        }

        if (input?.literacyType) {
          conditions.push(
            eq(wardWiseLiteracyStatus.literacyType, input.literacyType),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and literacy type
        data = await queryWithFilters.orderBy(
          wardWiseLiteracyStatus.wardNumber,
          wardWiseLiteracyStatus.literacyType,
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
            literacy_type,
            population,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_literacy_status
          ORDER BY 
            ward_number, literacy_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            literacyType: row.literacy_type,
            population: parseInt(String(row.population || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.literacyType) {
            data = data.filter(
              (item) => item.literacyType === input.literacyType,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise literacy status data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseLiteracyStatusByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseLiteracyStatus)
      .where(eq(wardWiseLiteracyStatus.wardNumber, input.wardNumber))
      .orderBy(wardWiseLiteracyStatus.literacyType);

    return data;
  });

// Create a new ward-wise literacy status entry
export const createWardWiseLiteracyStatus = protectedProcedure
  .input(wardWiseLiteracyStatusSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise literacy status data",
      });
    }

    // Check if entry already exists for this ward and literacy type
    const existing = await ctx.db
      .select({ id: wardWiseLiteracyStatus.id })
      .from(wardWiseLiteracyStatus)
      .where(
        and(
          eq(wardWiseLiteracyStatus.wardNumber, input.wardNumber),
          eq(wardWiseLiteracyStatus.literacyType, input.literacyType),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and literacy type ${input.literacyType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseLiteracyStatus).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      literacyType: input.literacyType,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward-wise literacy status entry
export const updateWardWiseLiteracyStatus = protectedProcedure
  .input(updateWardWiseLiteracyStatusSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise literacy status data",
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
      .select({ id: wardWiseLiteracyStatus.id })
      .from(wardWiseLiteracyStatus)
      .where(eq(wardWiseLiteracyStatus.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseLiteracyStatus)
      .set({
        wardNumber: input.wardNumber,
        literacyType: input.literacyType,
        population: input.population,
      })
      .where(eq(wardWiseLiteracyStatus.id, input.id));

    return { success: true };
  });

// Delete a ward-wise literacy status entry
export const deleteWardWiseLiteracyStatus = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise literacy status data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseLiteracyStatus)
      .where(eq(wardWiseLiteracyStatus.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseLiteracyStatusSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by literacy type across all wards
      const summarySql = sql`
        SELECT 
          literacy_type, 
          SUM(population) as total_population
        FROM 
          acme_ward_wise_literacy_status
        GROUP BY 
          literacy_type
        ORDER BY 
          literacy_type
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseLiteracyStatusSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise literacy status summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseLiteracyStatusRouter = createTRPCRouter({
  getAll: getAllWardWiseLiteracyStatus,
  getByWard: getWardWiseLiteracyStatusByWard,
  create: createWardWiseLiteracyStatus,
  update: updateWardWiseLiteracyStatus,
  delete: deleteWardWiseLiteracyStatus,
  summary: getWardWiseLiteracyStatusSummary,
});
