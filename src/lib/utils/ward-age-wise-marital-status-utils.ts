import { AgeWiseMaritalStatusData, getAgeGroupDisplayName, getMaritalStatusDisplayName, AgeGroup, MaritalStatus } from "@/server/api/routers/profile/demographics/ward-age-wise-marital-status.schema";

export interface ProcessedWardAgeWiseMaritalStatusData {
  totalPopulation: number;
  ageGroupData: Record<string, {
    totalPopulation: number;
    percentage: number;
    label: string;
    rank: number;
    maritalStatuses: Record<string, {
      population: number;
      percentage: number;
      label: string;
    }>;
  }>;
  maritalStatusData: Record<string, {
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
      maritalStatuses: Record<string, number>;
      primaryMaritalStatus: string;
      primaryMaritalStatusPercentage: number;
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
  topMaritalStatuses: Array<{
    maritalStatus: string;
    totalPopulation: number;
    percentage: number;
    label: string;
  }>;
  maritalStatusScores: {
    overallMaritalStabilityScore: number;
    socialCohesionScore: number;
    familyStructureScore: number;
    demographicBalanceScore: number;
  };
}

export function processWardAgeWiseMaritalStatusData(rawData: AgeWiseMaritalStatusData[]): ProcessedWardAgeWiseMaritalStatusData {
  if (!rawData || rawData.length === 0) {
    return {
      totalPopulation: 0,
      ageGroupData: {},
      maritalStatusData: {},
      wardData: {},
      topAgeGroups: [],
      topMaritalStatuses: [],
      maritalStatusScores: {
        overallMaritalStabilityScore: 0,
        socialCohesionScore: 0,
        familyStructureScore: 0,
        demographicBalanceScore: 0,
      },
    };
  }

  // Calculate total population
  const totalPopulation = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process age group data
  const ageGroupData: Record<string, any> = {};
  const allAgeGroups: Array<any> = [];

  // Group by age group
  const ageGroupMap = new Map<string, AgeWiseMaritalStatusData[]>();
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
    
    const maritalStatuses: Record<string, any> = {};
    items.forEach(item => {
      const maritalPercentage = ageGroupTotal > 0 ? (item.population / ageGroupTotal) * 100 : 0;
      maritalStatuses[item.maritalStatus] = {
        population: item.population,
        percentage: maritalPercentage,
        label: getMaritalStatusDisplayName(item.maritalStatus as MaritalStatus),
      };
    });

    ageGroupData[ageGroup] = {
      totalPopulation: ageGroupTotal,
      percentage,
      label: getAgeGroupDisplayName(ageGroup as AgeGroup),
      rank: 0,
      maritalStatuses,
    };

    allAgeGroups.push({
      ageGroup,
      totalPopulation: ageGroupTotal,
      percentage,
      label: getAgeGroupDisplayName(ageGroup as AgeGroup),
    });
  });

  // Sort age groups by population
  allAgeGroups.sort((a, b) => b.totalPopulation - a.totalPopulation);
  allAgeGroups.forEach((ageGroup, index) => {
    ageGroupData[ageGroup.ageGroup].rank = index + 1;
  });

  // Process marital status data
  const maritalStatusData: Record<string, any> = {};
  const allMaritalStatuses: Array<any> = [];

  // Group by marital status
  const maritalStatusMap = new Map<string, AgeWiseMaritalStatusData[]>();
  rawData.forEach(item => {
    const key = item.maritalStatus;
    if (!maritalStatusMap.has(key)) {
      maritalStatusMap.set(key, []);
    }
    maritalStatusMap.get(key)!.push(item);
  });

  maritalStatusMap.forEach((items, maritalStatus) => {
    const maritalStatusTotal = items.reduce((sum, item) => sum + item.population, 0);
    const percentage = totalPopulation > 0 ? (maritalStatusTotal / totalPopulation) * 100 : 0;
    
    const ageGroups: Record<string, any> = {};
    items.forEach(item => {
      const ageGroupPercentage = maritalStatusTotal > 0 ? (item.population / maritalStatusTotal) * 100 : 0;
      ageGroups[item.ageGroup] = {
        population: item.population,
        percentage: ageGroupPercentage,
        label: getAgeGroupDisplayName(item.ageGroup as AgeGroup),
      };
    });

    maritalStatusData[maritalStatus] = {
      totalPopulation: maritalStatusTotal,
      percentage,
      label: getMaritalStatusDisplayName(maritalStatus as MaritalStatus),
      rank: 0,
      ageGroups,
    };

    allMaritalStatuses.push({
      maritalStatus,
      totalPopulation: maritalStatusTotal,
      percentage,
      label: getMaritalStatusDisplayName(maritalStatus as MaritalStatus),
    });
  });

  // Sort marital statuses by population
  allMaritalStatuses.sort((a, b) => b.totalPopulation - a.totalPopulation);
  allMaritalStatuses.forEach((maritalStatus, index) => {
    maritalStatusData[maritalStatus.maritalStatus].rank = index + 1;
  });

  // Process ward data
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalPopulation = wardItems.reduce((sum, item) => sum + item.population, 0);
    
    // Group by age group for this ward
    const wardAgeGroups: Record<string, any> = {};
    const wardAgeGroupMap = new Map<string, AgeWiseMaritalStatusData[]>();
    
    wardItems.forEach(item => {
      const key = item.ageGroup;
      if (!wardAgeGroupMap.has(key)) {
        wardAgeGroupMap.set(key, []);
      }
      wardAgeGroupMap.get(key)!.push(item);
    });

    wardAgeGroupMap.forEach((items, ageGroup) => {
      const ageGroupTotal = items.reduce((sum, item) => sum + item.population, 0);
      const maritalStatuses: Record<string, number> = {};
      
      items.forEach(item => {
        maritalStatuses[item.maritalStatus] = item.population;
      });

      // Find primary marital status for this age group
      const sortedMaritalStatuses = Object.entries(maritalStatuses).sort(([, a], [, b]) => b - a);
      const primaryMaritalStatus = sortedMaritalStatuses[0]?.[0] || '';
      const primaryMaritalStatusPercentage = ageGroupTotal > 0 
        ? (sortedMaritalStatuses[0]?.[1] || 0) / ageGroupTotal * 100 
        : 0;

      wardAgeGroups[ageGroup] = {
        totalPopulation: ageGroupTotal,
        maritalStatuses,
        primaryMaritalStatus,
        primaryMaritalStatusPercentage,
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

  // Get top 5 age groups and marital statuses
  const topAgeGroups = allAgeGroups.slice(0, 5);
  const topMaritalStatuses = allMaritalStatuses.slice(0, 5);

  // Calculate marital status scores
  const marriedData = maritalStatusData['MARRIED'];
  const singleData = maritalStatusData['SINGLE'];
  const divorcedData = maritalStatusData['DIVORCED'];
  const widowedData = maritalStatusData['WIDOWED'];
  const separatedData = maritalStatusData['SEPARATED'];

  const marriedPercentage = marriedData?.percentage || 0;
  const singlePercentage = singleData?.percentage || 0;
  const divorcedPercentage = divorcedData?.percentage || 0;
  const widowedPercentage = widowedData?.percentage || 0;
  const separatedPercentage = separatedData?.percentage || 0;

  // Overall Marital Stability Score (0-100) - Higher married = higher stability
  const overallMaritalStabilityScore = (marriedPercentage * 0.8) + (singlePercentage * 0.6) + (widowedPercentage * 0.4) + (divorcedPercentage * 0.2) + (separatedPercentage * 0.1);

  // Social Cohesion Score (0-100) - Based on family structure
  const socialCohesionScore = (marriedPercentage * 0.9) + (singlePercentage * 0.5) + (widowedPercentage * 0.6) + (divorcedPercentage * 0.3) + (separatedPercentage * 0.2);

  // Family Structure Score (0-100) - Based on family stability
  const familyStructureScore = (marriedPercentage * 0.9) + (singlePercentage * 0.4) + (widowedPercentage * 0.7) + (divorcedPercentage * 0.2) + (separatedPercentage * 0.1);

  // Demographic Balance Score (0-100) - Balance between different statuses
  const maritalDiversity = 100 - Math.max(marriedPercentage, singlePercentage, divorcedPercentage, widowedPercentage, separatedPercentage);
  const demographicBalanceScore = (maritalDiversity * 0.4) + (marriedPercentage * 0.3) + (singlePercentage * 0.2) + (widowedPercentage * 0.1);

  return {
    totalPopulation,
    ageGroupData,
    maritalStatusData,
    wardData,
    topAgeGroups,
    topMaritalStatuses,
    maritalStatusScores: {
      overallMaritalStabilityScore,
      socialCohesionScore,
      familyStructureScore,
      demographicBalanceScore,
    },
  };
}

export function generateWardAgeWiseMaritalStatusAnalysis(data: ProcessedWardAgeWiseMaritalStatusData): string {
  if (data.totalPopulation === 0) {
    return "वैवाहिक स्थिति सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary with detailed context
  analysisParts.push(
    `केराबारी गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalPopulation)} जनता रहेका छन् जसमा विभिन्न उमेर समूह र वैवाहिक स्थितिका जनताहरू समावेश छन्। यी तथ्याङ्कले गाउँपालिकाको जनसंख्या संरचना, सामाजिक संरचना र विकासको स्तरको विस्तृत चित्र प्रस्तुत गर्दछ। वैवाहिक स्थितिको वितरणले न केवल सामाजिक संरचना मात्र देखाउँछ तर जनसंख्या विकास, सामाजिक स्थिरता र भविष्यको दिशालाई पनि संकेत गर्दछ।`
  );

  // Top age groups analysis
  if (data.topAgeGroups.length > 0) {
    const topAgeGroup = data.topAgeGroups[0];
    analysisParts.push(
      `गाउँपालिकामा सबैभन्दा बढी जनसंख्या ${topAgeGroup.label} उमेर समूहमा रहेका छन् जसमा ${convertToNepaliNumber(topAgeGroup.totalPopulation)} जनता (${formatNepaliPercentage(topAgeGroup.percentage)}) समावेश छन्। यो प्रतिशतले गाउँपालिकाको जनसंख्या संरचनाको मुख्य प्रवृत्ति देखाउँछ। यस्तो उमेर समूहको उच्च प्रतिशतले जनसंख्या विकासको दिशा र सामाजिक संरचनाको स्तर देखाउँछ। यसले गाउँपालिकाको भविष्यको विकास र सामाजिक सुरक्षाको स्तर पनि संकेत गर्दछ।`
    );

    if (data.topAgeGroups.length > 1) {
      const secondAgeGroup = data.topAgeGroups[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondAgeGroup.label} उमेर समूहका जनता रहेका छन् जसमा ${convertToNepaliNumber(secondAgeGroup.totalPopulation)} जनता (${formatNepaliPercentage(secondAgeGroup.percentage)}) समावेश छन्। यी दुई प्रकारका उमेर समूह मिलेर गाउँपालिकाको कुल जनताको ${formatNepaliPercentage(topAgeGroup.percentage + secondAgeGroup.percentage)} भाग ओगटेका छन् जसले जनसंख्या संरचनाको मुख्य प्रवृत्ति देखाउँछ। यस्ता उमेर समूहहरूको उपस्थिति जनसंख्या विकासको दिशा र सामाजिक संरचनाको स्तर देखाउँछ। यसले गाउँपालिकाको भविष्यको विकास र सामाजिक सुरक्षाको स्तर पनि संकेत गर्दछ।`
      );
    }
  }

  // Top marital statuses analysis
  if (data.topMaritalStatuses.length > 0) {
    const topMaritalStatus = data.topMaritalStatuses[0];
    analysisParts.push(
      `गाउँपालिकामा सबैभन्दा बढी जनता ${topMaritalStatus.label} वैवाहिक स्थितिमा रहेका छन् जसमा ${convertToNepaliNumber(topMaritalStatus.totalPopulation)} जनता (${formatNepaliPercentage(topMaritalStatus.percentage)}) समावेश छन्। यो प्रतिशतले गाउँपालिकाको सामाजिक संरचनाको मुख्य प्रवृत्ति देखाउँछ। यस्तो वैवाहिक स्थितिको उच्च प्रतिशतले सामाजिक स्थिरता र परिवार संरचनाको स्तर देखाउँछ। यसले गाउँपालिकाको सामाजिक विकास र सुरक्षाको स्तर पनि संकेत गर्दछ।`
    );

    if (data.topMaritalStatuses.length > 1) {
      const secondMaritalStatus = data.topMaritalStatuses[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondMaritalStatus.label} वैवाहिक स्थितिमा रहेका जनता रहेका छन् जसमा ${convertToNepaliNumber(secondMaritalStatus.totalPopulation)} जनता (${formatNepaliPercentage(secondMaritalStatus.percentage)}) समावेश छन्। यी दुई प्रकारका वैवाहिक स्थिति मिलेर गाउँपालिकाको कुल जनताको ${formatNepaliPercentage(topMaritalStatus.percentage + secondMaritalStatus.percentage)} भाग ओगटेका छन् जसले सामाजिक संरचनाको मुख्य प्रवृत्ति देखाउँछ। यस्ता वैवाहिक स्थितिहरूको उपस्थिति सामाजिक स्थिरता र परिवार संरचनाको स्तर देखाउँछ। यसले गाउँपालिकाको सामाजिक विकास र सुरक्षाको स्तर पनि संकेत गर्दछ।`
      );
    }
  }

  // Marital status scores analysis
  const scores = data.maritalStatusScores;
  analysisParts.push(
    `वैवाहिक स्थितिको गुणस्तर विश्लेषण अनुसार, समग्र वैवाहिक स्थिरता स्कोर ${convertToNepaliNumber(Math.round(scores.overallMaritalStabilityScore * 10) / 10)} रहेको छ (१०० मा) जसले गाउँपालिकाको वैवाहिक स्थिरताको स्तर देखाउँछ। सामाजिक एकता स्कोर ${convertToNepaliNumber(Math.round(scores.socialCohesionScore * 10) / 10)} रहेको छ जसले सामाजिक एकता र सहयोगको स्तर मूल्याङ्कन गर्दछ। परिवार संरचना स्कोर ${convertToNepaliNumber(Math.round(scores.familyStructureScore * 10) / 10)} रहेको छ जसले परिवार संरचना र स्थिरताको स्तर देखाउँछ। जनसंख्या सन्तुलन स्कोर ${convertToNepaliNumber(Math.round(scores.demographicBalanceScore * 10) / 10)} रहेको छ जसले विभिन्न वैवाहिक स्थितिहरू बीचको सन्तुलनलाई मूल्याङ्कन गर्दछ। यी स्कोरहरूले गाउँपालिकाको समग्र सामाजिक संरचना र विकासको स्तर मूल्याङ्कन गर्न सहयोग गर्दछ।`
  );

  // Ward-wise detailed analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalPopulation > max.totalPopulation ? { wardNum, ...wardData } : max
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalPopulation: 0, ageGroups: {}, primaryAgeGroup: '', primaryAgeGroupPercentage: 0 });

    // Calculate ward marital stability scores
    const wardMaritalScores = wardEntries.map(([wardNum, wardData]) => {
      let wardMarried = 0;
      let wardSingle = 0;
      let wardDivorced = 0;
      let wardWidowed = 0;
      let wardSeparated = 0;

      Object.values(wardData.ageGroups).forEach((ageGroup: any) => {
        wardMarried += ageGroup.maritalStatuses['MARRIED'] || 0;
        wardSingle += ageGroup.maritalStatuses['SINGLE'] || 0;
        wardDivorced += ageGroup.maritalStatuses['DIVORCED'] || 0;
        wardWidowed += ageGroup.maritalStatuses['WIDOWED'] || 0;
        wardSeparated += ageGroup.maritalStatuses['SEPARATED'] || 0;
      });

      const wardMarriedPercentage = wardData.totalPopulation > 0 ? (wardMarried / wardData.totalPopulation) * 100 : 0;
      const wardSinglePercentage = wardData.totalPopulation > 0 ? (wardSingle / wardData.totalPopulation) * 100 : 0;
      const wardDivorcedPercentage = wardData.totalPopulation > 0 ? (wardDivorced / wardData.totalPopulation) * 100 : 0;
      const wardWidowedPercentage = wardData.totalPopulation > 0 ? (wardWidowed / wardData.totalPopulation) * 100 : 0;
      const wardSeparatedPercentage = wardData.totalPopulation > 0 ? (wardSeparated / wardData.totalPopulation) * 100 : 0;

      const wardStabilityScore = (wardMarriedPercentage * 0.8) + (wardSinglePercentage * 0.6) + (wardWidowedPercentage * 0.4) + (wardDivorcedPercentage * 0.2) + (wardSeparatedPercentage * 0.1);

      return { wardNum, wardData, wardStabilityScore, wardMarriedPercentage };
    });

    const bestStabilityWard = wardMaritalScores.reduce((best, current) => 
      current.wardStabilityScore > best.wardStabilityScore ? current : best
    );

    analysisParts.push(
      `वडाको आधारमा विस्तृत विश्लेषण गर्दा, वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalPopulation)} जनता रहेका छन्। वैवाहिक स्थिरताको दृष्टिकोणबाट हेर्दा, वडा नं. ${convertToNepaliNumber(parseInt(bestStabilityWard.wardNum))} मा सबैभन्दा राम्रो वैवाहिक स्थिरता रहेको छ जसको स्थिरता स्कोर ${convertToNepaliNumber(Math.round(bestStabilityWard.wardStabilityScore * 10) / 10)} रहेको छ। यस वडामा विवाहित जनताको प्रतिशत ${formatNepaliPercentage(bestStabilityWard.wardMarriedPercentage)} रहेको छ जसले यस वडाको सामाजिक स्थिरता र परिवार संरचनाको उच्च स्तर देखाउँछ। यसले यस वडाको सामाजिक विकास र सुरक्षाको स्तर पनि संकेत गर्दछ।`
    );
  }

  // Critical insights and recommendations
  analysisParts.push(
    `यी तथ्याङ्कले गाउँपालिकाको वैवाहिक स्थिति र सामाजिक संरचनाको मूल्याङ्कन गर्न सहयोग गर्दछ। विवाहित जनताको उच्च प्रतिशतले सामाजिक स्थिरता र परिवार संरचनाको उच्च स्तर देखाउँछ। अविवाहित जनताको उच्च प्रतिशत जनसंख्या विकास र सामाजिक गतिशीलतालाई संकेत गर्दछ। विधुर/विधवा जनताको उच्च प्रतिशत सामाजिक सुरक्षा र सहयोगको आवश्यकतालाई संकेत गर्दछ। यी तथ्याङ्कले सामाजिक नीति र विकास योजनाहरूको निर्माणमा महत्त्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ।`
  );

  // Additional critical analysis
  if (scores.overallMaritalStabilityScore < 50) {
    analysisParts.push(
      `समग्र वैवाहिक स्थिरता स्कोर ${convertToNepaliNumber(Math.round(scores.overallMaritalStabilityScore * 10) / 10)} रहेको छ जुन चिन्ताजनक स्तरमा रहेको छ। यसले गाउँपालिकाको सामाजिक अस्थिरता र परिवार संरचनामा चुनौती रहेको देखाउँछ। यसको लागि व्यापक नीतिगत हस्तक्षेप, सामाजिक सुरक्षा कार्यक्रमहरू र परिवार सहयोग योजनाहरूको आवश्यकता रहेको छ। वैवाहिक स्थिरता स्कोर सुधार गर्न सामाजिक नीति, परिवार सहयोग कार्यक्रमहरू र सामाजिक सुरक्षा योजनाहरूको एकीकृत दृष्टिकोण आवश्यक रहेको छ। यसले गाउँपालिकाको समग्र सामाजिक स्थिरता र विकासलाई सुनिश्चित गर्दछ।`
    );
  }

  analysisParts.push(
    `समग्र रूपमा, गाउँपालिकाको वैवाहिक स्थिति र सामाजिक संरचनामा सुधारका लागि नीतिगत हस्तक्षेप, सामाजिक सुरक्षा कार्यक्रमहरू र परिवार सहयोग योजनाहरूको आवश्यकता रहेको छ। यसले न केवल सामाजिक स्थिरता बढाउँछ तर गाउँपालिकाको समग्र विकास र सामाजिक सुरक्षा पनि सुनिश्चित गर्दछ। सामाजिक नीति र विकास योजनाहरूमा यी तथ्याङ्कको प्रयोग गर्दै सामाजिक-आर्थिक समानता र सामाजिक स्थिरतालाई प्रवर्द्धन गर्न सकिन्छ। यसले गाउँपालिकाको भविष्यको विकास र सामाजिक सुरक्षाको लागि मजबुत आधार तयार पार्दछ।`
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