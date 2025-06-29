import { WardAgeGenderWiseMarriedAgeData } from "@/server/api/routers/profile/demographics/ward-age-gender-wise-married.age.schema";

export interface ProcessedWardAgeGenderWiseMarriedAgeData {
  totalPopulation: number;
  ageGroupData: Record<string, {
    totalPopulation: number;
    percentage: number;
    label: string;
    rank: number;
    genders: Record<string, {
      population: number;
      percentage: number;
      label: string;
    }>;
  }>;
  genderData: Record<string, {
    totalPopulation: number;
    percentage: number;
    label: string;
    rank: number;
    ageGroups: Record<string, {
      population: number;
      percentage: number;
      label: string;
    }>;
  }>;
  wardData: Record<number, {
    totalPopulation: number;
    ageGroups: Record<string, {
      totalPopulation: number;
      genders: Record<string, number>;
      primaryGender: string;
      primaryGenderPercentage: number;
    }>;
    primaryAgeGroup: string;
    primaryAgeGroupPercentage: number;
  }>;
  topAgeGroups: Array<{
    ageGroup: string;
    totalPopulation: number;
    percentage: number;
    label: string;
  }>;
  topGenders: Array<{
    gender: string;
    totalPopulation: number;
    percentage: number;
    label: string;
  }>;
  marriedAgeScores: {
    overallMarriageAgeScore: number;
    genderEqualityScore: number;
    socialMaturityScore: number;
    demographicHealthScore: number;
  };
}

export const MARRIED_AGE_GROUP_LABELS: Record<string, string> = {
  AGE_BELOW_15: "१५ वर्ष भन्दा कम",
  AGE_15_19: "१५-१९ वर्ष",
  AGE_20_24: "२०-२४ वर्ष",
  AGE_25_29: "२५-२९ वर्ष",
  AGE_30_34: "३०-३४ वर्ष",
  AGE_35_39: "३५-३९ वर्ष",
  AGE_40_AND_ABOVE: "४० वर्ष र माथि",
};

export const GENDER_LABELS: Record<string, string> = {
  MALE: "पुरुष",
  FEMALE: "महिला",
  OTHER: "अन्य",
};

