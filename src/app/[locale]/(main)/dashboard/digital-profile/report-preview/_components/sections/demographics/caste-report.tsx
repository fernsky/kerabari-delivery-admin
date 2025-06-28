"use client";

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
import { useMemo } from "react";

export function CasteReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.demographics.municipalityWideCastePopulation.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedCasteData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map(item => ({
      id: item.id,
      casteType: item.casteType,
      population: item.population || 0,
      casteTypeDisplay: item.casteTypeDisplay
    }));
    
    return processCasteData(mappedData);
  }, [rawData]);

  // Generate charts
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
        height: 450,
        title: 'जातिगत आधारमा जनसंख्या वितरण'
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
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.६ जातिगत आधारमा जनसंख्या विवरण
        </h2>
        <div className="content-section">
          <p>डेटा लोड भइरहेको छ...</p>
        </div>
      </div>
    );
  }

  if (error || !processedData) {
    return (
      <div className="section-content" id="section-caste">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.६ जातिगत आधारमा जनसंख्या विवरण
        </h2>
        <div className="content-section">
          <p>डेटा लोड गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-content" id="section-caste">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.६ जातिगत आधारमा जनसंख्या विवरण
      </h2>
      
      <div className="content-section">
        <div className="content-paragraph">
          <p>{analysisText}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.६.१: जातिगत आधारमा जनसंख्या वितरण</h3>
        <div className="pdf-chart-container">
          <div 
            style={{ 
              width: "100%", 
              height: "450px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              backgroundColor: "#f9fafb"
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
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalPopulation)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 