import { CasteTypes } from "@/server/db/schema/common/enums";

export interface CasteData {
  id: string;
  casteType: string;
  population: number;
  casteTypeDisplay?: string;
}

export interface ProcessedCasteData {
  totalPopulation: number;
  casteData: Record<string, {
    population: number;
    percentage: number;
    label: string;
    rank: number;
  }>;
  majorCastes: Array<{
    casteType: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  minorCastes: Array<{
    casteType: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  otherCastes: Array<{
    casteType: string;
    population: number;
    percentage: number;
    label: string;
  }>;
  diversityIndex: number;
  dominantCaste: {
    casteType: string;
    population: number;
    percentage: number;
    label: string;
  } | null;
}

export const CASTE_LABELS: Record<string, string> = {
  ...CasteTypes,
  OTHER: "अन्य",
};

export function processCasteData(rawData: CasteData[]): ProcessedCasteData {
  if (!rawData || rawData.length === 0) {
    return {
      totalPopulation: 0,
      casteData: {},
      majorCastes: [],
      minorCastes: [],
      otherCastes: [],
      diversityIndex: 0,
      dominantCaste: null,
    };
  }

  // Calculate total population
  const totalPopulation = rawData.reduce((sum, item) => sum + (item.population || 0), 0);

  // Process caste data
  const casteData: Record<string, any> = {};
  const allCastes: Array<any> = [];

  rawData.forEach((item, index) => {
    const percentage = totalPopulation > 0 ? (item.population / totalPopulation) * 100 : 0;
    const casteInfo = {
      population: item.population,
      percentage,
      label: item.casteTypeDisplay || CASTE_LABELS[item.casteType] || item.casteType,
      rank: index + 1,
    };

    casteData[item.casteType] = casteInfo;
    allCastes.push({
      casteType: item.casteType,
      ...casteInfo,
    });
  });

  // Sort castes by population
  allCastes.sort((a, b) => b.population - a.population);

  // Update ranks after sorting
  allCastes.forEach((caste, index) => {
    casteData[caste.casteType].rank = index + 1;
  });

  // Categorize castes
  const majorCastes = allCastes.filter(caste => caste.percentage >= 5);
  const minorCastes = allCastes.filter(caste => caste.percentage < 5 && caste.percentage >= 1);
  const otherCastes = allCastes.filter(caste => caste.percentage < 1);

  // Calculate diversity index (Simpson's Diversity Index)
  const diversityIndex = totalPopulation > 0 
    ? 1 - allCastes.reduce((sum, caste) => {
        const p = caste.population / totalPopulation;
        return sum + (p * p);
      }, 0)
    : 0;

  // Find dominant caste
  const dominantCaste = allCastes.length > 0 ? allCastes[0] : null;

  return {
    totalPopulation,
    casteData,
    majorCastes,
    minorCastes,
    otherCastes,
    diversityIndex,
    dominantCaste,
  };
}

export function generateCasteAnalysis(data: ProcessedCasteData): string {
  if (data.totalPopulation === 0) {
    return "गाउँपालिकामा जातजातिको तथ्याङ्क उपलब्ध छैन।";
  }

  const analysis = [];
  
  // Constitutional and historical context with local analysis
  analysis.push("नेपालको संविधान २०७२ ले जातीय छुवाछूत र भेदभावको अन्त्य गर्ने संकल्प गरेको छ र समानुपातिक समावेशी सिद्धान्तका आधारमा समतामूलक समाजको निर्माण गर्ने नीति अपनाएको छ। यस संवैधानिक प्रावधानको प्रतिबिम्ब बुद्धशान्ति गाउँपालिकामा पनि देख्न सकिन्छ, जहाँ विभिन्न जातजातिहरूको सहअस्तित्व रहेको छ।");

  // Detailed population analysis with critical perspective
  if (data.dominantCaste) {
    const dominancePercentage = data.dominantCaste.percentage;
    let dominanceAnalysis = "";
    
    if (dominancePercentage > 70) {
      dominanceAnalysis = `गाउँपालिकामा ${data.dominantCaste.label} जातिको स्पष्ट प्रभुत्व (${formatNepaliPercentage(dominancePercentage)}) रहेको छ, जसले जातीय संरचनामा असन्तुलनको संकेत गर्दछ। यस्तो उच्च एकाग्रताले अल्पसंख्यक जातिहरूको सामाजिक, आर्थिक र राजनीतिक सहभागितामा चुनौती उत्पन्न गर्न सक्छ र समावेशी विकासका लागि विशेष ध्यान दिन आवश्यक छ।`;
    } else if (dominancePercentage > 50) {
      dominanceAnalysis = `${data.dominantCaste.label} जातिको सापेक्षिक बहुमत (${formatNepaliPercentage(dominancePercentage)}) रहेको छ, तर अन्य जातिहरूको उपस्थितिले सामाजिक विविधताको संकेत दिन्छ। यस अवस्थाले बहुसंख्यक र अल्पसंख्यक समुदायबीच सन्तुलित सम्बन्ध कायम राख्न आवश्यक छ।`;
    } else {
      dominanceAnalysis = `${data.dominantCaste.label} जातिको सापेक्षिक बहुलता (${formatNepaliPercentage(dominancePercentage)}) रहेको छ, जसले अपेक्षाकृत संतुलित जातीय संरचनाको संकेत गर्दछ।`;
    }
    
    analysis.push(`कुल ${convertToNepaliNumber(data.totalPopulation)} जनसंख्या मध्ये ${dominanceAnalysis}`);
  }

  // Major castes breakdown with critical analysis
  if (data.majorCastes.length > 1) {
    const majorCastesList = data.majorCastes.slice(1, 5).map(caste => 
      `${caste.label} ${convertToNepaliNumber(caste.population)} (${formatNepaliPercentage(caste.percentage)})`
    );
    
    if (majorCastesList.length > 0) {
      analysis.push(`त्यसैगरी अन्य प्रमुख जातिहरूमा ${majorCastesList.join(', ')} प्रतिशत जनसंख्या रहेका छन्। यी जातिहरूको उपस्थितिले गाउँपालिकामा जातीय प्रतिनिधित्वको बहुलवादी संरचनालाई जनाउँछ।`);
    }
  }

  // Detailed diversity analysis
  const diversityPercentage = data.diversityIndex * 100;
  let diversityAnalysis = "";
  
  if (diversityPercentage > 70) {
    diversityAnalysis = `गाउँपालिकामा जातीय विविधता उच्च (${convertToNepaliNumber(parseFloat(diversityPercentage.toFixed(1)))}%) रहेको छ, जसले बहुजातीय समाजको स्वस्थ विकासको संकेत गर्दछ। यस्तो विविधताले सामाजिक सहिष्णुता, आपसी सम्मान र सांस्कृतिक आदानप्रदानलाई प्रवर्धन गर्दछ। ${convertToNepaliNumber(data.majorCastes.length)} वटा प्रमुख जातिहरू (५% भन्दा बढी), ${convertToNepaliNumber(data.minorCastes.length)} वटा गौण जातिहरू (१-५%) र ${convertToNepaliNumber(data.otherCastes.length)} वटा अन्य साना जातिहरूको उपस्थितिले सामाजिक संरचनालाई थप समृद्ध र समावेशी बनाउँछ।`;
  } else if (diversityPercentage > 40) {
    diversityAnalysis = `गाउँपालिकामा मध्यम स्तरको जातीय विविधता (${convertToNepaliNumber(parseFloat(diversityPercentage.toFixed(1)))}%) रहेको छ, जसले विभिन्न जातिहरूको उपस्थिति भएता पनि कुनै एक जातिको प्रभुत्व रहेको देखाउँछ। ${convertToNepaliNumber(data.majorCastes.length)} प्रमुख र ${convertToNepaliNumber(data.minorCastes.length)} गौण जातिहरूको उपस्थितिले सामाजिक विविधताको संकेत दिन्छ तर अल्पसंख्यक जातिहरूको अधिकार र पहिचान संरक्षणमा विशेष ध्यान दिन आवश्यक छ।`;
  } else {
    diversityAnalysis = `गाउँपालिकामा जातीय विविधता न्यून (${convertToNepaliNumber(parseFloat(diversityPercentage.toFixed(1)))}%) रहेको छ, जसले एकजातीय प्रभुत्वको स्थितिलाई संकेत गर्दछ। यस्तो अवस्थाले अल्पसंख्यक जातिहरूको सामाजिक, आर्थिक र राजनीतिक सहभागितामा चुनौती उत्पन्न गर्न सक्छ र समावेशी विकासका लागि विशेष नीति र कार्यक्रमको आवश्यकता छ।`;
  }
  
  analysis.push(diversityAnalysis);

  // Social inclusion and representation analysis
  let inclusionAnalysis = "";
  if (data.dominantCaste && data.dominantCaste.percentage > 70) {
    inclusionAnalysis = "जातीय एकाग्रताको यस्तो उच्च स्थितिले सामाजिक समावेशीकरणमा गम्भीर चुनौती खडा गर्दछ। अल्पसंख्यक जातिहरूको राजनीतिक प्रतिनिधित्व, आर्थिक अवसरहरूमा पहुँच र सामाजिक निर्णय प्रक्रियामा सहभागिता सुनिश्चित गर्न विशेष उपायहरू अपनाउन आवश्यक छ।";
  } else if (data.majorCastes.length > 3) {
    inclusionAnalysis = "बहुजातीय समाजको यस संरचनाले सामाजिक समावेशीकरणका लागि अनुकूल वातावरण सिर्जना गरेको छ। विभिन्न जातिहरूको प्रतिनिधित्व र सहभागितामा सन्तुलन कायम राख्न निरन्तर प्रयासको आवश्यकता छ।";
  } else {
    inclusionAnalysis = "सीमित जातीय विविधताको यस अवस्थामा सामाजिक एकता कायम राख्दै अल्पसंख्यक जातिहरूको अधिकार संरक्षण गर्न विशेष ध्यान दिन आवश्यक छ।";
  }
  
  analysis.push(inclusionAnalysis);

  // Cultural preservation and identity analysis
  analysis.push("गाउँपालिकामा बसोबास गर्ने विभिन्न जातजातिहरूको मौलिक संस्कृति, परम्परा, भाषा र रहनसहनको संरक्षण र संवर्धन महत्वपूर्ण चुनौती बनेको छ। विशेषगरी सिमान्तकृत र अल्पसंख्यक जातिहरूको सांस्कृतिक पहिचान कायम राख्न र तिनीहरूको पारम्परिक ज्ञान, सीप र कलाकारिताको संरक्षण गर्न विशेष कार्यक्रमहरूको आवश्यकता छ। जातीय छुवाछूत र भेदभावका अवशेषहरूको पूर्ण अन्त्य गर्दै सबै जातिहरूको गरिमामय जीवनयापन सुनिश्चित गर्नु समसामयिक आवश्यकता हो।");

  // Economic empowerment and social mobility analysis
  analysis.push("जातीय आधारमा आर्थिक असमानताको विश्लेषण गर्दा परम्परागत रूपमा पिछडिएका जातिहरूको आर्थिक सशक्तिकरणमा विशेष ध्यान दिन आवश्यक देखिन्छ। कृषि, व्यापार, सीप विकास र उद्यमशीलताका क्षेत्रमा सबै जातिहरूको समान पहुँच र अवसर सुनिश्चित गर्न स्थानीय तहले लक्षित कार्यक्रमहरू सञ्चालन गरेको छ। शिक्षा, स्वास्थ्य र रोजगारीका अवसरहरूमा जातीय आधारमा कुनै भेदभाव नगर्ने नीति अपनाइएको छ।");

  // Political representation and governance analysis
  analysis.push("स्थानीय शासनमा जातीय प्रतिनिधित्वको विश्लेषण गर्दा संविधानले व्यवस्था गरेको समानुपातिक समावेशी सिद्धान्तको कार्यान्वयनमा ध्यान दिइएको छ। निर्वाचित प्रतिनिधिहरूको संरचनामा विभिन्न जातिहरूको प्रतिनिधित्व सुनिश्चित गर्न र निर्णय प्रक्रियामा सबै समुदायको सहभागिता बढाउन प्रयास गरिएको छ। सामुदायिक संगठनहरूको सक्रियताले जातीय एकता र सामाजिक सद्भावना प्रवर्धनमा महत्वपूर्ण भूमिका खेलेको छ।");

  // Future vision and commitment
  analysis.push("भविष्यमा जातीय एकता र सामाजिक न्यायको आधारमा समग्र विकास हासिल गर्न गाउँपालिका दृढ संकल्पित छ। सबै जातजातिको सांस्कृतिक पहिचान र मौलिकताको संरक्षण गर्दै आर्थिक समृद्धि र सामाजिक न्यायमा आधारित समाजको निर्माण गर्ने लक्ष्य राखिएको छ। जातीय भेदभावको पूर्ण अन्त्य गरी मानवीय गरिमा र समानताको आधारमा सबै नागरिकहरूको कल्याणमा गाउँपालिका निरन्तर कार्यरत रहनेछ। विविधतामा एकताको सिद्धान्त अनुसार सबै जातजातिले मिलेर गाउँपालिकाको समग्र विकासमा योगदान पुर्याउने परम्परालाई निरन्तरता दिने प्रतिबद्धता व्यक्त गरिएको छ।");

  return analysis.join(" ");
}

export function convertToNepaliNumber(num: number): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, (digit) => nepaliDigits[parseInt(digit)]);
}

export function formatNepaliPercentage(percentage: number): string {
  return convertToNepaliNumber(parseFloat(percentage.toFixed(1))) + '%';
} 