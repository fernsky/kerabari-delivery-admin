import { MigratedFromEnum } from "@/server/api/routers/profile/demographics/ward-wise-migrated-households.schema";

export interface WardWiseMigratedHouseholdsData {
  id: string;
  wardNumber: number;
  migratedFrom: keyof typeof MigratedFromEnum.enum;
  households: number;
}

export interface ProcessedWardWiseMigratedHouseholdsData {
  totalHouseholds: number;
  migrationData: Record<string, {
    households: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  wardData: Record<number, {
    totalHouseholds: number;
    migrationTypes: Record<string, number>;
    primaryMigrationType: string;
    primaryMigrationPercentage: number;
    migrationTypeCount: number;
  }>;
  topMigrationTypes: Array<{
    migrationType: string;
    households: number;
    percentage: number;
    label: string;
  }>;
  migrationCategories: {
    domestic: number;
    international: number;
    local: number;
  };
  migrationScores: {
    overallDiversityScore: number;
    economicIntegrationScore: number;
    socialCohesionScore: number;
    developmentImpactScore: number;
  };
}

export const MIGRATION_LABELS: Record<string, string> = {
  ANOTHER_DISTRICT: "नेपालको अर्को जिल्ला",
  SAME_DISTRICT_ANOTHER_MUNICIPALITY: "यही जिल्लाको अर्को स्थानीय तह",
  ABROAD: "विदेश",
};

export const MIGRATION_CATEGORIES: Record<string, string[]> = {
  domestic: ["ANOTHER_DISTRICT", "SAME_DISTRICT_ANOTHER_MUNICIPALITY"],
  international: ["ABROAD"],
  local: ["SAME_DISTRICT_ANOTHER_MUNICIPALITY"],
};

export function processWardWiseMigratedHouseholdsData(rawData: WardWiseMigratedHouseholdsData[]): ProcessedWardWiseMigratedHouseholdsData {
  if (!rawData || rawData.length === 0) {
    return {
      totalHouseholds: 0,
      migrationData: {},
      wardData: {},
      topMigrationTypes: [],
      migrationCategories: {
        domestic: 0,
        international: 0,
        local: 0,
      },
      migrationScores: {
        overallDiversityScore: 0,
        economicIntegrationScore: 0,
        socialCohesionScore: 0,
        developmentImpactScore: 0,
      },
    };
  }

  // Calculate total households
  const totalHouseholds = rawData.reduce((sum, item) => sum + (item.households || 0), 0);

  // Process migration data
  const migrationData: Record<string, any> = {};
  const allMigrationTypes: Array<any> = [];

  rawData.forEach((item, index) => {
    const percentage = totalHouseholds > 0 ? (item.households / totalHouseholds) * 100 : 0;
    const migrationInfo = {
      households: item.households,
      percentage,
      label: MIGRATION_LABELS[item.migratedFrom] || item.migratedFrom,
      rank: index + 1,
    };

    if (migrationData[item.migratedFrom]) {
      migrationData[item.migratedFrom].households += item.households;
      migrationData[item.migratedFrom].percentage = totalHouseholds > 0 ? (migrationData[item.migratedFrom].households / totalHouseholds) * 100 : 0;
    } else {
      migrationData[item.migratedFrom] = migrationInfo;
      allMigrationTypes.push({
        migrationType: item.migratedFrom,
        ...migrationInfo,
      });
    }
  });

  // Sort migration types by households
  allMigrationTypes.sort((a, b) => b.households - a.households);

  // Update ranks after sorting
  allMigrationTypes.forEach((migrationType, index) => {
    migrationData[migrationType.migrationType].rank = index + 1;
  });

  // Get top 5 migration types
  const topMigrationTypes = allMigrationTypes.slice(0, 5).map(migrationType => ({
    migrationType: migrationType.migrationType,
    households: migrationType.households,
    percentage: migrationType.percentage,
    label: migrationType.label,
  }));

  // Process ward data
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalHouseholds = wardItems.reduce((sum, item) => sum + item.households, 0);
    const wardMigrationTypes: Record<string, number> = {};
    
    wardItems.forEach(item => {
      if (wardMigrationTypes[item.migratedFrom]) {
        wardMigrationTypes[item.migratedFrom] += item.households;
      } else {
        wardMigrationTypes[item.migratedFrom] = item.households;
      }
    });

    // Find primary migration type for this ward
    const sortedWardMigrationTypes = Object.entries(wardMigrationTypes).sort(([, a], [, b]) => b - a);
    const primaryMigrationType = sortedWardMigrationTypes[0]?.[0] || '';
    const primaryMigrationPercentage = wardTotalHouseholds > 0 
      ? (sortedWardMigrationTypes[0]?.[1] || 0) / wardTotalHouseholds * 100 
      : 0;

    wardData[wardNum] = {
      totalHouseholds: wardTotalHouseholds,
      migrationTypes: wardMigrationTypes,
      primaryMigrationType,
      primaryMigrationPercentage,
      migrationTypeCount: Object.keys(wardMigrationTypes).length,
    };
  });

  // Calculate migration categories
  const migrationCategories = {
    domestic: 0,
    international: 0,
    local: 0,
  };

  Object.entries(migrationData).forEach(([migrationType, data]) => {
    if (MIGRATION_CATEGORIES.domestic.includes(migrationType)) {
      migrationCategories.domestic += data.households;
    } else if (MIGRATION_CATEGORIES.international.includes(migrationType)) {
      migrationCategories.international += data.households;
    } else if (MIGRATION_CATEGORIES.local.includes(migrationType)) {
      migrationCategories.local += data.households;
    }
  });

  // Calculate migration scores
  const domesticPercentage = totalHouseholds > 0 ? (migrationCategories.domestic / totalHouseholds) * 100 : 0;
  const internationalPercentage = totalHouseholds > 0 ? (migrationCategories.international / totalHouseholds) * 100 : 0;
  const localPercentage = totalHouseholds > 0 ? (migrationCategories.local / totalHouseholds) * 100 : 0;

  // Overall Diversity Score (0-100) - Higher diversity = higher score
  const migrationDiversity = 100 - Math.max(domesticPercentage, internationalPercentage, localPercentage);
  const overallDiversityScore = (migrationDiversity * 0.6) + (domesticPercentage * 0.3) + (internationalPercentage * 0.1);

  // Economic Integration Score (0-100) - Based on migration patterns
  const economicIntegrationScore = (domesticPercentage * 0.7) + (localPercentage * 0.8) + (internationalPercentage * 0.5);

  // Social Cohesion Score (0-100) - Balance between migration types
  const socialCohesionScore = (localPercentage * 0.9) + (domesticPercentage * 0.6) + (internationalPercentage * 0.3);

  // Development Impact Score (0-100) - Based on economic indicators
  const developmentImpactScore = (domesticPercentage * 0.6) + (localPercentage * 0.7) + (internationalPercentage * 0.8);

  return {
    totalHouseholds,
    migrationData,
    wardData,
    topMigrationTypes,
    migrationCategories,
    migrationScores: {
      overallDiversityScore,
      economicIntegrationScore,
      socialCohesionScore,
      developmentImpactScore,
    },
  };
}

