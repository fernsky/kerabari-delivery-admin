export function DemographicSummaryReport() {
  // Sample data - in real implementation, this would come from TRPC/API
  const sampleData = {
    totalPopulation: 28547,
    malePopulation: 13824,
    femalePopulation: 14723,
    otherPopulation: 0,
    totalHouseholds: 6234,
    averageHouseholdSize: 4.58,
    sexRatio: 93.9,
    populationDensity: 156.2,
    growthRate: 2.1,
    literacyRate: 68.5,
  };

  return (
    <div className="section-content" id="section-demographic-summary">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.१ जनसांख्यिकीय सारांश
      </h2>
      
      {/* Coherent Analysis Text */}
      <div className="content-section">
        <div className="content-paragraph">
          <p>
            बुद्धशान्ति गाउँपालिकाको कुल जनसंख्या {sampleData.totalPopulation.toLocaleString()} रहेको छ। यसमध्ये पुरुष जनसंख्या {sampleData.malePopulation.toLocaleString()} ({((sampleData.malePopulation / sampleData.totalPopulation) * 100).toFixed(1)}%) र महिला जनसंख्या {sampleData.femalePopulation.toLocaleString()} ({((sampleData.femalePopulation / sampleData.totalPopulation) * 100).toFixed(1)}%) रहेको छ।
          </p>
          <p>
            गाउँपालिकामा कुल {sampleData.totalHouseholds.toLocaleString()} घरपरिवार रहेका छन् जसको औसत आकार {sampleData.averageHouseholdSize} व्यक्ति प्रति घरपरिवार रहेको छ। लिङ्ग अनुपात {sampleData.sexRatio} रहेको छ जसले प्रति १०० महिलामा {sampleData.sexRatio.toFixed(0)} पुरुष रहेको देखाउँछ।
          </p>
          <p>
            जनसंख्या घनत्व {sampleData.populationDensity} व्यक्ति प्रति वर्ग किलोमिटर रहेको छ। वार्षिक जनसंख्या वृद्धि दर {sampleData.growthRate}% रहेको छ। समग्र साक्षरता दर {sampleData.literacyRate}% रहेको छ।
          </p>
        </div>
      </div>

      {/* Summary Statistics Table */}
      <div className="table-section">
        <h3 className="table-title">तालिका ३.१.१: जनसांख्यिकीय सारांश सूचकहरू</h3>
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
              <td className="indicator-name">कुल जनसंख्या</td>
              <td>{sampleData.totalPopulation.toLocaleString()}</td>
              <td>१००.०%</td>
            </tr>
            <tr>
              <td className="indicator-name">पुरुष जनसंख्या</td>
              <td>{sampleData.malePopulation.toLocaleString()}</td>
              <td>{((sampleData.malePopulation / sampleData.totalPopulation) * 100).toFixed(1)}%</td>
            </tr>
            <tr>
              <td className="indicator-name">महिला जनसंख्या</td>
              <td>{sampleData.femalePopulation.toLocaleString()}</td>
              <td>{((sampleData.femalePopulation / sampleData.totalPopulation) * 100).toFixed(1)}%</td>
            </tr>
            <tr>
              <td className="indicator-name">कुल घरपरिवार</td>
              <td>{sampleData.totalHouseholds.toLocaleString()}</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="indicator-name">औसत घरपरिवार आकार</td>
              <td>{sampleData.averageHouseholdSize}</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="indicator-name">लिङ्ग अनुपात</td>
              <td>{sampleData.sexRatio}</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="indicator-name">जनसंख्या घनत्व (प्रति वर्ग कि.मी.)</td>
              <td>{sampleData.populationDensity}</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="indicator-name">वार्षिक वृद्धि दर</td>
              <td>{sampleData.growthRate}%</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="indicator-name">साक्षरता दर</td>
              <td>{sampleData.literacyRate}%</td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Chart Placeholder */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.१.१: लिङ्ग अनुसार जनसंख्या वितरण</h3>
        <div className="pdf-chart-container">
          {/* In real implementation, this would be an actual chart */}
          <div style={{ 
            width: "100%", 
            height: "300px", 
            border: "1px solid #ccc", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            backgroundColor: "#f9fafb",
            fontSize: "12pt",
            color: "#6b7280"
          }}>
            [जनसंख्या वितरण चार्ट यहाँ देखाइनेछ]
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="content-section">
        <h3 className="section-header level-3">मुख्य निष्कर्षहरू</h3>
        <ul>
          <li>गाउँपालिकामा महिला जनसंख्याको अनुपात पुरुषको तुलनामा बढी छ</li>
          <li>औसत घरपरिवार आकार राष्ट्रिय औसतभन्दा उच्च छ</li>
          <li>जनसंख्या वृद्धि दर सकारात्मक छ जसले विकासको सम्भावना देखाउँछ</li>
          <li>साक्षरता दरमा सुधारको आवश्यकता छ</li>
        </ul>
      </div>
    </div>
  );
} 