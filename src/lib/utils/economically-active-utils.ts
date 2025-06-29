import { EconomicallyActiveAgeGroup, Gender } from "@/server/api/routers/profile/demographics/ward-age-wise-economically-active-population.schema";

export interface EconomicallyActiveData {
  id: string;
  wardNumber: number;
  ageGroup: EconomicallyActiveAgeGroup;
  gender: Gender;
  population: number;
  ageGroupDisplay?: string;
}

export interface ProcessedEconomicallyActiveData {
  totalEconomicallyActivePopulation: number;
  ageGroupData: Record<string, {
    population: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  wardData: Record<number, {
    totalEconomicallyActivePopulation: number;
    ageGroups: Record<string, number>;
    primaryAgeGroup: string;
    primaryAgeGroupPercentage: number;
  }>;
  economicIndicators: {
    workingAgePopulation: number;
    workingAgePercentage: number;
    dependencyRatio: number;
    laborForceParticipationRate: number;
    averageAgeGroup: string;
    mostProductiveAgeGroup: string;
    mostProductiveAgeGroupPopulation: number;
    mostProductiveAgeGroupPercentage: number;
  };
  ageGroupAnalysis: {
    youngWorkers: number;
    youngWorkersPercentage: number;
    primeWorkers: number;
    primeWorkersPercentage: number;
    olderWorkers: number;
    olderWorkersPercentage: number;
  };
}

export const ECONOMICALLY_ACTIVE_AGE_GROUP_LABELS: Record<string, string> = {
  AGE_0_TO_14: "०-१४ वर्ष",
  AGE_15_TO_59: "१५-५९ वर्ष",
  AGE_60_PLUS: "६०+ वर्ष",
};

// Function to normalize age group enum values
function normalizeAgeGroup(ageGroup: string): string {
  const normalized = ageGroup.toUpperCase();
  // Map to standard enum values
  const mapping: Record<string, string> = {
    'AGE_0_TO_14': 'AGE_0_TO_14',
    'AGE_15_TO_59': 'AGE_15_TO_59',
    'AGE_60_PLUS': 'AGE_60_PLUS',
    '0_TO_14': 'AGE_0_TO_14',
    '15_TO_59': 'AGE_15_TO_59',
    '60_PLUS': 'AGE_60_PLUS',
  };
  return mapping[normalized] || ageGroup;
}

// Function to get proper label for age group
function getAgeGroupLabel(ageGroup: string): string {
  const normalized = normalizeAgeGroup(ageGroup);
  return ECONOMICALLY_ACTIVE_AGE_GROUP_LABELS[normalized] || ECONOMICALLY_ACTIVE_AGE_GROUP_LABELS[ageGroup] || ageGroup;
}

export function processEconomicallyActiveData(rawData: EconomicallyActiveData[]): ProcessedEconomicallyActiveData {
  if (!rawData || rawData.length === 0) {
    return {
      totalEconomicallyActivePopulation: 0,
      ageGroupData: {},
      wardData: {},
      economicIndicators: {
        workingAgePopulation: 0,
        workingAgePercentage: 0,
        dependencyRatio: 0,
        laborForceParticipationRate: 0,
        averageAgeGroup: "",
        mostProductiveAgeGroup: "",
        mostProductiveAgeGroupPopulation: 0,
        mostProductiveAgeGroupPercentage: 0,
      },
      ageGroupAnalysis: {
        youngWorkers: 0,
        youngWorkersPercentage: 0,
        primeWorkers: 0,
        primeWorkersPercentage: 0,
        olderWorkers: 0,
        olderWorkersPercentage: 0,
      },
    };
  }

  // Debug: Log raw data for troubleshooting
  console.log("Raw economically active data:", rawData);

  // Debug: Log gender distribution
  const genderDistribution = rawData.reduce((acc, item) => {
    acc[item.gender] = (acc[item.gender] || 0) + item.population;
    return acc;
  }, {} as Record<string, number>);
  console.log("Gender distribution:", genderDistribution);

  // Calculate total economically active population
  const totalEconomicallyActivePopulation = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process age group data - aggregate by age group across all wards and genders
  const ageGroupAggregated: Record<string, number> = {};
  rawData.forEach((item) => {
    const ageGroup = normalizeAgeGroup(item.ageGroup);
    ageGroupAggregated[ageGroup] = (ageGroupAggregated[ageGroup] || 0) + (item.population || 0);
  });

  // Debug: Log aggregated data
  console.log("Age group aggregated data:", ageGroupAggregated);

  // Sort age groups by population and create age group data
  const sortedAgeGroups = Object.entries(ageGroupAggregated)
    .sort(([, a], [, b]) => b - a);

  const ageGroupData: Record<string, any> = {};
  sortedAgeGroups.forEach(([ageGroup, population], index) => {
    const percentage = totalEconomicallyActivePopulation > 0 ? (population / totalEconomicallyActivePopulation) * 100 : 0;
    ageGroupData[ageGroup] = {
      population,
      percentage,
      label: getAgeGroupLabel(ageGroup),
      rank: index + 1,
    };
  });

  // Process ward data - aggregate by age group and ward across all genders
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  // Debug: Log unique wards
  console.log("Unique wards:", uniqueWards);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalEconomicallyActivePopulation = wardItems.reduce((sum, item) => sum + item.population, 0);
    const wardAgeGroups: Record<string, number> = {};
    
    // Debug: Log ward items
    console.log(`Ward ${wardNum} items:`, wardItems);
    
    // Debug: Log ward gender distribution
    const wardGenderDistribution = wardItems.reduce((acc, item) => {
      acc[item.gender] = (acc[item.gender] || 0) + item.population;
      return acc;
    }, {} as Record<string, number>);
    console.log(`Ward ${wardNum} gender distribution:`, wardGenderDistribution);
    
    // Aggregate by age group for this ward (summing all genders)
    const wardAgeGroupAggregated: Record<string, number> = {};
    wardItems.forEach(item => {
      const normalizedAgeGroup = normalizeAgeGroup(item.ageGroup);
      wardAgeGroupAggregated[normalizedAgeGroup] = (wardAgeGroupAggregated[normalizedAgeGroup] || 0) + item.population;
    });

    // Copy aggregated data to wardAgeGroups
    Object.entries(wardAgeGroupAggregated).forEach(([ageGroup, population]) => {
      wardAgeGroups[ageGroup] = population;
    });

    // Debug: Log ward age groups
    console.log(`Ward ${wardNum} age groups:`, wardAgeGroups);

    // Find primary age group for this ward
    const sortedWardAgeGroups = Object.entries(wardAgeGroupAggregated).sort(([, a], [, b]) => b - a);
    const primaryAgeGroup = sortedWardAgeGroups[0]?.[0] || '';
    const primaryAgeGroupPercentage = wardTotalEconomicallyActivePopulation > 0 
      ? (sortedWardAgeGroups[0]?.[1] || 0) / wardTotalEconomicallyActivePopulation * 100 
      : 0;

    wardData[wardNum] = {
      totalEconomicallyActivePopulation: wardTotalEconomicallyActivePopulation,
      ageGroups: wardAgeGroups,
      primaryAgeGroup,
      primaryAgeGroupPercentage,
    };
  });

  // Debug: Log final ward data
  console.log("Final ward data:", wardData);

  // Calculate economic indicators
  const workingAgePopulation = ageGroupData.AGE_15_TO_59?.population || 0;
  const workingAgePercentage = totalEconomicallyActivePopulation > 0 ? (workingAgePopulation / totalEconomicallyActivePopulation) * 100 : 0;
  
  // Dependency ratio (non-working age / working age)
  const nonWorkingAgePopulation = (ageGroupData.AGE_0_TO_14?.population || 0) + (ageGroupData.AGE_60_PLUS?.population || 0);
  const dependencyRatio = workingAgePopulation > 0 ? (nonWorkingAgePopulation / workingAgePopulation) * 100 : 0;

  // Labor force participation rate (assuming this is the economically active population)
  const laborForceParticipationRate = workingAgePopulation > 0 ? (totalEconomicallyActivePopulation / workingAgePopulation) * 100 : 0;

  // Find most productive age group (15-59)
  const mostProductiveAgeGroup = "AGE_15_TO_59";
  const mostProductiveAgeGroupPopulation = ageGroupData.AGE_15_TO_59?.population || 0;
  const mostProductiveAgeGroupPercentage = totalEconomicallyActivePopulation > 0 ? (mostProductiveAgeGroupPopulation / totalEconomicallyActivePopulation) * 100 : 0;

  // Age group analysis
  const youngWorkers = ageGroupData.AGE_0_TO_14?.population || 0;
  const primeWorkers = ageGroupData.AGE_15_TO_59?.population || 0;
  const olderWorkers = ageGroupData.AGE_60_PLUS?.population || 0;

  const youngWorkersPercentage = totalEconomicallyActivePopulation > 0 ? (youngWorkers / totalEconomicallyActivePopulation) * 100 : 0;
  const primeWorkersPercentage = totalEconomicallyActivePopulation > 0 ? (primeWorkers / totalEconomicallyActivePopulation) * 100 : 0;
  const olderWorkersPercentage = totalEconomicallyActivePopulation > 0 ? (olderWorkers / totalEconomicallyActivePopulation) * 100 : 0;

  return {
    totalEconomicallyActivePopulation,
    ageGroupData,
    wardData,
    economicIndicators: {
      workingAgePopulation,
      workingAgePercentage,
      dependencyRatio,
      laborForceParticipationRate,
      averageAgeGroup: "AGE_15_TO_59", // Most common working age group
      mostProductiveAgeGroup,
      mostProductiveAgeGroupPopulation,
      mostProductiveAgeGroupPercentage,
    },
    ageGroupAnalysis: {
      youngWorkers,
      youngWorkersPercentage,
      primeWorkers,
      primeWorkersPercentage,
      olderWorkers,
      olderWorkersPercentage,
    },
  };
}

