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
  console.log(rawData);
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

  // Generate charts
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '', barChart: '' };

    // Pie Chart Data - overall ownership distribution
    const totalOwned = processedData.ownershipData.PRIVATE?.households ?? 0;
    const totalRented = processedData.ownershipData.RENT?.households ?? 0;
    const totalInstitutional = processedData.ownershipData.INSTITUTIONAL?.households ?? 0;
    const totalOther = processedData.ownershipData.OTHER?.households ?? 0;

    const pieChartData: ChartData = {
      owned: {
        value: totalOwned,
        label: HOUSE_OWNERSHIP_LABELS.PRIVATE,
        color: "#10b981"
      },
      rented: {
        value: totalRented,
        label: HOUSE_OWNERSHIP_LABELS.RENT,
        color: "#3b82f6"
      },
      institutional: {
        value: totalInstitutional,
        label: HOUSE_OWNERSHIP_LABELS.INSTITUTIONAL,
        color: "#f59e0b"
      },
      other: {
        value: totalOther,
        label: HOUSE_OWNERSHIP_LABELS.OTHER,
        color: "#6b7280"
      }
    };

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, ward]) => {
      barChartData[wardNum] = {
        [HOUSE_OWNERSHIP_LABELS.PRIVATE]: ward.ownershipTypes.PRIVATE ?? 0,
        [HOUSE_OWNERSHIP_LABELS.RENT]: ward.ownershipTypes.RENT ?? 0,
        [HOUSE_OWNERSHIP_LABELS.INSTITUTIONAL]: ward.ownershipTypes.INSTITUTIONAL ?? 0,
        [HOUSE_OWNERSHIP_LABELS.OTHER]: ward.ownershipTypes.OTHER ?? 0,
      };
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
        nepaliNumbers: true,
        maxBarWidth: 45,
        legendHeight: 100
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

  const totalHouseholds = processedData.totalHouseholds;

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
              height: "450px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center"
            }}
            dangerouslySetInnerHTML={{ __html: charts.pieChart }}
          />
        </div>
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
              maxWidth: "800px", // Ensure the chart can use the full width
              margin: "0 auto" // Center the chart
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
            {[
              { type: 'PRIVATE', label: HOUSE_OWNERSHIP_LABELS.PRIVATE },
              { type: 'RENT', label: HOUSE_OWNERSHIP_LABELS.RENT },
              { type: 'INSTITUTIONAL', label: HOUSE_OWNERSHIP_LABELS.INSTITUTIONAL },
              { type: 'OTHER', label: HOUSE_OWNERSHIP_LABELS.OTHER },
            ]
            .filter(item => (processedData.ownershipData[item.type]?.households ?? 0) > 0)
            .map((item) => {
              const ownershipTotals = Object.entries(processedData.wardData)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([wardNum, wardData]) => wardData.ownershipTypes[item.type] ?? 0);
              const totalForOwnership = ownershipTotals.reduce((sum, count) => sum + count, 0);
              const percentageForOwnership = totalHouseholds > 0 
                ? (totalForOwnership / totalHouseholds) * 100 
                : 0;
              return (
                <tr key={item.type}>
                  <td>{item.label}</td>
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
              <td className="grand-total-cell">{convertToNepaliNumber(totalHouseholds)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 