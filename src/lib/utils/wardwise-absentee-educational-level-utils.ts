import { WardWiseAbsenteeEducationalLevelData } from "@/server/api/routers/profile/demographics/ward-wise-absentee-educational-level.schema";

export interface ProcessedWardWiseAbsenteeEducationalLevelData {
  totalAbsenteePopulation: number;
  educationalLevelData: Record<string, {
    population: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  wardData: Record<number, {
    totalAbsenteePopulation: number;
    educationalLevels: Record<string, number>;
    primaryEducationalLevel: string;
    primaryEducationalLevelPercentage: number;
    educationalLevelCount: number;
  }>;
  topEducationalLevels: Array<{
    educationalLevel: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  educationalCategories: {
    primary: number;
    secondary: number;
    higher: number;
    other: number;
  };
  educationalScores: {
    overallEducationScore: number;
    literacyScore: number;
    skillDevelopmentScore: number;
    humanCapitalScore: number;
  };
}

export const EDUCATIONAL_LEVEL_LABELS: Record<string, string> = {
  CHILD_DEVELOPMENT_CENTER: "बाल विकास केन्द्र",
  NURSERY: "नर्सरी",
  CLASS_1: "कक्षा १",
  CLASS_2: "कक्षा २",
  CLASS_3: "कक्षा ३",
  CLASS_4: "कक्षा ४",
  CLASS_5: "कक्षा ५",
  CLASS_6: "कक्षा ६",
  CLASS_7: "कक्षा ७",
  CLASS_8: "कक्षा ८",
  CLASS_9: "कक्षा ९",
  CLASS_10: "कक्षा १०",
  SLC_LEVEL: "एसएलसी स्तर",
  CLASS_12_LEVEL: "कक्षा १२ स्तर",
  BACHELOR_LEVEL: "स्नातक स्तर",
  MASTERS_LEVEL: "स्नातकोत्तर स्तर",
  PHD_LEVEL: "पीएचडी स्तर",
  OTHER: "अन्य",
  INFORMAL_EDUCATION: "अनौपचारिक शिक्षा",
  EDUCATED: "शिक्षित",
  UNKNOWN: "अज्ञात",
};

export const EDUCATIONAL_CATEGORIES: Record<string, string[]> = {
  primary: ["CHILD_DEVELOPMENT_CENTER", "NURSERY", "CLASS_1", "CLASS_2", "CLASS_3", "CLASS_4", "CLASS_5"],
  secondary: ["CLASS_6", "CLASS_7", "CLASS_8", "CLASS_9", "CLASS_10", "SLC_LEVEL", "CLASS_12_LEVEL"],
  higher: ["BACHELOR_LEVEL", "MASTERS_LEVEL", "PHD_LEVEL"],
  other: ["OTHER", "INFORMAL_EDUCATION", "EDUCATED", "UNKNOWN"],
};

export function processWardWiseAbsenteeEducationalLevelData(rawData: WardWiseAbsenteeEducationalLevelData[]): ProcessedWardWiseAbsenteeEducationalLevelData {
  if (!rawData || rawData.length === 0) {
    return {
      totalAbsenteePopulation: 0,
      educationalLevelData: {},
      wardData: {},
      topEducationalLevels: [],
      educationalCategories: {
        primary: 0,
        secondary: 0,
        higher: 0,
        other: 0,
      },
      educationalScores: {
        overallEducationScore: 0,
        literacyScore: 0,
        skillDevelopmentScore: 0,
        humanCapitalScore: 0,
      },
    };
  }

  // Calculate total absentee population
  const totalAbsenteePopulation = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process educational level data
  const educationalLevelData: Record<string, any> = {};
  const allEducationalLevels: Array<any> = [];

  rawData.forEach((item, index) => {
    const percentage = totalAbsenteePopulation > 0 ? (item.population / totalAbsenteePopulation) * 100 : 0;
    const educationalInfo = {
      population: item.population,
      percentage,
      label: EDUCATIONAL_LEVEL_LABELS[item.educationalLevel] || item.educationalLevel,
      rank: index + 1,
    };

    if (educationalLevelData[item.educationalLevel]) {
      educationalLevelData[item.educationalLevel].population += item.population;
      educationalLevelData[item.educationalLevel].percentage = totalAbsenteePopulation > 0 ? (educationalLevelData[item.educationalLevel].population / totalAbsenteePopulation) * 100 : 0;
    } else {
      educationalLevelData[item.educationalLevel] = educationalInfo;
      allEducationalLevels.push({
        educationalLevel: item.educationalLevel,
        ...educationalInfo,
      });
    }
  });

  // Sort educational levels by population
  allEducationalLevels.sort((a, b) => b.population - a.population);

  // Update ranks after sorting
  allEducationalLevels.forEach((level, index) => {
    educationalLevelData[level.educationalLevel].rank = index + 1;
  });

  // Get top 5 educational levels
  const topEducationalLevels = allEducationalLevels.slice(0, 5).map(level => ({
    educationalLevel: level.educationalLevel,
    population: level.population,
    percentage: level.percentage,
    label: level.label,
  }));

  // Process ward data
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalAbsenteePopulation = wardItems.reduce((sum, item) => sum + item.population, 0);
    const wardEducationalLevels: Record<string, number> = {};
    
    wardItems.forEach(item => {
      if (wardEducationalLevels[item.educationalLevel]) {
        wardEducationalLevels[item.educationalLevel] += item.population;
      } else {
        wardEducationalLevels[item.educationalLevel] = item.population;
      }
    });

    // Find primary educational level for this ward
    const sortedWardEducationalLevels = Object.entries(wardEducationalLevels).sort(([, a], [, b]) => b - a);
    const primaryEducationalLevel = sortedWardEducationalLevels[0]?.[0] || '';
    const primaryEducationalLevelPercentage = wardTotalAbsenteePopulation > 0 
      ? (sortedWardEducationalLevels[0]?.[1] || 0) / wardTotalAbsenteePopulation * 100 
      : 0;

    wardData[wardNum] = {
      totalAbsenteePopulation: wardTotalAbsenteePopulation,
      educationalLevels: wardEducationalLevels,
      primaryEducationalLevel,
      primaryEducationalLevelPercentage,
      educationalLevelCount: Object.keys(wardEducationalLevels).length,
    };
  });

