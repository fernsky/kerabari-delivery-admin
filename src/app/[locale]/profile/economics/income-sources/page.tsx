import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import IncomeSourcesCharts from "./_components/income-sources-charts";
import IncomeSourcesAnalysisSection from "./_components/income-sources-analysis-section";
import IncomeSourcesSEO from "./_components/income-sources-seo";
import { api } from "@/trpc/server";
import { incomeSourceLabels } from "@/server/api/routers/profile/economics/ward-wise-household-income-source.schema";

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
    const incomeSourcesData =
      await api.profile.economics.wardWiseHouseholdIncomeSource.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalHouseholds = incomeSourcesData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    // Group by income source and calculate totals
    const incomeCounts: Record<string, number> = {};
    incomeSourcesData.forEach((item) => {
      if (!incomeCounts[item.incomeSource]) incomeCounts[item.incomeSource] = 0;
      incomeCounts[item.incomeSource] += item.households || 0;
    });

    // Get top 3 income sources for keywords
    const topIncomeSources = Object.entries(incomeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    // Define income source names in both languages
    const INCOME_SOURCE_NAMES_NP: Record<string, string> = {
      JOB: "जागिर/सेवा",
      AGRICULTURE: "कृषि",
      BUSINESS: "व्यापार/व्यवसाय",
      INDUSTRY: "उद्योग",
      FOREIGN_EMPLOYMENT: "वैदेशिक रोजगार",
      LABOUR: "दैनिक ज्याला",
      OTHER: "अन्य",
    };

    const INCOME_SOURCE_NAMES_EN: Record<string, string> = {
      JOB: "Job/Service",
      AGRICULTURE: "Agriculture",
      BUSINESS: "Business",
      INDUSTRY: "Industry",
      FOREIGN_EMPLOYMENT: "Foreign Employment",
      LABOUR: "Daily Labour",
      OTHER: "Other",
    };

    // Create rich keywords with actual data
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका आयस्रोत",
      "बुद्धशान्ति घरपरिवार आय",
      `बुद्धशान्ति ${INCOME_SOURCE_NAMES_NP[topIncomeSources[0]]} घरपरिवार`,
      ...topIncomeSources.map(
        (r) => `${INCOME_SOURCE_NAMES_NP[r]} आय बुद्धशान्ति`,
      ),
      "वडा अनुसार आयस्रोत",
      "आय विविधता तथ्याङ्क",
      "आर्थिक जनगणना बुद्धशान्ति",
      `बुद्धशान्ति कुल घरपरिवार ${totalHouseholds}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality income sources",
      "Khajura household income",
      `Khajura ${INCOME_SOURCE_NAMES_EN[topIncomeSources[0]]} households`,
      ...topIncomeSources.map(
        (r) => `${INCOME_SOURCE_NAMES_EN[r]} income in Khajura`,
      ),
      "Ward-wise income sources",
      "Income diversity statistics",
      "Economic census Khajura",
      `Khajura total households ${totalHouseholds}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `बुद्धशान्ति गाउँपालिकाको वडा अनुसार घरपरिवारको आयस्रोत वितरण, प्रवृत्ति र विश्लेषण। कुल घरपरिवार ${totalHouseholds} मध्ये ${INCOME_SOURCE_NAMES_NP[topIncomeSources[0]]} (${incomeCounts[topIncomeSources[0]]}) सबैभन्दा ठूलो समूह हो, त्यसपछि ${INCOME_SOURCE_NAMES_NP[topIncomeSources[1]]} (${incomeCounts[topIncomeSources[1]]}) र ${INCOME_SOURCE_NAMES_NP[topIncomeSources[2]]} (${incomeCounts[topIncomeSources[2]]})। विभिन्न आयस्रोतहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Ward-wise household income source distribution, trends and analysis for Khajura Rural Municipality. Out of total ${totalHouseholds} households, ${INCOME_SOURCE_NAMES_EN[topIncomeSources[0]]} (${incomeCounts[topIncomeSources[0]]}) is the largest group, followed by ${INCOME_SOURCE_NAMES_EN[topIncomeSources[1]]} (${incomeCounts[topIncomeSources[1]]}) and ${INCOME_SOURCE_NAMES_EN[topIncomeSources[2]]} (${incomeCounts[topIncomeSources[2]]})। Detailed statistics and visualizations of various income sources.`;

    return {
      title: `घरपरिवारको आयस्रोत | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/income-sources",
        languages: {
          en: "/en/profile/economics/income-sources",
          ne: "/ne/profile/economics/income-sources",
        },
      },
      openGraph: {
        title: `घरपरिवारको आयस्रोत | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `घरपरिवारको आयस्रोत | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "घरपरिवारको आयस्रोत | पालिका प्रोफाइल",
      description:
        "वडा अनुसार घरपरिवारको आयस्रोत वितरण, प्रवृत्ति र विश्लेषण। विभिन्न आयस्रोतहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "आयस्रोत अनुसार घरपरिवार",
    slug: "income-sources-distribution",
  },
  {
    level: 2,
    text: "वडा अनुसार आयस्रोत विविधता",
    slug: "ward-wise-income-sources",
  },
  {
    level: 2,
    text: "प्रमुख आयस्रोतहरूको विश्लेषण",
    slug: "major-income-sources",
  },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

// Define Nepali names for income sources
const INCOME_SOURCE_NAMES: Record<string, string> = {
  JOB: "जागिर/सेवा",
  AGRICULTURE: "कृषि",
  BUSINESS: "व्यापार/व्यवसाय",
  INDUSTRY: "उद्योग",
  FOREIGN_EMPLOYMENT: "वैदेशिक रोजगार",
  LABOUR: "दैनिक ज्याला",
  OTHER: "अन्य",
};

export default async function IncomeSourcesPage() {
  // Fetch all income source data using tRPC
  const incomeSourcesData =
    await api.profile.economics.wardWiseHouseholdIncomeSource.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseHouseholdIncomeSource.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    incomeSourcesData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.incomeSource]) acc[item.incomeSource] = 0;
      acc[item.incomeSource] += item.households || 0;
      return acc;
    }, {}),
  )
    .map(([incomeSource, households]) => ({
      incomeSource,
      incomeName:
        INCOME_SOURCE_NAMES[incomeSource] ||
        incomeSourceLabels[incomeSource as keyof typeof incomeSourceLabels],
      households,
    }))
    .sort((a, b) => b.households - a.households);

  // Calculate total households for percentages
  const totalHouseholds = overallSummary.reduce(
    (sum, item) => sum + item.households,
    0,
  );

  // Prepare data for pie chart
  const pieChartData = overallSummary.map((item) => ({
    name: item.incomeName,
    value: item.households,
    percentage: ((item.households / totalHouseholds) * 100).toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(incomeSourcesData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = incomeSourcesData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add income sources for this ward
    wardData.forEach((item) => {
      result[
        INCOME_SOURCE_NAMES[item.incomeSource] ||
          incomeSourceLabels[
            item.incomeSource as keyof typeof incomeSourceLabels
          ]
      ] = item.households;
    });

    return result;
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <IncomeSourcesSEO
        overallSummary={overallSummary}
        totalHouseholds={totalHouseholds}
        INCOME_SOURCE_NAMES={INCOME_SOURCE_NAMES}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/income-sources.svg"
              width={1200}
              height={400}
              alt="घरपरिवारको आयस्रोत - बुद्धशान्ति गाउँपालिका (Household Income Sources - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा घरपरिवारको आयस्रोत
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा बुद्धशान्ति गाउँपालिकाको विभिन्न वडाहरूमा बसोबास गर्ने
              घरपरिवारहरूको प्रमुख आयस्रोतहरू सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत
              गरिएको छ। यो तथ्याङ्कले आर्थिक गतिविधि, रोजगारीको स्वरूप, र
              स्थानीय अर्थतन्त्रको संरचनालाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              बुद्धशान्ति गाउँपालिकामा विविध आयस्रोतमा निर्भर घरपरिवारहरू बसोबास
              गर्दछन्। कुल घरपरिवार {totalHouseholds.toLocaleString()} मध्ये{" "}
              {overallSummary[0]?.incomeName || ""} बाट आय आर्जन गर्ने
              घरपरिवारहरू{" "}
              {(
                ((overallSummary[0]?.households || 0) / totalHouseholds) *
                100
              ).toFixed(1)}
              % रहेका छन्। यस तथ्याङ्कले आर्थिक नीति, रोजगार सिर्जना र आय वृद्धि
              कार्यक्रमहरूमा सहयोग पुर्‍याउँछ।
            </p>

            <h2
              id="income-sources-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              आयस्रोत अनुसार घरपरिवार
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा विभिन्न आयस्रोतमा निर्भर घरपरिवारहरूको
              संख्या निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <IncomeSourcesCharts
            overallSummary={overallSummary}
            totalHouseholds={totalHouseholds}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            incomeSourcesData={incomeSourcesData}
            INCOME_SOURCE_NAMES={INCOME_SOURCE_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="major-income-sources" className="scroll-m-20 border-b pb-2">
              प्रमुख आयस्रोतहरूको विश्लेषण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा निम्न आयस्रोतहरू प्रमुख रूपमा देखिएका
              छन्। यी आयस्रोतहरूमध्ये{" "}
              {INCOME_SOURCE_NAMES[overallSummary[0]?.incomeSource] || "कृषि"}
              सबैभन्दा धेरै घरपरिवारहरूको मुख्य आयस्रोत हो, जसलाई कुल घरपरिवारको{" "}
              {(
                ((overallSummary[0]?.households || 0) / totalHouseholds) *
                100
              ).toFixed(2)}
              % ले अपनाएका छन्।
            </p>

            {/* Client component for income source analysis section */}
            <IncomeSourcesAnalysisSection
              overallSummary={overallSummary}
              totalHouseholds={totalHouseholds}
              INCOME_SOURCE_NAMES={INCOME_SOURCE_NAMES}
            />

            <h2 id="data-source" className="scroll-m-20 border-b pb-2">
              तथ्याङ्क स्रोत
            </h2>
            <p>
              माथि प्रस्तुत गरिएका तथ्याङ्कहरू नेपालको राष्ट्रिय जनगणना र
              बुद्धशान्ति गाउँपालिकाको आफ्नै सर्वेक्षणबाट संकलन गरिएको हो। यी
              तथ्याङ्कहरूको महत्व निम्न अनुसार छ:
            </p>

            <ul>
              <li>स्थानीय अर्थतन्त्रको संरचना र प्रवृत्ति बुझ्न</li>
              <li>
                विभिन्न क्षेत्रमा रोजगारी र आय वृद्धिका अवसरहरू पहिचान गर्न
              </li>
              <li>लक्षित आर्थिक विकास कार्यक्रमहरू तयार गर्न</li>
              <li>आय विविधिकरण र आर्थिक स्थिरता प्रवर्द्धन गर्न</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
