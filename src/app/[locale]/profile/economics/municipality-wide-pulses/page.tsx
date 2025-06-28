import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import PulseCharts from "./_components/pulse-charts";
import PulseAnalysisSection from "./_components/pulse-analysis-section";
import PulseSEO from "./_components/pulse-seo";
import { pulseTypeOptions } from "@/server/api/routers/profile/economics/municipality-wide-pulses.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define English names for pulse types (for SEO)
const PULSE_TYPES_EN: Record<string, string> = {
  LENTIL: "Lentil (Masuro)",
  CHICKPEA: "Chickpea (Chana)",
  PEA: "Pea (Kerau)",
  PIGEON_PEA: "Pigeon Pea (Rahar)",
  BLACK_GRAM: "Black Gram (Maas)",
  SOYABEAN: "Soyabean (Bhatmaas)",
  SNAKE_BEAN: "Snake Bean (Bodi)",
  BEAN: "Bean (Simi)",
  HORSE_GRAM: "Horse Gram (Gahat)",
  OTHER: "Other Pulse Crops",
  NONE: "No Pulse Cultivation",
};

// Define Nepali names for pulse types
// Use the labels from pulseTypeOptions
const PULSE_TYPES: Record<string, string> = pulseTypeOptions.reduce(
  (acc, option) => ({
    ...acc,
    [option.value]: option.label,
  }),
  {},
);

