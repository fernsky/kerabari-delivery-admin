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
  maleDeaths: number;
  femaleDeaths: number;
  otherDeaths: number;
  malePercentage: number;
  femalePercentage: number;
  otherPercentage: number;
  ageGroupData: Record<AgeGroup, {
    male: number;
    female: number;
    other: number;
    total: number;
    percentage: number;
    label: string;
  }>;
  wardData: Record<number, {
    male: number;
    female: number;
    other: number;
    total: number;
    malePercentage: number;
    femalePercentage: number;
    otherPercentage: number;
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

export function formatNepaliPercentage(num: number): string {
  return convertToNepaliNumber(parseFloat(num.toFixed(1))) + '%';
}

export function processDeathRegistrationData(rawData: DeathRegistrationData[]): ProcessedDeathRegistrationData {
  // Initialize data structures
  const ageGroupData: Record<AgeGroup, any> = {} as any;
  const wardData: Record<number, any> = {};

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

  // Initialize ward data
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  uniqueWards.forEach(wardNum => {
    wardData[wardNum] = {
      male: 0,
      female: 0,
      other: 0,
      total: 0,
      malePercentage: 0,
      femalePercentage: 0,
      otherPercentage: 0
    };
  });

  // Process raw data
  let totalDeaths = 0;
  let maleDeaths = 0;
  let femaleDeaths = 0;
  let otherDeaths = 0;

  rawData.forEach(item => {
    const { ageGroup, gender, population, wardNumber } = item;
    
    totalDeaths += population;
    
    // Update totals by gender
    if (gender === 'MALE') {
      maleDeaths += population;
      ageGroupData[ageGroup].male += population;
      wardData[wardNumber].male += population;
    } else if (gender === 'FEMALE') {
      femaleDeaths += population;
      ageGroupData[ageGroup].female += population;
      wardData[wardNumber].female += population;
    } else {
      otherDeaths += population;
      ageGroupData[ageGroup].other += population;
      wardData[wardNumber].other += population;
    }

    ageGroupData[ageGroup].total += population;
    wardData[wardNumber].total += population;
  });

  // Calculate percentages
  const malePercentage = totalDeaths > 0 ? (maleDeaths / totalDeaths) * 100 : 0;
  const femalePercentage = totalDeaths > 0 ? (femaleDeaths / totalDeaths) * 100 : 0;
  const otherPercentage = totalDeaths > 0 ? (otherDeaths / totalDeaths) * 100 : 0;

  // Calculate age group percentages
  Object.keys(ageGroupData).forEach(ageGroup => {
    const group = ageGroupData[ageGroup as AgeGroup];
    group.percentage = totalDeaths > 0 ? (group.total / totalDeaths) * 100 : 0;
  });

  // Calculate ward percentages
  Object.keys(wardData).forEach(wardNum => {
    const ward = wardData[parseInt(wardNum)];
    if (ward.total > 0) {
      ward.malePercentage = (ward.male / ward.total) * 100;
      ward.femalePercentage = (ward.female / ward.total) * 100;
      ward.otherPercentage = (ward.other / ward.total) * 100;
    }
  });

  // Calculate mortality indicators
  const mortalityIndicators = calculateMortalityIndicators(
    ageGroupData,
    wardData,
    totalDeaths
  );

  return {
    totalDeaths,
    maleDeaths,
    femaleDeaths,
    otherDeaths,
    malePercentage,
    femalePercentage,
    otherPercentage,
    ageGroupData,
    wardData,
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
    if (data.total > maxWardDeaths) {
      maxWardDeaths = data.total;
      mostAffectedWard = parseInt(wardNum);
    }
  });

  // Calculate age-specific death rates (assuming total population data is not available)
  const ageSpecificDeathRates: Record<AgeGroup, number> = {} as any;
  Object.keys(ageGroupData).forEach(ageGroup => {
    const group = ageGroupData[ageGroup as AgeGroup];
    // This would need total population data for accurate calculation
    ageSpecificDeathRates[ageGroup as AgeGroup] = group.total;
  });

  // Calculate gender-specific death rates from age group data
  const maleDeaths = Object.values(ageGroupData).reduce((sum, data) => sum + data.male, 0);
  const femaleDeaths = Object.values(ageGroupData).reduce((sum, data) => sum + data.female, 0);
  const otherDeaths = Object.values(ageGroupData).reduce((sum, data) => sum + data.other, 0);

  const genderSpecificDeathRates = {
    male: maleDeaths,
    female: femaleDeaths,
    other: otherDeaths
  };

  // Crude death rate (would need total population for accurate calculation)
  const crudeDeathRate = totalDeaths; // This is just the total deaths, not a rate

  return {
    crudeDeathRate,
    ageSpecificDeathRates,
    genderSpecificDeathRates,
    mostAffectedAgeGroup,
    mostAffectedWard
  };
}

