import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseMajorSubject } from "@/server/db/schema/profile/education/ward-wise-major-subject";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseMajorSubjectSchema,
  wardWiseMajorSubjectFilterSchema,
  updateWardWiseMajorSubjectSchema,
  MajorSubjectTypeEnum,
} from "./ward-wise-major-subject.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise major subject data with optional filtering
export const getAllWardWiseMajorSubject = publicProcedure
  .input(wardWiseMajorSubjectFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseMajorSubject);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseMajorSubject.wardNumber, input.wardNumber),
          );
        }

        if (input?.subjectType) {
          conditions.push(
            eq(wardWiseMajorSubject.subjectType, input.subjectType),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and subject type
        data = await queryWithFilters.orderBy(
          wardWiseMajorSubject.wardNumber,
          wardWiseMajorSubject.subjectType,
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
            subject_type,
            population,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_major_subject
          ORDER BY 
            ward_number, subject_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            subjectType: row.subject_type,
            population: parseInt(String(row.population || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.subjectType) {
            data = data.filter(
              (item) => item.subjectType === input.subjectType,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise major subject data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseMajorSubjectByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseMajorSubject)
      .where(eq(wardWiseMajorSubject.wardNumber, input.wardNumber))
      .orderBy(wardWiseMajorSubject.subjectType);

    return data;
  });

// Create a new ward-wise major subject entry
export const createWardWiseMajorSubject = protectedProcedure
  .input(wardWiseMajorSubjectSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise major subject data",
      });
    }

    // Check if entry already exists for this ward and subject type
    const existing = await ctx.db
      .select({ id: wardWiseMajorSubject.id })
      .from(wardWiseMajorSubject)
      .where(
        and(
          eq(wardWiseMajorSubject.wardNumber, input.wardNumber),
          eq(wardWiseMajorSubject.subjectType, input.subjectType),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and subject ${input.subjectType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseMajorSubject).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      subjectType: input.subjectType,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward-wise major subject entry
export const updateWardWiseMajorSubject = protectedProcedure
  .input(updateWardWiseMajorSubjectSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise major subject data",
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
      .select({ id: wardWiseMajorSubject.id })
      .from(wardWiseMajorSubject)
      .where(eq(wardWiseMajorSubject.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseMajorSubject)
      .set({
        wardNumber: input.wardNumber,
        subjectType: input.subjectType,
        population: input.population,
      })
      .where(eq(wardWiseMajorSubject.id, input.id));

    return { success: true };
  });

// Delete a ward-wise major subject entry
export const deleteWardWiseMajorSubject = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise major subject data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseMajorSubject)
      .where(eq(wardWiseMajorSubject.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseMajorSubjectSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by subject type across all wards
      const summarySql = sql`
        SELECT 
          subject_type, 
          SUM(population) as total_population
        FROM 
          ward_wise_major_subject
        GROUP BY 
          subject_type
        ORDER BY 
          subject_type
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseMajorSubjectSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise major subject summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseMajorSubjectRouter = createTRPCRouter({
  getAll: getAllWardWiseMajorSubject,
  getByWard: getWardWiseMajorSubjectByWard,
  create: createWardWiseMajorSubject,
  update: updateWardWiseMajorSubject,
  delete: deleteWardWiseMajorSubject,
  summary: getWardWiseMajorSubjectSummary,
});
