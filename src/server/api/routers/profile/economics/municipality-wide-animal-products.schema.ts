import { z } from "zod";

// Define the animal product type enum to match the database enum
export const AnimalProductTypeEnum = z.enum([
  "MILK", // दुध
  "MILK_PRODUCT", // दुधजन्य वस्तु (ध्यू, चिज, मखन आदि)
  "EGG", // अण्डा
  "MEAT", // मासु
  "OTHER", // अन्य
]);
export type AnimalProductType = z.infer<typeof AnimalProductTypeEnum>;

// Define the measurement unit enum
export const MeasurementUnitEnum = z.enum([
  "TON", // टन
  "KG", // किलोग्राम
  "COUNT", // संख्या
  "LITER", // लिटर
  "OTHER", // अन्य
]);
export type MeasurementUnit = z.infer<typeof MeasurementUnitEnum>;

// Schema for municipality-wide animal products data
export const municipalityWideAnimalProductsSchema = z.object({
  id: z.string().optional(),
  animalProduct: AnimalProductTypeEnum,
  productionAmount: z.number().nonnegative(),
  salesAmount: z.number().nonnegative(),
  revenue: z.number().nonnegative(),
  measurementUnit: MeasurementUnitEnum,
});

// Schema for filtering municipality-wide animal products data
export const municipalityWideAnimalProductsFilterSchema = z.object({
  animalProduct: AnimalProductTypeEnum.optional(),
});

export const updateMunicipalityWideAnimalProductsSchema =
  municipalityWideAnimalProductsSchema;

export type MunicipalityWideAnimalProductsData = z.infer<
  typeof municipalityWideAnimalProductsSchema
>;
export type UpdateMunicipalityWideAnimalProductsData =
  MunicipalityWideAnimalProductsData;
export type MunicipalityWideAnimalProductsFilter = z.infer<
  typeof municipalityWideAnimalProductsFilterSchema
>;

// Export the animal product type options for use in UI components
export const animalProductTypeOptions = [
  { value: "MILK", label: "दुध" },
  { value: "MILK_PRODUCT", label: "दुधजन्य वस्तु (ध्यू, चिज, मखन आदि)" },
  { value: "EGG", label: "अण्डा" },
  { value: "MEAT", label: "मासु" },
  { value: "OTHER", label: "अन्य" },
];

// Export the measurement unit options for use in UI components
export const measurementUnitOptions = [
  { value: "TON", label: "टन" },
  { value: "KG", label: "किलोग्राम" },
  { value: "COUNT", label: "संख्या" },
  { value: "LITER", label: "लिटर" },
  { value: "OTHER", label: "अन्य" },
];
