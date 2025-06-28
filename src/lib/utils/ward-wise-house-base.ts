export interface WardWiseHouseBaseData {
  wardNumber: number;
  baseType: string;
  count: number;
}

export interface ProcessedWardWiseHouseBaseData {
  wardNumber: number;
  concretePillar: number;
  cementJoined: number;
  mudJoined: number;
  woodPole: number;
  other: number;
  total: number;
  concretePillarPercentage: number;
  cementJoinedPercentage: number;
  mudJoinedPercentage: number;
  woodPolePercentage: number;
  otherPercentage: number;
}

export const BASE_TYPE_LABELS: Record<string, string> = {
  CONCRETE_PILLAR: "ढलान पिल्लरसहितको",
  CEMENT_JOINED: "सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा",
  MUD_JOINED: "माटोको जोडाइ भएको इँटा/ढुङ्गा",
  WOOD_POLE: "काठको खम्बा गाडेको",
  OTHER: "अन्य",
};

export const BASE_TYPE_COLORS: Record<string, string> = {
  CONCRETE_PILLAR: "#10b981",
  CEMENT_JOINED: "#3b82f6",
  MUD_JOINED: "#f59e0b",
  WOOD_POLE: "#ef4444",
  OTHER: "#8b5cf6",
};

export function processWardWiseHouseBaseData(rawData: WardWiseHouseBaseData[]): ProcessedWardWiseHouseBaseData[] {
  const wardMap = new Map<number, ProcessedWardWiseHouseBaseData>();

  // Initialize ward data
  rawData.forEach(item => {
    if (!wardMap.has(item.wardNumber)) {
      wardMap.set(item.wardNumber, {
        wardNumber: item.wardNumber,
        concretePillar: 0,
        cementJoined: 0,
        mudJoined: 0,
        woodPole: 0,
        other: 0,
        total: 0,
        concretePillarPercentage: 0,
        cementJoinedPercentage: 0,
        mudJoinedPercentage: 0,
        woodPolePercentage: 0,
        otherPercentage: 0,
      });
    }
  });

  // Populate data
  rawData.forEach(item => {
    const ward = wardMap.get(item.wardNumber)!;
    const baseType = item.baseType;
    
    // Map enum values to processed data properties
    switch (baseType) {
      case 'CONCRETE_PILLAR':
        ward.concretePillar = item.count;
        break;
      case 'CEMENT_JOINED':
        ward.cementJoined = item.count;
        break;
      case 'MUD_JOINED':
        ward.mudJoined = item.count;
        break;
      case 'WOOD_POLE':
        ward.woodPole = item.count;
        break;
      case 'OTHER':
        ward.other = item.count;
        break;
    }
    ward.total += item.count;
  });

  // Calculate percentages
  wardMap.forEach(ward => {
    if (ward.total > 0) {
      ward.concretePillarPercentage = (ward.concretePillar / ward.total) * 100;
      ward.cementJoinedPercentage = (ward.cementJoined / ward.total) * 100;
      ward.mudJoinedPercentage = (ward.mudJoined / ward.total) * 100;
      ward.woodPolePercentage = (ward.woodPole / ward.total) * 100;
      ward.otherPercentage = (ward.other / ward.total) * 100;
    }
  });

  return Array.from(wardMap.values()).sort((a, b) => a.wardNumber - b.wardNumber);
}