// Define colors for pulse types
const PULSE_COLORS: Record<string, string> = {
  LENTIL: "#e74c3c", // Red for Lentil
  CHICKPEA: "#9b59b6", // Purple for Chickpea
  PEA: "#3498db", // Blue for Pea
  PIGEON_PEA: "#1abc9c", // Turquoise for Pigeon Pea
  BLACK_GRAM: "#34495e", // Dark for Black Gram
  SOYABEAN: "#f1c40f", // Yellow for Soyabean
  SNAKE_BEAN: "#27ae60", // Green for Snake Bean
  BEAN: "#2ecc71", // Light green for Bean
  HORSE_GRAM: "#d35400", // Orange for Horse Gram
  OTHER: "#7f8c8d", // Gray for Other
  NONE: "#95a5a6", // Light gray for None
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const pulseData =
      await api.profile.economics.municipalityWidePulses.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalProduction = pulseData.reduce(
      (sum: number, item: { productionInTonnes: any }) =>
        sum + (parseFloat(String(item.productionInTonnes)) || 0),
      0,
    );

    const totalSales = pulseData.reduce(
      (sum: number, item: { salesInTonnes: any }) =>
        sum + (parseFloat(String(item.salesInTonnes)) || 0),
      0,
    );

    const totalRevenue = pulseData.reduce(
      (sum: number, item: { revenueInRs: any }) =>
        sum + (parseFloat(String(item.revenueInRs)) || 0),
      0,
    );

    // Find the most produced pulse
    let mostProducedPulse = "";
    let mostProducedAmount = 0;
    pulseData.forEach((item: { pulse: string; productionInTonnes: number }) => {
      if (item.productionInTonnes > mostProducedAmount) {
        mostProducedAmount = item.productionInTonnes;
        mostProducedPulse = item.pulse;
      }
    });

    const mostProducedPercentage =
      totalProduction > 0
        ? ((mostProducedAmount / totalProduction) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका दालबाली",
      "बुद्धशान्ति दालहरुको उत्पादन",
      "पालिका स्तरीय दालबाली तथ्याङ्क",
      "मसुरो उत्पादन बुद्धशान्ति",
      "चना उत्पादन तथ्याङ्क",
      "केराउ उत्पादन",
      `बुद्धशान्ति दालबाली बिक्री ${localizeNumber(totalSales.toFixed(2), "ne")} टन`,
      `बुद्धशान्ति दालबाली आय ${localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")} मिलियन`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality pulses",
      "Khajura pulse production",
      "Municipality-wide pulse statistics",
      "Lentil production in Khajura",
      "Chickpea cultivation statistics",
      "Pea production data",
      `Khajura pulse sales ${totalSales.toFixed(2)} tonnes`,
      `Khajura pulse revenue ${(totalRevenue / 1000000).toFixed(2)} million rupees`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `बुद्धशान्ति गाउँपालिकाको दालबाली उत्पादन र बिक्री विश्लेषण। कुल ${localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन दालबाली उत्पादन मध्ये ${localizeNumber(mostProducedPercentage, "ne")}% (${localizeNumber(mostProducedAmount.toFixed(2), "ne")} टन) ${PULSE_TYPES[mostProducedPulse] || mostProducedPulse} रहेको छ। पालिका स्तरीय दालबालीको विस्तृत विश्लेषण।`;

    const descriptionEN = `Analysis of pulse production and sales in Khajura Rural Municipality. Out of total ${totalProduction.toFixed(2)} metric tonnes of pulse production, ${mostProducedPercentage}% (${mostProducedAmount.toFixed(2)} tonnes) is ${PULSE_TYPES_EN[mostProducedPulse] || mostProducedPulse}. Detailed analysis of municipality-wide pulse patterns.`;

    return {
      title: `दालबालीको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/municipality-wide-pulses",
        languages: {
          en: "/en/profile/economics/municipality-wide-pulses",
          ne: "/ne/profile/economics/municipality-wide-pulses",
        },
      },
      openGraph: {
        title: `दालबालीको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `दालबालीको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "दालबालीको प्रकार अनुसार उत्पादन र बिक्री | बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "पालिका स्तरीय दालबालीको प्रकार अनुसारको उत्पादन, बिक्री र आम्दानीको विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "प्रमुख दालबालीहरू",
    slug: "main-pulses",
  },
  { level: 2, text: "उत्पादन र बिक्री", slug: "production-and-sales" },
  { level: 2, text: "आर्थिक प्रभाव", slug: "economic-impact" },
  {
    level: 2,
    text: "पोषण सुरक्षा र चुनौतीहरू",
    slug: "nutritional-security-and-challenges",
  },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function MunicipalityWidePulsesPage() {
  // Fetch all pulse data using tRPC
  const pulseData =
    await api.profile.economics.municipalityWidePulses.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.municipalityWidePulses.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  type PulseSummaryType = {
    type: string;
    typeName: string;
    production: number;
    sales: number;
    revenue: number;
  };

  // Process data for overall summary with proper typing
  const overallSummary: PulseSummaryType[] = Object.entries(
    pulseData.reduce(
      (
        acc: Record<
          string,
          { production: number; sales: number; revenue: number }
        >,
        item: {
          pulse: string;
          productionInTonnes: any;
          salesInTonnes: any;
          revenueInRs: any;
        },
      ) => {
        if (!acc[item.pulse]) {
          acc[item.pulse] = {
            production: 0,
            sales: 0,
            revenue: 0,
          };
        }
        acc[item.pulse].production +=
          parseFloat(String(item.productionInTonnes)) || 0;
        acc[item.pulse].sales += parseFloat(String(item.salesInTonnes)) || 0;
        acc[item.pulse].revenue += parseFloat(String(item.revenueInRs)) || 0;
        return acc;
      },
      {} as Record<
        string,
        { production: number; sales: number; revenue: number }
      >,
    ),
  )
    .map((entry) => {
      const [type, data] = entry as [
        string,
        { production: number; sales: number; revenue: number },
      ];
      return {
        type,
        typeName: PULSE_TYPES[type] || type,
        production: data.production,
        sales: data.sales,
        revenue: data.revenue,
      };
    })
    .sort((a, b) => b.production - a.production); // Sort by production descending

  // Calculate total values
  const totalProduction = overallSummary.reduce(
    (sum, item) => sum + item.production,
    0,
  );

  const totalSales = overallSummary.reduce((sum, item) => sum + item.sales, 0);

  const totalRevenue = overallSummary.reduce(
    (sum, item) => sum + item.revenue,
    0,
  );

  // Create data for pie chart (production)
  const productionPieChartData = overallSummary.map((item) => ({
    name: item.typeName,
    value: item.production,
    percentage: ((item.production / totalProduction) * 100).toFixed(2),
  }));

  // Create data for pie chart (revenue)
  const revenuePieChartData = overallSummary.map((item) => ({
    name: item.typeName,
    value: item.revenue,
    percentage: ((item.revenue / totalRevenue) * 100).toFixed(2),
  }));

  // Calculate pulse statistics
  const pulseAnalysis = {
    totalProduction,
    totalSales,
    totalRevenue,
    productionSalesRatio:
      totalProduction > 0 ? (totalSales / totalProduction) * 100 : 0,
    averagePricePerKg: totalSales > 0 ? totalRevenue / (totalSales * 1000) : 0, // Revenue per kg
    commercializationScore: Math.min(
      Math.round((totalSales / totalProduction) * 100),
      100,
    ),
  };

  // Calculate self-consumption
  const selfConsumption = totalProduction - totalSales;
  const selfConsumptionPercentage =
    totalProduction > 0
      ? ((selfConsumption / totalProduction) * 100).toFixed(2)
      : "0";

  // Calculate sold percentage
  const soldPercentage =
    totalProduction > 0
      ? ((totalSales / totalProduction) * 100).toFixed(2)
      : "0";

  return (
    <DocsLayout toc={<TableOfContents toc={toc} />}>
      {/* Add structured data for SEO */}
      <PulseSEO
        overallSummary={overallSummary}
        totalProduction={totalProduction}
        totalSales={totalSales}
        totalRevenue={totalRevenue}
        PULSE_TYPES={PULSE_TYPES}
        PULSE_TYPES_EN={PULSE_TYPES_EN}
        commercializationScore={pulseAnalysis.commercializationScore}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/pulses.svg"
              width={1200}
              height={400}
              alt="दालबालीको प्रकार अनुसार उत्पादन र बिक्री - बुद्धशान्ति गाउँपालिका (Pulses by Production and Sales - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा दालबालीको प्रकार अनुसार उत्पादन र बिक्री
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              दालबाली बुद्धशान्ति गाउँपालिकाको प्रमुख कृषि उत्पादनहरू मध्ये एक
              हो। यसका प्रमुख बालीहरूमा मसुरो, चना, केराउ, रहर, मास, भटमास,
              बोडी, सिमी र गहत जस्ता प्रोटिनयुक्त दालहरू पर्दछन्। यी
              दालबालीहरूले पालिकाको पोषण सुरक्षा र आर्थिक स्थितिमा महत्त्वपूर्ण
              भूमिका खेल्दछन्।
            </p>
            <p>
              बुद्धशान्ति गाउँपालिकाको दालबाली सम्बन्धी तथ्याङ्क अनुसार, यस
              क्षेत्रमा वार्षिक कुल{" "}
              {localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन
              दालबाली उत्पादन हुन्छ, जसमध्ये सबैभन्दा बढी{" "}
              {overallSummary[0]?.typeName || ""}
              {localizeNumber(
                ((overallSummary[0]?.production || 0) / totalProduction) * 100 >
                  0
                  ? (
                      ((overallSummary[0]?.production || 0) / totalProduction) *
                      100
                    ).toFixed(1)
                  : "0",
                "ne",
              )}
              % अर्थात्{" "}
              {localizeNumber(
                (overallSummary[0]?.production || 0).toFixed(2),
                "ne",
              )}{" "}
              मेट्रिक टन उत्पादन हुन्छ।
            </p>

            <h2 id="main-pulses" className="scroll-m-20 border-b pb-2">
              प्रमुख दालबालीहरू
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा उत्पादित प्रमुख दालबालीहरू र तिनको
              उत्पादन परिमाण निम्नानुसार रहेको छ:
            </p>

            <ul>
              {overallSummary.map((item, index) => (
                <li key={index}>
                  <strong>{item.typeName}</strong>: कुल{" "}
                  {localizeNumber(
                    ((item.production / totalProduction) * 100 || 0).toFixed(1),
                    "ne",
                  )}
                  % ({localizeNumber(item.production.toFixed(2), "ne")} मेट्रिक
                  टन)
                </li>
              ))}
            </ul>

            <p>
              दालबालीको विश्लेषण गर्दा, बुद्धशान्ति गाउँपालिकामा उत्पादित कुल
              दालबाली मध्ये {localizeNumber(soldPercentage, "ne")}% बिक्रीका
              लागि बजारमा जान्छ, जबकि{" "}
              {localizeNumber(selfConsumptionPercentage, "ne")}% घरायसी उपभोगमा
              खर्च हुन्छ। यसबाट वार्षिक रु.{" "}
              {localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")} मिलियन
              आम्दानी हुने अनुमान गरिएको छ।
            </p>

            <p>
              उत्पादन र बिक्रीको दृष्टिकोणले हेर्दा, अनुमानित{" "}
              {localizeNumber(
                pulseAnalysis.commercializationScore.toString(),
                "ne",
              )}
              % व्यावसायीकरण स्कोर रहेको छ, जसले पालिकाको कृषि क्षेत्रको
              व्यावसायीकरणको अवस्था देखाउँछ।
            </p>
          </div>

          {/* Client component for charts */}
          <PulseCharts
            overallSummary={overallSummary}
            totalProduction={totalProduction}
            totalSales={totalSales}
            totalRevenue={totalRevenue}
            productionPieChartData={productionPieChartData}
            revenuePieChartData={revenuePieChartData}
            PULSE_TYPES={PULSE_TYPES}
            PULSE_COLORS={PULSE_COLORS}
            pulseAnalysis={pulseAnalysis}
            soldPercentage={soldPercentage}
            selfConsumptionPercentage={selfConsumptionPercentage}
            commercializationScore={pulseAnalysis.commercializationScore}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="nutritional-security-and-challenges"
              className="scroll-m-20 border-b pb-2"
            >
              पोषण सुरक्षा र चुनौतीहरू
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा दालबालीको उत्पादनले पोषण सुरक्षामा
              महत्त्वपूर्ण भूमिका खेल्दछ। कुल{" "}
              {localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन
              दालबाली उत्पादन मध्ये{" "}
              {localizeNumber(selfConsumption.toFixed(2), "ne")}
              मेट्रिक टन स्थानीय उपभोगमा प्रयोग हुन्छ, जसले पालिकाको पोषण
              आत्मनिर्भरतामा सहयोग पुर्‍याउँछ।
            </p>

            <p>
              बुद्धशान्ति गाउँपालिकाको प्रमुख दालबालीको उत्पादकत्व र बजारीकरणको
              विश्लेषण गर्दा {overallSummary[0]?.typeName || ""} सबैभन्दा
              प्रभावकारी दालबाली रहेको देखिन्छ, जसले कुल दालबाली उत्पादनको{" "}
              {localizeNumber(
                totalProduction > 0
                  ? (
                      ((overallSummary[0]?.production || 0) / totalProduction) *
                      100
                    ).toFixed(2)
                  : "0",
                "ne",
              )}
              % हिस्सा ओगटेको छ।
            </p>

            <PulseAnalysisSection
              overallSummary={overallSummary}
              totalProduction={totalProduction}
              totalSales={totalSales}
              totalRevenue={totalRevenue}
              PULSE_TYPES={PULSE_TYPES}
              PULSE_TYPES_EN={PULSE_TYPES_EN}
              PULSE_COLORS={PULSE_COLORS}
              commercializationScore={pulseAnalysis.commercializationScore}
              pulseAnalysis={pulseAnalysis}
              soldPercentage={soldPercentage}
              selfConsumptionPercentage={selfConsumptionPercentage}
            />

            <h2
              id="conclusions-and-recommendations"
              className="scroll-m-20 border-b pb-2 mt-12"
            >
              निष्कर्ष र सिफारिसहरू
            </h2>

            <p>
              बुद्धशान्ति गाउँपालिकाको दालबालीको अवस्थाको विश्लेषणबाट निम्न
              निष्कर्ष र सिफारिसहरू गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>बिउ विजनको गुणस्तर सुधार:</strong> उच्च उत्पादन दिने
                  जातको बिउ विजन प्रयोगमा जोड दिन आवश्यक छ, जसले उत्पादकत्वमा
                  वृद्धि गर्न मद्दत गर्नेछ।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>रोग कीरा व्यवस्थापन:</strong>
                  दालबालीमा लाग्ने विभिन्न रोग र कीराहरूको प्रभावकारी
                  नियन्त्रणका लागि एकीकृत शत्रुजीव व्यवस्थापन (IPM) प्रविधि
                  अपनाउनु पर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>मूल्य श्रृंखला विकास:</strong> पालिकामा{" "}
                  {localizeNumber(soldPercentage, "ne")}% दालबाली मात्र बिक्रीमा
                  जाने अवस्था रहेकोले बजारीकरणको प्रवर्द्धन गर्नुपर्ने देखिन्छ।
                  भण्डारण, प्रशोधन र बजार पहुँच सुदृढ गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>बाली विविधिकरण:</strong> हाल प्रमुख दालबाली{" "}
                  {overallSummary[0]?.typeName || ""} र{" "}
                  {overallSummary[1]?.typeName || ""} मा जोड दिइएकोमा अन्य
                  दालबालीको पनि उत्पादन बढाउनु पर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>प्राविधिक सहयोग र प्रशिक्षण:</strong> किसानहरूलाई
                  दालबालीको उन्नत खेती प्रविधि, भण्डारण र प्रशोधन सम्बन्धी
                  प्रशिक्षण दिन आवश्यक।
                </div>
              </div>
            </div>

            <p className="mt-6">
              बुद्धशान्ति गाउँपालिकामा दालबालीको वर्तमान अवस्थाले अझै पनि कृषि
              क्षेत्रमा सुधार गर्नुपर्ने आवश्यकता देखाउँछ। उत्पादकत्व वृद्धि,
              मूल्य श्रृंखला विकास, व्यावसायीकरण र आधुनिकीकरण मार्फत पोषण
              सुरक्षा र आर्थिक समृद्धि हासिल गर्न सकिनेछ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
