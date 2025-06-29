import type { AgeGroup, Gender } from "@/server/api/routers/profile/demographics/ward-age-wise-population.schema";

export interface DeathRegistrationData {
  id: string;
  wardNumber: number;
  ageGroup: AgeGroup;
  gender: Gender;
  population: number;
  ageGroupDisplay?: string;
  genderDisplay?: string;
}

export interface ProcessedDeathRegistrationData {
  totalDeaths: number;
  genderData: Record<string, {
    deaths: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  ageGroupData: Record<AgeGroup, {
    male: number;
    female: number;
    other: number;
    total: number;
    percentage: number;
    label: string;
  }>;
  wardData: Record<number, {
    totalDeaths: number;
    genders: Record<string, number>;
    primaryGender: string;
    primaryGenderPercentage: number;
    genderCount: number;
    ageGroups: Record<AgeGroup, {
      male: number;
      female: number;
      other: number;
      total: number;
    }>;
  }>;
  detailedWardData: Record<number, Record<AgeGroup, Record<Gender, number>>>;
  topAgeGroups: Array<{
    ageGroup: string;
    deaths: number;
    percentage: number;
    label: string;
  }>;
  mortalityIndicators: {
    crudeDeathRate: number;
    ageSpecificDeathRates: Record<AgeGroup, number>;
    genderSpecificDeathRates: {
      male: number;
      female: number;
      other: number;
    };
    mostAffectedAgeGroup: AgeGroup;
    mostAffectedWard: number;
  };
}

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
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
  AGE_50_54: "५०-५४ वर्ष",
  AGE_55_59: "५५-५९ वर्ष",
  AGE_60_64: "६०-६४ वर्ष",
  AGE_65_69: "६५-६९ वर्ष",
  AGE_70_74: "७०-७४ वर्ष",
  AGE_75_AND_ABOVE: "७५+ वर्ष"
};

export const GENDER_LABELS: Record<Gender, string> = {
  MALE: "पुरुष",
  FEMALE: "महिला",
  OTHER: "अन्य"
};

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits: Record<string, string> = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
  };
  
  return num.toString().replace(/[0-9]/g, (digit) => nepaliDigits[digit] || digit);
}

export function formatNepaliPercentage(percentage: number): string {
  return `${convertToNepaliNumber(Math.round(percentage * 10) / 10)}%`;
}

