import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { culturalHeritage } from "@/server/db/schema/profile/institutions/cultural/culturalHeritages";
import { media } from "@/server/db/schema/common/media";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Get cultural heritage by ID
export const getCulturalHeritageById = publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const heritageData = await ctx.db
        .select({
          heritageItem: {
            // Basic details
            id: culturalHeritage.id,
            name: culturalHeritage.name,
            slug: culturalHeritage.slug,
            description: culturalHeritage.description,
            heritageType: culturalHeritage.heritageType,

            // Location details
            wardNumber: culturalHeritage.wardNumber,
            location: culturalHeritage.location,
            address: culturalHeritage.address,
            hasPhysicalLocation: culturalHeritage.hasPhysicalLocation,

            // Basic details
            estimatedAgeYears: culturalHeritage.estimatedAgeYears,
            historicalPeriod: culturalHeritage.historicalPeriod,
            yearDiscovered: culturalHeritage.yearDiscovered,
            yearRecognised: culturalHeritage.yearRecognised,

            // Cultural significance
            culturalSignificance: culturalHeritage.culturalSignificance,
            heritageSignificance: culturalHeritage.heritageSignificance,
            associatedCommunities: culturalHeritage.associatedCommunities,
            associatedEthnicGroups: culturalHeritage.associatedEthnicGroups,
            spiritualSignificance: culturalHeritage.spiritualSignificance,

            // Conservation status
            conservationStatus: culturalHeritage.conservationStatus,
            conservationDetails: culturalHeritage.conservationDetails,
            threatsToPreservation: culturalHeritage.threatsToPreservation,
            safeguardingMeasures: culturalHeritage.safeguardingMeasures,
            lastConservationDate: culturalHeritage.lastConservationDate,
            conservationAgency: culturalHeritage.conservationAgency,

            // Recognition and documentation
            isOfficiallyRecognised: culturalHeritage.isOfficiallyRecognised,
            recognitionType: culturalHeritage.recognitionType,
            recognitionDate: culturalHeritage.recognitionDate,
            recognitionReferenceId: culturalHeritage.recognitionReferenceId,
            hasProperDocumentation: culturalHeritage.hasProperDocumentation,
            documentationDetails: culturalHeritage.documentationDetails,
            hasResearchPublications: culturalHeritage.hasResearchPublications,
            publicationReferences: culturalHeritage.publicationReferences,

            // For tangible elements
            physicalDimensions: culturalHeritage.physicalDimensions,
            physicalCharacteristics: culturalHeritage.physicalCharacteristics,
            materialComposition: culturalHeritage.materialComposition,
            geologicalSignificance: culturalHeritage.geologicalSignificance,

            // For intangible elements
            practiceFrequency: culturalHeritage.practiceFrequency,
            practiceSeason: culturalHeritage.practiceSeason,
            geographicDistribution: culturalHeritage.geographicDistribution,
            transmissionMethod: culturalHeritage.transmissionMethod,
            associatedArtifacts: culturalHeritage.associatedArtifacts,
            languageOfExpression: culturalHeritage.languageOfExpression,

            // Natural elements
            hasEcologicalValue: culturalHeritage.hasEcologicalValue,
            ecologicalValue: culturalHeritage.ecologicalValue,
            ecosystemServices: culturalHeritage.ecosystemServices,
            floraFaunaDetails: culturalHeritage.floraFaunaDetails,
            biologicalCharacteristics:
              culturalHeritage.biologicalCharacteristics,

            // Social and contemporary context
            currentUsage: culturalHeritage.currentUsage,
            communityRole: culturalHeritage.communityRole,
            economicValue: culturalHeritage.economicValue,
            tourismValue: culturalHeritage.tourismValue,
            tourismDetails: culturalHeritage.tourismDetails,
            educationalValue: culturalHeritage.educationalValue,
            educationalActivities: culturalHeritage.educationalActivities,

            // Management and access
            ownershipType: culturalHeritage.ownershipType,
            managedBy: culturalHeritage.managedBy,
            accessRestrictions: culturalHeritage.accessRestrictions,
            visitorGuidelines: culturalHeritage.visitorGuidelines,

            // Rituals and practices
            associatedRituals: culturalHeritage.associatedRituals,
            ritualCalendar: culturalHeritage.ritualCalendar,
            ritualParticipants: culturalHeritage.ritualParticipants,
            ritualMaterials: culturalHeritage.ritualMaterials,

            // Contemporary challenges and adaptation
            adaptationToModernContext:
              culturalHeritage.adaptationToModernContext,
            commercializationImpact: culturalHeritage.commercializationImpact,
            globalizationImpact: culturalHeritage.globalizationImpact,
            revitalizationEfforts: culturalHeritage.revitalizationEfforts,

            // Digital preservation
            hasAudioRecordings: culturalHeritage.hasAudioRecordings,
            hasVideoRecordings: culturalHeritage.hasVideoRecordings,
            hasDigitalDocumentation: culturalHeritage.hasDigitalDocumentation,
            digitalArchiveLinks: culturalHeritage.digitalArchiveLinks,

            // Community engagement
            communityParticipationLevel:
              culturalHeritage.communityParticipationLevel,
            youthInvolvement: culturalHeritage.youthInvolvement,
            genderAspects: culturalHeritage.genderAspects,
            communityAwareness: culturalHeritage.communityAwareness,

            // Knowledge holders and practitioners
            keyKnowledgeHolders: culturalHeritage.keyKnowledgeHolders,
            practitionerCount: culturalHeritage.practitionerCount,
            masterPractitioners: culturalHeritage.masterPractitioners,
            teachingInstitutions: culturalHeritage.teachingInstitutions,

            // Linkages to other entities
            linkedHistoricalSites: culturalHeritage.linkedHistoricalSites,
            linkedReligiousPlaces: culturalHeritage.linkedReligiousPlaces,
            linkedCulturalOrganizations:
              culturalHeritage.linkedCulturalOrganizations,
            linkedCulturalEvents: culturalHeritage.linkedCulturalEvents,

            // SEO fields
            metaTitle: culturalHeritage.metaTitle,
            metaDescription: culturalHeritage.metaDescription,
            keywords: culturalHeritage.keywords,

            // Geometry fields
            locationPoint: sql`CASE WHEN ${culturalHeritage.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${culturalHeritage.locationPoint}) ELSE NULL END`,
            areaPolygon: sql`CASE WHEN ${culturalHeritage.areaPolygon} IS NOT NULL THEN ST_AsGeoJSON(${culturalHeritage.areaPolygon}) ELSE NULL END`,

            // Status and metadata
            isActive: culturalHeritage.isActive,
            isVerified: culturalHeritage.isVerified,
            verificationDate: culturalHeritage.verificationDate,
            createdAt: culturalHeritage.createdAt,
            updatedAt: culturalHeritage.updatedAt,
          },
        })
        .from(culturalHeritage)
        .where(eq(culturalHeritage.id, input))
        .limit(1);

      if (!heritageData.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cultural heritage item not found",
        });
      }

      // Process the heritage data to parse GeoJSON strings and JSON fields
      const processedHeritage = {
        ...heritageData[0].heritageItem,
        locationPoint: heritageData[0].heritageItem.locationPoint
          ? JSON.parse(heritageData[0].heritageItem.locationPoint as string)
          : null,
        areaPolygon: heritageData[0].heritageItem.areaPolygon
          ? JSON.parse(heritageData[0].heritageItem.areaPolygon as string)
          : null,
        linkedHistoricalSites:
          heritageData[0].heritageItem.linkedHistoricalSites || [],
        linkedReligiousPlaces:
          heritageData[0].heritageItem.linkedReligiousPlaces || [],
        linkedCulturalOrganizations:
          heritageData[0].heritageItem.linkedCulturalOrganizations || [],
        linkedCulturalEvents:
          heritageData[0].heritageItem.linkedCulturalEvents || [],
      };

      // Get all media for this cultural heritage
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
            eq(entityMedia.entityId, processedHeritage.id),
            eq(entityMedia.entityType, "CULTURAL_HERITAGE" as any),
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
        ...processedHeritage,
        media: mediaResult,
      };
    } catch (error) {
      console.error("Error fetching cultural heritage:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve cultural heritage data",
      });
    }
  });
