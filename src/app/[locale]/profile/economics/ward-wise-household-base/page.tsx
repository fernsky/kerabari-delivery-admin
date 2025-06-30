import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import HouseholdBaseCharts from "./_components/household-base-charts";
import HouseholdBaseAnalysisSection from "./_components/household-base-analysis-section";
import HouseholdBaseSEO from "./_components/household-base-seo";
import { HouseholdBaseType } from "@/server/api/routers/profile/economics/ward-wise-household-base.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define Nepali names for household base types
const BASE_TYPE_NAMES: Record<string, string> = {
  CONCRETE_PILLAR: "ढलान पिल्लरसहितको",
  CEMENT_JOINED: "सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा",
  MUD_JOINED: "माटोको जोडाइ भएको इँटा/ढुङ्गा",
  WOOD_POLE: "काठको खम्बा गाडेको",
  OTHER: "अन्य",
};

// Define English names for household base types (for SEO)
const BASE_TYPE_NAMES_EN: Record<string, string> = {
  CONCRETE_PILLAR: "Concrete pillar construction",
  CEMENT_JOINED: "Cement-bonded brick/stone",
  MUD_JOINED: "Mud-bonded brick/stone",
  WOOD_POLE: "Wooden pole foundation",
  OTHER: "Other materials",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const baseData =
      await api.profile.economics.wardWiseHouseholdBase.getAll.query();
    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalHouseholds = baseData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    // Group by base type and calculate totals
    const baseTypeCounts: Record<string, number> = {};
    baseData.forEach((item) => {
      if (!baseTypeCounts[item.baseType]) baseTypeCounts[item.baseType] = 0;
      baseTypeCounts[item.baseType] += item.households || 0;
    });

    // Find the most common base type
    let mostCommonType = "";
    let mostCommonCount = 0;
    Object.entries(baseTypeCounts).forEach(([type, count]) => {
      if (count > mostCommonCount) {
        mostCommonCount = count;
        mostCommonType = type;
      }
    });

    const mostCommonPercentage =
      totalHouseholds > 0
        ? ((mostCommonCount / totalHouseholds) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "केराबारी गाउँपालिका घरको जग",
      "केराबारी घरको जग वितरण",
      "वडा अनुसार घरको जग",
      "घरको जग विवरण",
      "ढलान पिल्लरसहितको घर",
      "माटोको जोडाइ भएको घरहरू",
      `केराबारी घरको जग संख्या ${localizeNumber(totalHouseholds.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality house foundation",
      "Khajura house foundation distribution",
      "Ward-wise house foundation",
      "House foundation details",
      "Concrete pillar construction in Khajura",
      "Mud-bonded foundation households",
      `Khajura household foundation count ${totalHouseholds}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `केराबारी गाउँपालिकाको वडा अनुसार घरको जगको वितरण र विश्लेषण। कुल घरधुरी संख्या ${localizeNumber(totalHouseholds.toString(), "ne")} मध्ये ${localizeNumber(mostCommonPercentage, "ne")}% (${localizeNumber(mostCommonCount.toString(), "ne")}) ${BASE_TYPE_NAMES[mostCommonType] || mostCommonType} प्रकारको जग भएका घरहरू रहेका छन्। विभिन्न वडाहरूमा घरको जगको विस्तृत विश्लेषण।`;

    const descriptionEN = `Ward-wise distribution and analysis of house foundation types in Khajura Rural Municipality. Out of a total of ${totalHouseholds} households, ${mostCommonPercentage}% (${mostCommonCount}) have ${BASE_TYPE_NAMES_EN[mostCommonType] || mostCommonType} foundation. Detailed analysis of house foundation types across various wards.`;

    return {
      title: `घरको जगको वितरण | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-wise-household-base",
        languages: {
          en: "/en/profile/economics/ward-wise-household-base",
          ne: "/ne/profile/economics/ward-wise-household-base",
        },
      },
      openGraph: {
        title: `घरको जगको वितरण | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `घरको जगको वितरण | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "घरको जगको वितरण | केराबारी गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार घरको जगको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "घरको जगका प्रकारहरू", slug: "household-base-types" },
  { level: 2, text: "वडा अनुसार घरको जग", slug: "ward-wise-household-base" },
  { level: 2, text: "घरको जग विश्लेषण", slug: "household-base-analysis" },
];

export default async function WardWiseHouseholdBasePage() {
  // Fetch all household base data using tRPC
  const baseData =
    await api.profile.economics.wardWiseHouseholdBase.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseHouseholdBase.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    baseData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.baseType]) acc[item.baseType] = 0;
      acc[item.baseType] += item.households || 0;
      return acc;
    }, {}),
  )
    .map(([baseType, households]) => ({
      baseType,
      baseTypeName:
        BASE_TYPE_NAMES[baseType as keyof typeof BASE_TYPE_NAMES] || baseType,
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
    name: item.baseTypeName,
    value: item.households,
    percentage: ((item.households / totalHouseholds) * 100).toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(baseData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = baseData.filter((item) => item.wardNumber === wardNumber);

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add base types
    wardData.forEach((item) => {
      result[
        BASE_TYPE_NAMES[item.baseType as keyof typeof BASE_TYPE_NAMES] ||
          item.baseType
      ] = item.households;
    });

    return result;
  });

  // Calculate ward-wise base type rates
  const wardWiseAnalysis = wardNumbers.map((wardNumber) => {
    const wardData = baseData.filter((item) => item.wardNumber === wardNumber);

    const wardTotalHouseholds = wardData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    const mostCommonType = wardData.reduce(
      (prev, current) => {
        return (prev.households || 0) > (current.households || 0)
          ? prev
          : current;
      },
      { baseType: "", households: 0 },
    );

    const concretePillar = wardData.find(
      (item) => item.baseType === "CONCRETE_PILLAR",
    );
    const concretePercentage =
      wardTotalHouseholds > 0 && concretePillar
        ? (
            ((concretePillar.households || 0) / wardTotalHouseholds) *
            100
          ).toFixed(2)
        : "0";

    return {
      wardNumber,
      totalHouseholds: wardTotalHouseholds,
      mostCommonType: mostCommonType.baseType,
      mostCommonTypeHouseholds: mostCommonType.households || 0,
      mostCommonTypePercentage:
        wardTotalHouseholds > 0
          ? (
              ((mostCommonType.households || 0) / wardTotalHouseholds) *
              100
            ).toFixed(2)
          : "0",
      concreteHouseholds: concretePillar?.households || 0,
      concretePercentage,
    };
  });

  // Define colors for base types
  const BASE_TYPE_COLORS = {
    CONCRETE_PILLAR: "#3498db", // Blue for concrete
    CEMENT_JOINED: "#2ecc71", // Green for cement
    MUD_JOINED: "#e67e22", // Orange for mud
    WOOD_POLE: "#9b59b6", // Purple for wood
    OTHER: "#95a5a6", // Gray for other
  };

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <HouseholdBaseSEO
        overallSummary={overallSummary}
        totalHouseholds={totalHouseholds}
        BASE_TYPE_NAMES={BASE_TYPE_NAMES}
        BASE_TYPE_NAMES_EN={BASE_TYPE_NAMES_EN}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/house-foundation.svg"
              width={1200}
              height={400}
              alt="घरको जगको वितरण - केराबारी गाउँपालिका (House Foundation Distribution - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकामा घरको जगको वितरण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              घरको जगको प्रकारले घरको संरचना, भौतिक गुणस्तर र विपद् जोखिम
              न्यूनीकरणको स्थिति देखाउँछ। यस खण्डमा केराबारी गाउँपालिकामा
              घरको जगका प्रमुख प्रकारहरू र तिनको वडागत वितरणको विश्लेषण प्रस्तुत
              गरिएको छ।
            </p>
            <p>
              केराबारी गाउँपालिकामा घरको जगको तथ्याङ्क हेर्दा, कुल घरधुरी{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
              मध्ये सबैभन्दा बढी {overallSummary[0]?.baseTypeName || ""}
              जग भएका घरहरू{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.households || 0) / totalHouseholds) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % रहेका देखिन्छन्।
            </p>

            <h2 id="household-base-types" className="scroll-m-20 border-b pb-2">
              घरको जगका प्रकारहरू
            </h2>
            <p>
              केराबारी गाउँपालिकामा घरको जगका प्रमुख प्रकारहरू र तिनको वितरण
              निम्नानुसार रहेको छ:
            </p>
          </div>

          {/* Client component for charts */}
          <HouseholdBaseCharts
            overallSummary={overallSummary}
            totalHouseholds={totalHouseholds}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            baseData={baseData}
            wardWiseAnalysis={wardWiseAnalysis}
            BASE_TYPE_NAMES={BASE_TYPE_NAMES}
            BASE_TYPE_COLORS={BASE_TYPE_COLORS}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="household-base-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              घरको जग विश्लेषण
            </h2>
            <p>
              केराबारी गाउँपालिकामा घरको जगको विश्लेषण गर्दा,
              {BASE_TYPE_NAMES[overallSummary[0]?.baseType || ""] ||
                overallSummary[0]?.baseType}
              जग भएका घरहरू सबैभन्दा बढी
              {localizeNumber(
                (
                  ((overallSummary[0]?.households || 0) / totalHouseholds) *
                  100
                ).toFixed(2),
                "ne",
              )}
              % रहेको पाइन्छ।
            </p>

            <HouseholdBaseAnalysisSection
              overallSummary={overallSummary}
              totalHouseholds={totalHouseholds}
              wardWiseAnalysis={wardWiseAnalysis}
              BASE_TYPE_NAMES={BASE_TYPE_NAMES}
              BASE_TYPE_NAMES_EN={BASE_TYPE_NAMES_EN}
              BASE_TYPE_COLORS={BASE_TYPE_COLORS}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
