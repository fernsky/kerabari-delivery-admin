import { z } from "zod";

// Define the spice type enum to match the database enum
export const SpiceTypeEnum = z.enum([
  "GARLIC", // लसुन
  "TURMERIC", // बेसार
  "CHILI_PEPPER", // खुर्सानी
  "GINGER", // अदुवा
  "CORIANDER", // धनिया
  "SICHUAN_PEPPER", // टिमुर
  "BLACK_PEPPER", // मरिच
  "CINNAMOMUM_TAMALA", // तेजपात
  "CUMIN", // जीरा
  "FENUGREEK", // मेथी
  "OTHER", // अन्य मसलाबाली
  "NONE", // कुनै मसलाबाली उत्पदान गर्दिन
]);
export type SpiceType = z.infer<typeof SpiceTypeEnum>;

// Schema for municipality-wide spices data
export const municipalityWideSpicesSchema = z.object({
  id: z.string().optional(),
  spiceType: SpiceTypeEnum,
  productionInTonnes: z.number().nonnegative(),
  salesInTonnes: z.number().nonnegative(),
  revenueInRs: z.number().nonnegative(),
});

// Schema for filtering municipality-wide spices data
export const municipalityWideSpicesFilterSchema = z.object({
  spiceType: SpiceTypeEnum.optional(),
});

export const updateMunicipalityWideSpicesSchema = municipalityWideSpicesSchema;

export type MunicipalityWideSpicesData = z.infer<
  typeof municipalityWideSpicesSchema
>;
export type UpdateMunicipalityWideSpicesData = MunicipalityWideSpicesData;
export type MunicipalityWideSpicesFilter = z.infer<
  typeof municipalityWideSpicesFilterSchema
>;

// Export the spice type options for use in UI components
export const spiceTypeOptions = [
  { value: "GARLIC", label: "लसुन" },
  { value: "TURMERIC", label: "बेसार" },
  { value: "CHILI_PEPPER", label: "खुर्सानी" },
  { value: "GINGER", label: "अदुवा" },
  { value: "CORIANDER", label: "धनिया" },
  { value: "SICHUAN_PEPPER", label: "टिमुर" },
  { value: "BLACK_PEPPER", label: "मरिच" },
  { value: "CINNAMOMUM_TAMALA", label: "तेजपात" },
  { value: "CUMIN", label: "जीरा" },
  { value: "FENUGREEK", label: "मेथी" },
  { value: "OTHER", label: "अन्य मसलाबाली" },
  { value: "NONE", label: "कुनै मसलाबाली उत्पदान गर्दिन" },
];