export function generateWardWiseMigratedHouseholdsAnalysis(data: ProcessedWardWiseMigratedHouseholdsData): string {
  if (data.totalHouseholds === 0) {
    return "वडा अनुसार सरुवा परिवार सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary with detailed context
  analysisParts.push(
    `बुद्धशान्ति गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalHouseholds)} सरुवा परिवार रहेका छन् जसमा विभिन्न स्थानबाट सरुवा भएका परिवारहरूको वितरण रहेको छ। यी तथ्याङ्कले गाउँपालिकाको जनसंख्या गतिशीलता, सामाजिक एकीकरण र आर्थिक विकासको विस्तृत चित्र प्रस्तुत गर्दछ। सरुवा परिवारहरूको वितरणले न केवल जनसंख्या परिवर्तन मात्र देखाउँछ तर सामाजिक संरचना, आर्थिक अवसर र विकासको प्रवृत्तिलाई पनि संकेत गर्दछ। यसले गाउँपालिकाको समग्र सामाजिक-आर्थिक परिवर्तन र भविष्यको दिशालाई प्रतिबिम्बित गर्दछ।`
  );

  // Calculate detailed metrics
  const anotherDistrictData = data.migrationData['ANOTHER_DISTRICT'];
  const sameDistrictData = data.migrationData['SAME_DISTRICT_ANOTHER_MUNICIPALITY'];
  const abroadData = data.migrationData['ABROAD'];

  const anotherDistrictHouseholds = anotherDistrictData?.households || 0;
  const sameDistrictHouseholds = sameDistrictData?.households || 0;
  const abroadHouseholds = abroadData?.households || 0;

  const anotherDistrictPercentage = data.totalHouseholds > 0 ? (anotherDistrictHouseholds / data.totalHouseholds) * 100 : 0;
  const sameDistrictPercentage = data.totalHouseholds > 0 ? (sameDistrictHouseholds / data.totalHouseholds) * 100 : 0;
  const abroadPercentage = data.totalHouseholds > 0 ? (abroadHouseholds / data.totalHouseholds) * 100 : 0;

  // Top migration types analysis with detailed insights
  if (data.topMigrationTypes.length > 0) {
    const topMigrationType = data.topMigrationTypes[0];
    analysisParts.push(
      `गाउँपालिकामा सबैभन्दा बढी सरुवा भएका परिवारहरू ${topMigrationType.label} बाट रहेका छन् जसमा ${convertToNepaliNumber(topMigrationType.households)} परिवार (${formatNepaliPercentage(topMigrationType.percentage)}) समावेश छन्। यो प्रतिशतले गाउँपालिकाको जनसंख्या गतिशीलता र सामाजिक परिवर्तनको मुख्य आधार बनेको छ। अर्को जिल्लाबाट सरुवा भएका परिवारहरूको उच्च प्रतिशतले रोजगारीको खोज, शैक्षिक अवसर र जीवनस्तर सुधारको प्रवृत्ति देखाउँछ। यसले गाउँपालिकाको आर्थिक आकर्षण र विकासको स्तर पनि संकेत गर्दछ। यस्ता परिवारहरू स्थानीय अर्थतन्त्रमा योगदान पुर्याउँदै सामाजिक विविधता र सांस्कृतिक समृद्धि पनि ल्याउँछन्।`
    );

    if (data.topMigrationTypes.length > 1) {
      const secondMigrationType = data.topMigrationTypes[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondMigrationType.label} बाट सरुवा भएका परिवारहरू रहेका छन् जसमा ${convertToNepaliNumber(secondMigrationType.households)} परिवार (${formatNepaliPercentage(secondMigrationType.percentage)}) समावेश छन्। यी दुई प्रकारका सरुवा मिलेर गाउँपालिकाको कुल सरुवा परिवारको ${formatNepaliPercentage(topMigrationType.percentage + secondMigrationType.percentage)} भाग ओगटेका छन् जसले स्थानीय जनसंख्या गतिशीलताको मुख्य प्रवृत्ति देखाउँछ। यही जिल्लाको अर्को स्थानीय तहबाट सरुवा भएका परिवारहरूको उच्च प्रतिशतले स्थानीय विकासको प्रभाव, सामाजिक नेटवर्क र आर्थिक अवसरहरूको उपलब्धतालाई संकेत गर्दछ। यसले गाउँपालिकाको सामाजिक एकीकरण र स्थानीय विकासको स्तर पनि देखाउँछ।`
      );
    }

    if (data.topMigrationTypes.length > 2) {
      const thirdMigrationType = data.topMigrationTypes[2];
      analysisParts.push(
        `तेस्रो स्थानमा ${thirdMigrationType.label} बाट सरुवा भएका परिवारहरू रहेका छन् जसमा ${convertToNepaliNumber(thirdMigrationType.households)} परिवार (${formatNepaliPercentage(thirdMigrationType.percentage)}) समावेश छन्। यी तीन प्रकारका सरुवा मिलेर गाउँपालिकाको जनसंख्या गतिशीलताको मुख्य आधार बनेका छन्। विदेशबाट सरुवा भएका परिवारहरूको उपस्थिति अन्तर्राष्ट्रिय अनुभव, विदेशी पूँजी र वैश्विक दृष्टिकोणको प्रवाहलाई प्रतिनिधित्व गर्दछ। यसले गाउँपालिकाको अन्तर्राष्ट्रिय एकीकरण र वैश्विक विकासको स्तर देखाउँछ। यस्ता परिवारहरू स्थानीय अर्थतन्त्रमा विदेशी पूँजी र प्रविधि ल्याउन सहयोग गर्दछन्।`
      );
    }
  }

  // Migration categories analysis with detailed breakdown
  const categories = data.migrationCategories;
  const totalInCategories = categories.domestic + categories.international + categories.local;
  
  if (totalInCategories > 0) {
    const domesticCategoryPercentage = (categories.domestic / totalInCategories) * 100;
    const internationalCategoryPercentage = (categories.international / totalInCategories) * 100;
    const localCategoryPercentage = (categories.local / totalInCategories) * 100;

    analysisParts.push(
      `सरुवा परिवारहरूको वर्गीकरण अनुसार विश्लेषण गर्दा, घरेलु सरुवा (नेपालको अर्को जिल्ला र यही जिल्लाको अर्को स्थानीय तह) भएका परिवारहरू ${convertToNepaliNumber(categories.domestic)} (${formatNepaliPercentage(domesticCategoryPercentage)}) रहेका छन् जसले गाउँपालिकाको राष्ट्रिय एकीकरण र आर्थिक गतिशीलतालाई संकेत गर्दछ। अन्तर्राष्ट्रिय सरुवा (विदेश) भएका परिवारहरू ${convertToNepaliNumber(categories.international)} (${formatNepaliPercentage(internationalCategoryPercentage)}) रहेका छन् जसले वैश्विक एकीकरण र अन्तर्राष्ट्रिय अनुभवको प्रवाहलाई प्रतिनिधित्व गर्दछ। स्थानीय सरुवा (यही जिल्लाको अर्को स्थानीय तह) भएका परिवारहरू ${convertToNepaliNumber(categories.local)} (${formatNepaliPercentage(localCategoryPercentage)}) रहेका छन् जसले स्थानीय विकास र सामाजिक नेटवर्कको स्तर देखाउँछ। यी विविध सरुवा प्रकारहरूको उपस्थिति गाउँपालिकाको सामाजिक-आर्थिक संरचनाको जटिलतालाई प्रतिबिम्बित गर्दछ।`
    );
  }

  // Migration scores analysis with critical insights
  const scores = data.migrationScores;
  analysisParts.push(
    `सरुवा परिवारहरूको गुणस्तर विश्लेषण अनुसार, समग्र विविधता स्कोर ${convertToNepaliNumber(Math.round(scores.overallDiversityScore * 10) / 10)} रहेको छ (१०० मा) जसले गाउँपालिकाको जनसंख्या विविधता र सामाजिक एकीकरणको स्तर देखाउँछ। आर्थिक एकीकरण स्कोर ${convertToNepaliNumber(Math.round(scores.economicIntegrationScore * 10) / 10)} रहेको छ जसले सरुवा परिवारहरूको आर्थिक योगदान र स्थानीय अर्थतन्त्रमा एकीकरणको स्तर देखाउँछ। सामाजिक सामंजस्य स्कोर ${convertToNepaliNumber(Math.round(scores.socialCohesionScore * 10) / 10)} रहेको छ जसले विभिन्न सरुवा समूहहरू बीचको सामाजिक सम्बन्ध र एकतालाई मूल्याङ्कन गर्दछ। विकासको प्रभाव स्कोर ${convertToNepaliNumber(Math.round(scores.developmentImpactScore * 10) / 10)} रहेको छ जसले सरुवा परिवारहरूको विकासमा योगदान र भविष्यको विकासको सम्भावनालाई संकेत गर्दछ। यी स्कोरहरूले गाउँपालिकाको समग्र सामाजिक-आर्थिक विकास र स्थिरताको स्तर मूल्याङ्कन गर्न सहयोग गर्दछ।`
  );

  // Ward-wise detailed analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalHouseholds > max.totalHouseholds ? { wardNum, ...wardData } : max
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, migrationTypes: {}, primaryMigrationType: '', primaryMigrationPercentage: 0, migrationTypeCount: 0 });
    const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
      wardData.totalHouseholds < min.totalHouseholds ? { wardNum, ...wardData } : min
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, migrationTypes: {}, primaryMigrationType: '', primaryMigrationPercentage: 0, migrationTypeCount: 0 });

    // Calculate ward migration scores
    const wardMigrationScores = wardEntries.map(([wardNum, wardData]) => {
      const wardDomestic = (wardData.migrationTypes['ANOTHER_DISTRICT'] || 0) + (wardData.migrationTypes['SAME_DISTRICT_ANOTHER_MUNICIPALITY'] || 0);
      const wardInternational = (wardData.migrationTypes['ABROAD'] || 0);
      const wardLocal = (wardData.migrationTypes['SAME_DISTRICT_ANOTHER_MUNICIPALITY'] || 0);
      
      const wardDomesticPercentage = wardData.totalHouseholds > 0 ? (wardDomestic / wardData.totalHouseholds) * 100 : 0;
      const wardInternationalPercentage = wardData.totalHouseholds > 0 ? (wardInternational / wardData.totalHouseholds) * 100 : 0;
      const wardLocalPercentage = wardData.totalHouseholds > 0 ? (wardLocal / wardData.totalHouseholds) * 100 : 0;
      
      const wardDiversityScore = (100 - Math.max(wardDomesticPercentage, wardInternationalPercentage, wardLocalPercentage)) * 0.6 + (wardDomesticPercentage * 0.3) + (wardInternationalPercentage * 0.1);
      
      return { wardNum, wardData, wardDiversityScore, wardDomesticPercentage, wardInternationalPercentage };
    });

    const bestDiversityWard = wardMigrationScores.reduce((best, current) => 
      current.wardDiversityScore > best.wardDiversityScore ? current : best
    );
    const worstDiversityWard = wardMigrationScores.reduce((worst, current) => 
      current.wardDiversityScore < worst.wardDiversityScore ? current : worst
    );

    analysisParts.push(
      `वडाको आधारमा विस्तृत विश्लेषण गर्दा, वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalHouseholds)} सरुवा परिवार रहेका छन् भने वडा नं. ${convertToNepaliNumber(parseInt(lowestWard.wardNum))} मा सबैभन्दा कम ${convertToNepaliNumber(lowestWard.totalHouseholds)} सरुवा परिवार रहेका छन्। विविधताको दृष्टिकोणबाट हेर्दा, वडा नं. ${convertToNepaliNumber(parseInt(bestDiversityWard.wardNum))} मा सबैभन्दा राम्रो विविधता रहेको छ जसको विविधता स्कोर ${convertToNepaliNumber(Math.round(bestDiversityWard.wardDiversityScore * 10) / 10)} रहेको छ। यस वडामा घरेलु सरुवा भएका परिवारहरू ${formatNepaliPercentage(bestDiversityWard.wardDomesticPercentage)} रहेका छन् जसले यस वडाको राष्ट्रिय एकीकरण र आर्थिक गतिशीलताको उच्च स्तर देखाउँछ। यसले यस वडाको सामाजिक समृद्धि र विकासको स्तर पनि संकेत गर्दछ।`
    );

    analysisParts.push(
      `वडा नं. ${convertToNepaliNumber(parseInt(worstDiversityWard.wardNum))} मा सबैभन्दा न्यून विविधता रहेको छ जसको विविधता स्कोर ${convertToNepaliNumber(Math.round(worstDiversityWard.wardDiversityScore * 10) / 10)} रहेको छ। यस वडामा अन्तर्राष्ट्रिय सरुवा भएका परिवारहरू ${formatNepaliPercentage(worstDiversityWard.wardInternationalPercentage)} रहेका छन् जसले यस वडाको सामाजिक एकीकरण र स्थानीय विकासमा चुनौती रहेको देखाउँछ। यसले यस वडाको सामाजिक सामंजस्य र आर्थिक एकीकरणमा सुधारका कार्यक्रमहरूको आवश्यकतालाई संकेत गर्दछ। यस्ता वडाहरूमा सामाजिक एकीकरण कार्यक्रमहरू र स्थानीय विकास योजनाहरूको आवश्यकता रहेको छ।`
    );
  }

  // Critical insights and policy recommendations
  analysisParts.push(
    `यी तथ्याङ्कले गाउँपालिकाको सरुवा परिवारहरूको वितरण र सामाजिक एकीकरणको मूल्याङ्कन गर्न सहयोग गर्दछ। घरेलु सरुवाको उच्च प्रतिशतले राष्ट्रिय एकीकरण र आर्थिक गतिशीलताको प्रवृत्ति देखाउँछ। अन्तर्राष्ट्रिय सरुवाको उपस्थिति वैश्विक एकीकरण र अन्तर्राष्ट्रिय अनुभवको प्रवाहलाई प्रतिनिधित्व गर्दछ। स्थानीय सरुवा सामाजिक नेटवर्क र स्थानीय विकासको स्तर देखाउँछ। यी विविध सरुवा प्रकारहरूको उपस्थिति गाउँपालिकाको सामाजिक-आर्थिक संरचनाको जटिलतालाई प्रतिबिम्बित गर्दछ। घरेलु सरुवाको उच्च प्रतिशतले आर्थिक एकीकरण र सामाजिक सामंजस्यको स्तर देखाउँछ। अन्तर्राष्ट्रिय सरुवाको उच्च प्रतिशतले सामाजिक एकीकरण र स्थानीय विकासमा चुनौती रहेको देखाउँछ। स्थानीय सरुवा सामाजिक नेटवर्क र स्थानीय विकासको स्तर देखाउँछ। यी तथ्याङ्कले सामाजिक एकीकरण नीति र विकास योजनाहरूको निर्माणमा महत्त्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ।`
  );

  // Additional critical analysis with policy implications
  if (abroadPercentage > 30) {
    analysisParts.push(
      `गाउँपालिकामा विदेशबाट सरुवा भएका परिवारहरूको प्रतिशत ${formatNepaliPercentage(abroadPercentage)} रहेको छ जुन चिन्ताजनक स्तरमा रहेको छ। यस्ता परिवारहरू सामाजिक एकीकरण र स्थानीय विकासमा चुनौती रहेका छन्। यसको लागि तत्काल सामाजिक एकीकरण कार्यक्रमहरू, भाषा शिक्षा कार्यक्रमहरू र सांस्कृतिक समझ कार्यक्रमहरू ल्याउनुपर्ने आवश्यकता रहेको छ। विदेशबाट सरुवा भएका परिवारहरूको उच्च दरले सामाजिक अस्थिरता र सांस्कृतिक विभाजनलाई बढाउन सक्छ। यसको लागि नीतिगत हस्तक्षेप, सामाजिक एकीकरण कार्यक्रमहरू र सांस्कृतिक समझ प्रवर्द्धनका कार्यक्रमहरूको आवश्यकता रहेको छ।`
    );
  }

  if (sameDistrictPercentage < 20) {
    analysisParts.push(
      `यही जिल्लाको अर्को स्थानीय तहबाट सरुवा भएका परिवारहरूको प्रतिशत ${formatNepaliPercentage(sameDistrictPercentage)} मात्र रहेको छ जुन स्थानीय विकासको दृष्टिकोणबाट न्यून छ। यसले गाउँपालिकाको स्थानीय आकर्षण र विकासमा सुधारका कार्यक्रमहरूको आवश्यकतालाई संकेत गर्दछ। स्थानीय सरुवा बढाउन स्थानीय विकास कार्यक्रमहरू, रोजगारी सिर्जना कार्यक्रमहरू र सामाजिक सेवा सुधार कार्यक्रमहरूको आवश्यकता रहेको छ। यसले न केवल स्थानीय विकास बढाउँछ तर सामाजिक सामंजस्य र आर्थिक एकीकरणको स्तर पनि सुनिश्चित गर्दछ।`
    );
  }

  if (scores.overallDiversityScore < 50) {
    analysisParts.push(
      `समग्र विविधता स्कोर ${convertToNepaliNumber(Math.round(scores.overallDiversityScore * 10) / 10)} रहेको छ जुन चिन्ताजनक स्तरमा रहेको छ। यसले गाउँपालिकाको सामाजिक एकीकरण र जनसंख्या विविधतामा चुनौती रहेको देखाउँछ। यसको लागि व्यापक नीतिगत हस्तक्षेप, सामाजिक एकीकरण कार्यक्रमहरू र विविधता प्रवर्द्धन योजनाहरूको आवश्यकता रहेको छ। विविधता स्कोर सुधार गर्न सामाजिक एकीकरण नीति, विकास कार्यक्रमहरू र सांस्कृतिक समझ योजनाहरूको एकीकृत दृष्टिकोण आवश्यक रहेको छ। यसले गाउँपालिकाको समग्र सामाजिक-आर्थिक विकास र स्थिरतालाई सुनिश्चित गर्दछ।`
    );
  }

  analysisParts.push(
    `समग्र रूपमा, गाउँपालिकाको सरुवा परिवारहरूको वितरण र सामाजिक एकीकरणमा सुधारका लागि नीतिगत हस्तक्षेप, सामाजिक एकीकरण कार्यक्रमहरू र विकास योजनाहरूको आवश्यकता रहेको छ। यसले न केवल सामाजिक सामंजस्य बढाउँछ तर गाउँपालिकाको समग्र विकास र स्थिरता पनि सुनिश्चित गर्दछ। सामाजिक एकीकरण नीति र विकास योजनाहरूमा यी तथ्याङ्कको प्रयोग गर्दै सामाजिक-आर्थिक समानता र स्थिरतालाई प्रवर्द्धन गर्न सकिन्छ। यसले गाउँपालिकाको भविष्यको विकास र सामाजिक सुरक्षाको लागि मजबुत आधार तयार पार्दछ।`
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