  // Calculate educational categories
  const educationalCategories = {
    primary: 0,
    secondary: 0,
    higher: 0,
    other: 0,
  };

  Object.entries(educationalLevelData).forEach(([level, data]) => {
    if (EDUCATIONAL_CATEGORIES.primary.includes(level)) {
      educationalCategories.primary += data.population;
    } else if (EDUCATIONAL_CATEGORIES.secondary.includes(level)) {
      educationalCategories.secondary += data.population;
    } else if (EDUCATIONAL_CATEGORIES.higher.includes(level)) {
      educationalCategories.higher += data.population;
    } else {
      educationalCategories.other += data.population;
    }
  });

  // Calculate educational scores
  const primaryPercentage = totalAbsenteePopulation > 0 ? (educationalCategories.primary / totalAbsenteePopulation) * 100 : 0;
  const secondaryPercentage = totalAbsenteePopulation > 0 ? (educationalCategories.secondary / totalAbsenteePopulation) * 100 : 0;
  const higherPercentage = totalAbsenteePopulation > 0 ? (educationalCategories.higher / totalAbsenteePopulation) * 100 : 0;
  const otherPercentage = totalAbsenteePopulation > 0 ? (educationalCategories.other / totalAbsenteePopulation) * 100 : 0;

  // Overall Education Score (0-100) - Based on educational attainment
  const overallEducationScore = (primaryPercentage * 0.3) + (secondaryPercentage * 0.5) + (higherPercentage * 0.8) + (otherPercentage * 0.2);

  // Literacy Score (0-100) - Based on basic education levels
  const literacyScore = (primaryPercentage * 0.6) + (secondaryPercentage * 0.8) + (higherPercentage * 0.9) + (otherPercentage * 0.3);

  // Skill Development Score (0-100) - Based on higher education levels
  const skillDevelopmentScore = (primaryPercentage * 0.2) + (secondaryPercentage * 0.5) + (higherPercentage * 0.9) + (otherPercentage * 0.4);

  // Human Capital Score (0-100) - Based on overall educational quality
  const humanCapitalScore = (primaryPercentage * 0.4) + (secondaryPercentage * 0.7) + (higherPercentage * 0.9) + (otherPercentage * 0.3);

