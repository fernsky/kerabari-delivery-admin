import { HouseholdBaseTypeEnum } from "@/server/api/routers/profile/economics/ward-wise-household-base.schema";

export interface WardWiseHouseBaseData {
  id: string;
  wardNumber: number;
  baseType: keyof typeof HouseholdBaseTypeEnum.enum;
  households: number;
}

export interface ProcessedWardWiseHouseBaseData {
  totalHouseholds: number;
  baseData: Record<string, {
    households: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  wardData: Record<number, {
    totalHouseholds: number;
    baseTypes: Record<string, number>;
    primaryBaseType: string;
    primaryBasePercentage: number;
    baseTypeCount: number;
  }>;
  topBaseTypes: Array<{
    baseType: string;
    households: number;
    percentage: number;
    label: string;
  }>;
  baseCategories: {
    modern: number;
    traditional: number;
    mixed: number;
    other: number;
  };
}

export const HOUSE_BASE_LABELS: Record<string, string> = {
  CONCRETE_PILLAR: "ढलान पिल्लरसहितको",
  CEMENT_JOINED: "सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा",
  MUD_JOINED: "माटोको जोडाइ भएको इँटा/ढुङ्गा",
  WOOD_POLE: "काठको खम्बा गाडेको",
  OTHER: "अन्य",
};

export const BASE_CATEGORIES: Record<string, string[]> = {
  modern: ["CONCRETE_PILLAR", "CEMENT_JOINED"],
  traditional: ["MUD_JOINED", "WOOD_POLE"],
  mixed: [],
  other: ["OTHER"],
};

export function processWardWiseHouseBaseData(rawData: WardWiseHouseBaseData[]): ProcessedWardWiseHouseBaseData {
  if (!rawData || rawData.length === 0) {
    return {
      totalHouseholds: 0,
      baseData: {},
      wardData: {},
      topBaseTypes: [],
      baseCategories: {
        modern: 0,
        traditional: 0,
        mixed: 0,
        other: 0,
      },
    };
  }

  // Calculate total households
  const totalHouseholds = rawData.reduce((sum, item) => sum + (item.households || 0), 0);

  // Process base data
  const baseData: Record<string, any> = {};
  const allBaseTypes: Array<any> = [];

  rawData.forEach((item, index) => {
    const percentage = totalHouseholds > 0 ? (item.households / totalHouseholds) * 100 : 0;
    const baseInfo = {
      households: item.households,
      percentage,
      label: HOUSE_BASE_LABELS[item.baseType] || item.baseType,
      rank: index + 1,
    };

    if (baseData[item.baseType]) {
      baseData[item.baseType].households += item.households;
      baseData[item.baseType].percentage = totalHouseholds > 0 ? (baseData[item.baseType].households / totalHouseholds) * 100 : 0;
    } else {
      baseData[item.baseType] = baseInfo;
      allBaseTypes.push({
        baseType: item.baseType,
        ...baseInfo,
      });
    }
  });

  // Sort base types by households
  allBaseTypes.sort((a, b) => b.households - a.households);

  // Update ranks after sorting
  allBaseTypes.forEach((baseType, index) => {
    baseData[baseType.baseType].rank = index + 1;
  });

  // Get top 5 base types
  const topBaseTypes = allBaseTypes.slice(0, 5).map(baseType => ({
    baseType: baseType.baseType,
    households: baseType.households,
    percentage: baseType.percentage,
    label: baseType.label,
  }));

  // Process ward data
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalHouseholds = wardItems.reduce((sum, item) => sum + item.households, 0);
    const wardBaseTypes: Record<string, number> = {};
    
    wardItems.forEach(item => {
      if (wardBaseTypes[item.baseType]) {
        wardBaseTypes[item.baseType] += item.households;
      } else {
        wardBaseTypes[item.baseType] = item.households;
      }
    });

    // Find primary base type for this ward
    const sortedWardBaseTypes = Object.entries(wardBaseTypes).sort(([, a], [, b]) => b - a);
    const primaryBaseType = sortedWardBaseTypes[0]?.[0] || '';
    const primaryBasePercentage = wardTotalHouseholds > 0 
      ? (sortedWardBaseTypes[0]?.[1] || 0) / wardTotalHouseholds * 100 
      : 0;

    wardData[wardNum] = {
      totalHouseholds: wardTotalHouseholds,
      baseTypes: wardBaseTypes,
      primaryBaseType,
      primaryBasePercentage,
      baseTypeCount: Object.keys(wardBaseTypes).length,
    };
  });

  // Calculate base categories
  const baseCategories = {
    modern: 0,
    traditional: 0,
    mixed: 0,
    other: 0,
  };

  Object.entries(baseData).forEach(([baseType, data]) => {
    if (BASE_CATEGORIES.modern.includes(baseType)) {
      baseCategories.modern += data.households;
    } else if (BASE_CATEGORIES.traditional.includes(baseType)) {
      baseCategories.traditional += data.households;
    } else if (BASE_CATEGORIES.mixed.includes(baseType)) {
      baseCategories.mixed += data.households;
    } else {
      baseCategories.other += data.households;
    }
  });

  return {
    totalHouseholds,
    baseData,
    wardData,
    topBaseTypes,
    baseCategories,
  };
}

