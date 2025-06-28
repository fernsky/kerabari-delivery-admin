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

  // Generate charts
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
          color: `hsl(${(data.rank * 72) % 360}, 70%, 50%)`
        };
      });

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {};
      Object.entries(data.deathCauses).forEach(([deathCause, population]) => {
        const label = DEATH_CAUSE_LABELS[deathCause] || deathCause;
        barChartData[wardNum][label] = population;
      });
    });

    return {
      pieChart: ChartGenerator.generatePieChart(pieChartData, {
        width: 600,
        height: 450,
        showLegend: true,
        nepaliNumbers: true
      }),
      barChart: ChartGenerator.generateBarChart(barChartData, {
        width: 800,
        height: 500,
        showLegend: true,
        nepaliNumbers: true
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
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.१७ मृत्युका कारण अनुसार जनसंख्याको विवरण
        </h2>
        <div className="content-section">
          <p>डेटा लोड भइरहेको छ...</p>
        </div>
      </div>
    );
  }

  if (error || !processedData) {
    return (
      <div className="section-content" id="section-death-cause">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.१७ मृत्युका कारण अनुसार जनसंख्याको विवरण
        </h2>
        <div className="content-section">
          <p>डेटा लोड गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।</p>
        </div>
      </div>
    );
  }

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
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalDeaths)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१७.२: वडागत मृत्युका कारण वितरण</h3>
        <div className="pdf-chart-container">
          <div 
            style={{ 
              width: "100%", 
              height: "500px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              backgroundColor: "#f9fafb"
            }}
            dangerouslySetInnerHTML={{ __html: charts.barChart }}
          />
        </div>
      </div>

      {/* Ward-wise Summary Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.१७.२: वडा अनुसार मृत्युका कारण विवरण</h3>
        <table className="data-table ward-death-cause-table">
          <thead>
            <tr>
              <th>वडा नं.</th>
              <th>प्रमुख कारण</th>
              <th>प्रमुख कारणको जनसंख्या</th>
              <th>प्रमुख कारणको प्रतिशत</th>
              <th>कुल मृतक जनसंख्या</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.wardData)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([wardNum, data], index) => (
                <tr key={wardNum}>
                  <td>{convertToNepaliNumber(parseInt(wardNum))}</td>
                  <td>{DEATH_CAUSE_LABELS[data.primaryDeathCause] || data.primaryDeathCause}</td>
                  <td>{convertToNepaliNumber(data.deathCauses[data.primaryDeathCause] || 0)}</td>
                  <td>{formatNepaliPercentage(data.primaryDeathCausePercentage)}</td>
                  <td>{convertToNepaliNumber(data.totalDeaths)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 