  return {
    totalAbsenteePopulation,
    educationalLevelData,
    wardData,
    topEducationalLevels,
    educationalCategories,
    educationalScores: {
      overallEducationScore,
      literacyScore,
      skillDevelopmentScore,
      humanCapitalScore,
    },
  };
}

export function generateWardWiseAbsenteeEducationalLevelAnalysis(data: ProcessedWardWiseAbsenteeEducationalLevelData): string {
  if (data.totalAbsenteePopulation === 0) {
    return "विदेश गएका जनताको शैक्षिक स्तर सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary with detailed context
  analysisParts.push(
    `बुद्धशान्ति गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalAbsenteePopulation)} विदेश गएका जनता रहेका छन् जसमा विभिन्न शैक्षिक स्तरका जनताहरू समावेश छन्। यी तथ्याङ्कले गाउँपालिकाको मानव पूँजी, शैक्षिक विकास र आर्थिक अवसरहरूको स्तरको विस्तृत चित्र प्रस्तुत गर्दछ। विदेश गएका जनताको शैक्षिक स्तरले न केवल स्थानीय शैक्षिक विकास मात्र देखाउँछ तर मानव पूँजीको गुणस्तर, आर्थिक अवसरहरूको आकर्षण र विकासको दिशालाई पनि संकेत गर्दछ।`
  );

  // Top educational levels analysis
  if (data.topEducationalLevels.length > 0) {
    const topEducationalLevel = data.topEducationalLevels[0];
    analysisParts.push(
      `गाउँपालिकामा सबैभन्दा बढी विदेश गएका जनता ${topEducationalLevel.label} शैक्षिक स्तरका रहेका छन् जसमा ${convertToNepaliNumber(topEducationalLevel.population)} जनता (${formatNepaliPercentage(topEducationalLevel.percentage)}) समावेश छन्। यो प्रतिशतले गाउँपालिकाको शैक्षिक विकासको मुख्य प्रवृत्ति देखाउँछ। यस्तो शैक्षिक स्तरको उच्च प्रतिशतले स्थानीय शैक्षिक प्रणालीको गुणस्तर र मानव पूँजीको विकासको स्तर देखाउँछ। यसले गाउँपालिकाको आर्थिक विकास र वैश्विक बजारमा प्रतिस्पर्धाको स्तर पनि संकेत गर्दछ।`
    );

    if (data.topEducationalLevels.length > 1) {
      const secondEducationalLevel = data.topEducationalLevels[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondEducationalLevel.label} शैक्षिक स्तरका जनता रहेका छन् जसमा ${convertToNepaliNumber(secondEducationalLevel.population)} जनता (${formatNepaliPercentage(secondEducationalLevel.percentage)}) समावेश छन्। यी दुई प्रकारका शैक्षिक स्तर मिलेर गाउँपालिकाको कुल विदेश गएका जनताको ${formatNepaliPercentage(topEducationalLevel.percentage + secondEducationalLevel.percentage)} भाग ओगटेका छन् जसले स्थानीय शैक्षिक विकासको मुख्य प्रवृत्ति देखाउँछ। यस्ता शैक्षिक स्तरहरूको उपस्थिति स्थानीय शैक्षिक प्रणालीको गुणस्तर र मानव पूँजीको विकासको स्तर देखाउँछ। यसले गाउँपालिकाको आर्थिक विकास र वैश्विक बजारमा प्रतिस्पर्धाको स्तर पनि संकेत गर्दछ।`
      );
    }
  }

  // Educational categories analysis
  const categories = data.educationalCategories;
  const totalInCategories = categories.primary + categories.secondary + categories.higher + categories.other;
  
  if (totalInCategories > 0) {
    const primaryPercentage = (categories.primary / totalInCategories) * 100;
    const secondaryPercentage = (categories.secondary / totalInCategories) * 100;
    const higherPercentage = (categories.higher / totalInCategories) * 100;
    const otherPercentage = (categories.other / totalInCategories) * 100;

    analysisParts.push(
      `शैक्षिक वर्गीकरण अनुसार विश्लेषण गर्दा, प्राथमिक शिक्षा स्तरका जनता ${convertToNepaliNumber(categories.primary)} (${formatNepaliPercentage(primaryPercentage)}) रहेका छन् जसले स्थानीय शैक्षिक प्रणालीको आधारभूत स्तर देखाउँछ। माध्यमिक शिक्षा स्तरका जनता ${convertToNepaliNumber(categories.secondary)} (${formatNepaliPercentage(secondaryPercentage)}) रहेका छन् जसले शैक्षिक विकासको मध्यवर्ती स्तर देखाउँछ। उच्च शिक्षा स्तरका जनता ${convertToNepaliNumber(categories.higher)} (${formatNepaliPercentage(higherPercentage)}) रहेका छन् जसले मानव पूँजीको उच्च गुणस्तर देखाउँछ। अन्य शैक्षिक स्तरका जनता ${convertToNepaliNumber(categories.other)} (${formatNepaliPercentage(otherPercentage)}) रहेका छन् जसले विविध शैक्षिक पृष्ठभूमिको उपस्थिति देखाउँछ।`
    );
  }

  // Educational scores analysis
  const scores = data.educationalScores;
  analysisParts.push(
    `शैक्षिक गुणस्तर विश्लेषण अनुसार, समग्र शिक्षा स्कोर ${convertToNepaliNumber(Math.round(scores.overallEducationScore * 10) / 10)} रहेको छ (१०० मा) जसले गाउँपालिकाको समग्र शैक्षिक विकासको स्तर देखाउँछ। साक्षरता स्कोर ${convertToNepaliNumber(Math.round(scores.literacyScore * 10) / 10)} रहेको छ जसले आधारभूत शिक्षा र साक्षरताको स्तर मूल्याङ्कन गर्दछ। सीप विकास स्कोर ${convertToNepaliNumber(Math.round(scores.skillDevelopmentScore * 10) / 10)} रहेको छ जसले व्यावसायिक सीप र उच्च शिक्षाको स्तर देखाउँछ। मानव पूँजी स्कोर ${convertToNepaliNumber(Math.round(scores.humanCapitalScore * 10) / 10)} रहेको छ जसले समग्र मानव पूँजीको गुणस्तर र आर्थिक मूल्यलाई मूल्याङ्कन गर्दछ। यी स्कोरहरूले गाउँपालिकाको समग्र शैक्षिक विकास र मानव पूँजीको स्तर मूल्याङ्कन गर्न सहयोग गर्दछ।`
  );

  // Ward-wise detailed analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalAbsenteePopulation > max.totalAbsenteePopulation ? { wardNum, ...wardData } : max
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalAbsenteePopulation: 0, educationalLevels: {}, primaryEducationalLevel: '', primaryEducationalLevelPercentage: 0, educationalLevelCount: 0 });

    // Calculate ward educational scores
    const wardEducationalScores = wardEntries.map(([wardNum, wardData]) => {
      const wardPrimary = (wardData.educationalLevels['CLASS_1'] || 0) + (wardData.educationalLevels['CLASS_2'] || 0) + (wardData.educationalLevels['CLASS_3'] || 0) + (wardData.educationalLevels['CLASS_4'] || 0) + (wardData.educationalLevels['CLASS_5'] || 0);
      const wardSecondary = (wardData.educationalLevels['CLASS_6'] || 0) + (wardData.educationalLevels['CLASS_7'] || 0) + (wardData.educationalLevels['CLASS_8'] || 0) + (wardData.educationalLevels['CLASS_9'] || 0) + (wardData.educationalLevels['CLASS_10'] || 0) + (wardData.educationalLevels['SLC_LEVEL'] || 0) + (wardData.educationalLevels['CLASS_12_LEVEL'] || 0);
      const wardHigher = (wardData.educationalLevels['BACHELOR_LEVEL'] || 0) + (wardData.educationalLevels['MASTERS_LEVEL'] || 0) + (wardData.educationalLevels['PHD_LEVEL'] || 0);
      
      const wardPrimaryPercentage = wardData.totalAbsenteePopulation > 0 ? (wardPrimary / wardData.totalAbsenteePopulation) * 100 : 0;
      const wardSecondaryPercentage = wardData.totalAbsenteePopulation > 0 ? (wardSecondary / wardData.totalAbsenteePopulation) * 100 : 0;
      const wardHigherPercentage = wardData.totalAbsenteePopulation > 0 ? (wardHigher / wardData.totalAbsenteePopulation) * 100 : 0;
      
      const wardEducationScore = (wardPrimaryPercentage * 0.3) + (wardSecondaryPercentage * 0.5) + (wardHigherPercentage * 0.8);
      
      return { wardNum, wardData, wardEducationScore, wardHigherPercentage };
    });

    const bestEducationWard = wardEducationalScores.reduce((best, current) => 
      current.wardEducationScore > best.wardEducationScore ? current : best
    );

    analysisParts.push(
      `वडाको आधारमा विस्तृत विश्लेषण गर्दा, वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalAbsenteePopulation)} विदेश गएका जनता रहेका छन्। शैक्षिक गुणस्तरको दृष्टिकोणबाट हेर्दा, वडा नं. ${convertToNepaliNumber(parseInt(bestEducationWard.wardNum))} मा सबैभन्दा राम्रो शैक्षिक गुणस्तर रहेको छ जसको शिक्षा स्कोर ${convertToNepaliNumber(Math.round(bestEducationWard.wardEducationScore * 10) / 10)} रहेको छ। यस वडामा उच्च शिक्षा स्तरका जनता ${formatNepaliPercentage(bestEducationWard.wardHigherPercentage)} रहेका छन् जसले यस वडाको मानव पूँजीको उच्च गुणस्तर देखाउँछ। यसले यस वडाको आर्थिक विकास र वैश्विक बजारमा प्रतिस्पर्धाको स्तर पनि संकेत गर्दछ।`
    );
  }

  // Critical insights and recommendations
  analysisParts.push(
    `यी तथ्याङ्कले गाउँपालिकाको विदेश गएका जनताको शैक्षिक स्तर र मानव पूँजीको मूल्याङ्कन गर्न सहयोग गर्दछ। उच्च शैक्षिक स्तरको उच्च प्रतिशतले मानव पूँजीको उच्च गुणस्तर र आर्थिक अवसरहरूको आकर्षण देखाउँछ। न्यून शैक्षिक स्तर स्थानीय शैक्षिक प्रणालीमा सुधारको आवश्यकतालाई संकेत गर्दछ। यी तथ्याङ्कले शैक्षिक नीति र मानव पूँजी विकास योजनाहरूको निर्माणमा महत्त्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ।`
  );

  // Additional critical analysis
  if (scores.overallEducationScore < 50) {
    analysisParts.push(
      `समग्र शिक्षा स्कोर ${convertToNepaliNumber(Math.round(scores.overallEducationScore * 10) / 10)} रहेको छ जुन चिन्ताजनक स्तरमा रहेको छ। यसले गाउँपालिकाको शैक्षिक विकास र मानव पूँजीको न्यून स्तरलाई संकेत गर्दछ। यसको लागि व्यापक नीतिगत हस्तक्षेप, शैक्षिक सुधार कार्यक्रमहरू र मानव पूँजी विकास योजनाहरूको आवश्यकता रहेको छ। शिक्षा स्कोर सुधार गर्न शैक्षिक नीति, मानव पूँजी विकास कार्यक्रमहरू र आर्थिक विकास योजनाहरूको एकीकृत दृष्टिकोण आवश्यक रहेको छ। यसले गाउँपालिकाको समग्र शैक्षिक विकास र मानव पूँजीको स्तर सुनिश्चित गर्दछ।`
    );
  }

  analysisParts.push(
    `समग्र रूपमा, गाउँपालिकाको विदेश गएका जनताको शैक्षिक स्तर र मानव पूँजीमा सुधारका लागि नीतिगत हस्तक्षेप, शैक्षिक सुधार कार्यक्रमहरू र मानव पूँजी विकास योजनाहरूको आवश्यकता रहेको छ। यसले न केवल शैक्षिक विकास बढाउँछ तर गाउँपालिकाको समग्र आर्थिक विकास र वैश्विक प्रतिस्पर्धाको स्तर पनि सुनिश्चित गर्दछ। शैक्षिक नीति र मानव पूँजी विकास योजनाहरूमा यी तथ्याङ्कको प्रयोग गर्दै सामाजिक-आर्थिक समानता र शैक्षिक विकासलाई प्रवर्द्धन गर्न सकिन्छ। यसले गाउँपालिकाको भविष्यको विकास र मानव पूँजीको लागि मजबुत आधार तयार पार्दछ।`
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