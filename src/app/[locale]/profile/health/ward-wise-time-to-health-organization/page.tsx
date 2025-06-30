import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseTimeToHealthOrganizationCharts from "./_components/ward-wise-time-to-health-organization-charts";
import WardWiseTimeToHealthOrganizationAnalysisSection from "./_components/ward-wise-time-to-health-organization-analysis-section";
import WardWiseTimeToHealthOrganizationSEO from "./_components/ward-wise-time-to-health-organization-seo";
import { timeToHealthOrganizationOptions } from "@/server/api/routers/profile/health/ward-wise-time-to-health-organization.schema";

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
    const timeToHealthOrganizationData =
      await api.profile.health.wardWiseTimeToHealthOrganization.getAll.query();
    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality

    // Group by ward number
    const wardGroups = timeToHealthOrganizationData.reduce(
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
        if (item.timeToHealthOrganization === "UNDER_15_MIN") {
          under15MinHouseholds += item.households;
        }
        if (item.timeToHealthOrganization === "1_HOUR_OR_MORE") {
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
      "केराबारी गाउँपालिका स्वास्थ्य संस्था पहुँच",
      "स्वास्थ्य सेवा पहुँच",
      "वडागत स्वास्थ्य संस्था दूरी",
      "स्वास्थ्य संस्था पुग्न लाग्ने समय",
      `स्वास्थ्य संस्था १५ मिनेटभित्र पुग्ने ${under15MinPercentage}%`,
      "स्वास्थ्य संस्था पहुँच विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality healthcare access",
      "Healthcare facility access",
      "Ward-wise healthcare distance",
      "Time to reach health organizations",
      `Health facility under 15 minutes ${under15MinPercentage}%`,
      "Healthcare accessibility analysis",
    ];

    // Create description
    const descriptionNP = `केराबारी गाउँपालिकामा स्वास्थ्य संस्थासम्म पुग्ने समय सम्बन्धी विश्लेषण। कुल ${localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी मध्ये ${localizeNumber(under15MinPercentage, "ne")}% (${localizeNumber(under15MinHouseholds.toLocaleString(), "ne")}) घरधुरीले १५ मिनेटभित्र स्वास्थ्य संस्था पुग्न सक्छन्।`;

    const descriptionEN = `Analysis of time taken to reach healthcare facilities in Khajura Rural Municipality. Out of a total of ${totalHouseholds.toLocaleString()} households, ${under15MinPercentage}% (${under15MinHouseholds.toLocaleString()}) can reach a health facility within 15 minutes.`;

    return {
      title: `स्वास्थ्य संस्था पुग्न लाग्ने समय | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/health/ward-wise-time-to-health-organization",
        languages: {
          en: "/en/profile/health/ward-wise-time-to-health-organization",
          ne: "/ne/profile/health/ward-wise-time-to-health-organization",
        },
      },
      openGraph: {
        title: `स्वास्थ्य संस्था पुग्न लाग्ने समयको अवस्था | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `स्वास्थ्य संस्था पुग्न लाग्ने समयको अवस्था | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "स्वास्थ्य संस्था पुग्न लाग्ने समयको अवस्था | केराबारी गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "वडा अनुसार स्वास्थ्य संस्थामा पुग्न लाग्ने समयको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "स्वास्थ्य संस्था पुग्न लाग्ने समयको वितरण",
    slug: "distribution-of-time-to-health-organization",
  },
  {
    level: 2,
    text: "वडा अनुसार स्वास्थ्य संस्था पहुँच",
    slug: "ward-wise-health-organization-access",
  },
  {
    level: 2,
    text: "स्वास्थ्य संस्था पहुँचको विश्लेषण",
    slug: "health-organization-access-analysis",
  },
  {
    level: 2,
    text: "स्वास्थ्य सेवा पहुँच सुधार रणनीति",
    slug: "healthcare-access-improvement-strategy",
  },
];

export default async function WardWiseTimeToHealthOrganizationPage() {
  // Fetch all ward-wise time to health organization data using tRPC
  const timeToHealthOrganizationData =
    await api.profile.health.wardWiseTimeToHealthOrganization.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.health.wardWiseTimeToHealthOrganization.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Group by ward number
  const wardGroups = timeToHealthOrganizationData.reduce(
    (acc: any, curr: any) => {
      acc[curr.wardNumber] = acc[curr.wardNumber] || [];
      acc[curr.wardNumber].push(curr);
      return acc;
    },
    {},
  );

  // Create a mapping of timeToHealthOrganization to its human-readable name
  const timeMap: Record<string, string> = {};
  timeToHealthOrganizationOptions.forEach((option) => {
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
      if (timeCategoryTotals[item.timeToHealthOrganization] !== undefined) {
        timeCategoryTotals[item.timeToHealthOrganization] += item.households;
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
          .filter((item: any) => item.timeToHealthOrganization === categoryKey)
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

  // Find the ward with highest and lowest percentages of households that can access health facilities quickly
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
      <WardWiseTimeToHealthOrganizationSEO
        timeToHealthOrganizationData={timeToHealthOrganizationData}
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
              src="/images/health-facility-access.svg"
              width={1200}
              height={400}
              alt="स्वास्थ्य संस्था पुग्न लाग्ने समय - केराबारी गाउँपालिका (Time to Health Organization - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकामा स्वास्थ्य संस्था पुग्न लाग्ने समयको
              अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              स्वास्थ्य सेवाको पहुँच एक महत्वपूर्ण सामाजिक सूचक हो जसले समुदायको
              स्वास्थ्य सेवामा पहुँचको अवस्थालाई इंगित गर्दछ। स्वास्थ्य
              संस्थासम्म पुग्न लाग्ने समयको अध्ययनले स्वास्थ्य सेवाको विस्तार र
              स्थानीय जनताको पहुँचको अवस्था बुझ्न मद्दत पुर्‍याउँछ। यस खण्डमा
              केराबारी गाउँपालिकाको विभिन्न वडाहरूमा स्वास्थ्य संस्थासम्म
              पुग्न लाग्ने समयको विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              केराबारी गाउँपालिकामा कुल{" "}
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
              % घरधुरीले १ घण्टाभित्र स्वास्थ्य संस्था पुग्न सक्छन्।
            </p>

            <h2
              id="distribution-of-time-to-health-organization"
              className="scroll-m-20 border-b pb-2"
            >
              स्वास्थ्य संस्था पुग्न लाग्ने समयको वितरण
            </h2>
            <p>
              केराबारी गाउँपालिकामा स्वास्थ्य संस्थासम्म पुग्न लाग्ने समयको
              वितरण निम्नानुसार रहेको छ:
            </p>
          </div>

          <WardWiseTimeToHealthOrganizationCharts
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
              id="health-organization-access-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              स्वास्थ्य संस्था पहुँचको विश्लेषण
            </h2>
            <p>
              केराबारी गाउँपालिकामा स्वास्थ्य संस्था पहुँचको विश्लेषण गर्दा,
              समग्रमा
              {localizeNumber(
                timeCategoryPercentages.UNDER_30_MIN.toFixed(2),
                "ne",
              )}
              % घरधुरीले ३० मिनेटभित्र स्वास्थ्य संस्था पुग्न सक्छन्। वडागत
              रूपमा हेर्दा वडा नं.{" "}
              {localizeNumber(bestAccessWard.wardNumber.toString(), "ne")} मा
              सबैभन्दा राम्रो स्वास्थ्य पहुँच रहेको छ, जहाँ{" "}
              {localizeNumber(bestAccessWard.percentage.toFixed(2), "ne")}%
              घरधुरीहरूले ३० मिनेटभित्रै स्वास्थ्य संस्था पुग्न सक्छन्।
            </p>

            <WardWiseTimeToHealthOrganizationAnalysisSection
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
              id="healthcare-access-improvement-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              स्वास्थ्य सेवा पहुँच सुधार रणनीति
            </h2>

            <p>
              केराबारी गाउँपालिकामा स्वास्थ्य संस्था पुग्न लाग्ने समयको
              तथ्याङ्क विश्लेषणबाट निम्न रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>विकेन्द्रित स्वास्थ्य सेवा:</strong>{" "}
                  {localizeNumber(
                    timeCategoryPercentages["1_HOUR_OR_MORE"].toFixed(2),
                    "ne",
                  )}
                  % घरधुरीहरूलाई स्वास्थ्य संस्था पुग्न १ घण्टाभन्दा बढी समय
                  लाग्ने हुनाले त्यस्ता क्षेत्रहरूमा स्वास्थ्य इकाईहरू वा घुम्ती
                  स्वास्थ्य सेवा विस्तार गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>स्वास्थ्य पूर्वाधार सुधार:</strong> वडा नं.{" "}
                  {localizeNumber(worstAccessWard.wardNumber.toString(), "ne")}{" "}
                  मा स्वास्थ्य संस्थाको पहुँच सबैभन्दा कम देखिएकोले त्यहाँ थप
                  स्वास्थ्य संरचना निर्माण वा सेवा विस्तार गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>आपतकालीन स्वास्थ्य सेवा:</strong> दूरदराजका क्षेत्रका
                  लागि आपतकालीन उद्धार सेवा र एम्बुलेन्स सेवा सुनिश्चित गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>स्वास्थ्य प्रवर्द्धन कार्यक्रम:</strong> दूरदराजका
                  क्षेत्रहरूमा स्वास्थ्य शिविर तथा नियमित घरभेट कार्यक्रम
                  सञ्चालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>सडक संजालको सुधार:</strong> स्वास्थ्य संस्थासम्म
                  पुग्ने सडक संजाल विस्तार र सुधार गरी यात्रा समय कम गर्ने
                  रणनीति अपनाउने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी केराबारी गाउँपालिकामा स्वास्थ्य संस्था पुग्न लाग्ने समयको
              विश्लेषणले पालिकामा स्वास्थ्य सेवा विस्तार र स्वास्थ्य नीति
              निर्माण गर्न महत्वपूर्ण भूमिका खेल्दछ। वडागत आवश्यकता अनुसार
              लक्षित कार्यक्रम र पूर्वाधार विकास गरेर स्वास्थ्य सेवाको पहुँचमा
              सुधार ल्याउन आवश्यक छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
