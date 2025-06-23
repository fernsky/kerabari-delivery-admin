import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import {
  HistoricalSite,
  historicalSite,
} from "@/server/db/schema/profile/institutions/cultural/historicalSites";
import { generateSlug } from "@/server/utils/slug-helpers";
import { sql, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

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

// Define schema for historical site creation
const historicalSiteSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(), // Optional slug - will generate if not provided
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

  // Verification
  isVerified: z.boolean().optional(),
});

// Create a new historical site
export const createHistoricalSite = protectedProcedure
  .input(historicalSiteSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create historical sites",
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
          .select({ id: historicalSite.id })
          .from(historicalSite)
          .where(eq(historicalSite.slug, slug))
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

      // Process site boundary geometry if provided
      let siteBoundaryValue = null;
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
      let structureFootprintsValue = null;
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

      // Use a transaction for data consistency
      return await ctx.db.transaction(async (tx) => {
        // Insert the historical site
        await tx.insert(historicalSite).values({
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
          isHeritageSite: input.isHeritageSite || false,
          heritageDesignation: input.heritageDesignation,
          heritageListingYear: input.heritageListingYear,
          heritageReferenceId: input.heritageReferenceId,

          // Inscriptions and documentation
          hasInscriptions: input.hasInscriptions || false,
          inscriptionDetails: input.inscriptionDetails,
          hasHistoricalDocuments: input.hasHistoricalDocuments || false,
          documentationDetails: input.documentationDetails,

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
          totalStructureCount: input.totalStructureCount,
          hasMainBuilding: input.hasMainBuilding || false,
          hasDefensiveWalls: input.hasDefensiveWalls || false,
          hasTowers: input.hasTowers || false,
          hasMoat: input.hasMoat || false,
          hasGardens: input.hasGardens || false,
          hasCourtyards: input.hasCourtyards || false,
          structureDetails: input.structureDetails,

          // Features and architectural elements
          notableFeatures: input.notableFeatures,
          architecturalElements: input.architecturalElements,
          hasUndergroundStructures: input.hasUndergroundStructures || false,
          undergroundDetails: input.undergroundDetails,
          hasDurbar: input.hasDurbar || false,
          hasTemple: input.hasTemple || false,
          hasArtificialWaterBody: input.hasArtificialWaterBody || false,
          waterBodyDetails: input.waterBodyDetails,

          // Facilities and amenities
          hasParking: input.hasParking || false,
          parkingCapacity: input.parkingCapacity,
          hasToilets: input.hasToilets || false,
          hasHandicapAccess: input.hasHandicapAccess || false,
          hasElectricity:
            input.hasElectricity !== undefined ? input.hasElectricity : true,
          hasWaterSupply:
            input.hasWaterSupply !== undefined ? input.hasWaterSupply : true,
          hasCafeteria: input.hasCafeteria || false,
          hasGiftShop: input.hasGiftShop || false,

          // Preservation and restoration
          preservationStatus: input.preservationStatus as any,
          restorationDetails: input.restorationDetails,
          hasRegularMaintenance: input.hasRegularMaintenance || false,
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
          hasOverseasVisitors: input.hasOverseasVisitors || false,
          guidesAvailable: input.guidesAvailable || false,
          hasTourismInfrastructure: input.hasTourismInfrastructure || false,
          tourismDetails: input.tourismDetails,
          visitorFacilities: input.visitorFacilities,
          photoAllowed:
            input.photoAllowed !== undefined ? input.photoAllowed : true,
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
          hasSecurityPersonnel: input.hasSecurityPersonnel || false,
          hasCCTV: input.hasCCTV || false,
          hasFireSafety: input.hasFireSafety || false,
          safetyMeasures: input.safetyMeasures,
          disasterPreparedness: input.disasterPreparedness,

          // Artifacts and collections
          hasArchaeologicalArtifacts: input.hasArchaeologicalArtifacts || false,
          artifactStorageLocation: input.artifactStorageLocation,
          hasOnSiteMuseum: input.hasOnSiteMuseum || false,
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

          // Linkages to other entities
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
          metaDescription:
            input.metaDescription ||
            input.description?.substring(0, 160) ||
            `Information about ${input.name}`,
          keywords:
            input.keywords ||
            `${input.name}, ${input.type.toLowerCase().replace("_", " ")}, historical site, ${input.historicalPeriod || ""}`,

          // Geometry fields
          locationPoint: locationPointValue ? sql`${locationPointValue}` : null,
          siteBoundary: siteBoundaryValue ? sql`${siteBoundaryValue}` : null,
          structureFootprints: structureFootprintsValue
            ? sql`${structureFootprintsValue}`
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
        } as unknown as HistoricalSite);

        return { id, slug, success: true };
      });
    } catch (error) {
      console.error("Error creating historical site:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create historical site",
        cause: error,
      });
    }
  });
