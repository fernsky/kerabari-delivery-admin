import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { road } from "@/server/db/schema/profile/institutions/transportation/road";
import { generateSlug } from "@/server/utils/slug-helpers";
import { eq, sql, and, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Define enums for road input validation
const roadTypeEnum = [
  "HIGHWAY",
  "URBAN",
  "RURAL",
  "GRAVEL",
  "EARTHEN",
  "AGRICULTURAL",
  "ALLEY",
  "BRIDGE",
];
const roadConditionEnum = [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "VERY_POOR",
  "UNDER_CONSTRUCTION",
];
const drainageSystemEnum = ["PROPER", "PARTIAL", "NONE", "BLOCKED"];

// Define schema for geometry input
const pointGeometrySchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
});

const lineStringGeometrySchema = z.object({
  type: z.literal("LineString"),
  coordinates: z.array(z.tuple([z.number(), z.number()])), // Array of [longitude, latitude] pairs
});

// Define schema for road update
const roadSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Road name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(roadTypeEnum as [string, ...string[]]),
  widthInMeters: z.number().int().positive().optional(),
  condition: z.enum(roadConditionEnum as [string, ...string[]]).optional(),
  drainageSystem: z
    .enum(drainageSystemEnum as [string, ...string[]])
    .optional(),

  // Additional details
  maintenanceYear: z.string().optional(),
  length: z.number().int().positive().optional(),
  startPoint: z.string().optional(),
  endPoint: z.string().optional(),
  hasStreetLights: z.boolean().optional(),
  hasDivider: z.boolean().optional(),
  hasPedestrian: z.boolean().optional(),
  hasBicycleLane: z.boolean().optional(),

  // Geometry fields
  roadPath: lineStringGeometrySchema.optional(),
  representativePoint: pointGeometrySchema.optional(),

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
});

// Update a road
export const updateRoad = protectedProcedure
  .input(roadSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update roads",
      });
    }

    try {
      // Check if road exists
      const existing = await ctx.db
        .select({ id: road.id, slug: road.slug })
        .from(road)
        .where(eq(road.id, input.id));

      if (existing.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Road not found",
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
            .select({ id: road.id })
            .from(road)
            .where(
              and(
                eq(road.slug, slug),
                ne(road.id, input.id), // Don't match our own record
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

      // Process road path (linestring) geometry if provided
      let roadPathValue = undefined;
      if (input.roadPath) {
        const pathGeoJson = JSON.stringify(input.roadPath);
        try {
          JSON.parse(pathGeoJson); // Validate JSON
          roadPathValue = sql`ST_GeomFromGeoJSON(${pathGeoJson})`;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid road path geometry GeoJSON",
          });
        }
      }

      // Process representative point geometry if provided
      let pointGeometryValue = undefined;
      if (input.representativePoint) {
        const pointGeoJson = JSON.stringify(input.representativePoint);
        try {
          JSON.parse(pointGeoJson); // Validate JSON
          pointGeometryValue = sql`ST_GeomFromGeoJSON(${pointGeoJson})`;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid point geometry GeoJSON",
          });
        }
      }

      const updateData: any = {
        name: input.name,
        slug,
        description: input.description,
        type: input.type as any,
        widthInMeters: input.widthInMeters,
        condition: input.condition as any,
        drainageSystem: input.drainageSystem as any,

        // Additional details
        maintenanceYear: input.maintenanceYear,
        length: input.length,
        startPoint: input.startPoint,
        endPoint: input.endPoint,
        hasStreetLights: input.hasStreetLights,
        hasDivider: input.hasDivider,
        hasPedestrian: input.hasPedestrian,
        hasBicycleLane: input.hasBicycleLane,

        // SEO fields
        metaTitle: input.metaTitle || input.name,
        metaDescription: input.metaDescription,
        keywords: input.keywords,

        // Metadata
        updatedAt: new Date(),
        updatedBy: ctx.user.id,
      };

      // Only add geometry fields if they were provided
      if (roadPathValue !== undefined) {
        updateData.roadPath = roadPathValue;
      }

      if (pointGeometryValue !== undefined) {
        updateData.representativePoint = pointGeometryValue;
      }

      // Update the road
      const result = await ctx.db
        .update(road)
        .set(updateData)
        .where(eq(road.id, input.id))
        .returning({
          id: road.id,
          slug: road.slug,
        });

      return {
        success: true,
        slug: result[0]?.slug,
      };
    } catch (error) {
      console.error("Error updating road:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update road",
      });
    }
  });
