import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { road } from "@/server/db/schema/profile/institutions/transportation/road";
import { generateSlug } from "@/server/utils/slug-helpers";
import { sql, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

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

// Define schema for road creation
const roadSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Road name is required"),
  slug: z.string().optional(), // Optional slug - will generate if not provided
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

// Create a new road
export const createRoad = protectedProcedure
  .input(roadSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create roads",
      });
    }

    const id = input.id || uuidv4();
    const now = new Date();

    // Generate slug from name if not provided, with romanization support
    const baseSlug = input.slug || generateSlug(input.name);

    try {
      // Check if slug already exists
      let slug = baseSlug;
      let slugExists = true;
      let slugCounter = 1;

      while (slugExists) {
        const existingSlug = await ctx.db
          .select({ id: road.id })
          .from(road)
          .where(eq(road.slug, slug))
          .limit(1);

        if (existingSlug.length === 0) {
          slugExists = false;
        } else {
          slug = `${baseSlug}-${slugCounter}`;
          slugCounter++;
        }
      }

      // Process road path (linestring) geometry if provided
      let roadPathValue = null;
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
      let pointGeometryValue = null;
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

      // Use a transaction for data consistency
      return await ctx.db.transaction(async (tx) => {
        // Insert the road
        const insertedRoad = await tx
          .insert(road)
          .values({
            id,
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
            hasStreetLights: input.hasStreetLights || false,
            hasDivider: input.hasDivider || false,
            hasPedestrian: input.hasPedestrian || false,
            hasBicycleLane: input.hasBicycleLane || false,

            // Geometry fields with SQL expression values
            roadPath: roadPathValue ? sql`${roadPathValue}` : null,
            representativePoint: pointGeometryValue
              ? sql`${pointGeometryValue}`
              : null,

            // SEO fields
            metaTitle: input.metaTitle || input.name,
            metaDescription:
              input.metaDescription ||
              input.description?.substring(0, 160) ||
              `Information about ${input.name}`,
            keywords:
              input.keywords ||
              `${input.name}, ${input.type.toLowerCase()}, road, transportation`,

            // Metadata
            isActive: true,
            createdAt: now,
            updatedAt: now,
            createdBy: ctx.user.id,
            updatedBy: ctx.user.id,
          })
          .returning({
            id: road.id,
          });

        return { id, slug, success: true };
      });
    } catch (error) {
      console.error("Error creating road:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create road",
        cause: error,
      });
    }
  });
