import { DeathCauseType } from "@/server/api/routers/profile/demographics/ward-wise-death-cause.schema";

export interface DeathCauseData {
  id: string;
  wardNumber: number;
  deathCause: DeathCauseType;
  population: number;
  deathCauseDisplay?: string;
}

export interface ProcessedDeathCauseData {
  totalDeaths: number;
  deathCauseData: Record<string, {
    population: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  majorDeathCauses: Array<{
    deathCause: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  minorDeathCauses: Array<{
    deathCause: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  otherDeathCauses: Array<{
    deathCause: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  diversityIndex: number;
  dominantDeathCause: {
    deathCause: string;
    population: number;
    percentage: number;
    label: string;
  } | null;
  wardData: Record<number, {
    totalDeaths: number;
    deathCauses: Record<string, number>;
    primaryDeathCause: string;
    primaryDeathCausePercentage: number;
  }>;
  healthIndicators: {
    diseaseRelatedDeaths: number;
    diseaseRelatedPercentage: number;
    infectiousDiseaseDeaths: number;
    infectiousDiseasePercentage: number;
    accidentDeaths: number;
    accidentPercentage: number;
    naturalDeaths: number;
    naturalDeathPercentage: number;
  };
}

export const DEATH_CAUSE_LABELS: Record<string, string> = {
  HAIJA: "हैजा",
  PNEUMONIA: "निमोनिया",
  FLU: "फ्लु",
  TUBERCULOSIS: "क्षयरोग",
  LEPROSY: "कुष्ठरोग",
  JAUNDICE_HEPATITIS: "पहेंलो/हेपाटाइटिस",
  TYPHOID: "टाइफाइड",
  VIRAL_INFLUENZA: "भाइरल इन्फ्लुएन्जा",
  ENCEPHALITIS: "एन्सेफालाइटिस",
  MENINGITIS: "मेनिङजाइटिस",
  HEPATITIS: "हेपाटाइटिस",
  MALARIA: "मलेरिया",
  KALA_AZAR: "कालाजार",
  HIV_AIDS: "एचआईभी/एड्स",
  OTHER_SEXUALLY_TRANSMITTED_DISEASES: "अन्य यौन संक्रमित रोगहरू",
  MEASLES: "खसरा",
  SCABIES: "खुजली",
  RABIES: "र्याबिज",
  COVID19_CORONAVIRUS: "कोभिड-१९",
  OTHER_INFECTIOUS_DISEASES: "अन्य संक्रामक रोगहरू",
  HEART_RELATED_DISEASES: "मुटु सम्बन्धी रोगहरू",
  RESPIRATORY_DISEASES: "श्वासप्रश्वास सम्बन्धी रोगहरू",
  ASTHMA: "दम",
  EPILEPSY: "मिर्गी",
  CANCER: "क्यान्सर",
  DIABETES: "मधुमेह",
  KIDNEY_RELATED_DISEASES: "मृगौला सम्बन्धी रोगहरू",
  LIVER_RELATED_DISEASES: "कलेजो सम्बन्धी रोगहरू",
  BRAIN_RELATED: "दिमाग सम्बन्धी",
  BLOOD_PRESSURE: "रक्तचाप",
  GASTRIC_ULCER_INTESTINAL_DISEASE: "पेटको अल्सर/आन्द्रा सम्बन्धी रोग",
  REPRODUCTIVE_OR_OBSTETRIC_CAUSES: "प्रजनन वा प्रसूति सम्बन्धी कारणहरू",
  TRAFFIC_ACCIDENT: "यातायात दुर्घटना",
  OTHER_ACCIDENTS: "अन्य दुर्घटनाहरू",
  SUICIDE: "आत्महत्या",
  NATURAL_DISASTER: "प्राकृतिक प्रकोप",
  DEATH_BY_OLD_AGE: "कालगतिले मर्नु",
  OTHER: "अन्य",
  // Handle any additional death causes that might appear in data
  BLOOD_PRESSURE_HIGH_AND_LOW_BLOOD_PRESSURE: "रक्तचाप (उच्च र निम्न)",
  NOT_STATED: "उल्लेख नगरिएको",
};

export function processDeathCauseData(rawData: DeathCauseData[]): ProcessedDeathCauseData {
  if (!rawData || rawData.length === 0) {
    return {
      totalDeaths: 0,
      deathCauseData: {},
      majorDeathCauses: [],
      minorDeathCauses: [],
      otherDeathCauses: [],
      diversityIndex: 0,
      dominantDeathCause: null,
      wardData: {},
      healthIndicators: {
        diseaseRelatedDeaths: 0,
        diseaseRelatedPercentage: 0,
        infectiousDiseaseDeaths: 0,
        infectiousDiseasePercentage: 0,
        accidentDeaths: 0,
        accidentPercentage: 0,
        naturalDeaths: 0,
        naturalDeathPercentage: 0,
      },
    };
  }

  // Calculate total deaths
  const totalDeaths = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process death cause data - aggregate by death cause
  const deathCauseAggregated: Record<string, number> = {};
  rawData.forEach((item) => {
    const deathCause = item.deathCause;
    deathCauseAggregated[deathCause] = (deathCauseAggregated[deathCause] || 0) + (item.population || 0);
  });

  // Sort death causes by population and take top 10
  const sortedDeathCauses = Object.entries(deathCauseAggregated)
    .sort(([, a], [, b]) => b - a);

  const top10DeathCauses = sortedDeathCauses.slice(0, 10);
  const otherDeathCausesRaw = sortedDeathCauses.slice(10);

  // Calculate total for "other" category
  const otherTotal = otherDeathCausesRaw.reduce((sum, [, population]) => sum + population, 0);

  // Process death cause data with top 10 + other
  const deathCauseData: Record<string, any> = {};
  const allDeathCauses: Array<any> = [];

  // Add top 10 death causes
  top10DeathCauses.forEach(([deathCause, population], index) => {
    const percentage = totalDeaths > 0 ? (population / totalDeaths) * 100 : 0;
    const deathCauseInfo = {
      population,
      percentage,
      label: DEATH_CAUSE_LABELS[deathCause] || deathCause,
      rank: index + 1,
    };

    deathCauseData[deathCause] = deathCauseInfo;
    allDeathCauses.push({
      deathCause,
      ...deathCauseInfo,
    });
  });

  // Add "other" category if there are other death causes
  if (otherTotal > 0) {
    const otherPercentage = totalDeaths > 0 ? (otherTotal / totalDeaths) * 100 : 0;
    const otherInfo = {
      population: otherTotal,
      percentage: otherPercentage,
      label: "अन्य",
      rank: 11,
    };

    deathCauseData["OTHER"] = otherInfo;
    allDeathCauses.push({
      deathCause: "OTHER",
      ...otherInfo,
    });
  }

  // Categorize death causes
  const majorDeathCauses = allDeathCauses.filter(deathCause => deathCause.percentage >= 5);
  const minorDeathCauses = allDeathCauses.filter(deathCause => deathCause.percentage < 5 && deathCause.percentage >= 1);
  const otherDeathCauses = allDeathCauses.filter(deathCause => deathCause.percentage < 1);

  // Calculate diversity index (Simpson's Diversity Index)
  const diversityIndex = totalDeaths > 0 
    ? 1 - allDeathCauses.reduce((sum, deathCause) => {
        const p = deathCause.population / totalDeaths;
        return sum + (p * p);
      }, 0)
    : 0;

  // Find dominant death cause
  const dominantDeathCause = allDeathCauses.length > 0 ? allDeathCauses[0] : null;

  // Process ward data with proper aggregation
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItems = rawData.filter(item => item.wardNumber === wardNum);
    const wardTotalDeaths = wardItems.reduce((sum, item) => sum + item.population, 0);
    const wardDeathCauses: Record<string, number> = {};
    
    // Aggregate death causes for this ward
    const wardDeathCauseAggregated: Record<string, number> = {};
    wardItems.forEach(item => {
      wardDeathCauseAggregated[item.deathCause] = (wardDeathCauseAggregated[item.deathCause] || 0) + item.population;
    });

    // Sort ward death causes and take top 10 + other
    const sortedWardCauses = Object.entries(wardDeathCauseAggregated)
      .sort(([, a], [, b]) => b - a);

    const top10WardCauses = sortedWardCauses.slice(0, 10);
    const otherWardCauses = sortedWardCauses.slice(10);
    const otherWardTotal = otherWardCauses.reduce((sum, [, population]) => sum + population, 0);

    // Add top 10 ward death causes
    top10WardCauses.forEach(([deathCause, population]) => {
      const label = DEATH_CAUSE_LABELS[deathCause] || deathCause;
      wardDeathCauses[label] = population;
    });

    // Add "other" category if needed
    if (otherWardTotal > 0) {
      wardDeathCauses["अन्य"] = otherWardTotal;
    }

    // Find primary death cause for this ward
    const primaryDeathCause = top10WardCauses[0]?.[0] || '';
    const primaryDeathCausePercentage = wardTotalDeaths > 0 
      ? (top10WardCauses[0]?.[1] || 0) / wardTotalDeaths * 100 
      : 0;

    wardData[wardNum] = {
      totalDeaths: wardTotalDeaths,
      deathCauses: wardDeathCauses,
      primaryDeathCause,
      primaryDeathCausePercentage,
    };
  });

  // Calculate health indicators
  const diseaseCategories = [
    "HEART_RELATED_DISEASES", "RESPIRATORY_DISEASES", "BRAIN_RELATED", "CANCER", 
    "DIABETES", "KIDNEY_RELATED_DISEASES", "LIVER_RELATED_DISEASES", "BLOOD_PRESSURE",
    "GASTRIC_ULCER_INTESTINAL_DISEASE", "BLOOD_PRESSURE_HIGH_AND_LOW_BLOOD_PRESSURE"
  ];

  const infectiousCategories = [
    "HAIJA", "PNEUMONIA", "FLU", "TUBERCULOSIS", "LEPROSY", "JAUNDICE_HEPATITIS",
    "TYPHOID", "VIRAL_INFLUENZA", "ENCEPHALITIS", "MENINGITIS", "HEPATITIS",
    "MALARIA", "KALA_AZAR", "HIV_AIDS", "OTHER_SEXUALLY_TRANSMITTED_DISEASES",
    "MEASLES", "SCABIES", "RABIES", "COVID19_CORONAVIRUS", "OTHER_INFECTIOUS_DISEASES"
  ];

  const accidentCategories = [
    "TRAFFIC_ACCIDENT", "OTHER_ACCIDENTS", "SUICIDE", "NATURAL_DISASTER"
  ];

  const naturalCategories = ["DEATH_BY_OLD_AGE"];

  const diseaseRelatedDeaths = rawData
    .filter(item => diseaseCategories.includes(item.deathCause))
    .reduce((sum, item) => sum + item.population, 0);

  const infectiousDiseaseDeaths = rawData
    .filter(item => infectiousCategories.includes(item.deathCause))
    .reduce((sum, item) => sum + item.population, 0);

  const accidentDeaths = rawData
    .filter(item => accidentCategories.includes(item.deathCause))
    .reduce((sum, item) => sum + item.population, 0);

  const naturalDeaths = rawData
    .filter(item => naturalCategories.includes(item.deathCause))
    .reduce((sum, item) => sum + item.population, 0);

  const healthIndicators = {
    diseaseRelatedDeaths,
    diseaseRelatedPercentage: totalDeaths > 0 ? (diseaseRelatedDeaths / totalDeaths) * 100 : 0,
    infectiousDiseaseDeaths,
    infectiousDiseasePercentage: totalDeaths > 0 ? (infectiousDiseaseDeaths / totalDeaths) * 100 : 0,
    accidentDeaths,
    accidentPercentage: totalDeaths > 0 ? (accidentDeaths / totalDeaths) * 100 : 0,
    naturalDeaths,
    naturalDeathPercentage: totalDeaths > 0 ? (naturalDeaths / totalDeaths) * 100 : 0,
  };

  return {
    totalDeaths,
    deathCauseData,
    majorDeathCauses,
    minorDeathCauses,
    otherDeathCauses,
    diversityIndex,
    dominantDeathCause,
    wardData,
    healthIndicators,
  };
}

export function generateDeathCauseAnalysis(data: ProcessedDeathCauseData): string {
  if (data.totalDeaths === 0) {
    return "गाउँपालिकामा मृत्युका कारण सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysis = [];
  
  // Constitutional and public health context
  analysis.push("नेपालको संविधान २०७२ ले स्वास्थ्यलाई मौलिक अधिकारको रूपमा मान्यता दिएको छ र सरकारलाई सबै नागरिकहरूलाई गुणस्तरीय स्वास्थ्य सेवा प्रदान गर्ने जिम्मेवारी दिएको छ। बुद्धशान्ति गाउँपालिकामा मृत्युका कारणहरूको विश्लेषणले स्थानीय स्वास्थ्य चुनौतीहरू र तिनको समाधानका लागि आवश्यक नीतिगत दिशानिर्देशहरू प्रदान गर्दछ।");

  // Overall mortality analysis
  analysis.push(`गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalDeaths)} मृत्यु दर्ता भएको छ, जसले स्थानीय स्वास्थ्य स्थिति र जनस्वास्थ्य चुनौतीहरूको महत्वपूर्ण सूचक हो। यी तथ्याङ्कहरूले स्वास्थ्य सेवाको सुधार, रोग नियन्त्रण र स्वास्थ्य शिक्षाका लागि आधारभूत जानकारी प्रदान गर्दछन्।`);

  // Dominant death cause analysis
  if (data.dominantDeathCause) {
    const dominancePercentage = data.dominantDeathCause.percentage;
    let dominanceAnalysis = "";
    
    if (dominancePercentage > 40) {
      dominanceAnalysis = `गाउँपालिकामा ${data.dominantDeathCause.label} को कारणले स्पष्ट प्रभुत्व (${formatNepaliPercentage(dominancePercentage)}) रहेको छ, जसले यस क्षेत्रमा विशेष स्वास्थ्य चुनौती रहेको संकेत गर्दछ। यस्तो उच्च एकाग्रताले लक्षित स्वास्थ्य हस्तक्षेप र रोग नियन्त्रण कार्यक्रमहरूको आवश्यकतालाई जनाउँछ।`;
    } else if (dominancePercentage > 25) {
      dominanceAnalysis = `${data.dominantDeathCause.label} को कारणले सापेक्षिक बहुमत (${formatNepaliPercentage(dominancePercentage)}) रहेको छ, तर अन्य कारणहरूको उपस्थितिले विविध स्वास्थ्य चुनौतीहरू रहेको देखाउँछ। यस अवस्थाले समग्र स्वास्थ्य सेवा र रोग नियन्त्रणमा सन्तुलित दृष्टिकोण अपनाउन आवश्यक छ।`;
    } else {
      dominanceAnalysis = `${data.dominantDeathCause.label} को कारणले सापेक्षिक बहुलता (${formatNepaliPercentage(dominancePercentage)}) रहेको छ, जसले अपेक्षाकृत विविध मृत्युका कारणहरू रहेको संकेत गर्दछ।`;
    }
    
    analysis.push(dominanceAnalysis);
  }

  // Health indicators analysis
  const diseaseRate = data.healthIndicators.diseaseRelatedPercentage;
  const infectiousRate = data.healthIndicators.infectiousDiseasePercentage;
  const accidentRate = data.healthIndicators.accidentPercentage;
  const naturalRate = data.healthIndicators.naturalDeathPercentage;

  analysis.push(`स्वास्थ्य सूचकहरूको विश्लेषण गर्दा रोग सम्बन्धी मृत्यु ${formatNepaliPercentage(diseaseRate)} रहेको छ, जसमा मुटु, क्यान्सर, मधुमेह, रक्तचाप जस्ता गैरसंक्रामक रोगहरू प्रमुख छन्। संक्रामक रोगहरूबाट ${formatNepaliPercentage(infectiousRate)} मृत्यु भएको छ, जसले सार्वजनिक स्वास्थ्य र रोग नियन्त्रणमा विशेष ध्यान दिन आवश्यक छ। दुर्घटना र आत्महत्याबाट ${formatNepaliPercentage(accidentRate)} मृत्यु भएको छ, जसले सुरक्षा र मानसिक स्वास्थ्य कार्यक्रमहरूको आवश्यकतालाई जनाउँछ। प्राकृतिक कारणहरूबाट ${formatNepaliPercentage(naturalRate)} मृत्यु भएको छ, जसले जनसंख्या बुढो हुँदै गएको संकेत गर्दछ।`);

  // Detailed disease analysis
  if (data.majorDeathCauses.length > 0) {
    const majorCausesList = data.majorDeathCauses.slice(1, 5).map(cause => 
      `${cause.label} ${convertToNepaliNumber(cause.population)} (${formatNepaliPercentage(cause.percentage)})`
    );
    
    if (majorCausesList.length > 0) {
      analysis.push(`अन्य प्रमुख मृत्युका कारणहरूमा ${majorCausesList.join(', ')} रहेका छन्। यी कारणहरूको विश्लेषणले स्थानीय स्वास्थ्य प्राथमिकताहरू र लक्षित हस्तक्षेपहरूको आवश्यकतालाई जनाउँछ।`);
    }
  }

  // Ward-wise variation analysis
  const wardCount = Object.keys(data.wardData).length;
  const wardVariations = Object.entries(data.wardData).map(([wardNum, wardInfo]) => {
    const primaryCauseLabel = DEATH_CAUSE_LABELS[wardInfo.primaryDeathCause] || wardInfo.primaryDeathCause;
    return `वडा ${convertToNepaliNumber(parseInt(wardNum))} मा ${primaryCauseLabel} (${formatNepaliPercentage(wardInfo.primaryDeathCausePercentage)})`;
  });

  analysis.push(`गाउँपालिकाका ${convertToNepaliNumber(wardCount)} वटा वडाहरूमा मृत्युका कारणहरूको वितरणमा भिन्नता देखिन्छ: ${wardVariations.join(', ')}। यस्तो भिन्नताले स्थानीय स्तरमा विशिष्ट स्वास्थ्य चुनौतीहरू रहेको संकेत गर्दछ र वडागत स्वास्थ्य योजना र कार्यक्रमहरूको आवश्यकतालाई जनाउँछ।`);

  // Public health implications
  analysis.push("मृत्युका कारणहरूको यस्तो विश्लेषणले सार्वजनिक स्वास्थ्य नीति र कार्यक्रमहरूको विकासमा महत्वपूर्ण भूमिका खेल्छ। गैरसंक्रामक रोगहरूको उच्च प्रतिशतले जीवनशैली सुधार, स्वास्थ्य शिक्षा र नियमित स्वास्थ्य जाँच कार्यक्रमहरूको आवश्यकतालाई जनाउँछ। संक्रामक रोगहरूको उपस्थितिले टीकाकरण, स्वच्छता र रोग नियन्त्रण कार्यक्रमहरूको महत्वलाई उजागर गर्दछ। दुर्घटना र आत्महत्याको उच्च दरले सुरक्षा उपायहरू, मानसिक स्वास्थ्य सेवा र सामाजिक सहयोग कार्यक्रमहरूको आवश्यकतालाई जनाउँछ।");

  // Healthcare infrastructure analysis
  analysis.push("यस्तो तथ्याङ्कले स्वास्थ्य सेवा सुविधाहरूको विकास र सुधारमा महत्वपूर्ण निर्देशन प्रदान गर्दछ। प्राथमिक स्वास्थ्य केन्द्रहरूको सुदृढीकरण, विशेषज्ञ स्वास्थ्य सेवाहरूको विस्तार र आपतकालीन स्वास्थ्य सेवाहरूको सुधार आवश्यक छ। साथै, स्वास्थ्य कर्मचारीहरूको क्षमता विकास, स्वास्थ्य सूचना प्रणालीको सुदृढीकरण र सामुदायिक स्वास्थ्य कार्यक्रमहरूको विस्तार गर्न आवश्यक छ।");

  // Future recommendations
  analysis.push("भविष्यमा मृत्युका कारणहरूको नियमित निगरानी र विश्लेषण गर्ने प्रणाली विकास गर्न आवश्यक छ। यसले समयमै स्वास्थ्य चुनौतीहरू पहिचान गर्न र तिनको समाधानका लागि तत्काल कार्यवाही गर्न सहयोग गर्छ। साथै, सामुदायिक सहभागिता, स्वास्थ्य शिक्षा र रोकथाममूलक स्वास्थ्य कार्यक्रमहरूको विस्तार गर्दै स्वास्थ्य साक्षरता बढाउन आवश्यक छ। गाउँपालिका सबै नागरिकहरूको स्वास्थ्य र कल्याण सुनिश्चित गर्ने लक्ष्यमा निरन्तर कार्यरत रहनेछ।");

  return analysis.join(" ");
}

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, (digit) => nepaliDigits[parseInt(digit)]);
}

export function formatNepaliPercentage(percentage: number): string {
  return convertToNepaliNumber(parseFloat(percentage.toFixed(1))) + '%';
} 