import { ReportCoverPage } from "./report-cover-page";
import { ReportTableOfContents } from "./report-table-of-contents";
import { ReportDemographicsSection } from "./sections/report-demographics-section";
import { ReportEconomicsSection } from "./sections/report-economics-section";
// import { ReportSocialSection } from "./sections/report-social-section";
// import { ReportInfrastructureSection } from "./sections/report-infrastructure-section";
import { PrintStyles } from "./print-styles";

export async function PrintableReport() {
  return (
    <>
      <PrintStyles />
      <div id="printable-report" className="report-document">
        {/* Cover Page */}
        <ReportCoverPage />

        {/* Table of Contents */}
        <ReportTableOfContents />

        {/* Main Content Start */}
        <div className="main-content">
          {/* Introduction Chapter */}
          <div className="category-break">
            <h1 className="category-title">१. परिचय</h1>
            <div className="section-content">
              <h2 className="section-header level-2">१.१ अध्ययनको पृष्ठभूमि</h2>
              <div className="content-section">
                <p>
                  यो अध्ययन बुद्धशान्ति गाउँपालिकाको समग्र विकासको लागि आवश्यक तथ्याङ्क र सूचनाहरूको संकलन र विश्लेषण गर्ने उद्देश्यले गरिएको छ। 
                  यसमा जनसांख्यिकीय, आर्थिक, सामाजिक र भौतिक पक्षहरूको विस्तृत अध्ययन समावेश छ।
                </p>
              </div>

              <h2 className="section-header level-2">१.२ अध्ययनको उद्देश्य</h2>
              <div className="content-section">
                <p>
                  यस अध्ययनको मुख्य उद्देश्य गाउँपालिकाको वर्तमान अवस्थाको मूल्याङ्कन गर्नु र भविष्यको विकास योजनाहरूको लागि आधार तयार पार्नु हो।
                </p>
              </div>

              <h2 className="section-header level-2">१.३ अध्ययनको विधि</h2>
              <div className="content-section">
                <p>
                  यो अध्ययन प्राथमिक र द्वितीयक स्रोतहरूबाट संकलित तथ्याङ्कहरूको आधारमा गरिएको छ। 
                  सर्वेक्षण, साक्षात्कार र दस्तावेजी अध्ययन जस्ता विधिहरू प्रयोग गरिएका छन्।
                </p>
              </div>
            </div>
          </div>

          {/* Municipality Introduction Chapter */}
          <div className="category-break">
            <h1 className="category-title">२. गाउँपालिकाको चिनारी</h1>
            <div className="section-content">
              <h2 className="section-header level-2">२.१ भौगोलिक अवस्थिति</h2>
              <div className="content-section">
                <p>
                  बुद्धशान्ति गाउँपालिका प्रदेश नं. ५ को दाङ जिल्लामा अवस्थित छ। यो गाउँपालिका कुल ९ वटा वडाहरूमा विभाजित छ।
                </p>
              </div>

              <h2 className="section-header level-2">२.२ प्रशासनिक संरचना</h2>
              <div className="content-section">
                <p>
                  गाउँपालिकामा निर्वाचित जनप्रतिनिधिहरूको नेतृत्वमा प्रशासनिक संरचना गठन भएको छ।
                </p>
              </div>
            </div>
          </div>

          {/* Demographics Section */}
          <ReportDemographicsSection />

          {/* Economics Section */}
          <ReportEconomicsSection />

          {/* Social Section */}
          {/* <ReportSocialSection /> */}

          {/* Infrastructure Section */}
          {/* <ReportInfrastructureSection /> */}
        </div>
      </div>
    </>
  );
} 