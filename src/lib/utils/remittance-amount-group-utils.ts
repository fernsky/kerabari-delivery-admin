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
  }>;
  topAmountGroups: Array<{
    amountGroup: string;
    population: number;
    percentage: number;
    label: string;
  }>;
}

export const REMITTANCE_AMOUNT_GROUP_LABELS: Record<string, string> = {
  NO_REMITTANCE: "रेमिट्यान्स नभएको",
  BELOW_50K: "५० हजारभन्दा कम",
  RS_50K_TO_100K: "५० हजारदेखि १ लाखसम्म",
  RS_100K_TO_200K: "१ लाखदेखि २ लाखसम्म",
  RS_200K_TO_500K: "२ लाखदेखि ५ लाखसम्म",
  ABOVE_500K: "५ लाखभन्दा बढी",
};

export function processRemittanceAmountGroupData(rawData: RemittanceAmountGroupData[]): ProcessedRemittanceAmountGroupData {
  if (!rawData || rawData.length === 0) {
    return {
      totalRemittancePopulation: 0,
      amountGroupData: {},
      wardData: {},
      topAmountGroups: [],
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
    };
  });

  return {
    totalRemittancePopulation,
    amountGroupData,
    wardData,
    topAmountGroups,
  };
}

export function generateRemittanceAmountGroupAnalysis(data: ProcessedRemittanceAmountGroupData): string {
  if (data.totalRemittancePopulation === 0) {
    return "रेमिटेन्स रकम समूह सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary
  analysisParts.push(
    `गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalRemittancePopulation)} जना रेमिटेन्स प्राप्त गर्ने जनसंख्या रहेको छ।`
  );

  // Top amount groups analysis
  if (data.topAmountGroups.length > 0) {
    const topAmountGroup = data.topAmountGroups[0];
    analysisParts.push(
      `सबैभन्दा बढी जनाले ${topAmountGroup.label} रकम प्राप्त गर्दै आएका छन् जसमा ${convertToNepaliNumber(topAmountGroup.population)} जना (${formatNepaliPercentage(topAmountGroup.percentage)}) समावेश छन्।`
    );

    if (data.topAmountGroups.length > 1) {
      const secondAmountGroup = data.topAmountGroups[1];
      analysisParts.push(
        `दोस्रो स्थानमा ${secondAmountGroup.label} रकम प्राप्त गर्ने जनसंख्या रहेको छ जसमा ${convertToNepaliNumber(secondAmountGroup.population)} जना (${formatNepaliPercentage(secondAmountGroup.percentage)}) समावेश छन्।`
      );
    }
  }

  // Ward-wise analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalRemittancePopulation > max.totalRemittancePopulation ? { wardNum, ...wardData } : max
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalRemittancePopulation: 0, amountGroups: {}, primaryAmountGroup: '', primaryAmountGroupPercentage: 0 });
    const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
      wardData.totalRemittancePopulation < min.totalRemittancePopulation ? { wardNum, ...wardData } : min
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalRemittancePopulation: 0, amountGroups: {}, primaryAmountGroup: '', primaryAmountGroupPercentage: 0 });

    analysisParts.push(
      `वडाको आधारमा हेर्दा, वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalRemittancePopulation)} जना रेमिटेन्स प्राप्त गर्दै आएका छन् भने वडा नं. ${convertToNepaliNumber(parseInt(lowestWard.wardNum))} मा सबैभन्दा कम ${convertToNepaliNumber(lowestWard.totalRemittancePopulation)} जना रहेका छन्।`
    );
  }

  // Additional insights
  analysisParts.push(
    "यो तथ्याङ्कले गाउँपालिकाको रेमिटेन्स प्रवाहको वितरण र आर्थिक अवस्थाको मूल्याङ्कन गर्न सहयोग गर्दछ।"
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