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
    totalPopulation: number;
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
    population: number;
    percentage: number;
    label: string;
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
  if (!rawData || rawData.length === 0) {
    return {
      totalPopulation: 0,
      malePopulation: 0,
      femalePopulation: 0,
      otherPopulation: 0,
      malePercentage: 0,
      femalePercentage: 0,
      otherPercentage: 0,
      ageGroupData: {} as any,
      wardData: {},
      detailedWardData: {},
      topAgeGroups: [],
      dependencyRatios: {
        childDependencyRatio: 0,
        elderlyDependencyRatio: 0,
        totalDependencyRatio: 0,
        workingAgePopulation: 0,
        childPopulation: 0,
        elderlyPopulation: 0
      },
      demographicIndicators: {
        genderRatio: 0,
        youthPopulation: 0,
        youthPercentage: 0,
        reproductiveAgeWomen: 0,
        reproductiveWomenPercentage: 0
      }
    };
  }

  // Calculate total population
  const totalPopulation = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process gender data
  const malePopulation = rawData
    .filter(item => item.gender === 'MALE')
    .reduce((sum, item) => sum + (item.population || 0), 0);
  
  const femalePopulation = rawData
    .filter(item => item.gender === 'FEMALE')
    .reduce((sum, item) => sum + (item.population || 0), 0);
  
  const otherPopulation = rawData
    .filter(item => item.gender === 'OTHER')
    .reduce((sum, item) => sum + (item.population || 0), 0);

  const malePercentage = totalPopulation > 0 ? (malePopulation / totalPopulation) * 100 : 0;
  const femalePercentage = totalPopulation > 0 ? (femalePopulation / totalPopulation) * 100 : 0;
  const otherPercentage = totalPopulation > 0 ? (otherPopulation / totalPopulation) * 100 : 0;

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
    group.percentage = totalPopulation > 0 ? (group.total / totalPopulation) * 100 : 0;
  });

  // Get top age groups
  const topAgeGroups = Object.entries(ageGroupData)
    .filter(([_, data]) => data.total > 0)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 5)
    .map(([ageGroup, data], index) => ({
      ageGroup,
      population: data.total,
      percentage: data.percentage,
      label: data.label
    }));

  // Process ward data with detailed breakdown
  const wardData: Record<number, any> = {};
  const detailedWardData: Record<number, Record<AgeGroup, Record<Gender, number>>> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalPopulation = wardItems.reduce((sum, item) => sum + (item.population || 0), 0);
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
    const primaryGenderPercentage = wardTotalPopulation > 0 
      ? (sortedWardGenders[0]?.[1] || 0) / wardTotalPopulation * 100 
      : 0;

    wardData[wardNum] = {
      totalPopulation: wardTotalPopulation,
      genders: wardGenders,
      primaryGender,
      primaryGenderPercentage,
      genderCount: Object.keys(wardGenders).length,
      ageGroups: wardAgeGroups
    };
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
    detailedWardData,
    topAgeGroups,
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
    otherPopulation,
    malePercentage,
    femalePercentage,
    otherPercentage,
    dependencyRatios,
    demographicIndicators,
    wardData,
    ageGroupData
  } = data;

  // Calculate median age estimation
  let cumulativePopulation = 0;
  let medianAgeGroup = "";
  const halfPopulation = totalPopulation / 2;

  for (const [ageGroup, data] of Object.entries(ageGroupData)) {
    cumulativePopulation += data.total;
    if (cumulativePopulation >= halfPopulation && !medianAgeGroup) {
      medianAgeGroup = ageGroup;
      break;
    }
  }

  // Helper function to estimate median age from age group
  const getMedianAgeEstimate = (ageGroup: string): number => {
    switch (ageGroup) {
      case "AGE_0_4": return 2.5;
      case "AGE_5_9": return 7.5;
      case "AGE_10_14": return 12.5;
      case "AGE_15_19": return 17.5;
      case "AGE_20_24": return 22.5;
      case "AGE_25_29": return 27.5;
      case "AGE_30_34": return 32.5;
      case "AGE_35_39": return 37.5;
      case "AGE_40_44": return 42.5;
      case "AGE_45_49": return 47.5;
      case "AGE_50_54": return 52.5;
      case "AGE_55_59": return 57.5;
      case "AGE_60_64": return 62.5;
      case "AGE_65_69": return 67.5;
      case "AGE_70_74": return 72.5;
      case "AGE_75_AND_ABOVE": return 80;
      default: return 30;
    }
  };

  const medianAge = getMedianAgeEstimate(medianAgeGroup);

  // Gender analysis
  const genderRatio = demographicIndicators.genderRatio;
  let genderAnalysis = "";
  if (genderRatio > 103) {
    genderAnalysis = "पुरुषको बाहुल्यता रहेको";
  } else if (genderRatio < 97) {
    genderAnalysis = "महिलाको बाहुल्यता रहेको";
  } else {
    genderAnalysis = "लिङ्गीय सन्तुलन रहेको";
  }

  // Age structure analysis
  const childrenPopulation = dependencyRatios.childPopulation;
  const elderlyPopulation = dependencyRatios.elderlyPopulation;
  const workingAgePopulation = dependencyRatios.workingAgePopulation;

  const childrenPercentage = (childrenPopulation / totalPopulation) * 100;
  const elderlyPercentage = (elderlyPopulation / totalPopulation) * 100;
  const workingAgePercentage = (workingAgePopulation / totalPopulation) * 100;

  // Find largest age groups
  const sortedAgeGroups = Object.entries(ageGroupData)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 3);

  const wardCount = Object.keys(wardData).length;

  // Compose a comprehensive, verbose analysis in Nepali
  return (
    `केराबारी गाउँपालिकाको जनसंख्याको उमेर र लिङ्गीय संरचनाले जटिल जनसांख्यिकीय परिदृश्य प्रकट गर्दै सामाजिक र आर्थिक योजनाको लागि महत्त्वपूर्ण निहितार्थहरू प्रस्तुत गर्दछ । ` +
    `कुल जनसंख्या ${convertToNepaliNumber(totalPopulation)} रहेको छ, जसमा पुरुष जनसंख्या ${convertToNepaliNumber(malePopulation)} (${formatNepaliPercentage(malePercentage)}) र महिला जनसंख्या ${convertToNepaliNumber(femalePopulation)} (${formatNepaliPercentage(femalePercentage)}) रहेका छन् । ` +
    `${otherPopulation > 0 ? `अन्य लिङ्गीय श्रेणीका व्यक्तिहरू ${convertToNepaliNumber(otherPopulation)} (${formatNepaliPercentage(otherPercentage)}) रहेका छन्, जसले जनसांख्यिकीय रिपोर्टिङ्गमा समावेशिताको प्रतिबिम्ब देखाउँछ । ` : ''}` +
    `जनसंख्याको अनुमानित मध्यम उमेर लगभग ${convertToNepaliNumber(parseFloat(medianAge.toFixed(1)))} वर्ष रहेको छ, जसले ${medianAge < 30 ? 'अपेक्षाकृत युवा जनसंख्या र सम्भावित जनसांख्यिकीय लाभांशको अनुभव गर्दै रहेको' : 'जनसंख्या बुढो हुँदै गएको र बढ्दो सामाजिक र आर्थिक निर्भरता दबाबहरू देखिएको'} संकेत गर्दछ । ` +
    `बाल निर्भरता अनुपात ${formatNepaliPercentage(dependencyRatios.childDependencyRatio)} रहेको छ, जसले कार्यशील उमेर जनसंख्या (१५-६४ वर्ष) सापेक्ष बालबालिकाहरूको (०-१४ वर्ष) अनुपातलाई उजागर गर्दछ । ` +
    `वृद्ध निर्भरता अनुपात ${formatNepaliPercentage(dependencyRatios.elderlyDependencyRatio)} रहेको छ, जसले समाजको उत्पादक खण्डमा वृद्धवृद्धाहरूको (६५+ वर्ष) बोझलाई जनाउँछ । ` +
    `कुल निर्भरता अनुपात ${formatNepaliPercentage(dependencyRatios.totalDependencyRatio)} रहेको छ, जसले कार्यशील उमेर समूहमा समग्र आर्थिक दबाबलाई समाहित गर्दै प्रत्येक १०० कार्यशील उमेरका व्यक्तिमा लगभग ${convertToNepaliNumber(parseFloat(dependencyRatios.totalDependencyRatio.toFixed(1)))} निर्भर व्यक्ति रहेको संकेत गर्दछ । ` +
    `लिङ्गीय अनुपात प्रति १०० महिलामा ${convertToNepaliNumber(parseFloat(demographicIndicators.genderRatio.toFixed(1)))} पुरुष रहेको छ, जसले गाउँपालिकामा ${genderAnalysis} देखाउँछ र विवाह प्रवृत्ति र श्रम शक्ति सहभागितासम्मका दूरगामी सामाजिक निहितार्थहरू राख्न सक्छ । ` +
    `युवा जनसंख्या (१५-२९ वर्ष) ${convertToNepaliNumber(demographicIndicators.youthPopulation)} व्यक्ति रहेका छन्, जसले कुल जनसंख्याको ${formatNepaliPercentage(demographicIndicators.youthPercentage)} प्रतिनिधित्व गर्दै श्रम शक्ति योजना र शैक्षिक स्रोत आवंटनको लागि महत्त्वपूर्ण छ । ` +
    `प्रजनन उमेरका महिलाहरूको (१५-४९ वर्ष) संख्या ${convertToNepaliNumber(demographicIndicators.reproductiveAgeWomen)} रहेको छ, जसले जनसंख्याको ${formatNepaliPercentage(demographicIndicators.reproductiveWomenPercentage)} प्रतिनिधित्व गर्दै मातृत्व र बाल स्वास्थ्य सेवाहरूको लागि प्रमुख सूचक हो । ` +
    `उमेर समूह वितरणले देखाउँछ कि सबैभन्दा ठूला समूहहरू ${sortedAgeGroups.map(([ageGroup, data]) => `${data.label} (${convertToNepaliNumber(data.total)})`).join(', ')} रहेका छन्, जसले गाउँपालिकाको सामाजिक र आर्थिक प्राथमिकताहरूलाई थप आकार दिन्छन् । ` +
    `बाल जनसंख्या (०-१४ वर्ष) ${convertToNepaliNumber(childrenPopulation)} (${formatNepaliPercentage(childrenPercentage)}) रहेको छ, जसले शिक्षा, पोषण र बाल स्वास्थ्य सेवाहरूमा लगानीको आवश्यकतालाई जनाउँछ । ` +
    `कार्यशील उमेर जनसंख्या (१५-६४ वर्ष) ${convertToNepaliNumber(workingAgePopulation)} (${formatNepaliPercentage(workingAgePercentage)}) रहेको छ, जसले आर्थिक उत्पादकताको मुख्य आधार हो । ` +
    `वृद्ध जनसंख्या (६५+ वर्ष) ${convertToNepaliNumber(elderlyPopulation)} (${formatNepaliPercentage(elderlyPercentage)}) रहेको छ, जसले सामाजिक सुरक्षा र स्वास्थ्य सेवाहरूको आवश्यकतालाई जनाउँछ । ` +
    `गाउँपालिकाका ${convertToNepaliNumber(wardCount)} वटा वडाहरूमा जनसंख्याको वितरण फरक फरक रहेको छ, प्रत्येक वडामा लिङ्गीय संरचना र उमेर समूहको वितरणमा भिन्नता देखिन्छ । ` +
    `समग्र रूपमा जनसांख्यिकीय प्रोफाइल अवसर र चुनौतीहरू दुवैले चिन्हित छ: ठूलो युवा बल्कले प्रभावकारी रूपमा उपयोग गरिएमा आर्थिक वृद्धिको सम्भावना प्रदान गर्दछ, तर उच्च निर्भरता अनुपात र जनसंख्या बुढो हुँदै गएको संकेतहरूले स्थायी विकास र सामाजिक एकताको लागि स्वास्थ्य, शिक्षा र सामाजिक सुरक्षामा सक्रिय नीतिगत हस्तक्षेपहरू आवश्यक बनाउँछन् । ` +
    `युवा जनसंख्याको लाभ लिन र वृद्ध जनसंख्याको आवश्यकताहरू पूरा गर्न समग्र दृष्टिकोण आवश्यक छ, जसमा शिक्षा, स्वास्थ्य सेवा, रोजगारी अवसर र सामाजिक सुरक्षा कार्यक्रमहरू समावेश छन् ।`
  );
}