import { HouseOwnershipTypeEnum, type WardWiseHouseOwnershipData as SchemaWardWiseHouseOwnershipData } from "@/server/api/routers/profile/economics/ward-wise-house-ownership.schema";

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
}

export const HOUSE_OWNERSHIP_LABELS: Record<string, string> = {
  PRIVATE: "निजी स्वामित्व",
  RENT: "भाडामा",
  INSTITUTIONAL: "संस्थागत स्वामित्व",
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

  return {
    totalHouseholds,
    ownershipData,
    wardData,
    topOwnershipTypes,
    ownershipCategories,
  };
}

export function generateWardWiseHouseOwnershipAnalysis(data: ProcessedWardWiseHouseOwnershipData): string {
  if (data.totalHouseholds === 0) {
    return "घर स्वामित्व सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary
  analysisParts.push(
    `गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalHouseholds)} घरपरिवार रहेका छन्।`
  );

  // Top ownership types analysis
  if (data.topOwnershipTypes.length > 0) {
    const topOwnershipType = data.topOwnershipTypes[0];
    analysisParts.push(
      `सबैभन्दा बढी घरपरिवार ${topOwnershipType.label} मा रहेका छन् जसमा ${convertToNepaliNumber(topOwnershipType.households)} घरपरिवार (${formatNepaliPercentage(topOwnershipType.percentage)}) समावेश छन्।`
    );

    if (data.topOwnershipTypes.length > 1) {
      const secondOwnershipType = data.topOwnershipTypes[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondOwnershipType.label} रहेको छ जसमा ${convertToNepaliNumber(secondOwnershipType.households)} घरपरिवार (${formatNepaliPercentage(secondOwnershipType.percentage)}) समावेश छन्।`
      );
    }
  }

  // Ownership categories analysis
  const categories = data.ownershipCategories;
  const totalInCategories = categories.private + categories.rented + categories.institutional + categories.other;
  
  if (totalInCategories > 0) {
    const privatePercentage = (categories.private / totalInCategories) * 100;
    const rentedPercentage = (categories.rented / totalInCategories) * 100;
    const institutionalPercentage = (categories.institutional / totalInCategories) * 100;

    analysisParts.push(
      `स्वामित्वको वर्गीकरण अनुसार, निजी स्वामित्वमा ${convertToNepaliNumber(categories.private)} घरपरिवार (${formatNepaliPercentage(privatePercentage)}), भाडामा ${convertToNepaliNumber(categories.rented)} घरपरिवार (${formatNepaliPercentage(rentedPercentage)}), र संस्थागत स्वामित्वमा ${convertToNepaliNumber(categories.institutional)} घरपरिवार (${formatNepaliPercentage(institutionalPercentage)}) समावेश छन्।`
    );
  }

  // Ward-wise analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalHouseholds > max.totalHouseholds ? { wardNum, ...wardData } : max
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, ownershipTypes: {}, primaryOwnershipType: '', primaryOwnershipPercentage: 0, ownershipTypeCount: 0 });
    const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
      wardData.totalHouseholds < min.totalHouseholds ? { wardNum, ...wardData } : min
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalHouseholds: 0, ownershipTypes: {}, primaryOwnershipType: '', primaryOwnershipPercentage: 0, ownershipTypeCount: 0 });

    analysisParts.push(
      `वडाको आधारमा हेर्दा, वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalHouseholds)} घरपरिवार रहेका छन् भने वडा नं. ${convertToNepaliNumber(parseInt(lowestWard.wardNum))} मा सबैभन्दा कम ${convertToNepaliNumber(lowestWard.totalHouseholds)} घरपरिवार रहेका छन्।`
    );
  }

  // Additional insights
  analysisParts.push(
    "यो तथ्याङ्कले गाउँपालिकाको आवासीय स्वामित्वको वितरण र आर्थिक अवस्थाको मूल्याङ्कन गर्न सहयोग गर्दछ। निजी स्वामित्वको उच्च अनुपातले आर्थिक स्थायित्व र दीर्घकालीन लगानीको प्रवृत्ति देखाउँछ। भाडामा रहेका घरपरिवारको संख्याले आवासको आवश्यकता र सामाजिक गतिशीलतालाई संकेत गर्दछ। संस्थागत स्वामित्वको उपस्थिति सरकारी र सामुदायिक आवास कार्यक्रमहरूको प्रभावलाई प्रतिनिधित्व गर्दछ।"
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