import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import HouseholdChoresCharts from "./_components/household-chores-charts";
import HouseholdChoresAnalysisSection from "./_components/household-chores-analysis-section";
import HouseholdChoresSEO from "./_components/household-chores-seo";
import { api } from "@/trpc/server";
import { timeSpentLabels } from "@/server/api/routers/profile/economics/ward-time-wise-household-chores.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const householdChoresData =
      await api.profile.economics.wardTimeWiseHouseholdChores.getAll.query();
    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = householdChoresData.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    // Group by time spent category and calculate totals
    const timeSpentCounts: Record<string, number> = {};
    householdChoresData.forEach((item) => {
      if (!timeSpentCounts[item.timeSpent]) timeSpentCounts[item.timeSpent] = 0;
      timeSpentCounts[item.timeSpent] += item.population || 0;
    });

    // Define time spent categories in both languages
    const TIME_SPENT_NAMES_NP: Record<string, string> = {
      LESS_THAN_1_HOUR: "१ घण्टा भन्दा कम",
      HOURS_1_TO_3: "१-३ घण्टा",
      HOURS_4_TO_6: "४-६ घण्टा",
      HOURS_7_TO_9: "७-९ घण्टा",
      HOURS_10_TO_12: "१०-१२ घण्टा",
      MORE_THAN_12_HOURS: "१२ घण्टा भन्दा बढी",
    };

    const TIME_SPENT_NAMES_EN: Record<string, string> = {
      LESS_THAN_1_HOUR: "Less than 1 hour",
      HOURS_1_TO_3: "1-3 hours",
      HOURS_4_TO_6: "4-6 hours",
      HOURS_7_TO_9: "7-9 hours",
      HOURS_10_TO_12: "10-12 hours",
      MORE_THAN_12_HOURS: "More than 12 hours",
    };

    // Get most common time spent categories for keywords
    const topTimeCategories = Object.entries(timeSpentCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    // Create rich keywords with actual data
    const keywordsNP = [
      "केराबारी गाउँपालिका घरायसी कामकाज",
      "घरायसी कामकाजमा समय वितरण",
      `केराबारी ${TIME_SPENT_NAMES_NP[topTimeCategories[0]]} घरायसी काम`,
      ...topTimeCategories.map(
        (t) => `${TIME_SPENT_NAMES_NP[t]} घरायसी कामकाज`,
      ),
      "वडा अनुसार घरायसी काम",
      "घरायसी काममा समय वितरण",
      "घरायसी काम सम्बन्धी तथ्याङ्क",
      `केराबारी जनसंख्या घरायसी काम ${totalPopulation}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality household chores",
      "Household chores time distribution",
      `Khajura ${TIME_SPENT_NAMES_EN[topTimeCategories[0]]} household work`,
      ...topTimeCategories.map(
        (t) => `${TIME_SPENT_NAMES_EN[t]} spent on household chores in Khajura`,
      ),
      "Ward-wise household chores",
      "Time distribution for household work",
      "Household chores statistics",
      `Khajura population household work ${totalPopulation}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `केराबारी गाउँपालिकाको वडा अनुसार घरायसी कामकाजमा बिताइने समयको वितरण र विश्लेषण। कुल ${totalPopulation} जनसंख्या मध्ये ${TIME_SPENT_NAMES_NP[topTimeCategories[0]]} (${timeSpentCounts[topTimeCategories[0]]}) सबैभन्दा धेरै अपनाइएको समय अवधि हो, त्यसपछि ${TIME_SPENT_NAMES_NP[topTimeCategories[1]]} (${timeSpentCounts[topTimeCategories[1]]}) र ${TIME_SPENT_NAMES_NP[topTimeCategories[2]]} (${timeSpentCounts[topTimeCategories[2]]})। घरायसी कामकाजमा खर्चिने समय सम्बन्धी विस्तृत तथ्याङ्क र विश्लेषण।`;

    const descriptionEN = `Ward-wise time distribution and analysis of household chores in Khajura Rural Municipality. Out of total ${totalPopulation} population, ${TIME_SPENT_NAMES_EN[topTimeCategories[0]]} (${timeSpentCounts[topTimeCategories[0]]}) is the most common time spent, followed by ${TIME_SPENT_NAMES_EN[topTimeCategories[1]]} (${timeSpentCounts[topTimeCategories[1]]}) and ${TIME_SPENT_NAMES_EN[topTimeCategories[2]]} (${timeSpentCounts[topTimeCategories[2]]})। Detailed statistics and analysis on time spent on household chores.`;

    return {
      title: `घरायसी कामकाजमा खर्चिने समय | ${municipalityName} पालिका प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/ward-household-chores",
        languages: {
          en: "/en/profile/economics/ward-household-chores",
          ne: "/ne/profile/economics/ward-household-chores",
        },
      },
      openGraph: {
        title: `घरायसी कामकाजमा खर्चिने समय | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `घरायसी कामकाजमा खर्चिने समय | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "घरायसी कामकाजमा खर्चिने समय | पालिका प्रोफाइल",
      description:
        "वडा अनुसार घरायसी कामकाजमा बिताइने समयको वितरण र विश्लेषण। घरायसी कामकाजमा खर्चिने समय सम्बन्धी विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "समय अनुसार जनसंख्या वितरण", slug: "time-distribution" },
  { level: 2, text: "वडा अनुसार घरायसी कामकाज", slug: "ward-wise-chores" },
  { level: 2, text: "विश्लेषण", slug: "analysis" },
  { level: 2, text: "तथ्याङ्क स्रोत", slug: "data-source" },
];

// Define Nepali names for time spent categories
const TIME_SPENT_NAMES: Record<string, string> = {
  LESS_THAN_1_HOUR: "१ घण्टा भन्दा कम",
  HOURS_1_TO_3: "१-३ घण्टा",
  HOURS_4_TO_6: "४-६ घण्टा",
  HOURS_7_TO_9: "७-९ घण्टा",
  HOURS_10_TO_12: "१०-१२ घण्टा",
  MORE_THAN_12_HOURS: "१२ घण्टा भन्दा बढी",
};

export default async function WardHouseholdChoresPage() {
  // Fetch all household chores data using tRPC
  const householdChoresData =
    await api.profile.economics.wardTimeWiseHouseholdChores.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.wardTimeWiseHouseholdChores.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  const overallSummary = Object.entries(
    householdChoresData.reduce((acc: Record<string, number>, item) => {
      if (!acc[item.timeSpent]) acc[item.timeSpent] = 0;
      acc[item.timeSpent] += item.population || 0;
      return acc;
    }, {}),
  )
    .map(([timeSpent, population]) => ({
      timeSpent,
      timeSpentName:
        TIME_SPENT_NAMES[timeSpent as keyof typeof TIME_SPENT_NAMES] ||
        timeSpentLabels[timeSpent as keyof typeof timeSpentLabels] ||
        timeSpent,
      population,
    }))
    .sort((a, b) => {
      // Custom sort to maintain time spent order
      const order = [
        "LESS_THAN_1_HOUR",
        "HOURS_1_TO_3",
        "HOURS_4_TO_6",
        "HOURS_7_TO_9",
        "HOURS_10_TO_12",
        "MORE_THAN_12_HOURS",
      ];
      return order.indexOf(a.timeSpent) - order.indexOf(b.timeSpent);
    });

  // Calculate total population for percentages
  const totalPopulation = overallSummary.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Prepare data for pie chart
  const pieChartData = overallSummary.map((item) => ({
    name: item.timeSpentName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(householdChoresData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardData = householdChoresData.filter(
      (item) => item.wardNumber === wardNumber,
    );

    const result: Record<string, any> = { ward: `वडा ${wardNumber}` };

    // Add time spent categories for this ward
    wardData.forEach((item) => {
      result[
        TIME_SPENT_NAMES[item.timeSpent as keyof typeof TIME_SPENT_NAMES] ||
          timeSpentLabels[item.timeSpent as keyof typeof timeSpentLabels] ||
          item.timeSpent
      ] = item.population;
    });

    return result;
  });

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <HouseholdChoresSEO
        overallSummary={overallSummary}
        totalPopulation={totalPopulation}
        TIME_SPENT_NAMES={TIME_SPENT_NAMES}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/household-chores.svg"
              width={1200}
              height={400}
              alt="घरायसी कामकाज - केराबारी गाउँपालिका (Household Chores - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकामा घरायसी कामकाजमा खर्चिने समय
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा केराबारी गाउँपालिकाको विभिन्न वडाहरूमा घरायसी
              कामकाजमा खर्चिने समयको वितरण र विश्लेषण प्रस्तुत गरिएको छ। यो
              तथ्याङ्कले घरायसी कामकाजको बोझ, श्रम विभाजन, र समयको उपयोगिता
              बुझ्न सहयोग गर्दछ।
            </p>
            <p>
              केराबारी गाउँपालिकामा कुल {totalPopulation.toLocaleString()}{" "}
              जनसंख्या मध्ये सबैभन्दा बढी{" "}
              {overallSummary.sort((a, b) => b.population - a.population)[0]
                ?.timeSpentName || ""}{" "}
              समय घरायसी कामकाजमा खर्च गर्ने जनसंख्या रहेको देखिन्छ। घरायसी
              कामकाजमा खर्चिने समयको अध्ययनले परिवारिक श्रम बाँडफाँड,
              अर्थव्यवस्थामा घरायसी कामको योगदान, र सामाजिक विकासको सन्तुलन मापन
              गर्न सहयोग गर्दछ।
            </p>

            <h2 id="time-distribution" className="scroll-m-20 border-b pb-2">
              समय अनुसार जनसंख्या वितरण
            </h2>
            <p>
              घरायसी कामकाजमा खर्चिने समय अनुसार केराबारी गाउँपालिकाको
              जनसंख्या वितरण निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <HouseholdChoresCharts
            overallSummary={overallSummary}
            totalPopulation={totalPopulation}
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            householdChoresData={householdChoresData}
            TIME_SPENT_NAMES={TIME_SPENT_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="analysis" className="scroll-m-20 border-b pb-2">
              विश्लेषण
            </h2>
            <p>
              केराबारी गाउँपालिकामा घरायसी कामकाजमा खर्चिने समयको विश्लेषण
              गर्दा निम्न प्रवृत्तिहरू देखिन्छन्। अधिकांश जनसंख्या (
              {(
                ((overallSummary.sort((a, b) => b.population - a.population)[0]
                  ?.population || 0) /
                  totalPopulation) *
                100
              ).toFixed(1)}
              %)
              {overallSummary.sort((a, b) => b.population - a.population)[0]
                ?.timeSpentName || ""}{" "}
              समय घरायसी कामकाजमा व्यतीत गर्दछन्।
            </p>

            {/* Client component for analysis section */}
            <HouseholdChoresAnalysisSection
              overallSummary={overallSummary}
              totalPopulation={totalPopulation}
              TIME_SPENT_NAMES={TIME_SPENT_NAMES}
              wardNumbers={wardNumbers}
              householdChoresData={householdChoresData}
            />

            <h2 id="data-source" className="scroll-m-20 border-b pb-2">
              तथ्याङ्क स्रोत
            </h2>
            <p>
              माथि प्रस्तुत गरिएका तथ्याङ्कहरू केराबारी गाउँपालिकाको आर्थिक
              सर्वेक्षण र परिवार समयको उपयोग सम्बन्धी अध्ययनबाट संकलन गरिएको हो।
              यी तथ्याङ्कहरूको महत्व निम्न अनुसार छ:
            </p>

            <ul>
              <li>परिवारिक श्रम वितरणको प्रवृत्ति बुझ्न</li>
              <li>घरायसी कार्यको आर्थिक मूल्यांकन गर्न</li>
              <li>लैंगिक समानताको अवस्था अध्ययन गर्न</li>
              <li>स्थानीय विकास योजनाहरू तयार गर्न</li>
            </ul>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
