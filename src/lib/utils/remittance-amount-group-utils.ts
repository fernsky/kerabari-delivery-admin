export interface RemittanceAmountGroupData {
  id: string;
  wardNumber: number;
  amountGroup: string;
  population: number;
}

export interface ProcessedRemittanceAmountGroupData {
  totalRemittancePopulation: number;
  amountGroupData: Record<string, {
    population: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  wardData: Record<number, {
    totalRemittancePopulation: number;
    amountGroups: Record<string, number>;
    primaryAmountGroup: string;
    primaryAmountGroupPercentage: number;
    amountGroupCount: number;
  }>;
  topAmountGroups: Array<{
    amountGroup: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  remittanceCategories: {
    noRemittance: number;
    lowRemittance: number;
    mediumRemittance: number;
    highRemittance: number;
    veryHighRemittance: number;
  };
  remittanceScores: {
    overallEconomicScore: number;
    financialStabilityScore: number;
    prosperityIndex: number;
    developmentPotentialScore: number;
    economicDiversityScore: number;
    socialEquityScore: number;
  };
  criticalInsights: {
    economicVulnerabilityLevel: string;
    developmentReadiness: string;
    policyPriorityAreas: string[];
    riskFactors: string[];
    opportunities: string[];
  };
}

export const REMITTANCE_AMOUNT_GROUP_LABELS: Record<string, string> = {
  NO_REMITTANCE: "रेमिट्यान्स नभएको",
  BELOW_50K: "५० हजारभन्दा कम",
  RS_50K_TO_100K: "५० हजारदेखि १ लाखसम्म",
  RS_100K_TO_200K: "१ लाखदेखि २ लाखसम्म",
  RS_200K_TO_500K: "२ लाखदेखि ५ लाखसम्म",
  ABOVE_500K: "५ लाखभन्दा बढी",
};

export const REMITTANCE_CATEGORIES: Record<string, string[]> = {
  noRemittance: ["NO_REMITTANCE"],
  lowRemittance: ["BELOW_50K"],
  mediumRemittance: ["RS_50K_TO_100K", "RS_100K_TO_200K"],
  highRemittance: ["RS_200K_TO_500K"],
  veryHighRemittance: ["ABOVE_500K"],
};

export function processRemittanceAmountGroupData(rawData: RemittanceAmountGroupData[]): ProcessedRemittanceAmountGroupData {
  if (!rawData || rawData.length === 0) {
    return {
      totalRemittancePopulation: 0,
      amountGroupData: {},
      wardData: {},
      topAmountGroups: [],
      remittanceCategories: {
        noRemittance: 0,
        lowRemittance: 0,
        mediumRemittance: 0,
        highRemittance: 0,
        veryHighRemittance: 0,
      },
      remittanceScores: {
        overallEconomicScore: 0,
        financialStabilityScore: 0,
        prosperityIndex: 0,
        developmentPotentialScore: 0,
        economicDiversityScore: 0,
        socialEquityScore: 0,
      },
      criticalInsights: {
        economicVulnerabilityLevel: "अज्ञात",
        developmentReadiness: "अज्ञात",
        policyPriorityAreas: [],
        riskFactors: [],
        opportunities: [],
      },
    };
  }

  // Calculate total remittance population
  const totalRemittancePopulation = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process amount group data
  const amountGroupData: Record<string, any> = {};
  const allAmountGroups: Array<any> = [];

  rawData.forEach((item, index) => {
    const percentage = totalRemittancePopulation > 0 ? (item.population / totalRemittancePopulation) * 100 : 0;
    const amountGroupInfo = {
      population: item.population,
      percentage,
      label: REMITTANCE_AMOUNT_GROUP_LABELS[item.amountGroup] || item.amountGroup,
      rank: index + 1,
    };

    if (amountGroupData[item.amountGroup]) {
      amountGroupData[item.amountGroup].population += item.population;
      amountGroupData[item.amountGroup].percentage = totalRemittancePopulation > 0 ? (amountGroupData[item.amountGroup].population / totalRemittancePopulation) * 100 : 0;
    } else {
      amountGroupData[item.amountGroup] = amountGroupInfo;
      allAmountGroups.push({
        amountGroup: item.amountGroup,
        ...amountGroupInfo,
      });
    }
  });

  // Sort amount groups by population
  allAmountGroups.sort((a, b) => b.population - a.population);

  // Update ranks after sorting
  allAmountGroups.forEach((amountGroup, index) => {
    amountGroupData[amountGroup.amountGroup].rank = index + 1;
  });

  // Get top 5 amount groups
  const topAmountGroups = allAmountGroups.slice(0, 5).map(amountGroup => ({
    amountGroup: amountGroup.amountGroup,
    population: amountGroup.population,
    percentage: amountGroup.percentage,
    label: amountGroup.label,
  }));

  // Process ward data
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalRemittancePopulation = wardItems.reduce((sum, item) => sum + item.population, 0);
    const wardAmountGroups: Record<string, number> = {};
    
    wardItems.forEach(item => {
      if (wardAmountGroups[item.amountGroup]) {
        wardAmountGroups[item.amountGroup] += item.population;
      } else {
        wardAmountGroups[item.amountGroup] = item.population;
      }
    });

    // Find primary amount group for this ward
    const sortedWardAmountGroups = Object.entries(wardAmountGroups).sort(([, a], [, b]) => b - a);
    const primaryAmountGroup = sortedWardAmountGroups[0]?.[0] || '';
    const primaryAmountGroupPercentage = wardTotalRemittancePopulation > 0 
      ? (sortedWardAmountGroups[0]?.[1] || 0) / wardTotalRemittancePopulation * 100 
      : 0;

    wardData[wardNum] = {
      totalRemittancePopulation: wardTotalRemittancePopulation,
      amountGroups: wardAmountGroups,
      primaryAmountGroup,
      primaryAmountGroupPercentage,
      amountGroupCount: Object.keys(wardAmountGroups).length,
    };
  });

