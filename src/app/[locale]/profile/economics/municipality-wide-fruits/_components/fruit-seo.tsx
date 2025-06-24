import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface FruitSEOProps {
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
  FRUIT_TYPES: Record<string, string>;
  FRUIT_TYPES_EN: Record<string, string>;
  commercializationScore: number;
}

export default function FruitSEO({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  FRUIT_TYPES,
  FRUIT_TYPES_EN,
  commercializationScore,
}: FruitSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert fruit stats to structured data format
    const fruitStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${FRUIT_TYPES_EN[item.type] || item.type} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${FRUIT_TYPES_EN[item.type] || item.type}`,
        unitText: "tonnes",
      },
      measuredValue: item.production,
      description: `${item.production.toFixed(2)} tonnes of ${FRUIT_TYPES_EN[item.type] || item.type} produced in Khajura Rural Municipality (${((item.production / totalProduction) * 100).toFixed(2)}% of total production). Sales volume: ${item.sales.toFixed(2)} tonnes. Revenue: NPR ${item.revenue.toLocaleString()}.`,
    }));

    // Find most produced fruit
    const mostProducedFruit =
      overallSummary.length > 0 ? overallSummary[0] : null;
    const mostProducedFruitEN = mostProducedFruit
      ? FRUIT_TYPES_EN[mostProducedFruit.type] || mostProducedFruit.type
      : "";
    const mostProducedPercentage =
      mostProducedFruit && totalProduction > 0
        ? ((mostProducedFruit.production / totalProduction) * 100).toFixed(2)
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
      name: "Fruit Types in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Fruit production and sales statistics of Khajura Rural Municipality with a total production of ${totalProduction.toFixed(
        2,
      )} tonnes and sales of ${totalSales.toFixed(2)} tonnes (${(
        (totalSales / totalProduction) *
        100
      ).toFixed(
        2,
      )}% of production). The most common fruit crop is ${mostProducedFruitEN} with ${mostProducedFruit?.production.toFixed(
        2,
      )} tonnes (${mostProducedPercentage}%). Self-consumption represents ${selfConsumptionPercentage}% of total production. Total revenue from fruit sales is NPR ${totalRevenue.toLocaleString()}.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Fruit production",
        "Fruit sales",
        "Mango production",
        "Jackfruit production",
        "Litchi production",
        "Nepal agriculture statistics",
        "Municipality-wide fruits",
        ...Object.values(FRUIT_TYPES_EN).map(
          (name) => `${name} production statistics`,
        ),
        ...Object.values(FRUIT_TYPES).map((name) => `${name} उत्पादन तथ्याङ्क`),
      ],
      url: "https://digital.gadhawamun.gov.np/profile/economics/municipality-wide-fruits",
      creator: {
        "@type": "Organization",
        name: "Khajura Rural Municipality",
        url: "https://digital.gadhawamun.gov.np",
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
          name: `${FRUIT_TYPES_EN[item.type] || item.type} production`,
          unitText: "tonnes",
          value: item.production,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Fruit Production",
          unitText: "tonnes",
          value: totalProduction,
        },
        {
          "@type": "PropertyValue",
          name: "Total Fruit Sales",
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
          name: "Fruit Commercialization Score",
          unitText: "percentage",
          value: commercializationScore,
        },
      ],
      observation: fruitStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="fruit-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
