import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { religiousPlace } from "@/server/db/schema/profile/institutions/cultural/religiousPlaces";
import { media } from "@/server/db/schema/common/media";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Get religious place by ID
export const getReligiousPlaceById = publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const placeData = await ctx.db
        .select({
          placeItem: {
            id: religiousPlace.id,
            name: religiousPlace.name,
            slug: religiousPlace.slug,
            description: religiousPlace.description,
            type: religiousPlace.type,

            // Location details
            wardNumber: religiousPlace.wardNumber,
            location: religiousPlace.location,
            address: religiousPlace.address,

            // Physical details
            areaInSquareMeters: religiousPlace.areaInSquareMeters,
            architecturalStyle: religiousPlace.architecturalStyle,
            constructionMaterial: religiousPlace.constructionMaterial,
            yearEstablished: religiousPlace.yearEstablished,
            yearRenovated: religiousPlace.yearRenovated,

            // Religious details
            mainDeity: religiousPlace.mainDeity,
            secondaryDeities: religiousPlace.secondaryDeities,
            religiousTradition: religiousPlace.religiousTradition,
            religiousSignificance: religiousPlace.religiousSignificance,
            religiousStory: religiousPlace.religiousStory,

            // Cultural and historical significance
            historicalSignificance: religiousPlace.historicalSignificance,
            culturalSignificance: religiousPlace.culturalSignificance,
            isHeritageSite: religiousPlace.isHeritageSite,
            heritageDesignation: religiousPlace.heritageDesignation,
            inscriptions: religiousPlace.inscriptions,
            hasArchaeologicalValue: religiousPlace.hasArchaeologicalValue,
            archaeologicalDetails: religiousPlace.archaeologicalDetails,

            // Management and operations
            managedBy: religiousPlace.managedBy,
            contactPerson: religiousPlace.contactPerson,
            contactPhone: religiousPlace.contactPhone,
            contactEmail: religiousPlace.contactEmail,
            websiteUrl: religiousPlace.websiteUrl,
            dailyOpeningTime: religiousPlace.dailyOpeningTime,
            dailyClosingTime: religiousPlace.dailyClosingTime,
            isOpenAllDay: religiousPlace.isOpenAllDay,
            weeklyClosedDays: religiousPlace.weeklyClosedDays,
            entryFeeNPR: religiousPlace.entryFeeNPR,
            entryFeeDetailsForeigners: religiousPlace.entryFeeDetailsForeigners,

            // Physical infrastructure
            totalBuildingCount: religiousPlace.totalBuildingCount,
            hasMainHall: religiousPlace.hasMainHall,
            mainHallCapacity: religiousPlace.mainHallCapacity,
            hasCommunitySpace: religiousPlace.hasCommunitySpace,
            hasAccommodation: religiousPlace.hasAccommodation,
            accommodationCapacity: religiousPlace.accommodationCapacity,
            hasKitchen: religiousPlace.hasKitchen,
            hasDiningHall: religiousPlace.hasDiningHall,
            diningCapacity: religiousPlace.diningCapacity,
            hasLibrary: religiousPlace.hasLibrary,
            hasMuseum: religiousPlace.hasMuseum,

            // Facilities and amenities
            hasParking: religiousPlace.hasParking,
            parkingCapacity: religiousPlace.parkingCapacity,
            hasToilets: religiousPlace.hasToilets,
            hasHandicapAccess: religiousPlace.hasHandicapAccess,
            hasElectricity: religiousPlace.hasElectricity,
            hasWaterSupply: religiousPlace.hasWaterSupply,
            hasDrinkingWater: religiousPlace.hasDrinkingWater,
            hasFootwear: religiousPlace.hasFootwear,
            hasClothStorage: religiousPlace.hasClothStorage,

            // Preservation and restoration
            preservationStatus: religiousPlace.preservationStatus,
            lastRestorationYear: religiousPlace.lastRestorationYear,
            restorationDetails: religiousPlace.restorationDetails,
            hasRegularMaintenance: religiousPlace.hasRegularMaintenance,
            maintenanceDetails: religiousPlace.maintenanceDetails,
            fundingSource: religiousPlace.fundingSource,

            // Religious activities
            regularPrayers: religiousPlace.regularPrayers,
            specialRituals: religiousPlace.specialRituals,
            annualFestivals: religiousPlace.annualFestivals,
            festivalMonths: religiousPlace.festivalMonths,
            festivalDetails: religiousPlace.festivalDetails,
            specialOfferings: religiousPlace.specialOfferings,

            // Visitor information
            estimatedDailyVisitors: religiousPlace.estimatedDailyVisitors,
            estimatedYearlyVisitors: religiousPlace.estimatedYearlyVisitors,
            peakVisitationMonths: religiousPlace.peakVisitationMonths,
            hasOverseasVisitors: religiousPlace.hasOverseasVisitors,
            guidesAvailable: religiousPlace.guidesAvailable,
            visitorDressCode: religiousPlace.visitorDressCode,
            photoAllowed: religiousPlace.photoAllowed,
            photoRestrictions: religiousPlace.photoRestrictions,

            // Community engagement
            communityBenefits: religiousPlace.communityBenefits,
            socialServicesOffered: religiousPlace.socialServicesOffered,
            educationalActivities: religiousPlace.educationalActivities,

            // Economic aspects
            hasShops: religiousPlace.hasShops,
            shopCount: religiousPlace.shopCount,
            shopTypes: religiousPlace.shopTypes,
            economicImpact: religiousPlace.economicImpact,
            totalAnnualRevenue: religiousPlace.totalAnnualRevenue,
            annualOperatingBudget: religiousPlace.annualOperatingBudget,

            // Environmental aspects
            hasGarden: religiousPlace.hasGarden,
            gardenAreaInSquareMeters: religiousPlace.gardenAreaInSquareMeters,
            hasSignificantTrees: religiousPlace.hasSignificantTrees,
            significantTreeDetails: religiousPlace.significantTreeDetails,
            hasWaterBody: religiousPlace.hasWaterBody,
            waterBodyDetails: religiousPlace.waterBodyDetails,

            // Safety and security
            hasSecurityPersonnel: religiousPlace.hasSecurityPersonnel,
            hasCCTV: religiousPlace.hasCCTV,
            hasFireSafety: religiousPlace.hasFireSafety,
            disasterPreparedness: religiousPlace.disasterPreparedness,

            // Artworks and treasures
            hasSignificantArtwork: religiousPlace.hasSignificantArtwork,
            artworkDetails: religiousPlace.artworkDetails,
            hasHistoricalArtifacts: religiousPlace.hasHistoricalArtifacts,
            artifactsDetails: religiousPlace.artifactsDetails,
            hasRegisteredTreasures: religiousPlace.hasRegisteredTreasures,
            treasureDetails: religiousPlace.treasureDetails,

            // Challenges and needs
            currentChallenges: religiousPlace.currentChallenges,
            conservationNeeds: religiousPlace.conservationNeeds,
            developmentPlans: religiousPlace.developmentPlans,

            // Linkages to other entities
            linkedCulturalEvents: religiousPlace.linkedCulturalEvents,
            linkedCulturalOrganizations:
              religiousPlace.linkedCulturalOrganizations,

            // SEO fields
            metaTitle: religiousPlace.metaTitle,
            metaDescription: religiousPlace.metaDescription,
            keywords: religiousPlace.keywords,

            // Geometry fields
            locationPoint: sql`CASE WHEN ${religiousPlace.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${religiousPlace.locationPoint}) ELSE NULL END`,
            complexBoundary: sql`CASE WHEN ${religiousPlace.complexBoundary} IS NOT NULL THEN ST_AsGeoJSON(${religiousPlace.complexBoundary}) ELSE NULL END`,

            // Status and metadata
            isVerified: religiousPlace.isVerified,
            verificationDate: religiousPlace.verificationDate,
            isActive: religiousPlace.isActive,
            createdAt: religiousPlace.createdAt,
            updatedAt: religiousPlace.updatedAt,
          },
        })
        .from(religiousPlace)
        .where(eq(religiousPlace.id, input))
        .limit(1);

      if (!placeData.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Religious place not found",
        });
      }

      // Process the place data to parse GeoJSON strings and JSON fields
      const processedPlace = {
        ...placeData[0].placeItem,
        locationPoint: placeData[0].placeItem.locationPoint
          ? JSON.parse(placeData[0].placeItem.locationPoint as string)
          : null,
        complexBoundary: placeData[0].placeItem.complexBoundary
          ? JSON.parse(placeData[0].placeItem.complexBoundary as string)
          : null,
        linkedCulturalEvents: placeData[0].placeItem.linkedCulturalEvents || [],
        linkedCulturalOrganizations:
          placeData[0].placeItem.linkedCulturalOrganizations || [],
      };

      // Get all media for this religious place
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
            eq(entityMedia.entityId, processedPlace.id),
            eq(entityMedia.entityType, "RELIGIOUS_PLACE" as any),
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
        ...processedPlace,
        media: mediaResult,
      };
    } catch (error) {
      console.error("Error fetching religious place by id:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve religious place data",
      });
    }
  });
