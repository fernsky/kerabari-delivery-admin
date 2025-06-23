import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { parkingFacility } from "@/server/db/schema/profile/institutions/transportation/parkingFacility";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { and, eq, like, sql, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Define enum for parking facility types
const parkingFacilityTypeEnum = [
  "BUS_PARK",
  "TAXI_PARK",
  "TEMPO_PARK",
  "AUTO_RICKSHAW_PARK",
  "CAR_PARK",
  "BIKE_PARK",
  "MULTIPURPOSE_PARK",
  "OTHER",
];

// Define enum for parking conditions
const parkingConditionEnum = [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "VERY_POOR",
  "UNDER_CONSTRUCTION",
];

// Filter schema for parking facility queries with pagination
const parkingFacilityFilterSchema = z.object({
  type: z.enum(parkingFacilityTypeEnum as [string, ...string[]]).optional(),
  condition: z.enum(parkingConditionEnum as [string, ...string[]]).optional(),
  wardNumber: z.number().int().positive().optional(),
  searchTerm: z.string().optional(),
  hasRoof: z.boolean().optional(),
  hasToilet: z.boolean().optional(),
  hasWaitingArea: z.boolean().optional(),
  hasTicketCounter: z.boolean().optional(),
  // Pagination
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(12),
  // View type - determines how much data to fetch
  viewType: z.enum(["table", "grid", "map"]).default("table"),
  // Sorting
  sortBy: z.string().optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Get all parking facilities with optional filtering and pagination
export const getAllParkingFacilities = publicProcedure
  .input(parkingFacilityFilterSchema.optional())
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
        conditions.push(eq(parkingFacility.type, input.type as any));
      }

      if (input?.condition && input.condition.trim() !== "") {
        conditions.push(eq(parkingFacility.condition, input.condition as any));
      }

      if (input?.wardNumber) {
        conditions.push(eq(parkingFacility.wardNumber, input.wardNumber));
      }

      if (input?.searchTerm && input.searchTerm.trim() !== "") {
        conditions.push(
          or(
            like(parkingFacility.name, `%${input.searchTerm}%`),
            like(parkingFacility.description || "", `%${input.searchTerm}%`),
            like(parkingFacility.location || "", `%${input.searchTerm}%`),
            like(parkingFacility.address || "", `%${input.searchTerm}%`),
          ),
        );
      }

      if (input?.hasRoof !== undefined) {
        conditions.push(eq(parkingFacility.hasRoof, input.hasRoof));
      }

      if (input?.hasToilet !== undefined) {
        conditions.push(eq(parkingFacility.hasToilet, input.hasToilet));
      }

      if (input?.hasWaitingArea !== undefined) {
        conditions.push(
          eq(parkingFacility.hasWaitingArea, input.hasWaitingArea),
        );
      }

      if (input?.hasTicketCounter !== undefined) {
        conditions.push(
          eq(parkingFacility.hasTicketCounter, input.hasTicketCounter),
        );
      }

      // Determine which fields to select based on viewType
      let selectFields: any = {
        id: parkingFacility.id,
        name: parkingFacility.name,
        slug: parkingFacility.slug,
        type: parkingFacility.type,
        wardNumber: parkingFacility.wardNumber,
        location: parkingFacility.location,
        condition: parkingFacility.condition,
      };

      // Add fields based on view type
      if (viewType === "table" || viewType === "grid") {
        selectFields = {
          ...selectFields,
          description: parkingFacility.description,
          address: parkingFacility.address,
          areaInSquareMeters: parkingFacility.areaInSquareMeters,
          vehicleCapacity: parkingFacility.vehicleCapacity,
          hasRoof: parkingFacility.hasRoof,
          hasToilet: parkingFacility.hasToilet,
          hasWaitingArea: parkingFacility.hasWaitingArea,
          hasTicketCounter: parkingFacility.hasTicketCounter,
          hasFoodStalls: parkingFacility.hasFoodStalls,
          hasSecurityPersonnel: parkingFacility.hasSecurityPersonnel,
          hasCCTV: parkingFacility.hasCCTV,
          operatingHours: parkingFacility.operatingHours,
          operator: parkingFacility.operator,
          drainageSystem: parkingFacility.drainageSystem,
          establishedYear: parkingFacility.establishedYear,
          createdAt: parkingFacility.createdAt,
          updatedAt: parkingFacility.updatedAt,
        };
      }

      // Add geometry fields based on view type
      if (viewType === "map") {
        selectFields.areaPolygon = sql`CASE WHEN ${parkingFacility.areaPolygon} IS NOT NULL THEN ST_AsGeoJSON(${parkingFacility.areaPolygon}) ELSE NULL END`;
        selectFields.locationPoint = sql`CASE WHEN ${parkingFacility.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${parkingFacility.locationPoint}) ELSE NULL END`;
      } else {
        // For non-map views, include location point for display purposes
        selectFields.locationPoint = sql`CASE WHEN ${parkingFacility.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${parkingFacility.locationPoint}) ELSE NULL END`;
      }

      // Get total count for pagination
      const totalCount = await ctx.db
        .select({ count: sql`count(*)` })
        .from(parkingFacility)
        .where(conditions.length ? and(...conditions) : undefined)
        .then((result) => Number(result[0].count));

      // Query parking facilities with selected fields
      const facilities = await ctx.db
        .select({ facility: selectFields })
        .from(parkingFacility)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(
          sortOrder === "asc"
            ? sql`${sql.identifier(sortBy)} ASC`
            : sql`${sql.identifier(sortBy)} DESC`,
        )
        .limit(pageSize)
        .offset(offset);

      // Process results for GeoJSON if needed
      const processedFacilities = facilities.map((f) => {
        const result: any = { ...f.facility };

        if (f.facility.locationPoint) {
          result.locationPoint = JSON.parse(f.facility.locationPoint as string);
        }

        if (viewType === "map" && f.facility.areaPolygon) {
          result.areaPolygon = JSON.parse(f.facility.areaPolygon as string);
        }

        return result;
      });

      // Get primary media for each parking facility
      const facilityIds = processedFacilities.map((f) => f.id);

      // Only query media if we have facilities
      let facilitiesWithMedia = processedFacilities;

      if (facilityIds.length > 0) {
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
              inArray(entityMedia.entityId, facilityIds),
              eq(entityMedia.entityType, "PARKING_FACILITY"),
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

        // Combine facilities with their primary media
        facilitiesWithMedia = processedFacilities.map((f) => ({
          ...f,
          primaryMedia: primaryMediaMap.get(f.id) || null,
        }));
      }

      return {
        items: facilitiesWithMedia,
        page,
        pageSize,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNextPage: page * pageSize < totalCount,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      console.error("Error fetching parking facilities:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve parking facilities",
      });
    }
  });
