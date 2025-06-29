import { OuterWallTypeEnum } from "@/server/api/routers/profile/economics/ward-wise-household-outer-wall.schema";

export interface WardWiseHouseOuterWallData {
  id: string;
  wardNumber: number;
  wallType: keyof typeof OuterWallTypeEnum.enum;
  households: number;
}

export interface ProcessedWardWiseHouseOuterWallData {
  totalHouseholds: number;
  wallData: Record<string, {
    households: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  wardData: Record<number, {
    totalHouseholds: number;
    wallTypes: Record<string, number>;
    primaryWallType: string;
    primaryWallPercentage: number;
    wallTypeCount: number;
  }>;
  topWallTypes: Array<{
    wallType: string;
    households: number;
    percentage: number;
    label: string;
  }>;
  wallCategories: {
    modern: number;
    traditional: number;
    mixed: number;
    other: number;
  };
}

export const HOUSE_OUTER_WALL_LABELS: Record<string, string> = {
  CEMENT_JOINED: "सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा",
  UNBAKED_BRICK: "काँचो इँटा",
  MUD_JOINED: "माटोको जोडाइ भएको इँटा/ढुङ्गा",
  TIN: "जस्ता/टिन/च्यादर",
  BAMBOO: "बाँसजन्य सामग्री",
  WOOD: "काठ/फल्याक",
  PREFAB: "प्रि फ्याब",
  OTHER: "अन्य",
};

export const WALL_CATEGORIES: Record<string, string[]> = {
  modern: ["CEMENT_JOINED", "PREFAB"],
  traditional: ["MUD_JOINED", "BAMBOO", "WOOD", "UNBAKED_BRICK"],
  mixed: ["TIN"],
  other: ["OTHER"],
};

export function processWardWiseHouseOuterWallData(rawData: WardWiseHouseOuterWallData[]): ProcessedWardWiseHouseOuterWallData {
  if (!rawData || rawData.length === 0) {
    return {
      totalHouseholds: 0,
      wallData: {},
      wardData: {},
      topWallTypes: [],
      wallCategories: {
        modern: 0,
        traditional: 0,
        mixed: 0,
        other: 0,
      },
    };
  }

  // Calculate total households
  const totalHouseholds = rawData.reduce((sum, item) => sum + (item.households || 0), 0);

  // Process wall data
  const wallData: Record<string, any> = {};
  const allWallTypes: Array<any> = [];

  rawData.forEach((item, index) => {
    const percentage = totalHouseholds > 0 ? (item.households / totalHouseholds) * 100 : 0;
    const wallInfo = {
      households: item.households,
      percentage,
      label: HOUSE_OUTER_WALL_LABELS[item.wallType] || item.wallType,
      rank: index + 1,
    };

    if (wallData[item.wallType]) {
      wallData[item.wallType].households += item.households;
      wallData[item.wallType].percentage = totalHouseholds > 0 ? (wallData[item.wallType].households / totalHouseholds) * 100 : 0;
    } else {
      wallData[item.wallType] = wallInfo;
      allWallTypes.push({
        wallType: item.wallType,
        ...wallInfo,
      });
    }
  });

  // Sort wall types by households
  allWallTypes.sort((a, b) => b.households - a.households);

  // Update ranks after sorting
  allWallTypes.forEach((wallType, index) => {
    wallData[wallType.wallType].rank = index + 1;
  });

  // Get top 5 wall types
  const topWallTypes = allWallTypes.slice(0, 5).map(wallType => ({
    wallType: wallType.wallType,
    households: wallType.households,
    percentage: wallType.percentage,
    label: wallType.label,
  }));

  // Process ward data
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalHouseholds = wardItems.reduce((sum, item) => sum + item.households, 0);
    const wardWallTypes: Record<string, number> = {};
    
    wardItems.forEach(item => {
      if (wardWallTypes[item.wallType]) {
        wardWallTypes[item.wallType] += item.households;
      } else {
        wardWallTypes[item.wallType] = item.households;
      }
    });

    // Find primary wall type for this ward
    const sortedWardWallTypes = Object.entries(wardWallTypes).sort(([, a], [, b]) => b - a);
    const primaryWallType = sortedWardWallTypes[0]?.[0] || '';
    const primaryWallPercentage = wardTotalHouseholds > 0 
      ? (sortedWardWallTypes[0]?.[1] || 0) / wardTotalHouseholds * 100 
      : 0;

    wardData[wardNum] = {
      totalHouseholds: wardTotalHouseholds,
      wallTypes: wardWallTypes,
      primaryWallType,
      primaryWallPercentage,
      wallTypeCount: Object.keys(wardWallTypes).length,
    };
  });

  // Calculate wall categories
  const wallCategories = {
    modern: 0,
    traditional: 0,
    mixed: 0,
    other: 0,
  };

  Object.entries(wallData).forEach(([wallType, data]) => {
    if (WALL_CATEGORIES.modern.includes(wallType)) {
      wallCategories.modern += data.households;
    } else if (WALL_CATEGORIES.traditional.includes(wallType)) {
      wallCategories.traditional += data.households;
    } else if (WALL_CATEGORIES.mixed.includes(wallType)) {
      wallCategories.mixed += data.households;
    } else {
      wallCategories.other += data.households;
    }
  });

  return {
    totalHouseholds,
    wallData,
    wardData,
    topWallTypes,
    wallCategories,
  };
}

