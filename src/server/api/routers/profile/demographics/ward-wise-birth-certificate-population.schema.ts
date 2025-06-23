import { z } from "zod";

// Schema for ward-wise birth certificate population data
export const wardWiseBirthCertificatePopulationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  withBirthCertificate: z.number().int().nonnegative(),
  withoutBirthCertificate: z.number().int().nonnegative(),
  totalPopulationUnder5: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise birth certificate population data
export const wardWiseBirthCertificatePopulationFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
});

export const updateWardWiseBirthCertificatePopulationSchema = 
  wardWiseBirthCertificatePopulationSchema;

export type WardWiseBirthCertificatePopulationData = z.infer<
  typeof wardWiseBirthCertificatePopulationSchema
>;
export type UpdateWardWiseBirthCertificatePopulationData =
  WardWiseBirthCertificatePopulationData;
export type WardWiseBirthCertificatePopulationFilter = z.infer<
  typeof wardWiseBirthCertificatePopulationFilterSchema
>;
