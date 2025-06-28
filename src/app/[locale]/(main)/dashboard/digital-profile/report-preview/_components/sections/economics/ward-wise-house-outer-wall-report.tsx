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
    // Pie Chart Data
    const totalByType = (type: string) => processedData.wallData[type]?.households ?? 0;
    const pieChartData: ChartData = {};
    Object.keys(HOUSE_OUTER_WALL_LABELS).forEach(type => {
      pieChartData[type] = {
        value: totalByType(type),
        label: HOUSE_OUTER_WALL_LABELS[type],
        color: `hsl(${(Object.keys(HOUSE_OUTER_WALL_LABELS).indexOf(type) * 45) % 360}, 70%, 50%)`
      };
    });
    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, ward]) => {
      barChartData[wardNum] = {};
      Object.keys(HOUSE_OUTER_WALL_LABELS).forEach(type => {
        barChartData[wardNum][HOUSE_OUTER_WALL_LABELS[type]] = ward.wallTypes[type] ?? 0;
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
              backgroundColor: "#f9fafb"
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
              <th>भित्ता प्रकार</th>
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
            {Object.keys(HOUSE_OUTER_WALL_LABELS)
              .filter(type => (processedData.wallData[type]?.households ?? 0) > 0)
              .map(type => {
                const wallTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => wardData.wallTypes[type] ?? 0);
                const totalForWall = wallTotals.reduce((sum, count) => sum + count, 0);
                const percentageForWall = totalHouseholds > 0 
                  ? (totalForWall / totalHouseholds) * 100 
                  : 0;
                return (
                  <tr key={type}>
                    <td>{HOUSE_OUTER_WALL_LABELS[type]}</td>
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