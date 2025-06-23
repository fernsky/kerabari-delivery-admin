import { sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { and, count, eq } from "drizzle-orm";
import productAgriculturalLand from "@/server/db/schema/family/agricultural-lands";
import { productCrop } from "@/server/db/schema/family/crops";
import { productAnimal } from "@/server/db/schema/family/animals";
import { productAnimalProduct } from "@/server/db/schema/family/animal-products";

export const getAgriculturalLandStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        ownershipType: productAgriculturalLand.landOwnershipType,
        totalArea: sql<number>`sum(${productAgriculturalLand.landArea})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(productAgriculturalLand);

    if (input.wardNumber) {
      query.where(eq(productAgriculturalLand.wardNo, input.wardNumber));
    }

    return await query.groupBy(productAgriculturalLand.landOwnershipType);
  });

export const getIrrigationStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        isIrrigated: productAgriculturalLand.isLandIrrigated,
        totalArea: sql<number>`sum(${productAgriculturalLand.irrigatedLandArea})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(productAgriculturalLand);

    if (input.wardNumber) {
      query.where(eq(productAgriculturalLand.wardNo, input.wardNumber));
    }

    return await query.groupBy(productAgriculturalLand.isLandIrrigated);
  });

export const getCropStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        cropType: productCrop.cropType,
        cropName: productCrop.cropName,
        totalArea: sql<number>`sum(${productCrop.cropArea})::float`,
        totalProduction: sql<number>`sum(${productCrop.cropProduction})::float`,
        totalRevenue: sql<number>`sum(${productCrop.cropRevenue})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(productCrop);

    if (input.wardNumber) {
      query.where(eq(productCrop.wardNo, input.wardNumber));
    }

    return await query.groupBy(productCrop.cropType, productCrop.cropName);
  });

export const getAnimalStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        animalName: productAnimal.animalName,
        totalCount: sql<number>`sum(${productAnimal.totalAnimals})::int`,
        totalSales: sql<number>`sum(${productAnimal.animalSales})::float`,
        totalRevenue: sql<number>`sum(${productAnimal.animalRevenue})::float`,
        householdCount: sql<number>`count(*)::int`,
      })
      .from(productAnimal);

    if (input.wardNumber) {
      query.where(eq(productAnimal.wardNo, input.wardNumber));
    }

    return await query.groupBy(productAnimal.animalName);
  });

export const getAnimalProductStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        productName: productAnimalProduct.animalProductName,
        unit: productAnimalProduct.animalProductUnit,
        totalProduction: sql<number>`sum(${productAnimalProduct.animalProductProduction})::float`,
        totalSales: sql<number>`sum(${productAnimalProduct.animalProductSales})::float`,
        totalRevenue: sql<number>`sum(${productAnimalProduct.animalProductRevenue})::float`,
        householdCount: sql<number>`count(*)::int`,
      })
      .from(productAnimalProduct);

    if (input.wardNumber) {
      query.where(eq(productAnimalProduct.wardNo, input.wardNumber));
    }

    return await query.groupBy(
      productAnimalProduct.animalProductName,
      productAnimalProduct.animalProductUnit,
    );
  });

export const getAgriculturalLandOverview = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        totalLandArea: sql<number>`sum(${productAgriculturalLand.landArea})::float`,
        totalIrrigatedArea: sql<number>`sum(${productAgriculturalLand.irrigatedLandArea})::float`,
        householdCount: sql<number>`count(distinct ${productAgriculturalLand.familyId})::int`,
      })
      .from(productAgriculturalLand);

    if (input.wardNumber) {
      query.where(eq(productAgriculturalLand.wardNo, input.wardNumber));
    }

    return (await query)[0];
  });

export const getAgricultureOverview = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const baseWhere = input.wardNumber
      ? sql`ward_no = ${input.wardNumber}`
      : sql`1=1`;

    const [crops, animals, products] = await Promise.all([
      ctx.db.execute(sql`
        SELECT 
          COUNT(DISTINCT family_id)::int as total_households,
          SUM(crop_revenue)::float as total_revenue,
          SUM(crop_area)::float as total_area
        FROM ${productCrop}
        WHERE ${baseWhere}
      `),
      ctx.db.execute(sql`
        SELECT 
          COUNT(DISTINCT family_id)::int as total_households,
          SUM(animal_revenue)::float as total_revenue,
          SUM(total_animals)::int as total_count
        FROM ${productAnimal}
        WHERE ${baseWhere}
      `),
      ctx.db.execute(sql`
        SELECT 
          COUNT(DISTINCT family_id)::int as total_households,
          SUM(animal_product_revenue)::float as total_revenue
        FROM ${productAnimalProduct}
        WHERE ${baseWhere}
      `),
    ]);

    return {
      crops: crops[0],
      animals: animals[0],
      animalProducts: products[0],
    };
  });
