import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import WardWiseElectricitySourceCharts from "./_components/ward-wise-electricity-source-charts";
import WardWiseElectricitySourceAnalysisSection from "./_components/ward-wise-electricity-source-analysis-section";
import WardWiseElectricitySourceSEO from "./_components/ward-wise-electricity-source-seo";
import { electricitySourceOptions } from "@/server/api/routers/profile/physical/ward-wise-electricity-source.schema";

// Electricity source categories with display names and colors
const ELECTRICITY_SOURCE_CATEGORIES = {
  ELECTRICITY: {
    name: "विद्युत",
    nameEn: "Electricity Grid",
    color: "#1E88E5", // Blue
  },
  SOLAR: {
    name: "सोलार",
    nameEn: "Solar Power",
    color: "#FFA000", // Amber
  },
  KEROSENE: {
    name: "मट्टितेल",
    nameEn: "Kerosene",
    color: "#F44336", // Red
  },
  BIOGAS: {
    name: "बायोग्याँस",
    nameEn: "Biogas",
    color: "#43A047", // Green
  },
  OTHER: {
    name: "अन्य",
    nameEn: "Other sources",
    color: "#757575", // Gray
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
    const electricitySourceData =
      await api.profile.physical.wardWiseElectricitySource.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Group by electricity source type
    const sourceGroups = electricitySourceData.reduce((acc: any, curr: any) => {
      acc[curr.electricitySource] = acc[curr.electricitySource] || [];
      acc[curr.electricitySource].push(curr);
      return acc;
    }, {});

    // Calculate totals by source type and grand total
    let totalHouseholds = 0;
    const sourceTypeTotals: Record<string, number> = {};

    Object.entries(sourceGroups).forEach(([source, items]: [string, any]) => {
      const sourceTotal = items.reduce(
        (sum: number, item: any) => sum + item.households,
        0,
      );
      sourceTypeTotals[source] = sourceTotal;
      totalHouseholds += sourceTotal;
    });

    // Find most common electricity source
    const mostCommonSource = Object.entries(sourceTypeTotals).sort(
      ([, a]: [string, number], [, b]: [string, number]) => b - a,
    )[0][0];

    const mainGridPercentage = (
      ((sourceTypeTotals.ELECTRICITY || 0) / totalHouseholds) *
      100
    ).toFixed(2);
    const solarPercentage = (
      ((sourceTypeTotals.SOLAR || 0) / totalHouseholds) *
      100
    ).toFixed(2);

    // Create rich keywords
    const keywordsNP = [
      "गढवा गाउँपालिका विद्युत स्रोत",
      "वडागत विद्युत स्रोतको प्रयोग",
      "ग्रिड विद्युत प्रयोग दर",
      "सौर्य ऊर्जा प्रयोग दर",
      `विद्युत पहुँच ${mainGridPercentage}%`,
      "वैकल्पिक ऊर्जा प्रयोग विश्लेषण",
    ];

    const keywordsEN = [
      "Khajura Rural Municipality electricity source",
      "Ward-wise electricity source usage",
      "Grid electricity usage rate",
      "Solar power usage rate",
      `Electricity access ${mainGridPercentage}%`,
      "Alternative energy usage analysis",
    ];

    // Create description
    const descriptionNP = `गढवा गाउँपालिकामा विद्युतको स्रोत प्रयोगको विश्लेषण। कुल ${localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी मध्ये ${localizeNumber(mainGridPercentage, "ne")}% घरधुरीले केन्द्रीय विद्युत प्रणाली र ${localizeNumber(solarPercentage, "ne")}% घरधुरीले सौर्य ऊर्जा प्रयोग गर्दछन्।`;

    const descriptionEN = `Analysis of electricity source usage in Khajura Rural Municipality. Out of a total of ${totalHouseholds.toLocaleString()} households, ${mainGridPercentage}% use central electricity grid and ${solarPercentage}% use solar energy.`;

    return {
      title: `विद्युतको स्रोत प्रयोगको अवस्था | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/physical/ward-wise-electricity-source",
        languages: {
          en: "/en/profile/physical/ward-wise-electricity-source",
          ne: "/ne/profile/physical/ward-wise-electricity-source",
        },
      },
      openGraph: {
        title: `विद्युतको स्रोत प्रयोगको अवस्था | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `विद्युतको स्रोतको प्रयोगको अवस्था | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "विद्युतको स्रोतको प्रयोगको अवस्था | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description: "वडा अनुसार विद्युतको स्रोतको प्रयोगको अवस्था र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "विद्युतको स्रोतको वितरण",
    slug: "distribution-of-electricity-source",
  },
  {
    level: 2,
    text: "वडा अनुसार विद्युतको स्रोतको प्रयोग",
    slug: "ward-wise-electricity-source-usage",
  },
  {
    level: 2,
    text: "विद्युत प्रयोगको विश्लेषण",
    slug: "electricity-usage-analysis",
  },
  {
    level: 2,
    text: "विद्युत पहुँच विस्तार रणनीति",
    slug: "electricity-expansion-strategy",
  },
];

export default async function WardWiseElectricitySourcePage() {
  // Fetch all ward-wise electricity source data using tRPC
  const electricitySourceData =
    await api.profile.physical.wardWiseElectricitySource.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.physical.wardWiseElectricitySource.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Group by ward number
  const wardGroups = electricitySourceData.reduce((acc: any, curr: any) => {
    acc[curr.wardNumber] = acc[curr.wardNumber] || [];
    acc[curr.wardNumber].push(curr);
    return acc;
  }, {});

  // Group by electricity source type
  const sourceGroups = electricitySourceData.reduce((acc: any, curr: any) => {
    acc[curr.electricitySource] = acc[curr.electricitySource] || [];
    acc[curr.electricitySource].push(curr);
    return acc;
  }, {});

  // Create a mapping of electricitySource to its human-readable name
  const sourceMap: Record<string, string> = {};
  electricitySourceOptions.forEach((option) => {
    sourceMap[option.value] = option.label.split(" (")[0];
  });

  // Calculate totals by source type
  let totalHouseholds = 0;
  const sourceTypeTotals: Record<string, number> = {};

  Object.entries(sourceGroups).forEach(([source, items]: [string, any]) => {
    const sourceTotal = items.reduce(
      (sum: number, item: any) => sum + item.households,
      0,
    );
    sourceTypeTotals[source] = sourceTotal;
    totalHouseholds += sourceTotal;
  });

  // Calculate percentages
  const sourceTypePercentages: Record<string, number> = {};
  Object.keys(sourceTypeTotals).forEach((source) => {
    sourceTypePercentages[source] = parseFloat(
      ((sourceTypeTotals[source] / totalHouseholds) * 100).toFixed(2),
    );
  });

  // Get unique ward numbers
  const wardNumbers = Object.keys(wardGroups)
    .map(Number)
    .sort((a, b) => a - b);

  // Process data for pie chart
  const pieChartData = Object.entries(ELECTRICITY_SOURCE_CATEGORIES)
    .map(([categoryKey, category]) => {
      return {
        name: category.name,
        nameEn: category.nameEn,
        value: sourceTypeTotals[categoryKey] || 0,
        percentage: sourceTypePercentages[categoryKey]?.toFixed(2) || "0.00",
        color: category.color,
      };
    })
    .filter((item) => item.value > 0);

  // Process data for ward-wise visualization
  const wardWiseData = wardNumbers
    .map((wardNumber) => {
      const wardData = wardGroups[wardNumber];

      if (!wardData) return null;

      const totalWardHouseholds = wardData.reduce(
        (sum: number, item: any) => sum + item.households,
        0,
      );

      // Calculate ward-level totals for each electricity source type
      const wardSourceCategories: Record<string, number> = {};
      Object.keys(ELECTRICITY_SOURCE_CATEGORIES).forEach((categoryKey) => {
        const category =
          ELECTRICITY_SOURCE_CATEGORIES[
            categoryKey as keyof typeof ELECTRICITY_SOURCE_CATEGORIES
          ];
        const categoryTotal = wardData
          .filter((item: any) => item.electricitySource === categoryKey)
          .reduce((sum: number, item: any) => sum + item.households, 0);

        wardSourceCategories[category.name] = categoryTotal;
      });

      return {
        ward: `वडा ${wardNumber}`,
        wardNumber,
        ...wardSourceCategories,
        total: totalWardHouseholds,
      };
    })
    .filter(Boolean);

  // Modern electricity sources: ELECTRICITY, SOLAR
  const modernSources = ["ELECTRICITY", "SOLAR"];
  const traditionalSources = ["KEROSENE", "OTHER"];

  // Find the ward with highest and lowest percentages of households that use clean electricity sources
  const wardModernSourcePercentages = wardWiseData.map((ward: any) => {
    const modernSourceHouseholds = modernSources.reduce((sum, source) => {
      const sourceName =
        ELECTRICITY_SOURCE_CATEGORIES[
          source as keyof typeof ELECTRICITY_SOURCE_CATEGORIES
        ].name;
      return sum + (ward[sourceName] || 0);
    }, 0);

    const modernSourcePercentage = (modernSourceHouseholds / ward.total) * 100;
    return {
      wardNumber: ward.wardNumber,
      percentage: modernSourcePercentage,
      households: modernSourceHouseholds,
    };
  });

  const bestWard = [...wardModernSourcePercentages].sort(
    (a, b) => b.percentage - a.percentage,
  )[0];
  const worstWard = [...wardModernSourcePercentages].sort(
    (a, b) => a.percentage - b.percentage,
  )[0];

  // Calculate modern source usage percentage
  const modernSourceTotal = modernSources.reduce(
    (sum, source) => sum + (sourceTypeTotals[source] || 0),
    0,
  );
  const traditionalSourceTotal = traditionalSources.reduce(
    (sum, source) => sum + (sourceTypeTotals[source] || 0),
    0,
  );
  const modernSourcePercentage = (modernSourceTotal / totalHouseholds) * 100;

  // Electricity Access Index - weighted score based on the types of sources used
  const electricityAccessIndex =
    (sourceTypePercentages.ELECTRICITY || 0) * 1.0 +
    (sourceTypePercentages.SOLAR || 0) * 0.9 +
    (sourceTypePercentages.BIOGAS || 0) * 0.7 +
    (sourceTypePercentages.KEROSENE || 0) * 0.3 +
    (sourceTypePercentages.OTHER || 0) * 0.2;

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <WardWiseElectricitySourceSEO
        electricitySourceData={electricitySourceData}
        totalHouseholds={totalHouseholds}
        sourceTypeTotals={sourceTypeTotals}
        sourceTypePercentages={sourceTypePercentages}
        bestWard={bestWard}
        worstWard={worstWard}
        ELECTRICITY_SOURCE_CATEGORIES={ELECTRICITY_SOURCE_CATEGORIES}
        wardNumbers={wardNumbers}
        electricityAccessIndex={electricityAccessIndex}
        modernSourcePercentage={modernSourcePercentage}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/electricity-source.svg"
              width={1200}
              height={400}
              alt="विद्युतको स्रोतको प्रयोगको अवस्था - गढवा गाउँपालिका (Electricity Source Usage - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा विद्युतको स्रोतको प्रयोगको अवस्था
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              विद्युतको स्रोत एक महत्वपूर्ण भौतिक सूचक हो जसले समुदायको
              जीवनस्तर, आधुनिकीकरण र गुणस्तरीय ऊर्जामा पहुँचको अवस्थालाई
              दर्शाउँछ। विद्युतको उपलब्धता र त्यसको स्रोतको प्रकारले घरधुरीको
              जीवनयापन, स्वास्थ्य, शिक्षा, सूचना प्रविधिको पहुँच र व्यापारिक
              गतिविधिमा प्रत्यक्ष प्रभाव पार्दछ। यस खण्डमा गढवा गाउँपालिकाको
              विभिन्न वडाहरूमा प्रयोग हुने विद्युतको स्रोतको विस्तृत विश्लेषण
              प्रस्तुत गरिएको छ।
            </p>
            <p>
              गढवा गाउँपालिकामा कुल{" "}
              {localizeNumber(totalHouseholds.toLocaleString(), "ne")} घरधुरी
              मध्ये
              {localizeNumber(
                sourceTypePercentages.ELECTRICITY?.toFixed(2) || "0.00",
                "ne",
              )}
              % घरधुरीले केन्द्रीय विद्युत प्रणाली,
              {localizeNumber(
                sourceTypePercentages.SOLAR?.toFixed(2) || "0.00",
                "ne",
              )}
              % घरधुरीले सौर्य ऊर्जा, र
              {localizeNumber(
                sourceTypePercentages.KEROSENE?.toFixed(2) || "0.00",
                "ne",
              )}
              % घरधुरीले मट्टितेलको प्रयोग गर्दछन्।
            </p>

            <h2
              id="distribution-of-electricity-source"
              className="scroll-m-20 border-b pb-2"
            >
              विद्युतको स्रोतको वितरण
            </h2>
            <p>
              गढवा गाउँपालिकामा विद्युतको स्रोतको प्रयोगको वितरण निम्नानुसार
              रहेको छ:
            </p>
          </div>

          <WardWiseElectricitySourceCharts
            pieChartData={pieChartData}
            wardWiseData={wardWiseData}
            totalHouseholds={totalHouseholds}
            sourceTypeTotals={sourceTypeTotals}
            sourceMap={sourceMap}
            sourceTypePercentages={sourceTypePercentages}
            wardModernSourcePercentages={wardModernSourcePercentages}
            bestWard={bestWard}
            worstWard={worstWard}
            ELECTRICITY_SOURCE_CATEGORIES={ELECTRICITY_SOURCE_CATEGORIES}
            electricityAccessIndex={electricityAccessIndex}
            modernSources={modernSources}
            traditionalSources={traditionalSources}
            modernSourcePercentage={modernSourcePercentage}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="electricity-usage-analysis"
              className="scroll-m-20 border-b pb-2"
            >
              विद्युतको स्रोतको प्रयोगको विश्लेषण
            </h2>
            <p>
              गढवा गाउँपालिकामा विद्युतको स्रोतको प्रयोगको विश्लेषण गर्दा,
              समग्रमा
              {localizeNumber(modernSourcePercentage.toFixed(2), "ne")}%
              घरधुरीले आधुनिक विद्युतीय स्रोत (केन्द्रीय विद्युत प्रणाली, सौर्य
              ऊर्जा) प्रयोग गर्दछन्। वडागत रूपमा हेर्दा वडा नं.{" "}
              {localizeNumber(bestWard.wardNumber.toString(), "ne")} मा सबैभन्दा
              बढी आधुनिक विद्युतीय स्रोत प्रयोग गरिएको छ, जहाँ{" "}
              {localizeNumber(bestWard.percentage.toFixed(2), "ne")}%
              घरधुरीहरूले आधुनिक विद्युतीय स्रोत प्रयोग गर्दछन्।
            </p>

            <WardWiseElectricitySourceAnalysisSection
              totalHouseholds={totalHouseholds}
              sourceTypeTotals={sourceTypeTotals}
              sourceTypePercentages={sourceTypePercentages}
              wardModernSourcePercentages={wardModernSourcePercentages}
              bestWard={bestWard}
              worstWard={worstWard}
              ELECTRICITY_SOURCE_CATEGORIES={ELECTRICITY_SOURCE_CATEGORIES}
              electricityAccessIndex={electricityAccessIndex}
              modernSources={modernSources}
              traditionalSources={traditionalSources}
              modernSourcePercentage={modernSourcePercentage}
            />

            <h2
              id="electricity-expansion-strategy"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              विद्युत पहुँच विस्तार रणनीति
            </h2>

            <p>
              गढवा गाउँपालिकामा विद्युतको स्रोतको प्रयोगको तथ्याङ्क
              विश्लेषणबाट निम्न रणनीतिहरू अवलम्बन गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>ग्रिड विद्युत विस्तार कार्यक्रम:</strong>{" "}
                  {localizeNumber(
                    (100 - sourceTypePercentages.ELECTRICITY || 0).toFixed(2),
                    "ne",
                  )}
                  % घरधुरीहरूले अझै केन्द्रीय विद्युत प्रणाली प्रयोग नगर्ने
                  भएकाले त्यस्ता क्षेत्रहरूमा विद्युत विस्तारका लागि स्थानीय
                  वितरण प्रणालीलाई सुदृढ गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>वैकल्पिक ऊर्जा प्रवर्द्धन:</strong> वडा नं.{" "}
                  {localizeNumber(worstWard.wardNumber.toString(), "ne")} मा
                  आधुनिक विद्युतीय स्रोतको पहुँच न्यून भएकोले त्यस क्षेत्रमा
                  सौर्य ऊर्जा प्रणाली जडान र प्रशिक्षण कार्यक्रम संचालन गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>लघु तथा साना जलविद्युत विकास:</strong> स्थानीय स्तरमा
                  लघु र साना जलविद्युत आयोजना निर्माण गरी विद्युत आपूर्ति
                  बढाउने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>सामुदायिक सौर्य प्रणाली:</strong> विद्युत पहुँच नभएका
                  बस्तीमा सामुदायिक सौर्य प्रणाली स्थापना गरी बत्ति, मोबाइल
                  चार्ज, टेलिभिजन जस्ता आधारभूत आवश्यकता पूरा गर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>विद्युत वितरण प्रणाली सुधार:</strong> विद्यमान विद्युत
                  वितरण प्रणालीमा हुने चुहावट कम गर्ने र प्राविधिक सुधारद्वारा
                  विद्युत आपूर्तिलाई थप भरपर्दो र गुणस्तरीय बनाउने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              यसरी गढवा गाउँपालिकामा विद्युतको स्रोतको प्रयोगको विश्लेषणले
              पालिकामा विद्युत पहुँच र विद्युतीय सेवाको गुणस्तर बढाउनका लागि
              लक्षित कार्यक्रम संचालन गर्न आवश्यक सूचना उपलब्ध गराउँछ। यसले
              मट्टितेल जस्ता परम्परागत स्रोतमा निर्भरता कम गरी स्वच्छ र भरपर्दो
              विद्युत स्रोतमा जनताको पहुँच बढाउन मद्दत गर्नेछ, जसबाट जनताको
              जीवनस्तर, स्वास्थ्य, शिक्षा र आर्थिक विकासमा सकारात्मक योगदान
              पुग्नेछ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
