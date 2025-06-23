import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { agriProcessingCenter } from "@/server/db/schema/profile/institutions/agricultural/agriProcessingCenters";
import { generateSlug } from "@/server/utils/slug-helpers";
import { eq, sql, and, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Define enums for processing center input validation
const centerTypeEnum = [
  "COLLECTION_CENTER",
  "STORAGE_FACILITY",
  "PROCESSING_UNIT",
  "MULTIPURPOSE_CENTER",
  "MARKET_CENTER",
  "COLD_STORAGE",
  "WAREHOUSE",
  "OTHER",
];

const storageTypeEnum = [
  "AMBIENT",
  "COLD_STORAGE",
  "CONTROLLED_ATMOSPHERE",
  "SILO",
  "WAREHOUSE",
  "GRANARY",
  "MIXED",
  "OTHER",
];

const processingLevelEnum = [
  "PRIMARY_PROCESSING",
  "SECONDARY_PROCESSING",
  "TERTIARY_PROCESSING",
  "MINIMAL_PROCESSING",
  "COMPREHENSIVE_PROCESSING",
  "NOT_APPLICABLE",
];

const ownershipTypeEnum = [
  "GOVERNMENT",
  "PRIVATE",
  "COOPERATIVE",
  "COMMUNITY",
  "PUBLIC_PRIVATE_PARTNERSHIP",
  "NGO_MANAGED",
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

// Define schema for linked entity references
const linkedEntitySchema = z.array(
  z.object({
    id: z.string(),
    name: z.string().optional(),
  }),
);

// Define schema for processing center update
const processingCenterSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Processing center name is required"),
  slug: z.string().optional(), // Optional slug - will maintain existing if not provided
  description: z.string().optional(),
  centerType: z.enum(centerTypeEnum as [string, ...string[]]),

  // Location details
  wardNumber: z.number().int().positive().optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical properties
  areaInSquareMeters: z.number().positive().optional(),
  buildingYearConstructed: z.number().int().positive().optional(),
  isOperational: z.boolean().optional(),
  operationalStatus: z.string().optional(),
  operationStartYear: z.number().int().positive().optional(),

  // Storage details
  hasStorageFacility: z.boolean().optional(),
  storageType: z.enum(storageTypeEnum as [string, ...string[]]).optional(),
  storageTotalCapacityMT: z.number().positive().optional(),
  storageCurrentUsageMT: z.number().nonnegative().optional(),
  temperatureControlled: z.boolean().optional(),
  temperatureRangeMin: z.number().optional(),
  temperatureRangeMax: z.number().optional(),
  humidityControlled: z.boolean().optional(),

  // Processing capabilities
  hasProcessingUnit: z.boolean().optional(),
  processingLevel: z
    .enum(processingLevelEnum as [string, ...string[]])
    .optional(),
  processingCapacityMTPerDay: z.number().positive().optional(),
  mainProcessingActivities: z.string().optional(),
  valueAdditionActivities: z.string().optional(),

  // Products and commodities
  primaryCommodities: z.string().optional(),
  secondaryCommodities: z.string().optional(),
  seasonalAvailability: z.string().optional(),

  // Quality control
  hasQualityControlLab: z.boolean().optional(),
  qualityStandards: z.string().optional(),
  certifications: z.string().optional(),

  // Management and ownership
  ownershipType: z.enum(ownershipTypeEnum as [string, ...string[]]).optional(),
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  managerName: z.string().optional(),
  managerContact: z.string().optional(),

  // Staffing
  totalStaffCount: z.number().int().nonnegative().optional(),
  technicalStaffCount: z.number().int().nonnegative().optional(),

  // Connectivity and services
  hasElectricity: z.boolean().optional(),
  hasWaterSupply: z.boolean().optional(),
  hasWasteManagementSystem: z.boolean().optional(),
  hasInternet: z.boolean().optional(),

  // Capacity and utilization
  annualThroughputMT: z.number().nonnegative().optional(),
  capacityUtilizationPercent: z.number().int().min(0).max(100).optional(),
  recordedYear: z.string().length(4).optional(),

  // Economic impact
  employmentGenerated: z.number().int().nonnegative().optional(),
  serviceAreaRadiusKM: z.number().nonnegative().optional(),
  farmersServedCount: z.number().int().nonnegative().optional(),
  womenFarmersPercent: z.number().int().min(0).max(100).optional(),

  // Linkages to other entities
  linkedGrazingAreas: linkedEntitySchema.optional(),
  linkedAgricZones: linkedEntitySchema.optional(),
  linkedGrasslands: linkedEntitySchema.optional(),

  // Financial aspects
  establishmentCostNPR: z.number().nonnegative().optional(),
  annualOperatingCostNPR: z.number().nonnegative().optional(),
  annualRevenueNPR: z.number().nonnegative().optional(),
  profitableOperation: z.boolean().optional(),

  // Challenges and needs
  majorConstraints: z.string().optional(),
  developmentNeeds: z.string().optional(),

  // Geometry fields
  locationPoint: pointGeometrySchema.optional(),
  facilityFootprint: polygonGeometrySchema.optional(),

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
});

