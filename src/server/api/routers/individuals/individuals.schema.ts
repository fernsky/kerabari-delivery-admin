import { z } from "zod";

export const individualSchema = z.object({
  // Primary identification
  id: z.string(),
  tenantId: z.string().nullable(),
  parentId: z.string(), // References household ID
  wardNo: z.number(),
  deviceId: z.string().nullable(),
  
  // Personal information
  name: z.string(),
  gender: z.string(),
  age: z.number().nullable(),
  familyRole: z.string().nullable(),
  
  // Citizenship and demographics
  citizenOf: z.string().nullable(),
  citizenOfOther: z.string().nullable(),
  caste: z.string().nullable(),
  casteOther: z.string().nullable(),
  
  // Language and religion
  ancestorLanguage: z.string().nullable(),
  ancestorLanguageOther: z.string().nullable(),
  primaryMotherTongue: z.string().nullable(),
  primaryMotherTongueOther: z.string().nullable(),
  religion: z.string().nullable(),
  religionOther: z.string().nullable(),
  
  // Marital status
  maritalStatus: z.string().nullable(),
  marriedAge: z.number().nullable(),
  
  // Health information
  hasChronicDisease: z.string().nullable(),
  primaryChronicDisease: z.string().nullable(),
  isSanitized: z.string().nullable(),
  
  // Disability information
  isDisabled: z.string().nullable(),
  disabilityType: z.string().nullable(),
  disabilityTypeOther: z.string().nullable(),
  disabilityCause: z.string().nullable(),
  
  // Birth and children information
  hasBirthCertificate: z.string().nullable(),
  gaveLiveBirth: z.string().nullable(),
  aliveSons: z.number().nullable(),
  aliveDaughters: z.number().nullable(),
  totalBornChildren: z.number().nullable(),
  hasDeadChildren: z.string().nullable(),
  deadSons: z.number().nullable(),
  deadDaughters: z.number().nullable(),
  totalDeadChildren: z.number().nullable(),
  
  // Recent childbirth information
  gaveRecentLiveBirth: z.string().nullable(),
  recentBornSons: z.number().nullable(),
  recentBornDaughters: z.number().nullable(),
  totalRecentChildren: z.number().nullable(),
  recentDeliveryLocation: z.string().nullable(),
  prenatalCheckups: z.number().nullable(),
  firstDeliveryAge: z.number().nullable(),
  
  // Presence and absence information
  isPresent: z.string().nullable(),
  absenteeAge: z.number().nullable(),
  absenteeEducationalLevel: z.string().nullable(),
  absenceReason: z.string().nullable(),
  absenteeLocation: z.string().nullable(),
  absenteeProvince: z.string().nullable(),
  absenteeDistrict: z.string().nullable(),
  absenteeCountry: z.string().nullable(),
  absenteeHasSentCash: z.string().nullable(),
  absenteeCashAmount: z.number().nullable(),
  
  // Education information
  literacyStatus: z.string().nullable(),
  schoolPresenceStatus: z.string().nullable(),
  educationalLevel: z.string().nullable(),
  primarySubject: z.string().nullable(),
  goesSchool: z.string().nullable(),
  schoolBarrier: z.string().nullable(),
  
  // Skills and training
  hasTraining: z.string().nullable(),
  training: z.string().nullable(),
  monthsTrained: z.number().nullable(),
  primarySkill: z.string().nullable(),
  
  // Internet access
  hasInternetAccess: z.string().nullable(),
  
  // Employment information
  financialWorkDuration: z.string().nullable(),
  primaryOccupation: z.string().nullable(),
  workBarrier: z.string().nullable(),
  workAvailability: z.string().nullable(),
});

export const createIndividualSchema = individualSchema.omit({ id: true });

export const updateIndividualSchema = individualSchema.partial();

export const individualQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  sortBy: z
    .enum([
      "name", 
      "age", 
      "gender",
      "familyRole",
    ])
    .default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  filters: z
    .object({
      wardNo: z.number().optional(),
      gender: z.string().optional(),
      age: z.number().optional(),
      familyRole: z.string().optional(),
      isPresent: z.string().optional(),
      educationalLevel: z.string().optional(),
      isDisabled: z.string().optional(),
      parentId: z.string().optional(), // Filter by household
    })
    .optional(),
  search: z.string().optional(),
});

export const individualStatusSchema = z.object({
  individualId: z.string(),
  message: z.string().optional(), // For edit request details
});

export type IndividualStatusUpdate = z.infer<typeof individualStatusSchema>;

export type Individual = z.infer<typeof individualSchema>;
