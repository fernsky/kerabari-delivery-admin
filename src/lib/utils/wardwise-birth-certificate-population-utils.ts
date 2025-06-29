import { WardWiseBirthCertificatePopulationData } from "@/server/api/routers/profile/demographics/ward-wise-birth-certificate-population.schema";

export interface ProcessedWardWiseBirthCertificatePopulationData {
  totalPopulationUnder5: number;
  totalWithBirthCertificate: number;
  totalWithoutBirthCertificate: number;
  certificateData: {
    withCertificate: {
      population: number;
      percentage: number;
      label: string;
    };
    withoutCertificate: {
      population: number;
      percentage: number;
      label: string;
    };
  };
  wardData: Record<number, {
    totalPopulationUnder5: number;
    withBirthCertificate: number;
    withoutBirthCertificate: number;
    certificatePercentage: number;
    certificateCoverageScore: number;
  }>;
  certificateScores: {
    overallCoverageScore: number;
    accessibilityScore: number;
    awarenessScore: number;
    complianceScore: number;
  };
}

export const BIRTH_CERTIFICATE_LABELS = {
  withCertificate: "जन्म प्रमाणपत्र भएका",
  withoutCertificate: "जन्म प्रमाणपत्र नभएका",
};

export function processWardWiseBirthCertificatePopulationData(rawData: WardWiseBirthCertificatePopulationData[]): ProcessedWardWiseBirthCertificatePopulationData {
  if (!rawData || rawData.length === 0) {
    return {
      totalPopulationUnder5: 0,
      totalWithBirthCertificate: 0,
      totalWithoutBirthCertificate: 0,
      certificateData: {
        withCertificate: {
          population: 0,
          percentage: 0,
          label: BIRTH_CERTIFICATE_LABELS.withCertificate,
        },
        withoutCertificate: {
          population: 0,
          percentage: 0,
          label: BIRTH_CERTIFICATE_LABELS.withoutCertificate,
        },
      },
      wardData: {},
      certificateScores: {
        overallCoverageScore: 0,
        accessibilityScore: 0,
        awarenessScore: 0,
        complianceScore: 0,
      },
    };
  }

  // Calculate totals
  const totalPopulationUnder5 = rawData.reduce((sum, item) => sum + (item.totalPopulationUnder5 || 0), 0);
  const totalWithBirthCertificate = rawData.reduce((sum, item) => sum + (item.withBirthCertificate || 0), 0);
  const totalWithoutBirthCertificate = rawData.reduce((sum, item) => sum + (item.withoutBirthCertificate || 0), 0);

  // Process certificate data
  const withCertificatePercentage = totalPopulationUnder5 > 0 ? (totalWithBirthCertificate / totalPopulationUnder5) * 100 : 0;
  const withoutCertificatePercentage = totalPopulationUnder5 > 0 ? (totalWithoutBirthCertificate / totalPopulationUnder5) * 100 : 0;

  const certificateData = {
    withCertificate: {
      population: totalWithBirthCertificate,
      percentage: withCertificatePercentage,
      label: BIRTH_CERTIFICATE_LABELS.withCertificate,
    },
    withoutCertificate: {
      population: totalWithoutBirthCertificate,
      percentage: withoutCertificatePercentage,
      label: BIRTH_CERTIFICATE_LABELS.withoutCertificate,
    },
  };

  // Process ward data
  const wardData: Record<number, any> = {};
  const uniqueWards = Array.from(new Set(rawData.map(item => item.wardNumber))).sort((a, b) => a - b);
  
  uniqueWards.forEach(wardNum => {
    const wardItem = rawData.find(item => item.wardNumber === wardNum);
    if (wardItem) {
      const certificatePercentage = wardItem.totalPopulationUnder5 > 0 
        ? (wardItem.withBirthCertificate / wardItem.totalPopulationUnder5) * 100 
        : 0;
      
      // Calculate certificate coverage score (0-100)
      const certificateCoverageScore = certificatePercentage;

      wardData[wardNum] = {
        totalPopulationUnder5: wardItem.totalPopulationUnder5,
        withBirthCertificate: wardItem.withBirthCertificate,
        withoutBirthCertificate: wardItem.withoutBirthCertificate,
        certificatePercentage,
        certificateCoverageScore,
      };
    }
  });

  // Calculate certificate scores
  const overallCoverageScore = withCertificatePercentage;
  const accessibilityScore = withCertificatePercentage > 80 ? 90 : withCertificatePercentage > 60 ? 70 : withCertificatePercentage > 40 ? 50 : 30;
  const awarenessScore = withCertificatePercentage > 70 ? 85 : withCertificatePercentage > 50 ? 65 : withCertificatePercentage > 30 ? 45 : 25;
  const complianceScore = withCertificatePercentage > 90 ? 95 : withCertificatePercentage > 75 ? 80 : withCertificatePercentage > 60 ? 65 : 40;

  return {
    totalPopulationUnder5,
    totalWithBirthCertificate,
    totalWithoutBirthCertificate,
    certificateData,
    wardData,
    certificateScores: {
      overallCoverageScore,
      accessibilityScore,
      awarenessScore,
      complianceScore,
    },
  };
}

