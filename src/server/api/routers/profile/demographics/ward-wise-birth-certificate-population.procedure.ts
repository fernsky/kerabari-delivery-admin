// filepath: /Users/sarbagya/Desktop/buddhashanti-delivery-admin/src/server/api/routers/profile/demographics/ward-wise-birth-certificate-population.procedure.ts
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseBirthCertificatePopulation } from "@/server/db/schema/profile/demographics/ward-wise-birth-certificate-population";
import { eq, and, sql } from "drizzle-orm";
import {
  wardWiseBirthCertificatePopulationSchema,
  wardWiseBirthCertificatePopulationFilterSchema,
  updateWardWiseBirthCertificatePopulationSchema,
} from "./ward-wise-birth-certificate-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise birth certificate population data with optional filtering
export const getAllWardWiseBirthCertificatePopulation = publicProcedure
  .input(wardWiseBirthCertificatePopulationFilterSchema.optional())
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
          .from(wardWiseBirthCertificatePopulation);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(
              wardWiseBirthCertificatePopulation.wardNumber,
              input.wardNumber,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number
        const rawData = await queryWithFilters.orderBy(
          wardWiseBirthCertificatePopulation.wardNumber,
        );

        // Transform data to match expected format (separate rows for each status)
        data = [];
        rawData.forEach((row) => {
          // Add "With" status row
          data.push({
            id: `${row.id}_with`,
            wardNumber: row.wardNumber,
            birthCertificateStatus: "With",
            population: row.withBirthCertificate,
            malePopulation: null, // Not available in new schema
            femalePopulation: null, // Not available in new schema
            otherPopulation: null, // Not available in new schema
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
          });

          // Add "Without" status row
          data.push({
            id: `${row.id}_without`,
            wardNumber: row.wardNumber,
            birthCertificateStatus: "Without",
            population: row.withoutBirthCertificate,
            malePopulation: null, // Not available in new schema
            femalePopulation: null, // Not available in new schema
            otherPopulation: null, // Not available in new schema
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
          });
        });
      } catch (err) {
        console.error("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            ward_number,
            with_birth_certificate,
            without_birth_certificate,
            total_population_under_5,
            created_at,
            updated_at
          FROM 
            acme_ward_wise_birth_certificate_population
          ORDER BY 
            ward_number
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema (separate rows for each status)
          data = [];
          acmeResult.forEach((row) => {
            // Add "With" status row
            data.push({
              id: `${row.id}_with`,
              wardNumber: parseInt(String(row.ward_number)),
              birthCertificateStatus: "With",
              population: parseInt(String(row.with_birth_certificate || "0")),
              malePopulation: null, // Not available in ACME schema
              femalePopulation: null, // Not available in ACME schema
              otherPopulation: null, // Not available in ACME schema
              createdAt: row.created_at,
              updatedAt: row.updated_at,
            });

            // Add "Without" status row
            data.push({
              id: `${row.id}_without`,
              wardNumber: parseInt(String(row.ward_number)),
              birthCertificateStatus: "Without",
              population: parseInt(String(row.without_birth_certificate || "0")),
              malePopulation: null, // Not available in ACME schema
              femalePopulation: null, // Not available in ACME schema
              otherPopulation: null, // Not available in ACME schema
              createdAt: row.created_at,
              updatedAt: row.updated_at,
            });
          });

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-wise birth certificate population data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseBirthCertificatePopulationByWard = publicProcedure
  .input(z.object({ wardNumber: z.number().int().positive() }))
  .query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db
        .select()
        .from(wardWiseBirthCertificatePopulation)
        .where(
          eq(
            wardWiseBirthCertificatePopulation.wardNumber,
            input.wardNumber,
          ),
        );

      if (data.length === 0) {
        // Try ACME table
        const acmeSql = sql`
          SELECT 
            id,
            ward_number,
            with_birth_certificate,
            without_birth_certificate,
            total_population_under_5
          FROM 
            acme_ward_wise_birth_certificate_population
          WHERE
            ward_number = ${input.wardNumber}
        `;
        
        const acmeResult = await ctx.db.execute(acmeSql);
        
        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected format
          const transformedData: Array<{
            id: string;
            wardNumber: number;
            birthCertificateStatus: string;
            population: number;
            malePopulation: null;
            femalePopulation: null;
            otherPopulation: null;
          }> = [];
          acmeResult.forEach((row) => {
            // Add "With" status row
            transformedData.push({
              id: `${row.id}_with`,
              wardNumber: parseInt(String(row.ward_number)),
              birthCertificateStatus: "With",
              population: parseInt(String(row.with_birth_certificate || "0")),
              malePopulation: null,
              femalePopulation: null,
              otherPopulation: null,
            });

            // Add "Without" status row
            transformedData.push({
              id: `${row.id}_without`,
              wardNumber: parseInt(String(row.ward_number)),
              birthCertificateStatus: "Without",
              population: parseInt(String(row.without_birth_certificate || "0")),
              malePopulation: null,
              femalePopulation: null,
              otherPopulation: null,
            });
          });
          return transformedData;
        }
      }

      // Transform main schema data to match expected format
      const transformedData: Array<{
        id: string;
        wardNumber: number;
        birthCertificateStatus: string;
        population: number;
        malePopulation: null;
        femalePopulation: null;
        otherPopulation: null;
      }> = [];
      data.forEach((row) => {
        // Add "With" status row
        transformedData.push({
          id: `${row.id}_with`,
          wardNumber: row.wardNumber,
          birthCertificateStatus: "With",
          population: row.withBirthCertificate,
          malePopulation: null,
          femalePopulation: null,
          otherPopulation: null,
        });

        // Add "Without" status row
        transformedData.push({
          id: `${row.id}_without`,
          wardNumber: row.wardNumber,
          birthCertificateStatus: "Without",
          population: row.withoutBirthCertificate,
          malePopulation: null,
          femalePopulation: null,
          otherPopulation: null,
        });
      });

      return transformedData;
    } catch (error) {
      console.error(
        "Error fetching ward-wise birth certificate population data for ward:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data for ward",
      });
    }
  });

