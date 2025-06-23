import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import VegetableCharts from "./_components/vegetable-charts";
import VegetableAnalysisSection from "./_components/vegetable-analysis-section";
import VegetableSEO from "./_components/vegetable-seo";
import { vegetableTypeOptions } from "@/server/api/routers/profile/economics/municipality-wide-vegetables.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define English names for vegetable types (for SEO)
const VEGETABLE_TYPES_EN: Record<string, string> = {
  POTATO: "Potato",
  CAULIFLOWER: "Cauliflower",
  CABBAGE: "Cabbage",
  TOMATO: "Tomato",
  RADISH: "Radish",
  CARROT: "Carrot",
  TURNIP: "Turnip",
  CAPSICUM: "Capsicum",
  OKRA: "Okra",
  BRINJAL: "Brinjal/Eggplant",
  ONION: "Onion",
  STRING_BEAN: "String Bean",
  RED_KIDNEY_BEAN: "Red Kidney Bean",
  CUCUMBER: "Cucumber",
  PUMPKIN: "Pumpkin",
  BITTER_GOURD: "Bitter Gourd",
  LUFFA: "Luffa",
  SNAKE_GOURD: "Snake Gourd",
  CALABASH: "Calabash",
  BALSAM_APPLE: "Balsam Apple",
  MUSHROOM: "Mushroom",
  SQUICE: "Squash",
  MUSTARD_GREENS: "Mustard Greens",
  GARDEN_CRESS: "Garden Cress",
  SPINACH: "Spinach",
  COLOCASIA: "Colocasia",
  YAM: "Yam",
  OTHER: "Other Vegetables",
  NONE: "No Vegetable Cultivation",
};

// Define Nepali names for vegetable types
// Use the labels from vegetableTypeOptions
const VEGETABLE_TYPES: Record<string, string> = vegetableTypeOptions.reduce(
  (acc, option) => ({
    ...acc,
    [option.value]: option.label,
  }),
  {},
);

