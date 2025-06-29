import { GenderType } from "@/server/api/routers/profile/demographics/ward-wise-househead-gender.schema";

export interface HouseheadGenderData {
  id: string;
  wardNumber: number;
  gender: GenderType;
  population: number;
  genderDisplay?: string;
}

export interface ProcessedHouseheadGenderData {
  totalHouseheads: number;
  genderData: Record<string, {
    population: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  wardData: Record<number, {
    totalHouseheads: number;
    genders: Record<string, number>;
    primaryGender: string;
    primaryGenderPercentage: number;
  }>;
  genderIndicators: {
    maleHouseheads: number;
    maleHouseheadPercentage: number;
    femaleHouseheads: number;
    femaleHouseheadPercentage: number;
    otherHouseheads: number;
    otherHouseheadPercentage: number;
    genderRatio: number; // males per 100 females
    femaleEmpowermentIndex: number; // percentage of female househeads
  };
  socialIndicators: {
    traditionalGenderRoles: boolean;
    genderEqualityLevel: string;
    femaleLeadership: string;
    socialProgress: string;
  };
}

export const GENDER_LABELS: Record<string, string> = {
  MALE: "पुरुष",
  FEMALE: "महिला",
  OTHER: "अन्य",
};

export function processHouseheadGenderData(rawData: HouseheadGenderData[]): ProcessedHouseheadGenderData {
  if (!rawData || rawData.length === 0) {
    return {
      totalHouseheads: 0,
      genderData: {},
      wardData: {},
      genderIndicators: {
        maleHouseheads: 0,
        maleHouseheadPercentage: 0,
        femaleHouseheads: 0,
        femaleHouseheadPercentage: 0,
        otherHouseheads: 0,
        otherHouseheadPercentage: 0,
        genderRatio: 0,
        femaleEmpowermentIndex: 0,
      },
      socialIndicators: {
        traditionalGenderRoles: true,
        genderEqualityLevel: "कम",
        femaleLeadership: "कम",
        socialProgress: "धीमा",
      },
    };
  }

  // Debug: Log raw data for troubleshooting
  console.log("Raw househead gender data:", rawData);

  // Calculate total househeads
  const totalHouseheads = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process gender data - aggregate by gender across all wards
  const genderAggregated: Record<string, number> = {};
  rawData.forEach((item) => {
    const gender = item.gender;
    genderAggregated[gender] = (genderAggregated[gender] || 0) + (item.population || 0);
  });

  // Debug: Log aggregated data
  console.log("Gender aggregated data:", genderAggregated);

  // Sort genders by population and create gender data
  const sortedGenders = Object.entries(genderAggregated)
    .sort(([, a], [, b]) => b - a);

  const genderData: Record<string, any> = {};
  sortedGenders.forEach(([gender, population], index) => {
    const percentage = totalHouseheads > 0 ? (population / totalHouseheads) * 100 : 0;
    genderData[gender] = {
      population,
      percentage,
      label: GENDER_LABELS[gender] || gender,
      rank: index + 1,
    };
  });

  // Process ward data - aggregate by gender and ward
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  // Debug: Log unique wards
  console.log("Unique wards:", uniqueWards);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalHouseheads = wardItems.reduce((sum, item) => sum + item.population, 0);
    const wardGenders: Record<string, number> = {};
    
    // Debug: Log ward items
    console.log(`Ward ${wardNum} items:`, wardItems);
    
    // Aggregate by gender for this ward
    const wardGenderAggregated: Record<string, number> = {};
    wardItems.forEach(item => {
      wardGenderAggregated[item.gender] = (wardGenderAggregated[item.gender] || 0) + item.population;
    });

    // Copy aggregated data to wardGenders
    Object.entries(wardGenderAggregated).forEach(([gender, population]) => {
      wardGenders[gender] = population;
    });

    // Debug: Log ward genders
    console.log(`Ward ${wardNum} genders:`, wardGenders);

    // Find primary gender for this ward
    const sortedWardGenders = Object.entries(wardGenderAggregated).sort(([, a], [, b]) => b - a);
    const primaryGender = sortedWardGenders[0]?.[0] || '';
    const primaryGenderPercentage = wardTotalHouseheads > 0 
      ? (sortedWardGenders[0]?.[1] || 0) / wardTotalHouseheads * 100 
      : 0;

    wardData[wardNum] = {
      totalHouseheads: wardTotalHouseheads,
      genders: wardGenders,
      primaryGender,
      primaryGenderPercentage,
    };
  });

  // Debug: Log final ward data
  console.log("Final ward data:", wardData);

  // Calculate gender indicators
  const maleHouseheads = genderData.MALE?.population || 0;
  const femaleHouseheads = genderData.FEMALE?.population || 0;
  const otherHouseheads = genderData.OTHER?.population || 0;

  const maleHouseheadPercentage = totalHouseheads > 0 ? (maleHouseheads / totalHouseheads) * 100 : 0;
  const femaleHouseheadPercentage = totalHouseheads > 0 ? (femaleHouseheads / totalHouseheads) * 100 : 0;
  const otherHouseheadPercentage = totalHouseheads > 0 ? (otherHouseheads / totalHouseheads) * 100 : 0;

  // Gender ratio (males per 100 females)
  const genderRatio = femaleHouseheads > 0 ? (maleHouseheads / femaleHouseheads) * 100 : 0;

  // Female empowerment index (percentage of female househeads)
  const femaleEmpowermentIndex = femaleHouseheadPercentage;

  // Calculate social indicators
  let traditionalGenderRoles = true;
  let genderEqualityLevel = "कम";
  let femaleLeadership = "कम";
  let socialProgress = "धीमा";

  if (femaleHouseheadPercentage >= 30) {
    traditionalGenderRoles = false;
    genderEqualityLevel = "उच्च";
    femaleLeadership = "उच्च";
    socialProgress = "राम्रो";
  } else if (femaleHouseheadPercentage >= 15) {
    traditionalGenderRoles = false;
    genderEqualityLevel = "मध्यम";
    femaleLeadership = "मध्यम";
    socialProgress = "मध्यम";
  }

  return {
    totalHouseheads,
    genderData,
    wardData,
    genderIndicators: {
      maleHouseheads,
      maleHouseheadPercentage,
      femaleHouseheads,
      femaleHouseheadPercentage,
      otherHouseheads,
      otherHouseheadPercentage,
      genderRatio,
      femaleEmpowermentIndex,
    },
    socialIndicators: {
      traditionalGenderRoles,
      genderEqualityLevel,
      femaleLeadership,
      socialProgress,
    },
  };
}

