import { z } from "zod";

// Define the crop type enum to match the database enum
export const CropTypeEnum = z.enum([
  "RICE", // धान
  "WHEAT", // गहुँ
  "CORN", // मकै
  "VEGETABLES", // तरकारी
  "FRUITS", // फलफूल
  "OTHER", // अन्य
]);
export type CropType = z.infer<typeof CropTypeEnum>;

// Schema for municipality-wide crop diseases data
export const municipalityWideCropDiseasesSchema = z.object({
  id: z.string().optional(),
  crop: CropTypeEnum,
  majorPests: z.string().min(1, "Major pests information is required"),
  majorDiseases: z.string().min(1, "Major diseases information is required"),
});

// Schema for filtering municipality-wide crop diseases data
export const municipalityWideCropDiseasesFilterSchema = z.object({
  crop: CropTypeEnum.optional(),
});

export const updateMunicipalityWideCropDiseasesSchema =
  municipalityWideCropDiseasesSchema;

export type MunicipalityWideCropDiseasesData = z.infer<
  typeof municipalityWideCropDiseasesSchema
>;
export type UpdateMunicipalityWideCropDiseasesData =
  MunicipalityWideCropDiseasesData;
export type MunicipalityWideCropDiseasesFilter = z.infer<
  typeof municipalityWideCropDiseasesFilterSchema
>;

// Export the crop type options for use in UI components
export const cropTypeOptions = [
  { value: "RICE", label: "धान" },
  { value: "WHEAT", label: "गहुँ" },
  { value: "CORN", label: "मकै" },
  { value: "VEGETABLES", label: "तरकारी" },
  { value: "FRUITS", label: "फलफूल" },
  { value: "OTHER", label: "अन्य" },
  { value: "POTATO", label: "आलु" },
  { value: "MUSTARD", label: "तोरी" },

];