  // Calculate remittance categories
  const remittanceCategories = {
    noRemittance: 0,
    lowRemittance: 0,
    mediumRemittance: 0,
    highRemittance: 0,
    veryHighRemittance: 0,
  };

  Object.entries(amountGroupData).forEach(([amountGroup, data]) => {
    if (REMITTANCE_CATEGORIES.noRemittance.includes(amountGroup)) {
      remittanceCategories.noRemittance += data.population;
    } else if (REMITTANCE_CATEGORIES.lowRemittance.includes(amountGroup)) {
      remittanceCategories.lowRemittance += data.population;
    } else if (REMITTANCE_CATEGORIES.mediumRemittance.includes(amountGroup)) {
      remittanceCategories.mediumRemittance += data.population;
    } else if (REMITTANCE_CATEGORIES.highRemittance.includes(amountGroup)) {
      remittanceCategories.highRemittance += data.population;
    } else if (REMITTANCE_CATEGORIES.veryHighRemittance.includes(amountGroup)) {
      remittanceCategories.veryHighRemittance += data.population;
    }
  });

  // Calculate detailed remittance scores
  const noRemittancePercentage = totalRemittancePopulation > 0 ? (remittanceCategories.noRemittance / totalRemittancePopulation) * 100 : 0;
  const lowRemittancePercentage = totalRemittancePopulation > 0 ? (remittanceCategories.lowRemittance / totalRemittancePopulation) * 100 : 0;
  const mediumRemittancePercentage = totalRemittancePopulation > 0 ? (remittanceCategories.mediumRemittance / totalRemittancePopulation) * 100 : 0;
  const highRemittancePercentage = totalRemittancePopulation > 0 ? (remittanceCategories.highRemittance / totalRemittancePopulation) * 100 : 0;
  const veryHighRemittancePercentage = totalRemittancePopulation > 0 ? (remittanceCategories.veryHighRemittance / totalRemittancePopulation) * 100 : 0;

