import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { publicTransport } from "@/server/db/schema/profile/institutions/transportation/publicTransport";
import { generateSlug } from "@/server/utils/slug-helpers";
import { eq, sql, and, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

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

// Define schema for public transport update
const publicTransportSchema = z.object({
  id: z.string(),
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

// Update a public transport
export const updatePublicTransport = protectedProcedure
  .input(publicTransportSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update public transport entries",
      });
    }

    try {
      // Check if public transport exists
      const existing = await ctx.db
        .select({ id: publicTransport.id, slug: publicTransport.slug })
        .from(publicTransport)
        .where(eq(publicTransport.id, input.id));

      if (existing.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Public transport not found",
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
            .select({ id: publicTransport.id })
            .from(publicTransport)
            .where(
              and(
                eq(publicTransport.slug, slug),
                ne(publicTransport.id, input.id), // Don't match our own record
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

      // Process route path geometry if provided
      let routePathValue = undefined;
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

      // Process stop points geometry if provided
      let stopPointsValue = undefined;
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
      let startTime = undefined;
      if (input.startTime) {
        startTime = input.startTime;
      }

      let endTime = undefined;
      if (input.endTime) {
        endTime = input.endTime;
      }

      const updateData: any = {
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
        intervalMinutes: input.intervalMinutes,

        // Vehicle details
        vehicleCount: input.vehicleCount,
        seatingCapacity: input.seatingCapacity,
        vehicleCondition: input.vehicleCondition as any,
        hasAirConditioning: input.hasAirConditioning,
        hasWifi: input.hasWifi,
        isAccessible: input.isAccessible,

        // Fare details
        fareAmount: input.fareAmount,
        fareDescription: input.fareDescription,

        // Related entities
        servingRoadIds: input.servingRoadIds,
        parkingFacilityIds: input.parkingFacilityIds,

        // SEO fields
        metaTitle: input.metaTitle || input.name,
        metaDescription: input.metaDescription,
        keywords: input.keywords,

        // Metadata
        updatedAt: new Date(),
        updatedBy: ctx.user.id,
      };

      // Only add geometry fields if they were provided
      if (routePathValue !== undefined) {
        updateData.routePath = routePathValue;
      }

      if (stopPointsValue !== undefined) {
        updateData.stopPoints = stopPointsValue;
      }

      // Only add time fields if they were provided
      if (startTime !== undefined) {
        updateData.startTime = startTime;
      }

      if (endTime !== undefined) {
        updateData.endTime = endTime;
      }

      // Update the public transport
      const result = await ctx.db
        .update(publicTransport)
        .set(updateData)
        .where(eq(publicTransport.id, input.id))
        .returning({
          id: publicTransport.id,
          slug: publicTransport.slug,
        });

      return {
        success: true,
        slug: result[0].slug,
      };
    } catch (error) {
      console.error("Error updating public transport:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update public transport",
      });
    }
  });
