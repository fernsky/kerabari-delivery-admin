import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { consolidatedClimate } from "@/server/db/schema/profile/climate/consolidated";
import { eq, and, desc, sql, sum, avg, min, max, count, gte, lte, like } from "drizzle-orm";
import {
  consolidatedClimateSchema,
  updateConsolidatedClimateSchema,
  consolidatedClimateFilterSchema,
  bulkConsolidatedClimateSchema,
  timeSeriesFilterSchema,
  climateSummaryFilterSchema,
  VARIABLE_TYPE_LABELS,
  DOMAIN_LABELS,
  UNIT_LABELS,
} from "./consolidated-climate.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Type definitions for enum values
type ClimateDomain = "WEATHER_EXTREMES" | "AGRICULTURE_IRRIGATION" | "ENERGY" | "CLIMATE_CHANGE" | "DISASTER_RISK";
type ClimateVariableType = 
  | "TOTAL_PRECIPITATION" | "CONVECTIVE_PRECIPITATION" | "LARGE_SCALE_PRECIPITATION" | "MEAN_TOTAL_PRECIPITATION_RATE"
  | "RUNOFF" | "SURFACE_RUNOFF" | "SUB_SURFACE_RUNOFF" | "TEMPERATURE_2M" | "MAXIMUM_TEMPERATURE_2M" | "MINIMUM_TEMPERATURE_2M"
  | "SKIN_TEMPERATURE" | "WIND_U_COMPONENT_10M" | "WIND_V_COMPONENT_10M" | "WIND_GUST_10M" | "INSTANTANEOUS_WIND_GUST_10M"
  | "BOUNDARY_LAYER_HEIGHT" | "VOLUMETRIC_SOIL_WATER_LAYER_1" | "VOLUMETRIC_SOIL_WATER_LAYER_2" | "VOLUMETRIC_SOIL_WATER_LAYER_3"
  | "VOLUMETRIC_SOIL_WATER_LAYER_4" | "EVAPORATION" | "POTENTIAL_EVAPORATION" | "SURFACE_LATENT_HEAT_FLUX" | "MEAN_EVAPORATION_RATE"
  | "MEAN_RUNOFF_RATE" | "LEAF_AREA_INDEX_HIGH_VEGETATION" | "LEAF_AREA_INDEX_LOW_VEGETATION" | "HIGH_VEGETATION_COVER"
  | "LOW_VEGETATION_COVER" | "SOIL_TYPE" | "SURFACE_SOLAR_RADIATION_DOWNWARDS" | "TOA_INCIDENT_SOLAR_RADIATION"
  | "SURFACE_NET_SOLAR_RADIATION" | "CLEAR_SKY_DIRECT_SOLAR_RADIATION_AT_SURFACE" | "WIND_U_COMPONENT_100M" | "WIND_V_COMPONENT_100M"
  | "FRICTION_VELOCITY" | "SNOWMELT" | "MEAN_SURFACE_NET_LONG_WAVE_RADIATION_FLUX" | "MEAN_SURFACE_DOWNWARD_LONG_WAVE_RADIATION_FLUX"
  | "MEAN_SURFACE_NET_SHORT_WAVE_RADIATION_FLUX" | "TOTAL_CLOUD_COVER" | "LOW_CLOUD_COVER" | "HIGH_CLOUD_COVER"
  | "ALBEDO_UV_DIFFUSE" | "ALBEDO_UV_PARALLEL" | "ALBEDO_NIR_DIFFUSE" | "ALBEDO_NIR_PARALLEL" | "TOTAL_COLUMN_WATER_VAPOUR"
  | "VERTICAL_INTEGRAL_OF_TOTAL_ENERGY" | "TOTAL_COLUMN_OZONE" | "SURFACE_PRESSURE" | "MEAN_SEA_LEVEL_PRESSURE"
  | "CONVECTIVE_AVAILABLE_POTENTIAL_ENERGY" | "CONVECTIVE_INHIBITION" | "PRECIPITATION_TYPE" | "CONVECTIVE_RAIN_RATE"
  | "LARGE_SCALE_RAIN_RATE" | "INSTANTANEOUS_LARGE_SCALE_SURFACE_PRECIPITATION_FRACTION";

