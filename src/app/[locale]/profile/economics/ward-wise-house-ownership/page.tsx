import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import HouseOwnershipCharts from "./_components/house-ownership-charts";
import HouseOwnershipAnalysisSection from "./_components/house-ownership-analysis-section";
import HouseOwnershipSEO from "./_components/house-ownership-seo";
import { HouseOwnershipType } from "@/server/api/routers/profile/economics/ward-wise-house-ownership.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define Nepali names for ownership types
const OWNERSHIP_TYPE_NAMES: Record<string, string> = {
  PRIVATE: "निजी",
  RENT: "भाडामा",
  INSTITUTIONAL: "संस्थागत",
  OTHER: "अन्य",
};

// Define English names for ownership types (for SEO)
const OWNERSHIP_TYPE_NAMES_EN: Record<string, string> = {
  PRIVATE: "Private ownership",
  RENT: "Rented",
  INSTITUTIONAL: "Institutional ownership",
  OTHER: "Other ownership types",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const ownershipData =
      await api.profile.economics.wardWiseHouseOwnership.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalHouseholds = ownershipData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    // Group by ownership type and calculate totals
    const ownershipTypeCounts: Record<string, number> = {};
    ownershipData.forEach((item) => {
      if (!ownershipTypeCounts[item.ownershipType])
        ownershipTypeCounts[item.ownershipType] = 0;
      ownershipTypeCounts[item.ownershipType] += item.households || 0;
    });

    // Find the most common ownership type
    let mostCommonType = "";
    let mostCommonCount = 0;
    Object.entries(ownershipTypeCounts).forEach(([type, count]) => {
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
      "बुद्धशान्ति गाउँपालिका घर स्वामित्व",
      "बुद्धशान्ति घर स्वामित्व वितरण",
      "वडा अनुसार घर स्वामित्व",
      "घर स्वामित्व विवरण",
      "निजी घर स्वामित्व बुद्धशान्ति",
      "भाडामा बस्नेको संख्या",
      `बुद्धशान्ति घर स्वामित्व संख्या ${localizeNumber(totalHouseholds.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality house ownership",
      "Khajura house ownership distribution",
      "Ward-wise house ownership",
      "House ownership details",
      "Private house ownership in Khajura",
      "Rented households count",
      `Khajura household ownership count ${totalHouseholds}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `बुद्धशान्ति गाउँपालिकाको वडा अनुसार घर स्वामित्वको वितरण र विश्लेषण। कुल घरधुरी संख्या ${localizeNumber(totalHouseholds.toString(), "ne")} मध्ये ${localizeNumber(mostCommonPercentage, "ne")}% (${localizeNumber(mostCommonCount.toString(), "ne")}) ${OWNERSHIP_TYPE_NAMES[mostCommonType] || mostCommonType} स्वामित्वमा रहेका छन्। विभिन्न वडाहरूमा घर स्वामित्वको विस्तृत विश्लेषण।`;

    const descriptionEN = `Ward-wise distribution and analysis of house ownership in Khajura Rural Municipality. Out of a total of ${totalHouseholds} households, ${mostCommonPercentage}% (${mostCommonCount}) are under ${OWNERSHIP_TYPE_NAMES_EN[mostCommonType] || mostCommonType}. Detailed analysis of house ownership across various wards.`;

    return {
      title: `घर स्वामित्वको वितरण | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-wise-house-ownership",
        languages: {
          en: "/en/profile/economics/ward-wise-house-ownership",
          ne: "/ne/profile/economics/ward-wise-house-ownership",
        },
      },
      openGraph: {
        title: `घर स्वामित्वको वितरण | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `घर स्वामित्वको वितरण | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "घर स्वामित्वको वितरण | बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार घर स्वामित्वको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "घर स्वामित्वका प्रकार", slug: "house-ownership-types" },
  {
    level: 2,
    text: "वडा अनुसार घर स्वामित्व",
    slug: "ward-wise-house-ownership",
  },
  { level: 2, text: "घर स्वामित्व विश्लेषण", slug: "house-ownership-analysis" },
];

export default async function WardWiseHouseOwnershipPage() {
  // Fetch all house ownership data using tRPC
  const ownershipData =
    await api.profile.economics.wardWiseHouseOwnership.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseHouseOwnership.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    ownershipData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.ownershipType]) acc[item.ownershipType] = 0;
      acc[item.ownershipType] += item.households || 0;
      return acc;
    }, {}),
  )
    .map(([ownershipType, households]) => ({
      ownershipType,
      ownershipTypeName:
        OWNERSHIP_TYPE_NAMES[
          ownershipType as keyof typeof OWNERSHIP_TYPE_NAMES
        ] || ownershipType,
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
    name: item.ownershipTypeName,
    value: item.households,
    percentage: ((item.households / totalHouseholds) * 100).toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(ownershipData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = ownershipData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add ownership types
    wardData.forEach((item) => {
      result[
        OWNERSHIP_TYPE_NAMES[
          item.ownershipType as keyof typeof OWNERSHIP_TYPE_NAMES
        ] || item.ownershipType
      ] = item.households;
    });

    return result;
  });

  // Calculate ward-wise ownership rates
  const wardWiseAnalysis = wardNumbers.map((wardNumber) => {
    const wardData = ownershipData.filter(
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
      { ownershipType: "", households: 0 },
    );

    const privateOwnership = wardData.find(
      (item) => item.ownershipType === "PRIVATE",
    );
    const privatePercentage =
      wardTotalHouseholds > 0 && privateOwnership
        ? (
            ((privateOwnership.households || 0) / wardTotalHouseholds) *
            100
          ).toFixed(2)
        : "0";

    return {
      wardNumber,
      totalHouseholds: wardTotalHouseholds,
      mostCommonType: mostCommonType.ownershipType,
      mostCommonTypeHouseholds: mostCommonType.households || 0,
      mostCommonTypePercentage:
        wardTotalHouseholds > 0
          ? (
              ((mostCommonType.households || 0) / wardTotalHouseholds) *
              100
            ).toFixed(2)
          : "0",
      privateHouseholds: privateOwnership?.households || 0,
      privatePercentage,
    };
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <HouseOwnershipSEO
        overallSummary={overallSummary}
        totalHouseholds={totalHouseholds}
        OWNERSHIP_TYPE_NAMES={OWNERSHIP_TYPE_NAMES}
        OWNERSHIP_TYPE_NAMES_EN={OWNERSHIP_TYPE_NAMES_EN}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/house-ownership.svg"
              width={1200}
              height={400}
              alt="घर स्वामित्वको वितरण - बुद्धशान्ति गाउँपालिका (House Ownership Distribution - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा घर स्वामित्वको वितरण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              घर स्वामित्वको आधारमा जनसंख्याको वर्गीकरण र विश्लेषण गर्दा थुप्रै
              आर्थिक तथा सामाजिक सूचकहरू प्राप्त हुन्छन्। यस खण्डमा बुद्धशान्ति
              गाउँपालिकामा घर स्वामित्वका प्रमुख प्रकारहरू र तिनको वडागत वितरणको
              विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              बुद्धशान्ति गाउँपालिकामा घर स्वामित्वको तथ्याङ्क हेर्दा, कुल
              घरधुरी {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
              मध्ये सबैभन्दा बढी {overallSummary[0]?.ownershipTypeName || ""}
              स्वामित्वमा{" "}
              {localizeNumber(
                (
                  ((overallSummary[0]?.households || 0) / totalHouseholds) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % घरहरू रहेका देखिन्छन्।
            </p>

            <h2
              id="house-ownership-types"
              className="scroll-m-20 border-b pb-2"
            >
              घर स्वामित्वका प्रकार
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा घर स्वामित्वका प्रमुख प्रकारहरू र तिनको
              वितरण निम्नानुसार रहेको छ:
            </p>
          </div>

          {/* Client component for charts */}
          <HouseOwnershipCharts
            overallSummary={overallSummary}
            totalHouseholds={totalHouseholds}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            ownershipData={ownershipData}
            wardWiseAnalysis={wardWiseAnalysis}
            OWNERSHIP_TYPE_NAMES={OWNERSHIP_TYPE_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="house-ownership-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              घर स्वामित्व विश्लेषण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा घर स्वामित्वको विश्लेषण गर्दा,
              {OWNERSHIP_TYPE_NAMES[overallSummary[0]?.ownershipType || ""] ||
                overallSummary[0]?.ownershipType}
              स्वामित्वमा रहेका घरहरू सबैभन्दा बढी
              {localizeNumber(
                (
                  ((overallSummary[0]?.households || 0) / totalHouseholds) *
                  100
                ).toFixed(2),
                "ne",
              )}
              % रहेको पाइन्छ।
            </p>

            <HouseOwnershipAnalysisSection
              overallSummary={overallSummary}
              totalHouseholds={totalHouseholds}
              wardWiseAnalysis={wardWiseAnalysis}
              OWNERSHIP_TYPE_NAMES={OWNERSHIP_TYPE_NAMES}
              OWNERSHIP_TYPE_NAMES_EN={OWNERSHIP_TYPE_NAMES_EN}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
