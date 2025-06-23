import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { grazingArea } from "@/server/db/schema/profile/institutions/agricultural/grazingAreas";
import { generateSlug } from "@/server/utils/slug-helpers";
import { eq, sql, and, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Define enums for grazing area input validation
const grazingAreaTypeEnum = [
  "OPEN_RANGE",
  "ALPINE_MEADOW",
  "COMMUNITY_PASTURE",
  "FOREST_UNDERSTORY",
  "FLOODPLAIN",
  "SEASONAL_PASTURE",
  "DRY_SEASON_RESERVE",
  "ROTATIONAL_PADDOCK",
  "MIXED",
  "OTHER",
];

const terrainTypeEnum = [
  "FLAT",
  "ROLLING",
  "HILLY",
  "MOUNTAINOUS",
  "VALLEY",
  "RIVERINE",
  "MIXED",
];

const accessibilityEnum = [
  "EASILY_ACCESSIBLE",
  "MODERATELY_ACCESSIBLE",
  "DIFFICULT_ACCESS",
  "SEASONAL_ACCESS",
  "REMOTE",
];

const groundCoverEnum = [
  "PRIMARILY_GRASSES",
  "SHRUB_DOMINANT",
  "MIXED_VEGETATION",
  "FORBS_DOMINANT",
  "TREE_SCATTERED",
  "DEGRADED",
];

const utilizationLevelEnum = [
  "UNDERUTILIZED",
  "OPTIMAL_USE",
  "OVERUTILIZED",
  "SEVERELY_DEGRADED",
  "PROTECTED",
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

// Define schema for grazing area update
const grazingAreaSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Grazing area name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(grazingAreaTypeEnum as [string, ...string[]]),

  // Location details
  wardNumber: z.number().int().positive().optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical details
  areaInHectares: z.number().positive().optional(),
  elevationInMeters: z.number().int().optional(),
  terrain: z.enum(terrainTypeEnum as [string, ...string[]]).optional(),
  groundCover: z.enum(groundCoverEnum as [string, ...string[]]).optional(),
  accessibility: z.enum(accessibilityEnum as [string, ...string[]]).optional(),

  // Grazing specific details
  livestockCapacity: z.number().int().positive().optional(),
  primaryLivestockType: z.string().optional(),
  grazingSeasons: z.string().optional(),
  grazingDuration: z.string().optional(),
  rotationalSystem: z.boolean().optional(),
  restPeriod: z.string().optional(),
  utilizationLevel: z
    .enum(utilizationLevelEnum as [string, ...string[]])
    .optional(),

  // Water resources
  hasWaterSource: z.boolean().optional(),
  waterSourceTypes: z.string().optional(),
  waterAvailability: z.string().optional(),
  waterSourceDistance: z.number().int().positive().optional(),

  // Management details
  isGovernmentOwned: z.boolean().optional(),
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  caretakerName: z.string().optional(),
  caretakerContact: z.string().optional(),
  permitRequired: z.boolean().optional(),
  permitInfo: z.string().optional(),

  // Infrastructure
  hasFencing: z.boolean().optional(),
  hasWindbreaks: z.boolean().optional(),
  hasShelters: z.boolean().optional(),
  infrastructureNotes: z.string().optional(),

  // Health and sustainability
  invasiveSpecies: z.string().optional(),
  erosionIssues: z.boolean().optional(),
  conservationStatus: z.string().optional(),
  restorationEfforts: z.string().optional(),

  // Cultural significance
  traditionalUse: z.string().optional(),
  culturalSignificance: z.string().optional(),

  // Geometry fields
  locationPoint: pointGeometrySchema.optional(),
  areaPolygon: polygonGeometrySchema.optional(),

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
});

// Update a grazing area
export const updateGrazingArea = protectedProcedure
  .input(grazingAreaSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update grazing areas",
      });
    }

    try {
      // Check if grazing area exists
      const existing = await ctx.db
        .select({ id: grazingArea.id, slug: grazingArea.slug })
        .from(grazingArea)
        .where(eq(grazingArea.id, input.id));

      if (existing.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Grazing area not found",
        });
      }

      // Handle slug
      let slug = input.slug || existing[0].slug;

      // If name changed but slug wasn't explicitly provided, regenerate slug with romanization
      if (!input.slug && input.name) {
        const baseSlug = generateSlug(input.name);

        // Check if new slug would conflict with existing ones (except our own)
        let slugExists = true;
        let slugCounter = 1;
        slug = baseSlug;

        while (slugExists) {
          const existingSlug = await ctx.db
            .select({ id: grazingArea.id })
            .from(grazingArea)
            .where(
              and(
                eq(grazingArea.slug, slug),
                ne(grazingArea.id, input.id), // Don't match our own record
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

      const updateData: any = {
        name: input.name,
        slug,
        description: input.description,
        type: input.type as any,

        // Location details
        wardNumber: input.wardNumber,
        location: input.location,
        address: input.address,

        // Physical details
        areaInHectares: input.areaInHectares,
        elevationInMeters: input.elevationInMeters,
        terrain: input.terrain as any,
        groundCover: input.groundCover as any,
        accessibility: input.accessibility as any,

        // Grazing specific details
        livestockCapacity: input.livestockCapacity,
        primaryLivestockType: input.primaryLivestockType,
        grazingSeasons: input.grazingSeasons,
        grazingDuration: input.grazingDuration,
        rotationalSystem: input.rotationalSystem,
        restPeriod: input.restPeriod,
        utilizationLevel: input.utilizationLevel as any,

        // Water resources
        hasWaterSource: input.hasWaterSource,
        waterSourceTypes: input.waterSourceTypes,
        waterAvailability: input.waterAvailability,
        waterSourceDistance: input.waterSourceDistance,

        // Management details
        isGovernmentOwned: input.isGovernmentOwned,
        ownerName: input.ownerName,
        ownerContact: input.ownerContact,
        caretakerName: input.caretakerName,
        caretakerContact: input.caretakerContact,
        permitRequired: input.permitRequired,
        permitInfo: input.permitInfo,

        // Infrastructure
        hasFencing: input.hasFencing,
        hasWindbreaks: input.hasWindbreaks,
        hasShelters: input.hasShelters,
        infrastructureNotes: input.infrastructureNotes,

        // Health and sustainability
        invasiveSpecies: input.invasiveSpecies,
        erosionIssues: input.erosionIssues,
        conservationStatus: input.conservationStatus,
        restorationEfforts: input.restorationEfforts,

        // Cultural significance
        traditionalUse: input.traditionalUse,
        culturalSignificance: input.culturalSignificance,

        // SEO fields
        metaTitle: input.metaTitle || input.name,
        metaDescription: input.metaDescription,
        keywords: input.keywords,

        // Metadata
        updatedAt: new Date(),
        updatedBy: ctx.user.id,
      };

      // Only add geometry fields if they were provided
      if (locationPointValue !== undefined) {
        updateData.locationPoint = locationPointValue;
      }

      if (areaPolygonValue !== undefined) {
        updateData.areaPolygon = areaPolygonValue;
      }

      // Update the grazing area
      const result = await ctx.db
        .update(grazingArea)
        .set(updateData)
        .where(eq(grazingArea.id, input.id))
        .returning({
          id: grazingArea.id,
          slug: grazingArea.slug,
        });

      return {
        success: true,
        slug: result[0].slug,
      };
    } catch (error) {
      console.error("Error updating grazing area:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update grazing area",
      });
    }
  });
