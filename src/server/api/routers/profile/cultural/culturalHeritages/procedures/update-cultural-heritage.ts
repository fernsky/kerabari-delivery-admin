import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { culturalHeritage } from "@/server/db/schema/profile/institutions/cultural/culturalHeritages";
import { generateSlug } from "@/server/utils/slug-helpers";
import { sql, eq, and, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Define enums for cultural heritage input validation
const culturalHeritageTypeEnum = [
  "INTANGIBLE_HERITAGE",
  "HISTORICAL_TREE",
  "HISTORICAL_WELL",
  "HISTORICAL_POND",
  "HISTORICAL_STONE",
  "ANCIENT_INSCRIPTION",
  "SACRED_LANDMARK",
  "TRADITIONAL_DANCE",
  "TRADITIONAL_MUSIC",
  "TRADITIONAL_CRAFT",
  "FOLKLORE",
  "ORAL_TRADITION",
  "RITUAL_PRACTICE",
  "CULINARY_TRADITION",
  "TRADITIONAL_MEDICINE",
  "INDIGENOUS_LANGUAGE",
  "TRADITIONAL_GAME",
  "TRADITIONAL_FESTIVAL",
  "OTHER",
];

const heritageSignificanceEnum = [
  "LOCAL",
  "DISTRICT",
  "REGIONAL",
  "NATIONAL",
  "INTERNATIONAL",
];

const heritageConservationStatusEnum = [
  "WELL_PRESERVED",
  "MAINTAINED",
  "VULNERABLE",
  "ENDANGERED",
  "CRITICALLY_ENDANGERED",
  "LOST",
  "REVITALIZED",
  "DOCUMENTED_ONLY",
  "MIXED",
];

const heritageRecognitionTypeEnum = [
  "UNESCO_INTANGIBLE_HERITAGE",
  "NATIONAL_HERITAGE",
  "PROVINCIAL_HERITAGE",
  "LOCAL_HERITAGE",
  "COMMUNITY_RECOGNISED",
  "ACADEMIC_RECOGNITION",
  "NONE",
];

// Define schema for geometry input
const pointGeometrySchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
});

const polygonGeometrySchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))), // Array of rings, each ring is array of [lon,lat] pairs
});

// Define schema for linked entity references
const linkedEntitySchema = z.array(
  z.object({
    id: z.string(),
    name: z.string().optional(),
  }),
);

