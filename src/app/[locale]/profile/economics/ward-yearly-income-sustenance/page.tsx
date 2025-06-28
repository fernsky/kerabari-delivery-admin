import { Metadata } from "next";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import YearlyIncomeSustenanceCharts from "./_components/yearly-income-sustenance-charts";
import YearlyIncomeSustenanceAnalysis from "./_components/yearly-income-sustenance-analysis";
import YearlyIncomeSustenanceSEO from "./_components/yearly-income-sustenance-seo";
import { api } from "@/trpc/server";
import { monthsSustainedLabels } from "@/server/api/routers/profile/economics/ward-wise-annual-income-sustenance.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define Nepali translations for months sustained categories
const MONTHS_SUSTAINED_NAMES: Record<string, string> = {
  UPTO_THREE_MONTHS: "३ महिनासम्म",
  THREE_TO_SIX_MONTHS: "३-६ महिना",
  SIX_TO_NINE_MONTHS: "६-९ महिना",
  TWELVE_MONTHS: "वर्षभरि",
};

// Define the months sustained enums used in the data and charts
enum MonthsSustained {
  UPTO_THREE_MONTHS = "UPTO_THREE_MONTHS",
  THREE_TO_SIX_MONTHS = "THREE_TO_SIX_MONTHS",
  SIX_TO_NINE_MONTHS = "SIX_TO_NINE_MONTHS",
  TWELVE_MONTHS = "TWELVE_MONTHS",
}

