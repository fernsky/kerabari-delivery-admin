"use client";

import { api } from "@/trpc/react";
import { 
  processWardWiseBirthplaceHouseholdsData, 
  generateWardWiseBirthplaceHouseholdsAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  BIRTHPLACE_LABELS,
  type ProcessedWardWiseBirthplaceHouseholdsData 
} from "@/lib/utils/wardwise-birthplace-households-utils";
import { 
  ChartGenerator, 
  type ChartData, 
  type WardData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function WardWiseBirthplaceHouseholdsReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.demographics.wardWiseBirthplaceHouseholds.getAll.useQuery();
  
  // Process the raw data
  const processedData: ProcessedWardWiseBirthplaceHouseholdsData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map((item: any) => ({
      id: item.id,
      wardNumber: item.wardNumber,
      birthPlace: item.birthPlace,
      households: item.households || 0,
    }));
    
    return processWardWiseBirthplaceHouseholdsData(mappedData);
  }, [rawData]);

  // Generate charts with optimized dimensions and scaling for A4 printing
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '', barChart: '' };

    // Pie Chart Data - only show birthplace types with households > 0
    const pieChartData: ChartData = {};
    Object.entries(processedData.birthplaceData)
      .filter(([_, data]) => data.households > 0)
      .forEach(([birthplaceType, data]) => {
        pieChartData[birthplaceType] = {
          value: data.households,
          label: data.label,
          color: `hsl(${(data.rank * 90) % 360}, 70%, 50%)`
        };
      });

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {};
      Object.entries(data.birthplaces).forEach(([birthplaceType, households]) => {
        const label = processedData.birthplaceData[birthplaceType]?.label || birthplaceType;
        barChartData[wardNum][label] = households;
      });
    });

    // Calculate optimal chart dimensions based on data
    const numWards = Object.keys(processedData.wardData).length;
    const numCategories = Object.keys(processedData.birthplaceData).filter(key => 
      processedData.birthplaceData[key].households > 0
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
    return generateWardWiseBirthplaceHouseholdsAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-ward-wise-birthplace-households">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-ward-wise-birthplace-households">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.totalHouseholds === 0) {
    return (
      <div className="section-content" id="section-ward-wise-birthplace-households">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.२ वडा अनुसार जन्मस्थान परिवार विवरण
        </h2>
        <p>वडा अनुसार जन्मस्थान परिवार सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  return (
    <div className="section-content" id="section-ward-wise-birthplace-households">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.२ वडा अनुसार जन्मस्थान परिवार विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.२.१: जन्मस्थान अनुसार वितरण</h3>
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

      {/* Birthplace Types Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.२.१: जन्मस्थान अनुसार परिवार विस्तृत विवरण</h3>
        <table className="data-table birthplace-households-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>जन्मस्थान</th>
              <th>परिवार संख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.birthplaceData)
              .filter(([_, data]) => data.households > 0)
              .sort(([, a], [, b]) => b.households - a.households)
              .map(([birthplaceType, data], index) => (
                <tr key={birthplaceType}>
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
        <h3 className="chart-title">चित्र ३.२.२: वडा अनुसार जन्मस्थान परिवार वितरण</h3>
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
        <h3 className="table-title">तालिका ३.२.२: वडा अनुसार जन्मस्थान परिवार विस्तृत विवरण</h3>
        <table className="data-table ward-birthplace-households-table">
          <thead>
            <tr>
              <th>वडा नं.</th>
              <th>कुल परिवार</th>
              <th>मुख्य जन्मस्थान</th>
              <th>मुख्य जन्मस्थान प्रतिशत</th>
              <th>जन्मस्थान प्रकार संख्या</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.wardData)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([wardNum, data]) => (
                <tr key={wardNum}>
                  <td>{convertToNepaliNumber(parseInt(wardNum))}</td>
                  <td>{convertToNepaliNumber(data.totalHouseholds)}</td>
                  <td>{processedData.birthplaceData[data.primaryBirthplace]?.label || data.primaryBirthplace}</td>
                  <td>{formatNepaliPercentage(data.primaryBirthplacePercentage)}</td>
                  <td>{convertToNepaliNumber(data.birthplaceCount)}</td>
                </tr>
              ))}
            <tr className="total-row">
              <td className="total-label">जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalHouseholds)}</td>
              <td className="total-cell" colSpan={3}>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 