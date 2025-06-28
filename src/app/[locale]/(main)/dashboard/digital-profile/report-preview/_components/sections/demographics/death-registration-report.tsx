"use client";

import { api } from "@/trpc/react";
import { 
  processDeathRegistrationData, 
  generateDeathRegistrationAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  type ProcessedDeathRegistrationData 
} from "@/lib/utils/death-registration-utils";
import { 
  ChartGenerator, 
  type ChartData, 
  type WardData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function DeathRegistrationReport() {
  // Fetch data from TRPC API - using the correct API endpoint
  const { data: rawData, isLoading, error } = api.profile.demographics.wardAgeGenderWiseDeceasedPopulation.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedDeathRegistrationData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map((item: any) => ({
      id: item.id,
      wardNumber: item.wardNumber,
      ageGroup: item.ageGroup,
      gender: item.gender,
      population: item.deceasedPopulation || 0,
      ageGroupDisplay: item.ageGroupDisplay,
      genderDisplay: item.genderDisplay
    }));
    
    return processDeathRegistrationData(mappedData);
  }, [rawData]);

  // Generate charts
  const charts = useMemo(() => {
    if (!processedData) return { populationPyramid: '', pieChart: '', barChart: '' };

    // Population Pyramid Data - convert to proper format
    const pyramidData: Record<string, { male: number; female: number; other?: number; label: string }> = {};
    Object.entries(processedData.ageGroupData).forEach(([ageGroup, data]) => {
      pyramidData[ageGroup] = {
        male: data.male,
        female: data.female,
        other: data.other > 0 ? data.other : undefined,
        label: data.label
      };
    });

    // Pie Chart Data - Gender distribution
    const pieChartData: ChartData = {};
    pieChartData['MALE'] = {
      value: processedData.maleDeaths,
      label: 'पुरुष',
      color: '#3B82F6'
    };
    pieChartData['FEMALE'] = {
      value: processedData.femaleDeaths,
      label: 'महिला',
      color: '#EC4899'
    };
    if (processedData.otherDeaths > 0) {
      pieChartData['OTHER'] = {
        value: processedData.otherDeaths,
        label: 'अन्य',
        color: '#10B981'
      };
    }

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {};
      // Use the correct data structure from the utility
      barChartData[wardNum]['पुरुष'] = data.male || 0;
      barChartData[wardNum]['महिला'] = data.female || 0;
      if (data.other > 0) {
        barChartData[wardNum]['अन्य'] = data.other;
      }
    });

    return {
      populationPyramid: ChartGenerator.generatePopulationPyramid(pyramidData, {
        width: 800,
        height: 600,
        showLegend: true,
        nepaliNumbers: true
      }),
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
    return generateDeathRegistrationAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-death-registration">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.१८ मृत्यु दर्ता अनुसार जनसंख्याको विवरण
        </h2>
        <div className="content-section">
          <p>डेटा लोड भइरहेको छ...</p>
        </div>
      </div>
    );
  }

  if (error || !processedData) {
    return (
      <div className="section-content" id="section-death-registration">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.१८ मृत्यु दर्ता अनुसार जनसंख्याको विवरण
        </h2>
        <div className="content-section">
          <p>डेटा लोड गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-content" id="section-death-registration">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.१८ मृत्यु दर्ता अनुसार जनसंख्याको विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Population Pyramid */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१८.१: उमेर र लिङ्ग अनुसार मृतक जनसंख्या पिरामिड</h3>
        <div className="pdf-chart-container">
          <div 
            style={{ 
              width: "100%", 
              height: "600px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              backgroundColor: "#f9fafb"
            }}
            dangerouslySetInnerHTML={{ __html: charts.populationPyramid }}
          />
        </div>
      </div>

      {/* Gender Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.१८.१: लिङ्ग अनुसार मृतक जनसंख्या विस्तृत विवरण</h3>
        <table className="data-table gender-death-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>लिङ्ग</th>
              <th>मृतक संख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{convertToNepaliNumber(1)}</td>
              <td>पुरुष</td>
              <td>{convertToNepaliNumber(processedData.maleDeaths)}</td>
              <td>{formatNepaliPercentage(processedData.malePercentage)}</td>
            </tr>
            <tr>
              <td>{convertToNepaliNumber(2)}</td>
              <td>महिला</td>
              <td>{convertToNepaliNumber(processedData.femaleDeaths)}</td>
              <td>{formatNepaliPercentage(processedData.femalePercentage)}</td>
            </tr>
            {processedData.otherDeaths > 0 && (
              <tr>
                <td>{convertToNepaliNumber(3)}</td>
                <td>अन्य</td>
                <td>{convertToNepaliNumber(processedData.otherDeaths)}</td>
                <td>{formatNepaliPercentage(processedData.otherPercentage)}</td>
              </tr>
            )}
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalDeaths)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१८.२: लिङ्ग अनुसार मृतक जनसंख्या वितरण</h3>
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

      {/* Age Group Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.१८.२: उमेर समूह अनुसार मृतक जनसंख्या विवरण</h3>
        <table className="data-table age-group-death-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>उमेर समूह</th>
              <th>पुरुष</th>
              <th>महिला</th>
              <th>कुल</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.ageGroupData)
              .filter(([_, data]) => data.total > 0)
              .sort(([, a], [, b]) => b.total - a.total)
              .map(([ageGroup, data], index) => (
                <tr key={ageGroup}>
                  <td>{convertToNepaliNumber(index + 1)}</td>
                  <td>{data.label}</td>
                  <td>{convertToNepaliNumber(data.male)}</td>
                  <td>{convertToNepaliNumber(data.female)}</td>
                  <td>{convertToNepaliNumber(data.total)}</td>
                  <td>{formatNepaliPercentage(data.percentage)}</td>
                </tr>
              ))}
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              <td>{convertToNepaliNumber(processedData.maleDeaths)}</td>
              <td>{convertToNepaliNumber(processedData.femaleDeaths)}</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalDeaths)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१८.३: वडागत लिङ्गीय वितरण</h3>
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

      {/* Ward-wise Summary Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.१८.३: वडा अनुसार मृतक जनसंख्या विवरण</h3>
        <table className="data-table ward-death-table">
          <thead>
            <tr>
              <th>वडा नं.</th>
              <th>पुरुष</th>
              <th>महिला</th>
              <th>कुल मृतक</th>
              <th>लिङ्ग अनुपात</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.wardData)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([wardNum, data], index) => {
                const genderRatio = data.female > 0 ? (data.male / data.female) * 100 : 0;
                return (
                  <tr key={wardNum}>
                    <td>{convertToNepaliNumber(parseInt(wardNum))}</td>
                    <td>{convertToNepaliNumber(data.male || 0)}</td>
                    <td>{convertToNepaliNumber(data.female || 0)}</td>
                    <td>{convertToNepaliNumber(data.total)}</td>
                    <td>{convertToNepaliNumber(parseFloat(genderRatio.toFixed(1)))}%</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 