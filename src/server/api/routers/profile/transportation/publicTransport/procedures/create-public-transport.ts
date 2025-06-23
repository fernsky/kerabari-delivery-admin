import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { publicTransport } from "@/server/db/schema/profile/institutions/transportation/publicTransport";
import { generateSlug } from "@/server/utils/slug-helpers";
import { sql, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

// Define enums for public transport input validation
const publicTransportTypeEnum = [
  "BUS",
  "MINIBUS",
  "MICROBUS",
  "TEMPO",
  "AUTO_RICKSHAW",
  "TAXI",
  "E_RICKSHAW",
  "OTHER",
];

const vehicleConditionEnum = [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "VERY_POOR",
  "UNDER_MAINTENANCE",
];

const frequencyEnum = [
  "DAILY",
  "WEEKDAYS_ONLY",
  "WEEKENDS_ONLY",
  "OCCASIONAL",
  "SEASONAL",
];

// Define schema for geometry input
const lineStringGeometrySchema = z.object({
  type: z.literal("LineString"),
  coordinates: z.array(z.tuple([z.number(), z.number()])), // Array of [longitude, latitude] pairs
});

const multiPointGeometrySchema = z.object({
  type: z.literal("MultiPoint"),
  coordinates: z.array(z.tuple([z.number(), z.number()])), // Array of [longitude, latitude] pairs for stops
});

// Define schema for public transport creation
const publicTransportSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Transport name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(publicTransportTypeEnum as [string, ...string[]]),

  // Operator details
  operatorName: z.string().optional(),
  operatorContact: z.string().optional(),
  operatorEmail: z.string().email().optional(),
  operatorWebsite: z.string().url().optional(),

  // Route details
  routeName: z.string().optional(),
  startPoint: z.string().optional(),
  endPoint: z.string().optional(),
  viaPoints: z.string().optional(),
  estimatedDuration: z.number().int().positive().optional(),

  // Schedule details
  frequency: z.enum(frequencyEnum as [string, ...string[]]).optional(),
  startTime: z.string().optional(), // Expected format: "HH:MM" (24hr)
  endTime: z.string().optional(), // Expected format: "HH:MM" (24hr)
  intervalMinutes: z.number().int().positive().optional(),

  // Vehicle details
  vehicleCount: z.number().int().positive().optional(),
  seatingCapacity: z.number().int().positive().optional(),
  vehicleCondition: z
    .enum(vehicleConditionEnum as [string, ...string[]])
    .optional(),
  hasAirConditioning: z.boolean().optional(),
  hasWifi: z.boolean().optional(),
  isAccessible: z.boolean().optional(),

  // Fare details
  fareAmount: z.number().int().nonnegative().optional(),
  fareDescription: z.string().optional(),

  // Related entities
  servingRoadIds: z.string().optional(),
  parkingFacilityIds: z.string().optional(),

  // Geometry fields
  routePath: lineStringGeometrySchema.optional(),
  stopPoints: multiPointGeometrySchema.optional(),

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
});

// Create a new public transport
export const createPublicTransport = protectedProcedure
  .input(publicTransportSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create public transport entries",
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
          .select({ id: publicTransport.id })
          .from(publicTransport)
          .where(eq(publicTransport.slug, slug))
          .limit(1);

        if (existingSlug.length === 0) {
          slugExists = false;
        } else {
          slug = `${baseSlug}-${slugCounter}`;
          slugCounter++;
        }
      }

      // Process route path (linestring) geometry if provided
      let routePathValue = null;
      if (input.routePath) {
        const pathGeoJson = JSON.stringify(input.routePath);
        try {
          JSON.parse(pathGeoJson); // Validate JSON
          routePathValue = sql`ST_GeomFromGeoJSON(${pathGeoJson})`;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid route path geometry GeoJSON",
          });
        }
      }

      // Process stop points (multipoint) geometry if provided
      let stopPointsValue = null;
      if (input.stopPoints) {
        const pointsGeoJson = JSON.stringify(input.stopPoints);
        try {
          JSON.parse(pointsGeoJson); // Validate JSON
          stopPointsValue = sql`ST_GeomFromGeoJSON(${pointsGeoJson})`;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid stop points geometry GeoJSON",
          });
        }
      }

      // Parse time strings if provided
      let startTime = null;
      if (input.startTime) {
        startTime = input.startTime;
      }

      let endTime = null;
      if (input.endTime) {
        endTime = input.endTime;
      }

      // Use a transaction for data consistency
      return await ctx.db.transaction(async (tx) => {
        // Insert the public transport
        await tx.insert(publicTransport).values({
          id,
          name: input.name,
          slug,
          description: input.description,
          type: input.type as any,

          // Operator details
          operatorName: input.operatorName,
          operatorContact: input.operatorContact,
          operatorEmail: input.operatorEmail,
          operatorWebsite: input.operatorWebsite,

          // Route details
          routeName: input.routeName,
          startPoint: input.startPoint,
          endPoint: input.endPoint,
          viaPoints: input.viaPoints,
          estimatedDuration: input.estimatedDuration,

          // Schedule details
          frequency: input.frequency as any,
          startTime: startTime as any,
          endTime: endTime as any,
          intervalMinutes: input.intervalMinutes,

          // Vehicle details
          vehicleCount: input.vehicleCount,
          seatingCapacity: input.seatingCapacity,
          vehicleCondition: input.vehicleCondition as any,
          hasAirConditioning: input.hasAirConditioning || false,
          hasWifi: input.hasWifi || false,
          isAccessible: input.isAccessible || false,

          // Fare details
          fareAmount: input.fareAmount,
          fareDescription: input.fareDescription,

          // Related entities
          servingRoadIds: input.servingRoadIds,
          parkingFacilityIds: input.parkingFacilityIds,

          // Geometry fields with SQL expression values
          routePath: routePathValue ? sql`${routePathValue}` : null,
          stopPoints: stopPointsValue ? sql`${stopPointsValue}` : null,

          // SEO fields
          metaTitle: input.metaTitle || input.name,
          metaDescription:
            input.metaDescription ||
            input.description?.substring(0, 160) ||
            `Information about ${input.name} public transport service`,
          keywords:
            input.keywords ||
            `${input.name}, ${input.type.toLowerCase()}, public transport, ${input.startPoint || ""}, ${input.endPoint || ""}`,

          // Metadata
          isActive: true,
          createdAt: now,
          updatedAt: now,
          createdBy: ctx.user.id,
          updatedBy: ctx.user.id,
        });

        return { id, slug, success: true };
      });
    } catch (error) {
      console.error("Error creating public transport:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create public transport",
        cause: error,
      });
    }
  });