// Create a new ward-wise birth certificate population entry
export const createWardWiseBirthCertificatePopulation = protectedProcedure
  .input(wardWiseBirthCertificatePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise birth certificate population data",
      });
    }

    // Check if entry already exists for this ward
    const existing = await ctx.db
      .select({ id: wardWiseBirthCertificatePopulation.id })
      .from(wardWiseBirthCertificatePopulation)
      .where(
        eq(
          wardWiseBirthCertificatePopulation.wardNumber,
          input.wardNumber,
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} already exists`,
      });
    }

    // Create new record
    await ctx.db
      .insert(wardWiseBirthCertificatePopulation)
      .values({
        id: input.id || uuidv4(),
        wardNumber: input.wardNumber,
        withBirthCertificate: input.withBirthCertificate,
        withoutBirthCertificate: input.withoutBirthCertificate,
        totalPopulationUnder5: input.totalPopulationUnder5,
      });

    return { success: true };
  });

// Update an existing ward-wise birth certificate population entry
export const updateWardWiseBirthCertificatePopulation = protectedProcedure
  .input(updateWardWiseBirthCertificatePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise birth certificate population data",
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
      .select({ id: wardWiseBirthCertificatePopulation.id })
      .from(wardWiseBirthCertificatePopulation)
      .where(eq(wardWiseBirthCertificatePopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseBirthCertificatePopulation)
      .set({
        wardNumber: input.wardNumber,
        withBirthCertificate: input.withBirthCertificate,
        withoutBirthCertificate: input.withoutBirthCertificate,
        totalPopulationUnder5: input.totalPopulationUnder5,
      })
      .where(eq(wardWiseBirthCertificatePopulation.id, input.id));

    return { success: true };
  });

// Delete a ward-wise birth certificate population entry
export const deleteWardWiseBirthCertificatePopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise birth certificate population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseBirthCertificatePopulation)
      .where(eq(wardWiseBirthCertificatePopulation.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseBirthCertificatePopulationSummary = publicProcedure
  .query(async ({ ctx }) => {
    try {
      // Try to get summary from main schema first
      let summaryData;
      try {
        const summarySql = sql`
          SELECT 
            'With' as birth_certificate_status,
            SUM(with_birth_certificate) as total_population
          FROM 
            ward_wise_birth_certificate_population
          UNION ALL
          SELECT 
            'Without' as birth_certificate_status,
            SUM(without_birth_certificate) as total_population
          FROM 
            ward_wise_birth_certificate_population
          ORDER BY 
            birth_certificate_status
        `;

        summaryData = await ctx.db.execute(summarySql);
      } catch (err) {
        console.log("Failed to query main schema for summary, trying ACME table:", err);
        // Fallback to ACME table
        const acmeSummarySql = sql`
          SELECT 
            'With' as birth_certificate_status,
            SUM(with_birth_certificate) as total_population
          FROM 
            acme_ward_wise_birth_certificate_population
          UNION ALL
          SELECT 
            'Without' as birth_certificate_status,
            SUM(without_birth_certificate) as total_population
          FROM 
            acme_ward_wise_birth_certificate_population
          ORDER BY 
            birth_certificate_status
        `;

        summaryData = await ctx.db.execute(acmeSummarySql);
      }
      
      // Transform to expected format
      const transformedData = Array.isArray(summaryData) ? summaryData.map(row => ({
        birthCertificateStatus: row.birth_certificate_status,
        totalPopulation: parseInt(String(row.total_population || "0")),
        totalMalePopulation: null, // Not available in new schema
        totalFemalePopulation: null, // Not available in new schema
        totalOtherPopulation: null, // Not available in new schema
      })) : [];
      
      // Calculate overall totals
      const withEntry = transformedData.find(item => item.birthCertificateStatus === "With");
      const withoutEntry = transformedData.find(item => item.birthCertificateStatus === "Without");
      
      const totalWithCertificate = withEntry?.totalPopulation || 0;
      const totalWithoutCertificate = withoutEntry?.totalPopulation || 0;
      const totalPopulation = totalWithCertificate + totalWithoutCertificate;
      
      return {
        statusBreakdown: transformedData,
        total: {
          totalPopulation: totalPopulation,
          totalMalePopulation: null, // Not available in new schema
          totalFemalePopulation: null, // Not available in new schema
          totalOtherPopulation: null, // Not available in new schema
        }
      };
    } catch (error) {
      console.error(
        "Error in getWardWiseBirthCertificatePopulationSummary:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise birth certificate population summary",
      });
    }
  });

// Export the router with all procedures
export const wardWiseBirthCertificatePopulationRouter = createTRPCRouter({
  getAll: getAllWardWiseBirthCertificatePopulation,
  getByWard: getWardWiseBirthCertificatePopulationByWard,
  create: createWardWiseBirthCertificatePopulation,
  update: updateWardWiseBirthCertificatePopulation,
  delete: deleteWardWiseBirthCertificatePopulation,
  summary: getWardWiseBirthCertificatePopulationSummary,
});