export function generateHouseheadGenderAnalysis(data: ProcessedHouseheadGenderData): string {
  if (data.totalHouseheads === 0) {
    return "घरमुखी लिङ्ग वितरण सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary
  analysisParts.push(
    `गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalHouseheads)} घरमुखी रहेका छन्।`
  );

  // Gender distribution analysis
  const indicators = data.genderIndicators;
  
  if (indicators.maleHouseheads > 0) {
    analysisParts.push(
      `पुरुष घरमुखीको संख्या ${convertToNepaliNumber(indicators.maleHouseheads)} जना (${formatNepaliPercentage(indicators.maleHouseheadPercentage)}) रहेको छ।`
    );
  }

  if (indicators.femaleHouseheads > 0) {
    analysisParts.push(
      `महिला घरमुखीको संख्या ${convertToNepaliNumber(indicators.femaleHouseheads)} जना (${formatNepaliPercentage(indicators.femaleHouseheadPercentage)}) रहेको छ।`
    );
  }

  if (indicators.otherHouseheads > 0) {
    analysisParts.push(
      `अन्य लिङ्गका घरमुखीको संख्या ${convertToNepaliNumber(indicators.otherHouseheads)} जना (${formatNepaliPercentage(indicators.otherHouseheadPercentage)}) रहेको छ।`
    );
  }

  // Gender ratio analysis
  if (indicators.genderRatio > 0) {
    const genderRatioFixed = parseFloat(indicators.genderRatio.toFixed(1));
    analysisParts.push(
      `लिङ्ग अनुपात ${convertToNepaliNumber(genderRatioFixed)}% रहेको छ (प्रति १०० महिला घरमुखीमा ${convertToNepaliNumber(genderRatioFixed)} पुरुष घरमुखी)।`
    );
  }

  // Female empowerment analysis
  if (indicators.femaleEmpowermentIndex > 0) {
    const femaleEmpowermentFixed = parseFloat(indicators.femaleEmpowermentIndex.toFixed(1));
    analysisParts.push(
      `महिला सशक्तिकरण सूचकांक ${convertToNepaliNumber(femaleEmpowermentFixed)}% रहेको छ।`
    );
  }

  // Social indicators analysis
  const socialIndicators = data.socialIndicators;
  
  if (socialIndicators.traditionalGenderRoles) {
    analysisParts.push(
      "परम्परागत लिङ्ग भूमिकाहरू प्रचलित रहेका छन्।"
    );
  } else {
    analysisParts.push(
      "आधुनिक लिङ्ग भूमिकाहरू विकसित भएका छन्।"
    );
  }

  analysisParts.push(
    `लिङ्ग समानता स्तर ${socialIndicators.genderEqualityLevel} रहेको छ।`
  );

  analysisParts.push(
    `महिला नेतृत्व स्तर ${socialIndicators.femaleLeadership} रहेको छ।`
  );

  analysisParts.push(
    `सामाजिक प्रगति ${socialIndicators.socialProgress} रहेको छ।`
  );

  // Ward-wise analysis
  const wardAnalysis = Object.entries(data.wardData)
    .sort(([, a], [, b]) => b.totalHouseheads - a.totalHouseheads);

  if (wardAnalysis.length > 0) {
    const highestWard = wardAnalysis[0];
    const lowestWard = wardAnalysis[wardAnalysis.length - 1];
    
    analysisParts.push(
      `वडा अनुसार हेर्दा, वडा ${convertToNepaliNumber(parseInt(highestWard[0]))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard[1].totalHouseheads)} घरमुखी रहेका छन्।`
    );

    if (lowestWard[0] !== highestWard[0]) {
      analysisParts.push(
        `सबैभन्दा कम वडा ${convertToNepaliNumber(parseInt(lowestWard[0]))} मा ${convertToNepaliNumber(lowestWard[1].totalHouseheads)} घरमुखी रहेका छन्।`
      );
    }

    // Find ward with highest female househeads
    const wardWithHighestFemales = Object.entries(data.wardData)
      .sort(([, a], [, b]) => (b.genders.FEMALE || 0) - (a.genders.FEMALE || 0))[0];
    
    if (wardWithHighestFemales && wardWithHighestFemales[1].genders.FEMALE > 0) {
      analysisParts.push(
        `सबैभन्दा बढी महिला घरमुखी वडा ${convertToNepaliNumber(parseInt(wardWithHighestFemales[0]))} मा ${convertToNepaliNumber(wardWithHighestFemales[1].genders.FEMALE)} जना रहेका छन्।`
      );
    }
  }

  // Policy implications
  if (indicators.femaleEmpowermentIndex < 20) {
    analysisParts.push(
      "महिला सशक्तिकरण र लिङ्ग समानता कार्यक्रमहरूको विस्तार आवश्यक छ।"
    );
  } else if (indicators.femaleEmpowermentIndex >= 30) {
    analysisParts.push(
      "महिला सशक्तिकरणमा सकारात्मक प्रगति देखिएको छ।"
    );
  }

  analysisParts.push(
    "यी तथ्याङ्कहरू लिङ्ग समानता, महिला सशक्तिकरण र सामाजिक विकास कार्यक्रमहरूको योजना र कार्यान्वयनका लागि महत्त्वपूर्ण आधार हो।"
  );

  return analysisParts.join(" ");
}

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, (digit) => nepaliDigits[parseInt(digit)]);
}

export function formatNepaliPercentage(percentage: number): string {
  const percentageFixed = parseFloat(percentage.toFixed(1));
  return convertToNepaliNumber(percentageFixed) + '%';
} 