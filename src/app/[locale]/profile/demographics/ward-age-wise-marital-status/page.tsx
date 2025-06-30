import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import { api } from "@/trpc/server";
import Image from "next/image";
import MaritalStatusCharts from "./_components/marital-status-charts";
import MaritalStatusAnalysisSection from "./_components/marital-status-analysis-section";
import MaritalStatusSEO from "./_components/marital-status-seo";
import { localizeNumber } from "@/lib/utils/localize-number";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }, { locale: "ne" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const maritalData =
      await api.profile.demographics.wardAgeWiseMaritalStatus.getAll.query();
    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = maritalData.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    // Group by marital status type and calculate totals
    const maritalCounts: Record<string, number> = {};
    maritalData.forEach((item) => {
      if (!maritalCounts[item.maritalStatus])
        maritalCounts[item.maritalStatus] = 0;
      maritalCounts[item.maritalStatus] += item.population || 0;
    });

    // Get top marital statuses for keywords
    const topMaritalStatuses = Object.entries(maritalCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    // Define marital status names in both languages
    const MARITAL_STATUS_NAMES_NP: Record<string, string> = {
      SINGLE: "अविवाहित",
      MARRIED: "विवाहित",
      DIVORCED: "पारपाचुके",
      WIDOWED: "विधुर/विधवा",
      SEPARATED: "छुट्टिएको",
      NOT_STATED: "उल्लेख नभएको",
    };

    const MARITAL_STATUS_NAMES_EN: Record<string, string> = {
      SINGLE: "Single",
      MARRIED: "Married",
      DIVORCED: "Divorced",
      WIDOWED: "Widowed",
      SEPARATED: "Separated",
      NOT_STATED: "Not Stated",
    };

    // Create rich keywords with actual data
    const keywordsNP = [
      "केराबारी गाउँपालिका वैवाहिक जनसंख्या",
      "केराबारी वैवाहिक स्थिति",
      `केराबारी ${MARITAL_STATUS_NAMES_NP[topMaritalStatuses[0]]} जनसंख्या`,
      ...topMaritalStatuses.map(
        (r) => `${MARITAL_STATUS_NAMES_NP[r]} जनसंख्या केराबारी`,
      ),
      "वडा अनुसार वैवाहिक स्थिति",
      "उमेर अनुसार वैवाहिक स्थिति",
      "वैवाहिक स्थिति तथ्याङ्क",
      `केराबारी कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality marital status population",
      "Khajura marital status",
      `Khajura ${MARITAL_STATUS_NAMES_EN[topMaritalStatuses[0]]} population`,
      ...topMaritalStatuses.map(
        (r) => `${MARITAL_STATUS_NAMES_EN[r]} population in Khajura`,
      ),
      "Ward-wise marital status demographics",
      "Age-wise marital status statistics",
      "Marital status census Khajura",
      `Khajura total population ${totalPopulation}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `केराबारी गाउँपालिकाको वडा र उमेर अनुसार वैवाहिक स्थिति वितरण, प्रवृत्ति र विश्लेषण। कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")} मध्ये ${MARITAL_STATUS_NAMES_NP[topMaritalStatuses[0]]} (${localizeNumber(maritalCounts[topMaritalStatuses[0]].toString(), "ne")}) सबैभन्दा ठूलो समूह हो, त्यसपछि ${MARITAL_STATUS_NAMES_NP[topMaritalStatuses[1]]} (${localizeNumber(maritalCounts[topMaritalStatuses[1]].toString(), "ne")}) र ${MARITAL_STATUS_NAMES_NP[topMaritalStatuses[2]]} (${localizeNumber(maritalCounts[topMaritalStatuses[2]].toString(), "ne")})। विभिन्न उमेर समूह र वैवाहिक स्थितिको विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Ward-wise and age-wise marital status distribution, trends and analysis for Khajura Rural Municipality. Out of a total population of ${totalPopulation}, ${MARITAL_STATUS_NAMES_EN[topMaritalStatuses[0]]} (${maritalCounts[topMaritalStatuses[0]]}) is the largest group, followed by ${MARITAL_STATUS_NAMES_EN[topMaritalStatuses[1]]} (${maritalCounts[topMaritalStatuses[1]]}) and ${MARITAL_STATUS_NAMES_EN[topMaritalStatuses[2]]} (${maritalCounts[topMaritalStatuses[2]]})। Detailed statistics and visualizations of various marital status groups by age.`;

    return {
      title: `उमेर अनुसार वैवाहिक स्थिति | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/demographics/ward-age-wise-marital-status",
        languages: {
          en: "/en/profile/demographics/ward-age-wise-marital-status",
          ne: "/ne/profile/demographics/ward-age-wise-marital-status",
        },
      },
      openGraph: {
        title: `उमेर अनुसार वैवाहिक स्थिति | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `उमेर अनुसार वैवाहिक स्थिति | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "उमेर अनुसार वैवाहिक स्थिति | केराबारी गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "उमेर समूह अनुसार वैवाहिक स्थितिको वितरण, प्रवृत्ति र विश्लेषण। विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "वैवाहिक स्थितिको समग्र वितरण",
    slug: "marital-status-distribution",
  },
  {
    level: 2,
    text: "उमेर अनुसार वैवाहिक स्थिति",
    slug: "age-wise-marital-status",
  },
  {
    level: 2,
    text: "लिङ्ग अनुसार वैवाहिक स्थिति",
    slug: "gender-wise-marital-status",
  },
  { level: 2, text: "वडा अनुसार विश्लेषण", slug: "ward-wise-analysis" },
  { level: 2, text: "सामाजिक सुचकांक", slug: "social-indicators" },
];

// Define Nepali names for age groups
const AGE_GROUP_NAMES: Record<string, string> = {
  AGE_BELOW_15: "१५ वर्ष भन्दा कम",
  AGE_15_19: "१५-१९ वर्ष",
  AGE_20_24: "२०-२४ वर्ष",
  AGE_25_29: "२५-२९ वर्ष",
  AGE_30_34: "३०-३४ वर्ष",
  AGE_35_39: "३५-३९ वर्ष",
  AGE_40_44: "४०-४४ वर्ष",
  AGE_45_49: "४५-४९ वर्ष",
  AGE_50_54: "५०-५४ वर्ष",
  AGE_55_59: "५५-५९ वर्ष",
  AGE_60_64: "६०-६४ वर्ष",
  AGE_65_69: "६५-६९ वर्ष",
  AGE_70_74: "७०-७४ वर्ष",
  AGE_75_AND_ABOVE: "७५ वर्ष र माथि",
};

// Define Nepali names for marital status
const MARITAL_STATUS_NAMES: Record<string, string> = {
  SINGLE: "अविवाहित",
  MARRIED: "विवाहित",
  DIVORCED: "पारपाचुके",
  WIDOWED: "विधुर/विधवा",
  SEPARATED: "छुट्टिएको",
  NOT_STATED: "उल्लेख नभएको",
};

// Define age group categories
const AGE_CATEGORIES = {
  YOUNG: ["AGE_BELOW_15", "AGE_15_19"],
  YOUNG_ADULT: ["AGE_20_24", "AGE_25_29", "AGE_30_34"],
  MIDDLE_AGED: [
    "AGE_35_39",
    "AGE_40_44",
    "AGE_45_49",
    "AGE_50_54",
    "AGE_55_59",
  ],
  ELDERLY: ["AGE_60_64", "AGE_65_69", "AGE_70_74", "AGE_75_AND_ABOVE"],
};

export default async function AgeWiseMaritalStatusPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;

  // Fetch all age-wise marital status data from tRPC route
  const maritalData =
    await api.profile.demographics.wardAgeWiseMaritalStatus.getAll.query();

  // Fetch summary statistics if available
  let summaryData = null;
  try {
    summaryData =
      await api.profile.demographics.wardAgeWiseMaritalStatus.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary by marital status
  const overallByMaritalStatus = Object.entries(
    maritalData.reduce((acc: Record<string, number>, item) => {
      const key = item.maritalStatus;
      if (!acc[key]) acc[key] = 0;
      acc[key] += item.population;
      return acc;
    }, {}),
  ).map(([status, population]) => ({
    status,
    statusName:
      MARITAL_STATUS_NAMES[status as keyof typeof MARITAL_STATUS_NAMES] ||
      status,
    population: population as number,
  }));

  // Calculate total population
  const totalPopulation = overallByMaritalStatus.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Process data for age-wise marital status
  const ageWiseMaritalData = Object.keys(AGE_GROUP_NAMES)
    .map((ageGroup) => {
      const ageGroupData = maritalData.filter(
        (item) => item.ageGroup === ageGroup,
      );
      const result: Record<string, any> = {
        ageGroup,
        ageGroupName: AGE_GROUP_NAMES[ageGroup],
      };

      // Add counts for each marital status
      Object.keys(MARITAL_STATUS_NAMES).forEach((status) => {
        const statusData = ageGroupData.find(
          (item) => item.maritalStatus === status,
        );
        result[status] = statusData ? statusData.population : 0;
      });

      // Calculate total for this age group
      result.total = ageGroupData.reduce(
        (sum, item) => sum + item.population,
        0,
      );

      return result;
    })
    .filter((item) => item.total > 0);

  // Get unique ward IDs
  const wardNumbers = Array.from(
    new Set(maritalData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b);

  // Process data for ward-wise analysis
  const wardWiseData = wardNumbers.map((wardId) => {
    const wardItems = maritalData.filter((item) => item.wardNumber === wardId);

    // Calculate counts for each marital status in this ward
    const counts: Record<string, number> = {};
    Object.keys(MARITAL_STATUS_NAMES).forEach((status) => {
      counts[status] = wardItems
        .filter((item) => item.maritalStatus === status)
        .reduce((sum, item) => sum + item.population, 0);
    });

    return {
      wardId,
      wardNumber: `वडा ${localizeNumber(wardId.toString(), locale)}`,
      ...counts,
      total: wardItems.reduce((sum, item) => sum + item.population, 0),
    };
  });

  // Calculate gender-wise marital status
  const genderWiseData = Object.keys(MARITAL_STATUS_NAMES)
    .map((status) => {
      const statusData = maritalData.filter(
        (item) => item.maritalStatus === status,
      );
      const maleCount = statusData.reduce(
        (sum, item) => sum + (item.malePopulation || 0),
        0,
      );
      const femaleCount = statusData.reduce(
        (sum, item) => sum + (item.femalePopulation || 0),
        0,
      );
      const otherCount = statusData.reduce(
        (sum, item) => sum + (item.otherPopulation || 0),
        0,
      );

      return {
        status,
        statusName:
          MARITAL_STATUS_NAMES[status as keyof typeof MARITAL_STATUS_NAMES] ||
          status,
        male: maleCount,
        female: femaleCount,
        other: otherCount,
        total: maleCount + femaleCount + otherCount,
      };
    })
    .filter((item) => item.total > 0);

  // Prepare data for pie chart
  const pieChartData = overallByMaritalStatus.map((item) => ({
    name: item.statusName,
    value: item.population,
    percentage: ((item.population / totalPopulation) * 100).toFixed(2),
  }));

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <MaritalStatusSEO
        overallByMaritalStatus={overallByMaritalStatus}
        totalPopulation={totalPopulation}
        MARITAL_STATUS_NAMES={MARITAL_STATUS_NAMES}
        wardNumbers={wardNumbers}
        AGE_GROUP_NAMES={AGE_GROUP_NAMES}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/marital-status.svg"
              width={1200}
              height={400}
              alt="उमेर अनुसार वैवाहिक स्थिति - केराबारी गाउँपालिका (Age-wise Marital Status - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकामा उमेर अनुसार वैवाहिक स्थिति
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा केराबारी गाउँपालिकाको विभिन्न वडाहरूमा उमेर समूह
              अनुसारको वैवाहिक स्थिति सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत गरिएको
              छ। यो तथ्याङ्कले सामाजिक संरचना, परिवारको आकार, प्रजनन दर र
              जनसंख्या वृद्धि जस्ता पक्षहरूलाई प्रतिबिम्बित गर्दछ।
            </p>
            <p>
              केराबारी गाउँपालिकामा विभिन्न उमेर समूहका व्यक्तिहरूको वैवाहिक
              स्थितिको जानकारीले सामाजिक सुरक्षा, स्वास्थ्य, शिक्षा र अन्य
              कल्याणकारी कार्यक्रमहरू निर्धारण गर्न महत्वपूर्ण आधार प्रदान
              गर्दछ। कुल जनसंख्या{" "}
              {localizeNumber(totalPopulation.toLocaleString(), "ne")} मध्ये{" "}
              {overallByMaritalStatus[0]?.statusName || ""} स्थिति भएका
              व्यक्तिहरू{" "}
              {localizeNumber(
                (
                  ((overallByMaritalStatus[0]?.population || 0) /
                    totalPopulation) *
                  100
                ).toFixed(1),
                "ne",
              )}
              % रहेका छन्।
            </p>

            <h2
              id="marital-status-distribution"
              className="scroll-m-20 border-b pb-2"
            >
              वैवाहिक स्थितिको समग्र वितरण
            </h2>
            <p>
              केराबारी गाउँपालिकामा विभिन्न वैवाहिक स्थितिमा रहेका
              व्यक्तिहरूको कुल जनसंख्या निम्नानुसार छ:
            </p>
          </div>

          {/* Client component for charts */}
          <MaritalStatusCharts
            overallByMaritalStatus={overallByMaritalStatus}
            ageWiseMaritalData={ageWiseMaritalData}
            genderWiseData={genderWiseData}
            wardWiseData={wardWiseData}
            totalPopulation={totalPopulation}
            MARITAL_STATUS_NAMES={MARITAL_STATUS_NAMES}
            AGE_GROUP_NAMES={AGE_GROUP_NAMES}
            pieChartData={pieChartData}
            wardNumbers={wardNumbers}
            //@ts-ignore
            maritalData={maritalData}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="social-indicators" className="scroll-m-20 border-b pb-2">
              सामाजिक सुचकांक र विश्लेषण
            </h2>
            <p>
              वैवाहिक स्थितिको तथ्याङ्कबाट हामीले निम्न सामाजिक सूचकांकहरू
              विश्लेषण गर्न सक्छौं:
            </p>

            {/* Client component for marital status analysis section */}
            <MaritalStatusAnalysisSection
              overallByMaritalStatus={overallByMaritalStatus}
              ageWiseMaritalData={ageWiseMaritalData}
              genderWiseData={genderWiseData}
              wardWiseData={wardWiseData}
              totalPopulation={totalPopulation}
              MARITAL_STATUS_NAMES={MARITAL_STATUS_NAMES}
              AGE_GROUP_NAMES={AGE_GROUP_NAMES}
              AGE_CATEGORIES={AGE_CATEGORIES}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
