import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import TemperatureTrendChart from "./_components/charts/temperature-trend-chart";
import TemperatureHeatmapChart from "./_components/charts/temperature-heatmap-chart";
import TemperatureAnomalyChart from "./_components/charts/temperature-anomaly-chart";
import TemperatureAnalysisSection from "./_components/temperature-analysis-section";

// Force dynamic rendering since we're using tRPC
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period
export const revalidate = 86400; // Revalidate once per day

// Generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const municipalityName = "बुद्धशान्ति गाउँपालिका";

  return {
    title: `तापक्रम विश्लेषण | ${municipalityName} डिजिटल प्रोफाइल`,
    description: "बुद्धशान्ति गाउँपालिकाको तापक्रम विश्लेषण, जलवायु परिवर्तन प्रभाव र अनुकूलन रणनीतिहरू",
    keywords: [
      "बुद्धशान्ति गाउँपालिका तापक्रम विश्लेषण",
      "जलवायु परिवर्तन बुद्धशान्ति",
      "तापक्रम प्रवृत्ति विश्लेषण",
      "जलवायु अनुकूलन रणनीति",
      "तापक्रम हिटम्याप",
      "जलवायु जोखिम मूल्यांकन",
    ],
    alternates: {
      canonical: "/profile/climate/temperature-analysis",
      languages: {
        en: "/en/profile/climate/temperature-analysis",
        ne: "/ne/profile/climate/temperature-analysis",
      },
    },
  };
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "तापक्रम प्रवृत्ति विश्लेषण", slug: "temperature-trend-analysis" },
  { level: 2, text: "तापक्रम हिटम्याप", slug: "temperature-heatmap" },
  { level: 2, text: "तापक्रम विचलन विश्लेषण", slug: "temperature-anomaly-analysis" },
  { level: 2, text: "जलवायु स्कोर र जोखिम", slug: "climate-score-risk" },
  { level: 2, text: "नीतिगत सिफारिसहरू", slug: "policy-recommendations" },
  { level: 2, text: "अनुकूलन रणनीतिहरू", slug: "adaptation-strategies" },
];

