import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { location } from "@/server/db/schema/profile/institutions/local-areas/location";
import { generateSlug } from "@/server/utils/slug-helpers";
import { sql, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

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

// Define schema for location creation
const locationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(), // Optional slug - will generate if not provided
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

// Create a new location
export const createLocation = protectedProcedure
  .input(locationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create locations",
      });
    }

    const id = input.id || uuidv4();
    const now = new Date();

    // Generate slug from name if not provided, now with romanization support
    const baseSlug = input.slug || generateSlug(input.name);

    try {
      // Check if slug already exists
      let slug = baseSlug;
      let slugExists = true;
      let slugCounter = 1;

      while (slugExists) {
        const existingSlug = await ctx.db
          .select({ id: location.id })
          .from(location)
          .where(eq(location.slug, slug))
          .limit(1);

        if (existingSlug.length === 0) {
          slugExists = false;
        } else {
          slug = `${baseSlug}-${slugCounter}`;
          slugCounter++;
        }
      }

      // Process point geometry if provided
      let pointGeometryValue = null;
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
      let polygonGeometryValue = null;
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

      // Use a transaction for data consistency
      return await ctx.db.transaction(async (tx) => {
        // Insert the location
        const insertedLocation = await tx
          .insert(location)
          .values({
            id,
            name: input.name,
            slug,
            description: input.description,
            type: input.type as any,
            isNewSettlement: input.isNewSettlement || false,
            isTownPlanned: input.isTownPlanned || false,
            pointGeometry: pointGeometryValue
              ? sql`${pointGeometryValue}`
              : null,
            polygonGeometry: polygonGeometryValue
              ? sql`${polygonGeometryValue}`
              : null,
            parentId: input.parentId,
            // SEO fields
            metaTitle: input.metaTitle || input.name,
            metaDescription:
              input.metaDescription ||
              input.description?.substring(0, 160) ||
              `Information about ${input.name}`,
            keywords:
              input.keywords ||
              `${input.name}, ${input.type.toLowerCase()}, local area`,
            createdAt: now,
            updatedAt: now,
            createdBy: ctx.user.id,
            updatedBy: ctx.user.id,
          })
          .returning({
            id: location.id,
          });

        return { id, slug, success: true };
      });
    } catch (error) {
      console.error("Error creating location:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create location",
        cause: error,
      });
    }
  });
