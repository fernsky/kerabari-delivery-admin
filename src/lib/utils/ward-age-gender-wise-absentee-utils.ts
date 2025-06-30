import { WardAgeGenderWiseAbsenteeData } from "@/server/api/routers/profile/demographics/ward-age-gender-wise-absentee.schema";

export interface ProcessedWardAgeGenderWiseAbsenteeData {
  totalAbsenteePopulation: number;
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
    totalAbsenteePopulation: number;
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
  absenteeScores: {
    overallAbsenteeScore: number;
    genderMobilityScore: number;
    economicOpportunityScore: number;
    demographicImpactScore: number;
  };
}

export const ABSENTEE_AGE_GROUP_LABELS: Record<string, string> = {
  AGE_0_4: "०-४ वर्ष",
  AGE_5_9: "५-९ वर्ष",
  AGE_10_14: "१०-१४ वर्ष",
  AGE_15_19: "१५-१९ वर्ष",
  AGE_20_24: "२०-२४ वर्ष",
  AGE_25_29: "२५-२९ वर्ष",
  AGE_30_34: "३०-३४ वर्ष",
  AGE_35_39: "३५-३९ वर्ष",
  AGE_40_44: "४०-४४ वर्ष",
  AGE_45_49: "४५-४९ वर्ष",
  AGE_50_AND_ABOVE: "५० वर्ष र माथि",
};

export const GENDER_LABELS: Record<string, string> = {
  MALE: "पुरुष",
  FEMALE: "महिला",
  OTHER: "अन्य",
};

