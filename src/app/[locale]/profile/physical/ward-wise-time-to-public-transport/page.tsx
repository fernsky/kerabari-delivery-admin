import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseTimeToPublicTransportCharts from "./_components/ward-wise-time-to-public-transport-charts";
import WardWiseTimeToPublicTransportAnalysisSection from "./_components/ward-wise-time-to-public-transport-analysis-section";
import WardWiseTimeToPublicTransportSEO from "./_components/ward-wise-time-to-public-transport-seo";
import { timeToPublicTransportOptions } from "@/server/api/routers/profile/physical/ward-wise-time-to-public-transport.schema";

// Time categories with display names and colors
const TIME_CATEGORIES = {
  UNDER_15_MIN: {
    name: "१५ मिनेटभित्र",
    nameEn: "Under 15 minutes",
    color: "#4285F4", // Blue
  },
  UNDER_30_MIN: {
    name: "३० मिनेटभित्र",
    nameEn: "Under 30 minutes",
    color: "#34A853", // Green
  },
  UNDER_1_HOUR: {
    name: "१ घण्टाभित्र",
    nameEn: "Under 1 hour",
    color: "#FBBC05", // Yellow
  },
  "1_HOUR_OR_MORE": {
    name: "१ घण्टाभन्दा बढी",
    nameEn: "1 hour or more",
    color: "#EA4335", // Red
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
    const timeToPublicTransportData =
      await api.profile.physical.wardWiseTimeToPublicTransport.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Group by ward number
    const wardGroups = timeToPublicTransportData.reduce(
      (acc: any, curr: any) => {
        acc[curr.wardNumber] = acc[curr.wardNumber] || [];
        acc[curr.wardNumber].push(curr);
        return acc;
      },
      {},
    );

    // Calculate ward totals and grand total
    let totalHouseholds = 0;
    let under15MinHouseholds = 0;
    let over1HourHouseholds = 0;

    Object.values(wardGroups).forEach((wardData: any) => {
      wardData.forEach((item: any) => {
        totalHouseholds += item.households;
        if (item.timeToPublicTransport === "UNDER_15_MIN") {
          under15MinHouseholds += item.households;
        }
        if (item.timeToPublicTransport === "1_HOUR_OR_MORE") {
          over1HourHouseholds += item.households;
        }
      });
    });

    // Calculate percentages for SEO description
    const under15MinPercentage = (
      (under15MinHouseholds / totalHouseholds) *
      100
    ).toFixed(2);
    const over1HourPercentage = (
      (over1HourHouseholds / totalHouseholds) *
      100
    ).toFixed(2);

    // Create rich keywords
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका सार्वजनिक यातायात पहुँच",
      "सार्वजनिक यातायात सेवा पहुँच",
      "वडागत सार्वजनिक यातायात दूरी",
      "सार्वजनिक यातायात पुग्न लाग्ने समय",
      `सार्वजनिक यातायात १५ मिनेटभित्र पुग्ने ${under15MinPercentage}%`,
      "सार्वजनिक यातायात पहुँच विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality public transport access",
      "Public transport facility access",
      "Ward-wise public transport distance",
      "Time to reach public transportation",
      `Public transport under 15 minutes ${under15MinPercentage}%`,
      "Public transport accessibility analysis",
    ];

    // Create description
    const descriptionNP = `बुद्धशान्ति गाउँपालिकामा सार्वजनिक यातायातसम्म पुग्ने समय सम्बन्धी विश्लेषण। कुल ${localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी मध्ये ${localizeNumber(under15MinPercentage, "ne")}% (${localizeNumber(under15MinHouseholds.toLocaleString(), "ne")}) घरधुरीले १५ मिनेटभित्र सार्वजनिक यातायात पुग्न सक्छन्।`;

    const descriptionEN = `Analysis of time taken to reach public transportation in Khajura Rural Municipality. Out of a total of ${totalHouseholds.toLocaleString()} households, ${under15MinPercentage}% (${under15MinHouseholds.toLocaleString()}) can reach public transport within 15 minutes.`;

    return {
      title: `सार्वजनिक यातायात पुग्न लाग्ने समय | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/physical/ward-wise-time-to-public-transport",
        languages: {
          en: "/en/profile/physical/ward-wise-time-to-public-transport",
          ne: "/ne/profile/physical/ward-wise-time-to-public-transport",
        },
      },
      openGraph: {
        title: `सार्वजनिक यातायात पुग्न लाग्ने समयको अवस्था | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `सार्वजनिक यातायात पुग्न लाग्ने समयको अवस्था | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "सार्वजनिक यातायात पुग्न लाग्ने समयको अवस्था | बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "वडा अनुसार सार्वजनिक यातायातमा पुग्न लाग्ने समयको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "सार्वजनिक यातायात पुग्न लाग्ने समयको वितरण",
    slug: "distribution-of-time-to-public-transport",
  },
  {
    level: 2,
    text: "वडा अनुसार सार्वजनिक यातायात पहुँच",
    slug: "ward-wise-public-transport-access",
  },
  {
    level: 2,
    text: "सार्वजनिक यातायात पहुँचको विश्लेषण",
    slug: "public-transport-access-analysis",
  },
  {
    level: 2,
    text: "यातायात पहुँच सुधार रणनीति",
    slug: "transport-access-improvement-strategy",
  },
];

export default async function WardWiseTimeToPublicTransportPage() {
  // Fetch all ward-wise time to public transport data using tRPC
  const timeToPublicTransportData =
    await api.profile.physical.wardWiseTimeToPublicTransport.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.physical.wardWiseTimeToPublicTransport.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Group by ward number
  const wardGroups = timeToPublicTransportData.reduce((acc: any, curr: any) => {
    acc[curr.wardNumber] = acc[curr.wardNumber] || [];
    acc[curr.wardNumber].push(curr);
    return acc;
  }, {});

  // Create a mapping of timeToPublicTransport to its human-readable name
  const timeMap: Record<string, string> = {};
  timeToPublicTransportOptions.forEach((option) => {
    timeMap[option.value] = option.label.split(" (")[0];
  });

  // Calculate totals by time category
  let totalHouseholds = 0;
  const timeCategoryTotals: Record<string, number> = {
    UNDER_15_MIN: 0,
    UNDER_30_MIN: 0,
    UNDER_1_HOUR: 0,
    "1_HOUR_OR_MORE": 0,
  };

  Object.values(wardGroups).forEach((wardData: any) => {
    wardData.forEach((item: any) => {
      // Add to total households
      totalHouseholds += item.households;

      // Add to time category totals
      if (timeCategoryTotals[item.timeToPublicTransport] !== undefined) {
        timeCategoryTotals[item.timeToPublicTransport] += item.households;
      }
    });
  });

  // Calculate percentages
  const timeCategoryPercentages: Record<string, number> = {};
  Object.keys(timeCategoryTotals).forEach((category) => {
    timeCategoryPercentages[category] = parseFloat(
      ((timeCategoryTotals[category] / totalHouseholds) * 100).toFixed(2),
    );
  });

  // Get unique ward numbers
  const wardNumbers = Object.keys(wardGroups)
    .map(Number)
    .sort((a, b) => a - b);

  // Process data for pie chart
  const pieChartData = Object.keys(TIME_CATEGORIES).map((categoryKey) => {
    return {
      name: TIME_CATEGORIES[categoryKey as keyof typeof TIME_CATEGORIES].name,
      nameEn:
        TIME_CATEGORIES[categoryKey as keyof typeof TIME_CATEGORIES].nameEn,
      value: timeCategoryTotals[categoryKey],
      percentage: timeCategoryPercentages[categoryKey].toFixed(2),
      color: TIME_CATEGORIES[categoryKey as keyof typeof TIME_CATEGORIES].color,
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

      // Calculate ward-level totals for each time category
      const wardTimeCategories: Record<string, number> = {};
      Object.keys(TIME_CATEGORIES).forEach((categoryKey) => {
        const category =
          TIME_CATEGORIES[categoryKey as keyof typeof TIME_CATEGORIES];
        const categoryTotal = wardData
          .filter((item: any) => item.timeToPublicTransport === categoryKey)
          .reduce((sum: number, item: any) => sum + item.households, 0);

        wardTimeCategories[category.name] = categoryTotal;
      });

      return {
        ward: `वडा ${wardNumber}`,
        wardNumber,
        ...wardTimeCategories,
        total: totalWardHouseholds,
      };
    })
    .filter(Boolean);

  // Find the ward with highest and lowest percentages of households that can access public transport quickly
  const wardQuickAccessPercentages = wardWiseData.map((ward: any) => {
    const quickAccessHouseholds =
      (ward[TIME_CATEGORIES.UNDER_15_MIN.name] || 0) +
      (ward[TIME_CATEGORIES.UNDER_30_MIN.name] || 0);
    const quickAccessPercentage = (quickAccessHouseholds / ward.total) * 100;
    return {
      wardNumber: ward.wardNumber,
      percentage: quickAccessPercentage,
    };
  });

  const bestAccessWard = [...wardQuickAccessPercentages].sort(
    (a, b) => b.percentage - a.percentage,
  )[0];
  const worstAccessWard = [...wardQuickAccessPercentages].sort(
    (a, b) => a.percentage - b.percentage,
  )[0];

  // Calculate accessibility index (0-100, higher is better)
  const accessibilityIndex =
    timeCategoryPercentages.UNDER_15_MIN * 1.0 +
    timeCategoryPercentages.UNDER_30_MIN * 0.75 +
    timeCategoryPercentages.UNDER_1_HOUR * 0.5 +
    timeCategoryPercentages["1_HOUR_OR_MORE"] * 0.25;

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WardWiseTimeToPublicTransportSEO
        timeToPublicTransportData={timeToPublicTransportData}
        totalHouseholds={totalHouseholds}
        timeCategoryTotals={timeCategoryTotals}
        timeCategoryPercentages={timeCategoryPercentages}
        bestAccessWard={bestAccessWard}
        worstAccessWard={worstAccessWard}
        TIME_CATEGORIES={TIME_CATEGORIES}
        wardNumbers={wardNumbers}
        accessibilityIndex={accessibilityIndex}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/public-transport-access.svg"
              width={1200}
              height={400}
              alt="सार्वजनिक यातायात पुग्न लाग्ने समय - बुद्धशान्ति गाउँपालिका (Time to Public Transport - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा सार्वजनिक यातायात पुग्न लाग्ने समयको
              अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              सार्वजनिक यातायातको पहुँच एक महत्वपूर्ण भौतिक सूचक हो जसले
              समुदायको आवागमन र सामाजिक-आर्थिक गतिविधिमा पहुँचको अवस्थालाई
              दर्शाउँछ। सार्वजनिक यातायातसम्म पुग्न लाग्ने समयको अध्ययनले
              स्थानीय जनताको गतिशीलता, बजार पहुँच, र सेवा सुविधाहरूमा पहुँचको
              अवस्था बुझ्न मद्दत पुर्‍याउँछ। यस खण्डमा बुद्धशान्ति गाउँपालिकाको
              विभिन्न वडाहरूमा सार्वजनिक यातायातसम्म पुग्न लाग्ने समयको विश्लेषण
              प्रस्तुत गरिएको छ।
            </p>
            <p>
              बुद्धशान्ति गाउँपालिकामा कुल{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी
              मध्ये
              {localizeNumber(
                timeCategoryPercentages.UNDER_15_MIN.toFixed(2),
                "ne",
              )}
              % घरधुरीले १५ मिनेटभित्र,
              {localizeNumber(
                timeCategoryPercentages.UNDER_30_MIN.toFixed(2),
                "ne",
              )}
              % घरधुरीले ३० मिनेटभित्र, र
              {localizeNumber(
                timeCategoryPercentages.UNDER_1_HOUR.toFixed(2),
                "ne",
              )}
              % घरधुरीले १ घण्टाभित्र सार्वजनिक यातायात पुग्न सक्छन्।
            </p>

            <h2
              id="distribution-of-time-to-public-transport"
              className="scroll-m-20 border-b pb-2"
            >
              सार्वजनिक यातायात पुग्न लाग्ने समयको वितरण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा सार्वजनिक यातायातसम्म पुग्न लाग्ने समयको
              वितरण निम्नानुसार रहेको छ:
            </p>
          </div>

          <WardWiseTimeToPublicTransportCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            totalHouseholds={totalHouseholds}
            timeCategoryTotals={timeCategoryTotals}
            timeMap={timeMap}
            timeCategoryPercentages={timeCategoryPercentages}
            wardWiseQuickAccess={wardQuickAccessPercentages}
            bestAccessWard={bestAccessWard}
            worstAccessWard={worstAccessWard}
            TIME_CATEGORIES={TIME_CATEGORIES}
            accessibilityIndex={accessibilityIndex}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="public-transport-access-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              सार्वजनिक यातायात पहुँचको विश्लेषण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा सार्वजनिक यातायात पहुँचको विश्लेषण गर्दा,
              समग्रमा
              {localizeNumber(
                timeCategoryPercentages.UNDER_30_MIN.toFixed(2),
                "ne",
              )}
              % घरधुरीले ३० मिनेटभित्र सार्वजनिक यातायात पुग्न सक्छन्। वडागत
              रूपमा हेर्दा वडा नं.{" "}
              {localizeNumber(bestAccessWard.wardNumber.toString(), "ne")} मा
              सबैभन्दा राम्रो यातायात पहुँच रहेको छ, जहाँ{" "}
              {localizeNumber(bestAccessWard.percentage.toFixed(2), "ne")}%
              घरधुरीहरूले ३० मिनेटभित्रै सार्वजनिक यातायात पुग्न सक्छन्।
            </p>

            <WardWiseTimeToPublicTransportAnalysisSection
              totalHouseholds={totalHouseholds}
              timeCategoryTotals={timeCategoryTotals}
              timeCategoryPercentages={timeCategoryPercentages}
              wardWiseQuickAccess={wardQuickAccessPercentages}
              bestAccessWard={bestAccessWard}
              worstAccessWard={worstAccessWard}
              TIME_CATEGORIES={TIME_CATEGORIES}
              accessibilityIndex={accessibilityIndex}
            />

            <h2
              id="transport-access-improvement-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              यातायात पहुँच सुधार रणनीति
            </h2>

            <p>
              बुद्धशान्ति गाउँपालिकामा सार्वजनिक यातायात पुग्न लाग्ने समयको
              तथ्याङ्क विश्लेषणबाट निम्न रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>सडक संजाल विस्तार:</strong>{" "}
                  {localizeNumber(
                    timeCategoryPercentages["1_HOUR_OR_MORE"].toFixed(2),
                    "ne",
                  )}
                  % घरधुरीहरूलाई सार्वजनिक यातायात पुग्न १ घण्टाभन्दा बढी समय
                  लाग्ने हुनाले त्यस्ता क्षेत्रहरूमा सडक संजालको विस्तार गर्ने र
                  ग्रामीण सडक सुधार कार्यक्रम संचालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>यातायात सेवा विस्तार:</strong> वडा नं.{" "}
                  {localizeNumber(worstAccessWard.wardNumber.toString(), "ne")}{" "}
                  मा सार्वजनिक यातायात पहुँचको अवस्था सबैभन्दा कमजोर रहेकोले
                  त्यस क्षेत्रमा नियमित सार्वजनिक यातायात सेवा विस्तार गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>सामुदायिक यातायात सहकारी प्रवर्द्धन:</strong>{" "}
                  सार्वजनिक यातायात सेवा कम पुगेका क्षेत्रहरूमा सामुदायिक सहकारी
                  यातायात सेवा संचालन गर्न प्रोत्साहन तथा अनुदान दिने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>बजार केन्द्र विकेन्द्रीकरण:</strong> दूरदराजका
                  क्षेत्रहरूमा स्थानीय बजार केन्द्रहरूको विकास गरी आधारभूत
                  सेवाहरू सहज रूपमा उपलब्ध गराउने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>अन्तर सडक संचार व्यवस्था:</strong> बस स्टप तथा साझा
                  यातायात बिन्दुहरूबाट विभिन्न बस्तीहरूसम्म पुग्ने कनेक्टिभिटी
                  सुधार गर्न सहायक मार्ग र पैदल मार्गहरूको विकास गर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी बुद्धशान्ति गाउँपालिकामा सार्वजनिक यातायात पुग्न लाग्ने समयको
              विश्लेषण र समग्र यातायात पहुँचको अध्ययनले पालिकामा भौतिक पूर्वाधार
              विकास, यातायात सेवा विस्तार र सुधारका लागि रणनीतिक योजना बनाउन
              महत्वपूर्ण भूमिका खेल्दछ। वडागत आवश्यकता र प्राथमिकताका आधारमा
              लक्षित कार्यक्रम र पूर्वाधार विकास गरेर सार्वजनिक यातायातको पहुँच
              सुधार गर्न सकिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
