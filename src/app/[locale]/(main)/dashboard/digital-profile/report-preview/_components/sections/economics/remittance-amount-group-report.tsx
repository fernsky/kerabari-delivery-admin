"use client";

import { api } from "@/trpc/react";
import { 
  processRemittanceAmountGroupData, 
  generateRemittanceAmountGroupAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  REMITTANCE_AMOUNT_GROUP_LABELS,
  type ProcessedRemittanceAmountGroupData 
} from "@/lib/utils/remittance-amount-group-utils";
import { 
  ChartGenerator, 
  type ChartData, 
  type WardData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function RemittanceAmountGroupReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.economics.wardWiseRemittance.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedRemittanceAmountGroupData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map(item => ({
      id: item.id,
      wardNumber: item.wardNumber,
      amountGroup: item.amountGroup || 'OTHER',
      population: item.sendingPopulation || 0,
    }));
    
    return processRemittanceAmountGroupData(mappedData);
  }, [rawData]);

  // Generate charts with optimized dimensions and scaling for A4 printing
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '', barChart: '' };

    // Pie Chart Data - only show amount groups with population > 0
    const pieChartData: ChartData = {};
    Object.entries(processedData.amountGroupData)
      .filter(([_, data]) => data.population > 0)
      .forEach(([amountGroup, data]) => {
        pieChartData[amountGroup] = {
          value: data.population,
          label: data.label,
          color: `hsl(${(data.rank * 90) % 360}, 70%, 50%)`
        };
      });

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {};
      Object.entries(data.amountGroups).forEach(([amountGroup, population]) => {
        const label = processedData.amountGroupData[amountGroup]?.label || amountGroup;
        barChartData[wardNum][label] = population;
      });
    });

    // Calculate optimal chart dimensions based on data
    const numWards = Object.keys(processedData.wardData).length;
    const numCategories = Object.keys(processedData.amountGroupData).filter(key => 
      processedData.amountGroupData[key].population > 0
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
    return generateRemittanceAmountGroupAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-remittance-amount-group">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-remittance-amount-group">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.totalRemittancePopulation === 0) {
    return (
      <div className="section-content" id="section-remittance-amount-group">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ४.५ रेमिटेन्स रकम समूह विवरण
        </h2>
        <p>रेमिटेन्स रकम समूह सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  return (
    <div className="section-content" id="section-remittance-amount-group">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ४.५ रेमिटेन्स रकम समूह विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ४.५.१: रेमिटेन्स रकम समूह अनुसार जनसंख्या वितरण</h3>
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

      {/* Amount Groups Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ४.५.१: रेमिटेन्स रकम समूह अनुसार जनसंख्या विस्तृत विवरण</h3>
        <table className="data-table remittance-amount-group-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>रकम समूह</th>
              <th>जनसंख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.amountGroupData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([amountGroup, data], index) => (
                <tr key={amountGroup}>
                  <td>{convertToNepaliNumber(index + 1)}</td>
                  <td>{data.label}</td>
                  <td>{convertToNepaliNumber(data.population)}</td>
                  <td>{formatNepaliPercentage(data.percentage)}</td>
                </tr>
              ))}
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalRemittancePopulation)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ४.५.२: वडा अनुसार रेमिटेन्स रकम समूह वितरण</h3>
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
        <h3 className="table-title">तालिका ४.५.२: वडा अनुसार रेमिटेन्स रकम समूह विवरण</h3>
        <table className="data-table ward-remittance-amount-group-table">
          <thead>
            <tr>
              <th>रकम समूह</th>
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
            {Object.entries(processedData.amountGroupData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([amountGroup, amountGroupData]) => {
                const amountGroupTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => wardData.amountGroups[amountGroup] || 0);
                
                const totalForAmountGroup = amountGroupTotals.reduce((sum, count) => sum + count, 0);
                const percentageForAmountGroup = processedData.totalRemittancePopulation > 0 
                  ? (totalForAmountGroup / processedData.totalRemittancePopulation) * 100 
                  : 0;

                return (
                  <tr key={amountGroup}>
                    <td>{amountGroupData.label}</td>
                    {amountGroupTotals.map((count, index) => (
                      <td key={index}>{convertToNepaliNumber(count)}</td>
                    ))}
                    <td className="grand-total-cell">{convertToNepaliNumber(totalForAmountGroup)}</td>
                    <td>{formatNepaliPercentage(percentageForAmountGroup)}</td>
                  </tr>
                );
              })}
            <tr className="total-row">
              <td className="total-label">जम्मा</td>
              {Object.entries(processedData.wardData)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([wardNum, wardData]) => (
                  <td key={wardNum} className="grand-total-cell">
                    {convertToNepaliNumber(wardData.totalRemittancePopulation)}
                  </td>
                ))}
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalRemittancePopulation)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 