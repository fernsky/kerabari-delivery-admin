export interface RemittanceExpenseData {
  wardNumber: number;
  expenseType: string;
  count: number;
  percentage: number;
}

export interface ProcessedRemittanceExpenseData {
  wardNumber: number;
  food: number;
  education: number;
  health: number;
  clothing: number;
  housing: number;
  entertainment: number;
  other: number;
  total: number;
  foodPercentage: number;
  educationPercentage: number;
  healthPercentage: number;
  clothingPercentage: number;
  housingPercentage: number;
  entertainmentPercentage: number;
  otherPercentage: number;
}

export const EXPENSE_TYPE_LABELS: Record<string, string> = {
  food: "खाना र किराना",
  education: "शिक्षा",
  health: "स्वास्थ्य र चिकित्सा",
  clothing: "लुगा र व्यक्तिगत हेरचाह",
  housing: "आवास र उपयोगिता",
  entertainment: "मनोरञ्जन र मनोविनोद",
  other: "अन्य खर्च",
};

export const EXPENSE_TYPE_COLORS: Record<string, string> = {
  food: "#10b981",
  education: "#3b82f6",
  health: "#ef4444",
  clothing: "#f59e0b",
  housing: "#8b5cf6",
  entertainment: "#06b6d4",
  other: "#6b7280",
};

export function processRemittanceExpenseData(rawData: RemittanceExpenseData[]): ProcessedRemittanceExpenseData[] {
  const wardMap = new Map<number, ProcessedRemittanceExpenseData>();

  // Initialize ward data
  rawData.forEach(item => {
    if (!wardMap.has(item.wardNumber)) {
      wardMap.set(item.wardNumber, {
        wardNumber: item.wardNumber,
        food: 0,
        education: 0,
        health: 0,
        clothing: 0,
        housing: 0,
        entertainment: 0,
        other: 0,
        total: 0,
        foodPercentage: 0,
        educationPercentage: 0,
        healthPercentage: 0,
        clothingPercentage: 0,
        housingPercentage: 0,
        entertainmentPercentage: 0,
        otherPercentage: 0,
      });
    }
  });

  // Populate data
  rawData.forEach(item => {
    const ward = wardMap.get(item.wardNumber)!;
    const expenseType = item.expenseType.toLowerCase();
    
    if (expenseType in EXPENSE_TYPE_LABELS) {
      (ward as any)[expenseType] = item.count;
      ward.total += item.count;
    }
  });

  // Calculate percentages
  wardMap.forEach(ward => {
    if (ward.total > 0) {
      ward.foodPercentage = (ward.food / ward.total) * 100;
      ward.educationPercentage = (ward.education / ward.total) * 100;
      ward.healthPercentage = (ward.health / ward.total) * 100;
      ward.clothingPercentage = (ward.clothing / ward.total) * 100;
      ward.housingPercentage = (ward.housing / ward.total) * 100;
      ward.entertainmentPercentage = (ward.entertainment / ward.total) * 100;
      ward.otherPercentage = (ward.other / ward.total) * 100;
    }
  });

  return Array.from(wardMap.values()).sort((a, b) => a.wardNumber - b.wardNumber);
}

