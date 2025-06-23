import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import {
  CulturalHeritage,
  culturalHeritage,
} from "@/server/db/schema/profile/institutions/cultural/culturalHeritages";
import { generateSlug } from "@/server/utils/slug-helpers";
import { sql, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

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

// Define schema for cultural heritage creation
const culturalHeritageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(), // Optional slug - will generate if not provided
  description: z.string().optional(),
  heritageType: z.enum(culturalHeritageTypeEnum as [string, ...string[]]),

  // Location details (not applicable for some intangible heritage)
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
  lastConservationDate: z.string().optional(), // Will be parsed as Date
  conservationAgency: z.string().optional(),

  // Recognition and documentation
  isOfficiallyRecognised: z.boolean().optional(),
  recognitionType: z
    .enum(heritageRecognitionTypeEnum as [string, ...string[]])
    .optional(),
  recognitionDate: z.string().optional(), // Will be parsed as Date
  recognitionReferenceId: z.string().optional(),
  hasProperDocumentation: z.boolean().optional(),
  documentationDetails: z.string().optional(),
  hasResearchPublications: z.boolean().optional(),
  publicationReferences: z.string().optional(),

  // For tangible elements (trees, wells, ponds, stones)
  physicalDimensions: z.string().optional(),
  physicalCharacteristics: z.string().optional(),
  materialComposition: z.string().optional(),
  geologicalSignificance: z.string().optional(),

  // For intangible elements (dances, music, crafts, etc.)
  practiceFrequency: z.string().optional(),
  practiceSeason: z.string().optional(),
  geographicDistribution: z.string().optional(),
  transmissionMethod: z.string().optional(),
  associatedArtifacts: z.string().optional(),
  languageOfExpression: z.string().optional(),

  // Natural elements (for trees, ponds)
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

  // Verification status
  isVerified: z.boolean().optional(),
});

// Create a new cultural heritage item
export const createCulturalHeritage = protectedProcedure
  .input(culturalHeritageSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create cultural heritage items",
      });
    }

    const id = input.id || uuidv4();
    const now = new Date();

    // Generate slug from name if not provided, with romanization support
    const baseSlug = input.slug || generateSlug(input.name);

    try {
      // Check if slug already exists
      let slug = baseSlug;
      let slugExists = true;
      let slugCounter = 1;

      while (slugExists) {
        const existingSlug = await ctx.db
          .select({ id: culturalHeritage.id })
          .from(culturalHeritage)
          .where(eq(culturalHeritage.slug, slug))
          .limit(1);

        if (existingSlug.length === 0) {
          slugExists = false;
        } else {
          slug = `${baseSlug}-${slugCounter}`;
          slugCounter++;
        }
      }

      // Process location point geometry if provided
      let locationPointValue = null;
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
      let areaPolygonValue = null;
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
      let lastConservationDate = null;
      if (input.lastConservationDate) {
        try {
          lastConservationDate = new Date(input.lastConservationDate);
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid lastConservationDate format",
          });
        }
      }

      let recognitionDate = null;
      if (input.recognitionDate) {
        try {
          recognitionDate = new Date(input.recognitionDate);
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid recognitionDate format",
          });
        }
      }

      // Use a transaction for data consistency
      return await ctx.db.transaction(async (tx) => {
        // Insert the cultural heritage
        await tx.insert(culturalHeritage).values({
          id,
          name: input.name,
          slug,
          description: input.description,
          heritageType: input.heritageType as any,

          // Location details
          wardNumber: input.wardNumber,
          location: input.location,
          address: input.address,
          hasPhysicalLocation: input.hasPhysicalLocation ?? true,

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
          lastConservationDate: lastConservationDate,
          conservationAgency: input.conservationAgency,

          // Recognition and documentation
          isOfficiallyRecognised: input.isOfficiallyRecognised || false,
          recognitionType: input.recognitionType as any,
          recognitionDate: recognitionDate,
          recognitionReferenceId: input.recognitionReferenceId,
          hasProperDocumentation: input.hasProperDocumentation || false,
          documentationDetails: input.documentationDetails,
          hasResearchPublications: input.hasResearchPublications || false,
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
          hasEcologicalValue: input.hasEcologicalValue || false,
          ecologicalValue: input.ecologicalValue,
          ecosystemServices: input.ecosystemServices,
          floraFaunaDetails: input.floraFaunaDetails,
          biologicalCharacteristics: input.biologicalCharacteristics,

          // Social and contemporary context
          currentUsage: input.currentUsage,
          communityRole: input.communityRole,
          economicValue: input.economicValue,
          tourismValue: input.tourismValue || false,
          tourismDetails: input.tourismDetails,
          educationalValue: input.educationalValue || false,
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
          hasAudioRecordings: input.hasAudioRecordings || false,
          hasVideoRecordings: input.hasVideoRecordings || false,
          hasDigitalDocumentation: input.hasDigitalDocumentation || false,
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

          // Linkages to other entities
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
          metaDescription:
            input.metaDescription ||
            input.description?.substring(0, 160) ||
            `Information about ${input.name} cultural heritage`,
          keywords:
            input.keywords ||
            `${input.name}, ${input.heritageType.toLowerCase().replace("_", " ")}, cultural heritage, ${
              input.associatedEthnicGroups || ""
            }`,

          // Geometry fields
          locationPoint: locationPointValue ? sql`${locationPointValue}` : null,
          areaPolygon: areaPolygonValue ? sql`${areaPolygonValue}` : null,

          // Status and verification
          isActive: true,
          isVerified: input.isVerified || false,
          verificationDate: input.isVerified ? now : null,
          verifiedBy: input.isVerified ? ctx.user.id : null,

          // Metadata
          createdAt: now,
          updatedAt: now,
          createdBy: ctx.user.id,
          updatedBy: ctx.user.id,
        } as unknown as CulturalHeritage);

        return { id, slug, success: true };
      });
    } catch (error) {
      console.error("Error creating cultural heritage:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create cultural heritage item",
        cause: error,
      });
    }
  });
