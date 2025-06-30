import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import SpiceCharts from "./_components/spice-charts";
import SpiceAnalysisSection from "./_components/spice-analysis-section";
import SpiceSEO from "./_components/spice-seo";
import { spiceTypeOptions } from "@/server/api/routers/profile/economics/municipality-wide-spices.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define English names for spice types (for SEO)
const SPICE_TYPES_EN: Record<string, string> = {
  GARLIC: "Garlic",
  TURMERIC: "Turmeric",
  CHILI_PEPPER: "Chili Pepper",
  GINGER: "Ginger",
  CORIANDER: "Coriander",
  SICHUAN_PEPPER: "Sichuan Pepper",
  BLACK_PEPPER: "Black Pepper",
  CINNAMOMUM_TAMALA: "Cinnamomum Tamala",
  CUMIN: "Cumin",
  FENUGREEK: "Fenugreek",
  OTHER: "Other Spices",
  NONE: "No Spice Cultivation",
};

// Define Nepali names for spice types
// Use the labels from spiceTypeOptions
const SPICE_TYPES: Record<string, string> = spiceTypeOptions.reduce(
  (acc, option) => ({
    ...acc,
    [option.value]: option.label,
  }),
  {},
);

// Define colors for spice types
const SPICE_COLORS: Record<string, string> = {
  GARLIC: "#e67e22", // Orange for Garlic
  TURMERIC: "#f39c12", // Yellow-orange for Turmeric
  CHILI_PEPPER: "#e74c3c", // Red for Chili Pepper
  GINGER: "#d35400", // Dark orange for Ginger
  CORIANDER: "#2ecc71", // Green for Coriander
  SICHUAN_PEPPER: "#c0392b", // Dark red for Sichuan Pepper
  BLACK_PEPPER: "#34495e", // Dark blue-gray for Black Pepper
  CINNAMOMUM_TAMALA: "#8e44ad", // Purple for Cinnamomum Tamala
  CUMIN: "#7f8c8d", // Gray for Cumin
  FENUGREEK: "#27ae60", // Dark green for Fenugreek
  OTHER: "#3498db", // Blue for Other
  NONE: "#95a5a6", // Light gray for None
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const spiceData =
      await api.profile.economics.municipalityWideSpices.getAll.query();
    const municipalityName = "केराबारी गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalProduction = spiceData.reduce(
      (sum: number, item: { productionInTonnes: any }) =>
        sum + (parseFloat(String(item.productionInTonnes)) || 0),
      0,
    );

    const totalSales = spiceData.reduce(
      (sum: number, item: { salesInTonnes: any }) =>
        sum + (parseFloat(String(item.salesInTonnes)) || 0),
      0,
    );

    const totalRevenue = spiceData.reduce(
      (sum: number, item: { revenueInRs: any }) =>
        sum + (parseFloat(String(item.revenueInRs)) || 0),
      0,
    );

    // Find the most produced spice
    let mostProducedSpice = "";
    let mostProducedAmount = 0;
    spiceData.forEach(
      (item: { spiceType: string; productionInTonnes: number }) => {
        if (item.productionInTonnes > mostProducedAmount) {
          mostProducedAmount = item.productionInTonnes;
          mostProducedSpice = item.spiceType;
        }
      },
    );

    const mostProducedPercentage =
      totalProduction > 0
        ? ((mostProducedAmount / totalProduction) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "केराबारी गाउँपालिका मसलाबाली",
      "केराबारी मसलाको उत्पादन",
      "पालिका स्तरीय मसलाबाली तथ्याङ्क",
      "लसुन उत्पादन केराबारी",
      "खुर्सानी उत्पादन तथ्याङ्क",
      "धनिया उत्पादन",
      `केराबारी मसलाबाली बिक्री ${localizeNumber(totalSales.toFixed(2), "ne")} टन`,
      `केराबारी मसलाबाली आय ${localizeNumber(
        (totalRevenue / 1000).toFixed(2),
        "ne",
      )} हजार`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality spices",
      "Khajura spice production",
      "Municipality-wide spice statistics",
      "Garlic production in Khajura",
      "Chili pepper cultivation statistics",
      "Coriander production data",
      `Khajura spice sales ${totalSales.toFixed(2)} tonnes`,
      `Khajura spice revenue ${(totalRevenue / 1000).toFixed(2)} thousand rupees`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `केराबारी गाउँपालिकाको मसलाबाली उत्पादन र बिक्री विश्लेषण। कुल ${localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन मसलाबाली उत्पादन मध्ये ${localizeNumber(mostProducedPercentage, "ne")}% (${localizeNumber(mostProducedAmount.toFixed(2), "ne")} टन) ${SPICE_TYPES[mostProducedSpice] || mostProducedSpice} रहेको छ। पालिका स्तरीय मसलाबालीको विस्तृत विश्लेषण।`;

    const descriptionEN = `Analysis of spice production and sales in Khajura Rural Municipality. Out of total ${totalProduction.toFixed(2)} metric tonnes of spice production, ${mostProducedPercentage}% (${mostProducedAmount.toFixed(2)} tonnes) is ${SPICE_TYPES_EN[mostProducedSpice] || mostProducedSpice}. Detailed analysis of municipality-wide spice patterns.`;

    return {
      title: `मसलाबालीको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/municipality-wide-spices",
        languages: {
          en: "/en/profile/economics/municipality-wide-spices",
          ne: "/ne/profile/economics/municipality-wide-spices",
        },
      },
      openGraph: {
        title: `मसलाबालीको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `मसलाबालीको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "मसलाबालीको प्रकार अनुसार उत्पादन र बिक्री | केराबारी गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "पालिका स्तरीय मसलाबालीको प्रकार अनुसारको उत्पादन, बिक्री र आम्दानीको विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "प्रमुख मसलाबालीहरू",
    slug: "main-spices",
  },
  { level: 2, text: "उत्पादन र बिक्री", slug: "production-and-sales" },
  { level: 2, text: "आर्थिक प्रभाव", slug: "economic-impact" },
  {
    level: 2,
    text: "मसलाबाली र स्थानीय अर्थतन्त्र",
    slug: "spices-and-local-economy",
  },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function MunicipalityWideSpicesPage() {
  // Fetch all spice data using tRPC
  const spiceData =
    await api.profile.economics.municipalityWideSpices.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.municipalityWideSpices.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  type SpiceSummaryType = {
    type: string;
    typeName: string;
    production: number;
    sales: number;
    revenue: number;
  };

  // Process data for overall summary with proper typing
  const overallSummary: SpiceSummaryType[] = Object.entries(
    spiceData.reduce(
      (
        acc: Record<
          string,
          { production: number; sales: number; revenue: number }
        >,
        item: {
          spiceType: string;
          productionInTonnes: any;
          salesInTonnes: any;
          revenueInRs: any;
        },
      ) => {
        if (!acc[item.spiceType]) {
          acc[item.spiceType] = {
            production: 0,
            sales: 0,
            revenue: 0,
          };
        }
        acc[item.spiceType].production +=
          parseFloat(String(item.productionInTonnes)) || 0;
        acc[item.spiceType].sales +=
          parseFloat(String(item.salesInTonnes)) || 0;
        acc[item.spiceType].revenue +=
          parseFloat(String(item.revenueInRs)) || 0;
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
        typeName: SPICE_TYPES[type] || type,
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

  // Calculate spice statistics
  const spiceAnalysis = {
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
      <SpiceSEO
        overallSummary={overallSummary}
        totalProduction={totalProduction}
        totalSales={totalSales}
        totalRevenue={totalRevenue}
        SPICE_TYPES={SPICE_TYPES}
        SPICE_TYPES_EN={SPICE_TYPES_EN}
        commercializationScore={spiceAnalysis.commercializationScore}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/spices.svg"
              width={1200}
              height={400}
              alt="मसलाबालीको प्रकार अनुसार उत्पादन र बिक्री - केराबारी गाउँपालिका (Spices by Production and Sales - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              केराबारी गाउँपालिकामा मसलाबालीको प्रकार अनुसार उत्पादन र बिक्री
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              मसलाबाली केराबारी गाउँपालिकाको प्रमुख कृषि उत्पादनहरू मध्ये एक
              हो। यसका प्रमुख बालीहरूमा लसुन, खुर्सानी, धनिया र अन्य मसलाबालीहरू
              पर्दछन्। यी मसलाबालीहरूले पालिकाको पोषण सुरक्षा र आर्थिक स्थितिमा
              महत्त्वपूर्ण भूमिका खेल्दछन्।
            </p>
            <p>
              केराबारी गाउँपालिकाको मसलाबाली सम्बन्धी तथ्याङ्क अनुसार, यस
              क्षेत्रमा वार्षिक कुल{" "}
              {localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन
              मसलाबाली उत्पादन हुन्छ, जसमध्ये सबैभन्दा बढी{" "}
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

            <h2 id="main-spices" className="scroll-m-20 border-b pb-2">
              प्रमुख मसलाबालीहरू
            </h2>
            <p>
              केराबारी गाउँपालिकामा उत्पादित प्रमुख मसलाबालीहरू र तिनको
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
              मसलाबालीको विश्लेषण गर्दा, केराबारी गाउँपालिकामा उत्पादित कुल
              मसलाबाली मध्ये {localizeNumber(soldPercentage, "ne")}% बिक्रीका
              लागि बजारमा जान्छ, जबकि{" "}
              {localizeNumber(selfConsumptionPercentage, "ne")}% घरायसी उपभोगमा
              खर्च हुन्छ। यसबाट वार्षिक रु.{" "}
              {localizeNumber((totalRevenue / 1000).toFixed(2), "ne")} हजार
              आम्दानी हुने अनुमान गरिएको छ।
            </p>

            <p>
              उत्पादन र बिक्रीको दृष्टिकोणले हेर्दा, अनुमानित{" "}
              {localizeNumber(
                spiceAnalysis.commercializationScore.toString(),
                "ne",
              )}
              % व्यावसायीकरण स्कोर रहेको छ, जसले पालिकाको कृषि क्षेत्रको
              व्यावसायीकरणको अवस्था देखाउँछ।
            </p>
          </div>

          {/* Client component for charts */}
          <SpiceCharts
            overallSummary={overallSummary}
            totalProduction={totalProduction}
            totalSales={totalSales}
            totalRevenue={totalRevenue}
            productionPieChartData={productionPieChartData}
            revenuePieChartData={revenuePieChartData}
            SPICE_TYPES={SPICE_TYPES}
            SPICE_COLORS={SPICE_COLORS}
            spiceAnalysis={spiceAnalysis}
            soldPercentage={soldPercentage}
            selfConsumptionPercentage={selfConsumptionPercentage}
            commercializationScore={spiceAnalysis.commercializationScore}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="spices-and-local-economy"
              className="scroll-m-20 border-b pb-2"
            >
              मसलाबाली र स्थानीय अर्थतन्त्र
            </h2>
            <p>
              केराबारी गाउँपालिकामा मसलाबालीको उत्पादनले स्थानीय अर्थतन्त्रमा
              महत्त्वपूर्ण भूमिका खेल्दछ। कुल{" "}
              {localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन
              मसलाबाली उत्पादन मध्ये{" "}
              {localizeNumber(selfConsumption.toFixed(2), "ne")}
              मेट्रिक टन स्थानीय उपभोगमा प्रयोग हुन्छ, जबकि{" "}
              {localizeNumber(totalSales.toFixed(2), "ne")} मेट्रिक टन बिक्रीका
              लागि बजारमा जान्छ।
            </p>

            <p>
              केराबारी गाउँपालिकाको प्रमुख मसलाबालीको उत्पादकत्व र बजारीकरणको
              विश्लेषण गर्दा {overallSummary[0]?.typeName || ""} सबैभन्दा
              प्रभावकारी मसलाबाली रहेको देखिन्छ, जसले कुल मसलाबाली उत्पादनको{" "}
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

            <SpiceAnalysisSection
              overallSummary={overallSummary}
              totalProduction={totalProduction}
              totalSales={totalSales}
              totalRevenue={totalRevenue}
              SPICE_TYPES={SPICE_TYPES}
              SPICE_TYPES_EN={SPICE_TYPES_EN}
              SPICE_COLORS={SPICE_COLORS}
              commercializationScore={spiceAnalysis.commercializationScore}
              spiceAnalysis={spiceAnalysis}
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
              केराबारी गाउँपालिकाको मसलाबालीको अवस्थाको विश्लेषणबाट निम्न
              निष्कर्ष र सिफारिसहरू गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>मसलाबाली विस्तार र विविधीकरण:</strong> प्रमुख
                  मसलाबालीको क्षेत्रफल विस्तार गर्दै उच्च मूल्यका मसलाबालीहरूको
                  विविधीकरणमा जोड दिनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>रोग कीरा व्यवस्थापन:</strong>
                  मसलाबालीमा लाग्ने विभिन्न रोग र कीराहरूको प्रभावकारी
                  नियन्त्रणका लागि एकीकृत शत्रुजीव व्यवस्थापन (IPM) प्रविधि
                  अपनाउनु पर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>मूल्य श्रृंखला विकास:</strong> पालिकामा{" "}
                  {localizeNumber(soldPercentage, "ne")}% मसलाबाली मात्र
                  बिक्रीमा जाने अवस्था रहेकोले बजारीकरणको प्रवर्द्धन गर्नुपर्ने
                  देखिन्छ। भण्डारण, प्रशोधन र बजार पहुँच सुदृढ गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>प्रशोधन उद्योग स्थापना:</strong> स्थानीय स्तरमा मसला
                  प्रशोधन उद्योगहरू स्थापना गरी मूल्य अभिवृद्धि गर्न प्रोत्साहित
                  गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>प्राविधिक सहयोग र प्रशिक्षण:</strong> किसानहरूलाई
                  मसलाबाली उत्पादन प्रविधि, भण्डारण र प्रशोधन सम्बन्धी प्रशिक्षण
                  दिन आवश्यक।
                </div>
              </div>
            </div>

            <p className="mt-6">
              केराबारी गाउँपालिकामा मसलाबालीको वर्तमान अवस्थाले अझै विकासको
              सम्भावना देखाउँछ। उत्पादकत्व वृद्धि, प्रशोधन प्रविधिमा आधुनिकीकरण
              र व्यावसायीकरण मार्फत मसला बाली उत्पादनलाई प्रोत्साहित गर्न
              सकिनेछ। यसका लागि स्थानीय सरकारले सक्रिय नीति निर्माण र प्रोत्साहन
              गर्नु आवश्यक छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