export function processWardAgeGenderWiseMarriedAgeData(rawData: WardAgeGenderWiseMarriedAgeData[]): ProcessedWardAgeGenderWiseMarriedAgeData {
  if (!rawData || rawData.length === 0) {
    return {
      totalPopulation: 0,
      ageGroupData: {},
      genderData: {},
      wardData: {},
      topAgeGroups: [],
      topGenders: [],
      marriedAgeScores: {
        overallMarriageAgeScore: 0,
        genderEqualityScore: 0,
        socialMaturityScore: 0,
        demographicHealthScore: 0,
      },
    };
  }

  // Calculate total population
  const totalPopulation = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process age group data
  const ageGroupData: Record<string, any> = {};
  const allAgeGroups: Array<any> = [];

  // Group by age group
  const ageGroupMap = new Map<string, WardAgeGenderWiseMarriedAgeData[]>();
  rawData.forEach(item => {
    const key = item.ageGroup;
    if (!ageGroupMap.has(key)) {
      ageGroupMap.set(key, []);
    }
    ageGroupMap.get(key)!.push(item);
  });

  ageGroupMap.forEach((items, ageGroup) => {
    const ageGroupTotal = items.reduce((sum, item) => sum + item.population, 0);
    const percentage = totalPopulation > 0 ? (ageGroupTotal / totalPopulation) * 100 : 0;
    
    const genders: Record<string, any> = {};
    items.forEach(item => {
      const genderPercentage = ageGroupTotal > 0 ? (item.population / ageGroupTotal) * 100 : 0;
      genders[item.gender] = {
        population: item.population,
        percentage: genderPercentage,
        label: GENDER_LABELS[item.gender] || item.gender,
      };
    });

    ageGroupData[ageGroup] = {
      totalPopulation: ageGroupTotal,
      percentage,
      label: MARRIED_AGE_GROUP_LABELS[ageGroup] || ageGroup,
      rank: 0,
      genders,
    };

    allAgeGroups.push({
      ageGroup,
      totalPopulation: ageGroupTotal,
      percentage,
      label: MARRIED_AGE_GROUP_LABELS[ageGroup] || ageGroup,
    });
  });

  // Sort age groups by population
  allAgeGroups.sort((a, b) => b.totalPopulation - a.totalPopulation);
  allAgeGroups.forEach((ageGroup, index) => {
    ageGroupData[ageGroup.ageGroup].rank = index + 1;
  });

  // Process gender data
  const genderData: Record<string, any> = {};
  const allGenders: Array<any> = [];

  // Group by gender
  const genderMap = new Map<string, WardAgeGenderWiseMarriedAgeData[]>();
  rawData.forEach(item => {
    const key = item.gender;
    if (!genderMap.has(key)) {
      genderMap.set(key, []);
    }
    genderMap.get(key)!.push(item);
  });

  genderMap.forEach((items, gender) => {
    const genderTotal = items.reduce((sum, item) => sum + item.population, 0);
    const percentage = totalPopulation > 0 ? (genderTotal / totalPopulation) * 100 : 0;
    
    const ageGroups: Record<string, any> = {};
    items.forEach(item => {
      const ageGroupPercentage = genderTotal > 0 ? (item.population / genderTotal) * 100 : 0;
      ageGroups[item.ageGroup] = {
        population: item.population,
        percentage: ageGroupPercentage,
        label: MARRIED_AGE_GROUP_LABELS[item.ageGroup] || item.ageGroup,
      };
    });

    genderData[gender] = {
      totalPopulation: genderTotal,
      percentage,
      label: GENDER_LABELS[gender] || gender,
      rank: 0,
      ageGroups,
    };

    allGenders.push({
      gender,
      totalPopulation: genderTotal,
      percentage,
      label: GENDER_LABELS[gender] || gender,
    });
  });

  // Sort genders by population
  allGenders.sort((a, b) => b.totalPopulation - a.totalPopulation);
  allGenders.forEach((gender, index) => {
    genderData[gender.gender].rank = index + 1;
  });

  // Process ward data
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalPopulation = wardItems.reduce((sum, item) => sum + item.population, 0);
    
    // Group by age group for this ward
    const wardAgeGroups: Record<string, any> = {};
    const wardAgeGroupMap = new Map<string, WardAgeGenderWiseMarriedAgeData[]>();
    
    wardItems.forEach(item => {
      const key = item.ageGroup;
      if (!wardAgeGroupMap.has(key)) {
        wardAgeGroupMap.set(key, []);
      }
      wardAgeGroupMap.get(key)!.push(item);
    });

    wardAgeGroupMap.forEach((items, ageGroup) => {
      const ageGroupTotal = items.reduce((sum, item) => sum + item.population, 0);
      const genders: Record<string, number> = {};
      
      items.forEach(item => {
        genders[item.gender] = item.population;
      });

      // Find primary gender for this age group
      const sortedGenders = Object.entries(genders).sort(([, a], [, b]) => b - a);
      const primaryGender = sortedGenders[0]?.[0] || '';
      const primaryGenderPercentage = ageGroupTotal > 0 
        ? (sortedGenders[0]?.[1] || 0) / ageGroupTotal * 100 
        : 0;

      wardAgeGroups[ageGroup] = {
        totalPopulation: ageGroupTotal,
        genders,
        primaryGender,
        primaryGenderPercentage,
      };
    });

    // Find primary age group for this ward
    const sortedWardAgeGroups = Object.entries(wardAgeGroups).sort(([, a], [, b]) => b.totalPopulation - a.totalPopulation);
    const primaryAgeGroup = sortedWardAgeGroups[0]?.[0] || '';
    const primaryAgeGroupPercentage = wardTotalPopulation > 0 
      ? (sortedWardAgeGroups[0]?.[1]?.totalPopulation || 0) / wardTotalPopulation * 100 
      : 0;

    wardData[wardNum] = {
      totalPopulation: wardTotalPopulation,
      ageGroups: wardAgeGroups,
      primaryAgeGroup,
      primaryAgeGroupPercentage,
    };
  });

  // Get top 5 age groups and genders
  const topAgeGroups = allAgeGroups.slice(0, 5);
  const topGenders = allGenders.slice(0, 5);

  // Calculate married age scores
  const maleData = genderData['MALE'];
  const femaleData = genderData['FEMALE'];
  const otherData = genderData['OTHER'];

  const malePercentage = maleData?.percentage || 0;
  const femalePercentage = femaleData?.percentage || 0;
  const otherPercentage = otherData?.percentage || 0;

  // Calculate age group percentages for scoring
  const ageBelow15Percentage = ageGroupData['AGE_BELOW_15']?.percentage || 0;
  const age15_19Percentage = ageGroupData['AGE_15_19']?.percentage || 0;
  const age20_24Percentage = ageGroupData['AGE_20_24']?.percentage || 0;
  const age25_29Percentage = ageGroupData['AGE_25_29']?.percentage || 0;
  const age30_34Percentage = ageGroupData['AGE_30_34']?.percentage || 0;
  const age35_39Percentage = ageGroupData['AGE_35_39']?.percentage || 0;
  const age40AndAbovePercentage = ageGroupData['AGE_40_AND_ABOVE']?.percentage || 0;

  // Overall Marriage Age Score (0-100) - Higher scores for appropriate marriage ages
  const overallMarriageAgeScore = (ageBelow15Percentage * 0.1) + (age15_19Percentage * 0.3) + (age20_24Percentage * 0.7) + (age25_29Percentage * 0.9) + (age30_34Percentage * 0.8) + (age35_39Percentage * 0.6) + (age40AndAbovePercentage * 0.4);

  // Gender Equality Score (0-100) - Balance between male and female
  const genderBalance = 100 - Math.abs(malePercentage - femalePercentage);
  const genderEqualityScore = (genderBalance * 0.8) + (Math.min(malePercentage, femalePercentage) * 0.2);

  // Social Maturity Score (0-100) - Based on appropriate marriage ages
  const socialMaturityScore = (ageBelow15Percentage * 0.1) + (age15_19Percentage * 0.4) + (age20_24Percentage * 0.8) + (age25_29Percentage * 0.9) + (age30_34Percentage * 0.8) + (age35_39Percentage * 0.7) + (age40AndAbovePercentage * 0.5);

  // Demographic Health Score (0-100) - Overall demographic balance
  const ageDiversity = 100 - Math.max(ageBelow15Percentage, age15_19Percentage, age20_24Percentage, age25_29Percentage, age30_34Percentage, age35_39Percentage, age40AndAbovePercentage);
  const demographicHealthScore = (ageDiversity * 0.3) + (genderEqualityScore * 0.4) + (socialMaturityScore * 0.3);

  return {
    totalPopulation,
    ageGroupData,
    genderData,
    wardData,
    topAgeGroups,
    topGenders,
    marriedAgeScores: {
      overallMarriageAgeScore,
      genderEqualityScore,
      socialMaturityScore,
      demographicHealthScore,
    },
  };
}