export function generateEconomicallyActiveAnalysis(data: ProcessedEconomicallyActiveData): string {
  if (data.totalEconomicallyActivePopulation === 0) {
    return "आर्थिक रूपले सक्रिय जनसंख्या सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary
  analysisParts.push(
    `गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalEconomicallyActivePopulation)} जना आर्थिक रूपले सक्रिय जनसंख्या रहेका छन्।`
  );

  // Working age population analysis
  const indicators = data.economicIndicators;
  analysisParts.push(
    `कार्यशील उमेर जनसंख्या (१५-५९ वर्ष) ${convertToNepaliNumber(indicators.workingAgePopulation)} जना रहेका छन्, जसले कुल आर्थिक रूपले सक्रिय जनसंख्याको ${formatNepaliPercentage(indicators.workingAgePercentage)} प्रतिनिधित्व गर्दछ।`
  );

  // Age group analysis
  const ageAnalysis = data.ageGroupAnalysis;
  analysisParts.push(
    `युवा कामदारहरू (०-१४ वर्ष) ${convertToNepaliNumber(ageAnalysis.youngWorkers)} जना (${formatNepaliPercentage(ageAnalysis.youngWorkersPercentage)}) रहेका छन्।`
  );

  analysisParts.push(
    `प्रमुख कामदारहरू (१५-५९ वर्ष) ${convertToNepaliNumber(ageAnalysis.primeWorkers)} जना (${formatNepaliPercentage(ageAnalysis.primeWorkersPercentage)}) रहेका छन्।`
  );

  analysisParts.push(
    `वृद्ध कामदारहरू (६०+ वर्ष) ${convertToNepaliNumber(ageAnalysis.olderWorkers)} जना (${formatNepaliPercentage(ageAnalysis.olderWorkersPercentage)}) रहेका छन्।`
  );

  // Most productive age group
  analysisParts.push(
    `सबैभन्दा उत्पादक उमेर समूह ${indicators.mostProductiveAgeGroup === 'AGE_15_TO_59' ? '१५-५९ वर्ष' : indicators.mostProductiveAgeGroup} रहेको छ, जसमा ${convertToNepaliNumber(indicators.mostProductiveAgeGroupPopulation)} जना (${formatNepaliPercentage(indicators.mostProductiveAgeGroupPercentage)}) रहेका छन्।`
  );

  // Dependency ratio analysis
  if (indicators.dependencyRatio > 0) {
    analysisParts.push(
      `आश्रितता अनुपात ${convertToNepaliNumber(parseFloat(indicators.dependencyRatio.toFixed(1)))}% रहेको छ, जसले कामदार उमेर समूहको कार्यभार देखाउँछ।`
    );
  }

  // Labor force participation rate
  if (indicators.laborForceParticipationRate > 0) {
    analysisParts.push(
      `श्रम शक्ति सहभागिता दर ${convertToNepaliNumber(parseFloat(indicators.laborForceParticipationRate.toFixed(1)))}% रहेको छ।`
    );
  }

  // Age group distribution analysis
  const sortedAgeGroups = Object.entries(data.ageGroupData)
    .sort(([, a], [, b]) => b.population - a.population);

  if (sortedAgeGroups.length > 0) {
    const topAgeGroups = sortedAgeGroups.slice(0, 3)
      .map(([ageGroup, data]) => `${data.label} (${convertToNepaliNumber(data.population)} जना, ${formatNepaliPercentage(data.percentage)})`)
      .join(', ');
    
    analysisParts.push(
      `उमेर समूह अनुसार सबैभन्दा ठूला समूहहरू ${topAgeGroups} रहेका छन्।`
    );
  }

  // Ward-wise analysis
  const wardEntries = Object.entries(data.wardData);
  if (wardEntries.length > 0) {
    const sortedWards = wardEntries.sort((a, b) => b[1].totalEconomicallyActivePopulation - a[1].totalEconomicallyActivePopulation);
    const highestWard = sortedWards[0];
    const lowestWard = sortedWards[sortedWards.length - 1];
    
    analysisParts.push(
      `वडा अनुसार हेर्दा, वडा ${convertToNepaliNumber(parseInt(highestWard[0]))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard[1].totalEconomicallyActivePopulation)} जना आर्थिक रूपले सक्रिय जनसंख्या रहेका छन्।`
    );

    if (lowestWard[0] !== highestWard[0]) {
      analysisParts.push(
        `सबैभन्दा कम वडा ${convertToNepaliNumber(parseInt(lowestWard[0]))} मा ${convertToNepaliNumber(lowestWard[1].totalEconomicallyActivePopulation)} जना आर्थिक रूपले सक्रिय जनसंख्या रहेका छन्।`
      );
    }
  }

  // Economic implications
  analysisParts.push(
    `यी तथ्याङ्कहरूले गाउँपालिकाको आर्थिक विकास र रोजगारी योजनाहरूको लागि महत्त्वपूर्ण निहितार्थहरू राख्दछन्। कार्यशील उमेर जनसंख्याको बाहुल्यताले आर्थिक विकासको लागि अनुकूल वातावरण प्रदान गर्दछ, तर युवा र वृद्ध कामदारहरूको लागि विशेष कार्यक्रमहरू आवश्यक छन्।`
  );

  return analysisParts.join(' ');
}

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits: Record<string, string> = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
  };
  
  return num.toString().replace(/[0-9]/g, (digit) => nepaliDigits[digit] || digit);
}

export function formatNepaliPercentage(percentage: number): string {
  return convertToNepaliNumber(parseFloat(percentage.toFixed(1))) + '%';
} 