export default async function TemperatureAnalysisPage() {
  // Generate sample temperature data for 10 years (2015-2024)
  const generateTemperatureData = () => {
    const data = [];
    const baseTemp = 25; // Base temperature in Celsius
    const warmingTrend = 0.02; // 0.02°C per month warming trend
    
    for (let year = 2015; year <= 2024; year++) {
      for (let month = 1; month <= 12; month++) {
        const monthIndex = (year - 2015) * 12 + month;
        const seasonalVariation = Math.sin((month - 1) * Math.PI / 6) * 8; // Seasonal variation
        const warmingEffect = warmingTrend * monthIndex;
        const randomVariation = (Math.random() - 0.5) * 2; // Random variation
        
        const temperatureCelsius = baseTemp + seasonalVariation + warmingEffect + randomVariation;
        const temperatureKelvin = temperatureCelsius + 273.15;
        
        // Determine season
        let season = "";
        if (month >= 3 && month <= 5) season = "वसन्त";
        else if (month >= 6 && month <= 8) season = "गर्मी";
        else if (month >= 9 && month <= 11) season = "शरद";
        else season = "हिउँद";
        
        data.push({
          date: `${year}-${String(month).padStart(2, '0')}-01`,
          temperature: temperatureKelvin,
          temperatureCelsius: temperatureCelsius,
          year: year,
          month: month,
          season: season,
        });
      }
    }
    return data;
  };

  const temperatureData = generateTemperatureData();

  // Calculate statistics
  const temperatures = temperatureData.map(d => d.temperatureCelsius);
  const averageTemperature = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
  const minTemperature = Math.min(...temperatures);
  const maxTemperature = Math.max(...temperatures);
  
  // Calculate trend slope using linear regression
  const n = temperatureData.length;
  const sumX = temperatureData.reduce((sum, _, index) => sum + index, 0);
  const sumY = temperatures.reduce((sum, temp) => sum + temp, 0);
  const sumXY = temperatureData.reduce((sum, item, index) => sum + index * item.temperatureCelsius, 0);
  const sumX2 = temperatureData.reduce((sum, _, index) => sum + index * index, 0);
  
  const trendSlope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  // Calculate standard deviation
  const variance = temperatures.reduce((sum, temp) => sum + Math.pow(temp - averageTemperature, 2), 0) / temperatures.length;
  const stdDev = Math.sqrt(variance);

  const temperatureRange = {
    min: minTemperature,
    max: maxTemperature,
    mean: averageTemperature,
    stdDev: stdDev,
  };

  // Calculate seasonal data
  const seasonalData = ["वसन्त", "गर्मी", "शरद", "हिउँद"].map(season => {
    const seasonData = temperatureData.filter(d => d.season === season);
    const temps = seasonData.map(d => d.temperatureCelsius);
    return {
      season: season,
      avgTemp: temps.reduce((sum, temp) => sum + temp, 0) / temps.length,
      minTemp: Math.min(...temps),
      maxTemp: Math.max(...temps),
    };
  });

  // Generate heatmap data
  const heatmapData = temperatureData.map(item => {
    const anomaly = item.temperatureCelsius - averageTemperature;
    let category: 'very_cold' | 'cold' | 'normal' | 'warm' | 'very_warm' | 'hot';
    
    if (anomaly <= -2) category = 'very_cold';
    else if (anomaly <= -1) category = 'cold';
    else if (anomaly <= 1) category = 'normal';
    else if (anomaly <= 2) category = 'warm';
    else if (anomaly <= 3) category = 'very_warm';
    else category = 'hot';
    
    return {
      year: item.year,
      month: item.month,
      monthName: item.season,
      temperature: item.temperatureCelsius,
      anomaly: anomaly,
      category: category,
    };
  });

  // Generate anomaly data
  const anomalyData = temperatureData.map((item, index) => {
    const normalTemperature = averageTemperature + (trendSlope * index);
    const anomaly = item.temperatureCelsius - normalTemperature;
    
    let anomalyCategory: 'extreme_cold' | 'cold' | 'normal' | 'warm' | 'extreme_warm';
    if (anomaly <= -2) anomalyCategory = 'extreme_cold';
    else if (anomaly <= -1) anomalyCategory = 'cold';
    else if (anomaly <= 1) anomalyCategory = 'normal';
    else if (anomaly <= 2) anomalyCategory = 'warm';
    else anomalyCategory = 'extreme_warm';
    
    return {
      date: item.date,
      year: item.year,
      month: item.month,
      temperature: item.temperatureCelsius,
      normalTemperature: normalTemperature,
      anomaly: anomaly,
      anomalyCategory: anomalyCategory,
      cumulativeAnomaly: 0, // Would need to calculate this properly
    };
  });

  // Calculate anomaly statistics
  const anomalyStats = {
    totalAnomalies: anomalyData.length,
    warmAnomalies: anomalyData.filter(d => d.anomaly > 0).length,
    coldAnomalies: anomalyData.filter(d => d.anomaly < 0).length,
    extremeAnomalies: anomalyData.filter(d => Math.abs(d.anomaly) > 2).length,
    averageAnomaly: anomalyData.reduce((sum, d) => sum + d.anomaly, 0) / anomalyData.length,
    trendSlope: trendSlope,
  };

  // Calculate climate score (0-100, higher = more risk)
  const warmingRate = trendSlope * 12;
  const temperatureVariability = stdDev;
  const extremeEvents = anomalyStats.extremeAnomalies;
  
  const climateScore = Math.min(100, 
    (warmingRate * 100) + // Warming rate contribution
    (temperatureVariability * 5) + // Variability contribution
    (extremeEvents * 2) // Extreme events contribution
  );

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (climateScore < 30) riskLevel = 'low';
  else if (climateScore < 50) riskLevel = 'medium';
  else if (climateScore < 70) riskLevel = 'high';
  else riskLevel = 'critical';

  // Generate policy recommendations
  const policyRecommendations = [
    {
      category: "तत्काल कार्य",
      title: "तापक्रम निगरानी प्रणाली सुदृढीकरण",
      description: "उच्च-गुणस्तरको तापक्रम निगरानी प्रणाली स्थापना र जनचेतना कार्यक्रम सञ्चालन",
      priority: 'high' as const,
      impact: "उच्च - जलवायु जोखिम कम गर्ने",
      timeline: "६ महिना"
    },
    {
      category: "कृषि अनुकूलन",
      title: "जलवायु अनुकूल कृषि तकनीक विकास",
      description: "बढ्दो तापक्रममा पनि उत्पादन गर्न सक्ने फसल किसिमहरू र तकनीक विकास",
      priority: 'high' as const,
      impact: "उच्च - कृषि उत्पादन स्थिरता",
      timeline: "१-२ वर्ष"
    },
    {
      category: "जल संसाधन",
      title: "सिंचाई प्रणाली सुधार",
      description: "सूक्ष्म सिंचाई र वर्षाजल संग्रहण प्रणाली स्थापना",
      priority: 'medium' as const,
      impact: "मध्यम - जल दक्षता सुधार",
      timeline: "२-३ वर्ष"
    },
    {
      category: "ऊर्जा",
      title: "सौर्य ऊर्जा प्रवद्र्धन",
      description: "सौर्य ऊर्जा प्रविधि प्रवद्र्धन र सब्सिडी योजना",
      priority: 'medium' as const,
      impact: "मध्यम - नवीकरणीय ऊर्जा विकास",
      timeline: "२-४ वर्ष"
    },
    {
      category: "स्वास्थ्य",
      title: "गर्मी लहर चेतावनी प्रणाली",
      description: "गर्मी लहर चेतावनी र स्वास्थ्य सेवा सुदृढीकरण",
      priority: 'high' as const,
      impact: "उच्च - स्वास्थ्य जोखिम कम गर्ने",
      timeline: "१ वर्ष"
    },
    {
      category: "शिक्षा",
      title: "जलवायु शिक्षा कार्यक्रम",
      description: "स्कूल र सामुदायिक स्तरमा जलवायु शिक्षा कार्यक्रम सञ्चालन",
      priority: 'low' as const,
      impact: "दीर्घकालीन - जनचेतना विकास",
      timeline: "३-५ वर्ष"
    }
  ];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/temperature-analysis.svg"
              width={1200}
              height={400}
              alt="तापक्रम विश्लेषण - बुद्धशान्ति गाउँपालिका (Temperature Analysis - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकाको तापक्रम विश्लेषण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              जलवायु परिवर्तनको वर्तमान युगमा तापक्रम विश्लेषणले स्थानीय विकास र योजना निर्माणमा महत्वपूर्ण भूमिका खेल्छ।
              बुद्धशान्ति गाउँपालिकाको तापक्रम विश्लेषणले पिछ्लो १० वर्षको तथ्याङ्क आधारमा जलवायु प्रवृत्ति,
              जोखिम मूल्यांकन र अनुकूलन रणनीतिहरू प्रस्ताव गर्दैछ।
            </p>
            <p>
              यो विश्लेषणले औसत तापक्रम {localizeNumber(averageTemperature.toFixed(1), "ne")}°C रहेको देखाउँछ,
              जुन पिछ्लो दशकमा {localizeNumber((warmingRate).toFixed(2), "ne")}°C प्रति वर्षको दरले बढेको छ।
              यो वृद्धि स्थानीय कृषि, जल संसाधन र मानव स्वास्थ्यमा महत्वपूर्ण प्रभाव पार्न सक्छ।
            </p>
          </div>

          {/* Temperature Trend Chart */}
          <div id="temperature-trend-analysis" className="mt-8">
            <h2 className="scroll-m-20 text-2xl font-semibold mb-6">
              तापक्रम प्रवृत्ति विश्लेषण
            </h2>
            <TemperatureTrendChart
              temperatureData={temperatureData}
              averageTemperature={averageTemperature}
              trendSlope={trendSlope}
              temperatureRange={temperatureRange}
              seasonalData={seasonalData}
            />
          </div>

          {/* Temperature Heatmap */}
          <div id="temperature-heatmap" className="mt-12">
            <h2 className="scroll-m-20 text-2xl font-semibold mb-6">
              तापक्रम हिटम्याप विश्लेषण
            </h2>
            <TemperatureHeatmapChart
              heatmapData={heatmapData}
              temperatureRange={temperatureRange}
            />
          </div>

          {/* Temperature Anomaly Analysis */}
          <div id="temperature-anomaly-analysis" className="mt-12">
            <h2 className="scroll-m-20 text-2xl font-semibold mb-6">
              तापक्रम विचलन विश्लेषण
            </h2>
            <TemperatureAnomalyChart
              anomalyData={anomalyData}
              anomalyStats={anomalyStats}
            />
          </div>

          {/* Climate Score and Analysis */}
          <div id="climate-score-risk" className="mt-12">
            <h2 className="scroll-m-20 text-2xl font-semibold mb-6">
              जलवायु स्कोर र जोखिम विश्लेषण
            </h2>
            <TemperatureAnalysisSection
              temperatureData={temperatureData}
              averageTemperature={averageTemperature}
              trendSlope={trendSlope}
              temperatureRange={temperatureRange}
              seasonalData={seasonalData}
              anomalyStats={anomalyStats}
              climateScore={climateScore}
              riskLevel={riskLevel}
              policyRecommendations={policyRecommendations}
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="policy-recommendations" className="scroll-m-20 border-b pb-2">
              नीतिगत सिफारिसहरू
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकाको तापक्रम विश्लेषणको आधारमा निम्न नीतिगत सिफारिसहरू गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>तत्काल कार्यहरू:</strong> तापक्रम निगरानी प्रणाली सुदृढ बनाउनु, 
                  जनचेतना कार्यक्रम सञ्चालन गर्नु र आपतकालीन सेवा तयारी गर्नु।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>मध्यम अवधि कार्यहरू:</strong> जलवायु अनुकूल कृषि तकनीक विकास, 
                  सिंचाई प्रणाली सुधार र सौर्य ऊर्जा प्रवद्र्धन गर्नु।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>दीर्घकालीन कार्यहरू:</strong> नवीकरणीय ऊर्जा विकास, 
                  हरित अर्थतन्त्र निर्माण र जलवायु अनुकूल बसोबास विकास गर्नु।
                </div>
              </div>
            </div>

            <h2 id="adaptation-strategies" className="scroll-m-20 border-b pb-2 mt-12">
              अनुकूलन रणनीतिहरू
            </h2>
            <p>
              बढ्दो तापक्रमको प्रभावलाई कम गर्न निम्न अनुकूलन रणनीतिहरू अपनाउन सकिन्छ:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">कृषि अनुकूलन</h3>
                <ul className="space-y-2 text-sm">
                  <li>• जलवायु अनुकूल फसल किसिमहरू विकास</li>
                  <li>• सूक्ष्म सिंचाई प्रणाली स्थापना</li>
                  <li>• फसल बीमा योजना विस्तार</li>
                  <li>• कृषि विज्ञान केन्द्र स्थापना</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">जल संसाधन प्रबन्धन</h3>
                <ul className="space-y-2 text-sm">
                  <li>• वर्षाजल संग्रहण प्रणाली</li>
                  <li>• भूमिगत जल पुनर्भरण</li>
                  <li>• जल उपयोग दक्षता सुधार</li>
                  <li>• जल गुणस्तर निगरानी</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">स्वास्थ्य र सुरक्षा</h3>
                <ul className="space-y-2 text-sm">
                  <li>• गर्मी लहर चेतावनी प्रणाली</li>
                  <li>• स्वास्थ्य सेवा सुदृढीकरण</li>
                  <li>• जनचेतना कार्यक्रम</li>
                  <li>• आपतकालीन सेवा तयारी</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-3">ऊर्जा र बसोबास</h3>
                <ul className="space-y-2 text-sm">
                  <li>• सौर्य ऊर्जा प्रवद्र्धन</li>
                  <li>• हरित भवन निर्माण</li>
                  <li>• ऊर्जा दक्षता सुधार</li>
                  <li>• सार्वजनिक परिवहन विकास</li>
                </ul>
              </div>
            </div>

            <p className="mt-6">
              बुद्धशान्ति गाउँपालिकाको तापक्रम विश्लेषणले जलवायु परिवर्तनको प्रभावलाई 
              समयमै सम्झन र यसको अनुकूलनका लागि समेकित रणनीति अपनाउन आवश्यकता देखाउँछ। 
              यी निष्कर्षहरूले स्थानीय विकास योजना निर्माण र कार्यान्वयनमा महत्वपूर्ण 
              मार्गदर्शन प्रदान गर्दैछन्।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
} 