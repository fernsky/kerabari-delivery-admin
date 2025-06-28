"use client";

import { useMemo } from "react";
import { api } from "@/trpc/react";
import { MOTHER_TONGUE_LABELS } from "@/server/api/routers/profile/demographics/municipality-wide-mother-tongue-population.schema";
import { ChartGenerator } from "@/lib/utils/chart-generator";

interface ProcessedLanguageData {
  languageData: Record<string, { label: string; population: number; rank: number }>;
  totalPopulation: number;
}

function processLanguageData(data: Array<{ motherTongue: string; population: number }>): ProcessedLanguageData {
  const languageData: Record<string, { label: string; population: number; rank: number }> = {};
  let totalPopulation = 0;
  data.forEach((item, idx) => {
    const label = MOTHER_TONGUE_LABELS[item.motherTongue] || item.motherTongue;
    languageData[item.motherTongue] = {
      label,
      population: item.population,
      rank: idx + 1,
    };
    totalPopulation += item.population;
  });
  return { languageData, totalPopulation };
}

function generateLanguageAnalysis(processed: ProcessedLanguageData): string {
  const sorted = Object.values(processed.languageData).sort((a, b) => b.population - a.population);
  const top = sorted[0];
  const total = processed.totalPopulation;
  let text = `बुद्धशान्ति गाउँपालिकामा मातृभाषाको विविधता अत्यन्तै उल्लेखनीय छ। यहाँका बासिन्दाहरूले विभिन्न मातृभाषाहरू बोल्ने गरेका छन्, जसले गाउँपालिकाको सांस्कृतिक र भाषिक समृद्धिलाई झल्काउँछ। प्रमुख मातृभाषाको रूपमा "${top.label}" बोल्नेको संख्या सबैभन्दा बढी (${top.population.toLocaleString()} जना, कुल जनसंख्याको ${(top.population/total*100).toFixed(2)}%) रहेको छ। अन्य उल्लेखनीय मातृभाषाहरूमा `;
  text += sorted.slice(1, 5).map(l => `"${l.label}" (${l.population.toLocaleString()} जना)`).join(", ");
  text += ` आदि पर्दछन्।\n\nयस विविधताले गाउँपालिकामा भाषिक सहिष्णुता, आपसी समझदारी र सांस्कृतिक आदानप्रदानलाई प्रवर्द्धन गरेको छ। तथापि, केही भाषाहरूको प्रयोगमा गिरावट देखिन थालेको छ, जसले तिनको संरक्षण र प्रवर्द्धनका लागि विशेष पहल आवश्यक छ भन्ने देखाउँछ। मातृभाषाको संरक्षणले न केवल भाषिक पहिचानलाई जोगाउँछ, बरु स्थानीय ज्ञान, परम्परा र सांस्कृतिक सम्पदाको निरन्तरतामा समेत महत्वपूर्ण भूमिका खेल्दछ।\n\nभाषिक विविधता व्यवस्थापनमा स्थानीय सरकार, विद्यालय र समुदायको सहकार्य अपरिहार्य छ। विद्यालयस्तरमा मातृभाषामा शिक्षण सिकाइको प्रवर्द्धन, स्थानीय सञ्चार माध्यममा मातृभाषाको प्रयोग, र समुदायमा भाषिक चेतना अभिवृद्धि गर्ने कार्यक्रमहरू सञ्चालन गर्न सकेमा भाषिक विविधताको संरक्षण र प्रवर्द्धनमा उल्लेखनीय योगदान पुग्नेछ।\n\nयसरी, बुद्धशान्ति गाउँपालिकाको भाषिक विविधता सामाजिक समावेशिता, सांस्कृतिक समृद्धि र स्थानीय पहिचानको महत्वपूर्ण आधार हो। यसको संरक्षण र प्रवर्द्धनमा सबै पक्षको सक्रिय सहभागिता आवश्यक छ।`;
  return text;
}

export function LanguageReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.demographics.municipalityWideMotherTonguePopulation.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedLanguageData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    // Sort by population descending
    const mappedData = [...rawData]
      .sort((a, b) => b.population - a.population)
      .map(item => ({
        motherTongue: item.motherTongue,
        population: item.population || 0,
      }));
    return processLanguageData(mappedData);
  }, [rawData]);

  // Generate charts
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '' };
    // Pie Chart Data - only show languages with population > 0
    const pieChartData: Record<string, { value: number; label: string; color: string }> = {};
    Object.entries(processedData.languageData)
      .filter(([_, data]) => data.population > 0)
      .forEach(([lang, data]) => {
        pieChartData[lang] = {
          value: data.population,
          label: data.label,
          color: `hsl(${(data.rank * 25) % 360}, 65%, 55%)`,
        };
      });
    return {
      pieChart: ChartGenerator.generatePieChart(pieChartData, {
        width: 600,
        height: 450,
        title: 'मातृभाषाको आधारमा जनसंख्या वितरण',
      }),
    };
  }, [processedData]);

  // Generate analysis text
  const analysisText = useMemo(() => {
    if (!processedData) return '';
    return generateLanguageAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-language">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.४ मातृभाषाको आधारमा जनसंख्या विवरण
        </h2>
        <div className="content-section"></div>
      </div>
    );
  }

  if (error || !processedData) {
    return (
      <div className="section-content" id="section-language">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.४ मातृभाषाको आधारमा जनसंख्या विवरण
        </h2>
        <div className="content-section"></div>
      </div>
    );
  }

  return (
    <div className="section-content" id="section-language">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.४ मातृभाषाको आधारमा जनसंख्या विवरण
      </h2>
      {/* Analysis Paragraph */}
      <div className="content-section">
        <div className="content-paragraph">{analysisText}</div>
      </div>
      {/* Pie Chart */}
      <div className="chart-section" dangerouslySetInnerHTML={{ __html: charts.pieChart }} />
      {/* Language Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.४.१: मातृभाषाको आधारमा जनसंख्या विस्तृत विवरण</h3>
        <table className="pdf-data-table language-summary-table">
          <thead>
            <tr>
              <th>मातृभाषा</th>
              <th>जनसंख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(processedData.languageData).map((lang) => (
              <tr key={lang.label}>
                <td>{lang.label}</td>
                <td>{lang.population.toLocaleString()}</td>
                <td>{((lang.population / processedData.totalPopulation) * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td style={{ fontWeight: "bold" }}>जम्मा</td>
              <td style={{ fontWeight: "bold" }}>{processedData.totalPopulation.toLocaleString()}</td>
              <td style={{ fontWeight: "bold" }}>100%</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
