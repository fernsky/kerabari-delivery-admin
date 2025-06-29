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
  UNKNOWN: "अज्ञात",
  congenital: "जन्मजात",
  accident: "दुर्घटना",
  malnutrition: "कुपोषण",
  disease: "रोग",
  conflict: "द्वन्द्व",
  other: "अन्य",
  unknown: "अज्ञात",
};

// Function to normalize disability cause enum values
function normalizeDisabilityCause(cause: string): string {
  const normalized = cause.toLowerCase();
  // Map to standard enum values
  const mapping: Record<string, string> = {
    'congenital': 'CONGENITAL',
    'accident': 'ACCIDENT',
    'malnutrition': 'MALNUTRITION',
    'disease': 'DISEASE',
    'conflict': 'CONFLICT',
    'other': 'OTHER',
    'unknown': 'UNKNOWN',
  };
  return mapping[normalized] || cause;
}

// Function to get proper label for disability cause
function getDisabilityCauseLabel(cause: string): string {
  const normalized = normalizeDisabilityCause(cause);
  return DISABILITY_CAUSE_LABELS[normalized] || DISABILITY_CAUSE_LABELS[cause] || cause;
}

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

  // Process disability cause data - aggregate by disability cause
  const disabilityCauseAggregated: Record<string, number> = {};
  rawData.forEach((item) => {
    const disabilityCause = item.disabilityCause;
    disabilityCauseAggregated[disabilityCause] = (disabilityCauseAggregated[disabilityCause] || 0) + (item.population || 0);
  });

  // Sort disability causes by population and take top 10
  const sortedDisabilityCauses = Object.entries(disabilityCauseAggregated)
    .sort(([, a], [, b]) => b - a);

  const top10DisabilityCauses = sortedDisabilityCauses.slice(0, 10);
  const otherDisabilityCausesRaw = sortedDisabilityCauses.slice(10);

  // Calculate total for "other" category
  const otherTotal = otherDisabilityCausesRaw.reduce((sum, [, population]) => sum + population, 0);

  // Process disability cause data with top 10 + other
  const disabilityCauseData: Record<string, any> = {};
  const allDisabilityCauses: Array<any> = [];

  // Add top 10 disability causes
  top10DisabilityCauses.forEach(([disabilityCause, population], index) => {
    const percentage = totalPopulationWithDisability > 0 ? (population / totalPopulationWithDisability) * 100 : 0;
    const disabilityCauseInfo = {
      population,
      percentage,
      label: getDisabilityCauseLabel(disabilityCause),
      rank: index + 1,
    };

    disabilityCauseData[disabilityCause] = disabilityCauseInfo;
    allDisabilityCauses.push({
      disabilityCause,
      ...disabilityCauseInfo,
    });
  });

  // Add "other" category if there are other disability causes
  if (otherTotal > 0) {
    const otherPercentage = totalPopulationWithDisability > 0 ? (otherTotal / totalPopulationWithDisability) * 100 : 0;
    const otherInfo = {
      population: otherTotal,
      percentage: otherPercentage,
      label: "अन्य",
      rank: 11,
    };

    disabilityCauseData["OTHER"] = otherInfo;
    allDisabilityCauses.push({
      disabilityCause: "OTHER",
      ...otherInfo,
    });
  }

  // Categorize disability causes
  const majorDisabilityCauses = allDisabilityCauses.filter(disabilityCause => disabilityCause.percentage >= 5);
  const minorDisabilityCauses = allDisabilityCauses.filter(disabilityCause => disabilityCause.percentage < 5 && disabilityCause.percentage >= 1);
  const otherDisabilityCauses = allDisabilityCauses.filter(disabilityCause => disabilityCause.percentage < 1);

  // Calculate diversity index (Simpson's Diversity Index)
  const diversityIndex = totalPopulationWithDisability > 0 
    ? 1 - allDisabilityCauses.reduce((sum, disabilityCause) => {
        const p = disabilityCause.population / totalPopulationWithDisability;
        return sum + (p * p);
      }, 0)
    : 0;

  // Find dominant disability cause
  const dominantDisabilityCause = allDisabilityCauses.length > 0 ? allDisabilityCauses[0] : null;

  // Process ward data with proper aggregation
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalDisabilityPopulation = wardItems.reduce((sum, item) => sum + item.population, 0);
    const wardDisabilityCauses: Record<string, number> = {};
    
    // Aggregate disability causes for this ward
    const wardDisabilityCauseAggregated: Record<string, number> = {};
    wardItems.forEach(item => {
      wardDisabilityCauseAggregated[item.disabilityCause] = (wardDisabilityCauseAggregated[item.disabilityCause] || 0) + item.population;
    });

    // Sort ward disability causes and take top 10 + other
    const sortedWardCauses = Object.entries(wardDisabilityCauseAggregated)
      .sort(([, a], [, b]) => b - a);

    const top10WardCauses = sortedWardCauses.slice(0, 10);
    const otherWardCauses = sortedWardCauses.slice(10);
    const otherWardTotal = otherWardCauses.reduce((sum, [, population]) => sum + population, 0);

    // Add top 10 ward disability causes
    top10WardCauses.forEach(([disabilityCause, population]) => {
      const label = getDisabilityCauseLabel(disabilityCause);
      wardDisabilityCauses[label] = population;
    });

    // Add "other" category if needed
    if (otherWardTotal > 0) {
      wardDisabilityCauses["अन्य"] = otherWardTotal;
    }

    // Find primary disability cause for this ward
    const primaryDisabilityCause = top10WardCauses[0]?.[0] || '';
    const primaryDisabilityCausePercentage = wardTotalDisabilityPopulation > 0 
      ? (top10WardCauses[0]?.[1] || 0) / wardTotalDisabilityPopulation * 100 
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

  const analysis = [];
  
  // Constitutional and public health context
  analysis.push("नेपालको संविधान २०७२ ले अपाङ्गता भएका व्यक्तिहरूको अधिकार र सुरक्षालाई मौलिक अधिकारको रूपमा मान्यता दिएको छ र सरकारलाई तिनको पुनर्स्थापना, शिक्षा र रोजगारीको अवसर प्रदान गर्ने जिम्मेवारी दिएको छ। बुद्धशान्ति गाउँपालिकामा अपाङ्गताका कारणहरूको विश्लेषणले स्थानीय स्वास्थ्य चुनौतीहरू र तिनको समाधानका लागि आवश्यक नीतिगत दिशानिर्देशहरू प्रदान गर्दछ।");

  // Overall disability analysis
  analysis.push(`गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalPopulationWithDisability)} जना अपाङ्गता भएका व्यक्तिहरू रहेका छन्, जसले स्थानीय स्वास्थ्य स्थिति र सामाजिक सुरक्षा चुनौतीहरूको महत्वपूर्ण सूचक हो। यी तथ्याङ्कहरूले अपाङ्गता निवारण, पुनर्स्थापना र सामाजिक सुरक्षा कार्यक्रमहरूको विकासका लागि आधारभूत जानकारी प्रदान गर्दछन्।`);

  // Dominant disability cause analysis
  if (data.dominantDisabilityCause) {
    const dominancePercentage = data.dominantDisabilityCause.percentage;
    let dominanceAnalysis = "";
    
    if (dominancePercentage > 40) {
      dominanceAnalysis = `गाउँपालिकामा ${data.dominantDisabilityCause.label} को कारणले स्पष्ट प्रभुत्व (${formatNepaliPercentage(dominancePercentage)}) रहेको छ, जसले यस क्षेत्रमा विशेष स्वास्थ्य चुनौती रहेको संकेत गर्दछ। यस्तो उच्च एकाग्रताले लक्षित स्वास्थ्य हस्तक्षेप र रोग नियन्त्रण कार्यक्रमहरूको आवश्यकतालाई जनाउँछ।`;
    } else if (dominancePercentage > 25) {
      dominanceAnalysis = `${data.dominantDisabilityCause.label} को कारणले सापेक्षिक बहुमत (${formatNepaliPercentage(dominancePercentage)}) रहेको छ, तर अन्य कारणहरूको उपस्थितिले विविध स्वास्थ्य चुनौतीहरू रहेको देखाउँछ। यस अवस्थाले समग्र स्वास्थ्य सेवा र रोग नियन्त्रणमा सन्तुलित दृष्टिकोण अपनाउन आवश्यक छ।`;
    } else {
      dominanceAnalysis = `${data.dominantDisabilityCause.label} को कारणले सापेक्षिक बहुलता (${formatNepaliPercentage(dominancePercentage)}) रहेको छ, जसले अपेक्षाकृत विविध अपाङ्गताका कारणहरू रहेको संकेत गर्दछ।`;
    }
    
    analysis.push(dominanceAnalysis);
  }

  // Disability indicators analysis
  const congenitalRate = data.disabilityIndicators.congenitalPercentage;
  const accidentRate = data.disabilityIndicators.accidentPercentage;
  const diseaseRate = data.disabilityIndicators.diseasePercentage;
  const malnutritionRate = data.disabilityIndicators.malnutritionPercentage;
  const conflictRate = data.disabilityIndicators.conflictPercentage;

  analysis.push(`अपाङ्गता सूचकहरूको विश्लेषण गर्दा जन्मजात अपाङ्गता ${formatNepaliPercentage(congenitalRate)} रहेको छ, जसले मातृ स्वास्थ्य र प्रसवपूर्व देखभालमा सुधारको आवश्यकतालाई जनाउँछ। दुर्घटना सम्बन्धी अपाङ्गता ${formatNepaliPercentage(accidentRate)} रहेको छ, जसले सुरक्षा उपायहरू र दुर्घटना नियन्त्रण कार्यक्रमहरूको आवश्यकतालाई जनाउँछ। रोग सम्बन्धी अपाङ्गता ${formatNepaliPercentage(diseaseRate)} रहेको छ, जसले स्वास्थ्य सेवा र रोग नियन्त्रणमा विशेष ध्यान दिन आवश्यक छ। कुपोषण सम्बन्धी अपाङ्गता ${formatNepaliPercentage(malnutritionRate)} रहेको छ, जसले पोषण कार्यक्रमहरूको आवश्यकतालाई जनाउँछ। द्वन्द्व सम्बन्धी अपाङ्गता ${formatNepaliPercentage(conflictRate)} रहेको छ, जसले शान्ति र सुरक्षा कार्यक्रमहरूको महत्वलाई उजागर गर्दछ।`);

  // Detailed disability cause analysis
  if (data.majorDisabilityCauses.length > 0) {
    const majorCausesList = data.majorDisabilityCauses.slice(1, 5).map(cause => 
      `${cause.label} ${convertToNepaliNumber(cause.population)} (${formatNepaliPercentage(cause.percentage)})`
    );
    
    if (majorCausesList.length > 0) {
      analysis.push(`अन्य प्रमुख अपाङ्गताका कारणहरूमा ${majorCausesList.join(', ')} रहेका छन्। यी कारणहरूको विश्लेषणले स्थानीय स्वास्थ्य प्राथमिकताहरू र लक्षित हस्तक्षेपहरूको आवश्यकतालाई जनाउँछ।`);
    }
  }

  // Ward-wise variation analysis
  const wardCount = Object.keys(data.wardData).length;
  const wardVariations = Object.entries(data.wardData).map(([wardNum, wardInfo]) => {
    const primaryCauseLabel = getDisabilityCauseLabel(wardInfo.primaryDisabilityCause);
    return `वडा ${convertToNepaliNumber(parseInt(wardNum))} मा ${primaryCauseLabel} (${formatNepaliPercentage(wardInfo.primaryDisabilityCausePercentage)})`;
  });

  analysis.push(`गाउँपालिकाका ${convertToNepaliNumber(wardCount)} वटा वडाहरूमा अपाङ्गताका कारणहरूको वितरणमा भिन्नता देखिन्छ: ${wardVariations.join(', ')}। यस्तो भिन्नताले स्थानीय स्तरमा विशिष्ट स्वास्थ्य चुनौतीहरू रहेको संकेत गर्दछ र वडागत स्वास्थ्य योजना र कार्यक्रमहरूको आवश्यकतालाई जनाउँछ।`);

  // Public health implications
  analysis.push("अपाङ्गताका कारणहरूको यस्तो विश्लेषणले सार्वजनिक स्वास्थ्य नीति र कार्यक्रमहरूको विकासमा महत्वपूर्ण भूमिका खेल्छ। जन्मजात अपाङ्गताको उच्च प्रतिशतले मातृ स्वास्थ्य सेवा, प्रसवपूर्व देखभाल र आनुवंशिक परामर्श कार्यक्रमहरूको आवश्यकतालाई जनाउँछ। दुर्घटना सम्बन्धी अपाङ्गताको उपस्थितिले सुरक्षा उपायहरू, यातायात सुरक्षा र कार्यस्थल सुरक्षा कार्यक्रमहरूको महत्वलाई उजागर गर्दछ। रोग सम्बन्धी अपाङ्गताको उच्च दरले स्वास्थ्य शिक्षा, रोग नियन्त्रण र पुनर्स्थापना सेवाहरूको आवश्यकतालाई जनाउँछ।");

  // Healthcare infrastructure analysis
  analysis.push("यस्तो तथ्याङ्कले स्वास्थ्य सेवा सुविधाहरूको विकास र सुधारमा महत्वपूर्ण निर्देशन प्रदान गर्दछ। पुनर्स्थापना केन्द्रहरूको सुदृढीकरण, विशेष शिक्षा सेवाहरूको विस्तार र सामाजिक सुरक्षा कार्यक्रमहरूको सुधार आवश्यक छ। साथै, स्वास्थ्य कर्मचारीहरूको क्षमता विकास, स्वास्थ्य सूचना प्रणालीको सुदृढीकरण र सामुदायिक स्वास्थ्य कार्यक्रमहरूको विस्तार गर्न आवश्यक छ।");

  // Future recommendations
  analysis.push("भविष्यमा अपाङ्गताका कारणहरूको नियमित निगरानी र विश्लेषण गर्ने प्रणाली विकास गर्न आवश्यक छ। यसले समयमै स्वास्थ्य चुनौतीहरू पहिचान गर्न र तिनको समाधानका लागि तत्काल कार्यवाही गर्न सहयोग गर्छ। साथै, सामुदायिक सहभागिता, स्वास्थ्य शिक्षा र रोकथाममूलक स्वास्थ्य कार्यक्रमहरूको विस्तार गर्दै स्वास्थ्य साक्षरता बढाउन आवश्यक छ। गाउँपालिका सबै नागरिकहरूको स्वास्थ्य र कल्याण सुनिश्चित गर्ने लक्ष्यमा निरन्तर कार्यरत रहनेछ।");

  return analysis.join(" ");
}

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, (digit) => nepaliDigits[parseInt(digit)]);
}

export function formatNepaliPercentage(percentage: number): string {
  return convertToNepaliNumber(parseFloat(percentage.toFixed(1))) + '%';
} 