export function generateWardWiseHouseBaseAnalysis(data: ProcessedWardWiseHouseBaseData): string {
  if (data.totalHouseholds === 0) {
    return "घरको जग सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary
  analysisParts.push(
    `गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalHouseholds)} घरपरिवार रहेका छन्।`
  );

  // Top base types analysis
  if (data.topBaseTypes.length > 0) {
    const topBaseType = data.topBaseTypes[0];
    analysisParts.push(
      `सबैभन्दा बढी घरपरिवार ${topBaseType.label} जगमा रहेका छन् जसमा ${convertToNepaliNumber(topBaseType.households)} घरपरिवार (${formatNepaliPercentage(topBaseType.percentage)}) समावेश छन्।`
    );

    if (data.topBaseTypes.length > 1) {
      const secondBaseType = data.topBaseTypes[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondBaseType.label} रहेको छ जसमा ${convertToNepaliNumber(secondBaseType.households)} घरपरिवार (${formatNepaliPercentage(secondBaseType.percentage)}) समावेश छन्।`
      );
    }
  }

  // Base categories analysis
  const categories = data.baseCategories;
  const totalInCategories = categories.modern + categories.traditional + categories.mixed + categories.other;
  
  if (totalInCategories > 0) {
    const modernPercentage = (categories.modern / totalInCategories) * 100;
    const traditionalPercentage = (categories.traditional / totalInCategories) * 100;
    const mixedPercentage = (categories.mixed / totalInCategories) * 100;

    analysisParts.push(
      `जगको वर्गीकरण अनुसार, आधुनिक जगमा ${convertToNepaliNumber(categories.modern)} घरपरिवार (${formatNepaliPercentage(modernPercentage)}), परम्परागत जगमा ${convertToNepaliNumber(categories.traditional)} घरपरिवार (${formatNepaliPercentage(traditionalPercentage)}), र मिश्रित जगमा ${convertToNepaliNumber(categories.mixed)} घरपरिवार (${formatNepaliPercentage(mixedPercentage)}) समावेश छन्।`
    );
  }

  // Ward-wise analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalHouseholds > max.totalHouseholds ? { wardNum, ...wardData } : max
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, baseTypes: {}, primaryBaseType: '', primaryBasePercentage: 0, baseTypeCount: 0 });
    const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
      wardData.totalHouseholds < min.totalHouseholds ? { wardNum, ...wardData } : min
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, baseTypes: {}, primaryBaseType: '', primaryBasePercentage: 0, baseTypeCount: 0 });

    analysisParts.push(
      `वडाको आधारमा हेर्दा, वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalHouseholds)} घरपरिवार रहेका छन् भने वडा नं. ${convertToNepaliNumber(parseInt(lowestWard.wardNum))} मा सबैभन्दा कम ${convertToNepaliNumber(lowestWard.totalHouseholds)} घरपरिवार रहेका छन्।`
    );
  }

  // Additional insights
  analysisParts.push(
    "यो तथ्याङ्कले गाउँपालिकाको आवासीय निर्माण जगको वितरण र आर्थिक अवस्थाको मूल्याङ्कन गर्न सहयोग गर्दछ। आधुनिक जगको प्रयोगले सुरक्षित र दिगो आवास निर्माणको प्रवृत्ति देखाउँछ। परम्परागत जगको उपस्थिति स्थानीय स्रोत र परम्परागत सीपको निरन्तरतालाई प्रतिनिधित्व गर्दछ। जगको विविधताले आवास निर्माणमा विभिन्न प्रविधि र सामग्रीको प्रयोगलाई संकेत गर्दछ।"
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