import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { historicalSite } from "@/server/db/schema/profile/institutions/cultural/historicalSites";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { and, eq, like, sql, inArray, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Define enums for filtering historical sites
const historicalSiteTypeEnum = [
  "PALACE",
  "FORT",
  "ANCIENT_SETTLEMENT",
  "ARCHAEOLOGICAL_SITE",
  "ANCIENT_MONUMENT",
  "HERITAGE_BUILDING",
  "HISTORIC_HOUSE",
  "MEDIEVAL_TOWN",
  "ROYAL_RESIDENCE",
  "HISTORIC_GARDEN",
  "HISTORIC_INFRASTRUCTURE",
  "BATTLEFIELD",
  "ANCIENT_RUINS",
  "HISTORIC_LANDMARK",
  "OTHER",
];

const historicalArchitecturalStyleEnum = [
  "TRADITIONAL_NEPALI",
  "PAGODA",
  "NEWAR",
  "MALLA",
  "SHAH",
  "RAI",
  "LIMBU",
  "MEDIEVAL",
  "COLONIAL",
  "GOTHIC",
  "MUGHAL",
  "RANA_PALACE",
  "SHIKHARA",
  "STUPA",
  "MIXED",
  "VERNACULAR",
  "OTHER",
];

const historicalSignificanceEnum = [
  "LOCAL",
  "REGIONAL",
  "NATIONAL",
  "INTERNATIONAL",
];

const historicalPreservationStatusEnum = [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "DAMAGED",
  "UNDER_RENOVATION",
  "PARTIAL_RUINS",
  "RUINS",
  "ARCHAEOLOGICAL_REMAINS",
];

const historicalPeriodEnum = [
  "ANCIENT",
  "MEDIEVAL",
  "LICCHAVI",
  "MALLA",
  "SHAH",
  "RANA",
  "PRE_UNIFICATION",
  "COLONIAL",
  "MODERN",
  "CONTEMPORARY",
  "MULTIPLE_PERIODS",
  "OTHER",
];

// Filter schema for historical site queries with pagination
const historicalSiteFilterSchema = z.object({
  type: z.enum(historicalSiteTypeEnum as [string, ...string[]]).optional(),
  architecturalStyle: z
    .enum(historicalArchitecturalStyleEnum as [string, ...string[]])
    .optional(),
  historicalSignificance: z
    .enum(historicalSignificanceEnum as [string, ...string[]])
    .optional(),
  preservationStatus: z
    .enum(historicalPreservationStatusEnum as [string, ...string[]])
    .optional(),
  historicalPeriod: z
    .enum(historicalPeriodEnum as [string, ...string[]])
    .optional(),

  // Location and basic filters
  wardNumber: z.number().int().positive().optional(),
  searchTerm: z.string().optional(),

  // Boolean filters
  isHeritageSite: z.boolean().optional(),
  hasDurbar: z.boolean().optional(),
  hasTemple: z.boolean().optional(),
  hasMainBuilding: z.boolean().optional(),
  hasDefensiveWalls: z.boolean().optional(),
  hasTowers: z.boolean().optional(),
  hasMoat: z.boolean().optional(),
  hasGardens: z.boolean().optional(),
  hasCourtyards: z.boolean().optional(),
  hasUndergroundStructures: z.boolean().optional(),
  hasArtificialWaterBody: z.boolean().optional(),
  hasArchaeologicalArtifacts: z.boolean().optional(),
  hasOnSiteMuseum: z.boolean().optional(),
  hasRegularMaintenance: z.boolean().optional(),
  hasInscriptions: z.boolean().optional(),
  hasHistoricalDocuments: z.boolean().optional(),

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

// Get all historical sites with optional filtering and pagination
export const getAllHistoricalSites = publicProcedure
  .input(historicalSiteFilterSchema.optional())
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
        conditions.push(eq(historicalSite.type, input.type as any));
      }

      if (input?.architecturalStyle && input.architecturalStyle.trim() !== "") {
        conditions.push(
          eq(
            historicalSite.architecturalStyle,
            input.architecturalStyle as any,
          ),
        );
      }

      if (
        input?.historicalSignificance &&
        input.historicalSignificance.trim() !== ""
      ) {
        conditions.push(
          eq(
            historicalSite.historicalSignificance,
            input.historicalSignificance as any,
          ),
        );
      }

      if (input?.preservationStatus && input.preservationStatus.trim() !== "") {
        conditions.push(
          eq(
            historicalSite.preservationStatus,
            input.preservationStatus as any,
          ),
        );
      }

      if (input?.historicalPeriod && input.historicalPeriod.trim() !== "") {
        conditions.push(
          eq(historicalSite.historicalPeriod, input.historicalPeriod as any),
        );
      }

      if (input?.wardNumber) {
        conditions.push(eq(historicalSite.wardNumber, input.wardNumber));
      }

      if (input?.searchTerm && input.searchTerm.trim() !== "") {
        conditions.push(
          or(
            like(historicalSite.name, `%${input.searchTerm}%`),
            like(historicalSite.description || "", `%${input.searchTerm}%`),
            like(historicalSite.location || "", `%${input.searchTerm}%`),
            like(historicalSite.address || "", `%${input.searchTerm}%`),
            like(
              historicalSite.originalFunction || "",
              `%${input.searchTerm}%`,
            ),
            like(historicalSite.notablePeople || "", `%${input.searchTerm}%`),
            like(
              historicalSite.dynastyOrRulership || "",
              `%${input.searchTerm}%`,
            ),
          ),
        );
      }

      // Boolean filters
      if (input?.isHeritageSite !== undefined) {
        conditions.push(
          eq(historicalSite.isHeritageSite, input.isHeritageSite),
        );
      }

      if (input?.hasDurbar !== undefined) {
        conditions.push(eq(historicalSite.hasDurbar, input.hasDurbar));
      }

      if (input?.hasTemple !== undefined) {
        conditions.push(eq(historicalSite.hasTemple, input.hasTemple));
      }

      if (input?.hasMainBuilding !== undefined) {
        conditions.push(
          eq(historicalSite.hasMainBuilding, input.hasMainBuilding),
        );
      }

      if (input?.hasDefensiveWalls !== undefined) {
        conditions.push(
          eq(historicalSite.hasDefensiveWalls, input.hasDefensiveWalls),
        );
      }

      if (input?.hasTowers !== undefined) {
        conditions.push(eq(historicalSite.hasTowers, input.hasTowers));
      }

      if (input?.hasMoat !== undefined) {
        conditions.push(eq(historicalSite.hasMoat, input.hasMoat));
      }

      if (input?.hasGardens !== undefined) {
        conditions.push(eq(historicalSite.hasGardens, input.hasGardens));
      }

      if (input?.hasCourtyards !== undefined) {
        conditions.push(eq(historicalSite.hasCourtyards, input.hasCourtyards));
      }

      if (input?.hasUndergroundStructures !== undefined) {
        conditions.push(
          eq(
            historicalSite.hasUndergroundStructures,
            input.hasUndergroundStructures,
          ),
        );
      }

      if (input?.hasArtificialWaterBody !== undefined) {
        conditions.push(
          eq(
            historicalSite.hasArtificialWaterBody,
            input.hasArtificialWaterBody,
          ),
        );
      }

      if (input?.hasArchaeologicalArtifacts !== undefined) {
        conditions.push(
          eq(
            historicalSite.hasArchaeologicalArtifacts,
            input.hasArchaeologicalArtifacts,
          ),
        );
      }

      if (input?.hasOnSiteMuseum !== undefined) {
        conditions.push(
          eq(historicalSite.hasOnSiteMuseum, input.hasOnSiteMuseum),
        );
      }

      if (input?.hasRegularMaintenance !== undefined) {
        conditions.push(
          eq(historicalSite.hasRegularMaintenance, input.hasRegularMaintenance),
        );
      }

      if (input?.hasInscriptions !== undefined) {
        conditions.push(
          eq(historicalSite.hasInscriptions, input.hasInscriptions),
        );
      }

      if (input?.hasHistoricalDocuments !== undefined) {
        conditions.push(
          eq(
            historicalSite.hasHistoricalDocuments,
            input.hasHistoricalDocuments,
          ),
        );
      }

      if (input?.isVerified !== undefined) {
        conditions.push(eq(historicalSite.isVerified, input.isVerified));
      }

      // Year range filters
      if (input?.minYearEstablished !== undefined) {
        conditions.push(
          sql`${historicalSite.yearEstablished} >= ${input.minYearEstablished}`,
        );
      }

      if (input?.maxYearEstablished !== undefined) {
        conditions.push(
          sql`${historicalSite.yearEstablished} <= ${input.maxYearEstablished}`,
        );
      }

      if (input?.minLastRestorationYear !== undefined) {
        conditions.push(
          sql`${historicalSite.lastRestorationYear} >= ${input.minLastRestorationYear}`,
        );
      }

      if (input?.maxLastRestorationYear !== undefined) {
        conditions.push(
          sql`${historicalSite.lastRestorationYear} <= ${input.maxLastRestorationYear}`,
        );
      }

      // Area range filters
      if (input?.minAreaInSquareMeters !== undefined) {
        conditions.push(
          sql`${historicalSite.areaInSquareMeters} >= ${input.minAreaInSquareMeters}`,
        );
      }

      if (input?.maxAreaInSquareMeters !== undefined) {
        conditions.push(
          sql`${historicalSite.areaInSquareMeters} <= ${input.maxAreaInSquareMeters}`,
        );
      }

      // Visitor filters
      if (input?.minVisitors !== undefined) {
        conditions.push(
          sql`${historicalSite.estimatedYearlyVisitors} >= ${input.minVisitors}`,
        );
      }

      if (input?.maxVisitors !== undefined) {
        conditions.push(
          sql`${historicalSite.estimatedYearlyVisitors} <= ${input.maxVisitors}`,
        );
      }

      // Determine which fields to select based on viewType
      let selectFields: any = {
        id: historicalSite.id,
        name: historicalSite.name,
        slug: historicalSite.slug,
        type: historicalSite.type,
        wardNumber: historicalSite.wardNumber,
        location: historicalSite.location,
        isVerified: historicalSite.isVerified,
      };

      // Add fields based on view type
      if (viewType === "table" || viewType === "grid") {
        selectFields = {
          ...selectFields,
          description: historicalSite.description,
          address: historicalSite.address,
          architecturalStyle: historicalSite.architecturalStyle,
          yearEstablished: historicalSite.yearEstablished,
          historicalSignificance: historicalSite.historicalSignificance,
          originalFunction: historicalSite.originalFunction,
          historicalPeriod: historicalSite.historicalPeriod,
          isHeritageSite: historicalSite.isHeritageSite,
          heritageDesignation: historicalSite.heritageDesignation,
          managedBy: historicalSite.managedBy,
          preservationStatus: historicalSite.preservationStatus,
          createdAt: historicalSite.createdAt,
          updatedAt: historicalSite.updatedAt,
        };
      }

      // Add advanced fields for table view
      if (viewType === "table") {
        selectFields.lastRestorationYear = historicalSite.lastRestorationYear;
        selectFields.totalStructureCount = historicalSite.totalStructureCount;
        selectFields.estimatedYearlyVisitors =
          historicalSite.estimatedYearlyVisitors;
        selectFields.hasMainBuilding = historicalSite.hasMainBuilding;
        selectFields.dynastyOrRulership = historicalSite.dynastyOrRulership;
        selectFields.culturalSignificance = historicalSite.culturalSignificance;
      }

      // Add geometry fields based on view type
      if (viewType === "map") {
        selectFields.siteBoundary = sql`CASE WHEN ${historicalSite.siteBoundary} IS NOT NULL THEN ST_AsGeoJSON(${historicalSite.siteBoundary}) ELSE NULL END`;
        selectFields.locationPoint = sql`CASE WHEN ${historicalSite.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${historicalSite.locationPoint}) ELSE NULL END`;
        selectFields.structureFootprints = sql`CASE WHEN ${historicalSite.structureFootprints} IS NOT NULL THEN ST_AsGeoJSON(${historicalSite.structureFootprints}) ELSE NULL END`;
      } else {
        // For non-map views, include location point for display purposes
        selectFields.locationPoint = sql`CASE WHEN ${historicalSite.locationPoint} IS NOT NULL THEN ST_AsGeoJSON(${historicalSite.locationPoint}) ELSE NULL END`;
      }

      // Get total count for pagination
      const totalCount = await ctx.db
        .select({ count: sql`count(*)` })
        .from(historicalSite)
        .where(conditions.length ? and(...conditions) : undefined)
        .then((result) => Number(result[0].count));

      // Query historical sites with selected fields
      const sites = await ctx.db
        .select({ siteItem: selectFields })
        .from(historicalSite)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(
          sortOrder === "asc"
            ? sql`${sql.identifier(sortBy)} ASC`
            : sql`${sql.identifier(sortBy)} DESC`,
        )
        .limit(pageSize)
        .offset(offset);

      // Process results for GeoJSON if needed
      const processedSites = sites.map((p) => {
        const result: any = { ...p.siteItem };

        if (p.siteItem.locationPoint) {
          result.locationPoint = JSON.parse(p.siteItem.locationPoint as string);
        }

        if (viewType === "map" && p.siteItem.siteBoundary) {
          result.siteBoundary = JSON.parse(p.siteItem.siteBoundary as string);
        }

        if (viewType === "map" && p.siteItem.structureFootprints) {
          result.structureFootprints = JSON.parse(
            p.siteItem.structureFootprints as string,
          );
        }

        return result;
      });

      // Get primary media for each historical site
      const siteIds = processedSites.map((p) => p.id);

      // Only query media if we have sites
      let sitesWithMedia = processedSites;

      if (siteIds.length > 0) {
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
              inArray(entityMedia.entityId, siteIds),
              eq(entityMedia.entityType, "HISTORICAL_SITE" as any),
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

        // Combine sites with their primary media
        sitesWithMedia = processedSites.map((p) => ({
          ...p,
          primaryMedia: primaryMediaMap.get(p.id) || null,
        }));
      }

      return {
        items: sitesWithMedia,
        page,
        pageSize,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        hasNextPage: page * pageSize < totalCount,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      console.error("Error fetching historical sites:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve historical sites",
      });
    }
  });
