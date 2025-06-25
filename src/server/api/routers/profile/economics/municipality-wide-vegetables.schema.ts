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
  { value: "potato", label: "आलु" },
  { value: "cauliflower", label: "काउली" },
  { value: "cabbage", label: "बन्दा" },
  { value: "tomato", label: "गोलभेडा / टमाटर" },
  { value: "radish", label: "मुला" },
  { value: "carrot", label: "गाँजर" },
  { value: "turnip", label: "सलगम" },
  { value: "capsicum", label: "भेडे खुर्सानी" },
  { value: "okra", label: "भिण्डी /रामतोरिया" },
  { value: "brinjal", label: "भण्टा/भ्यान्टा" },
  { value: "onion", label: "प्याज" },
  { value: "string_bean", label: "घिउ सिमी" },
  { value: "red_kidney_bean", label: "राज्मा सिमी" },
  { value: "cucumber", label: "काक्रो" },
  { value: "pumpkin", label: "फर्सी" },
  { value: "bitter_gourd", label: "करेला" },
  { value: "luffa", label: "घिरौला" },
  { value: "snake_gourd", label: "चिचिन्ना" },
  { value: "calabash", label: "लौका" },
  { value: "balsam_apple", label: "बरेला" },
  { value: "mushroom", label: "च्याउ" },
  { value: "squice", label: "स्कुस" },
  { value: "mustard_greens", label: "रायोको साग" },
  { value: "garden_cress", label: "चम्सुरको साग" },
  { value: "spinach", label: "पालुङ्गो साग" },
  { value: "colocasia", label: "पिडालु" },
  { value: "yam", label: "तरुल" },
  { value: "other", label: "अन्य तरकारी बाली" },
  { value: "none", label: "कुनै तरकारी बाली उत्पदान गर्दिन" },
];
