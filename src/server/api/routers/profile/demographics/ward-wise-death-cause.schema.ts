import { z } from "zod";

// Define the death cause type enum for validation
export const DeathCauseTypeEnum = z.enum([
  "HAIJA",
  "PNEUMONIA",
  "FLU",
  "TUBERCULOSIS",
  "LEPROSY",
  "JAUNDICE_HEPATITIS",
  "TYPHOID",
  "VIRAL_INFLUENZA",
  "ENCEPHALITIS",
  "MENINGITIS",
  "HEPATITIS",
  "MALARIA",
  "KALA_AZAR",
  "HIV_AIDS",
  "OTHER_SEXUALLY_TRANSMITTED_DISEASES",
  "MEASLES",
  "SCABIES",
  "RABIES",
  "COVID19_CORONAVIRUS",
  "OTHER_INFECTIOUS_DISEASES",
  "HEART_RELATED_DISEASES",
  "RESPIRATORY_DISEASES",
  "ASTHMA",
  "EPILEPSY",
  "CANCER",
  "DIABETES",
  "KIDNEY_RELATED_DISEASES",
  "LIVER_RELATED_DISEASES",
  "BRAIN_RELATED",
  "BLOOD_PRESSURE",
  "GASTRIC_ULCER_INTESTINAL_DISEASE",
  "REPRODUCTIVE_OR_OBSTETRIC_CAUSES",
  "TRAFFIC_ACCIDENT",
  "OTHER_ACCIDENTS",
  "SUICIDE",
  "NATURAL_DISASTER",
  "DEATH_BY_OLD_AGE",
  "OTHER",
]);
export type DeathCauseType = z.infer<typeof DeathCauseTypeEnum>;

// Define Nepali death cause labels for display
export const deathCauseLabels: Record<string, string> = {
  HAIJA: "हैजा/झाडा पखाला/आउँ",
  PNEUMONIA: "निमोनिया",
  FLU: "रुघाखोकी, फ्लु",
  TUBERCULOSIS: "क्षयरोग",
  LEPROSY: "कुष्टरोग",
  JAUNDICE_HEPATITIS: "जण्डीस (कमलपित्त)",
  TYPHOID: "टाइफाइड",
  VIRAL_INFLUENZA: "भाइरल इन्फ्लुएन्जा",
  ENCEPHALITIS: "इन्सेफलाइटिस",
  MENINGITIS: "मेनेन्जाइटिस",
  HEPATITIS: "हेपाटाइटिस",
  MALARIA: "मलेरिया",
  KALA_AZAR: "कालाज्वरो",
  HIV_AIDS: "एचआईभी/एड्स",
  OTHER_SEXUALLY_TRANSMITTED_DISEASES: "अन्य यौन रोग",
  MEASLES: "दादुरा",
  SCABIES: "ठेउला",
  RABIES: "रेबिज",
  COVID19_CORONAVIRUS: "कोभिड-19 (कोरोना भाइरस) को कारणले",
  OTHER_INFECTIOUS_DISEASES: "अन्य सरुवा रोग (बर्ड फ्लु /स्वाइन फ्लू/प्लेग आदि)",
  HEART_RELATED_DISEASES: "मुटुसम्बन्धी रोगहरू",
  RESPIRATORY_DISEASES: "श्वास प्रश्वाससम्बन्धी रोगहरू",
  ASTHMA: "दम",
  EPILEPSY: "छारे रोग",
  CANCER: "क्यान्सर",
  DIABETES: "मधुमेह (डाइबिटिज)",
  KIDNEY_RELATED_DISEASES: "मृगौलासम्बन्धी रोग",
  OTHER_ACCIDENT: "अन्य दुर्घटना",
  LIVER_RELATED_DISEASES: "कलेजोसम्बन्धी रोग",
  BRAIN_RELATED: "टाउको सम्बन्धी (ब्रेन ह्यामरेज)",
  BLOOD_PRESSURE: "रक्तचाप (उच्च तथा निम्न रक्तचाप)",
  GASTRIC_ULCER_INTESTINAL_DISEASE: "ग्यास्ट्रिक अल्सर/आन्द्राको रोग",
  REPRODUCTIVE_OR_OBSTETRIC_CAUSES: "प्रजनन वा प्रसुतीजन्य कारणहरू",
  TRAFFIC_ACCIDENT: "यातायात दुर्घटना",
  OTHER_ACCIDENTS: "अन्य दुर्घटना",
  SUICIDE: "आत्महत्या",
  NATURAL_DISASTER: "प्राकृतिक प्रकोप",
  DEATH_BY_OLD_AGE: "कालगतिले मर्नु",
  NOT_STATED: "उल्लेख गरिएको छैन",
  BLOOD_PRESSURE_HIGH_AND_LOW_BLOOD_PRESSURE: "रक्तचाप (उच्च तथा निम्न रक्तचाप)",
  OTHER_INFECTIOUS_DISEASES_BIRD_FLU_SWINE_FLU_PLAGUE_ETC: "अन्य सरुवा रोग (बर्ड फ्लु /स्वाइन फ्लू/प्लेग आदि)",
  BRAIN_RELATED_BRAIN_HEMORRHAGE: "टाउको सम्बन्धी (ब्रेन ह्यामरेज)",
  OTHER: "अन्य कारण",
};  

// Schema for ward-wise death cause data
export const wardWiseDeathCauseSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().nonnegative(),
  deathCause: DeathCauseTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise death cause data
export const wardWiseDeathCauseFilterSchema = z.object({
  wardNumber: z.number().int().nonnegative().optional(),
  deathCause: DeathCauseTypeEnum.optional(),
});

export const updateWardWiseDeathCauseSchema = wardWiseDeathCauseSchema;

export type WardWiseDeathCauseData = z.infer<typeof wardWiseDeathCauseSchema>;
export type UpdateWardWiseDeathCauseData = WardWiseDeathCauseData;
export type WardWiseDeathCauseFilter = z.infer<typeof wardWiseDeathCauseFilterSchema>;
