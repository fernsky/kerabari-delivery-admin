import { HouseOwnershipTypeEnum } from "@/server/api/routers/profile/economics/ward-wise-house-ownership.schema";

export interface WardWiseHouseOwnershipData {
  id: string;
  wardNumber: number;
  ownershipType: keyof typeof HouseOwnershipTypeEnum.enum;
  households: number;
}

export interface ProcessedWardWiseHouseOwnershipData {
  totalHouseholds: number;
  ownershipData: Record<string, {
    households: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  wardData: Record<number, {
    totalHouseholds: number;
    ownershipTypes: Record<string, number>;
    primaryOwnershipType: string;
    primaryOwnershipPercentage: number;
    ownershipTypeCount: number;
  }>;
  topOwnershipTypes: Array<{
    ownershipType: string;
    households: number;
    percentage: number;
    label: string;
  }>;
  ownershipCategories: {
    private: number;
    rented: number;
    institutional: number;
    other: number;
  };
  ownershipScores: {
    overallStabilityScore: number;
    economicSecurityScore: number;
    socialEquityScore: number;
    developmentPotentialScore: number;
  };
}

export const HOUSE_OWNERSHIP_LABELS: Record<string, string> = {
  PRIVATE: "निजी स्वामित्व",
  RENT: "भाडामा",
  INSTITUTIONAL: "संस्थागत",
  OTHER: "अन्य",
};

export const OWNERSHIP_CATEGORIES: Record<string, string[]> = {
  private: ["PRIVATE"],
  rented: ["RENT"],
  institutional: ["INSTITUTIONAL"],
  other: ["OTHER"],
};

export function processWardWiseHouseOwnershipData(rawData: WardWiseHouseOwnershipData[]): ProcessedWardWiseHouseOwnershipData {
  if (!rawData || rawData.length === 0) {
    return {
      totalHouseholds: 0,
      ownershipData: {},
      wardData: {},
      topOwnershipTypes: [],
      ownershipCategories: {
        private: 0,
        rented: 0,
        institutional: 0,
        other: 0,
      },
      ownershipScores: {
        overallStabilityScore: 0,
        economicSecurityScore: 0,
        socialEquityScore: 0,
        developmentPotentialScore: 0,
      },
    };
  }

  // Calculate total households
  const totalHouseholds = rawData.reduce((sum, item) => sum + (item.households || 0), 0);

  // Process ownership data
  const ownershipData: Record<string, any> = {};
  const allOwnershipTypes: Array<any> = [];

  rawData.forEach((item, index) => {
    const percentage = totalHouseholds > 0 ? (item.households / totalHouseholds) * 100 : 0;
    const ownershipInfo = {
      households: item.households,
      percentage,
      label: HOUSE_OWNERSHIP_LABELS[item.ownershipType] || item.ownershipType,
      rank: index + 1,
    };

    if (ownershipData[item.ownershipType]) {
      ownershipData[item.ownershipType].households += item.households;
      ownershipData[item.ownershipType].percentage = totalHouseholds > 0 ? (ownershipData[item.ownershipType].households / totalHouseholds) * 100 : 0;
    } else {
      ownershipData[item.ownershipType] = ownershipInfo;
      allOwnershipTypes.push({
        ownershipType: item.ownershipType,
        ...ownershipInfo,
      });
    }
  });

  // Sort ownership types by households
  allOwnershipTypes.sort((a, b) => b.households - a.households);

  // Update ranks after sorting
  allOwnershipTypes.forEach((ownershipType, index) => {
    ownershipData[ownershipType.ownershipType].rank = index + 1;
  });

  // Get top 5 ownership types
  const topOwnershipTypes = allOwnershipTypes.slice(0, 5).map(ownershipType => ({
    ownershipType: ownershipType.ownershipType,
    households: ownershipType.households,
    percentage: ownershipType.percentage,
    label: ownershipType.label,
  }));

  // Process ward data
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalHouseholds = wardItems.reduce((sum, item) => sum + item.households, 0);
    const wardOwnershipTypes: Record<string, number> = {};
    
    wardItems.forEach(item => {
      if (wardOwnershipTypes[item.ownershipType]) {
        wardOwnershipTypes[item.ownershipType] += item.households;
      } else {
        wardOwnershipTypes[item.ownershipType] = item.households;
      }
    });

    // Find primary ownership type for this ward
    const sortedWardOwnershipTypes = Object.entries(wardOwnershipTypes).sort(([, a], [, b]) => b - a);
    const primaryOwnershipType = sortedWardOwnershipTypes[0]?.[0] || '';
    const primaryOwnershipPercentage = wardTotalHouseholds > 0 
      ? (sortedWardOwnershipTypes[0]?.[1] || 0) / wardTotalHouseholds * 100 
      : 0;

    wardData[wardNum] = {
      totalHouseholds: wardTotalHouseholds,
      ownershipTypes: wardOwnershipTypes,
      primaryOwnershipType,
      primaryOwnershipPercentage,
      ownershipTypeCount: Object.keys(wardOwnershipTypes).length,
    };
  });

  // Calculate ownership categories
  const ownershipCategories = {
    private: 0,
    rented: 0,
    institutional: 0,
    other: 0,
  };

  Object.entries(ownershipData).forEach(([ownershipType, data]) => {
    if (OWNERSHIP_CATEGORIES.private.includes(ownershipType)) {
      ownershipCategories.private += data.households;
    } else if (OWNERSHIP_CATEGORIES.rented.includes(ownershipType)) {
      ownershipCategories.rented += data.households;
    } else if (OWNERSHIP_CATEGORIES.institutional.includes(ownershipType)) {
      ownershipCategories.institutional += data.households;
    } else {
      ownershipCategories.other += data.households;
    }
  });

  // Calculate ownership scores
  const privatePercentage = totalHouseholds > 0 ? (ownershipCategories.private / totalHouseholds) * 100 : 0;
  const rentedPercentage = totalHouseholds > 0 ? (ownershipCategories.rented / totalHouseholds) * 100 : 0;
  const institutionalPercentage = totalHouseholds > 0 ? (ownershipCategories.institutional / totalHouseholds) * 100 : 0;
  const otherPercentage = totalHouseholds > 0 ? (ownershipCategories.other / totalHouseholds) * 100 : 0;

  // Overall Stability Score (0-100) - Higher private ownership = higher stability
  const overallStabilityScore = (privatePercentage * 0.8) + (institutionalPercentage * 0.6) + (rentedPercentage * 0.3) + (otherPercentage * 0.2);

  // Economic Security Score (0-100) - Based on ownership patterns
  const economicSecurityScore = (privatePercentage * 0.9) + (institutionalPercentage * 0.7) + (rentedPercentage * 0.4) + (otherPercentage * 0.2);

  // Social Equity Score (0-100) - Balance between ownership types
  const ownershipDiversity = 100 - Math.max(privatePercentage, rentedPercentage, institutionalPercentage, otherPercentage);
  const socialEquityScore = (ownershipDiversity * 0.4) + (privatePercentage * 0.3) + (institutionalPercentage * 0.2) + (rentedPercentage * 0.1);

  // Development Potential Score (0-100) - Based on economic indicators
  const developmentPotentialScore = (privatePercentage * 0.7) + (institutionalPercentage * 0.8) + (rentedPercentage * 0.5) + (otherPercentage * 0.3);

  return {
    totalHouseholds,
    ownershipData,
    wardData,
    topOwnershipTypes,
    ownershipCategories,
    ownershipScores: {
      overallStabilityScore,
      economicSecurityScore,
      socialEquityScore,
      developmentPotentialScore,
    },
  };
}

