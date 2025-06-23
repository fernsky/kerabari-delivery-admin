import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import {
  petrolPump,
  petrolPumpTypeEnum,
} from "@/server/db/schema/profile/institutions/transportation/petrolPump";
import { generateSlug } from "@/server/utils/slug-helpers";
import { sql, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

// Define schema for geometry input
const pointGeometrySchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
});

// Define schema for petrol pump creation
const petrolPumpSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Petrol pump name is required"),
  slug: z.string().optional(), // Optional slug - will generate if not provided
  description: z.string().optional(),
  type: z.enum([
    "PETROL",
    "DIESEL",
    "PETROL_DIESEL",
    "CNG",
    "EV_CHARGING",
    "MULTIPURPOSE",
  ]),

  // Location details
  wardNumber: z.number().int().positive("Ward number is required"),
  locality: z.string().optional(),
  address: z.string().optional(),

  // Owner details
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  ownerEmail: z.string().email().optional(),
  ownerWebsite: z.string().url().optional(),

  // Facilities
  hasEVCharging: z.boolean().optional(),
  hasCarWash: z.boolean().optional(),
  hasConvenienceStore: z.boolean().optional(),
  hasRestroom: z.boolean().optional(),
  hasAirFilling: z.boolean().optional(),
  operatingHours: z.string().optional(),

  // Geometry fields
  locationPoint: pointGeometrySchema.optional(),

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
});

// Create a new petrol pump
export const createPetrolPump = protectedProcedure
  .input(petrolPumpSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create petrol pump entries",
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
          .select({ id: petrolPump.id })
          .from(petrolPump)
          .where(eq(petrolPump.slug, slug))
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

      // Use a transaction for data consistency
      return await ctx.db.transaction(async (tx) => {
        // Insert the petrol pump
        await tx.insert(petrolPump).values({
          id,
          name: input.name,
          slug,
          description: input.description,
          type: input.type as any,

          // Location details
          wardNumber: input.wardNumber,
          locality: input.locality,
          address: input.address,

          // Owner details
          ownerName: input.ownerName,
          ownerContact: input.ownerContact,
          ownerEmail: input.ownerEmail,
          ownerWebsite: input.ownerWebsite,

          // Facilities
          hasEVCharging: input.hasEVCharging || false,
          hasCarWash: input.hasCarWash || false,
          hasConvenienceStore: input.hasConvenienceStore || false,
          hasRestroom: input.hasRestroom || false,
          hasAirFilling: input.hasAirFilling || false,
          operatingHours: input.operatingHours,

          // Geometry fields with SQL expression values
          locationPoint: locationPointValue ? sql`${locationPointValue}` : null,

          // SEO fields
          metaTitle: input.metaTitle || input.name,
          metaDescription:
            input.metaDescription ||
            input.description?.substring(0, 160) ||
            `Information about ${input.name} petrol pump`,
          keywords:
            input.keywords ||
            `${input.name}, petrol pump, fuel station, ${input.locality || ""}, ward ${input.wardNumber}`,

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
      console.error("Error creating petrol pump:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create petrol pump",
        cause: error,
      });
    }
  });