// Get all consolidated climate data with optional filtering
export const getAllConsolidatedClimate = publicProcedure
  .input(consolidatedClimateFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      const baseQuery = ctx.db.select().from(consolidatedClimate);
      let conditions = [];

      if (input?.domain) {
        conditions.push(eq(consolidatedClimate.domain, input.domain as ClimateDomain));
      }
      if (input?.variableType) {
        conditions.push(eq(consolidatedClimate.variableType, input.variableType as ClimateVariableType));
      }
      if (input?.wardNumber) {
        conditions.push(eq(consolidatedClimate.wardNumber, input.wardNumber));
      }
      if (input?.startDate) {
        conditions.push(gte(consolidatedClimate.measurementDate, input.startDate));
      }
      if (input?.endDate) {
        conditions.push(lte(consolidatedClimate.measurementDate, input.endDate));
      }
      if (input?.dataSource) {
        conditions.push(like(consolidatedClimate.dataSource, `%${input.dataSource}%`));
      }
      if (input?.stationId) {
        conditions.push(like(consolidatedClimate.stationId, `%${input.stationId}%`));
      }
      if (input?.qualityFlag) {
        conditions.push(eq(consolidatedClimate.qualityFlag, input.qualityFlag));
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      const data = await queryWithFilters
        .orderBy(desc(consolidatedClimate.measurementDate))
        .limit(1000); // Limit to prevent overwhelming response

      // Transform the data to include display labels
      return data.map(item => ({
        ...item,
        domainDisplay: DOMAIN_LABELS[item.domain] || item.domain,
        variableTypeDisplay: VARIABLE_TYPE_LABELS[item.variableType] || item.variableType,
        unitDisplay: UNIT_LABELS[item.unit] || item.unit,
      }));
    } catch (error) {
      console.error("Error fetching consolidated climate data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve climate data",
      });
    }
  });

// Get a single consolidated climate record by ID
export const getConsolidatedClimateById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db
        .select()
        .from(consolidatedClimate)
        .where(eq(consolidatedClimate.id, input.id))
        .limit(1);

      if (data.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Climate data record not found",
        });
      }

      const item = data[0];
      return {
        ...item,
        domainDisplay: DOMAIN_LABELS[item.domain] || item.domain,
        variableTypeDisplay: VARIABLE_TYPE_LABELS[item.variableType] || item.variableType,
        unitDisplay: UNIT_LABELS[item.unit] || item.unit,
      };
    } catch (error) {
      if (error instanceof TRPCError) throw error;
      console.error("Error fetching climate data by ID:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve climate data",
      });
    }
  });

// Create a new consolidated climate record
export const createConsolidatedClimate = protectedProcedure
  .input(consolidatedClimateSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create climate data",
      });
    }

    const processedInput = {
      id: input.id || uuidv4(),
      measurementDate: input.measurementDate,
      domain: input.domain,
      variableType: input.variableType,
      value: input.value.toString(), // Value is guaranteed to be non-null by schema
      unit: input.unit,
      wardNumber: input.wardNumber,
      latitude: input.latitude?.toString(),
      longitude: input.longitude?.toString(),
      dataSource: input.dataSource,
      stationId: input.stationId,
      additionalContext: input.additionalContext,
      qualityFlag: input.qualityFlag,
      confidenceLevel: input.confidenceLevel?.toString(),
    };

    // Create new record
    await ctx.db.insert(consolidatedClimate).values(processedInput);

    return { success: true, id: processedInput.id };
  });

