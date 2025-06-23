import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { historicalSite } from "@/server/db/schema/profile/institutions/cultural/historicalSites";
import { generateSlug } from "@/server/utils/slug-helpers";
import { sql, eq, and, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Define enums for historical site input validation
const historicalSiteTypeEnum = [
  "PALACE",
  "FORT",
  "ANCIENT_SETTLEMENT",
  "ARCHAEOLOGICAL_SITE",
  "ANCIENT_MONUMENT",
  "HERITAGE_BUILDING",
  "HISTORIC_HOUSE",
  "MEDIEVAL_TOWN",
  "ROYAL_RESIDENCE",
  "HISTORIC_GARDEN",
  "HISTORIC_INFRASTRUCTURE",
  "BATTLEFIELD",
  "ANCIENT_RUINS",
  "HISTORIC_LANDMARK",
  "OTHER",
];

const historicalArchitecturalStyleEnum = [
  "TRADITIONAL_NEPALI",
  "PAGODA",
  "NEWAR",
  "MALLA",
  "SHAH",
  "RAI",
  "LIMBU",
  "MEDIEVAL",
  "COLONIAL",
  "GOTHIC",
  "MUGHAL",
  "RANA_PALACE",
  "SHIKHARA",
  "STUPA",
  "MIXED",
  "VERNACULAR",
  "OTHER",
];

const historicalConstructionMaterialEnum = [
  "STONE",
  "BRICK",
  "WOOD",
  "MUD",
  "CLAY",
  "MARBLE",
  "METAL",
  "TERRACOTTA",
  "MIXED",
  "OTHER",
];

const historicalSignificanceEnum = [
  "LOCAL",
  "REGIONAL",
  "NATIONAL",
  "INTERNATIONAL",
];

const historicalPreservationStatusEnum = [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "DAMAGED",
  "UNDER_RENOVATION",
  "PARTIAL_RUINS",
  "RUINS",
  "ARCHAEOLOGICAL_REMAINS",
];

const historicalPeriodEnum = [
  "ANCIENT",
  "MEDIEVAL",
  "LICCHAVI",
  "MALLA",
  "SHAH",
  "RANA",
  "PRE_UNIFICATION",
  "COLONIAL",
  "MODERN",
  "CONTEMPORARY",
  "MULTIPLE_PERIODS",
  "OTHER",
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
  coordinates: z.array(z.array(z.array(z.tuple([z.number(), z.number()])))), // Array of polygons
});

// Define schema for linked entity references
const linkedEntitySchema = z.array(
  z.object({
    id: z.string(),
    name: z.string().optional(),
  }),
);

