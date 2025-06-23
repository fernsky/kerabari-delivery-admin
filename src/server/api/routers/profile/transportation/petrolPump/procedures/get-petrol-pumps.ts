import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { petrolPump } from "@/server/db/schema/profile/institutions/transportation/petrolPump";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { and, eq, like, sql, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Define enum for petrol pump types
const petrolPumpTypeEnum = [
  "PETROL",
  "DIESEL",
  "PETROL_DIESEL",
  "CNG",
  "EV_CHARGING",
  "MULTIPURPOSE",
];

// Filter schema for petrol pump queries with pagination
const petrolPumpFilterSchema = z.object({
  type: z.enum(petrolPumpTypeEnum as [string, ...string[]]).optional(),
  wardNumber: z.number().int().positive().optional(),
  locality: z.string().optional(),
  searchTerm: z.string().optional(),
  hasEVCharging: z.boolean().optional(),
  hasCarWash: z.boolean().optional(),
  hasConvenienceStore: z.boolean().optional(),

  // Pagination
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(12),

  // View type - determines how much data to fetch
  viewType: z.enum(["table", "grid", "map"]).default("table"),

  // Sorting
  sortBy: z.string().optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Get all petrol pumps with optional filtering and pagination
export const getAllPetrolPumps = publicProcedure
  .input(petrolPumpFilterSchema.optional())
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
        conditions.push(eq(petrolPump.type, input.type as any));
      }

      if (input?.wardNumber) {
        conditions.push(eq(petrolPump.wardNumber, input.wardNumber));
      }

      if (input?.locality && input.locality.trim() !== "") {
        conditions.push(like(petrolPump.locality || "", `%${input.locality}%`));
      }

      if (input?.searchTerm && input.searchTerm.trim() !== "") {
        conditions.push(
          or(
            like(petrolPump.name, `%${input.searchTerm}%`),
            like(petrolPump.description || "", `%${input.searchTerm}%`),
            like(petrolPump.locality || "", `%${input.searchTerm}%`),
            like(petrolPump.address || "", `%${input.searchTerm}%`),
            like(petrolPump.ownerName || "", `%${input.searchTerm}%`),
          ),
        );
      }

      if (input?.hasEVCharging !== undefined) {
        conditions.push(eq(petrolPump.hasEVCharging, input.hasEVCharging));
      }

      if (input?.hasCarWash !== undefined) {
        conditions.push(eq(petrolPump.hasCarWash, input.hasCarWash));
      }

      if (input?.hasConvenienceStore !== undefined) {
        conditions.push(
          eq(petrolPump.hasConvenienceStore, input.hasConvenienceStore),
        );
      }

      // Determine which fields to select based on viewType
      let selectFields: any = {
        id: petrolPump.id,
        name: petrolPump.name,
        slug: petrolPump.slug,
        type: petrolPump.type,
        wardNumber: petrolPump.wardNumber,
        locality: petrolPump.locality,
      };

      // Add fields based on view type
      if (viewType === "table" || viewType === "grid") {
        selectFields = {
          ...selectFields,
          description: petrolPump.description,
          address: petrolPump.address,
          ownerName: petrolPump.ownerName,
          ownerContact: petrolPump.ownerContact,
          hasEVCharging: petrolPump.hasEVCharging,
          hasCarWash: petrolPump.hasCarWash,
          hasConvenienceStore: petrolPump.hasConvenienceStore,
          hasRestroom: petrolPump.hasRestroom,
          hasAirFilling: petrolPump.hasAirFilling,
          operatingHours: petrolPump.operatingHours,
          createdAt: petrolPump.createdAt,
          updatedAt: petrolPump.updatedAt,
        };
      }

      // Add geometry fields for location display
      selectFields.locationPoint = sql`CASE WHEN ${petrolPump.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${petrolPump.locationPoint}) ELSE NULL END`;

      // Get total count for pagination
      const totalCount = await ctx.db
        .select({ count: sql`count(*)` })
        .from(petrolPump)
        .where(conditions.length ? and(...conditions) : undefined)
        .then((result) => Number(result[0].count));

      // Query petrol pumps with selected fields
      const pumps = await ctx.db
        .select({ pump: selectFields })
        .from(petrolPump)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(
          sortOrder === "asc"
            ? sql`${sql.identifier(sortBy)} ASC`
            : sql`${sql.identifier(sortBy)} DESC`,
        )
        .limit(pageSize)
        .offset(offset);

      // Process results for GeoJSON if needed
      const processedPumps = pumps.map((p) => {
        const result: any = { ...p.pump };

        if (p.pump.locationPoint) {
          result.locationPoint = JSON.parse(p.pump.locationPoint as string);
        }

        return result;
      });

      // Get primary media for each petrol pump
      const pumpIds = processedPumps.map((p) => p.id);

      // Only query media if we have petrol pumps
      let pumpsWithMedia = processedPumps;

      if (pumpIds.length > 0) {
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
              inArray(entityMedia.entityId, pumpIds),
              eq(entityMedia.entityType, "PETROL_PUMP" as any),
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

        // Combine petrol pumps with their primary media
        pumpsWithMedia = processedPumps.map((p) => ({
          ...p,
          primaryMedia: primaryMediaMap.get(p.id) || null,
        }));
      }

      return {
        items: pumpsWithMedia,
        page,
        pageSize,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNextPage: page * pageSize < totalCount,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      console.error("Error fetching petrol pumps:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve petrol pumps",
      });
    }
  });
