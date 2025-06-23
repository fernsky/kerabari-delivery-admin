import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import LoanHouseholdCharts from "./_components/loan-household-charts";
import LoanHouseholdAnalysisSection from "./_components/loan-household-analysis-section";
import LoanHouseholdSEO from "./_components/loan-household-seo";
import { api } from "@/trpc/server";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const loanData =
      await api.profile.economics.wardWiseHouseholdsOnLoan.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalHouseholdsOnLoan = loanData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    // Get ward with highest loan percentage for keywords
    const wardsWithHighestLoans = [...loanData]
      .sort((a, b) => (b.households || 0) - (a.households || 0))
      .slice(0, 3);

    // Create rich keywords with actual data
    const keywordsNP = [
      "गढवा गाउँपालिका ऋणमा घरपरिवार",
      "गढवा कर्जा लिने घरपरिवार",
      "गढवा आर्थिक स्थिति",
      `गढवा वडा ${wardsWithHighestLoans[0]?.wardNumber || ""} ऋण`,
      "वडा अनुसार ऋण वितरण",
      "गाउँपालिका कर्जा तथ्याङ्क",
      "आर्थिक सर्वेक्षण गढवा",
      `गढवा कुल ऋणी घरपरिवार संख्या ${totalHouseholdsOnLoan}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality households in debt",
      "Khajura loan taking households",
      "Khajura economic condition",
      `Khajura ward ${wardsWithHighestLoans[0]?.wardNumber || ""} loans`,
      "Ward-wise loan distribution",
      "Rural municipality debt statistics",
      "Economic survey Khajura",
      `Khajura total households with loans ${totalHouseholdsOnLoan}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकाको वडा अनुसार ऋण लिएका घरपरिवारहरूको वितरण, प्रवृत्ति र विश्लेषण। कुल ${totalHouseholdsOnLoan} घरपरिवारले कुनै न कुनै प्रकारको कर्जा लिएका छन्। सबैभन्दा बढी ऋणी घरपरिवार भएका वडाहरू: वडा ${wardsWithHighestLoans[0]?.wardNumber || "N/A"} (${wardsWithHighestLoans[0]?.households || 0} घरपरिवार), वडा ${wardsWithHighestLoans[1]?.wardNumber || "N/A"} (${wardsWithHighestLoans[1]?.households || 0} घरपरिवार)। विस्तृत तथ्याङ्क र विजुअलाइजेसन यहाँ पेश गरिएको छ।`;

    const descriptionEN = `Ward-wise distribution, trends and analysis of households with loans in Khajura Rural Municipality. A total of ${totalHouseholdsOnLoan} households have taken some form of loans. Wards with most households in debt: Ward ${wardsWithHighestLoans[0]?.wardNumber || "N/A"} (${wardsWithHighestLoans[0]?.households || 0} households), Ward ${wardsWithHighestLoans[1]?.wardNumber || "N/A"} (${wardsWithHighestLoans[1]?.households || 0} households). Detailed statistics and visualizations presented here.`;

    return {
      title: `ऋण लिएका घरपरिवार | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-households-in-loan",
        languages: {
          en: "/en/profile/economics/ward-households-in-loan",
          ne: "/ne/profile/economics/ward-households-in-loan",
        },
      },
      openGraph: {
        title: `ऋण लिएका घरपरिवार | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `ऋण लिएका घरपरिवार | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "ऋण लिएका घरपरिवार | पालिका प्रोफाइल",
      description:
        "वडा अनुसार ऋण लिएका घरपरिवारको वितरण, प्रवृत्ति र विश्लेषण। विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "वडा अनुसार ऋणी घरपरिवार", slug: "ward-wise-loans" },
  { level: 2, text: "ऋण वितरण विश्लेषण", slug: "loan-analysis" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

export default async function WardHouseholdsInLoanPage() {
  // Fetch all loan data using tRPC
  const loanData =
    await api.profile.economics.wardWiseHouseholdsOnLoan.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseHouseholdsOnLoan.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Calculate total households on loan
  const totalHouseholdsOnLoan = loanData.reduce(
    (sum, item) => sum + (item.households || 0),
    0,
  );

  // Get unique ward numbers and sort them
  const wardNumbers = loanData
    .map((item) => item.wardNumber)
    .sort((a, b) => a - b);

  // Process data for charts
  const wardWiseData = loanData
    .map((item) => ({
      ward: `वडा ${item.wardNumber}`,
      households: item.households || 0,
      wardNumber: item.wardNumber,
    }))
    .sort((a, b) => a.wardNumber - b.wardNumber);

  // Prepare data for pie chart
  const pieChartData = wardWiseData.map((item) => ({
    name: item.ward,
    value: item.households,
    percentage: ((item.households / totalHouseholdsOnLoan) * 100).toFixed(2),
  }));

  // Top 5 wards with most loans
  const topWardsByLoan = [...wardWiseData]
    .sort((a, b) => b.households - a.households)
    .slice(0, 5);

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <LoanHouseholdSEO
        loanData={loanData}
        totalHouseholdsOnLoan={totalHouseholdsOnLoan}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/loan-households.svg"
              width={1200}
              height={400}
              alt="ऋण लिएका घरपरिवार - गढवा गाउँपालिका (Households With Loans - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा ऋण लिएका घरपरिवारहरु
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा गढवा गाउँपालिकाको विभिन्न वडाहरूमा ऋण लिएका
              घरपरिवारहरूको तथ्याङ्क प्रस्तुत गरिएको छ। यो तथ्याङ्कले
              गाउँपालिकाको आर्थिक अवस्था, वित्तीय समावेशीकरण र आर्थिक विकासको
              स्थितिलाई बुझ्न सहयोग गर्दछ।
            </p>
            <p>
              गढवा गाउँपालिकामा कुल {totalHouseholdsOnLoan.toLocaleString()}{" "}
              घरपरिवारले विभिन्न प्रकारका ऋणहरू लिएका छन्। यस तथ्याङ्कले स्थानीय
              सरकारलाई वित्तीय साक्षरता, आर्थिक सशक्तिकरण र वित्तीय पहुँच बढाउन
              नीति निर्माणमा सहयोग गर्दछ।
            </p>

            <h2 id="ward-wise-loans" className="scroll-m-20 border-b pb-2">
              वडा अनुसार ऋणी घरपरिवार
            </h2>
            <p>
              गढवा गाउँपालिकाको विभिन्न वडाहरूमा ऋणमा रहेका घरपरिवारहरूको
              संख्या निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <LoanHouseholdCharts
            wardWiseData={wardWiseData}
            pieChartData={pieChartData}
            totalHouseholdsOnLoan={totalHouseholdsOnLoan}
            topWardsByLoan={topWardsByLoan}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="loan-analysis" className="scroll-m-20 border-b pb-2">
              ऋण वितरण विश्लेषण
            </h2>
            <p>
              गढवा गाउँपालिकामा ऋण लिएका घरपरिवारहरूको विश्लेषण गर्दा,
              {topWardsByLoan[0]?.ward || ""} मा सबैभन्दा बढी{" "}
              {topWardsByLoan[0]?.households || 0}
              घरपरिवारले ऋण लिएको देखिन्छ, जुन कुल ऋणी घरपरिवारको
              {(
                ((topWardsByLoan[0]?.households || 0) / totalHouseholdsOnLoan) *
                100
              ).toFixed(2)}
              % हो।
            </p>

            {/* Client component for loan analysis section */}
            <LoanHouseholdAnalysisSection
              wardWiseData={wardWiseData}
              totalHouseholdsOnLoan={totalHouseholdsOnLoan}
            />

            <h2 id="data-source" className="scroll-m-20 border-b pb-2">
              तथ्याङ्क स्रोत
            </h2>
            <p>
              माथि प्रस्तुत गरिएका तथ्याङ्कहरू गढवा गाउँपालिकाको आर्थिक
              सर्वेक्षण र स्थानीय वित्तीय संस्थाहरूको सहकार्यमा संकलन गरिएको हो।
              यी तथ्याङ्कहरूको महत्व निम्न अनुसार छ:
            </p>

            <ul>
              <li>वित्तीय समावेशीकरणको स्थिति अध्ययन गर्न</li>
              <li>वित्तीय साक्षरता कार्यक्रमहरू लक्षित गर्न</li>
              <li>आर्थिक विकास योजनाहरू निर्माण गर्न</li>
              <li>स्थानीय वित्तीय संस्थाहरूको पहुँच विश्लेषण गर्न</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
