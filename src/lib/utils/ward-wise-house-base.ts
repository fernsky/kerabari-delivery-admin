export interface WardWiseHouseBaseData {
  id: string;
  wardNumber: number;
  baseType: string;
  households: number;
}

export interface ProcessedWardWiseHouseBaseData {
  totalHouseholds: number;
  baseData: Record<string, {
    households: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  wardData: Record<number, {
    totalHouseholds: number;
    baseTypes: Record<string, number>;
    primaryBaseType: string;
    primaryBasePercentage: number;
    baseTypeCount: number;
  }>;
  topBaseTypes: Array<{
    baseType: string;
    households: number;
    percentage: number;
    label: string;
  }>;
  baseCategories: {
    modern: number;
    traditional: number;
    mixed: number;
    other: number;
  };
}

export const BASE_TYPE_LABELS: Record<string, string> = {
  CONCRETE_PILLAR: "ढलान पिल्लरसहितको आधार",
  CEMENT_JOINED: "सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा",
  MUD_JOINED: "माटोको जोडाइ भएको इँटा/ढुङ्गा",
  WOOD_POLE: "काठको खम्बा गाडेको आधार",
  OTHER: "अन्य प्रकारको आधार",
};

export const BASE_CATEGORIES: Record<string, string[]> = {
  modern: ['CONCRETE_PILLAR', 'CEMENT_JOINED'],
  traditional: ['MUD_JOINED', 'WOOD_POLE'],
  mixed: [],
  other: ['OTHER'],
};

export function processWardWiseHouseBaseData(rawData: WardWiseHouseBaseData[]): ProcessedWardWiseHouseBaseData {
  if (!rawData || rawData.length === 0) {
    return {
      totalHouseholds: 0,
      baseData: {},
      wardData: {},
      topBaseTypes: [],
      baseCategories: {
        modern: 0,
        traditional: 0,
        mixed: 0,
        other: 0,
      },
    };
  }

  // Calculate total households
  const totalHouseholds = rawData.reduce((sum, item) => sum + (item.households || 0), 0);

  // Process base data
  const baseData: Record<string, any> = {};
  const allBaseTypes: Array<any> = [];

  rawData.forEach((item, index) => {
    const percentage = totalHouseholds > 0 ? (item.households / totalHouseholds) * 100 : 0;
    const baseInfo = {
      households: item.households,
      percentage,
      label: BASE_TYPE_LABELS[item.baseType] || item.baseType,
      rank: index + 1,
    };

    if (baseData[item.baseType]) {
      baseData[item.baseType].households += item.households;
      baseData[item.baseType].percentage = totalHouseholds > 0 ? (baseData[item.baseType].households / totalHouseholds) * 100 : 0;
    } else {
      baseData[item.baseType] = baseInfo;
      allBaseTypes.push({
        baseType: item.baseType,
        ...baseInfo,
      });
    }
  });

  // Sort base types by households
  allBaseTypes.sort((a, b) => b.households - a.households);

  // Update ranks after sorting
  allBaseTypes.forEach((baseType, index) => {
    baseData[baseType.baseType].rank = index + 1;
  });

  // Get top 5 base types
  const topBaseTypes = allBaseTypes.slice(0, 5).map(baseType => ({
    baseType: baseType.baseType,
    households: baseType.households,
    percentage: baseType.percentage,
    label: baseType.label,
  }));

  // Process ward data
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalHouseholds = wardItems.reduce((sum, item) => sum + item.households, 0);
    const wardBaseTypes: Record<string, number> = {};
    
    wardItems.forEach(item => {
      if (wardBaseTypes[item.baseType]) {
        wardBaseTypes[item.baseType] += item.households;
      } else {
        wardBaseTypes[item.baseType] = item.households;
      }
    });

    // Find primary base type for this ward
    const sortedWardBaseTypes = Object.entries(wardBaseTypes).sort(([, a], [, b]) => b - a);
    const primaryBaseType = sortedWardBaseTypes[0]?.[0] || '';
    const primaryBasePercentage = wardTotalHouseholds > 0 
      ? (sortedWardBaseTypes[0]?.[1] || 0) / wardTotalHouseholds * 100 
      : 0;

    wardData[wardNum] = {
      totalHouseholds: wardTotalHouseholds,
      baseTypes: wardBaseTypes,
      primaryBaseType,
      primaryBasePercentage,
      baseTypeCount: Object.keys(wardBaseTypes).length,
    };
  });

  // Calculate base categories
  const baseCategories = {
    modern: 0,
    traditional: 0,
    mixed: 0,
    other: 0,
  };

  Object.entries(baseData).forEach(([baseType, data]) => {
    if (BASE_CATEGORIES.modern.includes(baseType)) {
      baseCategories.modern += data.households;
    } else if (BASE_CATEGORIES.traditional.includes(baseType)) {
      baseCategories.traditional += data.households;
    } else if (BASE_CATEGORIES.mixed.includes(baseType)) {
      baseCategories.mixed += data.households;
    } else {
      baseCategories.other += data.households;
    }
  });

  return {
    totalHouseholds,
    baseData,
    wardData,
    topBaseTypes,
    baseCategories,
  };
}

