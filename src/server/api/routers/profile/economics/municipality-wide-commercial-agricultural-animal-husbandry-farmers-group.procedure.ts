import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup } from "@/server/db/schema/profile/economics/municipality-wide-commercial-agricultural-animal-husbandry-farmers-group";
import { eq, and, sql, ilike } from "drizzle-orm";
import {
  municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupSchema,
  municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupFilterSchema,
  updateMunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupSchema,
  BusinessTypeEnum,
} from "./municipality-wide-commercial-agricultural-animal-husbandry-farmers-group.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all farmers group data with optional filtering
export const getAllMunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup = publicProcedure
  .input(municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup);

        let conditions = [];

        if (input?.name) {
          conditions.push(ilike(municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup.name, `%${input.name}%`));
        }

        if (input?.wardNumber) {
          conditions.push(eq(municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup.wardNumber, input.wardNumber));
        }

        if (input?.type) {
          conditions.push(eq(municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup.type, input.type));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by name
        data = await queryWithFilters.orderBy(
          municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup.name,
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
            type,
            updated_at,
            created_at
          FROM 
            acme_municipality_wide_commercial_agricultural_animal_husbandry_farmers_group
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
            type: row.type,
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
          if (input?.type) {
            data = data.filter((item) => item.type === input.type);
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching municipality-wide commercial agricultural animal husbandry farmers group data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data by ID
export const getMunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup)
      .where(eq(municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup.id, input.id))
      .limit(1);

    return data[0];
  });

// Create a new farmers group entry
export const createMunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup = protectedProcedure
  .input(municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create municipality-wide commercial agricultural animal husbandry farmers group data",
      });
    }

    // Create new record
    await ctx.db.insert(municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup).values({
      id: input.id || uuidv4(),
      name: input.name,
      wardNumber: input.wardNumber,
      type: input.type,
    });

    return { success: true };
  });

// Update an existing farmers group entry
export const updateMunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup = protectedProcedure
  .input(updateMunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update municipality-wide commercial agricultural animal husbandry farmers group data",
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
      .select({ id: municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup.id })
      .from(municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup)
      .where(eq(municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup)
      .set({
        name: input.name,
        wardNumber: input.wardNumber,
        type: input.type,
      })
      .where(eq(municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup.id, input.id));

    return { success: true };
  });

// Delete a farmers group entry
export const deleteMunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete municipality-wide commercial agricultural animal husbandry farmers group data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup)
      .where(eq(municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup.id, input.id));

    return { success: true };
  });

// Export the router with all procedures
export const municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupRouter = createTRPCRouter({
  getAll: getAllMunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup,
  getById: getMunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupById,
  create: createMunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup,
  update: updateMunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup,
  delete: deleteMunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup,
});
