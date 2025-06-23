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
  { value: "LENTIL", label: "मसुरो" },
  { value: "CHICKPEA", label: "चना" },
  { value: "PEA", label: "केराउ" },
  { value: "PIGEON_PEA", label: "रहर" },
  { value: "BLACK_GRAM", label: "मास" },
  { value: "SOYABEAN", label: "भटमास" },
  { value: "SNAKE_BEAN", label: "बोडी" },
  { value: "BEAN", label: "सिमी" },
  { value: "HORSE_GRAM", label: "गहत" },
  { value: "OTHER", label: "अन्य दालबाली (मस्याङ्, खेसरी,....)" },
  { value: "NONE", label: "कुनै दालबाली उत्पदान गर्दिन" },
];
