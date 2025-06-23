import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import {
  Farm,
  farm,
} from "@/server/db/schema/profile/institutions/agricultural/farms";
import { generateSlug } from "@/server/utils/slug-helpers";
import { sql, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

// Define enums for farm input validation
const farmTypeEnum = [
  "CROP_FARM",
  "LIVESTOCK_FARM",
  "MIXED_FARM",
  "POULTRY_FARM",
  "DAIRY_FARM",
  "AQUACULTURE_FARM",
  "HORTICULTURE_FARM",
  "APICULTURE_FARM",
  "SERICULTURE_FARM",
  "ORGANIC_FARM",
  "COMMERCIAL_FARM",
  "SUBSISTENCE_FARM",
  "AGROFORESTRY",
  "OTHER",
];

const farmingSystemEnum = [
  "CONVENTIONAL",
  "ORGANIC",
  "INTEGRATED",
  "CONSERVATION",
  "HYDROPONIC",
  "PERMACULTURE",
  "BIODYNAMIC",
  "TRADITIONAL",
  "MIXED",
];

const irrigationTypeEnum = [
  "RAINFED",
  "CANAL",
  "DRIP",
  "SPRINKLER",
  "FLOOD",
  "GROUNDWATER",
  "RAINWATER_HARVESTING",
  "NONE",
  "MIXED",
];

const soilTypeEnum = [
  "CLAY",
  "SANDY",
  "LOAM",
  "SILT",
  "CLAY_LOAM",
  "SANDY_LOAM",
  "SILTY_CLAY",
  "ROCKY",
  "PEATY",
  "CHALKY",
  "MIXED",
];

const livestockHousingEnum = [
  "OPEN_SHED",
  "BARN",
  "FREE_STALL",
  "TIE_STALL",
  "DEEP_LITTER",
  "CAGE_SYSTEM",
  "FREE_RANGE",
  "MOVABLE_PEN",
  "ZERO_GRAZING",
  "MIXED",
];

const landOwnershipEnum = [
  "OWNED",
  "LEASED",
  "COMMUNITY",
  "SHARED",
  "GOVERNMENT",
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

// Define schema for farm creation
const farmSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Farm name is required"),
  slug: z.string().optional(), // Optional slug - will generate if not provided
  description: z.string().optional(),
  farmType: z.enum(farmTypeEnum as [string, ...string[]]),
  farmingSystem: z.enum(farmingSystemEnum as [string, ...string[]]).optional(),

  // Location details
  wardNumber: z.number().int().positive().optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Land details
  totalAreaInHectares: z.number().positive().optional(),
  cultivatedAreaInHectares: z.number().positive().optional(),
  landOwnership: z.enum(landOwnershipEnum as [string, ...string[]]).optional(),
  soilType: z.enum(soilTypeEnum as [string, ...string[]]).optional(),
  irrigationType: z
    .enum(irrigationTypeEnum as [string, ...string[]])
    .optional(),
  irrigationSourceDetails: z.string().optional(),
  irrigatedAreaInHectares: z.number().positive().optional(),

  // Crops
  mainCrops: z.string().optional(),
  secondaryCrops: z.string().optional(),
  cropRotation: z.boolean().optional(),
  cropRotationDetails: z.string().optional(),
  intercropping: z.boolean().optional(),
  croppingSeasons: z.string().optional(),
  annualCropYieldMT: z.number().positive().optional(),
  recordedYearCrops: z.string().length(4).optional(),

  // Livestock
  hasLivestock: z.boolean().optional(),
  livestockTypes: z.string().optional(),
  cattleCount: z.number().int().nonnegative().optional(),
  buffaloCount: z.number().int().nonnegative().optional(),
  goatCount: z.number().int().nonnegative().optional(),
  sheepCount: z.number().int().nonnegative().optional(),
  pigCount: z.number().int().nonnegative().optional(),
  poultryCount: z.number().int().nonnegative().optional(),
  otherLivestockCount: z.number().int().nonnegative().optional(),
  otherLivestockDetails: z.string().optional(),
  livestockHousingType: z
    .enum(livestockHousingEnum as [string, ...string[]])
    .optional(),
  livestockManagementDetails: z.string().optional(),
  annualMilkProductionLiters: z.number().nonnegative().optional(),
  annualEggProduction: z.number().int().nonnegative().optional(),
  annualMeatProductionKg: z.number().nonnegative().optional(),
  recordedYearLivestock: z.string().length(4).optional(),

  // Farmer details
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  farmerType: z.string().optional(),
  farmerEducation: z.string().optional(),
  farmerExperienceYears: z.number().int().nonnegative().optional(),
  hasCooperativeMembership: z.boolean().optional(),
  cooperativeName: z.string().optional(),

  // Labor and economics
  familyLaborCount: z.number().int().nonnegative().optional(),
  hiredLaborCount: z.number().int().nonnegative().optional(),
  annualInvestmentNPR: z.number().nonnegative().optional(),
  annualIncomeNPR: z.number().nonnegative().optional(),
  profitableOperation: z.boolean().optional(),
  marketAccessDetails: z.string().optional(),
  majorBuyerTypes: z.string().optional(),

  // Infrastructure
  hasFarmHouse: z.boolean().optional(),
  hasStorage: z.boolean().optional(),
  storageCapacityMT: z.number().nonnegative().optional(),
  hasFarmEquipment: z.boolean().optional(),
  equipmentDetails: z.string().optional(),
  hasElectricity: z.boolean().optional(),
  hasRoadAccess: z.boolean().optional(),
  roadAccessType: z.string().optional(),

  // Sustainability and practices
  usesChemicalFertilizer: z.boolean().optional(),
  usesPesticides: z.boolean().optional(),
  usesOrganicMethods: z.boolean().optional(),
  composting: z.boolean().optional(),
  soilConservationPractices: z.string().optional(),
  rainwaterHarvesting: z.boolean().optional(),
  manureManagement: z.string().optional(),
  hasCertifications: z.boolean().optional(),
  certificationDetails: z.string().optional(),

  // Technical support and training
  receivesExtensionServices: z.boolean().optional(),
  extensionServiceProvider: z.string().optional(),
  trainingReceived: z.string().optional(),
  technicalSupportNeeds: z.string().optional(),

  // Challenges and opportunities
  majorChallenges: z.string().optional(),
  disasterVulnerabilities: z.string().optional(),
  growthOpportunities: z.string().optional(),
  futureExpansionPlans: z.string().optional(),

  // Linkages to other entities
  linkedGrazingAreas: linkedEntitySchema.optional(),
  linkedProcessingCenters: linkedEntitySchema.optional(),
  linkedAgricZones: linkedEntitySchema.optional(),
  linkedGrasslands: linkedEntitySchema.optional(),

  // Geometry fields
  locationPoint: pointGeometrySchema.optional(),
  farmBoundary: polygonGeometrySchema.optional(),

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),

  // Verification
  isVerified: z.boolean().optional(),
});

