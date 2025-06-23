import { Metadata } from "next";
import { DocsLayout } from "@/components/layout/DocsLayout";
import { TableOfContents } from "@/components/TableOfContents";
import Image from "next/image";
import { api } from "@/trpc/server";
import { localizeNumber } from "@/lib/utils/localize-number";
import FoodCropCharts from "./_components/food-crop-charts";
import FoodCropAnalysisSection from "./_components/food-crop-analysis-section";
import FoodCropSEO from "./_components/food-crop-seo";
import { foodCropTypeOptions } from "@/server/api/routers/profile/economics/municipality-wide-food-crops.schema";

// Force dynamic rendering since we're using tRPC which relies on headers
export const dynamic = "force-dynamic";

// Define the locales for which this page should be statically generated
export async function generateStaticParams() {
  // Generate the page for 'en' and 'ne' locales
  return [{ locale: "en" }];
}

// Optional: Add revalidation period if you want to update the static pages periodically
export const revalidate = 86400; // Revalidate once per day (in seconds)

// Define English names for food crop types (for SEO)
const FOOD_CROP_TYPES_EN: Record<string, string> = {
  PADDY: "Paddy (Rice)",
  CORN: "Corn (Maize)",
  WHEAT: "Wheat",
  MILLET: "Millet",
  BARLEY: "Barley",
  PHAPAR: "Buckwheat",
  JUNELO: "Sorghum",
  KAGUNO: "Foxtail Millet",
  OTHER: "Other Food Crops",
};

// Define Nepali names for food crop types
// Use the labels from foodCropTypeOptions
const FOOD_CROP_TYPES: Record<string, string> = foodCropTypeOptions.reduce(
  (acc, option) => ({
    ...acc,
    [option.value]: option.label,
  }),
  {},
);

// Define colors for food crop types
const FOOD_CROP_COLORS: Record<string, string> = {
  PADDY: "#f39c12", // Orange for Rice
  CORN: "#f1c40f", // Yellow for Corn
  WHEAT: "#e67e22", // Dark Orange for Wheat
  MILLET: "#d35400", // Brown for Millet
  BARLEY: "#c0392b", // Reddish Brown for Barley
  PHAPAR: "#e74c3c", // Red for Buckwheat
  JUNELO: "#9b59b6", // Purple for Sorghum
  KAGUNO: "#8e44ad", // Dark Purple for Foxtail Millet
  OTHER: "#7f8c8d", // Gray for Other Crops
};

