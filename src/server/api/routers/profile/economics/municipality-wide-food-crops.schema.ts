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
  { value: "PADDY", label: "धान" },
  { value: "CORN", label: "मकै" },
  { value: "WHEAT", label: "गहुँ" },
  { value: "MILLET", label: "कोदो" },
  { value: "BARLEY", label: "जौ" },
  { value: "PHAPAR", label: "फापर" },
  { value: "JUNELO", label: "जुनेलो" },
  { value: "KAGUNO", label: "कागुनो" },
  { value: "OTHER", label: "अन्य खद्यान्नबाली" },
];
