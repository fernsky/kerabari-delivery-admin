import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { fishFarm } from "@/server/db/schema/profile/institutions/agricultural/fishFarms";
import { media } from "@/server/db/schema/common/media";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Get fish farm by slug
export const getFishFarmBySlug = publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const farmData = await ctx.db
        .select({
          farmItem: {
            id: fishFarm.id,
            name: fishFarm.name,
            slug: fishFarm.slug,
            description: fishFarm.description,
            farmType: fishFarm.farmType,

            // Location details
            wardNumber: fishFarm.wardNumber,
            location: fishFarm.location,
            address: fishFarm.address,

            // Physical details
            ownershipType: fishFarm.ownershipType,
            totalAreaInHectares: fishFarm.totalAreaInHectares,
            waterSurfaceAreaInHectares: fishFarm.waterSurfaceAreaInHectares,
            operationalSince: fishFarm.operationalSince,

            // Water body characteristics
            totalPondCount: fishFarm.totalPondCount,
            activePondCount: fishFarm.activePondCount,
            averagePondSizeInSquareMeters:
              fishFarm.averagePondSizeInSquareMeters,
            averageWaterDepthInMeters: fishFarm.averageWaterDepthInMeters,
            totalWaterVolumeInCubicMeters:
              fishFarm.totalWaterVolumeInCubicMeters,
            waterSource: fishFarm.waterSource,
            waterSourceDetails: fishFarm.waterSourceDetails,
            waterAvailabilityIssues: fishFarm.waterAvailabilityIssues,
            hasWaterQualityMonitoring: fishFarm.hasWaterQualityMonitoring,
            waterQualityParameters: fishFarm.waterQualityParameters,

            // Culture and management details
            cultureSystem: fishFarm.cultureSystem,
            primaryFishSpecies: fishFarm.primaryFishSpecies,
            secondaryFishSpecies: fishFarm.secondaryFishSpecies,
            seedSourceDetails: fishFarm.seedSourceDetails,
            stockingDensityPerSquareMeter:
              fishFarm.stockingDensityPerSquareMeter,
            growoutPeriodInMonths: fishFarm.growoutPeriodInMonths,
            feedingSystem: fishFarm.feedingSystem,
            feedTypes: fishFarm.feedTypes,
            feedConversionRatio: fishFarm.feedConversionRatio,
            annualFeedUsageInKg: fishFarm.annualFeedUsageInKg,

            // Water management
            waterManagementSystem: fishFarm.waterManagementSystem,
            usesProbiotics: fishFarm.usesProbiotics,
            usesAeration: fishFarm.usesAeration,
            aerationType: fishFarm.aerationType,
            waterExchangeFrequency: fishFarm.waterExchangeFrequency,
            waterExchangePercentage: fishFarm.waterExchangePercentage,
            effluentManagementDetails: fishFarm.effluentManagementDetails,

            // Production details
            annualProductionInKg: fishFarm.annualProductionInKg,
            averageYieldPerHectareInKg: fishFarm.averageYieldPerHectareInKg,
            survivalRatePercentage: fishFarm.survivalRatePercentage,
            averageFishSizeInGrams: fishFarm.averageFishSizeInGrams,
            recordedYearProduction: fishFarm.recordedYearProduction,
            productionCycles: fishFarm.productionCycles,

            // Infrastructure and equipment
            hasFarmHouse: fishFarm.hasFarmHouse,
            hasHatchery: fishFarm.hasHatchery,
            hatcheryCapacity: fishFarm.hatcheryCapacity,
            hasNursery: fishFarm.hasNursery,
            nurseryAreaInSquareMeters: fishFarm.nurseryAreaInSquareMeters,
            hasFeedStorage: fishFarm.hasFeedStorage,
            hasEquipment: fishFarm.hasEquipment,
            equipmentDetails: fishFarm.equipmentDetails,
            hasLaboratory: fishFarm.hasLaboratory,
            laboratoryPurpose: fishFarm.laboratoryPurpose,
            hasIceProduction: fishFarm.hasIceProduction,
            hasProcessingArea: fishFarm.hasProcessingArea,
            hasElectricity: fishFarm.hasElectricity,
            hasGenerator: fishFarm.hasGenerator,
            hasFencing: fishFarm.hasFencing,
            hasSecuritySystem: fishFarm.hasSecuritySystem,

            // Personnel and management
            ownerName: fishFarm.ownerName,
            ownerContact: fishFarm.ownerContact,
            managerName: fishFarm.managerName,
            managerContact: fishFarm.managerContact,
            technicalStaffCount: fishFarm.technicalStaffCount,
            regularStaffCount: fishFarm.regularStaffCount,
            seasonalLaborCount: fishFarm.seasonalLaborCount,
            hasTrainedStaff: fishFarm.hasTrainedStaff,
            trainingDetails: fishFarm.trainingDetails,

            // Economic aspects
            annualOperatingCostNPR: fishFarm.annualOperatingCostNPR,
            annualRevenueNPR: fishFarm.annualRevenueNPR,
            profitableOperation: fishFarm.profitableOperation,
            marketAccessDetails: fishFarm.marketAccessDetails,
            majorBuyerTypes: fishFarm.majorBuyerTypes,
            averageSellingPricePerKg: fishFarm.averageSellingPricePerKg,

            // Health management
            commonDiseases: fishFarm.commonDiseases,
            diseasePreventionMethods: fishFarm.diseasePreventionMethods,
            usesChemicals: fishFarm.usesChemicals,
            chemicalUsageDetails: fishFarm.chemicalUsageDetails,
            mortalityPercentage: fishFarm.mortalityPercentage,
            healthMonitoringFrequency: fishFarm.healthMonitoringFrequency,

            // Sustainability aspects
            hasEnvironmentalImpactAssessment:
              fishFarm.hasEnvironmentalImpactAssessment,
            usesRenewableEnergy: fishFarm.usesRenewableEnergy,
            renewableEnergyDetails: fishFarm.renewableEnergyDetails,
            wasteManagementPractices: fishFarm.wasteManagementPractices,
            hasCertifications: fishFarm.hasCertifications,
            certificationDetails: fishFarm.certificationDetails,

            // Challenges and support
            majorConstraints: fishFarm.majorConstraints,
            disasterVulnerabilities: fishFarm.disasterVulnerabilities,
            receivesGovernmentSupport: fishFarm.receivesGovernmentSupport,
            governmentSupportDetails: fishFarm.governmentSupportDetails,
            receivesNGOSupport: fishFarm.receivesNGOSupport,
            ngoSupportDetails: fishFarm.ngoSupportDetails,
            technicalSupportNeeds: fishFarm.technicalSupportNeeds,

            // Future plans
            expansionPlans: fishFarm.expansionPlans,
            diversificationPlans: fishFarm.diversificationPlans,
            technologyUpgradePlans: fishFarm.technologyUpgradePlans,

            // Linkages to other entities
            linkedProcessingCenters: fishFarm.linkedProcessingCenters,
            linkedWaterBodies: fishFarm.linkedWaterBodies,

            // SEO fields
            metaTitle: fishFarm.metaTitle,
            metaDescription: fishFarm.metaDescription,
            keywords: fishFarm.keywords,

            // Geometry fields
            locationPoint: sql`CASE WHEN ${fishFarm.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${fishFarm.locationPoint}) ELSE NULL END`,
            farmBoundary: sql`CASE WHEN ${fishFarm.farmBoundary} IS NOT NULL THEN ST_AsGeoJSON(${fishFarm.farmBoundary}) ELSE NULL END`,
            pondPolygons: sql`CASE WHEN ${fishFarm.pondPolygons} IS NOT NULL THEN ST_AsGeoJSON(${fishFarm.pondPolygons}) ELSE NULL END`,

            // Status and metadata
            isVerified: fishFarm.isVerified,
            verificationDate: fishFarm.verificationDate,
            isActive: fishFarm.isActive,
            createdAt: fishFarm.createdAt,
            updatedAt: fishFarm.updatedAt,
          },
        })
        .from(fishFarm)
        .where(eq(fishFarm.slug, input))
        .limit(1);

      if (!farmData.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Fish farm not found",
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
        pondPolygons: farmData[0].farmItem.pondPolygons
          ? JSON.parse(farmData[0].farmItem.pondPolygons as string)
          : null,
        linkedProcessingCenters:
          farmData[0].farmItem.linkedProcessingCenters || [],
        linkedWaterBodies: farmData[0].farmItem.linkedWaterBodies || [],
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
            eq(entityMedia.entityType, "FISH_FARM" as any),
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
      console.error("Error fetching fish farm by slug:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve fish farm data",
      });
    }
  });