// Define schema for cultural heritage update
const updateCulturalHeritageSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(), // Optional slug - will maintain existing if not provided
  description: z.string().optional(),
  heritageType: z.enum(culturalHeritageTypeEnum as [string, ...string[]]),

  // Location details
  wardNumber: z.number().int().positive().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  hasPhysicalLocation: z.boolean().optional(),

  // Basic details
  estimatedAgeYears: z.number().int().optional(),
  historicalPeriod: z.string().optional(),
  yearDiscovered: z.number().int().optional(),
  yearRecognised: z.number().int().optional(),

  // Cultural significance
  culturalSignificance: z.string().optional(),
  heritageSignificance: z
    .enum(heritageSignificanceEnum as [string, ...string[]])
    .optional(),
  associatedCommunities: z.string().optional(),
  associatedEthnicGroups: z.string().optional(),
  spiritualSignificance: z.string().optional(),

  // Conservation status
  conservationStatus: z
    .enum(heritageConservationStatusEnum as [string, ...string[]])
    .optional(),
  conservationDetails: z.string().optional(),
  threatsToPreservation: z.string().optional(),
  safeguardingMeasures: z.string().optional(),
  lastConservationDate: z.string().optional(), // Will be parsed to a date
  conservationAgency: z.string().optional(),

  // Recognition and documentation
  isOfficiallyRecognised: z.boolean().optional(),
  recognitionType: z
    .enum(heritageRecognitionTypeEnum as [string, ...string[]])
    .optional(),
  recognitionDate: z.string().optional(), // Will be parsed to a date
  recognitionReferenceId: z.string().optional(),
  hasProperDocumentation: z.boolean().optional(),
  documentationDetails: z.string().optional(),
  hasResearchPublications: z.boolean().optional(),
  publicationReferences: z.string().optional(),

  // For tangible elements
  physicalDimensions: z.string().optional(),
  physicalCharacteristics: z.string().optional(),
  materialComposition: z.string().optional(),
  geologicalSignificance: z.string().optional(),

  // For intangible elements
  practiceFrequency: z.string().optional(),
  practiceSeason: z.string().optional(),
  geographicDistribution: z.string().optional(),
  transmissionMethod: z.string().optional(),
  associatedArtifacts: z.string().optional(),
  languageOfExpression: z.string().optional(),

  // Natural elements
  hasEcologicalValue: z.boolean().optional(),
  ecologicalValue: z.string().optional(),
  ecosystemServices: z.string().optional(),
  floraFaunaDetails: z.string().optional(),
  biologicalCharacteristics: z.string().optional(),

  // Social and contemporary context
  currentUsage: z.string().optional(),
  communityRole: z.string().optional(),
  economicValue: z.string().optional(),
  tourismValue: z.boolean().optional(),
  tourismDetails: z.string().optional(),
  educationalValue: z.boolean().optional(),
  educationalActivities: z.string().optional(),

  // Management and access
  ownershipType: z.string().optional(),
  managedBy: z.string().optional(),
  accessRestrictions: z.string().optional(),
  visitorGuidelines: z.string().optional(),

  // Rituals and practices
  associatedRituals: z.string().optional(),
  ritualCalendar: z.string().optional(),
  ritualParticipants: z.string().optional(),
  ritualMaterials: z.string().optional(),

  // Contemporary challenges and adaptation
  adaptationToModernContext: z.string().optional(),
  commercializationImpact: z.string().optional(),
  globalizationImpact: z.string().optional(),
  revitalizationEfforts: z.string().optional(),

  // Digital preservation
  hasAudioRecordings: z.boolean().optional(),
  hasVideoRecordings: z.boolean().optional(),
  hasDigitalDocumentation: z.boolean().optional(),
  digitalArchiveLinks: z.string().optional(),

  // Community engagement
  communityParticipationLevel: z.string().optional(),
  youthInvolvement: z.string().optional(),
  genderAspects: z.string().optional(),
  communityAwareness: z.string().optional(),

  // Knowledge holders and practitioners
  keyKnowledgeHolders: z.string().optional(),
  practitionerCount: z.number().int().optional(),
  masterPractitioners: z.string().optional(),
  teachingInstitutions: z.string().optional(),

  // Linkages to other entities
  linkedHistoricalSites: linkedEntitySchema.optional(),
  linkedReligiousPlaces: linkedEntitySchema.optional(),
  linkedCulturalOrganizations: linkedEntitySchema.optional(),
  linkedCulturalEvents: linkedEntitySchema.optional(),

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),

  // Geometry fields
  locationPoint: pointGeometrySchema.optional(),
  areaPolygon: polygonGeometrySchema.optional(),

  // Status
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),

  // Original values for tracking changes
  originalName: z.string().optional(),
  originalSlug: z.string().optional(),
});

