import { z } from "zod";
import { ReligionTypeEnum } from "./ward-wise-religion-population.schema";

// Schema for municipality-wide religion population data
export const municipalityWideReligionPopulationSchema = z.object({
  id: z.string().optional(),
  religionType: ReligionTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering municipality-wide religion population data
export const municipalityWideReligionPopulationFilterSchema = z.object({
  religionType: ReligionTypeEnum.optional(),
});

export const updateMunicipalityWideReligionPopulationSchema = municipalityWideReligionPopulationSchema;

export type MunicipalityWideReligionPopulationData = z.infer<
  typeof municipalityWideReligionPopulationSchema
>;
export type UpdateMunicipalityWideReligionPopulationData = MunicipalityWideReligionPopulationData;
export type MunicipalityWideReligionPopulationFilter = z.infer<typeof municipalityWideReligionPopulationFilterSchema>;

// Religion labels in Nepali
export const RELIGION_LABELS: Record<string, string> = {
  HINDU: "हिन्दू",
  BUDDHIST: "बौद्ध",
  KIRANT: "किराँत",
  CHRISTIAN: "क्रिश्चियन",
  ISLAM: "इस्लाम",
  NATURE: "प्रकृति",
  BON: "बोन",
  JAIN: "जैन",
  BAHAI: "बहाई",
  SIKH: "सिख",
  OTHER: "अन्य",
};

// Export the religion options for use in UI components
export const religionOptions = Object.entries(RELIGION_LABELS).map(([key, value]) => ({
  value: key,
  label: value,
})); 