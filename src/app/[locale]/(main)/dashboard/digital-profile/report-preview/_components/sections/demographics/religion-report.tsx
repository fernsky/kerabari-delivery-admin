"use client";

import { useMemo } from "react";
import { api } from "@/trpc/react";
import { 
  processReligionData, 
  generateReligionAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  RELIGION_LABELS,
  type ProcessedReligionData 
} from "@/lib/utils/religion-utils";
import { 
  ChartGenerator, 
  type ChartData 
} from "@/lib/utils/chart-generator";

export function ReligionReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.demographics.municipalityWideReligionPopulation.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedReligionData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map(item => ({
      id: item.id,
      religionType: item.religionType,
      population: item.population || 0,
      religionTypeDisplay: item.religionTypeDisplay
    }));
    
    return processReligionData(mappedData);
  }, [rawData]);

  // Generate charts with optimized dimensions and scaling for A4 printing
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '' };

    // Pie Chart Data - only show religions with population > 0
    const pieChartData: ChartData = {};
    Object.entries(processedData.religionData)
      .filter(([_, data]) => data.population > 0)
      .forEach(([religionType, data]) => {
        pieChartData[religionType] = {
          value: data.population,
          label: data.label,
          color: `hsl(${(data.rank * 45) % 360}, 65%, 55%)`
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
    return generateReligionAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-religion">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-religion">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.totalPopulation === 0) {
    return (
      <div className="section-content" id="section-religion">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.७ धार्मिक आधारमा जनसंख्या विवरण
        </h2>
        <p>धार्मिक तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  const totalPopulation = processedData.totalPopulation;

  return (
    <div className="section-content" id="section-religion">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.७ धार्मिक आधारमा जनसंख्या विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.७.१: धार्मिक आधारमा जनसंख्या वितरण</h3>
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

      {/* Religion Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.७.१: धार्मिक आधारमा जनसंख्या विस्तृत विवरण</h3>
        <table className="data-table religion-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>धर्म</th>
              <th>जनसंख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.religionData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([religionType, data], index) => (
                <tr key={religionType}>
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