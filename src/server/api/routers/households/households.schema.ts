import { z } from "zod";

export const householdSchema = z.object({
  // Primary identification
  id: z.string(),
  profileId: z.string(),
  
  // Location information
  province: z.string(),
  district: z.string(),
  localLevel: z.string(),
  wardNo: z.number(),
  houseSymbolNo: z.string(),
  familySymbolNo: z.string(),
  dateOfInterview: z.date().nullable(),
  householdLocation: z.array(z.string()).nullable(),
  locality: z.string(),
  developmentOrganization: z.string(),
  
  // Family information
  familyHeadName: z.string(),
  familyHeadPhoneNo: z.string(),
  totalMembers: z.number(),
  areMembersElsewhere: z.string().nullable(),
  totalElsewhereMembers: z.number().nullable(),
  
  // House details
  houseOwnership: z.string(),
  houseOwnershipOther: z.string().nullable(),
  landOwnership: z.string(),
  landOwnershipOther: z.string().nullable(),
  houseBase: z.string(),
  houseBaseOther: z.string().nullable(),
  houseOuterWall: z.string(),
  houseOuterWallOther: z.string().nullable(),
  houseRoof: z.string(),
  houseRoofOther: z.string().nullable(),
  houseFloor: z.string(),
  houseFloorOther: z.string().nullable(),
  
  // Safety information
  isHousePassed: z.string(),
  isMapArchived: z.string().nullable(),
  naturalDisasters: z.array(z.string()).nullable(),
  isSafe: z.string().nullable(),
  
  // Water, sanitation and energy
  waterSource: z.string(),
  // Changed from array to string to match schema
  waterPurificationMethods: z.string().nullable(),
  toiletType: z.string(),
  solidWasteManagement: z.string(),
  primaryCookingFuel: z.string(),
  primaryEnergySource: z.string(),
  
  // Accessibility
  roadStatus: z.string(),
  timeToPublicBus: z.string(),
  timeToMarket: z.string(),
  distanceToActiveRoad: z.string().nullable(),
  facilities: z.array(z.string()).nullable(),
  
  // Economic details
  hasPropertiesElsewhere: z.string(),
  hasFemaleNamedProperties: z.string(),
  organizationsLoanedFrom: z.array(z.string()).nullable(),
  loanUses: z.array(z.string()).nullable(),
  timeToBank: z.string(),
  financialAccounts: z.array(z.string()).nullable(),
  // Added income sources to match schema
  incomeSources: z.array(z.string()).nullable(),
  
  // Remittance (moved to match schema order)
  haveRemittance: z.string(),
  remittanceExpenses: z.array(z.string()).nullable(),
  
  // Health
  haveHealthInsurance: z.string(),
  consultingHealthOrganization: z.string(),
  timeToHealthOrganization: z.string(),
  
  // Municipal & Suggestions
  municipalSuggestions: z.array(z.string()).nullable(),
  
  // Agriculture & Livestock
  haveAgriculturalLand: z.string(),
  agriculturalLands: z.array(z.string()).nullable(),
  areInvolvedInAgriculture: z.string(),
  foodCrops: z.array(z.string()).nullable(),
  pulses: z.array(z.string()).nullable(),
  oilSeeds: z.array(z.string()).nullable(),
  vegetables: z.array(z.string()).nullable(),
  fruits: z.array(z.string()).nullable(),
  spices: z.array(z.string()).nullable(),
  cashCrops: z.array(z.string()).nullable(),
  areInvolvedInHusbandry: z.string(),
  animals: z.array(z.string()).nullable(),
  animalProducts: z.array(z.string()).nullable(),
  
  // Aquaculture & Apiary
  haveAquaculture: z.string(),
  pondNumber: z.number().nullable(),
  pondArea: z.number().nullable(),
  fishProduction: z.number().nullable(),
  haveApiary: z.string(),
  hiveNumber: z.number().nullable(),
  honeyProduction: z.number().nullable(),
  honeySales: z.number().nullable(),
  honeyRevenue: z.number().nullable(),
  
  // Agricultural operations
  hasAgriculturalInsurance: z.string(),
  monthsInvolvedInAgriculture: z.string(),
  agriculturalMachines: z.array(z.string()).nullable(),
  
  // Migration details
  birthPlace: z.string().nullable(),
  birthProvince: z.string().nullable(),
  birthDistrict: z.string().nullable(),
  birthCountry: z.string().nullable(),
  priorLocation: z.string().nullable(),
  priorProvince: z.string().nullable(),
  priorDistrict: z.string().nullable(),
  priorCountry: z.string().nullable(),
  residenceReason: z.string().nullable(),
  
  // Business
  hasBusiness: z.string().nullable(),
  
  // System fields
  deviceId: z.string().nullable(),
});

export const createHouseholdSchema = householdSchema.omit({ id: true });

export const updateHouseholdSchema = householdSchema.partial();

export const householdQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  sortBy: z
    .enum([
      "family_head_name", 
      "ward_no", 
      "locality", 
      "house_symbol_no",
      "date_of_interview",
    ])
    .default("family_head_name"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  filters: z
    .object({
      wardNo: z.number().optional(),
      province: z.string().optional(),
      district: z.string().optional(),
      haveAgriculturalLand: z.string().optional(),
      houseOwnership: z.string().optional(),
      // Removed isEarthquakeResistant as it's not in the schema
      timeToPublicBus: z.string().optional(),
    })
    .optional(),
  search: z.string().optional(),
});

export const householdStatusSchema = z.object({
  householdId: z.string(),
  message: z.string().optional(), // For rejection reason or edit request details
});

export type HouseholdStatusUpdate = z.infer<typeof householdStatusSchema>;

export type Household = z.infer<typeof householdSchema>;
