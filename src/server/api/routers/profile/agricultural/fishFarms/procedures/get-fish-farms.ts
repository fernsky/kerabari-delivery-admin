import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { fishFarm } from "@/server/db/schema/profile/institutions/agricultural/fishFarms";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { and, eq, like, sql, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Define enums for fish farm type filter
const farmTypeEnum = [
  "POND_CULTURE",
  "CAGE_CULTURE",
  "TANK_CULTURE",
  "RACEWAY_CULTURE",
  "RECIRCULATING_AQUACULTURE_SYSTEM",
  "HATCHERY",
  "NURSERY",
  "INTEGRATED_FARMING",
  "RICE_FISH_CULTURE",
  "ORNAMENTAL_FISH_FARM",
  "RESEARCH_FACILITY",
  "MIXED",
  "OTHER",
];

// Define ownership type enum for filter
const ownershipTypeEnum = [
  "PRIVATE",
  "GOVERNMENT",
  "COMMUNITY",
  "COOPERATIVE",
  "PUBLIC_PRIVATE_PARTNERSHIP",
  "NGO_MANAGED",
  "MIXED",
];

// Define water source enum for filter
const waterSourceEnum = [
  "RIVER",
  "STREAM",
  "SPRING",
  "WELL",
  "GROUNDWATER",
  "RAINWATER",
  "CANAL",
  "RESERVOIR",
  "LAKE",
  "MIXED",
];

// Define culture system enum for filter
const cultureSystemEnum = [
  "EXTENSIVE",
  "SEMI_INTENSIVE",
  "INTENSIVE",
  "SUPER_INTENSIVE",
  "POLYCULTURE",
  "MONOCULTURE",
];

// Filter schema for fish farm queries with pagination
const fishFarmFilterSchema = z.object({
  farmType: z.enum(farmTypeEnum as [string, ...string[]]).optional(),
  ownershipType: z.enum(ownershipTypeEnum as [string, ...string[]]).optional(),
  waterSource: z.enum(waterSourceEnum as [string, ...string[]]).optional(),
  cultureSystem: z.enum(cultureSystemEnum as [string, ...string[]]).optional(),

  // Location and basic filters
  wardNumber: z.number().int().positive().optional(),
  searchTerm: z.string().optional(),

  // Boolean filters
  hasHatchery: z.boolean().optional(),
  hasNursery: z.boolean().optional(),
  hasWaterQualityMonitoring: z.boolean().optional(),
  usesProbiotics: z.boolean().optional(),
  usesAeration: z.boolean().optional(),
  hasProcessingArea: z.boolean().optional(),
  hasLaboratory: z.boolean().optional(),
  hasIceProduction: z.boolean().optional(),
  hasTrainedStaff: z.boolean().optional(),
  profitableOperation: z.boolean().optional(),
  usesChemicals: z.boolean().optional(),
  hasEnvironmentalImpactAssessment: z.boolean().optional(),
  usesRenewableEnergy: z.boolean().optional(),
  hasCertifications: z.boolean().optional(),
  receivesGovernmentSupport: z.boolean().optional(),
  receivesNGOSupport: z.boolean().optional(),

  // Size and area filters
  minTotalAreaHectares: z.number().positive().optional(),
  maxTotalAreaHectares: z.number().positive().optional(),
  minWaterSurfaceAreaHectares: z.number().positive().optional(),
  maxWaterSurfaceAreaHectares: z.number().positive().optional(),
  minPondCount: z.number().int().nonnegative().optional(),
  maxPondCount: z.number().int().nonnegative().optional(),

  // Production filters
  minAnnualProduction: z.number().positive().optional(),
  maxAnnualProduction: z.number().positive().optional(),
  primarySpecies: z.string().optional(),

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

// Get all fish farms with optional filtering and pagination
export const getAllFishFarms = publicProcedure
  .input(fishFarmFilterSchema.optional())
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
        conditions.push(eq(fishFarm.farmType, input.farmType as any));
      }

      if (input?.ownershipType && input.ownershipType.trim() !== "") {
        conditions.push(eq(fishFarm.ownershipType, input.ownershipType as any));
      }

      if (input?.waterSource && input.waterSource.trim() !== "") {
        conditions.push(eq(fishFarm.waterSource, input.waterSource as any));
      }

      if (input?.cultureSystem && input.cultureSystem.trim() !== "") {
        conditions.push(eq(fishFarm.cultureSystem, input.cultureSystem as any));
      }

      if (input?.wardNumber) {
        conditions.push(eq(fishFarm.wardNumber, input.wardNumber));
      }

      if (input?.searchTerm && input.searchTerm.trim() !== "") {
        conditions.push(
          or(
            like(fishFarm.name, `%${input.searchTerm}%`),
            like(fishFarm.description || "", `%${input.searchTerm}%`),
            like(fishFarm.location || "", `%${input.searchTerm}%`),
            like(fishFarm.address || "", `%${input.searchTerm}%`),
            like(fishFarm.ownerName || "", `%${input.searchTerm}%`),
            like(fishFarm.primaryFishSpecies || "", `%${input.searchTerm}%`),
          ),
        );
      }

      // Boolean filters
      if (input?.hasHatchery !== undefined) {
        conditions.push(eq(fishFarm.hasHatchery, input.hasHatchery));
      }

      if (input?.hasNursery !== undefined) {
        conditions.push(eq(fishFarm.hasNursery, input.hasNursery));
      }

      if (input?.hasWaterQualityMonitoring !== undefined) {
        conditions.push(
          eq(
            fishFarm.hasWaterQualityMonitoring,
            input.hasWaterQualityMonitoring,
          ),
        );
      }

      if (input?.usesProbiotics !== undefined) {
        conditions.push(eq(fishFarm.usesProbiotics, input.usesProbiotics));
      }

      if (input?.usesAeration !== undefined) {
        conditions.push(eq(fishFarm.usesAeration, input.usesAeration));
      }

      if (input?.hasProcessingArea !== undefined) {
        conditions.push(
          eq(fishFarm.hasProcessingArea, input.hasProcessingArea),
        );
      }

      if (input?.hasLaboratory !== undefined) {
        conditions.push(eq(fishFarm.hasLaboratory, input.hasLaboratory));
      }

      if (input?.hasIceProduction !== undefined) {
        conditions.push(eq(fishFarm.hasIceProduction, input.hasIceProduction));
      }

      if (input?.hasTrainedStaff !== undefined) {
        conditions.push(eq(fishFarm.hasTrainedStaff, input.hasTrainedStaff));
      }

      if (input?.profitableOperation !== undefined) {
        conditions.push(
          eq(fishFarm.profitableOperation, input.profitableOperation),
        );
      }

      if (input?.usesChemicals !== undefined) {
        conditions.push(eq(fishFarm.usesChemicals, input.usesChemicals));
      }

      if (input?.hasEnvironmentalImpactAssessment !== undefined) {
        conditions.push(
          eq(
            fishFarm.hasEnvironmentalImpactAssessment,
            input.hasEnvironmentalImpactAssessment,
          ),
        );
      }

      if (input?.usesRenewableEnergy !== undefined) {
        conditions.push(
          eq(fishFarm.usesRenewableEnergy, input.usesRenewableEnergy),
        );
      }

      if (input?.hasCertifications !== undefined) {
        conditions.push(
          eq(fishFarm.hasCertifications, input.hasCertifications),
        );
      }

      if (input?.receivesGovernmentSupport !== undefined) {
        conditions.push(
          eq(
            fishFarm.receivesGovernmentSupport,
            input.receivesGovernmentSupport,
          ),
        );
      }

      if (input?.receivesNGOSupport !== undefined) {
        conditions.push(
          eq(fishFarm.receivesNGOSupport, input.receivesNGOSupport),
        );
      }

      if (input?.isVerified !== undefined) {
        conditions.push(eq(fishFarm.isVerified, input.isVerified));
      }

      // Area range filters
      if (input?.minTotalAreaHectares !== undefined) {
        conditions.push(
          sql`${fishFarm.totalAreaInHectares} >= ${input.minTotalAreaHectares}`,
        );
      }

      if (input?.maxTotalAreaHectares !== undefined) {
        conditions.push(
          sql`${fishFarm.totalAreaInHectares} <= ${input.maxTotalAreaHectares}`,
        );
      }

      if (input?.minWaterSurfaceAreaHectares !== undefined) {
        conditions.push(
          sql`${fishFarm.waterSurfaceAreaInHectares} >= ${input.minWaterSurfaceAreaHectares}`,
        );
      }

      if (input?.maxWaterSurfaceAreaHectares !== undefined) {
        conditions.push(
          sql`${fishFarm.waterSurfaceAreaInHectares} <= ${input.maxWaterSurfaceAreaHectares}`,
        );
      }

      // Pond count filters
      if (input?.minPondCount !== undefined) {
        conditions.push(
          sql`${fishFarm.totalPondCount} >= ${input.minPondCount}`,
        );
      }

      if (input?.maxPondCount !== undefined) {
        conditions.push(
          sql`${fishFarm.totalPondCount} <= ${input.maxPondCount}`,
        );
      }

      // Production filters
      if (input?.minAnnualProduction !== undefined) {
        conditions.push(
          sql`${fishFarm.annualProductionInKg} >= ${input.minAnnualProduction}`,
        );
      }

      if (input?.maxAnnualProduction !== undefined) {
        conditions.push(
          sql`${fishFarm.annualProductionInKg} <= ${input.maxAnnualProduction}`,
        );
      }

      // Primary species filter
      if (input?.primarySpecies && input.primarySpecies.trim() !== "") {
        conditions.push(
          like(fishFarm.primaryFishSpecies || "", `%${input.primarySpecies}%`),
        );
      }

      // Determine which fields to select based on viewType
      let selectFields: any = {
        id: fishFarm.id,
        name: fishFarm.name,
        slug: fishFarm.slug,
        farmType: fishFarm.farmType,
        wardNumber: fishFarm.wardNumber,
        location: fishFarm.location,
        ownershipType: fishFarm.ownershipType,
        isVerified: fishFarm.isVerified,
      };

      // Add fields based on view type
      if (viewType === "table" || viewType === "grid") {
        selectFields = {
          ...selectFields,
          description: fishFarm.description,
          address: fishFarm.address,
          totalAreaInHectares: fishFarm.totalAreaInHectares,
          waterSurfaceAreaInHectares: fishFarm.waterSurfaceAreaInHectares,
          totalPondCount: fishFarm.totalPondCount,
          activePondCount: fishFarm.activePondCount,
          waterSource: fishFarm.waterSource,
          cultureSystem: fishFarm.cultureSystem,
          primaryFishSpecies: fishFarm.primaryFishSpecies,
          ownerName: fishFarm.ownerName,
          hasHatchery: fishFarm.hasHatchery,
          hasNursery: fishFarm.hasNursery,
          annualProductionInKg: fishFarm.annualProductionInKg,
          averageYieldPerHectareInKg: fishFarm.averageYieldPerHectareInKg,
          profitableOperation: fishFarm.profitableOperation,
          createdAt: fishFarm.createdAt,
          updatedAt: fishFarm.updatedAt,
        };
      }

      // Add advanced fields for table view
      if (viewType === "table") {
        selectFields.operationalSince = fishFarm.operationalSince;
        selectFields.feedingSystem = fishFarm.feedingSystem;
        selectFields.waterManagementSystem = fishFarm.waterManagementSystem;
        selectFields.technicalStaffCount = fishFarm.technicalStaffCount;
        selectFields.regularStaffCount = fishFarm.regularStaffCount;
      }

      // Add geometry fields based on view type
      if (viewType === "map") {
        selectFields.farmBoundary = sql`CASE WHEN ${fishFarm.farmBoundary} IS NOT NULL THEN ST_AsGeoJSON(${fishFarm.farmBoundary}) ELSE NULL END`;
        selectFields.locationPoint = sql`CASE WHEN ${fishFarm.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${fishFarm.locationPoint}) ELSE NULL END`;
        selectFields.pondPolygons = sql`CASE WHEN ${fishFarm.pondPolygons} IS NOT NULL THEN ST_AsGeoJSON(${fishFarm.pondPolygons}) ELSE NULL END`;
      } else {
        // For non-map views, include location point for display purposes
        selectFields.locationPoint = sql`CASE WHEN ${fishFarm.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${fishFarm.locationPoint}) ELSE NULL END`;
      }

      // Get total count for pagination
      const totalCount = await ctx.db
        .select({ count: sql`count(*)` })
        .from(fishFarm)
        .where(conditions.length ? and(...conditions) : undefined)
        .then((result) => Number(result[0].count));

      // Query fish farms with selected fields
      const farms = await ctx.db
        .select({ farmItem: selectFields })
        .from(fishFarm)
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

        if (viewType === "map" && f.farmItem.pondPolygons) {
          result.pondPolygons = JSON.parse(f.farmItem.pondPolygons as string);
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
              eq(entityMedia.entityType, "FISH_FARM" as any),
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
      console.error("Error fetching fish farms:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve fish farms",
      });
    }
  });
