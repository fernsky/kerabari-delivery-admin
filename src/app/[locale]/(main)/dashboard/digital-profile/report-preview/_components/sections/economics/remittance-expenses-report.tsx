"use client";

import { api } from "@/trpc/react";
import { 
  processRemittanceExpensesData, 
  generateRemittanceExpensesAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  REMITTANCE_EXPENSE_LABELS,
  type ProcessedRemittanceExpensesData 
} from "@/lib/utils/remittance-expenses-utils";
import { 
  ChartGenerator, 
  type ChartData, 
  type WardData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function RemittanceExpensesReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.economics.wardWiseRemittanceExpenses.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedRemittanceExpensesData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map(item => ({
      id: item.id,
      wardNumber: item.wardNumber,
      remittanceExpense: item.remittanceExpense || 'OTHER',
      households: item.households || 0,
    }));
    
    return processRemittanceExpensesData(mappedData);
  }, [rawData]);

  // Generate charts with optimized dimensions and scaling for A4 printing
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '', barChart: '' };

    // Pie Chart Data - only show expenses with households > 0
    const pieChartData: ChartData = {};
    Object.entries(processedData.expenseData)
      .filter(([_, data]) => data.households > 0)
      .forEach(([expense, data]) => {
        pieChartData[expense] = {
          value: data.households,
          label: data.label,
          color: `hsl(${(data.rank * 45) % 360}, 70%, 50%)`
        };
      });

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {};
      Object.entries(data.expenses).forEach(([expense, households]) => {
        const label = processedData.expenseData[expense]?.label || expense;
        barChartData[wardNum][label] = households;
      });
    });

    // Calculate optimal chart dimensions based on data
    const numWards = Object.keys(processedData.wardData).length;
    const numCategories = Object.keys(processedData.expenseData).filter(key => 
      processedData.expenseData[key].households > 0
    ).length;
    
    // Adjust legend height based on number of categories - reduced for better fit
    const legendHeight = Math.ceil(numCategories / 3) * 25 + 30; // Reduced padding and items per row
    
    // Adjust max bar width based on number of wards - narrower bars for better spacing
    const maxBarWidth = numWards <= 9 ? 50 : 40; // Reduced bar width

    return {
      pieChart: ChartGenerator.generatePieChart(pieChartData, {
        width: 600,
        height: 500,
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
    return generateRemittanceExpensesAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-remittance-expenses">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-remittance-expenses">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.totalHouseholds === 0) {
    return (
      <div className="section-content" id="section-remittance-expenses">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ४.५ रेमिटेन्स खर्च विवरण
        </h2>
        <p>रेमिटेन्स खर्च सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  return (
    <div className="section-content" id="section-remittance-expenses">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ४.५ रेमिटेन्स खर्च विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ४.५.१: रेमिटेन्स खर्च प्रकार अनुसार परिवार वितरण</h3>
        <div className="pdf-chart-container">
          <div 
            style={{ 
              width: "100%", 
              height: "500px", 
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

      {/* Expenses Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ४.५.१: रेमिटेन्स खर्च प्रकार अनुसार परिवार विस्तृत विवरण</h3>
        <table className="data-table remittance-expenses-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>खर्च प्रकार</th>
              <th>परिवार संख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.expenseData)
              .filter(([_, data]) => data.households > 0)
              .sort(([, a], [, b]) => b.households - a.households)
              .map(([expense, data], index) => (
                <tr key={expense}>
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
        <h3 className="chart-title">चित्र ४.५.२: वडा अनुसार रेमिटेन्स खर्च प्रकार वितरण</h3>
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
        <h3 className="table-title">तालिका ४.५.२: वडा अनुसार रेमिटेन्स खर्च प्रकार विवरण</h3>
        <table className="data-table ward-remittance-expenses-table">
          <thead>
            <tr>
              <th>खर्च प्रकार</th>
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
            {Object.entries(processedData.expenseData)
              .filter(([_, data]) => data.households > 0)
              .sort(([, a], [, b]) => b.households - a.households)
              .map(([expense, expenseData]) => {
                const expenseTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => wardData.expenses[expense] || 0);
                
                const totalForExpense = expenseTotals.reduce((sum, count) => sum + count, 0);
                const percentageForExpense = processedData.totalHouseholds > 0 
                  ? (totalForExpense / processedData.totalHouseholds) * 100 
                  : 0;

                return (
                  <tr key={expense}>
                    <td>{expenseData.label}</td>
                    {expenseTotals.map((count, index) => (
                      <td key={index}>{convertToNepaliNumber(count)}</td>
                    ))}
                    <td className="grand-total-cell">{convertToNepaliNumber(totalForExpense)}</td>
                    <td>{formatNepaliPercentage(percentageForExpense)}</td>
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