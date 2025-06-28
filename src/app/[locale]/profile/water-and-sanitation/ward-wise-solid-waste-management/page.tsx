import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseSolidWasteManagementCharts from "./_components/ward-wise-solid-waste-management-charts";
import WardWiseSolidWasteManagementAnalysisSection from "./_components/ward-wise-solid-waste-management-analysis-section";
import WardWiseSolidWasteManagementSEO from "./_components/ward-wise-solid-waste-management-seo";
import { solidWasteManagementOptions } from "@/server/api/routers/profile/water-and-sanitation/ward-wise-solid-waste-management.schema";

// Define colors for each waste management method
const WASTE_MANAGEMENT_COLORS = {
  HOME_COLLECTION: "#4285F4", // Blue
  WASTE_COLLECTING_PLACE: "#5E97F6", // Light Blue
  BURNING: "#34A853", // Green
  DIGGING: "#26C281", // Light Green
  COMPOST_MANURE: "#16A085", // Teal
  RIVER: "#EA4335", // Red
  ROAD_OR_PUBLIC_PLACE: "#FF6D01", // Orange
  OTHER: "#FBBC05", // Yellow
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
    const wardWiseSolidWasteManagementData =
      await api.profile.waterAndSanitation.wardWiseSolidWasteManagement.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Group by ward number
    const wardGroups = wardWiseSolidWasteManagementData.reduce(
      (acc: any, curr: any) => {
        acc[curr.wardNumber] = acc[curr.wardNumber] || [];
        acc[curr.wardNumber].push(curr);
        return acc;
      },
      {},
    );

    // Calculate ward totals and grand total
    let totalHouseholds = 0;
    let homeCollectionHouseholds = 0;

    Object.values(wardGroups).forEach((wardData: any) => {
      wardData.forEach((item: any) => {
        totalHouseholds += item.households;
        if (item.solidWasteManagement === "HOME_COLLECTION") {
          homeCollectionHouseholds += item.households;
        }
      });
    });

    // Calculate percentages for SEO description
    const homeCollectionPercentage = (
      (homeCollectionHouseholds / totalHouseholds) *
      100
    ).toFixed(2);

    // Create rich keywords
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका फोहोर व्यवस्थापन",
      "वडागत फोहोरमैला व्यवस्थापन",
      "घरमै फोहोर संकलन",
      `घरमै फोहोर संकलन ${homeCollectionPercentage}%`,
      "फोहोरमैला व्यवस्थापन विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality solid waste management",
      "Ward-wise solid waste management",
      "Home waste collection",
      `Home waste collection ${homeCollectionPercentage}%`,
      "Solid waste management analysis",
    ];

    // Create description
    const descriptionNP = `बुद्धशान्ति गाउँपालिकामा फोहोरमैला व्यवस्थापनको वडागत विश्लेषण। कुल ${localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी मध्ये ${localizeNumber(homeCollectionPercentage, "ne")}% (${localizeNumber(homeCollectionHouseholds.toLocaleString(), "ne")}) घरधुरीले घरमै फोहोर संकलन विधि प्रयोग गर्दछन्।`;

    const descriptionEN = `Ward-wise analysis of solid waste management in Khajura Rural Municipality. Out of a total of ${totalHouseholds.toLocaleString()} households, ${homeCollectionPercentage}% (${homeCollectionHouseholds.toLocaleString()}) households use home waste collection methods.`;

    return {
      title: `फोहोरमैला व्यवस्थापन | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical:
          "/profile/water-and-sanitation/ward-wise-solid-waste-management",
        languages: {
          en: "/en/profile/water-and-sanitation/ward-wise-solid-waste-management",
          ne: "/ne/profile/water-and-sanitation/ward-wise-solid-waste-management",
        },
      },
      openGraph: {
        title: `फोहोरमैला व्यवस्थापनको अवस्था | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `फोहोरमैला व्यवस्थापनको अवस्था | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "फोहोरमैला व्यवस्थापन | बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार फोहोरमैला व्यवस्थापनको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "फोहोरमैला व्यवस्थापनको वितरण",
    slug: "distribution-of-solid-waste-management",
  },
  {
    level: 2,
    text: "वडा अनुसार फोहोरमैला व्यवस्थापन",
    slug: "ward-wise-solid-waste-management",
  },
  {
    level: 2,
    text: "फोहोरमैला व्यवस्थापनको विश्लेषण",
    slug: "solid-waste-management-analysis",
  },
  {
    level: 2,
    text: "फोहोरमैला व्यवस्थापन सुधारका रणनीतिहरू",
    slug: "solid-waste-improvement-strategies",
  },
];

export default async function WardWiseSolidWasteManagementPage() {
  // Fetch all ward-wise solid waste management data using tRPC
  const wardWiseSolidWasteManagementData =
    await api.profile.waterAndSanitation.wardWiseSolidWasteManagement.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.waterAndSanitation.wardWiseSolidWasteManagement.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Group by ward number
  const wardGroups = wardWiseSolidWasteManagementData.reduce(
    (acc: any, curr: any) => {
      acc[curr.wardNumber] = acc[curr.wardNumber] || [];
      acc[curr.wardNumber].push(curr);
      return acc;
    },
    {},
  );

  // Create a mapping of waste management source to its human-readable name
  const sourceMap: Record<string, string> = {};
  solidWasteManagementOptions.forEach((option) => {
    sourceMap[option.value] = option.label.split(" (")[0];
  });

  // Calculate totals for each waste management method
  let totalHouseholds = 0;
  const wasteManagementTotals: Record<string, number> = {};

  Object.values(wardGroups).forEach((wardData: any) => {
    wardData.forEach((item: any) => {
      // Add to total households
      totalHouseholds += item.households;

      // Initialize if not exists
      if (!wasteManagementTotals[item.solidWasteManagement]) {
        wasteManagementTotals[item.solidWasteManagement] = 0;
      }

      // Add to source totals
      wasteManagementTotals[item.solidWasteManagement] += item.households;
    });
  });

  // Calculate percentages for each waste management method
  const wasteManagementPercentages: Record<string, number> = {};
  Object.keys(wasteManagementTotals).forEach((method) => {
    wasteManagementPercentages[method] = parseFloat(
      ((wasteManagementTotals[method] / totalHouseholds) * 100).toFixed(2),
    );
  });

  // Get unique ward numbers
  const wardNumbers = Object.keys(wardGroups)
    .map(Number)
    .sort((a, b) => a - b);

  // Process data for pie chart
  const pieChartData = Object.keys(wasteManagementTotals).map((methodKey) => {
    return {
      name: sourceMap[methodKey] || methodKey,
      nameEn: methodKey,
      value: wasteManagementTotals[methodKey],
      percentage: wasteManagementPercentages[methodKey].toFixed(2),
      color:
        WASTE_MANAGEMENT_COLORS[
          methodKey as keyof typeof WASTE_MANAGEMENT_COLORS
        ] || "#6B7280",
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

      // Calculate ward-level totals for each waste management method
      const wardWasteManagementTotals: Record<string, number> = {};
      wardData.forEach((item: any) => {
        const methodName =
          sourceMap[item.solidWasteManagement] || item.solidWasteManagement;
        wardWasteManagementTotals[methodName] =
          (wardWasteManagementTotals[methodName] || 0) + item.households;
      });

      return {
        ward: `वडा ${wardNumber}`,
        wardNumber,
        ...wardWasteManagementTotals,
        total: totalWardHouseholds,
      };
    })
    .filter(Boolean);

  // Find the ward with highest home collection percentage
  const wardHomeCollectionPercentages = wardWiseData.map((ward: any) => {
    const methodName = sourceMap["HOME_COLLECTION"] || "HOME_COLLECTION";
    const homeCollectionHouseholds = ward[methodName] || 0;
    const homeCollectionPercentage =
      (homeCollectionHouseholds / ward.total) * 100;
    return {
      wardNumber: ward.wardNumber,
      percentage: homeCollectionPercentage,
    };
  });

  const highestHomeCollectionWard = [...wardHomeCollectionPercentages].sort(
    (a, b) => b.percentage - a.percentage,
  )[0];
  const lowestHomeCollectionWard = [...wardHomeCollectionPercentages].sort(
    (a, b) => a.percentage - b.percentage,
  )[0];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WardWiseSolidWasteManagementSEO
        wardWiseSolidWasteManagementData={wardWiseSolidWasteManagementData}
        totalHouseholds={totalHouseholds}
        wasteManagementTotals={wasteManagementTotals}
        wasteManagementPercentages={wasteManagementPercentages}
        highestHomeCollectionWard={highestHomeCollectionWard}
        lowestHomeCollectionWard={lowestHomeCollectionWard}
        WASTE_MANAGEMENT_COLORS={WASTE_MANAGEMENT_COLORS}
        wardNumbers={wardNumbers}
        sourceMap={sourceMap}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/solid-waste-management.svg"
              width={1200}
              height={400}
              alt="फोहोरमैला व्यवस्थापन - बुद्धशान्ति गाउँपालिका (Solid Waste Management - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा फोहोरमैला व्यवस्थापनको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              फोहोरमैला व्यवस्थापनको अवस्था वातावरणीय स्वच्छता, सार्वजनिक
              स्वास्थ्य र समग्र जीवनस्तरको एक महत्वपूर्ण निर्धारक हो। यस खण्डमा
              बुद्धशान्ति गाउँपालिकाको विभिन्न वडाहरूमा फोहोरमैला व्यवस्थापन
              विधिहरूको प्रयोग र वितरणको विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              बुद्धशान्ति गाउँपालिकामा कुल{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरीहरू
              मध्ये
              {wasteManagementTotals.HOME_COLLECTION
                ? ` ${localizeNumber(wasteManagementPercentages.HOME_COLLECTION.toFixed(2), "ne")}% ले घरमै फोहोर संकलन,`
                : ""}
              {wasteManagementTotals.BURNING
                ? ` ${localizeNumber(wasteManagementPercentages.BURNING.toFixed(2), "ne")}% ले जलाउने,`
                : ""}
              {wasteManagementTotals.RIVER
                ? ` ${localizeNumber(wasteManagementPercentages.RIVER.toFixed(2), "ne")}% ले नदीमा बिसर्जन`
                : ""}
              जस्ता विधिहरू अपनाउँछन्।
            </p>

            <h2
              id="distribution-of-solid-waste-management"
              className="scroll-m-20 border-b pb-2"
            >
              फोहोरमैला व्यवस्थापनको वितरण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा फोहोरमैला व्यवस्थापनको वितरण निम्नानुसार
              रहेको छ:
            </p>
          </div>

          <WardWiseSolidWasteManagementCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            totalHouseholds={totalHouseholds}
            wasteManagementTotals={wasteManagementTotals}
            sourceMap={sourceMap}
            wasteManagementPercentages={wasteManagementPercentages}
            wardWiseHomeCollectionPercentage={wardHomeCollectionPercentages}
            highestHomeCollectionWard={highestHomeCollectionWard}
            lowestHomeCollectionWard={lowestHomeCollectionWard}
            WASTE_MANAGEMENT_COLORS={WASTE_MANAGEMENT_COLORS}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="solid-waste-management-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              फोहोरमैला व्यवस्थापनको विश्लेषण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा फोहोरमैला व्यवस्थापनको विश्लेषण गर्दा,
              समग्रमा
              {wasteManagementTotals.HOME_COLLECTION
                ? ` ${localizeNumber(wasteManagementPercentages.HOME_COLLECTION.toFixed(2), "ne")}% घरधुरीले घरमै फोहोर संकलन विधि अपनाउँछन्।`
                : ""}
              वडागत रूपमा हेर्दा वडा नं.{" "}
              {localizeNumber(
                highestHomeCollectionWard?.wardNumber.toString() || "",
                "ne",
              )}{" "}
              मा सबैभन्दा बढी{" "}
              {localizeNumber(
                highestHomeCollectionWard?.percentage.toFixed(2) || "",
                "ne",
              )}
              % घरधुरीले घरमै फोहोर संकलन प्रणाली प्रयोग गर्दछन्।
            </p>

            <WardWiseSolidWasteManagementAnalysisSection
              totalHouseholds={totalHouseholds}
              wasteManagementTotals={wasteManagementTotals}
              wasteManagementPercentages={wasteManagementPercentages}
              wardWiseHomeCollectionPercentage={wardHomeCollectionPercentages}
              highestHomeCollectionWard={highestHomeCollectionWard}
              lowestHomeCollectionWard={lowestHomeCollectionWard}
              WASTE_MANAGEMENT_COLORS={WASTE_MANAGEMENT_COLORS}
              sourceMap={sourceMap}
            />

            <h2
              id="solid-waste-improvement-strategies"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              फोहोरमैला व्यवस्थापन सुधारका रणनीतिहरू
            </h2>

            <p>
              बुद्धशान्ति गाउँपालिकामा फोहोरमैला व्यवस्थापनको तथ्याङ्क
              विश्लेषणबाट निम्न रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>घरमै फोहोर संकलन विस्तार:</strong> वडा नं.{" "}
                  {localizeNumber(
                    lowestHomeCollectionWard?.wardNumber.toString() || "",
                    "ne",
                  )}{" "}
                  जस्ता कम घरमै फोहोर संकलन भएका वडाहरूमा घर-घरमा फोहोर संकलन
                  सेवा विस्तार गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>कम्पोस्ट मल प्रवर्द्धन कार्यक्रम:</strong> घरायसी
                  स्तरमा जैविक फोहोरबाट कम्पोस्ट मल बनाउने तालिम र प्रविधि
                  प्रदान गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>अनुचित निष्कासन न्यूनीकरण अभियान:</strong> नदी, खोला र
                  सार्वजनिक स्थलमा फोहोर फाल्ने प्रवृत्ति न्यूनीकरण गर्न जनचेतना
                  कार्यक्रम सञ्चालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>वडास्तरीय फोहोर व्यवस्थापन समिति:</strong> हरेक वडामा
                  फोहोर व्यवस्थापन समिति गठन गरी सामुदायिक स्तरमा फोहोर
                  व्यवस्थापन प्रणाली बिकास गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>फोहोर छुट्याउने अभियान:</strong> घरधुरी स्तरमा फोहोर
                  छुट्याउने अभ्यास (जैविक, अजैविक र पुनः प्रयोग योग्य) शुरू गर्न
                  प्रोत्साहन र अभियान सञ्चालन गर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी बुद्धशान्ति गाउँपालिकामा फोहोरमैला व्यवस्थापनको विश्लेषणले
              पालिकामा फोहोरमैला व्यवस्थापन नीति निर्माण र कार्यक्रम तर्जुमा
              गर्न महत्वपूर्ण भूमिका खेल्दछ। वडागत आवश्यकता र विशेषताहरूलाई
              ध्यानमा राखी दिगो फोहोरमैला व्यवस्थापन प्रणाली स्थापना गर्न विशेष
              कार्यक्रमहरू सञ्चालन गर्नुपर्ने देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
