import { z } from "zod";

// Define the vegetable type enum to match the database enum
export const VegetableTypeEnum = z.enum([
  "POTATO", // आलु
  "CAULIFLOWER", // काउली
  "CABBAGE", // बन्दा
  "TOMATO", // गोलभेडा / टमाटर
  "RADISH", // मुला
  "CARROT", // गाँजर
  "TURNIP", // सलगम
  "CAPSICUM", // भेडे खुर्सानी
  "OKRA", // भिण्डी /रामतोरिया
  "BRINJAL", // भण्टा/भ्यान्टा
  "ONION", // प्याज
  "STRING_BEAN", // घिउ सिमी
  "RED_KIDNEY_BEAN", // राज्मा सिमी
  "CUCUMBER", // काक्रो
  "PUMPKIN", // फर्सी
  "BITTER_GOURD", // करेला
  "LUFFA", // घिरौला
  "SNAKE_GOURD", // चिचिन्ना
  "CALABASH", // लौका
  "BALSAM_APPLE", // बरेला
  "MUSHROOM", // च्याउ
  "SQUICE", // स्कुस
  "MUSTARD_GREENS", // रायोको साग
  "GARDEN_CRESS", // चम्सुरको साग
  "SPINACH", // पालुङ्गो साग
  "COLOCASIA", // पिडालु
  "YAM", // तरुल
  "OTHER", // अन्य तरकारी बाली
  "NONE", // कुनै तरकारी बाली उत्पदान गर्दिन
]);
export type VegetableType = z.infer<typeof VegetableTypeEnum>;

// Schema for municipality-wide vegetables data
export const municipalityWideVegetablesSchema = z.object({
  id: z.string().optional(),
  vegetableType: VegetableTypeEnum,
  productionInTonnes: z.number().nonnegative(),
  salesInTonnes: z.number().nonnegative(),
  revenueInRs: z.number().nonnegative(),
});

// Schema for filtering municipality-wide vegetables data
export const municipalityWideVegetablesFilterSchema = z.object({
  vegetableType: VegetableTypeEnum.optional(),
});

export const updateMunicipalityWideVegetablesSchema =
  municipalityWideVegetablesSchema;

export type MunicipalityWideVegetablesData = z.infer<
  typeof municipalityWideVegetablesSchema
>;
export type UpdateMunicipalityWideVegetablesData =
  MunicipalityWideVegetablesData;
export type MunicipalityWideVegetablesFilter = z.infer<
  typeof municipalityWideVegetablesFilterSchema
>;

// Export the vegetable type options for use in UI components
export const vegetableTypeOptions = [
  { value: "POTATO", label: "आलु" },
  { value: "CAULIFLOWER", label: "काउली" },
  { value: "CABBAGE", label: "बन्दा" },
  { value: "TOMATO", label: "गोलभेडा / टमाटर" },
  { value: "RADISH", label: "मुला" },
  { value: "CARROT", label: "गाँजर" },
  { value: "TURNIP", label: "सलगम" },
  { value: "CAPSICUM", label: "भेडे खुर्सानी" },
  { value: "OKRA", label: "भिण्डी /रामतोरिया" },
  { value: "BRINJAL", label: "भण्टा/भ्यान्टा" },
  { value: "ONION", label: "प्याज" },
  { value: "STRING_BEAN", label: "घिउ सिमी" },
  { value: "RED_KIDNEY_BEAN", label: "राज्मा सिमी" },
  { value: "CUCUMBER", label: "काक्रो" },
  { value: "PUMPKIN", label: "फर्सी" },
  { value: "BITTER_GOURD", label: "करेला" },
  { value: "LUFFA", label: "घिरौला" },
  { value: "SNAKE_GOURD", label: "चिचिन्ना" },
  { value: "CALABASH", label: "लौका" },
  { value: "BALSAM_APPLE", label: "बरेला" },
  { value: "MUSHROOM", label: "च्याउ" },
  { value: "SQUICE", label: "स्कुस" },
  { value: "MUSTARD_GREENS", label: "रायोको साग" },
  { value: "GARDEN_CRESS", label: "चम्सुरको साग" },
  { value: "SPINACH", label: "पालुङ्गो साग" },
  { value: "COLOCASIA", label: "पिडालु" },
  { value: "YAM", label: "तरुल" },
  { value: "OTHER", label: "अन्य तरकारी बाली" },
  { value: "NONE", label: "कुनै तरकारी बाली उत्पदान गर्दिन" },
];
