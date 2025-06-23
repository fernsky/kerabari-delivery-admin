import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { agricZone } from "@/server/db/schema/profile/institutions/agricultural/agricZones";
import { media } from "@/server/db/schema/common/media";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Get agricultural zone by slug
export const getAgricZoneBySlug = publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const zoneData = await ctx.db
        .select({
          zone: {
            id: agricZone.id,
            name: agricZone.name,
            slug: agricZone.slug,
            description: agricZone.description,
            type: agricZone.type,

            // Location details
            wardNumber: agricZone.wardNumber,
            location: agricZone.location,
            address: agricZone.address,

            // Physical details
            areaInHectares: agricZone.areaInHectares,
            soilQuality: agricZone.soilQuality,
            irrigationSystem: agricZone.irrigationSystem,

            // Agricultural details
            majorCrops: agricZone.majorCrops,
            seasonalAvailability: agricZone.seasonalAvailability,
            annualProduction: agricZone.annualProduction,
            productionYear: agricZone.productionYear,

            // Management details
            isGovernmentOwned: agricZone.isGovernmentOwned,
            ownerName: agricZone.ownerName,
            ownerContact: agricZone.ownerContact,
            caretakerName: agricZone.caretakerName,
            caretakerContact: agricZone.caretakerContact,

            // Additional facilities
            hasStorage: agricZone.hasStorage,
            hasProcessingUnit: agricZone.hasProcessingUnit,
            hasFarmersCooperative: agricZone.hasFarmersCooperative,

            // SEO fields
            metaTitle: agricZone.metaTitle,
            metaDescription: agricZone.metaDescription,
            keywords: agricZone.keywords,

            // Geometry fields
            locationPoint: sql`CASE WHEN ${agricZone.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${agricZone.locationPoint}) ELSE NULL END`,
            areaPolygon: sql`CASE WHEN ${agricZone.areaPolygon} IS NOT NULL THEN ST_AsGeoJSON(${agricZone.areaPolygon}) ELSE NULL END`,

            // Status and metadata
            isActive: agricZone.isActive,
            createdAt: agricZone.createdAt,
            updatedAt: agricZone.updatedAt,
          },
        })
        .from(agricZone)
        .where(eq(agricZone.slug, input))
        .limit(1);

      if (!zoneData.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agricultural zone not found",
        });
      }

      // Process the zone data to parse GeoJSON strings
      const processedZone = {
        ...zoneData[0].zone,
        locationPoint: zoneData[0].zone.locationPoint
          ? JSON.parse(zoneData[0].zone.locationPoint as string)
          : null,
        areaPolygon: zoneData[0].zone.areaPolygon
          ? JSON.parse(zoneData[0].zone.areaPolygon as string)
          : null,
      };

      // Get all media for this agricultural zone
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
            eq(entityMedia.entityId, processedZone.id),
            eq(entityMedia.entityType, "AGRIC_ZONE" as any),
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
        ...processedZone,
        media: mediaResult,
      };
    } catch (error) {
      console.error("Error fetching agricultural zone by slug:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve agricultural zone data",
      });
    }
  });