// Update an existing consolidated climate record
export const updateConsolidatedClimate = protectedProcedure
  .input(updateConsolidatedClimateSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update climate data",
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
      .select({ id: consolidatedClimate.id })
      .from(consolidatedClimate)
      .where(eq(consolidatedClimate.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    const processedInput: Record<string, unknown> = { id: input.id };

    // Only include fields that are provided
    if (input.measurementDate !== undefined) processedInput.measurementDate = input.measurementDate;
    if (input.domain !== undefined) processedInput.domain = input.domain;
    if (input.variableType !== undefined) processedInput.variableType = input.variableType;
    if (input.value !== undefined) processedInput.value = input.value.toString();
    if (input.unit !== undefined) processedInput.unit = input.unit;
    if (input.wardNumber !== undefined) processedInput.wardNumber = input.wardNumber;
    if (input.latitude !== undefined) processedInput.latitude = input.latitude?.toString();
    if (input.longitude !== undefined) processedInput.longitude = input.longitude?.toString();
    if (input.dataSource !== undefined) processedInput.dataSource = input.dataSource;
    if (input.stationId !== undefined) processedInput.stationId = input.stationId;
    if (input.additionalContext !== undefined) processedInput.additionalContext = input.additionalContext;
    if (input.qualityFlag !== undefined) processedInput.qualityFlag = input.qualityFlag;
    if (input.confidenceLevel !== undefined) processedInput.confidenceLevel = input.confidenceLevel?.toString();

    // Update the record
    await ctx.db
      .update(consolidatedClimate)
      .set(processedInput)
      .where(eq(consolidatedClimate.id, input.id));

    return { success: true };
  });

// Delete a consolidated climate record
export const deleteConsolidatedClimate = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete climate data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(consolidatedClimate)
      .where(eq(consolidatedClimate.id, input.id));

    return { success: true };
  });

// Bulk create consolidated climate records
export const bulkCreateConsolidatedClimate = protectedProcedure
  .input(bulkConsolidatedClimateSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create climate data",
      });
    }

    const processedData = input.data.map(item => ({
      id: item.id || uuidv4(),
      measurementDate: item.measurementDate,
      domain: item.domain,
      variableType: item.variableType,
      value: item.value.toString(), // Value is guaranteed to be non-null by schema
      unit: item.unit,
      wardNumber: item.wardNumber,
      latitude: item.latitude?.toString(),
      longitude: item.longitude?.toString(),
      dataSource: item.dataSource,
      stationId: item.stationId,
      additionalContext: item.additionalContext,
      qualityFlag: item.qualityFlag,
      confidenceLevel: item.confidenceLevel?.toString(),
    }));

    // Insert all records
    await ctx.db.insert(consolidatedClimate).values(processedData);

    return { success: true, count: processedData.length };
  });

// Get time series data for analysis
export const getTimeSeriesData = publicProcedure
  .input(timeSeriesFilterSchema)
  .query(async ({ ctx, input }) => {
    try {
      let aggregationQuery: string;
      switch (input.aggregation) {
        case "HOURLY":
          aggregationQuery = "DATE_TRUNC('hour', measurement_date)";
          break;
        case "DAILY":
          aggregationQuery = "DATE_TRUNC('day', measurement_date)";
          break;
        case "WEEKLY":
          aggregationQuery = "DATE_TRUNC('week', measurement_date)";
          break;
        case "MONTHLY":
          aggregationQuery = "DATE_TRUNC('month', measurement_date)";
          break;
        case "YEARLY":
          aggregationQuery = "DATE_TRUNC('year', measurement_date)";
          break;
        default:
          aggregationQuery = "DATE_TRUNC('day', measurement_date)";
      }

      let conditions = [
        eq(consolidatedClimate.variableType, input.variableType as ClimateVariableType),
        gte(consolidatedClimate.measurementDate, input.startDate),
        lte(consolidatedClimate.measurementDate, input.endDate),
      ];

      if (input.wardNumber) {
        conditions.push(eq(consolidatedClimate.wardNumber, input.wardNumber));
      }

      const data = await ctx.db
        .select({
          timePeriod: sql<string>`${sql.raw(aggregationQuery)}`.as('time_period'),
          avgValue: avg(consolidatedClimate.value).as('avg_value'),
          minValue: min(consolidatedClimate.value).as('min_value'),
          maxValue: max(consolidatedClimate.value).as('max_value'),
          count: count(consolidatedClimate.value).as('count'),
        })
        .from(consolidatedClimate)
        .where(and(...conditions))
        .groupBy(sql`${sql.raw(aggregationQuery)}`)
        .orderBy(sql`${sql.raw(aggregationQuery)}`);

      return data.map(item => ({
        ...item,
        variableTypeDisplay: VARIABLE_TYPE_LABELS[input.variableType] || input.variableType,
      }));
    } catch (error) {
      console.error("Error fetching time series data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve time series data",
      });
    }
  });

