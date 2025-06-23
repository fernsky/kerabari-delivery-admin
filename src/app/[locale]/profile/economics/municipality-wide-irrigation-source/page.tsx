import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import IrrigationSourceCharts from "./_components/irrigation-source-charts";
import IrrigationSourceAnalysisSection from "./_components/irrigation-source-analysis-section";
import IrrigationSourceSEO from "./_components/irrigation-source-seo";
import { irrigationSourceTypeOptions } from "@/server/api/routers/profile/economics/municipality-wide-irrigation-source.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define English names for irrigation source types (for SEO)
const IRRIGATION_SOURCE_TYPES_EN: Record<string, string> = {
  LAKE_OR_RESERVOIR: "Lake or Reservoir",
  IRRIGATION_CANAL: "Irrigation Canal",
  RAINWATER_COLLECTION: "Rainwater Collection",
  ELECTRIC_LIFT_IRRIGATION: "Electric Lift Irrigation",
  CANAL: "Canal",
  PUMPING_SET: "Pumping Set",
  UNDERGROUND_IRRIGATION: "Underground Irrigation",
  OTHER: "Other Sources",
};

// Define Nepali names for irrigation source types
// Use the labels from irrigationSourceTypeOptions for Nepali names
const IRRIGATION_SOURCE_TYPES: Record<string, string> =
  irrigationSourceTypeOptions.reduce(
    (acc, option) => ({
      ...acc,
      [option.value]: option.label,
    }),
    {},
  );

