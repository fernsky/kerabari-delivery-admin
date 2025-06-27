import type { AgeGroup, Gender } from "@/server/api/routers/profile/demographics/ward-age-wise-population.schema";

export interface AgeGenderData {
  id: string;
  wardNumber: number;
  ageGroup: AgeGroup;
  gender: Gender;
  population: number;
}

export interface ProcessedAgeGenderData {
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  otherPopulation: number;
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
  dependencyRatios: {
    childDependencyRatio: number;
    elderlyDependencyRatio: number;
    totalDependencyRatio: number;
    workingAgePopulation: number;
    childPopulation: number;
    elderlyPopulation: number;
  };
  demographicIndicators: {
    genderRatio: number;
    youthPopulation: number;
    youthPercentage: number;
    reproductiveAgeWomen: number;
    reproductiveWomenPercentage: number;
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

export function processAgeGenderData(rawData: AgeGenderData[]): ProcessedAgeGenderData {
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
  const uniqueWards = [...new Set(rawData.map(item => item.wardNumber))].sort((a, b) => a - b);
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
  let totalPopulation = 0;
  let malePopulation = 0;
  let femalePopulation = 0;
  let otherPopulation = 0;

  rawData.forEach(item => {
    const { ageGroup, gender, population, wardNumber } = item;
    
    totalPopulation += population;
    
    // Update totals by gender
    if (gender === 'MALE') {
      malePopulation += population;
      ageGroupData[ageGroup].male += population;
      wardData[wardNumber].male += population;
    } else if (gender === 'FEMALE') {
      femalePopulation += population;
      ageGroupData[ageGroup].female += population;
      wardData[wardNumber].female += population;
    } else {
      otherPopulation += population;
      ageGroupData[ageGroup].other += population;
      wardData[wardNumber].other += population;
    }

    ageGroupData[ageGroup].total += population;
    wardData[wardNumber].total += population;
  });

  // Calculate percentages
  const malePercentage = totalPopulation > 0 ? (malePopulation / totalPopulation) * 100 : 0;
  const femalePercentage = totalPopulation > 0 ? (femalePopulation / totalPopulation) * 100 : 0;
  const otherPercentage = totalPopulation > 0 ? (otherPopulation / totalPopulation) * 100 : 0;

  // Calculate age group percentages
  Object.keys(ageGroupData).forEach(ageGroup => {
    const group = ageGroupData[ageGroup as AgeGroup];
    group.percentage = totalPopulation > 0 ? (group.total / totalPopulation) * 100 : 0;
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

  // Calculate dependency ratios
  const dependencyRatios = calculateDependencyRatios(ageGroupData);
  
  // Calculate demographic indicators
  const demographicIndicators = calculateDemographicIndicators(
    ageGroupData,
    malePopulation,
    femalePopulation,
    totalPopulation
  );

  return {
    totalPopulation,
    malePopulation,
    femalePopulation,
    otherPopulation,
    malePercentage,
    femalePercentage,
    otherPercentage,
    ageGroupData,
    wardData,
    dependencyRatios,
    demographicIndicators
  };
}

function calculateDependencyRatios(ageGroupData: Record<AgeGroup, any>) {
  // Child population (0-14 years)
  const childPopulation = 
    ageGroupData.AGE_0_4.total +
    ageGroupData.AGE_5_9.total +
    ageGroupData.AGE_10_14.total;

  // Working age population (15-64 years)
  const workingAgePopulation = 
    ageGroupData.AGE_15_19.total +
    ageGroupData.AGE_20_24.total +
    ageGroupData.AGE_25_29.total +
    ageGroupData.AGE_30_34.total +
    ageGroupData.AGE_35_39.total +
    ageGroupData.AGE_40_44.total +
    ageGroupData.AGE_45_49.total +
    ageGroupData.AGE_50_54.total +
    ageGroupData.AGE_55_59.total +
    ageGroupData.AGE_60_64.total;

  // Elderly population (65+ years)
  const elderlyPopulation = 
    ageGroupData.AGE_65_69.total +
    ageGroupData.AGE_70_74.total +
    ageGroupData.AGE_75_AND_ABOVE.total;

  const childDependencyRatio = workingAgePopulation > 0 ? (childPopulation / workingAgePopulation) * 100 : 0;
  const elderlyDependencyRatio = workingAgePopulation > 0 ? (elderlyPopulation / workingAgePopulation) * 100 : 0;
  const totalDependencyRatio = childDependencyRatio + elderlyDependencyRatio;

  return {
    childDependencyRatio,
    elderlyDependencyRatio,
    totalDependencyRatio,
    workingAgePopulation,
    childPopulation,
    elderlyPopulation
  };
}

function calculateDemographicIndicators(
  ageGroupData: Record<AgeGroup, any>,
  malePopulation: number,
  femalePopulation: number,
  totalPopulation: number
) {
  // Gender ratio (males per 100 females)
  const genderRatio = femalePopulation > 0 ? (malePopulation / femalePopulation) * 100 : 0;

  // Youth population (15-39 years)
  const youthPopulation = 
    ageGroupData.AGE_15_19.total +
    ageGroupData.AGE_20_24.total +
    ageGroupData.AGE_25_29.total +
    ageGroupData.AGE_30_34.total +
    ageGroupData.AGE_35_39.total;

  const youthPercentage = totalPopulation > 0 ? (youthPopulation / totalPopulation) * 100 : 0;

  // Reproductive age women (15-49 years)
  const reproductiveAgeWomen = 
    ageGroupData.AGE_15_19.female +
    ageGroupData.AGE_20_24.female +
    ageGroupData.AGE_25_29.female +
    ageGroupData.AGE_30_34.female +
    ageGroupData.AGE_35_39.female +
    ageGroupData.AGE_40_44.female +
    ageGroupData.AGE_45_49.female;

  const reproductiveWomenPercentage = femalePopulation > 0 ? (reproductiveAgeWomen / femalePopulation) * 100 : 0;

  return {
    genderRatio,
    youthPopulation,
    youthPercentage,
    reproductiveAgeWomen,
    reproductiveWomenPercentage
  };
}

export function generateAgeGenderAnalysis(data: ProcessedAgeGenderData): string {
  const {
    totalPopulation,
    malePopulation,
    femalePopulation,
    malePercentage,
    femalePercentage,
    dependencyRatios,
    demographicIndicators,
    wardData
  } = data;

  const analysisPoints: string[] = [];

  // Overall demographic overview
  analysisPoints.push(
    `बुद्धशान्ति गाउँपालिकामा रहेका कुल ${convertToNepaliNumber(totalPopulation)} जनसंख्या मध्ये ` +
    `${convertToNepaliNumber(malePopulation)} पुरुष (${formatNepaliPercentage(malePercentage)}) र ` +
    `${convertToNepaliNumber(femalePopulation)} जना महिला (${formatNepaliPercentage(femalePercentage)}) जनसंख्या रहेका छन् ।`
  );

  // Gender ratio analysis
  const genderRatio = demographicIndicators.genderRatio;
  let genderAnalysis = "";
  if (genderRatio > 103) {
    genderAnalysis = "पुरुषको बाहुल्यता रहेको";
  } else if (genderRatio < 97) {
    genderAnalysis = "महिलाको बाहुल्यता रहेको";
  } else {
    genderAnalysis = "लिङ्गीय सन्तुलन रहेको";
  }

  analysisPoints.push(
    `लिङ्गीय अनुपातका आधारमा हेर्दा प्रति सय महिलामा ${convertToNepaliNumber(Math.round(genderRatio))} पुरुष रहेका छन्, ` +
    `जसले गाउँपालिकामा ${genderAnalysis} देखाउँछ ।`
  );

  // Youth population analysis
  analysisPoints.push(
    `युवा उमेरको (१५ देखि ३९ वर्ष) जनसंख्या ${convertToNepaliNumber(demographicIndicators.youthPopulation)} ` +
    `(${formatNepaliPercentage(demographicIndicators.youthPercentage)}) रहेको छ, जसले जनसंख्याको लाभांशको संकेत गर्दछ ।`
  );

  // Reproductive age women analysis
  analysisPoints.push(
    `प्रजनन उमेरका महिलाहरू (१५ देखि ४९ वर्ष) ${convertToNepaliNumber(demographicIndicators.reproductiveAgeWomen)} ` +
    `(${formatNepaliPercentage(demographicIndicators.reproductiveWomenPercentage)}) रहेका छन्, ` +
    `जसले प्रजनन स्वास्थ्य सेवाको आवश्यकतालाई जनाउँछ ।`
  );

  // Dependency ratio analysis
  analysisPoints.push(
    `निर्भरता अनुपातका आधारमा हेर्दा बाल निर्भरता अनुपात ${formatNepaliPercentage(dependencyRatios.childDependencyRatio)} र ` +
    `वृद्ध निर्भरता अनुपात ${formatNepaliPercentage(dependencyRatios.elderlyDependencyRatio)} रहेको छ । ` +
    `कुल निर्भरता अनुपात ${formatNepaliPercentage(dependencyRatios.totalDependencyRatio)} रहेको छ ।`
  );

  // Ward-wise analysis summary
  const wardCount = Object.keys(wardData).length;
  analysisPoints.push(
    `गाउँपालिकाका ${convertToNepaliNumber(wardCount)} वटा वडाहरूमा जनसंख्याको वितरण फरक फरक रहेको छ । ` +
    `प्रत्येक वडामा लिङ्गीय संरचना र उमेर समूहको वितरणमा भिन्नता देखिन्छ ।`
  );

  // Policy recommendations
  analysisPoints.push(
    "उमेर समूह अनुसार हेर्दा १५ देखि ३९ वर्ष उमेर समूह भित्रका किशोरी र महिलाहरूको जनसंख्यामा र " +
    "उमेर पुगेका महिलाहरूको शारीरिक, मानसिक, सामाजिक तथा आर्थिक मुद्दाहरूलाई सम्बोधन गर्ने प्रकारको " +
    "योजनाहरू निर्माण गर्नु जरुरी छ ।"
  );

  // Women's health and rights
  analysisPoints.push(
    "प्रजनन स्वास्थ्य, यौन स्वास्थ्य, रजस्वला सम्बन्धी समस्याहरू, महिला मैत्री शौचालय, परामर्श केन्द्रहरू, " +
    "महिला हिंसा, छाउपडी प्रथा, घरेलु लैङ्गिक हिंसा, पाठेघर खस्ने समस्या, दाइजो प्रथा, बाल विवाह, " +
    "महिला सशक्तिकरण तथा अधिकार जस्ता विषयहरू आम महिलाका लागि प्रमुख तथा संवेदनशील विषय भएकाले " +
    "गाउँपालिकाले यी विषयहरूको प्रभावकारी योजना निर्माण गरी कार्यान्वयन गर्नुपर्ने संकेत समग्र तथ्याङ्कले गर्दछ ।"
  );

  return analysisPoints.join(' ');
} 