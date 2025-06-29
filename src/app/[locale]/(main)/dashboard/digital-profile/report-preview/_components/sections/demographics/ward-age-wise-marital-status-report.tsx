"use client";

import { api } from "@/trpc/react";
import { 
  processWardAgeWiseMaritalStatusData, 
  generateWardAgeWiseMaritalStatusAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  type ProcessedWardAgeWiseMaritalStatusData 
} from "@/lib/utils/ward-age-wise-marital-status-utils";
import { 
  ChartGenerator, 
  type ChartData, 
  type WardData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function WardAgeWiseMaritalStatusReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.demographics.wardAgeWiseMaritalStatus.getAll.useQuery();
  
  // Process the raw data
  const processedData: ProcessedWardAgeWiseMaritalStatusData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map((item: any) => ({
      id: item.id,
      wardNumber: item.wardNumber,
      ageGroup: item.ageGroup,
      maritalStatus: item.maritalStatus,
      population: item.population || 0,
    }));
    
    return processWardAgeWiseMaritalStatusData(mappedData);
  }, [rawData]);

  // Generate charts with optimized dimensions and scaling for A4 printing
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '', barChart: '' };

    // Pie Chart Data - only show marital statuses with population > 0
    const pieChartData: ChartData = {};
    Object.entries(processedData.maritalStatusData)
      .filter(([_, data]) => data.totalPopulation > 0)
      .forEach(([maritalStatus, data]) => {
        pieChartData[maritalStatus] = {
          value: data.totalPopulation,
          label: data.label,
          color: `hsl(${(data.rank * 90) % 360}, 70%, 50%)`
        };
      });

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {};
      Object.entries(data.ageGroups).forEach(([ageGroup, ageGroupData]) => {
        const ageGroupLabel = processedData.ageGroupData[ageGroup]?.label || ageGroup;
        barChartData[wardNum][ageGroupLabel] = ageGroupData.totalPopulation;
      });
    });

    // Calculate optimal chart dimensions based on data
    const numWards = Object.keys(processedData.wardData).length;
    const numCategories = Object.keys(processedData.maritalStatusData).filter(key => 
      processedData.maritalStatusData[key].totalPopulation > 0
    ).length;
    
    // Adjust legend height based on number of categories
    const legendHeight = Math.ceil(numCategories / 3) * 25 + 30;
    
    // Adjust max bar width based on number of wards
    const maxBarWidth = numWards <= 9 ? 50 : 40;

    return {
      pieChart: ChartGenerator.generatePieChart(pieChartData, {
        width: 600,
        height: 350,
        showLegend: true,
        nepaliNumbers: true
      }),
      barChart: ChartGenerator.generateBarChart(barChartData, {
        width: 700,
        height: 500,
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
    return generateWardAgeWiseMaritalStatusAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-ward-age-wise-marital-status">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-ward-age-wise-marital-status">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.totalPopulation === 0) {
    return (
      <div className="section-content" id="section-ward-age-wise-marital-status">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.५ वडा अनुसार उमेर र वैवाहिक स्थिति विवरण
        </h2>
        <p>वडा अनुसार उमेर र वैवाहिक स्थिति सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  return (
    <div className="section-content" id="section-ward-age-wise-marital-status">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.५ वडा अनुसार उमेर र वैवाहिक स्थिति विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.५.१: वैवाहिक स्थिति अनुसार वितरण</h3>
        <div className="pdf-chart-container">
          <div 
            style={{ 
              width: "100%", 
              height: "350px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              maxWidth: "600px",
              margin: "0 auto"
            }}
            dangerouslySetInnerHTML={{ __html: charts.pieChart }}
          />
        </div>
      </div>

      {/* Marital Status Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.५.१: वैवाहिक स्थिति अनुसार जनसंख्या विस्तृत विवरण</h3>
        <table className="data-table marital-status-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>वैवाहिक स्थिति</th>
              <th>जनसंख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.maritalStatusData)
              .filter(([_, data]) => data.totalPopulation > 0)
              .sort(([, a], [, b]) => b.totalPopulation - a.totalPopulation)
              .map(([maritalStatus, data], index) => (
                <tr key={maritalStatus}>
                  <td>{convertToNepaliNumber(index + 1)}</td>
                  <td>{data.label}</td>
                  <td>{convertToNepaliNumber(data.totalPopulation)}</td>
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

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.५.२: वडा अनुसार उमेर समूह वितरण</h3>
        <div className="pdf-chart-container">
          <div 
            style={{ 
              width: "100%", 
              height: "500px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              maxWidth: "700px",
              margin: "0 auto"
            }}
            dangerouslySetInnerHTML={{ __html: charts.barChart }}
          />
        </div>
      </div>

      {/* Ward-wise Detailed Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.५.२: वडा अनुसार उमेर र वैवाहिक स्थिति विस्तृत विवरण</h3>
        <table className="data-table ward-marital-status-table">
          <thead>
            <tr>
              <th>वडा नं.</th>
              <th>कुल जनसंख्या</th>
              <th>मुख्य उमेर समूह</th>
              <th>मुख्य उमेर समूह प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.wardData)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([wardNum, data]) => (
                <tr key={wardNum}>
                  <td>{convertToNepaliNumber(parseInt(wardNum))}</td>
                  <td>{convertToNepaliNumber(data.totalPopulation)}</td>
                  <td>{processedData.ageGroupData[data.primaryAgeGroup]?.label || data.primaryAgeGroup}</td>
                  <td>{formatNepaliPercentage(data.primaryAgeGroupPercentage)}</td>
                </tr>
              ))}
            <tr className="total-row">
              <td className="total-label">जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalPopulation)}</td>
              <td className="total-cell" colSpan={2}>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 