"use client";

import { api } from "@/trpc/react";
import { 
  processHouseheadGenderData, 
  generateHouseheadGenderAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  GENDER_LABELS,
  type ProcessedHouseheadGenderData 
} from "@/lib/utils/househead-gender-utils";
import { 
  ChartGenerator, 
  type ChartData, 
  type WardData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function HouseheadGenderReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.demographics.wardWiseHouseHeadGender.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedHouseheadGenderData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map(item => ({
      id: item.id,
      wardNumber: item.wardNumber,
      gender: item.gender,
      population: item.population || 0
    }));
    
    return processHouseheadGenderData(mappedData);
  }, [rawData]);

  // Generate charts
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '', barChart: '' };

    // Pie Chart Data - only show genders with population > 0
    const pieChartData: ChartData = {};
    Object.entries(processedData.genderData)
      .filter(([_, data]) => data.population > 0)
      .forEach(([gender, data]) => {
        pieChartData[gender] = {
          value: data.population,
          label: data.label,
          color: gender === 'MALE' ? '#3B82F6' : gender === 'FEMALE' ? '#EC4899' : '#10B981'
        };
      });

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {};
      Object.entries(data.genders).forEach(([gender, population]) => {
        const label = GENDER_LABELS[gender] || gender;
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
    return generateHouseheadGenderAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-househead-gender">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.१४ घरमुखी लिङ्ग वितरणको विवरण
        </h2>
        <div className="content-section">
          <p>डेटा लोड भइरहेको छ...</p>
        </div>
      </div>
    );
  }

  if (error || !processedData) {
    return (
      <div className="section-content" id="section-househead-gender">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.१४ घरमुखी लिङ्ग वितरणको विवरण
        </h2>
        <div className="content-section">
          <p>डेटा लोड गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-content" id="section-househead-gender">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.१४ घरमुखी लिङ्ग वितरणको विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१४.१: लिङ्ग अनुसार घरमुखी वितरण</h3>
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

      {/* Gender Summary Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.१४.१: लिङ्ग अनुसार घरमुखी विस्तृत तालिका</h3>
        <table className="data-table househead-gender-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>लिङ्ग</th>
              <th>घरमुखी संख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.genderData)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([gender, data], index) => (
                <tr key={gender}>
                  <td>{convertToNepaliNumber(index + 1)}</td>
                  <td>{data.label}</td>
                  <td>{convertToNepaliNumber(data.population)}</td>
                  <td>{formatNepaliPercentage(data.percentage)}</td>
                </tr>
              ))}
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalHouseheads)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१४.२: वडागत घरमुखी लिङ्ग वितरण</h3>
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
        <h3 className="table-title">तालिका ३.१४.२: वडा अनुसार घरमुखी लिङ्ग विवरण</h3>
        <table className="data-table ward-househead-table">
          <thead>
            <tr>
              <th>वडा नं.</th>
              <th>प्रमुख लिङ्ग</th>
              <th>प्रमुख लिङ्गको संख्या</th>
              <th>प्रमुख लिङ्गको प्रतिशत</th>
              <th>महिला घरमुखी</th>
              <th>कुल घरमुखी</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.wardData)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([wardNum, data], index) => (
                <tr key={wardNum}>
                  <td>{convertToNepaliNumber(parseInt(wardNum))}</td>
                  <td>{GENDER_LABELS[data.primaryGender] || data.primaryGender}</td>
                  <td>{convertToNepaliNumber(data.genders[data.primaryGender] || 0)}</td>
                  <td>{formatNepaliPercentage(data.primaryGenderPercentage)}</td>
                  <td>{convertToNepaliNumber(data.genders.FEMALE || 0)}</td>
                  <td>{convertToNepaliNumber(data.totalHouseheads)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 