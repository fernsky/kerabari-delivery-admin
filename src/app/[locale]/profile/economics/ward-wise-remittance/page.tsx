import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import RemittanceCharts from "./_components/remittance-charts";
import RemittanceAnalysisSection from "./_components/remittance-analysis-section";
import RemittanceSEO from "./_components/remittance-seo";

// Define the interface for total remittance data
interface TotalRemittanceData {
  totalSendingPopulation: number;
  highRemittanceSendingPopulation: number;
  mediumRemittanceSendingPopulation: number;
  lowRemittanceSendingPopulation: number;
  veryHighRemittanceSendingPopulation: number;
  totalEstimatedRemittance: number;
  highRemittancePercentage: string;
  mediumRemittancePercentage: string;
  lowRemittancePercentage: string;
  veryHighRemittancePercentage: string;
  averageRemittance: number;
  estimatedAnnualRemittanceCrores: string;
}

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define remittance amount group options directly from family.ts enum values
// Define remittance amount group options based on remittance_amount_group_enum
const remittanceAmountGroupOptions = [
  { value: "NO_REMITTANCE", label: "रेमिट्यान्स नभएको" },
  { value: "BELOW_50K", label: "५० हजारभन्दा कम" },
  { value: "RS_50K_TO_100K", label: "५० हजारदेखि १ लाखसम्म" },
  { value: "RS_100K_TO_200K", label: "१ लाखदेखि २ लाखसम्म" },
  { value: "RS_200K_TO_500K", label: "२ लाखदेखि ५ लाखसम्म" },
  { value: "ABOVE_500K", label: "५ लाखभन्दा बढी" },
];
// Define amount range mapping for analysis with Nepali labels based on provided enum
const AMOUNT_RANGE_MAP: Record<
  string,
  { min: number; max: number | null; color: string; label: string }
