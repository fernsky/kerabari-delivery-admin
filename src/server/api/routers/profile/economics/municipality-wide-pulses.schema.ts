import { z } from "zod";

// Define the pulse type enum to match the database enum
export const PulseTypeEnum = z.enum([
  "LENTIL",
  "CHICKPEA",
  "PEA",
  "PIGEON_PEA",
  "BLACK_GRAM",
  "SOYABEAN",
  "SNAKE_BEAN",
  "BEAN",
  "HORSE_GRAM",
  "OTHER",
  "NONE",
]);
export type PulseType = z.infer<typeof PulseTypeEnum>;

// Schema for municipality-wide pulses data
export const municipalityWidePulsesSchema = z.object({
  id: z.string().optional(),
  pulse: PulseTypeEnum,
  productionInTonnes: z.number().nonnegative(),
  salesInTonnes: z.number().nonnegative(),
  revenueInRs: z.number().nonnegative(),
});

// Schema for filtering municipality-wide pulses data
export const municipalityWidePulsesFilterSchema = z.object({
  pulse: PulseTypeEnum.optional(),
});

export const updateMunicipalityWidePulsesSchema = municipalityWidePulsesSchema;

export type MunicipalityWidePulsesData = z.infer<
  typeof municipalityWidePulsesSchema
>;
export type UpdateMunicipalityWidePulsesData = MunicipalityWidePulsesData;
export type MunicipalityWidePulsesFilter = z.infer<
  typeof municipalityWidePulsesFilterSchema
>;

// Export the pulse options for use in UI components
export const pulseTypeOptions = [
  { value: "pigeon_pea", label: "रहर" },
  { value: "black_gram", label: "मास" },
  { value: "lentil", label: "मसुरो" },
  { value: "chickpea", label: "चना" },
  { value: "soyabean", label: "भटमास" },
  { value: "snake_bean", label: "बोडी" },
  { value: "bean", label: "सिमी" },
  { value: "horse_gram", label: "गहत" },
  { value: "pea", label: "केराउ" },
  { value: "other", label: "अन्य दालबाली (मस्याङ्, खेसरी,....)" },
  { value: "none", label: "कुनै दालबाली उत्पदान गर्दिन" },
];
