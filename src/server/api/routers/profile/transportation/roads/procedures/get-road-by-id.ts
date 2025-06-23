import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { road } from "@/server/db/schema/profile/institutions/transportation/road";
import { media } from "@/server/db/schema/common/media";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Get road by ID
export const getRoadById = publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const roadData = await ctx.db
        .select({
          road: {
            id: road.id,
            name: road.name,
            slug: road.slug,
            description: road.description,
            type: road.type,
            widthInMeters: road.widthInMeters,
            condition: road.condition,
            drainageSystem: road.drainageSystem,
            maintenanceYear: road.maintenanceYear,
            length: road.length,
            startPoint: road.startPoint,
            endPoint: road.endPoint,
            hasStreetLights: road.hasStreetLights,
            hasDivider: road.hasDivider,
            hasPedestrian: road.hasPedestrian,
            hasBicycleLane: road.hasBicycleLane,
            metaTitle: road.metaTitle,
            metaDescription: road.metaDescription,
            keywords: road.keywords,
            roadPath: sql`CASE WHEN ${road.roadPath} IS NOT NULL THEN ST_AsGeoJSON(${road.roadPath}) ELSE NULL END`,
            representativePoint: sql`CASE WHEN ${road.representativePoint} IS NOT NULL THEN ST_AsGeoJSON(${road.representativePoint}) ELSE NULL END`,
            isActive: road.isActive,
            createdAt: road.createdAt,
            updatedAt: road.updatedAt,
          },
        })
        .from(road)
        .where(eq(road.id, input))
        .limit(1);

      if (!roadData.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Road not found",
        });
      }

      // Process the road data to parse GeoJSON strings
      const processedRoad = {
        ...roadData[0].road,
        roadPath: roadData[0].road.roadPath
          ? JSON.parse(roadData[0].road.roadPath as string)
          : null,
        representativePoint: roadData[0].road.representativePoint
          ? JSON.parse(roadData[0].road.representativePoint as string)
          : null,
      };

      // Get all media for this road
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
            eq(entityMedia.entityId, input),
            eq(entityMedia.entityType, "ROAD"),
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
        ...processedRoad,
        media: mediaResult,
      };
    } catch (error) {
      console.error("Error fetching road:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve road data",
      });
    }
  });
