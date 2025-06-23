import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { agriProcessingCenter } from "@/server/db/schema/profile/institutions/agricultural/agriProcessingCenters";
import { media } from "@/server/db/schema/common/media";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Get processing center by ID
export const getProcessingCenterById = publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const centerData = await ctx.db
        .select({
          processingCenterItem: {
            id: agriProcessingCenter.id,
            name: agriProcessingCenter.name,
            slug: agriProcessingCenter.slug,
            description: agriProcessingCenter.description,
            centerType: agriProcessingCenter.centerType,

            // Location details
            wardNumber: agriProcessingCenter.wardNumber,
            location: agriProcessingCenter.location,
            address: agriProcessingCenter.address,

            // Physical properties
            areaInSquareMeters: agriProcessingCenter.areaInSquareMeters,
            buildingYearConstructed:
              agriProcessingCenter.buildingYearConstructed,
            isOperational: agriProcessingCenter.isOperational,
            operationalStatus: agriProcessingCenter.operationalStatus,
            operationStartYear: agriProcessingCenter.operationStartYear,

            // Storage details
            hasStorageFacility: agriProcessingCenter.hasStorageFacility,
            storageType: agriProcessingCenter.storageType,
            storageTotalCapacityMT: agriProcessingCenter.storageTotalCapacityMT,
            storageCurrentUsageMT: agriProcessingCenter.storageCurrentUsageMT,
            temperatureControlled: agriProcessingCenter.temperatureControlled,
            temperatureRangeMin: agriProcessingCenter.temperatureRangeMin,
            temperatureRangeMax: agriProcessingCenter.temperatureRangeMax,
            humidityControlled: agriProcessingCenter.humidityControlled,

            // Processing capabilities
            hasProcessingUnit: agriProcessingCenter.hasProcessingUnit,
            processingLevel: agriProcessingCenter.processingLevel,
            processingCapacityMTPerDay:
              agriProcessingCenter.processingCapacityMTPerDay,
            mainProcessingActivities:
              agriProcessingCenter.mainProcessingActivities,
            valueAdditionActivities:
              agriProcessingCenter.valueAdditionActivities,

            // Products and commodities
            primaryCommodities: agriProcessingCenter.primaryCommodities,
            secondaryCommodities: agriProcessingCenter.secondaryCommodities,
            seasonalAvailability: agriProcessingCenter.seasonalAvailability,

            // Quality control
            hasQualityControlLab: agriProcessingCenter.hasQualityControlLab,
            qualityStandards: agriProcessingCenter.qualityStandards,
            certifications: agriProcessingCenter.certifications,

            // Management and ownership
            ownershipType: agriProcessingCenter.ownershipType,
            ownerName: agriProcessingCenter.ownerName,
            ownerContact: agriProcessingCenter.ownerContact,
            managerName: agriProcessingCenter.managerName,
            managerContact: agriProcessingCenter.managerContact,

            // Staffing
            totalStaffCount: agriProcessingCenter.totalStaffCount,
            technicalStaffCount: agriProcessingCenter.technicalStaffCount,

            // Connectivity and services
            hasElectricity: agriProcessingCenter.hasElectricity,
            hasWaterSupply: agriProcessingCenter.hasWaterSupply,
            hasWasteManagementSystem:
              agriProcessingCenter.hasWasteManagementSystem,
            hasInternet: agriProcessingCenter.hasInternet,

            // Capacity and utilization
            annualThroughputMT: agriProcessingCenter.annualThroughputMT,
            capacityUtilizationPercent:
              agriProcessingCenter.capacityUtilizationPercent,
            recordedYear: agriProcessingCenter.recordedYear,

            // Economic impact
            employmentGenerated: agriProcessingCenter.employmentGenerated,
            serviceAreaRadiusKM: agriProcessingCenter.serviceAreaRadiusKM,
            farmersServedCount: agriProcessingCenter.farmersServedCount,
            womenFarmersPercent: agriProcessingCenter.womenFarmersPercent,

            // Linkages to other entities
            linkedGrazingAreas: agriProcessingCenter.linkedGrazingAreas,
            linkedAgricZones: agriProcessingCenter.linkedAgricZones,
            linkedGrasslands: agriProcessingCenter.linkedGrasslands,

            // Financial aspects
            establishmentCostNPR: agriProcessingCenter.establishmentCostNPR,
            annualOperatingCostNPR: agriProcessingCenter.annualOperatingCostNPR,
            annualRevenueNPR: agriProcessingCenter.annualRevenueNPR,
            profitableOperation: agriProcessingCenter.profitableOperation,

            // Challenges and needs
            majorConstraints: agriProcessingCenter.majorConstraints,
            developmentNeeds: agriProcessingCenter.developmentNeeds,

            // SEO fields
            metaTitle: agriProcessingCenter.metaTitle,
            metaDescription: agriProcessingCenter.metaDescription,
            keywords: agriProcessingCenter.keywords,

            // Geometry fields
            locationPoint: sql`CASE WHEN ${agriProcessingCenter.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${agriProcessingCenter.locationPoint}) ELSE NULL END`,
            facilityFootprint: sql`CASE WHEN ${agriProcessingCenter.facilityFootprint} IS NOT NULL THEN ST_AsGeoJSON(${agriProcessingCenter.facilityFootprint}) ELSE NULL END`,

            // Status and metadata
            isActive: agriProcessingCenter.isActive,
            createdAt: agriProcessingCenter.createdAt,
            updatedAt: agriProcessingCenter.updatedAt,
          },
        })
        .from(agriProcessingCenter)
        .where(eq(agriProcessingCenter.id, input))
        .limit(1);

      if (!centerData.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Processing center not found",
        });
      }

      // Process the processing center data to parse GeoJSON strings and JSON fields
      const processedCenter = {
        ...centerData[0].processingCenterItem,
        locationPoint: centerData[0].processingCenterItem.locationPoint
          ? JSON.parse(
              centerData[0].processingCenterItem.locationPoint as string,
            )
          : null,
        facilityFootprint: centerData[0].processingCenterItem.facilityFootprint
          ? JSON.parse(
              centerData[0].processingCenterItem.facilityFootprint as string,
            )
          : null,
        linkedGrazingAreas:
          centerData[0].processingCenterItem.linkedGrazingAreas || [],
        linkedAgricZones:
          centerData[0].processingCenterItem.linkedAgricZones || [],
        linkedGrasslands:
          centerData[0].processingCenterItem.linkedGrasslands || [],
      };

      // Get all media for this processing center
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
            eq(entityMedia.entityId, processedCenter.id),
            eq(entityMedia.entityType, "AGRI_PROCESSING_CENTER" as any),
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
        ...processedCenter,
        media: mediaResult,
      };
    } catch (error) {
      console.error("Error fetching processing center:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve processing center data",
      });
    }
  });
