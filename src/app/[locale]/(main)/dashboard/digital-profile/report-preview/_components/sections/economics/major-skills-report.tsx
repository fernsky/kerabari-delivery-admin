"use client";

import { api } from "@/trpc/react";
import { 
  processMajorSkillsData, 
  generateMajorSkillsAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  MAJOR_SKILLS_LABELS,
  type ProcessedMajorSkillsData 
} from "@/lib/utils/major-skills-utils";
import { 
  ChartGenerator, 
  type ChartData, 
  type WardData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function MajorSkillsReport() {
  // Fetch data from TRPC API
  const { data: rawData, isLoading, error } = api.profile.economics.wardWiseMajorSkills.getAll.useQuery();

  // Process the raw data
  const processedData: ProcessedMajorSkillsData | null = useMemo(() => {
    if (!rawData || rawData.length === 0) return null;
    
    const mappedData = rawData.map(item => ({
      id: item.id,
      wardNumber: item.wardNumber,
      skill: item.skill,
      population: item.population || 0,
    }));
    
    return processMajorSkillsData(mappedData);
  }, [rawData]);

  // Generate charts
  const charts = useMemo(() => {
    if (!processedData) return { pieChart: '', barChart: '' };

    // Pie Chart Data - only show skills with population > 0
    const pieChartData: ChartData = {};
    Object.entries(processedData.displaySkillData)
      .filter(([_, data]) => data.population > 0)
      .forEach(([skill, data]) => {
        pieChartData[skill] = {
          value: data.population,
          label: data.label,
          color: `hsl(${(data.rank * 45) % 360}, 70%, 50%)`
        };
      });

    // Bar Chart Data for ward comparison (only top 10 + other)
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {};
      Object.keys(processedData.displaySkillData).forEach((skill) => {
        const label = processedData.displaySkillData[skill]?.label || skill;
        if (skill === "OTHER") {
          // For "OTHER", sum all skills not in top 10
          const top10Skills = processedData.topSkills.map(s => s.skill);
          barChartData[wardNum][label] = Object.entries(data.skills)
            .filter(([s, _]) => !top10Skills.includes(s))
            .reduce((sum, [_, count]) => sum + count, 0);
        } else {
          barChartData[wardNum][label] = data.skills[skill] || 0;
        }
      });
    });

    // Calculate optimal chart dimensions based on data
    const numWards = Object.keys(processedData.wardData).length;
    const numCategories = Object.keys(processedData.displaySkillData).filter(key => 
      processedData.displaySkillData[key].population > 0
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
    return generateMajorSkillsAnalysis(processedData);
  }, [processedData]);

  if (isLoading) {
    return (
      <div className="section-content" id="section-major-skills">
        <div className="loading-state">
          <p>तथ्याङ्क लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-content" id="section-major-skills">
        <div className="error-state">
          <p>तथ्याङ्क लोड गर्न समस्या भयो।</p>
        </div>
      </div>
    );
  }

  if (!processedData || processedData.totalSkilledPopulation === 0) {
    return (
      <div className="section-content" id="section-major-skills">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ४.१ प्रमुख सीप विवरण
        </h2>
        <p>प्रमुख सीप सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
      </div>
    );
  }

  return (
    <div className="section-content" id="section-major-skills">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ४.१ प्रमुख सीप विवरण
      </h2>
      
      <div className="content-section">
        <p style={{ textAlign: "justify", fontSize: "1.05em", lineHeight: 1.9, marginBottom: 32 }}>
          {analysisText}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ४.१.१: प्रमुख सीप अनुसार जनसंख्या वितरण</h3>
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

      {/* Skills Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ४.१.१: प्रमुख सीप अनुसार जनसंख्या विस्तृत विवरण</h3>
        <table className="data-table major-skills-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>सीप</th>
              <th>जनसंख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.displaySkillData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([skill, skillData]) => {
                const skillTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => {
                    if (skill === "OTHER") {
                      // For "OTHER", sum all skills not in top 10
                      const top10Skills = processedData.topSkills.map(s => s.skill);
                      return Object.entries(wardData.skills)
                        .filter(([s, _]) => !top10Skills.includes(s))
                        .reduce((sum, [_, count]) => sum + count, 0);
                    }
                    return wardData.skills[skill] || 0;
                  });
                
                const totalForSkill = skillTotals.reduce((sum, count) => sum + count, 0);
                const percentageForSkill = processedData.totalSkilledPopulation > 0 
                  ? (totalForSkill / processedData.totalSkilledPopulation) * 100 
                  : 0;

                return (
                  <tr key={skill}>
                    <td>{convertToNepaliNumber(skillData.rank)}</td>
                    <td>{skillData.label}</td>
                    <td>{convertToNepaliNumber(skillData.population)}</td>
                    <td>{formatNepaliPercentage(skillData.percentage)}</td>
                  </tr>
                );
              })}
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalSkilledPopulation)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ४.१.२: वडा अनुसार प्रमुख सीप वितरण</h3>
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
        <h3 className="table-title">तालिका ४.१.३: वडा अनुसार प्रमुख सीप विवरण</h3>
        <table className="data-table ward-major-skills-table">
          <thead>
            <tr>
              <th>सीप</th>
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
            {Object.entries(processedData.displaySkillData)
              .filter(([_, data]) => data.population > 0)
              .sort(([, a], [, b]) => b.population - a.population)
              .map(([skill, skillData]) => {
                const skillTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => {
                    if (skill === "OTHER") {
                      // For "OTHER", sum all skills not in top 10
                      const top10Skills = processedData.topSkills.map(s => s.skill);
                      return Object.entries(wardData.skills)
                        .filter(([s, _]) => !top10Skills.includes(s))
                        .reduce((sum, [_, count]) => sum + count, 0);
                    }
                    return wardData.skills[skill] || 0;
                  });
                
                const totalForSkill = skillTotals.reduce((sum, count) => sum + count, 0);
                const percentageForSkill = processedData.totalSkilledPopulation > 0 
                  ? (totalForSkill / processedData.totalSkilledPopulation) * 100 
                  : 0;

                return (
                  <tr key={skill}>
                    <td>{skillData.label}</td>
                    {skillTotals.map((count, index) => (
                      <td key={index}>{convertToNepaliNumber(count)}</td>
                    ))}
                    <td className="grand-total-cell">{convertToNepaliNumber(totalForSkill)}</td>
                    <td>{formatNepaliPercentage(percentageForSkill)}</td>
                  </tr>
                );
              })}
            <tr className="total-row">
              <td className="total-label">जम्मा</td>
              {Object.entries(processedData.wardData)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([wardNum, wardData]) => (
                  <td key={wardNum} className="grand-total-cell">
                    {convertToNepaliNumber(wardData.totalSkilledPopulation)}
                  </td>
                ))}
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalSkilledPopulation)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 