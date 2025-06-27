export function AgeGenderReport() {
  return (
    <div className="section-content" id="section-age-gender">
      <h2 className="section-header level-2" style={{ color: "#1e40af", borderBottom: "2px solid #0ea5e9", paddingBottom: "0.3em", fontSize: "16pt", marginTop: "2em" }}>
        ३.२ उमेर र लिङ्ग अनुसार जनसंख्या वितरण
      </h2>
      
      <div className="content-section">
        <div className="content-paragraph">
          <p>
            यस खण्डमा बुद्धशान्ति गाउँपालिकाको जनसंख्यालाई उमेर समूह र लिङ्गका आधारमा विश्लेषण गरिएको छ। 
            उमेर संरचनाले जनसंख्याको जनसांख्यिकीय संक्रमण र भविष्यका आवश्यकताहरूको संकेत दिन्छ।
          </p>
        </div>
      </div>

      {/* Population Pyramid Chart */}
      <div className="chart-section">
        <h3 className="chart-title">चित्र ३.२.१: जनसंख्या पिरामिड</h3>
        <div className="pdf-chart-container">
          <div style={{ 
            width: "100%", 
            height: "400px", 
            border: "1px solid #ccc", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            backgroundColor: "#f9fafb",
            fontSize: "12pt",
            color: "#6b7280"
          }}>
            [उमेर र लिङ्ग अनुसार जनसंख्या पिरामिड यहाँ देखाइनेछ]
          </div>
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
              <th>अन्य</th>
              <th>जम्मा</th>
              <th>प्रतिशत</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>०-४ वर्ष</td>
              <td>१,८५२</td>
              <td>१,७९४</td>
              <td>०</td>
              <td>३,६४६</td>
              <td>१२.८%</td>
            </tr>
            <tr>
              <td>५-९ वर्ष</td>
              <td>१,७३५</td>
              <td>१,६८९</td>
              <td>०</td>
              <td>३,४२४</td>
              <td>१२.०%</td>
            </tr>
            <tr>
              <td>१०-१४ वर्ष</td>
              <td>१,६२८</td>
              <td>१,५७२</td>
              <td>०</td>
              <td>३,२००</td>
              <td>११.२%</td>
            </tr>
            <tr>
              <td>१५-१९ वर्ष</td>
              <td>१,४५३</td>
              <td>१,५८९</td>
              <td>०</td>
              <td>३,०४२</td>
              <td>१०.७%</td>
            </tr>
            <tr>
              <td>२०-२४ वर्ष</td>
              <td>१,२८९</td>
              <td>१,४२३</td>
              <td>०</td>
              <td>२,७१२</td>
              <td>९.५%</td>
            </tr>
            <tr>
              <td>२५-२९ वर्ष</td>
              <td>१,१५६</td>
              <td>१,३०२</td>
              <td>०</td>
              <td>२,४५८</td>
              <td>८.६%</td>
            </tr>
            <tr>
              <td>३०-३४ वर्ष</td>
              <td>१,०८९</td>
              <td>१,२४५</td>
              <td>०</td>
              <td>२,३३४</td>
              <td>८.२%</td>
            </tr>
            <tr>
              <td>३५+ वर्ष</td>
              <td>५,६२२</td>
              <td>६,१०९</td>
              <td>०</td>
              <td>११,७३१</td>
              <td>४१.१%</td>
            </tr>
            <tr className="total-row">
              <td className="total-label">जम्मा</td>
              <td className="total-cell">१३,८२४</td>
              <td className="total-cell">१४,७२३</td>
              <td className="total-cell">०</td>
              <td className="grand-total-cell">२८,५४७</td>
              <td className="total-cell">१००.०%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Dependency Ratio Analysis */}
      <div className="content-section">
        <h3 className="section-header level-3">निर्भरता अनुपात विश्लेषण</h3>
        <p>
          जनसंख्याको उमेर संरचनाका आधारमा निर्भरता अनुपातहरू निम्नानुसार छन्:
        </p>
        <ul>
          <li><strong>बाल निर्भरता अनुपात:</strong> ४२.५ (प्रति १०० कार्यशील उमेरका व्यक्तिमा ४२.५ बालबालिका)</li>
          <li><strong>वृद्ध निर्भरता अनुपात:</strong> १८.३ (प्रति १०० कार्यशील उमेरका व्यक्तिमा १८.३ वृद्धवृद्धा)</li>
          <li><strong>कुल निर्भरता अनुपात:</strong> ६०.८ (प्रति १०० कार्यशील उमेरका व्यक्तिमा ६०.८ निर्भर व्यक्ति)</li>
        </ul>
      </div>
    </div>
  );
} 