import { z } from "zod";

export const businessSchema = z.object({
  // Primary identification - required fields
  id: z.string(),
  wardNo: z.number(),
  tenantId: z.string().nullable(),
  deviceId: z.string(),

  // Location and basic information
  businessLocation: z.array(z.string()).nullable(),
  dateOfInterview: z.string().or(z.date()).nullable(),
  businessName: z.string().nullable(),
  businessProvince: z.string().nullable(),
  businessDistrict: z.string().nullable(),
  businessLocalLevel: z.string().nullable(),
  businessLocality: z.string().nullable(),

  // Operator details
  operatorName: z.string().nullable(),
  operatorPhone: z.string().nullable(),
  operatorAge: z.number().nullable(),
  operatorGender: z.string().nullable(),
  operatorEducationalLevel: z.string().nullable(),

  // Business classification
  businessNature: z.string().nullable(),
  businessNatureOther: z.string().nullable(),
  businessType: z.string().nullable(),
  businessTypeOther: z.string().nullable(),

  // Registration and legal information
  isBusinessRegistered: z.string().nullable(),
  registeredBodies: z.array(z.string()).nullable(),
  registeredBodiesOther: z.array(z.string()).nullable(),
  statutoryStatus: z.string().nullable(),
  statutoryStatusOther: z.string().nullable(),
  hasPanNumber: z.string().nullable(),
  panNumber: z.number().nullable(),

  // Ownership and property information
  businessOwnershipStatus: z.string().nullable(),
  businessOwnershipStatusOther: z.string().nullable(),
  businessLocationOwnership: z.string().nullable(),
  businessLocationOwnershipOther: z.string().nullable(),

  // Hotel-specific information
  hotelAccomodationType: z.string().nullable(),
  hotelRoomNumbers: z.number().nullable(),
  hotelBedNumbers: z.number().nullable(),
  hotelRoomTypes: z.array(z.string()).nullable(),

  // Agricultural business details
  agriculturalBusinesses: z.array(z.string()).nullable(),
  businessFoodCrops: z.array(z.string()).nullable(),
  businessPulses: z.array(z.string()).nullable(),
  businessOilSeeds: z.array(z.string()).nullable(),
  businessVegetables: z.array(z.string()).nullable(),
  businessFruits: z.array(z.string()).nullable(),
  businessSpices: z.array(z.string()).nullable(),
  businessCashCrops: z.array(z.string()).nullable(),
  businessAnimals: z.array(z.string()).nullable(),
  businessAnimalProducts: z.array(z.string()).nullable(),

  // Financial information
  businessInvestment: z.number().nullable(),
  businessProfit: z.number().nullable(),
  businessPastYearInvestment: z.number().nullable(),

  // Partner information
  hasBusinessPartners: z.string().nullable(),
  totalPartners: z.number().nullable(),
  nepaliMalePartners: z.number().nullable(),
  nepaliFemalePartners: z.number().nullable(),
  hasForeignPartners: z.string().nullable(),
  foreignMalePartners: z.number().nullable(),
  foreignFemalePartners: z.number().nullable(),

  // Family involvement
  hasInvolvedFamily: z.string().nullable(),
  totalInvolvedFamily: z.number().nullable(),
  maleInvolvedFamily: z.number().nullable(),
  femaleInvolvedFamily: z.number().nullable(),

  // Permanent employee information
  hasPermanentEmployees: z.string().nullable(),
  totalPermanentEmployees: z.number().nullable(),
  nepaliMalePermanentEmployees: z.number().nullable(),
  nepaliFemalePermanentEmployees: z.number().nullable(),
  hasForeignPermanentEmployees: z.string().nullable(),
  foreignMalePermanentEmployees: z.number().nullable(),
  foreignFemalePermanentEmployees: z.number().nullable(),
  foreignPermanentEmployeeCountries: z.array(z.string()).nullable(),

  // Temporary employee information
  hasTemporaryEmployees: z.string().nullable(),
  totalTemporaryEmployees: z.number().nullable(),
  nepaliMaleTemporaryEmployees: z.number().nullable(),
  nepaliTemporaryFemaleEmployees: z.number().nullable(),
  hasForeignTemporaryEmployees: z.string().nullable(),
  foreignMaleTemporaryEmployees: z.number().nullable(),
  foreignFemaleTemporaryEmployees: z.number().nullable(),
  foreignTemporaryEmployeeCountries: z.array(z.string()).nullable(),

  // Geospatial data and name
  geom: z.any().nullable(), // Using any for geometry type since it's complex
  name: z.string().nullable(),

  // Status field
  status: z
    .enum(["approved", "pending", "requested_for_edit", "rejected"])
    .default("pending"),
});

// Schema for creating a new business (omits id)
export const createBusinessSchema = businessSchema.omit({ id: true });

// Schema for updating a business (all fields optional)
export const updateBusinessSchema = businessSchema.partial();

// Schema for querying businesses
export const businessQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  sortBy: z
    .enum([
      "business_name",
      "ward_no",
      "business_district",
      "operator_name",
      "status",
    ])
    .default("ward_no"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  filters: z
    .object({
      wardNo: z.number().optional(),
      businessDistrict: z.string().optional(),
      businessProvince: z.string().optional(),
      status: z
        .enum(["all", "pending", "approved", "rejected", "requested_for_edit"])
        .optional(),
    })
    .optional(),
  search: z.string().optional(),
});

// Schema for business status updates
export const businessStatusSchema = z.object({
  businessId: z.string(),
  status: z.enum([
    "approved",
    "pending",
    "requested_for_edit",
    "rejected",
  ]),
  message: z.string().optional(),
});

export type BusinessStatusUpdate = z.infer<typeof businessStatusSchema>;
export type Business = z.infer<typeof businessSchema>;