export function generateWardWiseBirthCertificatePopulationAnalysis(data: ProcessedWardWiseBirthCertificatePopulationData): string {
  if (data.totalPopulationUnder5 === 0) {
    return "जन्म प्रमाणपत्र सम्बन्धी तथ्याङ्क उपलब्ध छैन।";
  }

  const analysisParts: string[] = [];

  // Overall summary with detailed context
  analysisParts.push(
    `बुद्धशान्ति गाउँपालिकामा कुल ${convertToNepaliNumber(data.totalPopulationUnder5)} बालबालिका (५ वर्ष भन्दा कम उमेरका) रहेका छन् जसमा जन्म प्रमाणपत्रको वितरण रहेको छ। यी तथ्याङ्कले गाउँपालिकाको बाल अधिकार, सरकारी सेवाको पहुँच र सामाजिक विकासको स्तरको विस्तृत चित्र प्रस्तुत गर्दछ। जन्म प्रमाणपत्रको वितरणले न केवल बाल अधिकारको स्थिति मात्र देखाउँछ तर सरकारी सेवाको पहुँच, जनचेतनाको स्तर र सामाजिक विकासको दिशालाई पनि संकेत गर्दछ।`
  );

  // Certificate coverage analysis
  const withCertificateData = data.certificateData.withCertificate;
  const withoutCertificateData = data.certificateData.withoutCertificate;

  analysisParts.push(
    `गाउँपालिकामा जन्म प्रमाणपत्र भएका बालबालिका ${convertToNepaliNumber(withCertificateData.population)} (${formatNepaliPercentage(withCertificateData.percentage)}) रहेका छन् भने जन्म प्रमाणपत्र नभएका बालबालिका ${convertToNepaliNumber(withoutCertificateData.population)} (${formatNepaliPercentage(withoutCertificateData.percentage)}) रहेका छन्। यो प्रतिशतले गाउँपालिकाको बाल अधिकारको स्थिति र सरकारी सेवाको पहुँचको स्तर देखाउँछ। जन्म प्रमाणपत्रको उच्च प्रतिशतले सरकारी सेवाको उत्तम पहुँच र जनचेतनाको उच्च स्तर देखाउँछ। यसले गाउँपालिकाको सामाजिक विकास र बाल अधिकारको संरक्षणको स्तर पनि संकेत गर्दछ।`
  );

  // Certificate scores analysis
  const scores = data.certificateScores;
  analysisParts.push(
    `जन्म प्रमाणपत्रको गुणस्तर विश्लेषण अनुसार, समग्र कवरेज स्कोर ${convertToNepaliNumber(Math.round(scores.overallCoverageScore * 10) / 10)} रहेको छ (१०० मा) जसले गाउँपालिकाको जन्म प्रमाणपत्र कवरेजको स्तर देखाउँछ। पहुँच स्कोर ${convertToNepaliNumber(Math.round(scores.accessibilityScore * 10) / 10)} रहेको छ जसले सरकारी सेवाको पहुँच र उपलब्धताको स्तर मूल्याङ्कन गर्दछ। जनचेतना स्कोर ${convertToNepaliNumber(Math.round(scores.awarenessScore * 10) / 10)} रहेको छ जसले जनताको जन्म प्रमाणपत्रको महत्त्व बारे जानकारी र चेतनाको स्तर देखाउँछ। अनुपालन स्कोर ${convertToNepaliNumber(Math.round(scores.complianceScore * 10) / 10)} रहेको छ जसले कानूनी अनुपालन र नियमितताको स्तर मूल्याङ्कन गर्दछ। यी स्कोरहरूले गाउँपालिकाको समग्र बाल अधिकार र सरकारी सेवाको स्तर मूल्याङ्कन गर्न सहयोग गर्दछ।`
  );

  // Ward-wise detailed analysis
  if (Object.keys(data.wardData).length > 0) {
    const wardEntries = Object.entries(data.wardData);
    const highestWard = wardEntries.reduce((max, [wardNum, wardData]) => 
      wardData.totalPopulationUnder5 > max.totalPopulationUnder5 ? { wardNum, ...wardData } : max
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalPopulationUnder5: 0, withBirthCertificate: 0, withoutBirthCertificate: 0, certificatePercentage: 0, certificateCoverageScore: 0 });
    const lowestWard = wardEntries.reduce((min, [wardNum, wardData]) => 
      wardData.totalPopulationUnder5 < min.totalPopulationUnder5 ? { wardNum, ...wardData } : min
    , wardEntries[0] ? { wardNum: wardEntries[0][0], ...wardEntries[0][1] } : { wardNum: '0', totalPopulationUnder5: 0, withBirthCertificate: 0, withoutBirthCertificate: 0, certificatePercentage: 0, certificateCoverageScore: 0 });

    const bestCoverageWard = wardEntries.reduce((best, current) => 
      current[1].certificateCoverageScore > best[1].certificateCoverageScore ? current : best
    );
    const worstCoverageWard = wardEntries.reduce((worst, current) => 
      current[1].certificateCoverageScore < worst[1].certificateCoverageScore ? current : worst
    );

    analysisParts.push(
      `वडाको आधारमा विस्तृत विश्लेषण गर्दा, वडा नं. ${convertToNepaliNumber(parseInt(highestWard.wardNum))} मा सबैभन्दा बढी ${convertToNepaliNumber(highestWard.totalPopulationUnder5)} बालबालिका रहेका छन् भने वडा नं. ${convertToNepaliNumber(parseInt(lowestWard.wardNum))} मा सबैभन्दा कम ${convertToNepaliNumber(lowestWard.totalPopulationUnder5)} बालबालिका रहेका छन्। कवरेजको दृष्टिकोणबाट हेर्दा, वडा नं. ${convertToNepaliNumber(parseInt(bestCoverageWard[0]))} मा सबैभन्दा राम्रो जन्म प्रमाणपत्र कवरेज रहेको छ जसको कवरेज स्कोर ${convertToNepaliNumber(Math.round(bestCoverageWard[1].certificateCoverageScore * 10) / 10)} रहेको छ। यस वडामा जन्म प्रमाणपत्र भएका बालबालिका ${formatNepaliPercentage(bestCoverageWard[1].certificatePercentage)} रहेका छन् जसले यस वडाको सरकारी सेवाको उत्तम पहुँच र जनचेतनाको उच्च स्तर देखाउँछ। यसले यस वडाको बाल अधिकार र सामाजिक विकासको स्तर पनि संकेत गर्दछ।`
    );

    analysisParts.push(
      `वडा नं. ${convertToNepaliNumber(parseInt(worstCoverageWard[0]))} मा सबैभन्दा न्यून जन्म प्रमाणपत्र कवरेज रहेको छ जसको कवरेज स्कोर ${convertToNepaliNumber(Math.round(worstCoverageWard[1].certificateCoverageScore * 10) / 10)} रहेको छ। यस वडामा जन्म प्रमाणपत्र नभएका बालबालिका ${formatNepaliPercentage(100 - worstCoverageWard[1].certificatePercentage)} रहेका छन् जसले यस वडाको सरकारी सेवाको न्यून पहुँच र जनचेतनाको न्यून स्तरलाई संकेत गर्दछ। यसले यस वडाको बाल अधिकार र सामाजिक विकासमा चुनौती रहेको देखाउँछ। यस्ता वडाहरूमा जन्म प्रमाणपत्र कार्यक्रमहरू र जनचेतना अभिवृद्धि कार्यक्रमहरूको आवश्यकता रहेको छ।`
    );
  }

  // Critical insights and recommendations
  analysisParts.push(
    `यी तथ्याङ्कले गाउँपालिकाको जन्म प्रमाणपत्र कवरेज र बाल अधिकारको मूल्याङ्कन गर्न सहयोग गर्दछ। जन्म प्रमाणपत्रको उच्च प्रतिशतले सरकारी सेवाको उत्तम पहुँच र जनचेतनाको उच्च स्तर देखाउँछ। न्यून प्रतिशत सरकारी सेवाको न्यून पहुँच र जनचेतनाको न्यून स्तरलाई संकेत गर्दछ। जन्म प्रमाणपत्र बाल अधिकारको मूल आधार हो जसले बालबालिकाको पहिचान, शिक्षा र स्वास्थ्य सेवाको पहुँच सुनिश्चित गर्दछ। यी तथ्याङ्कले बाल अधिकार नीति र विकास योजनाहरूको निर्माणमा महत्त्वपूर्ण अन्तर्दृष्टि प्रदान गर्दछ।`
  );

  // Additional critical analysis
  if (withoutCertificateData.percentage > 30) {
    analysisParts.push(
      `गाउँपालिकामा जन्म प्रमाणपत्र नभएका बालबालिकाको प्रतिशत ${formatNepaliPercentage(withoutCertificateData.percentage)} रहेको छ जुन चिन्ताजनक स्तरमा रहेको छ। यस्ता बालबालिका बाल अधिकार र सरकारी सेवाको न्यून पहुँचको उच्च जोखिममा रहेका छन्। यसको लागि तत्काल जन्म प्रमाणपत्र कार्यक्रमहरू, जनचेतना अभिवृद्धि कार्यक्रमहरू र सरकारी सेवा सुधार कार्यक्रमहरू ल्याउनुपर्ने आवश्यकता रहेको छ। जन्म प्रमाणपत्र नभएका बालबालिकाको उच्च दरले बाल अधिकार र सामाजिक विकासमा चुनौती रहेको देखाउँछ। यसको लागि नीतिगत हस्तक्षेप, जन्म प्रमाणपत्र कार्यक्रमहरू र जनचेतना अभिवृद्धि कार्यक्रमहरूको आवश्यकता रहेको छ।`
    );
  }

  if (scores.overallCoverageScore < 60) {
    analysisParts.push(
      `समग्र कवरेज स्कोर ${convertToNepaliNumber(Math.round(scores.overallCoverageScore * 10) / 10)} रहेको छ जुन चिन्ताजनक स्तरमा रहेको छ। यसले गाउँपालिकाको बाल अधिकार र सरकारी सेवाको न्यून स्तरलाई संकेत गर्दछ। यसको लागि व्यापक नीतिगत हस्तक्षेप, जन्म प्रमाणपत्र कार्यक्रमहरू र सरकारी सेवा सुधार कार्यक्रमहरूको आवश्यकता रहेको छ। कवरेज स्कोर सुधार गर्न जन्म प्रमाणपत्र नीति, सरकारी सेवा सुधार कार्यक्रमहरू र जनचेतना अभिवृद्धि योजनाहरूको एकीकृत दृष्टिकोण आवश्यक रहेको छ। यसले गाउँपालिकाको समग्र बाल अधिकार र सामाजिक विकासलाई सुनिश्चित गर्दछ।`
    );
  }

  analysisParts.push(
    `समग्र रूपमा, गाउँपालिकाको जन्म प्रमाणपत्र कवरेज र बाल अधिकारमा सुधारका लागि नीतिगत हस्तक्षेप, जन्म प्रमाणपत्र कार्यक्रमहरू र जनचेतना अभिवृद्धि योजनाहरूको आवश्यकता रहेको छ। यसले न केवल बाल अधिकार बढाउँछ तर गाउँपालिकाको समग्र सामाजिक विकास र सरकारी सेवाको स्तर पनि सुनिश्चित गर्दछ। बाल अधिकार नीति र विकास योजनाहरूमा यी तथ्याङ्कको प्रयोग गर्दै सामाजिक-आर्थिक समानता र बाल अधिकारलाई प्रवर्द्धन गर्न सकिन्छ। यसले गाउँपालिकाको भविष्यको विकास र बाल सुरक्षाको लागि मजबुत आधार तयार पार्दछ।`
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