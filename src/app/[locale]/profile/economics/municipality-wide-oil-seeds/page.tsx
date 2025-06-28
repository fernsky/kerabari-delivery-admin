import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import OilSeedCharts from "./_components/oil-seed-charts";
import OilSeedAnalysisSection from "./_components/oil-seed-analysis-section";
import OilSeedSEO from "./_components/oil-seed-seo";
import { oilSeedTypeOptions } from "@/server/api/routers/profile/economics/municipality-wide-oil-seeds.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define English names for oil seed types (for SEO)
const OIL_SEED_TYPES_EN: Record<string, string> = {
  MUSTARD: "Mustard (Tori/Sarson)",
  FLAX: "Flax (Alas)",
  SUNFLOWER: "Sunflower (Suryamukhi)",
  OTHER: "Other Oil Seeds (Olive, Rayo, etc.)",
  NONE: "No Oil Seed Cultivation",
};

// Define Nepali names for oil seed types
// Use the labels from oilSeedTypeOptions
const OIL_SEED_TYPES: Record<string, string> = oilSeedTypeOptions.reduce(
  (acc, option) => ({
    ...acc,
    [option.value]: option.label,
  }),
  {},
);

// Define colors for oil seed types
const OIL_SEED_COLORS: Record<string, string> = {
  MUSTARD: "#f39c12", // Yellow for Mustard
  FLAX: "#3498db", // Blue for Flax
  SUNFLOWER: "#f1c40f", // Bright yellow for Sunflower
  OTHER: "#7f8c8d", // Gray for Other
  NONE: "#95a5a6", // Light gray for None
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const oilSeedData =
      await api.profile.economics.municipalityWideOilSeeds.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalProduction = oilSeedData.reduce(
      (sum: number, item: { productionInTonnes: any }) =>
        sum + (parseFloat(String(item.productionInTonnes)) || 0),
      0,
    );

    const totalSales = oilSeedData.reduce(
      (sum: number, item: { salesInTonnes: any }) =>
        sum + (parseFloat(String(item.salesInTonnes)) || 0),
      0,
    );

    const totalRevenue = oilSeedData.reduce(
      (sum: number, item: { revenueInRs: any }) =>
        sum + (parseFloat(String(item.revenueInRs)) || 0),
      0,
    );

    // Find the most produced oil seed
    let mostProducedOilSeed = "";
    let mostProducedAmount = 0;
    oilSeedData.forEach(
      (item: { oilSeed: string; productionInTonnes: number }) => {
        if (item.productionInTonnes > mostProducedAmount) {
          mostProducedAmount = item.productionInTonnes;
          mostProducedOilSeed = item.oilSeed;
        }
      },
    );

    const mostProducedPercentage =
      totalProduction > 0
        ? ((mostProducedAmount / totalProduction) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका तेलहन बाली",
      "बुद्धशान्ति तेलहनको उत्पादन",
      "पालिका स्तरीय तेलहन बाली तथ्याङ्क",
      "तोरी/सरसोँ उत्पादन बुद्धशान्ति",
      "आलस उत्पादन तथ्याङ्क",
      "सूर्यमूखी उत्पादन",
      `बुद्धशान्ति तेलहन बाली बिक्री ${localizeNumber(totalSales.toFixed(2), "ne")} टन`,
      `बुद्धशान्ति तेलहन बाली आय ${localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")} मिलियन`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality oil seeds",
      "Khajura oil seed production",
      "Municipality-wide oil seed statistics",
      "Mustard production in Khajura",
      "Flax cultivation statistics",
      "Sunflower production data",
      `Khajura oil seed sales ${totalSales.toFixed(2)} tonnes`,
      `Khajura oil seed revenue ${(totalRevenue / 1000000).toFixed(2)} million rupees`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `बुद्धशान्ति गाउँपालिकाको तेलहन बाली उत्पादन र बिक्री विश्लेषण। कुल ${localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन तेलहन बाली उत्पादन मध्ये ${localizeNumber(mostProducedPercentage, "ne")}% (${localizeNumber(mostProducedAmount.toFixed(2), "ne")} टन) ${OIL_SEED_TYPES[mostProducedOilSeed] || mostProducedOilSeed} रहेको छ। पालिका स्तरीय तेलहन बालीको विस्तृत विश्लेषण।`;

    const descriptionEN = `Analysis of oil seed production and sales in Khajura Rural Municipality. Out of total ${totalProduction.toFixed(2)} metric tonnes of oil seed production, ${mostProducedPercentage}% (${mostProducedAmount.toFixed(2)} tonnes) is ${OIL_SEED_TYPES_EN[mostProducedOilSeed] || mostProducedOilSeed}. Detailed analysis of municipality-wide oil seed patterns.`;

    return {
      title: `तेलहन बालीको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/municipality-wide-oil-seeds",
        languages: {
          en: "/en/profile/economics/municipality-wide-oil-seeds",
          ne: "/ne/profile/economics/municipality-wide-oil-seeds",
        },
      },
      openGraph: {
        title: `तेलहन बालीको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `तेलहन बालीको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "तेलहन बालीको प्रकार अनुसार उत्पादन र बिक्री | बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "पालिका स्तरीय तेलहन बालीको प्रकार अनुसारको उत्पादन, बिक्री र आम्दानीको विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "प्रमुख तेलहन बालीहरू",
    slug: "main-oil-seeds",
  },
  { level: 2, text: "उत्पादन र बिक्री", slug: "production-and-sales" },
  { level: 2, text: "आर्थिक प्रभाव", slug: "economic-impact" },
  {
    level: 2,
    text: "तेलहन बाली र स्थानीय अर्थतन्त्र",
    slug: "oil-seeds-and-local-economy",
  },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function MunicipalityWideOilSeedsPage() {
  // Fetch all oil seed data using tRPC
  const oilSeedData =
    await api.profile.economics.municipalityWideOilSeeds.getAll.query();
  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.municipalityWideOilSeeds.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  type OilSeedSummaryType = {
    type: string;
    typeName: string;
    production: number;
    sales: number;
    revenue: number;
  };

  // Process data for overall summary with proper typing
  const overallSummary: OilSeedSummaryType[] = Object.entries(
    oilSeedData.reduce(
      (
        acc: Record<
          string,
          { production: number; sales: number; revenue: number }
        >,
        item: {
          oilSeed: string;
          productionInTonnes: any;
          salesInTonnes: any;
          revenueInRs: any;
        },
      ) => {
        if (!acc[item.oilSeed]) {
          acc[item.oilSeed] = {
            production: 0,
            sales: 0,
            revenue: 0,
          };
        }
        acc[item.oilSeed].production +=
          parseFloat(String(item.productionInTonnes)) || 0;
        acc[item.oilSeed].sales += parseFloat(String(item.salesInTonnes)) || 0;
        acc[item.oilSeed].revenue += parseFloat(String(item.revenueInRs)) || 0;
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
        typeName: OIL_SEED_TYPES[type] || type,
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

  // Calculate oil seed statistics
  const oilSeedAnalysis = {
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
      <OilSeedSEO
        overallSummary={overallSummary}
        totalProduction={totalProduction}
        totalSales={totalSales}
        totalRevenue={totalRevenue}
        OIL_SEED_TYPES={OIL_SEED_TYPES}
        OIL_SEED_TYPES_EN={OIL_SEED_TYPES_EN}
        commercializationScore={oilSeedAnalysis.commercializationScore}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/oil-seeds.svg"
              width={1200}
              height={400}
              alt="तेलहन बालीको प्रकार अनुसार उत्पादन र बिक्री - बुद्धशान्ति गाउँपालिका (Oil Seeds by Production and Sales - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा तेलहन बालीको प्रकार अनुसार उत्पादन र
              बिक्री
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              तेलहन बाली बुद्धशान्ति गाउँपालिकाको प्रमुख कृषि उत्पादनहरू मध्ये
              एक हो। यसका प्रमुख बालीहरूमा तोरी/सरसोँ, आलस, सूर्यमूखी, र अन्य
              तेलहन बालीहरू पर्दछन्। यी तेलहन बालीहरूले पालिकाको तेल
              आत्मनिर्भरता र आर्थिक स्थितिमा महत्त्वपूर्ण भूमिका खेल्दछन्।
            </p>
            <p>
              बुद्धशान्ति गाउँपालिकाको तेलहन बाली सम्बन्धी तथ्याङ्क अनुसार, यस
              क्षेत्रमा वार्षिक कुल{" "}
              {localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन
              तेलहन बाली उत्पादन हुन्छ, जसमध्ये सबैभन्दा बढी{" "}
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

            <h2 id="main-oil-seeds" className="scroll-m-20 border-b pb-2">
              प्रमुख तेलहन बालीहरू
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा उत्पादित प्रमुख तेलहन बालीहरू र तिनको
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
              तेलहन बालीको विश्लेषण गर्दा, बुद्धशान्ति गाउँपालिकामा उत्पादित कुल
              तेलहन बाली मध्ये {localizeNumber(soldPercentage, "ne")}% बिक्रीका
              लागि बजारमा जान्छ, जबकि{" "}
              {localizeNumber(selfConsumptionPercentage, "ne")}% घरायसी उपभोगमा
              खर्च हुन्छ। यसबाट वार्षिक रु.{" "}
              {localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")} मिलियन
              आम्दानी हुने अनुमान गरिएको छ।
            </p>

            <p>
              उत्पादन र बिक्रीको दृष्टिकोणले हेर्दा, अनुमानित{" "}
              {localizeNumber(
                oilSeedAnalysis.commercializationScore.toString(),
                "ne",
              )}
              % व्यावसायीकरण स्कोर रहेको छ, जसले पालिकाको कृषि क्षेत्रको
              व्यावसायीकरणको अवस्था देखाउँछ।
            </p>
          </div>

          {/* Client component for charts */}
          <OilSeedCharts
            overallSummary={overallSummary}
            totalProduction={totalProduction}
            totalSales={totalSales}
            totalRevenue={totalRevenue}
            productionPieChartData={productionPieChartData}
            revenuePieChartData={revenuePieChartData}
            OIL_SEED_TYPES={OIL_SEED_TYPES}
            OIL_SEED_COLORS={OIL_SEED_COLORS}
            oilSeedAnalysis={oilSeedAnalysis}
            soldPercentage={soldPercentage}
            selfConsumptionPercentage={selfConsumptionPercentage}
            commercializationScore={oilSeedAnalysis.commercializationScore}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="oil-seeds-and-local-economy"
              className="scroll-m-20 border-b pb-2"
            >
              तेलहन बाली र स्थानीय अर्थतन्त्र
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा तेलहन बालीको उत्पादनले स्थानीय
              अर्थतन्त्रमा महत्त्वपूर्ण भूमिका खेल्दछ। कुल{" "}
              {localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन
              तेलहन बाली उत्पादन मध्ये{" "}
              {localizeNumber(selfConsumption.toFixed(2), "ne")}
              मेट्रिक टन स्थानीय उपभोगमा प्रयोग हुन्छ, जबकि{" "}
              {localizeNumber(totalSales.toFixed(2), "ne")} मेट्रिक टन बिक्रीका
              लागि बजारमा जान्छ।
            </p>

            <p>
              बुद्धशान्ति गाउँपालिकाको प्रमुख तेलहन बालीको उत्पादकत्व र
              बजारीकरणको विश्लेषण गर्दा {overallSummary[0]?.typeName || ""}{" "}
              सबैभन्दा प्रभावकारी तेलहन बाली रहेको देखिन्छ, जसले कुल तेलहन बाली
              उत्पादनको{" "}
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

            <OilSeedAnalysisSection
              overallSummary={overallSummary}
              totalProduction={totalProduction}
              totalSales={totalSales}
              totalRevenue={totalRevenue}
              OIL_SEED_TYPES={OIL_SEED_TYPES}
              OIL_SEED_TYPES_EN={OIL_SEED_TYPES_EN}
              OIL_SEED_COLORS={OIL_SEED_COLORS}
              commercializationScore={oilSeedAnalysis.commercializationScore}
              oilSeedAnalysis={oilSeedAnalysis}
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
              बुद्धशान्ति गाउँपालिकाको तेलहन बालीको अवस्थाको विश्लेषणबाट निम्न
              निष्कर्ष र सिफारिसहरू गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>बिउ विजनको गुणस्तर सुधार:</strong> उच्च उत्पादन र तेल
                  प्रतिशत दिने जातको बिउ विजन प्रयोगमा जोड दिन आवश्यक छ।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>रोग कीरा व्यवस्थापन:</strong>
                  तेलहन बालीमा लाग्ने विभिन्न रोग र कीराहरूको प्रभावकारी
                  नियन्त्रणका लागि एकीकृत शत्रुजीव व्यवस्थापन (IPM) प्रविधि
                  अपनाउनु पर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>मूल्य श्रृंखला विकास:</strong> पालिकामा{" "}
                  {localizeNumber(soldPercentage, "ne")}% तेलहन बाली मात्र
                  बिक्रीमा जाने अवस्था रहेकोले बजारीकरणको प्रवर्द्धन गर्नुपर्ने
                  देखिन्छ। भण्डारण, प्रशोधन र बजार पहुँच सुदृढ गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>साना तेल प्रशोधन उद्योग स्थापना:</strong> स्थानीय
                  स्तरमा साना तेल प्रशोधन उद्योगहरू स्थापना गरी उत्पादित तेलहन
                  बालीको प्रशोधन गर्न प्रोत्साहित गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>प्राविधिक सहयोग र प्रशिक्षण:</strong> किसानहरूलाई
                  तेलहन बालीको उन्नत खेती प्रविधि, भण्डारण र प्रशोधन सम्बन्धी
                  प्रशिक्षण दिन आवश्यक।
                </div>
              </div>
            </div>

            <p className="mt-6">
              बुद्धशान्ति गाउँपालिकामा तेलहन बालीको वर्तमान अवस्थाले अझै विकासको
              सम्भावना देखाउँछ। उत्पादकत्व वृद्धि, तेल निकाल्ने प्रविधिमा
              आधुनिकीकरण र व्यावसायीकरण मार्फत तेल आत्मनिर्भरता र आर्थिक समृद्धि
              हासिल गर्न सकिनेछ। यसका लागि स्थानीय सरकारले सक्रिय नीति निर्माण र
              प्रोत्साहन गर्नु आवश्यक छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
