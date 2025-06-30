import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import RemittanceExpensesCharts from "./_components/remittance-expenses-charts";
import RemittanceExpensesAnalysisSection from "./_components/remittance-expenses-analysis-section";
import RemittanceExpensesSEO from "./_components/remittance-expenses-seo";
import { api } from "@/trpc/server";
import {
  remittanceExpenseLabels,
  RemittanceExpenseType,
} from "@/server/api/routers/profile/economics/ward-wise-remittance-expenses.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define English expense names for SEO
const EXPENSE_NAMES_EN: Record<string, string> = {
  EDUCATION: "Education",
  HEALTH: "Healthcare",
  HOUSEHOLD_USE: "Household Expenses",
  FESTIVALS: "Festivals & Celebrations",
  LOAN_PAYMENT: "Loan Repayment",
  LOANED_OTHERS: "Money Loaned to Others",
  SAVING: "Savings",
  HOUSE_CONSTRUCTION: "House Construction",
  LAND_OWNERSHIP: "Land Purchase",
  JEWELRY_PURCHASE: "Jewelry Purchase",
  GOODS_PURCHASE: "Goods Purchase",
  BUSINESS_INVESTMENT: "Business Investment",
  OTHER: "Other Expenses",
  UNKNOWN: "Undisclosed",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const expensesData =
      await api.profile.economics.wardWiseRemittanceExpenses.getAll.query();
    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalHouseholds = expensesData.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    // Group by expense type and calculate totals
    const expenseCounts: Record<string, number> = {};
    expensesData.forEach((item) => {
      if (!expenseCounts[item.remittanceExpense])
        expenseCounts[item.remittanceExpense] = 0;
      expenseCounts[item.remittanceExpense] += item.households || 0;
    });

    // Get top 3 expense types for keywords
    const topExpenses = Object.entries(expenseCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    // Create rich keywords with actual data
    const keywordsNP = [
      "केराबारी गाउँपालिका रेमिट्यान्स खर्च",
      "केराबारी विप्रेषण उपयोग",
      `केराबारी ${remittanceExpenseLabels[topExpenses[0] as RemittanceExpenseType]} खर्च`,
      ...topExpenses.map(
        (r) =>
          `${remittanceExpenseLabels[r as RemittanceExpenseType]} केराबारी विप्रेषण`,
      ),
      "वडा अनुसार रेमिटेन्स खर्च",
      "विप्रेषण उपयोग तथ्याङ्क",
      "रेमिट्यान्स सर्वेक्षण केराबारी",
      `केराबारी विप्रेषण प्राप्त घरपरिवार संख्या ${totalHouseholds}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality remittance expenses",
      "Khajura remittance utilization",
      `Khajura ${EXPENSE_NAMES_EN[topExpenses[0] as RemittanceExpenseType]} expenses`,
      ...topExpenses.map(
        (r) =>
          `${EXPENSE_NAMES_EN[r as RemittanceExpenseType]} expenses in Khajura`,
      ),
      "Ward-wise remittance expenses",
      "Remittance utilization statistics",
      "Remittance survey Khajura",
      `Khajura households receiving remittance ${totalHouseholds}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `केराबारी गाउँपालिकाको वडा अनुसार रेमिट्यान्स (विप्रेषण) खर्च वितरण, प्रवृत्ति र विश्लेषण। कुल विप्रेषण प्राप्त घरपरिवार संख्या ${totalHouseholds} मध्ये ${remittanceExpenseLabels[topExpenses[0] as RemittanceExpenseType]} (${expenseCounts[topExpenses[0]]}) सबैभन्दा ठूलो समूह हो, त्यसपछि ${remittanceExpenseLabels[topExpenses[1] as RemittanceExpenseType]} (${expenseCounts[topExpenses[1]]}) र ${remittanceExpenseLabels[topExpenses[2] as RemittanceExpenseType]} (${expenseCounts[topExpenses[2]]})। विभिन्न विप्रेषण खर्च प्रकारहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Ward-wise remittance expense distribution, trends and analysis for Khajura Rural Municipality. Out of ${totalHouseholds} households receiving remittances, ${EXPENSE_NAMES_EN[topExpenses[0] as RemittanceExpenseType]} (${expenseCounts[topExpenses[0]]}) is the largest expense category, followed by ${EXPENSE_NAMES_EN[topExpenses[1] as RemittanceExpenseType]} (${expenseCounts[topExpenses[1]]}) and ${EXPENSE_NAMES_EN[topExpenses[2] as RemittanceExpenseType]} (${expenseCounts[topExpenses[2]]})। Detailed statistics and visualizations of various remittance expense patterns.`;

    return {
      title: `रेमिटेन्स खर्च | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-remittance-expenses",
        languages: {
          en: "/en/profile/economics/ward-remittance-expenses",
          ne: "/ne/profile/economics/ward-remittance-expenses",
        },
      },
      openGraph: {
        title: `रेमिटेन्स खर्च | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `रेमिटेन्स खर्च | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "रेमिटेन्स खर्च | पालिका प्रोफाइल",
      description:
        "वडा अनुसार रेमिटेन्स खर्च वितरण, प्रवृत्ति र विश्लेषण। विभिन्न विप्रेषण खर्च प्रकारहरूको विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "रेमिटेन्स खर्च प्रकार अनुसार घरपरिवार",
    slug: "expenses-distribution",
  },
  {
    level: 2,
    text: "वडा अनुसार रेमिटेन्स खर्च विविधता",
    slug: "ward-wise-expenses",
  },
  {
    level: 2,
    text: "प्रमुख खर्च प्रकारहरूको विश्लेषण",
    slug: "major-expenses",
  },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

export default async function WardRemittanceExpensesPage() {
  // Fetch all remittance expenses data using tRPC
  const expensesData =
    await api.profile.economics.wardWiseRemittanceExpenses.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardWiseRemittanceExpenses.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    expensesData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.remittanceExpense]) acc[item.remittanceExpense] = 0;
      acc[item.remittanceExpense] += item.households || 0;
      return acc;
    }, {}),
  )
    .map(([expense, households]) => ({
      expense,
      expenseName:
        remittanceExpenseLabels[expense as RemittanceExpenseType] || expense,
      households,
    }))
    .sort((a, b) => b.households - a.households);

  // Calculate total households for percentages
  const totalHouseholds = overallSummary.reduce(
    (sum, item) => sum + item.households,
    0,
  );

  // Take top 7 expense types for pie chart, group others
  const topExpenses = overallSummary.slice(0, 7);
  const otherExpenses = overallSummary.slice(7);

  const otherTotalHouseholds = otherExpenses.reduce(
    (sum, item) => sum + item.households,
    0,
  );

  let pieChartData = topExpenses.map((item) => ({
    name: item.expenseName,
    value: item.households,
    percentage: ((item.households / totalHouseholds) * 100).toFixed(2),
  }));

  // Add "Other" category if there are more than 7 expense types
  if (otherExpenses.length > 0) {
    pieChartData.push({
      name: "अन्य",
      value: otherTotalHouseholds,
      percentage: ((otherTotalHouseholds / totalHouseholds) * 100).toFixed(2),
    });
  }

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(expensesData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization (top 5 expense types per ward + others)
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = expensesData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    // Sort ward data by households
    wardData.sort((a, b) => (b.households || 0) - (a.households || 0));

    // Take top 5 expense types for this ward
    const topWardExpenses = wardData.slice(0, 5);
    const otherWardExpenses = wardData.slice(5);
    const otherWardTotal = otherWardExpenses.reduce(
      (sum, item) => sum + (item.households || 0),
      0,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add top expense types
    topWardExpenses.forEach((item) => {
      result[
        remittanceExpenseLabels[
          item.remittanceExpense as RemittanceExpenseType
        ] || item.remittanceExpense
      ] = item.households;
    });

    // Add "Other" category if needed
    if (otherWardExpenses.length > 0) {
      result["अन्य"] = otherWardTotal;
    }

    return result;
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <RemittanceExpensesSEO
        overallSummary={overallSummary}
        totalHouseholds={totalHouseholds}
        remittanceExpenseLabels={remittanceExpenseLabels}
        EXPENSE_NAMES_EN={EXPENSE_NAMES_EN}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/remittance-expenses.svg"
              width={1200}
              height={400}
              alt="रेमिट्यान्स खर्च - केराबारी गाउँपालिका (Remittance Expenses - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकामा रेमिट्यान्स खर्च
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा केराबारी गाउँपालिकाको विभिन्न वडाहरूमा रहेका
              घरपरिवारहरूले विदेशबाट प्राप्त विप्रेषण (रेमिट्यान्स) रकमलाई कसरी
              खर्च गर्छन् भन्ने बारेमा विस्तृत तथ्याङ्क प्रस्तुत गरिएको छ। यो
              तथ्याङ्कले स्थानीय आर्थिक गतिविधि, लगानीको प्राथमिकता र विकासको
              दिशालाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              केराबारी गाउँपालिकामा विप्रेषण रकम प्राप्त गर्ने घरपरिवारहरूले
              विभिन्न क्षेत्रमा यस्तो रकमको उपयोग गर्दछन्। कुल{" "}
              {totalHouseholds.toLocaleString()} घरपरिवार मध्ये{" "}
              {overallSummary[0]?.expenseName || ""} मा विप्रेषण खर्च गर्ने
              घरपरिवार{" "}
              {(
                ((overallSummary[0]?.households || 0) / totalHouseholds) *
                100
              ).toFixed(1)}
              % रहेका छन्। यस तथ्याङ्कले विप्रेषणको प्रभावकारी उपयोग र स्थानीय
              अर्थतन्त्रको विश्लेषण गर्न सहयोग पुर्‍याउँछ।
            </p>

            <h2
              id="expenses-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              रेमिटेन्स खर्च प्रकार अनुसार घरपरिवार
            </h2>
            <p>
              केराबारी गाउँपालिकामा विप्रेषण रकम प्राप्त गर्ने घरपरिवारहरूले
              विभिन्न क्षेत्रमा गरेको खर्चको विवरण निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <RemittanceExpensesCharts
            overallSummary={overallSummary}
            totalHouseholds={totalHouseholds}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            expensesData={expensesData}
            remittanceExpenseLabels={remittanceExpenseLabels}
            EXPENSE_NAMES_EN={EXPENSE_NAMES_EN}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="major-expenses" className="scroll-m-20 border-b pb-2">
              प्रमुख खर्च प्रकारहरूको विश्लेषण
            </h2>
            <p>
              केराबारी गाउँपालिकामा विप्रेषण रकमको खर्च निम्न क्षेत्रहरूमा
              प्रमुख रूपमा केन्द्रित छ। कुल विप्रेषण प्राप्त घरपरिवार मध्ये{" "}
              {remittanceExpenseLabels[
                overallSummary[0]?.expense as RemittanceExpenseType
              ] || "घरायसी प्रयोग"}{" "}
              मा सबैभन्दा बढी{" "}
              {(
                ((overallSummary[0]?.households || 0) / totalHouseholds) *
                100
              ).toFixed(2)}
              % घरपरिवारले खर्च गर्ने गरेका छन्।
            </p>

            {/* Client component for remittance expenses analysis section */}
            <RemittanceExpensesAnalysisSection
              overallSummary={overallSummary}
              totalHouseholds={totalHouseholds}
              remittanceExpenseLabels={remittanceExpenseLabels}
              EXPENSE_NAMES_EN={EXPENSE_NAMES_EN}
            />

            <h2 id="data-source" className="scroll-m-20 border-b pb-2">
              तथ्याङ्क स्रोत
            </h2>
            <p>
              माथि प्रस्तुत गरिएका तथ्याङ्कहरू नेपालको राष्ट्रिय जनगणना र
              केराबारी गाउँपालिकाको आफ्नै सर्वेक्षणबाट संकलन गरिएको हो। यी
              तथ्याङ्कहरूको महत्व निम्न अनुसार छ:
            </p>

            <ul>
              <li>विप्रेषणको प्रभावकारी उपयोगको अवस्था बुझ्न</li>
              <li>
                वित्तीय शिक्षा र लगानी प्रवर्द्धन कार्यक्रमहरू तर्जुमा गर्न
              </li>
              <li>उत्पादनशील क्षेत्रमा लगानी बढाउने रणनीति बनाउन</li>
              <li>स्थानीय आर्थिक विकासमा विप्रेषणको प्रभाव अध्ययन गर्न</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
