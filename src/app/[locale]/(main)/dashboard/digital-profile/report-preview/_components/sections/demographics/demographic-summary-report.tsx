"use client";

import { api } from "@/trpc/react";
import { 
  processAgeGenderData, 
  convertToNepaliNumber, 
  formatNepaliPercentage,
  type ProcessedAgeGenderData 
} from "@/lib/utils/age-gender-utils";
import { 
  ChartGenerator, 
  type ChartData 
} from "@/lib/utils/chart-generator";
import { useMemo } from "react";

export function DemographicSummaryReport() {
  // Fetch data from TRPC APIs
  const { data: ageGenderData, isLoading: ageGenderLoading } = api.profile.demographics.wardAgeWisePopulation.getAll.useQuery();
  const { data: wardTimeSeriesData, isLoading: wardTimeSeriesLoading } = api.profile.demographics.wardTimeSeries.getAll.useQuery();

  // Process age-gender data
  const processedAgeGenderData: ProcessedAgeGenderData | null = useMemo(() => {
    if (!ageGenderData || ageGenderData.length === 0) return null;
    
    const mappedData = ageGenderData.map(item => ({
      id: item.id,
      wardNumber: item.wardNumber,
      ageGroup: item.ageGroup,
      gender: item.gender,
      population: item.population
    }));
    
    return processAgeGenderData(mappedData);
  }, [ageGenderData]);

  // Process household data from ward time series
  const processedHouseholdData = useMemo(() => {
    if (!wardTimeSeriesData || wardTimeSeriesData.length === 0) return null;
    
    // Get the latest year data for each ward
    const latestYearData = wardTimeSeriesData.reduce((acc, item) => {
      const currentWardData = acc[item.wardNumber];
      if (!currentWardData || item.year > currentWardData.year) {
        acc[item.wardNumber] = item;
      }
      return acc;
    }, {} as Record<number, typeof wardTimeSeriesData[0]>);

    const totalHouseholds = Object.values(latestYearData).reduce((sum, item) => sum + (item.totalHouseholds || 0), 0);
    const totalPopulation = Object.values(latestYearData).reduce((sum, item) => sum + (item.totalPopulation || 0), 0);
    const averageHouseholdSize = totalHouseholds > 0 ? totalPopulation / totalHouseholds : 0;
    
    const wardData = Object.entries(latestYearData).reduce((acc, [wardNum, item]) => {
      acc[parseInt(wardNum)] = {
        households: item.totalHouseholds || 0,
        population: item.totalPopulation || 0,
        averageSize: parseFloat(item.averageHouseholdSize || '0') || 0
      };
      return acc;
    }, {} as Record<number, { households: number; population: number; averageSize: number }>);

    return {
      totalHouseholds,
      totalPopulation,
      averageHouseholdSize,
      wardData
    };
  }, [wardTimeSeriesData]);

  // Generate summary charts
  const summaryCharts = useMemo(() => {
    if (!processedAgeGenderData || !processedHouseholdData) {
      return { populationByWard: '', householdSizeDistribution: '' };
    }

    // Population by Ward Chart
    const wardPopulationData: ChartData = {};
    Object.entries(processedAgeGenderData.wardData).forEach(([wardNum, data]) => {
      wardPopulationData[`ward_${wardNum}`] = {
        value: data.total,
        label: `वडा नं. ${convertToNepaliNumber(parseInt(wardNum))}`,
        color: `hsl(${(parseInt(wardNum) * 30) % 360}, 70%, 50%)`
      };
    });

    // Household Size Distribution
    const householdSizeData: ChartData = {};
    Object.entries(processedHouseholdData.wardData).forEach(([wardNum, data]) => {
      householdSizeData[`ward_${wardNum}`] = {
        value: data.averageSize,
        label: `वडा नं. ${convertToNepaliNumber(parseInt(wardNum))}`,
        color: `hsl(${(parseInt(wardNum) * 45) % 360}, 60%, 55%)`
      };
    });

    return {
      populationByWard: ChartGenerator.generateBarChart(wardPopulationData, {
        width: 800,
        height: 500,
        title: 'वडागत जनसंख्या वितरण'
      }),
      householdSizeDistribution: ChartGenerator.generateBarChart(householdSizeData, {
        width: 800,
        height: 500,
        title: 'वडागत औसत घरपरिवार आकार'
      })
    };
  }, [processedAgeGenderData, processedHouseholdData]);

  // Generate summary analysis
  const summaryAnalysis = useMemo(() => {
    if (!processedAgeGenderData || !processedHouseholdData) return '';

    const analysisPoints: string[] = [];

    // Overall population summary
    analysisPoints.push(
      `बुद्धशान्ति गाउँपालिकामा कुल ${convertToNepaliNumber(processedAgeGenderData.totalPopulation)} जनसंख्या र ` +
      `${convertToNepaliNumber(processedHouseholdData.totalHouseholds)} घरपरिवार रहेका छन्।`
    );

    // Average household size
    analysisPoints.push(
      `औसत घरपरिवार आकार ${convertToNepaliNumber(parseFloat(processedHouseholdData.averageHouseholdSize.toFixed(1)))} व्यक्ति प्रति घरपरिवार रहेको छ।`
    );

    // Gender distribution summary
    analysisPoints.push(
      `लिङ्गीय वितरणका आधारमा ${formatNepaliPercentage(processedAgeGenderData.malePercentage)} पुरुष र ` +
      `${formatNepaliPercentage(processedAgeGenderData.femalePercentage)} महिला रहेका छन्।`
    );

    // Age structure summary
    const youthPercentage = processedAgeGenderData.demographicIndicators.youthPercentage;
    analysisPoints.push(
      `जनसंख्याको उमेर संरचनाका आधारमा ${formatNepaliPercentage(youthPercentage)} युवा जनसंख्या (१५-३९ वर्ष) रहेको छ।`
    );

    // Dependency ratio summary
    analysisPoints.push(
      `कुल निर्भरता अनुपात ${formatNepaliPercentage(processedAgeGenderData.dependencyRatios.totalDependencyRatio)} रहेको छ, ` +
      `जसमा बाल निर्भरता ${formatNepaliPercentage(processedAgeGenderData.dependencyRatios.childDependencyRatio)} र ` +
      `वृद्ध निर्भरता ${formatNepaliPercentage(processedAgeGenderData.dependencyRatios.elderlyDependencyRatio)} रहेको छ।`
    );

    // Ward-wise variation
    const wardCount = Object.keys(processedAgeGenderData.wardData).length;
    analysisPoints.push(
      `गाउँपालिकाका ${convertToNepaliNumber(wardCount)} वटा वडाहरूमा जनसंख्या र घरपरिवारको वितरणमा भिन्नता देखिन्छ।`
    );

    return analysisPoints.join(' ');
  }, [processedAgeGenderData, processedHouseholdData]);

  if (ageGenderLoading || wardTimeSeriesLoading) {
    return (
      <div className="section-content" id="section-demographic-summary">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.१ जनसांख्यिकीय सारांश
        </h2>
        <div className="content-section">
          <p>डेटा लोड भइरहेको छ...</p>
        </div>
      </div>
    );
  }

  if (!processedAgeGenderData || !processedHouseholdData) {
    return (
      <div className="section-content" id="section-demographic-summary">
        <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
          ३.१ जनसांख्यिकीय सारांश
        </h2>
        <div className="content-section">
          <p>डेटा लोड गर्न समस्या भयो। कृपया पुनः प्रयास गर्नुहोस्।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-content" id="section-demographic-summary">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.१ जनसांख्यिकीय सारांश
      </h2>
      
      <div className="content-section">
        <div className="content-paragraph">
          <p>{summaryAnalysis}</p>
        </div>
      </div>

      {/* Key Demographic Indicators */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.१.१: मुख्य जनसांख्यिकीय सूचकहरू</h3>
        <table className="data-table demographic-summary-table">
          <thead>
            <tr>
              <th>सूचक</th>
              <th>संख्या/दर</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>कुल जनसंख्या</td>
              <td>{convertToNepaliNumber(processedAgeGenderData.totalPopulation)}</td>
              <td>१००.०%</td>
            </tr>
            <tr>
              <td>पुरुष जनसंख्या</td>
              <td>{convertToNepaliNumber(processedAgeGenderData.malePopulation)}</td>
              <td>{formatNepaliPercentage(processedAgeGenderData.malePercentage)}</td>
            </tr>
            <tr>
              <td>महिला जनसंख्या</td>
              <td>{convertToNepaliNumber(processedAgeGenderData.femalePopulation)}</td>
              <td>{formatNepaliPercentage(processedAgeGenderData.femalePercentage)}</td>
            </tr>
            <tr>
              <td>कुल घरपरिवार</td>
              <td>{convertToNepaliNumber(processedHouseholdData.totalHouseholds)}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>औसत घरपरिवार आकार</td>
              <td>{convertToNepaliNumber(parseFloat(processedHouseholdData.averageHouseholdSize.toFixed(1)))}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>लिङ्गीय अनुपात</td>
              <td>{convertToNepaliNumber(Math.round(processedAgeGenderData.demographicIndicators.genderRatio))}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>युवा जनसंख्या (१५-३९ वर्ष)</td>
              <td>{convertToNepaliNumber(processedAgeGenderData.demographicIndicators.youthPopulation)}</td>
              <td>{formatNepaliPercentage(processedAgeGenderData.demographicIndicators.youthPercentage)}</td>
            </tr>
            <tr>
              <td>प्रजनन उमेरका महिला (१५-४९ वर्ष)</td>
              <td>{convertToNepaliNumber(processedAgeGenderData.demographicIndicators.reproductiveAgeWomen)}</td>
              <td>{formatNepaliPercentage(processedAgeGenderData.demographicIndicators.reproductiveWomenPercentage)}</td>
            </tr>
            <tr>
              <td>कुल निर्भरता अनुपात</td>
              <td>{formatNepaliPercentage(processedAgeGenderData.dependencyRatios.totalDependencyRatio)}</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Population by Ward Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१.१: वडागत जनसंख्या वितरण</h3>
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
            dangerouslySetInnerHTML={{ __html: summaryCharts.populationByWard }}
          />
        </div>
      </div>

      {/* Ward-wise Summary Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.१.२: वडागत जनसांख्यिकीय सारांश</h3>
        <table className="data-table ward-summary-table">
          <thead>
            <tr>
              <th>वडा नं.</th>
              <th>जनसंख्या</th>
              <th>पुरुष</th>
              <th>महिला</th>
              <th>घरपरिवार</th>
              <th>औसत घर आकार</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(processedAgeGenderData.wardData)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([wardNum, ageGenderWardData]) => {
                const householdWardData = processedHouseholdData.wardData[parseInt(wardNum)];
                return (
                  <tr key={wardNum}>
                    <td>{convertToNepaliNumber(parseInt(wardNum))}</td>
                    <td>{convertToNepaliNumber(ageGenderWardData.total)}</td>
                    <td>{convertToNepaliNumber(ageGenderWardData.male)}</td>
                    <td>{convertToNepaliNumber(ageGenderWardData.female)}</td>
                    <td>{convertToNepaliNumber(householdWardData?.households || 0)}</td>
                    <td>{convertToNepaliNumber(parseFloat((householdWardData?.averageSize || 0).toFixed(1)))}</td>
                  </tr>
                );
              })}
            <tr className="total-row">
              <td className="total-label">जम्मा</td>
              <td className="total-cell">{convertToNepaliNumber(processedAgeGenderData.totalPopulation)}</td>
              <td className="total-cell">{convertToNepaliNumber(processedAgeGenderData.malePopulation)}</td>
              <td className="total-cell">{convertToNepaliNumber(processedAgeGenderData.femalePopulation)}</td>
              <td className="total-cell">{convertToNepaliNumber(processedHouseholdData.totalHouseholds)}</td>
              <td className="total-cell">{convertToNepaliNumber(parseFloat(processedHouseholdData.averageHouseholdSize.toFixed(1)))}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Average Household Size Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१.२: वडागत औसत घरपरिवार आकार</h3>
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
            dangerouslySetInnerHTML={{ __html: summaryCharts.householdSizeDistribution }}
          />
        </div>
      </div>

      {/* Key Insights */}
      <div className="content-section">
        <h3 className="section-header level-3">मुख्य निष्कर्षहरू</h3>
        <ul>
          <li>
            गाउँपालिकामा {formatNepaliPercentage(processedAgeGenderData.demographicIndicators.youthPercentage)} युवा जनसंख्या रहेको छ, 
            जसले जनसंख्याको लाभांशको संकेत गर्दछ।
          </li>
          <li>
            लिङ्गीय अनुपात {convertToNepaliNumber(Math.round(processedAgeGenderData.demographicIndicators.genderRatio))} रहेको छ, 
            जसले {processedAgeGenderData.demographicIndicators.genderRatio > 103 ? 'पुरुषको बाहुल्यता' : 
                   processedAgeGenderData.demographicIndicators.genderRatio < 97 ? 'महिलाको बाहुल्यता' : 'लिङ्गीय सन्तुलन'} देखाउँछ।
          </li>
          <li>
            औसत घरपरिवार आकार {convertToNepaliNumber(parseFloat(processedHouseholdData.averageHouseholdSize.toFixed(1)))} व्यक्ति रहेको छ, 
            जुन राष्ट्रिय औसतसँग तुलना गर्न सकिन्छ।
          </li>
          <li>
            कुल निर्भरता अनुपात {formatNepaliPercentage(processedAgeGenderData.dependencyRatios.totalDependencyRatio)} रहेको छ, 
            जसले कार्यशील जनसंख्यामाथिको निर्भरताको स्तर देखाउँछ।
          </li>
        </ul>
      </div>
    </div>
  );
} 