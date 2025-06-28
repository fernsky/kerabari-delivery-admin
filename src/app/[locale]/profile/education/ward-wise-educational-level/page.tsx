import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseEducationalLevelCharts from "./_components/ward-wise-educational-level-charts";
import WardWiseEducationalLevelAnalysisSection from "./_components/ward-wise-educational-level-analysis-section";
import WardWiseEducationalLevelSEO from "./_components/ward-wise-educational-level-seo";
import { educationalLevelOptions } from "@/server/api/routers/profile/education/ward-wise-educational-level.schema";

const EDUCATIONAL_LEVEL_GROUPS = {
  PRIMARY: {
    name: "प्राथमिक तह",
    nameEn: "Primary Level",
    color: "#4285F4", // Blue
    levels: [
      "CHILD_DEVELOPMENT_CENTER",
      "NURSERY",
      "GRADE_1",
      "GRADE_2",
      "GRADE_3",
      "GRADE_4",
      "GRADE_5",
    ],
  },
  LOWER_SECONDARY: {
    name: "निम्न माध्यमिक तह",
    nameEn: "Lower Secondary Level",
    color: "#FBBC05", // Yellow
    levels: ["GRADE_6", "GRADE_7", "GRADE_8"],
  },
  SECONDARY: {
    name: "माध्यमिक तह",
    nameEn: "Secondary Level",
    color: "#34A853", // Green
    levels: ["GRADE_9", "GRADE_10", "SLC_LEVEL"],
  },
  HIGHER_SECONDARY: {
    name: "उच्च माध्यमिक तह",
    nameEn: "Higher Secondary Level",
    color: "#EA4335", // Red
    levels: ["CLASS_12_LEVEL"],
  },
  HIGHER_EDUCATION: {
    name: "उच्च शिक्षा",
    nameEn: "Higher Education",
    color: "#9C27B0", // Purple
    levels: ["BACHELOR_LEVEL", "MASTERS_LEVEL", "PHD_LEVEL"],
  },
  OTHER: {
    name: "अन्य",
    nameEn: "Other",
    color: "#607D8B", // Blue Grey
    levels: ["INFORMAL_EDUCATION", "OTHER", "EDUCATED", "UNKNOWN"],
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
    const wardWiseEducationalLevelData =
      await api.profile.education.wardWiseEducationalLevel.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Group by ward number
    const wardGroups = wardWiseEducationalLevelData.reduce(
      (acc: any, curr: any) => {
        acc[curr.wardNumber] = acc[curr.wardNumber] || [];
        acc[curr.wardNumber].push(curr);
        return acc;
      },
      {},
    );

    // Calculate ward totals and grand total
    let totalPopulation = 0;
    let highestEducationCount = 0;

    Object.values(wardGroups).forEach((wardData: any) => {
      wardData.forEach((item: any) => {
        totalPopulation += item.population;
        if (
          EDUCATIONAL_LEVEL_GROUPS.HIGHER_EDUCATION.levels.includes(
            item.educationalLevelType,
          )
        ) {
          highestEducationCount += item.population;
        }
      });
    });

    // Calculate percentages for SEO description
    const highestEducationPercentage = (
      (highestEducationCount / totalPopulation) *
      100
    ).toFixed(2);

    // Create rich keywords
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका शैक्षिक स्तर",
      "शैक्षिक योग्यता",
      "वडागत शैक्षिक स्थिति",
      "शिक्षाको स्तर",
      "उच्च शिक्षा दर",
      `उच्च शिक्षा दर ${highestEducationPercentage}%`,
      "शैक्षिक स्तर विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality educational level",
      "Educational attainment",
      "Ward-wise education status",
      "Education level",
      "Higher education rate",
      `Higher education rate ${highestEducationPercentage}%`,
      "Educational level analysis",
    ];

    // Create description
    const descriptionNP = `बुद्धशान्ति गाउँपालिकामा शैक्षिक स्तरको विश्लेषण। कुल ${localizeNumber(totalPopulation.toLocaleString(), "ne")} जनसंख्या मध्ये ${localizeNumber(highestEducationPercentage, "ne")}% (${localizeNumber(highestEducationCount.toLocaleString(), "ne")}) जनाले उच्च शिक्षा हासिल गरेका छन्।`;

    const descriptionEN = `Analysis of educational levels in Khajura Rural Municipality. Out of a total of ${totalPopulation.toLocaleString()} people, ${highestEducationPercentage}% (${highestEducationCount.toLocaleString()}) have attained higher education.`;

    return {
      title: `शैक्षिक स्तर | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/education/ward-wise-educational-level",
        languages: {
          en: "/en/profile/education/ward-wise-educational-level",
          ne: "/ne/profile/education/ward-wise-educational-level",
        },
      },
      openGraph: {
        title: `शैक्षिक स्तरको अवस्था | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `शैक्षिक स्तरको अवस्था | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title: "शैक्षिक स्तरको अवस्था | बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार शैक्षिक स्तरको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "शैक्षिक स्तरको वितरण",
    slug: "distribution-of-educational-levels",
  },
  {
    level: 2,
    text: "वडा अनुसार शैक्षिक स्तर",
    slug: "ward-wise-educational-level",
  },
  {
    level: 2,
    text: "शैक्षिक स्तर विश्लेषण",
    slug: "educational-level-analysis",
  },
  {
    level: 2,
    text: "शैक्षिक प्रवर्द्धन रणनीति",
    slug: "education-promotion-strategy",
  },
];

export default async function WardWiseEducationalLevelPage() {
  // Fetch all ward-wise educational level data using tRPC
  const wardWiseEducationalLevelData =
    await api.profile.education.wardWiseEducationalLevel.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.education.wardWiseEducationalLevel.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Group by ward number
  const wardGroups = wardWiseEducationalLevelData.reduce(
    (acc: any, curr: any) => {
      acc[curr.wardNumber] = acc[curr.wardNumber] || [];
      acc[curr.wardNumber].push(curr);
      return acc;
    },
    {},
  );

  // Create a mapping of educationalLevelType to its human-readable name
  const educationalLevelMap: Record<string, string> = {};
  educationalLevelOptions.forEach((option) => {
    educationalLevelMap[option.value] = option.label.split(" (")[0];
  });

  // Calculate totals by education group
  let totalPopulation = 0;
  const educationGroupTotals: Record<string, number> = {
    PRIMARY: 0,
    LOWER_SECONDARY: 0,
    SECONDARY: 0,
    HIGHER_SECONDARY: 0,
    HIGHER_EDUCATION: 0,
    OTHER: 0,
  };

  // Count by individual education level
  const educationLevelTotals: Record<string, number> = {};

  Object.values(wardGroups).forEach((wardData: any) => {
    wardData.forEach((item: any) => {
      // Add to total population
      totalPopulation += item.population;

      // Initialize if not exists
      if (!educationLevelTotals[item.educationalLevelType]) {
        educationLevelTotals[item.educationalLevelType] = 0;
      }

      // Add to level totals
      educationLevelTotals[item.educationalLevelType] += item.population;

      // Add to group totals
      for (const groupKey of Object.keys(EDUCATIONAL_LEVEL_GROUPS)) {
        if (
          EDUCATIONAL_LEVEL_GROUPS[
            groupKey as keyof typeof EDUCATIONAL_LEVEL_GROUPS
          ].levels.includes(item.educationalLevelType)
        ) {
          educationGroupTotals[groupKey] += item.population;
          break;
        }
      }
    });
  });

  // Calculate percentages
  const educationGroupPercentages: Record<string, number> = {};
  Object.keys(educationGroupTotals).forEach((group) => {
    educationGroupPercentages[group] = parseFloat(
      ((educationGroupTotals[group] / totalPopulation) * 100).toFixed(2),
    );
  });

  // Get unique ward numbers
  const wardNumbers = Object.keys(wardGroups)
    .map(Number)
    .sort((a, b) => a - b);

  // Process data for pie chart
  const pieChartData = Object.keys(EDUCATIONAL_LEVEL_GROUPS).map((groupKey) => {
    const group =
      EDUCATIONAL_LEVEL_GROUPS[
        groupKey as keyof typeof EDUCATIONAL_LEVEL_GROUPS
      ];
    return {
      name: group.name,
      nameEn: group.nameEn,
      value: educationGroupTotals[groupKey],
      percentage: educationGroupPercentages[groupKey].toFixed(2),
      color: group.color,
    };
  });

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers
    .map((wardNumber) => {
      const wardData = wardGroups[wardNumber];

      if (!wardData) return null;

      const totalWardPopulation = wardData.reduce(
        (sum: number, item: any) => sum + item.population,
        0,
      );

      // Calculate ward-level totals for each education group
      const wardEducationGroups: Record<string, number> = {};
      Object.keys(EDUCATIONAL_LEVEL_GROUPS).forEach((groupKey) => {
        const group =
          EDUCATIONAL_LEVEL_GROUPS[
            groupKey as keyof typeof EDUCATIONAL_LEVEL_GROUPS
          ];
        const groupTotal = wardData
          .filter((item: any) =>
            group.levels.includes(item.educationalLevelType),
          )
          .reduce((sum: number, item: any) => sum + item.population, 0);

        wardEducationGroups[group.name] = groupTotal;
      });

      return {
        ward: `वडा ${wardNumber}`,
        wardNumber,
        ...wardEducationGroups,
        total: totalWardPopulation,
      };
    })
    .filter(Boolean);

  // Find the ward with highest higher education percentage
  const wardHigherEducationPercentages = wardWiseData.map((ward: any) => {
    const higherEducationPercentage =
      (ward[EDUCATIONAL_LEVEL_GROUPS.HIGHER_EDUCATION.name] / ward.total) * 100;
    return {
      wardNumber: ward.wardNumber,
      percentage: higherEducationPercentage,
    };
  });

  const bestEducatedWard = [...wardHigherEducationPercentages].sort(
    (a, b) => b.percentage - a.percentage,
  )[0];
  const leastEducatedWard = [...wardHigherEducationPercentages].sort(
    (a, b) => a.percentage - b.percentage,
  )[0];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WardWiseEducationalLevelSEO
        wardWiseEducationalLevelData={wardWiseEducationalLevelData}
        totalPopulation={totalPopulation}
        educationGroupTotals={educationGroupTotals}
        educationGroupPercentages={educationGroupPercentages}
        bestEducatedWard={bestEducatedWard}
        leastEducatedWard={leastEducatedWard}
        EDUCATIONAL_LEVEL_GROUPS={EDUCATIONAL_LEVEL_GROUPS}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/educational-level-status.svg"
              width={1200}
              height={400}
              alt="शैक्षिक स्तरको अवस्था - बुद्धशान्ति गाउँपालिका (Educational Level Status - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा शैक्षिक स्तरको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              शैक्षिक स्तर एक समाजको विकास र प्रगतिको महत्वपूर्ण सूचक हो।
              शिक्षाले व्यक्तिको ज्ञान, सीप र दक्षता बढाई समग्र जीवनस्तरमा सुधार
              ल्याउनका साथै सामाजिक र आर्थिक विकासमा महत्वपूर्ण भूमिका खेल्दछ।
              यस खण्डमा बुद्धशान्ति गाउँपालिकाको विभिन्न वडाहरूमा नागरिकहरूको
              शैक्षिक स्तरको विश्लेषण प्रस्तुत गरिएको छ।
            </p>
            <p>
              बुद्धशान्ति गाउँपालिकामा कुल{" "}
              {localizeNumber(totalPopulation.toLocaleString(), "ne")}{" "}
              जनसंख्यामध्ये
              {localizeNumber(
                educationGroupPercentages.PRIMARY.toFixed(2),
                "ne",
              )}
              % प्राथमिक तह,
              {localizeNumber(
                educationGroupPercentages.SECONDARY.toFixed(2),
                "ne",
              )}
              % माध्यमिक तह, र
              {localizeNumber(
                educationGroupPercentages.HIGHER_EDUCATION.toFixed(2),
                "ne",
              )}
              % उच्च शिक्षा हासिल गरेका छन्।
            </p>

            <h2
              id="distribution-of-educational-levels"
              className="scroll-m-20 border-b pb-2"
            >
              शैक्षिक स्तरको वितरण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा शैक्षिक स्तरको वितरण निम्नानुसार रहेको छ:
            </p>
          </div>

          <WardWiseEducationalLevelCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            totalPopulation={totalPopulation}
            educationLevelTotals={educationLevelTotals}
            educationalLevelMap={educationalLevelMap}
            educationGroupTotals={educationGroupTotals}
            educationGroupPercentages={educationGroupPercentages}
            wardWiseHigherEducation={wardHigherEducationPercentages}
            bestEducatedWard={bestEducatedWard}
            leastEducatedWard={leastEducatedWard}
            EDUCATIONAL_LEVEL_GROUPS={EDUCATIONAL_LEVEL_GROUPS}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="educational-level-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              शैक्षिक स्तर विश्लेषण
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा शैक्षिक स्तरको विश्लेषण गर्दा, समग्रमा
              {localizeNumber(
                educationGroupPercentages.HIGHER_EDUCATION.toFixed(2),
                "ne",
              )}
              % जनसंख्याले उच्च शिक्षा हासिल गरेका छन्। वडागत रूपमा हेर्दा वडा
              नं. {localizeNumber(bestEducatedWard.wardNumber.toString(), "ne")}{" "}
              मा सबैभन्दा उच्च शैक्षिक स्तर रहेको देखिन्छ, जहाँ{" "}
              {localizeNumber(bestEducatedWard.percentage.toFixed(2), "ne")}%
              जनसंख्याले उच्च शिक्षा हासिल गरेका छन्।
            </p>

            <WardWiseEducationalLevelAnalysisSection
              totalPopulation={totalPopulation}
              educationGroupTotals={educationGroupTotals}
              educationGroupPercentages={educationGroupPercentages}
              educationLevelTotals={educationLevelTotals}
              educationalLevelMap={educationalLevelMap}
              wardWiseHigherEducation={wardHigherEducationPercentages}
              bestEducatedWard={bestEducatedWard}
              leastEducatedWard={leastEducatedWard}
              EDUCATIONAL_LEVEL_GROUPS={EDUCATIONAL_LEVEL_GROUPS}
            />

            <h2
              id="education-promotion-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              शैक्षिक प्रवर्द्धन रणनीति
            </h2>

            <p>
              बुद्धशान्ति गाउँपालिकामा शैक्षिक स्तरको तथ्याङ्क विश्लेषणबाट निम्न
              रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>उच्च शिक्षा प्रवर्द्धन:</strong> मात्र{" "}
                  {localizeNumber(
                    educationGroupPercentages.HIGHER_EDUCATION.toFixed(2),
                    "ne",
                  )}
                  % जनसंख्याले उच्च शिक्षा प्राप्त गरेको अवस्थामा
                  बिद्यार्थीहरूलाई उच्च शिक्षा प्राप्त गर्न प्रोत्साहन गर्न
                  छात्रवृत्ति र अन्य सहयोगी कार्यक्रमहरू आयोजना गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>प्राविधिक शिक्षा विस्तार:</strong> स्थानीय आवश्यकता
                  अनुसार प्राविधिक शिक्षालयहरूको स्थापना र विस्तार गरी
                  युवाहरूलाई प्राविधिक सीप सहित शिक्षा दिने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>शैक्षिक गुणस्तर सुधार:</strong> विद्यालय तहमा शिक्षाको
                  गुणस्तर सुधार गर्न शिक्षक तालिम, पूर्वाधार विकास र शैक्षिक
                  सामग्रीको व्यवस्था गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>वडागत विशेष कार्यक्रमहरू:</strong> वडा नं.{" "}
                  {localizeNumber(
                    leastEducatedWard.wardNumber.toString(),
                    "ne",
                  )}{" "}
                  जस्ता कम शैक्षिक स्तर भएका क्षेत्रहरूमा विशेष शैक्षिक
                  प्रोत्साहन कार्यक्रमहरू सञ्चालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>निरन्तर शिक्षा कार्यक्रम:</strong> काम गर्दैगरेका
                  व्यक्तिहरूका लागि औपचारिक र अनौपचारिक निरन्तर शिक्षाका अवसरहरू
                  सिर्जना गर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी बुद्धशान्ति गाउँपालिकामा शैक्षिक स्तरको विश्लेषणले पालिकामा
              शैक्षिक विकासको अवस्था र भविष्यको शैक्षिक नीति निर्माणमा
              महत्वपूर्ण भूमिका खेल्दछ। यसका लागि वडागत विशेषताहरूलाई ध्यानमा
              राखी शिक्षा क्षेत्रको विस्तार र गुणस्तर वृद्धिका कार्यक्रमहरू
              तर्जुमा गर्नु आवश्यक देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
