import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import {
  ReligiousPlace,
  religiousPlace,
} from "@/server/db/schema/profile/institutions/cultural/religiousPlaces";
import { generateSlug } from "@/server/utils/slug-helpers";
import { sql, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

// Define enums for religious place input validation
const religiousPlaceTypeEnum = [
  "HINDU_TEMPLE",
  "BUDDHIST_TEMPLE",
  "MOSQUE",
  "CHURCH",
  "GURUDWARA",
  "SHRINE",
  "MONASTERY",
  "SYNAGOGUE",
  "JAIN_TEMPLE",
  "MEDITATION_CENTER",
  "PAGODA",
  "SACRED_GROVE",
  "SACRED_POND",
  "SACRED_RIVER",
  "SACRED_HILL",
  "PRAYER_HALL",
  "RELIGIOUS_COMPLEX",
  "OTHER",
];

const architecturalStyleEnum = [
  "TRADITIONAL_NEPALI",
  "PAGODA",
  "STUPA",
  "SHIKHARA",
  "MODERN",
  "COLONIAL",
  "GOTHIC",
  "MUGHAL",
  "DOME",
  "MIXED",
  "VERNACULAR",
  "OTHER",
];

const constructionMaterialEnum = [
  "STONE",
  "BRICK",
  "WOOD",
  "MUD",
  "CONCRETE",
  "MARBLE",
  "METAL",
  "MIXED",
  "OTHER",
];

const religiousSignificanceEnum = [
  "LOCAL",
  "REGIONAL",
  "NATIONAL",
  "INTERNATIONAL",
];

const preservationStatusEnum = [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "DAMAGED",
  "UNDER_RENOVATION",
  "REBUILT",
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

// Define schema for religious place creation
const religiousPlaceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(), // Optional slug - will generate if not provided
  description: z.string().optional(),
  type: z.enum(religiousPlaceTypeEnum as [string, ...string[]]),

  // Location details
  wardNumber: z.number().int().positive().optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical details
  areaInSquareMeters: z.number().positive().optional(),
  architecturalStyle: z
    .enum(architecturalStyleEnum as [string, ...string[]])
    .optional(),
  constructionMaterial: z
    .enum(constructionMaterialEnum as [string, ...string[]])
    .optional(),
  yearEstablished: z.number().int().optional(),
  yearRenovated: z.number().int().optional(),

  // Religious details
  mainDeity: z.string().optional(),
  secondaryDeities: z.string().optional(),
  religiousTradition: z.string().optional(),
  religiousSignificance: z
    .enum(religiousSignificanceEnum as [string, ...string[]])
    .optional(),
  religiousStory: z.string().optional(),

  // Cultural and historical significance
  historicalSignificance: z.string().optional(),
  culturalSignificance: z.string().optional(),
  isHeritageSite: z.boolean().optional(),
  heritageDesignation: z.string().optional(),
  inscriptions: z.string().optional(),
  hasArchaeologicalValue: z.boolean().optional(),
  archaeologicalDetails: z.string().optional(),

  // Management and operations
  managedBy: z.string().optional(),
  contactPerson: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  websiteUrl: z.string().optional(),
  dailyOpeningTime: z.string().optional(),
  dailyClosingTime: z.string().optional(),
  isOpenAllDay: z.boolean().optional(),
  weeklyClosedDays: z.string().optional(),
  entryFeeNPR: z.number().int().nonnegative().optional(),
  entryFeeDetailsForeigners: z.string().optional(),

  // Physical infrastructure
  totalBuildingCount: z.number().int().nonnegative().optional(),
  hasMainHall: z.boolean().optional(),
  mainHallCapacity: z.number().int().positive().optional(),
  hasCommunitySpace: z.boolean().optional(),
  hasAccommodation: z.boolean().optional(),
  accommodationCapacity: z.number().int().positive().optional(),
  hasKitchen: z.boolean().optional(),
  hasDiningHall: z.boolean().optional(),
  diningCapacity: z.number().int().positive().optional(),
  hasLibrary: z.boolean().optional(),
  hasMuseum: z.boolean().optional(),

  // Facilities and amenities
  hasParking: z.boolean().optional(),
  parkingCapacity: z.number().int().positive().optional(),
  hasToilets: z.boolean().optional(),
  hasHandicapAccess: z.boolean().optional(),
  hasElectricity: z.boolean().optional(),
  hasWaterSupply: z.boolean().optional(),
  hasDrinkingWater: z.boolean().optional(),
  hasFootwear: z.boolean().optional(),
  hasClothStorage: z.boolean().optional(),

  // Preservation and restoration
  preservationStatus: z
    .enum(preservationStatusEnum as [string, ...string[]])
    .optional(),
  lastRestorationYear: z.number().int().optional(),
  restorationDetails: z.string().optional(),
  hasRegularMaintenance: z.boolean().optional(),
  maintenanceDetails: z.string().optional(),
  fundingSource: z.string().optional(),

  // Religious activities
  regularPrayers: z.string().optional(),
  specialRituals: z.string().optional(),
  annualFestivals: z.string().optional(),
  festivalMonths: z.string().optional(),
  festivalDetails: z.string().optional(),
  specialOfferings: z.string().optional(),

  // Visitor information
  estimatedDailyVisitors: z.number().int().nonnegative().optional(),
  estimatedYearlyVisitors: z.number().int().nonnegative().optional(),
  peakVisitationMonths: z.string().optional(),
  hasOverseasVisitors: z.boolean().optional(),
  guidesAvailable: z.boolean().optional(),
  visitorDressCode: z.string().optional(),
  photoAllowed: z.boolean().optional(),
  photoRestrictions: z.string().optional(),

  // Community engagement
  communityBenefits: z.string().optional(),
  socialServicesOffered: z.string().optional(),
  educationalActivities: z.string().optional(),

  // Economic aspects
  hasShops: z.boolean().optional(),
  shopCount: z.number().int().nonnegative().optional(),
  shopTypes: z.string().optional(),
  economicImpact: z.string().optional(),
  totalAnnualRevenue: z.number().nonnegative().optional(),
  annualOperatingBudget: z.number().nonnegative().optional(),

  // Environmental aspects
  hasGarden: z.boolean().optional(),
  gardenAreaInSquareMeters: z.number().positive().optional(),
  hasSignificantTrees: z.boolean().optional(),
  significantTreeDetails: z.string().optional(),
  hasWaterBody: z.boolean().optional(),
  waterBodyDetails: z.string().optional(),

  // Safety and security
  hasSecurityPersonnel: z.boolean().optional(),
  hasCCTV: z.boolean().optional(),
  hasFireSafety: z.boolean().optional(),
  disasterPreparedness: z.string().optional(),

  // Artworks and treasures
  hasSignificantArtwork: z.boolean().optional(),
  artworkDetails: z.string().optional(),
  hasHistoricalArtifacts: z.boolean().optional(),
  artifactsDetails: z.string().optional(),
  hasRegisteredTreasures: z.boolean().optional(),
  treasureDetails: z.string().optional(),

  // Challenges and needs
  currentChallenges: z.string().optional(),
  conservationNeeds: z.string().optional(),
  developmentPlans: z.string().optional(),

  // Linkages to other entities
  linkedCulturalEvents: linkedEntitySchema.optional(),
  linkedCulturalOrganizations: linkedEntitySchema.optional(),

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),

  // Geometry fields
  locationPoint: pointGeometrySchema.optional(),
  complexBoundary: polygonGeometrySchema.optional(),

  // Verification
  isVerified: z.boolean().optional(),
});

