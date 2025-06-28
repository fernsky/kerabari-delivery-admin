import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import AnimalProductCharts from "./_components/animal-product-charts";
import AnimalProductAnalysisSection from "./_components/animal-product-analysis-section";
import AnimalProductSEO from "./_components/animal-product-seo";
import { animalProductTypeOptions } from "@/server/api/routers/profile/economics/municipality-wide-animal-products.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define English names for animal product types (for SEO)
const ANIMAL_PRODUCT_TYPES_EN: Record<string, string> = {
  MILK: "Milk",
  MILK_PRODUCT: "Milk Products (Ghee, Cheese, Butter etc.)",
  EGG: "Eggs",
  MEAT: "Meat",
  OTHER: "Other Animal Products",
};

// Define Nepali names for animal product types
// Use the labels from animalProductTypeOptions
const ANIMAL_PRODUCT_TYPES: Record<string, string> =
  animalProductTypeOptions.reduce(
    (acc, option) => ({
      ...acc,
      [option.value]: option.label,
    }),
    {},
  );

// Define colors for animal product types
const ANIMAL_PRODUCT_COLORS: Record<string, string> = {
  MILK: "#3498DB", // Blue for milk
  MILK_PRODUCT: "#2ECC71", // Green for milk products
  EGG: "#F1C40F", // Yellow for eggs
  MEAT: "#E74C3C", // Red for meat
  OTHER: "#95A5A6", // Gray for other
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const animalProductData =
      await api.profile.economics.municipalityWideAnimalProducts.getAll.query();
    const municipalityName = "बुद्धशान्ति गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalProduction = animalProductData.reduce(
      (sum: number, item: { productionAmount: any }) =>
        sum + (parseFloat(String(item.productionAmount)) || 0),
      0,
    );

    const totalSales = animalProductData.reduce(
      (sum: number, item: { salesAmount: any }) =>
        sum + (parseFloat(String(item.salesAmount)) || 0),
      0,
    );

    const totalRevenue = animalProductData.reduce(
      (sum: number, item: { revenue: any }) =>
        sum + (parseFloat(String(item.revenue)) || 0),
      0,
    );

    // Find the most produced animal product
    let mostProducedProduct = "";
    let mostProducedAmount = 0;
    animalProductData.forEach(
      (item: { animalProduct: string; productionAmount: number }) => {
        if (item.productionAmount > mostProducedAmount) {
          mostProducedAmount = item.productionAmount;
          mostProducedProduct = item.animalProduct;
        }
      },
    );

    const mostProducedPercentage =
      totalProduction > 0
        ? ((mostProducedAmount / totalProduction) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "बुद्धशान्ति गाउँपालिका पशुपन्छीजन्य उत्पादन",
      "बुद्धशान्ति दुध उत्पादन",
      "पालिका स्तरीय पशुजन्य उत्पादन तथ्याङ्क",
      "दुध उत्पादन बुद्धशान्ति",
      "मासु उत्पादन तथ्याङ्क",
      "अण्डा उत्पादन",
      `बुद्धशान्ति पशुजन्य उत्पादन बिक्री ${localizeNumber(totalSales.toFixed(2), "ne")} टन`,
      `बुद्धशान्ति पशुजन्य उत्पादन आय ${localizeNumber(
        (totalRevenue / 1000).toFixed(2),
        "ne",
      )} हजार`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality animal products",
      "Khajura milk production",
      "Municipality-wide animal product statistics",
      "Milk production in Khajura",
      "Meat production statistics",
      "Egg production data",
      `Khajura animal product sales ${totalSales.toFixed(2)} tonnes`,
      `Khajura animal product revenue ${(totalRevenue / 1000).toFixed(2)} thousand rupees`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `बुद्धशान्ति गाउँपालिकाको पशुपन्छीजन्य उत्पादन र बिक्री विश्लेषण। कुल ${localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन पशुजन्य उत्पादन मध्ये ${localizeNumber(mostProducedPercentage, "ne")}% (${localizeNumber(mostProducedAmount.toFixed(2), "ne")} टन) ${ANIMAL_PRODUCT_TYPES[mostProducedProduct] || mostProducedProduct} रहेको छ। पालिका स्तरीय पशुपन्छीजन्य उत्पादन र बिक्रीको विस्तृत विश्लेषण।`;

    const descriptionEN = `Analysis of animal product production and sales in Khajura Rural Municipality. Out of total ${totalProduction.toFixed(2)} metric tonnes of animal products, ${mostProducedPercentage}% (${mostProducedAmount.toFixed(2)} tonnes) is ${ANIMAL_PRODUCT_TYPES_EN[mostProducedProduct] || mostProducedProduct}. Detailed analysis of municipality-wide animal product patterns.`;

    return {
      title: `पशुपन्छीजन्य वस्तुको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/municipality-wide-animal-products",
        languages: {
          en: "/en/profile/economics/municipality-wide-animal-products",
          ne: "/ne/profile/economics/municipality-wide-animal-products",
        },
      },
      openGraph: {
        title: `पशुपन्छीजन्य वस्तुको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `पशुपन्छीजन्य वस्तुको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "पशुपन्छीजन्य वस्तुको प्रकार अनुसार उत्पादन र बिक्री | बुद्धशान्ति गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "पालिका स्तरीय पशुपन्छीजन्य वस्तुको प्रकार अनुसारको उत्पादन, बिक्री र आम्दानीको विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "प्रमुख पशुपन्छीजन्य वस्तुहरू",
    slug: "main-animal-products",
  },
  { level: 2, text: "उत्पादन र बिक्री", slug: "production-and-sales" },
  { level: 2, text: "आर्थिक प्रभाव", slug: "economic-impact" },
  {
    level: 2,
    text: "पशुपन्छीजन्य वस्तु र स्थानीय अर्थतन्त्र",
    slug: "animal-products-and-local-economy",
  },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function MunicipalityWideAnimalProductsPage() {
  // Fetch all animal product data using tRPC
  const animalProductData =
    await api.profile.economics.municipalityWideAnimalProducts.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.municipalityWideAnimalProducts.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  type AnimalProductSummaryType = {
    type: string;
    typeName: string;
    production: number;
    sales: number;
    revenue: number;
    measurementUnit: string;
  };

  // Process data for overall summary with proper typing
  const overallSummary: AnimalProductSummaryType[] = Object.entries(
    animalProductData.reduce(
      (
        acc: Record<
          string,
          {
            production: number;
            sales: number;
            revenue: number;
            measurementUnit: string;
          }
        >,
        item: {
          animalProduct: string;
          productionAmount: any;
          salesAmount: any;
          revenue: any;
          measurementUnit: string;
        },
      ) => {
        if (!acc[item.animalProduct]) {
          acc[item.animalProduct] = {
            production: 0,
            sales: 0,
            revenue: 0,
            measurementUnit: item.measurementUnit,
          };
        }
        acc[item.animalProduct].production +=
          parseFloat(String(item.productionAmount)) || 0;
        acc[item.animalProduct].sales +=
          parseFloat(String(item.salesAmount)) || 0;
        acc[item.animalProduct].revenue +=
          parseFloat(String(item.revenue)) || 0;
        return acc;
      },
      {} as Record<
        string,
        {
          production: number;
          sales: number;
          revenue: number;
          measurementUnit: string;
        }
      >,
    ),
  )
    .map((entry) => {
      const [type, data] = entry as [
        string,
        {
          production: number;
          sales: number;
          revenue: number;
          measurementUnit: string;
        },
      ];
      return {
        type,
        typeName: ANIMAL_PRODUCT_TYPES[type] || type,
        production: data.production,
        sales: data.sales,
        revenue: data.revenue,
        measurementUnit: data.measurementUnit,
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
    measurementUnit: item.measurementUnit,
  }));

  // Create data for pie chart (revenue)
  const revenuePieChartData = overallSummary.map((item) => ({
    name: item.typeName,
    value: item.revenue,
    percentage: ((item.revenue / totalRevenue) * 100).toFixed(2),
  }));

  // Calculate animal product statistics
  const animalProductAnalysis = {
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
      <AnimalProductSEO
        overallSummary={overallSummary}
        totalProduction={totalProduction}
        totalSales={totalSales}
        totalRevenue={totalRevenue}
        ANIMAL_PRODUCT_TYPES={ANIMAL_PRODUCT_TYPES}
        ANIMAL_PRODUCT_TYPES_EN={ANIMAL_PRODUCT_TYPES_EN}
        commercializationScore={animalProductAnalysis.commercializationScore}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/animal-products.svg"
              width={1200}
              height={400}
              alt="पशुपन्छीजन्य वस्तुको प्रकार अनुसार उत्पादन र बिक्री - बुद्धशान्ति गाउँपालिका (Animal Products by Production and Sales - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              बुद्धशान्ति गाउँपालिकामा पशुपन्छीजन्य वस्तुको प्रकार अनुसार
              उत्पादन र बिक्री
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              पशुपन्छीजन्य वस्तुहरू बुद्धशान्ति गाउँपालिकाको महत्त्वपूर्ण कृषि
              उत्पादन हो। यस क्षेत्रमा दुध, दुधजन्य वस्तु, मासु, अण्डा लगायतका
              विभिन्न प्रकारका पशुपन्छीजन्य वस्तुहरू उत्पादन गरिन्छ। यी
              उत्पादनहरूले पालिकाको पोषण सुरक्षा र आर्थिक स्थितिमा उल्लेखनीय
              योगदान पुर्‍याउँछन्।
            </p>
            <p>
              बुद्धशान्ति गाउँपालिकाको पशुपन्छीजन्य वस्तु सम्बन्धी तथ्याङ्क
              अनुसार, यस क्षेत्रमा वार्षिक कुल{" "}
              {localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन
              पशुपन्छीजन्य वस्तु उत्पादन हुन्छ, जसमध्ये सबैभन्दा बढी{" "}
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

            <h2 id="main-animal-products" className="scroll-m-20 border-b pb-2">
              प्रमुख पशुपन्छीजन्य वस्तुहरू
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा उत्पादित प्रमुख पशुपन्छीजन्य वस्तुहरू र
              तिनको उत्पादन परिमाण निम्नानुसार रहेको छ:
            </p>

            <ul>
              {overallSummary.map((item, index) => (
                <li key={index}>
                  <strong>{item.typeName}</strong>: कुल{" "}
                  {localizeNumber(
                    ((item.production / totalProduction) * 100 || 0).toFixed(1),
                    "ne",
                  )}
                  % ({localizeNumber(item.production.toFixed(2), "ne")}{" "}
                  {item.measurementUnit === "TON"
                    ? "मेट्रिक टन"
                    : item.measurementUnit === "COUNT"
                      ? "संख्या"
                      : item.measurementUnit === "LITER"
                        ? "लिटर"
                        : item.measurementUnit === "KG"
                          ? "किलोग्राम"
                          : ""}
                  )
                </li>
              ))}
            </ul>

            <p>
              पशुपन्छीजन्य वस्तु उत्पादनको विश्लेषण गर्दा, बुद्धशान्ति
              गाउँपालिकामा उत्पादित कुल पशुपन्छीजन्य वस्तु मध्ये{" "}
              {localizeNumber(soldPercentage, "ne")}% बिक्रीका लागि बजारमा
              जान्छ, जबकि {localizeNumber(selfConsumptionPercentage, "ne")}%
              घरायसी उपभोगमा खर्च हुन्छ। यसबाट वार्षिक रु.{" "}
              {localizeNumber((totalRevenue / 1000).toFixed(2), "ne")} हजार
              आम्दानी हुने अनुमान गरिएको छ।
            </p>

            <p>
              उत्पादन र बिक्रीको दृष्टिकोणले हेर्दा, अनुमानित{" "}
              {localizeNumber(
                animalProductAnalysis.commercializationScore.toString(),
                "ne",
              )}
              % व्यावसायीकरण स्कोर रहेको छ, जसले पालिकाको पशुपन्छीजन्य वस्तु
              उत्पादनको व्यावसायीकरणको अवस्था देखाउँछ।
            </p>
          </div>

          {/* Client component for charts */}
          <AnimalProductCharts
            overallSummary={overallSummary}
            totalProduction={totalProduction}
            totalSales={totalSales}
            totalRevenue={totalRevenue}
            productionPieChartData={productionPieChartData}
            revenuePieChartData={revenuePieChartData}
            ANIMAL_PRODUCT_TYPES={ANIMAL_PRODUCT_TYPES}
            ANIMAL_PRODUCT_COLORS={ANIMAL_PRODUCT_COLORS}
            animalProductAnalysis={animalProductAnalysis}
            soldPercentage={soldPercentage}
            selfConsumptionPercentage={selfConsumptionPercentage}
            commercializationScore={
              animalProductAnalysis.commercializationScore
            }
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="animal-products-and-local-economy"
              className="scroll-m-20 border-b pb-2"
            >
              पशुपन्छीजन्य वस्तु र स्थानीय अर्थतन्त्र
            </h2>
            <p>
              बुद्धशान्ति गाउँपालिकामा पशुपन्छीजन्य वस्तु उत्पादनले स्थानीय
              अर्थतन्त्रमा महत्त्वपूर्ण भूमिका खेल्दछ। कुल{" "}
              {localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन
              पशुपन्छीजन्य वस्तु उत्पादन मध्ये{" "}
              {localizeNumber(selfConsumption.toFixed(2), "ne")} मेट्रिक टन
              स्थानीय उपभोगमा प्रयोग हुन्छ, जबकि{" "}
              {localizeNumber(totalSales.toFixed(2), "ne")} मेट्रिक टन बिक्रीका
              लागि बजारमा जान्छ।
            </p>

            <p>
              बुद्धशान्ति गाउँपालिकाको प्रमुख पशुपन्छीजन्य वस्तु उत्पादनको
              विश्लेषण गर्दा {overallSummary[0]?.typeName || ""} सबैभन्दा
              प्रभावकारी पशुजन्य उत्पादन रहेको देखिन्छ, जसले कुल पशुपन्छीजन्य
              वस्तु उत्पादनको{" "}
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

            <AnimalProductAnalysisSection
              overallSummary={overallSummary}
              totalProduction={totalProduction}
              totalSales={totalSales}
              totalRevenue={totalRevenue}
              ANIMAL_PRODUCT_TYPES={ANIMAL_PRODUCT_TYPES}
              ANIMAL_PRODUCT_TYPES_EN={ANIMAL_PRODUCT_TYPES_EN}
              ANIMAL_PRODUCT_COLORS={ANIMAL_PRODUCT_COLORS}
              commercializationScore={
                animalProductAnalysis.commercializationScore
              }
              animalProductAnalysis={animalProductAnalysis}
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
              बुद्धशान्ति गाउँपालिकाको पशुपन्छीजन्य वस्तु उत्पादनको अवस्थाको
              विश्लेषणबाट निम्न निष्कर्ष र सिफारिसहरू प्रस्तुत गर्न सकिन्छ:
            </p>

            <div className="pl-6 space-y-4">
              <div className="flex">
                <span className="font-bold mr-2">१.</span>
                <div>
                  <strong>पशुपन्छी पालन विस्तार:</strong> पालिकामा पशुपन्छी पालन
                  क्षेत्रको विस्तार गर्दै उच्च उत्पादकत्व भएका नश्ल सुधार गरी
                  उत्पादन वृद्धि गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">२.</span>
                <div>
                  <strong>पशु आहार व्यवस्थापन:</strong> पशु आहारको लागि डाले
                  घाँस, उन्नत घाँस खेती विस्तार र चरण क्षेत्र विकास गरी पशुपन्छी
                  पालनलाई प्रोत्साहन गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>बजारीकरण प्रवर्द्धन:</strong> पालिकामा{" "}
                  {localizeNumber(soldPercentage, "ne")}% पशुपन्छीजन्य उत्पादन
                  मात्र बिक्रीमा जाने अवस्था रहेकोले बजारीकरणको प्रवर्द्धन
                  गर्नुपर्ने देखिन्छ। शीत भण्डारण, प्रशोधन र बजार पहुँच सुदृढ
                  गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>दुग्ध उत्पादन प्रशोधन:</strong> दुग्ध उत्पादनको संकलन,
                  प्रशोधन र बजारीकरणलाई व्यवस्थित गर्दै स्थानीय उत्पादनको मूल्य
                  अभिवृद्धि गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>प्राविधिक सहयोग र प्रशिक्षण:</strong> किसानहरूलाई
                  आधुनिक पशुपालन प्रविधि, रोग व्यवस्थापन, र पशु बीमा सम्बन्धी
                  नियमित प्रशिक्षण दिन आवश्यक।
                </div>
              </div>
            </div>

            <p className="mt-6">
              बुद्धशान्ति गाउँपालिकामा पशुपन्छीजन्य वस्तु उत्पादनको वर्तमान
              अवस्थाले अझै विकासको प्रचुर सम्भावना देखाउँछ। उत्पादकत्व वृद्धि,
              प्रशोधन प्रविधिमा आधुनिकीकरण र व्यावसायीकरण मार्फत पशुपन्छीजन्य
              वस्तु उत्पादनलाई प्रोत्साहन गरी किसानको आय-आर्जनमा वृद्धि र खाद्य
              सुरक्षामा योगदान पुर्‍याउन सकिन्छ। यसका लागि स्थानीय सरकारले
              सक्रिय नीति निर्माण र प्रोत्साहन कार्यक्रम लागू गर्नु आवश्यक छ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
