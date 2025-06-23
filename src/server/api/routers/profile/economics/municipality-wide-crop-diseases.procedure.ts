import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityWideCropDiseases } from "@/server/db/schema/profile/economics/municipality-wide-crop-diseases";
import { eq, and, sql } from "drizzle-orm";
import {
  municipalityWideCropDiseasesSchema,
  municipalityWideCropDiseasesFilterSchema,
  updateMunicipalityWideCropDiseasesSchema,
  CropTypeEnum,
} from "./municipality-wide-crop-diseases.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all municipality-wide crop diseases data with optional filtering
export const getAllMunicipalityWideCropDiseases = publicProcedure
  .input(municipalityWideCropDiseasesFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(municipalityWideCropDiseases);

        let conditions = [];

        if (input?.crop) {
          conditions.push(eq(municipalityWideCropDiseases.crop, input.crop));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by crop type
        data = await queryWithFilters.orderBy(
          municipalityWideCropDiseases.crop,
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
            crop,
            major_pests,
            major_diseases,
            updated_at,
            created_at
          FROM 
            acme_municipality_wide_crop_diseases
          ORDER BY 
            crop
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            crop: row.crop,
            majorPests: row.major_pests,
            majorDiseases: row.major_diseases,
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.crop) {
            data = data.filter((item) => item.crop === input.crop);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching municipality-wide crop diseases data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific crop type
export const getMunicipalityWideCropDiseasesByCrop = publicProcedure
  .input(z.object({ crop: CropTypeEnum }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(municipalityWideCropDiseases)
      .where(eq(municipalityWideCropDiseases.crop, input.crop));

    return data;
  });

// Create a new municipality-wide crop diseases entry
export const createMunicipalityWideCropDiseases = protectedProcedure
  .input(municipalityWideCropDiseasesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create municipality-wide crop diseases data",
      });
    }

    // Check if entry already exists for this crop type
    const existing = await ctx.db
      .select({ id: municipalityWideCropDiseases.id })
      .from(municipalityWideCropDiseases)
      .where(eq(municipalityWideCropDiseases.crop, input.crop))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for crop type ${input.crop} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(municipalityWideCropDiseases).values({
      id: input.id || uuidv4(),
      crop: input.crop,
      majorPests: input.majorPests,
      majorDiseases: input.majorDiseases,
    });

    return { success: true };
  });

// Update an existing municipality-wide crop diseases entry
export const updateMunicipalityWideCropDiseases = protectedProcedure
  .input(updateMunicipalityWideCropDiseasesSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update municipality-wide crop diseases data",
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
      .select({ id: municipalityWideCropDiseases.id })
      .from(municipalityWideCropDiseases)
      .where(eq(municipalityWideCropDiseases.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(municipalityWideCropDiseases)
      .set({
        crop: input.crop,
        majorPests: input.majorPests,
        majorDiseases: input.majorDiseases,
      })
      .where(eq(municipalityWideCropDiseases.id, input.id));

    return { success: true };
  });

// Delete a municipality-wide crop diseases entry
export const deleteMunicipalityWideCropDiseases = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete municipality-wide crop diseases data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWideCropDiseases)
      .where(eq(municipalityWideCropDiseases.id, input.id));

    return { success: true };
  });

// Export the router with all procedures
export const municipalityWideCropDiseasesRouter = createTRPCRouter({
  getAll: getAllMunicipalityWideCropDiseases,
  getByCrop: getMunicipalityWideCropDiseasesByCrop,
  create: createMunicipalityWideCropDiseases,
  update: updateMunicipalityWideCropDiseases,
  delete: deleteMunicipalityWideCropDiseases,
});
