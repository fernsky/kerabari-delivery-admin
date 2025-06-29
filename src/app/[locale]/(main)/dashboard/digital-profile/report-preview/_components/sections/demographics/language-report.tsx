"use client";

import { useMemo } from "react";
import { api } from "@/trpc/react";
import { 
  processLanguageData, 
  generateLanguageAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  LANGUAGE_LABELS,
  type ProcessedLanguageData 
} from "@/lib/utils/language-utils";
import { 
  ChartGenerator, 
  type ChartData 
} from "@/lib/utils/chart-generator";

// Function to get proper label for language type (matching the utils)
function getLanguageTypeLabel(languageType: string): string {
  const normalized = languageType.toUpperCase();
  const mapping: Record<string, string> = {
    'NEPALI': 'NEPALI',
    'LIMBU': 'LIMBU',
    'RAI': 'RAI',
    'HINDI': 'HINDI',
    'NEWARI': 'NEWARI',
    'SHERPA': 'SHERPA',
    'TAMANG': 'TAMANG',
    'MAITHILI': 'MAITHILI',
    'BHOJPURI': 'BHOJPURI',
    'THARU': 'THARU',
    'BAJJIKA': 'BAJJIKA',
    'MAGAR': 'MAGAR',
    'DOTELI': 'DOTELI',
    'URDU': 'URDU',
    'AWADI': 'AWADI',
    'GURUNG': 'GURUNG',
    'OTHER': 'OTHER',
  };
  const standardLanguageType = mapping[normalized] || languageType;
  return LANGUAGE_LABELS[standardLanguageType] || LANGUAGE_LABELS[languageType] || languageType;
}

export function LanguageReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.demographics.wardWiseMotherTonguePopulation.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedLanguageData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    // Debug: Log raw data
    console.log("Raw language data in report:", rawData);
    
    const mappedData = rawData.map(item => ({
      id: item.id,
      wardNumber: item.wardNumber,
      languageType: item.languageType,
      population: item.population || 0,
      languageTypeDisplay: item.languageTypeDisplay
    }));
    
    // Debug: Log mapped data
    console.log("Mapped language data:", mappedData);
    
    const processed = processLanguageData(mappedData);
    
    // Debug: Log processed data
    console.log("Processed language data:", processed);
    
    return processed;
  }, [rawData]);

  // Generate charts with optimized dimensions and scaling for A4 printing
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '' };

    // Pie Chart Data - only show languages with population > 0
    const pieChartData: ChartData = {};
    Object.entries(processedData.languageData)
      .filter(([_, data]) => data.population > 0)
      .forEach(([languageType, data]) => {
        pieChartData[languageType] = {
          value: data.population,
          label: data.label,
          color: `hsl(${(data.rank * 30) % 360}, 70%, 50%)`
        };
      });

    return {
      pieChart: ChartGenerator.generatePieChart(pieChartData, {
        width: 600,
        height: 350,
        showLegend: true,
        nepaliNumbers: true
      })
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
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-language">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.totalPopulation === 0) {
    return (
      <div className="section-content" id="section-language">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.४ मातृभाषाको आधारमा जनसंख्या विवरण
        </h2>
        <p>मातृभाषा सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  const totalPopulation = processedData.totalPopulation;

  return (
    <div className="section-content" id="section-language">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.४ मातृभाषाको आधारमा जनसंख्या विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.४.१: मातृभाषाको आधारमा जनसंख्या वितरण</h3>
        <div className="pdf-chart-container">
          <div 
            style={{ 
              width: "100%", 
              height: "350px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              maxWidth: "600px", // Match the new chart width
              margin: "0 auto" // Center the chart
            }}
            dangerouslySetInnerHTML={{ __html: charts.pieChart }}
          />
        </div>
      </div>

      {/* Language Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.४.१: मातृभाषाको आधारमा जनसंख्या विस्तृत विवरण</h3>
        <table className="data-table language-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>मातृभाषा</th>
              <th>जनसंख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.languageData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([languageType, data], index) => (
                <tr key={languageType}>
                  <td>{convertToNepaliNumber(index + 1)}</td>
                  <td>{data.label}</td>
                  <td>{convertToNepaliNumber(data.population)}</td>
                  <td>{formatNepaliPercentage(data.percentage)}</td>
                </tr>
              ))}
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(totalPopulation)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
