import { publicProcedure } from "@/server/api/trpc";
import { road } from "@/server/db/schema/profile/institutions/transportation/road";
import { sql, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Get summary statistics for roads
export const getRoadSummary = publicProcedure.query(async ({ ctx }) => {
  try {
    // Set UTF-8 encoding
    await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

    // Get total roads count
    const totalRoadsResult = await ctx.db
      .select({ count: sql`COUNT(*)` })
      .from(road)
      .where(eq(road.isActive, true));

    const totalRoads = Number(totalRoadsResult[0].count || 0);

    // Get total road length (converting from meters to kilometers)
    const totalLengthResult = await ctx.db
      .select({
        length: sql`COALESCE(SUM(${road.length}), 0) / 1000`,
      })
      .from(road)
      .where(eq(road.isActive, true));

    const totalLength = Number(totalLengthResult[0].length || 0);

    // Get length by road type
    const lengthByTypeResult = await ctx.db
      .select({
        type: road.type,
        length: sql`COALESCE(SUM(${road.length}), 0) / 1000`,
      })
      .from(road)
      .where(eq(road.isActive, true))
      .groupBy(road.type);

    // Create a map of road type to length
    const lengthByType: Record<string, number> = {};
    lengthByTypeResult.forEach((item) => {
      lengthByType[item.type] = Number(item.length);
    });

    // Get count by road type
    const countByTypeResult = await ctx.db
      .select({
        type: road.type,
        count: sql`COUNT(*)`,
      })
      .from(road)
      .where(eq(road.isActive, true))
      .groupBy(road.type);

    // Create a map of road type to count
    const countByType: Record<string, number> = {};
    countByTypeResult.forEach((item) => {
      countByType[item.type] = Number(item.count);
    });

    // Get paved road length (highways & urban roads)
    const pavedRoadLength =
      Number(lengthByType.HIGHWAY || 0) + Number(lengthByType.URBAN || 0);

    // Get earthen road length
    const earthenRoadLength = Number(lengthByType.EARTHEN || 0);

    // Get counts by road condition
    const countByConditionResult = await ctx.db
      .select({
        condition: road.condition,
        count: sql`COUNT(*)`,
      })
      .from(road)
      .where(eq(road.isActive, true))
      .groupBy(road.condition);

    // Create a map of road condition to count
    const countByCondition: Record<string, number> = {};
    countByConditionResult.forEach((item) => {
      if (item.condition) {
        countByCondition[item.condition] = Number(item.count);
      }
    });

    // Get length by road condition
    const lengthByConditionResult = await ctx.db
      .select({
        condition: road.condition,
        length: sql`COALESCE(SUM(${road.length}), 0) / 1000`,
      })
      .from(road)
      .where(eq(road.isActive, true))
      .groupBy(road.condition);

    // Create a map of road condition to length
    const lengthByCondition: Record<string, number> = {};
    lengthByConditionResult.forEach((item) => {
      if (item.condition) {
        lengthByCondition[item.condition] = Number(item.length);
      }
    });

    // Count roads with special features
    const specialFeaturesResult = await ctx.db
      .select({
        hasStreetLights: sql`SUM(CASE WHEN ${road.hasStreetLights} = true THEN 1 ELSE 0 END)`,
        hasDivider: sql`SUM(CASE WHEN ${road.hasDivider} = true THEN 1 ELSE 0 END)`,
        hasPedestrian: sql`SUM(CASE WHEN ${road.hasPedestrian} = true THEN 1 ELSE 0 END)`,
        hasBicycleLane: sql`SUM(CASE WHEN ${road.hasBicycleLane} = true THEN 1 ELSE 0 END)`,
      })
      .from(road)
      .where(eq(road.isActive, true));

    return {
      totalRoads,
      totalLength,
      lengthByType,
      countByType,
      pavedRoadLength,
      earthenRoadLength,
      countByCondition,
      lengthByCondition,
      specialFeatures: {
        streetLights: Number(specialFeaturesResult[0].hasStreetLights || 0),
        divider: Number(specialFeaturesResult[0].hasDivider || 0),
        pedestrianPath: Number(specialFeaturesResult[0].hasPedestrian || 0),
        bicycleLane: Number(specialFeaturesResult[0].hasBicycleLane || 0),
      },
    };
  } catch (error) {
    console.error("Error generating road summary:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to generate road summary data",
    });
  }
});
