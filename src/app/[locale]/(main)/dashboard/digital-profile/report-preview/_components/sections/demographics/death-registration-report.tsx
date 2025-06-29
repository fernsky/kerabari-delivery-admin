"use client";

import { api } from "@/trpc/react";
import { 
  processDeathRegistrationData, 
  generateDeathRegistrationAnalysis, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  AGE_GROUP_LABELS,
  GENDER_LABELS,
  type ProcessedDeathRegistrationData 
} from "@/lib/utils/death-registration-utils";
import { 
  ChartGenerator, 
  type ChartData, 
  type WardData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function DeathRegistrationReport() {
  // Fetch data from TRPC API
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
    if (!processedData) return { pieChart: '', barChart: '', populationPyramid: '' };
    
    // Pie Chart Data - only show genders with deaths > 0
    const pieChartData: ChartData = {};
    Object.entries(processedData.genderData)
      .filter(([_, data]) => data.deaths > 0)
      .forEach(([gender, data]) => {
        pieChartData[gender] = {
          value: data.deaths,
          label: data.label,
          color: gender === 'MALE' ? '#3B82F6' : gender === 'FEMALE' ? '#EC4899' : '#10B981'
        };
      });

    // Bar Chart Data for ward comparison
    const barChartData: WardData = {};
    Object.entries(processedData.wardData).forEach(([wardNum, data]) => {
      barChartData[wardNum] = {};
      Object.entries(data.genders).forEach(([gender, deaths]) => {
        const label = processedData.genderData[gender]?.label || gender;
        barChartData[wardNum][label] = deaths;
      });
    });

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

    // Calculate optimal chart dimensions based on data
    const numWards = Object.keys(processedData.wardData).length;
    const numCategories = Object.keys(processedData.genderData).filter(key => 
      processedData.genderData[key].deaths > 0
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
      }),
      populationPyramid: ChartGenerator.generatePopulationPyramid(pyramidData, {
        width: 800,
        height: 600,
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
          <p>तथ्याङ्क लोड हुँदैछ...</p>
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
          <p>तथ्याङ्क लोड गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।</p>
        </div>
      </div>
    );
  }

  if (processedData.totalDeaths === 0) {
    return (
      <div className="section-content" id="section-death-registration">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.१८ मृत्यु दर्ता अनुसार जनसंख्याको विवरण
        </h2>
        <p>मृत्यु दर्ता सम्बन्धी तथ्याङ्क उपलब्ध छैन।</p>
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

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१८.१: लिङ्ग अनुसार मृतक जनसंख्या वितरण</h3>
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
            {Object.entries(processedData.genderData)
              .filter(([_, data]) => data.deaths > 0)
              .sort(([, a], [, b]) => b.deaths - a.deaths)
              .map(([gender, genderData]) => (
                <tr key={gender}>
                  <td>{convertToNepaliNumber(genderData.rank)}</td>
                  <td>{genderData.label}</td>
                  <td>{convertToNepaliNumber(genderData.deaths)}</td>
                  <td>{formatNepaliPercentage(genderData.percentage)}</td>
                </tr>
              ))}
            <tr className="total-row">
              <td className="total-label" colSpan={2}>जम्मा</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalDeaths)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Population Pyramid */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१८.२: उमेर र लिङ्ग अनुसार मृतक जनसंख्या पिरामिड</h3>
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
              <td>{convertToNepaliNumber(processedData.genderData['MALE']?.deaths || 0)}</td>
              <td>{convertToNepaliNumber(processedData.genderData['FEMALE']?.deaths || 0)}</td>
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalDeaths)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१८.३: वडा अनुसार लिङ्गीय वितरण</h3>
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
        <h3 className="table-title">तालिका ३.१८.३: वडा अनुसार मृतक जनसंख्या विवरण</h3>
        <table className="data-table ward-death-table">
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
              .filter(([_, data]) => data.deaths > 0)
              .sort(([, a], [, b]) => b.deaths - a.deaths)
              .map(([gender, genderData]) => {
                const genderTotals = Object.entries(processedData.wardData)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([wardNum, wardData]) => wardData.genders[gender] ?? 0);
                const totalForGender = genderTotals.reduce((sum, count) => sum + count, 0);
                const percentageForGender = processedData.totalDeaths > 0 
                  ? (totalForGender / processedData.totalDeaths) * 100 
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
                    {convertToNepaliNumber(wardData.totalDeaths)}
                  </td>
                ))}
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalDeaths)}</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Detailed Ward-wise Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.१८.४: वडा अनुसार उमेर र लिङ्गीय विस्तृत विवरण</h3>
        <table className="data-table detailed-ward-death-table">
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
                    {convertToNepaliNumber(wardData.totalDeaths)}
                  </td>
                ))}
              <td className="grand-total-cell">{convertToNepaliNumber(processedData.totalDeaths)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 