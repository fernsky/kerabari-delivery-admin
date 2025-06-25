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
  { value: "mango", label: "आँप" },
  { value: "jackfruit", label: "रुखकटहर" },
  { value: "banana", label: "केरा" },
  { value: "lemon", label: "कागती" },
  { value: "orange", label: "सुन्तला" },
  { value: "nibuwa", label: "निबुवा"},
  { value: "sweet_orange", label: "जुनार" },
  { value: "sweet_lemon", label: "मौसम" },
  { value: "jyamir", label: "ज्यामिर" },
  { value: "pomelo", label: "भोगटे" },
  { value: "pineapple", label: "भूईकटहर" },
  { value: "papaya", label: "मेवा" },
  { value: "avocado", label: "एभोकाडो" },
  { value: "kiwi", label: "किवी" },
  { value: "guava", label: "अम्बा" },
  { value: "plum", label: "आरुबखडा" },
  { value: "peach", label: "आरु" },
  { value: "pear", label: "नासपाती" },
  { value: "pomegranate", label: "अनार" },
  { value: "walnut", label: "ओखर" },
  { value: "japanese_persimmon", label: "हलुवावेद" },
  { value: "hog_plum", label: "लप्सी" },
  { value: "none", label: "कुनै फलफूलबाली उत्पदान गर्दिन" },
  { value: "litchi", label: "लिची" },
  { value: "other", label: "अन्य फलफूलबाली" },
];
