export interface WardWiseHouseOwnershipData {
  wardNumber: number;
  ownershipType: string;
  count: number;
  percentage: number;
}

export interface ProcessedWardWiseHouseOwnershipData {
  wardNumber: number;
  owned: number;
  rented: number;
  institutional: number;
  other: number;
  total: number;
  ownedPercentage: number;
  rentedPercentage: number;
  institutionalPercentage: number;
  otherPercentage: number;
}

export const OWNERSHIP_TYPE_LABELS: Record<string, string> = {
  owned: "स्वामित्वमा",
  rented: "भाडामा",
  institutional: "संस्थागत",
  other: "अन्य",
};

export const OWNERSHIP_TYPE_COLORS: Record<string, string> = {
  owned: "#10b981",
  rented: "#3b82f6",
  institutional: "#f59e0b",
  other: "#6b7280",
};

export function processWardWiseHouseOwnershipData(rawData: WardWiseHouseOwnershipData[]): ProcessedWardWiseHouseOwnershipData[] {
  const wardMap = new Map<number, ProcessedWardWiseHouseOwnershipData>();

  // Initialize ward data
  rawData.forEach(item => {
    if (!wardMap.has(item.wardNumber)) {
      wardMap.set(item.wardNumber, {
        wardNumber: item.wardNumber,
        owned: 0,
        rented: 0,
        institutional: 0,
        other: 0,
        total: 0,
        ownedPercentage: 0,
        rentedPercentage: 0,
        institutionalPercentage: 0,
        otherPercentage: 0,
      });
    }
  });

  // Populate data
  rawData.forEach(item => {
    const ward = wardMap.get(item.wardNumber)!;
    const ownershipType = item.ownershipType.toLowerCase();
    
    if (ownershipType in OWNERSHIP_TYPE_LABELS) {
      (ward as any)[ownershipType] = item.count;
      ward.total += item.count;
    }
  });

  // Calculate percentages
  wardMap.forEach(ward => {
    if (ward.total > 0) {
      ward.ownedPercentage = (ward.owned / ward.total) * 100;
      ward.rentedPercentage = (ward.rented / ward.total) * 100;
      ward.institutionalPercentage = (ward.institutional / ward.total) * 100;
      ward.otherPercentage = (ward.other / ward.total) * 100;
    }
  });

  return Array.from(wardMap.values()).sort((a, b) => a.wardNumber - b.wardNumber);
}

export function getWardWiseHouseOwnershipAnalysis(data: ProcessedWardWiseHouseOwnershipData[]): string {
  if (data.length === 0) {
    return "वडा अनुसार घर स्वामित्व सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const totalHouseholds = data.reduce((sum, ward) => sum + ward.total, 0);
  const avgOwnedPercentage = data.reduce((sum, ward) => sum + ward.ownedPercentage, 0) / data.length;
  const avgRentedPercentage = data.reduce((sum, ward) => sum + ward.rentedPercentage, 0) / data.length;

  // Find wards with highest and lowest ownership rates
  const sortedByOwned = [...data].sort((a, b) => b.ownedPercentage - a.ownedPercentage);
  const highestOwnedWard = sortedByOwned[0];
  const lowestOwnedWard = sortedByOwned[sortedByOwned.length - 1];

  // Find wards with highest rental rates
  const sortedByRented = [...data].sort((a, b) => b.rentedPercentage - a.rentedPercentage);
  const highestRentedWard = sortedByRented[0];

  let analysis = `गाउँपालिकाका ${convertToNepaliNumber(data.length)} वटा वडाहरूमा घर स्वामित्वको विश्लेषणले विभिन्न क्षेत्रहरूमा आवासीय स्वामित्वको महत्त्वपूर्ण भिन्नता देखाउँछ। `;
  
  analysis += `औसतमा, ${convertToNepaliNumber(parseFloat(avgOwnedPercentage.toFixed(1)))}% घरधनीहरूले आफ्नै घर स्वामित्वमा राख्दै आएका छन् भने ${convertToNepaliNumber(parseFloat(avgRentedPercentage.toFixed(1)))}% घरधनीहरू भाडामा बस्दै आएका छन्। `;

  if (highestOwnedWard && lowestOwnedWard) {
    analysis += `वडा नं. ${convertToNepaliNumber(highestOwnedWard.wardNumber)} मा सबैभन्दा बढी ${convertToNepaliNumber(parseFloat(highestOwnedWard.ownedPercentage.toFixed(1)))}% घर स्वामित्वमा रहेका छन् भने `;
    analysis += `वडा नं. ${convertToNepaliNumber(lowestOwnedWard.wardNumber)} मा सबैभन्दा कम ${convertToNepaliNumber(parseFloat(lowestOwnedWard.ownedPercentage.toFixed(1)))}% मात्र स्वामित्वमा रहेका छन्। `;
  }

  if (highestRentedWard) {
    analysis += `भाडाको दर सबैभन्दा बढी वडा नं. ${convertToNepaliNumber(highestRentedWard.wardNumber)} मा ${convertToNepaliNumber(parseFloat(highestRentedWard.rentedPercentage.toFixed(1)))}% रहेको छ, `;
    analysis += `जसले यस क्षेत्रमा आवास बजारको विभिन्न गतिशीलतालाई संकेत गर्दछ। `;
  }

  analysis += `यी प्रवृत्तिहरूले विभिन्न वडाहरूमा भिन्न आर्थिक अवस्था र आवास नीतिहरूलाई प्रतिबिम्बित गर्दछ, `;
  analysis += `जहाँ केही क्षेत्रहरूमा उच्च सम्पत्ति स्वामित्व दर देखिन्छ भने अरू क्षेत्रहरूमा भाडाको आवास बढी रहेको छ। `;
  analysis += `यो तथ्याङ्कले आवास क्षमता, सम्पत्ति बजार र आर्थिक विकास प्रवृत्तिहरूलाई बुझ्न महत्त्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ। `;
  analysis += `स्वामित्व र भाडाको यस्तो वितरणले गाउँपालिकाको सामाजिक-आर्थिक संरचना र विकास प्राथमिकताहरूलाई थप आकार दिन्छ।`;

  return analysis;
}

export function getTopOwnershipCategories(data: ProcessedWardWiseHouseOwnershipData[]): Array<{category: string, total: number, percentage: number}> {
  if (data.length === 0) return [];

  const totals = {
    owned: data.reduce((sum, ward) => sum + ward.owned, 0),
    rented: data.reduce((sum, ward) => sum + ward.rented, 0),
    institutional: data.reduce((sum, ward) => sum + ward.institutional, 0),
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