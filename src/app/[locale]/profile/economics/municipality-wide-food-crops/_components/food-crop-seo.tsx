import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface FoodCropSEOProps {
  overallSummary: Array<{
    type: string;
    typeName: string;
    production: number;
    sales: number;
    revenue: number;
  }>;
  totalProduction: number;
  totalSales: number;
  totalRevenue: number;
  FOOD_CROP_TYPES: Record<string, string>;
  FOOD_CROP_TYPES_EN: Record<string, string>;
  commercializationScore: number;
}

export default function FoodCropSEO({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  FOOD_CROP_TYPES,
  FOOD_CROP_TYPES_EN,
  commercializationScore,
}: FoodCropSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert food crop stats to structured data format
    const foodCropStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${FOOD_CROP_TYPES_EN[item.type] || item.type} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${FOOD_CROP_TYPES_EN[item.type] || item.type}`,
        unitText: "tonnes",
      },
      measuredValue: item.production,
      description: `${item.production.toFixed(2)} tonnes of ${FOOD_CROP_TYPES_EN[item.type] || item.type} produced in Khajura Rural Municipality (${((item.production / totalProduction) * 100).toFixed(2)}% of total production). Sales volume: ${item.sales.toFixed(2)} tonnes. Revenue: NPR ${item.revenue.toLocaleString()}.`,
    }));

    // Find most produced crop
    const mostProducedCrop =
      overallSummary.length > 0 ? overallSummary[0] : null;
    const mostProducedCropEN = mostProducedCrop
      ? FOOD_CROP_TYPES_EN[mostProducedCrop.type] || mostProducedCrop.type
      : "";
    const mostProducedPercentage =
      mostProducedCrop && totalProduction > 0
        ? ((mostProducedCrop.production / totalProduction) * 100).toFixed(2)
        : "0";

    // Calculate self-consumption percentage
    const selfConsumptionAmount = totalProduction - totalSales;
    const selfConsumptionPercentage =
      totalProduction > 0
        ? ((selfConsumptionAmount / totalProduction) * 100).toFixed(2)
        : "0";

    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Food Crop Types in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Food crop production and sales statistics of Khajura Rural Municipality with a total production of ${totalProduction.toFixed(2)} tonnes and sales of ${totalSales.toFixed(2)} tonnes (${((totalSales / totalProduction) * 100).toFixed(2)}% of production). The most common food crop is ${mostProducedCropEN} with ${mostProducedCrop?.production.toFixed(2)} tonnes (${mostProducedPercentage}%). Self-consumption represents ${selfConsumptionPercentage}% of total production. Total revenue from food crop sales is NPR ${totalRevenue.toLocaleString()}.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Food crop production",
        "Food crop sales",
        "Paddy production",
        "Corn production",
        "Nepal agriculture statistics",
        "Municipality-wide food crops",
        ...Object.values(FOOD_CROP_TYPES_EN).map(
          (name) => `${name} production statistics`,
        ),
        ...Object.values(FOOD_CROP_TYPES).map(
          (name) => `${name} उत्पादन तथ्याङ्क`,
        ),
      ],
      url: "https://digital.khajuramun.gov.np/profile/economics/municipality-wide-food-crops",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://digital.khajuramun.gov.np",
      },
      temporalCoverage: "2021/2023",
      spatialCoverage: {
        "@type": "Place",
        name: "Khajura Rural Municipality, Banke, Nepal",
        geo: {
          "@type": "GeoCoordinates",
          latitude: "28.1356",
          longitude: "81.6314",
        },
      },
      variableMeasured: [
        ...overallSummary.map((item) => ({
          "@type": "PropertyValue",
          name: `${FOOD_CROP_TYPES_EN[item.type] || item.type} production`,
          unitText: "tonnes",
          value: item.production,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Food Crop Production",
          unitText: "tonnes",
          value: totalProduction,
        },
        {
          "@type": "PropertyValue",
          name: "Total Food Crop Sales",
          unitText: "tonnes",
          value: totalSales,
        },
        {
          "@type": "PropertyValue",
          name: "Total Revenue",
          unitText: "NPR",
          value: totalRevenue,
        },
        {
          "@type": "PropertyValue",
          name: "Food Crop Commercialization Score",
          unitText: "percentage",
          value: commercializationScore,
        },
      ],
      observation: foodCropStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="food-crop-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
