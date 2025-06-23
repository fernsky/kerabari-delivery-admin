import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { grazingArea } from "@/server/db/schema/profile/institutions/agricultural/grazingAreas";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { and, eq, like, sql, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Define enums for grazing area types
const grazingAreaTypeEnum = [
  "OPEN_RANGE",
  "ALPINE_MEADOW",
  "COMMUNITY_PASTURE",
  "FOREST_UNDERSTORY",
  "FLOODPLAIN",
  "SEASONAL_PASTURE",
  "DRY_SEASON_RESERVE",
  "ROTATIONAL_PADDOCK",
  "MIXED",
  "OTHER",
];

// Define enums for terrain types
const terrainTypeEnum = [
  "FLAT",
  "ROLLING",
  "HILLY",
  "MOUNTAINOUS",
  "VALLEY",
  "RIVERINE",
  "MIXED",
];

// Define enums for accessibility
const accessibilityEnum = [
  "EASILY_ACCESSIBLE",
  "MODERATELY_ACCESSIBLE",
  "DIFFICULT_ACCESS",
  "SEASONAL_ACCESS",
  "REMOTE",
];

// Define enums for ground cover
const groundCoverEnum = [
  "PRIMARILY_GRASSES",
  "SHRUB_DOMINANT",
  "MIXED_VEGETATION",
  "FORBS_DOMINANT",
  "TREE_SCATTERED",
  "DEGRADED",
];

// Define enums for utilization levels
const utilizationLevelEnum = [
  "UNDERUTILIZED",
  "OPTIMAL_USE",
  "OVERUTILIZED",
  "SEVERELY_DEGRADED",
  "PROTECTED",
];

// Filter schema for grazing area queries with pagination
const grazingAreaFilterSchema = z.object({
  type: z.enum(grazingAreaTypeEnum as [string, ...string[]]).optional(),
  terrain: z.enum(terrainTypeEnum as [string, ...string[]]).optional(),
  groundCover: z.enum(groundCoverEnum as [string, ...string[]]).optional(),
  accessibility: z.enum(accessibilityEnum as [string, ...string[]]).optional(),
  utilizationLevel: z
    .enum(utilizationLevelEnum as [string, ...string[]])
    .optional(),

  wardNumber: z.number().int().positive().optional(),
  searchTerm: z.string().optional(),
  isGovernmentOwned: z.boolean().optional(),
  hasWaterSource: z.boolean().optional(),
  hasFencing: z.boolean().optional(),
  hasWindbreaks: z.boolean().optional(),
  hasShelters: z.boolean().optional(),
  rotationalSystem: z.boolean().optional(),
  erosionIssues: z.boolean().optional(),
  permitRequired: z.boolean().optional(),
  primaryLivestockType: z.string().optional(), // To search within primaryLivestockType field

  // Pagination
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(12),

  // View type - determines how much data to fetch
  viewType: z.enum(["table", "grid", "map"]).default("table"),

  // Sorting
  sortBy: z.string().optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Get all grazing areas with optional filtering and pagination
export const getAllGrazingAreas = publicProcedure
  .input(grazingAreaFilterSchema.optional())
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
        conditions.push(eq(grazingArea.type, input.type as any));
      }

      if (input?.terrain && input.terrain.trim() !== "") {
        conditions.push(eq(grazingArea.terrain, input.terrain as any));
      }

      if (input?.groundCover && input.groundCover.trim() !== "") {
        conditions.push(eq(grazingArea.groundCover, input.groundCover as any));
      }

      if (input?.accessibility && input.accessibility.trim() !== "") {
        conditions.push(
          eq(grazingArea.accessibility, input.accessibility as any),
        );
      }

      if (input?.utilizationLevel && input.utilizationLevel.trim() !== "") {
        conditions.push(
          eq(grazingArea.utilizationLevel, input.utilizationLevel as any),
        );
      }

      if (input?.wardNumber) {
        conditions.push(eq(grazingArea.wardNumber, input.wardNumber));
      }

      if (input?.searchTerm && input.searchTerm.trim() !== "") {
        conditions.push(
          or(
            like(grazingArea.name, `%${input.searchTerm}%`),
            like(grazingArea.description || "", `%${input.searchTerm}%`),
            like(grazingArea.location || "", `%${input.searchTerm}%`),
            like(grazingArea.address || "", `%${input.searchTerm}%`),
            like(
              grazingArea.primaryLivestockType || "",
              `%${input.searchTerm}%`,
            ),
          ),
        );
      }

      if (
        input?.primaryLivestockType &&
        input.primaryLivestockType.trim() !== ""
      ) {
        conditions.push(
          like(
            grazingArea.primaryLivestockType || "",
            `%${input.primaryLivestockType}%`,
          ),
        );
      }

      if (input?.isGovernmentOwned !== undefined) {
        conditions.push(
          eq(grazingArea.isGovernmentOwned, input.isGovernmentOwned),
        );
      }

      if (input?.hasWaterSource !== undefined) {
        conditions.push(eq(grazingArea.hasWaterSource, input.hasWaterSource));
      }

      if (input?.hasFencing !== undefined) {
        conditions.push(eq(grazingArea.hasFencing, input.hasFencing));
      }

      if (input?.hasWindbreaks !== undefined) {
        conditions.push(eq(grazingArea.hasWindbreaks, input.hasWindbreaks));
      }

      if (input?.hasShelters !== undefined) {
        conditions.push(eq(grazingArea.hasShelters, input.hasShelters));
      }

      if (input?.rotationalSystem !== undefined) {
        conditions.push(
          eq(grazingArea.rotationalSystem, input.rotationalSystem),
        );
      }

      if (input?.erosionIssues !== undefined) {
        conditions.push(eq(grazingArea.erosionIssues, input.erosionIssues));
      }

      if (input?.permitRequired !== undefined) {
        conditions.push(eq(grazingArea.permitRequired, input.permitRequired));
      }

      // Determine which fields to select based on viewType
      let selectFields: any = {
        id: grazingArea.id,
        name: grazingArea.name,
        slug: grazingArea.slug,
        type: grazingArea.type,
        wardNumber: grazingArea.wardNumber,
        location: grazingArea.location,
        terrain: grazingArea.terrain,
        primaryLivestockType: grazingArea.primaryLivestockType,
      };

      // Add fields based on view type
      if (viewType === "table" || viewType === "grid") {
        selectFields = {
          ...selectFields,
          description: grazingArea.description,
          address: grazingArea.address,
          areaInHectares: grazingArea.areaInHectares,
          elevationInMeters: grazingArea.elevationInMeters,
          groundCover: grazingArea.groundCover,
          accessibility: grazingArea.accessibility,
          livestockCapacity: grazingArea.livestockCapacity,
          grazingSeasons: grazingArea.grazingSeasons,
          grazingDuration: grazingArea.grazingDuration,
          rotationalSystem: grazingArea.rotationalSystem,
          utilizationLevel: grazingArea.utilizationLevel,
          hasWaterSource: grazingArea.hasWaterSource,
          waterSourceTypes: grazingArea.waterSourceTypes,
          isGovernmentOwned: grazingArea.isGovernmentOwned,
          ownerName: grazingArea.ownerName,
          hasFencing: grazingArea.hasFencing,
          hasWindbreaks: grazingArea.hasWindbreaks,
          hasShelters: grazingArea.hasShelters,
          erosionIssues: grazingArea.erosionIssues,
          permitRequired: grazingArea.permitRequired,
          createdAt: grazingArea.createdAt,
          updatedAt: grazingArea.updatedAt,
        };
      }

      // Add geometry fields based on view type
      if (viewType === "map") {
        selectFields.areaPolygon = sql`CASE WHEN ${grazingArea.areaPolygon} IS NOT NULL THEN ST_AsGeoJSON(${grazingArea.areaPolygon}) ELSE NULL END`;
        selectFields.locationPoint = sql`CASE WHEN ${grazingArea.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${grazingArea.locationPoint}) ELSE NULL END`;
      } else {
        // For non-map views, include location point for display purposes
        selectFields.locationPoint = sql`CASE WHEN ${grazingArea.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${grazingArea.locationPoint}) ELSE NULL END`;
      }

      // Get total count for pagination
      const totalCount = await ctx.db
        .select({ count: sql`count(*)` })
        .from(grazingArea)
        .where(conditions.length ? and(...conditions) : undefined)
        .then((result) => Number(result[0].count));

      // Query grazing areas with selected fields
      const areas = await ctx.db
        .select({ grazingAreaItem: selectFields })
        .from(grazingArea)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(
          sortOrder === "asc"
            ? sql`${sql.identifier(sortBy)} ASC`
            : sql`${sql.identifier(sortBy)} DESC`,
        )
        .limit(pageSize)
        .offset(offset);

      // Process results for GeoJSON if needed
      const processedAreas = areas.map((a) => {
        const result: any = { ...a.grazingAreaItem };

        if (a.grazingAreaItem.locationPoint) {
          result.locationPoint = JSON.parse(
            a.grazingAreaItem.locationPoint as string,
          );
        }

        if (viewType === "map" && a.grazingAreaItem.areaPolygon) {
          result.areaPolygon = JSON.parse(
            a.grazingAreaItem.areaPolygon as string,
          );
        }

        return result;
      });

      // Get primary media for each grazing area
      const areaIds = processedAreas.map((a) => a.id);

      // Only query media if we have grazing areas
      let areasWithMedia = processedAreas;

      if (areaIds.length > 0) {
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
              inArray(entityMedia.entityId, areaIds),
              eq(entityMedia.entityType, "GRAZING_AREA" as any),
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

        // Combine grazing areas with their primary media
        areasWithMedia = processedAreas.map((a) => ({
          ...a,
          primaryMedia: primaryMediaMap.get(a.id) || null,
        }));
      }

      return {
        items: areasWithMedia,
        page,
        pageSize,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNextPage: page * pageSize < totalCount,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      console.error("Error fetching grazing areas:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve grazing areas",
      });
    }
  });
