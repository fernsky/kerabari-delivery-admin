import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import HouseholdOuterWallCharts from "./_components/household-outer-wall-charts";
import HouseholdOuterWallAnalysisSection from "./_components/household-outer-wall-analysis-section";
import HouseholdOuterWallSEO from "./_components/household-outer-wall-seo";
import {
  OuterWallType,
  outerWallOptions,
} from "@/server/api/routers/profile/economics/ward-wise-household-outer-wall.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define English names for outer wall types (for SEO)
const WALL_TYPE_NAMES_EN: Record<string, string> = {
  CEMENT_JOINED: "Cement-bonded brick/stone",
  UNBAKED_BRICK: "Unbaked brick",
  MUD_JOINED: "Mud-bonded brick/stone",
  TIN: "Tin/Metal sheet",
  BAMBOO: "Bamboo materials",
  WOOD: "Wood/Plank",
  PREFAB: "Prefabricated",
  OTHER: "Other materials",
};

// Define Nepali names for outer wall types
const WALL_TYPE_NAMES: Record<string, string> = {
  CEMENT_JOINED: "सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा",
  UNBAKED_BRICK: "काँचो इँटा",
  MUD_JOINED: "माटोको जोडाइ भएको इँटा/ढुङ्गा",
  TIN: "जस्ता/टिन/च्यादर",
  BAMBOO: "बाँसजन्य सामग्री",
  WOOD: "काठ/फल्याक",
  PREFAB: "प्रि फ्याब",
  OTHER: "अन्य",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const wallData =
      await api.profile.economics.wardWiseHouseholdOuterWall.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalHouseholds = wallData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    // Group by wall type and calculate totals
    const wallTypeCounts: Record<string, number> = {};
    wallData.forEach((item) => {
      if (!wallTypeCounts[item.wallType]) wallTypeCounts[item.wallType] = 0;
      wallTypeCounts[item.wallType] += item.households || 0;
    });

    // Find the most common wall type
    let mostCommonType = "";
    let mostCommonCount = 0;
    Object.entries(wallTypeCounts).forEach(([type, count]) => {
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
      "गढवा गाउँपालिका घरको बाहिरी गारो",
      "गढवा घरको बाहिरी गारो वितरण",
      "वडा अनुसार घरको बाहिरी गारो",
      "घरको बाहिरी गारो विवरण",
      "सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा",
      "माटोको जोडाइ भएको घरहरू",
      `गढवा घरको बाहिरी गारो संख्या ${localizeNumber(totalHouseholds.toString(), "ne")}`,
      "गढवा गृह सुरक्षा",
      "गढवा आवास संरचना",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality house outer wall",
      "Khajura house outer wall distribution",
      "Ward-wise house outer wall",
      "House outer wall details",
      "Cement-bonded walls in Khajura",
      "Mud-bonded wall households",
      `Khajura household outer wall count ${totalHouseholds}`,
      "Khajura housing safety",
      "Khajura housing structure",
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकाको वडा अनुसार घरको बाहिरी गारोको वितरण र विश्लेषण। कुल घरधुरी संख्या ${localizeNumber(totalHouseholds.toString(), "ne")} मध्ये ${localizeNumber(mostCommonPercentage, "ne")}% (${localizeNumber(mostCommonCount.toString(), "ne")}) ${WALL_TYPE_NAMES[mostCommonType] || mostCommonType} प्रकारको बाहिरी गारो भएका घरहरू रहेका छन्। विभिन्न वडाहरूमा घरको बाहिरी गारोको विस्तृत विश्लेषण।`;

    const descriptionEN = `Ward-wise distribution and analysis of house outer wall types in Khajura Rural Municipality. Out of a total of ${totalHouseholds} households, ${mostCommonPercentage}% (${mostCommonCount}) have ${WALL_TYPE_NAMES_EN[mostCommonType] || mostCommonType} outer walls. Detailed analysis of house outer wall types across various wards.`;

    return {
      title: `घरको बाहिरी गारोको वितरण | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-wise-household-outer-wall",
        languages: {
          en: "/en/profile/economics/ward-wise-household-outer-wall",
          ne: "/ne/profile/economics/ward-wise-household-outer-wall",
        },
      },
      openGraph: {
        title: `घरको बाहिरी गारोको वितरण | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `घरको बाहिरी गारोको वितरण | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "घरको बाहिरी गारोको वितरण | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार घरको बाहिरी गारोको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "घरको बाहिरी गारोका प्रकारहरू",
    slug: "household-outer-wall-types",
  },
  {
    level: 2,
    text: "वडा अनुसार घरको बाहिरी गारो",
    slug: "ward-wise-household-outer-wall",
  },
  {
    level: 2,
    text: "बाहिरी गारोको गुणस्तर विश्लेषण",
    slug: "outer-wall-quality-analysis",
  },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function WardWiseHouseholdOuterWallPage() {
  // Fetch all household outer wall data using tRPC
  const wallData =
    await api.profile.economics.wardWiseHouseholdOuterWall.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseHouseholdOuterWall.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    wallData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.wallType]) acc[item.wallType] = 0;
      acc[item.wallType] += item.households || 0;
      return acc;
    }, {}),
  )
    .map(([wallType, households]) => ({
      wallType,
      wallTypeName:
        WALL_TYPE_NAMES[wallType as keyof typeof WALL_TYPE_NAMES] || wallType,
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
    name: item.wallTypeName,
    value: item.households,
    percentage: ((item.households / totalHouseholds) * 100).toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(wallData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = wallData.filter((item) => item.wardNumber === wardNumber);

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add wall types
    wardData.forEach((item) => {
      const wallName =
        WALL_TYPE_NAMES[item.wallType as keyof typeof WALL_TYPE_NAMES] ||
        item.wallType;
      // Extract just the main name before the parenthesis for better fit in charts
      const shortName = wallName.split("(")[0].trim();
      result[shortName] = item.households;
    });

    return result;
  });

  // Calculate ward-wise outer wall quality rates
  const wardWiseAnalysis = wardNumbers
    .map((wardNumber) => {
      const wardData = wallData.filter(
        (item) => item.wardNumber === wardNumber,
      );

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
        { wallType: "", households: 0 },
      );

      // Calculate high-quality walls (cement-bonded + prefab)
      const highQualityWalls = wardData
        .filter(
          (item) =>
            item.wallType === "CEMENT_JOINED" || item.wallType === "PREFAB",
        )
        .reduce((sum, item) => sum + (item.households || 0), 0);

      // Calculate medium-quality walls (mud-joined + wood)
      const mediumQualityWalls = wardData
        .filter(
          (item) => item.wallType === "MUD_JOINED" || item.wallType === "WOOD",
        )
        .reduce((sum, item) => sum + (item.households || 0), 0);

      // Calculate low-quality walls (others)
      const lowQualityWalls = wardData
        .filter((item) =>
          ["UNBAKED_BRICK", "TIN", "BAMBOO", "OTHER"].includes(item.wallType),
        )
        .reduce((sum, item) => sum + (item.households || 0), 0);

      const highQualityPercentage =
        wardTotalHouseholds > 0
          ? ((highQualityWalls / wardTotalHouseholds) * 100).toFixed(2)
          : "0";

      const mediumQualityPercentage =
        wardTotalHouseholds > 0
          ? ((mediumQualityWalls / wardTotalHouseholds) * 100).toFixed(2)
          : "0";

      const lowQualityPercentage =
        wardTotalHouseholds > 0
          ? ((lowQualityWalls / wardTotalHouseholds) * 100).toFixed(2)
          : "0";

      return {
        wardNumber,
        totalHouseholds: wardTotalHouseholds,
        mostCommonType: mostCommonType.wallType,
        mostCommonTypeHouseholds: mostCommonType.households || 0,
        mostCommonTypePercentage:
          wardTotalHouseholds > 0
            ? (
                ((mostCommonType.households || 0) / wardTotalHouseholds) *
                100
              ).toFixed(2)
            : "0",
        highQualityWalls,
        highQualityPercentage,
        mediumQualityWalls,
        mediumQualityPercentage,
        lowQualityWalls,
        lowQualityPercentage,
        qualityScore:
          parseInt(highQualityPercentage) * 1 +
          parseInt(mediumQualityPercentage) * 0.5,
      };
    })
    .sort((a, b) => b.qualityScore - a.qualityScore); // Sort by quality score

  // Define colors for wall types
  const WALL_TYPE_COLORS = {
    CEMENT_JOINED: "#3498db", // Blue for cement
    UNBAKED_BRICK: "#e74c3c", // Red for unbaked brick
    MUD_JOINED: "#e67e22", // Orange for mud
    TIN: "#7f8c8d", // Grey for tin
    BAMBOO: "#2ecc71", // Green for bamboo
    WOOD: "#9b59b6", // Purple for wood
    PREFAB: "#f1c40f", // Yellow for prefab
    OTHER: "#95a5a6", // Light grey for other
  };

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <HouseholdOuterWallSEO
        overallSummary={overallSummary}
        totalHouseholds={totalHouseholds}
        WALL_TYPE_NAMES={WALL_TYPE_NAMES}
        WALL_TYPE_NAMES_EN={WALL_TYPE_NAMES_EN}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/house-wall.svg"
              width={1200}
              height={400}
              alt="घरको बाहिरी गारोको वितरण - गढवा गाउँपालिका (House Outer Wall Distribution - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा घरको बाहिरी गारोको वितरण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              घरको बाहिरी गारोको प्रकारले घरको संरचनागत बलियोपन, आवासीय गुणस्तर
              र प्राकृतिक प्रकोप प्रतिको सुरक्षाको स्तर निर्धारण गर्दछ। यस
              खण्डमा गढवा गाउँपालिकामा घरको बाहिरी गारोका प्रमुख प्रकारहरू र
              तिनको वडागत वितरणको विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              गढवा गाउँपालिकाको घरको बाहिरी गारोको तथ्याङ्क अनुसार, कुल
              घरधुरी {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
              मध्ये सबैभन्दा बढी{" "}
              {overallSummary[0]?.wallTypeName.split("(")[0].trim() || ""}
              गारो भएका घरहरू{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.households || 0) / totalHouseholds) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % रहेका देखिन्छन्। अन्य प्रकारका गारो भएका घरहरूको संख्या क्रमशः
              घट्दो क्रममा रहेको छ।
            </p>

            <h2
              id="household-outer-wall-types"
              className="scroll-m-20 border-b pb-2"
            >
              घरको बाहिरी गारोका प्रकारहरू
            </h2>
            <p>
              गढवा गाउँपालिकामा घरको बाहिरी गारोका प्रमुख प्रकारहरू र तिनको
              वितरण निम्नानुसार रहेको छ:
            </p>

            <ul>
              {overallSummary.slice(0, 3).map((item, index) => (
                <li key={index}>
                  <strong>{item.wallTypeName}</strong>: कुल घरधुरीको{" "}
                  {localizeNumber(
                    ((item.households / totalHouseholds) * 100).toFixed(1),
                    "ne",
                  )}
                  % ({localizeNumber(item.households.toLocaleString(), "ne")}{" "}
                  घरधुरी)
                </li>
              ))}
              <li>
                <strong>अन्य प्रकारका गारो</strong>: कुल घरधुरीको{" "}
                {localizeNumber(
                  (
                    (overallSummary
                      .slice(3)
                      .reduce((sum, item) => sum + item.households, 0) /
                      totalHouseholds) *
                    100
                  ).toFixed(1),
                  "ne",
                )}
                % (
                {localizeNumber(
                  overallSummary
                    .slice(3)
                    .reduce((sum, item) => sum + item.households, 0)
                    .toLocaleString(),
                  "ne",
                )}{" "}
                घरधुरी)
              </li>
            </ul>

            <p>
              गुणस्तरको आधारमा विश्लेषण गर्दा,{" "}
              {localizeNumber(
                (
                  ((overallSummary.find((i) => i.wallType === "CEMENT_JOINED")
                    ?.households || 0) /
                    totalHouseholds) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % घरहरूमा सिमेन्टको जोडाइ भएको इँटा/ढुङ्गाको गारो छ, जुन उच्च
              गुणस्तर र बलियोपनको सूचक हो। यस्ता घरहरू मुख्यतया नगरिय क्षेत्र र
              बजार केन्द्रमा अवस्थित छन्।
            </p>
          </div>

          {/* Client component for charts */}
          <HouseholdOuterWallCharts
            overallSummary={overallSummary}
            totalHouseholds={totalHouseholds}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            wallData={wallData}
            wardWiseAnalysis={wardWiseAnalysis}
            WALL_TYPE_NAMES={WALL_TYPE_NAMES}
            WALL_TYPE_COLORS={WALL_TYPE_COLORS}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="outer-wall-quality-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              बाहिरी गारोको गुणस्तर विश्लेषण
            </h2>
            <p>
              घरको बाहिरी गारोको गुणस्तर विश्लेषणमा सिमेन्टको जोडाइ भएको
              इँटा/ढुङ्गा र प्रि फ्याब जस्ता गारोलाई उच्च गुणस्तरका, माटोको
              जोडाइ भएको इँटा/ढुङ्गा र काठ/फल्याकलाई मध्यम गुणस्तरका र काँचो
              इँटा, जस्ता/टिन/च्यादर, बाँसजन्य सामग्री र अन्य सामग्रीलाई न्यून
              गुणस्तरका रूपमा वर्गीकरण गरिएको छ।
            </p>

            <p>
              यस विश्लेषण अनुसार, पालिकाभरमा{" "}
              {localizeNumber(
                (
                  (wardWiseAnalysis.reduce(
                    (sum, ward) => sum + ward.highQualityWalls,
                    0,
                  ) /
                    totalHouseholds) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % घरहरूमा उच्च गुणस्तरका गारो छन्,{" "}
              {localizeNumber(
                (
                  (wardWiseAnalysis.reduce(
                    (sum, ward) => sum + ward.mediumQualityWalls,
                    0,
                  ) /
                    totalHouseholds) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % घरहरूमा मध्यम गुणस्तरका गारो छन्, र{" "}
              {localizeNumber(
                (
                  (wardWiseAnalysis.reduce(
                    (sum, ward) => sum + ward.lowQualityWalls,
                    0,
                  ) /
                    totalHouseholds) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % घरहरूमा न्यून गुणस्तरका गारो रहेको देखिन्छ।
            </p>

            <HouseholdOuterWallAnalysisSection
              overallSummary={overallSummary}
              totalHouseholds={totalHouseholds}
              wardWiseAnalysis={wardWiseAnalysis}
              WALL_TYPE_NAMES={WALL_TYPE_NAMES}
              WALL_TYPE_NAMES_EN={WALL_TYPE_NAMES_EN}
              WALL_TYPE_COLORS={WALL_TYPE_COLORS}
            />

            <h2
              id="conclusions-and-recommendations"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              निष्कर्ष र सिफारिसहरू
            </h2>

            <p>
              गढवा गाउँपालिकामा घरको बाहिरी गारोको वितरण विश्लेषणबाट निम्न
              निष्कर्ष र सिफारिसहरू गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>संरचनागत सुरक्षा सुधार:</strong> झण्डै{" "}
                  {localizeNumber(
                    (
                      (wardWiseAnalysis.reduce(
                        (sum, ward) => sum + ward.lowQualityWalls,
                        0,
                      ) /
                        totalHouseholds) *
                      100
                    ).toFixed(0),
                    "ne",
                  )}
                  % घरहरूमा न्यून गुणस्तरका गारो रहेकाले यस्ता घरहरूको संरचनागत
                  सुरक्षा सुधार गर्न आवश्यक कार्यक्रमहरू संचालन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>भवन निर्माण मापदण्ड कार्यान्वयन:</strong> नयाँ घरहरू
                  निर्माण गर्दा भूकम्प प्रतिरोधी गारो प्रविधिहरू (सिमेन्टको
                  जोडाइ भएको इँटा/ढुङ्गा वा प्रि फ्याब) अनिवार्य गर्ने नीति लागू
                  गर्न सिफारिस गरिन्छ।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>वडागत लक्षित कार्यक्रम:</strong>{" "}
                  {wardWiseAnalysis
                    .slice(-3)
                    .map((ward, i, arr) =>
                      i === arr.length - 1
                        ? `र वडा नं. ${localizeNumber(ward.wardNumber.toString(), "ne")}`
                        : `वडा नं. ${localizeNumber(ward.wardNumber.toString(), "ne")}, `,
                    )}
                  जस्ता वडाहरूमा न्यून गुणस्तरका गारो भएका घरहरू बढी भएकाले यी
                  वडाहरूमा लक्षित कार्यक्रमहरू संचालन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>जनचेतना अभिवृद्धि:</strong> गारोको गुणस्तर र भूकम्पीय
                  सुरक्षाका बारेमा घरधुरीहरूलाई सचेत गराउन जनचेतना अभिवृद्धि
                  कार्यक्रमहरू संचालन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>स्थानीय निर्माण सामग्रीको गुणस्तर सुधार:</strong>{" "}
                  स्थानीय रूपमा उत्पादित निर्माण सामग्रीहरू (जस्तै: इँटा, ब्लक)
                  को गुणस्तर सुधार र प्रमाणीकरण प्रणाली विकास गर्नुपर्ने।
                </div>
              </div>
            </div>

            <p>
              गढवा गाउँपालिकामा घरको बाहिरी गारोको समग्र अवस्था मध्यम स्तरको
              रहेको देखिन्छ। उच्च गुणस्तरका गारो भएका घरहरूको संख्या बढाउन र
              न्यून गुणस्तरका गारो भएका घरहरूको संरचनागत सुधार गर्न नीतिगत र
              कार्यक्रमगत पहलहरू आवश्यक छन्।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
