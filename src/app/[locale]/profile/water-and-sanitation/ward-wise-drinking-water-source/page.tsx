import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseDrinkingWaterSourceCharts from "./_components/ward-wise-drinking-water-source-charts";
import WardWiseDrinkingWaterSourceAnalysisSection from "./_components/ward-wise-drinking-water-source-analysis-section";
import WardWiseDrinkingWaterSourceSEO from "./_components/ward-wise-drinking-water-source-seo";
import { drinkingWaterSourceOptions } from "@/server/api/routers/profile/water-and-sanitation/ward-wise-drinking-water-source.schema";

const WATER_SOURCE_GROUPS = {
  PIPED_WATER: {
    name: "पाइपको पानी",
    nameEn: "Piped Water",
    color: "#4285F4", // Blue
    sources: ["TAP_INSIDE_HOUSE", "TAP_OUTSIDE_HOUSE"],
  },
  WELL_WATER: {
    name: "इनारको पानी",
    nameEn: "Well Water",
    color: "#34A853", // Green
    sources: ["TUBEWELL", "COVERED_WELL", "OPEN_WELL"],
  },
  NATURAL_SOURCE: {
    name: "प्राकृतिक स्रोत",
    nameEn: "Natural Source",
    color: "#FBBC05", // Yellow
    sources: ["AQUIFIER_MOOL", "RIVER"],
  },
  OTHER_SOURCE: {
    name: "अन्य स्रोत",
    nameEn: "Other Sources",
    color: "#EA4335", // Red
    sources: ["JAR", "OTHER"],
  },
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
    const wardWiseDrinkingWaterSourceData =
      await api.profile.waterAndSanitation.wardWiseDrinkingWaterSource.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Group by ward number
    const wardGroups = wardWiseDrinkingWaterSourceData.reduce(
      (acc: any, curr: any) => {
        acc[curr.wardNumber] = acc[curr.wardNumber] || [];
        acc[curr.wardNumber].push(curr);
        return acc;
      },
      {},
    );

    // Calculate ward totals and grand total
    let totalHouseholds = 0;
    let pipedWaterHouseholds = 0;

    Object.values(wardGroups).forEach((wardData: any) => {
      wardData.forEach((item: any) => {
        totalHouseholds += item.households;
        if (
          WATER_SOURCE_GROUPS.PIPED_WATER.sources.includes(
            item.drinkingWaterSource,
          )
        ) {
          pipedWaterHouseholds += item.households;
        }
      });
    });

    // Calculate percentages for SEO description
    const pipedWaterPercentage = (
      (pipedWaterHouseholds / totalHouseholds) *
      100
    ).toFixed(2);

    // Create rich keywords
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका खानेपानी स्रोत",
      "वडागत खानेपानी स्रोत",
      "पाइपको पानी प्रयोग",
      `पाइपको पानी प्रयोग गर्ने ${pipedWaterPercentage}%`,
      "खानेपानी स्रोत विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality drinking water sources",
      "Ward-wise drinking water sources",
      "Piped water usage",
      `Piped water usage ${pipedWaterPercentage}%`,
      "Drinking water source analysis",
    ];

    // Create description
    const descriptionNP = `बुद्धशान्ति गाउँपालिकामा खानेपानीका स्रोतहरूको वडागत विश्लेषण। कुल ${localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी मध्ये ${localizeNumber(pipedWaterPercentage, "ne")}% (${localizeNumber(pipedWaterHouseholds.toLocaleString(), "ne")}) घरधुरीले पाइपको पानी प्रयोग गर्दछन्।`;

    const descriptionEN = `Ward-wise analysis of drinking water sources in Khajura Rural Municipality. Out of a total of ${totalHouseholds.toLocaleString()} households, ${pipedWaterPercentage}% (${pipedWaterHouseholds.toLocaleString()}) households use piped water.`;

    return {
      title: `खानेपानीका स्रोतहरू | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical:
          "/profile/water-and-sanitation/ward-wise-drinking-water-source",
        languages: {
          en: "/en/profile/water-and-sanitation/ward-wise-drinking-water-source",
          ne: "/ne/profile/water-and-sanitation/ward-wise-drinking-water-source",
        },
      },
      openGraph: {
        title: `खानेपानीका स्रोतहरूको अवस्था | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `खानेपानीका स्रोतहरूको अवस्था | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "खानेपानीका स्रोतहरू | बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार खानेपानीका स्रोतहरूको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "खानेपानीका स्रोतहरूको वितरण",
    slug: "distribution-of-drinking-water-sources",
  },
  {
    level: 2,
    text: "वडा अनुसार खानेपानीका स्रोतहरू",
    slug: "ward-wise-drinking-water-sources",
  },
  {
    level: 2,
    text: "खानेपानीका स्रोतहरूको विश्लेषण",
    slug: "drinking-water-sources-analysis",
  },
  {
    level: 2,
    text: "खानेपानी सुधारका रणनीतिहरू",
    slug: "drinking-water-improvement-strategies",
  },
];

export default async function WardWiseDrinkingWaterSourcePage() {
  // Fetch all ward-wise drinking water source data using tRPC
  const wardWiseDrinkingWaterSourceData =
    await api.profile.waterAndSanitation.wardWiseDrinkingWaterSource.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.waterAndSanitation.wardWiseDrinkingWaterSource.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Group by ward number
  const wardGroups = wardWiseDrinkingWaterSourceData.reduce(
    (acc: any, curr: any) => {
      acc[curr.wardNumber] = acc[curr.wardNumber] || [];
      acc[curr.wardNumber].push(curr);
      return acc;
    },
    {},
  );

  // Create a mapping of water source to its human-readable name
  const sourceMap: Record<string, string> = {};
  drinkingWaterSourceOptions.forEach((option) => {
    sourceMap[option.value] = option.label.split(" (")[0];
  });

  // Calculate totals by water source group
  let totalHouseholds = 0;
  const waterSourceGroupTotals: Record<string, number> = {
    PIPED_WATER: 0,
    WELL_WATER: 0,
    NATURAL_SOURCE: 0,
    OTHER_SOURCE: 0,
  };

  // Count by individual water source
  const waterSourceTotals: Record<string, number> = {};

  Object.values(wardGroups).forEach((wardData: any) => {
    wardData.forEach((item: any) => {
      // Add to total households
      totalHouseholds += item.households;

      // Initialize if not exists
      if (!waterSourceTotals[item.drinkingWaterSource]) {
        waterSourceTotals[item.drinkingWaterSource] = 0;
      }

      // Add to source totals
      waterSourceTotals[item.drinkingWaterSource] += item.households;

      // Add to group totals
      for (const groupKey of Object.keys(WATER_SOURCE_GROUPS)) {
        if (
          WATER_SOURCE_GROUPS[
            groupKey as keyof typeof WATER_SOURCE_GROUPS
          ].sources.includes(item.drinkingWaterSource)
        ) {
          waterSourceGroupTotals[groupKey] += item.households;
          break;
        }
      }
    });
  });

  // Calculate percentages
  const waterSourceGroupPercentages: Record<string, number> = {};
  Object.keys(waterSourceGroupTotals).forEach((group) => {
    waterSourceGroupPercentages[group] = parseFloat(
      ((waterSourceGroupTotals[group] / totalHouseholds) * 100).toFixed(2),
    );
  });

  // Get unique ward numbers
  const wardNumbers = Object.keys(wardGroups)
    .map(Number)
    .sort((a, b) => a - b);

  // Process data for pie chart
  const pieChartData = Object.keys(WATER_SOURCE_GROUPS).map((groupKey) => {
    const group =
      WATER_SOURCE_GROUPS[groupKey as keyof typeof WATER_SOURCE_GROUPS];
    return {
      name: group.name,
      nameEn: group.nameEn,
      value: waterSourceGroupTotals[groupKey],
      percentage: waterSourceGroupPercentages[groupKey].toFixed(2),
      color: group.color,
    };
  });

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers
    .map((wardNumber) => {
      const wardData = wardGroups[wardNumber];

      if (!wardData) return null;

      const totalWardHouseholds = wardData.reduce(
        (sum: number, item: any) => sum + item.households,
        0,
      );

      // Calculate ward-level totals for each water source group
      const wardWaterSourceGroups: Record<string, number> = {};
      Object.keys(WATER_SOURCE_GROUPS).forEach((groupKey) => {
        const group =
          WATER_SOURCE_GROUPS[groupKey as keyof typeof WATER_SOURCE_GROUPS];
        const groupTotal = wardData
          .filter((item: any) =>
            group.sources.includes(item.drinkingWaterSource),
          )
          .reduce((sum: number, item: any) => sum + item.households, 0);

        wardWaterSourceGroups[group.name] = groupTotal;
      });

      return {
        ward: `वडा ${wardNumber}`,
        wardNumber,
        ...wardWaterSourceGroups,
        total: totalWardHouseholds,
      };
    })
    .filter(Boolean);

  // Find the ward with highest piped water percentage
  const wardPipedWaterPercentages = wardWiseData.map((ward: any) => {
    const pipedWaterPercentage =
      (ward[WATER_SOURCE_GROUPS.PIPED_WATER.name] / ward.total) * 100;
    return {
      wardNumber: ward.wardNumber,
      percentage: pipedWaterPercentage,
    };
  });

  const highestPipedWaterWard = [...wardPipedWaterPercentages].sort(
    (a, b) => b.percentage - a.percentage,
  )[0];
  const lowestPipedWaterWard = [...wardPipedWaterPercentages].sort(
    (a, b) => a.percentage - b.percentage,
  )[0];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WardWiseDrinkingWaterSourceSEO
        wardWiseDrinkingWaterSourceData={wardWiseDrinkingWaterSourceData}
        totalHouseholds={totalHouseholds}
        waterSourceGroupTotals={waterSourceGroupTotals}
        waterSourceGroupPercentages={waterSourceGroupPercentages}
        highestPipedWaterWard={highestPipedWaterWard}
        lowestPipedWaterWard={lowestPipedWaterWard}
        WATER_SOURCE_GROUPS={WATER_SOURCE_GROUPS}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/drinking-water-source.svg"
              width={1200}
              height={400}
              alt="खानेपानीका स्रोतहरू - बुद्धशान्ति गाउँपालिका (Drinking Water Sources - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा खानेपानीका स्रोतहरूको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              खानेपानीको स्रोतहरूको अवस्था र पहुँच स्वास्थ्य, सरसफाइ र समग्र
              जीवनस्तरको एक महत्वपूर्ण निर्धारक हो। यस खण्डमा बुद्धशान्ति
              गाउँपालिकाको विभिन्न वडाहरूमा खानेपानीका स्रोतहरूको उपलब्धता र
              वितरणको विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              बुद्धशान्ति गाउँपालिकामा कुल{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरीहरू
              मध्ये
              {localizeNumber(
                waterSourceGroupPercentages.PIPED_WATER.toFixed(2),
                "ne",
              )}
              % ले पाइपको पानी,
              {localizeNumber(
                waterSourceGroupPercentages.WELL_WATER.toFixed(2),
                "ne",
              )}
              % ले इनारको पानी, र
              {localizeNumber(
                waterSourceGroupPercentages.NATURAL_SOURCE.toFixed(2),
                "ne",
              )}
              % ले प्राकृतिक स्रोतबाट खानेपानी प्राप्त गर्दछन्।
            </p>

            <h2
              id="distribution-of-drinking-water-sources"
              className="scroll-m-20 border-b pb-2"
            >
              खानेपानीका स्रोतहरूको वितरण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा खानेपानीका स्रोतहरूको वितरण निम्नानुसार
              रहेको छ:
            </p>
          </div>

          <WardWiseDrinkingWaterSourceCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            totalHouseholds={totalHouseholds}
            waterSourceTotals={waterSourceTotals}
            sourceMap={sourceMap}
            waterSourceGroupTotals={waterSourceGroupTotals}
            waterSourceGroupPercentages={waterSourceGroupPercentages}
            wardWisePipedWaterPercentage={wardPipedWaterPercentages}
            highestPipedWaterWard={highestPipedWaterWard}
            lowestPipedWaterWard={lowestPipedWaterWard}
            WATER_SOURCE_GROUPS={WATER_SOURCE_GROUPS}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="drinking-water-sources-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              खानेपानीका स्रोतहरूको विश्लेषण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा खानेपानीका स्रोतहरूको विश्लेषण गर्दा,
              समग्रमा
              {localizeNumber(
                waterSourceGroupPercentages.PIPED_WATER.toFixed(2),
                "ne",
              )}
              % घरधुरीले पाइपको माध्यमबाट खानेपानी प्राप्त गर्दछन्। वडागत रूपमा
              हेर्दा वडा नं.{" "}
              {localizeNumber(
                highestPipedWaterWard.wardNumber.toString(),
                "ne",
              )}{" "}
              मा सबैभन्दा बढी{" "}
              {localizeNumber(
                highestPipedWaterWard.percentage.toFixed(2),
                "ne",
              )}
              % घरधुरीले पाइपको पानी प्रयोग गर्दछन्।
            </p>

            <WardWiseDrinkingWaterSourceAnalysisSection
              totalHouseholds={totalHouseholds}
              waterSourceGroupTotals={waterSourceGroupTotals}
              waterSourceGroupPercentages={waterSourceGroupPercentages}
              waterSourceTotals={waterSourceTotals}
              sourceMap={sourceMap}
              wardWisePipedWaterPercentage={wardPipedWaterPercentages}
              highestPipedWaterWard={highestPipedWaterWard}
              lowestPipedWaterWard={lowestPipedWaterWard}
              WATER_SOURCE_GROUPS={WATER_SOURCE_GROUPS}
            />

            <h2
              id="drinking-water-improvement-strategies"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              खानेपानी सुधारका रणनीतिहरू
            </h2>

            <p>
              बुद्धशान्ति गाउँपालिकामा खानेपानीका स्रोतहरूको तथ्याङ्क
              विश्लेषणबाट निम्न रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>पाइप पानीको विस्तार:</strong> वडा नं.{" "}
                  {localizeNumber(
                    lowestPipedWaterWard.wardNumber.toString(),
                    "ne",
                  )}{" "}
                  जस्ता कम पाइप खानेपानी पहुँच भएका वडाहरूमा पाइप खानेपानी
                  विस्तार गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>पानी शुद्धिकरण कार्यक्रम:</strong> प्राकृतिक स्रोतबाट
                  पानी प्रयोग गर्ने घरधुरीहरूलाई पानी शुद्धिकरण गर्ने विधिहरू
                  सिकाउने र आवश्यक सामग्री उपलब्ध गराउने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>इनार सुरक्षा कार्यक्रम:</strong> ट्युबवेल र इनारहरूको
                  नियमित परीक्षण गरी जमिन मुनिको पानीको गुणस्तर सुनिश्चित गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>सामुदायिक खानेपानी योजना:</strong> सामुदायिक स्तरमा
                  खानेपानी व्यवस्थापन समितिहरू गठन गरी खानेपानी संरचनाहरूको दिगो
                  व्यवस्थापन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>सार्वजनिक-निजी साझेदारी:</strong> जार/बोतलको पानी
                  जस्ता निजी क्षेत्रका खानेपानी आपूर्तिकर्ताहरूसँग सहकार्य गरी
                  दुर्गम क्षेत्रहरूमा खानेपानीको आपूर्ति सुनिश्चित गर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी बुद्धशान्ति गाउँपालिकामा खानेपानीका स्रोतहरूको विश्लेषणले
              पालिकामा खानेपानी नीति निर्माण र कार्यक्रम तर्जुमा गर्न महत्वपूर्ण
              भूमिका खेल्दछ। वडागत आवश्यकता र विशेषताहरूलाई ध्यानमा राखी
              सुरक्षित खानेपानीको पहुँच बढाउन विशेष कार्यक्रमहरू सञ्चालन
              गर्नुपर्ने देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
