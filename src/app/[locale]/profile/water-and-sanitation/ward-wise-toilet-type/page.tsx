import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import ToiletTypeCharts from "./_components/toilet-type-charts";
import ToiletTypeAnalysisSection from "./_components/toilet-type-analysis-section";
import ToiletTypeSEO from "./_components/toilet-type-seo";
import { toiletTypeOptions } from "@/server/api/routers/profile/water-and-sanitation/ward-wise-toilet-type.schema";

// Define colors for toilet types with meaningful color associations
const TOILET_TYPE_COLORS = {
  FLUSH_WITH_SEPTIC_TANK: "#27AE60", // Green for flush toilets (modern)
  NORMAL: "#F1C40F", // Yellow for regular toilets
  PUBLIC_EILANI: "#3498DB", // Blue for public toilets
  NO_TOILET: "#E74C3C", // Red for no toilets (concerning)
  OTHER: "#9B59B6", // Purple for other types
};

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period
export const revalidate = 86400; // Revalidate once per day

// Generate metadata dynamically based on data
export async function generateMetadata(): Promise<Metadata> {
  try {
    const toiletTypeData =
      await api.profile.waterAndSanitation.wardWiseToiletType.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalHouseholds = toiletTypeData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    // Group by toilet type and calculate totals
    const toiletTypeCounts: Record<string, number> = {};
    toiletTypeData.forEach((item) => {
      if (!toiletTypeCounts[item.toiletType])
        toiletTypeCounts[item.toiletType] = 0;
      toiletTypeCounts[item.toiletType] += item.households || 0;
    });

    // Find the most common toilet type
    let mostCommonType = "";
    let mostCommonCount = 0;
    Object.entries(toiletTypeCounts).forEach(([type, count]) => {
      if (count > mostCommonCount) {
        mostCommonCount = count;
        mostCommonType = type;
      }
    });

    // Get human-readable name for most common toilet type
    const mostCommonTypeName =
      toiletTypeOptions
        .find((option) => option.value === mostCommonType)
        ?.label.split(" (")[0] || mostCommonType;
    const mostCommonPercentage =
      totalHouseholds > 0
        ? ((mostCommonCount / totalHouseholds) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "गढवा गाउँपालिका शौचालय प्रकार",
      "वडागत शौचालय प्रकारहरू",
      "फ्लस शौचालय भएका घरधुरी",
      "सार्वजनिक शौचालय प्रयोग",
      "शौचालय नभएका घरधुरी",
      `गढवा शौचालय तथ्याङ्क ${localizeNumber(
        totalHouseholds.toString(),
        "ne",
      )}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality toilet types",
      "Ward-wise toilet facilities",
      "Flush toilet with septic tank households",
      "Public toilet usage",
      "Households without toilet",
      `Khajura toilet facilities data ${totalHouseholds}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकामा वडा अनुसार शौचालय प्रकारहरूको वितरण र विश्लेषण। कुल घरधुरी संख्या ${localizeNumber(
      totalHouseholds.toString(),
      "ne",
    )} मध्ये ${localizeNumber(mostCommonPercentage, "ne")}% (${localizeNumber(
      mostCommonCount.toString(),
      "ne",
    )}) मा ${mostCommonTypeName} प्रकारका शौचालय छन्। विभिन्न वडाहरूमा शौचालय प्रकारहरूको विस्तृत विश्लेषण।`;

    const descriptionEN = `Ward-wise distribution and analysis of toilet types in Khajura Rural Municipality. Out of a total of ${totalHouseholds} households, ${mostCommonPercentage}% (${mostCommonCount}) use ${mostCommonTypeName}. Detailed analysis of toilet types across various wards.`;

    return {
      title: `शौचालय प्रकारहरू | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/water-and-sanitation/ward-wise-toilet-type",
        languages: {
          en: "/en/profile/water-and-sanitation/ward-wise-toilet-type",
          ne: "/ne/profile/water-and-sanitation/ward-wise-toilet-type",
        },
      },
      openGraph: {
        title: `शौचालय प्रकारहरू | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `शौचालय प्रकारहरू | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "शौचालय प्रकारहरू | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार शौचालय प्रकारहरूको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "शौचालय प्रकारहरू", slug: "toilet-types" },
  {
    level: 2,
    text: "वडा अनुसार शौचालय प्रकारहरू",
    slug: "ward-wise-toilet-types",
  },
  {
    level: 2,
    text: "शौचालय प्रकारहरूको विश्लेषण",
    slug: "toilet-types-analysis",
  },
  {
    level: 2,
    text: "सुधारका लागि सिफारिसहरू",
    slug: "recommendations-for-improvement",
  },
];

export default async function WardWiseToiletTypePage() {
  // Fetch all toilet type data using tRPC
  const toiletTypeData =
    await api.profile.waterAndSanitation.wardWiseToiletType.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.waterAndSanitation.wardWiseToiletType.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Create a mapping of toilet types to their human-readable names
  const typeMap: Record<string, string> = {};
  toiletTypeOptions.forEach((option) => {
    typeMap[option.value] = option.label.split(" (")[0];
  });

  // Process data for overall summary
  const overallSummary = Object.entries(
    toiletTypeData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.toiletType]) acc[item.toiletType] = 0;
      acc[item.toiletType] += item.households || 0;
      return acc;
    }, {}),
  )
    .map(([toiletType, households]) => ({
      toiletType,
      toiletTypeName: typeMap[toiletType] || toiletType,
      households,
    }))
    .sort((a, b) => b.households - a.households); // Sort by households descending

  // Calculate total households for percentages
  const totalHouseholds = overallSummary.reduce(
    (sum, item) => sum + item.households,
    0,
  );

  // Create data for pie chart
  const pieChartData = overallSummary.map((item) => ({
    name: item.toiletTypeName,
    value: item.households,
    percentage: ((item.households / totalHouseholds) * 100).toFixed(2),
    color:
      TOILET_TYPE_COLORS[item.toiletType as keyof typeof TOILET_TYPE_COLORS] ||
      "#888888",
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(toiletTypeData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = toiletTypeData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = {
      ward: `वडा ${wardNumber}`,
      wardNumber,
    };

    // Add toilet types
    wardData.forEach((item) => {
      result[typeMap[item.toiletType] || item.toiletType] = item.households;
      // Also store under the type key for color mapping
      result[`${item.toiletType}_key`] = item.toiletType;
    });

    // Calculate total for this ward
    result.total = wardData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    return result;
  });

  // Calculate ward-wise sanitation rates and analysis
  const wardWiseAnalysis = wardNumbers.map((wardNumber) => {
    const wardData = toiletTypeData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const wardTotalHouseholds = wardData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    const mostCommonToilet = wardData.reduce(
      (prev, current) => {
        return (prev.households || 0) > (current.households || 0)
          ? prev
          : current;
      },
      { toiletType: "", households: 0 },
    );

    // Calculate percentage of households with proper sanitation (not using NO_TOILET)
    const sanitationHouseholds = wardData
      .filter((item) => item.toiletType !== "NO_TOILET")
      .reduce((sum, item) => sum + (item.households || 0), 0);

    const sanitationPercentage =
      wardTotalHouseholds > 0
        ? ((sanitationHouseholds / wardTotalHouseholds) * 100).toFixed(2)
        : "0";

    // Calculate percentage of households with modern toilets (FLUSH_WITH_SEPTIC_TANK)
    const modernToiletsData = wardData.find(
      (item) => item.toiletType === "FLUSH_WITH_SEPTIC_TANK",
    );
    const modernToiletsPercentage =
      wardTotalHouseholds > 0
        ? (
            ((modernToiletsData?.households || 0) / wardTotalHouseholds) *
            100
          ).toFixed(2)
        : "0";

    // Calculate percentage for each toilet type
    const typePercentages: Record<string, string> = {};
    wardData.forEach((item) => {
      typePercentages[item.toiletType] =
        wardTotalHouseholds > 0
          ? (((item.households || 0) / wardTotalHouseholds) * 100).toFixed(2)
          : "0";
    });

    return {
      wardNumber,
      totalHouseholds: wardTotalHouseholds,
      mostCommonType: mostCommonToilet.toiletType,
      mostCommonTypeName:
        typeMap[mostCommonToilet.toiletType] || mostCommonToilet.toiletType,
      mostCommonTypeHouseholds: mostCommonToilet.households || 0,
      mostCommonTypePercentage:
        wardTotalHouseholds > 0
          ? (
              ((mostCommonToilet.households || 0) / wardTotalHouseholds) *
              100
            ).toFixed(2)
          : "0",
      sanitationHouseholds,
      sanitationPercentage,
      modernToiletsPercentage,
      noToiletsPercentage: typePercentages["NO_TOILET"] || "0",
      typePercentages,
    };
  });

  // Find wards with highest and lowest sanitation rates
  const sortedBySanitationRate = [...wardWiseAnalysis].sort(
    (a, b) =>
      parseFloat(b.sanitationPercentage) - parseFloat(a.sanitationPercentage),
  );

  const highestSanitationWard = sortedBySanitationRate[0];
  const lowestSanitationWard =
    sortedBySanitationRate[sortedBySanitationRate.length - 1];

  // Calculate sanitation index based on toilet types
  // Weight factors: FLUSH_WITH_SEPTIC_TANK (1.0), NORMAL (0.8), PUBLIC_EILANI (0.6), OTHER (0.5), NO_TOILET (0.0)
  const sanitationWeight: Record<string, number> = {
    FLUSH_WITH_SEPTIC_TANK: 1.0,
    NORMAL: 0.8,
    PUBLIC_EILANI: 0.6,
    OTHER: 0.5,
    NO_TOILET: 0.0,
  };

  let sanitationIndex = 0;
  let sanitationIndexMax = 100; // Maximum possible index (if all households use flush toilets)

  overallSummary.forEach((item) => {
    sanitationIndex +=
      (item.households / totalHouseholds) *
      (sanitationWeight[item.toiletType as keyof typeof sanitationWeight] ||
        0.5) *
      100;
  });

  // Generate sanitation rating based on index
  const sanitationRating =
    sanitationIndex >= 80
      ? "उत्तम (Excellent)"
      : sanitationIndex >= 65
        ? "राम्रो (Good)"
        : sanitationIndex >= 50
          ? "मध्यम (Average)"
          : "निम्न (Poor)";

  // Find percentage of households without toilets
  const noToiletData = overallSummary.find(
    (item) => item.toiletType === "NO_TOILET",
  );
  const noToiletPercentage =
    totalHouseholds > 0
      ? (((noToiletData?.households || 0) / totalHouseholds) * 100).toFixed(2)
      : "0";

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <ToiletTypeSEO
        overallSummary={overallSummary}
        totalHouseholds={totalHouseholds}
        typeMap={typeMap}
        wardNumbers={wardNumbers}
        sanitationIndex={sanitationIndex}
        highestSanitationWard={highestSanitationWard}
        lowestSanitationWard={lowestSanitationWard}
        noToiletPercentage={noToiletPercentage}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/toilet-types.svg"
              width={1200}
              height={400}
              alt="शौचालय प्रकारहरू - गढवा गाउँपालिका (Toilet Types - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा शौचालय प्रकारहरूको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              शौचालय सुविधा स्वस्थ जीवनयापन र वातावरणीय सरसफाइको एक महत्वपूर्ण
              पक्ष हो। यसले जनस्वास्थ्यलाई सुधार गर्न र विभिन्न रोगहरूबाट बच्न
              मद्दत गर्दछ। यस खण्डमा गढवा गाउँपालिकाका विभिन्न वडाहरूमा
              प्रयोग गरिने शौचालय प्रकारहरूको वितरण र विश्लेषण प्रस्तुत गरिएको
              छ।
            </p>
            <p>
              गढवा गाउँपालिकामा कुल{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी
              मध्ये
              {overallSummary[0] &&
                ` सबैभन्दा धेरै ${overallSummary[0]?.toiletTypeName} प्रकारको शौचालय 
              ${localizeNumber(
                (
                  ((overallSummary[0]?.households || 0) / totalHouseholds) *
                  100
                ).toFixed(1),
                "ne",
              )}% घरधुरीमा`}{" "}
              रहेको छ। यस अध्ययनले शौचालय सुविधाहरूको अवस्था र सुधारका
              क्षेत्रहरू पहिचान गर्न मद्दत गर्नेछ।
            </p>

            <h2 id="toilet-types" className="scroll-m-20 border-b pb-2">
              शौचालय प्रकारहरू
            </h2>
            <p>
              गढवा गाउँपालिकामा शौचालयका प्रमुख प्रकारहरू र तिनको वितरण
              निम्नानुसार रहेको छ:
            </p>
          </div>

          {/* Client component for charts */}
          <ToiletTypeCharts
            overallSummary={overallSummary}
            totalHouseholds={totalHouseholds}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            toiletTypeData={toiletTypeData}
            wardWiseAnalysis={wardWiseAnalysis}
            typeMap={typeMap}
            TOILET_TYPE_COLORS={TOILET_TYPE_COLORS}
            highestSanitationWard={highestSanitationWard}
            lowestSanitationWard={lowestSanitationWard}
            sanitationIndex={sanitationIndex}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="toilet-types-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              शौचालय प्रकारहरूको विश्लेषण
            </h2>
            <p>
              गढवा गाउँपालिकामा शौचालय प्रकारहरूको विश्लेषण गर्दा,
              {overallSummary[0]?.toiletTypeName || ""} प्रकारको शौचालय सबैभन्दा
              बढी
              {overallSummary[0]
                ? ` ${localizeNumber(
                    (
                      ((overallSummary[0]?.households || 0) / totalHouseholds) *
                      100
                    ).toFixed(2),
                    "ne",
                  )}% `
                : " "}
              घरधुरीमा प्रयोग भएको पाइन्छ। शौचालय नभएका घरधुरीहरुको संख्या
              {(() => {
                const noToiletData = overallSummary.find(
                  (item) => item.toiletType === "NO_TOILET",
                );
                return noToiletData
                  ? ` ${localizeNumber(
                      (
                        ((noToiletData.households || 0) / totalHouseholds) *
                        100
                      ).toFixed(2),
                      "ne",
                    )}% `
                  : " ";
              })()}
              रहेको छ।
            </p>

            <ToiletTypeAnalysisSection
              overallSummary={overallSummary}
              totalHouseholds={totalHouseholds}
              wardWiseAnalysis={wardWiseAnalysis}
              typeMap={typeMap}
              highestSanitationWard={highestSanitationWard}
              lowestSanitationWard={lowestSanitationWard}
              sanitationIndex={sanitationIndex}
              sanitationRating={sanitationRating}
              TOILET_TYPE_COLORS={TOILET_TYPE_COLORS}
              noToiletPercentage={noToiletPercentage}
            />

            <h2
              id="recommendations-for-improvement"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              सुधारका लागि सिफारिसहरू
            </h2>

            <p>
              गढवा गाउँपालिकामा शौचालय सुविधाहरू सुधार गर्न निम्न सिफारिसहरू
              प्रस्तुत गरिएका छन्:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>शौचालय निर्माण अभियान:</strong> विशेषगरी
                  {lowestSanitationWard
                    ? ` वडा नं. ${localizeNumber(
                        lowestSanitationWard.wardNumber.toString(),
                        "ne",
                      )} `
                    : " सबैभन्दा कम शौचालय भएका वडाहरू "}
                  मा शौचालय निर्माणलाई प्राथमिकता दिने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>सेप्टिक ट्यांक सहितका फ्लस शौचालय प्रवर्द्धन:</strong>{" "}
                  साधारण शौचालय भएका घरहरूलाई सेप्टिक ट्यांक सहितका फ्लस
                  शौचालयमा स्तरोन्नति गर्न प्रोत्साहन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>सामग्री सहयोग कार्यक्रम:</strong> आर्थिक रूपमा कमजोर
                  परिवारहरूलाई शौचालय निर्माणका लागि आवश्यक सामग्री सहयोग गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>जनचेतना कार्यक्रम:</strong> शौचालय प्रयोगको महत्त्व र
                  स्वच्छता सम्बन्धी जनचेतना कार्यक्रम सञ्चालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>सार्वजनिक शौचालय निर्माण:</strong> सार्वजनिक स्थलहरूमा
                  सुविधायुक्त र अपांगमैत्री शौचालयहरू निर्माण गर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यी सिफारिसहरू कार्यान्वयन गरेर, गढवा गाउँपालिकामा शौचालय
              सुविधाहरूको अवस्थामा उल्लेखनीय सुधार ल्याउन सकिन्छ, जसले
              जनस्वास्थ्य सुधार र रोगहरू न्यूनीकरणमा महत्त्वपूर्ण योगदान
              पुर्याउनेछ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