export function generateWardAgeGenderWiseMarriedAgeAnalysis(data: ProcessedWardAgeGenderWiseMarriedAgeData): string {
  if (data.totalPopulation === 0) {
    return "विवाहित उमेर सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary with detailed context
  analysisParts.push(
    `बुद्धशान्ति गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalPopulation)} विवाहित जनता रहेका छन् जसमा विभिन्न उमेर समूह र लिङ्गका जनताहरू समावेश छन्। यी तथ्याङ्कले गाउँपालिकाको विवाहित जनताको उमेर संरचना, लिङ्ग सन्तुलन र सामाजिक परिपक्वताको स्तरको विस्तृत चित्र प्रस्तुत गर्दछ। विवाहित उमेरको वितरणले न केवल सामाजिक संरचना मात्र देखाउँछ तर सामाजिक परिपक्वता, लिङ्ग समानता र जनसंख्या स्वास्थ्यको स्तरलाई पनि संकेत गर्दछ।`
  );

  // Top age groups analysis
  if (data.topAgeGroups.length > 0) {
    const topAgeGroup = data.topAgeGroups[0];
    analysisParts.push(
      `गाउँपालिकामा सबैभन्दा बढी विवाहित जनता ${topAgeGroup.label} उमेर समूहमा रहेका छन् जसमा ${convertToNepaliNumber(topAgeGroup.totalPopulation)} जनता (${formatNepaliPercentage(topAgeGroup.percentage)}) समावेश छन्। यो प्रतिशतले गाउँपालिकाको विवाहित जनताको उमेर संरचनाको मुख्य प्रवृत्ति देखाउँछ। यस्तो उमेर समूहको उच्च प्रतिशतले सामाजिक परिपक्वता र विवाहको उपयुक्त उमेरको स्तर देखाउँछ। यसले गाउँपालिकाको सामाजिक विकास र परिवार संरचनाको स्तर पनि संकेत गर्दछ।`
    );

    if (data.topAgeGroups.length > 1) {
      const secondAgeGroup = data.topAgeGroups[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondAgeGroup.label} उमेर समूहका विवाहित जनता रहेका छन् जसमा ${convertToNepaliNumber(secondAgeGroup.totalPopulation)} जनता (${formatNepaliPercentage(secondAgeGroup.percentage)}) समावेश छन्। यी दुई प्रकारका उमेर समूह मिलेर गाउँपालिकाको कुल विवाहित जनताको ${formatNepaliPercentage(topAgeGroup.percentage + secondAgeGroup.percentage)} भाग ओगटेका छन् जसले विवाहित जनताको उमेर संरचनाको मुख्य प्रवृत्ति देखाउँछ। यस्ता उमेर समूहहरूको उपस्थिति सामाजिक परिपक्वता र विवाहको उपयुक्त उमेरको स्तर देखाउँछ। यसले गाउँपालिकाको सामाजिक विकास र परिवार संरचनाको स्तर पनि संकेत गर्दछ।`
      );
    }
  }

  // Top genders analysis
  if (data.topGenders.length > 0) {
    const topGender = data.topGenders[0];
    analysisParts.push(
      `गाउँपालिकामा सबैभन्दा बढी विवाहित जनता ${topGender.label} लिङ्गका रहेका छन् जसमा ${convertToNepaliNumber(topGender.totalPopulation)} जनता (${formatNepaliPercentage(topGender.percentage)}) समावेश छन्। यो प्रतिशतले गाउँपालिकाको विवाहित जनताको लिङ्ग संरचनाको मुख्य प्रवृत्ति देखाउँछ। यस्तो लिङ्गको उच्च प्रतिशतले सामाजिक संरचना र लिङ्ग सन्तुलनको स्तर देखाउँछ। यसले गाउँपालिकाको सामाजिक विकास र लिङ्ग समानताको स्तर पनि संकेत गर्दछ।`
    );

    if (data.topGenders.length > 1) {
      const secondGender = data.topGenders[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondGender.label} लिङ्गका विवाहित जनता रहेका छन् जसमा ${convertToNepaliNumber(secondGender.totalPopulation)} जनता (${formatNepaliPercentage(secondGender.percentage)}) समावेश छन्। यी दुई प्रकारका लिङ्ग मिलेर गाउँपालिकाको कुल विवाहित जनताको ${formatNepaliPercentage(topGender.percentage + secondGender.percentage)} भाग ओगटेका छन् जसले विवाहित जनताको लिङ्ग संरचनाको मुख्य प्रवृत्ति देखाउँछ। यस्ता लिङ्गहरूको उपस्थिति सामाजिक संरचना र लिङ्ग सन्तुलनको स्तर देखाउँछ। यसले गाउँपालिकाको सामाजिक विकास र लिङ्ग समानताको स्तर पनि संकेत गर्दछ।`
      );
    }
  }

  // Married age scores analysis
  const scores = data.marriedAgeScores;
  analysisParts.push(
    `विवाहित उमेरको गुणस्तर विश्लेषण अनुसार, समग्र विवाह उमेर स्कोर ${convertToNepaliNumber(Math.round(scores.overallMarriageAgeScore * 10) / 10)} रहेको छ (१०० मा) जसले गाउँपालिकाको विवाह उमेरको उपयुक्तताको स्तर देखाउँछ। लिङ्ग समानता स्कोर ${convertToNepaliNumber(Math.round(scores.genderEqualityScore * 10) / 10)} रहेको छ जसले पुरुष र महिला बीचको सन्तुलनलाई मूल्याङ्कन गर्दछ। सामाजिक परिपक्वता स्कोर ${convertToNepaliNumber(Math.round(scores.socialMaturityScore * 10) / 10)} रहेको छ जसले विवाहको उपयुक्त उमेर र सामाजिक परिपक्वताको स्तर देखाउँछ। जनसंख्या स्वास्थ्य स्कोर ${convertToNepaliNumber(Math.round(scores.demographicHealthScore * 10) / 10)} रहेको छ जसले समग्र जनसंख्या संरचना र स्वास्थ्यलाई मूल्याङ्कन गर्दछ। यी स्कोरहरूले गाउँपालिकाको समग्र सामाजिक संरचना र विकासको स्तर मूल्याङ्कन गर्न सहयोग गर्दछ।`
  );

  // Ward-wise detailed analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalPopulation > max.totalPopulation ? { wardNum, ...wardData } : max
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalPopulation: 0, ageGroups: {}, primaryAgeGroup: '', primaryAgeGroupPercentage: 0 });

    // Calculate ward marriage age scores
    const wardMarriageScores = wardEntries.map(([wardNum, wardData]) => {
      let wardMale = 0;
      let wardFemale = 0;
      let wardOther = 0;

      Object.values(wardData.ageGroups).forEach((ageGroup: any) => {
        wardMale += ageGroup.genders['MALE'] || 0;
        wardFemale += ageGroup.genders['FEMALE'] || 0;
        wardOther += ageGroup.genders['OTHER'] || 0;
      });

      const wardMalePercentage = wardData.totalPopulation > 0 ? (wardMale / wardData.totalPopulation) * 100 : 0;
      const wardFemalePercentage = wardData.totalPopulation > 0 ? (wardFemale / wardData.totalPopulation) * 100 : 0;
      const wardOtherPercentage = wardData.totalPopulation > 0 ? (wardOther / wardData.totalPopulation) * 100 : 0;

      const wardGenderBalance = 100 - Math.abs(wardMalePercentage - wardFemalePercentage);
      const wardGenderEqualityScore = (wardGenderBalance * 0.8) + (Math.min(wardMalePercentage, wardFemalePercentage) * 0.2);

      return { wardNum, wardData, wardGenderEqualityScore, wardMalePercentage, wardFemalePercentage };
    });

    const bestGenderEqualityWard = wardMarriageScores.reduce((best, current) => 
      current.wardGenderEqualityScore > best.wardGenderEqualityScore ? current : best
    );

    analysisParts.push(
      `वडाको आधारमा विस्तृत विश्लेषण गर्दा, वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalPopulation)} विवाहित जनता रहेका छन्। लिङ्ग समानताको दृष्टिकोणबाट हेर्दा, वडा नं. ${convertToNepaliNumber(parseInt(bestGenderEqualityWard.wardNum))} मा सबैभन्दा राम्रो लिङ्ग समानता रहेको छ जसको समानता स्कोर ${convertToNepaliNumber(Math.round(bestGenderEqualityWard.wardGenderEqualityScore * 10) / 10)} रहेको छ। यस वडामा पुरुष विवाहित जनताको प्रतिशत ${formatNepaliPercentage(bestGenderEqualityWard.wardMalePercentage)} र महिला विवाहित जनताको प्रतिशत ${formatNepaliPercentage(bestGenderEqualityWard.wardFemalePercentage)} रहेको छ जसले यस वडाको लिङ्ग सन्तुलन र सामाजिक समानताको उच्च स्तर देखाउँछ। यसले यस वडाको सामाजिक विकास र लिङ्ग समानताको स्तर पनि संकेत गर्दछ।`
    );
  }

  // Critical insights and recommendations
  analysisParts.push(
    `यी तथ्याङ्कले गाउँपालिकाको विवाहित उमेर र लिङ्ग सन्तुलनको मूल्याङ्कन गर्न सहयोग गर्दछ। उपयुक्त विवाह उमेरको उच्च प्रतिशतले सामाजिक परिपक्वता र परिवार संरचनाको उच्च स्तर देखाउँछ। लिङ्ग सन्तुलनले सामाजिक समानता र विकासको स्तर देखाउँछ। कम उमेरमा विवाहको उच्च प्रतिशत सामाजिक चुनौती र सुरक्षाको आवश्यकतालाई संकेत गर्दछ। यी तथ्याङ्कले सामाजिक नीति र विकास योजनाहरूको निर्माणमा महत्त्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ।`
  );

  // Additional critical analysis
  if (scores.overallMarriageAgeScore < 50) {
    analysisParts.push(
      `समग्र विवाह उमेर स्कोर ${convertToNepaliNumber(Math.round(scores.overallMarriageAgeScore * 10) / 10)} रहेको छ जुन चिन्ताजनक स्तरमा रहेको छ। यसले गाउँपालिकाको कम उमेरमा विवाहको उच्च दर र सामाजिक चुनौती रहेको देखाउँछ। यसको लागि व्यापक नीतिगत हस्तक्षेप, सामाजिक जनचेतना कार्यक्रमहरू र कानूनी सुरक्षा योजनाहरूको आवश्यकता रहेको छ। विवाह उमेर स्कोर सुधार गर्न सामाजिक नीति, शैक्षिक कार्यक्रमहरू र कानूनी सुरक्षा योजनाहरूको एकीकृत दृष्टिकोण आवश्यक रहेको छ। यसले गाउँपालिकाको समग्र सामाजिक विकास र सुरक्षालाई सुनिश्चित गर्दछ।`
    );
  }

  if (scores.genderEqualityScore < 60) {
    analysisParts.push(
      `लिङ्ग समानता स्कोर ${convertToNepaliNumber(Math.round(scores.genderEqualityScore * 10) / 10)} रहेको छ जुन चिन्ताजनक स्तरमा रहेको छ। यसले गाउँपालिकाको लिङ्ग असमानता र सामाजिक चुनौती रहेको देखाउँछ। यसको लागि व्यापक नीतिगत हस्तक्षेप, लिङ्ग समानता कार्यक्रमहरू र सामाजिक जनचेतना योजनाहरूको आवश्यकता रहेको छ। लिङ्ग समानता स्कोर सुधार गर्न लिङ्ग नीति, शैक्षिक कार्यक्रमहरू र सामाजिक जनचेतना योजनाहरूको एकीकृत दृष्टिकोण आवश्यक रहेको छ। यसले गाउँपालिकाको समग्र सामाजिक विकास र लिङ्ग समानतालाई सुनिश्चित गर्दछ।`
    );
  }

  analysisParts.push(
    `समग्र रूपमा, गाउँपालिकाको विवाहित उमेर र लिङ्ग सन्तुलनमा सुधारका लागि नीतिगत हस्तक्षेप, सामाजिक जनचेतना कार्यक्रमहरू र लिङ्ग समानता योजनाहरूको आवश्यकता रहेको छ। यसले न केवल सामाजिक विकास बढाउँछ तर गाउँपालिकाको समग्र सुरक्षा र लिङ्ग समानता पनि सुनिश्चित गर्दछ। सामाजिक नीति र विकास योजनाहरूमा यी तथ्याङ्कको प्रयोग गर्दै सामाजिक-आर्थिक समानता र सामाजिक विकासलाई प्रवर्द्धन गर्न सकिन्छ। यसले गाउँपालिकाको भविष्यको विकास र सामाजिक सुरक्षाको लागि मजबुत आधार तयार पार्दछ।`
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