// English translations/display labels for the months sustained categories
const MONTHS_SUSTAINED_LABELS: Record<MonthsSustained, string> = {
  [MonthsSustained.UPTO_THREE_MONTHS]: "Up to 3 Months",
  [MonthsSustained.THREE_TO_SIX_MONTHS]: "3 to 6 Months",
  [MonthsSustained.SIX_TO_NINE_MONTHS]: "6 to 9 Months",
  [MonthsSustained.TWELVE_MONTHS]: "12 Months (Full Year)",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const incomeSustenanceData =
      await api.profile.economics.wardWiseAnnualIncomeSustenance.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalHouseholds = incomeSustenanceData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    // Group by months sustained category and calculate totals
    const monthsSustainedCounts: Record<string, number> = {};
    incomeSustenanceData.forEach((item) => {
      if (!monthsSustainedCounts[item.monthsSustained]) {
        monthsSustainedCounts[item.monthsSustained] = 0;
      }
      monthsSustainedCounts[item.monthsSustained] += item.households || 0;
    });

    // Get all months sustained categories sorted by most households
    const sortedMonthsSustained = Object.entries(monthsSustainedCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([type]) => type);

    // Create rich keywords with actual data
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका वार्षिक आय",
      "वार्षिक उत्पादनको पर्याप्तता",
      `बुद्धशान्ति ${MONTHS_SUSTAINED_NAMES[sortedMonthsSustained[0]]} आय पर्याप्तता`,
      ...sortedMonthsSustained.map(
        (r) => `${MONTHS_SUSTAINED_NAMES[r]} आय पर्याप्तता बुद्धशान्ति`,
      ),
      "वडा अनुसार वार्षिक आय",
      "आर्थिक स्वावलम्बन तथ्याङ्क",
      "आय पर्याप्तता सर्वेक्षण बुद्धशान्ति",
      `बुद्धशान्ति कुल घरपरिवार संख्या ${totalHouseholds}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality annual income sufficiency",
      "Yearly income sustenance",
      `Khajura ${monthsSustainedLabels[sortedMonthsSustained[0] as keyof typeof monthsSustainedLabels]}`,
      ...sortedMonthsSustained.map(
        (r) =>
          `${monthsSustainedLabels[r as keyof typeof monthsSustainedLabels]} households in Khajura`,
      ),
      "Ward-wise income sustenance",
      "Economic self-reliance statistics",
      "Income sufficiency survey Khajura",
      `Khajura total households ${totalHouseholds}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `बुद्धशान्ति गाउँपालिकामा वडा अनुसार वार्षिक आयको पर्याप्तता वितरण, प्रवृत्ति र विश्लेषण। कुल घरपरिवार संख्या ${totalHouseholds} मध्ये ${MONTHS_SUSTAINED_NAMES[sortedMonthsSustained[0]]} (${monthsSustainedCounts[sortedMonthsSustained[0]]}) सबैभन्दा ठूलो समूह हो, त्यसपछि ${MONTHS_SUSTAINED_NAMES[sortedMonthsSustained[1]]} (${monthsSustainedCounts[sortedMonthsSustained[1]]})। वार्षिक आयको पर्याप्तताको विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Ward-wise yearly income sustenance distribution, trends and analysis for Khajura Rural Municipality. Out of a total of ${totalHouseholds} households, ${monthsSustainedLabels[sortedMonthsSustained[0] as keyof typeof monthsSustainedLabels]} (${monthsSustainedCounts[sortedMonthsSustained[0]]}) is the largest group, followed by ${monthsSustainedLabels[sortedMonthsSustained[1] as keyof typeof monthsSustainedLabels]} (${monthsSustainedCounts[sortedMonthsSustained[1]]})। Detailed statistics and visualizations of yearly income sufficiency.`;

    return {
      title: `वार्षिक आयको पर्याप्तता | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-yearly-income-sustenance",
        languages: {
          en: "/en/profile/economics/ward-yearly-income-sustenance",
          ne: "/ne/profile/economics/ward-yearly-income-sustenance",
        },
      },
      openGraph: {
        title: `वार्षिक आयको पर्याप्तता | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `वार्षिक आयको पर्याप्तता | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "वार्षिक आयको पर्याप्तता | पालिका प्रोफाइल",
      description:
        "वडा अनुसार वार्षिक आयको पर्याप्तता वितरण, प्रवृत्ति र विश्लेषण। विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "वार्षिक आयको पर्याप्तता",
    slug: "income-sustenance-distribution",
  },
  {
    level: 2,
    text: "वडा अनुसार आयको पर्याप्तता",
    slug: "ward-wise-income-sustenance",
  },
  {
    level: 2,
    text: "आयको पर्याप्तताको विश्लेषण",
    slug: "income-sustenance-analysis",
  },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

export default async function WardYearlyIncomeSustenancePage() {
  // Fetch all yearly income sustenance data using tRPC
  const incomeSustenanceData =
    await api.profile.economics.wardWiseAnnualIncomeSustenance.getAll.query();

  // Try to fetch summary data
  try {
    await api.profile.economics.wardWiseAnnualIncomeSustenance.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    incomeSustenanceData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.monthsSustained]) acc[item.monthsSustained] = 0;
      acc[item.monthsSustained] += item.households || 0;
      return acc;
    }, {}),
  )
    .map(([monthsSustained, households]) => ({
      monthsSustained,
      monthsSustainedName:
        MONTHS_SUSTAINED_NAMES[monthsSustained] ||
        monthsSustainedLabels[
          monthsSustained as keyof typeof monthsSustainedLabels
        ] ||
        monthsSustained,
      households,
    }))
    .sort((a, b) => {
      // Custom sort to maintain chronological order
      const order = [
        "UPTO_THREE_MONTHS",
        "THREE_TO_SIX_MONTHS",
        "SIX_TO_NINE_MONTHS",
        "TWELVE_MONTHS",
      ];
      return (
        order.indexOf(a.monthsSustained) - order.indexOf(b.monthsSustained)
      );
    });

  // Calculate total households for percentages
  const totalHouseholds = overallSummary.reduce(
    (sum, item) => sum + item.households,
    0,
  );

  // Prepare data for pie chart
  const pieChartData = overallSummary.map((item) => ({
    name: item.monthsSustainedName,
    value: item.households,
    percentage: ((item.households / totalHouseholds) * 100).toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(incomeSustenanceData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = incomeSustenanceData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Sort data by months sustained order
    const sortedData = [...wardData].sort((a, b) => {
      const order = [
        "UPTO_THREE_MONTHS",
        "THREE_TO_SIX_MONTHS",
        "SIX_TO_NINE_MONTHS",
        "TWELVE_MONTHS",
      ];
      return (
        order.indexOf(a.monthsSustained) - order.indexOf(b.monthsSustained)
      );
    });

    // Add months sustained categories
    sortedData.forEach((item) => {
      result[
        MONTHS_SUSTAINED_NAMES[item.monthsSustained] ||
          monthsSustainedLabels[
            item.monthsSustained as keyof typeof monthsSustainedLabels
          ]
      ] = item.households;
    });

    return result;
  });

  return (
    <div className="relative py-4 lg:py-6">
      <div className="flex gap-8 max-w-none">
        {/* Main content - let it expand to fill available space */}
        <article className="prose prose-slate dark:prose-invert flex-1 min-w-0 max-w-none">
          {/* Add structured data for SEO */}
          <YearlyIncomeSustenanceSEO
            overallSummary={overallSummary}
            totalHouseholds={totalHouseholds}
            MONTHS_SUSTAINED_NAMES={MONTHS_SUSTAINED_NAMES}
            wardNumbers={wardNumbers}
          />

          <div className="flex flex-col gap-8">
            <section>
              <div className="relative rounded-lg overflow-hidden mb-8">
                <Image
                  src="/images/income-sustenance.svg"
                  width={1200}
                  height={400}
                  alt="वार्षिक आयको पर्याप्तता - बुद्धशान्ति गाउँपालिका (Yearly Income Sustenance - Khajura Rural Municipality)"
                  className="w-full h-[250px] object-cover rounded-sm"
                  priority
                />
              </div>

              {/* Content with responsive max-width for readability */}
              <div className="prose prose-slate dark:prose-invert max-w-4xl">
                <h1 className="scroll-m-20 tracking-tight mb-6">
                  बुद्धशान्ति गाउँपालिकामा वार्षिक आयको पर्याप्तता
                </h1>

                <h2 id="introduction" className="scroll-m-20">
                  परिचय
                </h2>
                <p>
                  यस खण्डमा बुद्धशान्ति गाउँपालिकाको विभिन्न वडाहरूमा रहेका
                  घरपरिवारहरूको वार्षिक आयको पर्याप्तता सम्बन्धी विस्तृत
                  तथ्याङ्क प्रस्तुत गरिएको छ। यो तथ्याङ्कले घरपरिवारको आय, खर्च,
                  आर्थिक अवस्था र खाद्य सुरक्षाको अवस्थालाई प्रतिबिम्बित गर्दछ。
                </p>
                <p>
                  बुद्धशान्ति गाउँपालिकामा कुल{" "}
                  {totalHouseholds.toLocaleString()} घरपरिवार मध्ये सबैभन्दा
                  धेरै{" "}
                  {(
                    ((overallSummary.sort(
                      (a, b) => b.households - a.households,
                    )[0]?.households || 0) /
                      totalHouseholds) *
                    100
                  ).toFixed(1)}
                  % घरपरिवारहरूको वार्षिक आय{" "}
                  {overallSummary.sort((a, b) => b.households - a.households)[0]
                    ?.monthsSustainedName || ""}{" "}
                  मात्र पुग्ने देखिन्छ। यस तथ्याङ्कले स्थानीय सरकारलाई आर्थिक
                  विकास योजना र गरीबी निवारणका कार्यक्रमहरू तर्जुमा गर्न सहयोग
                  पुर्‍याउँछ。
                </p>

                <h2
                  id="income-sustenance-distribution"
                  className="scroll-m-20 border-b pb-2"
                >
                  वार्षिक आयको पर्याप्तता
                </h2>
                <p>
                  बुद्धशान्ति गाउँपालिकामा वार्षिक आयको पर्याप्तता अनुसार
                  घरपरिवारहरूको वितरण निम्नानुसार रहेको छ:
                </p>
              </div>

              {/* Client component for charts - full width */}
              <div className="max-w-none not-prose">
                <YearlyIncomeSustenanceCharts
                  overallSummary={overallSummary}
                  totalHouseholds={totalHouseholds}
                  pieChartData={pieChartData}
                  wardWiseData={wardWiseData}
                  wardNumbers={wardNumbers}
                  incomeSustenanceData={incomeSustenanceData}
                  MONTHS_SUSTAINED_NAMES={MONTHS_SUSTAINED_NAMES}
                />
              </div>

              {/* Content with responsive max-width for readability */}
              <div className="prose prose-slate dark:prose-invert max-w-4xl mt-8">
                <h2
                  id="income-sustenance-analysis"
                  className="scroll-m-20 border-b pb-2"
                >
                  आयको पर्याप्तताको विश्लेषण
                </h2>
                <p>
                  बुद्धशान्ति गाउँपालिकाका घरपरिवारहरूको वार्षिक आयको पर्याप्तता
                  विश्लेषण गर्दा, वर्षभरि लागि आफ्नै आय पुग्ने घरपरिवारको संख्या{" "}
                  {overallSummary
                    .find((item) => item.monthsSustained === "TWELVE_MONTHS")
                    ?.households.toLocaleString() || "0"}{" "}
                  (
                  {(
                    ((overallSummary.find(
                      (item) => item.monthsSustained === "TWELVE_MONTHS",
                    )?.households || 0) /
                      totalHouseholds) *
                    100
                  ).toFixed(1)}
                  %) मात्र रहेको देखिन्छ। यसले बुद्धशान्तिमा खाद्य सुरक्षा,
                  आर्थिक स्वावलम्बन र गरीबीको स्थितिलाई संकेत गर्दछ。
                </p>

                {/* Client component for analysis section */}
                <YearlyIncomeSustenanceAnalysis
                  overallSummary={overallSummary}
                  totalHouseholds={totalHouseholds}
                  MONTHS_SUSTAINED_NAMES={MONTHS_SUSTAINED_NAMES}
                  wardNumbers={wardNumbers}
                  incomeSustenanceData={incomeSustenanceData}
                />

                <h2 id="data-source" className="scroll-m-20 border-b pb-2">
                  तथ्याङ्क स्रोत
                </h2>
                <p>
                  माथि प्रस्तुत गरिएका तथ्याङ्कहरू बुद्धशान्ति गाउँपालिकाको
                  घरधुरी सर्वेक्षण र पालिकाको आर्थिक अध्ययनबाट संकलन गरिएको हो।
                  यी तथ्याङ्कहरूको महत्व निम्न अनुसार छ:
                </p>

                <ul>
                  <li>जीविकोपार्जन र खाद्य सुरक्षाको अवस्था अध्ययन गर्न</li>
                  <li>
                    आय वृद्धि र गरीबी न्यूनीकरणका कार्यक्रमहरू लक्षित गर्न
                  </li>
                  <li>स्थानीय अर्थतन्त्रको संरचना र प्रवृत्ति बुझ्न</li>
                  <li>आर्थिक विकासका योजना र नीतिहरू तयार गर्न</li>
                </ul>
              </div>
            </section>
          </div>
        </article>

        {/* Table of Contents - Desktop only, reduced width */}
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-20 p-3 border border-gray-200 rounded-lg bg-gray-50/50 max-w-[224px]">
            <TableOfContents toc={toc} />
          </div>
        </aside>
      </div>
    </div>
  );
}
