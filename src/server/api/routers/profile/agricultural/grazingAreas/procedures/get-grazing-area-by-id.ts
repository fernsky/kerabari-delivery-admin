import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { grazingArea } from "@/server/db/schema/profile/institutions/agricultural/grazingAreas";
import { media } from "@/server/db/schema/common/media";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Get grazing area by ID
export const getGrazingAreaById = publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const grazingAreaData = await ctx.db
        .select({
          grazingAreaItem: {
            id: grazingArea.id,
            name: grazingArea.name,
            slug: grazingArea.slug,
            description: grazingArea.description,
            type: grazingArea.type,

            // Location details
            wardNumber: grazingArea.wardNumber,
            location: grazingArea.location,
            address: grazingArea.address,

            // Physical details
            areaInHectares: grazingArea.areaInHectares,
            elevationInMeters: grazingArea.elevationInMeters,
            terrain: grazingArea.terrain,
            groundCover: grazingArea.groundCover,
            accessibility: grazingArea.accessibility,

            // Grazing specific details
            livestockCapacity: grazingArea.livestockCapacity,
            primaryLivestockType: grazingArea.primaryLivestockType,
            grazingSeasons: grazingArea.grazingSeasons,
            grazingDuration: grazingArea.grazingDuration,
            rotationalSystem: grazingArea.rotationalSystem,
            restPeriod: grazingArea.restPeriod,
            utilizationLevel: grazingArea.utilizationLevel,

            // Water resources
            hasWaterSource: grazingArea.hasWaterSource,
            waterSourceTypes: grazingArea.waterSourceTypes,
            waterAvailability: grazingArea.waterAvailability,
            waterSourceDistance: grazingArea.waterSourceDistance,

            // Management details
            isGovernmentOwned: grazingArea.isGovernmentOwned,
            ownerName: grazingArea.ownerName,
            ownerContact: grazingArea.ownerContact,
            caretakerName: grazingArea.caretakerName,
            caretakerContact: grazingArea.caretakerContact,
            permitRequired: grazingArea.permitRequired,
            permitInfo: grazingArea.permitInfo,

            // Infrastructure
            hasFencing: grazingArea.hasFencing,
            hasWindbreaks: grazingArea.hasWindbreaks,
            hasShelters: grazingArea.hasShelters,
            infrastructureNotes: grazingArea.infrastructureNotes,

            // Health and sustainability
            invasiveSpecies: grazingArea.invasiveSpecies,
            erosionIssues: grazingArea.erosionIssues,
            conservationStatus: grazingArea.conservationStatus,
            restorationEfforts: grazingArea.restorationEfforts,

            // Cultural significance
            traditionalUse: grazingArea.traditionalUse,
            culturalSignificance: grazingArea.culturalSignificance,

            // SEO fields
            metaTitle: grazingArea.metaTitle,
            metaDescription: grazingArea.metaDescription,
            keywords: grazingArea.keywords,

            // Geometry fields
            locationPoint: sql`CASE WHEN ${grazingArea.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${grazingArea.locationPoint}) ELSE NULL END`,
            areaPolygon: sql`CASE WHEN ${grazingArea.areaPolygon} IS NOT NULL THEN ST_AsGeoJSON(${grazingArea.areaPolygon}) ELSE NULL END`,

            // Status and metadata
            isActive: grazingArea.isActive,
            createdAt: grazingArea.createdAt,
            updatedAt: grazingArea.updatedAt,
          },
        })
        .from(grazingArea)
        .where(eq(grazingArea.id, input))
        .limit(1);

      if (!grazingAreaData.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Grazing area not found",
        });
      }

      // Process the grazing area data to parse GeoJSON strings
      const processedGrazingArea = {
        ...grazingAreaData[0].grazingAreaItem,
        locationPoint: grazingAreaData[0].grazingAreaItem.locationPoint
          ? JSON.parse(
              grazingAreaData[0].grazingAreaItem.locationPoint as string,
            )
          : null,
        areaPolygon: grazingAreaData[0].grazingAreaItem.areaPolygon
          ? JSON.parse(grazingAreaData[0].grazingAreaItem.areaPolygon as string)
          : null,
      };

      // Get all media for this grazing area
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
            eq(entityMedia.entityId, processedGrazingArea.id),
            eq(entityMedia.entityType, "GRAZING_AREA" as any),
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
        ...processedGrazingArea,
        media: mediaResult,
      };
    } catch (error) {
      console.error("Error fetching grazing area:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve grazing area data",
      });
    }
  });