// Create a new religious place
export const createReligiousPlace = protectedProcedure
  .input(religiousPlaceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create religious places",
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
          .select({ id: religiousPlace.id })
          .from(religiousPlace)
          .where(eq(religiousPlace.slug, slug))
          .limit(1);

        if (existingSlug.length === 0) {
          slugExists = false;
        } else {
          slug = `${baseSlug}-${slugCounter}`;
          slugCounter++;
        }
      }

      // Process location point geometry if provided
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

      // Process complex boundary geometry if provided
      let complexBoundaryValue = null;
      if (input.complexBoundary) {
        const polygonGeoJson = JSON.stringify(input.complexBoundary);
        try {
          JSON.parse(polygonGeoJson); // Validate JSON
          complexBoundaryValue = sql`ST_GeomFromGeoJSON(${polygonGeoJson})`;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid complex boundary geometry GeoJSON",
          });
        }
      }

      // Process linked entities
      const linkedCulturalEvents = input.linkedCulturalEvents || [];
      const linkedCulturalOrganizations =
        input.linkedCulturalOrganizations || [];

      // Use a transaction for data consistency
      return await ctx.db.transaction(async (tx) => {
        // Insert the religious place
        await tx.insert(religiousPlace).values({
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
          architecturalStyle: input.architecturalStyle as any,
          constructionMaterial: input.constructionMaterial as any,
          yearEstablished: input.yearEstablished,
          yearRenovated: input.yearRenovated,

          // Religious details
          mainDeity: input.mainDeity,
          secondaryDeities: input.secondaryDeities,
          religiousTradition: input.religiousTradition,
          religiousSignificance: input.religiousSignificance as any,
          religiousStory: input.religiousStory,

          // Cultural and historical significance
          historicalSignificance: input.historicalSignificance,
          culturalSignificance: input.culturalSignificance,
          isHeritageSite: input.isHeritageSite || false,
          heritageDesignation: input.heritageDesignation,
          inscriptions: input.inscriptions,
          hasArchaeologicalValue: input.hasArchaeologicalValue || false,
          archaeologicalDetails: input.archaeologicalDetails,

          // Management and operations
          managedBy: input.managedBy,
          contactPerson: input.contactPerson,
          contactPhone: input.contactPhone,
          contactEmail: input.contactEmail,
          websiteUrl: input.websiteUrl,
          dailyOpeningTime: input.dailyOpeningTime,
          dailyClosingTime: input.dailyClosingTime,
          isOpenAllDay: input.isOpenAllDay || false,
          weeklyClosedDays: input.weeklyClosedDays,
          entryFeeNPR: input.entryFeeNPR,
          entryFeeDetailsForeigners: input.entryFeeDetailsForeigners,

          // Physical infrastructure
          totalBuildingCount: input.totalBuildingCount,
          hasMainHall: input.hasMainHall || false,
          mainHallCapacity: input.mainHallCapacity,
          hasCommunitySpace: input.hasCommunitySpace || false,
          hasAccommodation: input.hasAccommodation || false,
          accommodationCapacity: input.accommodationCapacity,
          hasKitchen: input.hasKitchen || false,
          hasDiningHall: input.hasDiningHall || false,
          diningCapacity: input.diningCapacity,
          hasLibrary: input.hasLibrary || false,
          hasMuseum: input.hasMuseum || false,

          // Facilities and amenities
          hasParking: input.hasParking || false,
          parkingCapacity: input.parkingCapacity,
          hasToilets: input.hasToilets || false,
          hasHandicapAccess: input.hasHandicapAccess || false,
          hasElectricity:
            input.hasElectricity !== undefined ? input.hasElectricity : true,
          hasWaterSupply:
            input.hasWaterSupply !== undefined ? input.hasWaterSupply : true,
          hasDrinkingWater: input.hasDrinkingWater || false,
          hasFootwear: input.hasFootwear || false,
          hasClothStorage: input.hasClothStorage || false,

          // Preservation and restoration
          preservationStatus: input.preservationStatus as any,
          lastRestorationYear: input.lastRestorationYear,
          restorationDetails: input.restorationDetails,
          hasRegularMaintenance: input.hasRegularMaintenance || false,
          maintenanceDetails: input.maintenanceDetails,
          fundingSource: input.fundingSource,

          // Religious activities
          regularPrayers: input.regularPrayers,
          specialRituals: input.specialRituals,
          annualFestivals: input.annualFestivals,
          festivalMonths: input.festivalMonths,
          festivalDetails: input.festivalDetails,
          specialOfferings: input.specialOfferings,

          // Visitor information
          estimatedDailyVisitors: input.estimatedDailyVisitors,
          estimatedYearlyVisitors: input.estimatedYearlyVisitors,
          peakVisitationMonths: input.peakVisitationMonths,
          hasOverseasVisitors: input.hasOverseasVisitors || false,
          guidesAvailable: input.guidesAvailable || false,
          visitorDressCode: input.visitorDressCode,
          photoAllowed:
            input.photoAllowed !== undefined ? input.photoAllowed : true,
          photoRestrictions: input.photoRestrictions,

          // Community engagement
          communityBenefits: input.communityBenefits,
          socialServicesOffered: input.socialServicesOffered,
          educationalActivities: input.educationalActivities,

          // Economic aspects
          hasShops: input.hasShops || false,
          shopCount: input.shopCount,
          shopTypes: input.shopTypes,
          economicImpact: input.economicImpact,
          totalAnnualRevenue: input.totalAnnualRevenue,
          annualOperatingBudget: input.annualOperatingBudget,

          // Environmental aspects
          hasGarden: input.hasGarden || false,
          gardenAreaInSquareMeters: input.gardenAreaInSquareMeters,
          hasSignificantTrees: input.hasSignificantTrees || false,
          significantTreeDetails: input.significantTreeDetails,
          hasWaterBody: input.hasWaterBody || false,
          waterBodyDetails: input.waterBodyDetails,

          // Safety and security
          hasSecurityPersonnel: input.hasSecurityPersonnel || false,
          hasCCTV: input.hasCCTV || false,
          hasFireSafety: input.hasFireSafety || false,
          disasterPreparedness: input.disasterPreparedness,

          // Artworks and treasures
          hasSignificantArtwork: input.hasSignificantArtwork || false,
          artworkDetails: input.artworkDetails,
          hasHistoricalArtifacts: input.hasHistoricalArtifacts || false,
          artifactsDetails: input.artifactsDetails,
          hasRegisteredTreasures: input.hasRegisteredTreasures || false,
          treasureDetails: input.treasureDetails,

          // Challenges and needs
          currentChallenges: input.currentChallenges,
          conservationNeeds: input.conservationNeeds,
          developmentPlans: input.developmentPlans,

          // Linkages to other entities
          linkedCulturalEvents:
            linkedCulturalEvents.length > 0
              ? sql`${JSON.stringify(linkedCulturalEvents)}::jsonb`
              : sql`'[]'::jsonb`,
          linkedCulturalOrganizations:
            linkedCulturalOrganizations.length > 0
              ? sql`${JSON.stringify(linkedCulturalOrganizations)}::jsonb`
              : sql`'[]'::jsonb`,

          // SEO fields
          metaTitle: input.metaTitle || input.name,
          metaDescription:
            input.metaDescription ||
            input.description?.substring(0, 160) ||
            `Information about ${input.name}`,
          keywords:
            input.keywords ||
            `${input.name}, ${input.type.toLowerCase().replace("_", " ")}, religious place, ${
              input.mainDeity || ""
            }`,

          // Geometry fields
          locationPoint: locationPointValue ? sql`${locationPointValue}` : null,
          complexBoundary: complexBoundaryValue
            ? sql`${complexBoundaryValue}`
            : null,

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
        } as unknown as ReligiousPlace);

        return { id, slug, success: true };
      });
    } catch (error) {
      console.error("Error creating religious place:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create religious place",
        cause: error,
      });
    }
  });
