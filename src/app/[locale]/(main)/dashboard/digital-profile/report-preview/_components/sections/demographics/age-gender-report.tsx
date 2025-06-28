"use client";

import { api } from "@/trpc/react";
import { 
  processAgeGenderData, 
  generateAgeGenderAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  AGE_GROUP_LABELS,
  GENDER_LABELS,
  type ProcessedAgeGenderData 
} from "@/lib/utils/age-gender-utils";
import { 
  ChartGenerator, 
  type PopulationPyramidData, 
  type WardData, 
  type ChartData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function AgeGenderReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.demographics.wardAgeWisePopulation.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedAgeGenderData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map(item => ({
      id: item.id,
      wardNumber: item.wardNumber,
      ageGroup: item.ageGroup,
      gender: item.gender,
      population: item.population
    }));
    
    return processAgeGenderData(mappedData);
  }, [rawData]);

  // Generate charts
  const charts = useMemo(() => {
    if (!processedData) return { populationPyramid: '', genderDistribution: '', wardComparison: '' };

    // Population Pyramid Data
    const pyramidData: PopulationPyramidData = {};
    Object.entries(processedData.ageGroupData).forEach(([ageGroup, data]) => {
      pyramidData[ageGroup] = {
        male: data.male,
        female: data.female,
        other: data.other || 0,
        label: data.label
      };
    });

    // Gender Distribution Pie Chart Data
    const genderData: ChartData = {
      male: {
        value: processedData.malePopulation,
        label: GENDER_LABELS.MALE,
        color: '#3498db'
      },
      female: {
        value: processedData.femalePopulation,
        label: GENDER_LABELS.FEMALE,
        color: '#e74c3c'
      }
    };

    if (processedData.otherPopulation > 0) {
      genderData.other = {
        value: processedData.otherPopulation,
        label: GENDER_LABELS.OTHER,
        color: '#95a5a6'
      };
    }

    // Ward Comparison Data
    const wardComparisonData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      wardComparisonData[wardNum] = {
        [GENDER_LABELS.MALE]: data.male,
        [GENDER_LABELS.FEMALE]: data.female
      };
      if (data.other > 0) {
        wardComparisonData[wardNum][GENDER_LABELS.OTHER] = data.other;
      }
    });

    return {
      populationPyramid: ChartGenerator.generatePopulationPyramid(pyramidData, {
        width: 800,
        height: 600,
        title: 'जनसंख्या पिरामिड'
      }),
      genderDistribution: ChartGenerator.generatePieChart(genderData, {
        width: 500,
        height: 400,
        title: 'लिङ्ग अनुसार जनसंख्या वितरण'
      }),
      wardComparison: ChartGenerator.generateStackedBarChart(wardComparisonData, {
        width: 800,
        height: 500,
        title: 'वडागत लिङ्गीय वितरण',
        colors: ['#3498db', '#e74c3c', '#95a5a6']
      })
    };
  }, [processedData]);

  // Generate analysis text
  const analysisText = useMemo(() => {
    if (!processedData) return '';
    return generateAgeGenderAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-age-gender">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.२ उमेर र लिङ्ग अनुसार जनसंख्या वितरण
        </h2>
        <div className="content-section">
          <p>डेटा लोड भइरहेको छ...</p>
        </div>
      </div>
    );
  }

  if (error || !processedData) {
    return (
      <div className="section-content" id="section-age-gender">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.२ उमेर र लिङ्ग अनुसार जनसंख्या वितरण
        </h2>
        <div className="content-section">
          <p>डेटा लोड गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-content" id="section-age-gender">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.२ उमेर र लिङ्ग अनुसार जनसंख्या वितरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Population Pyramid Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.२.१: जनसंख्या पिरामिड</h3>
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

      {/* Gender Distribution Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.२.२: लिङ्ग अनुसार जनसंख्या वितरण</h3>
        <div className="pdf-chart-container">
          <div 
            style={{ 
              width: "100%", 
              height: "400px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              backgroundColor: "#f9fafb"
            }}
            dangerouslySetInnerHTML={{ __html: charts.genderDistribution }}
          />
        </div>
      </div>

      {/* Age Group Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.२.१: उमेर समूह अनुसार जनसंख्या वितरण</h3>
        <table className="data-table age-gender-table">
          <thead>
            <tr>
              <th>उमेर समूह</th>
              <th>पुरुष</th>
              <th>महिला</th>
              {processedData.otherPopulation > 0 && <th>अन्य</th>}
              <th>जम्मा</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.ageGroupData).map(([ageGroup, data]) => (
              <tr key={ageGroup}>
                <td>{data.label}</td>
                <td>{convertToNepaliNumber(data.male)}</td>
                <td>{convertToNepaliNumber(data.female)}</td>
                {processedData.otherPopulation > 0 && <td>{convertToNepaliNumber(data.other)}</td>}
                <td>{convertToNepaliNumber(data.total)}</td>
                <td>{formatNepaliPercentage(data.percentage)}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td className="total-label">जम्मा</td>
              <td className="total-cell">{convertToNepaliNumber(processedData.malePopulation)}</td>
              <td className="total-cell">{convertToNepaliNumber(processedData.femalePopulation)}</td>
              {processedData.otherPopulation > 0 && <td className="total-cell">{convertToNepaliNumber(processedData.otherPopulation)}</td>}
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalPopulation)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ward-wise Comparison Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.२.३: वडागत लिङ्गीय वितरण</h3>
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
            dangerouslySetInnerHTML={{ __html: charts.wardComparison }}
          />
        </div>
      </div>


    </div>
  );
} 