// Define colors for vegetable types
const VEGETABLE_COLORS: Record<string, string> = {
  POTATO: "#F1C40F", // Yellow for potato
  CAULIFLOWER: "#3498DB", // Blue for cauliflower
  CABBAGE: "#2ECC71", // Green for cabbage
  TOMATO: "#E74C3C", // Red for tomato
  RADISH: "#9B59B6", // Purple for radish
  CARROT: "#E67E22", // Orange for carrot
  TURNIP: "#1ABC9C", // Turquoise for turnip
  CAPSICUM: "#D35400", // Dark orange for capsicum
  OKRA: "#27AE60", // Dark green for okra
  BRINJAL: "#8E44AD", // Violet for brinjal
  ONION: "#F39C12", // Yellow-orange for onion
  STRING_BEAN: "#16A085", // Sea green for string bean
  RED_KIDNEY_BEAN: "#C0392B", // Dark red for red kidney bean
  CUCUMBER: "#2980B9", // Blue for cucumber
  PUMPKIN: "#F39C12", // Yellow-orange for pumpkin
  BITTER_GOURD: "#27AE60", // Dark green for bitter gourd
  LUFFA: "#2ECC71", // Green for luffa
  SNAKE_GOURD: "#16A085", // Sea green for snake gourd
  CALABASH: "#1ABC9C", // Turquoise for calabash
  BALSAM_APPLE: "#F1C40F", // Yellow for balsam apple
  MUSHROOM: "#BDC3C7", // Light gray for mushroom
  SQUICE: "#3498DB", // Blue for squash
  MUSTARD_GREENS: "#2ECC71", // Green for mustard greens
  GARDEN_CRESS: "#27AE60", // Dark green for garden cress
  SPINACH: "#16A085", // Sea green for spinach
  COLOCASIA: "#7F8C8D", // Gray for colocasia
  YAM: "#95A5A6", // Light gray for yam
  OTHER: "#3498DB", // Blue for other
  NONE: "#95A5A6", // Light gray for none
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const vegetableData =
      await api.profile.economics.municipalityWideVegetables.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalProduction = vegetableData.reduce(
      (sum: number, item: { productionInTonnes: any }) =>
        sum + (parseFloat(String(item.productionInTonnes)) || 0),
      0,
    );

    const totalSales = vegetableData.reduce(
      (sum: number, item: { salesInTonnes: any }) =>
        sum + (parseFloat(String(item.salesInTonnes)) || 0),
      0,
    );

    const totalRevenue = vegetableData.reduce(
      (sum: number, item: { revenueInRs: any }) =>
        sum + (parseFloat(String(item.revenueInRs)) || 0),
      0,
    );

    // Find the most produced vegetable
    let mostProducedVegetable = "";
    let mostProducedAmount = 0;
    vegetableData.forEach(
      (item: { vegetableType: string; productionInTonnes: number }) => {
        if (item.productionInTonnes > mostProducedAmount) {
          mostProducedAmount = item.productionInTonnes;
          mostProducedVegetable = item.vegetableType;
        }
      },
    );

    const mostProducedPercentage =
      totalProduction > 0
        ? ((mostProducedAmount / totalProduction) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "गढवा गाउँपालिका तरकारी",
      "गढवा तरकारी उत्पादन",
      "पालिका स्तरीय तरकारी तथ्याङ्क",
      "आलु उत्पादन गढवा",
      "गोलभेडा उत्पादन तथ्याङ्क",
      "काउली उत्पादन",
      `गढवा तरकारी बिक्री ${localizeNumber(totalSales.toFixed(2), "ne")} टन`,
      `गढवा तरकारी आय ${localizeNumber(
        (totalRevenue / 1000).toFixed(2),
        "ne",
      )} हजार`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality vegetables",
      "Khajura vegetable production",
      "Municipality-wide vegetable statistics",
      "Potato production in Khajura",
      "Tomato cultivation statistics",
      "Cauliflower production data",
      `Khajura vegetable sales ${totalSales.toFixed(2)} tonnes`,
      `Khajura vegetable revenue ${(totalRevenue / 1000).toFixed(2)} thousand rupees`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकाको तरकारी उत्पादन र बिक्री विश्लेषण। कुल ${localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन तरकारी उत्पादन मध्ये ${localizeNumber(mostProducedPercentage, "ne")}% (${localizeNumber(mostProducedAmount.toFixed(2), "ne")} टन) ${VEGETABLE_TYPES[mostProducedVegetable] || mostProducedVegetable} रहेको छ। पालिका स्तरीय तरकारी उत्पादन र बिक्रीको विस्तृत विश्लेषण।`;

    const descriptionEN = `Analysis of vegetable production and sales in Khajura Rural Municipality. Out of total ${totalProduction.toFixed(2)} metric tonnes of vegetable production, ${mostProducedPercentage}% (${mostProducedAmount.toFixed(2)} tonnes) is ${VEGETABLE_TYPES_EN[mostProducedVegetable] || mostProducedVegetable}. Detailed analysis of municipality-wide vegetable patterns.`;

    return {
      title: `तरकारीको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/municipality-wide-vegetables",
        languages: {
          en: "/en/profile/economics/municipality-wide-vegetables",
          ne: "/ne/profile/economics/municipality-wide-vegetables",
        },
      },
      openGraph: {
        title: `तरकारीको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `तरकारीको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "तरकारीको प्रकार अनुसार उत्पादन र बिक्री | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "पालिका स्तरीय तरकारी बालीको प्रकार अनुसारको उत्पादन, बिक्री र आम्दानीको विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "प्रमुख तरकारीहरू",
    slug: "main-vegetables",
  },
  { level: 2, text: "उत्पादन र बिक्री", slug: "production-and-sales" },
  { level: 2, text: "आर्थिक प्रभाव", slug: "economic-impact" },
  {
    level: 2,
    text: "तरकारी र स्थानीय अर्थतन्त्र",
    slug: "vegetables-and-local-economy",
  },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function MunicipalityWideVegetablesPage() {
  // Fetch all vegetable data using tRPC
  const vegetableData =
    await api.profile.economics.municipalityWideVegetables.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.municipalityWideVegetables.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  type VegetableSummaryType = {
    type: string;
    typeName: string;
    production: number;
    sales: number;
    revenue: number;
  };

  // Process data for overall summary with proper typing
  const overallSummary: VegetableSummaryType[] = Object.entries(
    vegetableData.reduce(
      (
        acc: Record<
          string,
          { production: number; sales: number; revenue: number }
        >,
        item: {
          vegetableType: string;
          productionInTonnes: any;
          salesInTonnes: any;
          revenueInRs: any;
        },
      ) => {
        if (!acc[item.vegetableType]) {
          acc[item.vegetableType] = {
            production: 0,
            sales: 0,
            revenue: 0,
          };
        }
        acc[item.vegetableType].production +=
          parseFloat(String(item.productionInTonnes)) || 0;
        acc[item.vegetableType].sales +=
          parseFloat(String(item.salesInTonnes)) || 0;
        acc[item.vegetableType].revenue +=
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
        typeName: VEGETABLE_TYPES[type] || type,
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

  // Calculate vegetable statistics
  const vegetableAnalysis = {
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
      <VegetableSEO
        overallSummary={overallSummary}
        totalProduction={totalProduction}
        totalSales={totalSales}
        totalRevenue={totalRevenue}
        VEGETABLE_TYPES={VEGETABLE_TYPES}
        VEGETABLE_TYPES_EN={VEGETABLE_TYPES_EN}
        commercializationScore={vegetableAnalysis.commercializationScore}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/vegetables.svg"
              width={1200}
              height={400}
              alt="तरकारीको प्रकार अनुसार उत्पादन र बिक्री - गढवा गाउँपालिका (Vegetables by Production and Sales - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा तरकारीको प्रकार अनुसार उत्पादन र बिक्री
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              तरकारी गढवा गाउँपालिकाको महत्त्वपूर्ण कृषि उत्पादन हो। यस
              क्षेत्रमा आलु, काउली, बन्दा, गोलभेडा, मूला, र अन्य विभिन्न
              प्रकारका तरकारीहरू उत्पादन गरिन्छ। यी तरकारीहरूले पालिकाको पोषण
              सुरक्षा र आर्थिक स्थितिमा उल्लेखनीय योगदान पुर्‍याउँछन्।
            </p>
            <p>
              गढवा गाउँपालिकाको तरकारी सम्बन्धी तथ्याङ्क अनुसार, यस
              क्षेत्रमा वार्षिक कुल{" "}
              {localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन
              तरकारी उत्पादन हुन्छ, जसमध्ये सबैभन्दा बढी{" "}
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

            <h2 id="main-vegetables" className="scroll-m-20 border-b pb-2">
              प्रमुख तरकारीहरू
            </h2>
            <p>
              गढवा गाउँपालिकामा उत्पादित प्रमुख तरकारीहरू र तिनको उत्पादन
              परिमाण निम्नानुसार रहेको छ:
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
              तरकारी उत्पादनको विश्लेषण गर्दा, गढवा गाउँपालिकामा उत्पादित
              कुल तरकारी मध्ये {localizeNumber(soldPercentage, "ne")}% बिक्रीका
              लागि बजारमा जान्छ, जबकि{" "}
              {localizeNumber(selfConsumptionPercentage, "ne")}% घरायसी उपभोगमा
              खर्च हुन्छ। यसबाट वार्षिक रु.{" "}
              {localizeNumber((totalRevenue / 1000).toFixed(2), "ne")} हजार
              आम्दानी हुने अनुमान गरिएको छ।
            </p>

            <p>
              उत्पादन र बिक्रीको दृष्टिकोणले हेर्दा, अनुमानित{" "}
              {localizeNumber(
                vegetableAnalysis.commercializationScore.toString(),
                "ne",
              )}
              % व्यावसायीकरण स्कोर रहेको छ, जसले पालिकाको तरकारी उत्पादनको
              व्यावसायीकरणको अवस्था देखाउँछ।
            </p>
          </div>

          {/* Client component for charts */}
          <VegetableCharts
            overallSummary={overallSummary}
            totalProduction={totalProduction}
            totalSales={totalSales}
            totalRevenue={totalRevenue}
            productionPieChartData={productionPieChartData}
            revenuePieChartData={revenuePieChartData}
            VEGETABLE_TYPES={VEGETABLE_TYPES}
            VEGETABLE_COLORS={VEGETABLE_COLORS}
            vegetableAnalysis={vegetableAnalysis}
            soldPercentage={soldPercentage}
            selfConsumptionPercentage={selfConsumptionPercentage}
            commercializationScore={vegetableAnalysis.commercializationScore}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="vegetables-and-local-economy"
              className="scroll-m-20 border-b pb-2"
            >
              तरकारी र स्थानीय अर्थतन्त्र
            </h2>
            <p>
              गढवा गाउँपालिकामा तरकारी उत्पादनले स्थानीय अर्थतन्त्रमा
              महत्त्वपूर्ण भूमिका खेल्दछ। कुल{" "}
              {localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन
              तरकारी उत्पादन मध्ये{" "}
              {localizeNumber(selfConsumption.toFixed(2), "ne")}
              मेट्रिक टन स्थानीय उपभोगमा प्रयोग हुन्छ, जबकि{" "}
              {localizeNumber(totalSales.toFixed(2), "ne")} मेट्रिक टन बिक्रीका
              लागि बजारमा जान्छ।
            </p>

            <p>
              गढवा गाउँपालिकाको प्रमुख तरकारी उत्पादनको विश्लेषण गर्दा{" "}
              {overallSummary[0]?.typeName || ""} सबैभन्दा प्रभावकारी तरकारी
              बाली रहेको देखिन्छ, जसले कुल तरकारी उत्पादनको{" "}
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

            <VegetableAnalysisSection
              overallSummary={overallSummary}
              totalProduction={totalProduction}
              totalSales={totalSales}
              totalRevenue={totalRevenue}
              VEGETABLE_TYPES={VEGETABLE_TYPES}
              VEGETABLE_TYPES_EN={VEGETABLE_TYPES_EN}
              VEGETABLE_COLORS={VEGETABLE_COLORS}
              commercializationScore={vegetableAnalysis.commercializationScore}
              vegetableAnalysis={vegetableAnalysis}
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
              गढवा गाउँपालिकाको तरकारी उत्पादनको अवस्थाको विश्लेषणबाट निम्न
              निष्कर्ष र सिफारिसहरू प्रस्तुत गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>तरकारी उत्पादन विस्तार:</strong> प्रमुख तरकारी
                  बालीहरूको उत्पादन क्षेत्र विस्तार गर्दै उच्च मूल्यका तरकारी
                  बालीहरूको विविधीकरणमा जोड दिनुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>सिँचाइ सुविधा विस्तार:</strong> तरकारी खेतीलाई वर्षभरि
                  सुनिश्चित गर्न साना सिँचाइ योजनाहरू विस्तार गरी भरपर्दो
                  सिँचाइको व्यवस्था गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>बजारीकरण प्रवर्द्धन:</strong> पालिकामा{" "}
                  {localizeNumber(soldPercentage, "ne")}% तरकारी मात्र बिक्रीमा
                  जाने अवस्था रहेकोले बजारीकरणको प्रवर्द्धन गर्नुपर्ने देखिन्छ।
                  शीत भण्डारण, प्रशोधन र बजार पहुँच सुदृढ गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>प्राङ्गारिक खेती प्रवर्द्धन:</strong> उच्च मूल्यका
                  प्राङ्गारिक तरकारी उत्पादनमा जोड दिई, स्थानीय तरकारी उत्पादनको
                  ब्रान्डिङ गरी बजारीकरण गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>प्राविधिक सहयोग र प्रशिक्षण:</strong> किसानहरूलाई
                  आधुनिक तरकारी उत्पादन प्रविधि, रोग कीरा व्यवस्थापन, र बजारीकरण
                  सम्बन्धी नियमित प्रशिक्षण दिन आवश्यक।
                </div>
              </div>
            </div>

            <p className="mt-6">
              गढवा गाउँपालिकामा तरकारी उत्पादनको वर्तमान अवस्थाले अझै
              विकासको प्रचुर सम्भावना देखाउँछ। उत्पादकत्व वृद्धि, प्रशोधन
              प्रविधिमा आधुनिकीकरण र व्यावसायीकरण मार्फत तरकारी उत्पादनलाई
              प्रोत्साहन गरी किसानको आय-आर्जनमा वृद्धि र खाद्य सुरक्षामा योगदान
              पुर्‍याउन सकिन्छ। यसका लागि स्थानीय सरकारले सक्रिय नीति निर्माण र
              प्रोत्साहन कार्यक्रम लागू गर्नु आवश्यक छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
