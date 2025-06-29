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

// Function to get proper label for gender (matching the utils)
function getGenderLabel(gender: string): string {
  const normalized = gender.toUpperCase();
  const mapping: Record<string, string> = {
    'MALE': 'MALE',
    'FEMALE': 'FEMALE',
    'OTHER': 'OTHER',
  };
  const standardGender = mapping[normalized] || gender;
  return GENDER_LABELS[standardGender] || GENDER_LABELS[gender] || gender;
}

export function HouseheadGenderReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.demographics.wardWiseHouseHeadGender.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedHouseheadGenderData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    // Debug: Log raw data
    console.log("Raw househead gender data in report:", rawData);
    
    const mappedData = rawData.map(item => ({
      id: item.id,
      wardNumber: item.wardNumber,
      gender: item.gender,
      population: item.population || 0
    }));
    
    // Debug: Log mapped data
    console.log("Mapped househead gender data:", mappedData);
    
    const processed = processHouseheadGenderData(mappedData);
    
    // Debug: Log processed data
    console.log("Processed househead gender data:", processed);
    
    return processed;
  }, [rawData]);

  // Generate charts with optimized dimensions and scaling for A4 printing
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
        const label = processedData.genderData[gender]?.label || getGenderLabel(gender);
        barChartData[wardNum][label] = population;
      });
    });

    // Calculate optimal chart dimensions based on data
    const numWards = Object.keys(processedData.wardData).length;
    const numCategories = Object.keys(processedData.genderData).filter(key => 
      processedData.genderData[key].population > 0
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
    return generateHouseheadGenderAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-househead-gender">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-househead-gender">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.totalHouseheads === 0) {
    return (
      <div className="section-content" id="section-househead-gender">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.१४ घरमुखी लिङ्ग वितरणको विवरण
        </h2>
        <p>घरमुखी लिङ्ग वितरण सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  const totalHouseheads = processedData.totalHouseheads;

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
              .filter(([_, data]) => data.population > 0)
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
              <td className="grand-total-cell">{convertToNepaliNumber(totalHouseheads)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१४.२: वडा अनुसार घरमुखी लिङ्ग वितरण</h3>
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
        <h3 className="table-title">तालिका ३.१४.२: वडा अनुसार घरमुखी लिङ्ग विवरण</h3>
        <table className="data-table ward-househead-gender-table">
          <thead>
            <tr>
              <th>लिङ्ग</th>
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
            {Object.entries(processedData.genderData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([gender, genderData]) => {
                const genderTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => {
                    // Find the gender in ward data - handle both direct match and label match
                    const directMatch = wardData.genders[gender];
                    if (directMatch !== undefined) return directMatch;
                    
                    // If not found directly, look for label match
                    const labelMatch = Object.entries(wardData.genders).find(([label]) => 
                      label === genderData.label || label === getGenderLabel(gender)
                    );
                    return labelMatch ? labelMatch[1] : 0;
                  });
                
                const totalForGender = genderTotals.reduce((sum, count) => sum + count, 0);
                const percentageForGender = totalHouseheads > 0 
                  ? (totalForGender / totalHouseheads) * 100 
                  : 0;

                return (
                  <tr key={gender}>
                    <td>{genderData.label}</td>
                    {genderTotals.map((count, index) => (
                      <td key={index}>{convertToNepaliNumber(count)}</td>
                    ))}
                    <td className="grand-total-cell">{convertToNepaliNumber(totalForGender)}</td>
                    <td>{formatNepaliPercentage(percentageForGender)}</td>
                  </tr>
                );
              })}
            <tr className="total-row">
              <td className="total-label">जम्मा</td>
              {Object.entries(processedData.wardData)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([wardNum, wardData]) => (
                  <td key={wardNum} className="grand-total-cell">
                    {convertToNepaliNumber(wardData.totalHouseheads)}
                  </td>
                ))}
              <td className="grand-total-cell">{convertToNepaliNumber(totalHouseheads)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 