import { OuterWallTypeEnum } from "@/server/api/routers/profile/economics/ward-wise-household-outer-wall.schema";

export interface WardWiseHouseOuterWallData {
  id: string;
  wardNumber: number;
  wallType: keyof typeof OuterWallTypeEnum.enum;
  households: number;
}

export interface ProcessedWardWiseHouseOuterWallData {
  totalHouseholds: number;
  wallData: Record<string, {
    households: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  wardData: Record<number, {
    totalHouseholds: number;
    wallTypes: Record<string, number>;
    primaryWallType: string;
    primaryWallPercentage: number;
    wallTypeCount: number;
  }>;
  topWallTypes: Array<{
    wallType: string;
    households: number;
    percentage: number;
    label: string;
  }>;
  wallCategories: {
    modern: number;
    traditional: number;
    mixed: number;
    other: number;
  };
}

export const HOUSE_OUTER_WALL_LABELS: Record<string, string> = {
  CEMENT_JOINED: "सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा",
  UNBAKED_BRICK: "काँचो इँटा",
  MUD_JOINED: "माटोको जोडाइ भएको इँटा/ढुङ्गा",
  TIN: "जस्ता/टिन/च्यादर",
  BAMBOO: "बाँसजन्य सामग्री",
  WOOD: "काठ/फल्याक",
  PREFAB: "प्रि फ्याब",
  OTHER: "अन्य",
};

export const WALL_CATEGORIES: Record<string, string[]> = {
  modern: ["CEMENT_JOINED", "PREFAB"],
  traditional: ["MUD_JOINED", "BAMBOO", "WOOD", "UNBAKED_BRICK"],
  mixed: ["TIN"],
  other: ["OTHER"],
};

export function processWardWiseHouseOuterWallData(rawData: WardWiseHouseOuterWallData[]): ProcessedWardWiseHouseOuterWallData {
  if (!rawData || rawData.length === 0) {
    return {
      totalHouseholds: 0,
      wallData: {},
      wardData: {},
      topWallTypes: [],
      wallCategories: {
        modern: 0,
        traditional: 0,
        mixed: 0,
        other: 0,
      },
    };
  }

  // Calculate total households
  const totalHouseholds = rawData.reduce((sum, item) => sum + (item.households || 0), 0);

  // Process wall data
  const wallData: Record<string, any> = {};
  const allWallTypes: Array<any> = [];

  rawData.forEach((item, index) => {
    const percentage = totalHouseholds > 0 ? (item.households / totalHouseholds) * 100 : 0;
    const wallInfo = {
      households: item.households,
      percentage,
      label: HOUSE_OUTER_WALL_LABELS[item.wallType] || item.wallType,
      rank: index + 1,
    };

    if (wallData[item.wallType]) {
      wallData[item.wallType].households += item.households;
      wallData[item.wallType].percentage = totalHouseholds > 0 ? (wallData[item.wallType].households / totalHouseholds) * 100 : 0;
    } else {
      wallData[item.wallType] = wallInfo;
      allWallTypes.push({
        wallType: item.wallType,
        ...wallInfo,
      });
    }
  });

  // Sort wall types by households
  allWallTypes.sort((a, b) => b.households - a.households);

  // Update ranks after sorting
  allWallTypes.forEach((wallType, index) => {
    wallData[wallType.wallType].rank = index + 1;
  });

  // Get top 5 wall types
  const topWallTypes = allWallTypes.slice(0, 5).map(wallType => ({
    wallType: wallType.wallType,
    households: wallType.households,
    percentage: wallType.percentage,
    label: wallType.label,
  }));

  // Process ward data
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalHouseholds = wardItems.reduce((sum, item) => sum + item.households, 0);
    const wardWallTypes: Record<string, number> = {};
    
    wardItems.forEach(item => {
      if (wardWallTypes[item.wallType]) {
        wardWallTypes[item.wallType] += item.households;
      } else {
        wardWallTypes[item.wallType] = item.households;
      }
    });

    // Find primary wall type for this ward
    const sortedWardWallTypes = Object.entries(wardWallTypes).sort(([, a], [, b]) => b - a);
    const primaryWallType = sortedWardWallTypes[0]?.[0] || '';
    const primaryWallPercentage = wardTotalHouseholds > 0 
      ? (sortedWardWallTypes[0]?.[1] || 0) / wardTotalHouseholds * 100 
      : 0;

    wardData[wardNum] = {
      totalHouseholds: wardTotalHouseholds,
      wallTypes: wardWallTypes,
      primaryWallType,
      primaryWallPercentage,
      wallTypeCount: Object.keys(wardWallTypes).length,
    };
  });

  // Calculate wall categories
  const wallCategories = {
    modern: 0,
    traditional: 0,
    mixed: 0,
    other: 0,
  };

  Object.entries(wallData).forEach(([wallType, data]) => {
    if (WALL_CATEGORIES.modern.includes(wallType)) {
      wallCategories.modern += data.households;
    } else if (WALL_CATEGORIES.traditional.includes(wallType)) {
      wallCategories.traditional += data.households;
    } else if (WALL_CATEGORIES.mixed.includes(wallType)) {
      wallCategories.mixed += data.households;
    } else {
      wallCategories.other += data.households;
    }
  });

  return {
    totalHouseholds,
    wallData,
    wardData,
    topWallTypes,
    wallCategories,
  };
}

