"use client";

import { api } from "@/trpc/react";
import {
  processWardWiseHouseOuterWallData,
  generateWardWiseHouseOuterWallAnalysis,
  convertToNepaliNumber,
  formatNepaliPercentage,
  HOUSE_OUTER_WALL_LABELS,
  type ProcessedWardWiseHouseOuterWallData
} from "@/lib/utils/wardwise-house-outer-wall-utils";
import { ChartGenerator, type ChartData, type WardData } from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function WardWiseHouseOuterWallReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.economics.wardWiseHouseholdOuterWall.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedWardWiseHouseOuterWallData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    const mappedData = rawData.map((item: any) => ({
      id: item.id,
      wardNumber: item.wardNumber,
      wallType: item.wallType,
      households: item.households || 0,
    }));
    return processWardWiseHouseOuterWallData(mappedData);
  }, [rawData]);

  // Generate charts
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '', barChart: '' };
    
    // Pie Chart Data - only show wall types with households > 0
    const pieChartData: ChartData = {};
    Object.entries(processedData.wallData)
      .filter(([_, data]) => data.households > 0)
      .forEach(([wallType, data]) => {
        pieChartData[wallType] = {
          value: data.households,
          label: data.label,
          color: `hsl(${(data.rank * 45) % 360}, 70%, 50%)`
        };
      });

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {};
      Object.entries(data.wallTypes).forEach(([wallType, households]) => {
        const label = processedData.wallData[wallType]?.label || wallType;
        barChartData[wardNum][label] = households;
      });
    });

    // Calculate optimal chart dimensions based on data
    const numWards = Object.keys(processedData.wardData).length;
    const numCategories = Object.keys(processedData.wallData).filter(key => 
      processedData.wallData[key].households > 0
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
    return generateWardWiseHouseOuterWallAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-ward-wise-house-outer-wall">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="section-content" id="section-ward-wise-house-outer-wall">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }
  if (!processedData || processedData.totalHouseholds === 0) {
    return (
      <div className="section-content" id="section-ward-wise-house-outer-wall">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ४.३ वडा अनुसार घरको बाहिरी भित्ता विवरण
        </h2>
        <p>वडा अनुसार घरको बाहिरी भित्ता सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }
  const totalHouseholds = processedData.totalHouseholds;
  return (
    <div className="section-content" id="section-ward-wise-house-outer-wall">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ४.३ वडा अनुसार घरको बाहिरी भित्ता विवरण
      </h2>
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>
      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ४.३.१: बाहिरी भित्ता अनुसार वितरण</h3>
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

      {/* Wall Types Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ४.३.१: बाहिरी भित्ता प्रकार अनुसार परिवार विस्तृत विवरण</h3>
        <table className="data-table house-outer-wall-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>बाहिरी भित्ता प्रकार</th>
              <th>परिवार संख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.wallData)
              .filter(([_, data]) => data.households > 0)
              .sort(([, a], [, b]) => b.households - a.households)
              .map(([wallType, wallData]) => {
                const wallTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => wardData.wallTypes[wallType] ?? 0);
                const totalForWall = wallTotals.reduce((sum, count) => sum + count, 0);
                const percentageForWall = totalHouseholds > 0 
                  ? (totalForWall / totalHouseholds) * 100 
                  : 0;
                return (
                  <tr key={wallType}>
                    <td>{convertToNepaliNumber(wallData.rank)}</td>
                    <td>{wallData.label}</td>
                    <td>{convertToNepaliNumber(wallData.households)}</td>
                    <td>{formatNepaliPercentage(wallData.percentage)}</td>
                  </tr>
                );
              })}
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(totalHouseholds)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ४.३.२: वडा अनुसार बाहिरी भित्ता वितरण</h3>
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
        <h3 className="table-title">तालिका ४.३.२: वडा अनुसार बाहिरी भित्ता विवरण</h3>
        <table className="data-table ward-house-outer-wall-table">
          <thead>
            <tr>
              <th>बाहिरी भित्ता प्रकार</th>
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
            {Object.entries(processedData.wallData)
              .filter(([_, data]) => data.households > 0)
              .sort(([, a], [, b]) => b.households - a.households)
              .map(([wallType, wallData]) => {
                const wallTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => wardData.wallTypes[wallType] ?? 0);
                const totalForWall = wallTotals.reduce((sum, count) => sum + count, 0);
                const percentageForWall = totalHouseholds > 0 
                  ? (totalForWall / totalHouseholds) * 100 
                  : 0;
                return (
                  <tr key={wallType}>
                    <td>{wallData.label}</td>
                    {wallTotals.map((count, index) => (
                      <td key={index}>{convertToNepaliNumber(count)}</td>
                    ))}
                    <td className="grand-total-cell">{convertToNepaliNumber(totalForWall)}</td>
                    <td>{formatNepaliPercentage(percentageForWall)}</td>
                  </tr>
                );
              })}
            <tr className="total-row">
              <td className="total-label">जम्मा</td>
              {Object.entries(processedData.wardData)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([wardNum, wardData]) => (
                  <td key={wardNum} className="grand-total-cell">
                    {convertToNepaliNumber(wardData.totalHouseholds)}
                  </td>
                ))}
              <td className="grand-total-cell">{convertToNepaliNumber(totalHouseholds)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 