export function processDeathRegistrationData(rawData: DeathRegistrationData[]): ProcessedDeathRegistrationData {
  if (!rawData || rawData.length === 0) {
    return {
      totalDeaths: 0,
      genderData: {},
      ageGroupData: {} as any,
      wardData: {},
      detailedWardData: {},
      topAgeGroups: [],
      mortalityIndicators: {
        crudeDeathRate: 0,
        ageSpecificDeathRates: {} as any,
        genderSpecificDeathRates: { male: 0, female: 0, other: 0 },
        mostAffectedAgeGroup: 'AGE_0_4',
        mostAffectedWard: 1
      }
    };
  }

  // Calculate total deaths
  const totalDeaths = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process gender data
  const genderData: Record<string, any> = {};
  const allGenders: Array<any> = [];

  // Initialize gender data
  Object.keys(GENDER_LABELS).forEach(gender => {
    const genderDeaths = rawData
      .filter(item => item.gender === gender)
      .reduce((sum, item) => sum + (item.population || 0), 0);
    
    const percentage = totalDeaths > 0 ? (genderDeaths / totalDeaths) * 100 : 0;
    const genderInfo = {
      deaths: genderDeaths,
      percentage,
      label: GENDER_LABELS[gender as Gender],
      rank: 0
    };

    genderData[gender] = genderInfo;
    if (genderDeaths > 0) {
      allGenders.push({
        gender,
        ...genderInfo
      });
    }
  });

  // Sort genders by deaths and update ranks
  allGenders.sort((a, b) => b.deaths - a.deaths);
  allGenders.forEach((gender, index) => {
    genderData[gender.gender].rank = index + 1;
  });

  // Process age group data
  const ageGroupData: Record<AgeGroup, any> = {} as any;
  
  // Initialize age groups
  Object.keys(AGE_GROUP_LABELS).forEach(ageGroup => {
    ageGroupData[ageGroup as AgeGroup] = {
      male: 0,
      female: 0,
      other: 0,
      total: 0,
      percentage: 0,
      label: AGE_GROUP_LABELS[ageGroup as AgeGroup]
    };
  });

  // Populate age group data
  rawData.forEach(item => {
    const { ageGroup, gender, population } = item;
    
    if (gender === 'MALE') {
      ageGroupData[ageGroup].male += population || 0;
    } else if (gender === 'FEMALE') {
      ageGroupData[ageGroup].female += population || 0;
    } else {
      ageGroupData[ageGroup].other += population || 0;
    }
    
    ageGroupData[ageGroup].total += population || 0;
  });

  // Calculate age group percentages
  Object.keys(ageGroupData).forEach(ageGroup => {
    const group = ageGroupData[ageGroup as AgeGroup];
    group.percentage = totalDeaths > 0 ? (group.total / totalDeaths) * 100 : 0;
  });

  // Get top age groups
  const topAgeGroups = Object.entries(ageGroupData)
    .filter(([_, data]) => data.total > 0)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 5)
    .map(([ageGroup, data], index) => ({
      ageGroup,
      deaths: data.total,
      percentage: data.percentage,
      label: data.label
    }));

  // Process ward data with detailed breakdown
  const wardData: Record<number, any> = {};
  const detailedWardData: Record<number, Record<AgeGroup, Record<Gender, number>>> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalDeaths = wardItems.reduce((sum, item) => sum + (item.population || 0), 0);
    const wardGenders: Record<string, number> = {};
    const wardAgeGroups: Record<AgeGroup, any> = {} as any;
    
    // Initialize age groups for this ward
    Object.keys(AGE_GROUP_LABELS).forEach(ageGroup => {
      wardAgeGroups[ageGroup as AgeGroup] = {
        male: 0,
        female: 0,
        other: 0,
        total: 0
      };
    });
    
    // Initialize detailed ward data
    detailedWardData[wardNum] = {} as any;
    Object.keys(AGE_GROUP_LABELS).forEach(ageGroup => {
      detailedWardData[wardNum][ageGroup as AgeGroup] = {
        MALE: 0,
        FEMALE: 0,
        OTHER: 0
      } as any;
    });
    
    wardItems.forEach(item => {
      const gender = item.gender;
      const ageGroup = item.ageGroup;
      const population = item.population || 0;
      
      // Update gender totals
      if (wardGenders[gender]) {
        wardGenders[gender] += population;
      } else {
        wardGenders[gender] = population;
      }
      
      // Update age group totals
      if (gender === 'MALE') {
        wardAgeGroups[ageGroup].male += population;
      } else if (gender === 'FEMALE') {
        wardAgeGroups[ageGroup].female += population;
      } else {
        wardAgeGroups[ageGroup].other += population;
      }
      wardAgeGroups[ageGroup].total += population;
      
      // Update detailed ward data
      detailedWardData[wardNum][ageGroup][gender] += population;
    });

    // Find primary gender for this ward
    const sortedWardGenders = Object.entries(wardGenders).sort(([, a], [, b]) => b - a);
    const primaryGender = sortedWardGenders[0]?.[0] || '';
    const primaryGenderPercentage = wardTotalDeaths > 0 
      ? (sortedWardGenders[0]?.[1] || 0) / wardTotalDeaths * 100 
      : 0;

    wardData[wardNum] = {
      totalDeaths: wardTotalDeaths,
      genders: wardGenders,
      primaryGender,
      primaryGenderPercentage,
      genderCount: Object.keys(wardGenders).length,
      ageGroups: wardAgeGroups
    };
  });

  // Calculate mortality indicators
  const mortalityIndicators = calculateMortalityIndicators(
    ageGroupData,
    wardData,
    totalDeaths
  );

  return {
    totalDeaths,
    genderData,
    ageGroupData,
    wardData,
    detailedWardData,
    topAgeGroups,
    mortalityIndicators
  };
}