  // Overall Economic Score (0-100) - Higher remittance = higher economic activity
  const overallEconomicScore = (veryHighRemittancePercentage * 0.9) + (highRemittancePercentage * 0.8) + (mediumRemittancePercentage * 0.6) + (lowRemittancePercentage * 0.3) + (noRemittancePercentage * 0.1);

  // Financial Stability Score (0-100) - Based on remittance patterns
  const financialStabilityScore = (veryHighRemittancePercentage * 0.95) + (highRemittancePercentage * 0.85) + (mediumRemittancePercentage * 0.7) + (lowRemittancePercentage * 0.4) + (noRemittancePercentage * 0.2);

  // Prosperity Index (0-100) - Balance between different remittance levels
  const prosperityIndex = (veryHighRemittancePercentage * 0.9) + (highRemittancePercentage * 0.8) + (mediumRemittancePercentage * 0.6) + (lowRemittancePercentage * 0.3) + (noRemittancePercentage * 0.1);

  // Development Potential Score (0-100) - Based on economic indicators
  const developmentPotentialScore = (veryHighRemittancePercentage * 0.95) + (highRemittancePercentage * 0.85) + (mediumRemittancePercentage * 0.7) + (lowRemittancePercentage * 0.5) + (noRemittancePercentage * 0.2);

  // Economic Diversity Score (0-100) - Based on distribution across amount groups
  const amountGroupCount = Object.keys(amountGroupData).filter(key => amountGroupData[key].population > 0).length;
  const maxPossibleGroups = Object.keys(REMITTANCE_AMOUNT_GROUP_LABELS).length;
  const economicDiversityScore = (amountGroupCount / maxPossibleGroups) * 100;

  // Social Equity Score (0-100) - Based on distribution evenness
  const percentages = Object.values(amountGroupData).map(data => data.percentage);
  const maxPercentage = Math.max(...percentages);
  const minPercentage = Math.min(...percentages);
  const socialEquityScore = maxPercentage > 0 ? Math.max(0, 100 - (maxPercentage - minPercentage)) : 0;

  // Generate critical insights
  const criticalInsights = generateCriticalInsights({
    noRemittancePercentage,
    lowRemittancePercentage,
    mediumRemittancePercentage,
    highRemittancePercentage,
    veryHighRemittancePercentage,
    overallEconomicScore,
    financialStabilityScore,
    prosperityIndex,
    developmentPotentialScore,
    economicDiversityScore,
    socialEquityScore,
    wardData,
    amountGroupData,
  });

  return {
    totalRemittancePopulation,
    amountGroupData,
    wardData,
    topAmountGroups,
    remittanceCategories,
    remittanceScores: {
      overallEconomicScore,
      financialStabilityScore,
      prosperityIndex,
      developmentPotentialScore,
      economicDiversityScore,
      socialEquityScore,
    },
    criticalInsights,
  };
}

