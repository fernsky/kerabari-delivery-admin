"use client";

import { api } from "@/trpc/react";
import { 
  processEconomicallyActiveData, 
  generateEconomicallyActiveAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  ECONOMICALLY_ACTIVE_AGE_GROUP_LABELS,
  type ProcessedEconomicallyActiveData 
} from "@/lib/utils/economically-active-utils";
import { 
  ChartGenerator, 
  type ChartData, 
  type WardData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

// Function to get proper label for age group (matching the utils)
function getAgeGroupLabel(ageGroup: string): string {
  const normalized = ageGroup.toUpperCase();
  const mapping: Record<string, string> = {
    'AGE_0_TO_14': 'AGE_0_TO_14',
    'AGE_15_TO_59': 'AGE_15_TO_59',
    'AGE_60_PLUS': 'AGE_60_PLUS',
    '0_TO_14': 'AGE_0_TO_14',
    '15_TO_59': 'AGE_15_TO_59',
    '60_PLUS': 'AGE_60_PLUS',
  };
  const standardAgeGroup = mapping[normalized] || ageGroup;
  return ECONOMICALLY_ACTIVE_AGE_GROUP_LABELS[standardAgeGroup] || ECONOMICALLY_ACTIVE_AGE_GROUP_LABELS[ageGroup] || ageGroup;
}

export function EconomicallyActiveReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.demographics.wardAgeWiseEconomicallyActivePopulation.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedEconomicallyActiveData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    // Debug: Log raw data
    console.log("Raw economically active data in report:", rawData);
    
    const mappedData = rawData.map(item => ({
      id: item.id,
      wardNumber: item.wardNumber,
      ageGroup: item.ageGroup,
      gender: item.gender,
      population: item.population || 0,
      ageGroupDisplay: item.ageGroupDisplay
    }));
    
    // Debug: Log mapped data
    console.log("Mapped economically active data:", mappedData);
    
    const processed = processEconomicallyActiveData(mappedData);
    
    // Debug: Log processed data
    console.log("Processed economically active data:", processed);
    
    return processed;
  }, [rawData]);

  // Generate charts with optimized dimensions and scaling for A4 printing
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '', barChart: '' };

    // Pie Chart Data - only show age groups with population > 0
    const pieChartData: ChartData = {};
    Object.entries(processedData.ageGroupData)
      .filter(([_, data]) => data.population > 0)
      .forEach(([ageGroup, data]) => {
        pieChartData[ageGroup] = {
          value: data.population,
          label: data.label,
          color: `hsl(${(data.rank * 45) % 360}, 70%, 50%)`
        };
      });

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {};
      Object.entries(data.ageGroups).forEach(([ageGroup, population]) => {
        const label = processedData.ageGroupData[ageGroup]?.label || getAgeGroupLabel(ageGroup);
        barChartData[wardNum][label] = population;
      });
    });

    // Calculate optimal chart dimensions based on data
    const numWards = Object.keys(processedData.wardData).length;
    const numCategories = Object.keys(processedData.ageGroupData).filter(key => 
      processedData.ageGroupData[key].population > 0
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
    return generateEconomicallyActiveAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-economically-active">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-economically-active">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.totalEconomicallyActivePopulation === 0) {
    return (
      <div className="section-content" id="section-economically-active">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.१६ आर्थिक रूपले सक्रिय जनसंख्याको विवरण
        </h2>
        <p>आर्थिक रूपले सक्रिय जनसंख्या सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  const totalEconomicallyActivePopulation = processedData.totalEconomicallyActivePopulation;

  return (
    <div className="section-content" id="section-economically-active">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.१६ आर्थिक रूपले सक्रिय जनसंख्याको विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१६.१: उमेर समूह अनुसार आर्थिक रूपले सक्रिय जनसंख्या वितरण</h3>
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

      {/* Age Group Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.१६.१: उमेर समूह अनुसार आर्थिक रूपले सक्रिय जनसंख्या विस्तृत विवरण (सबै लिङ्ग समावेश)</h3>
        <table className="data-table economically-active-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>उमेर समूह</th>
              <th>जनसंख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.ageGroupData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([ageGroup, data], index) => (
                <tr key={ageGroup}>
                  <td>{convertToNepaliNumber(index + 1)}</td>
                  <td>{data.label}</td>
                  <td>{convertToNepaliNumber(data.population)}</td>
                  <td>{formatNepaliPercentage(data.percentage)}</td>
                </tr>
              ))}
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(totalEconomicallyActivePopulation)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१६.२: वडा अनुसार आर्थिक रूपले सक्रिय जनसंख्या वितरण</h3>
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
        <h3 className="table-title">तालिका ३.१६.२: वडा अनुसार आर्थिक रूपले सक्रिय जनसंख्या विवरण (सबै लिङ्ग समावेश)</h3>
        <table className="data-table ward-economically-active-table">
          <thead>
            <tr>
              <th>उमेर समूह</th>
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
            {Object.entries(processedData.ageGroupData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([ageGroup, ageGroupData]) => {
                const ageGroupTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => {
                    // Find the age group in ward data - handle both direct match and label match
                    const directMatch = wardData.ageGroups[ageGroup];
                    if (directMatch !== undefined) return directMatch;
                    
                    // If not found directly, look for label match
                    const labelMatch = Object.entries(wardData.ageGroups).find(([label]) => 
                      label === ageGroupData.label || label === getAgeGroupLabel(ageGroup)
                    );
                    return labelMatch ? labelMatch[1] : 0;
                  });
                
                const totalForAgeGroup = ageGroupTotals.reduce((sum, count) => sum + count, 0);
                const percentageForAgeGroup = totalEconomicallyActivePopulation > 0 
                  ? (totalForAgeGroup / totalEconomicallyActivePopulation) * 100 
                  : 0;

                return (
                  <tr key={ageGroup}>
                    <td>{ageGroupData.label}</td>
                    {ageGroupTotals.map((count, index) => (
                      <td key={index}>{convertToNepaliNumber(count)}</td>
                    ))}
                    <td className="grand-total-cell">{convertToNepaliNumber(totalForAgeGroup)}</td>
                    <td>{formatNepaliPercentage(percentageForAgeGroup)}</td>
                  </tr>
                );
              })}
            <tr className="total-row">
              <td className="total-label">जम्मा</td>
              {Object.entries(processedData.wardData)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([wardNum, wardData]) => (
                  <td key={wardNum} className="grand-total-cell">
                    {convertToNepaliNumber(wardData.totalEconomicallyActivePopulation)}
                  </td>
                ))}
              <td className="grand-total-cell">{convertToNepaliNumber(totalEconomicallyActivePopulation)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 