// Define colors for irrigation source types
const IRRIGATION_SOURCE_COLORS: Record<string, string> = {
  LAKE_OR_RESERVOIR: "#3498db", // Blue
  IRRIGATION_CANAL: "#e74c3c", // Red
  RAINWATER_COLLECTION: "#2ecc71", // Green
  ELECTRIC_LIFT_IRRIGATION: "#f39c12", // Orange
  CANAL: "#9b59b6", // Purple
  PUMPING_SET: "#1abc9c", // Teal
  UNDERGROUND_IRRIGATION: "#34495e", // Dark Blue Gray
  OTHER: "#7f8c8d", // Gray
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const irrigationSourceData =
      await api.profile.economics.municipalityWideIrrigationSource.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalCoverage = irrigationSourceData.reduce(
      (sum: number, item: { coverageInHectares: any }) =>
        sum + (parseFloat(String(item.coverageInHectares)) || 0),
      0,
    );

    // Group by irrigation source type and calculate totals
    const irrigationSourceCounts: Record<string, number> = {};
    irrigationSourceData.forEach(
      (item: {
        irrigationSource: string;
        coverageInHectares: number | string;
      }) => {
        if (!irrigationSourceCounts[item.irrigationSource])
          irrigationSourceCounts[item.irrigationSource] = 0;
        irrigationSourceCounts[item.irrigationSource] +=
          parseFloat(String(item.coverageInHectares)) || 0;
      },
    );

    // Find the most common irrigation source type
    let mostCommonType = "";
    let mostCommonCoverage = 0;
    Object.entries(irrigationSourceCounts).forEach(([type, coverage]) => {
      if (coverage > mostCommonCoverage) {
        mostCommonCoverage = coverage;
        mostCommonType = type;
      }
    });

    const mostCommonPercentage =
      totalCoverage > 0
        ? ((mostCommonCoverage / totalCoverage) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "गढवा गाउँपालिका सिंचाई स्रोत",
      "गढवा सिंचाई स्रोत प्रकार",
      "पालिका स्तरीय सिंचाई स्रोत",
      "ताल वा जलाशय सिंचाई",
      "सिंचाई नहर",
      "वर्षाको पानी संकलन",
      "विद्युतीय लिफ्ट सिंचाई",
      `गढवा सिंचाई क्षेत्रफल ${localizeNumber(totalCoverage.toFixed(2), "ne")} हेक्टर`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality irrigation sources",
      "Khajura irrigation source types",
      "Municipality-wide irrigation sources",
      "Lake or reservoir irrigation",
      "Irrigation canal statistics Khajura",
      "Rainwater collection irrigation",
      "Electric lift irrigation",
      `Khajura irrigation coverage ${totalCoverage.toFixed(2)} hectares`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकाको सिंचाई स्रोतको वितरण र विश्लेषण। कुल ${localizeNumber(totalCoverage.toFixed(2), "ne")} हेक्टर क्षेत्रफल मध्ये ${localizeNumber(mostCommonPercentage, "ne")}% (${localizeNumber(mostCommonCoverage.toFixed(2), "ne")}) हेक्टर क्षेत्रफल ${IRRIGATION_SOURCE_TYPES[mostCommonType] || mostCommonType} मार्फत सिंचाई हुने गर्दछ। पालिका स्तरीय सिंचाई स्रोतको विस्तृत विश्लेषण।`;

    const descriptionEN = `Distribution and analysis of irrigation sources in Khajura Rural Municipality. Out of a total of ${totalCoverage.toFixed(2)} hectares coverage, ${mostCommonPercentage}% (${mostCommonCoverage.toFixed(2)}) hectares are irrigated through ${IRRIGATION_SOURCE_TYPES_EN[mostCommonType] || mostCommonType}. Detailed analysis of municipality-wide irrigation source patterns.`;

    return {
      title: `सिंचाई स्रोतको प्रकार अनुसार क्षेत्रफल | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/municipality-wide-irrigation-source",
        languages: {
          en: "/en/profile/economics/municipality-wide-irrigation-source",
          ne: "/ne/profile/economics/municipality-wide-irrigation-source",
        },
      },
      openGraph: {
        title: `सिंचाई स्रोतको प्रकार अनुसार क्षेत्रफल | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `सिंचाई स्रोतको प्रकार अनुसार क्षेत्रफल | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "सिंचाई स्रोतको प्रकार अनुसार क्षेत्रफल | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "पालिका स्तरीय सिंचाई स्रोतको प्रकार अनुसारको क्षेत्रफल वितरण र विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "सिंचाई स्रोतका प्रमुख प्रकारहरू",
    slug: "main-irrigation-source-types",
  },
  { level: 2, text: "सिंचाई क्षेत्रफल", slug: "irrigation-coverage" },
  { level: 2, text: "सिंचाई प्रवृत्ति", slug: "irrigation-trends" },
  {
    level: 2,
    text: "सिंचाई व्यवस्थापन र चुनौतीहरू",
    slug: "irrigation-management-and-challenges",
  },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function MunicipalityWideIrrigationSourcePage() {
  // Fetch all irrigation source data using tRPC
  const irrigationSourceData =
    await api.profile.economics.municipalityWideIrrigationSource.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.municipalityWideIrrigationSource.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  type IrrigationSourceType = {
    type: string;
    typeName: string;
    coverage: number;
  };

  // Process data for overall summary with proper typing
  const overallSummary: IrrigationSourceType[] = Object.entries(
    irrigationSourceData.reduce(
      (
        acc: Record<string, number>,
        item: { irrigationSource: string | number; coverageInHectares: any },
      ) => {
        if (!acc[item.irrigationSource]) acc[item.irrigationSource] = 0;
        acc[item.irrigationSource] +=
          parseFloat(String(item.coverageInHectares)) || 0;
        return acc;
      },
      {} as Record<string, number>,
    ),
  )
    .map(([type, coverage]) => ({
      type,
      typeName: IRRIGATION_SOURCE_TYPES[type] || type,
      coverage: coverage as number, // Explicitly cast to number
    }))
    .sort((a, b) => b.coverage - a.coverage); // Sort by coverage descending

  // Calculate total coverage for percentages
  const totalCoverage = overallSummary.reduce(
    (sum, item) => sum + item.coverage,
    0,
  );

  // Create data for pie chart
  const pieChartData = overallSummary.map((item) => ({
    name: item.typeName,
    value: item.coverage,
    percentage: ((item.coverage / totalCoverage) * 100).toFixed(2),
  }));

  // Calculate irrigation coverage statistics
  const irrigationAnalysis = {
    totalIrrigatedArea: totalCoverage,
    traditionalSourceCoverage: overallSummary
      .filter((item) => ["CANAL", "IRRIGATION_CANAL"].includes(item.type))
      .reduce((sum, item) => sum + item.coverage, 0),
    modernSourceCoverage: overallSummary
      .filter((item) =>
        [
          "ELECTRIC_LIFT_IRRIGATION",
          "UNDERGROUND_IRRIGATION",
          "PUMPING_SET",
        ].includes(item.type),
      )
      .reduce((sum, item) => sum + item.coverage, 0),
    naturalSourceCoverage: overallSummary
      .filter((item) =>
        ["LAKE_OR_RESERVOIR", "RAINWATER_COLLECTION"].includes(item.type),
      )
      .reduce((sum, item) => sum + item.coverage, 0),
    otherSourceCoverage: overallSummary
      .filter((item) => ["OTHER"].includes(item.type))
      .reduce((sum, item) => sum + item.coverage, 0),
  };

  // Calculate percentages
  const traditionalSourcePercentage =
    totalCoverage > 0
      ? (
          (irrigationAnalysis.traditionalSourceCoverage / totalCoverage) *
          100
        ).toFixed(2)
      : "0";

  const modernSourcePercentage =
    totalCoverage > 0
      ? (
          (irrigationAnalysis.modernSourceCoverage / totalCoverage) *
          100
        ).toFixed(2)
      : "0";

  const naturalSourcePercentage =
    totalCoverage > 0
      ? (
          (irrigationAnalysis.naturalSourceCoverage / totalCoverage) *
          100
        ).toFixed(2)
      : "0";

  const otherSourcePercentage =
    totalCoverage > 0
      ? (
          (irrigationAnalysis.otherSourceCoverage / totalCoverage) *
          100
        ).toFixed(2)
      : "0";

  // Calculate sustainability score (0-100)
  // Higher score means better sustainability (more modern and natural sources vs. traditional)
  const sustainabilityScore =
    totalCoverage > 0
      ? Math.round(
          ((irrigationAnalysis.modernSourceCoverage +
            irrigationAnalysis.naturalSourceCoverage) /
            totalCoverage) *
            100,
        )
      : 0;

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <IrrigationSourceSEO
        overallSummary={overallSummary}
        totalCoverage={totalCoverage}
        IRRIGATION_SOURCE_TYPES={IRRIGATION_SOURCE_TYPES}
        IRRIGATION_SOURCE_TYPES_EN={IRRIGATION_SOURCE_TYPES_EN}
        sustainabilityScore={sustainabilityScore}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/irrigation-sources.svg"
              width={1200}
              height={400}
              alt="सिंचाई स्रोतको प्रकार अनुसार क्षेत्रफल - गढवा गाउँपालिका (Irrigation Sources by Coverage Area - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा सिंचाई स्रोतको प्रकार अनुसार क्षेत्रफल
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              सिंचाई स्रोत कृषि उत्पादनको लागि अत्यन्त महत्वपूर्ण पक्ष हो।
              गढवा गाउँपालिकामा कृषि क्षेत्रलाई अझ उत्पादनशील बनाउनका लागि
              विभिन्न प्रकारका सिंचाई स्रोतहरू प्रयोग गरिएको छ। यी सिंचाई
              स्रोतहरू मध्ये ताल वा जलाशय, सिंचाई नहर, वर्षाको पानी संकलन,
              विद्युतीय लिफ्ट सिंचाई, नहर, पम्पिङ सेट, भूमिगत सिंचाई लगायतका
              स्रोतहरू पर्दछन्।
            </p>
            <p>
              गढवा गाउँपालिकाको सिंचाई स्रोत सम्बन्धी तथ्याङ्क अनुसार, कुल{" "}
              {localizeNumber(totalCoverage.toFixed(2), "ne")}
              हेक्टर क्षेत्रफलमा सिंचाई सुविधा उपलब्ध छ, जसमध्ये सबैभन्दा बढी{" "}
              {overallSummary[0]?.typeName || ""}
              मार्फत{" "}
              {localizeNumber(
                ((overallSummary[0]?.coverage || 0) / totalCoverage) * 100 > 0
                  ? (
                      ((overallSummary[0]?.coverage || 0) / totalCoverage) *
                      100
                    ).toFixed(1)
                  : "0",
                "ne",
              )}
              % अर्थात्{" "}
              {localizeNumber(
                (overallSummary[0]?.coverage || 0).toFixed(2),
                "ne",
              )}{" "}
              हेक्टर क्षेत्रफलमा सिंचाई प्रदान गरिएको छ।
            </p>

            <h2
              id="main-irrigation-source-types"
              className="scroll-m-20 border-b pb-2"
            >
              सिंचाई स्रोतका प्रमुख प्रकारहरू
            </h2>
            <p>
              गढवा गाउँपालिकामा सिंचाई स्रोतका प्रमुख प्रकारहरू र तिनको
              कवरेज क्षेत्रफल निम्नानुसार रहेको छ:
            </p>

            <ul>
              {overallSummary.map((item, index) => (
                <li key={index}>
                  <strong>{item.typeName}</strong>: कुल{" "}
                  {localizeNumber(
                    ((item.coverage / totalCoverage) * 100 || 0).toFixed(1),
                    "ne",
                  )}
                  % ({localizeNumber(item.coverage.toFixed(2), "ne")} हेक्टर)
                </li>
              ))}
            </ul>

            <p>
              सिंचाई स्रोतको विश्लेषण गर्दा, गढवा गाउँपालिकामा परम्परागत
              सिंचाई स्रोतहरू (नहर, सिंचाई नहर) ले{" "}
              {localizeNumber(traditionalSourcePercentage, "ne")}% क्षेत्रफल
              ओगटेको देखिन्छ, जबकि आधुनिक सिंचाई प्रविधिहरू (विद्युतीय लिफ्ट
              सिंचाई, भूमिगत सिंचाई, पम्पिङ सेट) ले{" "}
              {localizeNumber(modernSourcePercentage, "ne")}% क्षेत्रफलमा सिंचाई
              प्रदान गर्दछन्।
            </p>

            <p>
              सिंचाई स्रोतको दिगोपनको दृष्टिकोणबाट, लगभग{" "}
              {localizeNumber(sustainabilityScore.toString(), "ne")}%
              क्षेत्रफलमा आधुनिक तथा प्राकृतिक स्रोतहरूबाट सिंचाई गरिएको छ, जसले
              भविष्यमा दिगो सिंचाई व्यवस्थापनको सम्भावना देखाउँछ।
            </p>
          </div>

          {/* Client component for charts */}
          <IrrigationSourceCharts
            overallSummary={overallSummary}
            totalCoverage={totalCoverage}
            pieChartData={pieChartData}
            IRRIGATION_SOURCE_TYPES={IRRIGATION_SOURCE_TYPES}
            IRRIGATION_SOURCE_COLORS={IRRIGATION_SOURCE_COLORS}
            irrigationAnalysis={irrigationAnalysis}
            traditionalSourcePercentage={traditionalSourcePercentage}
            modernSourcePercentage={modernSourcePercentage}
            naturalSourcePercentage={naturalSourcePercentage}
            otherSourcePercentage={otherSourcePercentage}
            sustainabilityScore={sustainabilityScore}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="irrigation-management-and-challenges"
              className="scroll-m-20 border-b pb-2"
            >
              सिंचाई व्यवस्थापन र चुनौतीहरू
            </h2>
            <p>
              गढवा गाउँपालिकामा सिंचाई स्रोतको प्रकारले सिंचाई व्यवस्थापन र
              उत्पादकत्वमा प्रभाव पारेको देखिन्छ। कुल{" "}
              {localizeNumber(totalCoverage.toFixed(2), "ne")} हेक्टर सिंचाई
              क्षेत्रफलमध्ये{" "}
              {localizeNumber(
                irrigationAnalysis.traditionalSourceCoverage.toFixed(2),
                "ne",
              )}
              हेक्टर परम्परागत सिंचाई स्रोतहरूमा र{" "}
              {localizeNumber(
                irrigationAnalysis.modernSourceCoverage.toFixed(2),
                "ne",
              )}{" "}
              हेक्टर आधुनिक सिंचाई प्रविधिमा निर्भर रहेको छ।
            </p>

            <p>
              सिंचाई स्रोतको प्रकार अनुसार सिंचित क्षेत्रफलको विश्लेषण गर्दा{" "}
              {overallSummary[0]?.typeName || ""} सबैभन्दा प्रभावकारी सिंचाई
              स्रोत रहेको देखिन्छ, जसले कुल सिंचित क्षेत्रफलको{" "}
              {localizeNumber(
                totalCoverage > 0
                  ? (
                      ((overallSummary[0]?.coverage || 0) / totalCoverage) *
                      100
                    ).toFixed(2)
                  : "0",
                "ne",
              )}
              % हिस्सा ओगटेको छ।
            </p>

            <IrrigationSourceAnalysisSection
              overallSummary={overallSummary}
              totalCoverage={totalCoverage}
              IRRIGATION_SOURCE_TYPES={IRRIGATION_SOURCE_TYPES}
              IRRIGATION_SOURCE_TYPES_EN={IRRIGATION_SOURCE_TYPES_EN}
              IRRIGATION_SOURCE_COLORS={IRRIGATION_SOURCE_COLORS}
              sustainabilityScore={sustainabilityScore}
              irrigationAnalysis={irrigationAnalysis}
              traditionalSourcePercentage={traditionalSourcePercentage}
              modernSourcePercentage={modernSourcePercentage}
              naturalSourcePercentage={naturalSourcePercentage}
            />

            <h2
              id="conclusions-and-recommendations"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              निष्कर्ष र सिफारिसहरू
            </h2>

            <p>
              गढवा गाउँपालिकाको सिंचाई स्रोतको अवस्थाको विश्लेषणबाट निम्न
              निष्कर्ष र सिफारिसहरू गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>सिंचाई स्रोतको विविधिकरण:</strong> हाल पालिकामा{" "}
                  {localizeNumber(traditionalSourcePercentage, "ne")}%
                  क्षेत्रफलमा परम्परागत सिंचाई स्रोत प्रयोग भइरहेकोमा आधुनिक
                  प्रविधिको विस्तार गर्नुपर्ने आवश्यकता देखिन्छ।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>प्राकृतिक स्रोतको संरक्षण:</strong>
                  ताल वा जलाशय र वर्षाको पानी संकलन जस्ता प्राकृतिक स्रोतहरू
                  संरक्षण गर्न विशेष कार्ययोजना तयार गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>नवीन प्रविधिको प्रोत्साहन:</strong> पालिकामा{" "}
                  {localizeNumber(modernSourcePercentage, "ne")}% क्षेत्रफलमा
                  मात्र आधुनिक सिंचाई प्रविधि प्रयोग भइरहेकोले थप क्षेत्रफलमा
                  विद्युतीय लिफ्ट सिंचाई र पम्पिङ सेटको प्रयोग बढाउन प्रोत्साहन
                  कार्यक्रम सञ्चालन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>दिगो व्यवस्थापन:</strong> सिंचाई स्रोतको दिगो
                  व्यवस्थापनका लागि उपभोक्ता समूह गठन र क्षमता अभिवृद्धि
                  कार्यक्रमहरू सञ्चालन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>लगानी वृद्धि:</strong> सिंचाई पूर्वाधारमा थप लगानी
                  बढाई कुल कृषियोग्य जमिनको सिंचाई क्षेत्रफल विस्तार गर्नुपर्ने।
                </div>
              </div>
            </div>

            <p className="mt-6">
              गढवा गाउँपालिकामा सिंचाई स्रोतको वर्तमान अवस्थाले सिंचाई
              व्यवस्थापनमा सुधार गर्नुपर्ने आवश्यकता देखाउँछ। आधुनिक प्रविधिको
              विकास र विस्तार, प्राकृतिक स्रोतको संरक्षण र दिगो व्यवस्थापन
              मार्फत कृषि उत्पादकत्व बढाउन आवश्यक देखिन्छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
