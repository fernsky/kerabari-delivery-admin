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

    // Population Pyramid Data - order from youngest to oldest (top-down)
    const pyramidData: PopulationPyramidData = {};
    const ageGroupOrder = [
      'AGE_0_4', 'AGE_5_9', 'AGE_10_14', 'AGE_15_19', 'AGE_20_24', 
      'AGE_25_29', 'AGE_30_34', 'AGE_35_39', 'AGE_40_44', 'AGE_45_49',
      'AGE_50_54', 'AGE_55_59', 'AGE_60_64', 'AGE_65_69', 'AGE_70_74', 'AGE_75_AND_ABOVE'
    ];
    
    ageGroupOrder.forEach(ageGroup => {
      const data = processedData.ageGroupData[ageGroup as keyof typeof AGE_GROUP_LABELS];
      if (data) {
        pyramidData[ageGroup] = {
          male: data.male,
          female: data.female,
          other: data.other || 0,
          label: data.label
        };
      }
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
        [GENDER_LABELS.MALE]: data.genders['MALE'] || 0,
        [GENDER_LABELS.FEMALE]: data.genders['FEMALE'] || 0
      };
      if (data.genders['OTHER'] && data.genders['OTHER'] > 0) {
        wardComparisonData[wardNum][GENDER_LABELS.OTHER] = data.genders['OTHER'];
      }
    });

    return {
      populationPyramid: ChartGenerator.generatePopulationPyramid(pyramidData, {
        width: 800,
        height: 600,
        showLegend: true,
        nepaliNumbers: true
      }),
      genderDistribution: ChartGenerator.generatePieChart(genderData, {
        width: 600,
        height: 350,
        showLegend: true,
        nepaliNumbers: true
      }),
      wardComparison: ChartGenerator.generateBarChart(wardComparisonData, {
        width: 700,
        height: 500,
        showLegend: true,
        nepaliNumbers: true
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
          <p>तथ्याङ्क लोड हुँदैछ...</p>
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
          <p>तथ्याङ्क लोड गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।</p>
        </div>
      </div>
    );
  }

  if (processedData.totalPopulation === 0) {
    return (
      <div className="section-content" id="section-age-gender">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.२ उमेर र लिङ्ग अनुसार जनसंख्या वितरण
        </h2>
        <p>उमेर र लिङ्ग सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
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

      {/* Gender Distribution Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.२.१: लिङ्ग अनुसार जनसंख्या वितरण</h3>
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
            dangerouslySetInnerHTML={{ __html: charts.genderDistribution }}
          />
        </div>
      </div>

      {/* Gender Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.२.१: लिङ्ग अनुसार जनसंख्या विस्तृत विवरण</h3>
        <table className="data-table gender-table">
          <thead>
            <tr>
              <th>क्र.सं.</th>
              <th>लिङ्ग</th>
              <th>जनसंख्या</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedData.wardData)
              .flatMap(([wardNum, wardData]) => Object.entries(wardData.genders))
              .reduce((acc, [gender, population]) => {
                const existing = acc.find(item => item.gender === gender);
                if (existing) {
                  existing.population += population;
                } else {
                  acc.push({ gender, population });
                }
                return acc;
              }, [] as Array<{gender: string, population: number}>)
              .sort((a, b) => b.population - a.population)
              .map(({ gender, population }, index) => {
                const percentage = (population / processedData.totalPopulation) * 100;
                return (
                  <tr key={gender}>
                    <td>{convertToNepaliNumber(index + 1)}</td>
                    <td>{GENDER_LABELS[gender as keyof typeof GENDER_LABELS] || gender}</td>
                    <td>{convertToNepaliNumber(population)}</td>
                    <td>{formatNepaliPercentage(percentage)}</td>
                  </tr>
                );
              })}
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalPopulation)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Population Pyramid Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.२.२: जनसंख्या पिरामिड</h3>
        <div className="pdf-chart-container">
          <div 
            style={{ 
              width: "100%", 
              height: "600px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              maxWidth: "800px",
              margin: "0 auto"
            }}
            dangerouslySetInnerHTML={{ __html: charts.populationPyramid }}
          />
        </div>
      </div>

      {/* Age Group Distribution Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.२.२: उमेर समूह अनुसार जनसंख्या विवरण</h3>
        <table className="data-table age-group-table">
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
              <td>{convertToNepaliNumber(processedData.malePopulation)}</td>
              <td>{convertToNepaliNumber(processedData.femalePopulation)}</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalPopulation)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ward Comparison Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.२.३: वडा अनुसार लिङ्गीय वितरण</h3>
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
            dangerouslySetInnerHTML={{ __html: charts.wardComparison }}
          />
        </div>
      </div>

      {/* Ward-wise Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.२.३: वडा अनुसार जनसंख्या विवरण</h3>
        <table className="data-table ward-table">
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
            {Object.entries(GENDER_LABELS)
              .filter(([gender]) => {
                const totalForGender = Object.values(processedData.wardData).reduce((sum, wardData) => {
                  return sum + (wardData.genders[gender] || 0);
                }, 0);
                return totalForGender > 0;
              })
              .map(([gender, genderLabel]) => {
                const genderTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => wardData.genders[gender] || 0);
                const totalForGender = genderTotals.reduce((sum, count) => sum + count, 0);
                const percentageForGender = processedData.totalPopulation > 0 
                  ? (totalForGender / processedData.totalPopulation) * 100 
                  : 0;
                return (
                  <tr key={gender}>
                    <td>{genderLabel}</td>
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
                    {convertToNepaliNumber(wardData.totalPopulation)}
                  </td>
                ))}
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalPopulation)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Detailed Ward-wise Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.२.४: वडा अनुसार उमेर र लिङ्गीय विस्तृत विवरण</h3>
        <table className="data-table detailed-ward-table">
          <thead>
            <tr>
              <th rowSpan={2}>उमेर समूह</th>
              <th rowSpan={2}>लिङ्ग</th>
              {Object.entries(processedData.wardData)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([wardNum]) => (
                  <th key={wardNum} colSpan={1}>वडा {convertToNepaliNumber(parseInt(wardNum))}</th>
                ))}
              <th rowSpan={2}>जम्मा</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(AGE_GROUP_LABELS)
              .filter(([ageGroup]) => {
                const totalForAgeGroup = Object.values(processedData.wardData).reduce((sum, wardData) => {
                  return sum + (wardData.ageGroups[ageGroup as keyof typeof AGE_GROUP_LABELS]?.total || 0);
                }, 0);
                return totalForAgeGroup > 0;
              })
              .map(([ageGroup, ageGroupLabel]) => {
                const ageGroupData = processedData.ageGroupData[ageGroup as keyof typeof AGE_GROUP_LABELS];
                if (!ageGroupData || ageGroupData.total === 0) return null;

                return Object.entries(GENDER_LABELS)
                  .filter(([gender]) => {
                    const totalForGender = Object.values(processedData.wardData).reduce((sum, wardData) => {
                      return sum + (wardData.ageGroups[ageGroup as keyof typeof AGE_GROUP_LABELS]?.[gender.toLowerCase() as 'male' | 'female' | 'other'] || 0);
                    }, 0);
                    return totalForGender > 0;
                  })
                  .map(([gender, genderLabel], genderIndex) => {
                    const wardTotals = Object.entries(processedData.wardData)
                      .sort(([a], [b]) => parseInt(a) - parseInt(b))
                      .map(([wardNum, wardData]) => {
                        const detailedData = processedData.detailedWardData[parseInt(wardNum)];
                        return detailedData?.[ageGroup as keyof typeof AGE_GROUP_LABELS]?.[gender as keyof typeof GENDER_LABELS] || 0;
                      });
                    
                    const totalForRow = wardTotals.reduce((sum, count) => sum + count, 0);
                    
                    return (
                      <tr key={`${ageGroup}-${gender}`}>
                        {genderIndex === 0 && (
                          <td rowSpan={Object.keys(GENDER_LABELS).filter(g => {
                            const totalForGender = Object.values(processedData.wardData).reduce((sum, wardData) => {
                              return sum + (wardData.ageGroups[ageGroup as keyof typeof AGE_GROUP_LABELS]?.[g.toLowerCase() as 'male' | 'female' | 'other'] || 0);
                            }, 0);
                            return totalForGender > 0;
                          }).length}>
                            {ageGroupLabel}
                          </td>
                        )}
                        <td>{genderLabel}</td>
                        {wardTotals.map((count, index) => (
                          <td key={index}>{convertToNepaliNumber(count)}</td>
                        ))}
                        <td className="grand-total-cell">{convertToNepaliNumber(totalForRow)}</td>
                      </tr>
                    );
                  });
              })
              .flat()
              .filter(Boolean)}
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              {Object.entries(processedData.wardData)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([wardNum, wardData]) => (
                  <td key={wardNum} className="grand-total-cell">
                    {convertToNepaliNumber(wardData.totalPopulation)}
                  </td>
                ))}
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalPopulation)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 