import { z } from "zod";

// Define the irrigation source type enum to match the database enum
export const IrrigationSourceTypeEnum = z.enum([
  "LAKE_OR_RESERVOIR",
  "IRRIGATION_CANAL",
  "RAINWATER_COLLECTION",
  "ELECTRIC_LIFT_IRRIGATION",
  "CANAL",
  "PUMPING_SET",
  "UNDERGROUND_IRRIGATION",
  "OTHER",
]);
export type IrrigationSourceType = z.infer<typeof IrrigationSourceTypeEnum>;

// Schema for municipality-wide irrigation source data
export const municipalityWideIrrigationSourceSchema = z.object({
  id: z.string().optional(),
  irrigationSource: IrrigationSourceTypeEnum,
  coverageInHectares: z.number().nonnegative(),
});

// Schema for filtering municipality-wide irrigation source data
export const municipalityWideIrrigationSourceFilterSchema = z.object({
  irrigationSource: IrrigationSourceTypeEnum.optional(),
});

export const updateMunicipalityWideIrrigationSourceSchema = municipalityWideIrrigationSourceSchema;

export type MunicipalityWideIrrigationSourceData = z.infer<
  typeof municipalityWideIrrigationSourceSchema
>;
export type UpdateMunicipalityWideIrrigationSourceData = MunicipalityWideIrrigationSourceData;
export type MunicipalityWideIrrigationSourceFilter = z.infer<
  typeof municipalityWideIrrigationSourceFilterSchema
>;

// Export the irrigation source options for use in UI components
export const irrigationSourceTypeOptions = [
  { value: "LAKE_OR_RESERVOIR", label: "ताल वा जलाशय" },
  { value: "IRRIGATION_CANAL", label: "सिंचाई नहर" },
  { value: "RAINWATER_COLLECTION", label: "वर्षाको पानी संकलन" },
  { value: "ELECTRIC_LIFT_IRRIGATION", label: "विद्युतीय लिफ्ट सिंचाई" },
  { value: "CANAL", label: "नहर" },
  { value: "PUMPING_SET", label: "पम्पिङ सेट" },
  { value: "UNDERGROUND_IRRIGATION", label: "भूमिगत सिंचाई" },
  { value: "OTHER", label: "अन्य" },
];
