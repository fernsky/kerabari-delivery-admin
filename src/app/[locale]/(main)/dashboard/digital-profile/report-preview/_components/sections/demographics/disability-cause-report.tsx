"use client";

import { api } from "@/trpc/react";
import { 
  processDisabilityCauseData, 
  generateDisabilityCauseAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  DISABILITY_CAUSE_LABELS,
  type ProcessedDisabilityCauseData 
} from "@/lib/utils/disability-cause-utils";
import { 
  ChartGenerator, 
  type ChartData, 
  type WardData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

// Function to get proper label for disability cause (matching the utils)
function getDisabilityCauseLabel(cause: string): string {
  const normalized = cause.toLowerCase();
  const mapping: Record<string, string> = {
    'congenital': 'CONGENITAL',
    'accident': 'ACCIDENT', 
    'malnutrition': 'MALNUTRITION',
    'disease': 'DISEASE',
    'conflict': 'CONFLICT',
    'other': 'OTHER',
    'unknown': 'UNKNOWN',
  };
  const standardCause = mapping[normalized] || cause;
  return DISABILITY_CAUSE_LABELS[standardCause] || DISABILITY_CAUSE_LABELS[cause] || cause;
}

export function DisabilityCauseReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.demographics.wardWiseDisabilityCause.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedDisabilityCauseData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map(item => ({
      id: item.id,
      wardNumber: item.wardNumber,
      disabilityCause: item.disabilityCause,
      population: item.population || 0,
      disabilityCauseDisplay: item.disabilityCauseDisplay
    }));
    
    return processDisabilityCauseData(mappedData);
  }, [rawData]);

  // Generate charts with optimized dimensions and scaling for A4 printing
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '', barChart: '' };

    // Pie Chart Data - only show disability causes with population > 0
    const pieChartData: ChartData = {};
    Object.entries(processedData.disabilityCauseData)
      .filter(([_, data]) => data.population > 0)
      .forEach(([disabilityCause, data]) => {
        pieChartData[disabilityCause] = {
          value: data.population,
          label: data.label,
          color: `hsl(${(data.rank * 36) % 360}, 70%, 50%)`
        };
      });

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {};
      Object.entries(data.disabilityCauses).forEach(([disabilityCause, population]) => {
        barChartData[wardNum][disabilityCause] = population;
      });
    });

    // Calculate optimal chart dimensions based on data
    const numWards = Object.keys(processedData.wardData).length;
    const numCategories = Object.keys(processedData.disabilityCauseData).filter(key => 
      processedData.disabilityCauseData[key].population > 0
    ).length;
    
    // Adjust legend height based on number of categories - reduced for better fit
    const legendHeight = Math.ceil(numCategories / 3) * 25 + 30; // Reduced padding and items per row
    
    // Adjust max bar width based on number of wards - narrower bars for better spacing
    const maxBarWidth = numWards <= 9 ? 50 : 40; // Reduced bar width

    return {
      pieChart: ChartGenerator.generatePieChart(pieChartData, {
        width: 600,
        height: 350,
        showLegend: true,
        nepaliNumbers: true
      }),
      barChart: ChartGenerator.generateBarChart(barChartData, {
        width: 700, // Reduced width to prevent truncation
        height: 500, // Reduced height for better proportions
        showLegend: true,
        nepaliNumbers: true,
        legendHeight: legendHeight,
        maxBarWidth: maxBarWidth
      })
    };
  }, [processedData]);

  // Generate analysis text
  const analysisText = useMemo(() => {
    if (!processedData) return '';
    return generateDisabilityCauseAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-disability-cause">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-disability-cause">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.totalPopulationWithDisability === 0) {
    return (
      <div className="section-content" id="section-disability-cause">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.१५ अपाङ्गताका आधारमा जनसंख्याको विवरण
        </h2>
        <p>अपाङ्गता सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  const totalPopulationWithDisability = processedData.totalPopulationWithDisability;

  return (
    <div className="section-content" id="section-disability-cause">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.१५ अपाङ्गताका आधारमा जनसंख्याको विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१५.१: अपाङ्गताका कारण अनुसार जनसंख्या वितरण</h3>
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

      {/* Disability Cause Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.१५.१: अपाङ्गताका कारण अनुसार जनसंख्या विस्तृत विवरण</h3>
        <table className="data-table disability-cause-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>अपाङ्गताको कारण</th>
              <th>जनसंख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.disabilityCauseData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([disabilityCause, data], index) => (
                <tr key={disabilityCause}>
                  <td>{convertToNepaliNumber(index + 1)}</td>
                  <td>{data.label}</td>
                  <td>{convertToNepaliNumber(data.population)}</td>
                  <td>{formatNepaliPercentage(data.percentage)}</td>
                </tr>
              ))}
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(totalPopulationWithDisability)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१५.२: वडा अनुसार अपाङ्गताका कारण वितरण</h3>
        <div className="pdf-chart-container">
          <div 
            style={{ 
              width: "100%", 
              height: "500px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              maxWidth: "700px", // Ensure the chart can use the full width
              margin: "0 auto" // Center the chart
            }}
            dangerouslySetInnerHTML={{ __html: charts.barChart }}
          />
        </div>
      </div>

      {/* Ward-wise Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.१५.२: वडा अनुसार अपाङ्गताका कारण विवरण</h3>
        <table className="data-table ward-disability-cause-table">
          <thead>
            <tr>
              <th>अपाङ्गताको कारण</th>
              {Object.entries(processedData.wardData)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([wardNum]) => (
                  <th key={wardNum}>वडा {convertToNepaliNumber(parseInt(wardNum))}</th>
                ))}
              <th>जम्मा</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.disabilityCauseData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([disabilityCause, disabilityCauseData]) => {
                const disabilityCauseTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => {
                    // Find the disability cause in ward data - handle both direct match and label match
                    const directMatch = wardData.disabilityCauses[disabilityCause];
                    if (directMatch !== undefined) return directMatch;
                    
                    // If not found directly, look for label match
                    const labelMatch = Object.entries(wardData.disabilityCauses).find(([label]) => 
                      label === disabilityCauseData.label || label === getDisabilityCauseLabel(disabilityCause)
                    );
                    return labelMatch ? labelMatch[1] : 0;
                  });
                
                const totalForDisabilityCause = disabilityCauseTotals.reduce((sum, count) => sum + count, 0);
                const percentageForDisabilityCause = totalPopulationWithDisability > 0 
                  ? (totalForDisabilityCause / totalPopulationWithDisability) * 100 
                  : 0;

                return (
                  <tr key={disabilityCause}>
                    <td>{disabilityCauseData.label}</td>
                    {disabilityCauseTotals.map((count, index) => (
                      <td key={index}>{convertToNepaliNumber(count)}</td>
                    ))}
                    <td className="grand-total-cell">{convertToNepaliNumber(totalForDisabilityCause)}</td>
                    <td>{formatNepaliPercentage(percentageForDisabilityCause)}</td>
                  </tr>
                );
              })}
            <tr className="total-row">
              <td className="total-label">जम्मा</td>
              {Object.entries(processedData.wardData)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([wardNum, wardData]) => (
                  <td key={wardNum} className="grand-total-cell">
                    {convertToNepaliNumber(wardData.totalDisabilityPopulation)}
                  </td>
                ))}
              <td className="grand-total-cell">{convertToNepaliNumber(totalPopulationWithDisability)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 