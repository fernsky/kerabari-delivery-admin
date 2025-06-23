import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import CooperativesCharts from "./_components/cooperatives-charts";
import CooperativesAnalysisSection from "./_components/cooperatives-analysis-section";
import CooperativesSEO from "./_components/cooperatives-seo";
import WardBasedCooperativesList from "./_components/ward-based-cooperatives-list";
import { cooperativeTypeOptions } from "@/server/api/routers/profile/economics/cooperatives.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period
export const revalidate = 86400; // Revalidate once per day

// Define English names for cooperative types (for SEO)
const COOPERATIVE_TYPES_EN: Record<string, string> = {
  SAVINGS_CREDIT: "Savings and Credit",
  MULTI_PURPOSE: "Multi-Purpose",
  AGRICULTURE: "Agriculture",
  DAIRY: "Dairy",
  COMMUNITY: "Community",
  WOMENS: "Women's",
  FARMERS: "Farmers",
  VEGETABLE: "Vegetable",
  OTHER: "Other",
};

// Define Nepali names for cooperative types
const COOPERATIVE_TYPES: Record<string, string> = cooperativeTypeOptions.reduce(
  (acc, option) => ({
    ...acc,
    [option.value]: option.label,
  }),
  {},
);

// Define colors for cooperative types
const COOPERATIVE_COLORS: Record<string, string> = {
  SAVINGS_CREDIT: "#27ae60", // Green for savings and credit
  MULTI_PURPOSE: "#9b59b6", // Purple for multi-purpose
  AGRICULTURE: "#e74c3c", // Red for agriculture
  DAIRY: "#3498db", // Blue for dairy
  COMMUNITY: "#f1c40f", // Yellow for community
  WOMENS: "#d35400", // Orange for women's
  FARMERS: "#c0392b", // Dark red for farmers
  VEGETABLE: "#16a085", // Teal for vegetable
  OTHER: "#95a5a6", // Light gray for other
};

