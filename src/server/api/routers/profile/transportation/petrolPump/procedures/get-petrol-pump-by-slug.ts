import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { petrolPump } from "@/server/db/schema/profile/institutions/transportation/petrolPump";
import { media } from "@/server/db/schema/common/media";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Get petrol pump by slug
export const getPetrolPumpBySlug = publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const pumpData = await ctx.db
        .select({
          pump: {
            id: petrolPump.id,
            name: petrolPump.name,
            slug: petrolPump.slug,
            description: petrolPump.description,
            type: petrolPump.type,

            // Location details
            wardNumber: petrolPump.wardNumber,
            locality: petrolPump.locality,
            address: petrolPump.address,

            // Owner details
            ownerName: petrolPump.ownerName,
            ownerContact: petrolPump.ownerContact,
            ownerEmail: petrolPump.ownerEmail,
            ownerWebsite: petrolPump.ownerWebsite,

            // Facilities
            hasEVCharging: petrolPump.hasEVCharging,
            hasCarWash: petrolPump.hasCarWash,
            hasConvenienceStore: petrolPump.hasConvenienceStore,
            hasRestroom: petrolPump.hasRestroom,
            hasAirFilling: petrolPump.hasAirFilling,
            operatingHours: petrolPump.operatingHours,

            // SEO fields
            metaTitle: petrolPump.metaTitle,
            metaDescription: petrolPump.metaDescription,
            keywords: petrolPump.keywords,

            // Geometry fields
            locationPoint: sql`CASE WHEN ${petrolPump.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${petrolPump.locationPoint}) ELSE NULL END`,

            // Status and metadata
            isActive: petrolPump.isActive,
            createdAt: petrolPump.createdAt,
            updatedAt: petrolPump.updatedAt,
          },
        })
        .from(petrolPump)
        .where(eq(petrolPump.slug, input))
        .limit(1);

      if (!pumpData.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Petrol pump not found",
        });
      }

      // Process the pump data to parse GeoJSON strings
      const processedPump = {
        ...pumpData[0].pump,
        locationPoint: pumpData[0].pump.locationPoint
          ? JSON.parse(pumpData[0].pump.locationPoint as string)
          : null,
      };

      // Get all media for this petrol pump
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
            eq(entityMedia.entityId, processedPump.id),
            eq(entityMedia.entityType, "PETROL_PUMP"),
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
        ...processedPump,
        media: mediaResult,
      };
    } catch (error) {
      console.error("Error fetching petrol pump by slug:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve petrol pump data",
      });
    }
  });