export function generateDeathRegistrationAnalysis(data: ProcessedDeathRegistrationData): string {
  const {
    totalDeaths,
    maleDeaths,
    femaleDeaths,
    otherDeaths,
    malePercentage,
    femalePercentage,
    otherPercentage,
    mortalityIndicators,
    wardData,
    ageGroupData
  } = data;

  // Find largest age groups
  const sortedAgeGroups = Object.entries(ageGroupData)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 3);

  const wardCount = Object.keys(wardData).length;

  // Calculate gender ratio
  const genderRatio = femaleDeaths > 0 ? (maleDeaths / femaleDeaths) * 100 : 0;

  // Compose a comprehensive, verbose analysis in Nepali
  return (
    `बुद्धशान्ति गाउँपालिकाको मृत्यु दर्ता अनुसार जनसंख्याको विवरणले गाउँपालिकाको जनसांख्यिकीय परिदृश्य र स्वास्थ्य स्थितिको महत्त्वपूर्ण जानकारी प्रदान गर्दछ । ` +
    `कुल मृतक संख्या ${convertToNepaliNumber(totalDeaths)} रहेको छ, जसमा पुरुष मृतक ${convertToNepaliNumber(maleDeaths)} (${formatNepaliPercentage(malePercentage)}) र महिला मृतक ${convertToNepaliNumber(femaleDeaths)} (${formatNepaliPercentage(femalePercentage)}) रहेका छन् । ` +
    `${otherDeaths > 0 ? `अन्य लिङ्गीय श्रेणीका मृतकहरू ${convertToNepaliNumber(otherDeaths)} (${formatNepaliPercentage(otherPercentage)}) रहेका छन्, जसले मृत्यु दर्ता प्रक्रियामा समावेशिताको प्रतिबिम्ब देखाउँछ । ` : ''}` +
    `लिङ्ग अनुपात प्रति १०० महिलामा ${convertToNepaliNumber(parseFloat(genderRatio.toFixed(1)))} पुरुष मृतक रहेको छ, जसले गाउँपालिकामा ${genderRatio > 103 ? 'पुरुष मृतकको बाहुल्यता' : genderRatio < 97 ? 'महिला मृतकको बाहुल्यता' : 'लिङ्गीय सन्तुलन'} देखाउँछ र स्वास्थ्य सेवा र सामाजिक नीतिहरूको लागि महत्त्वपूर्ण निहितार्थ राख्न सक्छ । ` +
    `उमेर समूह वितरणले देखाउँछ कि सबैभन्दा धेरै मृतकहरू ${sortedAgeGroups.map(([ageGroup, data]) => `${data.label} (${convertToNepaliNumber(data.total)})`).join(', ')} समूहहरूमा रहेका छन्, जसले गाउँपालिकाको स्वास्थ्य चुनौतीहरू र आवश्यकताहरूलाई थप आकार दिन्छन् । ` +
    `सबैभन्दा धेरै मृतक भएको उमेर समूह ${AGE_GROUP_LABELS[mortalityIndicators.mostAffectedAgeGroup]} रहेको छ, जसले यस उमेर समूहमा विशेष स्वास्थ्य ध्यान र सेवाहरूको आवश्यकतालाई जनाउँछ । ` +
    `सबैभन्दा धेरै मृतक भएको वडा वडा नं. ${convertToNepaliNumber(mortalityIndicators.mostAffectedWard)} रहेको छ, जसले यस क्षेत्रमा स्वास्थ्य सेवा र सुविधाहरूको विशेष आवश्यकतालाई जनाउँछ । ` +
    `गाउँपालिकाका ${convertToNepaliNumber(wardCount)} वटा वडाहरूमा मृतक संख्याको वितरण फरक फरक रहेको छ, प्रत्येक वडामा लिङ्गीय संरचना र उमेर समूहको वितरणमा भिन्नता देखिन्छ । ` +
    `बाल मृतकहरूको (०-१४ वर्ष) संख्या ${convertToNepaliNumber(ageGroupData.AGE_0_4.total + ageGroupData.AGE_5_9.total + ageGroupData.AGE_10_14.total)} रहेको छ, जसले बाल स्वास्थ्य र पोषण कार्यक्रमहरूको आवश्यकतालाई जनाउँछ । ` +
    `कार्यशील उमेर मृतकहरूको (१५-६४ वर्ष) संख्या ${convertToNepaliNumber(
      ageGroupData.AGE_15_19.total + ageGroupData.AGE_20_24.total + ageGroupData.AGE_25_29.total + 
      ageGroupData.AGE_30_34.total + ageGroupData.AGE_35_39.total + ageGroupData.AGE_40_44.total + 
      ageGroupData.AGE_45_49.total + ageGroupData.AGE_50_54.total + ageGroupData.AGE_55_59.total + 
      ageGroupData.AGE_60_64.total
    )} रहेको छ, जसले आर्थिक उत्पादकता र श्रम शक्तिमा पर्ने प्रभावलाई जनाउँछ । ` +
    `वृद्ध मृतकहरूको (६५+ वर्ष) संख्या ${convertToNepaliNumber(
      ageGroupData.AGE_65_69.total + ageGroupData.AGE_70_74.total + ageGroupData.AGE_75_AND_ABOVE.total
    )} रहेको छ, जसले वृद्धावस्था स्वास्थ्य सेवा र सामाजिक सुरक्षा कार्यक्रमहरूको आवश्यकतालाई जनाउँछ । ` +
    `समग्र रूपमा मृत्यु दर्ता तथ्याङ्कले गाउँपालिकाको स्वास्थ्य स्थिति, सामाजिक आर्थिक अवस्था र विकास चुनौतीहरूको महत्त्वपूर्ण जानकारी प्रदान गर्दछ । ` +
    `यी तथ्याङ्कहरू स्वास्थ्य नीति निर्माण, सेवाहरूको प्राथमिकीकरण र सामाजिक कार्यक्रमहरूको योजना गर्न महत्त्वपूर्ण आधार प्रदान गर्दछन् । ` +
    `मृत्यु दर्ता प्रक्रियाको सुधार, स्वास्थ्य सचेतना कार्यक्रम र सामाजिक सुरक्षा उपायहरूको कार्यान्वयन गाउँपालिकाको समग्र विकास र जनसंख्या स्वास्थ्यको लागि आवश्यक छन् ।`
  );
} 