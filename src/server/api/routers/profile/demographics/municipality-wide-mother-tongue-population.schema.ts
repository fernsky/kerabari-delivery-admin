import { z } from "zod";
import { LanguageTypeEnum } from "./ward-wise-mother-tongue-population.schema";

// Schema for municipality-wide mother tongue population data
export const municipalityWideMotherTonguePopulationSchema = z.object({
  id: z.string().optional(),
  motherTongue: LanguageTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering municipality-wide mother tongue population data
export const municipalityWideMotherTonguePopulationFilterSchema = z.object({
  motherTongue: LanguageTypeEnum.optional(),
});

export const updateMunicipalityWideMotherTonguePopulationSchema = municipalityWideMotherTonguePopulationSchema;

export type MunicipalityWideMotherTonguePopulationData = z.infer<
  typeof municipalityWideMotherTonguePopulationSchema
>;
export type UpdateMunicipalityWideMotherTonguePopulationData = MunicipalityWideMotherTonguePopulationData;
export type MunicipalityWideMotherTonguePopulationFilter = z.infer<typeof municipalityWideMotherTonguePopulationFilterSchema>;
// Mother tongue labels in Nepali
export const MOTHER_TONGUE_LABELS: Record<string, string> = {
  NEPALI: "नेपाली",
  MAITHILI: "मैथिली",
  BHOJPURI: "भोजपुरी",
  THARU: "थारु",
  TAMANG: "तामाङ",
  NEWAR: "नेवारी",
  MAGAR: "मगर",
  BAJJIKA: "बज्जिका",
  URDU: "उर्दू",
  AVADHI: "अवधी",
  LIMBU: "लिम्बु",
  GURUNG: "गुरुङ",
  KAMI: "कामी",
  SHERPA: "शेर्पा",
  SANTHALI: "सन्थाली",
  RAI: "राई",
  MAGAHI: "मगही",
  ENGLISH: "अंग्रेजी",
  HINDI: "हिन्दी",
  TIBETAN: "तिब्बती",
  CHEPANG: "चेपाङ",
  BANTAWA: "बन्तवा",
  CHAMLING: "चामलिङ",
  KULUNG: "कुलुङ",
  THULUNG: "थुलुङ",
  SAMPANG: "साम्पाङ",
  NACHHIRING: "नाछिरिङ",
  KHALING: "खालिङ",
  KOYU: "कोयु",
  SUNUWAR: "सुनुवार",
  DANUWAR: "दनुवार",
  MAJHI: "माझी",
  DARAI: "दराई",
  KUMAL: "कुमाल",
  BOTE: "बोटे",
  DURA: "दुरा",
  JIREL: "जिरेल",
  PAHARI: "पहाडी",
  BHOTE: "भोटे",
  YAKKHA: "याक्खा",
  DHIMAL: "धिमाल",
  MECHE: "मेचे",
  KOCHE: "कोचे",
  RAJBANSHI: "राजबंशी",
  GANGAI: "गंगाई",
  DHANGAD: "धनगड",
  TAJPURIYA: "ताजपुरिया",
  THAMI: "थामी",
  LEPCHA: "लेप्चा",
  BHUJEL: "भुजेल",
  YOLMO: "योल्मो",
  HYOLMO: "ह्योल्मो",
  KAGATE: "कागते",
  LHOMI: "ल्होमी",
  NUBRI: "नुब्री",
  TSUM: "त्सुम",
  LHOPA: "ल्होपा",
  WALUNG: "वालुङ",
  DUMI: "दुमी",
  JERO: "जेरो",
  WAMBULE: "वाम्बुले",
  YAMPHU: "याम्फु",
  LOHORUNG: "लोहोरुङ",
  MEWAHANG: "मेवाहाङ",
  TILUNG: "तिलुङ",
  PUMA: "पुमा",
  SANGPANG: "साङपाङ",
  CHHINTANG: "छिन्ताङ",
  ATHPARE: "अठपरे",
  BELHARIYA: "बेल्हरिया",
  CHHILING: "छिलिङ",
  YAMPHE: "याम्फे",
  LINGKHIM: "लिङ्खिम",
  LUMBA_YAKKHA: "लुम्बा याक्खा",
  OTHER: "अन्य",
};

// Export the mother tongue options for use in UI components
export const motherTongueOptions = Object.entries(MOTHER_TONGUE_LABELS).map(([key, value]) => ({
  value: key,
  label: value,
}));