function generateCriticalInsights(data: any) {
  const {
    noRemittancePercentage,
    lowRemittancePercentage,
    mediumRemittancePercentage,
    highRemittancePercentage,
    veryHighRemittancePercentage,
    overallEconomicScore,
    financialStabilityScore,
    prosperityIndex,
    developmentPotentialScore,
    economicDiversityScore,
    socialEquityScore,
    wardData,
    amountGroupData,
  } = data;

  // Determine economic vulnerability level
  let economicVulnerabilityLevel = "कम";
  if (noRemittancePercentage > 30 || lowRemittancePercentage > 50) {
    economicVulnerabilityLevel = "उच्च";
  } else if (noRemittancePercentage > 15 || lowRemittancePercentage > 30) {
    economicVulnerabilityLevel = "मध्यम";
  }

  // Determine development readiness
  let developmentReadiness = "कम";
  if (developmentPotentialScore > 70) {
    developmentReadiness = "उच्च";
  } else if (developmentPotentialScore > 40) {
    developmentReadiness = "मध्यम";
  }

  // Identify policy priority areas
  const policyPriorityAreas: string[] = [];
  if (noRemittancePercentage > 20) {
    policyPriorityAreas.push("वैदेशिक रोजगारीको अवसर सिर्जना");
  }
  if (lowRemittancePercentage > 30) {
    policyPriorityAreas.push("कौशल विकास र प्रशिक्षण कार्यक्रम");
  }
  if (economicDiversityScore < 50) {
    policyPriorityAreas.push("आर्थिक विविधता बढाउने नीति");
  }
  if (socialEquityScore < 60) {
    policyPriorityAreas.push("सामाजिक समानता सुनिश्चित गर्ने उपाय");
  }

  // Identify risk factors
  const riskFactors: string[] = [];
  if (noRemittancePercentage > 25) {
    riskFactors.push("वैदेशिक रोजगारीमा निर्भरता कम हुनु");
  }
  if (veryHighRemittancePercentage > 40) {
    riskFactors.push("उच्च रेमिट्यान्समा अत्यधिक निर्भरता");
  }
  if (financialStabilityScore < 50) {
    riskFactors.push("आर्थिक अस्थिरता");
  }

  // Identify opportunities
  const opportunities: string[] = [];
  if (mediumRemittancePercentage > 30) {
    opportunities.push("मध्यम रेमिट्यान्सको स्थिर प्रवाह");
  }
  if (economicDiversityScore > 70) {
    opportunities.push("विविध आर्थिक गतिविधि");
  }
  if (prosperityIndex > 60) {
    opportunities.push("समृद्धि सूचकांकमा सकारात्मक प्रवृत्ति");
  }

  return {
    economicVulnerabilityLevel,
    developmentReadiness,
    policyPriorityAreas,
    riskFactors,
    opportunities,
  };
}

