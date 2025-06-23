import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import {
  FishFarm,
  fishFarm,
} from "@/server/db/schema/profile/institutions/agricultural/fishFarms";
import { generateSlug } from "@/server/utils/slug-helpers";
import { sql, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

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

// Define schema for fish farm creation
const fishFarmSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Farm name is required"),
  slug: z.string().optional(), // Optional slug - will generate if not provided
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

// Create a new fish farm
export const createFishFarm = protectedProcedure
  .input(fishFarmSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create fish farms",
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
          .select({ id: fishFarm.id })
          .from(fishFarm)
          .where(eq(fishFarm.slug, slug))
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
      let farmBoundaryValue = null;
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

      // Process multipolygon geometry (pond polygons) if provided
      let pondPolygonsValue = null;
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

      // Use a transaction for data consistency
      return await ctx.db.transaction(async (tx) => {
        // Insert the fish farm
        const insertedFishFarm = await tx
          .insert(fishFarm)
          .values({
            id,
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
            hasWaterQualityMonitoring: input.hasWaterQualityMonitoring || false,
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
            usesProbiotics: input.usesProbiotics || false,
            usesAeration: input.usesAeration || false,
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
            hasFarmHouse: input.hasFarmHouse || false,
            hasHatchery: input.hasHatchery || false,
            hatcheryCapacity: input.hatcheryCapacity,
            hasNursery: input.hasNursery || false,
            nurseryAreaInSquareMeters: input.nurseryAreaInSquareMeters,
            hasFeedStorage: input.hasFeedStorage || false,
            hasEquipment: input.hasEquipment || false,
            equipmentDetails: input.equipmentDetails,
            hasLaboratory: input.hasLaboratory || false,
            laboratoryPurpose: input.laboratoryPurpose,
            hasIceProduction: input.hasIceProduction || false,
            hasProcessingArea: input.hasProcessingArea || false,
            hasElectricity: input.hasElectricity || false,
            hasGenerator: input.hasGenerator || false,
            hasFencing: input.hasFencing || false,
            hasSecuritySystem: input.hasSecuritySystem || false,

            // Personnel and management
            ownerName: input.ownerName,
            ownerContact: input.ownerContact,
            managerName: input.managerName,
            managerContact: input.managerContact,
            technicalStaffCount: input.technicalStaffCount,
            regularStaffCount: input.regularStaffCount,
            seasonalLaborCount: input.seasonalLaborCount,
            hasTrainedStaff: input.hasTrainedStaff || false,
            trainingDetails: input.trainingDetails,

            // Economic aspects
            annualOperatingCostNPR: input.annualOperatingCostNPR,
            annualRevenueNPR: input.annualRevenueNPR,
            profitableOperation: input.profitableOperation ?? true,
            marketAccessDetails: input.marketAccessDetails,
            majorBuyerTypes: input.majorBuyerTypes,
            averageSellingPricePerKg: input.averageSellingPricePerKg,

            // Health management
            commonDiseases: input.commonDiseases,
            diseasePreventionMethods: input.diseasePreventionMethods,
            usesChemicals: input.usesChemicals || false,
            chemicalUsageDetails: input.chemicalUsageDetails,
            mortalityPercentage: input.mortalityPercentage,
            healthMonitoringFrequency: input.healthMonitoringFrequency,

            // Sustainability aspects
            hasEnvironmentalImpactAssessment:
              input.hasEnvironmentalImpactAssessment || false,
            usesRenewableEnergy: input.usesRenewableEnergy || false,
            renewableEnergyDetails: input.renewableEnergyDetails,
            wasteManagementPractices: input.wasteManagementPractices,
            hasCertifications: input.hasCertifications || false,
            certificationDetails: input.certificationDetails,

            // Challenges and support
            majorConstraints: input.majorConstraints,
            disasterVulnerabilities: input.disasterVulnerabilities,
            receivesGovernmentSupport: input.receivesGovernmentSupport || false,
            governmentSupportDetails: input.governmentSupportDetails,
            receivesNGOSupport: input.receivesNGOSupport || false,
            ngoSupportDetails: input.ngoSupportDetails,
            technicalSupportNeeds: input.technicalSupportNeeds,

            // Future plans
            expansionPlans: input.expansionPlans,
            diversificationPlans: input.diversificationPlans,
            technologyUpgradePlans: input.technologyUpgradePlans,

            // Linkages to other entities
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
            metaDescription:
              input.metaDescription ||
              input.description?.substring(0, 160) ||
              `Information about ${input.name} fish farm`,
            keywords:
              input.keywords ||
              `${input.name}, ${input.farmType.toLowerCase().replace("_", " ")}, fish farm, aquaculture, ${
                input.primaryFishSpecies || ""
              }`,

            // Geometry fields
            locationPoint: locationPointValue
              ? sql`${locationPointValue}`
              : null,
            farmBoundary: farmBoundaryValue ? sql`${farmBoundaryValue}` : null,
            pondPolygons: pondPolygonsValue ? sql`${pondPolygonsValue}` : null,

            // Status and verification
            isActive: true,
            isVerified: input.isVerified || false,
            verificationDate: input.isVerified ? now : null,
            verifiedBy: input.isVerified ? ctx.user.id : null,

            // Metadata
            createdAt: now,
            updatedAt: now,
            createdBy: ctx.user.id,
            updatedBy: ctx.user.id,
          } as unknown as FishFarm)
          .returning({
            id: fishFarm.id,
          });

        return { id, slug, success: true };
      });
    } catch (error) {
      console.error("Error creating fish farm:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create fish farm",
        cause: error,
      });
    }
  });
