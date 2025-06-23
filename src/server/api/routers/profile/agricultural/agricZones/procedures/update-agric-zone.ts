import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { agricZone } from "@/server/db/schema/profile/institutions/agricultural/agricZones";
import { generateSlug } from "@/server/utils/slug-helpers";
import { eq, sql, and, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Define enums for agricultural zone input validation
const agricZoneTypeEnum = [
  "PULSES",
  "OILSEEDS",
  "COMMERCIAL_FLOWER",
  "SEASONAL_CROPS",
  "SUPER_ZONE",
  "POCKET_AREA",
  "MIXED",
  "OTHER",
];

const soilQualityEnum = ["EXCELLENT", "GOOD", "AVERAGE", "POOR", "VERY_POOR"];

const irrigationSystemEnum = [
  "CANAL",
  "SPRINKLER",
  "DRIP",
  "GROUNDWATER",
  "RAINWATER_HARVESTING",
  "SEASONAL_RIVER",
  "NONE",
  "MIXED",
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

// Define schema for agricultural zone update
const agricZoneSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Zone name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(agricZoneTypeEnum as [string, ...string[]]),

  // Location details
  wardNumber: z.number().int().positive().optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical details
  areaInHectares: z.number().int().positive().optional(),
  soilQuality: z.enum(soilQualityEnum as [string, ...string[]]).optional(),
  irrigationSystem: z
    .enum(irrigationSystemEnum as [string, ...string[]])
    .optional(),

  // Agricultural details
  majorCrops: z.string().optional(),
  seasonalAvailability: z.string().optional(),
  annualProduction: z.number().int().positive().optional(),
  productionYear: z.string().optional(),

  // Management details
  isGovernmentOwned: z.boolean().optional(),
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  caretakerName: z.string().optional(),
  caretakerContact: z.string().optional(),

  // Additional facilities
  hasStorage: z.boolean().optional(),
  hasProcessingUnit: z.boolean().optional(),
  hasFarmersCooperative: z.boolean().optional(),

  // Geometry fields
  locationPoint: pointGeometrySchema.optional(),
  areaPolygon: polygonGeometrySchema.optional(),

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
});

// Update an agricultural zone
export const updateAgricZone = protectedProcedure
  .input(agricZoneSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update agricultural zones",
      });
    }

    try {
      // Check if agricultural zone exists
      const existing = await ctx.db
        .select({ id: agricZone.id, slug: agricZone.slug })
        .from(agricZone)
        .where(eq(agricZone.id, input.id));

      if (existing.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agricultural zone not found",
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
            .select({ id: agricZone.id })
            .from(agricZone)
            .where(
              and(
                eq(agricZone.slug, slug),
                ne(agricZone.id, input.id), // Don't match our own record
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
        soilQuality: input.soilQuality as any,
        irrigationSystem: input.irrigationSystem as any,

        // Agricultural details
        majorCrops: input.majorCrops,
        seasonalAvailability: input.seasonalAvailability,
        annualProduction: input.annualProduction,
        productionYear: input.productionYear,

        // Management details
        isGovernmentOwned: input.isGovernmentOwned,
        ownerName: input.ownerName,
        ownerContact: input.ownerContact,
        caretakerName: input.caretakerName,
        caretakerContact: input.caretakerContact,

        // Additional facilities
        hasStorage: input.hasStorage,
        hasProcessingUnit: input.hasProcessingUnit,
        hasFarmersCooperative: input.hasFarmersCooperative,

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

      // Update the agricultural zone
      const result = await ctx.db
        .update(agricZone)
        .set(updateData)
        .where(eq(agricZone.id, input.id))
        .returning({
          id: agricZone.id,
          slug: agricZone.slug,
        });

      return {
        success: true,
        slug: result[0].slug,
      };
    } catch (error) {
      console.error("Error updating agricultural zone:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update agricultural zone",
      });
    }
  });
