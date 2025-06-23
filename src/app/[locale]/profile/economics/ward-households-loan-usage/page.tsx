import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import LoanUsageCharts from "./_components/loan-usage-charts";
import LoanUsageAnalysisSection from "./_components/loan-usage-analysis-section";
import LoanUsageSEO from "./_components/loan-usage-seo";
import { api } from "@/trpc/server";
import {
  LoanUseEnum,
  loanUseLabels,
} from "@/server/api/routers/profile/economics/ward-wise-households-loan-use.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const loanUsageData =
      await api.profile.economics.wardWiseHouseholdsLoanUse.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalHouseholds = loanUsageData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    // Group by loan use category and calculate totals
    const loanUseCounts: Record<string, number> = {};
    loanUsageData.forEach((item) => {
      if (!loanUseCounts[item.loanUse]) loanUseCounts[item.loanUse] = 0;
      loanUseCounts[item.loanUse] += item.households || 0;
    });

    // Get top 3 loan uses for keywords
    const topLoanUses = Object.entries(loanUseCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    // Create rich keywords with actual data
    const keywordsNP = [
      "गढवा गाउँपालिका कर्जा उपयोग",
      "गढवा ऋण प्रयोजन",
      `गढवा ${loanUseLabels[topLoanUses[0]]} कर्जा`,
      ...topLoanUses.map(
        (r) => `${loanUseLabels[r]} उद्देश्यका लागि कर्जा गढवा`,
      ),
      "वडा अनुसार कर्जा उपयोग",
      "ऋण प्रयोजन तथ्याङ्क",
      "कर्जा प्रयोजन सर्वेक्षण गढवा",
      `गढवा कुल ऋणी घरपरिवार संख्या ${totalHouseholds}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality loan usage",
      "Khajura credit purposes",
      `Khajura ${loanUseLabels[topLoanUses[0]]} loans`,
      ...topLoanUses.map((r) => `${loanUseLabels[r]} purpose loans in Khajura`),
      "Ward-wise loan usage",
      "Credit purpose statistics",
      "Loan utilization survey Khajura",
      `Khajura total households with loans ${totalHouseholds}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकामा वडा अनुसार कर्जाको उपयोग प्रयोजन वितरण, प्रवृत्ति र विश्लेषण। कुल घरपरिवार संख्या ${totalHouseholds} मध्ये ${loanUseLabels[topLoanUses[0]]} (${loanUseCounts[topLoanUses[0]]}) सबैभन्दा ठूलो समूह हो, त्यसपछि ${loanUseLabels[topLoanUses[1]]} (${loanUseCounts[topLoanUses[1]]}) र ${loanUseLabels[topLoanUses[2]]} (${loanUseCounts[topLoanUses[2]]})। विभिन्न ऋण उपयोग प्रयोजनको विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Ward-wise loan usage distribution, trends and analysis for Khajura Rural Municipality. Out of a total of ${totalHouseholds} households, ${loanUseLabels[topLoanUses[0]]} (${loanUseCounts[topLoanUses[0]]}) is the largest category, followed by ${loanUseLabels[topLoanUses[1]]} (${loanUseCounts[topLoanUses[1]]}) and ${loanUseLabels[topLoanUses[2]]} (${loanUseCounts[topLoanUses[2]]})। Detailed statistics and visualizations of various loan usage purposes.`;

    return {
      title: `कर्जाको उपयोग प्रयोजन | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-households-loan-usage",
        languages: {
          en: "/en/profile/economics/ward-households-loan-usage",
          ne: "/ne/profile/economics/ward-households-loan-usage",
        },
      },
      openGraph: {
        title: `कर्जाको उपयोग प्रयोजन | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `कर्जाको उपयोग प्रयोजन | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "कर्जाको उपयोग प्रयोजन | पालिका प्रोफाइल",
      description:
        "वडा अनुसार कर्जाको उपयोग प्रयोजन वितरण, प्रवृत्ति र विश्लेषण। विभिन्न ऋण उपयोग प्रयोजनको विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "कर्जाको प्रयोजन अनुसार घरपरिवार",
    slug: "loan-usage-distribution",
  },
  {
    level: 2,
    text: "वडा अनुसार कर्जाको प्रयोजन",
    slug: "ward-wise-loan-usage",
  },
  { level: 2, text: "प्रमुख प्रयोजनहरूको विश्लेषण", slug: "major-loan-usage" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

export default async function WardHouseholdsLoanUsagePage() {
  // Fetch all loan usage data using tRPC
  const loanUsageData =
    await api.profile.economics.wardWiseHouseholdsLoanUse.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseHouseholdsLoanUse.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    loanUsageData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.loanUse]) acc[item.loanUse] = 0;
      acc[item.loanUse] += item.households || 0;
      return acc;
    }, {}),
  )
    .map(([loanUse, households]) => ({
      loanUse,
      loanUseName: loanUseLabels[loanUse] || loanUse,
      households,
    }))
    .sort((a, b) => b.households - a.households);

  // Calculate total households for percentages
  const totalHouseholds = overallSummary.reduce(
    (sum, item) => sum + item.households,
    0,
  );

  // Take top 7 loan uses for pie chart, group others
  const topLoanUses = overallSummary.slice(0, 7);
  const otherLoanUses = overallSummary.slice(7);

  const otherTotalHouseholds = otherLoanUses.reduce(
    (sum, item) => sum + item.households,
    0,
  );

  let pieChartData = topLoanUses.map((item) => ({
    name: item.loanUseName,
    value: item.households,
    percentage: ((item.households / totalHouseholds) * 100).toFixed(2),
  }));

  // Add "Other" category if there are more than 7 loan uses
  if (otherLoanUses.length > 0) {
    pieChartData.push({
      name: "अन्य",
      value: otherTotalHouseholds,
      percentage: ((otherTotalHouseholds / totalHouseholds) * 100).toFixed(2),
    });
  }

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(loanUsageData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization (top 5 loan uses per ward + others)
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = loanUsageData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    // Sort ward data by households
    wardData.sort((a, b) => (b.households || 0) - (a.households || 0));

    // Take top 5 loan uses for this ward
    const topWardLoanUses = wardData.slice(0, 5);
    const otherWardLoanUses = wardData.slice(5);
    const otherWardTotal = otherWardLoanUses.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add top loan uses
    topWardLoanUses.forEach((item) => {
      result[loanUseLabels[item.loanUse] || item.loanUse] = item.households;
    });

    // Add "Other" category if needed
    if (otherWardLoanUses.length > 0) {
      result["अन्य"] = otherWardTotal;
    }

    return result;
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <LoanUsageSEO
        overallSummary={overallSummary}
        totalHouseholds={totalHouseholds}
        loanUseLabels={loanUseLabels}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/loan-usage.svg"
              width={1200}
              height={400}
              alt="कर्जाको उपयोग प्रयोजन - गढवा गाउँपालिका (Loan Usage Purposes - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा कर्जाको उपयोग प्रयोजन
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा गढवा गाउँपालिकाको विभिन्न वडाहरूमा रहेका
              घरपरिवारहरूले लिएका कर्जाको उपयोग प्रयोजन सम्बन्धी विस्तृत
              तथ्याङ्क प्रस्तुत गरिएको छ। यो तथ्याङ्कले आर्थिक गतिविधि, लगानीको
              स्वरूप र आर्थिक विकासको प्रवृत्तिलाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              गढवा गाउँपालिकामा कुल {totalHouseholds.toLocaleString()}{" "}
              घरपरिवारले विभिन्न प्रयोजनका लागि कर्जा लिएका छन्। यस तथ्याङ्कले
              स्थानीय अर्थतन्त्रको प्राथमिकताहरू बुझ्न र आर्थिक विकासका लागि
              लक्षित कार्यक्रमहरू निर्माण गर्न सहयोग गर्दछ।
            </p>

            <h2
              id="loan-usage-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              कर्जाको प्रयोजन अनुसार घरपरिवार
            </h2>
            <p>
              गढवा गाउँपालिकामा विभिन्न प्रयोजनका लागि कर्जा लिएका
              घरपरिवारहरूको संख्या निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <LoanUsageCharts
            overallSummary={overallSummary}
            totalHouseholds={totalHouseholds}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            loanUsageData={loanUsageData}
            loanUseLabels={loanUseLabels}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="major-loan-usage" className="scroll-m-20 border-b pb-2">
              प्रमुख कर्जा प्रयोजनहरूको विश्लेषण
            </h2>
            <p>
              गढवा गाउँपालिकामा घरपरिवारहरूले विभिन्न प्रयोजनका लागि कर्जा
              लिने गरेका छन्। यीमध्ये {overallSummary[0]?.loanUseName || ""}{" "}
              सबैभन्दा प्रमुख प्रयोजन हो, जसका लागि कुल ऋणी घरपरिवारको{" "}
              {(
                ((overallSummary[0]?.households || 0) / totalHouseholds) *
                100
              ).toFixed(2)}
              % ले कर्जा लिएका छन्।
            </p>

            {/* Client component for loan usage analysis section */}
            <LoanUsageAnalysisSection
              overallSummary={overallSummary}
              totalHouseholds={totalHouseholds}
              loanUseLabels={loanUseLabels}
            />

            <h2 id="data-source" className="scroll-m-20 border-b pb-2">
              तथ्याङ्क स्रोत
            </h2>
            <p>
              माथि प्रस्तुत गरिएका तथ्याङ्कहरू गढवा गाउँपालिकाको घरधुरी
              सर्वेक्षण र स्थानीय वित्तीय संस्थाहरूको रेकर्डबाट संकलन गरिएको हो।
              यी तथ्याङ्कहरूको महत्व निम्न अनुसार छ:
            </p>

            <ul>
              <li>स्थानीय अर्थतन्त्रको प्राथमिकताहरू पहिचान गर्न</li>
              <li>उत्पादनमूलक क्षेत्रमा लगानी प्रवर्द्धन गर्न</li>
              <li>वित्तीय साक्षरता र परामर्श कार्यक्रम निर्माण गर्न</li>
              <li>वित्तीय संस्थाहरूको सेवा विस्तारको रणनीति बनाउन</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