// This function will generate metadata dynamically based on the actual data
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Fetch data for SEO using tRPC
    const foodCropData =
      await api.profile.economics.municipalityWideFoodCrops.getAll.query();
    const municipalityName = "गढवा गाउँपालिका"; // Khajura Rural Municipality

    // Process data for SEO
    const totalProduction = foodCropData.reduce(
      (sum: number, item: { productionInTonnes: any }) =>
        sum + (parseFloat(String(item.productionInTonnes)) || 0),
      0,
    );

    const totalSales = foodCropData.reduce(
      (sum: number, item: { salesInTonnes: any }) =>
        sum + (parseFloat(String(item.salesInTonnes)) || 0),
      0,
    );

    const totalRevenue = foodCropData.reduce(
      (sum: number, item: { revenueInRs: any }) =>
        sum + (parseFloat(String(item.revenueInRs)) || 0),
      0,
    );

    // Find the most produced crop
    let mostProducedCrop = "";
    let mostProducedAmount = 0;
    foodCropData.forEach(
      (item: { foodCrop: string; productionInTonnes: number }) => {
        if (item.productionInTonnes > mostProducedAmount) {
          mostProducedAmount = item.productionInTonnes;
          mostProducedCrop = item.foodCrop;
        }
      },
    );

    const mostProducedPercentage =
      totalProduction > 0
        ? ((mostProducedAmount / totalProduction) * 100).toFixed(2)
        : "0";

    // Create rich keywords with actual data
    const keywordsNP = [
      "गढवा गाउँपालिका खाद्यान्न बाली",
      "गढवा खाद्यान्न उत्पादन",
      "पालिका स्तरीय खाद्यान्न तथ्याङ्क",
      "धान उत्पादन गढवा",
      "मकै उत्पादन तथ्याङ्क",
      "गहुँ उत्पादन",
      `गढवा खाद्यान्न बिक्री ${localizeNumber(totalSales.toFixed(2), "ne")} टन`,
      `गढवा कृषि आय ${localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")} मिलियन`,
    ];

    const keywordsEN = [
      "Khajura Rural Municipality food crops",
      "Khajura food crop production",
      "Municipality-wide food crop statistics",
      "Paddy production in Khajura",
      "Corn cultivation statistics",
      "Wheat production data",
      `Khajura food crop sales ${totalSales.toFixed(2)} tonnes`,
      `Khajura agriculture revenue ${(totalRevenue / 1000000).toFixed(2)} million rupees`,
    ];

    // Create detailed description with actual data
    const descriptionNP = `गढवा गाउँपालिकाको खाद्यान्न बाली उत्पादन र बिक्री विश्लेषण। कुल ${localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन खाद्यान्न उत्पादन मध्ये ${localizeNumber(mostProducedPercentage, "ne")}% (${localizeNumber(mostProducedAmount.toFixed(2), "ne")} टन) ${FOOD_CROP_TYPES[mostProducedCrop] || mostProducedCrop} रहेको छ। पालिका स्तरीय खाद्यान्न बालीको विस्तृत विश्लेषण।`;

    const descriptionEN = `Analysis of food crop production and sales in Khajura Rural Municipality. Out of total ${totalProduction.toFixed(2)} metric tonnes of food crop production, ${mostProducedPercentage}% (${mostProducedAmount.toFixed(2)} tonnes) is ${FOOD_CROP_TYPES_EN[mostProducedCrop] || mostProducedCrop}. Detailed analysis of municipality-wide food crop patterns.`;

    return {
      title: `खाद्यान्न बालीको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName} डिजिटल प्रोफाइल`,
      description: descriptionNP,
      keywords: [...keywordsNP, ...keywordsEN],
      alternates: {
        canonical: "/profile/economics/municipality-wide-food-crops",
        languages: {
          en: "/en/profile/economics/municipality-wide-food-crops",
          ne: "/ne/profile/economics/municipality-wide-food-crops",
        },
      },
      openGraph: {
        title: `खाद्यान्न बालीको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName}`,
        description: descriptionNP,
        type: "article",
        locale: "ne_NP",
        alternateLocale: "en_US",
        siteName: `${municipalityName} डिजिटल प्रोफाइल`,
      },
      twitter: {
        card: "summary_large_image",
        title: `खाद्यान्न बालीको प्रकार अनुसार उत्पादन र बिक्री | ${municipalityName}`,
        description: descriptionNP,
      },
    };
  } catch (error) {
    // Fallback metadata if data fetching fails
    return {
      title:
        "खाद्यान्न बालीको प्रकार अनुसार उत्पादन र बिक्री | गढवा गाउँपालिका डिजिटल प्रोफाइल",
      description:
        "पालिका स्तरीय खाद्यान्न बालीको प्रकार अनुसारको उत्पादन, बिक्री र आम्दानीको विश्लेषण।",
    };
  }
}

const toc = [
  { level: 2, text: "परिचय", slug: "introduction" },
  {
    level: 2,
    text: "प्रमुख खाद्यान्न बालीहरू",
    slug: "main-food-crops",
  },
  { level: 2, text: "उत्पादन र बिक्री", slug: "production-and-sales" },
  { level: 2, text: "आर्थिक प्रभाव", slug: "economic-impact" },
  {
    level: 2,
    text: "खाद्य सुरक्षा र चुनौतीहरू",
    slug: "food-security-and-challenges",
  },
  {
    level: 2,
    text: "निष्कर्ष र सिफारिसहरू",
    slug: "conclusions-and-recommendations",
  },
];

