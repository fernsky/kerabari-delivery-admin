"use client";

import { useMemo } from "react";
import { api } from "@/trpc/react";
import { 
  processCasteData, 
  generateCasteAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  CASTE_LABELS,
  type ProcessedCasteData 
} from "@/lib/utils/caste-utils";
import { 
  ChartGenerator, 
  type ChartData 
} from "@/lib/utils/chart-generator";

// Function to get proper label for caste type (matching the utils)
function getCasteTypeLabel(casteType: string): string {
  const normalized = casteType.toUpperCase();
  const mapping: Record<string, string> = {
    'BRAHMIN': 'ब्राह्मण',
    'CHHETRI': 'क्षेत्री',
    'NEWAR': 'नेवार',
    'MAGAR': 'मगर',
    'THARU': 'थारु',
    'TAMANG': 'तामाङ',
    'RAI': 'राई',
    'LIMBU': 'लिम्बु',
    'GURUNG': 'गुरुङ',
    'SHERPA': 'शेर्पा',
    'OTHER': 'अन्य',
  };
  const standardCasteType = mapping[normalized] || casteType;
  return CASTE_LABELS[standardCasteType] || CASTE_LABELS[casteType] || casteType;
}

export function CasteReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.demographics.municipalityWideCastePopulation.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedCasteData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    // Debug: Log raw data
    console.log("Raw caste data in report:", rawData);
    
    const mappedData = rawData.map(item => ({
      id: item.id,
      casteType: item.casteType,
      population: item.population || 0,
      casteTypeDisplay: item.casteTypeDisplay
    }));
    
    // Debug: Log mapped data
    console.log("Mapped caste data:", mappedData);
    
    const processed = processCasteData(mappedData);
    
    // Debug: Log processed data
    console.log("Processed caste data:", processed);
    
    return processed;
  }, [rawData]);

  // Generate charts with optimized dimensions and scaling for A4 printing
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '' };

    // Pie Chart Data - only show castes with population > 0
    const pieChartData: ChartData = {};
    Object.entries(processedData.casteData)
      .filter(([_, data]) => data.population > 0)
      .forEach(([casteType, data]) => {
        pieChartData[casteType] = {
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
    return generateCasteAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-caste">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-caste">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.totalPopulation === 0) {
    return (
      <div className="section-content" id="section-caste">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.६ जातिगत आधारमा जनसंख्या विवरण
        </h2>
        <p>जातिगत तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  const totalPopulation = processedData.totalPopulation;

  return (
    <div className="section-content" id="section-caste">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.६ जातिगत आधारमा जनसंख्या विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.६.१: जातिगत आधारमा जनसंख्या वितरण</h3>
        <div className="pdf-chart-container">
          <div 
            style={{ 
              width: "100%", 
              height: "350px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              maxWidth: "600px", // Match the chart width
              margin: "0 auto" // Center the chart
            }}
            dangerouslySetInnerHTML={{ __html: charts.pieChart }}
          />
        </div>
      </div>

      {/* Caste Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.६.१: जातिगत आधारमा जनसंख्या विस्तृत विवरण</h3>
        <table className="data-table caste-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>जात</th>
              <th>जनसंख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.casteData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([casteType, data], index) => (
                <tr key={casteType}>
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