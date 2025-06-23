import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import {
  grassland,
  grasslandTypeEnum,
  vegetationDensityEnum,
  grasslandManagementEnum,
} from "@/server/db/schema/profile/institutions/agricultural/grasslands";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { and, eq, like, sql, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Filter schema for grassland queries with pagination
const grasslandFilterSchema = z.object({
  type: z
    .enum([
      "NATURAL_MEADOW",
      "IMPROVED_PASTURE",
      "RANGELAND",
      "SILVOPASTURE",
      "WETLAND_GRAZING",
      "ALPINE_GRASSLAND",
      "COMMON_GRAZING_LAND",
      "OTHER",
    ] as [string, ...string[]])
    .optional(),

  vegetationDensity: z
    .enum(["VERY_DENSE", "DENSE", "MODERATE", "SPARSE", "VERY_SPARSE"] as [
      string,
      ...string[],
    ])
    .optional(),

  managementType: z
    .enum([
      "ROTATIONAL_GRAZING",
      "CONTINUOUS_GRAZING",
      "DEFERRED_GRAZING",
      "HAY_PRODUCTION",
      "CONSERVATION",
      "UNMANAGED",
      "MIXED",
    ] as [string, ...string[]])
    .optional(),

  wardNumber: z.number().int().positive().optional(),
  searchTerm: z.string().optional(),
  isGovernmentOwned: z.boolean().optional(),
  hasWaterSource: z.boolean().optional(),
  isFenced: z.boolean().optional(),
  hasGrazingRights: z.boolean().optional(),
  hasProtectedStatus: z.boolean().optional(),
  dominantSpecies: z.string().optional(), // To search within dominantSpecies field

  // Pagination
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(12),

  // View type - determines how much data to fetch
  viewType: z.enum(["table", "grid", "map"]).default("table"),

  // Sorting
  sortBy: z.string().optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Get all grasslands with optional filtering and pagination
export const getAllGrasslands = publicProcedure
  .input(grasslandFilterSchema.optional())
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
        conditions.push(eq(grassland.type, input.type as any));
      }

      if (input?.vegetationDensity && input.vegetationDensity.trim() !== "") {
        conditions.push(
          eq(grassland.vegetationDensity, input.vegetationDensity as any),
        );
      }

      if (input?.managementType && input.managementType.trim() !== "") {
        conditions.push(
          eq(grassland.managementType, input.managementType as any),
        );
      }

      if (input?.wardNumber) {
        conditions.push(eq(grassland.wardNumber, input.wardNumber));
      }

      if (input?.searchTerm && input.searchTerm.trim() !== "") {
        conditions.push(
          or(
            like(grassland.name, `%${input.searchTerm}%`),
            like(grassland.description || "", `%${input.searchTerm}%`),
            like(grassland.location || "", `%${input.searchTerm}%`),
            like(grassland.address || "", `%${input.searchTerm}%`),
            like(grassland.dominantSpecies || "", `%${input.searchTerm}%`),
          ),
        );
      }

      if (input?.dominantSpecies && input.dominantSpecies.trim() !== "") {
        conditions.push(
          like(grassland.dominantSpecies || "", `%${input.dominantSpecies}%`),
        );
      }

      if (input?.isGovernmentOwned !== undefined) {
        conditions.push(
          eq(grassland.isGovernmentOwned, input.isGovernmentOwned),
        );
      }

      if (input?.hasWaterSource !== undefined) {
        conditions.push(eq(grassland.hasWaterSource, input.hasWaterSource));
      }

      if (input?.isFenced !== undefined) {
        conditions.push(eq(grassland.isFenced, input.isFenced));
      }

      if (input?.hasGrazingRights !== undefined) {
        conditions.push(eq(grassland.hasGrazingRights, input.hasGrazingRights));
      }

      if (input?.hasProtectedStatus !== undefined) {
        conditions.push(
          eq(grassland.hasProtectedStatus, input.hasProtectedStatus),
        );
      }

      // Determine which fields to select based on viewType
      let selectFields: any = {
        id: grassland.id,
        name: grassland.name,
        slug: grassland.slug,
        type: grassland.type,
        wardNumber: grassland.wardNumber,
        location: grassland.location,
        vegetationDensity: grassland.vegetationDensity,
        dominantSpecies: grassland.dominantSpecies,
      };

      // Add fields based on view type
      if (viewType === "table" || viewType === "grid") {
        selectFields = {
          ...selectFields,
          description: grassland.description,
          address: grassland.address,
          areaInHectares: grassland.areaInHectares,
          elevationInMeters: grassland.elevationInMeters,
          managementType: grassland.managementType,
          carryingCapacity: grassland.carryingCapacity,
          grazingPeriod: grassland.grazingPeriod,
          annualFodderYield: grassland.annualFodderYield,
          yieldYear: grassland.yieldYear,
          isGovernmentOwned: grassland.isGovernmentOwned,
          ownerName: grassland.ownerName,
          hasWaterSource: grassland.hasWaterSource,
          waterSourceType: grassland.waterSourceType,
          isFenced: grassland.isFenced,
          hasGrazingRights: grassland.hasGrazingRights,
          hasProtectedStatus: grassland.hasProtectedStatus,
          protectionType: grassland.protectionType,
          createdAt: grassland.createdAt,
          updatedAt: grassland.updatedAt,
        };
      }

      // Add geometry fields based on view type
      if (viewType === "map") {
        selectFields.areaPolygon = sql`CASE WHEN ${grassland.areaPolygon} IS NOT NULL THEN ST_AsGeoJSON(${grassland.areaPolygon}) ELSE NULL END`;
        selectFields.locationPoint = sql`CASE WHEN ${grassland.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${grassland.locationPoint}) ELSE NULL END`;
      } else {
        // For non-map views, include location point for display purposes
        selectFields.locationPoint = sql`CASE WHEN ${grassland.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${grassland.locationPoint}) ELSE NULL END`;
      }

      // Get total count for pagination
      const totalCount = await ctx.db
        .select({ count: sql`count(*)` })
        .from(grassland)
        .where(conditions.length ? and(...conditions) : undefined)
        .then((result) => Number(result[0].count));

      // Query grasslands with selected fields
      const grasslands = await ctx.db
        .select({ grasslandItem: selectFields })
        .from(grassland)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(
          sortOrder === "asc"
            ? sql`${sql.identifier(sortBy)} ASC`
            : sql`${sql.identifier(sortBy)} DESC`,
        )
        .limit(pageSize)
        .offset(offset);

      // Process results for GeoJSON if needed
      const processedGrasslands = grasslands.map((g) => {
        const result: any = { ...g.grasslandItem };

        if (g.grasslandItem.locationPoint) {
          result.locationPoint = JSON.parse(
            g.grasslandItem.locationPoint as string,
          );
        }

        if (viewType === "map" && g.grasslandItem.areaPolygon) {
          result.areaPolygon = JSON.parse(
            g.grasslandItem.areaPolygon as string,
          );
        }

        return result;
      });

      // Get primary media for each grassland
      const grasslandIds = processedGrasslands.map((g) => g.id);

      // Only query media if we have grasslands
      let grasslandsWithMedia = processedGrasslands;

      if (grasslandIds.length > 0) {
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
              inArray(entityMedia.entityId, grasslandIds),
              eq(entityMedia.entityType, "GRASSLAND" as any),
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

        // Combine grasslands with their primary media
        grasslandsWithMedia = processedGrasslands.map((g) => ({
          ...g,
          primaryMedia: primaryMediaMap.get(g.id) || null,
        }));
      }

      return {
        items: grasslandsWithMedia,
        page,
        pageSize,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNextPage: page * pageSize < totalCount,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      console.error("Error fetching grasslands:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve grasslands",
      });
    }
  });
