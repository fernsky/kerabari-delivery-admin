import { pgTable } from "../../../../schema/basic";
import {
  integer,
  timestamp,
  varchar,
  text,
  boolean,
  pgEnum,
  date,
  jsonb,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define cultural heritage type enum
export const culturalHeritageTypeEnum = pgEnum("cultural_heritage_type", [
  "INTANGIBLE_HERITAGE",
  "HISTORICAL_TREE",
  "HISTORICAL_WELL",
  "HISTORICAL_POND",
  "HISTORICAL_STONE",
  "ANCIENT_INSCRIPTION",
  "SACRED_LANDMARK",
  "TRADITIONAL_DANCE",
  "TRADITIONAL_MUSIC",
  "TRADITIONAL_CRAFT",
  "FOLKLORE",
  "ORAL_TRADITION",
  "RITUAL_PRACTICE",
  "CULINARY_TRADITION",
  "TRADITIONAL_MEDICINE",
  "INDIGENOUS_LANGUAGE",
  "TRADITIONAL_GAME",
  "TRADITIONAL_FESTIVAL",
  "OTHER",
]);

// Define heritage significance level enum
export const heritageSignificanceEnum = pgEnum("heritage_significance", [
  "LOCAL",
  "DISTRICT",
  "REGIONAL",
  "NATIONAL",
  "INTERNATIONAL",
]);

// Define conservation status enum
export const heritageConservationStatusEnum = pgEnum(
  "heritage_conservation_status",
  [
    "WELL_PRESERVED",
    "MAINTAINED",
    "VULNERABLE",
    "ENDANGERED",
    "CRITICALLY_ENDANGERED",
    "LOST",
    "REVITALIZED",
    "DOCUMENTED_ONLY",
    "MIXED",
  ],
);

// Define recognition type enum
export const heritageRecognitionTypeEnum = pgEnum("heritage_recognition_type", [
  "UNESCO_INTANGIBLE_HERITAGE",
  "NATIONAL_HERITAGE",
  "PROVINCIAL_HERITAGE",
  "LOCAL_HERITAGE",
  "COMMUNITY_RECOGNISED",
  "ACADEMIC_RECOGNITION",
  "NONE",
]);

// Cultural Heritage table
export const culturalHeritage = pgTable("cultural_heritage", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  heritageType: culturalHeritageTypeEnum("heritage_type").notNull(),

  // Location details (not applicable for some intangible heritage)
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  hasPhysicalLocation: boolean("has_physical_location").default(true),

  // Basic details
  estimatedAgeYears: integer("estimated_age_years"),
  historicalPeriod: text("historical_period"), // E.g., "Licchavi Period", "Malla Period"
  yearDiscovered: integer("year_discovered"),
  yearRecognised: integer("year_recognised"), // Year formally recognized as heritage

  // Cultural significance
  culturalSignificance: text("cultural_significance"),
  heritageSignificance: heritageSignificanceEnum("heritage_significance"),
  associatedCommunities: text("associated_communities"), // Communities that maintain/treasure this heritage
  associatedEthnicGroups: text("associated_ethnic_groups"), // Specific ethnic groups associated
  spiritualSignificance: text("spiritual_significance"),

  // Conservation status
  conservationStatus: heritageConservationStatusEnum("conservation_status"),
  conservationDetails: text("conservation_details"),
  threatsToPreservation: text("threats_to_preservation"), // E.g., "Modernization", "Natural decay", "Tourism impact"
  safeguardingMeasures: text("safeguarding_measures"),
  lastConservationDate: date("last_conservation_date"),
  conservationAgency: text("conservation_agency"), // Organization responsible for conservation

  // Recognition and documentation
  isOfficiallyRecognised: boolean("is_officially_recognised").default(false),
  recognitionType: heritageRecognitionTypeEnum("recognition_type"),
  recognitionDate: date("recognition_date"),
  recognitionReferenceId: text("recognition_reference_id"), // Reference ID in official listings
  hasProperDocumentation: boolean("has_proper_documentation").default(false),
  documentationDetails: text("documentation_details"),
  hasResearchPublications: boolean("has_research_publications").default(false),
  publicationReferences: text("publication_references"),

  // For tangible elements (trees, wells, ponds, stones)
  physicalDimensions: text("physical_dimensions"), // E.g., "Height: 15m, Diameter: 2m" (for trees), "Depth: 10m, Diameter: 5m" (for wells)
  physicalCharacteristics: text("physical_characteristics"),
  materialComposition: text("material_composition"), // For stones, wells, etc.
  geologicalSignificance: text("geological_significance"),

  // For intangible elements (dances, music, crafts, etc.)
  practiceFrequency: text("practice_frequency"), // E.g., "Annual", "Daily", "On special occasions"
  practiceSeason: text("practice_season"), // E.g., "Monsoon", "Spring", "Harvest season"
  geographicDistribution: text("geographic_distribution"), // Where this intangible heritage is practiced
  transmissionMethod: text("transmission_method"), // How it's passed down generations
  associatedArtifacts: text("associated_artifacts"), // Physical items used in the practice
  languageOfExpression: text("language_of_expression"), // Primary language of the tradition

  // Natural elements (for trees, ponds)
  hasEcologicalValue: boolean("has_ecological_value").default(false),
  ecologicalValue: text("ecological_value"),
  ecosystemServices: text("ecosystem_services"),
  floraFaunaDetails: text("flora_fauna_details"),
  biologicalCharacteristics: text("biological_characteristics"),

  // Social and contemporary context
  currentUsage: text("current_usage"), // Contemporary use/practice
  communityRole: text("community_role"), // Role in contemporary community life
  economicValue: text("economic_value"), // Economic benefits or potential
  tourismValue: boolean("tourism_value").default(false),
  tourismDetails: text("tourism_details"),
  educationalValue: boolean("educational_value").default(false),
  educationalActivities: text("educational_activities"),

  // Management and access
  ownershipType: text("ownership_type"), // E.g., "Community", "Government", "Private", "Temple trust"
  managedBy: text("managed_by"),
  accessRestrictions: text("access_restrictions"),
  visitorGuidelines: text("visitor_guidelines"),

  // Rituals and practices
  associatedRituals: text("associated_rituals"),
  ritualCalendar: text("ritual_calendar"), // When rituals are performed
  ritualParticipants: text("ritual_participants"), // Who participates
  ritualMaterials: text("ritual_materials"), // Materials needed for rituals

  // Contemporary challenges and adaptation
  adaptationToModernContext: text("adaptation_to_modern_context"),
  commercializationImpact: text("commercialization_impact"),
  globalizationImpact: text("globalization_impact"),
  revitalizationEfforts: text("revitalization_efforts"),

  // Digital preservation
  hasAudioRecordings: boolean("has_audio_recordings").default(false),
  hasVideoRecordings: boolean("has_video_recordings").default(false),
  hasDigitalDocumentation: boolean("has_digital_documentation").default(false),
  digitalArchiveLinks: text("digital_archive_links"),

  // Community engagement
  communityParticipationLevel: text("community_participation_level"), // E.g., "High", "Medium", "Low", "None"
  youthInvolvement: text("youth_involvement"),
  genderAspects: text("gender_aspects"), // Gender roles in preservation/practice
  communityAwareness: text("community_awareness"),

  // Knowledge holders and practitioners
  keyKnowledgeHolders: text("key_knowledge_holders"), // Names of important tradition bearers
  practitionerCount: integer("practitioner_count"),
  masterPractitioners: text("master_practitioners"),
  teachingInstitutions: text("teaching_institutions"),

  // Linkages to other entities
  linkedHistoricalSites: jsonb("linked_historical_sites").default(
    sql`'[]'::jsonb`,
  ),
  linkedReligiousPlaces: jsonb("linked_religious_places").default(
    sql`'[]'::jsonb`,
  ),
  linkedCulturalOrganizations: jsonb("linked_cultural_organizations").default(
    sql`'[]'::jsonb`,
  ),
  linkedCulturalEvents: jsonb("linked_cultural_events").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"), // SEO meta title
  metaDescription: text("meta_description"), // SEO meta description
  keywords: text("keywords"), // SEO keywords

  // Geometry fields (for physical heritage)
  locationPoint: geometry("location_point", { type: "Point" }),
  areaPolygon: geometry("area_polygon", { type: "Polygon" }),

  // Status and metadata
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  verificationDate: timestamp("verification_date"),
  verifiedBy: varchar("verified_by", { length: 36 }),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type CulturalHeritage = typeof culturalHeritage.$inferSelect;
export type NewCulturalHeritage = typeof culturalHeritage.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
