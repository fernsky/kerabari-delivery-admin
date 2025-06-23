import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { religiousPlace } from "@/server/db/schema/profile/institutions/cultural/religiousPlaces";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { and, eq, like, sql, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Define enums for filtering religious places
const religiousPlaceTypeEnum = [
  "HINDU_TEMPLE",
  "BUDDHIST_TEMPLE",
  "MOSQUE",
  "CHURCH",
  "GURUDWARA",
  "SHRINE",
  "MONASTERY",
  "SYNAGOGUE",
  "JAIN_TEMPLE",
  "MEDITATION_CENTER",
  "PAGODA",
  "SACRED_GROVE",
  "SACRED_POND",
  "SACRED_RIVER",
  "SACRED_HILL",
  "PRAYER_HALL",
  "RELIGIOUS_COMPLEX",
  "OTHER",
];

const architecturalStyleEnum = [
  "TRADITIONAL_NEPALI",
  "PAGODA",
  "STUPA",
  "SHIKHARA",
  "MODERN",
  "COLONIAL",
  "GOTHIC",
  "MUGHAL",
  "DOME",
  "MIXED",
  "VERNACULAR",
  "OTHER",
];

const religiousSignificanceEnum = [
  "LOCAL",
  "REGIONAL",
  "NATIONAL",
  "INTERNATIONAL",
];

const preservationStatusEnum = [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "DAMAGED",
  "UNDER_RENOVATION",
  "REBUILT",
];

// Filter schema for religious place queries with pagination
const religiousPlaceFilterSchema = z.object({
  type: z.enum(religiousPlaceTypeEnum as [string, ...string[]]).optional(),
  architecturalStyle: z
    .enum(architecturalStyleEnum as [string, ...string[]])
    .optional(),
  religiousSignificance: z
    .enum(religiousSignificanceEnum as [string, ...string[]])
    .optional(),
  preservationStatus: z
    .enum(preservationStatusEnum as [string, ...string[]])
    .optional(),

  // Location and basic filters
  wardNumber: z.number().int().positive().optional(),
  searchTerm: z.string().optional(),

  // Boolean filters
  isHeritageSite: z.boolean().optional(),
  hasArchaeologicalValue: z.boolean().optional(),
  hasMainHall: z.boolean().optional(),
  hasCommunitySpace: z.boolean().optional(),
  hasAccommodation: z.boolean().optional(),
  hasLibrary: z.boolean().optional(),
  hasMuseum: z.boolean().optional(),
  hasParking: z.boolean().optional(),
  hasToilets: z.boolean().optional(),
  hasHandicapAccess: z.boolean().optional(),
  hasGarden: z.boolean().optional(),
  hasSignificantArtwork: z.boolean().optional(),
  hasHistoricalArtifacts: z.boolean().optional(),
  hasRegularMaintenance: z.boolean().optional(),

  // Year filters
  minYearEstablished: z.number().int().optional(),
  maxYearEstablished: z.number().int().optional(),
  minLastRestorationYear: z.number().int().optional(),
  maxLastRestorationYear: z.number().int().optional(),

  // Size filters
  minAreaInSquareMeters: z.number().positive().optional(),
  maxAreaInSquareMeters: z.number().positive().optional(),

  // Visitor filters
  minVisitors: z.number().int().nonnegative().optional(),
  maxVisitors: z.number().int().nonnegative().optional(),

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

// Get all religious places with optional filtering and pagination
export const getAllReligiousPlaces = publicProcedure
  .input(religiousPlaceFilterSchema.optional())
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

      if (input?.type && input.type.trim() !== "") {
        conditions.push(eq(religiousPlace.type, input.type as any));
      }

      if (input?.architecturalStyle && input.architecturalStyle.trim() !== "") {
        conditions.push(
          eq(
            religiousPlace.architecturalStyle,
            input.architecturalStyle as any,
          ),
        );
      }

      if (
        input?.religiousSignificance &&
        input.religiousSignificance.trim() !== ""
      ) {
        conditions.push(
          eq(
            religiousPlace.religiousSignificance,
            input.religiousSignificance as any,
          ),
        );
      }

      if (input?.preservationStatus && input.preservationStatus.trim() !== "") {
        conditions.push(
          eq(
            religiousPlace.preservationStatus,
            input.preservationStatus as any,
          ),
        );
      }

      if (input?.wardNumber) {
        conditions.push(eq(religiousPlace.wardNumber, input.wardNumber));
      }

      if (input?.searchTerm && input.searchTerm.trim() !== "") {
        conditions.push(
          or(
            like(religiousPlace.name, `%${input.searchTerm}%`),
            like(religiousPlace.description || "", `%${input.searchTerm}%`),
            like(religiousPlace.location || "", `%${input.searchTerm}%`),
            like(religiousPlace.address || "", `%${input.searchTerm}%`),
            like(religiousPlace.mainDeity || "", `%${input.searchTerm}%`),
            like(
              religiousPlace.religiousTradition || "",
              `%${input.searchTerm}%`,
            ),
          ),
        );
      }

      // Boolean filters
      if (input?.isHeritageSite !== undefined) {
        conditions.push(
          eq(religiousPlace.isHeritageSite, input.isHeritageSite),
        );
      }

      if (input?.hasArchaeologicalValue !== undefined) {
        conditions.push(
          eq(
            religiousPlace.hasArchaeologicalValue,
            input.hasArchaeologicalValue,
          ),
        );
      }

      if (input?.hasMainHall !== undefined) {
        conditions.push(eq(religiousPlace.hasMainHall, input.hasMainHall));
      }

      if (input?.hasCommunitySpace !== undefined) {
        conditions.push(
          eq(religiousPlace.hasCommunitySpace, input.hasCommunitySpace),
        );
      }

      if (input?.hasAccommodation !== undefined) {
        conditions.push(
          eq(religiousPlace.hasAccommodation, input.hasAccommodation),
        );
      }

      if (input?.hasLibrary !== undefined) {
        conditions.push(eq(religiousPlace.hasLibrary, input.hasLibrary));
      }

      if (input?.hasMuseum !== undefined) {
        conditions.push(eq(religiousPlace.hasMuseum, input.hasMuseum));
      }

      if (input?.hasParking !== undefined) {
        conditions.push(eq(religiousPlace.hasParking, input.hasParking));
      }

      if (input?.hasToilets !== undefined) {
        conditions.push(eq(religiousPlace.hasToilets, input.hasToilets));
      }

      if (input?.hasHandicapAccess !== undefined) {
        conditions.push(
          eq(religiousPlace.hasHandicapAccess, input.hasHandicapAccess),
        );
      }

      if (input?.hasGarden !== undefined) {
        conditions.push(eq(religiousPlace.hasGarden, input.hasGarden));
      }

      if (input?.hasSignificantArtwork !== undefined) {
        conditions.push(
          eq(religiousPlace.hasSignificantArtwork, input.hasSignificantArtwork),
        );
      }

      if (input?.hasHistoricalArtifacts !== undefined) {
        conditions.push(
          eq(
            religiousPlace.hasHistoricalArtifacts,
            input.hasHistoricalArtifacts,
          ),
        );
      }

      if (input?.hasRegularMaintenance !== undefined) {
        conditions.push(
          eq(religiousPlace.hasRegularMaintenance, input.hasRegularMaintenance),
        );
      }

      if (input?.isVerified !== undefined) {
        conditions.push(eq(religiousPlace.isVerified, input.isVerified));
      }

      // Year range filters
      if (input?.minYearEstablished !== undefined) {
        conditions.push(
          sql`${religiousPlace.yearEstablished} >= ${input.minYearEstablished}`,
        );
      }

      if (input?.maxYearEstablished !== undefined) {
        conditions.push(
          sql`${religiousPlace.yearEstablished} <= ${input.maxYearEstablished}`,
        );
      }

      if (input?.minLastRestorationYear !== undefined) {
        conditions.push(
          sql`${religiousPlace.lastRestorationYear} >= ${input.minLastRestorationYear}`,
        );
      }

      if (input?.maxLastRestorationYear !== undefined) {
        conditions.push(
          sql`${religiousPlace.lastRestorationYear} <= ${input.maxLastRestorationYear}`,
        );
      }

      // Area range filters
      if (input?.minAreaInSquareMeters !== undefined) {
        conditions.push(
          sql`${religiousPlace.areaInSquareMeters} >= ${input.minAreaInSquareMeters}`,
        );
      }

      if (input?.maxAreaInSquareMeters !== undefined) {
        conditions.push(
          sql`${religiousPlace.areaInSquareMeters} <= ${input.maxAreaInSquareMeters}`,
        );
      }

      // Visitor filters
      if (input?.minVisitors !== undefined) {
        conditions.push(
          sql`${religiousPlace.estimatedYearlyVisitors} >= ${input.minVisitors}`,
        );
      }

      if (input?.maxVisitors !== undefined) {
        conditions.push(
          sql`${religiousPlace.estimatedYearlyVisitors} <= ${input.maxVisitors}`,
        );
      }

      // Determine which fields to select based on viewType
      let selectFields: any = {
        id: religiousPlace.id,
        name: religiousPlace.name,
        slug: religiousPlace.slug,
        type: religiousPlace.type,
        wardNumber: religiousPlace.wardNumber,
        location: religiousPlace.location,
        isVerified: religiousPlace.isVerified,
      };

      // Add fields based on view type
      if (viewType === "table" || viewType === "grid") {
        selectFields = {
          ...selectFields,
          description: religiousPlace.description,
          address: religiousPlace.address,
          architecturalStyle: religiousPlace.architecturalStyle,
          yearEstablished: religiousPlace.yearEstablished,
          mainDeity: religiousPlace.mainDeity,
          religiousTradition: religiousPlace.religiousTradition,
          religiousSignificance: religiousPlace.religiousSignificance,
          isHeritageSite: religiousPlace.isHeritageSite,
          managedBy: religiousPlace.managedBy,
          preservationStatus: religiousPlace.preservationStatus,
          createdAt: religiousPlace.createdAt,
          updatedAt: religiousPlace.updatedAt,
        };
      }

      // Add advanced fields for table view
      if (viewType === "table") {
        selectFields.lastRestorationYear = religiousPlace.lastRestorationYear;
        selectFields.totalBuildingCount = religiousPlace.totalBuildingCount;
        selectFields.estimatedYearlyVisitors =
          religiousPlace.estimatedYearlyVisitors;
        selectFields.hasMainHall = religiousPlace.hasMainHall;
      }

      // Add geometry fields based on view type
      if (viewType === "map") {
        selectFields.complexBoundary = sql`CASE WHEN ${religiousPlace.complexBoundary} IS NOT NULL THEN ST_AsGeoJSON(${religiousPlace.complexBoundary}) ELSE NULL END`;
        selectFields.locationPoint = sql`CASE WHEN ${religiousPlace.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${religiousPlace.locationPoint}) ELSE NULL END`;
      } else {
        // For non-map views, include location point for display purposes
        selectFields.locationPoint = sql`CASE WHEN ${religiousPlace.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${religiousPlace.locationPoint}) ELSE NULL END`;
      }

      // Get total count for pagination
      const totalCount = await ctx.db
        .select({ count: sql`count(*)` })
        .from(religiousPlace)
        .where(conditions.length ? and(...conditions) : undefined)
        .then((result) => Number(result[0].count));

      // Query religious places with selected fields
      const places = await ctx.db
        .select({ placeItem: selectFields })
        .from(religiousPlace)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(
          sortOrder === "asc"
            ? sql`${sql.identifier(sortBy)} ASC`
            : sql`${sql.identifier(sortBy)} DESC`,
        )
        .limit(pageSize)
        .offset(offset);

      // Process results for GeoJSON if needed
      const processedPlaces = places.map((p) => {
        const result: any = { ...p.placeItem };

        if (p.placeItem.locationPoint) {
          result.locationPoint = JSON.parse(
            p.placeItem.locationPoint as string,
          );
        }

        if (viewType === "map" && p.placeItem.complexBoundary) {
          result.complexBoundary = JSON.parse(
            p.placeItem.complexBoundary as string,
          );
        }

        return result;
      });

      // Get primary media for each religious place
      const placeIds = processedPlaces.map((p) => p.id);

      // Only query media if we have places
      let placesWithMedia = processedPlaces;

      if (placeIds.length > 0) {
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
              inArray(entityMedia.entityId, placeIds),
              eq(entityMedia.entityType, "RELIGIOUS_PLACE" as any),
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

        // Combine places with their primary media
        placesWithMedia = processedPlaces.map((p) => ({
          ...p,
          primaryMedia: primaryMediaMap.get(p.id) || null,
        }));
      }

      return {
        items: placesWithMedia,
        page,
        pageSize,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNextPage: page * pageSize < totalCount,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      console.error("Error fetching religious places:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve religious places",
      });
    }
  });