export function getWardWiseHouseBaseAnalysis(data: ProcessedWardWiseHouseBaseData[]): string {
  if (data.length === 0) {
    return "वडा अनुसार घरको आधार सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const totalHouseholds = data.reduce((sum, ward) => sum + ward.total, 0);
  const avgConcretePillarPercentage = data.reduce((sum, ward) => sum + ward.concretePillarPercentage, 0) / data.length;
  const avgCementJoinedPercentage = data.reduce((sum, ward) => sum + ward.cementJoinedPercentage, 0) / data.length;
  const avgMudJoinedPercentage = data.reduce((sum, ward) => sum + ward.mudJoinedPercentage, 0) / data.length;
  const avgWoodPolePercentage = data.reduce((sum, ward) => sum + ward.woodPolePercentage, 0) / data.length;
  const avgOtherPercentage = data.reduce((sum, ward) => sum + ward.otherPercentage, 0) / data.length;

  // Find wards with highest and lowest concrete pillar rates
  const sortedByConcretePillar = [...data].sort((a, b) => b.concretePillarPercentage - a.concretePillarPercentage);
  const highestConcretePillarWard = sortedByConcretePillar[0];
  const lowestConcretePillarWard = sortedByConcretePillar[sortedByConcretePillar.length - 1];

  // Find wards with highest mud joined rates
  const sortedByMudJoined = [...data].sort((a, b) => b.mudJoinedPercentage - a.mudJoinedPercentage);
  const highestMudJoinedWard = sortedByMudJoined[0];

  let analysis = `गाउँपालिकाका ${convertToNepaliNumber(data.length)} वटा वडाहरूमा घरको आधार/फाउन्डेसन निर्माणको विश्लेषणले भवन पूर्वाधार गुणस्तरमा महत्त्वपूर्ण भिन्नता देखाउँछ। `;
  
  analysis += `औसतमा, ${convertToNepaliNumber(parseFloat(avgConcretePillarPercentage.toFixed(1)))}% घरहरूमा ढलान पिल्लरसहितको आधार रहेका छन्, `;
  analysis += `${convertToNepaliNumber(parseFloat(avgCementJoinedPercentage.toFixed(1)))}% मा सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा रहेका छन्, `;
  analysis += `${convertToNepaliNumber(parseFloat(avgMudJoinedPercentage.toFixed(1)))}% मा माटोको जोडाइ भएको इँटा/ढुङ्गा रहेका छन्, `;
  analysis += `${convertToNepaliNumber(parseFloat(avgWoodPolePercentage.toFixed(1)))}% मा काठको खम्बा गाडेको रहेका छन्, र `;
  analysis += `${convertToNepaliNumber(parseFloat(avgOtherPercentage.toFixed(1)))}% मा अन्य प्रकारको आधार रहेका छन्। `;

  if (highestConcretePillarWard && lowestConcretePillarWard) {
    analysis += `वडा नं. ${convertToNepaliNumber(highestConcretePillarWard.wardNumber)} मा सबैभन्दा बढी ${convertToNepaliNumber(parseFloat(highestConcretePillarWard.concretePillarPercentage.toFixed(1)))}% ढलान पिल्लरसहितको आधार रहेका छन् भने `;
    analysis += `वडा नं. ${convertToNepaliNumber(lowestConcretePillarWard.wardNumber)} मा सबैभन्दा कम ${convertToNepaliNumber(parseFloat(lowestConcretePillarWard.concretePillarPercentage.toFixed(1)))}% मात्र ढलान पिल्लरसहितको आधार रहेका छन्। `;
  }

  if (highestMudJoinedWard) {
    analysis += `माटोको जोडाइ भएको इँटा/ढुङ्गाको दर सबैभन्दा बढी वडा नं. ${convertToNepaliNumber(highestMudJoinedWard.wardNumber)} मा ${convertToNepaliNumber(parseFloat(highestMudJoinedWard.mudJoinedPercentage.toFixed(1)))}% रहेको छ, `;
    analysis += `जसले यस्ता क्षेत्रहरूमा पूर्वाधार विकास र आवास सुधार कार्यक्रमहरूको आवश्यकतालाई संकेत गर्दछ। `;
  }

  analysis += `यी प्रवृत्तिहरूले विभिन्न वडाहरूमा पूर्वाधार विकास र निर्माण मानकहरूको विभिन्न स्तरलाई प्रतिबिम्बित गर्दछ, `;
  analysis += `जहाँ केही क्षेत्रहरूमा उच्च भवन गुणस्तर देखिन्छ भने अरू क्षेत्रहरूमा विकास सहयोगको आवश्यकता रहेको छ। `;
  analysis += `यो तथ्याङ्कले आवास पूर्वाधार गुणस्तर, विकास आवश्यकता र निर्माण मानकहरूलाई बुझ्न महत्त्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ। `;
  analysis += `आधार निर्माणको यस्तो वितरणले गाउँपालिकाको समग्र विकास स्थिति र भविष्यका निर्माण योजनाहरूलाई थप आकार दिन्छ।`;

  return analysis;
}

export function getTopBaseCategories(data: ProcessedWardWiseHouseBaseData[]): Array<{category: string, total: number, percentage: number}> {
  if (data.length === 0) return [];

  const totals = {
    concretePillar: data.reduce((sum, ward) => sum + ward.concretePillar, 0),
    cementJoined: data.reduce((sum, ward) => sum + ward.cementJoined, 0),
    mudJoined: data.reduce((sum, ward) => sum + ward.mudJoined, 0),
    woodPole: data.reduce((sum, ward) => sum + ward.woodPole, 0),
    other: data.reduce((sum, ward) => sum + ward.other, 0),
  };

  const grandTotal = Object.values(totals).reduce((sum, total) => sum + total, 0);

  return Object.entries(totals)
    .map(([category, total]) => ({
      category,
      total,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, (d) => nepaliDigits[parseInt(d)]);
}

export function formatNepaliPercentage(percentage: number): string {
  return `${convertToNepaliNumber(Math.round(percentage * 10) / 10)}%`;
} 
 