// Define schema for historical site update
const updateHistoricalSiteSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(), // Optional slug - will maintain existing if not provided
  description: z.string().optional(),
  type: z.enum(historicalSiteTypeEnum as [string, ...string[]]),

  // Location details
  wardNumber: z.number().int().positive().optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical details
  areaInSquareMeters: z.number().positive().optional(),
  architecturalStyle: z
    .enum(historicalArchitecturalStyleEnum as [string, ...string[]])
    .optional(),
  constructionMaterial: z
    .enum(historicalConstructionMaterialEnum as [string, ...string[]])
    .optional(),
  historicalPeriod: z
    .enum(historicalPeriodEnum as [string, ...string[]])
    .optional(),
  yearEstablished: z.number().int().optional(),
  yearAbandoned: z.number().int().optional(),
  lastRestorationYear: z.number().int().optional(),

  // Historical context
  historicalSignificance: z
    .enum(historicalSignificanceEnum as [string, ...string[]])
    .optional(),
  originalFunction: z.string().optional(),
  notablePeople: z.string().optional(),
  historicalEvents: z.string().optional(),
  dynastyOrRulership: z.string().optional(),
  changeOfOwnership: z.string().optional(),

  // Cultural and archaeological significance
  culturalSignificance: z.string().optional(),
  archaeologicalRemains: z.string().optional(),
  artifactsFound: z.string().optional(),
  excavationHistory: z.string().optional(),
  excavationYear: z.number().int().optional(),

  // Heritage status
  isHeritageSite: z.boolean().optional(),
  heritageDesignation: z.string().optional(),
  heritageListingYear: z.number().int().optional(),
  heritageReferenceId: z.string().optional(),

  // Inscriptions and documentation
  hasInscriptions: z.boolean().optional(),
  inscriptionDetails: z.string().optional(),
  hasHistoricalDocuments: z.boolean().optional(),
  documentationDetails: z.string().optional(),

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
  totalStructureCount: z.number().int().nonnegative().optional(),
  hasMainBuilding: z.boolean().optional(),
  hasDefensiveWalls: z.boolean().optional(),
  hasTowers: z.boolean().optional(),
  hasMoat: z.boolean().optional(),
  hasGardens: z.boolean().optional(),
  hasCourtyards: z.boolean().optional(),
  structureDetails: z.string().optional(),

  // Features and architectural elements
  notableFeatures: z.string().optional(),
  architecturalElements: z.string().optional(),
  hasUndergroundStructures: z.boolean().optional(),
  undergroundDetails: z.string().optional(),
  hasDurbar: z.boolean().optional(),
  hasTemple: z.boolean().optional(),
  hasArtificialWaterBody: z.boolean().optional(),
  waterBodyDetails: z.string().optional(),

  // Facilities and amenities
  hasParking: z.boolean().optional(),
  parkingCapacity: z.number().int().positive().optional(),
  hasToilets: z.boolean().optional(),
  hasHandicapAccess: z.boolean().optional(),
  hasElectricity: z.boolean().optional(),
  hasWaterSupply: z.boolean().optional(),
  hasCafeteria: z.boolean().optional(),
  hasGiftShop: z.boolean().optional(),

  // Preservation and restoration
  preservationStatus: z
    .enum(historicalPreservationStatusEnum as [string, ...string[]])
    .optional(),
  restorationDetails: z.string().optional(),
  hasRegularMaintenance: z.boolean().optional(),
  maintenanceDetails: z.string().optional(),
  fundingSource: z.string().optional(),
  conservationChallenges: z.string().optional(),

  // Research and education
  researchValue: z.string().optional(),
  ongoingResearch: z.string().optional(),
  educationalPrograms: z.string().optional(),
  publicationReferences: z.string().optional(),

  // Visitor information
  estimatedDailyVisitors: z.number().int().nonnegative().optional(),
  estimatedYearlyVisitors: z.number().int().nonnegative().optional(),
  peakVisitationMonths: z.string().optional(),
  hasOverseasVisitors: z.boolean().optional(),
  guidesAvailable: z.boolean().optional(),
  hasTourismInfrastructure: z.boolean().optional(),
  tourismDetails: z.string().optional(),
  visitorFacilities: z.string().optional(),
  photoAllowed: z.boolean().optional(),
  photoRestrictions: z.string().optional(),
  visitDuration: z.string().optional(),

  // Community engagement
  localCommunityInvolvement: z.string().optional(),
  communityBenefits: z.string().optional(),
  educationalActivities: z.string().optional(),

  // Economic aspects
  annualMaintenanceCost: z.number().nonnegative().optional(),
  annualRevenue: z.number().nonnegative().optional(),
  economicImpact: z.string().optional(),
  employmentGenerated: z.number().int().nonnegative().optional(),

  // Cultural and ceremonial use
  traditionalUses: z.string().optional(),
  ceremonialImportance: z.string().optional(),
  culturalEvents: z.string().optional(),
  localMyths: z.string().optional(),

  // Safety and security
  hasSecurityPersonnel: z.boolean().optional(),
  hasCCTV: z.boolean().optional(),
  hasFireSafety: z.boolean().optional(),
  safetyMeasures: z.string().optional(),
  disasterPreparedness: z.string().optional(),

  // Artifacts and collections
  hasArchaeologicalArtifacts: z.boolean().optional(),
  artifactStorageLocation: z.string().optional(),
  hasOnSiteMuseum: z.boolean().optional(),
  museumDetails: z.string().optional(),
  notableCollections: z.string().optional(),

  // Damages and threats
  damageHistory: z.string().optional(),
  currentThreats: z.string().optional(),
  encroachmentIssues: z.string().optional(),
  naturalDisasterRisk: z.string().optional(),

  // Development and future plans
  developmentProjects: z.string().optional(),
  futureConservationPlans: z.string().optional(),
  proposedImprovements: z.string().optional(),

  // Linkages to other entities
  linkedCulturalEvents: linkedEntitySchema.optional(),
  linkedCulturalOrganizations: linkedEntitySchema.optional(),
  linkedReligiousPlaces: linkedEntitySchema.optional(),
  linkedHistoricalSites: linkedEntitySchema.optional(),

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),

  // Geometry fields
  locationPoint: pointGeometrySchema.optional(),
  siteBoundary: polygonGeometrySchema.optional(),
  structureFootprints: multiPolygonGeometrySchema.optional(),

  // Status
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),

  // Original values for tracking changes
  originalName: z.string().optional(),
  originalSlug: z.string().optional(),
});

