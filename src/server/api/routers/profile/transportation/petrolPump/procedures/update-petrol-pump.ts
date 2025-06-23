import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { petrolPump } from "@/server/db/schema/profile/institutions/transportation/petrolPump";
import { generateSlug } from "@/server/utils/slug-helpers";
import { eq, sql, and, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Define schema for geometry input
const pointGeometrySchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
});

// Define schema for petrol pump update
const petrolPumpSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Petrol pump name is required"),
  slug: z.string().optional(),
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

// Update a petrol pump
export const updatePetrolPump = protectedProcedure
  .input(petrolPumpSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update petrol pump entries",
      });
    }

    try {
      // Check if petrol pump exists
      const existing = await ctx.db
        .select({ id: petrolPump.id, slug: petrolPump.slug })
        .from(petrolPump)
        .where(eq(petrolPump.id, input.id));

      if (existing.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Petrol pump not found",
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
            .select({ id: petrolPump.id })
            .from(petrolPump)
            .where(
              and(
                eq(petrolPump.slug, slug),
                ne(petrolPump.id, input.id), // Don't match our own record
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

      const updateData: any = {
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
        hasEVCharging: input.hasEVCharging,
        hasCarWash: input.hasCarWash,
        hasConvenienceStore: input.hasConvenienceStore,
        hasRestroom: input.hasRestroom,
        hasAirFilling: input.hasAirFilling,
        operatingHours: input.operatingHours,

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

      // Update the petrol pump
      const result = await ctx.db
        .update(petrolPump)
        .set(updateData)
        .where(eq(petrolPump.id, input.id))
        .returning({
          id: petrolPump.id,
          slug: petrolPump.slug,
        });

      return {
        success: true,
        slug: result[0].slug,
      };
    } catch (error) {
      console.error("Error updating petrol pump:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update petrol pump",
      });
    }
  });
