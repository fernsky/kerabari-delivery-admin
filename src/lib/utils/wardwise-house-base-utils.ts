import { HouseholdBaseTypeEnum } from "@/server/api/routers/profile/economics/ward-wise-household-base.schema";

export interface WardWiseHouseBaseData {
  id: string;
  wardNumber: number;
  baseType: keyof typeof HouseholdBaseTypeEnum.enum;
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

export const HOUSE_BASE_LABELS: Record<string, string> = {
  CONCRETE_PILLAR: "ढलान पिल्लरसहितको",
  CEMENT_JOINED: "सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा",
  MUD_JOINED: "माटोको जोडाइ भएको इँटा/ढुङ्गा",
  WOOD_POLE: "काठको खम्बा गाडेको",
  OTHER: "अन्य",
};

export const BASE_CATEGORIES: Record<string, string[]> = {
  modern: ["CONCRETE_PILLAR", "CEMENT_JOINED"],
  traditional: ["MUD_JOINED", "WOOD_POLE"],
  mixed: [],
  other: ["OTHER"],
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
      label: HOUSE_BASE_LABELS[item.baseType] || item.baseType,
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
    return "घरको जग सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary with detailed context
  analysisParts.push(
    `केराबारी गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalHouseholds)} घरपरिवार रहेका छन् जसमा विभिन्न प्रकारका जग प्रयोग गरिएका छन्। यी तथ्याङ्कले गाउँपालिकाको आवासीय निर्माण जगको वितरण, आर्थिक अवस्था र सुरक्षा स्तरको विस्तृत चित्र प्रस्तुत गर्दछ।`
  );

  // Calculate quality scores and metrics
  const concretePillarData = data.baseData['CONCRETE_PILLAR'];
  const cementJoinedData = data.baseData['CEMENT_JOINED'];
  const mudJoinedData = data.baseData['MUD_JOINED'];
  const woodPoleData = data.baseData['WOOD_POLE'];
  const otherData = data.baseData['OTHER'];

  const highQualityBases = (concretePillarData?.households || 0) + (cementJoinedData?.households || 0);
  const mediumQualityBases = (mudJoinedData?.households || 0);
  const lowQualityBases = (woodPoleData?.households || 0) + (otherData?.households || 0);

  const highQualityPercentage = data.totalHouseholds > 0 ? (highQualityBases / data.totalHouseholds) * 100 : 0;
  const mediumQualityPercentage = data.totalHouseholds > 0 ? (mediumQualityBases / data.totalHouseholds) * 100 : 0;
  const lowQualityPercentage = data.totalHouseholds > 0 ? (lowQualityBases / data.totalHouseholds) * 100 : 0;

  // Calculate overall quality score (0-100)
  const qualityScore = (highQualityPercentage * 0.8) + (mediumQualityPercentage * 0.5) + (lowQualityPercentage * 0.2);

  // Top base types analysis with detailed insights
  if (data.topBaseTypes.length > 0) {
    const topBaseType = data.topBaseTypes[0];
    analysisParts.push(
      `गाउँपालिकामा सबैभन्दा बढी प्रयोग गरिएको जग ${topBaseType.label} रहेको छ जसमा ${convertToNepaliNumber(topBaseType.households)} घरपरिवार (${formatNepaliPercentage(topBaseType.percentage)}) समावेश छन्। यो प्रतिशतले गाउँपालिकाको आवासीय निर्माण प्रविधि र स्थानीय स्रोतको उपलब्धतालाई प्रतिबिम्बित गर्दछ।`
    );

    if (data.topBaseTypes.length > 1) {
      const secondBaseType = data.topBaseTypes[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondBaseType.label} रहेको छ जसमा ${convertToNepaliNumber(secondBaseType.households)} घरपरिवार (${formatNepaliPercentage(secondBaseType.percentage)}) समावेश छन्। यी दुई प्रकारका जग मिलेर गाउँपालिकाको कुल घरपरिवारको ${formatNepaliPercentage(topBaseType.percentage + secondBaseType.percentage)} भाग ओगटेका छन् जसले स्थानीय निर्माण प्रविधिको प्रभुत्व देखाउँछ।`
      );
    }

    if (data.topBaseTypes.length > 2) {
      const thirdBaseType = data.topBaseTypes[2];
      analysisParts.push(
        `तेस्रो स्थानमा ${thirdBaseType.label} रहेको छ जसमा ${convertToNepaliNumber(thirdBaseType.households)} घरपरिवार (${formatNepaliPercentage(thirdBaseType.percentage)}) समावेश छन्। यी तीन प्रकारका जग मिलेर गाउँपालिकाको आवासीय निर्माणको मुख्य आधार बनेका छन्।`
      );
    }
  }

  // Quality analysis with critical insights
  analysisParts.push(
    `जगको गुणस्तर विश्लेषण अनुसार, उच्च गुणस्तरका जग (ढलान पिल्लरसहितको र सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा) भएका घरहरू ${convertToNepaliNumber(highQualityBases)} (${formatNepaliPercentage(highQualityPercentage)}) रहेका छन्। मध्यम गुणस्तरका जग (माटोको जोडाइ भएको इँटा/ढुङ्गा) भएका घरहरू ${convertToNepaliNumber(mediumQualityBases)} (${formatNepaliPercentage(mediumQualityPercentage)}) रहेका छन्। न्यून गुणस्तरका जग (काठको खम्बा गाडेको र अन्य) भएका घरहरू ${convertToNepaliNumber(lowQualityBases)} (${formatNepaliPercentage(lowQualityPercentage)}) रहेका छन्।`
  );

  // Overall quality score analysis
  analysisParts.push(
    `समग्र गुणस्तर स्कोर ${convertToNepaliNumber(Math.round(qualityScore * 10) / 10)} रहेको छ (१०० मा) जसले गाउँपालिकाको आवासीय निर्माण जगको गुणस्तरको स्तर देखाउँछ। यो स्कोरले भूकम्पीय सुरक्षा, आर्थिक स्थिरता र दिगो विकासको दिशामा गाउँपालिकाको अवस्थालाई मूल्याङ्कन गर्न सहयोग गर्दछ।`
  );

  // Base categories analysis with detailed breakdown
  const categories = data.baseCategories;
  const totalInCategories = categories.modern + categories.traditional + categories.mixed + categories.other;
  
  if (totalInCategories > 0) {
    const modernPercentage = (categories.modern / totalInCategories) * 100;
    const traditionalPercentage = (categories.traditional / totalInCategories) * 100;
    const mixedPercentage = (categories.mixed / totalInCategories) * 100;
    const otherPercentage = (categories.other / totalInCategories) * 100;

    analysisParts.push(
      `जगको वर्गीकरण अनुसार विश्लेषण गर्दा, आधुनिक जग (ढलान पिल्लरसहितको र सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा) प्रयोग गरिएका घरहरू ${convertToNepaliNumber(categories.modern)} (${formatNepaliPercentage(modernPercentage)}) रहेका छन्। परम्परागत जग (माटोको जोडाइ भएको इँटा/ढुङ्गा र काठको खम्बा गाडेको) प्रयोग गरिएका घरहरू ${convertToNepaliNumber(categories.traditional)} (${formatNepaliPercentage(traditionalPercentage)}) रहेका छन्। मिश्रित जग प्रयोग गरिएका घरहरू ${convertToNepaliNumber(categories.mixed)} (${formatNepaliPercentage(mixedPercentage)}) रहेका छन्। अन्य जग प्रयोग गरिएका घरहरू ${convertToNepaliNumber(categories.other)} (${formatNepaliPercentage(otherPercentage)}) रहेका छन्।`
    );
  }

  // Ward-wise detailed analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalHouseholds > max.totalHouseholds ? { wardNum, ...wardData } : max
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, baseTypes: {}, primaryBaseType: '', primaryBasePercentage: 0, baseTypeCount: 0 });
    const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
      wardData.totalHouseholds < min.totalHouseholds ? { wardNum, ...wardData } : min
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, baseTypes: {}, primaryBaseType: '', primaryBasePercentage: 0, baseTypeCount: 0 });

    // Calculate ward quality scores
    const wardQualityScores = wardEntries.map(([wardNum, wardData]) => {
      const wardHighQuality = (wardData.baseTypes['CONCRETE_PILLAR'] || 0) + (wardData.baseTypes['CEMENT_JOINED'] || 0);
      const wardMediumQuality = (wardData.baseTypes['MUD_JOINED'] || 0);
      const wardLowQuality = (wardData.baseTypes['WOOD_POLE'] || 0) + (wardData.baseTypes['OTHER'] || 0);
      
      const wardHighQualityPercentage = wardData.totalHouseholds > 0 ? (wardHighQuality / wardData.totalHouseholds) * 100 : 0;
      const wardMediumQualityPercentage = wardData.totalHouseholds > 0 ? (wardMediumQuality / wardData.totalHouseholds) * 100 : 0;
      const wardLowQualityPercentage = wardData.totalHouseholds > 0 ? (wardLowQuality / wardData.totalHouseholds) * 100 : 0;
      
      const wardQualityScore = (wardHighQualityPercentage * 0.8) + (wardMediumQualityPercentage * 0.5) + (wardLowQualityPercentage * 0.2);
      
      return { wardNum, wardData, wardQualityScore, wardHighQualityPercentage, wardLowQualityPercentage };
    });

    const bestQualityWard = wardQualityScores.reduce((best, current) => 
      current.wardQualityScore > best.wardQualityScore ? current : best
    );
    const worstQualityWard = wardQualityScores.reduce((worst, current) => 
      current.wardQualityScore < worst.wardQualityScore ? current : worst
    );

    analysisParts.push(
      `वडाको आधारमा विस्तृत विश्लेषण गर्दा, वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalHouseholds)} घरपरिवार रहेका छन् भने वडा नं. ${convertToNepaliNumber(parseInt(lowestWard.wardNum))} मा सबैभन्दा कम ${convertToNepaliNumber(lowestWard.totalHouseholds)} घरपरिवार रहेका छन्। गुणस्तरको दृष्टिकोणबाट हेर्दा, वडा नं. ${convertToNepaliNumber(parseInt(bestQualityWard.wardNum))} मा सबैभन्दा राम्रो गुणस्तरका जग भएका घरहरू रहेका छन् जसको गुणस्तर स्कोर ${convertToNepaliNumber(Math.round(bestQualityWard.wardQualityScore * 10) / 10)} रहेको छ। यस वडामा उच्च गुणस्तरका जग भएका घरहरू ${formatNepaliPercentage(bestQualityWard.wardHighQualityPercentage)} रहेका छन्।`
    );

    analysisParts.push(
      `वडा नं. ${convertToNepaliNumber(parseInt(worstQualityWard.wardNum))} मा सबैभन्दा न्यून गुणस्तरका जग भएका घरहरू रहेका छन् जसको गुणस्तर स्कोर ${convertToNepaliNumber(Math.round(worstQualityWard.wardQualityScore * 10) / 10)} रहेको छ। यस वडामा न्यून गुणस्तरका जग भएका घरहरू ${formatNepaliPercentage(worstQualityWard.wardLowQualityPercentage)} रहेका छन् जसले यस वडाको आवासीय सुरक्षा र भूकम्पीय प्रतिरोधक क्षमतामा चुनौती रहेको देखाउँछ।`
    );
  }

  // Critical insights and recommendations
  analysisParts.push(
    `यी तथ्याङ्कले गाउँपालिकाको आवासीय निर्माण जगको वितरण र आर्थिक अवस्थाको मूल्याङ्कन गर्न सहयोग गर्दछ। आधुनिक जगको प्रयोगले सुरक्षित र दिगो आवास निर्माणको प्रवृत्ति देखाउँछ। परम्परागत जगको उपस्थिति स्थानीय स्रोत र परम्परागत सीपको निरन्तरतालाई प्रतिनिधित्व गर्दछ। जगको विविधताले आवास निर्माणमा विभिन्न प्रविधि र सामग्रीको प्रयोगलाई संकेत गर्दछ। न्यून गुणस्तरका जग भएका घरहरूको उच्च प्रतिशतले भूकम्पीय जोखिम र आवासीय सुरक्षामा चुनौती रहेको देखाउँछ।`
  );

  // Additional critical analysis
  if (lowQualityPercentage > 30) {
    analysisParts.push(
      `गाउँपालिकामा न्यून गुणस्तरका जग भएका घरहरूको प्रतिशत ${formatNepaliPercentage(lowQualityPercentage)} रहेको छ जुन चिन्ताजनक स्तरमा रहेको छ। यस्ता घरहरू भूकम्प, बाढी र अन्य प्राकृतिक विपद्को उच्च जोखिममा रहेका छन्। यसको लागि तत्काल सुधारका कार्यक्रमहरू ल्याउनुपर्ने आवश्यकता रहेको छ।`
    );
  }

  if (highQualityPercentage < 40) {
    analysisParts.push(
      `उच्च गुणस्तरका जग भएका घरहरूको प्रतिशत ${formatNepaliPercentage(highQualityPercentage)} मात्र रहेको छ जुन आधुनिक निर्माण मापदण्डको तुलनामा न्यून छ। यसले गाउँपालिकाको आवासीय निर्माणमा आधुनिक प्रविधि र सामग्रीको प्रयोग बढाउनुपर्ने आवश्यकतालाई संकेत गर्दछ।`
    );
  }

  analysisParts.push(
    `समग्र रूपमा, गाउँपालिकाको आवासीय निर्माण जग गुणस्तरमा सुधारका लागि नीतिगत हस्तक्षेप, प्रविधि हस्तान्तरण र जनचेतना अभिवृद्धि कार्यक्रमहरूको आवश्यकता रहेको छ। यसले न केवल आवासीय सुरक्षा बढाउँछ तर गाउँपालिकाको समग्र विकास र दिगोता पनि सुनिश्चित गर्दछ।`
  );

  return analysisParts.join(" ");
}

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/[0-9]/g, (digit) => nepaliDigits[parseInt(digit)]);
}

export function formatNepaliPercentage(percentage: number): string {
  return `${convertToNepaliNumber(Math.round(percentage * 10) / 10)}%`;
} 