> = {
  NO_REMITTANCE: {
    min: 0,
    max: 0,
    color: "#95a5a6", // Gray
    label: "रेमिट्यान्स नभएको",
  },
  BELOW_50K: {
    min: 1,
    max: 49999,
    color: "#e74c3c", // Red
    label: "५० हजारभन्दा कम",
  },
  RS_50K_TO_100K: {
    min: 50000,
    max: 99999,
    color: "#e67e22", // Orange
    label: "५० हजारदेखि १ लाखसम्म",
  },
  RS_100K_TO_200K: {
    min: 100000,
    max: 199999,
    color: "#f39c12", // Yellow
    label: "१ लाखदेखि २ लाखसम्म",
  },
  RS_200K_TO_500K: {
    min: 200000,
    max: 499999,
    color: "#2ecc71", // Green
    label: "२ लाखदेखि ५ लाखसम्म",
  },
  ABOVE_500K: {
    min: 500000,
    max: null,
    color: "#8e44ad", // Purple
    label: "५ लाखभन्दा बढी",
  },
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const remittanceData =
      await api.profile.economics.wardWiseRemittance.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalSendingPopulation = remittanceData.reduce(
      (sum, item) => sum + (item.sendingPopulation || 0),
      0,
    );

    // Group by amount group and calculate totals
    const amountGroups: Record<string, number> = {};
    remittanceData.forEach((item) => {
      if (!amountGroups[item.amountGroup]) amountGroups[item.amountGroup] = 0;
      amountGroups[item.amountGroup] += item.sendingPopulation || 0;
    });

    // Find the most common remittance amount group
    let mostCommonAmountGroup = "";
    let mostCommonCount = 0;
    Object.entries(amountGroups).forEach(([group, count]) => {
      if (count > mostCommonCount) {
        mostCommonCount = count;
        mostCommonAmountGroup = group;
      }
    });

    const mostCommonPercentage =
      totalSendingPopulation > 0
        ? ((mostCommonCount / totalSendingPopulation) * 100).toFixed(2)
        : "0";

    // Find the label for the most common amount group
    const mostCommonAmountGroupLabel =
      remittanceAmountGroupOptions.find(
        (option) => option.value === mostCommonAmountGroup,
      )?.label || mostCommonAmountGroup;

    // Estimate total annual remittance (low estimate)
    let estimatedTotalRemittance = 0;
    Object.entries(amountGroups).forEach(([group, count]) => {
      const range = AMOUNT_RANGE_MAP[group];
      if (range) {
        // Use minimum of range for conservative estimate
        estimatedTotalRemittance += range.min * count;
      }
    });
    // Convert to crores
    const estimatedRemittanceCrores = (
      estimatedTotalRemittance / 10000000
    ).toFixed(2);

    // Create rich keywords with actual data
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका रेमिट्यान्स",
      "बुद्धशान्ति वडा अनुसार रेमिट्यान्स",
      "वैदेशिक रोजगारीबाट प्राप्त रेमिट्यान्स",
      `वार्षिक रेमिट्यान्स रु. ${localizeNumber(estimatedRemittanceCrores, "ne")} करोड`,
      mostCommonAmountGroupLabel,
      "रेमिट्यान्स वितरण",
      "आर्थिक विकास र रेमिट्यान्स",
      "रेमिट्यान्सको प्रयोग",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality remittance",
      "Ward-wise remittance in Khajura",
      "Remittance from foreign employment",
      `Annual remittance NPR ${estimatedRemittanceCrores} crore`,
      "Remittance distribution",
      "Economic development and remittance",
      "Utilization of remittance",
    ];

    // Create detailed description with actual data
    const descriptionNP = `बुद्धशान्ति गाउँपालिकाको वडा अनुसार रेमिट्यान्स वितरणको विश्लेषण। कुल ${localizeNumber(totalSendingPopulation.toString(), "ne")} जनाले वैदेशिक रोजगारीबाट रेमिट्यान्स पठाउँछन्, जसमध्ये ${localizeNumber(mostCommonPercentage, "ne")}% ले ${mostCommonAmountGroupLabel} पठाउँछन्। वार्षिक अनुमानित रेमिट्यान्स रकम रु. ${localizeNumber(estimatedRemittanceCrores, "ne")} करोड रहेको छ।`;

    const descriptionEN = `Analysis of ward-wise remittance distribution in Khajura Rural Municipality. Out of a total of ${totalSendingPopulation} individuals sending remittances from foreign employment, ${mostCommonPercentage}% send in the range of ${mostCommonAmountGroupLabel}. The estimated annual remittance amounts to NPR ${estimatedRemittanceCrores} crore.`;

    return {
      title: `वडा अनुसार रेमिट्यान्स वितरण | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-wise-remittance",
        languages: {
          en: "/en/profile/economics/ward-wise-remittance",
          ne: "/ne/profile/economics/ward-wise-remittance",
        },
      },
      openGraph: {
        title: `वडा अनुसार रेमिट्यान्स वितरण | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `वडा अनुसार रेमिट्यान्स वितरण | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "वडा अनुसार रेमिट्यान्स वितरण | बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार रेमिट्यान्स वितरणको विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "रेमिट्यान्स वितरण", slug: "remittance-distribution" },
  { level: 2, text: "वडा अनुसार रेमिट्यान्स", slug: "ward-wise-remittance" },
  { level: 2, text: "रेमिट्यान्स स्तरीकरण", slug: "remittance-categorization" },
  { level: 2, text: "आर्थिक प्रभाव", slug: "economic-impact" },
  { level: 2, text: "रेमिट्यान्स प्रयोग", slug: "remittance-utilization" },
  {
    level: 2,
    text: "निष्कर्ष र सुझावहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function WardWiseRemittancePage() {
  // Fetch all remittance data using tRPC
  const remittanceData =
    await api.profile.economics.wardWiseRemittance.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseRemittance.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for the page
  // First, let's get all the unique ward numbers
  const wardNumbers = Array.from(
    new Set(remittanceData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for overall summary
  const overallSummary = Object.entries(
    remittanceData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.amountGroup]) acc[item.amountGroup] = 0;
      acc[item.amountGroup] += item.sendingPopulation || 0;
      return acc;
    }, {}),
  )
    .map(([amountGroup, sendingPopulation]) => {
      const label =
        remittanceAmountGroupOptions.find(
          (option) => option.value === amountGroup,
        )?.label || amountGroup;

      return {
        amountGroup,
        amountGroupLabel: label,
        sendingPopulation,
        color: AMOUNT_RANGE_MAP[amountGroup]?.color || "#777",
      };
    })
    .sort((a, b) => {
      // Sort by the order in AMOUNT_RANGE_MAP (low to high amounts)
      const keysOrder = Object.keys(AMOUNT_RANGE_MAP);
      return (
        keysOrder.indexOf(a.amountGroup) - keysOrder.indexOf(b.amountGroup)
      );
    });

  // Calculate total sending population
  const totalSendingPopulation = overallSummary.reduce(
    (sum, item) => sum + item.sendingPopulation,
    0,
  );

  // Create data for pie chart
  const pieChartData = overallSummary.map((item) => ({
    name: item.amountGroupLabel,
    value: item.sendingPopulation,
    percentage: (
      (item.sendingPopulation / totalSendingPopulation) *
      100
    ).toFixed(2),
    amountGroup: item.amountGroup,
    color: item.color,
  }));

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = remittanceData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    // Calculate total sending population for this ward
    const wardTotalSendingPopulation = wardData.reduce(
      (sum, item) => sum + (item.sendingPopulation || 0),
      0,
    );

    // Prepare result with ward number and total
    const result: Record<string, any> = {
      ward: `वडा ${wardNumber}`,
      total: wardTotalSendingPopulation,
    };

    // Add amount groups
    wardData.forEach((item) => {
      const label =
        remittanceAmountGroupOptions.find(
          (option) => option.value === item.amountGroup,
        )?.label || item.amountGroup;

      result[label] = item.sendingPopulation;
    });

    return result;
  });

  // Calculate ward-wise remittance statistics
  const wardWiseAnalysis = wardNumbers
    .map((wardNumber) => {
      const wardData = remittanceData.filter(
        (item) => item.wardNumber === wardNumber,
      );

      const wardTotalSendingPopulation = wardData.reduce(
        (sum, item) => sum + (item.sendingPopulation || 0),
        0,
      );

      // Calculate most common amount group for this ward
      let mostCommonAmountGroup = "";
      let mostCommonCount = 0;

      wardData.forEach((item) => {
        if ((item.sendingPopulation || 0) > mostCommonCount) {
          mostCommonCount = item.sendingPopulation || 0;
          mostCommonAmountGroup = item.amountGroup;
        }
      });

      // Get label for most common amount group
      const mostCommonAmountGroupLabel =
        remittanceAmountGroupOptions.find(
          (option) => option.value === mostCommonAmountGroup,
        )?.label || mostCommonAmountGroup;

      // Calculate percentage of most common amount group
      const mostCommonPercentage =
        wardTotalSendingPopulation > 0
          ? ((mostCommonCount / wardTotalSendingPopulation) * 100).toFixed(2)
          : "0";

      // Calculate high remittance groups (200,000+)
      const highRemittanceGroups = ["RS_200K_TO_500K", "ABOVE_500K"];

      const highRemittanceSendingPopulation = wardData
        .filter((item) => highRemittanceGroups.includes(item.amountGroup))
        .reduce((sum, item) => sum + (item.sendingPopulation || 0), 0);

      const highRemittancePercentage =
        wardTotalSendingPopulation > 0
          ? (
              (highRemittanceSendingPopulation / wardTotalSendingPopulation) *
              100
            ).toFixed(2)
          : "0";

      // Calculate low remittance groups (under 100,000)
      const lowRemittanceGroups = ["BELOW_50K", "RS_50K_TO_100K"];

      const lowRemittanceSendingPopulation = wardData
        .filter((item) => lowRemittanceGroups.includes(item.amountGroup))
        .reduce((sum, item) => sum + (item.sendingPopulation || 0), 0);

      const lowRemittancePercentage =
        wardTotalSendingPopulation > 0
          ? (
              (lowRemittanceSendingPopulation / wardTotalSendingPopulation) *
              100
            ).toFixed(2)
          : "0";

      // Calculate medium remittance groups (100,000-200,000)
      const mediumRemittanceGroups = ["RS_100K_TO_200K"];

      const mediumRemittanceSendingPopulation = wardData
        .filter((item) => mediumRemittanceGroups.includes(item.amountGroup))
        .reduce((sum, item) => sum + (item.sendingPopulation || 0), 0);

      const mediumRemittancePercentage =
        wardTotalSendingPopulation > 0
          ? (
              (mediumRemittanceSendingPopulation / wardTotalSendingPopulation) *
              100
            ).toFixed(2)
          : "0";

      // Calculate very high remittance (500,000+)
      const veryHighRemittanceSendingPopulation = wardData
        .filter((item) => item.amountGroup === "ABOVE_500K")
        .reduce((sum, item) => sum + (item.sendingPopulation || 0), 0);

      const veryHighRemittancePercentage =
        wardTotalSendingPopulation > 0
          ? (
              (veryHighRemittanceSendingPopulation /
                wardTotalSendingPopulation) *
              100
            ).toFixed(2)
          : "0";

      // Calculate weighted average remittance for this ward
      let totalWeightedAmount = 0;
      wardData.forEach((item) => {
        const range = AMOUNT_RANGE_MAP[item.amountGroup];
        if (range) {
          // Use average of min and max for the range, or just min for "PLUS" category
          const averageAmount = range.max
            ? (range.min + range.max) / 2
            : range.min * 1.2; // For 500,000+ we'll estimate 20% higher than minimum

          totalWeightedAmount += averageAmount * (item.sendingPopulation || 0);
        }
      });

      const averageRemittance =
        wardTotalSendingPopulation > 0
          ? Math.round(totalWeightedAmount / wardTotalSendingPopulation)
          : 0;

      // Calculate estimated total annual remittance for this ward
      const estimatedAnnualRemittance =
        wardTotalSendingPopulation * averageRemittance;

      // Calculate remittance prosperity index (0-100)
      // Based on higher percentages of high remittance groups and average remittance amount
      const maxPossibleAverage = 600000; // A reasonable upper limit for average remittance
      const averageScore = Math.min(
        (averageRemittance / maxPossibleAverage) * 50,
        50,
      ); // 50% weight to average amount
      const highRemittanceScore = parseFloat(highRemittancePercentage) * 0.5; // 50% weight to high remittance percentage

      const prosperityIndex = Math.min(
        Math.round(averageScore + highRemittanceScore),
        100,
      );

      return {
        wardNumber,
        totalSendingPopulation: wardTotalSendingPopulation,
        mostCommonAmountGroup,
        mostCommonAmountGroupLabel,
        mostCommonCount,
        mostCommonPercentage,
        highRemittanceSendingPopulation,
        highRemittancePercentage,
        lowRemittanceSendingPopulation,
        lowRemittancePercentage,
        mediumRemittanceSendingPopulation,
        mediumRemittancePercentage,
        veryHighRemittanceSendingPopulation,
        veryHighRemittancePercentage,
        averageRemittance,
        estimatedAnnualRemittance,
        prosperityIndex,
      };
    })
    .sort((a, b) => b.totalSendingPopulation - a.totalSendingPopulation); // Sort by total population

  // Group remittance data by remittance level
  const remittanceLevelGroups = {
    low: ["BELOW_50K", "RS_50K_TO_100K"],
    medium: ["RS_100K_TO_200K"],
    high: ["RS_200K_TO_500K"],
    veryHigh: ["ABOVE_500K"],
  };

  const remittanceLevelData = Object.entries(remittanceLevelGroups).map(
    ([level, groups]) => {
      const totalPopulation = remittanceData
        .filter((item) => groups.includes(item.amountGroup))
        .reduce((sum, item) => sum + (item.sendingPopulation || 0), 0);

      return {
        level,
        levelLabel:
          level === "low"
            ? "न्यून रेमिट्यान्स"
            : level === "medium"
              ? "मध्यम रेमिट्यान्स"
              : level === "high"
                ? "उच्च रेमिट्यान्स"
                : "अत्यधिक रेमिट्यान्स",
        population: totalPopulation,
        percentage:
          totalSendingPopulation > 0
            ? ((totalPopulation / totalSendingPopulation) * 100).toFixed(2)
            : "0",
        color:
          level === "low"
            ? "#e74c3c"
            : level === "medium"
              ? "#f39c12"
              : level === "high"
                ? "#2ecc71"
                : "#8e44ad",
      };
    },
  );

  // Calculate remittance statistics for the entire municipality
  const totalData = wardWiseAnalysis.reduce<TotalRemittanceData>(
    (acc, ward) => {
      acc.totalSendingPopulation += ward.totalSendingPopulation;
      acc.highRemittanceSendingPopulation +=
        ward.highRemittanceSendingPopulation;
      acc.mediumRemittanceSendingPopulation +=
        ward.mediumRemittanceSendingPopulation;
      acc.lowRemittanceSendingPopulation += ward.lowRemittanceSendingPopulation;
      acc.veryHighRemittanceSendingPopulation +=
        ward.veryHighRemittanceSendingPopulation;
      acc.totalEstimatedRemittance += ward.estimatedAnnualRemittance;
      return acc;
    },
    {
      totalSendingPopulation: 0,
      highRemittanceSendingPopulation: 0,
      mediumRemittanceSendingPopulation: 0,
      lowRemittanceSendingPopulation: 0,
      veryHighRemittanceSendingPopulation: 0,
      totalEstimatedRemittance: 0,
      highRemittancePercentage: "0",
      mediumRemittancePercentage: "0",
      lowRemittancePercentage: "0",
      veryHighRemittancePercentage: "0",
      averageRemittance: 0,
      estimatedAnnualRemittanceCrores: "0",
    },
  );

  // Calculate percentages for municipality
  totalData.highRemittancePercentage =
    totalData.totalSendingPopulation > 0
      ? (
          (totalData.highRemittanceSendingPopulation /
            totalData.totalSendingPopulation) *
          100
        ).toFixed(2)
      : "0";

  totalData.mediumRemittancePercentage =
    totalData.totalSendingPopulation > 0
      ? (
          (totalData.mediumRemittanceSendingPopulation /
            totalData.totalSendingPopulation) *
          100
        ).toFixed(2)
      : "0";

  totalData.lowRemittancePercentage =
    totalData.totalSendingPopulation > 0
      ? (
          (totalData.lowRemittanceSendingPopulation /
            totalData.totalSendingPopulation) *
          100
        ).toFixed(2)
      : "0";

  totalData.veryHighRemittancePercentage =
    totalData.totalSendingPopulation > 0
      ? (
          (totalData.veryHighRemittanceSendingPopulation /
            totalData.totalSendingPopulation) *
          100
        ).toFixed(2)
      : "0";

  // Calculate average remittance for municipality
  totalData.averageRemittance =
    totalData.totalSendingPopulation > 0
      ? Math.round(
          totalData.totalEstimatedRemittance / totalData.totalSendingPopulation,
        )
      : 0;

  // Format total remittance in crores
  totalData.estimatedAnnualRemittanceCrores = (
    totalData.totalEstimatedRemittance / 10000000
  ).toFixed(2);

  // Format remittance groups for plotting
  const remittanceRangeData = overallSummary.map((item) => {
    // Map the amount group to a numeric range for the chart
    const range = AMOUNT_RANGE_MAP[item.amountGroup];
    let rangeLabel = "";

    if (range) {
      if (range.max) {
        rangeLabel = `${(range.min / 1000).toFixed(0)}-${(range.max / 1000).toFixed(0)}k`;
      } else {
        rangeLabel = `${(range.min / 1000).toFixed(0)}k+`;
      }
    }

    return {
      name: rangeLabel,
      value: item.sendingPopulation,
      amountGroup: item.amountGroup,
      label: item.amountGroupLabel,
      percentage: (
        (item.sendingPopulation / totalSendingPopulation) *
        100
      ).toFixed(2),
      color: item.color,
    };
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <RemittanceSEO
        overallSummary={overallSummary}
        totalSendingPopulation={totalSendingPopulation}
        AMOUNT_RANGE_MAP={AMOUNT_RANGE_MAP}
        wardNumbers={wardNumbers}
        totalData={totalData}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/remittance.svg"
              width={1200}
              height={400}
              alt="वडा अनुसार रेमिट्यान्स वितरण - बुद्धशान्ति गाउँपालिका (Ward-wise Remittance Distribution - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा वडा अनुसार रेमिट्यान्स वितरण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा वैदेशिक रोजगारीबाट प्राप्त हुने
              रेमिट्यान्स स्थानीय अर्थतन्त्रको महत्वपूर्ण हिस्सा हो। यो
              आम्दानीले गरिबी निवारण, जीवनस्तर सुधार र सामाजिक-आर्थिक विकासमा
              महत्वपूर्ण योगदान पुर्‍याएको छ। यस अध्ययनले वडागत रुपमा
              रेमिट्यान्सको वितरण, प्रयोग र प्रभावको विश्लेषण गरेको छ।
            </p>
            <p>
              बुद्धशान्ति गाउँपालिकाको रेमिट्यान्स सम्बन्धी तथ्याङ्क अनुसार, कुल{" "}
              {localizeNumber(totalSendingPopulation.toLocaleString(), "ne")}
              जनाले विभिन्न परिमाणमा रकम पठाउने गरेको पाइएको छ। यसमध्ये सबैभन्दा
              बढी{" "}
              {localizeNumber(
                parseFloat(
                  remittanceLevelData.find((d) => d.level === "medium")
                    ?.percentage || "0",
                ),
                "ne",
              )}
              % जनाले मध्यम स्तरको रेमिट्यान्स पठाउने गरेका छन्, भने{" "}
              {localizeNumber(
                parseFloat(
                  remittanceLevelData.find((d) => d.level === "veryHigh")
                    ?.percentage || "0",
                ),
                "ne",
              )}
              % जनाले रु. ५ लाखभन्दा बढी रेमिट्यान्स पठाउने गरेका छन्।
            </p>

            <h2
              id="remittance-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              रेमिट्यान्स वितरण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा रेमिट्यान्स पठाउने व्यक्तिहरूको वितरण र
              रकम परिमाण निम्नानुसार रहेको छ:
            </p>

            <ul>
              {remittanceLevelData.map((item, index) => (
                <li key={index}>
                  <strong>{item.levelLabel}</strong>: कुल{" "}
                  {localizeNumber(item.percentage, "ne")}% (
                  {localizeNumber(item.population.toLocaleString(), "ne")} जना)
                </li>
              ))}
            </ul>

            <p>
              माथिको तथ्याङ्क अनुसार, गाउँपालिकामा{" "}
              {localizeNumber(
                parseFloat(
                  remittanceLevelData.find((d) => d.level === "high")
                    ?.percentage || "0",
                ) +
                  parseFloat(
                    remittanceLevelData.find((d) => d.level === "veryHigh")
                      ?.percentage || "0",
                  ),
                "ne",
              )}
              % जनाले उच्च रेमिट्यान्स (रु. ३ लाखभन्दा बढी) पठाउने गरेका छन्,
              जुन नेपालको राष्ट्रिय औसत (२५%) भन्दा{" "}
              {parseFloat(
                remittanceLevelData.find((d) => d.level === "high")
                  ?.percentage || "0",
              ) +
                parseFloat(
                  remittanceLevelData.find((d) => d.level === "veryHigh")
                    ?.percentage || "0",
                ) >
              25
                ? "बढी"
                : "कम"}{" "}
              हो।
            </p>

            <p>
              सबैभन्दा बढी रेमिट्यान्स पठाउने समूह{" "}
              {
                overallSummary.sort(
                  (a, b) => b.sendingPopulation - a.sendingPopulation,
                )[0]?.amountGroupLabel
              }{" "}
              वर्गमा{" "}
              {localizeNumber(
                overallSummary
                  .sort((a, b) => b.sendingPopulation - a.sendingPopulation)[0]
                  ?.sendingPopulation.toLocaleString() || "0",
                "ne",
              )}{" "}
              जना रहेका छन्, जसले कुल रेमिट्यान्स पठाउनेको{" "}
              {localizeNumber(
                (
                  ((overallSummary.sort(
                    (a, b) => b.sendingPopulation - a.sendingPopulation,
                  )[0]?.sendingPopulation || 0) /
                    totalSendingPopulation) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % हिस्सा ओगटेको छ।
            </p>
          </div>

          {/* Client component for charts */}
          <RemittanceCharts
            overallSummary={overallSummary}
            totalSendingPopulation={totalSendingPopulation}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            remittanceData={remittanceData}
            wardWiseAnalysis={wardWiseAnalysis}
            remittanceLevelData={remittanceLevelData}
            remittanceRangeData={remittanceRangeData}
            AMOUNT_RANGE_MAP={AMOUNT_RANGE_MAP}
            remittanceAmountGroupOptions={remittanceAmountGroupOptions}
            totalData={totalData}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="economic-impact" className="scroll-m-20 border-b pb-2">
              आर्थिक प्रभाव
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा वार्षिक रु.{" "}
              {localizeNumber(totalData.estimatedAnnualRemittanceCrores, "ne")}{" "}
              करोड रेमिट्यान्स भित्रिने अनुमान गरिएको छ। यो रकम गाउँपालिकाको
              वार्षिक बजेटको तुलनामा उल्लेखनीय हो र स्थानीय अर्थतन्त्रमा
              महत्वपूर्ण योगदान पुर्‍याउँछ।
            </p>

            <p>
              प्रति व्यक्ति औसत रेमिट्यान्स रु.{" "}
              {localizeNumber(
                totalData.averageRemittance.toLocaleString(),
                "ne",
              )}{" "}
              रहेको छ, जुन राष्ट्रिय औसतभन्दा{" "}
              {totalData.averageRemittance > 300000 ? "बढी" : "कम"} हो। यो
              स्थानीय आर्थिक गतिविधिहरु, बचत र लगानीमा महत्वपूर्ण प्रभाव पार्दछ।
            </p>

            {/* <RemittanceAnalysisSection
              overallSummary={overallSummary}
              totalSendingPopulation={totalSendingPopulation}
              wardWiseAnalysis={wardWiseAnalysis}
              AMOUNT_RANGE_MAP={AMOUNT_RANGE_MAP}
              remittanceLevelData={remittanceLevelData}
              remittanceAmountGroupOptions={remittanceAmountGroupOptions}
              totalData={totalData}
            /> */}

            <h2
              id="conclusions-and-recommendations"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              निष्कर्ष र सुझावहरू
            </h2>

            <p>
              बुद्धशान्ति गाउँपालिकामा रेमिट्यान्सको अवस्था विश्लेषणबाट निम्न
              निष्कर्ष र सुझावहरू गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>रेमिट्यान्स उपयोगमा सुधार:</strong> रेमिट्यान्सको
                  उत्पादनशील प्रयोगका लागि वित्तीय साक्षरता कार्यक्रम र लगानी
                  परामर्श सेवा उपलब्ध गराउनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>वडागत लक्षित कार्यक्रम:</strong>{" "}
                  {wardWiseAnalysis
                    .sort(
                      (a, b) =>
                        b.highRemittanceSendingPopulation -
                        a.highRemittanceSendingPopulation,
                    )
                    .slice(0, 3)
                    .map((ward, i, arr) =>
                      i === arr.length - 1
                        ? `र वडा नं. ${localizeNumber(ward.wardNumber.toString(), "ne")}`
                        : `वडा नं. ${localizeNumber(ward.wardNumber.toString(), "ne")}, `,
                    )}
                  मा उच्च रेमिट्यान्स प्राप्त हुने हुनाले यी वडाहरूमा सामूहिक
                  लगानी प्रवर्द्धन कार्यक्रम संचालन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>न्यून रेमिट्यान्स क्षेत्रमा सहयोग:</strong>{" "}
                  {wardWiseAnalysis
                    .sort(
                      (a, b) =>
                        parseFloat(b.lowRemittancePercentage) -
                        parseFloat(a.lowRemittancePercentage),
                    )
                    .slice(0, 3)
                    .map((ward, i, arr) =>
                      i === arr.length - 1
                        ? `र वडा नं. ${localizeNumber(ward.wardNumber.toString(), "ne")}`
                        : `वडा नं. ${localizeNumber(ward.wardNumber.toString(), "ne")}, `,
                    )}
                  मा न्यून रेमिट्यान्स प्राप्त हुने परिवारका लागि सीपमूलक तालिम
                  र रोजगारी सिर्जना कार्यक्रम संचालन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>रेमिट्यान्स बैंकिङ्ग:</strong> औपचारिक वित्तीय
                  प्रणालीमार्फत रेमिट्यान्स प्राप्त गर्न बैंकिङ्ग सेवा विस्तार
                  गर्ने र सहज पहुँच सुनिश्चित गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>गाउँपालिका रेमिट्यान्स बोण्ड:</strong> रेमिट्यान्सलाई
                  पूर्वाधार विकासमा लगानी गर्न गाउँपालिकाले रेमिट्यान्स बोण्ड
                  जारी गर्न सक्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">६.</span>
                <div>
                  <strong>वैदेशिक रोजगारी सहायता केन्द्र:</strong> वैदेशिक
                  रोजगारीमा जानेहरूलाई उच्च पारिश्रमिक हुने देश र क्षेत्रमा जान
                  सहजीकरण गर्नुपर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              रेमिट्यान्सलाई स्थानीय अर्थतन्त्रको विकासमा प्रभावकारी ढङ्गले
              परिचालन गर्न सकेमा बुद्धशान्ति गाउँपालिकाको समृद्धि र आर्थिक
              स्थिरतामा महत्वपूर्ण योगदान पुग्न सक्नेछ। यसका लागि स्थानीय सरकार,
              वित्तीय संस्था र समुदायको सहकार्य आवश्यक छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
