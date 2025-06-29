import { CasteTypes } from "@/server/db/schema/common/enums";

export interface CasteData {
  id: string;
  casteType: string;
  population: number;
  casteTypeDisplay?: string;
}

export interface ProcessedCasteData {
  totalPopulation: number;
  casteData: Record<string, {
    population: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  majorCastes: Array<{
    casteType: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  minorCastes: Array<{
    casteType: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  otherCastes: Array<{
    casteType: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  diversityIndex: number;
  dominantCaste: {
    casteType: string;
    population: number;
    percentage: number;
    label: string;
  } | null;
  casteIndicators: {
    dominantCastePopulation: number;
    dominantCastePercentage: number;
    majorCastesCount: number;
    minorCastesCount: number;
    otherCastesCount: number;
    casteDiversity: number;
    socialInclusionIndex: number;
  };
}

export const CASTE_LABELS: Record<string, string> = {
  ...CasteTypes,
  OTHER: "अन्य",
};

// Function to normalize caste type enum values
function normalizeCasteType(casteType: string): string {
  const normalized = casteType.toUpperCase();
  // Map to standard enum values - add any specific mappings if needed
  return normalized;
}

// Function to get proper label for caste type
function getCasteTypeLabel(casteType: string): string {
  const normalized = normalizeCasteType(casteType);
  return CASTE_LABELS[normalized] || CASTE_LABELS[casteType] || casteType;
}

export function processCasteData(rawData: CasteData[]): ProcessedCasteData {
  if (!rawData || rawData.length === 0) {
    return {
      totalPopulation: 0,
      casteData: {},
      majorCastes: [],
      minorCastes: [],
      otherCastes: [],
      diversityIndex: 0,
      dominantCaste: null,
      casteIndicators: {
        dominantCastePopulation: 0,
        dominantCastePercentage: 0,
        majorCastesCount: 0,
        minorCastesCount: 0,
        otherCastesCount: 0,
        casteDiversity: 0,
        socialInclusionIndex: 0,
      },
    };
  }

  // Debug: Log raw data for troubleshooting
  console.log("Raw caste data:", rawData);

  // Calculate total population
  const totalPopulation = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process caste data - aggregate by caste type
  const casteAggregated: Record<string, number> = {};
  rawData.forEach((item) => {
    const casteType = normalizeCasteType(item.casteType);
    casteAggregated[casteType] = (casteAggregated[casteType] || 0) + (item.population || 0);
  });

  // Debug: Log aggregated data
  console.log("Caste aggregated data:", casteAggregated);

  // Sort castes by population and take top 10
  const sortedCastes = Object.entries(casteAggregated)
    .sort(([, a], [, b]) => b - a);

  const top10Castes = sortedCastes.slice(0, 10);
  const otherCastesRaw = sortedCastes.slice(10);

  // Calculate total for "other" category
  const otherTotal = otherCastesRaw.reduce((sum, [, population]) => sum + population, 0);

  // Process caste data with top 10 + other
  const casteData: Record<string, any> = {};
  const allCastes: Array<any> = [];

  // Add top 10 castes
  top10Castes.forEach(([casteType, population], index) => {
    const percentage = totalPopulation > 0 ? (population / totalPopulation) * 100 : 0;
    const casteInfo = {
      population,
      percentage,
      label: getCasteTypeLabel(casteType),
      rank: index + 1,
    };

    casteData[casteType] = casteInfo;
    allCastes.push({
      casteType,
      ...casteInfo,
    });
  });

  // Add "other" category if there are other castes
  if (otherTotal > 0) {
    const otherPercentage = totalPopulation > 0 ? (otherTotal / totalPopulation) * 100 : 0;
    const otherInfo = {
      population: otherTotal,
      percentage: otherPercentage,
      label: "अन्य",
      rank: 11,
    };

    casteData["OTHER"] = otherInfo;
    allCastes.push({
      casteType: "OTHER",
      ...otherInfo,
    });
  }

  // Categorize castes
  const majorCastes = allCastes.filter(caste => caste.percentage >= 5);
  const minorCastes = allCastes.filter(caste => caste.percentage < 5 && caste.percentage >= 1);
  const otherCastes = allCastes.filter(caste => caste.percentage < 1);

  // Calculate diversity index (Simpson's Diversity Index)
  const diversityIndex = totalPopulation > 0 
    ? 1 - allCastes.reduce((sum, caste) => {
        const p = caste.population / totalPopulation;
        return sum + (p * p);
      }, 0)
    : 0;

  // Find dominant caste
  const dominantCaste = allCastes.length > 0 ? allCastes[0] : null;

  // Calculate caste indicators
  const dominantCastePopulation = dominantCaste?.population || 0;
  const dominantCastePercentage = dominantCaste?.percentage || 0;
  const majorCastesCount = majorCastes.length;
  const minorCastesCount = minorCastes.length;
  const otherCastesCount = otherCastes.length;
  const casteDiversity = Object.values(casteData).filter(caste => caste.percentage > 1).length;
  
  // Social inclusion index (lower dominance = higher inclusion)
  const socialInclusionIndex = dominantCastePercentage > 0 
    ? Math.max(0, 100 - dominantCastePercentage) 
    : 100;

  return {
    totalPopulation,
    casteData,
    majorCastes,
    minorCastes,
    otherCastes,
    diversityIndex,
    dominantCaste,
    casteIndicators: {
      dominantCastePopulation,
      dominantCastePercentage,
      majorCastesCount,
      minorCastesCount,
      otherCastesCount,
      casteDiversity,
      socialInclusionIndex,
    },
  };
}

export function generateCasteAnalysis(data: ProcessedCasteData): string {
  if (data.totalPopulation === 0) {
    return "गाउँपालिकामा जातजातिको तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary
  analysisParts.push(
    `बुद्धशान्ति गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalPopulation)} जनाको जातिगत विविधता अत्यन्तै उल्लेखनीय छ। यहाँका बासिन्दाहरूले विभिन्न जातजातिहरूको प्रतिनिधित्व गरेका छन्, जसले गाउँपालिकाको सांस्कृतिक र सामाजिक समृद्धिलाई झल्काउँछ।`
  );

  // Dominant caste analysis
  if (data.dominantCaste) {
    const dominancePercentage = data.dominantCaste.percentage;
    let dominanceAnalysis = "";
    
    if (dominancePercentage > 40) {
      dominanceAnalysis = `प्रमुख जातिको रूपमा ${data.dominantCaste.label} जातिको संख्या सबैभन्दा बढी (${convertToNepaliNumber(data.dominantCaste.population)} जना, कुल जनसंख्याको ${formatNepaliPercentage(dominancePercentage)}) रहेको छ। यस्तो उच्च एकाग्रताले यस जातिको प्रभुत्व रहेको संकेत गर्दछ।`;
    } else if (dominancePercentage > 25) {
      dominanceAnalysis = `प्रमुख जातिको रूपमा ${data.dominantCaste.label} जातिको संख्या सापेक्षिक बहुमत (${convertToNepaliNumber(data.dominantCaste.population)} जना, कुल जनसंख्याको ${formatNepaliPercentage(dominancePercentage)}) रहेको छ।`;
    } else {
      dominanceAnalysis = `प्रमुख जातिको रूपमा ${data.dominantCaste.label} जातिको संख्या सापेक्षिक बहुलता (${convertToNepaliNumber(data.dominantCaste.population)} जना, कुल जनसंख्याको ${formatNepaliPercentage(dominancePercentage)}) रहेको छ।`;
    }
    
    analysisParts.push(dominanceAnalysis);
  }

  // Caste indicators analysis
  const indicators = data.casteIndicators;
  analysisParts.push(
    `गाउँपालिकामा ${convertToNepaliNumber(indicators.majorCastesCount)} वटा प्रमुख जातिहरू (५% भन्दा बढी), ${convertToNepaliNumber(indicators.minorCastesCount)} वटा गौण जातिहरू (१-५%) र ${convertToNepaliNumber(indicators.otherCastesCount)} वटा अन्य साना जातिहरूको उपस्थिति रहेको छ। यस्तो विविधताले सामाजिक संरचनालाई समृद्ध र समावेशी बनाउँछ।`
  );

  // Major castes analysis
  if (data.majorCastes.length > 0) {
    const majorCastesList = data.majorCastes.slice(1, 5).map(caste => 
      `${caste.label} (${convertToNepaliNumber(caste.population)} जना, ${formatNepaliPercentage(caste.percentage)})`
    );
    
    if (majorCastesList.length > 0) {
      analysisParts.push(
        `अन्य प्रमुख जातिहरूमा ${majorCastesList.join(', ')} रहेका छन्। यी जातिहरूको विश्लेषणले स्थानीय जातीय विविधता र सांस्कृतिक समृद्धिलाई देखाउँछ।`
      );
    }
  }

  // Diversity analysis
  const diversityPercentage = data.diversityIndex * 100;
  let diversityAnalysis = "";
  
  if (diversityPercentage > 70) {
    diversityAnalysis = `गाउँपालिकामा जातीय विविधता उच्च (${convertToNepaliNumber(parseFloat(diversityPercentage.toFixed(1)))}%) रहेको छ, जसले बहुजातीय समाजको स्वस्थ विकासको संकेत गर्दछ। यस्तो विविधताले सामाजिक सहिष्णुता, आपसी सम्मान र सांस्कृतिक आदानप्रदानलाई प्रवर्धन गर्दछ।`;
  } else if (diversityPercentage > 40) {
    diversityAnalysis = `गाउँपालिकामा मध्यम स्तरको जातीय विविधता (${convertToNepaliNumber(parseFloat(diversityPercentage.toFixed(1)))}%) रहेको छ, जसले विभिन्न जातिहरूको उपस्थिति भएता पनि कुनै एक जातिको प्रभुत्व रहेको देखाउँछ।`;
  } else {
    diversityAnalysis = `गाउँपालिकामा जातीय विविधता न्यून (${convertToNepaliNumber(parseFloat(diversityPercentage.toFixed(1)))}%) रहेको छ, जसले एकजातीय प्रभुत्वको स्थितिलाई संकेत गर्दछ।`;
  }
  
  analysisParts.push(diversityAnalysis);

  // Social inclusion implications
  analysisParts.push(
    `यस्तो जातीय विविधताले गाउँपालिकामा सामाजिक सहिष्णुता, आपसी समझदारी र सांस्कृतिक आदानप्रदानलाई प्रवर्द्धन गरेको छ। तथापि, केही जातिहरूको सामाजिक स्थितिमा असमानता देखिन थालेको छ, जसले तिनको सशक्तिकरणका लागि विशेष पहल आवश्यक छ भन्ने देखाउँछ। जातीय एकताको संरक्षणले न केवल सामाजिक पहिचानलाई जोगाउँछ, बरु स्थानीय ज्ञान, परम्परा र सांस्कृतिक सम्पदाको निरन्तरतामा समेत महत्वपूर्ण भूमिका खेल्दछ।`
  );

  // Constitutional and policy context
  analysisParts.push(
    `नेपालको संविधान २०७२ ले जातीय छुवाछूत र भेदभावको अन्त्य गर्ने संकल्प गरेको छ र समानुपातिक समावेशी सिद्धान्तका आधारमा समतामूलक समाजको निर्माण गर्ने नीति अपनाएको छ। यस संवैधानिक प्रावधानको प्रतिबिम्ब बुद्धशान्ति गाउँपालिकामा पनि देख्न सकिन्छ, जहाँ विभिन्न जातजातिहरूको सहअस्तित्व रहेको छ।`
  );

  // Future recommendations
  analysisParts.push(
    `जातीय एकता र सामाजिक न्यायको आधारमा समग्र विकास हासिल गर्न गाउँपालिका दृढ संकल्पित छ। सबै जातजातिको सांस्कृतिक पहिचान र मौलिकताको संरक्षण गर्दै आर्थिक समृद्धि र सामाजिक न्यायमा आधारित समाजको निर्माण गर्ने लक्ष्य राखिएको छ। जातीय भेदभावको पूर्ण अन्त्य गरी मानवीय गरिमा र समानताको आधारमा सबै नागरिकहरूको कल्याणमा गाउँपालिका निरन्तर कार्यरत रहनेछ। विविधतामा एकताको सिद्धान्त अनुसार सबै जातजातिले मिलेर गाउँपालिकाको समग्र विकासमा योगदान पुर्याउने परम्परालाई निरन्तरता दिने प्रतिबद्धता व्यक्त गरिएको छ।`
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