import { z } from "zod";

// Define the fruit type enum to match the database enum
export const FruitTypeEnum = z.enum([
  "MANGO",         // आँप
  "JACKFRUIT",     // रुखकटहर
  "LITCHI",        // लिची
  "BANANA",        // केरा
  "LEMON",         // कागती
  "ORANGE",        // सुन्तला
  "NIBUWA",        // निबुवा
  "SWEET_ORANGE",  // जुनार
  "SWEET_LEMON",   // मौसम
  "JYAMIR",        // ज्यामिर
  "POMELO",        // भोगटे
  "PINEAPPLE",     // भूईकटहर
  "PAPAYA",        // मेवा
  "AVOCADO",       // एभोकाडो
  "KIWI",          // किवी
  "GUAVA",         // अम्बा
  "PLUM",          // आरुबखडा
  "PEACH",         // आरु
  "PEAR",          // नासपाती
  "POMEGRANATE",   // अनार
  "WALNUT",        // ओखर
  "JAPANESE_PERSIMMON", // हलुवावेद
  "HOG_PLUM",      // लप्सी
  "NONE",          // कुनै फलफूलबाली उत्पदान गर्दिन
]);
export type FruitType = z.infer<typeof FruitTypeEnum>;

// Schema for municipality-wide fruits data
export const municipalityWideFruitsSchema = z.object({
  id: z.string().optional(),
  fruitType: FruitTypeEnum,
  productionInTonnes: z.number().nonnegative(),
  salesInTonnes: z.number().nonnegative(),
  revenueInRs: z.number().nonnegative(),
});

// Schema for filtering municipality-wide fruits data
export const municipalityWideFruitsFilterSchema = z.object({
  fruitType: FruitTypeEnum.optional(),
});

export const updateMunicipalityWideFruitsSchema = municipalityWideFruitsSchema;

export type MunicipalityWideFruitsData = z.infer<
  typeof municipalityWideFruitsSchema
>;
export type UpdateMunicipalityWideFruitsData = MunicipalityWideFruitsData;
export type MunicipalityWideFruitsFilter = z.infer<
  typeof municipalityWideFruitsFilterSchema
>;

// Export the fruit type options for use in UI components
export const fruitTypeOptions = [
  { value: "MANGO", label: "आँप" },
  { value: "JACKFRUIT", label: "रुखकटहर" },
  { value: "LITCHI", label: "लिची" },
  { value: "BANANA", label: "केरा" },
  { value: "LEMON", label: "कागती" },
  { value: "ORANGE", label: "सुन्तला" },
  { value: "NIBUWA", label: "निबुवा" },
  { value: "SWEET_ORANGE", label: "जुनार" },
  { value: "SWEET_LEMON", label: "मौसम" },
  { value: "JYAMIR", label: "ज्यामिर" },
  { value: "POMELO", label: "भोगटे" },
  { value: "PINEAPPLE", label: "भूईकटहर" },
  { value: "PAPAYA", label: "मेवा" },
  { value: "AVOCADO", label: "एभोकाडो" },
  { value: "KIWI", label: "किवी" },
  { value: "GUAVA", label: "अम्बा" },
  { value: "PLUM", label: "आरुबखडा" },
  { value: "PEACH", label: "आरु" },
  { value: "PEAR", label: "नासपाती" },
  { value: "POMEGRANATE", label: "अनार" },
  { value: "WALNUT", label: "ओखर" },
  { value: "JAPANESE_PERSIMMON", label: "हलुवावेद" },
  { value: "HOG_PLUM", label: "लप्सी" },
  { value: "NONE", label: "कुनै फलफूलबाली उत्पदान गर्दिन" },
];
