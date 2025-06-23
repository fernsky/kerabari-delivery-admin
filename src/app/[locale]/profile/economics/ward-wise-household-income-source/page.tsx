import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import IncomeSourceCharts from "./_components/income-source-charts";
import IncomeAnalysisSection from "./_components/income-analysis-section";
import IncomeSourceSEO from "./_components/income-source-seo";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import {
  incomeSourceLabels,
  IncomeSourceEnum,
} from "@/server/api/routers/profile/economics/ward-wise-household-income-source.schema";

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
    const incomeSourceData =
      await api.profile.economics.wardWiseHouseholdIncomeSource.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalHouseholds = incomeSourceData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    // Group by income source and calculate totals
    const incomeSourceCounts: Record<string, number> = {};
    incomeSourceData.forEach((item) => {
      if (!incomeSourceCounts[item.incomeSource])
        incomeSourceCounts[item.incomeSource] = 0;
      incomeSourceCounts[item.incomeSource] += item.households || 0;
    });

    // Get top 3 income sources for keywords
    const topIncomeSources = Object.entries(incomeSourceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    // Create rich keywords with actual data
    const keywordsNP = [
      "गढवा गाउँपालिका घरपरिवार आय स्रोत",
      "गढवा आर्थिक गतिविधि",
      `गढवा ${incomeSourceLabels[topIncomeSources[0] as keyof typeof incomeSourceLabels]}`,
      ...topIncomeSources.map(
        (r) =>
          `${incomeSourceLabels[r as keyof typeof incomeSourceLabels]} गढवा`,
      ),
      "वडा अनुसार आय स्रोत",
      "आर्थिक गतिविधि तथ्याङ्क",
      "आय स्रोत सर्वेक्षण गढवा",
      `गढवा कुल घरपरिवार संख्या ${localizeNumber(totalHouseholds.toString(), "ne")}`,
    ];
    const keywordsEN = [
      "Khajura Rural Municipality household income sources",
      "Khajura economic activities",
      `Khajura ${incomeSourceLabels[topIncomeSources[0] as keyof typeof incomeSourceLabels]}`,
      ...topIncomeSources.map(
        (r) =>
          `${incomeSourceLabels[r as keyof typeof incomeSourceLabels]} households in Khajura`,
      ),
      "Ward-wise household income sources",
      "Economic activity statistics",
      "Income source survey Khajura",
      `Khajura total households ${totalHouseholds}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकाको वडा अनुसार घरपरिवारको आय स्रोत वितरण, प्रवृत्ति र विश्लेषण। कुल घरपरिवार संख्या ${localizeNumber(
      totalHouseholds.toString(),
      "ne",
    )} मध्ये ${
      incomeSourceLabels[topIncomeSources[0] as keyof typeof incomeSourceLabels]
    } (${localizeNumber(
      incomeSourceCounts[topIncomeSources[0]].toString(),
      "ne",
    )}) सबैभन्दा ठूलो समूह हो, त्यसपछि ${
      incomeSourceLabels[topIncomeSources[1] as keyof typeof incomeSourceLabels]
    } (${localizeNumber(
      incomeSourceCounts[topIncomeSources[1]].toString(),
      "ne",
    )}) र ${
      incomeSourceLabels[topIncomeSources[2] as keyof typeof incomeSourceLabels]
    } (${localizeNumber(
      incomeSourceCounts[topIncomeSources[2]].toString(),
      "ne",
    )})। विभिन्न आय स्रोतहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Ward-wise household income source distribution, trends and analysis for Khajura Rural Municipality. Out of a total of ${totalHouseholds} households, ${
      incomeSourceLabels[topIncomeSources[0] as keyof typeof incomeSourceLabels]
    } (${incomeSourceCounts[topIncomeSources[0]]}) is the largest group, followed by ${
      incomeSourceLabels[topIncomeSources[1] as keyof typeof incomeSourceLabels]
    } (${incomeSourceCounts[topIncomeSources[1]]}) and ${
      incomeSourceLabels[topIncomeSources[2] as keyof typeof incomeSourceLabels]
    } (${
      incomeSourceCounts[topIncomeSources[2]]
    }). Detailed statistics and visualizations of various household income sources.`;
    return {
      title: `घरपरिवारको आय स्रोत | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-wise-household-income-source",
        languages: {
          en: "/en/profile/economics/ward-wise-household-income-source",
          ne: "/ne/profile/economics/ward-wise-household-income-source",
        },
      },
      openGraph: {
        title: `घरपरिवारको आय स्रोत | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `घरपरिवारको आय स्रोत | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "घरपरिवारको आय स्रोत | गढवा गाउँपालिका प्रोफाइल",
      description:
        "वडा अनुसार घरपरिवारको आय स्रोत वितरण, प्रवृत्ति र विश्लेषण। विभिन्न आय स्रोतहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "आय स्रोत अनुसार घरपरिवार",
    slug: "income-source-distribution",
  },
  {
    level: 2,
    text: "वडा अनुसार आय स्रोत विविधता",
    slug: "ward-wise-income-source",
  },
  {
    level: 2,
    text: "प्रमुख आय स्रोतहरूको विश्लेषण",
    slug: "major-income-sources",
  },
];

export default async function WardWiseHouseholdIncomeSourcePage() {
  // Fetch all income source data using tRPC
  const incomeSourceData =
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
    incomeSourceData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.incomeSource]) acc[item.incomeSource] = 0;
      acc[item.incomeSource] += item.households || 0;
      return acc;
    }, {}),
  )
    .map(([incomeSource, households]) => ({
      incomeSource,
      households,
      incomeSourceName:
        incomeSourceLabels[incomeSource as keyof typeof incomeSourceLabels] ||
        incomeSource,
    }))
    .sort((a, b) => b.households - a.households);

  // Calculate total households for percentages
  const totalHouseholds = overallSummary.reduce(
    (sum, item) => sum + item.households,
    0,
  );

  // Take top income sources for pie chart, group others
  const topIncomeSources = overallSummary.slice(0, 7);
  const otherIncomeSources = overallSummary.slice(7);

  const otherTotalHouseholds = otherIncomeSources.reduce(
    (sum, item) => sum + item.households,
    0,
  );

  let pieChartData = topIncomeSources.map((item) => ({
    name: item.incomeSourceName,
    value: item.households,
    percentage: ((item.households / totalHouseholds) * 100).toFixed(2),
  }));

  // Add "Other" category if there are more than 7 income sources
  if (otherIncomeSources.length > 0) {
    pieChartData.push({
      name: "अन्य",
      value: otherTotalHouseholds,
      percentage: ((otherTotalHouseholds / totalHouseholds) * 100).toFixed(2),
    });
  }

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(incomeSourceData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization (top 5 income sources per ward + others)
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = incomeSourceData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    // Sort ward data by households
    wardData.sort((a, b) => (b.households || 0) - (a.households || 0));

    // Take top 5 income sources for this ward
    const topWardIncomeSources = wardData.slice(0, 5);
    const otherWardIncomeSources = wardData.slice(5);
    const otherWardTotal = otherWardIncomeSources.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add top income sources
    topWardIncomeSources.forEach((item) => {
      result[
        incomeSourceLabels[
          item.incomeSource as keyof typeof incomeSourceLabels
        ] || item.incomeSource
      ] = item.households;
    });

    // Add "Other" category if needed
    if (otherWardIncomeSources.length > 0) {
      result["अन्य"] = otherWardTotal;
    }

    return result;
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <IncomeSourceSEO
        overallSummary={overallSummary}
        totalHouseholds={totalHouseholds}
        incomeSourceLabels={incomeSourceLabels}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/income-sources.svg"
              width={1200}
              height={400}
              alt="घरपरिवारको आय स्रोत - गढवा गाउँपालिका (Household Income Sources - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा घरपरिवारको आय स्रोत
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा गढवा गाउँपालिकाको विभिन्न वडाहरूमा रहेका
              घरपरिवारहरूको प्रमुख आय स्रोत सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत
              गरिएको छ। यो तथ्याङ्कले आर्थिक गतिविधि, रोजगारी र जीविकोपार्जनको
              स्वरूपलाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              गढवा गाउँपालिकामा विभिन्न आय स्रोतहरू मार्फत घरपरिवारहरू आफ्नो
              जीविकोपार्जन गर्दछन्। कुल घरपरिवार संख्या{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")} मध्ये{" "}
              {overallSummary[0]?.incomeSourceName || ""} प्रमुख आय स्रोत भएका
              घरपरिवारहरू{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.households || 0) / totalHouseholds) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % रहेका छन्। यस तथ्याङ्कले स्थानीय अर्थतन्त्रको बुझाई, रोजगारी
              सृजना र आर्थिक विकासमा सहयोग पुर्‍याउँछ।
            </p>

            <h2
              id="income-source-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              आय स्रोत अनुसार घरपरिवार
            </h2>
            <p>
              गढवा गाउँपालिकामा विभिन्न आय स्रोत भएका घरपरिवारहरूको संख्या
              निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <IncomeSourceCharts
            overallSummary={overallSummary}
            totalHouseholds={totalHouseholds}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            incomeSourceData={incomeSourceData}
            incomeSourceLabels={incomeSourceLabels}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="major-income-sources" className="scroll-m-20 border-b pb-2">
              प्रमुख आय स्रोतहरूको विश्लेषण
            </h2>
            <p>
              गढवा गाउँपालिकामा निम्न आय स्रोतहरू प्रमुख रूपमा देखिन्छन्। यी
              आय स्रोतहरू मध्ये{" "}
              {incomeSourceLabels[
                overallSummary[0]
                  ?.incomeSource as keyof typeof incomeSourceLabels
              ] || "कृषि"}{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.households || 0) / totalHouseholds) *
                  100
                ).toFixed(2),
                "ne",
              )}
              % मा देखिन्छ।
            </p>

            {/* Client component for income source analysis section */}
            <IncomeAnalysisSection
              overallSummary={overallSummary}
              totalHouseholds={totalHouseholds}
              incomeSourceLabels={incomeSourceLabels}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