function calculateMortalityIndicators(
  ageGroupData: Record<AgeGroup, any>,
  wardData: Record<number, any>,
  totalDeaths: number
) {
  // Find most affected age group
  let mostAffectedAgeGroup: AgeGroup = 'AGE_0_4';
  let maxDeaths = 0;
  
  Object.entries(ageGroupData).forEach(([ageGroup, data]) => {
    if (data.total > maxDeaths) {
      maxDeaths = data.total;
      mostAffectedAgeGroup = ageGroup as AgeGroup;
    }
  });

  // Find most affected ward
  let mostAffectedWard = 1;
  let maxWardDeaths = 0;
  
  Object.entries(wardData).forEach(([wardNum, data]) => {
    if (data.totalDeaths > maxWardDeaths) {
      maxWardDeaths = data.totalDeaths;
      mostAffectedWard = parseInt(wardNum);
    }
  });

  // Calculate age-specific death rates
  const ageSpecificDeathRates: Record<AgeGroup, number> = {} as any;
  Object.keys(ageGroupData).forEach(ageGroup => {
    const group = ageGroupData[ageGroup as AgeGroup];
    ageSpecificDeathRates[ageGroup as AgeGroup] = group.total;
  });

  // Calculate gender-specific death rates
  const maleDeaths = Object.values(ageGroupData).reduce((sum, data) => sum + data.male, 0);
  const femaleDeaths = Object.values(ageGroupData).reduce((sum, data) => sum + data.female, 0);
  const otherDeaths = Object.values(ageGroupData).reduce((sum, data) => sum + data.other, 0);

  const genderSpecificDeathRates = {
    male: maleDeaths,
    female: femaleDeaths,
    other: otherDeaths
  };

  // Crude death rate
  const crudeDeathRate = totalDeaths;

  return {
    crudeDeathRate,
    ageSpecificDeathRates,
    genderSpecificDeathRates,
    mostAffectedAgeGroup,
    mostAffectedWard
  };
}