export function generateWardWiseHouseBaseAnalysis(data: ProcessedWardWiseHouseBaseData): string {
  if (data.totalHouseholds === 0) {
    return "वडा अनुसार घरको आधार सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  // Calculate base categories for detailed analysis
  const modernPercentage = (data.baseCategories.modern / data.totalHouseholds) * 100;
  const traditionalPercentage = (data.baseCategories.traditional / data.totalHouseholds) * 100;
  const otherPercentage = (data.baseCategories.other / data.totalHouseholds) * 100;

  // Find ward with highest and lowest households
  const wardEntries = Object.entries(data.wardData);
  const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
    wardData.totalHouseholds > max.totalHouseholds ? { wardNum, ...wardData } : max
  , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, baseTypes: {}, primaryBaseType: '', primaryBasePercentage: 0, baseTypeCount: 0 });

  const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
    wardData.totalHouseholds < min.totalHouseholds ? { wardNum, ...wardData } : min
  , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, baseTypes: {}, primaryBaseType: '', primaryBasePercentage: 0, baseTypeCount: 0 });

  // Find most diverse ward (ward with most different base types)
  const mostDiverseWard = wardEntries.reduce((most, [wardNum, wardData]) => 
    wardData.baseTypeCount > most.baseTypeCount ? { wardNum, ...wardData } : most
  , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, baseTypes: {}, primaryBaseType: '', primaryBasePercentage: 0, baseTypeCount: 0 });

  // Get proper Nepali label for primary base type
  const getPrimaryBaseTypeLabel = (baseType: string) => {
    return BASE_TYPE_LABELS[baseType] || baseType;
  };

  const analysis = `
    गढवा गाउँपालिकाको घरको आधार/फाउन्डेसन विश्लेषणले स्थानीय भवन निर्माण गुणस्तर र पूर्वाधार विकासको गहन अध्ययन प्रस्तुत गर्दैछ, जसमा कुल ${convertToNepaliNumber(data.totalHouseholds)} परिवारको आवासीय संरचनाहरूको आधार निर्माणको विवरण समावेश छ। यो तथ्याङ्कले न केवल स्थानीय निर्माण मानकहरूको प्रतिबिम्ब प्रस्तुत गर्दछ, तर यसले गाउँपालिकाको पूर्वाधार विकास र आवास सुधार कार्यक्रमहरूको लागि महत्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ।

    सर्वेक्षणको परिणाम अनुसार, गाउँपालिकामा घरको आधार निर्माणको सबैभन्दा प्रमुख प्रकार ${data.topBaseTypes[0]?.label || 'ढलान पिल्लरसहितको आधार'} रहेको छ, जसमा ${convertToNepaliNumber(data.topBaseTypes[0]?.households || 0)} परिवार (${formatNepaliPercentage(data.topBaseTypes[0]?.percentage || 0)}) ले यस्तो आधार प्रयोग गर्दै आएका छन्। यो तथ्यले स्थानीय निर्माण मानकहरूको उच्च स्तर र भवन सुरक्षाको प्राथमिकतालाई प्रतिबिम्बित गर्दछ र यसले गाउँपालिकाको पूर्वाधार विकासको लागि महत्वपूर्ण संकेत प्रदान गर्दछ। दोस्रो स्थानमा ${data.topBaseTypes[1]?.label || 'सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा'} क्षेत्रमा ${convertToNepaliNumber(data.topBaseTypes[1]?.households || 0)} परिवार (${formatNepaliPercentage(data.topBaseTypes[1]?.percentage || 0)}) ले यस्तो आधार प्रयोग गर्दै आएका छन्, जसले स्थानीय निर्माण प्रविधिको मध्यम स्तरलाई प्रदर्शन गर्दछ।

    वडागत विश्लेषणले गाउँपालिकाको आन्तरिक पूर्वाधार विविधताको चित्र प्रस्तुत गर्दछ। वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalHouseholds)} परिवार रहेका छन्, जसले यस वडाको उच्च जनसंख्या घनत्व र आवासीय विकासको स्तरलाई प्रतिबिम्बित गर्दछ। यस वडामा ${getPrimaryBaseTypeLabel(highestWard.primaryBaseType)} प्रकारको आधार सबैभन्दा बढी प्रयोग गरिएको छ, जसमा ${formatNepaliPercentage(highestWard.primaryBasePercentage)} परिवार समावेश छन्। यसको विपरीत, वडा नं. ${convertToNepaliNumber(parseInt(lowestWard.wardNum))} मा सबैभन्दा कम ${convertToNepaliNumber(lowestWard.totalHouseholds)} परिवार रहेका छन्, जसले यस क्षेत्रको कम जनसंख्या घनत्व र आवासीय विकासको सीमित स्तरलाई प्रतिबिम्बित गर्दछ।

    आधार निर्माण प्रकृति अनुसारको विश्लेषणले गाउँपालिकाको पूर्वाधार विकासको दिशालाई स्पष्ट रूपमा प्रदर्शन गर्दछ। आधुनिक निर्माण प्रविधिको प्रयोगमा ${convertToNepaliNumber(data.baseCategories.modern)} परिवार (${formatNepaliPercentage(modernPercentage)}) ले यस्तो आधार प्रयोग गर्दै आएका छन्, जसले स्थानीय निर्माण मानकहरूको उच्च स्तर र भवन सुरक्षाको प्राथमिकतालाई प्रतिबिम्बित गर्दछ। यसको साथै, परम्परागत निर्माण प्रविधिको प्रयोगमा ${convertToNepaliNumber(data.baseCategories.traditional)} परिवार (${formatNepaliPercentage(traditionalPercentage)}) ले यस्तो आधार प्रयोग गर्दै आएका छन्, जसले स्थानीय निर्माण परम्परा र सांस्कृतिक विरासतलाई संरक्षण गर्दै आएको छ। अन्य प्रकारको आधारमा ${convertToNepaliNumber(data.baseCategories.other)} परिवार (${formatNepaliPercentage(otherPercentage)}) ले यस्तो आधार प्रयोग गर्दै आएका छन्, जसले विशेष निर्माण आवश्यकता वा स्थानीय परिस्थितिको प्रतिबिम्बित गर्दछ।

    वडा नं. ${convertToNepaliNumber(parseInt(mostDiverseWard.wardNum))} मा सबैभन्दा विविध प्रकारको आधार निर्माण पाइएको छ, जसमा ${convertToNepaliNumber(mostDiverseWard.baseTypeCount)} विभिन्न आधार प्रकारहरू समावेश छन्। यसले यस वडाको निर्माण विविधीकरण र विकासको उच्च स्तरलाई प्रतिबिम्बित गर्दछ। यस्तो विविधीकरणले स्थानीय निर्माण क्षेत्रको लचीलापन र स्थायित्वलाई बढाउन महत्वपूर्ण योगदान पुर्‍याउँछ।

    यस तथ्याङ्कको आधारमा, गाउँपालिकाले पूर्वाधार विकास र आवास सुधारको लागि विभिन्न नीतिगत पहलहरू गर्न सक्छन्। सर्वप्रथम, आधुनिक निर्माण प्रविधिको उच्च प्रतिशतले स्थानीय निर्माण मानकहरूको विस्तार र गुणस्तर सुधारको लागि नीतिगत ध्यान दिन आवश्यक छ। दोस्रोत, परम्परागत निर्माण प्रविधिको सीमित प्रतिशतले आधुनिकीकरण र पूर्वाधार सुधार कार्यक्रमहरूको आवश्यकतालाई प्रकट गर्दछ। तेस्रोत, निर्माण सुरक्षा र गुणस्तर नियन्त्रण कार्यक्रमहरूले स्थानीय आवासीय संरचनाहरूको दीर्घकालीन सुरक्षा र स्थायित्व सुनिश्चित गर्न सहयोग गर्न सक्छन्।

    यस तथ्याङ्कले गाउँपालिकाको समग्र पूर्वाधार विकास स्थिति र भविष्यका निर्माण योजनाहरूलाई थप आकार दिन्छ। आधार निर्माणको यस्तो वितरणले स्थानीय निर्माण क्षेत्रको विकास र स्थायित्वको लागि महत्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ। यसले गाउँपालिकाको आवासीय विकास र पूर्वाधार सुधार कार्यक्रमहरूको लागि आधारभूत जानकारी प्रदान गर्दै, स्थानीय समुदायको जीवनस्तर सुधार र सुरक्षित आवास सुनिश्चित गर्न महत्वपूर्ण योगदान पुर्‍याउँछ।
  `;

  return analysis.trim();
}

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, (d) => nepaliDigits[parseInt(d)]);
}

export function formatNepaliPercentage(percentage: number): string {
  return `${convertToNepaliNumber(Math.round(percentage * 10) / 10)}%`;
} 
 