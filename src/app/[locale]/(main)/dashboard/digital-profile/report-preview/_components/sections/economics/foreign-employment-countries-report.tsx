"use client";

import { api } from "@/trpc/react";
import { 
  processForeignEmploymentCountriesData, 
  generateForeignEmploymentCountriesAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  FOREIGN_EMPLOYMENT_COUNTRY_LABELS,
  type ProcessedForeignEmploymentCountriesData 
} from "@/lib/utils/foreign-employment-countries-utils";
import { 
  ChartGenerator, 
  type ChartData, 
  type WardData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function ForeignEmploymentCountriesReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.economics.wardWiseForeignEmploymentCountries.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedForeignEmploymentCountriesData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map(item => ({
      id: item.id,
      wardNumber: item.wardNumber,
      country: item.country,
      population: item.population || 0,
    }));
    
    return processForeignEmploymentCountriesData(mappedData);
  }, [rawData]);

  // Generate charts with optimized dimensions for A4 printing
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '', barChart: '' };

    // Pie Chart Data - only show top 10 + other
    const pieChartData: ChartData = {};
    Object.entries(processedData.displayCountryData)
      .filter(([_, data]) => data.population > 0)
      .forEach(([country, data]) => {
        pieChartData[country] = {
          value: data.population,
          label: data.label,
          color: `hsl(${(data.rank * 45) % 360}, 70%, 50%)`
        };
      });

    // Bar Chart Data for ward comparison (only top 10 + other)
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {};
      Object.keys(processedData.displayCountryData).forEach((country) => {
        const label = processedData.displayCountryData[country]?.label || country;
        barChartData[wardNum][label] = data.countries[country] || 0;
      });
    });

    // Calculate optimal chart dimensions based on data
    const numWards = Object.keys(processedData.wardData).length;
    const numCategories = Object.keys(processedData.displayCountryData).filter(key => 
      processedData.displayCountryData[key].population > 0
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
    return generateForeignEmploymentCountriesAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-foreign-employment-countries">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-foreign-employment-countries">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.totalForeignEmploymentPopulation === 0) {
    return (
      <div className="section-content" id="section-foreign-employment-countries">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ४.२ वैदेशिक रोजगारी देश विवरण
        </h2>
        <p>वैदेशिक रोजगारी देश सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  return (
    <div className="section-content" id="section-foreign-employment-countries">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ४.२ वैदेशिक रोजगारी देश विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ४.२.१: वैदेशिक रोजगारी देश अनुसार जनसंख्या वितरण</h3>
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

      {/* Countries Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ४.२.१: वैदेशिक रोजगारी देश अनुसार जनसंख्या विस्तृत विवरण</h3>
        <table className="data-table foreign-employment-countries-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>देश</th>
              <th>जनसंख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.displayCountryData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([country, countryData]) => {
                const countryTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => {
                    if (country === "OTHER") {
                      // For "OTHER", sum all countries not in top 10
                      const top10Countries = processedData.topCountries.map(c => c.country);
                      return Object.entries(wardData.countries)
                        .filter(([c, _]) => !top10Countries.includes(c))
                        .reduce((sum, [_, count]) => sum + count, 0);
                    }
                    return wardData.countries[country] || 0;
                  });
                
                const totalForCountry = countryTotals.reduce((sum, count) => sum + count, 0);
                const percentageForCountry = processedData.totalForeignEmploymentPopulation > 0 
                  ? (totalForCountry / processedData.totalForeignEmploymentPopulation) * 100 
                  : 0;

                return (
                  <tr key={country}>
                    <td>{convertToNepaliNumber(countryData.rank)}</td>
                    <td>{countryData.label}</td>
                    <td>{convertToNepaliNumber(countryData.population)}</td>
                    <td>{formatNepaliPercentage(countryData.percentage)}</td>
                  </tr>
                );
              })}
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalForeignEmploymentPopulation)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ४.२.२: वडा अनुसार वैदेशिक रोजगारी देश वितरण</h3>
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
        <h3 className="table-title">तालिका ४.२.२: वडा अनुसार वैदेशिक रोजगारी देश विवरण</h3>
        <table className="data-table ward-foreign-employment-countries-table">
          <thead>
            <tr>
              <th>देश</th>
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
            {Object.entries(processedData.displayCountryData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([country, countryData]) => {
                const countryTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => {
                    if (country === "OTHER") {
                      // For "OTHER", sum all countries not in top 10
                      const top10Countries = processedData.topCountries.map(c => c.country);
                      return Object.entries(wardData.countries)
                        .filter(([c, _]) => !top10Countries.includes(c))
                        .reduce((sum, [_, count]) => sum + count, 0);
                    }
                    return wardData.countries[country] || 0;
                  });
                
                const totalForCountry = countryTotals.reduce((sum, count) => sum + count, 0);
                const percentageForCountry = processedData.totalForeignEmploymentPopulation > 0 
                  ? (totalForCountry / processedData.totalForeignEmploymentPopulation) * 100 
                  : 0;

                return (
                  <tr key={country}>
                    <td>{countryData.label}</td>
                    {countryTotals.map((count, index) => (
                      <td key={index}>{convertToNepaliNumber(count)}</td>
                    ))}
                    <td className="grand-total-cell">{convertToNepaliNumber(totalForCountry)}</td>
                    <td>{formatNepaliPercentage(percentageForCountry)}</td>
                  </tr>
                );
              })}
            <tr className="total-row">
              <td className="total-label">जम्मा</td>
              {Object.entries(processedData.wardData)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([wardNum, wardData]) => (
                  <td key={wardNum} className="grand-total-cell">
                    {convertToNepaliNumber(wardData.totalForeignEmploymentPopulation)}
                  </td>
                ))}
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalForeignEmploymentPopulation)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 