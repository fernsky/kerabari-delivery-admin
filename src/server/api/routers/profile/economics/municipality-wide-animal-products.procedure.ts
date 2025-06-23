import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityWideAnimalProducts } from "@/server/db/schema/profile/economics/municipality-wide-animal-products";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  municipalityWideAnimalProductsSchema,
  municipalityWideAnimalProductsFilterSchema,
  updateMunicipalityWideAnimalProductsSchema,
  AnimalProductTypeEnum,
} from "./municipality-wide-animal-products.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all municipality-wide animal products data with optional filtering
export const getAllMunicipalityWideAnimalProducts = publicProcedure
  .input(municipalityWideAnimalProductsFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(municipalityWideAnimalProducts);

        let conditions = [];

        if (input?.animalProduct) {
          conditions.push(
            eq(
              municipalityWideAnimalProducts.animalProduct,
              input.animalProduct,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by animal product type
        data = await queryWithFilters.orderBy(
          municipalityWideAnimalProducts.animalProduct,
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
            animal_product,
            production_amount,
            sales_amount,
            revenue_in_rs,
            measurement_unit,
            updated_at,
            created_at
          FROM 
            acme_municipality_wide_animal_products
          ORDER BY 
            animal_product
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            animalProduct: row.animal_product,
            productionAmount: parseFloat(String(row.production_amount || "0")),
            salesAmount: parseFloat(String(row.sales_amount || "0")),
            revenue: parseFloat(String(row.revenue_in_rs || "0")),
            measurementUnit: mapDatabaseUnitToEnum(
              row.measurement_unit as string,
            ),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.animalProduct) {
            data = data.filter(
              (item) => item.animalProduct === input.animalProduct,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching municipality-wide animal products data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Helper function to map Nepali unit text to enum values
function mapDatabaseUnitToEnum(unit: string) {
  switch (unit) {
    case "टन":
      return "TON";
    case "संख्या":
      return "COUNT";
    case "किलोग्राम":
      return "KG";
    case "लिटर":
      return "LITER";
    default:
      return "OTHER";
  }
}

// Get data for a specific animal product type
export const getMunicipalityWideAnimalProductsByType = publicProcedure
  .input(z.object({ animalProduct: AnimalProductTypeEnum }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(municipalityWideAnimalProducts)
      .where(
        eq(municipalityWideAnimalProducts.animalProduct, input.animalProduct),
      );

    return data;
  });

// Create a new municipality-wide animal products entry
export const createMunicipalityWideAnimalProducts = protectedProcedure
  .input(municipalityWideAnimalProductsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create municipality-wide animal products data",
      });
    }

    // Check if entry already exists for this animal product type
    const existing = await ctx.db
      .select({ id: municipalityWideAnimalProducts.id })
      .from(municipalityWideAnimalProducts)
      .where(
        eq(municipalityWideAnimalProducts.animalProduct, input.animalProduct),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for animal product type ${input.animalProduct} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(municipalityWideAnimalProducts).values({
      id: input.id || uuidv4(),
      animalProduct: input.animalProduct,
      productionAmount: input.productionAmount.toString(),
      salesAmount: input.salesAmount.toString(),
      revenue: input.revenue.toString(),
      measurementUnit: input.measurementUnit,
    });

    return { success: true };
  });

// Update an existing municipality-wide animal products entry
export const updateMunicipalityWideAnimalProducts = protectedProcedure
  .input(updateMunicipalityWideAnimalProductsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update municipality-wide animal products data",
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
      .select({ id: municipalityWideAnimalProducts.id })
      .from(municipalityWideAnimalProducts)
      .where(eq(municipalityWideAnimalProducts.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(municipalityWideAnimalProducts)
      .set({
        animalProduct: input.animalProduct,
        productionAmount: input.productionAmount.toString(),
        salesAmount: input.salesAmount.toString(),
        revenue: input.revenue.toString(),
        measurementUnit: input.measurementUnit,
      })
      .where(eq(municipalityWideAnimalProducts.id, input.id));

    return { success: true };
  });

// Delete a municipality-wide animal products entry
export const deleteMunicipalityWideAnimalProducts = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete municipality-wide animal products data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWideAnimalProducts)
      .where(eq(municipalityWideAnimalProducts.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getMunicipalityWideAnimalProductsSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total production, sales, and revenue by animal product type
      const summarySql = sql`
        SELECT 
          animal_product, 
          SUM(production_amount) as total_production,
          SUM(sales_amount) as total_sales,
          SUM(revenue_in_rs) as total_revenue,
          measurement_unit
        FROM 
          acme_municipality_wide_animal_products
        GROUP BY 
          animal_product, measurement_unit
        ORDER BY 
          total_production DESC
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error(
        "Error in getMunicipalityWideAnimalProductsSummary:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve municipality-wide animal products summary",
      });
    }
  },
);

// Export the router with all procedures
export const municipalityWideAnimalProductsRouter = createTRPCRouter({
  getAll: getAllMunicipalityWideAnimalProducts,
  getByType: getMunicipalityWideAnimalProductsByType,
  create: createMunicipalityWideAnimalProducts,
  update: updateMunicipalityWideAnimalProducts,
  delete: deleteMunicipalityWideAnimalProducts,
  summary: getMunicipalityWideAnimalProductsSummary,
});
