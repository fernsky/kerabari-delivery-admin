import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { fishFarm } from "@/server/db/schema/profile/institutions/agricultural/fishFarms";
import { generateSlug } from "@/server/utils/slug-helpers";
import { eq, sql, and, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Define enums for fish farm input validation
const farmTypeEnum = [
  "POND_CULTURE",
  "CAGE_CULTURE",
  "TANK_CULTURE",
  "RACEWAY_CULTURE",
  "RECIRCULATING_AQUACULTURE_SYSTEM",
  "HATCHERY",
  "NURSERY",
  "INTEGRATED_FARMING",
  "RICE_FISH_CULTURE",
  "ORNAMENTAL_FISH_FARM",
  "RESEARCH_FACILITY",
  "MIXED",
  "OTHER",
];

const ownershipTypeEnum = [
  "PRIVATE",
  "GOVERNMENT",
  "COMMUNITY",
  "COOPERATIVE",
  "PUBLIC_PRIVATE_PARTNERSHIP",
  "NGO_MANAGED",
  "MIXED",
];

const waterSourceEnum = [
  "RIVER",
  "STREAM",
  "SPRING",
  "WELL",
  "GROUNDWATER",
  "RAINWATER",
  "CANAL",
  "RESERVOIR",
  "LAKE",
  "MIXED",
];

const feedingSystemEnum = [
  "MANUAL",
  "AUTOMATIC",
  "DEMAND_FEEDER",
  "SUPPLEMENTARY",
  "NATURAL_FOOD_ONLY",
  "MIXED",
];

const waterManagementEnum = [
  "STATIC",
  "FLOW_THROUGH",
  "RECIRCULATING",
  "AERATED",
  "INTEGRATED",
  "MIXED",
];

const cultureSystemEnum = [
  "EXTENSIVE",
  "SEMI_INTENSIVE",
  "INTENSIVE",
  "SUPER_INTENSIVE",
  "POLYCULTURE",
  "MONOCULTURE",
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

const multiPolygonGeometrySchema = z.object({
  type: z.literal("MultiPolygon"),
  coordinates: z.array(z.array(z.array(z.tuple([z.number(), z.number()])))),
});

// Define schema for linked entity references
const linkedEntitySchema = z.array(
  z.object({
    id: z.string(),
    name: z.string().optional(),
  }),
);

// Define schema for fish farm update
const fishFarmUpdateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Farm name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  farmType: z.enum(farmTypeEnum as [string, ...string[]]),

  // Location details
  wardNumber: z.number().int().positive().optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical details
  ownershipType: z.enum(ownershipTypeEnum as [string, ...string[]]).optional(),
  totalAreaInHectares: z.number().positive().optional(),
  waterSurfaceAreaInHectares: z.number().positive().optional(),
  operationalSince: z.number().int().optional(),

  // Water body characteristics
  totalPondCount: z.number().int().nonnegative().optional(),
  activePondCount: z.number().int().nonnegative().optional(),
  averagePondSizeInSquareMeters: z.number().positive().optional(),
  averageWaterDepthInMeters: z.number().positive().optional(),
  totalWaterVolumeInCubicMeters: z.number().positive().optional(),
  waterSource: z.enum(waterSourceEnum as [string, ...string[]]).optional(),
  waterSourceDetails: z.string().optional(),
  waterAvailabilityIssues: z.string().optional(),
  hasWaterQualityMonitoring: z.boolean().optional(),
  waterQualityParameters: z.string().optional(),

  // Culture and management details
  cultureSystem: z.enum(cultureSystemEnum as [string, ...string[]]).optional(),
  primaryFishSpecies: z.string().optional(),
  secondaryFishSpecies: z.string().optional(),
  seedSourceDetails: z.string().optional(),
  stockingDensityPerSquareMeter: z.number().positive().optional(),
  growoutPeriodInMonths: z.number().int().positive().optional(),
  feedingSystem: z.enum(feedingSystemEnum as [string, ...string[]]).optional(),
  feedTypes: z.string().optional(),
  feedConversionRatio: z.number().positive().optional(),
  annualFeedUsageInKg: z.number().positive().optional(),

  // Water management
  waterManagementSystem: z
    .enum(waterManagementEnum as [string, ...string[]])
    .optional(),
  usesProbiotics: z.boolean().optional(),
  usesAeration: z.boolean().optional(),
  aerationType: z.string().optional(),
  waterExchangeFrequency: z.string().optional(),
  waterExchangePercentage: z.number().int().min(0).max(100).optional(),
  effluentManagementDetails: z.string().optional(),

  // Production details
  annualProductionInKg: z.number().positive().optional(),
  averageYieldPerHectareInKg: z.number().positive().optional(),
  survivalRatePercentage: z.number().int().min(0).max(100).optional(),
  averageFishSizeInGrams: z.number().positive().optional(),
  recordedYearProduction: z.string().length(4).optional(),
  productionCycles: z.number().int().positive().optional(),

  // Infrastructure and equipment
  hasFarmHouse: z.boolean().optional(),
  hasHatchery: z.boolean().optional(),
  hatcheryCapacity: z.number().int().positive().optional(),
  hasNursery: z.boolean().optional(),
  nurseryAreaInSquareMeters: z.number().positive().optional(),
  hasFeedStorage: z.boolean().optional(),
  hasEquipment: z.boolean().optional(),
  equipmentDetails: z.string().optional(),
  hasLaboratory: z.boolean().optional(),
  laboratoryPurpose: z.string().optional(),
  hasIceProduction: z.boolean().optional(),
  hasProcessingArea: z.boolean().optional(),
  hasElectricity: z.boolean().optional(),
  hasGenerator: z.boolean().optional(),
  hasFencing: z.boolean().optional(),
  hasSecuritySystem: z.boolean().optional(),

  // Personnel and management
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  managerName: z.string().optional(),
  managerContact: z.string().optional(),
  technicalStaffCount: z.number().int().nonnegative().optional(),
  regularStaffCount: z.number().int().nonnegative().optional(),
  seasonalLaborCount: z.number().int().nonnegative().optional(),
  hasTrainedStaff: z.boolean().optional(),
  trainingDetails: z.string().optional(),

  // Economic aspects
  annualOperatingCostNPR: z.number().nonnegative().optional(),
  annualRevenueNPR: z.number().nonnegative().optional(),
  profitableOperation: z.boolean().optional(),
  marketAccessDetails: z.string().optional(),
  majorBuyerTypes: z.string().optional(),
  averageSellingPricePerKg: z.number().positive().optional(),

  // Health management
  commonDiseases: z.string().optional(),
  diseasePreventionMethods: z.string().optional(),
  usesChemicals: z.boolean().optional(),
  chemicalUsageDetails: z.string().optional(),
  mortalityPercentage: z.number().int().min(0).max(100).optional(),
  healthMonitoringFrequency: z.string().optional(),

  // Sustainability aspects
  hasEnvironmentalImpactAssessment: z.boolean().optional(),
  usesRenewableEnergy: z.boolean().optional(),
  renewableEnergyDetails: z.string().optional(),
  wasteManagementPractices: z.string().optional(),
  hasCertifications: z.boolean().optional(),
  certificationDetails: z.string().optional(),

  // Challenges and support
  majorConstraints: z.string().optional(),
  disasterVulnerabilities: z.string().optional(),
  receivesGovernmentSupport: z.boolean().optional(),
  governmentSupportDetails: z.string().optional(),
  receivesNGOSupport: z.boolean().optional(),
  ngoSupportDetails: z.string().optional(),
  technicalSupportNeeds: z.string().optional(),

  // Future plans
  expansionPlans: z.string().optional(),
  diversificationPlans: z.string().optional(),
  technologyUpgradePlans: z.string().optional(),

  // Linkages to other entities
  linkedProcessingCenters: linkedEntitySchema.optional(),
  linkedWaterBodies: linkedEntitySchema.optional(),

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),

  // Geometry fields
  locationPoint: pointGeometrySchema.optional(),
  farmBoundary: polygonGeometrySchema.optional(),
  pondPolygons: multiPolygonGeometrySchema.optional(),

  // Verification
  isVerified: z.boolean().optional(),
});