export function generateWardWiseHouseOuterWallAnalysis(data: ProcessedWardWiseHouseOuterWallData): string {
  if (data.totalHouseholds === 0) {
    return "घरको बाहिरी गारो सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary
  analysisParts.push(
    `गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalHouseholds)} घरपरिवार रहेका छन्।`
  );

  // Top wall types analysis
  if (data.topWallTypes.length > 0) {
    const topWallType = data.topWallTypes[0];
    analysisParts.push(
      `सबैभन्दा बढी घरपरिवार ${topWallType.label} भएका छन् जसमा ${convertToNepaliNumber(topWallType.households)} घरपरिवार (${formatNepaliPercentage(topWallType.percentage)}) समावेश छन्।`
    );

    if (data.topWallTypes.length > 1) {
      const secondWallType = data.topWallTypes[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondWallType.label} रहेको छ जसमा ${convertToNepaliNumber(secondWallType.households)} घरपरिवार (${formatNepaliPercentage(secondWallType.percentage)}) समावेश छन्।`
      );
    }
  }

  // Wall categories analysis
  const categories = data.wallCategories;
  const totalInCategories = categories.modern + categories.traditional + categories.mixed + categories.other;
  
  if (totalInCategories > 0) {
    const modernPercentage = (categories.modern / totalInCategories) * 100;
    const traditionalPercentage = (categories.traditional / totalInCategories) * 100;
    const mixedPercentage = (categories.mixed / totalInCategories) * 100;

    analysisParts.push(
      `गारोको वर्गीकरण अनुसार, आधुनिक सामग्रीमा ${convertToNepaliNumber(categories.modern)} घरपरिवार (${formatNepaliPercentage(modernPercentage)}), परम्परागत सामग्रीमा ${convertToNepaliNumber(categories.traditional)} घरपरिवार (${formatNepaliPercentage(traditionalPercentage)}), र मिश्रित सामग्रीमा ${convertToNepaliNumber(categories.mixed)} घरपरिवार (${formatNepaliPercentage(mixedPercentage)}) समावेश छन्।`
    );
  }

  // Ward-wise analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalHouseholds > max.totalHouseholds ? { wardNum, ...wardData } : max
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, wallTypes: {}, primaryWallType: '', primaryWallPercentage: 0, wallTypeCount: 0 });
    const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
      wardData.totalHouseholds < min.totalHouseholds ? { wardNum, ...wardData } : min
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, wallTypes: {}, primaryWallType: '', primaryWallPercentage: 0, wallTypeCount: 0 });

    analysisParts.push(
      `वडाको आधारमा हेर्दा, वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalHouseholds)} घरपरिवार रहेका छन् भने वडा नं. ${convertToNepaliNumber(parseInt(lowestWard.wardNum))} मा सबैभन्दा कम ${convertToNepaliNumber(lowestWard.totalHouseholds)} घरपरिवार रहेका छन्।`
    );
  }

  // Additional insights
  analysisParts.push(
    "यो तथ्याङ्कले गाउँपालिकाको आवासीय निर्माण सामग्रीको वितरण र आर्थिक अवस्थाको मूल्याङ्कन गर्न सहयोग गर्दछ। आधुनिक सामग्रीको प्रयोगले सुरक्षित र दिगो आवास निर्माणको प्रवृत्ति देखाउँछ। परम्परागत सामग्रीको उपस्थिति स्थानीय स्रोत र परम्परागत सीपको निरन्तरतालाई प्रतिनिधित्व गर्दछ। मिश्रित सामग्रीको प्रयोगले आवास निर्माणमा विविधता र लचकदारतालाई संकेत गर्दछ।"
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