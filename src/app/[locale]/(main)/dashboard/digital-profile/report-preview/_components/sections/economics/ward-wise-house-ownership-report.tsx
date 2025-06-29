"use client";

import { api } from "@/trpc/react";
import { 
  processWardWiseHouseOwnershipData, 
  generateWardWiseHouseOwnershipAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  HOUSE_OWNERSHIP_LABELS,
  type ProcessedWardWiseHouseOwnershipData 
} from "@/lib/utils/wardwise-house-ownership-utils";
import { 
  ChartGenerator, 
  type ChartData, 
  type WardData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function WardWiseHouseOwnershipReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.economics.wardWiseHouseOwnership.getAll.useQuery();
  
  // Process the raw data
  const processedData: ProcessedWardWiseHouseOwnershipData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map((item: any) => ({
      id: item.id,
      wardNumber: item.wardNumber,
      ownershipType: item.ownershipType,
      households: item.households || 0,
    }));
    
    return processWardWiseHouseOwnershipData(mappedData);
  }, [rawData]);

  // Generate charts with optimized dimensions and scaling for A4 printing
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '', barChart: '' };

    // Pie Chart Data - only show ownership types with households > 0
    const pieChartData: ChartData = {};
    Object.entries(processedData.ownershipData)
      .filter(([_, data]) => data.households > 0)
      .forEach(([ownershipType, data]) => {
        pieChartData[ownershipType] = {
          value: data.households,
          label: data.label,
          color: `hsl(${(data.rank * 90) % 360}, 70%, 50%)`
        };
      });

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {};
      Object.entries(data.ownershipTypes).forEach(([ownershipType, households]) => {
        const label = processedData.ownershipData[ownershipType]?.label || ownershipType;
        barChartData[wardNum][label] = households;
      });
    });

    // Calculate optimal chart dimensions based on data
    const numWards = Object.keys(processedData.wardData).length;
    const numCategories = Object.keys(processedData.ownershipData).filter(key => 
      processedData.ownershipData[key].households > 0
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
    return generateWardWiseHouseOwnershipAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-ward-wise-house-ownership">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-ward-wise-house-ownership">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.totalHouseholds === 0) {
    return (
      <div className="section-content" id="section-ward-wise-house-ownership">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ४.२ वडा अनुसार घर स्वामित्व विवरण
        </h2>
        <p>वडा अनुसार घर स्वामित्व सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  return (
    <div className="section-content" id="section-ward-wise-house-ownership">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ४.२ वडा अनुसार घर स्वामित्व विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ४.२.१: घर स्वामित्व अनुसार वितरण</h3>
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

      {/* Ownership Types Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ४.२.१: घर स्वामित्व प्रकार अनुसार परिवार विस्तृत विवरण</h3>
        <table className="data-table house-ownership-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>स्वामित्व प्रकार</th>
              <th>परिवार संख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.ownershipData)
              .filter(([_, data]) => data.households > 0)
              .sort(([, a], [, b]) => b.households - a.households)
              .map(([ownershipType, data], index) => (
                <tr key={ownershipType}>
                  <td>{convertToNepaliNumber(index + 1)}</td>
                  <td>{data.label}</td>
                  <td>{convertToNepaliNumber(data.households)}</td>
                  <td>{formatNepaliPercentage(data.percentage)}</td>
                </tr>
              ))}
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalHouseholds)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ४.२.२: वडा अनुसार घर स्वामित्व वितरण</h3>
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

      {/* Ward-wise Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ४.२.२: वडा अनुसार घर स्वामित्व विवरण</h3>
        <table className="data-table ward-house-ownership-table">
          <thead>
            <tr>
              <th>स्वामित्व प्रकार</th>
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
            {Object.entries(processedData.ownershipData)
              .filter(([_, data]) => data.households > 0)
              .sort(([, a], [, b]) => b.households - a.households)
              .map(([ownershipType, ownershipData]) => {
                const ownershipTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => wardData.ownershipTypes[ownershipType] || 0);
                
                const totalForOwnership = ownershipTotals.reduce((sum, count) => sum + count, 0);
                const percentageForOwnership = processedData.totalHouseholds > 0 
                  ? (totalForOwnership / processedData.totalHouseholds) * 100 
                  : 0;

                return (
                  <tr key={ownershipType}>
                    <td>{ownershipData.label}</td>
                    {ownershipTotals.map((count, index) => (
                      <td key={index}>{convertToNepaliNumber(count)}</td>
                    ))}
                    <td className="grand-total-cell">{convertToNepaliNumber(totalForOwnership)}</td>
                    <td>{formatNepaliPercentage(percentageForOwnership)}</td>
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
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalHouseholds)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 