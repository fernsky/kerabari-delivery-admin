import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { road } from "@/server/db/schema/profile/institutions/transportation/road";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { and, eq, like, sql, inArray, or, isNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Define enum for road types
const roadTypeEnum = [
  "HIGHWAY",
  "URBAN",
  "RURAL",
  "GRAVEL",
  "EARTHEN",
  "AGRICULTURAL",
  "ALLEY",
  "BRIDGE",
];

// Define enum for road conditions
const roadConditionEnum = [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "VERY_POOR",
  "UNDER_CONSTRUCTION",
];

// Filter schema for road queries with pagination
const roadFilterSchema = z.object({
  type: z.enum(roadTypeEnum as [string, ...string[]]).optional(),
  condition: z.enum(roadConditionEnum as [string, ...string[]]).optional(),
  searchTerm: z.string().optional(),
  hasStreetLights: z.boolean().optional(),
  hasDivider: z.boolean().optional(),
  hasPedestrian: z.boolean().optional(),
  hasBicycleLane: z.boolean().optional(),
  // Pagination
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(12),
  // View type - determines how much data to fetch
  viewType: z.enum(["table", "grid", "map"]).default("table"),
  // Sorting
  sortBy: z.string().optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Get all roads with optional filtering and pagination
export const getAllRoads = publicProcedure
  .input(roadFilterSchema.optional())
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
        conditions.push(eq(road.type, input.type as any));
      }

      if (input?.condition && input.condition.trim() !== "") {
        conditions.push(eq(road.condition, input.condition as any));
      }

      if (input?.searchTerm && input.searchTerm.trim() !== "") {
        conditions.push(
          or(
            like(road.name, `%${input.searchTerm}%`),
            like(road.description || "", `%${input.searchTerm}%`),
            like(road.startPoint || "", `%${input.searchTerm}%`),
            like(road.endPoint || "", `%${input.searchTerm}%`),
          ),
        );
      }

      if (input?.hasStreetLights !== undefined) {
        conditions.push(eq(road.hasStreetLights, input.hasStreetLights));
      }

      if (input?.hasDivider !== undefined) {
        conditions.push(eq(road.hasDivider, input.hasDivider));
      }

      if (input?.hasPedestrian !== undefined) {
        conditions.push(eq(road.hasPedestrian, input.hasPedestrian));
      }

      if (input?.hasBicycleLane !== undefined) {
        conditions.push(eq(road.hasBicycleLane, input.hasBicycleLane));
      }

      // Determine which fields to select based on viewType
      let selectFields: any = {
        id: road.id,
        name: road.name,
        slug: road.slug,
        type: road.type,
        condition: road.condition,
        widthInMeters: road.widthInMeters,
        length: road.length,
      };

      // Add fields based on view type
      if (viewType === "table" || viewType === "grid") {
        selectFields = {
          ...selectFields,
          description: road.description,
          hasStreetLights: road.hasStreetLights,
          hasDivider: road.hasDivider,
          hasPedestrian: road.hasPedestrian,
          hasBicycleLane: road.hasBicycleLane,
          drainageSystem: road.drainageSystem,
          maintenanceYear: road.maintenanceYear,
          startPoint: road.startPoint,
          endPoint: road.endPoint,
          createdAt: road.createdAt,
          updatedAt: road.updatedAt,
        };
      }

      // Add geometry fields based on view type
      if (viewType === "map") {
        selectFields.roadPath = sql`CASE WHEN ${road.roadPath} IS NOT NULL THEN ST_AsGeoJSON(${road.roadPath}) ELSE NULL END`;
        selectFields.representativePoint = sql`CASE WHEN ${road.representativePoint} IS NOT NULL THEN ST_AsGeoJSON(${road.representativePoint}) ELSE NULL END`;
      } else {
        // For non-map views, include representative point for display purposes
        selectFields.representativePoint = sql`CASE WHEN ${road.representativePoint} IS NOT NULL THEN ST_AsGeoJSON(${road.representativePoint}) ELSE NULL END`;
      }

      // Get total count for pagination
      const totalCount = await ctx.db
        .select({ count: sql`count(*)` })
        .from(road)
        .where(conditions.length ? and(...conditions) : undefined)
        .then((result) => Number(result[0].count));

      // Query roads with selected fields
      const roads = await ctx.db
        .select({ road: selectFields })
        .from(road)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(
          sortOrder === "asc"
            ? sql`${sql.identifier(sortBy)} ASC`
            : sql`${sql.identifier(sortBy)} DESC`,
        )
        .limit(pageSize)
        .offset(offset);

      // Process results for GeoJSON if needed
      const processedRoads = roads.map((r) => {
        const result: any = { ...r.road };

        if (r.road.representativePoint) {
          result.representativePoint = JSON.parse(
            r.road.representativePoint as string,
          );
        }

        if (viewType === "map" && r.road.roadPath) {
          result.roadPath = JSON.parse(r.road.roadPath as string);
        }

        return result;
      });

      // Get primary media for each road
      const roadIds = processedRoads.map((r) => r.id);

      // Only query media if we have roads
      let roadsWithMedia = processedRoads;

      if (roadIds.length > 0) {
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
              inArray(entityMedia.entityId, roadIds),
              eq(entityMedia.entityType, "ROAD"),
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
        console.log(primaryMedia);

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

        // Combine roads with their primary media
        roadsWithMedia = processedRoads.map((r) => ({
          ...r,
          primaryMedia: primaryMediaMap.get(r.id) || null,
        }));
      }

      return {
        items: roadsWithMedia,
        page,
        pageSize,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNextPage: page * pageSize < totalCount,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      console.error("Error fetching roads:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve roads",
      });
    }
  });
