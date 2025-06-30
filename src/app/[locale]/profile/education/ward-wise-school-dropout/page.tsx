import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseSchoolDropoutCharts from "./_components/ward-wise-school-dropout-charts";
import WardWiseSchoolDropoutAnalysisSection from "./_components/ward-wise-school-dropout-analysis-section";
import WardWiseSchoolDropoutSEO from "./_components/ward-wise-school-dropout-seo";
import { schoolDropoutCauseOptions } from "@/server/api/routers/profile/education/ward-wise-school-dropout.schema";

const DROPOUT_CAUSE_GROUPS = {
  ECONOMIC: {
    name: "आर्थिक कारण",
    nameEn: "Economic Reasons",
    color: "#4285F4", // Blue
    causes: ["EXPENSIVE", "HOUSE_HELP", "EMPLOYMENT"],
  },
  EDUCATIONAL: {
    name: "शैक्षिक कारण",
    nameEn: "Educational Reasons",
    color: "#FBBC05", // Yellow
    causes: ["LIMITED_SPACE", "FAR", "WANTED_STUDY_COMPLETED"],
  },
  SOCIAL: {
    name: "सामाजिक कारण",
    nameEn: "Social Reasons",
    color: "#34A853", // Green
    causes: ["MARRIAGE", "UNWILLING_PARENTS"],
  },
  OTHER: {
    name: "अन्य कारण",
    nameEn: "Other Reasons",
    color: "#EA4335", // Red
    causes: ["OTHER"],
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
    const wardWiseSchoolDropoutData =
      await api.profile.education.wardWiseSchoolDropout.getAll.query();
    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality

    // Group by ward number
    const wardGroups = wardWiseSchoolDropoutData.reduce(
      (acc: any, curr: any) => {
        acc[curr.wardNumber] = acc[curr.wardNumber] || [];
        acc[curr.wardNumber].push(curr);
        return acc;
      },
      {},
    );

    // Calculate ward totals and grand total
    let totalDropouts = 0;
    let economicDropouts = 0;

    Object.values(wardGroups).forEach((wardData: any) => {
      wardData.forEach((item: any) => {
        totalDropouts += item.population;
        if (DROPOUT_CAUSE_GROUPS.ECONOMIC.causes.includes(item.cause)) {
          economicDropouts += item.population;
        }
      });
    });

    // Calculate percentages for SEO description
    const economicDropoutPercentage = (
      (economicDropouts / totalDropouts) *
      100
    ).toFixed(2);

    // Create rich keywords
    const keywordsNP = [
      "केराबारी गाउँपालिका विद्यालय छाड्ने कारण",
      "स्कूल ड्रपआउट",
      "वडागत शैक्षिक त्याग",
      "रोजगारीका लागि विद्यालय छाड्ने",
      `रोजगारी कारण छाड्ने ${economicDropoutPercentage}%`,
      "शैक्षिक त्याग विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality school dropout causes",
      "School dropout rate",
      "Ward-wise school dropout",
      "Employment related dropouts",
      `Employment related dropouts ${economicDropoutPercentage}%`,
      "School dropout analysis",
    ];

    // Create description
    const descriptionNP = `केराबारी गाउँपालिकामा विद्यालय छाड्नुका कारणहरूको विश्लेषण। कुल ${localizeNumber(totalDropouts.toLocaleString(), "ne")} जनसंख्या मध्ये ${localizeNumber(economicDropoutPercentage, "ne")}% (${localizeNumber(economicDropouts.toLocaleString(), "ne")}) जनाले आर्थिक कारणले विद्यालय छोडेका छन्।`;

    const descriptionEN = `Analysis of school dropout causes in Khajura Rural Municipality. Out of a total of ${totalDropouts.toLocaleString()} dropouts, ${economicDropoutPercentage}% (${economicDropouts.toLocaleString()}) have left school for economic reasons.`;

    return {
      title: `विद्यालय छाड्ने कारणहरू | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/education/ward-wise-school-dropout",
        languages: {
          en: "/en/profile/education/ward-wise-school-dropout",
          ne: "/ne/profile/education/ward-wise-school-dropout",
        },
      },
      openGraph: {
        title: `विद्यालय छाड्ने कारणहरूको अवस्था | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `विद्यालय छाड्ने कारणहरूको अवस्था | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "विद्यालय छाड्ने कारणहरूको अवस्था | केराबारी गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार विद्यालय छाड्ने कारणहरूको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "विद्यालय छाड्ने कारणहरूको वितरण",
    slug: "distribution-of-school-dropout-causes",
  },
  {
    level: 2,
    text: "वडा अनुसार विद्यालय छाड्ने कारणहरू",
    slug: "ward-wise-school-dropout-causes",
  },
  {
    level: 2,
    text: "विद्यालय छाड्ने कारणहरूको विश्लेषण",
    slug: "school-dropout-analysis",
  },
  {
    level: 2,
    text: "शैक्षिक संरक्षण रणनीति",
    slug: "educational-retention-strategy",
  },
];

export default async function WardWiseSchoolDropoutPage() {
  // Fetch all ward-wise school dropout data using tRPC
  const wardWiseSchoolDropoutData =
    await api.profile.education.wardWiseSchoolDropout.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.education.wardWiseSchoolDropout.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Group by ward number
  const wardGroups = wardWiseSchoolDropoutData.reduce((acc: any, curr: any) => {
    acc[curr.wardNumber] = acc[curr.wardNumber] || [];
    acc[curr.wardNumber].push(curr);
    return acc;
  }, {});

  // Create a mapping of cause to its human-readable name
  const causeMap: Record<string, string> = {};
  schoolDropoutCauseOptions.forEach((option) => {
    causeMap[option.value] = option.label.split(" (")[0];
  });

  // Calculate totals by dropout group
  let totalDropouts = 0;
  const dropoutGroupTotals: Record<string, number> = {
    ECONOMIC: 0,
    EDUCATIONAL: 0,
    SOCIAL: 0,
    OTHER: 0,
  };

  // Count by individual dropout cause
  const dropoutCauseTotals: Record<string, number> = {};

  Object.values(wardGroups).forEach((wardData: any) => {
    wardData.forEach((item: any) => {
      // Add to total dropouts
      totalDropouts += item.population;

      // Initialize if not exists
      if (!dropoutCauseTotals[item.cause]) {
        dropoutCauseTotals[item.cause] = 0;
      }

      // Add to cause totals
      dropoutCauseTotals[item.cause] += item.population;

      // Add to group totals
      for (const groupKey of Object.keys(DROPOUT_CAUSE_GROUPS)) {
        if (
          DROPOUT_CAUSE_GROUPS[
            groupKey as keyof typeof DROPOUT_CAUSE_GROUPS
          ].causes.includes(item.cause)
        ) {
          dropoutGroupTotals[groupKey] += item.population;
          break;
        }
      }
    });
  });

  // Calculate percentages
  const dropoutGroupPercentages: Record<string, number> = {};
  Object.keys(dropoutGroupTotals).forEach((group) => {
    dropoutGroupPercentages[group] = parseFloat(
      ((dropoutGroupTotals[group] / totalDropouts) * 100).toFixed(2),
    );
  });

  // Get unique ward numbers
  const wardNumbers = Object.keys(wardGroups)
    .map(Number)
    .sort((a, b) => a - b);

  // Process data for pie chart
  const pieChartData = Object.keys(DROPOUT_CAUSE_GROUPS).map((groupKey) => {
    const group =
      DROPOUT_CAUSE_GROUPS[groupKey as keyof typeof DROPOUT_CAUSE_GROUPS];
    return {
      name: group.name,
      nameEn: group.nameEn,
      value: dropoutGroupTotals[groupKey],
      percentage: dropoutGroupPercentages[groupKey].toFixed(2),
      color: group.color,
    };
  });

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers
    .map((wardNumber) => {
      const wardData = wardGroups[wardNumber];

      if (!wardData) return null;

      const totalWardDropouts = wardData.reduce(
        (sum: number, item: any) => sum + item.population,
        0,
      );

      // Calculate ward-level totals for each dropout group
      const wardDropoutGroups: Record<string, number> = {};
      Object.keys(DROPOUT_CAUSE_GROUPS).forEach((groupKey) => {
        const group =
          DROPOUT_CAUSE_GROUPS[groupKey as keyof typeof DROPOUT_CAUSE_GROUPS];
        const groupTotal = wardData
          .filter((item: any) => group.causes.includes(item.cause))
          .reduce((sum: number, item: any) => sum + item.population, 0);

        wardDropoutGroups[group.name] = groupTotal;
      });

      return {
        ward: `वडा ${wardNumber}`,
        wardNumber,
        ...wardDropoutGroups,
        total: totalWardDropouts,
      };
    })
    .filter(Boolean);

  // Find the ward with highest economic-related dropouts percentage
  const wardEconomicDropoutPercentages = wardWiseData.map((ward: any) => {
    const economicDropoutPercentage =
      (ward[DROPOUT_CAUSE_GROUPS.ECONOMIC.name] / ward.total) * 100;
    return {
      wardNumber: ward.wardNumber,
      percentage: economicDropoutPercentage,
    };
  });

  const highestEconomicDropoutWard = [...wardEconomicDropoutPercentages].sort(
    (a, b) => b.percentage - a.percentage,
  )[0];
  const lowestEconomicDropoutWard = [...wardEconomicDropoutPercentages].sort(
    (a, b) => a.percentage - b.percentage,
  )[0];

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WardWiseSchoolDropoutSEO
        wardWiseSchoolDropoutData={wardWiseSchoolDropoutData}
        totalDropouts={totalDropouts}
        dropoutGroupTotals={dropoutGroupTotals}
        dropoutGroupPercentages={dropoutGroupPercentages}
        highestEconomicDropoutWard={highestEconomicDropoutWard}
        lowestEconomicDropoutWard={lowestEconomicDropoutWard}
        DROPOUT_CAUSE_GROUPS={DROPOUT_CAUSE_GROUPS}
        wardNumbers={wardNumbers}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/school-dropout-causes.svg"
              width={1200}
              height={400}
              alt="विद्यालय छाड्ने कारणहरू - केराबारी गाउँपालिका (School Dropout Causes - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकामा विद्यालय छाड्ने कारणहरूको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              विद्यालय छाड्नुका कारणहरू र त्यसले समग्र शैक्षिक प्रणालीमा पार्ने
              प्रभावको अध्ययन एक महत्वपूर्ण पक्ष हो। विद्यालय छाड्नुका विभिन्न
              सामाजिक, आर्थिक र शैक्षिक कारणहरू हुन सक्छन् जुन समग्र शिक्षा
              प्रणालीको सुधारका लागि महत्वपूर्ण छन्। यस खण्डमा केराबारी
              गाउँपालिकाको विभिन्न वडाहरूमा विद्यालय छाड्नुका कारणहरूको विश्लेषण
              प्रस्तुत गरिएको छ।
            </p>
            <p>
              केराबारी गाउँपालिकामा कुल{" "}
              {localizeNumber(totalDropouts.toLocaleString(), "ne")}{" "}
              विद्यार्थीहरूले विविध कारणहरूले विद्यालय छोडेका छन्, जसमध्ये{" "}
              {localizeNumber(
                dropoutGroupPercentages.ECONOMIC.toFixed(2),
                "ne",
              )}
              % आर्थिक सम्बन्धी,
              {localizeNumber(
                dropoutGroupPercentages.EDUCATIONAL.toFixed(2),
                "ne",
              )}
              % शिक्षा सम्बन्धी, र
              {localizeNumber(dropoutGroupPercentages.SOCIAL.toFixed(2), "ne")}%
              सामाजिक कारणहरूले गर्दा विद्यालय छाडेका छन्।
            </p>

            <h2
              id="distribution-of-school-dropout-causes"
              className="scroll-m-20 border-b pb-2"
            >
              विद्यालय छाड्ने कारणहरूको वितरण
            </h2>
            <p>
              केराबारी गाउँपालिकामा विद्यालय छाड्ने कारणहरूको वितरण
              निम्नानुसार रहेको छ:
            </p>
          </div>

          <WardWiseSchoolDropoutCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            totalDropouts={totalDropouts}
            dropoutCauseTotals={dropoutCauseTotals}
            causeMap={causeMap}
            dropoutGroupTotals={dropoutGroupTotals}
            dropoutGroupPercentages={dropoutGroupPercentages}
            wardWiseEmploymentDropout={wardEconomicDropoutPercentages}
            highestEmploymentDropoutWard={highestEconomicDropoutWard}
            lowestEmploymentDropoutWard={lowestEconomicDropoutWard}
            DROPOUT_CAUSE_GROUPS={DROPOUT_CAUSE_GROUPS}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="school-dropout-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              विद्यालय छाड्ने कारणहरूको विश्लेषण
            </h2>
            <p>
              केराबारी गाउँपालिकामा विद्यालय छाड्ने कारणहरूको विश्लेषण गर्दा,
              समग्रमा
              {localizeNumber(
                dropoutGroupPercentages.ECONOMIC.toFixed(2),
                "ne",
              )}
              % जनसंख्याले आर्थिक सम्बन्धी कारणले विद्यालय छोडेका छन्। वडागत
              रूपमा हेर्दा वडा नं.{" "}
              {localizeNumber(
                highestEconomicDropoutWard.wardNumber.toString(),
                "ne",
              )}{" "}
              मा सबैभन्दा बढी{" "}
              {localizeNumber(
                highestEconomicDropoutWard.percentage.toFixed(2),
                "ne",
              )}
              % जनसंख्याले आर्थिक कारणले विद्यालय छोडेका छन्।
            </p>

            <WardWiseSchoolDropoutAnalysisSection
              totalDropouts={totalDropouts}
              dropoutGroupTotals={dropoutGroupTotals}
              dropoutGroupPercentages={dropoutGroupPercentages}
              dropoutCauseTotals={dropoutCauseTotals}
              causeMap={causeMap}
              wardWiseEconomicDropout={wardEconomicDropoutPercentages}
              highestEconomicDropoutWard={highestEconomicDropoutWard}
              lowestEconomicDropoutWard={lowestEconomicDropoutWard}
              DROPOUT_CAUSE_GROUPS={DROPOUT_CAUSE_GROUPS}
            />

            <h2
              id="educational-retention-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              शैक्षिक संरक्षण रणनीति
            </h2>

            <p>
              केराबारी गाउँपालिकामा विद्यालय छाड्ने कारणहरूको तथ्याङ्क
              विश्लेषणबाट निम्न रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>आर्थिक सहायता कार्यक्रम:</strong>{" "}
                  {localizeNumber(
                    dropoutGroupPercentages.ECONOMIC.toFixed(2),
                    "ne",
                  )}
                  % विद्यार्थीहरू आर्थिक कारणले स्कुल छाड्ने गरेकोले उनीहरूलाई
                  छात्रवृत्ति र आर्थिक सहयोग कार्यक्रमहरू सञ्चालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>सामाजिक सहायता कार्यक्रम:</strong> सामाजिक कारणले
                  विद्यालय छाड्नेहरूलाई समुदायमा आधारित सहयोग प्रणाली विकास गरी
                  शिक्षामा निरन्तरता दिन प्रोत्साहन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>लचिलो शैक्षिक कार्यक्रम:</strong> काम गर्दै पढ्न चाहने
                  विद्यार्थीहरूका लागि अंशकालिक वा लचिलो समयमा पढ्न सक्ने
                  व्यवस्था गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>वडागत विशेष कार्यक्रमहरू:</strong> वडा नं.{" "}
                  {localizeNumber(
                    highestEconomicDropoutWard.wardNumber.toString(),
                    "ne",
                  )}{" "}
                  जस्ता बढी ड्रपआउट दर भएका क्षेत्रहरूमा विशेष शैक्षिक
                  प्रोत्साहन कार्यक्रमहरू सञ्चालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>परामर्श सेवा:</strong> विद्यालय छाड्न लागेका
                  विद्यार्थीहरूका लागि परामर्श सेवा र अभिभावक शिक्षा कार्यक्रम
                  सञ्चालन गर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी केराबारी गाउँपालिकामा विद्यालय छाड्ने कारणहरूको विश्लेषणले
              पालिकामा शैक्षिक नीति निर्माण र कार्यक्रम तर्जुमा गर्न महत्वपूर्ण
              भूमिका खेल्दछ। विद्यालय छाड्ने दर घटाउन र विद्यार्थी संरक्षण
              गर्नका लागि वडागत आवश्यकता र विशेषताहरूलाई ध्यानमा राखी विशेष
              कार्यक्रमहरू सञ्चालन गर्नुपर्ने देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
