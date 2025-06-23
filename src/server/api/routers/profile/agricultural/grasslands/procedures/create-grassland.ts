import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import {
  Grassland,
  grassland,
} from "@/server/db/schema/profile/institutions/agricultural/grasslands";
import { generateSlug } from "@/server/utils/slug-helpers";
import { sql, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

// Define enums for grassland input validation
const grasslandTypeEnum = [
  "NATURAL_MEADOW",
  "IMPROVED_PASTURE",
  "RANGELAND",
  "SILVOPASTURE",
  "WETLAND_GRAZING",
  "ALPINE_GRASSLAND",
  "COMMON_GRAZING_LAND",
  "OTHER",
];

const vegetationDensityEnum = [
  "VERY_DENSE",
  "DENSE",
  "MODERATE",
  "SPARSE",
  "VERY_SPARSE",
];

const grasslandManagementEnum = [
  "ROTATIONAL_GRAZING",
  "CONTINUOUS_GRAZING",
  "DEFERRED_GRAZING",
  "HAY_PRODUCTION",
  "CONSERVATION",
  "UNMANAGED",
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

// Define schema for grassland creation
const grasslandSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Grassland name is required"),
  slug: z.string().optional(), // Optional slug - will generate if not provided
  description: z.string().optional(),
  type: z.enum(grasslandTypeEnum as [string, ...string[]]),

  // Location details
  wardNumber: z.number().int().positive().optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical details
  areaInHectares: z.number().positive().optional(),
  elevationInMeters: z.number().int().optional(),
  vegetationDensity: z
    .enum(vegetationDensityEnum as [string, ...string[]])
    .optional(),
  managementType: z
    .enum(grasslandManagementEnum as [string, ...string[]])
    .optional(),

  // Grassland specific details
  dominantSpecies: z.string().optional(),
  carryingCapacity: z.number().int().positive().optional(),
  grazingPeriod: z.string().optional(),
  annualFodderYield: z.number().positive().optional(),
  yieldYear: z.string().optional(),

  // Management details
  isGovernmentOwned: z.boolean().optional(),
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  caretakerName: z.string().optional(),
  caretakerContact: z.string().optional(),

  // Additional information
  hasWaterSource: z.boolean().optional(),
  waterSourceType: z.string().optional(),
  isFenced: z.boolean().optional(),
  hasGrazingRights: z.boolean().optional(),

  // Conservation status
  hasProtectedStatus: z.boolean().optional(),
  protectionType: z.string().optional(),
  biodiversityValue: z.string().optional(),

  // Geometry fields
  locationPoint: pointGeometrySchema.optional(),
  areaPolygon: polygonGeometrySchema.optional(),

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
});

// Create a new grassland
export const createGrassland = protectedProcedure
  .input(grasslandSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create grasslands",
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
          .select({ id: grassland.id })
          .from(grassland)
          .where(eq(grassland.slug, slug))
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
        // Insert the grassland
        const insertedGrassland = await tx
          .insert(grassland)
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
            areaInHectares: input.areaInHectares,
            elevationInMeters: input.elevationInMeters,
            vegetationDensity: input.vegetationDensity as any,
            managementType: input.managementType as any,

            // Grassland specific details
            dominantSpecies: input.dominantSpecies,
            carryingCapacity: input.carryingCapacity,
            grazingPeriod: input.grazingPeriod,
            annualFodderYield: input.annualFodderYield,
            yieldYear: input.yieldYear,

            // Management details
            isGovernmentOwned: input.isGovernmentOwned || false,
            ownerName: input.ownerName,
            ownerContact: input.ownerContact,
            caretakerName: input.caretakerName,
            caretakerContact: input.caretakerContact,

            // Additional information
            hasWaterSource: input.hasWaterSource || false,
            waterSourceType: input.waterSourceType,
            isFenced: input.isFenced || false,
            hasGrazingRights: input.hasGrazingRights || false,

            // Conservation status
            hasProtectedStatus: input.hasProtectedStatus || false,
            protectionType: input.protectionType,
            biodiversityValue: input.biodiversityValue,

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
              `Information about ${input.name} grassland`,
            keywords:
              input.keywords ||
              `${input.name}, ${input.type.toLowerCase().replace("_", " ")}, grassland, ${input.dominantSpecies || ""}`,

            // Metadata
            isActive: true,
            createdAt: now,
            updatedAt: now,
            createdBy: ctx.user.id,
            updatedBy: ctx.user.id,
          } as unknown as Grassland)
          .returning({
            id: grassland.id,
          });

        return { id, slug, success: true };
      });
    } catch (error) {
      console.error("Error creating grassland:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create grassland",
        cause: error,
      });
    }
  });