export function generateWardWiseHouseOwnershipAnalysis(data: ProcessedWardWiseHouseOwnershipData): string {
  if (data.totalHouseholds === 0) {
    return "घर स्वामित्व सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary with detailed context
  analysisParts.push(
    `बुद्धशान्ति गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalHouseholds)} घरपरिवार रहेका छन् जसमा विभिन्न प्रकारका घर स्वामित्वको वितरण रहेको छ। यी तथ्याङ्कले गाउँपालिकाको आर्थिक स्थिरता, सामाजिक समानता र विकासको स्तरको विस्तृत चित्र प्रस्तुत गर्दछ। घर स्वामित्वको वितरणले न केवल आर्थिक अवस्था मात्र देखाउँछ तर सामाजिक संरचना, विकासको प्रवृत्ति र भविष्यको दिशालाई पनि संकेत गर्दछ।`
  );

  // Calculate detailed metrics
  const privateData = data.ownershipData['PRIVATE'];
  const rentData = data.ownershipData['RENT'];
  const institutionalData = data.ownershipData['INSTITUTIONAL'];
  const otherData = data.ownershipData['OTHER'];

  const privateHouseholds = privateData?.households || 0;
  const rentHouseholds = rentData?.households || 0;
  const institutionalHouseholds = institutionalData?.households || 0;
  const otherHouseholds = otherData?.households || 0;

  const privatePercentage = data.totalHouseholds > 0 ? (privateHouseholds / data.totalHouseholds) * 100 : 0;
  const rentPercentage = data.totalHouseholds > 0 ? (rentHouseholds / data.totalHouseholds) * 100 : 0;
  const institutionalPercentage = data.totalHouseholds > 0 ? (institutionalHouseholds / data.totalHouseholds) * 100 : 0;
  const otherPercentage = data.totalHouseholds > 0 ? (otherHouseholds / data.totalHouseholds) * 100 : 0;

  // Top ownership types analysis with detailed insights
  if (data.topOwnershipTypes.length > 0) {
    const topOwnershipType = data.topOwnershipTypes[0];
    analysisParts.push(
      `गाउँपालिकामा सबैभन्दा बढी प्रयोग गरिएको घर स्वामित्वको प्रकार ${topOwnershipType.label} रहेको छ जसमा ${convertToNepaliNumber(topOwnershipType.households)} घरपरिवार (${formatNepaliPercentage(topOwnershipType.percentage)}) समावेश छन्। यो प्रतिशतले गाउँपालिकाको आर्थिक स्थिरता र सामाजिक संरचनाको मुख्य आधार बनेको छ। निजी स्वामित्वको उच्च प्रतिशतले स्थानीय जनताको आर्थिक सक्षमता, सम्पत्ति स्वामित्वको प्रवृत्ति र विकासको दिशालाई प्रतिबिम्बित गर्दछ। यसले गाउँपालिकाको समग्र आर्थिक स्थिरता र सामाजिक सुरक्षाको स्तर देखाउँछ।`
    );

    if (data.topOwnershipTypes.length > 1) {
      const secondOwnershipType = data.topOwnershipTypes[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondOwnershipType.label} रहेको छ जसमा ${convertToNepaliNumber(secondOwnershipType.households)} घरपरिवार (${formatNepaliPercentage(secondOwnershipType.percentage)}) समावेश छन्। यी दुई प्रकारका स्वामित्व मिलेर गाउँपालिकाको कुल घरपरिवारको ${formatNepaliPercentage(topOwnershipType.percentage + secondOwnershipType.percentage)} भाग ओगटेका छन् जसले स्थानीय आर्थिक गतिविधिको मुख्य प्रवृत्ति देखाउँछ। भाडाको उच्च प्रतिशतले आवास बजारको गतिशीलता, शहरीकरणको प्रवृत्ति र आर्थिक विविधतालाई संकेत गर्दछ। यसले गाउँपालिकाको आवास नीति र विकास योजनाहरूको आवश्यकतालाई पनि संकेत गर्दछ।`
      );
    }

    if (data.topOwnershipTypes.length > 2) {
      const thirdOwnershipType = data.topOwnershipTypes[2];
      analysisParts.push(
        `तेस्रो स्थानमा ${thirdOwnershipType.label} रहेको छ जसमा ${convertToNepaliNumber(thirdOwnershipType.households)} घरपरिवार (${formatNepaliPercentage(thirdOwnershipType.percentage)}) समावेश छन्। यी तीन प्रकारका स्वामित्व मिलेर गाउँपालिकाको आवासीय संरचनाको मुख्य आधार बनेका छन्। संस्थागत स्वामित्वको उपस्थिति सरकारी नीतिहरू, शैक्षिक संस्थाहरू र अन्य सामाजिक संस्थाहरूको भूमिकालाई प्रतिबिम्बित गर्दछ। यसले गाउँपालिकाको सामाजिक विकास र सार्वजनिक सेवाको स्तर देखाउँछ।`
      );
    }
  }

  // Ownership categories analysis with detailed breakdown
  const categories = data.ownershipCategories;
  const totalInCategories = categories.private + categories.rented + categories.institutional + categories.other;
  
  if (totalInCategories > 0) {
    const privateCategoryPercentage = (categories.private / totalInCategories) * 100;
    const rentedCategoryPercentage = (categories.rented / totalInCategories) * 100;
    const institutionalCategoryPercentage = (categories.institutional / totalInCategories) * 100;
    const otherCategoryPercentage = (categories.other / totalInCategories) * 100;

    analysisParts.push(
      `घर स्वामित्वको वर्गीकरण अनुसार विश्लेषण गर्दा, निजी स्वामित्वमा रहेका घरहरू ${convertToNepaliNumber(categories.private)} (${formatNepaliPercentage(privateCategoryPercentage)}) रहेका छन् जसले गाउँपालिकाको आर्थिक स्थिरता र सम्पत्ति स्वामित्वको प्रवृत्ति देखाउँछ। भाडामा रहेका घरहरू ${convertToNepaliNumber(categories.rented)} (${formatNepaliPercentage(rentedCategoryPercentage)}) रहेका छन् जसले आवास बजारको गतिशीलता र आर्थिक विविधतालाई संकेत गर्दछ। संस्थागत स्वामित्वमा रहेका घरहरू ${convertToNepaliNumber(categories.institutional)} (${formatNepaliPercentage(institutionalCategoryPercentage)}) रहेका छन् जसले सार्वजनिक सेवा र सामाजिक विकासको स्तर देखाउँछ। अन्य स्वामित्वमा रहेका घरहरू ${convertToNepaliNumber(categories.other)} (${formatNepaliPercentage(otherCategoryPercentage)}) रहेका छन् जसले विविध आवासीय व्यवस्थाहरूको उपस्थिति देखाउँछ।`
    );
  }

  // Ownership scores analysis with critical insights
  const scores = data.ownershipScores;
  analysisParts.push(
    `घर स्वामित्वको गुणस्तर विश्लेषण अनुसार, समग्र स्थिरता स्कोर ${convertToNepaliNumber(Math.round(scores.overallStabilityScore * 10) / 10)} रहेको छ (१०० मा) जसले गाउँपालिकाको आर्थिक र सामाजिक स्थिरताको स्तर देखाउँछ। आर्थिक सुरक्षा स्कोर ${convertToNepaliNumber(Math.round(scores.economicSecurityScore * 10) / 10)} रहेको छ जसले जनताको आर्थिक सुरक्षा र सम्पत्ति स्वामित्वको स्तर देखाउँछ। सामाजिक समानता स्कोर ${convertToNepaliNumber(Math.round(scores.socialEquityScore * 10) / 10)} रहेको छ जसले विभिन्न सामाजिक वर्गहरू बीचको आवासीय समानतालाई मूल्याङ्कन गर्दछ। विकासको सम्भावना स्कोर ${convertToNepaliNumber(Math.round(scores.developmentPotentialScore * 10) / 10)} रहेको छ जसले भविष्यको विकास र आर्थिक वृद्धिको सम्भावनालाई संकेत गर्दछ। यी स्कोरहरूले गाउँपालिकाको समग्र विकास र स्थिरताको स्तर मूल्याङ्कन गर्न सहयोग गर्दछ।`
  );

  // Ward-wise detailed analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalHouseholds > max.totalHouseholds ? { wardNum, ...wardData } : max
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, ownershipTypes: {}, primaryOwnershipType: '', primaryOwnershipPercentage: 0, ownershipTypeCount: 0 });
    const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
      wardData.totalHouseholds < min.totalHouseholds ? { wardNum, ...wardData } : min
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, ownershipTypes: {}, primaryOwnershipType: '', primaryOwnershipPercentage: 0, ownershipTypeCount: 0 });

    // Calculate ward ownership scores
    const wardOwnershipScores = wardEntries.map(([wardNum, wardData]) => {
      const wardPrivate = (wardData.ownershipTypes['PRIVATE'] || 0);
      const wardRent = (wardData.ownershipTypes['RENT'] || 0);
      const wardInstitutional = (wardData.ownershipTypes['INSTITUTIONAL'] || 0);
      const wardOther = (wardData.ownershipTypes['OTHER'] || 0);
      
      const wardPrivatePercentage = wardData.totalHouseholds > 0 ? (wardPrivate / wardData.totalHouseholds) * 100 : 0;
      const wardRentPercentage = wardData.totalHouseholds > 0 ? (wardRent / wardData.totalHouseholds) * 100 : 0;
      const wardInstitutionalPercentage = wardData.totalHouseholds > 0 ? (wardInstitutional / wardData.totalHouseholds) * 100 : 0;
      const wardOtherPercentage = wardData.totalHouseholds > 0 ? (wardOther / wardData.totalHouseholds) * 100 : 0;
      
      const wardStabilityScore = (wardPrivatePercentage * 0.8) + (wardInstitutionalPercentage * 0.6) + (wardRentPercentage * 0.3) + (wardOtherPercentage * 0.2);
      
      return { wardNum, wardData, wardStabilityScore, wardPrivatePercentage, wardRentPercentage };
    });

    const bestStabilityWard = wardOwnershipScores.reduce((best, current) => 
      current.wardStabilityScore > best.wardStabilityScore ? current : best
    );
    const worstStabilityWard = wardOwnershipScores.reduce((worst, current) => 
      current.wardStabilityScore < worst.wardStabilityScore ? current : worst
    );

    analysisParts.push(
      `वडाको आधारमा विस्तृत विश्लेषण गर्दा, वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalHouseholds)} घरपरिवार रहेका छन् भने वडा नं. ${convertToNepaliNumber(parseInt(lowestWard.wardNum))} मा सबैभन्दा कम ${convertToNepaliNumber(lowestWard.totalHouseholds)} घरपरिवार रहेका छन्। स्थिरताको दृष्टिकोणबाट हेर्दा, वडा नं. ${convertToNepaliNumber(parseInt(bestStabilityWard.wardNum))} मा सबैभन्दा राम्रो स्थिरता रहेको छ जसको स्थिरता स्कोर ${convertToNepaliNumber(Math.round(bestStabilityWard.wardStabilityScore * 10) / 10)} रहेको छ। यस वडामा निजी स्वामित्वमा रहेका घरहरू ${formatNepaliPercentage(bestStabilityWard.wardPrivatePercentage)} रहेका छन् जसले यस वडाको आर्थिक स्थिरता र सम्पत्ति स्वामित्वको उच्च स्तर देखाउँछ। यसले यस वडाको विकास र सुरक्षाको स्तर पनि संकेत गर्दछ।`
    );

    analysisParts.push(
      `वडा नं. ${convertToNepaliNumber(parseInt(worstStabilityWard.wardNum))} मा सबैभन्दा न्यून स्थिरता रहेको छ जसको स्थिरता स्कोर ${convertToNepaliNumber(Math.round(worstStabilityWard.wardStabilityScore * 10) / 10)} रहेको छ। यस वडामा भाडामा रहेका घरहरू ${formatNepaliPercentage(worstStabilityWard.wardRentPercentage)} रहेका छन् जसले यस वडाको आर्थिक अस्थिरता र आवासीय असुरक्षालाई संकेत गर्दछ। यसले यस वडाको विकास र सामाजिक सुरक्षामा चुनौती रहेको देखाउँछ। यस्ता वडाहरूमा आवास सुधार कार्यक्रमहरू र आर्थिक सहयोगको आवश्यकता रहेको छ।`
    );
  }

  // Critical insights and policy recommendations
  analysisParts.push(
    `यी तथ्याङ्कले गाउँपालिकाको आवासीय स्वामित्वको वितरण र आर्थिक अवस्थाको मूल्याङ्कन गर्न सहयोग गर्दछ। निजी स्वामित्वको उच्च प्रतिशतले स्थानीय जनताको आर्थिक सक्षमता र सम्पत्ति स्वामित्वको प्रवृत्ति देखाउँछ। भाडाको उपस्थिति आवास बजारको गतिशीलता र आर्थिक विविधतालाई प्रतिनिधित्व गर्दछ। संस्थागत स्वामित्व सरकारी नीतिहरू र सामाजिक विकासको स्तर देखाउँछ। यी विविध स्वामित्व प्रकारहरूको उपस्थिति गाउँपालिकाको सामाजिक-आर्थिक संरचनाको जटिलतालाई प्रतिबिम्बित गर्दछ। निजी स्वामित्वको उच्च प्रतिशतले आर्थिक स्थिरता र सामाजिक सुरक्षाको स्तर देखाउँछ। भाडाको उच्च प्रतिशतले आवासीय असुरक्षा र आर्थिक अस्थिरतालाई संकेत गर्दछ। संस्थागत स्वामित्व सार्वजनिक सेवा र सामाजिक विकासको स्तर देखाउँछ। यी तथ्याङ्कले आवास नीति र विकास योजनाहरूको निर्माणमा महत्त्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ।`
  );

  // Additional critical analysis with policy implications
  if (rentPercentage > 30) {
    analysisParts.push(
      `गाउँपालिकामा भाडामा रहेका घरहरूको प्रतिशत ${formatNepaliPercentage(rentPercentage)} रहेको छ जुन चिन्ताजनक स्तरमा रहेको छ। यस्ता घरहरू आर्थिक असुरक्षा र आवासीय अस्थिरताको उच्च जोखिममा रहेका छन्। यसको लागि तत्काल आवास सुधार कार्यक्रमहरू, सामाजिक आवास योजनाहरू र आर्थिक सहयोग कार्यक्रमहरू ल्याउनुपर्ने आवश्यकता रहेको छ। भाडाको उच्च दरले आर्थिक असमानता र सामाजिक अस्थिरतालाई बढाउन सक्छ। यसको लागि नीतिगत हस्तक्षेप, आवास वित्त कार्यक्रमहरू र सम्पत्ति स्वामित्व प्रवर्द्धनका कार्यक्रमहरूको आवश्यकता रहेको छ।`
    );
  }

  if (privatePercentage < 60) {
    analysisParts.push(
      `निजी स्वामित्वमा रहेका घरहरूको प्रतिशत ${formatNepaliPercentage(privatePercentage)} मात्र रहेको छ जुन आर्थिक स्थिरताको दृष्टिकोणबाट न्यून छ। यसले गाउँपालिकाको आर्थिक सुरक्षा र सम्पत्ति स्वामित्वमा सुधारका कार्यक्रमहरूको आवश्यकतालाई संकेत गर्दछ। निजी स्वामित्व बढाउन आवास वित्त कार्यक्रमहरू, सम्पत्ति स्वामित्व प्रवर्द्धनका कार्यक्रमहरू र आर्थिक सहयोग योजनाहरूको आवश्यकता रहेको छ। यसले न केवल आर्थिक स्थिरता बढाउँछ तर सामाजिक सुरक्षा र विकासको स्तर पनि सुनिश्चित गर्दछ।`
    );
  }

  if (scores.overallStabilityScore < 50) {
    analysisParts.push(
      `समग्र स्थिरता स्कोर ${convertToNepaliNumber(Math.round(scores.overallStabilityScore * 10) / 10)} रहेको छ जुन चिन्ताजनक स्तरमा रहेको छ। यसले गाउँपालिकाको आर्थिक र सामाजिक अस्थिरतालाई संकेत गर्दछ। यसको लागि व्यापक नीतिगत हस्तक्षेप, आर्थिक सुधार कार्यक्रमहरू र सामाजिक सुरक्षा योजनाहरूको आवश्यकता रहेको छ। स्थिरता स्कोर सुधार गर्न आवास नीति, आर्थिक विकास कार्यक्रमहरू र सामाजिक सुरक्षा योजनाहरूको एकीकृत दृष्टिकोण आवश्यक रहेको छ। यसले गाउँपालिकाको समग्र विकास र स्थिरतालाई सुनिश्चित गर्दछ।`
    );
  }

  analysisParts.push(
    `समग्र रूपमा, गाउँपालिकाको घर स्वामित्वको वितरण र गुणस्तरमा सुधारका लागि नीतिगत हस्तक्षेप, आर्थिक सहयोग कार्यक्रमहरू र सामाजिक सुरक्षा योजनाहरूको आवश्यकता रहेको छ। यसले न केवल आर्थिक स्थिरता बढाउँछ तर गाउँपालिकाको समग्र विकास र सामाजिक सुरक्षा पनि सुनिश्चित गर्दछ। आवास नीति र विकास योजनाहरूमा यी तथ्याङ्कको प्रयोग गर्दै सामाजिक-आर्थिक समानता र स्थिरतालाई प्रवर्द्धन गर्न सकिन्छ। यसले गाउँपालिकाको भविष्यको विकास र सुरक्षाको लागि मजबुत आधार तयार पार्दछ।`
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