// Icon types for cooperative types
const COOPERATIVE_ICONS: Record<string, string> = {
  SAVINGS_CREDIT: "💰",
  MULTI_PURPOSE: "🔄",
  AGRICULTURE: "🌾",
  DAIRY: "🥛",
  COMMUNITY: "🏘️",
  WOMENS: "👩",
  FARMERS: "🧑‍🌾",
  VEGETABLE: "🥬",
  OTHER: "🏢",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const cooperativesData =
      await api.profile.economics.cooperatives.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalCooperatives = cooperativesData.length;
    const cooperativeTypeCount = cooperativesData.reduce(
      (acc: Record<string, number>, item: { cooperativeType: string }) => {
        acc[item.cooperativeType] = (acc[item.cooperativeType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Find most common cooperative type
    let mostCommonCooperativeType = "";
    let mostCommonCount = 0;
    Object.entries(cooperativeTypeCount).forEach(([type, count]) => {
      const countValue = count as number;
      if (countValue > mostCommonCount) {
        mostCommonCount = countValue;
        mostCommonCooperativeType = type;
      }
    });

    const mostCommonCooperativeTypePercentage =
      (mostCommonCount / totalCooperatives) * 100;

    // Calculate ward distribution
    const wardDistribution = cooperativesData.reduce(
      (acc: Record<number, number>, item: { wardNumber: number }) => {
        acc[item.wardNumber] = (acc[item.wardNumber] || 0) + 1;
        return acc;
      },
      {},
    );

    // Find ward with most cooperatives
    let wardWithMostCooperatives = 0;
    let wardMaxCount = 0;
    Object.entries(wardDistribution).forEach(([ward, count]) => {
      if (Number(count) > wardMaxCount) {
        wardMaxCount = Number(count);
        wardWithMostCooperatives = Number(ward);
      }
    });

    // Create rich keywords with actual data
    const keywordsNP = [
      "गढवा गाउँपालिका सहकारी",
      "गढवा सहकारी संस्था",
      "पालिका स्तरीय सहकारी",
      "गढवा बचत तथा ऋण सहकारी",
      `गढवा ${COOPERATIVE_TYPES[mostCommonCooperativeType] || "सहकारी संस्था"}`,
      `वडा ${localizeNumber(wardWithMostCooperatives.toString(), "ne")} सहकारी`,
      `गढवा ${localizeNumber(totalCooperatives.toString(), "ne")} सहकारी संस्था`,
      "महिला सहकारी संस्था",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality cooperatives",
      "Khajura cooperative institutions",
      "Municipality-wide cooperatives",
      "Savings and credit cooperatives in Khajura",
      `${COOPERATIVE_TYPES_EN[mostCommonCooperativeType] || "Cooperatives"} in Khajura`,
      `Ward ${wardWithMostCooperatives} cooperatives`,
      `Khajura ${totalCooperatives} cooperative institutions`,
      "Women's cooperatives",
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकामा संचालित ${localizeNumber(totalCooperatives.toString(), "ne")} सहकारी संस्थाहरूको विस्तृत विश्लेषण। सबैभन्दा बढी ${COOPERATIVE_TYPES[mostCommonCooperativeType] || ""} संस्थाहरू (${localizeNumber(mostCommonCooperativeTypePercentage.toFixed(1), "ne")}%) रहेका छन्। वडा नं ${localizeNumber(wardWithMostCooperatives.toString(), "ne")} मा सबैभन्दा बढी ${localizeNumber(wardMaxCount.toString(), "ne")} सहकारी संस्थाहरू क्रियाशील छन्। पालिका स्तरीय सहकारी संस्थाहरूको विस्तृत जानकारी।`;

    const descriptionEN = `Detailed analysis of ${totalCooperatives} cooperative institutions operating in Khajura Rural Municipality. ${COOPERATIVE_TYPES_EN[mostCommonCooperativeType] || "Cooperatives"} are most common (${mostCommonCooperativeTypePercentage.toFixed(1)}%). Ward ${wardWithMostCooperatives} has the highest concentration with ${wardMaxCount} active cooperatives. Comprehensive information on municipality-wide cooperatives.`;

    return {
      title: `सहकारी संस्थाहरू | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/cooperatives",
        languages: {
          en: "/en/profile/economics/cooperatives",
          ne: "/ne/profile/economics/cooperatives",
        },
      },
      openGraph: {
        title: `सहकारी संस्थाहरू | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `सहकारी संस्थाहरू | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "सहकारी संस्थाहरू | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description: "पालिका स्तरीय सहकारी संस्थाहरूको विवरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "सहकारीको प्रकार र वितरण",
    slug: "cooperative-types-and-distribution",
  },
  { level: 2, text: "वडागत वितरण", slug: "ward-distribution" },
  { level: 2, text: "सहकारी प्रोफाइल", slug: "cooperative-profile" },
  { level: 2, text: "आर्थिक प्रभाव", slug: "economic-impact" },
  {
    level: 2,
    text: "चुनौती र अवसरहरू",
    slug: "challenges-and-opportunities",
  },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function CooperativesPage() {
  // Fetch all cooperatives data using tRPC
  const cooperativesData =
    await api.profile.economics.cooperatives.getAll.query();

  // Process data for overall summary
  type CooperativeSummaryType = {
    type: string;
    typeName: string;
    count: number;
    percentage: number;
    icon: string;
  };

  // Calculate cooperative type distribution
  const cooperativeTypeCount = cooperativesData.reduce(
    (acc: Record<string, number>, item: { cooperativeType: string }) => {
      acc[item.cooperativeType] = (acc[item.cooperativeType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalCooperatives = cooperativesData.length;

  // Create cooperative summary
  const cooperativeSummary: CooperativeSummaryType[] = Object.entries(
    cooperativeTypeCount,
  )
    .map(([type, count]) => {
      return {
        type,
        typeName: COOPERATIVE_TYPES[type] || type,
        count: count as number,
        percentage: ((count as number) / totalCooperatives) * 100,
        icon: COOPERATIVE_ICONS[type] || "🏢",
      };
    })
    .sort((a, b) => b.count - a.count); // Sort by count descending

  // Calculate ward distribution
  const wardDistribution = cooperativesData.reduce(
    (acc: Record<number, number>, item: { wardNumber: number }) => {
      acc[item.wardNumber] = (acc[item.wardNumber] || 0) + 1;
      return acc;
    },
    {},
  );

  // Organize cooperatives by ward
  type WardCooperativesType = {
    wardNumber: number;
    cooperativeCount: number;
    cooperatives: {
      id: string;
      cooperativeName: string;
      cooperativeType: string;
      typeName: string;
      phoneNumber: string;
      remarks: string;
      icon: string;
    }[];
  };

  const cooperativesByWard: WardCooperativesType[] = [];

  // Process all 9 wards (whether they have cooperatives or not)
  for (let ward = 1; ward <= 9; ward++) {
    const wardCooperatives = cooperativesData
      .filter((coop: { wardNumber: number }) => coop.wardNumber === ward)
      .map(
        (coop: {
          id: string;
          cooperativeName: string;
          cooperativeType: string;
          phoneNumber?: string;
          remarks?: string;
        }) => ({
          id: coop.id,
          cooperativeName: coop.cooperativeName,
          cooperativeType: coop.cooperativeType,
          typeName:
            COOPERATIVE_TYPES[coop.cooperativeType] || coop.cooperativeType,
          phoneNumber: coop.phoneNumber || "",
          remarks: coop.remarks || "",
          icon: COOPERATIVE_ICONS[coop.cooperativeType] || "🏢",
        }),
      );

    cooperativesByWard.push({
      wardNumber: ward,
      cooperativeCount: wardCooperatives.length,
      cooperatives: wardCooperatives,
    });
  }

  // Sort wards by cooperative count (descending)
  cooperativesByWard.sort((a, b) => b.cooperativeCount - a.cooperativeCount);

  // Find popular cooperative types by ward
  const popularCooperativeByWard = cooperativesByWard.map((ward) => {
    const cooperativeTypes = ward.cooperatives.reduce(
      (acc: Record<string, number>, coop) => {
        acc[coop.cooperativeType] = (acc[coop.cooperativeType] || 0) + 1;
        return acc;
      },
      {},
    );

    // Find most common cooperative type in this ward
    let mostCommonType = "";
    let maxCount = 0;

    Object.entries(cooperativeTypes).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonType = type;
      }
    });

    return {
      wardNumber: ward.wardNumber,
      mostCommonType,
      mostCommonTypeName: COOPERATIVE_TYPES[mostCommonType] || mostCommonType,
      count: maxCount,
      icon: COOPERATIVE_ICONS[mostCommonType] || "🏢",
    };
  });

  // Calculate statistics
  const statistics = {
    totalCooperatives,
    totalWards: Object.keys(wardDistribution).length,
    avgCooperativesPerWard: totalCooperatives / 9, // Khajura has 9 wards
    mostPopularCooperativeType:
      cooperativeSummary.length > 0 ? cooperativeSummary[0].type : "",
    mostPopularCooperativeTypeName:
      cooperativeSummary.length > 0 ? cooperativeSummary[0].typeName : "",
    mostPopularCooperativeTypePercentage:
      cooperativeSummary.length > 0 ? cooperativeSummary[0].percentage : 0,
    wardWithMostCooperatives:
      cooperativesByWard.length > 0 ? cooperativesByWard[0].wardNumber : 0,
    maximumCooperativesInAWard:
      cooperativesByWard.length > 0
        ? cooperativesByWard[0].cooperativeCount
        : 0,
    provinceLevelCooperatives: cooperativesData.filter(
      (coop: { remarks?: string }) => coop.remarks?.includes("प्रदेश स्तरीय"),
    ).length,
  };

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <CooperativesSEO
        cooperativeSummary={cooperativeSummary}
        totalCooperatives={totalCooperatives}
        cooperativesByWard={cooperativesByWard}
        COOPERATIVE_TYPES={COOPERATIVE_TYPES}
        COOPERATIVE_TYPES_EN={COOPERATIVE_TYPES_EN}
        statistics={statistics}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/cooperatives.svg"
              width={1200}
              height={400}
              alt="सहकारी संस्थाहरू - गढवा गाउँपालिका (Cooperative Institutions - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा सहकारी संस्थाहरू
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              सहकारी संस्थाहरू गढवा गाउँपालिकाको आर्थिक विकासमा महत्त्वपूर्ण
              भूमिका निर्वाह गरिरहेका छन्। बचत तथा ऋण, बहुउद्देश्यीय, कृषि,
              महिला, समुदायिक लगायतका विभिन्न प्रकारका सहकारी संस्थाहरू पालिका
              भरि क्रियाशील छन्।
            </p>
            <p>
              यी सहकारी संस्थाहरूले सदस्यहरूको आर्थिक र सामाजिक उन्नति गर्न,
              व्यवसायिक प्रवर्द्धन गर्न र स्थानीय अर्थतन्त्रलाई सबलीकरण गर्न
              महत्त्वपूर्ण भूमिका खेलेका छन्। यस पृष्ठमा गाउँपालिकामा संचालित
              विभिन्न प्रकारका सहकारी संस्थाहरूको विस्तृत विवरण र विश्लेषण
              प्रस्तुत गरिएको छ।
            </p>

            <p>
              गढवा गाउँपालिकामा कुल{" "}
              {localizeNumber(totalCooperatives.toString(), "ne")} सहकारी
              संस्थाहरू रहेका छन्। सबैभन्दा बढी{" "}
              {cooperativeSummary[0]?.typeName || ""}(
              {cooperativeSummary[0]?.icon || ""}) संस्थाहरू रहेका छन्, जसको
              संख्या{" "}
              {localizeNumber(
                cooperativeSummary[0]?.count.toString() || "0",
                "ne",
              )}{" "}
              (
              {localizeNumber(
                cooperativeSummary[0]?.percentage.toFixed(1) || "0",
                "ne",
              )}
              %) रहेको छ। यसमध्ये{" "}
              {localizeNumber(
                statistics.provinceLevelCooperatives.toString(),
                "ne",
              )}{" "}
              संस्थाहरू प्रदेश स्तरीय रहेका छन्।
            </p>

            <h2
              id="cooperative-types-and-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              सहकारीको प्रकार र वितरण
            </h2>
            <p>
              गढवा गाउँपालिकामा विभिन्न प्रकारका सहकारी संस्थाहरू संचालनमा
              छन्। मुख्य सहकारी प्रकार र तिनको वितरण निम्न अनुसार रहेको छ:
            </p>

            <ul>
              {cooperativeSummary.slice(0, 8).map((cooperative, index) => (
                <li key={index}>
                  <strong>
                    {cooperative.icon} {cooperative.typeName}
                  </strong>
                  : {localizeNumber(cooperative.count.toString(), "ne")} संस्था
                  ({localizeNumber(cooperative.percentage.toFixed(1), "ne")}%)
                </li>
              ))}
              {cooperativeSummary.length > 8 && (
                <li>
                  <strong>अन्य</strong>:{" "}
                  {localizeNumber(
                    (
                      totalCooperatives -
                      cooperativeSummary
                        .slice(0, 8)
                        .reduce((sum, item) => sum + item.count, 0)
                    ).toString(),
                    "ne",
                  )}{" "}
                  संस्था
                </li>
              )}
            </ul>
          </div>

          {/* Client component for charts */}
          <CooperativesCharts
            cooperativeSummary={cooperativeSummary}
            totalCooperatives={totalCooperatives}
            cooperativesByWard={cooperativesByWard}
            COOPERATIVE_TYPES={COOPERATIVE_TYPES}
            COOPERATIVE_COLORS={COOPERATIVE_COLORS}
            popularCooperativeByWard={popularCooperativeByWard}
            statistics={statistics}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="ward-distribution" className="scroll-m-20 border-b pb-2">
              वडागत वितरण
            </h2>
            <p>
              गढवा गाउँपालिकाका विभिन्न वडाहरूमा सहकारी संस्थाहरूको वितरण
              असमान रहेको छ। वडा नं.{" "}
              {localizeNumber(
                statistics.wardWithMostCooperatives.toString(),
                "ne",
              )}{" "}
              मा सबैभन्दा बढी{" "}
              {localizeNumber(
                statistics.maximumCooperativesInAWard.toString(),
                "ne",
              )}{" "}
              सहकारी संस्थाहरू रहेका छन्, जहाँ मुख्यतया{" "}
              {popularCooperativeByWard.find(
                (item) =>
                  item.wardNumber === statistics.wardWithMostCooperatives,
              )?.mostCommonTypeName || ""}{" "}
              प्रकारका सहकारीहरू संचालित छन्।
            </p>

            <p>
              गाउँपालिकाको औसतमा प्रत्येक वडामा{" "}
              {localizeNumber(
                statistics.avgCooperativesPerWard.toFixed(1),
                "ne",
              )}{" "}
              सहकारी संस्थाहरू क्रियाशील छन्। वडागत वितरण र तिनका प्रकारहरूको
              विस्तृत विवरण तल प्रस्तुत गरिएको छ।
            </p>
          </div>

          {/* Ward-based cooperatives list component */}
          <WardBasedCooperativesList
            cooperativesByWard={cooperativesByWard}
            COOPERATIVE_TYPES={COOPERATIVE_TYPES}
            COOPERATIVE_COLORS={COOPERATIVE_COLORS}
            COOPERATIVE_ICONS={COOPERATIVE_ICONS}
            statistics={statistics}
            popularCooperativeByWard={popularCooperativeByWard}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <CooperativesAnalysisSection
              cooperativeSummary={cooperativeSummary}
              totalCooperatives={totalCooperatives}
              cooperativesByWard={cooperativesByWard}
              COOPERATIVE_TYPES={COOPERATIVE_TYPES}
              COOPERATIVE_TYPES_EN={COOPERATIVE_TYPES_EN}
              COOPERATIVE_COLORS={COOPERATIVE_COLORS}
              statistics={statistics}
              popularCooperativeByWard={popularCooperativeByWard}
            />

            <h2
              id="challenges-and-opportunities"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              चुनौती र अवसरहरू
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold">मुख्य चुनौतीहरू</h3>
                <ul className="space-y-2 mt-4">
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <span>
                      <strong>कमजोर व्यवस्थापन:</strong> केही सहकारी संस्थाहरूमा
                      व्यवस्थापकीय क्षमताको कमी र अपर्याप्त सुशासन
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <span>
                      <strong>पूँजीको अभाव:</strong> सहकारी संस्थाहरूमा पर्याप्त
                      पूँजीको अभाव र लगानी क्षमता कम हुनु
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <span>
                      <strong>प्रविधिको प्रयोग:</strong> आधुनिक प्रविधिको
                      प्रयोगमा न्यूनता र डिजिटल साक्षरताको कमी
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    <span>
                      <strong>नियमन र अनुगमन:</strong> सहकारी संस्थाहरूको
                      प्रभावकारी नियमन र अनुगमनको कमी
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold">अवसरहरू</h3>
                <ul className="space-y-2 mt-4">
                  <li className="flex gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      <strong>डिजिटल सेवा विस्तार:</strong> प्रविधिमा आधारित
                      सहकारी सेवाहरूको विस्तार र डिजिटल कारोबार प्रवर्द्धन
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      <strong>उत्पादन क्षेत्रमा लगानी:</strong> कृषि र
                      उत्पादनमूलक क्षेत्रमा सहकारीको लगानी विस्तार
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      <strong>क्षमता विकास:</strong> सहकारी संस्थाका पदाधिकारी र
                      कर्मचारीहरूको क्षमता विकास
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-500">•</span>
                    <span>
                      <strong>एकीकृत सञ्जाल:</strong> सहकारीहरू बीचको सहकार्य र
                      एकीकृत सञ्जाल निर्माण
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <h2
              id="conclusions-and-recommendations"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              निष्कर्ष र सिफारिसहरू
            </h2>

            <p>
              गढवा गाउँपालिकामा सहकारी संस्थाहरूको अवस्थाको विश्लेषणबाट
              निम्न निष्कर्ष र सिफारिसहरू प्रस्तुत गरिएका छन्:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>क्षमता अभिवृद्धि:</strong> सहकारी संस्थाहरूको
                  व्यवस्थापकीय र प्राविधिक क्षमता अभिवृद्धिका लागि नियमित तालिम
                  र प्राविधिक सहयोगको व्यवस्था गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>प्रविधि प्रयोग:</strong> सहकारी संस्थाहरूमा आधुनिक
                  प्रविधिको प्रयोग र डिजिटल सेवाको विस्तार गरी सेवा प्रभावकारिता
                  बढाउनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>उत्पादनशील लगानी:</strong> सहकारी संस्थाहरूलाई
                  उत्पादनशील क्षेत्रमा लगानी गर्न प्रोत्साहन गर्ने नीति तथा
                  कार्यक्रमहरू ल्याउनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>समन्वय र एकीकरण:</strong> समान प्रकृतिका सहकारीहरू बीच
                  समन्वय र आवश्यकता अनुसार एकीकरणलाई प्रोत्साहन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>वडागत वितरण सन्तुलन:</strong> सहकारी संस्थाहरू कम भएका
                  वडाहरूमा सहकारी प्रवर्द्धन कार्यक्रमहरू संचालन गर्नुपर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              गढवा गाउँपालिकामा सहकारी संस्थाहरूको प्रभावकारी परिचालनले
              स्थानीय अर्थतन्त्रलाई बलियो बनाउन, वित्तीय सेवाको पहुँच बढाउन र
              स्थानीय उद्यमशीलता प्रवर्द्धन गर्न महत्त्वपूर्ण योगदान पुर्‍याउने
              निश्चित छ। यसका लागि स्थानीय सरकार, नियामक निकाय र सहकारी
              संस्थाहरू बीचको समन्वय र सहकार्यलाई थप प्रभावकारी बनाउन आवश्यक छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
