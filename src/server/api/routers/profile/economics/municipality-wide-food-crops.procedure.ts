import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityWideFoodCrops } from "@/server/db/schema/profile/economics/municipality-wide-food-crops";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  municipalityWideFoodCropsSchema,
  municipalityWideFoodCropsFilterSchema,
  updateMunicipalityWideFoodCropsSchema,
  FoodCropTypeEnum,
} from "./municipality-wide-food-crops.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all municipality-wide food crops data with optional filtering
export const getAllMunicipalityWideFoodCrops = publicProcedure
  .input(municipalityWideFoodCropsFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(municipalityWideFoodCrops);

        let conditions = [];

        if (input?.foodCrop) {
          conditions.push(
            eq(municipalityWideFoodCrops.foodCrop, input.foodCrop),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by food crop type
        data = await queryWithFilters.orderBy(
          municipalityWideFoodCrops.foodCrop,
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
            food_crop,
            production_in_tonnes,
            sales_in_tonnes,
            revenue_in_rs,
            updated_at,
            created_at
          FROM 
            acme_municipality_wide_food_crops
          ORDER BY 
            food_crop
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            foodCrop: row.food_crop,
            productionInTonnes: parseFloat(
              String(row.production_in_tonnes || "0"),
            ),
            salesInTonnes: parseFloat(String(row.sales_in_tonnes || "0")),
            revenueInRs: parseFloat(String(row.revenue_in_rs || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.foodCrop) {
            data = data.filter((item) => item.foodCrop === input.foodCrop);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching municipality-wide food crops data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific food crop
export const getMunicipalityWideFoodCropsByType = publicProcedure
  .input(z.object({ foodCrop: FoodCropTypeEnum }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(municipalityWideFoodCrops)
      .where(eq(municipalityWideFoodCrops.foodCrop, input.foodCrop));

    return data;
  });

// Create a new municipality-wide food crops entry
export const createMunicipalityWideFoodCrops = protectedProcedure
  .input(municipalityWideFoodCropsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create municipality-wide food crops data",
      });
    }

    // Check if entry already exists for this food crop
    const existing = await ctx.db
      .select({ id: municipalityWideFoodCrops.id })
      .from(municipalityWideFoodCrops)
      .where(eq(municipalityWideFoodCrops.foodCrop, input.foodCrop))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for food crop type ${input.foodCrop} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(municipalityWideFoodCrops).values({
      id: input.id || uuidv4(),
      foodCrop: input.foodCrop,
      productionInTonnes: input.productionInTonnes.toString(),
      salesInTonnes: input.salesInTonnes.toString(),
      revenueInRs: input.revenueInRs.toString(),
    });

    return { success: true };
  });

// Update an existing municipality-wide food crops entry
export const updateMunicipalityWideFoodCrops = protectedProcedure
  .input(updateMunicipalityWideFoodCropsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update municipality-wide food crops data",
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
      .select({ id: municipalityWideFoodCrops.id })
      .from(municipalityWideFoodCrops)
      .where(eq(municipalityWideFoodCrops.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(municipalityWideFoodCrops)
      .set({
        foodCrop: input.foodCrop,
        productionInTonnes: input.productionInTonnes.toString(),
        salesInTonnes: input.salesInTonnes.toString(),
        revenueInRs: input.revenueInRs.toString(),
      })
      .where(eq(municipalityWideFoodCrops.id, input.id));

    return { success: true };
  });

// Delete a municipality-wide food crops entry
export const deleteMunicipalityWideFoodCrops = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete municipality-wide food crops data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWideFoodCrops)
      .where(eq(municipalityWideFoodCrops.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getMunicipalityWideFoodCropsSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total production, sales, and revenue by food crop type
      const summarySql = sql`
        SELECT 
          food_crop, 
          SUM(production_in_tonnes) as total_production,
          SUM(sales_in_tonnes) as total_sales,
          SUM(revenue_in_rs) as total_revenue
        FROM 
          acme_municipality_wide_food_crops
        GROUP BY 
          food_crop
        ORDER BY 
          total_production DESC
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getMunicipalityWideFoodCropsSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve municipality-wide food crops summary",
      });
    }
  },
);

// Export the router with all procedures
export const municipalityWideFoodCropsRouter = createTRPCRouter({
  getAll: getAllMunicipalityWideFoodCrops,
  getByType: getMunicipalityWideFoodCropsByType,
  create: createMunicipalityWideFoodCrops,
  update: updateMunicipalityWideFoodCrops,
  delete: deleteMunicipalityWideFoodCrops,
  summary: getMunicipalityWideFoodCropsSummary,
});
