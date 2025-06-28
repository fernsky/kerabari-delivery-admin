import { ReportCoverPage } from "./report-cover-page";
import { ReportTableOfContents } from "./report-table-of-contents";
import { ReportDemographicsSection } from "./sections/report-demographics-section";
// import { ReportEconomicsSection } from "./sections/report-economics-section";
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
        <div className="main-content-start">
          {/* Introduction Chapter - Static Content */}
          <div className="category-break">
            <h1 className="category-title">१. परिचय</h1>
            <div className="section-content">
              <h2 className="section-header level-2">१.१ पृष्ठभूमि</h2>
              <div className="content-section">
                <p>
                  स्थानीय सरकार सञ्चालन ऐन, २०७४ ले स्थानीय तहलाई आफ्नो
                  क्षेत्रको वस्तुस्थिति विवरण तयार गर्ने जिम्मेवारी दिएको छ। यो
                  वस्तुस्थिति विवरण स्थानीय तहको भौगोलिक, जनसांख्यिकीय, सामाजिक,
                  आर्थिक, पूर्वाधार र वातावरणीय अवस्थाको विस्तृत चित्रण हो।
                </p>
                <p>
                  यस प्रतिवेदनले बुद्धशान्ति गाउँपालिकाको समग्र अवस्थालाई
                  प्रस्तुत गर्दै भविष्यका योजना र कार्यक्रमहरूको लागि आधार
                  प्रदान गर्छ।
                </p>
              </div>

              <h2 className="section-header level-2">१.२ उद्देश्य</h2>
              <div className="content-section">
                <p>यस वस्तुस्थिति विवरणका मुख्य उद्देश्यहरू निम्नलिखित छन्:</p>
                <ul>
                  <li>गाउँपालिकाको भौगोलिक र जनसांख्यिकीय अवस्थाको पहिचान</li>
                  <li>सामाजिक र आर्थिक संरचनाको विश्लेषण</li>
                  <li>पूर्वाधार र सेवाहरूको वर्तमान अवस्थाको मूल्याङ्कन</li>
                  <li>भविष्यका योजना निर्माणका लागि आधार तयार गर्ने</li>
                </ul>
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
                  बुद्धशान्ति गाउँपालिका प्रदेश नं. ५ को झापा जिल्लामा अवस्थित
                  छ। यो गाउँपालिका कुल ९ वटा वडाहरूमा विभाजित छ।
                </p>
              </div>

              <h2 className="section-header level-2">२.२ प्रशासनिक संरचना</h2>
              <div className="content-section">
                <p>
                  गाउँपालिकामा निर्वाचित जनप्रतिनिधिहरूको नेतृत्वमा प्रशासनिक
                  संरचना गठन भएको छ।
                </p>
              </div>
            </div>
          </div>

          {/* Demographics Section */}
          <ReportDemographicsSection />

          {/* Economics Section */}
          {/* <ReportEconomicsSection /> */}

          {/* Social Section */}
          {/* <ReportSocialSection /> */}

          {/* Infrastructure Section */}
          {/* <ReportInfrastructureSection /> */}
        </div>
      </div>
    </>
  );
}
