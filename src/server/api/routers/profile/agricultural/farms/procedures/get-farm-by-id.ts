import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { farm } from "@/server/db/schema/profile/institutions/agricultural/farms";
import { media } from "@/server/db/schema/common/media";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Get farm by ID
export const getFarmById = publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const farmData = await ctx.db
        .select({
          farmItem: {
            id: farm.id,
            name: farm.name,
            slug: farm.slug,
            description: farm.description,
            farmType: farm.farmType,
            farmingSystem: farm.farmingSystem,

            // Location details
            wardNumber: farm.wardNumber,
            location: farm.location,
            address: farm.address,

            // Land details
            totalAreaInHectares: farm.totalAreaInHectares,
            cultivatedAreaInHectares: farm.cultivatedAreaInHectares,
            landOwnership: farm.landOwnership,
            soilType: farm.soilType,
            irrigationType: farm.irrigationType,
            irrigationSourceDetails: farm.irrigationSourceDetails,
            irrigatedAreaInHectares: farm.irrigatedAreaInHectares,

            // Crops
            mainCrops: farm.mainCrops,
            secondaryCrops: farm.secondaryCrops,
            cropRotation: farm.cropRotation,
            cropRotationDetails: farm.cropRotationDetails,
            intercropping: farm.intercropping,
            croppingSeasons: farm.croppingSeasons,
            annualCropYieldMT: farm.annualCropYieldMT,
            recordedYearCrops: farm.recordedYearCrops,

            // Livestock
            hasLivestock: farm.hasLivestock,
            livestockTypes: farm.livestockTypes,
            cattleCount: farm.cattleCount,
            buffaloCount: farm.buffaloCount,
            goatCount: farm.goatCount,
            sheepCount: farm.sheepCount,
            pigCount: farm.pigCount,
            poultryCount: farm.poultryCount,
            otherLivestockCount: farm.otherLivestockCount,
            otherLivestockDetails: farm.otherLivestockDetails,
            livestockHousingType: farm.livestockHousingType,
            livestockManagementDetails: farm.livestockManagementDetails,
            annualMilkProductionLiters: farm.annualMilkProductionLiters,
            annualEggProduction: farm.annualEggProduction,
            annualMeatProductionKg: farm.annualMeatProductionKg,
            recordedYearLivestock: farm.recordedYearLivestock,

            // Farmer details
            ownerName: farm.ownerName,
            ownerContact: farm.ownerContact,
            farmerType: farm.farmerType,
            farmerEducation: farm.farmerEducation,
            farmerExperienceYears: farm.farmerExperienceYears,
            hasCooperativeMembership: farm.hasCooperativeMembership,
            cooperativeName: farm.cooperativeName,

            // Labor and economics
            familyLaborCount: farm.familyLaborCount,
            hiredLaborCount: farm.hiredLaborCount,
            annualInvestmentNPR: farm.annualInvestmentNPR,
            annualIncomeNPR: farm.annualIncomeNPR,
            profitableOperation: farm.profitableOperation,
            marketAccessDetails: farm.marketAccessDetails,
            majorBuyerTypes: farm.majorBuyerTypes,

            // Infrastructure
            hasFarmHouse: farm.hasFarmHouse,
            hasStorage: farm.hasStorage,
            storageCapacityMT: farm.storageCapacityMT,
            hasFarmEquipment: farm.hasFarmEquipment,
            equipmentDetails: farm.equipmentDetails,
            hasElectricity: farm.hasElectricity,
            hasRoadAccess: farm.hasRoadAccess,
            roadAccessType: farm.roadAccessType,

            // Sustainability and practices
            usesChemicalFertilizer: farm.usesChemicalFertilizer,
            usesPesticides: farm.usesPesticides,
            usesOrganicMethods: farm.usesOrganicMethods,
            composting: farm.composting,
            soilConservationPractices: farm.soilConservationPractices,
            rainwaterHarvesting: farm.rainwaterHarvesting,
            manureManagement: farm.manureManagement,
            hasCertifications: farm.hasCertifications,
            certificationDetails: farm.certificationDetails,

            // Technical support and training
            receivesExtensionServices: farm.receivesExtensionServices,
            extensionServiceProvider: farm.extensionServiceProvider,
            trainingReceived: farm.trainingReceived,
            technicalSupportNeeds: farm.technicalSupportNeeds,

            // Challenges and opportunities
            majorChallenges: farm.majorChallenges,
            disasterVulnerabilities: farm.disasterVulnerabilities,
            growthOpportunities: farm.growthOpportunities,
            futureExpansionPlans: farm.futureExpansionPlans,

            // Linkages to other entities
            linkedGrazingAreas: farm.linkedGrazingAreas,
            linkedProcessingCenters: farm.linkedProcessingCenters,
            linkedAgricZones: farm.linkedAgricZones,
            linkedGrasslands: farm.linkedGrasslands,

            // SEO fields
            metaTitle: farm.metaTitle,
            metaDescription: farm.metaDescription,
            keywords: farm.keywords,

            // Geometry fields
            locationPoint: sql`CASE WHEN ${farm.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${farm.locationPoint}) ELSE NULL END`,
            farmBoundary: sql`CASE WHEN ${farm.farmBoundary} IS NOT NULL THEN ST_AsGeoJSON(${farm.farmBoundary}) ELSE NULL END`,

            // Status fields
            isVerified: farm.isVerified,
            isActive: farm.isActive,
            createdAt: farm.createdAt,
            updatedAt: farm.updatedAt,
          },
        })
        .from(farm)
        .where(eq(farm.id, input))
        .limit(1);

      if (!farmData.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Farm not found",
        });
      }

      // Process the farm data to parse GeoJSON strings and JSON fields
      const processedFarm = {
        ...farmData[0].farmItem,
        locationPoint: farmData[0].farmItem.locationPoint
          ? JSON.parse(farmData[0].farmItem.locationPoint as string)
          : null,
        farmBoundary: farmData[0].farmItem.farmBoundary
          ? JSON.parse(farmData[0].farmItem.farmBoundary as string)
          : null,
        linkedGrazingAreas: farmData[0].farmItem.linkedGrazingAreas || [],
        linkedProcessingCenters:
          farmData[0].farmItem.linkedProcessingCenters || [],
        linkedAgricZones: farmData[0].farmItem.linkedAgricZones || [],
        linkedGrasslands: farmData[0].farmItem.linkedGrasslands || [],
      };

      // Get all media for this farm
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
            eq(entityMedia.entityId, processedFarm.id),
            eq(entityMedia.entityType, "FARM" as any),
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
        ...processedFarm,
        media: mediaResult,
      };
    } catch (error) {
      console.error("Error fetching farm:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve farm data",
      });
    }
  });
