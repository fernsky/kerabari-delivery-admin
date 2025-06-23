import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface VegetableSEOProps {
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
  VEGETABLE_TYPES: Record<string, string>;
  VEGETABLE_TYPES_EN: Record<string, string>;
  commercializationScore: number;
}

export default function VegetableSEO({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  VEGETABLE_TYPES,
  VEGETABLE_TYPES_EN,
  commercializationScore,
}: VegetableSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert vegetable stats to structured data format
    const vegetableStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${VEGETABLE_TYPES_EN[item.type] || item.type} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${VEGETABLE_TYPES_EN[item.type] || item.type}`,
        unitText: "tonnes",
      },
      measuredValue: item.production,
      description: `${item.production.toFixed(2)} tonnes of ${VEGETABLE_TYPES_EN[item.type] || item.type} produced in Khajura Rural Municipality (${((item.production / totalProduction) * 100).toFixed(2)}% of total production). Sales volume: ${item.sales.toFixed(2)} tonnes. Revenue: NPR ${item.revenue.toLocaleString()}.`,
    }));

    // Find most produced vegetable
    const mostProducedVegetable =
      overallSummary.length > 0 ? overallSummary[0] : null;
    const mostProducedVegetableEN = mostProducedVegetable
      ? VEGETABLE_TYPES_EN[mostProducedVegetable.type] ||
        mostProducedVegetable.type
      : "";
    const mostProducedPercentage =
      mostProducedVegetable && totalProduction > 0
        ? ((mostProducedVegetable.production / totalProduction) * 100).toFixed(
            2,
          )
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
      name: "Vegetable Types in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Vegetable production and sales statistics of Khajura Rural Municipality with a total production of ${totalProduction.toFixed(
        2,
      )} tonnes and sales of ${totalSales.toFixed(2)} tonnes (${(
        (totalSales / totalProduction) *
        100
      ).toFixed(
        2,
      )}% of production). The most common vegetable crop is ${mostProducedVegetableEN} with ${mostProducedVegetable?.production.toFixed(
        2,
      )} tonnes (${mostProducedPercentage}%). Self-consumption represents ${selfConsumptionPercentage}% of total production. Total revenue from vegetable sales is NPR ${totalRevenue.toLocaleString()}.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Vegetable production",
        "Vegetable sales",
        "Potato production",
        "Tomato production",
        "Cauliflower production",
        "Nepal agriculture statistics",
        "Municipality-wide vegetables",
        ...Object.values(VEGETABLE_TYPES_EN).map(
          (name) => `${name} production statistics`,
        ),
        ...Object.values(VEGETABLE_TYPES).map(
          (name) => `${name} उत्पादन तथ्याङ्क`,
        ),
      ],
      url: "https://digital.khajuramun.gov.np/profile/economics/municipality-wide-vegetables",
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
          name: `${VEGETABLE_TYPES_EN[item.type] || item.type} production`,
          unitText: "tonnes",
          value: item.production,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Vegetable Production",
          unitText: "tonnes",
          value: totalProduction,
        },
        {
          "@type": "PropertyValue",
          name: "Total Vegetable Sales",
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
          name: "Vegetable Commercialization Score",
          unitText: "percentage",
          value: commercializationScore,
        },
      ],
      observation: vegetableStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="vegetable-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