// Update a fish farm
export const updateFishFarm = protectedProcedure
  .input(fishFarmUpdateSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update fish farms",
      });
    }

    try {
      // Check if fish farm exists
      const existing = await ctx.db
        .select({ id: fishFarm.id, slug: fishFarm.slug })
        .from(fishFarm)
        .where(eq(fishFarm.id, input.id));

      if (existing.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Fish farm not found",
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
            .select({ id: fishFarm.id })
            .from(fishFarm)
            .where(
              and(
                eq(fishFarm.slug, slug),
                ne(fishFarm.id, input.id), // Don't match our own record
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

      // Process farm boundary geometry if provided
      let farmBoundaryValue = undefined;
      if (input.farmBoundary) {
        const polygonGeoJson = JSON.stringify(input.farmBoundary);
        try {
          JSON.parse(polygonGeoJson); // Validate JSON
          farmBoundaryValue = sql`ST_GeomFromGeoJSON(${polygonGeoJson})`;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid farm boundary geometry GeoJSON",
          });
        }
      }

      // Process pond polygons geometry if provided
      let pondPolygonsValue = undefined;
      if (input.pondPolygons) {
        const multiPolygonGeoJson = JSON.stringify(input.pondPolygons);
        try {
          JSON.parse(multiPolygonGeoJson); // Validate JSON
          pondPolygonsValue = sql`ST_GeomFromGeoJSON(${multiPolygonGeoJson})`;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid pond polygons geometry GeoJSON",
          });
        }
      }

      // Process linked entities
      const linkedProcessingCenters = input.linkedProcessingCenters || [];
      const linkedWaterBodies = input.linkedWaterBodies || [];

      const now = new Date();

      // Handle verification status changes
      const wasVerifiedBefore = (await ctx.db
        .select({ isVerified: fishFarm.isVerified })
        .from(fishFarm)
        .where(eq(fishFarm.id, input.id))
        .then((result) => result[0].isVerified)) as boolean;

      const verificationChanged = wasVerifiedBefore !== input.isVerified;
      let verificationDate = undefined;
      let verifiedBy = undefined;

      if (verificationChanged && input.isVerified) {
        verificationDate = now;
        verifiedBy = ctx.user.id;
      }

      const updateData: any = {
        name: input.name,
        slug,
        description: input.description,
        farmType: input.farmType as any,

        // Location details
        wardNumber: input.wardNumber,
        location: input.location,
        address: input.address,

        // Physical details
        ownershipType: input.ownershipType as any,
        totalAreaInHectares: input.totalAreaInHectares,
        waterSurfaceAreaInHectares: input.waterSurfaceAreaInHectares,
        operationalSince: input.operationalSince,

        // Water body characteristics
        totalPondCount: input.totalPondCount,
        activePondCount: input.activePondCount,
        averagePondSizeInSquareMeters: input.averagePondSizeInSquareMeters,
        averageWaterDepthInMeters: input.averageWaterDepthInMeters,
        totalWaterVolumeInCubicMeters: input.totalWaterVolumeInCubicMeters,
        waterSource: input.waterSource as any,
        waterSourceDetails: input.waterSourceDetails,
        waterAvailabilityIssues: input.waterAvailabilityIssues,
        hasWaterQualityMonitoring: input.hasWaterQualityMonitoring,
        waterQualityParameters: input.waterQualityParameters,

        // Culture and management details
        cultureSystem: input.cultureSystem as any,
        primaryFishSpecies: input.primaryFishSpecies,
        secondaryFishSpecies: input.secondaryFishSpecies,
        seedSourceDetails: input.seedSourceDetails,
        stockingDensityPerSquareMeter: input.stockingDensityPerSquareMeter,
        growoutPeriodInMonths: input.growoutPeriodInMonths,
        feedingSystem: input.feedingSystem as any,
        feedTypes: input.feedTypes,
        feedConversionRatio: input.feedConversionRatio,
        annualFeedUsageInKg: input.annualFeedUsageInKg,

        // Water management
        waterManagementSystem: input.waterManagementSystem as any,
        usesProbiotics: input.usesProbiotics,
        usesAeration: input.usesAeration,
        aerationType: input.aerationType,
        waterExchangeFrequency: input.waterExchangeFrequency,
        waterExchangePercentage: input.waterExchangePercentage,
        effluentManagementDetails: input.effluentManagementDetails,

        // Production details
        annualProductionInKg: input.annualProductionInKg,
        averageYieldPerHectareInKg: input.averageYieldPerHectareInKg,
        survivalRatePercentage: input.survivalRatePercentage,
        averageFishSizeInGrams: input.averageFishSizeInGrams,
        recordedYearProduction: input.recordedYearProduction,
        productionCycles: input.productionCycles,

        // Infrastructure and equipment
        hasFarmHouse: input.hasFarmHouse,
        hasHatchery: input.hasHatchery,
        hatcheryCapacity: input.hatcheryCapacity,
        hasNursery: input.hasNursery,
        nurseryAreaInSquareMeters: input.nurseryAreaInSquareMeters,
        hasFeedStorage: input.hasFeedStorage,
        hasEquipment: input.hasEquipment,
        equipmentDetails: input.equipmentDetails,
        hasLaboratory: input.hasLaboratory,
        laboratoryPurpose: input.laboratoryPurpose,
        hasIceProduction: input.hasIceProduction,
        hasProcessingArea: input.hasProcessingArea,
        hasElectricity: input.hasElectricity,
        hasGenerator: input.hasGenerator,
        hasFencing: input.hasFencing,
        hasSecuritySystem: input.hasSecuritySystem,

        // Personnel and management
        ownerName: input.ownerName,
        ownerContact: input.ownerContact,
        managerName: input.managerName,
        managerContact: input.managerContact,
        technicalStaffCount: input.technicalStaffCount,
        regularStaffCount: input.regularStaffCount,
        seasonalLaborCount: input.seasonalLaborCount,
        hasTrainedStaff: input.hasTrainedStaff,
        trainingDetails: input.trainingDetails,

        // Economic aspects
        annualOperatingCostNPR: input.annualOperatingCostNPR,
        annualRevenueNPR: input.annualRevenueNPR,
        profitableOperation: input.profitableOperation,
        marketAccessDetails: input.marketAccessDetails,
        majorBuyerTypes: input.majorBuyerTypes,
        averageSellingPricePerKg: input.averageSellingPricePerKg,

        // Health management
        commonDiseases: input.commonDiseases,
        diseasePreventionMethods: input.diseasePreventionMethods,
        usesChemicals: input.usesChemicals,
        chemicalUsageDetails: input.chemicalUsageDetails,
        mortalityPercentage: input.mortalityPercentage,
        healthMonitoringFrequency: input.healthMonitoringFrequency,

        // Sustainability aspects
        hasEnvironmentalImpactAssessment:
          input.hasEnvironmentalImpactAssessment,
        usesRenewableEnergy: input.usesRenewableEnergy,
        renewableEnergyDetails: input.renewableEnergyDetails,
        wasteManagementPractices: input.wasteManagementPractices,
        hasCertifications: input.hasCertifications,
        certificationDetails: input.certificationDetails,

        // Challenges and support
        majorConstraints: input.majorConstraints,
        disasterVulnerabilities: input.disasterVulnerabilities,
        receivesGovernmentSupport: input.receivesGovernmentSupport,
        governmentSupportDetails: input.governmentSupportDetails,
        receivesNGOSupport: input.receivesNGOSupport,
        ngoSupportDetails: input.ngoSupportDetails,
        technicalSupportNeeds: input.technicalSupportNeeds,

        // Future plans
        expansionPlans: input.expansionPlans,
        diversificationPlans: input.diversificationPlans,
        technologyUpgradePlans: input.technologyUpgradePlans,

        // Linkages to other entities as JSON arrays
        linkedProcessingCenters:
          linkedProcessingCenters.length > 0
            ? sql`${JSON.stringify(linkedProcessingCenters)}::jsonb`
            : sql`'[]'::jsonb`,
        linkedWaterBodies:
          linkedWaterBodies.length > 0
            ? sql`${JSON.stringify(linkedWaterBodies)}::jsonb`
            : sql`'[]'::jsonb`,

        // SEO fields
        metaTitle: input.metaTitle || input.name,
        metaDescription: input.metaDescription,
        keywords: input.keywords,

        // Status and verification
        isVerified: input.isVerified,

        // Metadata
        updatedAt: now,
        updatedBy: ctx.user.id,
      };

      // Only add verification fields if verification status changed
      if (verificationDate !== undefined) {
        updateData.verificationDate = verificationDate;
      }

      if (verifiedBy !== undefined) {
        updateData.verifiedBy = verifiedBy;
      }

      // Only add geometry fields if they were provided
      if (locationPointValue !== undefined) {
        updateData.locationPoint = locationPointValue;
      }

      if (farmBoundaryValue !== undefined) {
        updateData.farmBoundary = farmBoundaryValue;
      }

      if (pondPolygonsValue !== undefined) {
        updateData.pondPolygons = pondPolygonsValue;
      }

      // Update the fish farm
      const result = await ctx.db
        .update(fishFarm)
        .set(updateData)
        .where(eq(fishFarm.id, input.id))
        .returning({
          id: fishFarm.id,
          slug: fishFarm.slug,
        });

      return {
        success: true,
        slug: result[0].slug,
      };
    } catch (error) {
      console.error("Error updating fish farm:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update fish farm",
      });
    }
  });
