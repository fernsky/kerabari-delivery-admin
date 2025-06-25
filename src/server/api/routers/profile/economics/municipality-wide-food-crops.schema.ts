import { z } from "zod";

// Define the food crop type enum to match the database enum
export const FoodCropTypeEnum = z.enum([
  "PADDY",
  "CORN",
  "WHEAT",
  "MILLET",
  "BARLEY",
  "PHAPAR",
  "JUNELO",
  "KAGUNO",
  "OTHER",
]);
export type FoodCropType = z.infer<typeof FoodCropTypeEnum>;

// Schema for municipality-wide food crops data
export const municipalityWideFoodCropsSchema = z.object({
  id: z.string().optional(),
  foodCrop: FoodCropTypeEnum,
  productionInTonnes: z.number().nonnegative(),
  salesInTonnes: z.number().nonnegative(),
  revenueInRs: z.number().nonnegative(),
});

// Schema for filtering municipality-wide food crops data
export const municipalityWideFoodCropsFilterSchema = z.object({
  foodCrop: FoodCropTypeEnum.optional(),
});

export const updateMunicipalityWideFoodCropsSchema =
  municipalityWideFoodCropsSchema;

export type MunicipalityWideFoodCropsData = z.infer<
  typeof municipalityWideFoodCropsSchema
>;
export type UpdateMunicipalityWideFoodCropsData = MunicipalityWideFoodCropsData;
export type MunicipalityWideFoodCropsFilter = z.infer<
  typeof municipalityWideFoodCropsFilterSchema
>;

// Export the food crop options for use in UI components
export const foodCropTypeOptions = [
  { value: "chaite_paddy", label: "चैते धान" },
  { value: "barse_paddy", label: "बर्षे धान" },
  { value: "corn", label: "मकै" },
  { value: "wheat", label: "गहुँ" },
  { value: "millet", label: "कोदो" },
  { value: "barley", label: "जौ" },
  { value: "phapar", label: "फापर" },
  { value: "junelo", label: "जुनेलो" },
  { value: "kaguno", label: "कागुनो" },
  { value: "other", label: "अन्य खद्यान्नबाली" },
  { value: "none", label: "कुनै अन्नबाली उत्पदान गर्दिन" },
];
