import { z } from "zod";

// Define the oil seed type enum to match the database enum
export const OilSeedTypeEnum = z.enum([
  "MUSTARD",
  "FLAX",
  "SUNFLOWER",
  "OTHER",
  "NONE",
]);
export type OilSeedType = z.infer<typeof OilSeedTypeEnum>;

// Schema for municipality-wide oil seeds data
export const municipalityWideOilSeedsSchema = z.object({
  id: z.string().optional(),
  oilSeed: OilSeedTypeEnum,
  productionInTonnes: z.number().nonnegative(),
  salesInTonnes: z.number().nonnegative(),
  revenueInRs: z.number().nonnegative(),
});

// Schema for filtering municipality-wide oil seeds data
export const municipalityWideOilSeedsFilterSchema = z.object({
  oilSeed: OilSeedTypeEnum.optional(),
});

export const updateMunicipalityWideOilSeedsSchema =
  municipalityWideOilSeedsSchema;

export type MunicipalityWideOilSeedsData = z.infer<
  typeof municipalityWideOilSeedsSchema
>;
export type UpdateMunicipalityWideOilSeedsData = MunicipalityWideOilSeedsData;
export type MunicipalityWideOilSeedsFilter = z.infer<
  typeof municipalityWideOilSeedsFilterSchema
>;

// Export the oil seed options for use in UI components
export const oilSeedTypeOptions = [
  { value: "mustard", label: "तोरी/सरसोँ" },
  { value: "flax", label: "आलस" },
  { value: "sunflower", label: "सूर्यमूखी" },
  { value: "other", label: "अन्य तेलबाली (जैतुन, रायो, ...)" },
  { value: "none", label: "कुनै तेलबाली उत्पदान गर्दिन" },
];
