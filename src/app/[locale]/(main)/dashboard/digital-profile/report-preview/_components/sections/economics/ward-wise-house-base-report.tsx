"use client";

import { api } from "@/trpc/react";
import { 
  processWardWiseHouseBaseData, 
  getWardWiseHouseBaseAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  BASE_TYPE_LABELS,
  type ProcessedWardWiseHouseBaseData 
} from "@/lib/utils/ward-wise-house-base";
import { 
  ChartGenerator, 
  type ChartData, 
  type WardData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function WardWiseHouseBaseReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.economics.wardWiseHouseholdBase.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedWardWiseHouseBaseData[] | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map((item: any) => ({
      id: item.id,
      wardNumber: item.wardNumber,
      baseType: item.baseType,
      count: item.households || 0,
    }));
    
    return processWardWiseHouseBaseData(mappedData);
  }, [rawData]);

  // Generate charts
  const charts = useMemo(() => {
    if (!processedData || processedData.length === 0) return { pieChart: '', barChart: '' };

    // Pie Chart Data - overall base distribution
    const totalConcretePillar = processedData.reduce((sum, ward) => sum + ward.concretePillar, 0);
    const totalCementJoined = processedData.reduce((sum, ward) => sum + ward.cementJoined, 0);
    const totalMudJoined = processedData.reduce((sum, ward) => sum + ward.mudJoined, 0);
    const totalWoodPole = processedData.reduce((sum, ward) => sum + ward.woodPole, 0);
    const totalOther = processedData.reduce((sum, ward) => sum + ward.other, 0);

    const pieChartData: ChartData = {
      CONCRETE_PILLAR: {
        value: totalConcretePillar,
        label: BASE_TYPE_LABELS.CONCRETE_PILLAR,
        color: "#10b981"
      },
      CEMENT_JOINED: {
        value: totalCementJoined,
        label: BASE_TYPE_LABELS.CEMENT_JOINED,
        color: "#3b82f6"
      },
      MUD_JOINED: {
        value: totalMudJoined,
        label: BASE_TYPE_LABELS.MUD_JOINED,
        color: "#f59e0b"
      },
      WOOD_POLE: {
        value: totalWoodPole,
        label: BASE_TYPE_LABELS.WOOD_POLE,
        color: "#ef4444"
      },
      OTHER: {
        value: totalOther,
        label: BASE_TYPE_LABELS.OTHER,
        color: "#8b5cf6"
      }
    };

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    processedData.forEach(ward => {
      barChartData[ward.wardNumber] = {
        [BASE_TYPE_LABELS.CONCRETE_PILLAR]: ward.concretePillar,
        [BASE_TYPE_LABELS.CEMENT_JOINED]: ward.cementJoined,
        [BASE_TYPE_LABELS.MUD_JOINED]: ward.mudJoined,
        [BASE_TYPE_LABELS.WOOD_POLE]: ward.woodPole,
        [BASE_TYPE_LABELS.OTHER]: ward.other,
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
    return getWardWiseHouseBaseAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-ward-wise-house-base">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-ward-wise-house-base">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.length === 0) {
    return (
      <div className="section-content" id="section-ward-wise-house-base">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ४.४ वडा अनुसार घरको आधार विवरण
        </h2>
        <p>वडा अनुसार घरको आधार सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  const totalHouseholds = processedData.reduce((sum, ward) => sum + ward.total, 0);

  return (
    <div className="section-content" id="section-ward-wise-house-base">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ४.४ वडा अनुसार घरको आधार विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ४.४.१: आधार अनुसार वितरण</h3>
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
        <h3 className="chart-title">चित्र ४.४.२: वडा अनुसार आधार वितरण</h3>
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
        <h3 className="table-title">तालिका ४.४.२: वडा अनुसार आधार विवरण</h3>
        <table className="data-table ward-house-base-table">
          <thead>
            <tr>
              <th>आधार प्रकार</th>
              {processedData
                .sort((a, b) => a.wardNumber - b.wardNumber)
                .map((ward) => (
                  <th key={ward.wardNumber}>वडा {convertToNepaliNumber(ward.wardNumber)}</th>
                ))}
              <th>जम्मा</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {[
              { type: 'CONCRETE_PILLAR', label: BASE_TYPE_LABELS.CONCRETE_PILLAR, key: 'concretePillar' },
              { type: 'CEMENT_JOINED', label: BASE_TYPE_LABELS.CEMENT_JOINED, key: 'cementJoined' },
              { type: 'MUD_JOINED', label: BASE_TYPE_LABELS.MUD_JOINED, key: 'mudJoined' },
              { type: 'WOOD_POLE', label: BASE_TYPE_LABELS.WOOD_POLE, key: 'woodPole' },
              { type: 'OTHER', label: BASE_TYPE_LABELS.OTHER, key: 'other' },
            ]
            .filter(item => processedData.reduce((sum, ward) => sum + (ward as any)[item.key], 0) > 0)
            .map((item) => {
              const baseTotals = processedData
                .sort((a, b) => a.wardNumber - b.wardNumber)
                .map((ward) => (ward as any)[item.key] || 0);
              
              const totalForBase = baseTotals.reduce((sum, count) => sum + count, 0);
              const percentageForBase = totalHouseholds > 0 
                ? (totalForBase / totalHouseholds) * 100 
                : 0;

              return (
                <tr key={item.type}>
                  <td>{item.label}</td>
                  {baseTotals.map((count, index) => (
                    <td key={index}>{convertToNepaliNumber(count)}</td>
                  ))}
                  <td className="grand-total-cell">{convertToNepaliNumber(totalForBase)}</td>
                  <td>{formatNepaliPercentage(percentageForBase)}</td>
                </tr>
              );
            })}
            <tr className="total-row">
              <td className="total-label">जम्मा</td>
              {processedData
                .sort((a, b) => a.wardNumber - b.wardNumber)
                .map((ward) => (
                  <td key={ward.wardNumber} className="grand-total-cell">
                    {convertToNepaliNumber(ward.total)}
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