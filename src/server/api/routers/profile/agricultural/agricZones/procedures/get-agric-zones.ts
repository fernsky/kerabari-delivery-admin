import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { agricZone } from "@/server/db/schema/profile/institutions/agricultural/agricZones";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { and, eq, like, sql, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Define enum for agricultural zone types
const agricZoneTypeEnum = [
  "PULSES",
  "OILSEEDS",
  "COMMERCIAL_FLOWER",
  "SEASONAL_CROPS",
  "SUPER_ZONE",
  "POCKET_AREA",
  "MIXED",
  "OTHER",
];

// Define enum for soil quality
const soilQualityEnum = ["EXCELLENT", "GOOD", "AVERAGE", "POOR", "VERY_POOR"];

// Define enum for irrigation systems
const irrigationSystemEnum = [
  "CANAL",
  "SPRINKLER",
  "DRIP",
  "GROUNDWATER",
  "RAINWATER_HARVESTING",
  "SEASONAL_RIVER",
  "NONE",
  "MIXED",
];

// Filter schema for agricultural zone queries with pagination
const agricZoneFilterSchema = z.object({
  type: z.enum(agricZoneTypeEnum as [string, ...string[]]).optional(),
  soilQuality: z.enum(soilQualityEnum as [string, ...string[]]).optional(),
  irrigationSystem: z
    .enum(irrigationSystemEnum as [string, ...string[]])
    .optional(),
  wardNumber: z.number().int().positive().optional(),
  searchTerm: z.string().optional(),
  isGovernmentOwned: z.boolean().optional(),
  hasStorage: z.boolean().optional(),
  hasProcessingUnit: z.boolean().optional(),
  hasFarmersCooperative: z.boolean().optional(),
  majorCrop: z.string().optional(), // To search within majorCrops field

  // Pagination
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(12),

  // View type - determines how much data to fetch
  viewType: z.enum(["table", "grid", "map"]).default("table"),

  // Sorting
  sortBy: z.string().optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Get all agricultural zones with optional filtering and pagination
export const getAllAgricZones = publicProcedure
  .input(agricZoneFilterSchema.optional())
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
        conditions.push(eq(agricZone.type, input.type as any));
      }

      if (input?.soilQuality && input.soilQuality.trim() !== "") {
        conditions.push(eq(agricZone.soilQuality, input.soilQuality as any));
      }

      if (input?.irrigationSystem && input.irrigationSystem.trim() !== "") {
        conditions.push(
          eq(agricZone.irrigationSystem, input.irrigationSystem as any),
        );
      }

      if (input?.wardNumber) {
        conditions.push(eq(agricZone.wardNumber, input.wardNumber));
      }

      if (input?.searchTerm && input.searchTerm.trim() !== "") {
        conditions.push(
          or(
            like(agricZone.name, `%${input.searchTerm}%`),
            like(agricZone.description || "", `%${input.searchTerm}%`),
            like(agricZone.location || "", `%${input.searchTerm}%`),
            like(agricZone.address || "", `%${input.searchTerm}%`),
            like(agricZone.majorCrops || "", `%${input.searchTerm}%`),
          ),
        );
      }

      if (input?.majorCrop && input.majorCrop.trim() !== "") {
        conditions.push(
          like(agricZone.majorCrops || "", `%${input.majorCrop}%`),
        );
      }

      if (input?.isGovernmentOwned !== undefined) {
        conditions.push(
          eq(agricZone.isGovernmentOwned, input.isGovernmentOwned),
        );
      }

      if (input?.hasStorage !== undefined) {
        conditions.push(eq(agricZone.hasStorage, input.hasStorage));
      }

      if (input?.hasProcessingUnit !== undefined) {
        conditions.push(
          eq(agricZone.hasProcessingUnit, input.hasProcessingUnit),
        );
      }

      if (input?.hasFarmersCooperative !== undefined) {
        conditions.push(
          eq(agricZone.hasFarmersCooperative, input.hasFarmersCooperative),
        );
      }

      // Determine which fields to select based on viewType
      let selectFields: any = {
        id: agricZone.id,
        name: agricZone.name,
        slug: agricZone.slug,
        type: agricZone.type,
        wardNumber: agricZone.wardNumber,
        location: agricZone.location,
        soilQuality: agricZone.soilQuality,
        majorCrops: agricZone.majorCrops,
      };

      // Add fields based on view type
      if (viewType === "table" || viewType === "grid") {
        selectFields = {
          ...selectFields,
          description: agricZone.description,
          address: agricZone.address,
          areaInHectares: agricZone.areaInHectares,
          irrigationSystem: agricZone.irrigationSystem,
          seasonalAvailability: agricZone.seasonalAvailability,
          annualProduction: agricZone.annualProduction,
          productionYear: agricZone.productionYear,
          isGovernmentOwned: agricZone.isGovernmentOwned,
          ownerName: agricZone.ownerName,
          hasStorage: agricZone.hasStorage,
          hasProcessingUnit: agricZone.hasProcessingUnit,
          hasFarmersCooperative: agricZone.hasFarmersCooperative,
          createdAt: agricZone.createdAt,
          updatedAt: agricZone.updatedAt,
        };
      }

      // Add geometry fields based on view type
      if (viewType === "map") {
        selectFields.areaPolygon = sql`CASE WHEN ${agricZone.areaPolygon} IS NOT NULL THEN ST_AsGeoJSON(${agricZone.areaPolygon}) ELSE NULL END`;
        selectFields.locationPoint = sql`CASE WHEN ${agricZone.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${agricZone.locationPoint}) ELSE NULL END`;
      } else {
        // For non-map views, include location point for display purposes
        selectFields.locationPoint = sql`CASE WHEN ${agricZone.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${agricZone.locationPoint}) ELSE NULL END`;
      }

      // Get total count for pagination
      const totalCount = await ctx.db
        .select({ count: sql`count(*)` })
        .from(agricZone)
        .where(conditions.length ? and(...conditions) : undefined)
        .then((result) => Number(result[0].count));

      // Query agricultural zones with selected fields
      const zones = await ctx.db
        .select({ zone: selectFields })
        .from(agricZone)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(
          sortOrder === "asc"
            ? sql`${sql.identifier(sortBy)} ASC`
            : sql`${sql.identifier(sortBy)} DESC`,
        )
        .limit(pageSize)
        .offset(offset);

      // Process results for GeoJSON if needed
      const processedZones = zones.map((z) => {
        const result: any = { ...z.zone };

        if (z.zone.locationPoint) {
          result.locationPoint = JSON.parse(z.zone.locationPoint as string);
        }

        if (viewType === "map" && z.zone.areaPolygon) {
          result.areaPolygon = JSON.parse(z.zone.areaPolygon as string);
        }

        return result;
      });

      // Get primary media for each agricultural zone
      const zoneIds = processedZones.map((z) => z.id);

      // Only query media if we have zones
      let zonesWithMedia = processedZones;

      if (zoneIds.length > 0) {
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
              inArray(entityMedia.entityId, zoneIds),
              eq(entityMedia.entityType, "AGRIC_ZONE" as any),
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

        // Combine zones with their primary media
        zonesWithMedia = processedZones.map((z) => ({
          ...z,
          primaryMedia: primaryMediaMap.get(z.id) || null,
        }));
      }

      return {
        items: zonesWithMedia,
        page,
        pageSize,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNextPage: page * pageSize < totalCount,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      console.error("Error fetching agricultural zones:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve agricultural zones",
      });
    }
  });
