import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseFinancialAccountsCharts from "./_components/financial-accounts-charts";
import WardWiseFinancialAccountsAnalysisSection from "./_components/financial-accounts-analysis-section";
import WardWiseFinancialAccountsSEO from "./_components/financial-accounts-seo";

const FINANCIAL_ACCOUNT_TYPES = {
  BANK: {
    name: "बैङ्कमा (बाणिज्य/विकास) खाता भएको परिवार",
    nameEn: "Households with bank accounts",
    color: "#4285F4", // Blue
  },
  FINANCE: {
    name: "फाइनान्स",
    nameEn: "Finance company accounts",
    color: "#EA4335", // Red
  },
  MICRO_FINANCE: {
    name: "लघुवित्तमा खाता भएको परिवार",
    nameEn: "Households with microfinance accounts",
    color: "#FBBC05", // Yellow
  },
  COOPERATIVE: {
    name: "सहकारीमा खाता भएको परिवार",
    nameEn: "Households with cooperative accounts",
    color: "#34A853", // Green
  },
  NONE: {
    name: "बैँकमा खाता नभएको घरपरिवार",
    nameEn: "Households without bank accounts",
    color: "#9E9E9E", // Gray
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
    const wardWiseFinancialAccountsData =
      await api.profile.economics.wardWiseFinancialAccounts.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Group by ward number
    const wardGroups = wardWiseFinancialAccountsData.reduce(
      (acc: any, curr: any) => {
        acc[curr.wardNumber] = acc[curr.wardNumber] || [];
        acc[curr.wardNumber].push(curr);
        return acc;
      },
      {},
    );

    // Calculate ward totals and grand total
    let totalHouseholds = 0;
    let bankTotal = 0;
    let financeTotal = 0;
    let microfinanceTotal = 0;
    let cooperativeTotal = 0;
    let noAccountTotal = 0;

    Object.values(wardGroups).forEach((wardData: any) => {
      wardData.forEach((item: any) => {
        totalHouseholds += item.households;
        if (item.financialAccountType === "BANK") {
          bankTotal += item.households;
        } else if (item.financialAccountType === "FINANCE") {
          financeTotal += item.households;
        } else if (item.financialAccountType === "MICRO_FINANCE") {
          microfinanceTotal += item.households;
        } else if (item.financialAccountType === "COOPERATIVE") {
          cooperativeTotal += item.households;
        } else if (item.financialAccountType === "NONE") {
          noAccountTotal += item.households;
        }
      });
    });

    // Calculate percentages for SEO description
    const bankPercentage = ((bankTotal / totalHouseholds) * 100).toFixed(2);
    const noAccountPercentage = (
      (noAccountTotal / totalHouseholds) *
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
      const bankHouseholds =
        data.find((item: any) => item.financialAccountType === "BANK")
          ?.households || 0;
      const noAccountHouseholds =
        data.find((item: any) => item.financialAccountType === "NONE")
          ?.households || 0;

      const quickAccessPercentage =
        (bankHouseholds / wardTotalHouseholds) * 100;
      const slowAccessPercentage =
        (noAccountHouseholds / wardTotalHouseholds) * 100;

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
      "गढवा गाउँपालिका वित्तीय पहुँच",
      "वित्तीय खाताको वितरण",
      "वडागत वित्तीय पहुँच",
      "बैंकमा पहुँच",
      "वित्तीय समावेशिता",
      `वित्तीय पहुँच ${bankPercentage}%`,
      "वित्तीय सेवा विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality financial access",
      "Distribution of financial accounts",
      "Ward-wise financial access",
      "Access to banks",
      "Financial inclusion",
      `Financial access ${bankPercentage}%`,
      "Financial service analysis",
    ];

    // Create description
    const descriptionNP = `गढवा गाउँपालिकामा वित्तीय खाताहरूको वितरणको विश्लेषण। कुल ${localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी मध्ये ${localizeNumber(bankPercentage, "ne")}% (${localizeNumber(bankTotal.toLocaleString(), "ne")}) घरधुरीले बैंकमा पहुँच राख्छन्। वडा ${localizeNumber(bestAccessWard, "ne")} मा सबैभन्दा राम्रो पहुँच छ, जहाँ ${localizeNumber(bestAccessPercentage.toFixed(2), "ne")}% घरधुरीले १५ मिनेट भित्र वित्तीय संस्था पुग्न सक्छन्।`;

    const descriptionEN = `Analysis of the distribution of financial accounts in Khajura Rural Municipality. Out of a total of ${totalHouseholds.toLocaleString()} households, ${bankPercentage}% (${bankTotal.toLocaleString()}) households have access to a bank. Ward ${bestAccessWard} has the best access, where ${bestAccessPercentage.toFixed(2)}% of households can reach a financial institution within 15 minutes.`;

    return {
      title: `वित्तीय खाताको वितरण | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-wise-financial-accounts",
        languages: {
          en: "/en/profile/economics/ward-wise-financial-accounts",
          ne: "/ne/profile/economics/ward-wise-financial-accounts",
        },
      },
      openGraph: {
        title: `वित्तीय खाताको वितरण | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `वित्तीय खाताको वितरण | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "वित्तीय खाताको वितरण | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार वित्तीय खाताहरूको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "वित्तीय खाताको वितरण",
    slug: "distribution-of-financial-accounts",
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

export default async function WardWiseFinancialAccountsPage() {
  // Fetch all ward-wise financial accounts data using tRPC
  const wardWiseFinancialAccountsData =
    await api.profile.economics.wardWiseFinancialAccounts.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseFinancialAccounts.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Group by ward number
  const wardGroups = wardWiseFinancialAccountsData.reduce(
    (acc: any, curr: any) => {
      acc[curr.wardNumber] = acc[curr.wardNumber] || [];
      acc[curr.wardNumber].push(curr);
      return acc;
    },
    {},
  );

  // Calculate ward totals and grand total
  let totalHouseholds = 0;
  let bankTotal = 0;
  let financeTotal = 0;
  let microfinanceTotal = 0;
  let cooperativeTotal = 0;
  let noAccountTotal = 0;

  Object.values(wardGroups).forEach((wardData: any) => {
    wardData.forEach((item: any) => {
      totalHouseholds += item.households;
      if (item.financialAccountType === "BANK") {
        bankTotal += item.households;
      } else if (item.financialAccountType === "FINANCE") {
        financeTotal += item.households;
      } else if (item.financialAccountType === "MICRO_FINANCE") {
        microfinanceTotal += item.households;
      } else if (item.financialAccountType === "COOPERATIVE") {
        cooperativeTotal += item.households;
      } else if (item.financialAccountType === "NONE") {
        noAccountTotal += item.households;
      }
    });
  });

  // Calculate percentages
  const bankPercentage = ((bankTotal / totalHouseholds) * 100).toFixed(2);
  const financePercentage = ((financeTotal / totalHouseholds) * 100).toFixed(2);
  const microfinancePercentage = (
    (microfinanceTotal / totalHouseholds) *
    100
  ).toFixed(2);
  const cooperativePercentage = (
    (cooperativeTotal / totalHouseholds) *
    100
  ).toFixed(2);
  const noAccountPercentage = (
    (noAccountTotal / totalHouseholds) *
    100
  ).toFixed(2);

  // Get unique ward numbers
  const wardNumbers = Object.keys(wardGroups)
    .map(Number)
    .sort((a, b) => a - b);

  // Process data for pie chart
  const pieChartData = [
    {
      name: FINANCIAL_ACCOUNT_TYPES.BANK.name,
      value: bankTotal,
      percentage: bankPercentage,
      color: FINANCIAL_ACCOUNT_TYPES.BANK.color,
    },
    {
      name: FINANCIAL_ACCOUNT_TYPES.FINANCE.name,
      value: financeTotal,
      percentage: financePercentage,
      color: FINANCIAL_ACCOUNT_TYPES.FINANCE.color,
    },
    {
      name: FINANCIAL_ACCOUNT_TYPES.MICRO_FINANCE.name,
      value: microfinanceTotal,
      percentage: microfinancePercentage,
      color: FINANCIAL_ACCOUNT_TYPES.MICRO_FINANCE.color,
    },
    {
      name: FINANCIAL_ACCOUNT_TYPES.COOPERATIVE.name,
      value: cooperativeTotal,
      percentage: cooperativePercentage,
      color: FINANCIAL_ACCOUNT_TYPES.COOPERATIVE.color,
    },
    {
      name: FINANCIAL_ACCOUNT_TYPES.NONE.name,
      value: noAccountTotal,
      percentage: noAccountPercentage,
      color: FINANCIAL_ACCOUNT_TYPES.NONE.color,
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
      const bank =
        wardData.find((item: any) => item.financialAccountType === "BANK")
          ?.households || 0;
      const finance =
        wardData.find((item: any) => item.financialAccountType === "FINANCE")
          ?.households || 0;
      const microfinance =
        wardData.find(
          (item: any) => item.financialAccountType === "MICRO_FINANCE",
        )?.households || 0;
      const cooperative =
        wardData.find(
          (item: any) => item.financialAccountType === "COOPERATIVE",
        )?.households || 0;
      const noAccount =
        wardData.find((item: any) => item.financialAccountType === "NONE")
          ?.households || 0;

      return {
        ward: `वडा ${wardNumber}`,
        wardNumber,
        [FINANCIAL_ACCOUNT_TYPES.BANK.name]: bank,
        [FINANCIAL_ACCOUNT_TYPES.FINANCE.name]: finance,
        [FINANCIAL_ACCOUNT_TYPES.MICRO_FINANCE.name]: microfinance,
        [FINANCIAL_ACCOUNT_TYPES.COOPERATIVE.name]: cooperative,
        [FINANCIAL_ACCOUNT_TYPES.NONE.name]: noAccount,
        total: totalWardHouseholds,
        bankPercent:
          totalWardHouseholds > 0 ? (bank / totalWardHouseholds) * 100 : 0,
        financePercent:
          totalWardHouseholds > 0 ? (finance / totalWardHouseholds) * 100 : 0,
        microfinancePercent:
          totalWardHouseholds > 0
            ? (microfinance / totalWardHouseholds) * 100
            : 0,
        cooperativePercent:
          totalWardHouseholds > 0
            ? (cooperative / totalWardHouseholds) * 100
            : 0,
        noAccountPercent:
          totalWardHouseholds > 0 ? (noAccount / totalWardHouseholds) * 100 : 0,
      };
    })
    .filter(Boolean);

  // Calculate ward-wise financial access analysis
  const wardWiseAnalysis = wardWiseData
    .map((ward: any) => {
      return {
        wardNumber: ward?.wardNumber || 0,
        totalHouseholds: ward?.total || 0,
        bankHouseholds: ward?.[FINANCIAL_ACCOUNT_TYPES.BANK.name] || 0,
        financeHouseholds: ward?.[FINANCIAL_ACCOUNT_TYPES.FINANCE.name] || 0,
        microfinanceHouseholds:
          ward?.[FINANCIAL_ACCOUNT_TYPES.MICRO_FINANCE.name] || 0,
        cooperativeHouseholds:
          ward?.[FINANCIAL_ACCOUNT_TYPES.COOPERATIVE.name] || 0,
        noAccountHouseholds: ward?.[FINANCIAL_ACCOUNT_TYPES.NONE.name] || 0,
        bankPercent: ward?.bankPercent || 0,
        financePercent: ward?.financePercent || 0,
        microfinancePercent: ward?.microfinancePercent || 0,
        cooperativePercent: ward?.cooperativePercent || 0,
        noAccountPercent: ward?.noAccountPercent || 0,
        accountPercent:
          ward?.bankPercent +
          ward?.financePercent +
          ward?.microfinancePercent +
          ward?.cooperativePercent,
      };
    })
    .sort((a, b) => b.accountPercent - a.accountPercent);

  // Find wards with best and worst financial access
  const bestInclusionWard = wardWiseAnalysis[0];
  const worstInclusionWard = [...wardWiseAnalysis].sort(
    (a, b) => b.noAccountPercent - a.noAccountPercent,
  )[0];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WardWiseFinancialAccountsSEO
        financialAccountsData={wardWiseFinancialAccountsData}
        totalHouseholds={totalHouseholds}
        bankTotal={bankTotal}
        financeTotal={financeTotal}
        microfinanceTotal={microfinanceTotal}
        cooperativeTotal={cooperativeTotal}
        noAccountTotal={noAccountTotal}
        bankPercentage={parseFloat(bankPercentage)}
        financePercentage={parseFloat(financePercentage)}
        microfinancePercentage={parseFloat(microfinancePercentage)}
        cooperativePercentage={parseFloat(cooperativePercentage)}
        noAccountPercentage={parseFloat(noAccountPercentage)}
        bestInclusionWard={bestInclusionWard}
        worstInclusionWard={worstInclusionWard}
        FINANCIAL_ACCOUNT_TYPES={FINANCIAL_ACCOUNT_TYPES}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/financial-access.svg"
              width={1200}
              height={400}
              alt="वित्तीय खाताको वितरण - गढवा गाउँपालिका (Distribution of Financial Accounts - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा वित्तीय खाताहरूको वितरण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              वित्तीय खाताहरूको वितरण आर्थिक विकासको महत्वपूर्ण सूचक हो र यसले
              नागरिकको वित्तीय समावेशीता र सशक्तिकरणमा प्रत्यक्ष प्रभाव पार्दछ।
              यस खण्डमा गढवा गाउँपालिकाको विभिन्न वडाहरूमा नागरिकले वित्तीय
              खातामा पहुँच बनाउन लाग्ने समयको विश्लेषण प्रस्तुत गरिएको छ, जसले
              भविष्यको वित्तीय नीति निर्माणमा सहयोग पुर्याउने छ।
            </p>
            <p>
              गढवा गाउँपालिकामा कुल{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")}{" "}
              घरधुरीमध्ये
              {localizeNumber(bankPercentage, "ne")}% अर्थात{" "}
              {localizeNumber(bankTotal.toLocaleString(), "ne")}
              घरधुरीले बैंकमा पहुँच राख्छन्,{" "}
              {localizeNumber(financePercentage, "ne")}% अर्थात{" "}
              {localizeNumber(financeTotal.toLocaleString(), "ne")} घरधुरीले
              वित्तीय संस्थामा पहुँच राख्छन्।
            </p>

            <h2
              id="distribution-of-financial-accounts"
              className="scroll-m-20 border-b pb-2"
            >
              वित्तीय खाताको वितरण
            </h2>
            <p>
              गढवा गाउँपालिकामा वित्तीय खाताको वितरण निम्नानुसार रहेको छ:
            </p>
          </div>

          {/* Client component for charts */}
          <WardWiseFinancialAccountsCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            totalHouseholds={totalHouseholds}
            bankTotal={bankTotal}
            financeTotal={financeTotal}
            microfinanceTotal={microfinanceTotal}
            cooperativeTotal={cooperativeTotal}
            noAccountTotal={noAccountTotal}
            bankPercentage={parseFloat(bankPercentage)}
            financePercentage={parseFloat(financePercentage)}
            microfinancePercentage={parseFloat(microfinancePercentage)}
            cooperativePercentage={parseFloat(cooperativePercentage)}
            noAccountPercentage={parseFloat(noAccountPercentage)}
            wardWiseAnalysis={wardWiseAnalysis}
            bestInclusionWard={bestInclusionWard}
            worstInclusionWard={worstInclusionWard}
            FINANCIAL_ACCOUNT_TYPES={FINANCIAL_ACCOUNT_TYPES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="financial-access-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              वित्तीय पहुँच विश्लेषण
            </h2>
            <p>
              गढवा गाउँपालिकामा वित्तीय खाताहरूको विश्लेषण गर्दा, समग्रमा
              {localizeNumber(bankPercentage, "ne")}% घरधुरीहरू बैंकमा पहुँच
              राख्छन् र{localizeNumber(financePercentage, "ne")}% घरधुरीहरू
              वित्तीय संस्थामा पहुँच राख्छन्। वडागत रूपमा हेर्दा वडा नं.{" "}
              {localizeNumber(bestInclusionWard.wardNumber.toString(), "ne")} मा
              सबैभन्दा राम्रो पहुँच छ, जहाँ{" "}
              {localizeNumber(bestInclusionWard.bankPercent.toFixed(2), "ne")}%
              घरधुरीहरू १५ मिनेटभित्र वित्तीय संस्था पुग्न सक्छन्।
            </p>

            <WardWiseFinancialAccountsAnalysisSection
              totalHouseholds={totalHouseholds}
              bankTotal={bankTotal}
              financeTotal={financeTotal}
              microfinanceTotal={microfinanceTotal}
              cooperativeTotal={cooperativeTotal}
              noAccountTotal={noAccountTotal}
              bankPercentage={parseFloat(bankPercentage)}
              financePercentage={parseFloat(financePercentage)}
              microfinancePercentage={parseFloat(microfinancePercentage)}
              cooperativePercentage={parseFloat(cooperativePercentage)}
              noAccountPercentage={parseFloat(noAccountPercentage)}
              wardWiseAnalysis={wardWiseAnalysis}
              bestInclusionWard={bestInclusionWard}
              worstInclusionWard={worstInclusionWard}
              FINANCIAL_ACCOUNT_TYPES={FINANCIAL_ACCOUNT_TYPES}
            />

            <h2
              id="financial-inclusion-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              वित्तीय समावेशिता रणनीति
            </h2>

            <p>
              गढवा गाउँपालिकामा वित्तीय खाताहरूको वितरणको तथ्याङ्क
              विश्लेषणबाट निम्न रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>वित्तीय संस्थाहरूको विस्तार:</strong>{" "}
                  {localizeNumber(noAccountPercentage, "ne")}% घरधुरीलाई वित्तीय
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
                  {localizeNumber(
                    worstInclusionWard.wardNumber.toString(),
                    "ne",
                  )}
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
              यसरी गढवा गाउँपालिकामा वित्तीय खाताहरूको वितरणको विश्लेषणले
              पालिकामा वित्तीय समावेशीकरणको अवस्था र भविष्यको रणनीति निर्माणमा
              महत्वपूर्ण भूमिका खेल्दछ। यसका लागि वडागत विशेषताहरूलाई ध्यानमा
              राखी वित्तीय सेवा विस्तारका कार्यक्रमहरू तर्जुमा गर्नु आवश्यक
              देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
