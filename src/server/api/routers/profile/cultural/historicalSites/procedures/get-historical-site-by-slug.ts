import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { historicalSite } from "@/server/db/schema/profile/institutions/cultural/historicalSites";
import { media } from "@/server/db/schema/common/media";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Get historical site by slug
export const getHistoricalSiteBySlug = publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const siteData = await ctx.db
        .select({
          siteItem: {
            id: historicalSite.id,
            name: historicalSite.name,
            slug: historicalSite.slug,
            description: historicalSite.description,
            type: historicalSite.type,

            // Location details
            wardNumber: historicalSite.wardNumber,
            location: historicalSite.location,
            address: historicalSite.address,

            // Physical details
            areaInSquareMeters: historicalSite.areaInSquareMeters,
            architecturalStyle: historicalSite.architecturalStyle,
            constructionMaterial: historicalSite.constructionMaterial,
            historicalPeriod: historicalSite.historicalPeriod,
            yearEstablished: historicalSite.yearEstablished,
            yearAbandoned: historicalSite.yearAbandoned,
            lastRestorationYear: historicalSite.lastRestorationYear,

            // Historical context
            historicalSignificance: historicalSite.historicalSignificance,
            originalFunction: historicalSite.originalFunction,
            notablePeople: historicalSite.notablePeople,
            historicalEvents: historicalSite.historicalEvents,
            dynastyOrRulership: historicalSite.dynastyOrRulership,
            changeOfOwnership: historicalSite.changeOfOwnership,

            // Cultural and archaeological significance
            culturalSignificance: historicalSite.culturalSignificance,
            archaeologicalRemains: historicalSite.archaeologicalRemains,
            artifactsFound: historicalSite.artifactsFound,
            excavationHistory: historicalSite.excavationHistory,
            excavationYear: historicalSite.excavationYear,

            // Heritage status
            isHeritageSite: historicalSite.isHeritageSite,
            heritageDesignation: historicalSite.heritageDesignation,
            heritageListingYear: historicalSite.heritageListingYear,
            heritageReferenceId: historicalSite.heritageReferenceId,

            // Inscriptions and documentation
            hasInscriptions: historicalSite.hasInscriptions,
            inscriptionDetails: historicalSite.inscriptionDetails,
            hasHistoricalDocuments: historicalSite.hasHistoricalDocuments,
            documentationDetails: historicalSite.documentationDetails,

            // Management and operations
            managedBy: historicalSite.managedBy,
            contactPerson: historicalSite.contactPerson,
            contactPhone: historicalSite.contactPhone,
            contactEmail: historicalSite.contactEmail,
            websiteUrl: historicalSite.websiteUrl,
            dailyOpeningTime: historicalSite.dailyOpeningTime,
            dailyClosingTime: historicalSite.dailyClosingTime,
            isOpenAllDay: historicalSite.isOpenAllDay,
            weeklyClosedDays: historicalSite.weeklyClosedDays,
            entryFeeNPR: historicalSite.entryFeeNPR,
            entryFeeDetailsForeigners: historicalSite.entryFeeDetailsForeigners,

            // Physical infrastructure
            totalStructureCount: historicalSite.totalStructureCount,
            hasMainBuilding: historicalSite.hasMainBuilding,
            hasDefensiveWalls: historicalSite.hasDefensiveWalls,
            hasTowers: historicalSite.hasTowers,
            hasMoat: historicalSite.hasMoat,
            hasGardens: historicalSite.hasGardens,
            hasCourtyards: historicalSite.hasCourtyards,
            structureDetails: historicalSite.structureDetails,

            // Features and architectural elements
            notableFeatures: historicalSite.notableFeatures,
            architecturalElements: historicalSite.architecturalElements,
            hasUndergroundStructures: historicalSite.hasUndergroundStructures,
            undergroundDetails: historicalSite.undergroundDetails,
            hasDurbar: historicalSite.hasDurbar,
            hasTemple: historicalSite.hasTemple,
            hasArtificialWaterBody: historicalSite.hasArtificialWaterBody,
            waterBodyDetails: historicalSite.waterBodyDetails,

            // Facilities and amenities
            hasParking: historicalSite.hasParking,
            parkingCapacity: historicalSite.parkingCapacity,
            hasToilets: historicalSite.hasToilets,
            hasHandicapAccess: historicalSite.hasHandicapAccess,
            hasElectricity: historicalSite.hasElectricity,
            hasWaterSupply: historicalSite.hasWaterSupply,
            hasCafeteria: historicalSite.hasCafeteria,
            hasGiftShop: historicalSite.hasGiftShop,

            // Preservation and restoration
            preservationStatus: historicalSite.preservationStatus,
            restorationDetails: historicalSite.restorationDetails,
            hasRegularMaintenance: historicalSite.hasRegularMaintenance,
            maintenanceDetails: historicalSite.maintenanceDetails,
            fundingSource: historicalSite.fundingSource,
            conservationChallenges: historicalSite.conservationChallenges,

            // Research and education
            researchValue: historicalSite.researchValue,
            ongoingResearch: historicalSite.ongoingResearch,
            educationalPrograms: historicalSite.educationalPrograms,
            publicationReferences: historicalSite.publicationReferences,

            // Visitor information
            estimatedDailyVisitors: historicalSite.estimatedDailyVisitors,
            estimatedYearlyVisitors: historicalSite.estimatedYearlyVisitors,
            peakVisitationMonths: historicalSite.peakVisitationMonths,
            hasOverseasVisitors: historicalSite.hasOverseasVisitors,
            guidesAvailable: historicalSite.guidesAvailable,
            hasTourismInfrastructure: historicalSite.hasTourismInfrastructure,
            tourismDetails: historicalSite.tourismDetails,
            visitorFacilities: historicalSite.visitorFacilities,
            photoAllowed: historicalSite.photoAllowed,
            photoRestrictions: historicalSite.photoRestrictions,
            visitDuration: historicalSite.visitDuration,

            // Community engagement
            localCommunityInvolvement: historicalSite.localCommunityInvolvement,
            communityBenefits: historicalSite.communityBenefits,
            educationalActivities: historicalSite.educationalActivities,

            // Economic aspects
            annualMaintenanceCost: historicalSite.annualMaintenanceCost,
            annualRevenue: historicalSite.annualRevenue,
            economicImpact: historicalSite.economicImpact,
            employmentGenerated: historicalSite.employmentGenerated,

            // Cultural and ceremonial use
            traditionalUses: historicalSite.traditionalUses,
            ceremonialImportance: historicalSite.ceremonialImportance,
            culturalEvents: historicalSite.culturalEvents,
            localMyths: historicalSite.localMyths,

            // Safety and security
            hasSecurityPersonnel: historicalSite.hasSecurityPersonnel,
            hasCCTV: historicalSite.hasCCTV,
            hasFireSafety: historicalSite.hasFireSafety,
            safetyMeasures: historicalSite.safetyMeasures,
            disasterPreparedness: historicalSite.disasterPreparedness,

            // Artifacts and collections
            hasArchaeologicalArtifacts:
              historicalSite.hasArchaeologicalArtifacts,
            artifactStorageLocation: historicalSite.artifactStorageLocation,
            hasOnSiteMuseum: historicalSite.hasOnSiteMuseum,
            museumDetails: historicalSite.museumDetails,
            notableCollections: historicalSite.notableCollections,

            // Damages and threats
            damageHistory: historicalSite.damageHistory,
            currentThreats: historicalSite.currentThreats,
            encroachmentIssues: historicalSite.encroachmentIssues,
            naturalDisasterRisk: historicalSite.naturalDisasterRisk,

            // Development and future plans
            developmentProjects: historicalSite.developmentProjects,
            futureConservationPlans: historicalSite.futureConservationPlans,
            proposedImprovements: historicalSite.proposedImprovements,

            // Linkages to other entities
            linkedCulturalEvents: historicalSite.linkedCulturalEvents,
            linkedCulturalOrganizations:
              historicalSite.linkedCulturalOrganizations,
            linkedReligiousPlaces: historicalSite.linkedReligiousPlaces,
            linkedHistoricalSites: historicalSite.linkedHistoricalSites,

            // SEO fields
            metaTitle: historicalSite.metaTitle,
            metaDescription: historicalSite.metaDescription,
            keywords: historicalSite.keywords,

            // Geometry fields
            locationPoint: sql`CASE WHEN ${historicalSite.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${historicalSite.locationPoint}) ELSE NULL END`,
            siteBoundary: sql`CASE WHEN ${historicalSite.siteBoundary} IS NOT NULL THEN ST_AsGeoJSON(${historicalSite.siteBoundary}) ELSE NULL END`,
            structureFootprints: sql`CASE WHEN ${historicalSite.structureFootprints} IS NOT NULL THEN ST_AsGeoJSON(${historicalSite.structureFootprints}) ELSE NULL END`,

            // Status and metadata
            isVerified: historicalSite.isVerified,
            verificationDate: historicalSite.verificationDate,
            isActive: historicalSite.isActive,
            createdAt: historicalSite.createdAt,
            updatedAt: historicalSite.updatedAt,
          },
        })
        .from(historicalSite)
        .where(eq(historicalSite.slug, input))
        .limit(1);

      if (!siteData.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Historical site not found",
        });
      }

      // Process the site data to parse GeoJSON strings and JSON fields
      const processedSite = {
        ...siteData[0].siteItem,
        locationPoint: siteData[0].siteItem.locationPoint
          ? JSON.parse(siteData[0].siteItem.locationPoint as string)
          : null,
        siteBoundary: siteData[0].siteItem.siteBoundary
          ? JSON.parse(siteData[0].siteItem.siteBoundary as string)
          : null,
        structureFootprints: siteData[0].siteItem.structureFootprints
          ? JSON.parse(siteData[0].siteItem.structureFootprints as string)
          : null,
        linkedCulturalEvents: siteData[0].siteItem.linkedCulturalEvents || [],
        linkedCulturalOrganizations:
          siteData[0].siteItem.linkedCulturalOrganizations || [],
        linkedReligiousPlaces: siteData[0].siteItem.linkedReligiousPlaces || [],
        linkedHistoricalSites: siteData[0].siteItem.linkedHistoricalSites || [],
      };

      // Get all media for this historical site
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
            eq(entityMedia.entityId, processedSite.id),
            eq(entityMedia.entityType, "HISTORICAL_SITE" as any),
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
        ...processedSite,
        media: mediaResult,
      };
    } catch (error) {
      console.error("Error fetching historical site by slug:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve historical site data",
      });
    }
  });
