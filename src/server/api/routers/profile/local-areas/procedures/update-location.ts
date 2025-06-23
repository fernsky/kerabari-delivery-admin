import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { location } from "@/server/db/schema/profile/institutions/local-areas/location";
import { generateSlug } from "@/server/utils/slug-helpers";
import { eq, sql, and, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Define enum for location types
const locationEnum = ["VILLAGE", "SETTLEMENT", "TOLE", "WARD", "SQUATTER_AREA"];

// Define schema for geometry input
const pointGeometrySchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
});

const polygonGeometrySchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
});

// Define schema for location update
const locationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(locationEnum as [string, ...string[]]),
  isNewSettlement: z.boolean().optional(),
  isTownPlanned: z.boolean().optional(),
  pointGeometry: pointGeometrySchema.optional(),
  polygonGeometry: polygonGeometrySchema.optional(),
  parentId: z.string().optional(),
  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
});

// Update a location
export const updateLocation = protectedProcedure
  .input(locationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update locations",
      });
    }

    try {
      // Check if location exists
      const existing = await ctx.db
        .select({ id: location.id, slug: location.slug })
        .from(location)
        .where(eq(location.id, input.id));

      if (existing.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Location not found",
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
            .select({ id: location.id })
            .from(location)
            .where(
              and(
                eq(location.slug, slug),
                ne(location.id, input.id), // Don't match our own record
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

      // Process point geometry if provided
      let pointGeometryValue = undefined;
      if (input.pointGeometry) {
        const pointGeoJson = JSON.stringify(input.pointGeometry);
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

      // Process polygon geometry if provided
      let polygonGeometryValue = undefined;
      if (input.polygonGeometry) {
        const polygonGeoJson = JSON.stringify(input.polygonGeometry);
        try {
          JSON.parse(polygonGeoJson); // Validate JSON
          polygonGeometryValue = sql`ST_GeomFromGeoJSON(${polygonGeoJson})`;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid polygon geometry GeoJSON",
          });
        }
      }

      const updateData: any = {
        name: input.name,
        slug,
        description: input.description,
        type: input.type as any,
        isNewSettlement: input.isNewSettlement,
        isTownPlanned: input.isTownPlanned,
        parentId: input.parentId,
        updatedBy: ctx.user.id,
        updatedAt: new Date(),
        // SEO fields
        metaTitle: input.metaTitle || input.name,
        metaDescription: input.metaDescription,
        keywords: input.keywords,
      };

      // Only add geometry fields if they were provided
      if (pointGeometryValue !== undefined) {
        updateData.pointGeometry = pointGeometryValue;
      }

      if (polygonGeometryValue !== undefined) {
        updateData.polygonGeometry = polygonGeometryValue;
      }

      // Update the location
      const result = await ctx.db
        .update(location)
        .set(updateData)
        .where(eq(location.id, input.id))
        .returning({
          id: location.id,
          slug: location.slug,
        });

      return {
        success: true,
        slug: result[0].slug,
      };
    } catch (error) {
      console.error("Error updating location:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update location",
      });
    }
  });