export function getRemittanceExpenseAnalysis(data: ProcessedRemittanceExpenseData[]): string {
  if (data.length === 0) {
    return "रिमिटेन्स खर्च सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const totalHouseholds = data.reduce((sum, ward) => sum + ward.total, 0);
  const avgFoodPercentage = data.reduce((sum, ward) => sum + ward.foodPercentage, 0) / data.length;
  const avgEducationPercentage = data.reduce((sum, ward) => sum + ward.educationPercentage, 0) / data.length;
  const avgHealthPercentage = data.reduce((sum, ward) => sum + ward.healthPercentage, 0) / data.length;

  // Find wards with highest and lowest food expenses
  const sortedByFood = [...data].sort((a, b) => b.foodPercentage - a.foodPercentage);
  const highestFoodWard = sortedByFood[0];
  const lowestFoodWard = sortedByFood[sortedByFood.length - 1];

  // Find wards with highest education expenses
  const sortedByEducation = [...data].sort((a, b) => b.educationPercentage - a.educationPercentage);
  const highestEducationWard = sortedByEducation[0];

  // Find wards with highest health expenses
  const sortedByHealth = [...data].sort((a, b) => b.healthPercentage - a.healthPercentage);
  const highestHealthWard = sortedByHealth[0];

  let analysis = `गाउँपालिकाका ${convertToNepaliNumber(data.length)} वटा वडाहरूमा रिमिटेन्स खर्चको विश्लेषणले खर्च प्रवृत्तिमा महत्त्वपूर्ण भिन्नता देखाउँछ। `;
  
  analysis += `औसतमा, घरधनीहरूले आफ्नो रिमिटेन्स आम्दानीको ${convertToNepaliNumber(parseFloat(avgFoodPercentage.toFixed(1)))}% खाना र किरानामा, `;
  analysis += `${convertToNepaliNumber(parseFloat(avgEducationPercentage.toFixed(1)))}% शिक्षामा, र ${convertToNepaliNumber(parseFloat(avgHealthPercentage.toFixed(1)))}% स्वास्थ्य र चिकित्सामा खर्च गर्दै आएका छन्। `;

  if (highestFoodWard && lowestFoodWard) {
    analysis += `वडा नं. ${convertToNepaliNumber(highestFoodWard.wardNumber)} मा सबैभन्दा बढी ${convertToNepaliNumber(parseFloat(highestFoodWard.foodPercentage.toFixed(1)))}% खाना खर्च रहेको छ भने `;
    analysis += `वडा नं. ${convertToNepaliNumber(lowestFoodWard.wardNumber)} मा सबैभन्दा कम ${convertToNepaliNumber(parseFloat(lowestFoodWard.foodPercentage.toFixed(1)))}% मात्र खाना खर्च रहेको छ। `;
  }

  if (highestEducationWard) {
    analysis += `शिक्षा खर्च सबैभन्दा बढी वडा नं. ${convertToNepaliNumber(highestEducationWard.wardNumber)} मा ${convertToNepaliNumber(parseFloat(highestEducationWard.educationPercentage.toFixed(1)))}% रहेको छ, `;
    analysis += `जसले यस क्षेत्रमा शैक्षिक लगानीमा बलियो जोड दिइएको संकेत गर्दछ। `;
  }

  if (highestHealthWard) {
    analysis += `स्वास्थ्य र चिकित्सा खर्च सबैभन्दा बढी वडा नं. ${convertToNepaliNumber(highestHealthWard.wardNumber)} मा ${convertToNepaliNumber(parseFloat(highestHealthWard.healthPercentage.toFixed(1)))}% रहेको छ, `;
    analysis += `जसले यस वडामा उच्च स्वास्थ्य सेवा आवश्यकता वा लागत रहेको सुझाव दिन्छ। `;
  }

  analysis += `यी प्रवृत्तिहरूले विभिन्न वडाहरूमा भिन्न आर्थिक प्राथमिकता र जीवनस्तरलाई प्रतिबिम्बित गर्दछ, `;
  analysis += `जहाँ केही क्षेत्रहरूले आधारभूत आवश्यकता जस्तै खानामा प्राथमिकता दिन्छन् भने अरू क्षेत्रहरूले शिक्षा र स्वास्थ्य लगानीमा बढी ध्यान दिन्छन्। `;
  analysis += `यो तथ्याङ्कले घरधनी खर्च प्रवृत्ति र आर्थिक प्राथमिकताहरूलाई बुझ्न महत्त्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ। `;
  analysis += `रिमिटेन्स खर्चको यस्तो वितरणले गाउँपालिकाको विभिन्न भौगोलिक क्षेत्रहरूमा आर्थिक प्राथमिकताहरूलाई थप आकार दिन्छ।`;

  return analysis;
}

export function getTopExpenseCategories(data: ProcessedRemittanceExpenseData[]): Array<{category: string, total: number, percentage: number}> {
  if (data.length === 0) return [];

  const totals = {
    food: data.reduce((sum, ward) => sum + ward.food, 0),
    education: data.reduce((sum, ward) => sum + ward.education, 0),
    health: data.reduce((sum, ward) => sum + ward.health, 0),
    clothing: data.reduce((sum, ward) => sum + ward.clothing, 0),
    housing: data.reduce((sum, ward) => sum + ward.housing, 0),
    entertainment: data.reduce((sum, ward) => sum + ward.entertainment, 0),
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