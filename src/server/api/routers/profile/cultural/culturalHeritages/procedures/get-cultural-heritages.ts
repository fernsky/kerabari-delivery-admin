import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { culturalHeritage } from "@/server/db/schema/profile/institutions/cultural/culturalHeritages";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { and, eq, like, sql, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Define enums for filtering cultural heritages
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

// Filter schema for cultural heritage queries with pagination
const culturalHeritageFilterSchema = z.object({
  heritageType: z
    .enum(culturalHeritageTypeEnum as [string, ...string[]])
    .optional(),
  heritageSignificance: z
    .enum(heritageSignificanceEnum as [string, ...string[]])
    .optional(),
  conservationStatus: z
    .enum(heritageConservationStatusEnum as [string, ...string[]])
    .optional(),
  recognitionType: z
    .enum(heritageRecognitionTypeEnum as [string, ...string[]])
    .optional(),

  // Location and basic filters
  wardNumber: z.number().int().positive().optional(),
  estimatedAgeYears: z.number().int().optional(),
  hasPhysicalLocation: z.boolean().optional(),
  searchTerm: z.string().optional(),
  associatedEthnicGroups: z.string().optional(), // Search in this field

  // Boolean filters
  isOfficiallyRecognised: z.boolean().optional(),
  hasProperDocumentation: z.boolean().optional(),
  hasResearchPublications: z.boolean().optional(),
  hasEcologicalValue: z.boolean().optional(),
  tourismValue: z.boolean().optional(),
  educationalValue: z.boolean().optional(),
  hasAudioRecordings: z.boolean().optional(),
  hasVideoRecordings: z.boolean().optional(),
  hasDigitalDocumentation: z.boolean().optional(),

  // Year filters
  minYear: z.number().int().optional(),
  maxYear: z.number().int().optional(),

  // Verification filter
  isVerified: z.boolean().optional(),

  // Pagination
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(12),

  // View type - determines how much data to fetch
  viewType: z.enum(["table", "grid", "map"]).default("table"),

  // Sorting
  sortBy: z.string().optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Get all cultural heritages with optional filtering and pagination
export const getAllCulturalHeritages = publicProcedure
  .input(culturalHeritageFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      const {
        page = 1,
        pageSize = 12,
        viewType = "table",
        sortBy = "name",
        sortOrder = "asc",
      } = input || {};

      // Calculate offset for pagination
      const offset = (page - 1) * pageSize;

      // Build query with conditions
      const conditions = [];

      if (input?.heritageType && input.heritageType.trim() !== "") {
        conditions.push(
          eq(culturalHeritage.heritageType, input.heritageType as any),
        );
      }

      if (
        input?.heritageSignificance &&
        input.heritageSignificance.trim() !== ""
      ) {
        conditions.push(
          eq(
            culturalHeritage.heritageSignificance,
            input.heritageSignificance as any,
          ),
        );
      }

      if (input?.conservationStatus && input.conservationStatus.trim() !== "") {
        conditions.push(
          eq(
            culturalHeritage.conservationStatus,
            input.conservationStatus as any,
          ),
        );
      }

      if (input?.recognitionType && input.recognitionType.trim() !== "") {
        conditions.push(
          eq(culturalHeritage.recognitionType, input.recognitionType as any),
        );
      }

      if (input?.wardNumber) {
        conditions.push(eq(culturalHeritage.wardNumber, input.wardNumber));
      }

      if (input?.searchTerm && input.searchTerm.trim() !== "") {
        conditions.push(
          or(
            like(culturalHeritage.name, `%${input.searchTerm}%`),
            like(culturalHeritage.description || "", `%${input.searchTerm}%`),
            like(culturalHeritage.location || "", `%${input.searchTerm}%`),
            like(
              culturalHeritage.culturalSignificance || "",
              `%${input.searchTerm}%`,
            ),
            like(
              culturalHeritage.historicalPeriod || "",
              `%${input.searchTerm}%`,
            ),
          ),
        );
      }

      if (
        input?.associatedEthnicGroups &&
        input.associatedEthnicGroups.trim() !== ""
      ) {
        conditions.push(
          like(
            culturalHeritage.associatedEthnicGroups || "",
            `%${input.associatedEthnicGroups}%`,
          ),
        );
      }

      // Boolean filters
      if (input?.hasPhysicalLocation !== undefined) {
        conditions.push(
          eq(culturalHeritage.hasPhysicalLocation, input.hasPhysicalLocation),
        );
      }

      if (input?.isOfficiallyRecognised !== undefined) {
        conditions.push(
          eq(
            culturalHeritage.isOfficiallyRecognised,
            input.isOfficiallyRecognised,
          ),
        );
      }

      if (input?.hasProperDocumentation !== undefined) {
        conditions.push(
          eq(
            culturalHeritage.hasProperDocumentation,
            input.hasProperDocumentation,
          ),
        );
      }

      if (input?.hasResearchPublications !== undefined) {
        conditions.push(
          eq(
            culturalHeritage.hasResearchPublications,
            input.hasResearchPublications,
          ),
        );
      }

      if (input?.hasEcologicalValue !== undefined) {
        conditions.push(
          eq(culturalHeritage.hasEcologicalValue, input.hasEcologicalValue),
        );
      }

      if (input?.tourismValue !== undefined) {
        conditions.push(eq(culturalHeritage.tourismValue, input.tourismValue));
      }

      if (input?.educationalValue !== undefined) {
        conditions.push(
          eq(culturalHeritage.educationalValue, input.educationalValue),
        );
      }

      if (input?.hasAudioRecordings !== undefined) {
        conditions.push(
          eq(culturalHeritage.hasAudioRecordings, input.hasAudioRecordings),
        );
      }

      if (input?.hasVideoRecordings !== undefined) {
        conditions.push(
          eq(culturalHeritage.hasVideoRecordings, input.hasVideoRecordings),
        );
      }

      if (input?.hasDigitalDocumentation !== undefined) {
        conditions.push(
          eq(
            culturalHeritage.hasDigitalDocumentation,
            input.hasDigitalDocumentation,
          ),
        );
      }

      if (input?.isVerified !== undefined) {
        conditions.push(eq(culturalHeritage.isVerified, input.isVerified));
      }

      // Year-related filters
      if (input?.minYear !== undefined) {
        conditions.push(
          sql`COALESCE(${culturalHeritage.yearDiscovered}, ${culturalHeritage.yearRecognised}, ${culturalHeritage.estimatedAgeYears}) >= ${input.minYear}`,
        );
      }

      if (input?.maxYear !== undefined) {
        conditions.push(
          sql`COALESCE(${culturalHeritage.yearDiscovered}, ${culturalHeritage.yearRecognised}, ${culturalHeritage.estimatedAgeYears}) <= ${input.maxYear}`,
        );
      }

      // Determine which fields to select based on viewType
      let selectFields: any = {
        id: culturalHeritage.id,
        name: culturalHeritage.name,
        slug: culturalHeritage.slug,
        heritageType: culturalHeritage.heritageType,
        wardNumber: culturalHeritage.wardNumber,
        location: culturalHeritage.location,
        isVerified: culturalHeritage.isVerified,
        hasPhysicalLocation: culturalHeritage.hasPhysicalLocation,
      };

      // Add fields based on view type
      if (viewType === "table" || viewType === "grid") {
        selectFields = {
          ...selectFields,
          description: culturalHeritage.description,
          address: culturalHeritage.address,
          heritageSignificance: culturalHeritage.heritageSignificance,
          conservationStatus: culturalHeritage.conservationStatus,
          isOfficiallyRecognised: culturalHeritage.isOfficiallyRecognised,
          recognitionType: culturalHeritage.recognitionType,
          historicalPeriod: culturalHeritage.historicalPeriod,
          estimatedAgeYears: culturalHeritage.estimatedAgeYears,
          yearDiscovered: culturalHeritage.yearDiscovered,
          yearRecognised: culturalHeritage.yearRecognised,
          associatedCommunities: culturalHeritage.associatedCommunities,
          managedBy: culturalHeritage.managedBy,
          createdAt: culturalHeritage.createdAt,
          updatedAt: culturalHeritage.updatedAt,
        };
      }

      // Additional fields for the table view
      if (viewType === "table") {
        selectFields.associatedEthnicGroups =
          culturalHeritage.associatedEthnicGroups;
        selectFields.tourismValue = culturalHeritage.tourismValue;
        selectFields.educationalValue = culturalHeritage.educationalValue;
      }

      // Add geometry fields based on view type
      if (viewType === "map") {
        selectFields.areaPolygon = sql`CASE WHEN ${culturalHeritage.areaPolygon} IS NOT NULL THEN ST_AsGeoJSON(${culturalHeritage.areaPolygon}) ELSE NULL END`;
        selectFields.locationPoint = sql`CASE WHEN ${culturalHeritage.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${culturalHeritage.locationPoint}) ELSE NULL END`;
      } else {
        // For non-map views, include location point for display purposes
        selectFields.locationPoint = sql`CASE WHEN ${culturalHeritage.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${culturalHeritage.locationPoint}) ELSE NULL END`;
      }

      // Get total count for pagination
      const totalCount = await ctx.db
        .select({ count: sql`count(*)` })
        .from(culturalHeritage)
        .where(conditions.length ? and(...conditions) : undefined)
        .then((result) => Number(result[0].count));

      // Query cultural heritages with selected fields
      const heritages = await ctx.db
        .select({ heritageItem: selectFields })
        .from(culturalHeritage)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(
          sortOrder === "asc"
            ? sql`${sql.identifier(sortBy)} ASC`
            : sql`${sql.identifier(sortBy)} DESC`,
        )
        .limit(pageSize)
        .offset(offset);

      // Process results for GeoJSON if needed
      const processedHeritages = heritages.map((h) => {
        const result: any = { ...h.heritageItem };

        if (h.heritageItem.locationPoint) {
          result.locationPoint = JSON.parse(
            h.heritageItem.locationPoint as string,
          );
        }

        if (viewType === "map" && h.heritageItem.areaPolygon) {
          result.areaPolygon = JSON.parse(h.heritageItem.areaPolygon as string);
        }

        return result;
      });

      // Get primary media for each cultural heritage
      const heritageIds = processedHeritages.map((h) => h.id);

      // Only query media if we have heritage items
      let heritagesWithMedia = processedHeritages;

      if (heritageIds.length > 0) {
        const primaryMedia = await ctx.db
          .select({
            entityId: entityMedia.entityId,
            mediaId: media.id,
            filePath: media.filePath,
            fileName: media.fileName,
            mimeType: media.mimeType,
          })
          .from(entityMedia)
          .innerJoin(media, eq(entityMedia.mediaId, media.id))
          .where(
            and(
              inArray(entityMedia.entityId, heritageIds),
              eq(entityMedia.entityType, "CULTURAL_HERITAGE" as any),
              eq(entityMedia.isPrimary, true),
            ),
          );

        // Generate presigned URLs using the minio-helpers utility
        const mediaWithUrls = await generateBatchPresignedUrls(
          ctx.minio,
          primaryMedia.map((item) => ({
            id: item.mediaId,
            filePath: item.filePath,
            fileName: item.fileName,
          })),
          24 * 60 * 60, // 24 hour expiry
        );

        // Create a map of entity ID to media data with presigned URL
        const primaryMediaMap = new Map(
          mediaWithUrls.map((item, index) => [
            primaryMedia[index].entityId,
            {
              mediaId: primaryMedia[index].mediaId,
              url: item.url || "",
              fileName: item.fileName || primaryMedia[index].fileName,
              mimeType: primaryMedia[index].mimeType,
            },
          ]),
        );

        // Combine heritages with their primary media
        heritagesWithMedia = processedHeritages.map((h) => ({
          ...h,
          primaryMedia: primaryMediaMap.get(h.id) || null,
        }));
      }

      return {
        items: heritagesWithMedia,
        page,
        pageSize,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNextPage: page * pageSize < totalCount,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      console.error("Error fetching cultural heritages:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve cultural heritages",
      });
    }
  });
