import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WaterPurificationCharts from "./_components/water-purification-charts";
import WaterPurificationAnalysisSection from "./_components/water-purification-analysis-section";
import WaterPurificationSEO from "./_components/water-purification-seo";
import { waterPurificationOptions } from "@/server/api/routers/profile/water-and-sanitation/ward-wise-water-purification.schema";

// Define colors for water purification types with meaningful color associations
const WATER_PURIFICATION_COLORS = {
  BOILING: "#E74C3C", // Red for boiling (heat)
  FILTERING: "#3498DB", // Blue for filtering (water)
  CHEMICAL_PIYUSH: "#9B59B6", // Purple for chemical treatment
  NO_ANY_FILTERING: "#95A5A6", // Gray for no treatment
  OTHER: "#F39C12", // Orange for other methods
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
    const waterPurificationData =
      await api.profile.waterAndSanitation.wardWiseWaterPurification.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalHouseholds = waterPurificationData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    // Group by purification type and calculate totals
    const purificationTypeCounts: Record<string, number> = {};
    waterPurificationData.forEach((item) => {
      if (!purificationTypeCounts[item.waterPurification])
        purificationTypeCounts[item.waterPurification] = 0;
      purificationTypeCounts[item.waterPurification] += item.households || 0;
    });

    // Find the most common purification type
    let mostCommonType = "";
    let mostCommonCount = 0;
    Object.entries(purificationTypeCounts).forEach(([type, count]) => {
      if (count > mostCommonCount) {
        mostCommonCount = count;
        mostCommonType = type;
      }
    });

    // Get human-readable name for most common purification type
    const mostCommonTypeName =
      waterPurificationOptions
        .find((option) => option.value === mostCommonType)
        ?.label.split(" (")[0] || mostCommonType;
    const mostCommonPercentage =
      totalHouseholds > 0
        ? ((mostCommonCount / totalHouseholds) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "गढवा गाउँपालिका पानी शुद्धिकरण",
      "वडागत पानी शुद्धिकरण अभ्यास",
      "पानी उमाल्ने परिवार संख्या",
      "पानी फिल्टर प्रयोग दर",
      "पियूष प्रयोग गर्ने घरधुरी",
      `गढवा पानी शुद्धिकरण तथ्याङ्क ${localizeNumber(totalHouseholds.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality water purification",
      "Ward-wise water purification practices",
      "Water boiling households count",
      "Water filter usage rate",
      "Chemical treatment (Piyush) usage",
      `Khajura water purification data ${totalHouseholds}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकामा वडा अनुसार पानी शुद्धिकरण विधिहरूको वितरण र विश्लेषण। कुल घरधुरी संख्या ${localizeNumber(totalHouseholds.toString(), "ne")} मध्ये ${localizeNumber(mostCommonPercentage, "ne")}% (${localizeNumber(mostCommonCount.toString(), "ne")}) ले ${mostCommonTypeName} विधि प्रयोग गर्दछन्। विभिन्न वडाहरूमा पानी शुद्धिकरण विधिहरूको विस्तृत विश्लेषण।`;

    const descriptionEN = `Ward-wise distribution and analysis of water purification methods in Khajura Rural Municipality. Out of a total of ${totalHouseholds} households, ${mostCommonPercentage}% (${mostCommonCount}) use ${mostCommonTypeName} method. Detailed analysis of water purification methods across various wards.`;

    return {
      title: `पानी शुद्धिकरण विधिहरू | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/water-and-sanitation/ward-wise-water-purification",
        languages: {
          en: "/en/profile/water-and-sanitation/ward-wise-water-purification",
          ne: "/ne/profile/water-and-sanitation/ward-wise-water-purification",
        },
      },
      openGraph: {
        title: `पानी शुद्धिकरण विधिहरू | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `पानी शुद्धिकरण विधिहरू | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "पानी शुद्धिकरण विधिहरू | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार पानी शुद्धिकरण विधिहरूको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "पानी शुद्धिकरण विधिहरू",
    slug: "water-purification-methods",
  },
  {
    level: 2,
    text: "वडा अनुसार पानी शुद्धिकरण अभ्यास",
    slug: "ward-wise-water-purification",
  },
  {
    level: 2,
    text: "पानी शुद्धिकरण विश्लेषण",
    slug: "water-purification-analysis",
  },
  {
    level: 2,
    text: "सुधारका लागि सिफारिसहरू",
    slug: "recommendations-for-improvement",
  },
];

