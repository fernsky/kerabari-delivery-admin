import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { location } from "@/server/db/schema/profile/institutions/local-areas/location";
import { media } from "@/server/db/schema/common/media";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Get location by slug
export const getLocationBySlug = publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const locationData = await ctx.db
        .select({
          location: {
            id: location.id,
            name: location.name,
            slug: location.slug,
            description: location.description,
            type: location.type,
            isNewSettlement: location.isNewSettlement,
            isTownPlanned: location.isTownPlanned,
            metaTitle: location.metaTitle,
            metaDescription: location.metaDescription,
            keywords: location.keywords,
            pointGeometry: sql`CASE WHEN ${location.pointGeometry} IS NOT NULL THEN ST_AsGeoJSON(${location.pointGeometry}) ELSE NULL END`,
            polygonGeometry: sql`CASE WHEN ${location.polygonGeometry} IS NOT NULL THEN ST_AsGeoJSON(${location.polygonGeometry}) ELSE NULL END`,
            centroid: sql`CASE WHEN ${location.polygonGeometry} IS NOT NULL THEN ST_AsGeoJSON(ST_Centroid(${location.polygonGeometry})) 
                          WHEN ${location.pointGeometry} IS NOT NULL THEN ST_AsGeoJSON(${location.pointGeometry})
                          ELSE NULL END`,
            parentId: location.parentId,
            isActive: location.isActive,
            createdAt: location.createdAt,
            updatedAt: location.updatedAt,
          },
        })
        .from(location)
        .where(eq(location.slug, input))
        .limit(1);

      if (!locationData.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Location not found",
        });
      }

      // Process the location data to parse GeoJSON strings
      const processedLocation = {
        ...locationData[0].location,
        pointGeometry: locationData[0].location.pointGeometry
          ? JSON.parse(locationData[0].location.pointGeometry as string)
          : null,
        polygonGeometry: locationData[0].location.polygonGeometry
          ? JSON.parse(locationData[0].location.polygonGeometry as string)
          : null,
        centroid: locationData[0].location.centroid
          ? JSON.parse(locationData[0].location.centroid as string)
          : null,
      };

      // Get all media for this location
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
            eq(entityMedia.entityId, processedLocation.id),
            eq(entityMedia.entityType, "LOCATION"),
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
        ...processedLocation,
        media: mediaResult,
      };
    } catch (error) {
      console.error("Error fetching location by slug:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve location data",
      });
    }
  });
