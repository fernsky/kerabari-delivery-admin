import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { parkingFacility } from "@/server/db/schema/profile/institutions/transportation/parkingFacility";
import { generateSlug } from "@/server/utils/slug-helpers";
import { eq, sql, and, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Define enums for parking facility input validation
const parkingFacilityTypeEnum = [
  "BUS_PARK",
  "TAXI_PARK",
  "TEMPO_PARK",
  "AUTO_RICKSHAW_PARK",
  "CAR_PARK",
  "BIKE_PARK",
  "MULTIPURPOSE_PARK",
  "OTHER",
];

const parkingConditionEnum = [
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

const polygonGeometrySchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))), // Array of rings, each ring is array of [lon,lat] pairs
});

// Define schema for parking facility update
const parkingFacilitySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Facility name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(parkingFacilityTypeEnum as [string, ...string[]]),

  // Location details
  wardNumber: z.number().int().positive().optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical details
  areaInSquareMeters: z.number().int().positive().optional(),
  vehicleCapacity: z.number().int().positive().optional(),
  condition: z.enum(parkingConditionEnum as [string, ...string[]]).optional(),
  drainageSystem: z
    .enum(drainageSystemEnum as [string, ...string[]])
    .optional(),

  // Additional facilities
  hasRoof: z.boolean().optional(),
  hasToilet: z.boolean().optional(),
  hasWaitingArea: z.boolean().optional(),
  hasTicketCounter: z.boolean().optional(),
  hasFoodStalls: z.boolean().optional(),
  hasSecurityPersonnel: z.boolean().optional(),
  hasCCTV: z.boolean().optional(),
  operatingHours: z.string().optional(),

  // Management details
  operator: z.string().optional(),
  contactInfo: z.string().optional(),
  establishedYear: z.string().optional(),

  // Geometry fields
  locationPoint: pointGeometrySchema.optional(),
  areaPolygon: polygonGeometrySchema.optional(),

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
});

// Update a parking facility
export const updateParkingFacility = protectedProcedure
  .input(parkingFacilitySchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update parking facilities",
      });
    }

    try {
      // Check if parking facility exists
      const existing = await ctx.db
        .select({ id: parkingFacility.id, slug: parkingFacility.slug })
        .from(parkingFacility)
        .where(eq(parkingFacility.id, input.id));

      if (existing.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Parking facility not found",
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
            .select({ id: parkingFacility.id })
            .from(parkingFacility)
            .where(
              and(
                eq(parkingFacility.slug, slug),
                ne(parkingFacility.id, input.id), // Don't match our own record
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
        areaInSquareMeters: input.areaInSquareMeters,
        vehicleCapacity: input.vehicleCapacity,
        condition: input.condition as any,
        drainageSystem: input.drainageSystem as any,

        // Additional facilities
        hasRoof: input.hasRoof,
        hasToilet: input.hasToilet,
        hasWaitingArea: input.hasWaitingArea,
        hasTicketCounter: input.hasTicketCounter,
        hasFoodStalls: input.hasFoodStalls,
        hasSecurityPersonnel: input.hasSecurityPersonnel,
        hasCCTV: input.hasCCTV,
        operatingHours: input.operatingHours,

        // Management details
        operator: input.operator,
        contactInfo: input.contactInfo,
        establishedYear: input.establishedYear,

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

      // Update the parking facility
      const result = await ctx.db
        .update(parkingFacility)
        .set(updateData)
        .where(eq(parkingFacility.id, input.id))
        .returning({
          id: parkingFacility.id,
          slug: parkingFacility.slug,
        });

      return {
        success: true,
        slug: result[0].slug,
      };
    } catch (error) {
      console.error("Error updating parking facility:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update parking facility",
      });
    }
  });
