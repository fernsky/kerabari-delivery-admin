import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { farm } from "@/server/db/schema/profile/institutions/agricultural/farms";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { and, eq, like, sql, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Define enums for farm type filter
const farmTypeEnum = [
  "CROP_FARM",
  "LIVESTOCK_FARM",
  "MIXED_FARM",
  "POULTRY_FARM",
  "DAIRY_FARM",
  "AQUACULTURE_FARM",
  "HORTICULTURE_FARM",
  "APICULTURE_FARM",
  "SERICULTURE_FARM",
  "ORGANIC_FARM",
  "COMMERCIAL_FARM",
  "SUBSISTENCE_FARM",
  "AGROFORESTRY",
  "OTHER",
];

// Define farming system enum for filter
const farmingSystemEnum = [
  "CONVENTIONAL",
  "ORGANIC",
  "INTEGRATED",
  "CONSERVATION",
  "HYDROPONIC",
  "PERMACULTURE",
  "BIODYNAMIC",
  "TRADITIONAL",
  "MIXED",
];

// Define irrigation type enum for filter
const irrigationTypeEnum = [
  "RAINFED",
  "CANAL",
  "DRIP",
  "SPRINKLER",
  "FLOOD",
  "GROUNDWATER",
  "RAINWATER_HARVESTING",
  "NONE",
  "MIXED",
];

// Define soil type enum for filter
const soilTypeEnum = [
  "CLAY",
  "SANDY",
  "LOAM",
  "SILT",
  "CLAY_LOAM",
  "SANDY_LOAM",
  "SILTY_CLAY",
  "ROCKY",
  "PEATY",
  "CHALKY",
  "MIXED",
];

// Define land ownership enum for filter
const landOwnershipEnum = [
  "OWNED",
  "LEASED",
  "COMMUNITY",
  "SHARED",
  "GOVERNMENT",
  "MIXED",
];

// Filter schema for farm queries with pagination
const farmFilterSchema = z.object({
  farmType: z.enum(farmTypeEnum as [string, ...string[]]).optional(),
  farmingSystem: z.enum(farmingSystemEnum as [string, ...string[]]).optional(),
  irrigationType: z
    .enum(irrigationTypeEnum as [string, ...string[]])
    .optional(),
  soilType: z.enum(soilTypeEnum as [string, ...string[]]).optional(),
  landOwnership: z.enum(landOwnershipEnum as [string, ...string[]]).optional(),

  // Location and basic filters
  wardNumber: z.number().int().positive().optional(),
  searchTerm: z.string().optional(),

  // Boolean filters
  hasLivestock: z.boolean().optional(),
  cropRotation: z.boolean().optional(),
  intercropping: z.boolean().optional(),
  usesChemicalFertilizer: z.boolean().optional(),
  usesPesticides: z.boolean().optional(),
  usesOrganicMethods: z.boolean().optional(),
  composting: z.boolean().optional(),
  rainwaterHarvesting: z.boolean().optional(),
  hasCertifications: z.boolean().optional(),
  hasFarmHouse: z.boolean().optional(),
  hasStorage: z.boolean().optional(),
  hasFarmEquipment: z.boolean().optional(),
  hasElectricity: z.boolean().optional(),
  hasRoadAccess: z.boolean().optional(),
  profitableOperation: z.boolean().optional(),

  // Size and area filters
  minTotalAreaHectares: z.number().positive().optional(),
  maxTotalAreaHectares: z.number().positive().optional(),
  minCultivatedAreaHectares: z.number().positive().optional(),
  maxCultivatedAreaHectares: z.number().positive().optional(),

  // Crop and livestock filters
  mainCrops: z.string().optional(),
  livestockType: z.string().optional(),
  minLivestockCount: z.number().int().positive().optional(),

  // Verification filter
  isVerified: z.boolean().optional(),

  // Pagination
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(12),

  // View type - determines how much data to fetch
  viewType: z.enum(["table", "grid", "map"]).default("table"),

  // Sorting
  sortBy: z.string().optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Get all farms with optional filtering and pagination
export const getAllFarms = publicProcedure
  .input(farmFilterSchema.optional())
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

      if (input?.farmType && input.farmType.trim() !== "") {
        conditions.push(eq(farm.farmType, input.farmType as any));
      }

      if (input?.farmingSystem && input.farmingSystem.trim() !== "") {
        conditions.push(eq(farm.farmingSystem, input.farmingSystem as any));
      }

      if (input?.irrigationType && input.irrigationType.trim() !== "") {
        conditions.push(eq(farm.irrigationType, input.irrigationType as any));
      }

      if (input?.soilType && input.soilType.trim() !== "") {
        conditions.push(eq(farm.soilType, input.soilType as any));
      }

      if (input?.landOwnership && input.landOwnership.trim() !== "") {
        conditions.push(eq(farm.landOwnership, input.landOwnership as any));
      }

      if (input?.wardNumber) {
        conditions.push(eq(farm.wardNumber, input.wardNumber));
      }

      if (input?.searchTerm && input.searchTerm.trim() !== "") {
        conditions.push(
          or(
            like(farm.name, `%${input.searchTerm}%`),
            like(farm.description || "", `%${input.searchTerm}%`),
            like(farm.location || "", `%${input.searchTerm}%`),
            like(farm.address || "", `%${input.searchTerm}%`),
            like(farm.ownerName || "", `%${input.searchTerm}%`),
            like(farm.mainCrops || "", `%${input.searchTerm}%`),
            like(farm.livestockTypes || "", `%${input.searchTerm}%`),
          ),
        );
      }

      // Boolean filters
      if (input?.hasLivestock !== undefined) {
        conditions.push(eq(farm.hasLivestock, input.hasLivestock));
      }

      if (input?.cropRotation !== undefined) {
        conditions.push(eq(farm.cropRotation, input.cropRotation));
      }

      if (input?.intercropping !== undefined) {
        conditions.push(eq(farm.intercropping, input.intercropping));
      }

      if (input?.usesChemicalFertilizer !== undefined) {
        conditions.push(
          eq(farm.usesChemicalFertilizer, input.usesChemicalFertilizer),
        );
      }

      if (input?.usesPesticides !== undefined) {
        conditions.push(eq(farm.usesPesticides, input.usesPesticides));
      }

      if (input?.usesOrganicMethods !== undefined) {
        conditions.push(eq(farm.usesOrganicMethods, input.usesOrganicMethods));
      }

      if (input?.composting !== undefined) {
        conditions.push(eq(farm.composting, input.composting));
      }

      if (input?.rainwaterHarvesting !== undefined) {
        conditions.push(
          eq(farm.rainwaterHarvesting, input.rainwaterHarvesting),
        );
      }

      if (input?.hasCertifications !== undefined) {
        conditions.push(eq(farm.hasCertifications, input.hasCertifications));
      }

      if (input?.hasFarmHouse !== undefined) {
        conditions.push(eq(farm.hasFarmHouse, input.hasFarmHouse));
      }

      if (input?.hasStorage !== undefined) {
        conditions.push(eq(farm.hasStorage, input.hasStorage));
      }

      if (input?.hasFarmEquipment !== undefined) {
        conditions.push(eq(farm.hasFarmEquipment, input.hasFarmEquipment));
      }

      if (input?.hasElectricity !== undefined) {
        conditions.push(eq(farm.hasElectricity, input.hasElectricity));
      }

      if (input?.hasRoadAccess !== undefined) {
        conditions.push(eq(farm.hasRoadAccess, input.hasRoadAccess));
      }

      if (input?.profitableOperation !== undefined) {
        conditions.push(
          eq(farm.profitableOperation, input.profitableOperation),
        );
      }

      if (input?.isVerified !== undefined) {
        conditions.push(eq(farm.isVerified, input.isVerified));
      }

      // Area range filters
      if (input?.minTotalAreaHectares !== undefined) {
        conditions.push(
          sql`${farm.totalAreaInHectares} >= ${input.minTotalAreaHectares}`,
        );
      }

      if (input?.maxTotalAreaHectares !== undefined) {
        conditions.push(
          sql`${farm.totalAreaInHectares} <= ${input.maxTotalAreaHectares}`,
        );
      }

      if (input?.minCultivatedAreaHectares !== undefined) {
        conditions.push(
          sql`${farm.cultivatedAreaInHectares} >= ${input.minCultivatedAreaHectares}`,
        );
      }

      if (input?.maxCultivatedAreaHectares !== undefined) {
        conditions.push(
          sql`${farm.cultivatedAreaInHectares} <= ${input.maxCultivatedAreaHectares}`,
        );
      }

      // Crop filter
      if (input?.mainCrops && input.mainCrops.trim() !== "") {
        conditions.push(like(farm.mainCrops || "", `%${input.mainCrops}%`));
      }

      // Livestock filters
      if (input?.livestockType && input.livestockType.trim() !== "") {
        conditions.push(
          like(farm.livestockTypes || "", `%${input.livestockType}%`),
        );
      }

      if (input?.minLivestockCount !== undefined) {
        conditions.push(
          sql`(${farm.cattleCount} + ${farm.buffaloCount} + ${farm.goatCount} + ${farm.sheepCount} + ${farm.pigCount} + ${farm.poultryCount} + COALESCE(${farm.otherLivestockCount}, 0)) >= ${input.minLivestockCount}`,
        );
      }

      // Determine which fields to select based on viewType
      let selectFields: any = {
        id: farm.id,
        name: farm.name,
        slug: farm.slug,
        farmType: farm.farmType,
        farmingSystem: farm.farmingSystem,
        wardNumber: farm.wardNumber,
        location: farm.location,
        mainCrops: farm.mainCrops,
        isVerified: farm.isVerified,
      };

      // Add fields based on view type
      if (viewType === "table" || viewType === "grid") {
        selectFields = {
          ...selectFields,
          description: farm.description,
          address: farm.address,
          totalAreaInHectares: farm.totalAreaInHectares,
          cultivatedAreaInHectares: farm.cultivatedAreaInHectares,
          irrigationType: farm.irrigationType,
          soilType: farm.soilType,
          landOwnership: farm.landOwnership,
          secondaryCrops: farm.secondaryCrops,
          ownerName: farm.ownerName,
          farmerType: farm.farmerType,
          hasLivestock: farm.hasLivestock,
          livestockTypes: farm.livestockTypes,
          hasCooperativeMembership: farm.hasCooperativeMembership,
          usesOrganicMethods: farm.usesOrganicMethods,
          profitableOperation: farm.profitableOperation,
          createdAt: farm.createdAt,
          updatedAt: farm.updatedAt,
        };
      }

      // Add livestock counts only for specific view types
      if (viewType === "table") {
        selectFields.cattleCount = farm.cattleCount;
        selectFields.buffaloCount = farm.buffaloCount;
        selectFields.goatCount = farm.goatCount;
        selectFields.sheepCount = farm.sheepCount;
        selectFields.pigCount = farm.pigCount;
        selectFields.poultryCount = farm.poultryCount;
      }

      // Add geometry fields based on view type
      if (viewType === "map") {
        selectFields.farmBoundary = sql`CASE WHEN ${farm.farmBoundary} IS NOT NULL THEN ST_AsGeoJSON(${farm.farmBoundary}) ELSE NULL END`;
        selectFields.locationPoint = sql`CASE WHEN ${farm.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${farm.locationPoint}) ELSE NULL END`;
      } else {
        // For non-map views, include location point for display purposes
        selectFields.locationPoint = sql`CASE WHEN ${farm.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${farm.locationPoint}) ELSE NULL END`;
      }

      // Get total count for pagination
      const totalCount = await ctx.db
        .select({ count: sql`count(*)` })
        .from(farm)
        .where(conditions.length ? and(...conditions) : undefined)
        .then((result) => Number(result[0].count));

      // Query farms with selected fields
      const farms = await ctx.db
        .select({ farmItem: selectFields })
        .from(farm)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(
          sortOrder === "asc"
            ? sql`${sql.identifier(sortBy)} ASC`
            : sql`${sql.identifier(sortBy)} DESC`,
        )
        .limit(pageSize)
        .offset(offset);

      // Process results for GeoJSON if needed
      const processedFarms = farms.map((f) => {
        const result: any = { ...f.farmItem };

        if (f.farmItem.locationPoint) {
          result.locationPoint = JSON.parse(f.farmItem.locationPoint as string);
        }

        if (viewType === "map" && f.farmItem.farmBoundary) {
          result.farmBoundary = JSON.parse(f.farmItem.farmBoundary as string);
        }

        return result;
      });

      // Get primary media for each farm
      const farmIds = processedFarms.map((f) => f.id);

      // Only query media if we have farms
      let farmsWithMedia = processedFarms;

      if (farmIds.length > 0) {
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
              inArray(entityMedia.entityId, farmIds),
              eq(entityMedia.entityType, "FARM" as any),
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

        // Combine farms with their primary media
        farmsWithMedia = processedFarms.map((f) => ({
          ...f,
          primaryMedia: primaryMediaMap.get(f.id) || null,
        }));
      }

      return {
        items: farmsWithMedia,
        page,
        pageSize,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNextPage: page * pageSize < totalCount,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      console.error("Error fetching farms:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve farms",
      });
    }
  });
