import { z } from "zod";

// Define the chronic disease type enum to match the database enum
export const ChronicDiseaseTypeEnum = z.enum([
  "HEART_RELATED_DISEASE",
  "RESPIRATION_RELATED",
  "ASTHMA",
  "EPILEPSY",
  "TUMOR_CANCER",
  "DIABETES",
  "KIDNEY_RELATED",
  "LIVER_RELATED",
  "ARTHRITIS_JOINT_PAIN",
  "GYNECOLOGICAL_DISEASE",
  "OCCUPATIONAL_DISEASE",
  "BLOOD_PRESSURE_HIGH_LOW",
  "GASTRIC_ULCER_INTESTINE_DISEASE",
  "PARKINSON_ALZHEIMER",
  "MIGRAINE",
  "OTHER",
]);
export type ChronicDiseaseType = z.infer<typeof ChronicDiseaseTypeEnum>;

// Schema for ward-wise chronic diseases data
export const wardWiseChronicDiseasesSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  chronicDisease: ChronicDiseaseTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise chronic diseases data
export const wardWiseChronicDiseasesFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  chronicDisease: ChronicDiseaseTypeEnum.optional(),
});

export const updateWardWiseChronicDiseasesSchema =
  wardWiseChronicDiseasesSchema;

export type WardWiseChronicDiseasesData = z.infer<
  typeof wardWiseChronicDiseasesSchema
>;
export type UpdateWardWiseChronicDiseasesData = WardWiseChronicDiseasesData;
export type WardWiseChronicDiseasesFilter = z.infer<
  typeof wardWiseChronicDiseasesFilterSchema
>;

// Export the chronic disease options for use in UI components
export const chronicDiseaseOptions = [
  {
    value: "HEART_RELATED_DISEASE",
    label: "Heart-related disease (मुटुसम्बन्धी रोग)",
  },
  {
    value: "RESPIRATION_RELATED",
    label: "Respiratory disease (स्वास प्रस्वाससम्बन्धी)",
  },
  { value: "ASTHMA", label: "Asthma (दम)" },
  { value: "EPILEPSY", label: "Epilepsy (छारे रोग)" },
  { value: "TUMOR_CANCER", label: "Tumor/Cancer (अर्बुद (क्यान्सर))" },
  { value: "DIABETES", label: "Diabetes (मदुमेह)" },
  { value: "KIDNEY_RELATED", label: "Kidney-related disease (मृगौलासम्बन्धी)" },
  { value: "LIVER_RELATED", label: "Liver-related disease (कलेजोसम्बन्धी)" },
  {
    value: "ARTHRITIS_JOINT_PAIN",
    label: "Arthritis/Joint pain (बाथ/जोर्नी दुखाई)",
  },
  {
    value: "GYNECOLOGICAL_DISEASE",
    label: "Gynecological disease (स्त्री रोग)",
  },
  { value: "OCCUPATIONAL_DISEASE", label: "Occupational disease (पेशागत रोग)" },
  {
    value: "BLOOD_PRESSURE_HIGH_LOW",
    label: "Blood pressure (high/low) (रक्तचाप (उच्च / न्यून))",
  },
  {
    value: "GASTRIC_ULCER_INTESTINE_DISEASE",
    label: "Gastric/Ulcer/Intestinal disease (ग्यास्ट्रिक/अल्सर/आन्द्राको रोग)",
  },
  {
    value: "PARKINSON_ALZHEIMER",
    label: "Parkinson's/Alzheimer's disease (पार्किन्सन/अल्जाइमर)",
  },
  { value: "MIGRAINE", label: "Migraine (माइग्रेन)" },
  { value: "OTHER", label: "Other diseases (अन्य)" },
];
