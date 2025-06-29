"use client";

import { api } from "@/trpc/react";
import { 
  processWardWiseBirthCertificatePopulationData, 
  generateWardWiseBirthCertificatePopulationAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  type ProcessedWardWiseBirthCertificatePopulationData 
} from "@/lib/utils/wardwise-birth-certificate-population-utils";
import { 
  ChartGenerator, 
  type ChartData, 
  type WardData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function WardWiseBirthCertificatePopulationReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.demographics.wardWiseBirthCertificatePopulation.getAll.useQuery();
  
  // Process the raw data
  const processedData: ProcessedWardWiseBirthCertificatePopulationData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map((item: any) => ({
      id: item.id,
      wardNumber: item.wardNumber,
      totalPopulationUnder5: item.totalPopulationUnder5 || 0,
      withBirthCertificate: item.withBirthCertificate || 0,
      withoutBirthCertificate: item.withoutBirthCertificate || 0,
    }));
    
    return processWardWiseBirthCertificatePopulationData(mappedData);
  }, [rawData]);

  // Generate charts with optimized dimensions and scaling for A4 printing
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '', barChart: '' };

    // Pie Chart Data - certificate status distribution
    const pieChartData: ChartData = {
      withCertificate: {
        value: processedData.certificateData.withCertificate.population,
        label: processedData.certificateData.withCertificate.label,
        color: "#10b981"
      },
      withoutCertificate: {
        value: processedData.certificateData.withoutCertificate.population,
        label: processedData.certificateData.withoutCertificate.label,
        color: "#ef4444"
      }
    };

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {
        "जन्म प्रमाणपत्र सहित": data.withBirthCertificate,
        "जन्म प्रमाणपत्र बिना": data.withoutBirthCertificate
      };
    });

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
        legendHeight: 60,
        maxBarWidth: 50
      })
    };
  }, [processedData]);

  // Generate analysis text
  const analysisText = useMemo(() => {
    if (!processedData) return '';
    return generateWardWiseBirthCertificatePopulationAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-ward-wise-birth-certificate-population">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-ward-wise-birth-certificate-population">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.totalPopulationUnder5 === 0) {
    return (
      <div className="section-content" id="section-ward-wise-birth-certificate-population">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.३ वडा अनुसार जन्म प्रमाणपत्र जनसंख्या विवरण
        </h2>
        <p>वडा अनुसार जन्म प्रमाणपत्र जनसंख्या सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  return (
    <div className="section-content" id="section-ward-wise-birth-certificate-population">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.३ वडा अनुसार जन्म प्रमाणपत्र जनसंख्या विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.३.१: जन्म प्रमाणपत्र स्थिति अनुसार वितरण</h3>
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

      {/* Certificate Status Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.३.१: जन्म प्रमाणपत्र स्थिति अनुसार जनसंख्या विस्तृत विवरण</h3>
        <table className="data-table birth-certificate-population-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>जन्म प्रमाणपत्र स्थिति</th>
              <th>जनसंख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{convertToNepaliNumber(1)}</td>
              <td>{processedData.certificateData.withCertificate.label}</td>
              <td>{convertToNepaliNumber(processedData.certificateData.withCertificate.population)}</td>
              <td>{formatNepaliPercentage(processedData.certificateData.withCertificate.percentage)}</td>
            </tr>
            <tr>
              <td>{convertToNepaliNumber(2)}</td>
              <td>{processedData.certificateData.withoutCertificate.label}</td>
              <td>{convertToNepaliNumber(processedData.certificateData.withoutCertificate.population)}</td>
              <td>{formatNepaliPercentage(processedData.certificateData.withoutCertificate.percentage)}</td>
            </tr>
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalPopulationUnder5)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.३.२: वडा अनुसार जन्म प्रमाणपत्र जनसंख्या वितरण</h3>
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
        <h3 className="table-title">तालिका ३.३.२: वडा अनुसार जन्म प्रमाणपत्र जनसंख्या विस्तृत विवरण</h3>
        <table className="data-table ward-birth-certificate-population-table">
          <thead>
            <tr>
              <th>वडा नं.</th>
              <th>कुल जनसंख्या (५ वर्ष मुनि)</th>
              <th>जन्म प्रमाणपत्र सहित</th>
              <th>जन्म प्रमाणपत्र बिना</th>
              <th>प्रमाणपत्र प्रतिशत</th>
              <th>कवरेज स्कोर</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.wardData)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([wardNum, data]) => (
                <tr key={wardNum}>
                  <td>{convertToNepaliNumber(parseInt(wardNum))}</td>
                  <td>{convertToNepaliNumber(data.totalPopulationUnder5)}</td>
                  <td>{convertToNepaliNumber(data.withBirthCertificate)}</td>
                  <td>{convertToNepaliNumber(data.withoutBirthCertificate)}</td>
                  <td>{formatNepaliPercentage(data.certificatePercentage)}</td>
                  <td>{convertToNepaliNumber(Math.round(data.certificateCoverageScore * 10) / 10)}</td>
                </tr>
              ))}
            <tr className="total-row">
              <td className="total-label">जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalPopulationUnder5)}</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalWithBirthCertificate)}</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalWithoutBirthCertificate)}</td>
              <td className="total-cell">{formatNepaliPercentage((processedData.totalWithBirthCertificate / processedData.totalPopulationUnder5) * 100)}</td>
              <td className="total-cell">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 