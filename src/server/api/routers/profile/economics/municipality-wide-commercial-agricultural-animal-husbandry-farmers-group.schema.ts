import { z } from "zod";

// Define the business type enum to match the database enum
export const BusinessTypeEnum = z.enum([
  "VEGETABLE_FARMING", // तरकारी खेती
  "GOAT_FARMING", // बाख्रा पालन
  "POULTRY_FARMING", // कुखुरा पालन
  "FISH_FARMING", // माछा पालन
  "CATTLE_FARMING", // गाई/भैंसी पालन
  "ANIMAL_HUSBANDRY", // पशुपालन
  "LIVESTOCK_POULTRY", // पशुपंछी पालन
  "BEEKEEPING", // मौरी पालन
  "FRUIT_FARMING", // फलफूल खेती
  "MUSHROOM_FARMING", // च्याउ खेती
  "PIG_FARMING", // बंगुर पालन
  "NURSERY", // नर्सरी
  "DAIRY_FARMING", // दुग्ध उत्पादन
  "MIXED_FARMING", // मिश्रित खेती
  "AGRICULTURE", // कृषि
  "ORGANIC_FARMING", // जैविक खेती
  "OTHER", // अन्य
]);
export type BusinessType = z.infer<typeof BusinessTypeEnum>;

// Schema for municipality-wide commercial agricultural animal husbandry farmers group data
export const municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  wardNumber: z.number().int().min(1).max(9, "Ward number must be between 1 and 9"),
  type: BusinessTypeEnum,
});

// Schema for filtering
export const municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupFilterSchema = z.object({
  name: z.string().optional(),
  wardNumber: z.number().int().min(1).max(9).optional(),
  type: BusinessTypeEnum.optional(),
});

export const updateMunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupSchema =
  municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupSchema;

export type MunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupData = z.infer<
  typeof municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupSchema
>;
export type UpdateMunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupData =
  MunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupData;
export type MunicipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupFilter = z.infer<
  typeof municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupFilterSchema
>;

// Export the business type options for use in UI components
export const businessTypeOptions = [
  { value: "VEGETABLE_FARMING", label: "तरकारी खेती" },
  { value: "GOAT_FARMING", label: "बाख्रा पालन" },
  { value: "POULTRY_FARMING", label: "कुखुरा पालन" },
  { value: "FISH_FARMING", label: "माछा पालन" },
  { value: "CATTLE_FARMING", label: "गाई/भैंसी पालन" },
  { value: "ANIMAL_HUSBANDRY", label: "पशुपालन" },
  { value: "LIVESTOCK_POULTRY", label: "पशुपंछी पालन" },
  { value: "BEEKEEPING", label: "मौरी पालन" },
  { value: "FRUIT_FARMING", label: "फलफूल खेती" },
  { value: "MUSHROOM_FARMING", label: "च्याउ खेती" },
  { value: "PIG_FARMING", label: "बंगुर पालन" },
  { value: "NURSERY", label: "नर्सरी" },
  { value: "DAIRY_FARMING", label: "दुग्ध उत्पादन" },
  { value: "MIXED_FARMING", label: "मिश्रित खेती" },
  { value: "AGRICULTURE", label: "कृषि" },
  { value: "ORGANIC_FARMING", label: "जैविक खेती" },
  { value: "OTHER", label: "अन्य" },
];