// Update a processing center
export const updateProcessingCenter = protectedProcedure
  .input(processingCenterSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update processing centers",
      });
    }

    try {
      // Check if processing center exists
      const existing = await ctx.db
        .select({
          id: agriProcessingCenter.id,
          slug: agriProcessingCenter.slug,
        })
        .from(agriProcessingCenter)
        .where(eq(agriProcessingCenter.id, input.id));

      if (existing.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Processing center not found",
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
            .select({ id: agriProcessingCenter.id })
            .from(agriProcessingCenter)
            .where(
              and(
                eq(agriProcessingCenter.slug, slug),
                ne(agriProcessingCenter.id, input.id), // Don't match our own record
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

      // Process facility footprint geometry if provided
      let facilityFootprintValue = undefined;
      if (input.facilityFootprint) {
        const polygonGeoJson = JSON.stringify(input.facilityFootprint);
        try {
          JSON.parse(polygonGeoJson); // Validate JSON
          facilityFootprintValue = sql`ST_GeomFromGeoJSON(${polygonGeoJson})`;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid facility footprint geometry GeoJSON",
          });
        }
      }

      // Process linked entities
      const linkedGrazingAreas = input.linkedGrazingAreas || [];
      const linkedAgricZones = input.linkedAgricZones || [];
      const linkedGrasslands = input.linkedGrasslands || [];

      const updateData: any = {
        name: input.name,
        slug,
        description: input.description,
        centerType: input.centerType as any,

        // Location details
        wardNumber: input.wardNumber,
        location: input.location,
        address: input.address,

        // Physical properties
        areaInSquareMeters: input.areaInSquareMeters,
        buildingYearConstructed: input.buildingYearConstructed,
        isOperational: input.isOperational,
        operationalStatus: input.operationalStatus,
        operationStartYear: input.operationStartYear,

        // Storage details
        hasStorageFacility: input.hasStorageFacility,
        storageType: input.storageType as any,
        storageTotalCapacityMT: input.storageTotalCapacityMT,
        storageCurrentUsageMT: input.storageCurrentUsageMT,
        temperatureControlled: input.temperatureControlled,
        temperatureRangeMin: input.temperatureRangeMin,
        temperatureRangeMax: input.temperatureRangeMax,
        humidityControlled: input.humidityControlled,

        // Processing capabilities
        hasProcessingUnit: input.hasProcessingUnit,
        processingLevel: input.processingLevel as any,
        processingCapacityMTPerDay: input.processingCapacityMTPerDay,
        mainProcessingActivities: input.mainProcessingActivities,
        valueAdditionActivities: input.valueAdditionActivities,

        // Products and commodities
        primaryCommodities: input.primaryCommodities,
        secondaryCommodities: input.secondaryCommodities,
        seasonalAvailability: input.seasonalAvailability,

        // Quality control
        hasQualityControlLab: input.hasQualityControlLab,
        qualityStandards: input.qualityStandards,
        certifications: input.certifications,

        // Management and ownership
        ownershipType: input.ownershipType as any,
        ownerName: input.ownerName,
        ownerContact: input.ownerContact,
        managerName: input.managerName,
        managerContact: input.managerContact,

        // Staffing
        totalStaffCount: input.totalStaffCount,
        technicalStaffCount: input.technicalStaffCount,

        // Connectivity and services
        hasElectricity: input.hasElectricity,
        hasWaterSupply: input.hasWaterSupply,
        hasWasteManagementSystem: input.hasWasteManagementSystem,
        hasInternet: input.hasInternet,

        // Capacity and utilization
        annualThroughputMT: input.annualThroughputMT,
        capacityUtilizationPercent: input.capacityUtilizationPercent,
        recordedYear: input.recordedYear,

        // Economic impact
        employmentGenerated: input.employmentGenerated,
        serviceAreaRadiusKM: input.serviceAreaRadiusKM,
        farmersServedCount: input.farmersServedCount,
        womenFarmersPercent: input.womenFarmersPercent,

        // Linkages to other entities as JSON arrays
        linkedGrazingAreas:
          linkedGrazingAreas.length > 0
            ? sql`${JSON.stringify(linkedGrazingAreas)}::jsonb`
            : sql`'[]'::jsonb`,
        linkedAgricZones:
          linkedAgricZones.length > 0
            ? sql`${JSON.stringify(linkedAgricZones)}::jsonb`
            : sql`'[]'::jsonb`,
        linkedGrasslands:
          linkedGrasslands.length > 0
            ? sql`${JSON.stringify(linkedGrasslands)}::jsonb`
            : sql`'[]'::jsonb`,

        // Financial aspects
        establishmentCostNPR: input.establishmentCostNPR,
        annualOperatingCostNPR: input.annualOperatingCostNPR,
        annualRevenueNPR: input.annualRevenueNPR,
        profitableOperation: input.profitableOperation,

        // Challenges and needs
        majorConstraints: input.majorConstraints,
        developmentNeeds: input.developmentNeeds,

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

      if (facilityFootprintValue !== undefined) {
        updateData.facilityFootprint = facilityFootprintValue;
      }

      // Update the processing center
      const result = await ctx.db
        .update(agriProcessingCenter)
        .set(updateData)
        .where(eq(agriProcessingCenter.id, input.id))
        .returning({
          id: agriProcessingCenter.id,
          slug: agriProcessingCenter.slug,
        });

      return {
        success: true,
        slug: result[0].slug,
      };
    } catch (error) {
      console.error("Error updating processing center:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update processing center",
      });
    }
  });
