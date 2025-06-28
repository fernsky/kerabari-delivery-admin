export interface WardWiseHouseOuterWallData {
  wardNumber: number;
  outerWallType: string;
  count: number;
  percentage: number;
}

export interface ProcessedWardWiseHouseOuterWallData {
  wardNumber: number;
  pucca: number;
  semiPucca: number;
  kachcha: number;
  other: number;
  total: number;
  puccaPercentage: number;
  semiPuccaPercentage: number;
  kachchaPercentage: number;
  otherPercentage: number;
}

export const OUTER_WALL_TYPE_LABELS: Record<string, string> = {
  pucca: "पक्की",
  semiPucca: "अर्धपक्की",
  kachcha: "कच्ची",
  other: "अन्य",
};

export const OUTER_WALL_TYPE_COLORS: Record<string, string> = {
  pucca: "#10b981",
  semiPucca: "#f59e0b",
  kachcha: "#ef4444",
  other: "#6b7280",
};

export function processWardWiseHouseOuterWallData(rawData: WardWiseHouseOuterWallData[]): ProcessedWardWiseHouseOuterWallData[] {
  const wardMap = new Map<number, ProcessedWardWiseHouseOuterWallData>();

  // Initialize ward data
  rawData.forEach(item => {
    if (!wardMap.has(item.wardNumber)) {
      wardMap.set(item.wardNumber, {
        wardNumber: item.wardNumber,
        pucca: 0,
        semiPucca: 0,
        kachcha: 0,
        other: 0,
        total: 0,
        puccaPercentage: 0,
        semiPuccaPercentage: 0,
        kachchaPercentage: 0,
        otherPercentage: 0,
      });
    }
  });

  // Populate data
  rawData.forEach(item => {
    const ward = wardMap.get(item.wardNumber)!;
    const outerWallType = (item.outerWallType ? item.outerWallType.toLowerCase() : "other");
    
    if (outerWallType in OUTER_WALL_TYPE_LABELS) {
      (ward as any)[outerWallType] = item.count;
      ward.total += item.count;
    }
  });

  // Calculate percentages
  wardMap.forEach(ward => {
    if (ward.total > 0) {
      ward.puccaPercentage = (ward.pucca / ward.total) * 100;
      ward.semiPuccaPercentage = (ward.semiPucca / ward.total) * 100;
      ward.kachchaPercentage = (ward.kachcha / ward.total) * 100;
      ward.otherPercentage = (ward.other / ward.total) * 100;
    }
  });

  return Array.from(wardMap.values()).sort((a, b) => a.wardNumber - b.wardNumber);
}

export function getWardWiseHouseOuterWallAnalysis(data: ProcessedWardWiseHouseOuterWallData[]): string {
  if (data.length === 0) {
    return "वडा अनुसार घरको बाहिरी भित्ता सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const totalHouseholds = data.reduce((sum, ward) => sum + ward.total, 0);
  const avgPuccaPercentage = data.reduce((sum, ward) => sum + ward.puccaPercentage, 0) / data.length;
  const avgSemiPuccaPercentage = data.reduce((sum, ward) => sum + ward.semiPuccaPercentage, 0) / data.length;
  const avgKachchaPercentage = data.reduce((sum, ward) => sum + ward.kachchaPercentage, 0) / data.length;

  // Find wards with highest and lowest pucca wall rates
  const sortedByPucca = [...data].sort((a, b) => b.puccaPercentage - a.puccaPercentage);
  const highestPuccaWard = sortedByPucca[0];
  const lowestPuccaWard = sortedByPucca[sortedByPucca.length - 1];

  // Find wards with highest kachcha wall rates
  const sortedByKachcha = [...data].sort((a, b) => b.kachchaPercentage - a.kachchaPercentage);
  const highestKachchaWard = sortedByKachcha[0];

  let analysis = `गाउँपालिकाका ${convertToNepaliNumber(data.length)} वटा वडाहरूमा घरको बाहिरी भित्ता निर्माणको विश्लेषणले भवन गुणस्तर र पूर्वाधार विकासमा महत्त्वपूर्ण भिन्नता देखाउँछ। `;
  
  analysis += `औसतमा, ${convertToNepaliNumber(parseFloat(avgPuccaPercentage.toFixed(1)))}% घरहरूमा पक्की (स्थायी) बाहिरी भित्ता रहेका छन्, `;
  analysis += `${convertToNepaliNumber(parseFloat(avgSemiPuccaPercentage.toFixed(1)))}% मा अर्धपक्की भित्ता रहेका छन्, र ${convertToNepaliNumber(parseFloat(avgKachchaPercentage.toFixed(1)))}% मा कच्ची (अस्थायी) भित्ता रहेका छन्। `;

  if (highestPuccaWard && lowestPuccaWard) {
    analysis += `वडा नं. ${convertToNepaliNumber(highestPuccaWard.wardNumber)} मा सबैभन्दा बढी ${convertToNepaliNumber(parseFloat(highestPuccaWard.puccaPercentage.toFixed(1)))}% पक्की भित्ता रहेका छन् भने `;
    analysis += `वडा नं. ${convertToNepaliNumber(lowestPuccaWard.wardNumber)} मा सबैभन्दा कम ${convertToNepaliNumber(parseFloat(lowestPuccaWard.puccaPercentage.toFixed(1)))}% मात्र पक्की भित्ता रहेका छन्। `;
  }

  if (highestKachchaWard) {
    analysis += `कच्ची भित्ताको दर सबैभन्दा बढी वडा नं. ${convertToNepaliNumber(highestKachchaWard.wardNumber)} मा ${convertToNepaliNumber(parseFloat(highestKachchaWard.kachchaPercentage.toFixed(1)))}% रहेको छ, `;
    analysis += `जसले यस्ता क्षेत्रहरूमा पूर्वाधार विकास र आवास सुधार कार्यक्रमहरूको आवश्यकतालाई संकेत गर्दछ। `;
  }

  analysis += `यी प्रवृत्तिहरूले विभिन्न वडाहरूमा पूर्वाधार विकास र आर्थिक अवस्थाको विभिन्न स्तरलाई प्रतिबिम्बित गर्दछ, `;
  analysis += `जहाँ केही क्षेत्रहरूमा उच्च निर्माण मानक देखिन्छ भने अरू क्षेत्रहरूमा विकास सहयोगको आवश्यकता रहेको छ। `;
  analysis += `यो तथ्याङ्कले आवास गुणस्तर, पूर्वाधार आवश्यकता र विकास प्राथमिकताहरूलाई बुझ्न महत्त्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ। `;
  analysis += `भित्ता निर्माणको यस्तो वितरणले गाउँपालिकाको समग्र विकास स्थिति र भविष्यका योजनाहरूलाई थप आकार दिन्छ।`;

  return analysis;
}

export function getTopOuterWallCategories(data: ProcessedWardWiseHouseOuterWallData[]): Array<{category: string, total: number, percentage: number}> {
  if (data.length === 0) return [];

  const totals = {
    pucca: data.reduce((sum, ward) => sum + ward.pucca, 0),
    semiPucca: data.reduce((sum, ward) => sum + ward.semiPucca, 0),
    kachcha: data.reduce((sum, ward) => sum + ward.kachcha, 0),
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