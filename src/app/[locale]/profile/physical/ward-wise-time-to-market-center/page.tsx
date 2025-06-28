import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseTimeToMarketCenterCharts from "./_components/ward-wise-time-to-market-center-charts";
import WardWiseTimeToMarketCenterAnalysisSection from "./_components/ward-wise-time-to-market-center-analysis-section";
import WardWiseTimeToMarketCenterSEO from "./_components/ward-wise-time-to-market-center-seo";
import { timeToMarketCenterOptions } from "@/server/api/routers/profile/physical/ward-wise-time-to-market-center.schema";

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
    const timeToMarketCenterData =
      await api.profile.physical.wardWiseTimeToMarketCenter.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Group by ward number
    const wardGroups = timeToMarketCenterData.reduce((acc: any, curr: any) => {
      acc[curr.wardNumber] = acc[curr.wardNumber] || [];
      acc[curr.wardNumber].push(curr);
      return acc;
    }, {});

    // Calculate ward totals and grand total
    let totalHouseholds = 0;
    let under15MinHouseholds = 0;
    let over1HourHouseholds = 0;

    Object.values(wardGroups).forEach((wardData: any) => {
      wardData.forEach((item: any) => {
        totalHouseholds += item.households;
        if (item.timeToMarketCenter === "UNDER_15_MIN") {
          under15MinHouseholds += item.households;
        }
        if (item.timeToMarketCenter === "1_HOUR_OR_MORE") {
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
      "बुद्धशान्ति गाउँपालिका बजार केन्द्र पहुँच",
      "बजार केन्द्र पहुँचको अवस्था",
      "वडागत बजार केन्द्र दूरी",
      "बजार केन्द्र पुग्न लाग्ने समय",
      `बजार केन्द्र १५ मिनेटभित्र पुग्ने ${under15MinPercentage}%`,
      "बजार केन्द्र पहुँच विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality market center access",
      "Market center accessibility",
      "Ward-wise market center distance",
      "Time to reach market center",
      `Market center under 15 minutes ${under15MinPercentage}%`,
      "Market center accessibility analysis",
    ];

    // Create description
    const descriptionNP = `बुद्धशान्ति गाउँपालिकामा बजार केन्द्रसम्म पुग्ने समय सम्बन्धी विश्लेषण। कुल ${localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी मध्ये ${localizeNumber(under15MinPercentage, "ne")}% (${localizeNumber(under15MinHouseholds.toLocaleString(), "ne")}) घरधुरीले १५ मिनेटभित्र बजार केन्द्र पुग्न सक्छन्।`;

    const descriptionEN = `Analysis of time taken to reach market centers in Khajura Rural Municipality. Out of a total of ${totalHouseholds.toLocaleString()} households, ${under15MinPercentage}% (${under15MinHouseholds.toLocaleString()}) can reach a market center within 15 minutes.`;

    return {
      title: `बजार केन्द्र पुग्न लाग्ने समय | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/physical/ward-wise-time-to-market-center",
        languages: {
          en: "/en/profile/physical/ward-wise-time-to-market-center",
          ne: "/ne/profile/physical/ward-wise-time-to-market-center",
        },
      },
      openGraph: {
        title: `बजार केन्द्र पुग्न लाग्ने समयको अवस्था | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `बजार केन्द्र पुग्न लाग्ने समयको अवस्था | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "बजार केन्द्र पुग्न लाग्ने समयको अवस्था | बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "वडा अनुसार बजार केन्द्रमा पुग्न लाग्ने समयको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "बजार केन्द्र पुग्न लाग्ने समयको वितरण",
    slug: "distribution-of-time-to-market-center",
  },
  {
    level: 2,
    text: "वडा अनुसार बजार केन्द्र पहुँच",
    slug: "ward-wise-market-center-access",
  },
  {
    level: 2,
    text: "बजार केन्द्र पहुँचको विश्लेषण",
    slug: "market-center-access-analysis",
  },
  {
    level: 2,
    text: "बजार पहुँच सुधार रणनीति",
    slug: "market-access-improvement-strategy",
  },
];

export default async function WardWiseTimeToMarketCenterPage() {
  // Fetch all ward-wise time to market center data using tRPC
  const timeToMarketCenterData =
    await api.profile.physical.wardWiseTimeToMarketCenter.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.physical.wardWiseTimeToMarketCenter.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Group by ward number
  const wardGroups = timeToMarketCenterData.reduce((acc: any, curr: any) => {
    acc[curr.wardNumber] = acc[curr.wardNumber] || [];
    acc[curr.wardNumber].push(curr);
    return acc;
  }, {});

  // Create a mapping of timeToMarketCenter to its human-readable name
  const timeMap: Record<string, string> = {};
  timeToMarketCenterOptions.forEach((option) => {
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
      if (timeCategoryTotals[item.timeToMarketCenter] !== undefined) {
        timeCategoryTotals[item.timeToMarketCenter] += item.households;
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
          .filter((item: any) => item.timeToMarketCenter === categoryKey)
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

  // Find the ward with highest and lowest percentages of households that can access market center quickly
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
      <WardWiseTimeToMarketCenterSEO
        timeToMarketCenterData={timeToMarketCenterData}
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
              src="/images/market-access.svg"
              width={1200}
              height={400}
              alt="बजार केन्द्र पुग्न लाग्ने समय - बुद्धशान्ति गाउँपालिका (Time to Market Center - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा बजार केन्द्र पुग्न लाग्ने समयको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              बजार केन्द्रको पहुँच एक महत्वपूर्ण भौतिक सूचक हो जसले समुदायको
              आवश्यक वस्तु र सेवामा पहुँचको अवस्थालाई दर्शाउँछ। बजार केन्द्रसम्म
              पुग्न लाग्ने समयको अध्ययनले स्थानीय जनताको दैनिक जीवनयापन,
              व्यापार-व्यवसाय र आर्थिक गतिविधिहरूमा पहुँचको अवस्था बुझ्न मद्दत
              पुर्‍याउँछ। यस खण्डमा बुद्धशान्ति गाउँपालिकाको विभिन्न वडाहरूमा
              बजार केन्द्रसम्म पुग्न लाग्ने समयको विस्तृत विश्लेषण प्रस्तुत
              गरिएको छ।
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
              % घरधुरीले १ घण्टाभित्र बजार केन्द्र पुग्न सक्छन्।
            </p>

            <h2
              id="distribution-of-time-to-market-center"
              className="scroll-m-20 border-b pb-2"
            >
              बजार केन्द्र पुग्न लाग्ने समयको वितरण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा बजार केन्द्रसम्म पुग्न लाग्ने समयको वितरण
              निम्नानुसार रहेको छ:
            </p>
          </div>

          <WardWiseTimeToMarketCenterCharts
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
              id="market-center-access-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              बजार केन्द्र पहुँचको विश्लेषण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा बजार केन्द्र पहुँचको विश्लेषण गर्दा,
              समग्रमा
              {localizeNumber(
                timeCategoryPercentages.UNDER_30_MIN.toFixed(2),
                "ne",
              )}
              % घरधुरीले ३० मिनेटभित्र बजार केन्द्र पुग्न सक्छन्। वडागत रूपमा
              हेर्दा वडा नं.{" "}
              {localizeNumber(bestAccessWard.wardNumber.toString(), "ne")} मा
              सबैभन्दा राम्रो बजार पहुँच रहेको छ, जहाँ{" "}
              {localizeNumber(bestAccessWard.percentage.toFixed(2), "ne")}%
              घरधुरीहरूले ३० मिनेटभित्रै बजार केन्द्र पुग्न सक्छन्।
            </p>

            <WardWiseTimeToMarketCenterAnalysisSection
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
              id="market-access-improvement-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              बजार पहुँच सुधार रणनीति
            </h2>

            <p>
              बुद्धशान्ति गाउँपालिकामा बजार केन्द्र पुग्न लाग्ने समयको तथ्याङ्क
              विश्लेषणबाट निम्न रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>स्थानीय बजार केन्द्र विकास:</strong>{" "}
                  {localizeNumber(
                    timeCategoryPercentages["1_HOUR_OR_MORE"].toFixed(2),
                    "ne",
                  )}
                  % घरधुरीहरूलाई बजार केन्द्र पुग्न १ घण्टाभन्दा बढी समय लाग्ने
                  हुनाले त्यस्ता क्षेत्रहरूमा स-साना स्थानीय बजार केन्द्रहरूको
                  विकास गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>सडक पूर्वाधार सुधार:</strong> वडा नं.{" "}
                  {localizeNumber(worstAccessWard.wardNumber.toString(), "ne")}{" "}
                  मा बजार केन्द्र पहुँचको अवस्था सबैभन्दा कमजोर रहेकोले त्यस
                  क्षेत्रमा सडक संजालको विस्तार र सुधार गर्ने तथा बजारसम्म
                  पुग्ने सडकको स्तरोन्नति गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>मोबाइल बजार सेवा प्रवर्द्धन:</strong> टाढाका
                  बस्तीहरूमा नियमित रूपमा मोबाइल बजार सेवा संचालन गरी आवश्यक
                  वस्तु तथा सेवाहरूको पहुँच सुनिश्चित गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>सामुदायिक बजार सहकारी प्रवर्द्धन:</strong> दूरदराजका
                  क्षेत्रहरूमा सामुदायिक सहकारी मार्फत आवश्यक वस्तुहरू सुपथ
                  मूल्यमा उपलब्ध गराउने संयन्त्र विकास गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>आधुनिक बजार पूर्वाधार विकास:</strong> मौजुदा बजार
                  केन्द्रहरूमा आधुनिक पूर्वाधार विकास, सडक सम्पर्क सुधार,
                  सार्वजनिक यातायात सेवा विस्तार गरी केन्द्रीय बजारको सेवा
                  प्रभावकारिता बढाउने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी बुद्धशान्ति गाउँपालिकामा बजार केन्द्र पुग्न लाग्ने समयको
              विश्लेषण र समग्र बजार पहुँचको अध्ययनले पालिकामा स्थानीय
              अर्थतन्त्रको विकास, बजार प्रणालीको सुदृढीकरण र आपूर्ति
              व्यवस्थापनका लागि रणनीतिक योजना बनाउन महत्वपूर्ण भूमिका खेल्दछ।
              वडागत आवश्यकता र प्राथमिकताका आधारमा लक्षित कार्यक्रम र पूर्वाधार
              विकास गरेर बजार केन्द्रहरूको पहुँच सुधार गर्न सकिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
