import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import EconomicallyActivePopulationCharts from "./_components/economically-active-population-charts";
import EconomicallyActivePopulationAnalysisSection from "./_components/economically-active-population-analysis-section";
import EconomicallyActivePopulationSEO from "./_components/economically-active-population-seo";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define Nepali names for age groups
const AGE_GROUP_NAMES: Record<string, string> = {
  AGE_0_TO_14: "०-१४ वर्षका व्यक्तिहरू",
  AGE_15_TO_59: "१५-५९ वर्षका व्यक्तिहरू",
  AGE_60_PLUS: "६० वर्ष र माथिका व्यक्तिहरू",
};

// Define English names for age groups (for SEO)
const AGE_GROUP_NAMES_EN: Record<string, string> = {
  AGE_0_TO_14: "0-14 Years Old Persons",
  AGE_15_TO_59: "15-59 Years Old Persons",
  AGE_60_PLUS: "60+ Years Old Persons",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const populationData =
      await api.profile.demographics.wardAgeWiseEconomicallyActivePopulation.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = populationData.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    // Group by age group and calculate totals
    const ageGroupCounts: Record<string, number> = {};
    populationData.forEach((item) => {
      if (!ageGroupCounts[item.ageGroup]) ageGroupCounts[item.ageGroup] = 0;
      ageGroupCounts[item.ageGroup] += item.population || 0;
    });

    // Calculate economically active population (15-59 age group)
    const economicallyActivePopulation = ageGroupCounts["AGE_15_TO_59"] || 0;
    const economicallyActivePercentage =
      totalPopulation > 0
        ? ((economicallyActivePopulation / totalPopulation) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका आर्थिक रूपमा सक्रिय जनसंख्या",
      "बुद्धशान्ति उमेर अनुसार जनसंख्या वितरण",
      "वडा अनुसार आर्थिक रूपमा सक्रिय जनसंख्या",
      "आर्थिक सक्रिय उमेर समूह विवरण",
      "१५-५९ वर्षका आर्थिक सक्रिय जनसंख्या",
      "वृद्ध जनसंख्या बुद्धशान्ति",
      "बाल जनसंख्या बुद्धशान्ति",
      `बुद्धशान्ति कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality economically active population",
      "Khajura age-wise population distribution",
      "Ward-wise economically active population",
      "Economically active age groups details",
      "15-59 years old economically active population",
      "Elderly population in Khajura",
      "Child population in Khajura",
      `Khajura total population ${totalPopulation}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `बुद्धशान्ति गाउँपालिकाको वडा अनुसार उमेर समूहको आर्थिक रूपमा सक्रिय जनसंख्याको वितरण र विश्लेषण। कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")} मध्ये ${localizeNumber(economicallyActivePercentage, "ne")}% (${localizeNumber(economicallyActivePopulation.toString(), "ne")}) आर्थिक रूपमा सक्रिय उमेर समूह (१५-५९ वर्ष) मा पर्दछन्। विभिन्न वडाहरूमा आर्थिक सक्रियता र कार्य उमेरको जनसंख्याको विस्तृत विश्लेषण।`;

    const descriptionEN = `Ward-wise distribution and analysis of economically active population by age groups in Khajura Rural Municipality. Out of a total population of ${totalPopulation}, ${economicallyActivePercentage}% (${economicallyActivePopulation}) are in the economically active age group (15-59 years). Detailed analysis of economic activity and working-age population across various wards.`;

    return {
      title: `आर्थिक रूपमा सक्रिय जनसंख्या | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical:
          "/profile/demographics/ward-age-wise-economically-active-population",
        languages: {
          en: "/en/profile/demographics/ward-age-wise-economically-active-population",
          ne: "/ne/profile/demographics/ward-age-wise-economically-active-population",
        },
      },
      openGraph: {
        title: `आर्थिक रूपमा सक्रिय जनसंख्या | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `आर्थिक रूपमा सक्रिय जनसंख्या | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "आर्थिक रूपमा सक्रिय जनसंख्या | बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "वडा अनुसार उमेर समूहको आर्थिक रूपमा सक्रिय जनसंख्याको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "उमेर अनुसार आर्थिक सक्रियता",
    slug: "age-wise-economic-activity",
  },
  {
    level: 2,
    text: "वडा अनुसार आर्थिक सक्रियता",
    slug: "ward-wise-economic-activity",
  },
  {
    level: 2,
    text: "आर्थिक सक्रिय जनसंख्या विश्लेषण",
    slug: "active-population-analysis",
  },
];

export default async function WardAgeWiseEconomicallyActivePopulationPage() {
  // Fetch all economically active population data using tRPC
  const populationData =
    await api.profile.demographics.wardAgeWiseEconomicallyActivePopulation.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.demographics.wardAgeWiseEconomicallyActivePopulation.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    populationData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.ageGroup]) acc[item.ageGroup] = 0;
      acc[item.ageGroup] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([ageGroup, population]) => ({
      ageGroup,
      ageGroupName:
        AGE_GROUP_NAMES[ageGroup as keyof typeof AGE_GROUP_NAMES] || ageGroup,
      population,
    }))
    .sort((a, b) => {
      // Custom sort to ensure age groups are in chronological order
      const order = { AGE_0_TO_14: 1, AGE_15_TO_59: 2, AGE_60_PLUS: 3 };
      return (
        order[a.ageGroup as keyof typeof order] -
        order[b.ageGroup as keyof typeof order]
      );
    });

  // Calculate total population for percentages
  const totalPopulation = overallSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Create data for pie chart
  const pieChartData = overallSummary.map((item) => ({
    name: item.ageGroupName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(populationData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = populationData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add age groups
    wardData.forEach((item) => {
      result[
        AGE_GROUP_NAMES[item.ageGroup as keyof typeof AGE_GROUP_NAMES] ||
          item.ageGroup
      ] = item.population;
    });

    return result;
  });

  // Calculate dependency ratios for each ward
  const dependencyRatios = wardNumbers.map((wardNumber) => {
    const wardData = populationData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const dependentPopulation = wardData.reduce((sum, item) => {
      if (item.ageGroup === "AGE_0_TO_14" || item.ageGroup === "AGE_60_PLUS") {
        return sum + item.population;
      }
      return sum;
    }, 0);

    const workingAgePopulation =
      wardData.find((item) => item.ageGroup === "AGE_15_TO_59")?.population ||
      0;

    const ratio =
      workingAgePopulation > 0
        ? (dependentPopulation / workingAgePopulation) * 100
        : 0;

    return {
      wardNumber,
      dependentPopulation,
      workingAgePopulation,
      ratio: parseFloat(ratio.toFixed(2)),
    };
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <EconomicallyActivePopulationSEO
        overallSummary={overallSummary}
        totalPopulation={totalPopulation}
        AGE_GROUP_NAMES={AGE_GROUP_NAMES}
        AGE_GROUP_NAMES_EN={AGE_GROUP_NAMES_EN}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/economically-active-population.svg"
              width={1200}
              height={400}
              alt="आर्थिक रूपमा सक्रिय जनसंख्या - बुद्धशान्ति गाउँपालिका (Economically Active Population - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा आर्थिक रूपमा सक्रिय जनसंख्या
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              आर्थिक रूपमा सक्रिय जनसंख्याले कुनै पनि समुदायको उत्पादकता, आर्थिक
              विकास र सामाजिक संरचनामा महत्वपूर्ण भूमिका खेल्छ। यस खण्डमा
              बुद्धशान्ति गाउँपालिकामा विभिन्न उमेर समूहका आर्थिक रूपमा सक्रिय
              जनसंख्याको वडागत वितरण र विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              बुद्धशान्ति गाउँपालिकामा उमेर समूह अनुसार आर्थिक सक्रिय जनसंख्याको
              तथ्याङ्क हेर्दा, कुल जनसंख्या{" "}
              {localizeNumber(totalPopulation.toLocaleString(), "ne")}
              मध्ये{" "}
              {overallSummary.find((item) => item.ageGroup === "AGE_15_TO_59")
                ?.ageGroupName || ""}
              {localizeNumber(
                (
                  ((overallSummary.find(
                    (item) => item.ageGroup === "AGE_15_TO_59",
                  )?.population || 0) /
                    totalPopulation) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % रहेको देखिन्छ। यस समूहलाई आर्थिक रूपमा सक्रिय जनसंख्याको रूपमा
              हेरिएको छ।
            </p>

            <h2
              id="age-wise-economic-activity"
              className="scroll-m-20 border-b pb-2"
            >
              उमेर अनुसार आर्थिक सक्रियता
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा उमेर समूह अनुसार जनसंख्याको वितरण
              निम्नानुसार रहेको छ:
            </p>
          </div>

          {/* Client component for charts */}
          <EconomicallyActivePopulationCharts
            overallSummary={overallSummary}
            totalPopulation={totalPopulation}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            populationData={populationData}
            dependencyRatios={dependencyRatios}
            AGE_GROUP_NAMES={AGE_GROUP_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="active-population-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              आर्थिक सक्रिय जनसंख्या विश्लेषण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा आर्थिक रूपमा सक्रिय जनसंख्या (१५-५९ वर्ष)
              समग्र जनसंख्याको
              {localizeNumber(
                (
                  ((overallSummary.find(
                    (item) => item.ageGroup === "AGE_15_TO_59",
                  )?.population || 0) /
                    totalPopulation) *
                  100
                ).toFixed(2),
                "ne",
              )}
              % रहेको छ। यी व्यक्तिहरू आर्थिक गतिविधिमा संलग्न हुन सक्ने उमेर
              समूहमा पर्दछन्।
            </p>

            {/* Client component for population analysis section */}
            <EconomicallyActivePopulationAnalysisSection
              overallSummary={overallSummary}
              totalPopulation={totalPopulation}
              dependencyRatios={dependencyRatios}
              AGE_GROUP_NAMES={AGE_GROUP_NAMES}
              AGE_GROUP_NAMES_EN={AGE_GROUP_NAMES_EN}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