export default async function WardWiseWaterPurificationPage() {
  // Fetch all water purification data using tRPC
  const waterPurificationData =
    await api.profile.waterAndSanitation.wardWiseWaterPurification.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.waterAndSanitation.wardWiseWaterPurification.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Create a mapping of purification types to their human-readable names
  const methodMap: Record<string, string> = {};
  waterPurificationOptions.forEach((option) => {
    methodMap[option.value] = option.label.split(" (")[0];
  });

  // Process data for overall summary
  const overallSummary = Object.entries(
    waterPurificationData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.waterPurification]) acc[item.waterPurification] = 0;
      acc[item.waterPurification] += item.households || 0;
      return acc;
    }, {}),
  )
    .map(([waterPurification, households]) => ({
      waterPurification,
      waterPurificationName: methodMap[waterPurification] || waterPurification,
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
    name: item.waterPurificationName,
    value: item.households,
    percentage: ((item.households / totalHouseholds) * 100).toFixed(2),
    color:
      WATER_PURIFICATION_COLORS[
        item.waterPurification as keyof typeof WATER_PURIFICATION_COLORS
      ] || "#888888",
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(waterPurificationData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = waterPurificationData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = {
      ward: `वडा ${wardNumber}`,
      wardNumber,
    };

    // Add purification types
    wardData.forEach((item) => {
      result[methodMap[item.waterPurification] || item.waterPurification] =
        item.households;
      // Also store under the method key for color mapping
      result[`${item.waterPurification}_key`] = item.waterPurification;
    });

    // Calculate total for this ward
    result.total = wardData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    return result;
  });

  // Calculate ward-wise purification rates and analysis
  const wardWiseAnalysis = wardNumbers.map((wardNumber) => {
    const wardData = waterPurificationData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const wardTotalHouseholds = wardData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    const mostCommonMethod = wardData.reduce(
      (prev, current) => {
        return (prev.households || 0) > (current.households || 0)
          ? prev
          : current;
      },
      { waterPurification: "", households: 0 },
    );

    // Calculate percentage of households treating water (not using NO_ANY_FILTERING)
    const treatingHouseholds = wardData
      .filter((item) => item.waterPurification !== "NO_ANY_FILTERING")
      .reduce((sum, item) => sum + (item.households || 0), 0);

    const treatingPercentage =
      wardTotalHouseholds > 0
        ? ((treatingHouseholds / wardTotalHouseholds) * 100).toFixed(2)
        : "0";

    // Calculate percentage for each purification method
    const methodPercentages: Record<string, string> = {};
    wardData.forEach((item) => {
      methodPercentages[item.waterPurification] =
        wardTotalHouseholds > 0
          ? (((item.households || 0) / wardTotalHouseholds) * 100).toFixed(2)
          : "0";
    });

    return {
      wardNumber,
      totalHouseholds: wardTotalHouseholds,
      mostCommonMethod: mostCommonMethod.waterPurification,
      mostCommonMethodName:
        methodMap[mostCommonMethod.waterPurification] ||
        mostCommonMethod.waterPurification,
      mostCommonMethodHouseholds: mostCommonMethod.households || 0,
      mostCommonMethodPercentage:
        wardTotalHouseholds > 0
          ? (
              ((mostCommonMethod.households || 0) / wardTotalHouseholds) *
              100
            ).toFixed(2)
          : "0",
      treatingHouseholds,
      treatingPercentage,
      methodPercentages,
    };
  });

  // Find wards with highest and lowest treatment rates
  const sortedByTreatmentRate = [...wardWiseAnalysis].sort(
    (a, b) =>
      parseFloat(b.treatingPercentage) - parseFloat(a.treatingPercentage),
  );

  const highestTreatmentWard = sortedByTreatmentRate[0];
  const lowestTreatmentWard =
    sortedByTreatmentRate[sortedByTreatmentRate.length - 1];

  // Calculate safety index based on purification methods
  // Weight factors: FILTERING (0.9), BOILING (0.85), CHEMICAL_PIYUSH (0.8), OTHER (0.5), NO_ANY_FILTERING (0.1)
  const safetyWeight: Record<string, number> = {
    FILTERING: 0.9,
    BOILING: 0.85,
    CHEMICAL_PIYUSH: 0.8,
    OTHER: 0.5,
    NO_ANY_FILTERING: 0.1,
  };

  let safetyIndex = 0;
  let safetyIndexMax = 90; // Maximum possible index (if all households use filtering)

  overallSummary.forEach((item) => {
    safetyIndex +=
      (item.households / totalHouseholds) *
      (safetyWeight[item.waterPurification as keyof typeof safetyWeight] ||
        0.5) *
      100;
  });

  // Generate water safety rating based on index
  const waterSafetyRating =
    safetyIndex >= 75
      ? "उत्तम (Excellent)"
      : safetyIndex >= 60
        ? "राम्रो (Good)"
        : safetyIndex >= 40
          ? "मध्यम (Average)"
          : "निम्न (Poor)";

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WaterPurificationSEO
        overallSummary={overallSummary}
        totalHouseholds={totalHouseholds}
        methodMap={methodMap}
        wardNumbers={wardNumbers}
        safetyIndex={safetyIndex}
        highestTreatmentWard={highestTreatmentWard}
        lowestTreatmentWard={lowestTreatmentWard}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/water-purification.svg"
              width={1200}
              height={400}
              alt="पानी शुद्धिकरण विधिहरू - गढवा गाउँपालिका (Water Purification Methods - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा पानी शुद्धिकरणको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              पानी शुद्धिकरण स्वस्थ जीवनयापनको एक महत्वपूर्ण पक्ष हो। यसले
              जलजन्य रोगहरूबाट बच्न र समग्र जनस्वास्थ्य सुधार गर्न मद्दत गर्छ।
              यस खण्डमा गढवा गाउँपालिकाका विभिन्न वडाहरूमा प्रयोग गरिने पानी
              शुद्धिकरण विधिहरूको वितरण र विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              गढवा गाउँपालिकामा कुल{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी
              मध्ये
              {overallSummary[0] &&
                ` सबैभन्दा धेरै ${overallSummary[0]?.waterPurificationName} विधि 
              ${localizeNumber((((overallSummary[0]?.households || 0) / totalHouseholds) * 100).toFixed(1), "ne")}% घरधुरीले`}
              प्रयोग गर्दछन्। यस अध्ययनले पानी शुद्धिकरणको अभ्यासहरू र सुधारका
              क्षेत्रहरू पहिचान गर्न मद्दत गर्नेछ।
            </p>

            <h2
              id="water-purification-methods"
              className="scroll-m-20 border-b pb-2"
            >
              पानी शुद्धिकरण विधिहरू
            </h2>
            <p>
              गढवा गाउँपालिकामा पानी शुद्धिकरणका प्रमुख विधिहरू र तिनको
              प्रयोग निम्नानुसार रहेको छ:
            </p>
          </div>

          {/* Client component for charts */}
          <WaterPurificationCharts
            overallSummary={overallSummary}
            totalHouseholds={totalHouseholds}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            waterPurificationData={waterPurificationData}
            wardWiseAnalysis={wardWiseAnalysis}
            methodMap={methodMap}
            WATER_PURIFICATION_COLORS={WATER_PURIFICATION_COLORS}
            highestTreatmentWard={highestTreatmentWard}
            lowestTreatmentWard={lowestTreatmentWard}
            safetyIndex={safetyIndex}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="water-purification-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              पानी शुद्धिकरण विश्लेषण
            </h2>
            <p>
              गढवा गाउँपालिकामा पानी शुद्धिकरण विधिहरूको विश्लेषण गर्दा,
              {overallSummary[0]?.waterPurificationName || ""} विधि सबैभन्दा बढी
              {overallSummary[0]
                ? ` ${localizeNumber((((overallSummary[0]?.households || 0) / totalHouseholds) * 100).toFixed(2), "ne")}% `
                : " "}
              घरधुरीमा प्रयोग भएको पाइन्छ। पानी शुद्धिकरण नगर्ने घरधुरीहरुको
              संख्या
              {(() => {
                const noFilteringData = overallSummary.find(
                  (item) => item.waterPurification === "NO_ANY_FILTERING",
                );
                return noFilteringData
                  ? ` ${localizeNumber((((noFilteringData.households || 0) / totalHouseholds) * 100).toFixed(2), "ne")}% `
                  : " ";
              })()}
              रहेको छ।
            </p>

            <WaterPurificationAnalysisSection
              overallSummary={overallSummary}
              totalHouseholds={totalHouseholds}
              wardWiseAnalysis={wardWiseAnalysis}
              methodMap={methodMap}
              highestTreatmentWard={highestTreatmentWard}
              lowestTreatmentWard={lowestTreatmentWard}
              safetyIndex={safetyIndex}
              waterSafetyRating={waterSafetyRating}
              WATER_PURIFICATION_COLORS={WATER_PURIFICATION_COLORS}
            />

            <h2
              id="recommendations-for-improvement"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              सुधारका लागि सिफारिसहरू
            </h2>

            <p>
              गढवा गाउँपालिकामा पानी शुद्धिकरण अभ्यासहरू सुधार गर्न निम्न
              सिफारिसहरू प्रस्तुत गरिएका छन्:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>पानी शुद्धिकरण जागरण अभियान:</strong> विशेषगरी
                  {lowestTreatmentWard
                    ? ` वडा नं. ${localizeNumber(lowestTreatmentWard.wardNumber.toString(), "ne")} `
                    : " सबैभन्दा कम शुद्धिकरण दर भएका वडाहरू "}
                  मा पानी शुद्धिकरणको महत्त्वबारे जनचेतना कार्यक्रम सञ्चालन
                  गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>खानेपानी परीक्षण सेवा:</strong> घरधुरी स्तरमा पानीको
                  गुणस्तर परीक्षण सेवा उपलब्ध गराई प्रदूषित स्रोतहरू पहिचान
                  गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>फिल्टर वितरण कार्यक्रम:</strong> आर्थिक रूपमा कमजोर
                  परिवारहरूलाई सस्तो र दिगो पानी फिल्टरहरू वितरण गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>पियूष वितरण र प्रशिक्षण:</strong> पियूष जस्ता रासायनिक
                  शुद्धिकरण विधिहरू प्रयोग गर्ने तरिकाबारे प्रशिक्षण र आवश्यक
                  सामग्री वितरण गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>समुदायमा आधारित अनुगमन प्रणाली:</strong> प्रत्येक
                  वडामा पानी शुद्धिकरण अभ्यासहरूको अनुगमन र प्रोत्साहन गर्न
                  समुदायमा आधारित प्रणाली स्थापना गर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यी सिफारिसहरू कार्यान्वयन गरेर, गढवा गाउँपालिकामा पानी
              शुद्धिकरणको अवस्थामा उल्लेखनीय सुधार ल्याउन सकिन्छ, जसले
              जनस्वास्थ्य सुधार र जलजन्य रोगहरू न्यूनीकरणमा महत्त्वपूर्ण योगदान
              पुर्याउनेछ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
