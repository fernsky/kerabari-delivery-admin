"use client";

import { api } from "@/trpc/react";
import { 
  processDeathCauseData, 
  generateDeathCauseAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  DEATH_CAUSE_LABELS,
  type ProcessedDeathCauseData 
} from "@/lib/utils/death-cause-utils";
import { 
  ChartGenerator, 
  type ChartData, 
  type WardData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function DeathCauseReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.demographics.wardWiseDeathCause.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedDeathCauseData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map(item => ({
      id: item.id,
      wardNumber: item.wardNumber,
      deathCause: item.deathCause,
      population: item.population || 0,
      deathCauseDisplay: item.deathCauseDisplay
    }));
    
    return processDeathCauseData(mappedData);
  }, [rawData]);

  // Generate charts with optimized dimensions and scaling for A4 printing
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '', barChart: '' };

    // Pie Chart Data - only show death causes with population > 0
    const pieChartData: ChartData = {};
    Object.entries(processedData.deathCauseData)
      .filter(([_, data]) => data.population > 0)
      .forEach(([deathCause, data]) => {
        pieChartData[deathCause] = {
          value: data.population,
          label: data.label,
          color: `hsl(${(data.rank * 36) % 360}, 70%, 50%)`
        };
      });

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {};
      Object.entries(data.deathCauses).forEach(([deathCause, population]) => {
        barChartData[wardNum][deathCause] = population;
      });
    });

    // Calculate optimal chart dimensions based on data
    const numWards = Object.keys(processedData.wardData).length;
    const numCategories = Object.keys(processedData.deathCauseData).filter(key => 
      processedData.deathCauseData[key].population > 0
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
    return generateDeathCauseAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-death-cause">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-death-cause">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.totalDeaths === 0) {
    return (
      <div className="section-content" id="section-death-cause">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.१७ मृत्युका कारण अनुसार जनसंख्याको विवरण
        </h2>
        <p>मृत्युका कारण सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  const totalDeaths = processedData.totalDeaths;

  return (
    <div className="section-content" id="section-death-cause">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.१७ मृत्युका कारण अनुसार जनसंख्याको विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१७.१: मृत्युका कारण अनुसार जनसंख्या वितरण</h3>
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

      {/* Death Cause Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.१७.१: मृत्युका कारण अनुसार जनसंख्या विस्तृत विवरण</h3>
        <table className="data-table death-cause-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>मृत्युको कारण</th>
              <th>जनसंख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.deathCauseData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([deathCause, data], index) => (
                <tr key={deathCause}>
                  <td>{convertToNepaliNumber(index + 1)}</td>
                  <td>{data.label}</td>
                  <td>{convertToNepaliNumber(data.population)}</td>
                  <td>{formatNepaliPercentage(data.percentage)}</td>
                </tr>
              ))}
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(totalDeaths)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१७.२: वडा अनुसार मृत्युका कारण वितरण</h3>
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
        <h3 className="table-title">तालिका ३.१७.२: वडा अनुसार मृत्युका कारण विवरण</h3>
        <table className="data-table ward-death-cause-table">
          <thead>
            <tr>
              <th>मृत्युको कारण</th>
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
            {Object.entries(processedData.deathCauseData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([deathCause, deathCauseData]) => {
                const deathCauseTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => {
                    // Find the death cause in ward data - handle both direct match and label match
                    const directMatch = wardData.deathCauses[deathCause];
                    if (directMatch !== undefined) return directMatch;
                    
                    // If not found directly, look for label match
                    const labelMatch = Object.entries(wardData.deathCauses).find(([label]) => 
                      label === deathCauseData.label
                    );
                    return labelMatch ? labelMatch[1] : 0;
                  });
                
                const totalForDeathCause = deathCauseTotals.reduce((sum, count) => sum + count, 0);
                const percentageForDeathCause = totalDeaths > 0 
                  ? (totalForDeathCause / totalDeaths) * 100 
                  : 0;

                return (
                  <tr key={deathCause}>
                    <td>{deathCauseData.label}</td>
                    {deathCauseTotals.map((count, index) => (
                      <td key={index}>{convertToNepaliNumber(count)}</td>
                    ))}
                    <td className="grand-total-cell">{convertToNepaliNumber(totalForDeathCause)}</td>
                    <td>{formatNepaliPercentage(percentageForDeathCause)}</td>
                  </tr>
                );
              })}
            <tr className="total-row">
              <td className="total-label">जम्मा</td>
              {Object.entries(processedData.wardData)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([wardNum, wardData]) => (
                  <td key={wardNum} className="grand-total-cell">
                    {convertToNepaliNumber(wardData.totalDeaths)}
                  </td>
                ))}
              <td className="grand-total-cell">{convertToNepaliNumber(totalDeaths)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 