// Create a new farm
export const createFarm = protectedProcedure
  .input(farmSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create farms",
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
          .select({ id: farm.id })
          .from(farm)
          .where(eq(farm.slug, slug))
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

      // Process linked entities
      const linkedGrazingAreas = input.linkedGrazingAreas || [];
      const linkedProcessingCenters = input.linkedProcessingCenters || [];
      const linkedAgricZones = input.linkedAgricZones || [];
      const linkedGrasslands = input.linkedGrasslands || [];

      // Use a transaction for data consistency
      return await ctx.db.transaction(async (tx) => {
        // Insert the farm
        const insertedFarm = await tx
          .insert(farm)
          .values({
            id,
            name: input.name,
            slug,
            description: input.description,
            farmType: input.farmType as any,
            farmingSystem: input.farmingSystem as any,

            // Location details
            wardNumber: input.wardNumber,
            location: input.location,
            address: input.address,

            // Land details
            totalAreaInHectares: input.totalAreaInHectares,
            cultivatedAreaInHectares: input.cultivatedAreaInHectares,
            landOwnership: input.landOwnership as any,
            soilType: input.soilType as any,
            irrigationType: input.irrigationType as any,
            irrigationSourceDetails: input.irrigationSourceDetails,
            irrigatedAreaInHectares: input.irrigatedAreaInHectares,

            // Crops
            mainCrops: input.mainCrops,
            secondaryCrops: input.secondaryCrops,
            cropRotation: input.cropRotation || false,
            cropRotationDetails: input.cropRotationDetails,
            intercropping: input.intercropping || false,
            croppingSeasons: input.croppingSeasons,
            annualCropYieldMT: input.annualCropYieldMT,
            recordedYearCrops: input.recordedYearCrops,

            // Livestock
            hasLivestock: input.hasLivestock || false,
            livestockTypes: input.livestockTypes,
            cattleCount: input.cattleCount,
            buffaloCount: input.buffaloCount,
            goatCount: input.goatCount,
            sheepCount: input.sheepCount,
            pigCount: input.pigCount,
            poultryCount: input.poultryCount,
            otherLivestockCount: input.otherLivestockCount,
            otherLivestockDetails: input.otherLivestockDetails,
            livestockHousingType: input.livestockHousingType as any,
            livestockManagementDetails: input.livestockManagementDetails,
            annualMilkProductionLiters: input.annualMilkProductionLiters,
            annualEggProduction: input.annualEggProduction,
            annualMeatProductionKg: input.annualMeatProductionKg,
            recordedYearLivestock: input.recordedYearLivestock,

            // Farmer details
            ownerName: input.ownerName,
            ownerContact: input.ownerContact,
            farmerType: input.farmerType,
            farmerEducation: input.farmerEducation,
            farmerExperienceYears: input.farmerExperienceYears,
            hasCooperativeMembership: input.hasCooperativeMembership || false,
            cooperativeName: input.cooperativeName,

            // Labor and economics
            familyLaborCount: input.familyLaborCount,
            hiredLaborCount: input.hiredLaborCount,
            annualInvestmentNPR: input.annualInvestmentNPR,
            annualIncomeNPR: input.annualIncomeNPR,
            profitableOperation: input.profitableOperation ?? true,
            marketAccessDetails: input.marketAccessDetails,
            majorBuyerTypes: input.majorBuyerTypes,

            // Infrastructure
            hasFarmHouse: input.hasFarmHouse || false,
            hasStorage: input.hasStorage || false,
            storageCapacityMT: input.storageCapacityMT,
            hasFarmEquipment: input.hasFarmEquipment || false,
            equipmentDetails: input.equipmentDetails,
            hasElectricity: input.hasElectricity || false,
            hasRoadAccess: input.hasRoadAccess || false,
            roadAccessType: input.roadAccessType,

            // Sustainability and practices
            usesChemicalFertilizer: input.usesChemicalFertilizer || false,
            usesPesticides: input.usesPesticides || false,
            usesOrganicMethods: input.usesOrganicMethods || false,
            composting: input.composting || false,
            soilConservationPractices: input.soilConservationPractices,
            rainwaterHarvesting: input.rainwaterHarvesting || false,
            manureManagement: input.manureManagement,
            hasCertifications: input.hasCertifications || false,
            certificationDetails: input.certificationDetails,

            // Technical support and training
            receivesExtensionServices: input.receivesExtensionServices || false,
            extensionServiceProvider: input.extensionServiceProvider,
            trainingReceived: input.trainingReceived,
            technicalSupportNeeds: input.technicalSupportNeeds,

            // Challenges and opportunities
            majorChallenges: input.majorChallenges,
            disasterVulnerabilities: input.disasterVulnerabilities,
            growthOpportunities: input.growthOpportunities,
            futureExpansionPlans: input.futureExpansionPlans,

            // Linkages to other entities as JSON arrays
            linkedGrazingAreas:
              linkedGrazingAreas.length > 0
                ? sql`${JSON.stringify(linkedGrazingAreas)}::jsonb`
                : sql`'[]'::jsonb`,
            linkedProcessingCenters:
              linkedProcessingCenters.length > 0
                ? sql`${JSON.stringify(linkedProcessingCenters)}::jsonb`
                : sql`'[]'::jsonb`,
            linkedAgricZones:
              linkedAgricZones.length > 0
                ? sql`${JSON.stringify(linkedAgricZones)}::jsonb`
                : sql`'[]'::jsonb`,
            linkedGrasslands:
              linkedGrasslands.length > 0
                ? sql`${JSON.stringify(linkedGrasslands)}::jsonb`
                : sql`'[]'::jsonb`,

            // Geometry fields with SQL expression values
            locationPoint: locationPointValue
              ? sql`${locationPointValue}`
              : null,
            farmBoundary: farmBoundaryValue ? sql`${farmBoundaryValue}` : null,

            // SEO fields
            metaTitle: input.metaTitle || input.name,
            metaDescription:
              input.metaDescription ||
              input.description?.substring(0, 160) ||
              `Information about ${input.name} farm`,
            keywords:
              input.keywords ||
              `${input.name}, ${input.farmType.toLowerCase().replace("_", " ")}, farm, agriculture, ${
                input.mainCrops || ""
              }, ${input.livestockTypes || ""}`,

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
          } as unknown as Farm)
          .returning({
            id: farm.id,
          });

        return { id, slug, success: true };
      });
    } catch (error) {
      console.error("Error creating farm:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create farm",
        cause: error,
      });
    }
  });
