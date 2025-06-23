import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import {
  AgriProcessingCenter,
  agriProcessingCenter,
} from "@/server/db/schema/profile/institutions/agricultural/agriProcessingCenters";
import { generateSlug } from "@/server/utils/slug-helpers";
import { sql, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

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

// Define schema for processing center creation
const processingCenterSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Processing center name is required"),
  slug: z.string().optional(), // Optional slug - will generate if not provided
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

// Create a new processing center
export const createProcessingCenter = protectedProcedure
  .input(processingCenterSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create processing centers",
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
          .select({ id: agriProcessingCenter.id })
          .from(agriProcessingCenter)
          .where(eq(agriProcessingCenter.slug, slug))
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
      let facilityFootprintValue = null;
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

      // Use a transaction for data consistency
      return await ctx.db.transaction(async (tx) => {
        // Insert the processing center
        const insertedProcessingCenter = await tx
          .insert(agriProcessingCenter)
          .values({
            id,
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
            isOperational: input.isOperational ?? true,
            operationalStatus: input.operationalStatus,
            operationStartYear: input.operationStartYear,

            // Storage details
            hasStorageFacility: input.hasStorageFacility || false,
            storageType: input.storageType as any,
            storageTotalCapacityMT: input.storageTotalCapacityMT,
            storageCurrentUsageMT: input.storageCurrentUsageMT,
            temperatureControlled: input.temperatureControlled || false,
            temperatureRangeMin: input.temperatureRangeMin,
            temperatureRangeMax: input.temperatureRangeMax,
            humidityControlled: input.humidityControlled || false,

            // Processing capabilities
            hasProcessingUnit: input.hasProcessingUnit || false,
            processingLevel: input.processingLevel as any,
            processingCapacityMTPerDay: input.processingCapacityMTPerDay,
            mainProcessingActivities: input.mainProcessingActivities,
            valueAdditionActivities: input.valueAdditionActivities,

            // Products and commodities
            primaryCommodities: input.primaryCommodities,
            secondaryCommodities: input.secondaryCommodities,
            seasonalAvailability: input.seasonalAvailability,

            // Quality control
            hasQualityControlLab: input.hasQualityControlLab || false,
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
            hasElectricity: input.hasElectricity ?? true,
            hasWaterSupply: input.hasWaterSupply ?? true,
            hasWasteManagementSystem: input.hasWasteManagementSystem || false,
            hasInternet: input.hasInternet || false,

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
            profitableOperation: input.profitableOperation ?? true,

            // Challenges and needs
            majorConstraints: input.majorConstraints,
            developmentNeeds: input.developmentNeeds,

            // Geometry fields with SQL expression values
            locationPoint: locationPointValue
              ? sql`${locationPointValue}`
              : null,
            facilityFootprint: facilityFootprintValue
              ? sql`${facilityFootprintValue}`
              : null,

            // SEO fields
            metaTitle: input.metaTitle || input.name,
            metaDescription:
              input.metaDescription ||
              input.description?.substring(0, 160) ||
              `Information about ${input.name} agricultural processing center`,
            keywords:
              input.keywords ||
              `${input.name}, ${input.centerType.toLowerCase().replace("_", " ")}, agricultural processing, ${
                input.primaryCommodities || ""
              }`,

            // Metadata
            isActive: true,
            createdAt: now,
            updatedAt: now,
            createdBy: ctx.user.id,
            updatedBy: ctx.user.id,
          } as unknown as AgriProcessingCenter)
          .returning({
            id: agriProcessingCenter.id,
          });

        return { id, slug, success: true };
      });
    } catch (error) {
      console.error("Error creating processing center:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create agricultural processing center",
        cause: error,
      });
    }
  });
