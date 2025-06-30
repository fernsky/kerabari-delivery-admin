import { LanguageType } from "@/server/api/routers/profile/demographics/ward-wise-mother-tongue-population.schema";

export interface LanguageData {
  id: string;
  wardNumber: number;
  languageType: LanguageType;
  population: number;
  languageTypeDisplay?: string;
}

export interface ProcessedLanguageData {
  totalPopulation: number;
  languageData: Record<string, {
    population: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  majorLanguages: Array<{
    languageType: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  minorLanguages: Array<{
    languageType: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  otherLanguages: Array<{
    languageType: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  diversityIndex: number;
  dominantLanguage: {
    languageType: string;
    population: number;
    percentage: number;
    label: string;
  } | null;
  languageIndicators: {
    nepaliSpeakers: number;
    nepaliPercentage: number;
    indigenousLanguages: number;
    indigenousPercentage: number;
    foreignLanguages: number;
    foreignPercentage: number;
    languageDiversity: number;
    multilingualIndex: number;
  };
}

export const LANGUAGE_LABELS: Record<string, string> = {
  NEPALI: "नेपाली",
  LIMBU: "लिम्बु",
  RAI: "राई",
  HINDI: "हिन्दी",
  NEWARI: "नेवारी",
  SHERPA: "शेर्पा",
  TAMANG: "तामाङ",
  MAITHILI: "मैथिली",
  BHOJPURI: "भोजपुरी",
  THARU: "थारु",
  BAJJIKA: "बज्जिका",
  MAGAR: "मगर",
  DOTELI: "डोटेली",
  URDU: "उर्दू",
  AWADI: "अवधी",
  GURUNG: "गुरुङ",
  BAITADELI: "बैतडेली",
  AACHAMI: "आचामी",
  BANTAWA: "बन्तवा",
  RAJBANSHI: "राजबंशी",
  CHAMLING: "चामलिङ",
  BAJHANGI: "बझाङी",
  SANTHALI: "सन्थाली",
  CHEPANG: "चेपाङ",
  DANUWAR: "दनुवार",
  SUNUWAR: "सुनुवार",
  MAGAHI: "मगही",
  URAUN: "उराउँ",
  KULUNG: "कुलुङ",
  KHAM: "खाम",
  RAJASTHANI: "राजस्थानी",
  MAJHI: "माझी",
  THAMI: "थामी",
  BHUJEL: "भुजेल",
  BANGALA: "बङ्गाली",
  THULUNG: "थुलुङ",
  YAKKHA: "याक्खा",
  DHIMAL: "धिमाल",
  TAJPURIYA: "ताजपुरिया",
  ANGIKA: "अङ्गिका",
  SAMPANG: "साम्पाङ",
  KHALING: "खालिङ",
  YAMBULE: "याम्बुले",
  KUMAL: "कुमाल",
  DARAI: "दराई",
  BAHING: "बाहिङ",
  BAJURELI: "बाजुरेली",
  HYOLMO: "ह्योल्मो",
  NACHIRING: "नाछिरिङ",
  YAMPHU: "याम्फु",
  BOTE: "बोटे",
  GHARE: "घरे",
  DUMI: "दुमी",
  LAPCHA: "लाप्चा",
  PUMA: "पुमा",
  DUMANGLI: "डुमाङली",
  DARCHULELI: "दार्चुलेली",
  AATHPAHARIYA: "आठपहरिया",
  THAKALI: "थकाली",
  JIREL: "जिरेल",
  MEWAHANG: "मेवाहाङ",
  SYMBOLIC_LANGUAGE: "सांकेतिक भाषा",
  TIBETIAN: "तिब्बती",
  MECHE: "मेचे",
  CHANTYAL: "छन्त्याल",
  RAJI: "राजी",
  LOHARUNG: "लोहरुङ",
  CHINTANG: "छिन्ताङ",
  GANGAI: "गङ्गाई",
  PAHARI: "पहाडी",
  DAILEKHI: "दैलेखी",
  LHOPA: "ल्होपा",
  DURA: "दुरा",
  KOCHE: "कोचे",
  CHILING: "छिलिङ",
  ENGLISH: "अंग्रेजी",
  JERO: "जेरो",
  KHAS: "खस",
  SANSKRIT: "संस्कृत",
  DOLPALI: "डोल्पाली",
  HAYU: "हायू",
  TILUNG: "तिलुङ",
  KOYI: "कोयी",
  KISAN: "किसान",
  WALING: "वालिङ",
  MUSALMAN: "मुसल्मान",
  HIRAYANWI: "हिरयान्वी",
  JUMLI: "जुम्ली",
  PUNJABI: "पन्जाबी",
  LHOMI: "ल्होमी",
  BELHARI: "बेल्हारी",
  ORIYA: "ओरिया",
  SONAHA: "सोनहा",
  SINDHI: "सिन्धी",
  DADELDHURI: "डडेल्धुरी",
  BYANSI: "ब्याँसी",
  AASAMI: "आसामी",
  KAHMCHI: "खाम्ची",
  SAAM: "साम",
  MANAGE: "मनाङ्गे",
  DHULELI: "धुलेली",
  PHANGDUWALI: "फाङ्दुवाली",
  SUREL: "सुरेल",
  MALPANDE: "माल्पाण्डे",
  CHINESE: "चाइनिज",
  KHARIYA: "खरिया",
  KURMALI: "कुर्माली",
  BARAM: "बराम",
  LINGKHIM: "लिङखिम",
  SADHANI: "सधनी",
  KAGATE: "कागते",
  JONGKHA: "जोङ्खा",
  BANKARIYA: "बनकरिया",
  KAIKE: "काइके",
  GADHWALI: "गढवाली",
  FRECHN: "फ्रेन्च",
  MIJO: "मिजो",
  KUKI: "कुकी",
  KUSUNDA: "कुसुण्डा",
  RUSSIAN: "रसियन",
  SPANISH: "स्पेनिस",
  NAGAMIJ: "नगामिज",
  ARABI: "अरबी",
  OTHER: "अन्य",
};

// Function to normalize language type enum values
function normalizeLanguageType(languageType: string): string {
  const normalized = languageType.toUpperCase();
  // Map to standard enum values - add any specific mappings if needed
  return normalized;
}

// Function to get proper label for language type
function getLanguageTypeLabel(languageType: string): string {
  const normalized = normalizeLanguageType(languageType);
  return LANGUAGE_LABELS[normalized] || LANGUAGE_LABELS[languageType] || languageType;
}

export function processLanguageData(rawData: LanguageData[]): ProcessedLanguageData {
  if (!rawData || rawData.length === 0) {
    return {
      totalPopulation: 0,
      languageData: {},
      majorLanguages: [],
      minorLanguages: [],
      otherLanguages: [],
      diversityIndex: 0,
      dominantLanguage: null,
      languageIndicators: {
        nepaliSpeakers: 0,
        nepaliPercentage: 0,
        indigenousLanguages: 0,
        indigenousPercentage: 0,
        foreignLanguages: 0,
        foreignPercentage: 0,
        languageDiversity: 0,
        multilingualIndex: 0,
      },
    };
  }

  // Debug: Log raw data for troubleshooting
  console.log("Raw language data:", rawData);

  // Calculate total population
  const totalPopulation = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process language data - aggregate by language type across all wards
  const languageAggregated: Record<string, number> = {};
  rawData.forEach((item) => {
    const languageType = normalizeLanguageType(item.languageType);
    languageAggregated[languageType] = (languageAggregated[languageType] || 0) + (item.population || 0);
  });

  // Debug: Log aggregated data
  console.log("Language aggregated data:", languageAggregated);

  // Sort languages by population and take top 10
  const sortedLanguages = Object.entries(languageAggregated)
    .sort(([, a], [, b]) => b - a);

  const top10Languages = sortedLanguages.slice(0, 10);
  const otherLanguagesRaw = sortedLanguages.slice(10);

  // Calculate total for "other" category
  const otherTotal = otherLanguagesRaw.reduce((sum, [, population]) => sum + population, 0);

  // Process language data with top 10 + other
  const languageData: Record<string, any> = {};
  const allLanguages: Array<any> = [];

  // Add top 10 languages
  top10Languages.forEach(([languageType, population], index) => {
    const percentage = totalPopulation > 0 ? (population / totalPopulation) * 100 : 0;
    const languageInfo = {
      population,
      percentage,
      label: getLanguageTypeLabel(languageType),
      rank: index + 1,
    };

    languageData[languageType] = languageInfo;
    allLanguages.push({
      languageType,
      ...languageInfo,
    });
  });

  // Add "other" category if there are other languages
  if (otherTotal > 0) {
    const otherPercentage = totalPopulation > 0 ? (otherTotal / totalPopulation) * 100 : 0;
    const otherInfo = {
      population: otherTotal,
      percentage: otherPercentage,
      label: "अन्य",
      rank: 11,
    };

    languageData["OTHER"] = otherInfo;
    allLanguages.push({
      languageType: "OTHER",
      ...otherInfo,
    });
  }

  // Categorize languages
  const majorLanguages = allLanguages.filter(language => language.percentage >= 5);
  const minorLanguages = allLanguages.filter(language => language.percentage < 5 && language.percentage >= 1);
  const otherLanguages = allLanguages.filter(language => language.percentage < 1);

  // Calculate diversity index (Simpson's Diversity Index)
  const diversityIndex = totalPopulation > 0 
    ? 1 - allLanguages.reduce((sum, language) => {
        const p = language.population / totalPopulation;
        return sum + (p * p);
      }, 0)
    : 0;

  // Find dominant language
  const dominantLanguage = allLanguages.length > 0 ? allLanguages[0] : null;

  // Calculate language indicators
  const nepaliSpeakers = languageData.NEPALI?.population || 0;
  const indigenousLanguages = Object.entries(languageData)
    .filter(([lang]) => !['NEPALI', 'HINDI', 'ENGLISH', 'URDU', 'CHINESE', 'RUSSIAN', 'SPANISH', 'ARABI'].includes(lang))
    .reduce((sum, [, data]) => sum + data.population, 0);
  const foreignLanguages = Object.entries(languageData)
    .filter(([lang]) => ['HINDI', 'ENGLISH', 'URDU', 'CHINESE', 'RUSSIAN', 'SPANISH', 'ARABI'].includes(lang))
    .reduce((sum, [, data]) => sum + data.population, 0);

  const nepaliPercentage = totalPopulation > 0 ? (nepaliSpeakers / totalPopulation) * 100 : 0;
  const indigenousPercentage = totalPopulation > 0 ? (indigenousLanguages / totalPopulation) * 100 : 0;
  const foreignPercentage = totalPopulation > 0 ? (foreignLanguages / totalPopulation) * 100 : 0;

  // Language diversity (number of languages with >1% population)
  const languageDiversity = Object.values(languageData).filter(lang => lang.percentage > 1).length;

  // Multilingual index (average number of languages per ward)
  const multilingualIndex = 1; // Assuming a single ward

  return {
    totalPopulation,
    languageData,
    majorLanguages,
    minorLanguages,
    otherLanguages,
    diversityIndex,
    dominantLanguage,
    languageIndicators: {
      nepaliSpeakers,
      nepaliPercentage,
      indigenousLanguages,
      indigenousPercentage,
      foreignLanguages,
      foreignPercentage,
      languageDiversity,
      multilingualIndex,
    },
  };
}

export function generateLanguageAnalysis(data: ProcessedLanguageData): string {
  if (data.totalPopulation === 0) {
    return "मातृभाषा सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary
  analysisParts.push(
    `केराबारी गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalPopulation)} जनाको मातृभाषा विविधता अत्यन्तै उल्लेखनीय छ। यहाँका बासिन्दाहरूले विभिन्न मातृभाषाहरू बोल्ने गरेका छन्, जसले गाउँपालिकाको सांस्कृतिक र भाषिक समृद्धिलाई झल्काउँछ।`
  );

  // Dominant language analysis
  if (data.dominantLanguage) {
    const dominancePercentage = data.dominantLanguage.percentage;
    let dominanceAnalysis = "";
    
    if (dominancePercentage > 40) {
      dominanceAnalysis = `प्रमुख मातृभाषाको रूपमा ${data.dominantLanguage.label} बोल्नेको संख्या सबैभन्दा बढी (${convertToNepaliNumber(data.dominantLanguage.population)} जना, कुल जनसंख्याको ${formatNepaliPercentage(dominancePercentage)}) रहेको छ। यस्तो उच्च एकाग्रताले यस भाषाको प्रभुत्व रहेको संकेत गर्दछ।`;
    } else if (dominancePercentage > 25) {
      dominanceAnalysis = `प्रमुख मातृभाषाको रूपमा ${data.dominantLanguage.label} बोल्नेको संख्या सापेक्षिक बहुमत (${convertToNepaliNumber(data.dominantLanguage.population)} जना, कुल जनसंख्याको ${formatNepaliPercentage(dominancePercentage)}) रहेको छ।`;
    } else {
      dominanceAnalysis = `प्रमुख मातृभाषाको रूपमा ${data.dominantLanguage.label} बोल्नेको संख्या सापेक्षिक बहुलता (${convertToNepaliNumber(data.dominantLanguage.population)} जना, कुल जनसंख्याको ${formatNepaliPercentage(dominancePercentage)}) रहेको छ।`;
    }
    
    analysisParts.push(dominanceAnalysis);
  }

  // Language indicators analysis
  const indicators = data.languageIndicators;
  analysisParts.push(
    `नेपाली भाषी जनसंख्या ${convertToNepaliNumber(indicators.nepaliSpeakers)} जना (${formatNepaliPercentage(indicators.nepaliPercentage)}) रहेका छन्। आदिवासी भाषाहरू बोल्ने जनसंख्या ${convertToNepaliNumber(indicators.indigenousLanguages)} जना (${formatNepaliPercentage(indicators.indigenousPercentage)}) रहेका छन्। विदेशी भाषाहरू बोल्ने जनसंख्या ${convertToNepaliNumber(indicators.foreignLanguages)} जना (${formatNepaliPercentage(indicators.foreignPercentage)}) रहेका छन्।`
  );

  // Major languages analysis
  if (data.majorLanguages.length > 0) {
    const majorLanguagesList = data.majorLanguages.slice(1, 5).map(lang => 
      `${lang.label} (${convertToNepaliNumber(lang.population)} जना, ${formatNepaliPercentage(lang.percentage)})`
    );
    
    if (majorLanguagesList.length > 0) {
      analysisParts.push(
        `अन्य प्रमुख मातृभाषाहरूमा ${majorLanguagesList.join(', ')} रहेका छन्। यी भाषाहरूको विश्लेषणले स्थानीय भाषिक विविधता र सांस्कृतिक समृद्धिलाई देखाउँछ।`
      );
    }
  }

  // Language diversity implications
  analysisParts.push(
    `यस्तो भाषिक विविधताले गाउँपालिकामा भाषिक सहिष्णुता, आपसी समझदारी र सांस्कृतिक आदानप्रदानलाई प्रवर्द्धन गरेको छ। तथापि, केही भाषाहरूको प्रयोगमा गिरावट देखिन थालेको छ, जसले तिनको संरक्षण र प्रवर्द्धनका लागि विशेष पहल आवश्यक छ भन्ने देखाउँछ। मातृभाषाको संरक्षणले न केवल भाषिक पहिचानलाई जोगाउँछ, बरु स्थानीय ज्ञान, परम्परा र सांस्कृतिक सम्पदाको निरन्तरतामा समेत महत्वपूर्ण भूमिका खेल्दछ।`
  );

  // Future recommendations
  analysisParts.push(
    `भाषिक विविधता व्यवस्थापनमा स्थानीय सरकार, विद्यालय र समुदायको सहकार्य अपरिहार्य छ। विद्यालयस्तरमा मातृभाषामा शिक्षण सिकाइको प्रवर्द्धन, स्थानीय सञ्चार माध्यममा मातृभाषाको प्रयोग, र समुदायमा भाषिक चेतना अभिवृद्धि गर्ने कार्यक्रमहरू सञ्चालन गर्न सकेमा भाषिक विविधताको संरक्षण र प्रवर्द्धनमा उल्लेखनीय योगदान पुग्नेछ। गाउँपालिका सबै नागरिकहरूको भाषिक अधिकार र सांस्कृतिक पहिचान सुनिश्चित गर्ने लक्ष्यमा निरन्तर कार्यरत रहनेछ।`
  );

  return analysisParts.join(' ');
}

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits: Record<string, string> = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
  };
  
  return num.toString().replace(/[0-9]/g, (digit) => nepaliDigits[digit] || digit);
}

export function formatNepaliPercentage(percentage: number): string {
  return convertToNepaliNumber(parseFloat(percentage.toFixed(1))) + '%';
} 