import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface AnimalProductSEOProps {
  overallSummary: Array<{
    type: string;
    typeName: string;
    production: number;
    sales: number;
    revenue: number;
    measurementUnit?: string;
  }>;
  totalProduction: number;
  totalSales: number;
  totalRevenue: number;
  ANIMAL_PRODUCT_TYPES: Record<string, string>;
  ANIMAL_PRODUCT_TYPES_EN: Record<string, string>;
  commercializationScore: number;
}

export default function AnimalProductSEO({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  ANIMAL_PRODUCT_TYPES,
  ANIMAL_PRODUCT_TYPES_EN,
  commercializationScore,
}: AnimalProductSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert animal product stats to structured data format
    const animalProductStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${ANIMAL_PRODUCT_TYPES_EN[item.type] || item.type} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${ANIMAL_PRODUCT_TYPES_EN[item.type] || item.type}`,
        unitText: item.measurementUnit === "COUNT" ? "units" : "tonnes",
      },
      measuredValue: item.production,
      description: `${item.production.toFixed(2)} ${item.measurementUnit === "COUNT" ? "units" : "tonnes"} of ${ANIMAL_PRODUCT_TYPES_EN[item.type] || item.type} produced in Khajura Rural Municipality (${((item.production / totalProduction) * 100).toFixed(2)}% of total production). Sales volume: ${item.sales.toFixed(2)} ${item.measurementUnit === "COUNT" ? "units" : "tonnes"}. Revenue: NPR ${item.revenue.toLocaleString()}.`,
    }));

    // Find most produced animal product
    const mostProducedProduct =
      overallSummary.length > 0 ? overallSummary[0] : null;
    const mostProducedProductEN = mostProducedProduct
      ? ANIMAL_PRODUCT_TYPES_EN[mostProducedProduct.type] ||
        mostProducedProduct.type
      : "";
    const mostProducedPercentage =
      mostProducedProduct && totalProduction > 0
        ? ((mostProducedProduct.production / totalProduction) * 100).toFixed(2)
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
      name: "Animal Products in Khajura Rural Municipality (केराबारी गाउँपालिका)",
      description: `Animal product production and sales statistics of Khajura Rural Municipality with a total production of ${totalProduction.toFixed(
        2,
      )} tonnes/units and sales of ${totalSales.toFixed(2)} tonnes/units (${(
        (totalSales / totalProduction) *
        100
      ).toFixed(
        2,
      )}% of production). The most common animal product is ${mostProducedProductEN} with ${mostProducedProduct?.production.toFixed(
        2,
      )} tonnes/units (${mostProducedPercentage}%). Self-consumption represents ${selfConsumptionPercentage}% of total production. Total revenue from animal product sales is NPR ${totalRevenue.toLocaleString()}.`,
      keywords: [
        "Khajura Rural Municipality",
        "केराबारी गाउँपालिका",
        "Animal product production",
        "Animal product sales",
        "Milk production",
        "Meat production",
        "Egg production",
        "Nepal agriculture statistics",
        "Municipality-wide animal products",
        ...Object.values(ANIMAL_PRODUCT_TYPES_EN).map(
          (name) => `${name} production statistics`,
        ),
        ...Object.values(ANIMAL_PRODUCT_TYPES).map(
          (name) => `${name} उत्पादन तथ्याङ्क`,
        ),
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/economics/municipality-wide-animal-products",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://digital.buddhashantimun.gov.np",
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
          name: `${ANIMAL_PRODUCT_TYPES_EN[item.type] || item.type} production`,
          unitText: item.measurementUnit === "COUNT" ? "units" : "tonnes",
          value: item.production,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Animal Product Production",
          unitText: "tonnes/units",
          value: totalProduction,
        },
        {
          "@type": "PropertyValue",
          name: "Total Animal Product Sales",
          unitText: "tonnes/units",
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
          name: "Animal Product Commercialization Score",
          unitText: "percentage",
          value: commercializationScore,
        },
      ],
      observation: animalProductStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="animal-product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