export function generateDeathRegistrationAnalysis(data: ProcessedDeathRegistrationData): string {
  if (data.totalDeaths === 0) {
    return "मृत्यु दर्ता सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary
  analysisParts.push(
    `बुद्धशान्ति गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalDeaths)} मृतक दर्ता भएका छन् जसले गाउँपालिकाको जनसांख्यिकीय परिदृश्य र स्वास्थ्य स्थितिको महत्त्वपूर्ण जानकारी प्रदान गर्दछ।`
  );

  // Gender distribution analysis
  const maleData = data.genderData['MALE'];
  const femaleData = data.genderData['FEMALE'];
  const otherData = data.genderData['OTHER'];

  if (maleData && femaleData) {
    const genderRatio = femaleData.deaths > 0 ? (maleData.deaths / femaleData.deaths) * 100 : 0;
    
    analysisParts.push(
      `लिङ्ग अनुसार वितरणमा पुरुष मृतक ${convertToNepaliNumber(maleData.deaths)} (${formatNepaliPercentage(maleData.percentage)}) र महिला मृतक ${convertToNepaliNumber(femaleData.deaths)} (${formatNepaliPercentage(femaleData.percentage)}) रहेका छन्। ` +
      `लिङ्ग अनुपात प्रति १०० महिलामा ${convertToNepaliNumber(parseFloat(genderRatio.toFixed(1)))} पुरुष मृतक रहेको छ, जसले गाउँपालिकामा ${genderRatio > 103 ? 'पुरुष मृतकको बाहुल्यता' : genderRatio < 97 ? 'महिला मृतकको बाहुल्यता' : 'लिङ्गीय सन्तुलन'} देखाउँछ।`
    );
  }

  if (otherData && otherData.deaths > 0) {
    analysisParts.push(
      `अन्य लिङ्गीय श्रेणीका मृतकहरू ${convertToNepaliNumber(otherData.deaths)} (${formatNepaliPercentage(otherData.percentage)}) रहेका छन्, जसले मृत्यु दर्ता प्रक्रियामा समावेशिताको प्रतिबिम्ब देखाउँछ।`
    );
  }

  // Age group analysis
  if (data.topAgeGroups.length > 0) {
    const topAgeGroupsText = data.topAgeGroups
      .map(group => `${group.label} (${convertToNepaliNumber(group.deaths)})`)
      .join(', ');
    
    analysisParts.push(
      `उमेर समूह वितरणले देखाउँछ कि सबैभन्दा धेरै मृतकहरू ${topAgeGroupsText} समूहहरूमा रहेका छन्, जसले गाउँपालिकाको स्वास्थ्य चुनौतीहरू र आवश्यकताहरूलाई थप आकार दिन्छन्।`
    );
  }

  // Most affected analysis
  const mostAffectedAgeGroup = AGE_GROUP_LABELS[data.mortalityIndicators.mostAffectedAgeGroup];
  const mostAffectedWard = data.mortalityIndicators.mostAffectedWard;
  
  analysisParts.push(
    `सबैभन्दा धेरै मृतक भएको उमेर समूह ${mostAffectedAgeGroup} रहेको छ, जसले यस उमेर समूहमा विशेष स्वास्थ्य ध्यान र सेवाहरूको आवश्यकतालाई जनाउँछ। ` +
    `सबैभन्दा धेरै मृतक भएको वडा वडा नं. ${convertToNepaliNumber(mostAffectedWard)} रहेको छ, जसले यस क्षेत्रमा स्वास्थ्य सेवा र सुविधाहरूको विशेष आवश्यकतालाई जनाउँछ।`
  );

  // Ward distribution analysis
  const wardCount = Object.keys(data.wardData).length;
  analysisParts.push(
    `गाउँपालिकाका ${convertToNepaliNumber(wardCount)} वटा वडाहरूमा मृतक संख्याको वितरण फरक फरक रहेको छ, प्रत्येक वडामा लिङ्गीय संरचना र उमेर समूहको वितरणमा भिन्नता देखिन्छ।`
  );

  // Child mortality analysis
  const childDeaths = (data.ageGroupData.AGE_0_4?.total || 0) + 
                     (data.ageGroupData.AGE_5_9?.total || 0) + 
                     (data.ageGroupData.AGE_10_14?.total || 0);
  
  if (childDeaths > 0) {
    analysisParts.push(
      `बाल मृतकहरूको (०-१४ वर्ष) संख्या ${convertToNepaliNumber(childDeaths)} रहेको छ, जसले बाल स्वास्थ्य र पोषण कार्यक्रमहरूको आवश्यकतालाई जनाउँछ।`
    );
  }

  // Working age mortality analysis
  const workingAgeDeaths = Object.entries(data.ageGroupData)
    .filter(([ageGroup]) => ['AGE_15_19', 'AGE_20_24', 'AGE_25_29', 'AGE_30_34', 'AGE_35_39', 'AGE_40_44', 'AGE_45_49', 'AGE_50_54', 'AGE_55_59', 'AGE_60_64'].includes(ageGroup))
    .reduce((sum, [, data]) => sum + data.total, 0);
  
  if (workingAgeDeaths > 0) {
    analysisParts.push(
      `कार्यशील उमेर मृतकहरूको (१५-६४ वर्ष) संख्या ${convertToNepaliNumber(workingAgeDeaths)} रहेको छ, जसले आर्थिक उत्पादकता र श्रम शक्तिमा पर्ने प्रभावलाई जनाउँछ।`
    );
  }

  // Elderly mortality analysis
  const elderlyDeaths = (data.ageGroupData.AGE_65_69?.total || 0) + 
                       (data.ageGroupData.AGE_70_74?.total || 0) + 
                       (data.ageGroupData.AGE_75_AND_ABOVE?.total || 0);
  
  if (elderlyDeaths > 0) {
    analysisParts.push(
      `वृद्ध मृतकहरूको (६५+ वर्ष) संख्या ${convertToNepaliNumber(elderlyDeaths)} रहेको छ, जसले वृद्धावस्था स्वास्थ्य सेवा र सामाजिक सुरक्षा कार्यक्रमहरूको आवश्यकतालाई जनाउँछ।`
    );
  }

  // Conclusion
  analysisParts.push(
    `समग्र रूपमा मृत्यु दर्ता तथ्याङ्कले गाउँपालिकाको स्वास्थ्य स्थिति, सामाजिक आर्थिक अवस्था र विकास चुनौतीहरूको महत्त्वपूर्ण जानकारी प्रदान गर्दछ। ` +
    `यी तथ्याङ्कहरू स्वास्थ्य नीति निर्माण, सेवाहरूको प्राथमिकीकरण र सामाजिक कार्यक्रमहरूको योजना गर्न महत्त्वपूर्ण आधार प्रदान गर्दछन्। ` +
    `मृत्यु दर्ता प्रक्रियाको सुधार, स्वास्थ्य सचेतना कार्यक्रम र सामाजिक सुरक्षा उपायहरूको कार्यान्वयन गाउँपालिकाको समग्र विकास र जनसंख्या स्वास्थ्यको लागि आवश्यक छन्।`
  );

  return analysisParts.join(' ');
} 