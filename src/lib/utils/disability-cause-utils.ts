import { DisabilityCause } from "@/server/api/routers/profile/demographics/ward-wise-disability-cause.schema";

export interface DisabilityCauseData {
  id: string;
  wardNumber: number;
  disabilityCause: DisabilityCause;
  population: number;
  disabilityCauseDisplay?: string;
}

export interface ProcessedDisabilityCauseData {
  totalPopulationWithDisability: number;
  disabilityCauseData: Record<string, {
    population: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  majorDisabilityCauses: Array<{
    disabilityCause: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  minorDisabilityCauses: Array<{
    disabilityCause: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  otherDisabilityCauses: Array<{
    disabilityCause: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  diversityIndex: number;
  dominantDisabilityCause: {
    disabilityCause: string;
    population: number;
    percentage: number;
    label: string;
  } | null;
  wardData: Record<number, {
    totalDisabilityPopulation: number;
    disabilityCauses: Record<string, number>;
    primaryDisabilityCause: string;
    primaryDisabilityCausePercentage: number;
  }>;
  disabilityIndicators: {
    congenitalDisabilities: number;
    congenitalPercentage: number;
    accidentRelatedDisabilities: number;
    accidentPercentage: number;
    diseaseRelatedDisabilities: number;
    diseasePercentage: number;
    malnutritionDisabilities: number;
    malnutritionPercentage: number;
    conflictRelatedDisabilities: number;
    conflictPercentage: number;
  };
}

export const DISABILITY_CAUSE_LABELS: Record<string, string> = {
  CONGENITAL: "जन्मजात",
  ACCIDENT: "दुर्घटना",
  MALNUTRITION: "कुपोषण",
  DISEASE: "रोग",
  CONFLICT: "द्वन्द्व",
  OTHER: "अन्य",
};

export function processDisabilityCauseData(rawData: DisabilityCauseData[]): ProcessedDisabilityCauseData {
  if (!rawData || rawData.length === 0) {
    return {
      totalPopulationWithDisability: 0,
      disabilityCauseData: {},
      majorDisabilityCauses: [],
      minorDisabilityCauses: [],
      otherDisabilityCauses: [],
      diversityIndex: 0,
      dominantDisabilityCause: null,
      wardData: {},
      disabilityIndicators: {
        congenitalDisabilities: 0,
        congenitalPercentage: 0,
        accidentRelatedDisabilities: 0,
        accidentPercentage: 0,
        diseaseRelatedDisabilities: 0,
        diseasePercentage: 0,
        malnutritionDisabilities: 0,
        malnutritionPercentage: 0,
        conflictRelatedDisabilities: 0,
        conflictPercentage: 0,
      },
    };
  }

  // Calculate total population with disabilities
  const totalPopulationWithDisability = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process disability cause data
  const disabilityCauseData: Record<string, any> = {};
  const allDisabilityCauses: Array<any> = [];

  rawData.forEach((item, index) => {
    const percentage = totalPopulationWithDisability > 0 ? (item.population / totalPopulationWithDisability) * 100 : 0;
    const disabilityCauseInfo = {
      population: item.population,
      percentage,
      label: item.disabilityCauseDisplay || DISABILITY_CAUSE_LABELS[item.disabilityCause] || item.disabilityCause,
      rank: index + 1,
    };

    disabilityCauseData[item.disabilityCause] = disabilityCauseInfo;
    allDisabilityCauses.push({
      disabilityCause: item.disabilityCause,
      ...disabilityCauseInfo,
    });
  });

  // Sort disability causes by population
  allDisabilityCauses.sort((a, b) => b.population - a.population);

  // Update ranks after sorting
  allDisabilityCauses.forEach((disabilityCause, index) => {
    disabilityCauseData[disabilityCause.disabilityCause].rank = index + 1;
  });

  // Categorize disability causes
  const majorDisabilityCauses = allDisabilityCauses.filter(disabilityCause => disabilityCause.percentage >= 10);
  const minorDisabilityCauses = allDisabilityCauses.filter(disabilityCause => disabilityCause.percentage < 10 && disabilityCause.percentage >= 5);
  const otherDisabilityCauses = allDisabilityCauses.filter(disabilityCause => disabilityCause.percentage < 5);

  // Calculate diversity index (Simpson's Diversity Index)
  const diversityIndex = totalPopulationWithDisability > 0 
    ? 1 - allDisabilityCauses.reduce((sum, disabilityCause) => {
        const p = disabilityCause.population / totalPopulationWithDisability;
        return sum + (p * p);
      }, 0)
    : 0;

  // Find dominant disability cause
  const dominantDisabilityCause = allDisabilityCauses.length > 0 ? allDisabilityCauses[0] : null;

  // Process ward data
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalDisabilityPopulation = wardItems.reduce((sum, item) => sum + item.population, 0);
    const wardDisabilityCauses: Record<string, number> = {};
    
    wardItems.forEach(item => {
      wardDisabilityCauses[item.disabilityCause] = item.population;
    });

    // Find primary disability cause for this ward
    const sortedWardCauses = wardItems.sort((a, b) => b.population - a.population);
    const primaryDisabilityCause = sortedWardCauses[0]?.disabilityCause || '';
    const primaryDisabilityCausePercentage = wardTotalDisabilityPopulation > 0 
      ? (sortedWardCauses[0]?.population || 0) / wardTotalDisabilityPopulation * 100 
      : 0;

    wardData[wardNum] = {
      totalDisabilityPopulation: wardTotalDisabilityPopulation,
      disabilityCauses: wardDisabilityCauses,
      primaryDisabilityCause,
      primaryDisabilityCausePercentage,
    };
  });

  // Calculate disability indicators
  const congenitalDisabilities = disabilityCauseData.CONGENITAL?.population || 0;
  const accidentRelatedDisabilities = disabilityCauseData.ACCIDENT?.population || 0;
  const diseaseRelatedDisabilities = disabilityCauseData.DISEASE?.population || 0;
  const malnutritionDisabilities = disabilityCauseData.MALNUTRITION?.population || 0;
  const conflictRelatedDisabilities = disabilityCauseData.CONFLICT?.population || 0;

  const congenitalPercentage = totalPopulationWithDisability > 0 ? (congenitalDisabilities / totalPopulationWithDisability) * 100 : 0;
  const accidentPercentage = totalPopulationWithDisability > 0 ? (accidentRelatedDisabilities / totalPopulationWithDisability) * 100 : 0;
  const diseasePercentage = totalPopulationWithDisability > 0 ? (diseaseRelatedDisabilities / totalPopulationWithDisability) * 100 : 0;
  const malnutritionPercentage = totalPopulationWithDisability > 0 ? (malnutritionDisabilities / totalPopulationWithDisability) * 100 : 0;
  const conflictPercentage = totalPopulationWithDisability > 0 ? (conflictRelatedDisabilities / totalPopulationWithDisability) * 100 : 0;

  return {
    totalPopulationWithDisability,
    disabilityCauseData,
    majorDisabilityCauses,
    minorDisabilityCauses,
    otherDisabilityCauses,
    diversityIndex,
    dominantDisabilityCause,
    wardData,
    disabilityIndicators: {
      congenitalDisabilities,
      congenitalPercentage,
      accidentRelatedDisabilities,
      accidentPercentage,
      diseaseRelatedDisabilities,
      diseasePercentage,
      malnutritionDisabilities,
      malnutritionPercentage,
      conflictRelatedDisabilities,
      conflictPercentage,
    },
  };
}

export function generateDisabilityCauseAnalysis(data: ProcessedDisabilityCauseData): string {
  if (data.totalPopulationWithDisability === 0) {
    return "अपाङ्गता सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary
  analysisParts.push(
    `गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalPopulationWithDisability)} जना अपाङ्गता भएका व्यक्तिहरू रहेका छन्।`
  );

  // Dominant disability cause analysis
  if (data.dominantDisabilityCause) {
    analysisParts.push(
      `सबैभन्दा प्रमुख अपाङ्गताको कारण ${data.dominantDisabilityCause.label} रहेको छ, जसमा ${convertToNepaliNumber(data.dominantDisabilityCause.population)} जना (${formatNepaliPercentage(data.dominantDisabilityCause.percentage)}) रहेका छन्।`
    );
  }

  // Major disability causes analysis
  if (data.majorDisabilityCauses.length > 0) {
    const majorCausesText = data.majorDisabilityCauses
      .map(cause => `${cause.label} (${convertToNepaliNumber(cause.population)} जना, ${formatNepaliPercentage(cause.percentage)})`)
      .join(', ');
    analysisParts.push(
      `प्रमुख अपाङ्गताका कारणहरूमा ${majorCausesText} समावेश छन्।`
    );
  }

  // Minor disability causes analysis
  if (data.minorDisabilityCauses.length > 0) {
    const minorCausesText = data.minorDisabilityCauses
      .map(cause => `${cause.label} (${convertToNepaliNumber(cause.population)} जना, ${formatNepaliPercentage(cause.percentage)})`)
      .join(', ');
    analysisParts.push(
      `मध्यम अपाङ्गताका कारणहरूमा ${minorCausesText} समावेश छन्।`
    );
  }

  // Other disability causes analysis
  if (data.otherDisabilityCauses.length > 0) {
    const otherCausesText = data.otherDisabilityCauses
      .map(cause => `${cause.label} (${convertToNepaliNumber(cause.population)} जना, ${formatNepaliPercentage(cause.percentage)})`)
      .join(', ');
    analysisParts.push(
      `अन्य अपाङ्गताका कारणहरूमा ${otherCausesText} समावेश छन्।`
    );
  }

  // Diversity analysis
  if (data.diversityIndex > 0.6) {
    analysisParts.push(
      "अपाङ्गताका कारणहरूमा धेरै विविधता रहेको छ (विविधता सूचकांक: " + 
      convertToNepaliNumber(parseFloat((data.diversityIndex * 100).toFixed(1))) + "%)।"
    );
  } else if (data.diversityIndex > 0.4) {
    analysisParts.push(
      "अपाङ्गताका कारणहरूमा मध्यम विविधता रहेको छ (विविधता सूचकांक: " + 
      convertToNepaliNumber(parseFloat((data.diversityIndex * 100).toFixed(1))) + "%)।"
    );
  } else {
    analysisParts.push(
      "अपाङ्गताका कारणहरूमा कम विविधता रहेको छ (विविधता सूचकांक: " + 
      convertToNepaliNumber(parseFloat((data.diversityIndex * 100).toFixed(1))) + "%)।"
    );
  }

  // Disability indicators analysis
  const indicators = data.disabilityIndicators;
  if (indicators.congenitalDisabilities > 0) {
    analysisParts.push(
      `जन्मजात अपाङ्गता भएका व्यक्तिहरू ${convertToNepaliNumber(indicators.congenitalDisabilities)} जना (${formatNepaliPercentage(indicators.congenitalPercentage)}) रहेका छन्।`
    );
  }

  if (indicators.accidentRelatedDisabilities > 0) {
    analysisParts.push(
      `दुर्घटना सम्बन्धी अपाङ्गता भएका व्यक्तिहरू ${convertToNepaliNumber(indicators.accidentRelatedDisabilities)} जना (${formatNepaliPercentage(indicators.accidentPercentage)}) रहेका छन्।`
    );
  }

  if (indicators.diseaseRelatedDisabilities > 0) {
    analysisParts.push(
      `रोग सम्बन्धी अपाङ्गता भएका व्यक्तिहरू ${convertToNepaliNumber(indicators.diseaseRelatedDisabilities)} जना (${formatNepaliPercentage(indicators.diseasePercentage)}) रहेका छन्।`
    );
  }

  if (indicators.malnutritionDisabilities > 0) {
    analysisParts.push(
      `कुपोषण सम्बन्धी अपाङ्गता भएका व्यक्तिहरू ${convertToNepaliNumber(indicators.malnutritionDisabilities)} जना (${formatNepaliPercentage(indicators.malnutritionPercentage)}) रहेका छन्।`
    );
  }

  if (indicators.conflictRelatedDisabilities > 0) {
    analysisParts.push(
      `द्वन्द्व सम्बन्धी अपाङ्गता भएका व्यक्तिहरू ${convertToNepaliNumber(indicators.conflictRelatedDisabilities)} जना (${formatNepaliPercentage(indicators.conflictPercentage)}) रहेका छन्।`
    );
  }

  // Ward-wise analysis
  const wardEntries = Object.entries(data.wardData);
  if (wardEntries.length > 0) {
    const sortedWards = wardEntries.sort((a, b) => b[1].totalDisabilityPopulation - a[1].totalDisabilityPopulation);
    const highestWard = sortedWards[0];
    const lowestWard = sortedWards[sortedWards.length - 1];
    
    analysisParts.push(
      `वडा अनुसार हेर्दा, वडा ${convertToNepaliNumber(parseInt(highestWard[0]))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard[1].totalDisabilityPopulation)} जना अपाङ्गता भएका व्यक्तिहरू रहेका छन्।`
    );

    if (lowestWard[0] !== highestWard[0]) {
      analysisParts.push(
        `सबैभन्दा कम वडा ${convertToNepaliNumber(parseInt(lowestWard[0]))} मा ${convertToNepaliNumber(lowestWard[1].totalDisabilityPopulation)} जना अपाङ्गता भएका व्यक्तिहरू रहेका छन्।`
      );
    }
  }

  // Policy implications
  analysisParts.push(
    "यी तथ्याङ्कहरू अपाङ्गता निवारण, पुनर्स्थापना र सामाजिक सुरक्षा कार्यक्रमहरूको योजना र कार्यान्वयनका लागि महत्त्वपूर्ण आधार हो।"
  );

  return analysisParts.join(' ');
}

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits: Record<string, string> = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
  };
  
  return num.toString().replace(/[0-9]/g, (digit) => nepaliDigits[digit] || digit);
}

export function formatNepaliPercentage(percentage: number): string {
  return convertToNepaliNumber(parseFloat(percentage.toFixed(1))) + '%';
} 