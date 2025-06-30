import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import DeceasedPopulationCharts from "./_components/deceased-population-charts";
import DeceasedPopulationAnalysisSection from "./_components/deceased-population-analysis-section";
import DeceasedPopulationSEO from "./_components/deceased-population-seo";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

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
  AGE_75_AND_ABOVE: "७५ वर्ष वा सो भन्दा बढी",
};

// Define English names for age groups (for SEO)
const AGE_GROUP_NAMES_EN: Record<string, string> = {
  AGE_0_4: "0-4 Years",
  AGE_5_9: "5-9 Years",
  AGE_10_14: "10-14 Years",
  AGE_15_19: "15-19 Years",
  AGE_20_24: "20-24 Years",
  AGE_25_29: "25-29 Years",
  AGE_30_34: "30-34 Years",
  AGE_35_39: "35-39 Years",
  AGE_40_44: "40-44 Years",
  AGE_45_49: "45-49 Years",
  AGE_50_54: "50-54 Years",
  AGE_55_59: "55-59 Years",
  AGE_60_64: "60-64 Years",
  AGE_65_69: "65-69 Years",
  AGE_70_74: "70-74 Years",
  AGE_75_AND_ABOVE: "75 Years and Above",
};

// Define Nepali names for gender
const GENDER_NAMES: Record<string, string> = {
  MALE: "पुरुष",
  FEMALE: "महिला",
  OTHER: "अन्य",
};

