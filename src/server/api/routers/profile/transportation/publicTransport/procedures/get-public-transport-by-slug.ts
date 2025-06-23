import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { publicTransport } from "@/server/db/schema/profile/institutions/transportation/publicTransport";
import { media } from "@/server/db/schema/common/media";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Get public transport by slug
export const getPublicTransportBySlug = publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const transportData = await ctx.db
        .select({
          transport: {
            id: publicTransport.id,
            name: publicTransport.name,
            slug: publicTransport.slug,
            description: publicTransport.description,
            type: publicTransport.type,

            // Operator details
            operatorName: publicTransport.operatorName,
            operatorContact: publicTransport.operatorContact,
            operatorEmail: publicTransport.operatorEmail,
            operatorWebsite: publicTransport.operatorWebsite,

            // Route details
            routeName: publicTransport.routeName,
            startPoint: publicTransport.startPoint,
            endPoint: publicTransport.endPoint,
            viaPoints: publicTransport.viaPoints,
            estimatedDuration: publicTransport.estimatedDuration,

            // Schedule details
            frequency: publicTransport.frequency,
            startTime: publicTransport.startTime,
            endTime: publicTransport.endTime,
            intervalMinutes: publicTransport.intervalMinutes,

            // Vehicle details
            vehicleCount: publicTransport.vehicleCount,
            seatingCapacity: publicTransport.seatingCapacity,
            vehicleCondition: publicTransport.vehicleCondition,
            hasAirConditioning: publicTransport.hasAirConditioning,
            hasWifi: publicTransport.hasWifi,
            isAccessible: publicTransport.isAccessible,

            // Fare details
            fareAmount: publicTransport.fareAmount,
            fareDescription: publicTransport.fareDescription,

            // Related entities
            servingRoadIds: publicTransport.servingRoadIds,
            parkingFacilityIds: publicTransport.parkingFacilityIds,

            // SEO fields
            metaTitle: publicTransport.metaTitle,
            metaDescription: publicTransport.metaDescription,
            keywords: publicTransport.keywords,

            // Geometry fields
            routePath: sql`CASE WHEN ${publicTransport.routePath} IS NOT NULL THEN ST_AsGeoJSON(${publicTransport.routePath}) ELSE NULL END`,
            stopPoints: sql`CASE WHEN ${publicTransport.stopPoints} IS NOT NULL THEN ST_AsGeoJSON(${publicTransport.stopPoints}) ELSE NULL END`,

            // Status and metadata
            isActive: publicTransport.isActive,
            createdAt: publicTransport.createdAt,
            updatedAt: publicTransport.updatedAt,
          },
        })
        .from(publicTransport)
        .where(eq(publicTransport.slug, input))
        .limit(1);

      if (!transportData.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Public transport not found",
        });
      }

      // Process the transport data to parse GeoJSON strings
      const processedTransport = {
        ...transportData[0].transport,
        routePath: transportData[0].transport.routePath
          ? JSON.parse(transportData[0].transport.routePath as string)
          : null,
        stopPoints: transportData[0].transport.stopPoints
          ? JSON.parse(transportData[0].transport.stopPoints as string)
          : null,
      };

      // Get all media for this public transport
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
            eq(entityMedia.entityId, processedTransport.id),
            eq(entityMedia.entityType, "PUBLIC_TRANSPORT" as any),
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

      // Also fetch related entities information if IDs are available
      // let relatedRoads = [];
      // let relatedParkingFacilities = [];

      // Note: For now we're just returning raw IDs, full implementation would fetch related entity details

      return {
        ...processedTransport,
        media: mediaResult,
        // relatedRoads,
        // relatedParkingFacilities,
      };
    } catch (error) {
      console.error("Error fetching public transport by slug:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve public transport data",
      });
    }
  });
