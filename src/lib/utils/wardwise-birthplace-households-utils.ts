import { BirthPlaceEnum } from "@/server/api/routers/profile/demographics/ward-wise-birthplace-households.schema";

export interface WardWiseBirthplaceHouseholdsData {
  id: string;
  wardNumber: number;
  birthPlace: keyof typeof BirthPlaceEnum.enum;
  households: number;
}

export interface ProcessedWardWiseBirthplaceHouseholdsData {
  totalHouseholds: number;
  birthplaceData: Record<string, {
    households: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  wardData: Record<number, {
    totalHouseholds: number;
    birthplaces: Record<string, number>;
    primaryBirthplace: string;
    primaryBirthplacePercentage: number;
    birthplaceCount: number;
  }>;
  topBirthplaces: Array<{
    birthPlace: string;
    households: number;
    percentage: number;
    label: string;
  }>;
  birthplaceCategories: {
    local: number;
    regional: number;
    national: number;
    international: number;
  };
  birthplaceScores: {
    localRootednessScore: number;
    diversityScore: number;
    migrationPatternScore: number;
    socialIntegrationScore: number;
  };
}

export const BIRTHPLACE_LABELS: Record<string, string> = {
  SAME_MUNICIPALITY: "यही गाउँपालिका",
  SAME_DISTRICT_ANOTHER_MUNICIPALITY: "यही जिल्लाको अर्को स्थानीय तह",
  ANOTHER_DISTRICT: "नेपालको अर्को जिल्ला",
  ABROAD: "विदेश",
};

export const BIRTHPLACE_CATEGORIES: Record<string, string[]> = {
  local: ["SAME_MUNICIPALITY"],
  regional: ["SAME_DISTRICT_ANOTHER_MUNICIPALITY"],
  national: ["ANOTHER_DISTRICT"],
  international: ["ABROAD"],
};

export function processWardWiseBirthplaceHouseholdsData(rawData: WardWiseBirthplaceHouseholdsData[]): ProcessedWardWiseBirthplaceHouseholdsData {
  if (!rawData || rawData.length === 0) {
    return {
      totalHouseholds: 0,
      birthplaceData: {},
      wardData: {},
      topBirthplaces: [],
      birthplaceCategories: {
        local: 0,
        regional: 0,
        national: 0,
        international: 0,
      },
      birthplaceScores: {
        localRootednessScore: 0,
        diversityScore: 0,
        migrationPatternScore: 0,
        socialIntegrationScore: 0,
      },
    };
  }

  // Calculate total households
  const totalHouseholds = rawData.reduce((sum, item) => sum + (item.households || 0), 0);

  // Process birthplace data
  const birthplaceData: Record<string, any> = {};
  const allBirthplaces: Array<any> = [];

  rawData.forEach((item, index) => {
    const percentage = totalHouseholds > 0 ? (item.households / totalHouseholds) * 100 : 0;
    const birthplaceInfo = {
      households: item.households,
      percentage,
      label: BIRTHPLACE_LABELS[item.birthPlace] || item.birthPlace,
      rank: index + 1,
    };

    if (birthplaceData[item.birthPlace]) {
      birthplaceData[item.birthPlace].households += item.households;
      birthplaceData[item.birthPlace].percentage = totalHouseholds > 0 ? (birthplaceData[item.birthPlace].households / totalHouseholds) * 100 : 0;
    } else {
      birthplaceData[item.birthPlace] = birthplaceInfo;
      allBirthplaces.push({
        birthPlace: item.birthPlace,
        ...birthplaceInfo,
      });
    }
  });

  // Sort birthplaces by households
  allBirthplaces.sort((a, b) => b.households - a.households);

  // Update ranks after sorting
  allBirthplaces.forEach((birthplace, index) => {
    birthplaceData[birthplace.birthPlace].rank = index + 1;
  });

  // Get top 5 birthplaces
  const topBirthplaces = allBirthplaces.slice(0, 5).map(birthplace => ({
    birthPlace: birthplace.birthPlace,
    households: birthplace.households,
    percentage: birthplace.percentage,
    label: birthplace.label,
  }));

  // Process ward data
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalHouseholds = wardItems.reduce((sum, item) => sum + item.households, 0);
    const wardBirthplaces: Record<string, number> = {};
    
    wardItems.forEach(item => {
      if (wardBirthplaces[item.birthPlace]) {
        wardBirthplaces[item.birthPlace] += item.households;
      } else {
        wardBirthplaces[item.birthPlace] = item.households;
      }
    });

    // Find primary birthplace for this ward
    const sortedWardBirthplaces = Object.entries(wardBirthplaces).sort(([, a], [, b]) => b - a);
    const primaryBirthplace = sortedWardBirthplaces[0]?.[0] || '';
    const primaryBirthplacePercentage = wardTotalHouseholds > 0 
      ? (sortedWardBirthplaces[0]?.[1] || 0) / wardTotalHouseholds * 100 
      : 0;

    wardData[wardNum] = {
      totalHouseholds: wardTotalHouseholds,
      birthplaces: wardBirthplaces,
      primaryBirthplace,
      primaryBirthplacePercentage,
      birthplaceCount: Object.keys(wardBirthplaces).length,
    };
  });

  // Calculate birthplace categories
  const birthplaceCategories = {
    local: 0,
    regional: 0,
    national: 0,
    international: 0,
  };

  Object.entries(birthplaceData).forEach(([birthplace, data]) => {
    if (BIRTHPLACE_CATEGORIES.local.includes(birthplace)) {
      birthplaceCategories.local += data.households;
    } else if (BIRTHPLACE_CATEGORIES.regional.includes(birthplace)) {
      birthplaceCategories.regional += data.households;
    } else if (BIRTHPLACE_CATEGORIES.national.includes(birthplace)) {
      birthplaceCategories.national += data.households;
    } else {
      birthplaceCategories.international += data.households;
    }
  });

  // Calculate birthplace scores
  const localPercentage = totalHouseholds > 0 ? (birthplaceCategories.local / totalHouseholds) * 100 : 0;
  const regionalPercentage = totalHouseholds > 0 ? (birthplaceCategories.regional / totalHouseholds) * 100 : 0;
  const nationalPercentage = totalHouseholds > 0 ? (birthplaceCategories.national / totalHouseholds) * 100 : 0;
  const internationalPercentage = totalHouseholds > 0 ? (birthplaceCategories.international / totalHouseholds) * 100 : 0;

  // Local Rootedness Score (0-100) - Higher local birth = higher rootedness
  const localRootednessScore = (localPercentage * 0.9) + (regionalPercentage * 0.6) + (nationalPercentage * 0.3) + (internationalPercentage * 0.1);

  // Diversity Score (0-100) - Balance between different birthplaces
  const birthplaceDiversity = 100 - Math.max(localPercentage, regionalPercentage, nationalPercentage, internationalPercentage);
  const diversityScore = (birthplaceDiversity * 0.6) + (localPercentage * 0.2) + (regionalPercentage * 0.1) + (nationalPercentage * 0.1);

  // Migration Pattern Score (0-100) - Based on migration patterns
  const migrationPatternScore = (localPercentage * 0.3) + (regionalPercentage * 0.5) + (nationalPercentage * 0.7) + (internationalPercentage * 0.9);

  // Social Integration Score (0-100) - Based on social cohesion indicators
  const socialIntegrationScore = (localPercentage * 0.8) + (regionalPercentage * 0.7) + (nationalPercentage * 0.5) + (internationalPercentage * 0.3);

  return {
    totalHouseholds,
    birthplaceData,
    wardData,
    topBirthplaces,
    birthplaceCategories,
    birthplaceScores: {
      localRootednessScore,
      diversityScore,
      migrationPatternScore,
      socialIntegrationScore,
    },
  };
}

