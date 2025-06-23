import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityWideAgricultureRelatedFarmersGroup } from "@/server/db/schema/profile/economics/municipality-wide-agriculture-related-farmers-group";
import { eq, and, sql, ilike } from "drizzle-orm";
import {
  municipalityWideAgricultureRelatedFarmersGroupSchema,
  municipalityWideAgricultureRelatedFarmersGroupFilterSchema,
  updateMunicipalityWideAgricultureRelatedFarmersGroupSchema,
} from "./municipality-wide-agriculture-related-farmers-group.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all farmers group data with optional filtering
export const getAllMunicipalityWideAgricultureRelatedFarmersGroup = publicProcedure
  .input(municipalityWideAgricultureRelatedFarmersGroupFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(municipalityWideAgricultureRelatedFarmersGroup);

        let conditions = [];

        if (input?.name) {
          conditions.push(ilike(municipalityWideAgricultureRelatedFarmersGroup.name, `%${input.name}%`));
        }

        if (input?.wardNumber) {
          conditions.push(eq(municipalityWideAgricultureRelatedFarmersGroup.wardNumber, input.wardNumber));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by name
        data = await queryWithFilters.orderBy(
          municipalityWideAgricultureRelatedFarmersGroup.name,
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
            name,
            ward_number,
            updated_at,
            created_at
          FROM 
            acme_municipality_wide_agriculture_related_farmers_group
          ORDER BY 
            name
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            name: row.name,
            wardNumber: row.ward_number,
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.name) {
            data = data.filter((item) => item.name.toLowerCase().includes(input.name!.toLowerCase()));
          }
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching municipality-wide agriculture related farmers group data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data by ID
export const getMunicipalityWideAgricultureRelatedFarmersGroupById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(municipalityWideAgricultureRelatedFarmersGroup)
      .where(eq(municipalityWideAgricultureRelatedFarmersGroup.id, input.id))
      .limit(1);

    return data[0];
  });

// Create a new farmers group entry
export const createMunicipalityWideAgricultureRelatedFarmersGroup = protectedProcedure
  .input(municipalityWideAgricultureRelatedFarmersGroupSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create municipality-wide agriculture related farmers group data",
      });
    }

    // Create new record
    await ctx.db.insert(municipalityWideAgricultureRelatedFarmersGroup).values({
      id: input.id || uuidv4(),
      name: input.name,
      wardNumber: input.wardNumber,
    });

    return { success: true };
  });

// Update an existing farmers group entry
export const updateMunicipalityWideAgricultureRelatedFarmersGroup = protectedProcedure
  .input(updateMunicipalityWideAgricultureRelatedFarmersGroupSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update municipality-wide agriculture related farmers group data",
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
      .select({ id: municipalityWideAgricultureRelatedFarmersGroup.id })
      .from(municipalityWideAgricultureRelatedFarmersGroup)
      .where(eq(municipalityWideAgricultureRelatedFarmersGroup.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(municipalityWideAgricultureRelatedFarmersGroup)
      .set({
        name: input.name,
        wardNumber: input.wardNumber,
      })
      .where(eq(municipalityWideAgricultureRelatedFarmersGroup.id, input.id));

    return { success: true };
  });

// Delete a farmers group entry
export const deleteMunicipalityWideAgricultureRelatedFarmersGroup = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete municipality-wide agriculture related farmers group data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWideAgricultureRelatedFarmersGroup)
      .where(eq(municipalityWideAgricultureRelatedFarmersGroup.id, input.id));

    return { success: true };
  });

// Export the router with all procedures
export const municipalityWideAgricultureRelatedFarmersGroupRouter = createTRPCRouter({
  getAll: getAllMunicipalityWideAgricultureRelatedFarmersGroup,
  getById: getMunicipalityWideAgricultureRelatedFarmersGroupById,
  create: createMunicipalityWideAgricultureRelatedFarmersGroup,
  update: updateMunicipalityWideAgricultureRelatedFarmersGroup,
  delete: deleteMunicipalityWideAgricultureRelatedFarmersGroup,
});