// Update a cultural heritage item
export const updateCulturalHeritage = protectedProcedure
  .input(updateCulturalHeritageSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update cultural heritage items",
      });
    }

    try {
      // Check if cultural heritage exists
      const existing = await ctx.db
        .select({ id: culturalHeritage.id, slug: culturalHeritage.slug })
        .from(culturalHeritage)
        .where(eq(culturalHeritage.id, input.id));

      if (existing.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cultural heritage item not found",
        });
      }

      // Handle slug
      let slug = input.slug || existing[0].slug;

      // If name changed but slug wasn't explicitly provided, regenerate slug with romanization
      if (
        !input.slug &&
        input.name &&
        input.originalName &&
        input.name !== input.originalName
      ) {
        const baseSlug = generateSlug(input.name);

        // Check if new slug would conflict with existing ones (except our own)
        let slugExists = true;
        let slugCounter = 1;
        slug = baseSlug;

        while (slugExists) {
          const existingSlug = await ctx.db
            .select({ id: culturalHeritage.id })
            .from(culturalHeritage)
            .where(
              and(
                eq(culturalHeritage.slug, slug),
                ne(culturalHeritage.id, input.id), // Don't match our own record
              ),
            )
            .limit(1);

          if (existingSlug.length === 0) {
            slugExists = false;
          } else {
            slug = `${baseSlug}-${slugCounter}`;
            slugCounter++;
          }
        }
      }

      // Process location point geometry if provided
      let locationPointValue = undefined;
      if (input.locationPoint) {
        const pointGeoJson = JSON.stringify(input.locationPoint);
        try {
          JSON.parse(pointGeoJson); // Validate JSON
          locationPointValue = sql`ST_GeomFromGeoJSON(${pointGeoJson})`;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid location point geometry GeoJSON",
          });
        }
      }

      // Process area polygon geometry if provided
      let areaPolygonValue = undefined;
      if (input.areaPolygon) {
        const polygonGeoJson = JSON.stringify(input.areaPolygon);
        try {
          JSON.parse(polygonGeoJson); // Validate JSON
          areaPolygonValue = sql`ST_GeomFromGeoJSON(${polygonGeoJson})`;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid area polygon geometry GeoJSON",
          });
        }
      }

      // Process linked entities
      const linkedHistoricalSites = input.linkedHistoricalSites || [];
      const linkedReligiousPlaces = input.linkedReligiousPlaces || [];
      const linkedCulturalOrganizations =
        input.linkedCulturalOrganizations || [];
      const linkedCulturalEvents = input.linkedCulturalEvents || [];

      // Parse dates if provided
      let lastConservationDate = undefined;
      if (input.lastConservationDate) {
        try {
          lastConservationDate = new Date(input.lastConservationDate);
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid last conservation date format",
          });
        }
      }

      let recognitionDate = undefined;
      if (input.recognitionDate) {
        try {
          recognitionDate = new Date(input.recognitionDate);
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid recognition date format",
          });
        }
      }

      const now = new Date();

      // Handle verification status changes
      const wasVerifiedBefore = (await ctx.db
        .select({ isVerified: culturalHeritage.isVerified })
        .from(culturalHeritage)
        .where(eq(culturalHeritage.id, input.id))
        .then((result) => result[0].isVerified)) as boolean;

      const verificationChanged = wasVerifiedBefore !== input.isVerified;
      let verificationDate = undefined;
      let verifiedBy = undefined;

      if (verificationChanged && input.isVerified) {
        verificationDate = now;
        verifiedBy = ctx.user.id;
      }

      // Prepare update data object
      const updateData: any = {
        name: input.name,
        slug,
        description: input.description,
        heritageType: input.heritageType as any,

        // Location details
        wardNumber: input.wardNumber,
        location: input.location,
        address: input.address,
        hasPhysicalLocation: input.hasPhysicalLocation,

        // Basic details
        estimatedAgeYears: input.estimatedAgeYears,
        historicalPeriod: input.historicalPeriod,
        yearDiscovered: input.yearDiscovered,
        yearRecognised: input.yearRecognised,

        // Cultural significance
        culturalSignificance: input.culturalSignificance,
        heritageSignificance: input.heritageSignificance as any,
        associatedCommunities: input.associatedCommunities,
        associatedEthnicGroups: input.associatedEthnicGroups,
        spiritualSignificance: input.spiritualSignificance,

        // Conservation status
        conservationStatus: input.conservationStatus as any,
        conservationDetails: input.conservationDetails,
        threatsToPreservation: input.threatsToPreservation,
        safeguardingMeasures: input.safeguardingMeasures,
        conservationAgency: input.conservationAgency,

        // Recognition and documentation
        isOfficiallyRecognised: input.isOfficiallyRecognised,
        recognitionType: input.recognitionType as any,
        recognitionReferenceId: input.recognitionReferenceId,
        hasProperDocumentation: input.hasProperDocumentation,
        documentationDetails: input.documentationDetails,
        hasResearchPublications: input.hasResearchPublications,
        publicationReferences: input.publicationReferences,

        // For tangible elements
        physicalDimensions: input.physicalDimensions,
        physicalCharacteristics: input.physicalCharacteristics,
        materialComposition: input.materialComposition,
        geologicalSignificance: input.geologicalSignificance,

        // For intangible elements
        practiceFrequency: input.practiceFrequency,
        practiceSeason: input.practiceSeason,
        geographicDistribution: input.geographicDistribution,
        transmissionMethod: input.transmissionMethod,
        associatedArtifacts: input.associatedArtifacts,
        languageOfExpression: input.languageOfExpression,

        // Natural elements
        hasEcologicalValue: input.hasEcologicalValue,
        ecologicalValue: input.ecologicalValue,
        ecosystemServices: input.ecosystemServices,
        floraFaunaDetails: input.floraFaunaDetails,
        biologicalCharacteristics: input.biologicalCharacteristics,

        // Social and contemporary context
        currentUsage: input.currentUsage,
        communityRole: input.communityRole,
        economicValue: input.economicValue,
        tourismValue: input.tourismValue,
        tourismDetails: input.tourismDetails,
        educationalValue: input.educationalValue,
        educationalActivities: input.educationalActivities,

        // Management and access
        ownershipType: input.ownershipType,
        managedBy: input.managedBy,
        accessRestrictions: input.accessRestrictions,
        visitorGuidelines: input.visitorGuidelines,

        // Rituals and practices
        associatedRituals: input.associatedRituals,
        ritualCalendar: input.ritualCalendar,
        ritualParticipants: input.ritualParticipants,
        ritualMaterials: input.ritualMaterials,

        // Contemporary challenges and adaptation
        adaptationToModernContext: input.adaptationToModernContext,
        commercializationImpact: input.commercializationImpact,
        globalizationImpact: input.globalizationImpact,
        revitalizationEfforts: input.revitalizationEfforts,

        // Digital preservation
        hasAudioRecordings: input.hasAudioRecordings,
        hasVideoRecordings: input.hasVideoRecordings,
        hasDigitalDocumentation: input.hasDigitalDocumentation,
        digitalArchiveLinks: input.digitalArchiveLinks,

        // Community engagement
        communityParticipationLevel: input.communityParticipationLevel,
        youthInvolvement: input.youthInvolvement,
        genderAspects: input.genderAspects,
        communityAwareness: input.communityAwareness,

        // Knowledge holders and practitioners
        keyKnowledgeHolders: input.keyKnowledgeHolders,
        practitionerCount: input.practitionerCount,
        masterPractitioners: input.masterPractitioners,
        teachingInstitutions: input.teachingInstitutions,

        // Linkages to other entities as JSON arrays
        linkedHistoricalSites:
          linkedHistoricalSites.length > 0
            ? sql`${JSON.stringify(linkedHistoricalSites)}::jsonb`
            : sql`'[]'::jsonb`,
        linkedReligiousPlaces:
          linkedReligiousPlaces.length > 0
            ? sql`${JSON.stringify(linkedReligiousPlaces)}::jsonb`
            : sql`'[]'::jsonb`,
        linkedCulturalOrganizations:
          linkedCulturalOrganizations.length > 0
            ? sql`${JSON.stringify(linkedCulturalOrganizations)}::jsonb`
            : sql`'[]'::jsonb`,
        linkedCulturalEvents:
          linkedCulturalEvents.length > 0
            ? sql`${JSON.stringify(linkedCulturalEvents)}::jsonb`
            : sql`'[]'::jsonb`,

        // SEO fields
        metaTitle: input.metaTitle || input.name,
        metaDescription: input.metaDescription,
        keywords: input.keywords,

        // Status and verification
        isVerified: input.isVerified,
        isActive: input.isActive !== undefined ? input.isActive : true,

        // Metadata
        updatedAt: now,
        updatedBy: ctx.user.id,
      };

      // Add date fields only if they were provided
      if (lastConservationDate !== undefined) {
        updateData.lastConservationDate = lastConservationDate;
      }

      if (recognitionDate !== undefined) {
        updateData.recognitionDate = recognitionDate;
      }

      // Only add verification fields if verification status changed
      if (verificationDate !== undefined) {
        updateData.verificationDate = verificationDate;
      }

      if (verifiedBy !== undefined) {
        updateData.verifiedBy = verifiedBy;
      }

      // Only add geometry fields if they were provided
      if (locationPointValue !== undefined) {
        updateData.locationPoint = locationPointValue;
      }

      if (areaPolygonValue !== undefined) {
        updateData.areaPolygon = areaPolygonValue;
      }

      // Update the cultural heritage
      const result = await ctx.db
        .update(culturalHeritage)
        .set(updateData)
        .where(eq(culturalHeritage.id, input.id))
        .returning({
          id: culturalHeritage.id,
          slug: culturalHeritage.slug,
        });

      return {
        success: true,
        slug: result[0].slug,
      };
    } catch (error) {
      console.error("Error updating cultural heritage:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update cultural heritage",
      });
    }
  });
