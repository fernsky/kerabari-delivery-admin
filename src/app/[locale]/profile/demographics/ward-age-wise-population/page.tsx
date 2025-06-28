import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import { api } from "@/trpc/server";
import Image from "next/image";
import AgeWiseCharts from "./_components/age-wise-charts";
import AgeAnalysisSection from "./_components/age-analysis-section";
import AgeSEO from "./_components/age-seo";
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
    const ageData =
      await api.profile.demographics.wardAgeWisePopulation.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalPopulation = ageData.reduce(
      (sum, item) => sum + item.population,
      0,
    );

    // Group by age group
    const ageGroups: Record<string, number> = {};
    ageData.forEach((item) => {
      if (!ageGroups[item.ageGroup]) ageGroups[item.ageGroup] = 0;
      ageGroups[item.ageGroup] += item.population;
    });

    // Calculate children, youth, adult and elderly percentages
    const childrenTotal =
      (ageGroups["AGE_0_4"] || 0) +
      (ageGroups["AGE_5_9"] || 0) +
      (ageGroups["AGE_10_14"] || 0);
    const childrenPct = ((childrenTotal / totalPopulation) * 100).toFixed(1);

    const youthTotal =
      (ageGroups["AGE_15_19"] || 0) +
      (ageGroups["AGE_20_24"] || 0) +
      (ageGroups["AGE_25_29"] || 0);
    const youthPct = ((youthTotal / totalPopulation) * 100).toFixed(1);

    // Define Nepali names for age groups for keywords
    const AGE_GROUP_NAMES_NP: Record<string, string> = {
      AGE_0_4: "०-४ वर्ष",
      AGE_5_9: "५-९ वर्ष",
      AGE_10_14: "१०-१४ वर्ष",
      AGE_15_19: "१५-१९ वर्ष",
      AGE_20_24: "२०-२४ वर्ष",
      AGE_25_29: "२५-२९ वर्ष",
    };

    // Create rich keywords with actual data
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका उमेर जनसंख्या",
      "बुद्धशान्ति उमेरगत विविधता",
      `बुद्धशान्ति बाल जनसंख्या ${localizeNumber(childrenPct, "ne")}%`,
      `बुद्धशान्ति युवा जनसंख्या ${localizeNumber(youthPct, "ne")}%`,
      "वडा अनुसार उमेर वितरण",
      "जनसांख्यिकीय पिरामिड",
      "जनसांख्यिक लाभांश",
      "निर्भरता अनुपात",
      `बुद्धशान्ति कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality age distribution",
      "Khajura age demographics",
      `Khajura children population ${childrenPct}%`,
      `Khajura youth population ${youthPct}%`,
      "Ward-wise age demographics",
      "Population pyramid",
      "Demographic dividend",
      "Dependency ratio",
      `Khajura total population ${totalPopulation}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `बुद्धशान्ति गाउँपालिकाको वडा अनुसार उमेर समूहको जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। कुल जनसंख्या ${localizeNumber(totalPopulation.toString(), "ne")} मध्ये बाल जनसंख्या ${localizeNumber(childrenPct, "ne")}%, युवा जनसंख्या ${localizeNumber(youthPct, "ne")}% रहेको छ। उमेर समूह अनुसार विस्तृत तथ्याङ्क र विजुअलाइजेसन।`;

    const descriptionEN = `Ward-wise age group population distribution, trends and analysis for Khajura Rural Municipality. Out of a total population of ${totalPopulation}, children make up ${childrenPct}% and youth make up ${youthPct}%. Detailed statistics and visualizations of various age groups.`;

    return {
      title: `उमेर अनुसार जनसंख्या | बुद्धशान्ति गाउँपालिका | डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/demographics/ward-age-wise-population",
        languages: {
          en: "/en/profile/demographics/ward-age-wise-population",
          ne: "/ne/profile/demographics/ward-age-wise-population",
        },
      },
      openGraph: {
        title: `उमेर अनुसार जनसंख्या | बुद्धशान्ति गाउँपालिका`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `उमेर अनुसार जनसंख्या | बुद्धशान्ति गाउँपालिका`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "उमेर अनुसार जनसंख्या | बुद्धशान्ति गाउँपालिका | डिजिटल प्रोफाइल",
      description:
        "वडा अनुसार उमेर समूहको जनसंख्या वितरण, प्रवृत्ति र विश्लेषण। विस्तृत तथ्याङ्क र विजुअलाइजेसन।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "उमेर समूह अनुसार जनसंख्या", slug: "age-distribution" },
  { level: 2, text: "जनसांख्यिकीय पिरामिड", slug: "demographic-pyramid" },
  { level: 2, text: "वडा अनुसार उमेर वितरण", slug: "ward-wise-age" },
  { level: 2, text: "जनसांख्यिकीय विश्लेषण", slug: "demographic-analysis" },
];

// Define Nepali names for age groups
const AGE_GROUP_NAMES: Record<string, string> = {
  AGE_0_4: "०-४ वर्ष",
  AGE_5_9: "५-९ वर्ष",
  AGE_10_14: "१०-१४ वर्ष",
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

// Define Nepali names for gender
const GENDER_NAMES: Record<string, string> = {
  MALE: "पुरुष",
  FEMALE: "महिला",
  OTHER: "अन्य",
};

// Define age group categories
const AGE_CATEGORIES = {
  CHILDREN: ["AGE_0_4", "AGE_5_9", "AGE_10_14"],
  YOUTH: ["AGE_15_19", "AGE_20_24", "AGE_25_29"],
  ADULT: [
    "AGE_30_34",
    "AGE_35_39",
    "AGE_40_44",
    "AGE_45_49",
    "AGE_50_54",
    "AGE_55_59",
  ],
  ELDERLY: ["AGE_60_64", "AGE_65_69", "AGE_70_74", "AGE_75_AND_ABOVE"],
};

export default async function WardAgeWisePopulationPage() {
  // Fetch all age-wise population data from tRPC route
  const ageData =
    await api.profile.demographics.wardAgeWisePopulation.getAll.query();

  // Fetch summary statistics if available
  let summaryData;
  try {
    summaryData =
      await api.profile.demographics.wardAgeWisePopulation.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
    summaryData = null;
  }

  // Define type for age group summary
  type AgeGroupSummary = {
    ageGroup: string;
    ageGroupName: string;
    total: number;
    male: number;
    female: number;
    other: number;
  };

  // Process data for overall summary by age group
  const aggregatedByAgeGroup: Record<string, AgeGroupSummary> = {};

  // Populate age group summary
  ageData.forEach((item) => {
    const key = item.ageGroup;
    if (!aggregatedByAgeGroup[key]) {
      aggregatedByAgeGroup[key] = {
        ageGroup: key,
        ageGroupName: AGE_GROUP_NAMES[key] || key,
        total: 0,
        male: 0,
        female: 0,
        other: 0,
      };
    }

    aggregatedByAgeGroup[key].total += item.population;

    if (item.gender === "MALE")
      aggregatedByAgeGroup[key].male += item.population;
    else if (item.gender === "FEMALE")
      aggregatedByAgeGroup[key].female += item.population;
    else if (item.gender === "OTHER")
      aggregatedByAgeGroup[key].other += item.population;
  });

  // Convert to array and sort by age group order
  const ageGroupOrder = Object.keys(AGE_GROUP_NAMES);
  const overallSummaryByAge = Object.values(aggregatedByAgeGroup).sort(
    (a, b) =>
      ageGroupOrder.indexOf(a.ageGroup) - ageGroupOrder.indexOf(b.ageGroup),
  );

  // Process data for overall summary by gender
  const aggregatedByGender: Record<
    string,
    { gender: string; genderName: string; population: number }
  > = {};

  // Populate gender summary
  ageData.forEach((item) => {
    const key = item.gender;
    if (!aggregatedByGender[key]) {
      aggregatedByGender[key] = {
        gender: key,
        genderName: GENDER_NAMES[key] || key,
        population: 0,
      };
    }
    aggregatedByGender[key].population += item.population;
  });

  const overallSummaryByGender = Object.values(aggregatedByGender);
  const totalPopulation = overallSummaryByGender.reduce(
    (sum, item) => sum + item.population,
    0,
  );

  // Process data for age pyramid
  const pyramidData = Object.keys(AGE_GROUP_NAMES)
    .map((ageGroup) => {
      const ageGroupData = ageData.filter((item) => item.ageGroup === ageGroup);
      const maleData = ageGroupData.find((item) => item.gender === "MALE");
      const femaleData = ageGroupData.find((item) => item.gender === "FEMALE");

      return {
        ageGroup,
        ageGroupName: AGE_GROUP_NAMES[ageGroup],
        male: maleData ? -maleData.population : 0, // Negative value for left side of pyramid
        female: femaleData ? femaleData.population : 0,
      };
    })
    .sort((a, b) => {
      // Sort in reverse to have the oldest age group at the top
      return (
        ageGroupOrder.indexOf(b.ageGroup) - ageGroupOrder.indexOf(a.ageGroup)
      );
    });

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(ageData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data by ward for charts
  const wardWiseData = wardNumbers.map((wardNumber) => {
    const wardItems = ageData.filter((item) => item.wardNumber === wardNumber);

    // Aggregate by broader age categories for ward-wise comparison
    const childrenCount = wardItems
      .filter((item) => AGE_CATEGORIES.CHILDREN.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.population, 0);

    const youthCount = wardItems
      .filter((item) => AGE_CATEGORIES.YOUTH.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.population, 0);

    const adultCount = wardItems
      .filter((item) => AGE_CATEGORIES.ADULT.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.population, 0);

    const elderlyCount = wardItems
      .filter((item) => AGE_CATEGORIES.ELDERLY.includes(item.ageGroup))
      .reduce((sum, item) => sum + item.population, 0);

    return {
      ward: `वडा ${localizeNumber(wardNumber.toString(), "ne")}`,
      "बाल (०-१४)": childrenCount,
      "युवा (१५-२९)": youthCount,
      "वयस्क (३०-५९)": adultCount,
      "वृद्ध (६० माथि)": elderlyCount,
    };
  });

  // Calculate demographic indicators on the server side
  const childrenPopulation = overallSummaryByAge
    .filter((item) => AGE_CATEGORIES.CHILDREN.includes(item.ageGroup))
    .reduce((sum, item) => sum + item.total, 0);

  const youthPopulation = overallSummaryByAge
    .filter((item) => AGE_CATEGORIES.YOUTH.includes(item.ageGroup))
    .reduce((sum, item) => sum + item.total, 0);

  const adultPopulation = overallSummaryByAge
    .filter((item) => AGE_CATEGORIES.ADULT.includes(item.ageGroup))
    .reduce((sum, item) => sum + item.total, 0);

  const elderlyPopulation = overallSummaryByAge
    .filter((item) => AGE_CATEGORIES.ELDERLY.includes(item.ageGroup))
    .reduce((sum, item) => sum + item.total, 0);

  const workingAgePopulation = youthPopulation + adultPopulation;
  const dependentPopulation = childrenPopulation + elderlyPopulation;

  // Calculate dependency ratio
  let dependencyRatio = 0;
  if (workingAgePopulation > 0) {
    dependencyRatio = (dependentPopulation / workingAgePopulation) * 100;
  }

  // Calculate child dependency ratio
  let childDependencyRatio = 0;
  if (workingAgePopulation > 0) {
    childDependencyRatio = (childrenPopulation / workingAgePopulation) * 100;
  }

  // Calculate old-age dependency ratio
  let oldAgeDependencyRatio = 0;
  if (workingAgePopulation > 0) {
    oldAgeDependencyRatio = (elderlyPopulation / workingAgePopulation) * 100;
  }

  // Calculate median age (rough approximation)
  let cumulativePopulation = 0;
  let medianAgeGroup = "";
  const halfPopulation = totalPopulation / 2;

  for (const ageData of overallSummaryByAge) {
    cumulativePopulation += ageData.total;
    if (cumulativePopulation >= halfPopulation && !medianAgeGroup) {
      medianAgeGroup = ageData.ageGroup;
      break;
    }
  }

  // Helper function to estimate median age from age group
  const getMedianAgeEstimate = (ageGroup: string): number => {
    switch (ageGroup) {
      case "AGE_0_4":
        return 2.5;
      case "AGE_5_9":
        return 7.5;
      case "AGE_10_14":
        return 12.5;
      case "AGE_15_19":
        return 17.5;
      case "AGE_20_24":
        return 22.5;
      case "AGE_25_29":
        return 27.5;
      case "AGE_30_34":
        return 32.5;
      case "AGE_35_39":
        return 37.5;
      case "AGE_40_44":
        return 42.5;
      case "AGE_45_49":
        return 47.5;
      case "AGE_50_54":
        return 52.5;
      case "AGE_55_59":
        return 57.5;
      case "AGE_60_64":
        return 62.5;
      case "AGE_65_69":
        return 67.5;
      case "AGE_70_74":
        return 72.5;
      case "AGE_75_AND_ABOVE":
        return 80;
      default:
        return 30;
    }
  };

  // Estimate median age from age group (rough approximation)
  const medianAgeEstimate = getMedianAgeEstimate(medianAgeGroup);

  const demographicIndicators = {
    childrenPercentage: (childrenPopulation / totalPopulation) * 100,
    youthPercentage: (youthPopulation / totalPopulation) * 100,
    adultPercentage: (adultPopulation / totalPopulation) * 100,
    elderlyPercentage: (elderlyPopulation / totalPopulation) * 100,
    dependencyRatio,
    childDependencyRatio,
    oldAgeDependencyRatio,
    medianAge: medianAgeEstimate,
  };

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <AgeSEO
        overallSummaryByAge={overallSummaryByAge}
        totalPopulation={totalPopulation}
        AGE_GROUP_NAMES={AGE_GROUP_NAMES}
        wardNumbers={wardNumbers}
        demographicIndicators={demographicIndicators}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/age-distribution.svg" // You'll need this image
              width={1200}
              height={400}
              alt="उमेर अनुसार जनसंख्या वितरण"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा उमेर अनुसार जनसंख्या
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              यस खण्डमा बुद्धशान्ति गाउँपालिकाको विभिन्न वडाहरूमा उमेर समूह
              अनुसारको जनसंख्या सम्बन्धी विस्तृत तथ्याङ्क प्रस्तुत गरिएको छ।
              उमेर वितरण एक महत्त्वपूर्ण जनसांख्यिकी सूचक हो जसले समाजको संरचना,
              शिक्षा, स्वास्थ्य, रोजगारी र सामाजिक सुरक्षा सम्बन्धी नीतिहरू
              निर्धारण गर्न सहयोग गर्दछ।
            </p>
            <p>
              यो तथ्याङ्कले बुद्धशान्ति गाउँपालिकाको जनसांख्यिकीय लाभांश,
              निर्भरता अनुपात र भविष्यको जनसंख्या वृद्धिको प्रक्षेपण गर्न
              महत्त्वपूर्ण आधार प्रदान गर्दछ। विभिन्न उमेर समूहको आवश्यकता
              अनुसार विकास योजना तर्जुमा गर्न यस तथ्याङ्कको विश्लेषण अत्यन्त
              महत्त्वपूर्ण हुन्छ।
            </p>

            <h2 id="age-distribution" className="scroll-m-20 border-b pb-2">
              उमेर समूह अनुसार जनसंख्या
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा विभिन्न उमेर समूहका व्यक्तिहरूको वितरण
              निम्नानुसार छ:
            </p>

            {/* Server-rendered summary of age distribution */}
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">उमेर समूह</th>
                    <th className="border p-2 text-right">कुल जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                    <th className="border p-2 text-right">पुरुष</th>
                    <th className="border p-2 text-right">महिला</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummaryByAge.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{item.ageGroupName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.total.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          ((item.total / totalPopulation) * 100).toFixed(2),
                          "ne",
                        )}
                        %
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.male.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.female.toLocaleString(), "ne")}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold">
                    <td className="border p-2" colSpan={5}>
                      सबै उमेर समूहहरू गरेर कुल जनसंख्या{" "}
                      {localizeNumber(totalPopulation.toLocaleString(), "ne")}{" "}
                      रहेको छ
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Server-rendered demographic overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  बाल जनसंख्या (०-१४)
                </div>
                <div className="text-2xl font-bold text-indigo-500">
                  {localizeNumber(
                    demographicIndicators.childrenPercentage.toFixed(1),
                    "ne",
                  )}
                  %
                </div>
                <div className="text-sm text-muted-foreground">
                  ({localizeNumber(childrenPopulation.toLocaleString(), "ne")}{" "}
                  व्यक्ति)
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  युवा जनसंख्या (१५-२९)
                </div>
                <div className="text-2xl font-bold text-emerald-500">
                  {localizeNumber(
                    demographicIndicators.youthPercentage.toFixed(1),
                    "ne",
                  )}
                  %
                </div>
                <div className="text-sm text-muted-foreground">
                  ({localizeNumber(youthPopulation.toLocaleString(), "ne")}{" "}
                  व्यक्ति)
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  वयस्क जनसंख्या (३०-५९)
                </div>
                <div className="text-2xl font-bold text-violet-500">
                  {localizeNumber(
                    demographicIndicators.adultPercentage.toFixed(1),
                    "ne",
                  )}
                  %
                </div>
                <div className="text-sm text-muted-foreground">
                  ({localizeNumber(adultPopulation.toLocaleString(), "ne")}{" "}
                  व्यक्ति)
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-xs uppercase text-muted-foreground mb-1">
                  वृद्ध जनसंख्या (६० माथि)
                </div>
                <div className="text-2xl font-bold text-amber-500">
                  {localizeNumber(
                    demographicIndicators.elderlyPercentage.toFixed(1),
                    "ne",
                  )}
                  %
                </div>
                <div className="text-sm text-muted-foreground">
                  ({localizeNumber(elderlyPopulation.toLocaleString(), "ne")}{" "}
                  व्यक्ति)
                </div>
              </div>
            </div>
          </div>

          {/* Client component for charts */}
          <AgeWiseCharts
            overallSummaryByAge={overallSummaryByAge}
            overallSummaryByGender={overallSummaryByGender}
            totalPopulation={totalPopulation}
            pyramidData={pyramidData}
            wardWiseData={wardWiseData}
            wardNumbers={wardNumbers}
            ageData={ageData}
            AGE_GROUP_NAMES={AGE_GROUP_NAMES}
            GENDER_NAMES={GENDER_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="demographic-analysis" className="scroll-m-20 border-b pb-2">
              जनसांख्यिकीय विश्लेषण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकाको जनसंख्याको उमेर संरचनाले निम्न
              जनसांख्यिकीय सूचकहरू प्रदान गर्दछ:
            </p>

            {/* Client component for age analysis section */}
            <AgeAnalysisSection
              overallSummaryByAge={overallSummaryByAge}
              totalPopulation={totalPopulation}
              wardWiseData={wardWiseData}
              AGE_GROUP_NAMES={AGE_GROUP_NAMES}
              AGE_CATEGORIES={AGE_CATEGORIES}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
