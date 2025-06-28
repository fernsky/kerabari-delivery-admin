import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import LandOwnershipCharts from "./_components/land-ownership-charts";
import LandOwnershipAnalysisSection from "./_components/land-ownership-analysis-section";
import LandOwnershipSEO from "./_components/land-ownership-seo";
import { landOwnershipTypeOptions } from "@/server/api/routers/profile/economics/ward-wise-land-ownership.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define English names for land ownership types (for SEO)
const LAND_OWNERSHIP_TYPES_EN: Record<string, string> = {
  PRIVATE: "Private Land",
  GUTHI: "Guthi Land",
  PUBLIC_EILANI: "Public/Eilani Land",
  VILLAGE_BLOCK: "Village Block Land",
  OTHER: "Other Land Types",
};

// Define Nepali names for land ownership types
// Use the labels from landOwnershipTypeOptions for Nepali names
const LAND_OWNERSHIP_TYPES: Record<string, string> =
  landOwnershipTypeOptions.reduce(
    (acc, option) => ({
      ...acc,
      [option.value]: option.label,
    }),
    {},
  );

// Define colors for land ownership types
const LAND_OWNERSHIP_COLORS: Record<string, string> = {
  PRIVATE: "#3498db", // Blue
  GUTHI: "#e74c3c", // Red
  PUBLIC_EILANI: "#2ecc71", // Green
  VILLAGE_BLOCK: "#f39c12", // Orange
  OTHER: "#9b59b6", // Purple
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const landOwnershipData =
      await api.profile.economics.wardWiseLandOwnership.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalHouseholds = landOwnershipData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    // Group by land ownership type and calculate totals
    const landOwnershipCounts: Record<string, number> = {};
    landOwnershipData.forEach((item) => {
      if (!landOwnershipCounts[item.landOwnershipType])
        landOwnershipCounts[item.landOwnershipType] = 0;
      landOwnershipCounts[item.landOwnershipType] += item.households || 0;
    });

    // Find the most common land ownership type
    let mostCommonType = "";
    let mostCommonCount = 0;
    Object.entries(landOwnershipCounts).forEach(([type, count]) => {
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
      "बुद्धशान्ति गाउँपालिका जग्गा स्वामित्व",
      "बुद्धशान्ति जग्गा स्वामित्व प्रकार",
      "वडा अनुसार जग्गा स्वामित्व",
      "निजी जग्गा स्वामित्व",
      "सार्वजनिक जग्गा स्वामित्व",
      "गुठी जग्गा स्वामित्व",
      "गाउँ ब्लक जग्गा स्वामित्व",
      `बुद्धशान्ति घरपरिवार संख्या ${localizeNumber(totalHouseholds.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality land ownership",
      "Khajura land ownership types",
      "Ward-wise land ownership",
      "Private land ownership statistics Khajura",
      "Public land ownership Khajura",
      "Guthi land ownership",
      "Village Block land ownership",
      `Khajura households count ${totalHouseholds}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `बुद्धशान्ति गाउँपालिकाको वडा अनुसार जग्गा स्वामित्वको वितरण र विश्लेषण। कुल ${localizeNumber(totalHouseholds.toString(), "ne")} घरपरिवार मध्ये ${localizeNumber(mostCommonPercentage, "ne")}% (${localizeNumber(mostCommonCount.toString(), "ne")}) परिवार ${LAND_OWNERSHIP_TYPES[mostCommonType] || mostCommonType} जग्गामा बसोबास गर्दछन्। विभिन्न वडाहरूमा जग्गा स्वामित्वको विस्तृत विश्लेषण।`;

    const descriptionEN = `Ward-wise distribution and analysis of land ownership in Khajura Rural Municipality. Out of a total of ${totalHouseholds} households, ${mostCommonPercentage}% (${mostCommonCount}) live on ${LAND_OWNERSHIP_TYPES_EN[mostCommonType] || mostCommonType}. Detailed analysis of land ownership patterns across various wards.`;

    return {
      title: `जग्गा स्वामित्वको प्रकार अनुसार घरपरिवार | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-wise-land-ownership",
        languages: {
          en: "/en/profile/economics/ward-wise-land-ownership",
          ne: "/ne/profile/economics/ward-wise-land-ownership",
        },
      },
      openGraph: {
        title: `जग्गा स्वामित्वको प्रकार अनुसार घरपरिवार | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `जग्गा स्वामित्वको प्रकार अनुसार घरपरिवार | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "जग्गा स्वामित्वको प्रकार अनुसार घरपरिवार | बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "वडा अनुसार जग्गा स्वामित्वको प्रकार अनुसारको घरपरिवारको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "जग्गा स्वामित्वका प्रमुख प्रकारहरू",
    slug: "main-land-ownership-types",
  },
  {
    level: 2,
    text: "वडा अनुसार जग्गा स्वामित्व",
    slug: "ward-wise-land-ownership",
  },
  {
    level: 2,
    text: "जग्गा स्वामित्व प्रवृत्ति",
    slug: "land-ownership-trends",
  },
  {
    level: 2,
    text: "भूमि व्यवस्थापन र सुरक्षा",
    slug: "land-management-and-security",
  },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function WardWiseLandOwnershipPage() {
  // Fetch all land ownership data using tRPC
  const landOwnershipData =
    await api.profile.economics.wardWiseLandOwnership.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseLandOwnership.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    landOwnershipData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.landOwnershipType]) acc[item.landOwnershipType] = 0;
      acc[item.landOwnershipType] += item.households || 0;
      return acc;
    }, {}),
  )
    .map(([type, households]) => ({
      type,
      typeName: LAND_OWNERSHIP_TYPES[type] || type,
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
    name: item.typeName,
    value: item.households,
    percentage: ((item.households / totalHouseholds) * 100).toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(landOwnershipData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = landOwnershipData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add land ownership types
    wardData.forEach((item) => {
      const typeName =
        LAND_OWNERSHIP_TYPES[item.landOwnershipType] || item.landOwnershipType;
      result[typeName] = item.households;
    });

    return result;
  });

  // Calculate ward-wise land ownership statistics
  const wardWiseAnalysis = wardNumbers
    .map((wardNumber) => {
      const wardData = landOwnershipData.filter(
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
        { landOwnershipType: "", households: 0 },
      );

      // Calculate households by ownership types
      const privateHouseholds =
        wardData.find((item) => item.landOwnershipType === "PRIVATE")
          ?.households || 0;
      const publicEilaniHouseholds =
        wardData.find((item) => item.landOwnershipType === "PUBLIC_EILANI")
          ?.households || 0;
      const guthiHouseholds =
        wardData.find((item) => item.landOwnershipType === "GUTHI")
          ?.households || 0;
      const villageBlockHouseholds =
        wardData.find((item) => item.landOwnershipType === "VILLAGE_BLOCK")
          ?.households || 0;
      const otherHouseholds =
        wardData.find((item) => item.landOwnershipType === "OTHER")
          ?.households || 0;

      const privatePercentage =
        wardTotalHouseholds > 0
          ? ((privateHouseholds / wardTotalHouseholds) * 100).toFixed(2)
          : "0";

      const publicEilaniPercentage =
        wardTotalHouseholds > 0
          ? ((publicEilaniHouseholds / wardTotalHouseholds) * 100).toFixed(2)
          : "0";

      const guthiPercentage =
        wardTotalHouseholds > 0
          ? ((guthiHouseholds / wardTotalHouseholds) * 100).toFixed(2)
          : "0";

      const villageBlockPercentage =
        wardTotalHouseholds > 0
          ? ((villageBlockHouseholds / wardTotalHouseholds) * 100).toFixed(2)
          : "0";

      const otherPercentage =
        wardTotalHouseholds > 0
          ? ((otherHouseholds / wardTotalHouseholds) * 100).toFixed(2)
          : "0";

      // Calculate land security risk score (0-100)
      // Lower score means higher land security risks (more people on public/eilani or other insecure land)
      const secureHouseholds = privateHouseholds + guthiHouseholds;
      const insecureHouseholds =
        publicEilaniHouseholds + villageBlockHouseholds + otherHouseholds;

      const securityScore =
        wardTotalHouseholds > 0
          ? Math.round((secureHouseholds / wardTotalHouseholds) * 100)
          : 0;

      return {
        wardNumber,
        totalHouseholds: wardTotalHouseholds,
        mostCommonType: mostCommonType.landOwnershipType,
        mostCommonTypeHouseholds: mostCommonType.households || 0,
        mostCommonTypePercentage:
          wardTotalHouseholds > 0
            ? (
                ((mostCommonType.households || 0) / wardTotalHouseholds) *
                100
              ).toFixed(2)
            : "0",
        privateHouseholds,
        privatePercentage,
        publicEilaniHouseholds,
        publicEilaniPercentage,
        guthiHouseholds,
        guthiPercentage,
        villageBlockHouseholds,
        villageBlockPercentage,
        otherHouseholds,
        otherPercentage,
        securityScore,
        secureHouseholds,
        insecureHouseholds,
      };
    })
    .sort((a, b) => b.totalHouseholds - a.totalHouseholds); // Sort by total households

  // Calculate overall land security statistics
  const totalSecureHouseholds = wardWiseAnalysis.reduce(
    (sum, ward) => sum + ward.secureHouseholds,
    0,
  );
  const totalInsecureHouseholds = wardWiseAnalysis.reduce(
    (sum, ward) => sum + ward.insecureHouseholds,
    0,
  );

  // Calculate overall security score
  const overallSecurityScore =
    totalHouseholds > 0
      ? Math.round((totalSecureHouseholds / totalHouseholds) * 100)
      : 0;

  // Find ward with highest insecure land percentage
  const highestInsecurityWard = [...wardWiseAnalysis].sort(
    (a, b) =>
      b.insecureHouseholds / b.totalHouseholds -
      a.insecureHouseholds / a.totalHouseholds,
  )[0];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <LandOwnershipSEO
        overallSummary={overallSummary}
        totalHouseholds={totalHouseholds}
        LAND_OWNERSHIP_TYPES={LAND_OWNERSHIP_TYPES}
        LAND_OWNERSHIP_TYPES_EN={LAND_OWNERSHIP_TYPES_EN}
        wardNumbers={wardNumbers}
        securityScore={overallSecurityScore}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/land-ownership.svg"
              width={1200}
              height={400}
              alt="जग्गा स्वामित्वको प्रकार अनुसार घरपरिवार - बुद्धशान्ति गाउँपालिका (Land Ownership Types by Households - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा जग्गा स्वामित्वको प्रकार अनुसार घरपरिवार
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              जग्गा स्वामित्व घरपरिवारको आर्थिक सुरक्षा र सामाजिक स्थितिको
              महत्त्वपूर्ण पक्ष हो। नेपालमा विभिन्न प्रकारको जग्गा स्वामित्व
              प्रणाली अवलम्बन गरिएको छ, जसमा निजी, गुठी, सार्वजनिक/ऐलानी, गाउँ
              ब्लक लगायतका प्रकारहरू प्रचलनमा छन्। बुद्धशान्ति गाउँपालिकामा पनि
              यी विभिन्न प्रकारका जग्गा स्वामित्वमा बसोबास गर्ने घरपरिवारहरू
              रहेका छन्।
            </p>
            <p>
              बुद्धशान्ति गाउँपालिकाको जग्गा स्वामित्व सम्बन्धी तथ्याङ्क अनुसार,
              कुल {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
              घरपरिवारमध्ये सबैभन्दा बढी {overallSummary[0]?.typeName || ""}
              जग्गामा{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.households || 0) / totalHouseholds) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % अर्थात्{" "}
              {localizeNumber(
                (overallSummary[0]?.households || 0).toLocaleString(),
                "ne",
              )}{" "}
              परिवारले बसोबास गरिरहेका छन्।
            </p>

            <h2
              id="main-land-ownership-types"
              className="scroll-m-20 border-b pb-2"
            >
              जग्गा स्वामित्वका प्रमुख प्रकारहरू
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा जग्गा स्वामित्वका प्रमुख प्रकारहरू र
              तिनमा बसोबास गर्ने घरपरिवार संख्या निम्नानुसार रहेको छ:
            </p>

            <ul>
              {overallSummary.map((item, index) => (
                <li key={index}>
                  <strong>{item.typeName}</strong>: कुल{" "}
                  {localizeNumber(
                    ((item.households / totalHouseholds) * 100).toFixed(1),
                    "ne",
                  )}
                  % ({localizeNumber(item.households.toLocaleString(), "ne")}{" "}
                  परिवार)
                </li>
              ))}
            </ul>

            <p>
              स्वामित्वको विश्लेषण गर्दा, बुद्धशान्ति गाउँपालिकाका{" "}
              {localizeNumber(
                (
                  ((overallSummary.find((s) => s.type === "PRIVATE")
                    ?.households || 0) /
                    totalHouseholds) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % परिवारहरू निजी जग्गामा बसोबास गर्दछन्, जबकी{" "}
              {localizeNumber(
                (
                  ((overallSummary.find((s) => s.type === "PUBLIC_EILANI")
                    ?.households || 0) /
                    totalHouseholds) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % परिवार सार्वजनिक/ऐलानी जग्गामा बसोबास गर्छन्।
            </p>

            <p>
              जग्गा सुरक्षाको दृष्टिकोणबाट, लगभग{" "}
              {localizeNumber(overallSecurityScore.toString(), "ne")}%
              घरपरिवारहरू सुरक्षित जग्गा स्वामित्व (निजी र गुठी) मा रहेका छन्,
              भने{" "}
              {localizeNumber((100 - overallSecurityScore).toString(), "ne")}%
              घरपरिवारहरू अपेक्षाकृत कम सुरक्षित जग्गा स्वामित्वमा रहेका छन्।
            </p>
          </div>

          {/* Client component for charts */}
          <LandOwnershipCharts
            overallSummary={overallSummary}
            totalHouseholds={totalHouseholds}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            landOwnershipData={landOwnershipData}
            wardWiseAnalysis={wardWiseAnalysis}
            LAND_OWNERSHIP_TYPES={LAND_OWNERSHIP_TYPES}
            LAND_OWNERSHIP_COLORS={LAND_OWNERSHIP_COLORS}
            securityScore={overallSecurityScore}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="land-management-and-security"
              className="scroll-m-20 border-b pb-2"
            >
              भूमि व्यवस्थापन र सुरक्षा
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा जग्गा स्वामित्वको प्रकारले भूमि सुरक्षा र
              व्यवस्थापनमा प्रभाव पारेको देखिन्छ। कुल{" "}
              {localizeNumber(totalHouseholds.toString(), "ne")} घरपरिवारमध्ये{" "}
              {localizeNumber(totalSecureHouseholds.toString(), "ne")}
              परिवार सुरक्षित जग्गा स्वामित्वमा र{" "}
              {localizeNumber(totalInsecureHouseholds.toString(), "ne")} परिवार
              कम सुरक्षित जग्गा स्वामित्वमा रहेका छन्।
            </p>

            <p>
              यस पालिकामा सार्वजनिक तथा ऐलानी जग्गामा बसोबास गर्ने परिवार संख्या
              उल्लेखनीय रहेको छ, जसले जग्गा सुरक्षा र स्वामित्व सुनिश्चित गर्ने
              कार्यलाई प्राथमिकतामा राख्नुपर्ने देखिन्छ।
            </p>

            <LandOwnershipAnalysisSection
              overallSummary={overallSummary}
              totalHouseholds={totalHouseholds}
              wardWiseAnalysis={wardWiseAnalysis}
              LAND_OWNERSHIP_TYPES={LAND_OWNERSHIP_TYPES}
              LAND_OWNERSHIP_TYPES_EN={LAND_OWNERSHIP_TYPES_EN}
              LAND_OWNERSHIP_COLORS={LAND_OWNERSHIP_COLORS}
              securityScore={overallSecurityScore}
              highestInsecurityWard={highestInsecurityWard}
            />

            <h2
              id="conclusions-and-recommendations"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              निष्कर्ष र सिफारिसहरू
            </h2>

            <p>
              बुद्धशान्ति गाउँपालिकाको जग्गा स्वामित्व अवस्थाको विश्लेषणबाट
              निम्न निष्कर्ष र सिफारिसहरू गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>जग्गा स्वामित्व सुरक्षा:</strong> हाल पालिकामा{" "}
                  {localizeNumber(
                    (100 - overallSecurityScore).toString(),
                    "ne",
                  )}
                  % परिवारहरू अपेक्षाकृत कम सुरक्षित जग्गा स्वामित्वमा
                  (सार्वजनिक/ऐलानी, गाउँ ब्लक, अन्य) रहेकाले यस्ता परिवारहरूको
                  जग्गा स्वामित्व सुनिश्चित गर्ने नीति र कार्यक्रम ल्याउनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>वडागत कार्ययोजना:</strong> विशेषगरी वडा नं.{" "}
                  {localizeNumber(
                    highestInsecurityWard?.wardNumber.toString() || "",
                    "ne",
                  )}
                  मा सार्वजनिक/ऐलानी जग्गामा बसोबास गर्ने परिवार उल्लेखनीय
                  संख्यामा (
                  {localizeNumber(
                    highestInsecurityWard?.publicEilaniHouseholds.toString() ||
                      "0",
                    "ne",
                  )}{" "}
                  परिवार) रहेकाले यस वडामा जग्गा व्यवस्थापन विशेष कार्यक्रम
                  सञ्चालन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>अभिलेखीकरण सुदृढीकरण:</strong> पालिकामा जग्गा
                  स्वामित्वको अभिलेखीकरण व्यवस्थित गर्न डिजिटल प्रणालीको विकास र
                  कार्यान्वयन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>नीतिगत सुधार:</strong> दीर्घकालीन जग्गा व्यवस्थापन
                  योजना तयार गरी लागू गर्नुपर्ने। विशेषगरी सार्वजनिक/ऐलानी
                  जग्गामा बसोबास गरिरहेका परिवारहरूको लागि उचित नीति तर्जुमा
                  गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>सचेतना अभिवृद्धि:</strong> जग्गा स्वामित्व, अधिकार र
                  जिम्मेवारीबारे समुदाय स्तरमा सचेतना कार्यक्रमहरू सञ्चालन
                  गर्नुपर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              बुद्धशान्ति गाउँपालिकामा जग्गा स्वामित्वको वर्तमान अवस्थाले जग्गा
              व्यवस्थापनमा सुधार गर्नुपर्ने आवश्यकता देखाउँछ। जग्गा स्वामित्व
              सुरक्षा, अभिलेखीकरण सुधार र दीर्घकालीन योजना तर्जुमा गरी
              कार्यान्वयन गर्न आवश्यक देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
