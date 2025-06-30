import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface SpiceSEOProps {
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
  SPICE_TYPES: Record<string, string>;
  SPICE_TYPES_EN: Record<string, string>;
  commercializationScore: number;
}

export default function SpiceSEO({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  SPICE_TYPES,
  SPICE_TYPES_EN,
  commercializationScore,
}: SpiceSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert spice stats to structured data format
    const spiceStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${SPICE_TYPES_EN[item.type] || item.type} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${SPICE_TYPES_EN[item.type] || item.type}`,
        unitText: "tonnes",
      },
      measuredValue: item.production,
      description: `${item.production.toFixed(2)} tonnes of ${SPICE_TYPES_EN[item.type] || item.type} produced in Khajura Rural Municipality (${((item.production / totalProduction) * 100).toFixed(2)}% of total production). Sales volume: ${item.sales.toFixed(2)} tonnes. Revenue: NPR ${item.revenue.toLocaleString()}.`,
    }));

    // Find most produced spice
    const mostProducedSpice =
      overallSummary.length > 0 ? overallSummary[0] : null;
    const mostProducedSpiceEN = mostProducedSpice
      ? SPICE_TYPES_EN[mostProducedSpice.type] || mostProducedSpice.type
      : "";
    const mostProducedPercentage =
      mostProducedSpice && totalProduction > 0
        ? ((mostProducedSpice.production / totalProduction) * 100).toFixed(2)
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
      name: "Spice Types in Khajura Rural Municipality (केराबारी गाउँपालिका)",
      description: `Spice production and sales statistics of Khajura Rural Municipality with a total production of ${totalProduction.toFixed(
        2,
      )} tonnes and sales of ${totalSales.toFixed(2)} tonnes (${(
        (totalSales / totalProduction) *
        100
      ).toFixed(
        2,
      )}% of production). The most common spice crop is ${mostProducedSpiceEN} with ${mostProducedSpice?.production.toFixed(
        2,
      )} tonnes (${mostProducedPercentage}%). Self-consumption represents ${selfConsumptionPercentage}% of total production. Total revenue from spice sales is NPR ${totalRevenue.toLocaleString()}.`,
      keywords: [
        "Khajura Rural Municipality",
        "केराबारी गाउँपालिका",
        "Spice production",
        "Spice sales",
        "Garlic production",
        "Chili pepper production",
        "Coriander production",
        "Nepal agriculture statistics",
        "Municipality-wide spices",
        ...Object.values(SPICE_TYPES_EN).map(
          (name) => `${name} production statistics`,
        ),
        ...Object.values(SPICE_TYPES).map((name) => `${name} उत्पादन तथ्याङ्क`),
      ],
      url: "https://digital.buddhashantimun.gov.np/profile/economics/municipality-wide-spices",
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
          name: `${SPICE_TYPES_EN[item.type] || item.type} production`,
          unitText: "tonnes",
          value: item.production,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Spice Production",
          unitText: "tonnes",
          value: totalProduction,
        },
        {
          "@type": "PropertyValue",
          name: "Total Spice Sales",
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
          name: "Spice Commercialization Score",
          unitText: "percentage",
          value: commercializationScore,
        },
      ],
      observation: spiceStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="spice-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
