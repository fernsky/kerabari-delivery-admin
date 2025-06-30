import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import TimeToFinancialOrganizationCharts from "./_components/time-to-financial-organization-charts";
import TimeToFinancialOrganizationAnalysisSection from "./_components/time-to-financial-organization-analysis-section";
import TimeToFinancialOrganizationSEO from "./_components/time-to-financial-organization-seo";

const TIME_TO_FINANCIAL_ORG_STATUS = {
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
  HOUR_OR_MORE: {
    name: "१ घण्टा वा बढी",
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
    const timeToFinancialOrgData =
      await api.profile.economics.wardWiseTimeToFinancialOrganization.getAll.query();
    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality

    // Group by ward number
    const wardGroups = timeToFinancialOrgData.reduce((acc: any, curr: any) => {
      acc[curr.wardNumber] = acc[curr.wardNumber] || [];
      acc[curr.wardNumber].push(curr);
      return acc;
    }, {});

    // Calculate ward totals and grand total
    let totalHouseholds = 0;
    let under15MinTotal = 0;
    let under30MinTotal = 0;
    let under1HourTotal = 0;
    let over1HourTotal = 0;

    Object.values(wardGroups).forEach((wardData: any) => {
      wardData.forEach((item: any) => {
        totalHouseholds += item.households;
        if (item.timeToFinancialOrganizationType === "UNDER_15_MIN") {
          under15MinTotal += item.households;
        } else if (item.timeToFinancialOrganizationType === "UNDER_30_MIN") {
          under30MinTotal += item.households;
        } else if (item.timeToFinancialOrganizationType === "UNDER_1_HOUR") {
          under1HourTotal += item.households;
        } else if (item.timeToFinancialOrganizationType === "1_HOUR_OR_MORE") {
          over1HourTotal += item.households;
        }
      });
    });

    // Calculate percentages for SEO description
    const under15MinPercentage = (
      (under15MinTotal / totalHouseholds) *
      100
    ).toFixed(2);
    const over1HourPercentage = (
      (over1HourTotal / totalHouseholds) *
      100
    ).toFixed(2);

    // Find ward with best financial access
    let bestAccessWard = "1";
    let bestAccessPercentage = 0;
    let worstAccessWard = "1";
    let worstAccessPercentage = 0;

    Object.entries(wardGroups).forEach(([ward, data]: [string, any]) => {
      const wardTotalHouseholds = data.reduce(
        (sum: number, item: any) => sum + item.households,
        0,
      );
      const under15MinHouseholds =
        data.find(
          (item: any) =>
            item.timeToFinancialOrganizationType === "UNDER_15_MIN",
        )?.households || 0;
      const over1HourHouseholds =
        data.find(
          (item: any) =>
            item.timeToFinancialOrganizationType === "1_HOUR_OR_MORE",
        )?.households || 0;

      const quickAccessPercentage =
        (under15MinHouseholds / wardTotalHouseholds) * 100;
      const slowAccessPercentage =
        (over1HourHouseholds / wardTotalHouseholds) * 100;

      if (quickAccessPercentage > bestAccessPercentage) {
        bestAccessPercentage = quickAccessPercentage;
        bestAccessWard = ward;
      }

      if (slowAccessPercentage > worstAccessPercentage) {
        worstAccessPercentage = slowAccessPercentage;
        worstAccessWard = ward;
      }
    });

    // Create rich keywords
    const keywordsNP = [
      "केराबारी गाउँपालिका वित्तीय पहुँच",
      "वित्तीय संस्थामा पुग्न लाग्ने समय",
      "वडागत वित्तीय पहुँच",
      "बैंकमा पुग्न लाग्ने समय",
      "वित्तीय समावेशिता",
      `वित्तीय संस्था पहुँच ${localizeNumber(under15MinPercentage, "ne")}%`,
      "वित्तीय सेवा समय विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality financial access",
      "Time to reach financial organizations",
      "Ward-wise financial access",
      "Time to reach banks",
      "Financial inclusion",
      `Financial organization access ${under15MinPercentage}%`,
      "Financial service time analysis",
    ];

    // Create description
    const descriptionNP = `केराबारी गाउँपालिकाको वडा अनुसार वित्तीय संस्थासम्मको पहुँचको विश्लेषण। कुल ${localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी मध्ये ${localizeNumber(under15MinPercentage, "ne")}% (${localizeNumber(under15MinTotal.toLocaleString(), "ne")}) घरधुरीले १५ मिनेटभित्र वित्तीय संस्था पुग्न सक्छन्। वडा ${localizeNumber(bestAccessWard, "ne")} मा सबैभन्दा राम्रो पहुँच छ, जहाँ ${localizeNumber(bestAccessPercentage.toFixed(2), "ne")}% घरधुरीले १५ मिनेट भित्र वित्तीय संस्था पुग्न सक्छन्।`;

    const descriptionEN = `Analysis of access to financial organizations across wards in Khajura Rural Municipality. Out of a total of ${totalHouseholds.toLocaleString()} households, ${under15MinPercentage}% (${under15MinTotal.toLocaleString()}) households can reach a financial institution within 15 minutes. Ward ${bestAccessWard} has the best access, where ${bestAccessPercentage.toFixed(2)}% households can reach a financial institution within 15 minutes.`;

    return {
      title: `वित्तीय संस्थामा पुग्न लाग्ने समय | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical:
          "/profile/economics/ward-wise-time-to-financial-organization",
        languages: {
          en: "/en/profile/economics/ward-wise-time-to-financial-organization",
          ne: "/ne/profile/economics/ward-wise-time-to-financial-organization",
        },
      },
      openGraph: {
        title: `वित्तीय संस्थामा पुग्न लाग्ने समय | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `वित्तीय संस्थामा पुग्न लाग्ने समय | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "वित्तीय संस्थामा पुग्न लाग्ने समय | केराबारी गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार वित्तीय संस्थामा पुग्ने समयको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "वित्तीय संस्थामा पुग्न लाग्ने समयको वितरण",
    slug: "distribution-of-time-to-financial-organization",
  },
  {
    level: 2,
    text: "वडा अनुसार वित्तीय पहुँच",
    slug: "ward-wise-financial-access",
  },
  {
    level: 2,
    text: "वित्तीय पहुँच विश्लेषण",
    slug: "financial-access-analysis",
  },
  {
    level: 2,
    text: "वित्तीय समावेशिता रणनीति",
    slug: "financial-inclusion-strategy",
  },
];

export default async function WardWiseTimeToFinancialOrganizationPage() {
  // Fetch all time to financial org data using tRPC
  const timeToFinancialOrgData =
    await api.profile.economics.wardWiseTimeToFinancialOrganization.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseTimeToFinancialOrganization.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Group by ward number
  const wardGroups = timeToFinancialOrgData.reduce((acc: any, curr: any) => {
    acc[curr.wardNumber] = acc[curr.wardNumber] || [];
    acc[curr.wardNumber].push(curr);
    return acc;
  }, {});

  // Calculate ward totals and grand total
  let totalHouseholds = 0;
  let under15MinTotal = 0;
  let under30MinTotal = 0;
  let under1HourTotal = 0;
  let over1HourTotal = 0;

  Object.values(wardGroups).forEach((wardData: any) => {
    wardData.forEach((item: any) => {
      totalHouseholds += item.households;
      if (item.timeToFinancialOrganizationType === "UNDER_15_MIN") {
        under15MinTotal += item.households;
      } else if (item.timeToFinancialOrganizationType === "UNDER_30_MIN") {
        under30MinTotal += item.households;
      } else if (item.timeToFinancialOrganizationType === "UNDER_1_HOUR") {
        under1HourTotal += item.households;
      } else if (item.timeToFinancialOrganizationType === "1_HOUR_OR_MORE") {
        over1HourTotal += item.households;
      }
    });
  });

  // Calculate percentages
  const under15MinPercentage = (
    (under15MinTotal / totalHouseholds) *
    100
  ).toFixed(2);
  const under30MinPercentage = (
    (under30MinTotal / totalHouseholds) *
    100
  ).toFixed(2);
  const under1HourPercentage = (
    (under1HourTotal / totalHouseholds) *
    100
  ).toFixed(2);
  const over1HourPercentage = (
    (over1HourTotal / totalHouseholds) *
    100
  ).toFixed(2);

  // Get unique ward numbers
  const wardNumbers = Object.keys(wardGroups)
    .map(Number)
    .sort((a, b) => a - b);

  // Process data for pie chart
  const pieChartData = [
    {
      name: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.name,
      value: under15MinTotal,
      percentage: under15MinPercentage,
      color: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.color,
    },
    {
      name: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.name,
      value: under30MinTotal,
      percentage: under30MinPercentage,
      color: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.color,
    },
    {
      name: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.name,
      value: under1HourTotal,
      percentage: under1HourPercentage,
      color: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.color,
    },
    {
      name: TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.name,
      value: over1HourTotal,
      percentage: over1HourPercentage,
      color: TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.color,
    },
  ];

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers
    .map((wardNumber) => {
      const wardData = wardGroups[wardNumber];

      if (!wardData) return null;

      const totalWardHouseholds = wardData.reduce(
        (sum: number, item: any) => sum + item.households,
        0,
      );
      const under15Min =
        wardData.find(
          (item: any) =>
            item.timeToFinancialOrganizationType === "UNDER_15_MIN",
        )?.households || 0;
      const under30Min =
        wardData.find(
          (item: any) =>
            item.timeToFinancialOrganizationType === "UNDER_30_MIN",
        )?.households || 0;
      const under1Hour =
        wardData.find(
          (item: any) =>
            item.timeToFinancialOrganizationType === "UNDER_1_HOUR",
        )?.households || 0;
      const over1Hour =
        wardData.find(
          (item: any) =>
            item.timeToFinancialOrganizationType === "1_HOUR_OR_MORE",
        )?.households || 0;

      return {
        ward: `वडा ${wardNumber}`,
        wardNumber,
        [TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.name]: under15Min,
        [TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.name]: under30Min,
        [TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.name]: under1Hour,
        [TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.name]: over1Hour,
        total: totalWardHouseholds,
        under15MinPercent:
          totalWardHouseholds > 0
            ? (under15Min / totalWardHouseholds) * 100
            : 0,
        under30MinPercent:
          totalWardHouseholds > 0
            ? (under30Min / totalWardHouseholds) * 100
            : 0,
        under1HourPercent:
          totalWardHouseholds > 0
            ? (under1Hour / totalWardHouseholds) * 100
            : 0,
        over1HourPercent:
          totalWardHouseholds > 0 ? (over1Hour / totalWardHouseholds) * 100 : 0,
      };
    })
    .filter(Boolean);

  // Calculate ward-wise financial access analysis
  const wardWiseAnalysis = wardWiseData
    .map((ward: any) => {
      return {
        wardNumber: ward?.wardNumber || 0,
        totalHouseholds: ward?.total || 0,
        under15MinHouseholds:
          ward?.[TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.name] || 0,
        under30MinHouseholds:
          ward?.[TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.name] || 0,
        under1HourHouseholds:
          ward?.[TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.name] || 0,
        over1HourHouseholds:
          ward?.[TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.name] || 0,
        under15MinPercent: ward?.under15MinPercent || 0,
        under30MinPercent: ward?.under30MinPercent || 0,
        under1HourPercent: ward?.under1HourPercent || 0,
        over1HourPercent: ward?.over1HourPercent || 0,
        quickAccessPercent:
          (ward?.under15MinPercent || 0) + (ward?.under30MinPercent || 0),
      };
    })
    .sort((a, b) => b.quickAccessPercent - a.quickAccessPercent);

  // Find wards with best and worst financial access
  const bestAccessWard = wardWiseAnalysis[0];
  const worstAccessWard = [...wardWiseAnalysis].sort(
    (a, b) => a.under15MinPercent - b.under15MinPercent,
  )[0];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <TimeToFinancialOrganizationSEO
        timeToFinancialOrgData={timeToFinancialOrgData}
        totalHouseholds={totalHouseholds}
        under15MinTotal={under15MinTotal}
        under30MinTotal={under30MinTotal}
        under1HourTotal={under1HourTotal}
        over1HourTotal={over1HourTotal}
        under15MinPercentage={parseFloat(under15MinPercentage)}
        under30MinPercentage={parseFloat(under30MinPercentage)}
        under1HourPercentage={parseFloat(under1HourPercentage)}
        over1HourPercentage={parseFloat(over1HourPercentage)}
        bestAccessWard={bestAccessWard}
        worstAccessWard={worstAccessWard}
        TIME_TO_FINANCIAL_ORG_STATUS={TIME_TO_FINANCIAL_ORG_STATUS}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/financial-access.svg"
              width={1200}
              height={400}
              alt="वित्तीय संस्थामा पुग्न लाग्ने समय - केराबारी गाउँपालिका (Time to Financial Organizations - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकामा वित्तीय संस्थासम्मको पहुँच
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              वित्तीय संस्थासम्मको पहुँच आर्थिक विकासको महत्वपूर्ण सूचक हो र
              यसले नागरिकको वित्तीय समावेशीता र सशक्तिकरणमा प्रत्यक्ष प्रभाव
              पार्दछ। यस खण्डमा केराबारी गाउँपालिकाको विभिन्न वडाहरूमा
              नागरिकले वित्तीय संस्थामा पुग्न लाग्ने समयको विश्लेषण प्रस्तुत
              गरिएको छ, जसले भविष्यको वित्तीय नीति निर्माणमा सहयोग पुर्याउने छ।
            </p>
            <p>
              केराबारी गाउँपालिकामा कुल{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")}{" "}
              घरधुरीमध्ये
              {localizeNumber(under15MinPercentage, "ne")}% अर्थात{" "}
              {localizeNumber(under15MinTotal.toLocaleString(), "ne")}
              घरधुरीले १५ मिनेटभित्र वित्तीय संस्था पुग्न सक्छन्,{" "}
              {localizeNumber(under30MinPercentage, "ne")}% अर्थात{" "}
              {localizeNumber(under30MinTotal.toLocaleString(), "ne")} घरधुरीले
              ३० मिनेटभित्र,
              {localizeNumber(under1HourPercentage, "ne")}% अर्थात{" "}
              {localizeNumber(under1HourTotal.toLocaleString(), "ne")}
              घरधुरीले १ घण्टाभित्र र{" "}
              {localizeNumber(over1HourPercentage, "ne")}% अर्थात
              {localizeNumber(over1HourTotal.toLocaleString(), "ne")} घरधुरीलाई
              १ घण्टाभन्दा बढी समय लाग्छ।
            </p>

            <h2
              id="distribution-of-time-to-financial-organization"
              className="scroll-m-20 border-b pb-2"
            >
              वित्तीय संस्थामा पुग्न लाग्ने समयको वितरण
            </h2>
            <p>
              केराबारी गाउँपालिकामा वित्तीय संस्थामा पुग्न लाग्ने समयको वितरण
              निम्नानुसार रहेको छ:
            </p>
          </div>

          {/* Client component for charts */}
          <TimeToFinancialOrganizationCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            totalHouseholds={totalHouseholds}
            under15MinTotal={under15MinTotal}
            under30MinTotal={under30MinTotal}
            under1HourTotal={under1HourTotal}
            over1HourTotal={over1HourTotal}
            under15MinPercentage={parseFloat(under15MinPercentage)}
            under30MinPercentage={parseFloat(under30MinPercentage)}
            under1HourPercentage={parseFloat(under1HourPercentage)}
            over1HourPercentage={parseFloat(over1HourPercentage)}
            wardWiseAnalysis={wardWiseAnalysis}
            bestAccessWard={bestAccessWard}
            worstAccessWard={worstAccessWard}
            TIME_TO_FINANCIAL_ORG_STATUS={TIME_TO_FINANCIAL_ORG_STATUS}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="financial-access-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              वित्तीय पहुँच विश्लेषण
            </h2>
            <p>
              केराबारी गाउँपालिकामा वित्तीय संस्थामा पुग्ने समयको विश्लेषण
              गर्दा, समग्रमा
              {localizeNumber(under15MinPercentage, "ne")}% घरधुरीहरू १५
              मिनेटभित्र र{localizeNumber(under30MinPercentage, "ne")}%
              घरधुरीहरू ३० मिनेटभित्र वित्तीय संस्था पुग्न सक्छन्। वडागत रूपमा
              हेर्दा वडा नं.{" "}
              {localizeNumber(bestAccessWard.wardNumber.toString(), "ne")} मा
              सबैभन्दा राम्रो पहुँच छ, जहाँ{" "}
              {localizeNumber(
                bestAccessWard.under15MinPercent.toFixed(2),
                "ne",
              )}
              % घरधुरीहरू १५ मिनेटभित्र वित्तीय संस्था पुग्न सक्छन्।
            </p>

            <TimeToFinancialOrganizationAnalysisSection
              totalHouseholds={totalHouseholds}
              under15MinTotal={under15MinTotal}
              under30MinTotal={under30MinTotal}
              under1HourTotal={under1HourTotal}
              over1HourTotal={over1HourTotal}
              under15MinPercentage={parseFloat(under15MinPercentage)}
              under30MinPercentage={parseFloat(under30MinPercentage)}
              under1HourPercentage={parseFloat(under1HourPercentage)}
              over1HourPercentage={parseFloat(over1HourPercentage)}
              wardWiseAnalysis={wardWiseAnalysis}
              bestAccessWard={bestAccessWard}
              worstAccessWard={worstAccessWard}
              TIME_TO_FINANCIAL_ORG_STATUS={TIME_TO_FINANCIAL_ORG_STATUS}
            />

            <h2
              id="financial-inclusion-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              वित्तीय समावेशिता रणनीति
            </h2>

            <p>
              केराबारी गाउँपालिकामा वित्तीय संस्थामा पुग्न लाग्ने समयको
              तथ्याङ्क विश्लेषणबाट निम्न रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>वित्तीय संस्थाहरूको विस्तार:</strong>{" "}
                  {localizeNumber(over1HourPercentage, "ne")}% घरधुरीलाई वित्तीय
                  संस्था पुग्न १ घण्टाभन्दा बढी लाग्ने भएकाले त्यस्ता क्षेत्रमा
                  वित्तीय संस्थाहरू स्थापना गर्न प्रोत्साहन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>डिजिटल वित्तीय सेवा:</strong> मोबाइल बैंकिङ, इन्टरनेट
                  बैंकिङ र एजेन्ट बैंकिङ जस्ता डिजिटल वित्तीय सेवाहरू विस्तार
                  गरी भौगोलिक पहुँचको समस्या समाधान गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>वित्तीय साक्षरता कार्यक्रम:</strong> विशेष गरी वडा नं.{" "}
                  {localizeNumber(worstAccessWard.wardNumber.toString(), "ne")}
                  जस्ता न्यून पहुँच भएका क्षेत्रमा वित्तीय साक्षरता कार्यक्रम
                  सञ्चालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>यातायात पूर्वाधार सुधार:</strong> वित्तीय संस्थामा
                  पुग्न लामो समय लाग्ने क्षेत्रहरूमा यातायात पूर्वाधार सुधार गरी
                  पहुँच सहज बनाउने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>विशेष वित्तीय उत्पादन:</strong> ग्रामीण क्षेत्रमा
                  बस्ने नागरिकहरूका लागि विशेष वित्तीय उत्पादन र सेवाहरू विकास
                  गर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी केराबारी गाउँपालिकामा वित्तीय संस्थामा पुग्न लाग्ने समयको
              वितरणको विश्लेषणले पालिकामा वित्तीय समावेशीकरणको अवस्था र भविष्यको
              रणनीति निर्माणमा महत्वपूर्ण भूमिका खेल्दछ। यसका लागि वडागत
              विशेषताहरूलाई ध्यानमा राखी वित्तीय सेवा विस्तारका कार्यक्रमहरू
              तर्जुमा गर्नु आवश्यक देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