export function generateRemittanceAmountGroupAnalysis(data: ProcessedRemittanceAmountGroupData): string {
  if (data.totalRemittancePopulation === 0) {
    return "रेमिट्यान्स रकम समूह सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary with detailed context
  analysisParts.push(
    `केराबारी गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalRemittancePopulation)} जना रेमिट्यान्स प्राप्त गर्ने जनसंख्या रहेको छ जसमा विभिन्न रकम समूहका व्यक्तिहरू समावेश छन्। यी तथ्याङ्कले गाउँपालिकाको आर्थिक गतिविधि, वैदेशिक रोजगारीको प्रभाव र सामाजिक-आर्थिक विकासको विस्तृत चित्र प्रस्तुत गर्दछ। रेमिट्यान्सको वितरणले न केवल आर्थिक अवस्था मात्र देखाउँछ तर सामाजिक संरचना, विकासको प्रवृत्ति र भविष्यको दिशालाई पनि संकेत गर्दछ। रेमिट्यान्सको विविध वितरणले गाउँपालिकाको आर्थिक विविधता, रोजगारीको प्रवृत्ति र सामाजिक-आर्थिक समानताको स्तर देखाउँछ। यी तथ्याङ्कले आर्थिक नीति र विकास योजनाहरूको निर्माणमा महत्त्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ।`
  );

  // Calculate detailed metrics
  const noRemittanceData = data.amountGroupData['NO_REMITTANCE'];
  const below50kData = data.amountGroupData['BELOW_50K'];
  const rs50kTo100kData = data.amountGroupData['RS_50K_TO_100K'];
  const rs100kTo200kData = data.amountGroupData['RS_100K_TO_200K'];
  const rs200kTo500kData = data.amountGroupData['RS_200K_TO_500K'];
  const above500kData = data.amountGroupData['ABOVE_500K'];

  const noRemittancePopulation = noRemittanceData?.population || 0;
  const below50kPopulation = below50kData?.population || 0;
  const rs50kTo100kPopulation = rs50kTo100kData?.population || 0;
  const rs100kTo200kPopulation = rs100kTo200kData?.population || 0;
  const rs200kTo500kPopulation = rs200kTo500kData?.population || 0;
  const above500kPopulation = above500kData?.population || 0;

  const noRemittancePercentage = data.totalRemittancePopulation > 0 ? (noRemittancePopulation / data.totalRemittancePopulation) * 100 : 0;
  const below50kPercentage = data.totalRemittancePopulation > 0 ? (below50kPopulation / data.totalRemittancePopulation) * 100 : 0;
  const rs50kTo100kPercentage = data.totalRemittancePopulation > 0 ? (rs50kTo100kPopulation / data.totalRemittancePopulation) * 100 : 0;
  const rs100kTo200kPercentage = data.totalRemittancePopulation > 0 ? (rs100kTo200kPopulation / data.totalRemittancePopulation) * 100 : 0;
  const rs200kTo500kPercentage = data.totalRemittancePopulation > 0 ? (rs200kTo500kPopulation / data.totalRemittancePopulation) * 100 : 0;
  const above500kPercentage = data.totalRemittancePopulation > 0 ? (above500kPopulation / data.totalRemittancePopulation) * 100 : 0;

  // Top amount groups analysis with detailed insights
  if (data.topAmountGroups.length > 0) {
    const topAmountGroup = data.topAmountGroups[0];
    analysisParts.push(
      `गाउँपालिकामा सबैभन्दा बढी जनाले ${topAmountGroup.label} रकम प्राप्त गर्दै आएका छन् जसमा ${convertToNepaliNumber(topAmountGroup.population)} जना (${formatNepaliPercentage(topAmountGroup.percentage)}) समावेश छन्। यो प्रतिशतले गाउँपालिकाको आर्थिक गतिविधिको मुख्य प्रवृत्ति र वैदेशिक रोजगारीको प्रभावलाई प्रतिबिम्बित गर्दछ। रेमिट्यान्सको यो वितरणले स्थानीय अर्थतन्त्रको गतिशीलता, परिवारको आर्थिक स्थिरता र सामाजिक विकासको स्तर देखाउँछ। यसले गाउँपालिकाको समग्र आर्थिक स्थिरता र विकासको दिशालाई पनि संकेत गर्दछ। यो रकम समूहले गाउँपालिकाको आर्थिक संरचना र विकासको मुख्य आधार बनेको छ।`
    );

    if (data.topAmountGroups.length > 1) {
      const secondAmountGroup = data.topAmountGroups[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondAmountGroup.label} रकम प्राप्त गर्ने जनसंख्या रहेको छ जसमा ${convertToNepaliNumber(secondAmountGroup.population)} जना (${formatNepaliPercentage(secondAmountGroup.percentage)}) समावेश छन्। यी दुई रकम समूह मिलेर गाउँपालिकाको रेमिट्यान्स प्रवाहको मुख्य आधार बनेका छन्। यी विविध रकम समूहहरूको उपस्थिति सामाजिक-आर्थिक विविधता, रोजगारीको विभिन्न स्तर र आर्थिक असमानताको स्तर देखाउँछ। यसले गाउँपालिकाको सामाजिक विकास र आर्थिक समानताको स्तर पनि संकेत गर्दछ।`
      );
    }

    if (data.topAmountGroups.length > 2) {
      const thirdAmountGroup = data.topAmountGroups[2];
      analysisParts.push(
        `तेस्रो स्थानमा ${thirdAmountGroup.label} रकम प्राप्त गर्ने जनसंख्या रहेको छ जसमा ${convertToNepaliNumber(thirdAmountGroup.population)} जना (${formatNepaliPercentage(thirdAmountGroup.percentage)}) समावेश छन्। यी तीन रकम समूह मिलेर गाउँपालिकाको रेमिट्यान्स प्रवाहको मुख्य आधार बनेका छन्। यी विविध रकम समूहहरूको उपस्थिति सामाजिक-आर्थिक विविधता, रोजगारीको विभिन्न स्तर र आर्थिक असमानताको स्तर देखाउँछ। यसले गाउँपालिकाको सामाजिक विकास र आर्थिक समानताको स्तर पनि संकेत गर्दछ। यी तीन रकम समूहले गाउँपालिकाको आर्थिक संरचनाको मुख्य आधार बनेका छन्।`
      );
    }
  }

  // Remittance categories analysis with detailed breakdown
  const categories = data.remittanceCategories;
  const totalInCategories = categories.noRemittance + categories.lowRemittance + categories.mediumRemittance + categories.highRemittance + categories.veryHighRemittance;
  
  if (totalInCategories > 0) {
    const noRemittanceCategoryPercentage = (categories.noRemittance / totalInCategories) * 100;
    const lowRemittanceCategoryPercentage = (categories.lowRemittance / totalInCategories) * 100;
    const mediumRemittanceCategoryPercentage = (categories.mediumRemittance / totalInCategories) * 100;
    const highRemittanceCategoryPercentage = (categories.highRemittance / totalInCategories) * 100;
    const veryHighRemittanceCategoryPercentage = (categories.veryHighRemittance / totalInCategories) * 100;

    analysisParts.push(
      `रेमिट्यान्सको वर्गीकरण अनुसार विश्लेषण गर्दा, ${formatNepaliPercentage(noRemittanceCategoryPercentage)} जनाले कुनै पनि रेमिट्यान्स प्राप्त गर्दैनन् भने ${formatNepaliPercentage(lowRemittanceCategoryPercentage)} जनाले कम रेमिट्यान्स प्राप्त गर्दै आएका छन्। मध्यम रेमिट्यान्स प्राप्त गर्ने जनसंख्या ${formatNepaliPercentage(mediumRemittanceCategoryPercentage)} रहेको छ भने उच्च रेमिट्यान्स प्राप्त गर्ने जनसंख्या ${formatNepaliPercentage(highRemittanceCategoryPercentage)} रहेको छ। अत्यन्त उच्च रेमिट्यान्स प्राप्त गर्ने जनसंख्या ${formatNepaliPercentage(veryHighRemittanceCategoryPercentage)} रहेको छ। यी वर्गीकरणले गाउँपालिकाको आर्थिक विविधता र सामाजिक समानताको स्तर देखाउँछ।`
    );
  }

  // Economic scores analysis
  analysisParts.push(
    `आर्थिक सूचकांकहरूको विश्लेषण गर्दा, समग्र आर्थिक स्कोर ${convertToNepaliNumber(parseFloat(data.remittanceScores.overallEconomicScore.toFixed(1)))} रहेको छ जसले गाउँपालिकाको आर्थिक गतिविधिको स्तर देखाउँछ। वित्तीय स्थिरता स्कोर ${convertToNepaliNumber(parseFloat(data.remittanceScores.financialStabilityScore.toFixed(1)))} रहेको छ जसले रेमिट्यान्सको स्थिरतालाई संकेत गर्दछ। समृद्धि सूचकांक ${convertToNepaliNumber(parseFloat(data.remittanceScores.prosperityIndex.toFixed(1)))} रहेको छ जसले सामाजिक-आर्थिक विकासको स्तर देखाउँछ। विकासको क्षमता स्कोर ${convertToNepaliNumber(parseFloat(data.remittanceScores.developmentPotentialScore.toFixed(1)))} रहेको छ जसले भविष्यको विकासको सम्भावनालाई संकेत गर्दछ। आर्थिक विविधता स्कोर ${convertToNepaliNumber(parseFloat(data.remittanceScores.economicDiversityScore.toFixed(1)))} रहेको छ जसले विभिन्न रकम समूहहरूको वितरणलाई देखाउँछ। सामाजिक समानता स्कोर ${convertToNepaliNumber(parseFloat(data.remittanceScores.socialEquityScore.toFixed(1)))} रहेको छ जसले सामाजिक न्याय र समानताको स्तर देखाउँछ।`
  );

  // Critical insights analysis
  analysisParts.push(
    `महत्त्वपूर्ण अन्तर्दृष्टिहरूको विश्लेषण गर्दा, आर्थिक असुरक्षाको स्तर ${data.criticalInsights.economicVulnerabilityLevel} रहेको छ जसले गाउँपालिकाको आर्थिक स्थिरतालाई संकेत गर्दछ। विकासको तयारीको स्तर ${data.criticalInsights.developmentReadiness} रहेको छ जसले भविष्यको विकास योजनाहरूको सफलतालाई प्रभाव पार्न सक्छ। नीतिगत प्राथमिकता क्षेत्रहरूमा ${data.criticalInsights.policyPriorityAreas.join(', ')} समावेश छन् जसले सरकारी नीतिहरूको दिशालाई निर्धारण गर्न सहयोग गर्दछ। जोखिम कारकहरूमा ${data.criticalInsights.riskFactors.join(', ')} समावेश छन् जसले आर्थिक स्थिरतालाई प्रभाव पार्न सक्छन्। अवसरहरूमा ${data.criticalInsights.opportunities.join(', ')} समावेश छन् जसले भविष्यको विकासको लागि सकारात्मक आधार बनेका छन्।`
  );

  // Ward-wise detailed analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalRemittancePopulation > max.totalRemittancePopulation ? { wardNum, ...wardData } : max
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalRemittancePopulation: 0, amountGroups: {}, primaryAmountGroup: '', primaryAmountGroupPercentage: 0, amountGroupCount: 0 });
    const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
      wardData.totalRemittancePopulation < min.totalRemittancePopulation ? { wardNum, ...wardData } : min
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalRemittancePopulation: 0, amountGroups: {}, primaryAmountGroup: '', primaryAmountGroupPercentage: 0, amountGroupCount: 0 });

    // Calculate ward remittance scores
    const wardRemittanceScores = wardEntries.map(([wardNum, wardData]) => {
      const wardNoRemittance = (wardData.amountGroups['NO_REMITTANCE'] || 0);
      const wardLowRemittance = (wardData.amountGroups['BELOW_50K'] || 0);
      const wardMediumRemittance = (wardData.amountGroups['RS_50K_TO_100K'] || 0) + (wardData.amountGroups['RS_100K_TO_200K'] || 0);
      const wardHighRemittance = (wardData.amountGroups['RS_200K_TO_500K'] || 0);
      const wardVeryHighRemittance = (wardData.amountGroups['ABOVE_500K'] || 0);
      
      const wardNoRemittancePercentage = wardData.totalRemittancePopulation > 0 ? (wardNoRemittance / wardData.totalRemittancePopulation) * 100 : 0;
      const wardLowRemittancePercentage = wardData.totalRemittancePopulation > 0 ? (wardLowRemittance / wardData.totalRemittancePopulation) * 100 : 0;
      const wardMediumRemittancePercentage = wardData.totalRemittancePopulation > 0 ? (wardMediumRemittance / wardData.totalRemittancePopulation) * 100 : 0;
      const wardHighRemittancePercentage = wardData.totalRemittancePopulation > 0 ? (wardHighRemittance / wardData.totalRemittancePopulation) * 100 : 0;
      const wardVeryHighRemittancePercentage = wardData.totalRemittancePopulation > 0 ? (wardVeryHighRemittance / wardData.totalRemittancePopulation) * 100 : 0;
      
      const wardEconomicScore = (wardVeryHighRemittancePercentage * 0.9) + (wardHighRemittancePercentage * 0.8) + (wardMediumRemittancePercentage * 0.6) + (wardLowRemittancePercentage * 0.3) + (wardNoRemittancePercentage * 0.1);
      
      return { wardNum, wardData, wardEconomicScore, wardNoRemittancePercentage, wardVeryHighRemittancePercentage };
    });

    const bestEconomicWard = wardRemittanceScores.reduce((best, current) => 
      current.wardEconomicScore > best.wardEconomicScore ? current : best
    );
    const worstEconomicWard = wardRemittanceScores.reduce((worst, current) => 
      current.wardEconomicScore < worst.wardEconomicScore ? current : worst
    );

    analysisParts.push(
      `वडागत विश्लेषण गर्दा, वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalRemittancePopulation)} जना रेमिट्यान्स प्राप्त गर्ने जनसंख्या रहेको छ भने वडा नं. ${convertToNepaliNumber(parseInt(lowestWard.wardNum))} मा सबैभन्दा कम ${convertToNepaliNumber(lowestWard.totalRemittancePopulation)} जना मात्र रहेका छन्। सबैभन्दा राम्रो आर्थिक स्थिति वडा नं. ${convertToNepaliNumber(parseInt(bestEconomicWard.wardNum))} मा रहेको छ जहाँ आर्थिक स्कोर ${convertToNepaliNumber(parseFloat(bestEconomicWard.wardEconomicScore.toFixed(1)))} रहेको छ। सबैभन्दा कमजोर आर्थिक स्थिति वडा नं. ${convertToNepaliNumber(parseInt(worstEconomicWard.wardNum))} मा रहेको छ जहाँ आर्थिक स्कोर ${convertToNepaliNumber(parseFloat(worstEconomicWard.wardEconomicScore.toFixed(1)))} रहेको छ। यी भिन्नताहरूले विभिन्न वडाहरूमा आर्थिक विकासको विभिन्न स्तर र वैदेशिक रोजगारीको प्रभावलाई प्रतिबिम्बित गर्दछ।`
    );

    // Most diverse ward analysis
    const mostDiverseWard = wardEntries.reduce((most, [wardNum, wardData]) => 
      wardData.amountGroupCount > most.amountGroupCount ? { wardNum, ...wardData } : most
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalRemittancePopulation: 0, amountGroups: {}, primaryAmountGroup: '', primaryAmountGroupPercentage: 0, amountGroupCount: 0 });

    analysisParts.push(
      `सबैभन्दा विविध रेमिट्यान्स वितरण वडा नं. ${convertToNepaliNumber(parseInt(mostDiverseWard.wardNum))} मा रहेको छ जहाँ ${convertToNepaliNumber(mostDiverseWard.amountGroupCount)} विभिन्न रकम समूहहरूको उपस्थिति रहेको छ। यो विविधताले यस वडाको आर्थिक स्थिरता र सामाजिक समानताको स्तर देखाउँछ। यसले यस क्षेत्रमा विभिन्न स्तरका रोजगारी अवसरहरू र आर्थिक गतिविधिहरूको उपस्थितिलाई संकेत गर्दछ।`
    );
  }

  // Policy recommendations
  analysisParts.push(
    `नीतिगत सिफारिसहरूको आधारमा, गाउँपालिकाले रेमिट्यान्सको स्थिर प्रवाह सुनिश्चित गर्न वैदेशिक रोजगारीको अवसरहरू बढाउनुपर्छ। कौशल विकास र प्रशिक्षण कार्यक्रमहरूको माध्यमबाट जनताको रोजगारी क्षमता बढाउनुपर्छ। आर्थिक विविधता बढाउने नीतिहरूको माध्यमबाट विभिन्न आय स्रोतहरूको विकास गर्नुपर्छ। सामाजिक समानता सुनिश्चित गर्ने उपायहरूको माध्यमबाट सबै वर्गका जनतालाई समान अवसर प्रदान गर्नुपर्छ। यी नीतिहरूको सफल कार्यान्वयनले गाउँपालिकाको समग्र विकास र समृद्धिलाई सुनिश्चित गर्न सहयोग गर्नेछ।`
  );

  return analysisParts.join(' ');
}

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/[0-9]/g, (digit) => nepaliDigits[parseInt(digit)]);
}

export function formatNepaliPercentage(percentage: number): string {
  return `${convertToNepaliNumber(Math.round(percentage * 10) / 10)}%`;
} 