// Get climate summary statistics
export const getClimateSummary = publicProcedure
  .input(climateSummaryFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      let conditions = [];

      if (input?.domain) {
        conditions.push(eq(consolidatedClimate.domain, input.domain as ClimateDomain));
      }
      if (input?.wardNumber) {
        conditions.push(eq(consolidatedClimate.wardNumber, input.wardNumber));
      }
      if (input?.startDate) {
        conditions.push(gte(consolidatedClimate.measurementDate, input.startDate));
      }
      if (input?.endDate) {
        conditions.push(lte(consolidatedClimate.measurementDate, input.endDate));
      }

      const baseQuery = conditions.length
        ? ctx.db.select().from(consolidatedClimate).where(and(...conditions))
        : ctx.db.select().from(consolidatedClimate);

      // Get summary statistics by domain
      const domainStats = await ctx.db
        .select({
          domain: consolidatedClimate.domain,
          count: count(consolidatedClimate.id).as('count'),
          avgValue: avg(consolidatedClimate.value).as('avg_value'),
          minValue: min(consolidatedClimate.value).as('min_value'),
          maxValue: max(consolidatedClimate.value).as('max_value'),
        })
        .from(consolidatedClimate)
        .where(conditions.length ? and(...conditions) : undefined)
        .groupBy(consolidatedClimate.domain);

      // Get summary statistics by variable type
      const variableStats = await ctx.db
        .select({
          variableType: consolidatedClimate.variableType,
          count: count(consolidatedClimate.id).as('count'),
          avgValue: avg(consolidatedClimate.value).as('avg_value'),
          minValue: min(consolidatedClimate.value).as('min_value'),
          maxValue: max(consolidatedClimate.value).as('max_value'),
        })
        .from(consolidatedClimate)
        .where(conditions.length ? and(...conditions) : undefined)
        .groupBy(consolidatedClimate.variableType)
        .orderBy(desc(count(consolidatedClimate.id)))
        .limit(20);

      // Get total count
      const totalCount = await ctx.db
        .select({ count: count(consolidatedClimate.id) })
        .from(consolidatedClimate)
        .where(conditions.length ? and(...conditions) : undefined);

      return {
        totalRecords: totalCount[0]?.count || 0,
        domainStats: domainStats.map(item => ({
          ...item,
          domainDisplay: DOMAIN_LABELS[item.domain] || item.domain,
        })),
        variableStats: variableStats.map(item => ({
          ...item,
          variableTypeDisplay: VARIABLE_TYPE_LABELS[item.variableType] || item.variableType,
        })),
      };
    } catch (error) {
      console.error("Error fetching climate summary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve climate summary",
      });
    }
  });

// Get available data sources and stations
export const getDataSources = publicProcedure.query(async ({ ctx }) => {
  try {
    const dataSources = await ctx.db
      .select({
        dataSource: consolidatedClimate.dataSource,
        count: count(consolidatedClimate.id).as('count'),
      })
      .from(consolidatedClimate)
      .where(sql`${consolidatedClimate.dataSource} IS NOT NULL`)
      .groupBy(consolidatedClimate.dataSource)
      .orderBy(desc(count(consolidatedClimate.id)));

    const stations = await ctx.db
      .select({
        stationId: consolidatedClimate.stationId,
        count: count(consolidatedClimate.id).as('count'),
      })
      .from(consolidatedClimate)
      .where(sql`${consolidatedClimate.stationId} IS NOT NULL`)
      .groupBy(consolidatedClimate.stationId)
      .orderBy(desc(count(consolidatedClimate.id)));

    return {
      dataSources: dataSources.filter(item => item.dataSource),
      stations: stations.filter(item => item.stationId),
    };
  } catch (error) {
    console.error("Error fetching data sources:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to retrieve data sources",
    });
  }
});

// Export the router with all procedures
export const consolidatedClimateRouter = createTRPCRouter({
  getAll: getAllConsolidatedClimate,
  getById: getConsolidatedClimateById,
  create: createConsolidatedClimate,
  update: updateConsolidatedClimate,
  delete: deleteConsolidatedClimate,
  bulkCreate: bulkCreateConsolidatedClimate,
  timeSeries: getTimeSeriesData,
  summary: getClimateSummary,
  dataSources: getDataSources,
}); 