// Update a historical site
export const updateHistoricalSite = protectedProcedure
  .input(updateHistoricalSiteSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update historical sites",
      });
    }

    try {
      // Check if historical site exists
      const existing = await ctx.db
        .select({ id: historicalSite.id, slug: historicalSite.slug })
        .from(historicalSite)
        .where(eq(historicalSite.id, input.id));

      if (existing.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Historical site not found",
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
            .select({ id: historicalSite.id })
            .from(historicalSite)
            .where(
              and(
                eq(historicalSite.slug, slug),
                ne(historicalSite.id, input.id), // Don't match our own record
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

      // Process site boundary geometry if provided
      let siteBoundaryValue = undefined;
      if (input.siteBoundary) {
        const polygonGeoJson = JSON.stringify(input.siteBoundary);
        try {
          JSON.parse(polygonGeoJson); // Validate JSON
          siteBoundaryValue = sql`ST_GeomFromGeoJSON(${polygonGeoJson})`;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid site boundary geometry GeoJSON",
          });
        }
      }

      // Process structure footprints geometry if provided
      let structureFootprintsValue = undefined;
      if (input.structureFootprints) {
        const multiPolygonGeoJson = JSON.stringify(input.structureFootprints);
        try {
          JSON.parse(multiPolygonGeoJson); // Validate JSON
          structureFootprintsValue = sql`ST_GeomFromGeoJSON(${multiPolygonGeoJson})`;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid structure footprints geometry GeoJSON",
          });
        }
      }

      // Process linked entities
      const linkedCulturalEvents = input.linkedCulturalEvents || [];
      const linkedCulturalOrganizations =
        input.linkedCulturalOrganizations || [];
      const linkedReligiousPlaces = input.linkedReligiousPlaces || [];
      const linkedHistoricalSites = input.linkedHistoricalSites || [];

      const now = new Date();

      // Handle verification status changes
      const wasVerifiedBefore = (await ctx.db
        .select({ isVerified: historicalSite.isVerified })
        .from(historicalSite)
        .where(eq(historicalSite.id, input.id))
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
        historicalPeriod: input.historicalPeriod as any,
        yearEstablished: input.yearEstablished,
        yearAbandoned: input.yearAbandoned,
        lastRestorationYear: input.lastRestorationYear,

        // Historical context
        historicalSignificance: input.historicalSignificance as any,
        originalFunction: input.originalFunction,
        notablePeople: input.notablePeople,
        historicalEvents: input.historicalEvents,
        dynastyOrRulership: input.dynastyOrRulership,
        changeOfOwnership: input.changeOfOwnership,

        // Cultural and archaeological significance
        culturalSignificance: input.culturalSignificance,
        archaeologicalRemains: input.archaeologicalRemains,
        artifactsFound: input.artifactsFound,
        excavationHistory: input.excavationHistory,
        excavationYear: input.excavationYear,

        // Heritage status
        isHeritageSite: input.isHeritageSite,
        heritageDesignation: input.heritageDesignation,
        heritageListingYear: input.heritageListingYear,
        heritageReferenceId: input.heritageReferenceId,

        // Inscriptions and documentation
        hasInscriptions: input.hasInscriptions,
        inscriptionDetails: input.inscriptionDetails,
        hasHistoricalDocuments: input.hasHistoricalDocuments,
        documentationDetails: input.documentationDetails,

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
        totalStructureCount: input.totalStructureCount,
        hasMainBuilding: input.hasMainBuilding,
        hasDefensiveWalls: input.hasDefensiveWalls,
        hasTowers: input.hasTowers,
        hasMoat: input.hasMoat,
        hasGardens: input.hasGardens,
        hasCourtyards: input.hasCourtyards,
        structureDetails: input.structureDetails,

        // Features and architectural elements
        notableFeatures: input.notableFeatures,
        architecturalElements: input.architecturalElements,
        hasUndergroundStructures: input.hasUndergroundStructures,
        undergroundDetails: input.undergroundDetails,
        hasDurbar: input.hasDurbar,
        hasTemple: input.hasTemple,
        hasArtificialWaterBody: input.hasArtificialWaterBody,
        waterBodyDetails: input.waterBodyDetails,

        // Facilities and amenities
        hasParking: input.hasParking,
        parkingCapacity: input.parkingCapacity,
        hasToilets: input.hasToilets,
        hasHandicapAccess: input.hasHandicapAccess,
        hasElectricity: input.hasElectricity,
        hasWaterSupply: input.hasWaterSupply,
        hasCafeteria: input.hasCafeteria,
        hasGiftShop: input.hasGiftShop,

        // Preservation and restoration
        preservationStatus: input.preservationStatus as any,
        restorationDetails: input.restorationDetails,
        hasRegularMaintenance: input.hasRegularMaintenance,
        maintenanceDetails: input.maintenanceDetails,
        fundingSource: input.fundingSource,
        conservationChallenges: input.conservationChallenges,

        // Research and education
        researchValue: input.researchValue,
        ongoingResearch: input.ongoingResearch,
        educationalPrograms: input.educationalPrograms,
        publicationReferences: input.publicationReferences,

        // Visitor information
        estimatedDailyVisitors: input.estimatedDailyVisitors,
        estimatedYearlyVisitors: input.estimatedYearlyVisitors,
        peakVisitationMonths: input.peakVisitationMonths,
        hasOverseasVisitors: input.hasOverseasVisitors,
        guidesAvailable: input.guidesAvailable,
        hasTourismInfrastructure: input.hasTourismInfrastructure,
        tourismDetails: input.tourismDetails,
        visitorFacilities: input.visitorFacilities,
        photoAllowed: input.photoAllowed,
        photoRestrictions: input.photoRestrictions,
        visitDuration: input.visitDuration,

        // Community engagement
        localCommunityInvolvement: input.localCommunityInvolvement,
        communityBenefits: input.communityBenefits,
        educationalActivities: input.educationalActivities,

        // Economic aspects
        annualMaintenanceCost: input.annualMaintenanceCost,
        annualRevenue: input.annualRevenue,
        economicImpact: input.economicImpact,
        employmentGenerated: input.employmentGenerated,

        // Cultural and ceremonial use
        traditionalUses: input.traditionalUses,
        ceremonialImportance: input.ceremonialImportance,
        culturalEvents: input.culturalEvents,
        localMyths: input.localMyths,

        // Safety and security
        hasSecurityPersonnel: input.hasSecurityPersonnel,
        hasCCTV: input.hasCCTV,
        hasFireSafety: input.hasFireSafety,
        safetyMeasures: input.safetyMeasures,
        disasterPreparedness: input.disasterPreparedness,

        // Artifacts and collections
        hasArchaeologicalArtifacts: input.hasArchaeologicalArtifacts,
        artifactStorageLocation: input.artifactStorageLocation,
        hasOnSiteMuseum: input.hasOnSiteMuseum,
        museumDetails: input.museumDetails,
        notableCollections: input.notableCollections,

        // Damages and threats
        damageHistory: input.damageHistory,
        currentThreats: input.currentThreats,
        encroachmentIssues: input.encroachmentIssues,
        naturalDisasterRisk: input.naturalDisasterRisk,

        // Development and future plans
        developmentProjects: input.developmentProjects,
        futureConservationPlans: input.futureConservationPlans,
        proposedImprovements: input.proposedImprovements,

        // Linkages to other entities as JSON arrays
        linkedCulturalEvents:
          linkedCulturalEvents.length > 0
            ? sql`${JSON.stringify(linkedCulturalEvents)}::jsonb`
            : sql`'[]'::jsonb`,
        linkedCulturalOrganizations:
          linkedCulturalOrganizations.length > 0
            ? sql`${JSON.stringify(linkedCulturalOrganizations)}::jsonb`
            : sql`'[]'::jsonb`,
        linkedReligiousPlaces:
          linkedReligiousPlaces.length > 0
            ? sql`${JSON.stringify(linkedReligiousPlaces)}::jsonb`
            : sql`'[]'::jsonb`,
        linkedHistoricalSites:
          linkedHistoricalSites.length > 0
            ? sql`${JSON.stringify(linkedHistoricalSites)}::jsonb`
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

      if (siteBoundaryValue !== undefined) {
        updateData.siteBoundary = siteBoundaryValue;
      }

      if (structureFootprintsValue !== undefined) {
        updateData.structureFootprints = structureFootprintsValue;
      }

      // Update the historical site
      const result = await ctx.db
        .update(historicalSite)
        .set(updateData)
        .where(eq(historicalSite.id, input.id))
        .returning({
          id: historicalSite.id,
          slug: historicalSite.slug,
        });

      return {
        success: true,
        slug: result[0].slug,
      };
    } catch (error) {
      console.error("Error updating historical site:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update historical site",
      });
    }
  });