export default async function MunicipalityWideFoodCropsPage() {
  // Fetch all food crop data using tRPC
  const foodCropData =
    await api.profile.economics.municipalityWideFoodCrops.getAll.query();

  // Try to fetch summary data
  let summaryData = null;
  try {
    summaryData =
      await api.profile.economics.municipalityWideFoodCrops.summary.query();
  } catch (error) {
    console.error("Could not fetch summary data", error);
  }

  // Process data for overall summary
  type FoodCropSummaryType = {
    type: string;
    typeName: string;
    production: number;
    sales: number;
    revenue: number;
  };

  // Process data for overall summary with proper typing
  const overallSummary: FoodCropSummaryType[] = Object.entries(
    foodCropData.reduce(
      (
        acc: Record<
          string,
          { production: number; sales: number; revenue: number }
        >,
        item: {
          foodCrop: string;
          productionInTonnes: any;
          salesInTonnes: any;
          revenueInRs: any;
        },
      ) => {
        if (!acc[item.foodCrop]) {
          acc[item.foodCrop] = {
            production: 0,
            sales: 0,
            revenue: 0,
          };
        }
        acc[item.foodCrop].production +=
          parseFloat(String(item.productionInTonnes)) || 0;
        acc[item.foodCrop].sales += parseFloat(String(item.salesInTonnes)) || 0;
        acc[item.foodCrop].revenue += parseFloat(String(item.revenueInRs)) || 0;
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
        typeName: FOOD_CROP_TYPES[type] || type,
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

  // Calculate food crop statistics
  const foodCropAnalysis = {
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
      <FoodCropSEO
        overallSummary={overallSummary}
        totalProduction={totalProduction}
        totalSales={totalSales}
        totalRevenue={totalRevenue}
        FOOD_CROP_TYPES={FOOD_CROP_TYPES}
        FOOD_CROP_TYPES_EN={FOOD_CROP_TYPES_EN}
        commercializationScore={foodCropAnalysis.commercializationScore}
      />

      <div className="flex flex-col gap-8">
        <section>
          <div className="relative rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/food-crops.svg"
              width={1200}
              height={400}
              alt="खाद्यान्न बालीको प्रकार अनुसार उत्पादन र बिक्री - गढवा गाउँपालिका (Food Crops by Production and Sales - Khajura Rural Municipality)"
              className="w-full h-[250px] object-cover rounded-sm"
              priority
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="scroll-m-20 tracking-tight mb-6">
              गढवा गाउँपालिकामा खाद्यान्न बालीको प्रकार अनुसार उत्पादन र
              बिक्री
            </h1>

            <h2 id="introduction" className="scroll-m-20">
              परिचय
            </h2>
            <p>
              खाद्यान्न बाली गढवा गाउँपालिकाको प्रमुख कृषि उत्पादनहरू मध्ये
              एक हो। यसका प्रमुख बालीहरूमा धान, मकै, गहुँ, कोदो, जौ, फापर जस्ता
              अन्नबाली पर्दछन्। यी खाद्यान्नहरूले पालिकाको खाद्य सुरक्षा र
              आर्थिक स्थितिमा महत्त्वपूर्ण भूमिका खेल्दछन्।
            </p>
            <p>
              गढवा गाउँपालिकाको खाद्यान्न बाली सम्बन्धी तथ्याङ्क अनुसार, यस
              क्षेत्रमा वार्षिक कुल{" "}
              {localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन
              खाद्यान्न उत्पादन हुन्छ, जसमध्ये सबैभन्दा बढी{" "}
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

            <h2 id="main-food-crops" className="scroll-m-20 border-b pb-2">
              प्रमुख खाद्यान्न बालीहरू
            </h2>
            <p>
              गढवा गाउँपालिकामा उत्पादित प्रमुख खाद्यान्न बालीहरू र तिनको
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
              खाद्यान्न बालीको विश्लेषण गर्दा, गढवा गाउँपालिकामा उत्पादित
              कुल खाद्यान्न मध्ये {localizeNumber(soldPercentage, "ne")}%
              बिक्रीका लागि बजारमा जान्छ, जबकि{" "}
              {localizeNumber(selfConsumptionPercentage, "ne")}% घरायसी उपभोगमा
              खर्च हुन्छ। यसबाट वार्षिक रु.{" "}
              {localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")} मिलियन
              आम्दानी हुने अनुमान गरिएको छ।
            </p>

            <p>
              उत्पादन र बिक्रीको दृष्टिकोणले हेर्दा, अनुमानित{" "}
              {localizeNumber(
                foodCropAnalysis.commercializationScore.toString(),
                "ne",
              )}
              % व्यावसायीकरण स्कोर रहेको छ, जसले पालिकाको कृषि क्षेत्रको
              व्यावसायीकरणको अवस्था देखाउँछ।
            </p>
          </div>

          {/* Client component for charts */}
          <FoodCropCharts
            overallSummary={overallSummary}
            totalProduction={totalProduction}
            totalSales={totalSales}
            totalRevenue={totalRevenue}
            productionPieChartData={productionPieChartData}
            revenuePieChartData={revenuePieChartData}
            FOOD_CROP_TYPES={FOOD_CROP_TYPES}
            FOOD_CROP_COLORS={FOOD_CROP_COLORS}
            foodCropAnalysis={foodCropAnalysis}
            soldPercentage={soldPercentage}
            selfConsumptionPercentage={selfConsumptionPercentage}
            commercializationScore={foodCropAnalysis.commercializationScore}
          />

          <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
            <h2
              id="food-security-and-challenges"
              className="scroll-m-20 border-b pb-2"
            >
              खाद्य सुरक्षा र चुनौतीहरू
            </h2>
            <p>
              गढवा गाउँपालिकामा खाद्यान्न बालीको उत्पादनले खाद्य सुरक्षामा
              महत्त्वपूर्ण भूमिका खेल्दछ। कुल{" "}
              {localizeNumber(totalProduction.toFixed(2), "ne")} मेट्रिक टन
              खाद्यान्न उत्पादन मध्ये{" "}
              {localizeNumber(selfConsumption.toFixed(2), "ne")}
              मेट्रिक टन स्थानीय उपभोगमा प्रयोग हुन्छ, जसले पालिकाको खाद्य
              आत्मनिर्भरतामा सहयोग गर्दछ।
            </p>

            <p>
              गढवा गाउँपालिकाको प्रमुख खाद्यान्न बालीको उत्पादकत्व र
              बजारीकरणको विश्लेषण गर्दा {overallSummary[0]?.typeName || ""}{" "}
              सबैभन्दा प्रभावकारी खाद्यान्न बाली रहेको देखिन्छ, जसले कुल
              खाद्यान्न उत्पादनको{" "}
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

            <FoodCropAnalysisSection
              overallSummary={overallSummary}
              totalProduction={totalProduction}
              totalSales={totalSales}
              totalRevenue={totalRevenue}
              FOOD_CROP_TYPES={FOOD_CROP_TYPES}
              FOOD_CROP_TYPES_EN={FOOD_CROP_TYPES_EN}
              FOOD_CROP_COLORS={FOOD_CROP_COLORS}
              commercializationScore={foodCropAnalysis.commercializationScore}
              foodCropAnalysis={foodCropAnalysis}
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
              गढवा गाउँपालिकाको खाद्यान्न बालीको अवस्थाको विश्लेषणबाट निम्न
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
                  <strong>आधुनिक प्रविधिको प्रयोग:</strong>
                  कृषि यान्त्रिकीकरण, सिंचाई सुविधा विस्तार र उन्नत कृषि
                  प्रविधिहरूको प्रयोग बढाउनु पर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">३.</span>
                <div>
                  <strong>मूल्य श्रृंखला विकास:</strong> पालिकामा{" "}
                  {localizeNumber(soldPercentage, "ne")}% खाद्यान्न मात्र
                  बिक्रीमा जाने अवस्था रहेकोले बजारीकरणको प्रवर्द्धन गर्नुपर्ने
                  देखिन्छ। भण्डारण, प्रशोधन र बजार पहुँच सुदृढ गर्नुपर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">४.</span>
                <div>
                  <strong>बाली विविधिकरण:</strong> हाल प्रमुख खाद्यान्न बाली{" "}
                  {overallSummary[0]?.typeName || ""} र{" "}
                  {overallSummary[1]?.typeName || ""} मा जोड दिइएकोमा अन्य
                  बालीको पनि उत्पादन बढाउनु पर्ने।
                </div>
              </div>
              <div className="flex">
                <span className="font-bold mr-2">५.</span>
                <div>
                  <strong>प्राविधिक सहयोग र प्रशिक्षण:</strong> किसानहरूलाई
                  आधुनिक कृषि प्रविधि, रोग कीरा व्यवस्थापन र उत्पादनोत्तर
                  प्रविधिको प्रशिक्षण दिन आवश्यक।
                </div>
              </div>
            </div>

            <p className="mt-6">
              गढवा गाउँपालिकामा खाद्यान्न बालीको वर्तमान अवस्थाले अझै पनि
              कृषि क्षेत्रमा सुधार गर्नुपर्ने आवश्यकता देखाउँछ। उत्पादकत्व
              वृद्धि, मूल्य श्रृंखला विकास, व्यावसायीकरण र आधुनिकीकरण मार्फत
              खाद्य सुरक्षा र आर्थिक समृद्धि हासिल गर्न सकिनेछ।
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
}