export function generateWardWiseHouseOuterWallAnalysis(data: ProcessedWardWiseHouseOuterWallData): string {
  if (data.totalHouseholds === 0) {
    return "घरको बाहिरी गारो सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary with detailed context
  analysisParts.push(
    `बुद्धशान्ति गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalHouseholds)} घरपरिवार रहेका छन् जसमा विभिन्न प्रकारका बाहिरी गारो प्रयोग गरिएका छन्। यी तथ्याङ्कले गाउँपालिकाको आवासीय निर्माण गुणस्तर, आर्थिक अवस्था र सुरक्षा स्तरको विस्तृत चित्र प्रस्तुत गर्दछ।`
  );

  // Calculate quality scores and metrics
  const cementJoinedData = data.wallData['CEMENT_JOINED'];
  const prefabData = data.wallData['PREFAB'];
  const mudJoinedData = data.wallData['MUD_JOINED'];
  const unbakedBrickData = data.wallData['UNBAKED_BRICK'];
  const tinData = data.wallData['TIN'];
  const bambooData = data.wallData['BAMBOO'];
  const woodData = data.wallData['WOOD'];
  const otherData = data.wallData['OTHER'];

  const highQualityWalls = (cementJoinedData?.households || 0) + (prefabData?.households || 0);
  const mediumQualityWalls = (mudJoinedData?.households || 0) + (woodData?.households || 0);
  const lowQualityWalls = (unbakedBrickData?.households || 0) + (tinData?.households || 0) + (bambooData?.households || 0) + (otherData?.households || 0);

  const highQualityPercentage = data.totalHouseholds > 0 ? (highQualityWalls / data.totalHouseholds) * 100 : 0;
  const mediumQualityPercentage = data.totalHouseholds > 0 ? (mediumQualityWalls / data.totalHouseholds) * 100 : 0;
  const lowQualityPercentage = data.totalHouseholds > 0 ? (lowQualityWalls / data.totalHouseholds) * 100 : 0;

  // Calculate overall quality score (0-100)
  const qualityScore = (highQualityPercentage * 0.8) + (mediumQualityPercentage * 0.5) + (lowQualityPercentage * 0.2);

  // Top wall types analysis with detailed insights
  if (data.topWallTypes.length > 0) {
    const topWallType = data.topWallTypes[0];
    analysisParts.push(
      `गाउँपालिकामा सबैभन्दा बढी प्रयोग गरिएको बाहिरी गारो ${topWallType.label} रहेको छ जसमा ${convertToNepaliNumber(topWallType.households)} घरपरिवार (${formatNepaliPercentage(topWallType.percentage)}) समावेश छन्। यो प्रतिशतले गाउँपालिकाको आवासीय निर्माण प्रवृत्ति र स्थानीय स्रोतको उपलब्धतालाई प्रतिबिम्बित गर्दछ।`
    );

    if (data.topWallTypes.length > 1) {
      const secondWallType = data.topWallTypes[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondWallType.label} रहेको छ जसमा ${convertToNepaliNumber(secondWallType.households)} घरपरिवार (${formatNepaliPercentage(secondWallType.percentage)}) समावेश छन्। यी दुई प्रकारका गारो मिलेर गाउँपालिकाको कुल घरपरिवारको ${formatNepaliPercentage(topWallType.percentage + secondWallType.percentage)} भाग ओगटेका छन् जसले स्थानीय निर्माण प्रविधिको प्रभुत्व देखाउँछ।`
      );
    }

    if (data.topWallTypes.length > 2) {
      const thirdWallType = data.topWallTypes[2];
      analysisParts.push(
        `तेस्रो स्थानमा ${thirdWallType.label} रहेको छ जसमा ${convertToNepaliNumber(thirdWallType.households)} घरपरिवार (${formatNepaliPercentage(thirdWallType.percentage)}) समावेश छन्। यी तीन प्रकारका गारो मिलेर गाउँपालिकाको आवासीय निर्माणको मुख्य आधार बनेका छन्।`
      );
    }
  }

  // Quality analysis with critical insights
  analysisParts.push(
    `गारोको गुणस्तर विश्लेषण अनुसार, उच्च गुणस्तरका गारो (सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा र प्रि फ्याब) भएका घरहरू ${convertToNepaliNumber(highQualityWalls)} (${formatNepaliPercentage(highQualityPercentage)}) रहेका छन्। मध्यम गुणस्तरका गारो (माटोको जोडाइ भएको इँटा/ढुङ्गा र काठ/फल्याक) भएका घरहरू ${convertToNepaliNumber(mediumQualityWalls)} (${formatNepaliPercentage(mediumQualityPercentage)}) रहेका छन्। न्यून गुणस्तरका गारो (काँचो इँटा, जस्ता/टिन, बाँसजन्य सामग्री र अन्य) भएका घरहरू ${convertToNepaliNumber(lowQualityWalls)} (${formatNepaliPercentage(lowQualityPercentage)}) रहेका छन्।`
  );

  // Overall quality score analysis
  analysisParts.push(
    `समग्र गुणस्तर स्कोर ${convertToNepaliNumber(Math.round(qualityScore * 10) / 10)} रहेको छ (१०० मा) जसले गाउँपालिकाको आवासीय निर्माण गुणस्तरको स्तर देखाउँछ। यो स्कोरले भूकम्पीय सुरक्षा, आर्थिक स्थिरता र दिगो विकासको दिशामा गाउँपालिकाको अवस्थालाई मूल्याङ्कन गर्न सहयोग गर्दछ।`
  );

  // Wall categories analysis with detailed breakdown
  const categories = data.wallCategories;
  const totalInCategories = categories.modern + categories.traditional + categories.mixed + categories.other;
  
  if (totalInCategories > 0) {
    const modernPercentage = (categories.modern / totalInCategories) * 100;
    const traditionalPercentage = (categories.traditional / totalInCategories) * 100;
    const mixedPercentage = (categories.mixed / totalInCategories) * 100;
    const otherPercentage = (categories.other / totalInCategories) * 100;

    analysisParts.push(
      `गारोको वर्गीकरण अनुसार विश्लेषण गर्दा, आधुनिक सामग्री (सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा र प्रि फ्याब) प्रयोग गरिएका घरहरू ${convertToNepaliNumber(categories.modern)} (${formatNepaliPercentage(modernPercentage)}) रहेका छन्। परम्परागत सामग्री (माटोको जोडाइ भएको इँटा/ढुङ्गा, बाँसजन्य सामग्री, काठ/फल्याक र काँचो इँटा) प्रयोग गरिएका घरहरू ${convertToNepaliNumber(categories.traditional)} (${formatNepaliPercentage(traditionalPercentage)}) रहेका छन्। मिश्रित सामग्री (जस्ता/टिन/च्यादर) प्रयोग गरिएका घरहरू ${convertToNepaliNumber(categories.mixed)} (${formatNepaliPercentage(mixedPercentage)}) रहेका छन्। अन्य सामग्री प्रयोग गरिएका घरहरू ${convertToNepaliNumber(categories.other)} (${formatNepaliPercentage(otherPercentage)}) रहेका छन्।`
    );
  }

  // Ward-wise detailed analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalHouseholds > max.totalHouseholds ? { wardNum, ...wardData } : max
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, wallTypes: {}, primaryWallType: '', primaryWallPercentage: 0, wallTypeCount: 0 });
    const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
      wardData.totalHouseholds < min.totalHouseholds ? { wardNum, ...wardData } : min
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, wallTypes: {}, primaryWallType: '', primaryWallPercentage: 0, wallTypeCount: 0 });

    // Calculate ward quality scores
    const wardQualityScores = wardEntries.map(([wardNum, wardData]) => {
      const wardHighQuality = (wardData.wallTypes['CEMENT_JOINED'] || 0) + (wardData.wallTypes['PREFAB'] || 0);
      const wardMediumQuality = (wardData.wallTypes['MUD_JOINED'] || 0) + (wardData.wallTypes['WOOD'] || 0);
      const wardLowQuality = (wardData.wallTypes['UNBAKED_BRICK'] || 0) + (wardData.wallTypes['TIN'] || 0) + (wardData.wallTypes['BAMBOO'] || 0) + (wardData.wallTypes['OTHER'] || 0);
      
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
      `वडाको आधारमा विस्तृत विश्लेषण गर्दा, वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalHouseholds)} घरपरिवार रहेका छन् भने वडा नं. ${convertToNepaliNumber(parseInt(lowestWard.wardNum))} मा सबैभन्दा कम ${convertToNepaliNumber(lowestWard.totalHouseholds)} घरपरिवार रहेका छन्। गुणस्तरको दृष्टिकोणबाट हेर्दा, वडा नं. ${convertToNepaliNumber(parseInt(bestQualityWard.wardNum))} मा सबैभन्दा राम्रो गुणस्तरका गारो भएका घरहरू रहेका छन् जसको गुणस्तर स्कोर ${convertToNepaliNumber(Math.round(bestQualityWard.wardQualityScore * 10) / 10)} रहेको छ। यस वडामा उच्च गुणस्तरका गारो भएका घरहरू ${formatNepaliPercentage(bestQualityWard.wardHighQualityPercentage)} रहेका छन्।`
    );

    analysisParts.push(
      `वडा नं. ${convertToNepaliNumber(parseInt(worstQualityWard.wardNum))} मा सबैभन्दा न्यून गुणस्तरका गारो भएका घरहरू रहेका छन् जसको गुणस्तर स्कोर ${convertToNepaliNumber(Math.round(worstQualityWard.wardQualityScore * 10) / 10)} रहेको छ। यस वडामा न्यून गुणस्तरका गारो भएका घरहरू ${formatNepaliPercentage(worstQualityWard.wardLowQualityPercentage)} रहेका छन् जसले यस वडाको आवासीय सुरक्षा र भूकम्पीय प्रतिरोधक क्षमतामा चुनौती रहेको देखाउँछ।`
    );
  }

  // Critical insights and recommendations
  analysisParts.push(
    `यी तथ्याङ्कले गाउँपालिकाको आवासीय निर्माण सामग्रीको वितरण र आर्थिक अवस्थाको मूल्याङ्कन गर्न सहयोग गर्दछ। आधुनिक सामग्रीको प्रयोगले सुरक्षित र दिगो आवास निर्माणको प्रवृत्ति देखाउँछ। परम्परागत सामग्रीको उपस्थिति स्थानीय स्रोत र परम्परागत सीपको निरन्तरतालाई प्रतिनिधित्व गर्दछ। मिश्रित सामग्रीको प्रयोगले आवास निर्माणमा विविधता र लचकदारतालाई संकेत गर्दछ। न्यून गुणस्तरका गारो भएका घरहरूको उच्च प्रतिशतले भूकम्पीय जोखिम र आवासीय सुरक्षामा चुनौती रहेको देखाउँछ।`
  );

  // Additional critical analysis
  if (lowQualityPercentage > 30) {
    analysisParts.push(
      `गाउँपालिकामा न्यून गुणस्तरका गारो भएका घरहरूको प्रतिशत ${formatNepaliPercentage(lowQualityPercentage)} रहेको छ जुन चिन्ताजनक स्तरमा रहेको छ। यस्ता घरहरू भूकम्प, बाढी र अन्य प्राकृतिक विपद्को उच्च जोखिममा रहेका छन्। यसको लागि तत्काल सुधारका कार्यक्रमहरू ल्याउनुपर्ने आवश्यकता रहेको छ।`
    );
  }

  if (highQualityPercentage < 40) {
    analysisParts.push(
      `उच्च गुणस्तरका गारो भएका घरहरूको प्रतिशत ${formatNepaliPercentage(highQualityPercentage)} मात्र रहेको छ जुन आधुनिक निर्माण मापदण्डको तुलनामा न्यून छ। यसले गाउँपालिकाको आवासीय निर्माणमा आधुनिक प्रविधि र सामग्रीको प्रयोग बढाउनुपर्ने आवश्यकतालाई संकेत गर्दछ।`
    );
  }

  analysisParts.push(
    `समग्र रूपमा, गाउँपालिकाको आवासीय निर्माण गुणस्तरमा सुधारका लागि नीतिगत हस्तक्षेप, प्रविधि हस्तान्तरण र जनचेतना अभिवृद्धि कार्यक्रमहरूको आवश्यकता रहेको छ। यसले न केवल आवासीय सुरक्षा बढाउँछ तर गाउँपालिकाको समग्र विकास र दिगोता पनि सुनिश्चित गर्दछ।`
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