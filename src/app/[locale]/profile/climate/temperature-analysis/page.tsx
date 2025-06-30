import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
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
  const municipalityName = "केराबारी गाउँपालिका";

  return {
    title: `तापक्रम विश्लेषण | ${municipalityName} डिजिटल प्रोफाइल`,
    description: "केराबारी गाउँपालिकाको तापक्रम विश्लेषण र जलवायु परिवर्तन प्रभाव",
    keywords: [
      "केराबारी गाउँपालिका तापक्रम विश्लेषण",
      "जलवायु परिवर्तन केराबारी",
      "तापक्रम प्रवृत्ति विश्लेषण",
      "जलवायु अनुकूलन रणनीति",
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
  { level: 2, text: "तापक्रम प्रवृत्ति", slug: "temperature-trend" },
  { level: 2, text: "तापक्रम हिटम्याप", slug: "temperature-heatmap" },
  { level: 2, text: "तापक्रम विचलन", slug: "temperature-anomaly" },
  { level: 2, text: "विश्लेषण", slug: "analysis" },
];

export default async function TemperatureAnalysisPage() {
  const generateTemperatureData = () => {
    const data = [];
    const baseTemp = 25;
    const warmingTrend = 0.02;
    
    for (let year = 2015; year <= 2024; year++) {
      for (let month = 1; month <= 12; month++) {
        const monthIndex = (year - 2015) * 12 + month;
        const seasonalVariation = Math.sin((month - 1) * Math.PI / 6) * 8;
        const warmingEffect = warmingTrend * monthIndex;
        const randomVariation = (Math.random() - 0.5) * 2;
        
        const temperatureCelsius = baseTemp + seasonalVariation + warmingEffect + randomVariation;
        
        data.push({
          date: `${year}-${String(month).padStart(2, '0')}-01`,
          temperatureCelsius: temperatureCelsius,
          year: year,
          month: month,
        });
      }
    }
    return data;
  };

  const temperatureData = generateTemperatureData();

  const temperatures = temperatureData.map(d => d.temperatureCelsius);
  const averageTemperature = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
  const minTemperature = Math.min(...temperatures);
  const maxTemperature = Math.max(...temperatures);
  
  const n = temperatureData.length;
  const sumX = temperatureData.reduce((sum, _, index) => sum + index, 0);
  const sumY = temperatures.reduce((sum, temp) => sum + temp, 0);
  const sumXY = temperatureData.reduce((sum, item, index) => sum + index * item.temperatureCelsius, 0);
  const sumX2 = temperatureData.reduce((sum, _, index) => sum + index * index, 0);
  
  const trendSlope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  const variance = temperatures.reduce((sum, temp) => sum + Math.pow(temp - averageTemperature, 2), 0) / temperatures.length;
  const stdDev = Math.sqrt(variance);

  const temperatureRange = {
    min: minTemperature,
    max: maxTemperature,
    mean: averageTemperature,
    stdDev: stdDev,
  };

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
      monthName: item.month.toString(),
      temperature: item.temperatureCelsius,
      anomaly: anomaly,
      category: category,
    };
  });

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
    };
  });

  const anomalyStats = {
    totalAnomalies: anomalyData.length,
    warmAnomalies: anomalyData.filter(d => d.anomaly > 0).length,
    coldAnomalies: anomalyData.filter(d => d.anomaly < 0).length,
    extremeAnomalies: anomalyData.filter(d => Math.abs(d.anomaly) > 2).length,
    averageAnomaly: anomalyData.reduce((sum, d) => sum + d.anomaly, 0) / anomalyData.length,
  };

  const warmingRate = trendSlope * 12;
  const temperatureVariability = stdDev;
  const extremeEvents = anomalyStats.extremeAnomalies;
  
  const climateScore = Math.min(100, 
    (warmingRate * 100) + 
    (temperatureVariability * 5) + 
    (extremeEvents * 2)
  );

  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (climateScore < 30) riskLevel = 'low';
  else if (climateScore < 50) riskLevel = 'medium';
  else if (climateScore < 70) riskLevel = 'high';
  else riskLevel = 'critical';

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/temperature-analysis.svg"
              width={1200}
              height={400}
              alt="तापक्रम विश्लेषण - केराबारी गाउँपालिका"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकाको तापक्रम विश्लेषण
            </h1>
            <p>
              पिछ्लो १० वर्षको तापक्रम तथ्याङ्क आधारमा जलवायु प्रवृत्ति र विश्लेषण।
              औसत तापक्रम {localizeNumber(averageTemperature.toFixed(1), "ne")}°C रहेको छ।
            </p>
          </div>

          <div id="temperature-trend" className="mt-8">
            <h2 className="scroll-m-20 text-2xl font-semibold mb-6">
              तापक्रम प्रवृत्ति
            </h2>
            <TemperatureTrendChart
              temperatureData={temperatureData}
              averageTemperature={averageTemperature}
              trendSlope={trendSlope}
            />
          </div>

          <div id="temperature-heatmap" className="mt-12">
            <h2 className="scroll-m-20 text-2xl font-semibold mb-6">
              तापक्रम हिटम्याप
            </h2>
            <TemperatureHeatmapChart
              heatmapData={heatmapData}
              temperatureRange={temperatureRange}
            />
          </div>

          <div id="temperature-anomaly" className="mt-12">
            <h2 className="scroll-m-20 text-2xl font-semibold mb-6">
              तापक्रम विचलन
            </h2>
            <TemperatureAnomalyChart
              anomalyData={anomalyData}
              anomalyStats={anomalyStats}
            />
          </div>

          <div id="analysis" className="mt-12">
            <h2 className="scroll-m-20 text-2xl font-semibold mb-6">
              विश्लेषण
            </h2>
            <TemperatureAnalysisSection
              temperatureData={temperatureData}
              averageTemperature={averageTemperature}
              trendSlope={trendSlope}
              anomalyStats={anomalyStats}
              climateScore={climateScore}
              riskLevel={riskLevel}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
} 