// Define English names for gender (for SEO)
const GENDER_NAMES_EN: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const deceasedData =
      await api.profile.demographics.wardAgeGenderWiseDeceasedPopulation.getAll.query();
    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalDeceasedPopulation = deceasedData.reduce(
      (sum, item) => sum + (item.deceasedPopulation || 0),
      0,
    );

    // Group by age group and calculate totals
    const ageGroupCounts: Record<string, number> = {};
    deceasedData.forEach((item) => {
      if (!ageGroupCounts[item.ageGroup]) ageGroupCounts[item.ageGroup] = 0;
      ageGroupCounts[item.ageGroup] += item.deceasedPopulation || 0;
    });

    // Find the most affected age group
    let mostAffectedAgeGroup = "";
    let mostAffectedCount = 0;
    Object.entries(ageGroupCounts).forEach(([ageGroup, count]) => {
      if (count > mostAffectedCount) {
        mostAffectedCount = count;
        mostAffectedAgeGroup = ageGroup;
      }
    });

    const mostAffectedPercentage =
      totalDeceasedPopulation > 0
        ? ((mostAffectedCount / totalDeceasedPopulation) * 100).toFixed(2)
        : "0";

    // Group by gender and calculate totals
    const genderCounts: Record<string, number> = {};
    deceasedData.forEach((item) => {
      if (!genderCounts[item.gender]) genderCounts[item.gender] = 0;
      genderCounts[item.gender] += item.deceasedPopulation || 0;
    });

    // Create rich keywords with actual data
    const keywordsNP = [
      "केराबारी गाउँपालिका मृत्यु विवरण",
      "केराबारी मृत्यु दर",
      "वडा अनुसार उमेर लिङ्ग मृत्यु विवरण",
      "उमेर लिङ्ग अनुसार मृत्यु",
      "केराबारी जनसांख्यिकी विश्लेषण",
      `केराबारी मृत्यु संख्या ${localizeNumber(totalDeceasedPopulation.toString(), "ne")}`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality mortality data",
      "Khajura death statistics",
      "Ward-wise age-gender mortality",
      "Age-gender wise deceased population",
      "Khajura demographic analysis",
      `Khajura mortality count ${totalDeceasedPopulation}`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `केराबारी गाउँपालिकाको वडा, उमेर र लिङ्ग अनुसार मृत्यु भएका जनसंख्याको वितरण र विश्लेषण। कुल मृत्यु संख्या ${localizeNumber(totalDeceasedPopulation.toString(), "ne")} मध्ये ${localizeNumber(mostAffectedPercentage, "ne")}% (${localizeNumber(mostAffectedCount.toString(), "ne")}) ${AGE_GROUP_NAMES[mostAffectedAgeGroup] || mostAffectedAgeGroup} उमेर समूहमा रहेका छन्। विभिन्न वडाहरूमा उमेर र लिङ्ग अनुसार मृत्युको विस्तृत विश्लेषण।`;

    const descriptionEN = `Ward, age and gender-wise distribution and analysis of deceased population in Khajura Rural Municipality. Out of a total deceased population of ${totalDeceasedPopulation}, ${mostAffectedPercentage}% (${mostAffectedCount}) are in the age group of ${AGE_GROUP_NAMES_EN[mostAffectedAgeGroup] || mostAffectedAgeGroup}. Detailed analysis of mortality across wards by age and gender.`;

    return {
      title: `उमेर तथा लिङ्ग अनुसार मृत्यु विवरण | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical:
          "/profile/demographics/ward-age-gender-wise-deceased-population",
        languages: {
          en: "/en/profile/demographics/ward-age-gender-wise-deceased-population",
          ne: "/ne/profile/demographics/ward-age-gender-wise-deceased-population",
        },
      },
      openGraph: {
        title: `उमेर तथा लिङ्ग अनुसार मृत्यु विवरण | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `उमेर तथा लिङ्ग अनुसार मृत्यु विवरण | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "उमेर तथा लिङ्ग अनुसार मृत्यु विवरण | केराबारी गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "वडा, उमेर र लिङ्ग अनुसार मृत्यु भएका जनसंख्याको वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  { level: 2, text: "उमेर अनुसार मृत्यु विवरण", slug: "age-wise-mortality" },
  {
    level: 2,
    text: "लिङ्ग अनुसार मृत्यु विवरण",
    slug: "gender-wise-mortality",
  },
  { level: 2, text: "वडा अनुसार मृत्यु विवरण", slug: "ward-wise-mortality" },
  {
    level: 2,
    text: "उमेर र लिङ्ग अनुसार मृत्यु विश्लेषण",
    slug: "mortality-analysis",
  },
];

export default async function WardAgeGenderWiseDeceasedPopulationPage() {
  // Fetch all deceased population data using tRPC
  const deceasedData =
    await api.profile.demographics.wardAgeGenderWiseDeceasedPopulation.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.demographics.wardAgeGenderWiseDeceasedPopulation.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for display
  const totalDeceasedPopulation = deceasedData.reduce(
    (sum, item) => sum + (item.deceasedPopulation || 0),
    0,
  );

  // Get unique ward numbers
  const wardNumbers = Array.from(
    new Set(deceasedData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b); // Sort numerically

  // Process data by age group
  const ageGroupData: Record<
    string,
    { male: number; female: number; other: number; total: number }
  > = {};

  // Initialize age group data structure with all age groups
  Object.keys(AGE_GROUP_NAMES).forEach((ageGroup) => {
    ageGroupData[ageGroup] = { male: 0, female: 0, other: 0, total: 0 };
  });

  // Fill in the data
  deceasedData.forEach((item) => {
    if (!ageGroupData[item.ageGroup]) {
      ageGroupData[item.ageGroup] = { male: 0, female: 0, other: 0, total: 0 };
    }

    if (item.gender === "MALE") {
      ageGroupData[item.ageGroup].male += item.deceasedPopulation;
    } else if (item.gender === "FEMALE") {
      ageGroupData[item.ageGroup].female += item.deceasedPopulation;
    } else if (item.gender === "OTHER") {
      ageGroupData[item.ageGroup].other += item.deceasedPopulation;
    }

    ageGroupData[item.ageGroup].total += item.deceasedPopulation;
  });

  // Process data by ward
  const wardData: Record<
    number,
    { male: number; female: number; other: number; total: number }
  > = {};

  wardNumbers.forEach((wardNumber) => {
    wardData[wardNumber] = { male: 0, female: 0, other: 0, total: 0 };

    deceasedData
      .filter((item) => item.wardNumber === wardNumber)
      .forEach((item) => {
        if (item.gender === "MALE") {
          wardData[wardNumber].male += item.deceasedPopulation;
        } else if (item.gender === "FEMALE") {
          wardData[wardNumber].female += item.deceasedPopulation;
        } else if (item.gender === "OTHER") {
          wardData[wardNumber].other += item.deceasedPopulation;
        }

        wardData[wardNumber].total += item.deceasedPopulation;
      });
  });

  // Process data for charts - age group stacked bar chart
  const ageGroupChartData = Object.entries(ageGroupData)
    .map(([ageGroup, data]) => ({
      ageGroup: AGE_GROUP_NAMES[ageGroup] || ageGroup,
      ageGroupEn: AGE_GROUP_NAMES_EN[ageGroup] || ageGroup,
      ageGroupKey: ageGroup,
      [GENDER_NAMES.MALE]: data.male,
      [GENDER_NAMES.FEMALE]: data.female,
      [GENDER_NAMES.OTHER]: data.other,
      total: data.total,
    }))
    .sort((a, b) => {
      // Custom sort based on age group order
      const ageGroups = Object.keys(AGE_GROUP_NAMES);
      return (
        ageGroups.indexOf(a.ageGroupKey) - ageGroups.indexOf(b.ageGroupKey)
      );
    });

  // Process data for charts - ward stacked bar chart
  const wardChartData = Object.entries(wardData)
    .map(([ward, data]) => ({
      ward: `वडा ${ward}`,
      wardNumber: Number(ward),
      [GENDER_NAMES.MALE]: data.male,
      [GENDER_NAMES.FEMALE]: data.female,
      [GENDER_NAMES.OTHER]: data.other,
      total: data.total,
    }))
    .sort((a, b) => a.wardNumber - b.wardNumber);

  // Process data for gender pie chart
  const genderTotals = {
    male: 0,
    female: 0,
    other: 0,
  };

  deceasedData.forEach((item) => {
    if (item.gender === "MALE") {
      genderTotals.male += item.deceasedPopulation;
    } else if (item.gender === "FEMALE") {
      genderTotals.female += item.deceasedPopulation;
    } else if (item.gender === "OTHER") {
      genderTotals.other += item.deceasedPopulation;
    }
  });

  const genderPieChartData = [
    {
      name: GENDER_NAMES.MALE,
      value: genderTotals.male,
      percentage: ((genderTotals.male / totalDeceasedPopulation) * 100).toFixed(
        2,
      ),
    },
    {
      name: GENDER_NAMES.FEMALE,
      value: genderTotals.female,
      percentage: (
        (genderTotals.female / totalDeceasedPopulation) *
        100
      ).toFixed(2),
    },
    {
      name: GENDER_NAMES.OTHER,
      value: genderTotals.other,
      percentage: (
        (genderTotals.other / totalDeceasedPopulation) *
        100
      ).toFixed(2),
    },
  ].filter((item) => item.value > 0); // Only include non-zero values

  // Find most affected age groups and wards for analysis
  const mostAffectedAgeGroup = [...ageGroupChartData].sort(
    (a, b) => b.total - a.total,
  )[0];
  const leastAffectedAgeGroup = [...ageGroupChartData]
    .filter((item) => item.total > 0)
    .sort((a, b) => a.total - b.total)[0];
  const mostAffectedWard = [...wardChartData].sort(
    (a, b) => b.total - a.total,
  )[0];

  // Calculate percentages for analysis
  const malePercentage =
    totalDeceasedPopulation > 0
      ? ((genderTotals.male / totalDeceasedPopulation) * 100).toFixed(2)
      : "0";

  const femalePercentage =
    totalDeceasedPopulation > 0
      ? ((genderTotals.female / totalDeceasedPopulation) * 100).toFixed(2)
      : "0";

  const otherPercentage =
    totalDeceasedPopulation > 0
      ? ((genderTotals.other / totalDeceasedPopulation) * 100).toFixed(2)
      : "0";

  // Create age groups analysis
  const ageGroupsAnalysis = {
    mostAffected: mostAffectedAgeGroup,
    leastAffected: leastAffectedAgeGroup,
    elderlyPercentage:
      totalDeceasedPopulation > 0
        ? (
            (((ageGroupData["AGE_60_64"]?.total || 0) +
              (ageGroupData["AGE_65_69"]?.total || 0) +
              (ageGroupData["AGE_70_74"]?.total || 0) +
              (ageGroupData["AGE_75_AND_ABOVE"]?.total || 0)) /
              totalDeceasedPopulation) *
            100
          ).toFixed(2)
        : "0",
    childrenPercentage:
      totalDeceasedPopulation > 0
        ? (
            (((ageGroupData["AGE_0_4"]?.total || 0) +
              (ageGroupData["AGE_5_9"]?.total || 0) +
              (ageGroupData["AGE_10_14"]?.total || 0)) /
              totalDeceasedPopulation) *
            100
          ).toFixed(2)
        : "0",
  };

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <DeceasedPopulationSEO
        totalDeceasedPopulation={totalDeceasedPopulation}
        ageGroupData={ageGroupData}
        wardData={wardData}
        genderTotals={genderTotals}
        AGE_GROUP_NAMES={AGE_GROUP_NAMES}
        AGE_GROUP_NAMES_EN={AGE_GROUP_NAMES_EN}
        GENDER_NAMES={GENDER_NAMES}
        GENDER_NAMES_EN={GENDER_NAMES_EN}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/deceased-population.svg"
              width={1200}
              height={400}
              alt="उमेर तथा लिङ्ग अनुसार मृत्यु विवरण - केराबारी गाउँपालिका (Age and Gender Wise Deceased Population - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकामा उमेर तथा लिङ्ग अनुसार मृत्यु विवरण
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              केराबारी गाउँपालिकाको जनसांख्यिकी विश्लेषणमा उमेर र लिङ्ग
              अनुसारको मृत्युदरको अध्ययन महत्वपूर्ण छ। यसले स्वास्थ्य नीति
              निर्माण, सेवाहरूको प्राथमिकीकरण र जनसंख्या परिवर्तनको बुझाई विकास
              गर्न मद्दत गर्दछ। यस खण्डमा केराबारी गाउँपालिकाको वडा, उमेर र
              लिङ्ग अनुसारको मृत्यु विवरण प्रस्तुत गरिएको छ।
            </p>
            <p>
              केराबारी गाउँपालिकामा कुल{" "}
              {localizeNumber(totalDeceasedPopulation.toString(), "ne")} जनाको
              मृत्यु भएको विवरण अनुसार, वडा, उमेर र लिङ्गका आधारमा मृत्युदरमा
              महत्वपूर्ण भिन्नता देखिन्छ। यसले स्थानीय सरकारलाई स्वास्थ्य सेवा,
              विशेष कार्यक्रमहरू र सुरक्षा उपायहरू लक्षित गर्न सघाउ पुर्‍याउँछ।
            </p>

            <h2 id="age-wise-mortality" className="scroll-m-20 border-b pb-2">
              उमेर अनुसार मृत्यु विवरण
            </h2>
            <p>
              उमेर समूह अनुसार हेर्दा सबैभन्दा धेरै मृत्यु संख्या{" "}
              {mostAffectedAgeGroup?.ageGroup || ""} समूहमा{" "}
              {localizeNumber(
                mostAffectedAgeGroup?.total.toString() || "0",
                "ne",
              )}{" "}
              जना (कुल मृत्युको{" "}
              {localizeNumber(
                (
                  ((mostAffectedAgeGroup?.total || 0) /
                    totalDeceasedPopulation) *
                  100
                ).toFixed(2),
                "ne",
              )}
              %) रहेको छ। यसले {mostAffectedAgeGroup?.ageGroup || ""} उमेर
              समूहमा विशेष स्वास्थ्य चुनौतीहरू भएको सङ्केत गर्दछ।
            </p>
          </div>

          {/* Client component for charts */}
          <DeceasedPopulationCharts
            totalDeceasedPopulation={totalDeceasedPopulation}
            ageGroupChartData={ageGroupChartData}
            wardChartData={wardChartData}
            genderPieChartData={genderPieChartData}
            wardNumbers={wardNumbers}
            deceasedData={deceasedData}
            AGE_GROUP_NAMES={AGE_GROUP_NAMES}
            GENDER_NAMES={GENDER_NAMES}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2 id="mortality-analysis" className="scroll-m-20 border-b pb-2">
              उमेर र लिङ्ग अनुसार मृत्यु विश्लेषण
            </h2>
            <p>
              केराबारी गाउँपालिकामा उमेर र लिङ्ग अनुसारको मृत्युदरको विश्लेषण
              गर्दा, निम्न प्रवृत्तिहरू देखिएका छन्।{" "}
              {localizeNumber(malePercentage, "ne")}% पुरुष,{" "}
              {localizeNumber(femalePercentage, "ne")}% महिला, र
              {localizeNumber(otherPercentage, "ne")}% अन्य लिङ्गका व्यक्तिहरूको
              मृत्यु भएको छ।
            </p>

            {/* Client component for mortality analysis section */}
            <DeceasedPopulationAnalysisSection
              totalDeceasedPopulation={totalDeceasedPopulation}
              genderTotals={genderTotals}
              ageGroupsAnalysis={ageGroupsAnalysis}
              mostAffectedWard={mostAffectedWard}
              ageGroupChartData={ageGroupChartData}
              wardChartData={wardChartData}
              AGE_GROUP_NAMES={AGE_GROUP_NAMES}
              AGE_GROUP_NAMES_EN={AGE_GROUP_NAMES_EN}
              GENDER_NAMES={GENDER_NAMES}
              GENDER_NAMES_EN={GENDER_NAMES_EN}
            />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
