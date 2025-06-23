import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { agriProcessingCenter } from "@/server/db/schema/profile/institutions/agricultural/agriProcessingCenters";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { and, eq, like, sql, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Define enums for filtering
const centerTypeEnum = [
  "COLLECTION_CENTER",
  "STORAGE_FACILITY",
  "PROCESSING_UNIT",
  "MULTIPURPOSE_CENTER",
  "MARKET_CENTER",
  "COLD_STORAGE",
  "WAREHOUSE",
  "OTHER",
];

const storageTypeEnum = [
  "AMBIENT",
  "COLD_STORAGE",
  "CONTROLLED_ATMOSPHERE",
  "SILO",
  "WAREHOUSE",
  "GRANARY",
  "MIXED",
  "OTHER",
];

const processingLevelEnum = [
  "PRIMARY_PROCESSING",
  "SECONDARY_PROCESSING",
  "TERTIARY_PROCESSING",
  "MINIMAL_PROCESSING",
  "COMPREHENSIVE_PROCESSING",
  "NOT_APPLICABLE",
];

const ownershipTypeEnum = [
  "GOVERNMENT",
  "PRIVATE",
  "COOPERATIVE",
  "COMMUNITY",
  "PUBLIC_PRIVATE_PARTNERSHIP",
  "NGO_MANAGED",
  "MIXED",
];

// Filter schema for processing centers with pagination
const processingCenterFilterSchema = z.object({
  centerType: z.enum(centerTypeEnum as [string, ...string[]]).optional(),
  storageType: z.enum(storageTypeEnum as [string, ...string[]]).optional(),
  processingLevel: z
    .enum(processingLevelEnum as [string, ...string[]])
    .optional(),
  ownershipType: z.enum(ownershipTypeEnum as [string, ...string[]]).optional(),

  wardNumber: z.number().int().positive().optional(),
  searchTerm: z.string().optional(),
  isOperational: z.boolean().optional(),
  hasStorageFacility: z.boolean().optional(),
  hasProcessingUnit: z.boolean().optional(),
  hasQualityControlLab: z.boolean().optional(),
  temperatureControlled: z.boolean().optional(),
  humidityControlled: z.boolean().optional(),

  // Capacity filters
  minStorageCapacity: z.number().positive().optional(),
  maxStorageCapacity: z.number().positive().optional(),
  minProcessingCapacity: z.number().positive().optional(),
  maxProcessingCapacity: z.number().positive().optional(),
  minCapacityUtilization: z.number().min(0).max(100).optional(),
  maxCapacityUtilization: z.number().min(0).max(100).optional(),

  // Economic impact filters
  minFarmersServed: z.number().int().positive().optional(),
  minServiceAreaRadius: z.number().positive().optional(),
  isProfitable: z.boolean().optional(),

  // Pagination
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(12),

  // View type - determines how much data to fetch
  viewType: z.enum(["table", "grid", "map"]).default("table"),

  // Sorting
  sortBy: z.string().optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Get all processing centers with optional filtering and pagination
export const getAllProcessingCenters = publicProcedure
  .input(processingCenterFilterSchema.optional())
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

      if (input?.centerType && input.centerType.trim() !== "") {
        conditions.push(
          eq(agriProcessingCenter.centerType, input.centerType as any),
        );
      }

      if (input?.storageType && input.storageType.trim() !== "") {
        conditions.push(
          eq(agriProcessingCenter.storageType, input.storageType as any),
        );
      }

      if (input?.processingLevel && input.processingLevel.trim() !== "") {
        conditions.push(
          eq(
            agriProcessingCenter.processingLevel,
            input.processingLevel as any,
          ),
        );
      }

      if (input?.ownershipType && input.ownershipType.trim() !== "") {
        conditions.push(
          eq(agriProcessingCenter.ownershipType, input.ownershipType as any),
        );
      }

      if (input?.wardNumber) {
        conditions.push(eq(agriProcessingCenter.wardNumber, input.wardNumber));
      }

      if (input?.searchTerm && input.searchTerm.trim() !== "") {
        conditions.push(
          or(
            like(agriProcessingCenter.name, `%${input.searchTerm}%`),
            like(
              agriProcessingCenter.description || "",
              `%${input.searchTerm}%`,
            ),
            like(agriProcessingCenter.location || "", `%${input.searchTerm}%`),
            like(
              agriProcessingCenter.primaryCommodities || "",
              `%${input.searchTerm}%`,
            ),
            like(
              agriProcessingCenter.secondaryCommodities || "",
              `%${input.searchTerm}%`,
            ),
          ),
        );
      }

      if (input?.isOperational !== undefined) {
        conditions.push(
          eq(agriProcessingCenter.isOperational, input.isOperational),
        );
      }

      if (input?.hasStorageFacility !== undefined) {
        conditions.push(
          eq(agriProcessingCenter.hasStorageFacility, input.hasStorageFacility),
        );
      }

      if (input?.hasProcessingUnit !== undefined) {
        conditions.push(
          eq(agriProcessingCenter.hasProcessingUnit, input.hasProcessingUnit),
        );
      }

      if (input?.hasQualityControlLab !== undefined) {
        conditions.push(
          eq(
            agriProcessingCenter.hasQualityControlLab,
            input.hasQualityControlLab,
          ),
        );
      }

      if (input?.temperatureControlled !== undefined) {
        conditions.push(
          eq(
            agriProcessingCenter.temperatureControlled,
            input.temperatureControlled,
          ),
        );
      }

      if (input?.humidityControlled !== undefined) {
        conditions.push(
          eq(agriProcessingCenter.humidityControlled, input.humidityControlled),
        );
      }

      if (input?.isProfitable !== undefined) {
        conditions.push(
          eq(agriProcessingCenter.profitableOperation, input.isProfitable),
        );
      }

      // Storage capacity range filter
      if (input?.minStorageCapacity !== undefined) {
        conditions.push(
          sql`${agriProcessingCenter.storageTotalCapacityMT} >= ${input.minStorageCapacity}`,
        );
      }

      if (input?.maxStorageCapacity !== undefined) {
        conditions.push(
          sql`${agriProcessingCenter.storageTotalCapacityMT} <= ${input.maxStorageCapacity}`,
        );
      }

      // Processing capacity range filter
      if (input?.minProcessingCapacity !== undefined) {
        conditions.push(
          sql`${agriProcessingCenter.processingCapacityMTPerDay} >= ${input.minProcessingCapacity}`,
        );
      }

      if (input?.maxProcessingCapacity !== undefined) {
        conditions.push(
          sql`${agriProcessingCenter.processingCapacityMTPerDay} <= ${input.maxProcessingCapacity}`,
        );
      }

      // Capacity utilization range filter
      if (input?.minCapacityUtilization !== undefined) {
        conditions.push(
          sql`${agriProcessingCenter.capacityUtilizationPercent} >= ${input.minCapacityUtilization}`,
        );
      }

      if (input?.maxCapacityUtilization !== undefined) {
        conditions.push(
          sql`${agriProcessingCenter.capacityUtilizationPercent} <= ${input.maxCapacityUtilization}`,
        );
      }

      // Farmers served filter
      if (input?.minFarmersServed !== undefined) {
        conditions.push(
          sql`${agriProcessingCenter.farmersServedCount} >= ${input.minFarmersServed}`,
        );
      }

      // Service area radius filter
      if (input?.minServiceAreaRadius !== undefined) {
        conditions.push(
          sql`${agriProcessingCenter.serviceAreaRadiusKM} >= ${input.minServiceAreaRadius}`,
        );
      }

      // Determine which fields to select based on viewType
      let selectFields: any = {
        id: agriProcessingCenter.id,
        name: agriProcessingCenter.name,
        slug: agriProcessingCenter.slug,
        centerType: agriProcessingCenter.centerType,
        wardNumber: agriProcessingCenter.wardNumber,
        location: agriProcessingCenter.location,
        isOperational: agriProcessingCenter.isOperational,
      };

      // Add fields based on view type
      if (viewType === "table" || viewType === "grid") {
        selectFields = {
          ...selectFields,
          description: agriProcessingCenter.description,
          address: agriProcessingCenter.address,
          areaInSquareMeters: agriProcessingCenter.areaInSquareMeters,
          operationalStatus: agriProcessingCenter.operationalStatus,
          hasStorageFacility: agriProcessingCenter.hasStorageFacility,
          storageType: agriProcessingCenter.storageType,
          storageTotalCapacityMT: agriProcessingCenter.storageTotalCapacityMT,
          hasProcessingUnit: agriProcessingCenter.hasProcessingUnit,
          processingLevel: agriProcessingCenter.processingLevel,
          processingCapacityMTPerDay:
            agriProcessingCenter.processingCapacityMTPerDay,
          primaryCommodities: agriProcessingCenter.primaryCommodities,
          secondaryCommodities: agriProcessingCenter.secondaryCommodities,
          ownershipType: agriProcessingCenter.ownershipType,
          ownerName: agriProcessingCenter.ownerName,
          farmersServedCount: agriProcessingCenter.farmersServedCount,
          serviceAreaRadiusKM: agriProcessingCenter.serviceAreaRadiusKM,
          createdAt: agriProcessingCenter.createdAt,
          updatedAt: agriProcessingCenter.updatedAt,
        };
      }

      // Add geometry fields based on view type
      if (viewType === "map") {
        selectFields.facilityFootprint = sql`CASE WHEN ${agriProcessingCenter.facilityFootprint} IS NOT NULL THEN ST_AsGeoJSON(${agriProcessingCenter.facilityFootprint}) ELSE NULL END`;
        selectFields.locationPoint = sql`CASE WHEN ${agriProcessingCenter.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${agriProcessingCenter.locationPoint}) ELSE NULL END`;
      } else {
        // For non-map views, include location point for display purposes
        selectFields.locationPoint = sql`CASE WHEN ${agriProcessingCenter.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${agriProcessingCenter.locationPoint}) ELSE NULL END`;
      }

      // Get total count for pagination
      const totalCount = await ctx.db
        .select({ count: sql`count(*)` })
        .from(agriProcessingCenter)
        .where(conditions.length ? and(...conditions) : undefined)
        .then((result) => Number(result[0].count));

      // Query processing centers with selected fields
      const centers = await ctx.db
        .select({ processingCenter: selectFields })
        .from(agriProcessingCenter)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(
          sortOrder === "asc"
            ? sql`${sql.identifier(sortBy)} ASC`
            : sql`${sql.identifier(sortBy)} DESC`,
        )
        .limit(pageSize)
        .offset(offset);

      // Process results for GeoJSON if needed
      const processedCenters = centers.map((c) => {
        const result: any = { ...c.processingCenter };

        if (c.processingCenter.locationPoint) {
          result.locationPoint = JSON.parse(
            c.processingCenter.locationPoint as string,
          );
        }

        if (viewType === "map" && c.processingCenter.facilityFootprint) {
          result.facilityFootprint = JSON.parse(
            c.processingCenter.facilityFootprint as string,
          );
        }

        return result;
      });

      // Get primary media for each processing center
      const centerIds = processedCenters.map((c) => c.id);

      // Only query media if we have processing centers
      let centersWithMedia = processedCenters;

      if (centerIds.length > 0) {
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
              inArray(entityMedia.entityId, centerIds),
              eq(entityMedia.entityType, "AGRI_PROCESSING_CENTER" as any),
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

        // Combine processing centers with their primary media
        centersWithMedia = processedCenters.map((c) => ({
          ...c,
          primaryMedia: primaryMediaMap.get(c.id) || null,
        }));
      }

      return {
        items: centersWithMedia,
        page,
        pageSize,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNextPage: page * pageSize < totalCount,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      console.error("Error fetching processing centers:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve agricultural processing centers",
      });
    }
  });