export function generateWardWiseBirthplaceHouseholdsAnalysis(data: ProcessedWardWiseBirthplaceHouseholdsData): string {
  if (data.totalHouseholds === 0) {
    return "जन्मस्थान अनुसार परिवार सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary with detailed context
  analysisParts.push(
    `बुद्धशान्ति गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalHouseholds)} घरपरिवार रहेका छन् जसमा विभिन्न जन्मस्थानका परिवारहरू समावेश छन्। यी तथ्याङ्कले गाउँपालिकाको जनसंख्या संरचना, सामाजिक एकीकरण र विकासको स्तरको विस्तृत चित्र प्रस्तुत गर्दछ। जन्मस्थानको वितरणले न केवल स्थानीय जनताको मूल र आधार मात्र देखाउँछ तर सामाजिक संरचना, आर्थिक गतिविधि र भविष्यको विकासको दिशालाई पनि संकेत गर्दछ।`
  );

  // Calculate detailed metrics
  const sameMunicipalityData = data.birthplaceData['SAME_MUNICIPALITY'];
  const sameDistrictData = data.birthplaceData['SAME_DISTRICT_ANOTHER_MUNICIPALITY'];
  const anotherDistrictData = data.birthplaceData['ANOTHER_DISTRICT'];
  const abroadData = data.birthplaceData['ABROAD'];

  const sameMunicipalityHouseholds = sameMunicipalityData?.households || 0;
  const sameDistrictHouseholds = sameDistrictData?.households || 0;
  const anotherDistrictHouseholds = anotherDistrictData?.households || 0;
  const abroadHouseholds = abroadData?.households || 0;

  const sameMunicipalityPercentage = data.totalHouseholds > 0 ? (sameMunicipalityHouseholds / data.totalHouseholds) * 100 : 0;
  const sameDistrictPercentage = data.totalHouseholds > 0 ? (sameDistrictHouseholds / data.totalHouseholds) * 100 : 0;
  const anotherDistrictPercentage = data.totalHouseholds > 0 ? (anotherDistrictHouseholds / data.totalHouseholds) * 100 : 0;
  const abroadPercentage = data.totalHouseholds > 0 ? (abroadHouseholds / data.totalHouseholds) * 100 : 0;

  // Top birthplaces analysis with detailed insights
  if (data.topBirthplaces.length > 0) {
    const topBirthplace = data.topBirthplaces[0];
    analysisParts.push(
      `गाउँपालिकामा सबैभन्दा बढी परिवारहरू ${topBirthplace.label} जन्मस्थानका रहेका छन् जसमा ${convertToNepaliNumber(topBirthplace.households)} घरपरिवार (${formatNepaliPercentage(topBirthplace.percentage)}) समावेश छन्। यो प्रतिशतले गाउँपालिकाको स्थानीय जनताको मूल र आधारको स्तर देखाउँछ। स्थानीय जन्मस्थानको उच्च प्रतिशतले स्थानीय संस्कृति, परम्परा र सामाजिक मूल्यहरूको निरन्तरतालाई प्रतिबिम्बित गर्दछ। यसले गाउँपालिकाको सामाजिक स्थिरता र सांस्कृतिक विरासतको संरक्षणको स्तर देखाउँछ।`
    );

    if (data.topBirthplaces.length > 1) {
      const secondBirthplace = data.topBirthplaces[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondBirthplace.label} जन्मस्थानका परिवारहरू रहेका छन् जसमा ${convertToNepaliNumber(secondBirthplace.households)} घरपरिवार (${formatNepaliPercentage(secondBirthplace.percentage)}) समावेश छन्। यी दुई प्रकारका जन्मस्थान मिलेर गाउँपालिकाको कुल घरपरिवारको ${formatNepaliPercentage(topBirthplace.percentage + secondBirthplace.percentage)} भाग ओगटेका छन् जसले स्थानीय जनसंख्या संरचनाको मुख्य प्रवृत्ति देखाउँछ। क्षेत्रीय जन्मस्थानको उपस्थिति सामाजिक गतिशीलता र आर्थिक अन्तर्क्रियाको स्तर देखाउँछ। यसले गाउँपालिकाको सामाजिक एकीकरण र विकासको दिशालाई पनि संकेत गर्दछ।`
      );
    }

    if (data.topBirthplaces.length > 2) {
      const thirdBirthplace = data.topBirthplaces[2];
      analysisParts.push(
        `तेस्रो स्थानमा ${thirdBirthplace.label} जन्मस्थानका परिवारहरू रहेका छन् जसमा ${convertToNepaliNumber(thirdBirthplace.households)} घरपरिवार (${formatNepaliPercentage(thirdBirthplace.percentage)}) समावेश छन्। यी तीन प्रकारका जन्मस्थान मिलेर गाउँपालिकाको जनसंख्या संरचनाको मुख्य आधार बनेका छन्। राष्ट्रिय जन्मस्थानको उपस्थिति देशभरिको जनसंख्या गतिशीलता र आर्थिक अवसरहरूको आकर्षणलाई प्रतिबिम्बित गर्दछ। यसले गाउँपालिकाको राष्ट्रिय स्तरको महत्त्व र विकासको सम्भावनालाई संकेत गर्दछ।`
      );
    }
  }

  // Birthplace categories analysis with detailed breakdown
  const categories = data.birthplaceCategories;
  const totalInCategories = categories.local + categories.regional + categories.national + categories.international;
  
  if (totalInCategories > 0) {
    const localCategoryPercentage = (categories.local / totalInCategories) * 100;
    const regionalCategoryPercentage = (categories.regional / totalInCategories) * 100;
    const nationalCategoryPercentage = (categories.national / totalInCategories) * 100;
    const internationalCategoryPercentage = (categories.international / totalInCategories) * 100;

    analysisParts.push(
      `जन्मस्थानको वर्गीकरण अनुसार विश्लेषण गर्दा, स्थानीय जन्मस्थानका परिवारहरू ${convertToNepaliNumber(categories.local)} (${formatNepaliPercentage(localCategoryPercentage)}) रहेका छन् जसले गाउँपालिकाको स्थानीय जनताको मूल र आधारको स्तर देखाउँछ। क्षेत्रीय जन्मस्थानका परिवारहरू ${convertToNepaliNumber(categories.regional)} (${formatNepaliPercentage(regionalCategoryPercentage)}) रहेका छन् जसले सामाजिक गतिशीलता र आर्थिक अन्तर्क्रियाको स्तर देखाउँछ। राष्ट्रिय जन्मस्थानका परिवारहरू ${convertToNepaliNumber(categories.national)} (${formatNepaliPercentage(nationalCategoryPercentage)}) रहेका छन् जसले राष्ट्रिय स्तरको जनसंख्या गतिशीलता र आर्थिक अवसरहरूको आकर्षणलाई प्रतिनिधित्व गर्दछ। अन्तर्राष्ट्रिय जन्मस्थानका परिवारहरू ${convertToNepaliNumber(categories.international)} (${formatNepaliPercentage(internationalCategoryPercentage)}) रहेका छन् जसले वैश्विक स्तरको जनसंख्या गतिशीलता र सांस्कृतिक विविधतालाई प्रतिनिधित्व गर्दछ।`
    );
  }

  // Birthplace scores analysis with critical insights
  const scores = data.birthplaceScores;
  analysisParts.push(
    `जन्मस्थानको गुणस्तर विश्लेषण अनुसार, स्थानीय मूलता स्कोर ${convertToNepaliNumber(Math.round(scores.localRootednessScore * 10) / 10)} रहेको छ (१०० मा) जसले गाउँपालिकाको स्थानीय जनताको मूल र आधारको स्तर देखाउँछ। विविधता स्कोर ${convertToNepaliNumber(Math.round(scores.diversityScore * 10) / 10)} रहेको छ जसले विभिन्न जन्मस्थानका जनताहरू बीचको सामाजिक विविधतालाई मूल्याङ्कन गर्दछ। प्रवास पैटर्न स्कोर ${convertToNepaliNumber(Math.round(scores.migrationPatternScore * 10) / 10)} रहेको छ जसले जनसंख्या गतिशीलता र प्रवासको प्रवृत्तिलाई संकेत गर्दछ। सामाजिक एकीकरण स्कोर ${convertToNepaliNumber(Math.round(scores.socialIntegrationScore * 10) / 10)} रहेको छ जसले विभिन्न जन्मस्थानका जनताहरू बीचको सामाजिक एकीकरण र सहयोगको स्तर मूल्याङ्कन गर्दछ। यी स्कोरहरूले गाउँपालिकाको समग्र सामाजिक संरचना र विकासको स्तर मूल्याङ्कन गर्न सहयोग गर्दछ।`
  );

  // Ward-wise detailed analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalHouseholds > max.totalHouseholds ? { wardNum, ...wardData } : max
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, birthplaces: {}, primaryBirthplace: '', primaryBirthplacePercentage: 0, birthplaceCount: 0 });
    const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
      wardData.totalHouseholds < min.totalHouseholds ? { wardNum, ...wardData } : min
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, birthplaces: {}, primaryBirthplace: '', primaryBirthplacePercentage: 0, birthplaceCount: 0 });

    // Calculate ward birthplace scores
    const wardBirthplaceScores = wardEntries.map(([wardNum, wardData]) => {
      const wardLocal = (wardData.birthplaces['SAME_MUNICIPALITY'] || 0);
      const wardRegional = (wardData.birthplaces['SAME_DISTRICT_ANOTHER_MUNICIPALITY'] || 0);
      const wardNational = (wardData.birthplaces['ANOTHER_DISTRICT'] || 0);
      const wardInternational = (wardData.birthplaces['ABROAD'] || 0);
      
      const wardLocalPercentage = wardData.totalHouseholds > 0 ? (wardLocal / wardData.totalHouseholds) * 100 : 0;
      const wardRegionalPercentage = wardData.totalHouseholds > 0 ? (wardRegional / wardData.totalHouseholds) * 100 : 0;
      const wardNationalPercentage = wardData.totalHouseholds > 0 ? (wardNational / wardData.totalHouseholds) * 100 : 0;
      const wardInternationalPercentage = wardData.totalHouseholds > 0 ? (wardInternational / wardData.totalHouseholds) * 100 : 0;
      
      const wardLocalRootednessScore = (wardLocalPercentage * 0.9) + (wardRegionalPercentage * 0.6) + (wardNationalPercentage * 0.3) + (wardInternationalPercentage * 0.1);
      
      return { wardNum, wardData, wardLocalRootednessScore, wardLocalPercentage, wardInternationalPercentage };
    });

    const bestLocalRootednessWard = wardBirthplaceScores.reduce((best, current) => 
      current.wardLocalRootednessScore > best.wardLocalRootednessScore ? current : best
    );
    const worstLocalRootednessWard = wardBirthplaceScores.reduce((worst, current) => 
      current.wardLocalRootednessScore < worst.wardLocalRootednessScore ? current : worst
    );

    analysisParts.push(
      `वडाको आधारमा विस्तृत विश्लेषण गर्दा, वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalHouseholds)} घरपरिवार रहेका छन् भने वडा नं. ${convertToNepaliNumber(parseInt(lowestWard.wardNum))} मा सबैभन्दा कम ${convertToNepaliNumber(lowestWard.totalHouseholds)} घरपरिवार रहेका छन्। स्थानीय मूलताको दृष्टिकोणबाट हेर्दा, वडा नं. ${convertToNepaliNumber(parseInt(bestLocalRootednessWard.wardNum))} मा सबैभन्दा राम्रो स्थानीय मूलता रहेको छ जसको स्थानीय मूलता स्कोर ${convertToNepaliNumber(Math.round(bestLocalRootednessWard.wardLocalRootednessScore * 10) / 10)} रहेको छ। यस वडामा स्थानीय जन्मस्थानका परिवारहरू ${formatNepaliPercentage(bestLocalRootednessWard.wardLocalPercentage)} रहेका छन् जसले यस वडाको स्थानीय संस्कृति र परम्पराको उच्च स्तर देखाउँछ। यसले यस वडाको सामाजिक स्थिरता र सांस्कृतिक विरासतको संरक्षणको स्तर पनि संकेत गर्दछ।`
    );

    analysisParts.push(
      `वडा नं. ${convertToNepaliNumber(parseInt(worstLocalRootednessWard.wardNum))} मा सबैभन्दा न्यून स्थानीय मूलता रहेको छ जसको स्थानीय मूलता स्कोर ${convertToNepaliNumber(Math.round(worstLocalRootednessWard.wardLocalRootednessScore * 10) / 10)} रहेको छ। यस वडामा अन्तर्राष्ट्रिय जन्मस्थानका परिवारहरू ${formatNepaliPercentage(worstLocalRootednessWard.wardInternationalPercentage)} रहेका छन् जसले यस वडाको उच्च स्तरको जनसंख्या गतिशीलता र सांस्कृतिक विविधतालाई संकेत गर्दछ। यसले यस वडाको वैश्विक स्तरको जनसंख्या गतिशीलता र आर्थिक अवसरहरूको आकर्षणलाई पनि संकेत गर्दछ। यस्ता वडाहरूमा सामाजिक एकीकरण र सांस्कृतिक समझदारीको आवश्यकता रहेको छ।`
    );
  }

  // Critical insights and policy recommendations
  analysisParts.push(
    `यी तथ्याङ्कले गाउँपालिकाको जन्मस्थानको वितरण र सामाजिक संरचनाको मूल्याङ्कन गर्न सहयोग गर्दछ। स्थानीय जन्मस्थानको उच्च प्रतिशतले स्थानीय जनताको मूल र आधारको स्तर देखाउँछ। क्षेत्रीय जन्मस्थानको उपस्थिति सामाजिक गतिशीलता र आर्थिक अन्तर्क्रियाको स्तर देखाउँछ। राष्ट्रिय जन्मस्थान स्तरको जनसंख्या गतिशीलता र आर्थिक अवसरहरूको आकर्षणलाई प्रतिनिधित्व गर्दछ। अन्तर्राष्ट्रिय जन्मस्थान वैश्विक स्तरको जनसंख्या गतिशीलता र सांस्कृतिक विविधतालाई प्रतिनिधित्व गर्दछ। यी विविध जन्मस्थानहरूको उपस्थिति गाउँपालिकाको सामाजिक-आर्थिक संरचनाको जटिलतालाई प्रतिबिम्बित गर्दछ। स्थानीय जन्मस्थानको उच्च प्रतिशतले सामाजिक स्थिरता र सांस्कृतिक विरासतको संरक्षणको स्तर देखाउँछ। अन्तर्राष्ट्रिय जन्मस्थानको उच्च प्रतिशतले वैश्विक स्तरको जनसंख्या गतिशीलता र आर्थिक अवसरहरूको आकर्षणलाई संकेत गर्दछ। यी तथ्याङ्कले सामाजिक नीति र विकास योजनाहरूको निर्माणमा महत्त्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ।`
  );

  // Additional critical analysis with policy implications
  if (abroadPercentage > 20) {
    analysisParts.push(
      `गाउँपालिकामा विदेशी जन्मस्थानका परिवारहरूको प्रतिशत ${formatNepaliPercentage(abroadPercentage)} रहेको छ जुन उच्च स्तरमा रहेको छ। यस्ता परिवारहरू वैश्विक स्तरको जनसंख्या गतिशीलता र आर्थिक अवसरहरूको आकर्षणलाई प्रतिनिधित्व गर्दछ। यसको लागि सामाजिक एकीकरण कार्यक्रमहरू, सांस्कृतिक समझदारी अभिवृद्धि र आर्थिक सहयोग कार्यक्रमहरू ल्याउनुपर्ने आवश्यकता रहेको छ। विदेशी जन्मस्थानको उच्च दरले सांस्कृतिक विविधता र वैश्विक स्तरको जनसंख्या गतिशीलतालाई बढाउन सक्छ। यसको लागि नीतिगत हस्तक्षेप, सामाजिक एकीकरण कार्यक्रमहरू र सांस्कृतिक समझदारी अभिवृद्धि कार्यक्रमहरूको आवश्यकता रहेको छ।`
    );
  }

  if (sameMunicipalityPercentage < 50) {
    analysisParts.push(
      `स्थानीय जन्मस्थानका परिवारहरूको प्रतिशत ${formatNepaliPercentage(sameMunicipalityPercentage)} मात्र रहेको छ जुन सामाजिक स्थिरताको दृष्टिकोणबाट न्यून छ। यसले गाउँपालिकाको स्थानीय जनताको मूल र आधारमा सुधारका कार्यक्रमहरूको आवश्यकतालाई संकेत गर्दछ। स्थानीय जन्मस्थान बढाउन सामाजिक एकीकरण कार्यक्रमहरू, सांस्कृतिक विरासत संरक्षण कार्यक्रमहरू र स्थानीय विकास योजनाहरूको आवश्यकता रहेको छ। यसले न केवल सामाजिक स्थिरता बढाउँछ तर सांस्कृतिक विरासतको संरक्षण र सामाजिक सुरक्षा पनि सुनिश्चित गर्दछ।`
    );
  }

  if (scores.localRootednessScore < 50) {
    analysisParts.push(
      `स्थानीय मूलता स्कोर ${convertToNepaliNumber(Math.round(scores.localRootednessScore * 10) / 10)} रहेको छ जुन चिन्ताजनक स्तरमा रहेको छ। यसले गाउँपालिकाको स्थानीय जनताको मूल र आधारमा चुनौती रहेको देखाउँछ। यसको लागि व्यापक नीतिगत हस्तक्षेप, सामाजिक एकीकरण कार्यक्रमहरू र सांस्कृतिक विरासत संरक्षण योजनाहरूको आवश्यकता रहेको छ। स्थानीय मूलता स्कोर सुधार गर्न सामाजिक नीति, सांस्कृतिक विरासत संरक्षण कार्यक्रमहरू र सामाजिक एकीकरण योजनाहरूको एकीकृत दृष्टिकोण आवश्यक रहेको छ। यसले गाउँपालिकाको समग्र सामाजिक स्थिरता र सांस्कृतिक विरासतको संरक्षणलाई सुनिश्चित गर्दछ।`
    );
  }

  analysisParts.push(
    `समग्र रूपमा, गाउँपालिकाको जन्मस्थानको वितरण र सामाजिक संरचनामा सुधारका लागि नीतिगत हस्तक्षेप, सामाजिक एकीकरण कार्यक्रमहरू र सांस्कृतिक विरासत संरक्षण योजनाहरूको आवश्यकता रहेको छ। यसले न केवल सामाजिक स्थिरता बढाउँछ तर गाउँपालिकाको समग्र विकास र सांस्कृतिक विरासतको संरक्षण पनि सुनिश्चित गर्दछ। सामाजिक नीति र विकास योजनाहरूमा यी तथ्याङ्कको प्रयोग गर्दै सामाजिक-आर्थिक समानता र स्थिरतालाई प्रवर्द्धन गर्न सकिन्छ। यसले गाउँपालिकाको भविष्यको विकास र सामाजिक सुरक्षाको लागि मजबुत आधार तयार पार्दछ।`
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