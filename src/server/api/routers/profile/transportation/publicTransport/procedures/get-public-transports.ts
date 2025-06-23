import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { publicTransport } from "@/server/db/schema/profile/institutions/transportation/publicTransport";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { and, eq, like, sql, inArray, or, isNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Define enum for public transport types
const publicTransportTypeEnum = [
  "BUS",
  "MINIBUS",
  "MICROBUS",
  "TEMPO",
  "AUTO_RICKSHAW",
  "TAXI",
  "E_RICKSHAW",
  "OTHER",
];

// Define enum for vehicle conditions
const vehicleConditionEnum = [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "VERY_POOR",
  "UNDER_MAINTENANCE",
];

// Define enum for frequency
const frequencyEnum = [
  "DAILY",
  "WEEKDAYS_ONLY",
  "WEEKENDS_ONLY",
  "OCCASIONAL",
  "SEASONAL",
];

// Filter schema for public transport queries with pagination
const publicTransportFilterSchema = z.object({
  type: z.enum(publicTransportTypeEnum as [string, ...string[]]).optional(),
  vehicleCondition: z
    .enum(vehicleConditionEnum as [string, ...string[]])
    .optional(),
  frequency: z.enum(frequencyEnum as [string, ...string[]]).optional(),
  searchTerm: z.string().optional(),
  operatorName: z.string().optional(),
  hasAirConditioning: z.boolean().optional(),
  hasWifi: z.boolean().optional(),
  isAccessible: z.boolean().optional(),
  servingRoadId: z.string().optional(), // Filter by roads they serve
  parkingFacilityId: z.string().optional(), // Filter by parking facilities they use
  // Pagination
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(12),
  // View type - determines how much data to fetch
  viewType: z.enum(["table", "grid", "map"]).default("table"),
  // Sorting
  sortBy: z.string().optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Get all public transports with optional filtering and pagination
export const getAllPublicTransports = publicProcedure
  .input(publicTransportFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      const {
        page = 1,
        pageSize = 12,
        viewType = "table",
        sortBy = "name",
        sortOrder = "asc",
      } = input || {};

      // Calculate offset for pagination
      const offset = (page - 1) * pageSize;

      // Build query with conditions
      const conditions = [];

      if (input?.type && input.type.trim() !== "") {
        conditions.push(eq(publicTransport.type, input.type as any));
      }

      if (input?.vehicleCondition && input.vehicleCondition.trim() !== "") {
        conditions.push(
          eq(publicTransport.vehicleCondition, input.vehicleCondition as any),
        );
      }

      if (input?.frequency && input.frequency.trim() !== "") {
        conditions.push(eq(publicTransport.frequency, input.frequency as any));
      }

      if (input?.operatorName && input.operatorName.trim() !== "") {
        conditions.push(
          like(publicTransport.operatorName || "", `%${input.operatorName}%`),
        );
      }

      if (input?.searchTerm && input.searchTerm.trim() !== "") {
        conditions.push(
          or(
            like(publicTransport.name, `%${input.searchTerm}%`),
            like(publicTransport.description || "", `%${input.searchTerm}%`),
            like(publicTransport.routeName || "", `%${input.searchTerm}%`),
            like(publicTransport.startPoint || "", `%${input.searchTerm}%`),
            like(publicTransport.endPoint || "", `%${input.searchTerm}%`),
            like(publicTransport.viaPoints || "", `%${input.searchTerm}%`),
            like(publicTransport.operatorName || "", `%${input.searchTerm}%`),
          ),
        );
      }

      if (input?.hasAirConditioning !== undefined) {
        conditions.push(
          eq(publicTransport.hasAirConditioning, input.hasAirConditioning),
        );
      }

      if (input?.hasWifi !== undefined) {
        conditions.push(eq(publicTransport.hasWifi, input.hasWifi));
      }

      if (input?.isAccessible !== undefined) {
        conditions.push(eq(publicTransport.isAccessible, input.isAccessible));
      }

      if (input?.servingRoadId && input.servingRoadId.trim() !== "") {
        conditions.push(
          like(
            publicTransport.servingRoadIds || "",
            `%${input.servingRoadId}%`,
          ),
        );
      }

      if (input?.parkingFacilityId && input.parkingFacilityId.trim() !== "") {
        conditions.push(
          like(
            publicTransport.parkingFacilityIds || "",
            `%${input.parkingFacilityId}%`,
          ),
        );
      }

      // Determine which fields to select based on viewType
      let selectFields: any = {
        id: publicTransport.id,
        name: publicTransport.name,
        slug: publicTransport.slug,
        type: publicTransport.type,
        operatorName: publicTransport.operatorName,
        routeName: publicTransport.routeName,
        startPoint: publicTransport.startPoint,
        endPoint: publicTransport.endPoint,
        frequency: publicTransport.frequency,
      };

      // Add fields based on view type
      if (viewType === "table" || viewType === "grid") {
        selectFields = {
          ...selectFields,
          description: publicTransport.description,
          viaPoints: publicTransport.viaPoints,
          estimatedDuration: publicTransport.estimatedDuration,
          startTime: publicTransport.startTime,
          endTime: publicTransport.endTime,
          intervalMinutes: publicTransport.intervalMinutes,
          vehicleCount: publicTransport.vehicleCount,
          seatingCapacity: publicTransport.seatingCapacity,
          vehicleCondition: publicTransport.vehicleCondition,
          hasAirConditioning: publicTransport.hasAirConditioning,
          hasWifi: publicTransport.hasWifi,
          isAccessible: publicTransport.isAccessible,
          fareAmount: publicTransport.fareAmount,
          fareDescription: publicTransport.fareDescription,
        };
      }

      // Add geometry fields based on view type
      if (viewType === "map") {
        selectFields.routePath = sql`CASE WHEN ${publicTransport.routePath} IS NOT NULL THEN ST_AsGeoJSON(${publicTransport.routePath}) ELSE NULL END`;
        selectFields.stopPoints = sql`CASE WHEN ${publicTransport.stopPoints} IS NOT NULL THEN ST_AsGeoJSON(${publicTransport.stopPoints}) ELSE NULL END`;
      } else {
        // For non-map views, we might still want basic route information
        selectFields.hasRouteGeometry = sql`CASE WHEN ${publicTransport.routePath} IS NOT NULL THEN TRUE ELSE FALSE END`;
        selectFields.hasStopGeometry = sql`CASE WHEN ${publicTransport.stopPoints} IS NOT NULL THEN TRUE ELSE FALSE END`;
      }

      // Get total count for pagination
      const totalCount = await ctx.db
        .select({ count: sql`count(*)` })
        .from(publicTransport)
        .where(conditions.length ? and(...conditions) : undefined)
        .then((result) => Number(result[0].count));

      // Query public transports with selected fields
      const transports = await ctx.db
        .select({ transport: selectFields })
        .from(publicTransport)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(
          sortOrder === "asc"
            ? sql`${sql.identifier(sortBy)} ASC`
            : sql`${sql.identifier(sortBy)} DESC`,
        )
        .limit(pageSize)
        .offset(offset);

      // Process results for GeoJSON if needed
      const processedTransports = transports.map((t) => {
        const result: any = { ...t.transport };

        if (viewType === "map") {
          if (t.transport.routePath) {
            result.routePath = JSON.parse(t.transport.routePath as string);
          }
          if (t.transport.stopPoints) {
            result.stopPoints = JSON.parse(t.transport.stopPoints as string);
          }
        }

        return result;
      });

      // Get primary media for each public transport
      const transportIds = processedTransports.map((t) => t.id);

      // Only query media if we have transports
      let transportsWithMedia = processedTransports;

      if (transportIds.length > 0) {
        const primaryMedia = await ctx.db
          .select({
            entityId: entityMedia.entityId,
            mediaId: media.id,
            filePath: media.filePath,
            fileName: media.fileName,
            mimeType: media.mimeType,
          })
          .from(entityMedia)
          .innerJoin(media, eq(entityMedia.mediaId, media.id))
          .where(
            and(
              inArray(entityMedia.entityId, transportIds),
              eq(entityMedia.entityType, "PUBLIC_TRANSPORT" as any),
              eq(entityMedia.isPrimary, true),
            ),
          );

        // Generate presigned URLs using the minio-helpers utility
        const mediaWithUrls = await generateBatchPresignedUrls(
          ctx.minio,
          primaryMedia.map((item) => ({
            id: item.mediaId,
            filePath: item.filePath,
            fileName: item.fileName,
          })),
          24 * 60 * 60, // 24 hour expiry
        );

        // Create a map of entity ID to media data with presigned URL
        const primaryMediaMap = new Map(
          mediaWithUrls.map((item, index) => [
            primaryMedia[index].entityId,
            {
              mediaId: primaryMedia[index].mediaId,
              url: item.url || "",
              fileName: item.fileName || primaryMedia[index].fileName,
              mimeType: primaryMedia[index].mimeType,
            },
          ]),
        );

        // Combine transports with their primary media
        transportsWithMedia = processedTransports.map((t) => ({
          ...t,
          primaryMedia: primaryMediaMap.get(t.id) || null,
        }));
      }

      return {
        items: transportsWithMedia,
        page,
        pageSize,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNextPage: page * pageSize < totalCount,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      console.error("Error fetching public transports:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve public transport data",
      });
    }
  });
