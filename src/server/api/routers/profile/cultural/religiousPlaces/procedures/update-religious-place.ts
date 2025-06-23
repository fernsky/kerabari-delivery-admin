import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { religiousPlace } from "@/server/db/schema/profile/institutions/cultural/religiousPlaces";
import { generateSlug } from "@/server/utils/slug-helpers";
import { and, eq, ne, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

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

// Define schema for religious place update
const updateReligiousPlaceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(), // Optional slug - will regenerate if name changes
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

  // Status
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),

  // Original values for tracking changes
  originalName: z.string().optional(),
  originalSlug: z.string().optional(),
});

// Update a religious place
export const updateReligiousPlace = protectedProcedure
  .input(updateReligiousPlaceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update religious places",
      });
    }

    try {
      // Check if religious place exists
      const existing = await ctx.db
        .select({ id: religiousPlace.id, slug: religiousPlace.slug })
        .from(religiousPlace)
        .where(eq(religiousPlace.id, input.id));

      if (existing.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Religious place not found",
        });
      }

      // Handle slug
      let slug = input.slug || existing[0].slug;

      // If name changed but slug wasn't explicitly provided, regenerate slug with romanization
      if (
        !input.slug &&
        input.name &&
        input.originalName &&
        input.name !== input.originalName
      ) {
        const baseSlug = generateSlug(input.name);

        // Check if new slug would conflict with existing ones (except our own)
        let slugExists = true;
        let slugCounter = 1;
        slug = baseSlug;

        while (slugExists) {
          const existingSlug = await ctx.db
            .select({ id: religiousPlace.id })
            .from(religiousPlace)
            .where(
              and(
                eq(religiousPlace.slug, slug),
                ne(religiousPlace.id, input.id), // Don't match our own record
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

      // Process complex boundary geometry if provided
      let complexBoundaryValue = undefined;
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

      const now = new Date();

      // Handle verification status changes
      const wasVerifiedBefore = (await ctx.db
        .select({ isVerified: religiousPlace.isVerified })
        .from(religiousPlace)
        .where(eq(religiousPlace.id, input.id))
        .then((result) => result[0].isVerified)) as boolean;

      const verificationChanged = wasVerifiedBefore !== input.isVerified;
      let verificationDate = undefined;
      let verifiedBy = undefined;

      if (verificationChanged && input.isVerified) {
        verificationDate = now;
        verifiedBy = ctx.user.id;
      }

      // Prepare update data object
      const updateData: any = {
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
        isHeritageSite: input.isHeritageSite,
        heritageDesignation: input.heritageDesignation,
        inscriptions: input.inscriptions,
        hasArchaeologicalValue: input.hasArchaeologicalValue,
        archaeologicalDetails: input.archaeologicalDetails,

        // Management and operations
        managedBy: input.managedBy,
        contactPerson: input.contactPerson,
        contactPhone: input.contactPhone,
        contactEmail: input.contactEmail,
        websiteUrl: input.websiteUrl,
        dailyOpeningTime: input.dailyOpeningTime,
        dailyClosingTime: input.dailyClosingTime,
        isOpenAllDay: input.isOpenAllDay,
        weeklyClosedDays: input.weeklyClosedDays,
        entryFeeNPR: input.entryFeeNPR,
        entryFeeDetailsForeigners: input.entryFeeDetailsForeigners,

        // Physical infrastructure
        totalBuildingCount: input.totalBuildingCount,
        hasMainHall: input.hasMainHall,
        mainHallCapacity: input.mainHallCapacity,
        hasCommunitySpace: input.hasCommunitySpace,
        hasAccommodation: input.hasAccommodation,
        accommodationCapacity: input.accommodationCapacity,
        hasKitchen: input.hasKitchen,
        hasDiningHall: input.hasDiningHall,
        diningCapacity: input.diningCapacity,
        hasLibrary: input.hasLibrary,
        hasMuseum: input.hasMuseum,

        // Facilities and amenities
        hasParking: input.hasParking,
        parkingCapacity: input.parkingCapacity,
        hasToilets: input.hasToilets,
        hasHandicapAccess: input.hasHandicapAccess,
        hasElectricity: input.hasElectricity,
        hasWaterSupply: input.hasWaterSupply,
        hasDrinkingWater: input.hasDrinkingWater,
        hasFootwear: input.hasFootwear,
        hasClothStorage: input.hasClothStorage,

        // Preservation and restoration
        preservationStatus: input.preservationStatus as any,
        lastRestorationYear: input.lastRestorationYear,
        restorationDetails: input.restorationDetails,
        hasRegularMaintenance: input.hasRegularMaintenance,
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
        hasOverseasVisitors: input.hasOverseasVisitors,
        guidesAvailable: input.guidesAvailable,
        visitorDressCode: input.visitorDressCode,
        photoAllowed: input.photoAllowed,
        photoRestrictions: input.photoRestrictions,

        // Community engagement
        communityBenefits: input.communityBenefits,
        socialServicesOffered: input.socialServicesOffered,
        educationalActivities: input.educationalActivities,

        // Economic aspects
        hasShops: input.hasShops,
        shopCount: input.shopCount,
        shopTypes: input.shopTypes,
        economicImpact: input.economicImpact,
        totalAnnualRevenue: input.totalAnnualRevenue,
        annualOperatingBudget: input.annualOperatingBudget,

        // Environmental aspects
        hasGarden: input.hasGarden,
        gardenAreaInSquareMeters: input.gardenAreaInSquareMeters,
        hasSignificantTrees: input.hasSignificantTrees,
        significantTreeDetails: input.significantTreeDetails,
        hasWaterBody: input.hasWaterBody,
        waterBodyDetails: input.waterBodyDetails,

        // Safety and security
        hasSecurityPersonnel: input.hasSecurityPersonnel,
        hasCCTV: input.hasCCTV,
        hasFireSafety: input.hasFireSafety,
        disasterPreparedness: input.disasterPreparedness,

        // Artworks and treasures
        hasSignificantArtwork: input.hasSignificantArtwork,
        artworkDetails: input.artworkDetails,
        hasHistoricalArtifacts: input.hasHistoricalArtifacts,
        artifactsDetails: input.artifactsDetails,
        hasRegisteredTreasures: input.hasRegisteredTreasures,
        treasureDetails: input.treasureDetails,

        // Challenges and needs
        currentChallenges: input.currentChallenges,
        conservationNeeds: input.conservationNeeds,
        developmentPlans: input.developmentPlans,

        // Linkages to other entities as JSON arrays
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
        metaDescription: input.metaDescription,
        keywords: input.keywords,

        // Status and verification
        isVerified: input.isVerified,
        isActive: input.isActive !== undefined ? input.isActive : true,

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

      if (complexBoundaryValue !== undefined) {
        updateData.complexBoundary = complexBoundaryValue;
      }

      // Update the religious place
      const result = await ctx.db
        .update(religiousPlace)
        .set(updateData)
        .where(eq(religiousPlace.id, input.id))
        .returning({
          id: religiousPlace.id,
          slug: religiousPlace.slug,
        });

      return {
        success: true,
        slug: result[0].slug,
      };
    } catch (error) {
      console.error("Error updating religious place:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update religious place",
      });
    }
  });
