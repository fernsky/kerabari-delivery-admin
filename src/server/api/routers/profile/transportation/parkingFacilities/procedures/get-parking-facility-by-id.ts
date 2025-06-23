import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { parkingFacility } from "@/server/db/schema/profile/institutions/transportation/parkingFacility";
import { media } from "@/server/db/schema/common/media";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Get parking facility by ID
export const getParkingFacilityById = publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const facilityData = await ctx.db
        .select({
          facility: {
            id: parkingFacility.id,
            name: parkingFacility.name,
            slug: parkingFacility.slug,
            description: parkingFacility.description,
            type: parkingFacility.type,

            // Location details
            wardNumber: parkingFacility.wardNumber,
            location: parkingFacility.location,
            address: parkingFacility.address,

            // Physical details
            areaInSquareMeters: parkingFacility.areaInSquareMeters,
            vehicleCapacity: parkingFacility.vehicleCapacity,
            condition: parkingFacility.condition,
            drainageSystem: parkingFacility.drainageSystem,

            // Additional facilities
            hasRoof: parkingFacility.hasRoof,
            hasToilet: parkingFacility.hasToilet,
            hasWaitingArea: parkingFacility.hasWaitingArea,
            hasTicketCounter: parkingFacility.hasTicketCounter,
            hasFoodStalls: parkingFacility.hasFoodStalls,
            hasSecurityPersonnel: parkingFacility.hasSecurityPersonnel,
            hasCCTV: parkingFacility.hasCCTV,
            operatingHours: parkingFacility.operatingHours,

            // Management details
            operator: parkingFacility.operator,
            contactInfo: parkingFacility.contactInfo,
            establishedYear: parkingFacility.establishedYear,

            // SEO fields
            metaTitle: parkingFacility.metaTitle,
            metaDescription: parkingFacility.metaDescription,
            keywords: parkingFacility.keywords,

            // Geometry fields
            locationPoint: sql`CASE WHEN ${parkingFacility.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${parkingFacility.locationPoint}) ELSE NULL END`,
            areaPolygon: sql`CASE WHEN ${parkingFacility.areaPolygon} IS NOT NULL THEN ST_AsGeoJSON(${parkingFacility.areaPolygon}) ELSE NULL END`,

            // Status and metadata
            isActive: parkingFacility.isActive,
            createdAt: parkingFacility.createdAt,
            updatedAt: parkingFacility.updatedAt,
          },
        })
        .from(parkingFacility)
        .where(eq(parkingFacility.id, input))
        .limit(1);

      if (!facilityData.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Parking facility not found",
        });
      }

      // Process the facility data to parse GeoJSON strings
      const processedFacility = {
        ...facilityData[0].facility,
        locationPoint: facilityData[0].facility.locationPoint
          ? JSON.parse(facilityData[0].facility.locationPoint as string)
          : null,
        areaPolygon: facilityData[0].facility.areaPolygon
          ? JSON.parse(facilityData[0].facility.areaPolygon as string)
          : null,
      };

      // Get all media for this facility
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
            eq(entityMedia.entityId, processedFacility.id),
            eq(entityMedia.entityType, "PARKING_FACILITY"),
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
        ...processedFacility,
        media: mediaResult,
      };
    } catch (error) {
      console.error("Error fetching parking facility:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve parking facility data",
      });
    }
  });
