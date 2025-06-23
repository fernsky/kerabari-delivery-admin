import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { grassland } from "@/server/db/schema/profile/institutions/agricultural/grasslands";
import { media } from "@/server/db/schema/common/media";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Get grassland by ID
export const getGrasslandById = publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const grasslandData = await ctx.db
        .select({
          grasslandItem: {
            id: grassland.id,
            name: grassland.name,
            slug: grassland.slug,
            description: grassland.description,
            type: grassland.type,

            // Location details
            wardNumber: grassland.wardNumber,
            location: grassland.location,
            address: grassland.address,

            // Physical details
            areaInHectares: grassland.areaInHectares,
            elevationInMeters: grassland.elevationInMeters,
            vegetationDensity: grassland.vegetationDensity,
            managementType: grassland.managementType,

            // Grassland specific details
            dominantSpecies: grassland.dominantSpecies,
            carryingCapacity: grassland.carryingCapacity,
            grazingPeriod: grassland.grazingPeriod,
            annualFodderYield: grassland.annualFodderYield,
            yieldYear: grassland.yieldYear,

            // Management details
            isGovernmentOwned: grassland.isGovernmentOwned,
            ownerName: grassland.ownerName,
            ownerContact: grassland.ownerContact,
            caretakerName: grassland.caretakerName,
            caretakerContact: grassland.caretakerContact,

            // Additional information
            hasWaterSource: grassland.hasWaterSource,
            waterSourceType: grassland.waterSourceType,
            isFenced: grassland.isFenced,
            hasGrazingRights: grassland.hasGrazingRights,

            // Conservation status
            hasProtectedStatus: grassland.hasProtectedStatus,
            protectionType: grassland.protectionType,
            biodiversityValue: grassland.biodiversityValue,

            // SEO fields
            metaTitle: grassland.metaTitle,
            metaDescription: grassland.metaDescription,
            keywords: grassland.keywords,

            // Geometry fields
            locationPoint: sql`CASE WHEN ${grassland.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${grassland.locationPoint}) ELSE NULL END`,
            areaPolygon: sql`CASE WHEN ${grassland.areaPolygon} IS NOT NULL THEN ST_AsGeoJSON(${grassland.areaPolygon}) ELSE NULL END`,

            // Status and metadata
            isActive: grassland.isActive,
            createdAt: grassland.createdAt,
            updatedAt: grassland.updatedAt,
          },
        })
        .from(grassland)
        .where(eq(grassland.id, input))
        .limit(1);

      if (!grasslandData.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Grassland not found",
        });
      }

      // Process the grassland data to parse GeoJSON strings
      const processedGrassland = {
        ...grasslandData[0].grasslandItem,
        locationPoint: grasslandData[0].grasslandItem.locationPoint
          ? JSON.parse(grasslandData[0].grasslandItem.locationPoint as string)
          : null,
        areaPolygon: grasslandData[0].grasslandItem.areaPolygon
          ? JSON.parse(grasslandData[0].grasslandItem.areaPolygon as string)
          : null,
      };

      // Get all media for this grassland
      const mediaData = await ctx.db
        .select({
          id: media.id,
          fileName: media.fileName,
          filePath: media.filePath,
          title: media.title,
          description: media.description,
          mimeType: media.mimeType,
          isPrimary: entityMedia.isPrimary,
          displayOrder: entityMedia.displayOrder,
        })
        .from(entityMedia)
        .innerJoin(media, eq(entityMedia.mediaId, media.id))
        .where(
          and(
            eq(entityMedia.entityId, processedGrassland.id),
            eq(entityMedia.entityType, "GRASSLAND" as any),
          ),
        )
        .orderBy(entityMedia.isPrimary, entityMedia.displayOrder);

      // Generate presigned URLs for all media items
      const mediaWithUrls = await generateBatchPresignedUrls(
        ctx.minio,
        mediaData.map((item) => ({
          id: item.id,
          filePath: item.filePath,
          fileName: item.fileName,
        })),
      );

      // Combine media data with generated URLs
      const mediaResult = mediaData.map((item, index) => ({
        ...item,
        url: mediaWithUrls[index].url,
      }));

      return {
        ...processedGrassland,
        media: mediaResult,
      };
    } catch (error) {
      console.error("Error fetching grassland:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve grassland data",
      });
    }
  });
