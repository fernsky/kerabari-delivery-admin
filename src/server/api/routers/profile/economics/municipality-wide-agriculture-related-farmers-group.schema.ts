import { z } from "zod";

// Schema for municipality-wide agriculture related farmers group data
export const municipalityWideAgricultureRelatedFarmersGroupSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  wardNumber: z.number().int().min(1).max(9, "Ward number must be between 1 and 9"),
});

// Schema for filtering
export const municipalityWideAgricultureRelatedFarmersGroupFilterSchema = z.object({
  name: z.string().optional(),
  wardNumber: z.number().int().min(1).max(9).optional(),
});

export const updateMunicipalityWideAgricultureRelatedFarmersGroupSchema =
  municipalityWideAgricultureRelatedFarmersGroupSchema;

export type MunicipalityWideAgricultureRelatedFarmersGroupData = z.infer<
  typeof municipalityWideAgricultureRelatedFarmersGroupSchema
>;
export type UpdateMunicipalityWideAgricultureRelatedFarmersGroupData =
  MunicipalityWideAgricultureRelatedFarmersGroupData;
export type MunicipalityWideAgricultureRelatedFarmersGroupFilter = z.infer<
  typeof municipalityWideAgricultureRelatedFarmersGroupFilterSchema
>;
