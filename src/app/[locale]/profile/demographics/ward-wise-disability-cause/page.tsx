import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import DisabilityCauseCharts from "./_components/disability-cause-charts";
import DisabilityCauseAnalysisSection from "./_components/disability-cause-analysis-section";
import DisabilityCauseSEO from "./_components/disability-cause-seo";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define Nepali names for disability causes
const DISABILITY_CAUSE_NAMES: Record<string, string> = {
  CONGENITAL: "जन्मजात",
  ACCIDENT: "दुर्घटना",
  MALNUTRITION: "कुपोषण",
  DISEASE: "रोगको कारण",
  CONFLICT: "द्वन्द्वको कारण",
  OTHER: "अन्य(खुलाऊनुहोस्)",
  UNKNOWN: "थहा नभएको",
};

// Define English names for disability causes (for SEO)
const DISABILITY_CAUSE_NAMES_EN: Record<string, string> = {
  CONGENITAL: "Congenital",
  ACCIDENT: "Accident",
  MALNUTRITION: "Malnutrition",
  DISEASE: "Disease",
  CONFLICT: "Conflict-related",
  OTHER: "Other causes",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const disabilityData =
      await api.profile.demographics.wardWiseDisabilityCause.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulationWithDisability = disabilityData.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    // Group by disability cause and calculate totals
    const disabilityCauseCounts: Record<string, number> = {};
    disabilityData.forEach((item) => {
      if (!disabilityCauseCounts[item.disabilityCause])
        disabilityCauseCounts[item.disabilityCause] = 0;
      disabilityCauseCounts[item.disabilityCause] += item.population || 0;
    });

    // Find the most common disability cause
    let mostCommonCause = "";
    let mostCommonCount = 0;
    Object.entries(disabilityCauseCounts).forEach(([cause, count]) => {
      if (count > mostCommonCount) {
        mostCommonCount = count;
        mostCommonCause = cause;
      }
    });

    const mostCommonPercentage =
      totalPopulationWithDisability > 0
        ? ((mostCommonCount / totalPopulationWithDisability) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "गढवा गाउँपालिका अपाङ्गताको कारण",
      "गढवा अपाङ्गता वितरण",
      "वडा अनुसार अपाङ्गताको कारण",
      "अपाङ्गताको कारण विवरण",
      "जन्मजात अपाङ्गता गढवा",
      "दुर्घटनाको कारण अपाङ्गता",
      `गढवा अपाङ्गता जनसंख्या ${localizeNumber(totalPopulationWithDisability.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality disability causes",
      "Khajura disability distribution",
      "Ward-wise disability causes",
      "Disability cause details",
      "Congenital disabilities in Khajura",
      "Accident-related disabilities",
      `Khajura disability population ${totalPopulationWithDisability}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकाको वडा अनुसार अपाङ्गताको कारणको वितरण र विश्लेषण। कुल अपाङ्गता भएका जनसंख्या ${localizeNumber(totalPopulationWithDisability.toString(), "ne")} मध्ये ${localizeNumber(mostCommonPercentage, "ne")}% (${localizeNumber(mostCommonCount.toString(), "ne")}) ${DISABILITY_CAUSE_NAMES[mostCommonCause] || mostCommonCause} कारणबाट हुने देखिन्छ। विभिन्न वडाहरूमा अपाङ्गताको कारणहरूको विस्तृत विश्लेषण।`;

    const descriptionEN = `Ward-wise distribution and analysis of disability causes in Khajura Rural Municipality. Out of a total population with disabilities of ${totalPopulationWithDisability}, ${mostCommonPercentage}% (${mostCommonCount}) are due to ${DISABILITY_CAUSE_NAMES_EN[mostCommonCause] || mostCommonCause}. Detailed analysis of disability causes across various wards.`;

    return {
      title: `अपाङ्गताको कारणहरू | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/demographics/ward-wise-disability-cause",
        languages: {
          en: "/en/profile/demographics/ward-wise-disability-cause",
          ne: "/ne/profile/demographics/ward-wise-disability-cause",
        },
      },
      openGraph: {
        title: `अपाङ्गताको कारणहरू | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `अपाङ्गताको कारणहरू | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "अपाङ्गताको कारणहरू | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार अपाङ्गताका कारणहरूको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "अपाङ्गताका कारणहरू", slug: "disability-causes" },
  {
    level: 2,
    text: "वडा अनुसार अपाङ्गताका कारणहरू",
    slug: "ward-wise-disability-causes",
  },
  { level: 2, text: "अपाङ्गता विश्लेषण", slug: "disability-analysis" },
];

export default async function WardWiseDisabilityCausePage() {
  // Fetch all disability cause data using tRPC
  const disabilityData =
    await api.profile.demographics.wardWiseDisabilityCause.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.demographics.wardWiseDisabilityCause.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    disabilityData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.disabilityCause]) acc[item.disabilityCause] = 0;
      acc[item.disabilityCause] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([disabilityCause, population]) => ({
      disabilityCause,
      disabilityCauseName:
        DISABILITY_CAUSE_NAMES[
          disabilityCause as keyof typeof DISABILITY_CAUSE_NAMES
        ] || disabilityCause,
      population,
    }))
    .sort((a, b) => b.population - a.population); // Sort by population descending

  // Calculate total population for percentages
  const totalPopulationWithDisability = overallSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Create data for pie chart
  const pieChartData = overallSummary.map((item) => ({
    name: item.disabilityCauseName,
    value: item.population,
    percentage: (
      (item.population / totalPopulationWithDisability) *
      100
    ).toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(disabilityData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = disabilityData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add disability causes
    wardData.forEach((item) => {
      result[
        DISABILITY_CAUSE_NAMES[
          item.disabilityCause as keyof typeof DISABILITY_CAUSE_NAMES
        ] || item.disabilityCause
      ] = item.population;
    });

    return result;
  });

  // Calculate ward-wise disability rates
  const wardWiseAnalysis = wardNumbers.map((wardNumber) => {
    const wardData = disabilityData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const wardTotalPopulation = wardData.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    const mostCommonCause = wardData.reduce(
      (prev, current) => {
        return (prev.population || 0) > (current.population || 0)
          ? prev
          : current;
      },
      { disabilityCause: "", population: 0 },
    );

    return {
      wardNumber,
      totalDisabilityPopulation: wardTotalPopulation,
      mostCommonCause: mostCommonCause.disabilityCause,
      mostCommonCausePopulation: mostCommonCause.population || 0,
      mostCommonCausePercentage:
        wardTotalPopulation > 0
          ? (
              ((mostCommonCause.population || 0) / wardTotalPopulation) *
              100
            ).toFixed(2)
          : "0",
    };
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <DisabilityCauseSEO
        overallSummary={overallSummary}
        totalPopulationWithDisability={totalPopulationWithDisability}
        DISABILITY_CAUSE_NAMES={DISABILITY_CAUSE_NAMES}
        DISABILITY_CAUSE_NAMES_EN={DISABILITY_CAUSE_NAMES_EN}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/disability-causes.svg"
              width={1200}
              height={400}
              alt="अपाङ्गताका कारणहरू - गढवा गाउँपालिका (Disability Causes - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा अपाङ्गताका कारणहरू
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              अपाङ्गता भएका व्यक्तिहरूको जीवनस्तर सुधार तथा समाजमा पूर्ण
              समावेशीकरणका लागि अपाङ्गताका कारणहरूको अध्ययन र विश्लेषण
              महत्त्वपूर्ण छ। यस खण्डमा गढवा गाउँपालिकामा अपाङ्गताका प्रमुख
              कारणहरू र तिनको वडागत वितरणको विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              गढवा गाउँपालिकामा अपाङ्गताका कारणहरूको तथ्याङ्क हेर्दा, कुल
              अपाङ्गता भएका{" "}
              {localizeNumber(
                totalPopulationWithDisability.toLocaleString(),
                "ne",
              )}
              जनसंख्या मध्ये सबैभन्दा बढी{" "}
              {overallSummary[0]?.disabilityCauseName || ""}
              कारणले{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.population || 0) /
                    totalPopulationWithDisability) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % अपाङ्गता भएको देखिन्छ।
            </p>

            <h2 id="disability-causes" className="scroll-m-20 border-b pb-2">
              अपाङ्गताका कारणहरू
            </h2>
            <p>
              गढवा गाउँपालिकामा अपाङ्गताका प्रमुख कारणहरू र तिनको वितरण
              निम्नानुसार रहेको छ:
            </p>
          </div>

          {/* Client component for charts */}
          <DisabilityCauseCharts
            overallSummary={overallSummary}
            totalPopulationWithDisability={totalPopulationWithDisability}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            disabilityData={disabilityData}
            wardWiseAnalysis={wardWiseAnalysis}
            DISABILITY_CAUSE_NAMES={DISABILITY_CAUSE_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="disability-analysis" className="scroll-m-20 border-b pb-2">
              अपाङ्गता विश्लेषण
            </h2>
            <p>
              गढवा गाउँपालिकामा अपाङ्गताका कारणहरूको विश्लेषण गर्दा,
              {DISABILITY_CAUSE_NAMES[
                overallSummary[0]?.disabilityCause || ""
              ] || overallSummary[0]?.disabilityCause}
              कारणले हुने अपाङ्गता सबैभन्दा बढी
              {localizeNumber(
                (
                  ((overallSummary[0]?.population || 0) /
                    totalPopulationWithDisability) *
                  100
                ).toFixed(2),
                "ne",
              )}
              % रहेको पाइन्छ।
            </p>

            <DisabilityCauseAnalysisSection
              overallSummary={overallSummary}
              totalPopulationWithDisability={totalPopulationWithDisability}
              wardWiseAnalysis={wardWiseAnalysis}
              DISABILITY_CAUSE_NAMES={DISABILITY_CAUSE_NAMES}
              DISABILITY_CAUSE_NAMES_EN={DISABILITY_CAUSE_NAMES_EN}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
