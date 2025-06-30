export interface ReligionData {
  id: string;
  religionType: string;
  population: number;
  religionTypeDisplay?: string;
}

export interface ProcessedReligionData {
  totalPopulation: number;
  religionData: Record<string, {
    population: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  majorReligions: Array<{
    religionType: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  minorReligions: Array<{
    religionType: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  otherReligions: Array<{
    religionType: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  diversityIndex: number;
  dominantReligion: {
    religionType: string;
    population: number;
    percentage: number;
    label: string;
  } | null;
  religiousTolerance: number;
}

export const RELIGION_LABELS: Record<string, string> = {
  HINDU: "हिन्दू",
  BUDDHIST: "बौद्ध",
  KIRANT: "किराँत",
  CHRISTIAN: "क्रिश्चियन",
  ISLAM: "इस्लाम",
  NATURE: "प्रकृति",
  BON: "बोन",
  JAIN: "जैन",
  BAHAI: "बहाई",
  SIKH: "सिख",
  OTHER: "अन्य",
};

export function processReligionData(rawData: ReligionData[]): ProcessedReligionData {
  if (!rawData || rawData.length === 0) {
    return {
      totalPopulation: 0,
      religionData: {},
      majorReligions: [],
      minorReligions: [],
      otherReligions: [],
      diversityIndex: 0,
      dominantReligion: null,
      religiousTolerance: 0,
    };
  }

  // Calculate total population
  const totalPopulation = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process religion data
  const religionData: Record<string, any> = {};
  const allReligions: Array<any> = [];

  rawData.forEach((item, index) => {
    const percentage = totalPopulation > 0 ? (item.population / totalPopulation) * 100 : 0;
    const religionInfo = {
      population: item.population,
      percentage,
      label: item.religionTypeDisplay || RELIGION_LABELS[item.religionType] || item.religionType,
      rank: index + 1,
    };

    religionData[item.religionType] = religionInfo;
    allReligions.push({
      religionType: item.religionType,
      ...religionInfo,
    });
  });

  // Sort religions by population
  allReligions.sort((a, b) => b.population - a.population);

  // Update ranks after sorting
  allReligions.forEach((religion, index) => {
    religionData[religion.religionType].rank = index + 1;
  });

  // Categorize religions
  const majorReligions = allReligions.filter(religion => religion.percentage >= 5);
  const minorReligions = allReligions.filter(religion => religion.percentage < 5 && religion.percentage >= 1);
  const otherReligions = allReligions.filter(religion => religion.percentage < 1);

  // Calculate diversity index (Simpson's Diversity Index)
  const diversityIndex = totalPopulation > 0 
    ? 1 - allReligions.reduce((sum, religion) => {
        const p = religion.population / totalPopulation;
        return sum + (p * p);
      }, 0)
    : 0;

  // Calculate religious tolerance index (based on diversity and distribution)
  const religiousTolerance = diversityIndex * (allReligions.length > 1 ? 1 : 0);

  // Find dominant religion
  const dominantReligion = allReligions.length > 0 ? allReligions[0] : null;

  return {
    totalPopulation,
    religionData,
    majorReligions,
    minorReligions,
    otherReligions,
    diversityIndex,
    dominantReligion,
    religiousTolerance,
  };
}

export function generateReligionAnalysis(data: ProcessedReligionData): string {
  if (data.totalPopulation === 0) {
    return "गाउँपालिकामा धार्मिक तथ्याङ्क उपलब्ध छैन।";
  }

  const analysis = [];
  
  // Constitutional and historical context with local analysis
  analysis.push("नेपालको संविधान २०७२ ले धर्म निरपेक्षताको सिद्धान्त अपनाएको छ र सबै नागरिकलाई धार्मिक स्वतन्त्रताको अधिकार प्रदान गरेको छ। यस संवैधानिक प्रावधानको प्रतिबिम्ब केराबारी गाउँपालिकामा पनि देख्न सकिन्छ, जहाँ विभिन्न धर्मावलम्बीहरूको सहअस्तित्व रहेको छ।");

  // Detailed population analysis with critical perspective
  if (data.dominantReligion) {
    const dominancePercentage = data.dominantReligion.percentage;
    let dominanceAnalysis = "";
    
    if (dominancePercentage > 90) {
      dominanceAnalysis = `गाउँपालिकामा ${data.dominantReligion.label} धर्मावलम्बीहरूको अत्यधिक प्रभुत्व (${formatNepaliPercentage(dominancePercentage)}) रहेको छ, जसले एकधार्मिक समाजको विशेषता प्रस्तुत गर्दछ। यस्तो उच्च एकाग्रताले धार्मिक विविधताको अभावलाई संकेत गर्दछ र अल्पसंख्यक धर्मावलम्बीहरूको सांस्कृतिक पहिचान संरक्षणमा चुनौती उत्पन्न गर्न सक्छ।`;
    } else if (dominancePercentage > 70) {
      dominanceAnalysis = `${data.dominantReligion.label} धर्मावलम्बीहरूको स्पष्ट बहुमत (${formatNepaliPercentage(dominancePercentage)}) रहेको छ, तर अन्य धर्मावलम्बीहरूको उपस्थितिले सामाजिक विविधताको संकेत दिन्छ। यस अवस्थाले बहुसंख्यक र अल्पसंख्यक समुदायबीच सन्तुलित सम्बन्ध कायम राख्न आवश्यक छ।`;
    } else {
      dominanceAnalysis = `${data.dominantReligion.label} धर्मावलम्बीहरूको सापेक्षिक बहुमत (${formatNepaliPercentage(dominancePercentage)}) रहेको छ, जसले अपेक्षाकृत संतुलित धार्मिक संरचनाको संकेत गर्दछ।`;
    }
    
    analysis.push(`कुल ${convertToNepaliNumber(data.totalPopulation)} जनसंख्या मध्ये ${dominanceAnalysis}`);
  }

  // Detailed diversity analysis
  const diversityPercentage = data.diversityIndex * 100;
  let diversityAnalysis = "";
  
  if (diversityPercentage > 60) {
    diversityAnalysis = "गाउँपालिकामा उच्च धार्मिक विविधता रहेको छ, जसले बहुधार्मिक समाजको स्वस्थ विकासको संकेत गर्दछ। यस्तो विविधताले सामाजिक सहिष्णुता, आपसी सम्मान र सांस्कृतिक आदानप्रदानलाई प्रवर्धन गर्दछ। विभिन्न धार्मिक परम्पराहरूको उपस्थितिले स्थानीय समुदायलाई थप समृद्ध र समावेशी बनाउँछ।";
  } else if (diversityPercentage > 30) {
    diversityAnalysis = "गाउँपालिकामा मध्यम स्तरको धार्मिक विविधता रहेको छ, जसले विभिन्न धर्मावलम्बीहरूको उपस्थिति भएता पनि कुनै एक धर्मको प्रभुत्व रहेको देखाउँछ। यस अवस्थाले अल्पसंख्यक धर्मावलम्बीहरूको अधिकार र पहिचान संरक्षणमा विशेष ध्यान दिन आवश्यक छ।";
  } else {
    diversityAnalysis = `गाउँपालिकामा धार्मिक विविधता न्यून रहेको छ (${convertToNepaliNumber(parseFloat(diversityPercentage.toFixed(1)))}%), जसले एकधार्मिक प्रभुत्वको स्थितिलाई संकेत गर्दछ। यस्तो अवस्थाले अल्पसंख्यक धर्मावलम्बीहरूको सांस्कृतिक पहिचान र धार्मिक अभ्यासहरूको संरक्षणमा चुनौती उत्पन्न गर्न सक्छ।`;
  }
  
  analysis.push(diversityAnalysis);

  // Critical analysis of religious composition
  const majorReligionsCount = data.majorReligions.length;
  const minorReligionsCount = data.minorReligions.length;
  const otherReligionsCount = data.otherReligions.length;
  
  let compositionAnalysis = "";
  if (majorReligionsCount === 1 && minorReligionsCount === 0) {
    compositionAnalysis = "गाउँपालिकामा धार्मिक संरचना अत्यन्त एकाग्रता देखाउँछ, जहाँ केवल एक धर्मको प्रभुत्व रहेको छ। यस्तो अवस्थाले धार्मिक बहुलवादको अभावलाई जनाउँछ र सामाजिक समावेशीकरणमा चुनौती खडा गर्छ।";
  } else if (majorReligionsCount > 1) {
    compositionAnalysis = `गाउँपालिकामा ${convertToNepaliNumber(majorReligionsCount)} वटा प्रमुख धर्महरूको उपस्थितिले धार्मिक बहुलवादको संकेत गर्दछ। यसका साथै ${convertToNepaliNumber(minorReligionsCount)} गौण र ${convertToNepaliNumber(otherReligionsCount)} अन्य साना धार्मिक समुदायहरूको उपस्थितिले सामाजिक विविधताको परिचय दिन्छ।`;
  } else {
    compositionAnalysis = `गाउँपालिकामा एक प्रमुख धर्मको साथै ${convertToNepaliNumber(minorReligionsCount)} गौण र ${convertToNepaliNumber(otherReligionsCount)} अन्य साना धार्मिक समुदायहरूको उपस्थितिले सीमित धार्मिक विविधताको तस्वीर प्रस्तुत गर्दछ।`;
  }
  
  analysis.push(compositionAnalysis);

  // Detailed festival and cultural analysis
  analysis.push("गाउँपालिकामा मनाइने धार्मिक पर्वहरूको विश्लेषण गर्दा हिन्दू पर्वहरू जस्तै दशैं, तिहार, तिज, शिवरात्रि, जनैपूर्णिमा, कृष्ण जन्माष्टमीको व्यापक मनाइने गर्दछ। बौद्ध समुदायले बुद्ध जयन्ती, ल्होसार, धर्म चक्र दिवस मनाउँछन् भने किराँत समुदायले उधौली, उभौली, साकेला जस्ता पर्वहरू मनाउँछन्। क्रिश्चियन समुदायले क्रिसमस र इस्टर मनाउने गर्दछन् भने इस्लामिक समुदायले इद र रमजान मनाउँछन्। यी सबै पर्वहरूमा सम्बन्धित समुदायका साथै अन्य धर्मावलम्बीहरूको सहभागिताले गाउँपालिकाको धार्मिक सद्भावनाको परिचय दिन्छ।");

  // Religious tolerance and harmony analysis
  const toleranceIndex = data.religiousTolerance * 100;
  let toleranceAnalysis = "";
  
  if (toleranceIndex > 50) {
    toleranceAnalysis = "गाउँपालिकामा धार्मिक सहिष्णुताको स्तर उत्साहजनक रहेको छ। विभिन्न धर्मावलम्बीहरूबीच आपसी सम्मान, सहयोग र सद्भावनाको वातावरण कायम रहेको देखिन्छ। धार्मिक नेताहरूबीच नियमित संवाद र सहकार्यको परम्पराले सामुदायिक एकतालाई बलियो बनाएको छ।";
  } else if (toleranceIndex > 20) {
    toleranceAnalysis = "गाउँपालिकामा धार्मिक सहिष्णुताको स्तर मध्यम रहेको छ। विभिन्न धर्मावलम्बीहरूबीच सामान्यतया शान्तिपूर्ण सम्बन्ध रहेता पनि धार्मिक सद्भावना बृद्धिका लागि थप प्रयास आवश्यक छ। अन्तरधार्मिक संवाद र सहकार्यका कार्यक्रमहरू बढाउन सकेमा सामाजिक एकता थप मजबुत हुनेछ।";
  } else {
    toleranceAnalysis = `गाउँपालिकामा धार्मिक सहिष्णुताको स्तर न्यून (${convertToNepaliNumber(parseFloat(toleranceIndex.toFixed(1)))}%) रहेको छ, जसले मुख्यतया एकधार्मिक प्रभुत्वको कारण हुन सक्छ। यस्तो अवस्थामा अल्पसंख्यक धर्मावलम्बीहरूको अधिकार संरक्षण र धार्मिक स्वतन्त्रता सुनिश्चित गर्न विशेष ध्यान दिन आवश्यक छ।`;
  }
  
  analysis.push(toleranceAnalysis);

  // Social cohesion and community integration analysis
  analysis.push("धार्मिक विविधताको व्यवस्थापनमा स्थानीय तहको भूमिका महत्वपूर्ण रहेको छ। गाउँपालिकाले सबै धर्मावलम्बीहरूका महत्वपूर्ण पर्वहरूलाई सम्मान गर्दै सार्वजनिक बिदाको व्यवस्था गरेको छ। धार्मिक स्थलहरूको संरक्षण र विकासमा समान ध्यान दिइएको छ, जसले धार्मिक समानताको सिद्धान्तलाई प्रतिबिम्बित गर्दछ। विभिन्न धार्मिक समुदायहरूले मिलेर सामाजिक सेवामूलक कार्यहरू सञ्चालन गर्ने परम्पराले सामुदायिक एकतालाई बलियो बनाएको छ।");

  // Future challenges and opportunities analysis
  analysis.push("भविष्यमा धार्मिक सद्भावना कायम राख्न र विकास गर्नका लागि निरन्तर प्रयासको आवश्यकता छ। युवाहरूमा धार्मिक सहिष्णुता र आपसी सम्मानको मूल्यमान्यता विकास गर्न शिक्षा क्षेत्रमा विशेष कार्यक्रमहरू सञ्चालन गर्न सकिन्छ। अन्तरधार्मिक संवाद कार्यक्रमहरूको नियमित आयोजना, सांस्कृतिक आदानप्रदानका अवसरहरू सिर्जना र सामुदायिक सहकार्यका परियोजनाहरूले धार्मिक एकतालाई थप मजबुत बनाउन सक्छ। गाउँपालिका सबै धर्मावलम्बीहरूको कल्याण र अधिकार संरक्षणमा प्रतिबद्ध रहँदै धार्मिक सद्भावनाको यो परम्परालाई निरन्तरता दिने संकल्प गरेको छ।");

  return analysis.join(" ");
}

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, (digit) => nepaliDigits[parseInt(digit)]);
}

export function formatNepaliPercentage(percentage: number): string {
  return convertToNepaliNumber(parseFloat(percentage.toFixed(1))) + '%';
} 