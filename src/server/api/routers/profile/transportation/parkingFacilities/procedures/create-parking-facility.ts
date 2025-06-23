import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { parkingFacility } from "@/server/db/schema/profile/institutions/transportation/parkingFacility";
import { generateSlug } from "@/server/utils/slug-helpers";
import { sql, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

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

// Define schema for parking facility creation
const parkingFacilitySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Facility name is required"),
  slug: z.string().optional(), // Optional slug - will generate if not provided
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

// Create a new parking facility
export const createParkingFacility = protectedProcedure
  .input(parkingFacilitySchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create parking facilities",
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
          .select({ id: parkingFacility.id })
          .from(parkingFacility)
          .where(eq(parkingFacility.slug, slug))
          .limit(1);

        if (existingSlug.length === 0) {
          slugExists = false;
        } else {
          slug = `${baseSlug}-${slugCounter}`;
          slugCounter++;
        }
      }

      // Process point geometry if provided
      let locationPointValue = null;
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

      // Process polygon geometry if provided
      let areaPolygonValue = null;
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

      // Use a transaction for data consistency
      return await ctx.db.transaction(async (tx) => {
        // Insert the parking facility
        const insertedFacility = await tx
          .insert(parkingFacility)
          .values({
            id,
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
            hasRoof: input.hasRoof || false,
            hasToilet: input.hasToilet || false,
            hasWaitingArea: input.hasWaitingArea || false,
            hasTicketCounter: input.hasTicketCounter || false,
            hasFoodStalls: input.hasFoodStalls || false,
            hasSecurityPersonnel: input.hasSecurityPersonnel || false,
            hasCCTV: input.hasCCTV || false,
            operatingHours: input.operatingHours,

            // Management details
            operator: input.operator,
            contactInfo: input.contactInfo,
            establishedYear: input.establishedYear,

            // Geometry fields with SQL expression values
            locationPoint: locationPointValue
              ? sql`${locationPointValue}`
              : null,
            areaPolygon: areaPolygonValue ? sql`${areaPolygonValue}` : null,

            // SEO fields
            metaTitle: input.metaTitle || input.name,
            metaDescription:
              input.metaDescription ||
              input.description?.substring(0, 160) ||
              `Information about ${input.name} parking facility`,
            keywords:
              input.keywords ||
              `${input.name}, ${input.type.toLowerCase().replace("_", " ")}, parking, transportation`,

            // Metadata
            isActive: true,
            createdAt: now,
            updatedAt: now,
            createdBy: ctx.user.id,
            updatedBy: ctx.user.id,
          })
          .returning({
            id: parkingFacility.id,
          });

        return { id, slug, success: true };
      });
    } catch (error) {
      console.error("Error creating parking facility:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create parking facility",
        cause: error,
      });
    }
  });