export function processWardAgeGenderWiseAbsenteeData(rawData: WardAgeGenderWiseAbsenteeData[]): ProcessedWardAgeGenderWiseAbsenteeData {
  if (!rawData || rawData.length === 0) {
    return {
      totalAbsenteePopulation: 0,
      ageGroupData: {},
      genderData: {},
      wardData: {},
      topAgeGroups: [],
      topGenders: [],
      absenteeScores: {
        overallAbsenteeScore: 0,
        genderMobilityScore: 0,
        economicOpportunityScore: 0,
        demographicImpactScore: 0,
      },
    };
  }

  // Calculate total absentee population
  const totalAbsenteePopulation = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process age group data
  const ageGroupData: Record<string, any> = {};
  const allAgeGroups: Array<any> = [];

  // Group by age group
  const ageGroupMap = new Map<string, WardAgeGenderWiseAbsenteeData[]>();
  rawData.forEach(item => {
    const key = item.ageGroup;
    if (!ageGroupMap.has(key)) {
      ageGroupMap.set(key, []);
    }
    ageGroupMap.get(key)!.push(item);
  });

  ageGroupMap.forEach((items, ageGroup) => {
    const ageGroupTotal = items.reduce((sum, item) => sum + item.population, 0);
    const percentage = totalAbsenteePopulation > 0 ? (ageGroupTotal / totalAbsenteePopulation) * 100 : 0;
    
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
      label: ABSENTEE_AGE_GROUP_LABELS[ageGroup] || ageGroup,
      rank: 0,
      genders,
    };

    allAgeGroups.push({
      ageGroup,
      totalPopulation: ageGroupTotal,
      percentage,
      label: ABSENTEE_AGE_GROUP_LABELS[ageGroup] || ageGroup,
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
  const genderMap = new Map<string, WardAgeGenderWiseAbsenteeData[]>();
  rawData.forEach(item => {
    const key = item.gender;
    if (!genderMap.has(key)) {
      genderMap.set(key, []);
    }
    genderMap.get(key)!.push(item);
  });

  genderMap.forEach((items, gender) => {
    const genderTotal = items.reduce((sum, item) => sum + item.population, 0);
    const percentage = totalAbsenteePopulation > 0 ? (genderTotal / totalAbsenteePopulation) * 100 : 0;
    
    const ageGroups: Record<string, any> = {};
    items.forEach(item => {
      const ageGroupPercentage = genderTotal > 0 ? (item.population / genderTotal) * 100 : 0;
      ageGroups[item.ageGroup] = {
        population: item.population,
        percentage: ageGroupPercentage,
        label: ABSENTEE_AGE_GROUP_LABELS[item.ageGroup] || item.ageGroup,
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
    const wardTotalAbsenteePopulation = wardItems.reduce((sum, item) => sum + item.population, 0);
    
    // Group by age group for this ward
    const wardAgeGroups: Record<string, any> = {};
    const wardAgeGroupMap = new Map<string, WardAgeGenderWiseAbsenteeData[]>();
    
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
    const primaryAgeGroupPercentage = wardTotalAbsenteePopulation > 0 
      ? (sortedWardAgeGroups[0]?.[1]?.totalPopulation || 0) / wardTotalAbsenteePopulation * 100 
      : 0;

    wardData[wardNum] = {
      totalAbsenteePopulation: wardTotalAbsenteePopulation,
      ageGroups: wardAgeGroups,
      primaryAgeGroup,
      primaryAgeGroupPercentage,
    };
  });

  // Get top 5 age groups and genders
  const topAgeGroups = allAgeGroups.slice(0, 5);
  const topGenders = allGenders.slice(0, 5);

  // Calculate absentee scores
  const maleData = genderData['MALE'];
  const femaleData = genderData['FEMALE'];
  const otherData = genderData['OTHER'];

  const malePercentage = maleData?.percentage || 0;
  const femalePercentage = femaleData?.percentage || 0;
  const otherPercentage = otherData?.percentage || 0;

  // Calculate age group percentages for scoring
  const workingAgeGroups = ['AGE_15_19', 'AGE_20_24', 'AGE_25_29', 'AGE_30_34', 'AGE_35_39', 'AGE_40_44', 'AGE_45_49'];
  const workingAgePercentage = workingAgeGroups.reduce((sum, ageGroup) => {
    return sum + (ageGroupData[ageGroup]?.percentage || 0);
  }, 0);

  const youngAgeGroups = ['AGE_0_4', 'AGE_5_9', 'AGE_10_14'];
  const youngAgePercentage = youngAgeGroups.reduce((sum, ageGroup) => {
    return sum + (ageGroupData[ageGroup]?.percentage || 0);
  }, 0);

  const olderAgeGroups = ['AGE_50_AND_ABOVE'];
  const olderAgePercentage = olderAgeGroups.reduce((sum, ageGroup) => {
    return sum + (ageGroupData[ageGroup]?.percentage || 0);
  }, 0);

  // Overall Absentee Score (0-100) - Based on working age population
  const overallAbsenteeScore = (workingAgePercentage * 0.8) + (youngAgePercentage * 0.1) + (olderAgePercentage * 0.1);

  // Gender Mobility Score (0-100) - Balance between male and female mobility
  const genderBalance = 100 - Math.abs(malePercentage - femalePercentage);
  const genderMobilityScore = (genderBalance * 0.7) + (Math.min(malePercentage, femalePercentage) * 0.3);

  // Economic Opportunity Score (0-100) - Based on working age and gender distribution
  const economicOpportunityScore = (workingAgePercentage * 0.6) + (genderMobilityScore * 0.4);

  // Demographic Impact Score (0-100) - Impact on local demographics
  const demographicImpactScore = (workingAgePercentage * 0.5) + (genderMobilityScore * 0.3) + (youngAgePercentage * 0.2);

  return {
    totalAbsenteePopulation,
    ageGroupData,
    genderData,
    wardData,
    topAgeGroups,
    topGenders,
    absenteeScores: {
      overallAbsenteeScore,
      genderMobilityScore,
      economicOpportunityScore,
      demographicImpactScore,
    },
  };
}

export function generateWardAgeGenderWiseAbsenteeAnalysis(data: ProcessedWardAgeGenderWiseAbsenteeData): string {
  if (data.totalAbsenteePopulation === 0) {
    return "विदेश गएका जनताको उमेर र लिङ्ग सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary with detailed context
  analysisParts.push(
    `केराबारी गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalAbsenteePopulation)} विदेश गएका जनता रहेका छन् जसमा विभिन्न उमेर समूह र लिङ्गका जनताहरू समावेश छन्। यी तथ्याङ्कले गाउँपालिकाको विदेश गएका जनताको उमेर संरचना, लिङ्ग सन्तुलन र आर्थिक अवसरहरूको स्तरको विस्तृत चित्र प्रस्तुत गर्दछ। विदेश गएका जनताको वितरणले न केवल जनसंख्या संरचना मात्र देखाउँछ तर आर्थिक अवसरहरू, लिङ्ग समानता र विकासको दिशालाई पनि संकेत गर्दछ।`
  );

  // Top age groups analysis
  if (data.topAgeGroups.length > 0) {
    const topAgeGroup = data.topAgeGroups[0];
    analysisParts.push(
      `गाउँपालिकामा सबैभन्दा बढी विदेश गएका जनता ${topAgeGroup.label} उमेर समूहमा रहेका छन् जसमा ${convertToNepaliNumber(topAgeGroup.totalPopulation)} जनता (${formatNepaliPercentage(topAgeGroup.percentage)}) समावेश छन्। यो प्रतिशतले गाउँपालिकाको विदेश गएका जनताको उमेर संरचनाको मुख्य प्रवृत्ति देखाउँछ। यस्तो उमेर समूहको उच्च प्रतिशतले आर्थिक अवसरहरूको आकर्षण र काम गर्ने क्षमताको स्तर देखाउँछ। यसले गाउँपालिकाको आर्थिक विकास र वैश्विक बजारमा प्रतिस्पर्धाको स्तर पनि संकेत गर्दछ।`
    );

    if (data.topAgeGroups.length > 1) {
      const secondAgeGroup = data.topAgeGroups[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondAgeGroup.label} उमेर समूहका विदेश गएका जनता रहेका छन् जसमा ${convertToNepaliNumber(secondAgeGroup.totalPopulation)} जनता (${formatNepaliPercentage(secondAgeGroup.percentage)}) समावेश छन्। यी दुई प्रकारका उमेर समूह मिलेर गाउँपालिकाको कुल विदेश गएका जनताको ${formatNepaliPercentage(topAgeGroup.percentage + secondAgeGroup.percentage)} भाग ओगटेका छन् जसले विदेश गएका जनताको उमेर संरचनाको मुख्य प्रवृत्ति देखाउँछ। यस्ता उमेर समूहहरूको उपस्थिति आर्थिक अवसरहरूको आकर्षण र काम गर्ने क्षमताको स्तर देखाउँछ। यसले गाउँपालिकाको आर्थिक विकास र वैश्विक बजारमा प्रतिस्पर्धाको स्तर पनि संकेत गर्दछ।`
      );
    }
  }

  // Top genders analysis
  if (data.topGenders.length > 0) {
    const topGender = data.topGenders[0];
    analysisParts.push(
      `गाउँपालिकामा सबैभन्दा बढी विदेश गएका जनता ${topGender.label} लिङ्गका रहेका छन् जसमा ${convertToNepaliNumber(topGender.totalPopulation)} जनता (${formatNepaliPercentage(topGender.percentage)}) समावेश छन्। यो प्रतिशतले गाउँपालिकाको विदेश गएका जनताको लिङ्ग संरचनाको मुख्य प्रवृत्ति देखाउँछ। यस्तो लिङ्गको उच्च प्रतिशतले आर्थिक अवसरहरूको आकर्षण र लिङ्ग समानताको स्तर देखाउँछ। यसले गाउँपालिकाको आर्थिक विकास र लिङ्ग समानताको स्तर पनि संकेत गर्दछ।`
    );

    if (data.topGenders.length > 1) {
      const secondGender = data.topGenders[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondGender.label} लिङ्गका विदेश गएका जनता रहेका छन् जसमा ${convertToNepaliNumber(secondGender.totalPopulation)} जनता (${formatNepaliPercentage(secondGender.percentage)}) समावेश छन्। यी दुई प्रकारका लिङ्ग मिलेर गाउँपालिकाको कुल विदेश गएका जनताको ${formatNepaliPercentage(topGender.percentage + secondGender.percentage)} भाग ओगटेका छन् जसले विदेश गएका जनताको लिङ्ग संरचनाको मुख्य प्रवृत्ति देखाउँछ। यस्ता लिङ्गहरूको उपस्थिति आर्थिक अवसरहरूको आकर्षण र लिङ्ग समानताको स्तर देखाउँछ। यसले गाउँपालिकाको आर्थिक विकास र लिङ्ग समानताको स्तर पनि संकेत गर्दछ।`
      );
    }
  }

  // Absentee scores analysis
  const scores = data.absenteeScores;
  analysisParts.push(
    `विदेश गएका जनताको गुणस्तर विश्लेषण अनुसार, समग्र विदेश गएका जनता स्कोर ${convertToNepaliNumber(Math.round(scores.overallAbsenteeScore * 10) / 10)} रहेको छ (१०० मा) जसले गाउँपालिकाको विदेश गएका जनताको समग्र स्तर देखाउँछ। लिङ्ग गतिशीलता स्कोर ${convertToNepaliNumber(Math.round(scores.genderMobilityScore * 10) / 10)} रहेको छ जसले पुरुष र महिला बीचको गतिशीलतालाई मूल्याङ्कन गर्दछ। आर्थिक अवसर स्कोर ${convertToNepaliNumber(Math.round(scores.economicOpportunityScore * 10) / 10)} रहेको छ जसले आर्थिक अवसरहरूको आकर्षण र काम गर्ने क्षमताको स्तर देखाउँछ। जनसंख्या प्रभाव स्कोर ${convertToNepaliNumber(Math.round(scores.demographicImpactScore * 10) / 10)} रहेको छ जसले स्थानीय जनसंख्या संरचनामा पर्ने प्रभावलाई मूल्याङ्कन गर्दछ। यी स्कोरहरूले गाउँपालिकाको समग्र आर्थिक विकास र जनसंख्या संरचनाको स्तर मूल्याङ्कन गर्न सहयोग गर्दछ।`
  );

  // Ward-wise detailed analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalAbsenteePopulation > max.totalAbsenteePopulation ? { wardNum, ...wardData } : max
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalAbsenteePopulation: 0, ageGroups: {}, primaryAgeGroup: '', primaryAgeGroupPercentage: 0 });

    // Calculate ward absentee scores
    const wardAbsenteeScores = wardEntries.map(([wardNum, wardData]) => {
      let wardMale = 0;
      let wardFemale = 0;
      let wardOther = 0;

      Object.values(wardData.ageGroups).forEach((ageGroup: any) => {
        wardMale += ageGroup.genders['MALE'] || 0;
        wardFemale += ageGroup.genders['FEMALE'] || 0;
        wardOther += ageGroup.genders['OTHER'] || 0;
      });

      const wardMalePercentage = wardData.totalAbsenteePopulation > 0 ? (wardMale / wardData.totalAbsenteePopulation) * 100 : 0;
      const wardFemalePercentage = wardData.totalAbsenteePopulation > 0 ? (wardFemale / wardData.totalAbsenteePopulation) * 100 : 0;
      const wardOtherPercentage = wardData.totalAbsenteePopulation > 0 ? (wardOther / wardData.totalAbsenteePopulation) * 100 : 0;

      const wardGenderBalance = 100 - Math.abs(wardMalePercentage - wardFemalePercentage);
      const wardGenderMobilityScore = (wardGenderBalance * 0.7) + (Math.min(wardMalePercentage, wardFemalePercentage) * 0.3);

      return { wardNum, wardData, wardGenderMobilityScore, wardMalePercentage, wardFemalePercentage };
    });

    const bestGenderMobilityWard = wardAbsenteeScores.reduce((best, current) => 
      current.wardGenderMobilityScore > best.wardGenderMobilityScore ? current : best
    );

    analysisParts.push(
      `वडाको आधारमा विस्तृत विश्लेषण गर्दा, वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalAbsenteePopulation)} विदेश गएका जनता रहेका छन्। लिङ्ग गतिशीलताको दृष्टिकोणबाट हेर्दा, वडा नं. ${convertToNepaliNumber(parseInt(bestGenderMobilityWard.wardNum))} मा सबैभन्दा राम्रो लिङ्ग गतिशीलता रहेको छ जसको गतिशीलता स्कोर ${convertToNepaliNumber(Math.round(bestGenderMobilityWard.wardGenderMobilityScore * 10) / 10)} रहेको छ। यस वडामा पुरुष विदेश गएका जनताको प्रतिशत ${formatNepaliPercentage(bestGenderMobilityWard.wardMalePercentage)} र महिला विदेश गएका जनताको प्रतिशत ${formatNepaliPercentage(bestGenderMobilityWard.wardFemalePercentage)} रहेको छ जसले यस वडाको लिङ्ग सन्तुलन र आर्थिक समानताको उच्च स्तर देखाउँछ। यसले यस वडाको आर्थिक विकास र लिङ्ग समानताको स्तर पनि संकेत गर्दछ।`
    );
  }

  // Critical insights and recommendations
  analysisParts.push(
    `यी तथ्याङ्कले गाउँपालिकाको विदेश गएका जनताको उमेर र लिङ्ग सन्तुलनको मूल्याङ्कन गर्न सहयोग गर्दछ। काम गर्ने उमेर समूहको उच्च प्रतिशतले आर्थिक अवसरहरूको आकर्षण र वैश्विक बजारमा प्रतिस्पर्धाको स्तर देखाउँछ। लिङ्ग सन्तुलनले आर्थिक समानता र विकासको स्तर देखाउँछ। कम उमेर समूहको उच्च प्रतिशत सामाजिक चुनौती र सुरक्षाको आवश्यकतालाई संकेत गर्दछ। यी तथ्याङ्कले आर्थिक नीति र विकास योजनाहरूको निर्माणमा महत्त्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ।`
  );

  // Additional critical analysis
  if (scores.overallAbsenteeScore < 50) {
    analysisParts.push(
      `समग्र विदेश गएका जनता स्कोर ${convertToNepaliNumber(Math.round(scores.overallAbsenteeScore * 10) / 10)} रहेको छ जुन चिन्ताजनक स्तरमा रहेको छ। यसले गाउँपालिकाको आर्थिक अवसरहरूको न्यून स्तर र विकासमा चुनौती रहेको देखाउँछ। यसको लागि व्यापक नीतिगत हस्तक्षेप, आर्थिक विकास कार्यक्रमहरू र रोजगारी सिर्जना योजनाहरूको आवश्यकता रहेको छ। विदेश गएका जनता स्कोर सुधार गर्न आर्थिक नीति, रोजगारी कार्यक्रमहरू र विकास योजनाहरूको एकीकृत दृष्टिकोण आवश्यक रहेको छ। यसले गाउँपालिकाको समग्र आर्थिक विकास र जनसंख्या सन्तुलनलाई सुनिश्चित गर्दछ।`
    );
  }

  if (scores.genderMobilityScore < 60) {
    analysisParts.push(
      `लिङ्ग गतिशीलता स्कोर ${convertToNepaliNumber(Math.round(scores.genderMobilityScore * 10) / 10)} रहेको छ जुन चिन्ताजनक स्तरमा रहेको छ। यसले गाउँपालिकाको लिङ्ग असमानता र आर्थिक चुनौती रहेको देखाउँछ। यसको लागि व्यापक नीतिगत हस्तक्षेप, लिङ्ग समानता कार्यक्रमहरू र आर्थिक सशक्तिकरण योजनाहरूको आवश्यकता रहेको छ। लिङ्ग गतिशीलता स्कोर सुधार गर्न लिङ्ग नीति, आर्थिक सशक्तिकरण कार्यक्रमहरू र रोजगारी योजनाहरूको एकीकृत दृष्टिकोण आवश्यक रहेको छ। यसले गाउँपालिकाको समग्र आर्थिक विकास र लिङ्ग समानतालाई सुनिश्चित गर्दछ।`
    );
  }

  analysisParts.push(
    `समग्र रूपमा, गाउँपालिकाको विदेश गएका जनताको उमेर र लिङ्ग सन्तुलनमा सुधारका लागि नीतिगत हस्तक्षेप, आर्थिक विकास कार्यक्रमहरू र लिङ्ग समानता योजनाहरूको आवश्यकता रहेको छ। यसले न केवल आर्थिक विकास बढाउँछ तर गाउँपालिकाको समग्र जनसंख्या सन्तुलन र लिङ्ग समानता पनि सुनिश्चित गर्दछ। आर्थिक नीति र विकास योजनाहरूमा यी तथ्याङ्कको प्रयोग गर्दै सामाजिक-आर्थिक समानता र आर्थिक विकासलाई प्रवर्द्धन गर्न सकिन्छ। यसले गाउँपालिकाको भविष्यको विकास र आर्थिक सुरक्षाको लागि मजबुत आधार तयार पार्दछ।`
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