import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface OilSeedSEOProps {
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
  OIL_SEED_TYPES: Record<string, string>;
  OIL_SEED_TYPES_EN: Record<string, string>;
  commercializationScore: number;
}

export default function OilSeedSEO({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  OIL_SEED_TYPES,
  OIL_SEED_TYPES_EN,
  commercializationScore,
}: OilSeedSEOProps) {
  // Create structured data for SEO
  const generateStructuredData = () => {
    // Convert oil seed stats to structured data format
    const oilSeedStats = overallSummary.map((item) => ({
      "@type": "Observation",
      name: `${OIL_SEED_TYPES_EN[item.type] || item.type} in Khajura Rural Municipality`,
      observationDate: new Date().toISOString().split("T")[0],
      measuredProperty: {
        "@type": "PropertyValue",
        name: `${OIL_SEED_TYPES_EN[item.type] || item.type}`,
        unitText: "tonnes",
      },
      measuredValue: item.production,
      description: `${item.production.toFixed(2)} tonnes of ${OIL_SEED_TYPES_EN[item.type] || item.type} produced in Khajura Rural Municipality (${((item.production / totalProduction) * 100).toFixed(2)}% of total production). Sales volume: ${item.sales.toFixed(2)} tonnes. Revenue: NPR ${item.revenue.toLocaleString()}.`,
    }));

    // Find most produced crop
    const mostProducedOilSeed =
      overallSummary.length > 0 ? overallSummary[0] : null;
    const mostProducedOilSeedEN = mostProducedOilSeed
      ? OIL_SEED_TYPES_EN[mostProducedOilSeed.type] || mostProducedOilSeed.type
      : "";
    const mostProducedPercentage =
      mostProducedOilSeed && totalProduction > 0
        ? ((mostProducedOilSeed.production / totalProduction) * 100).toFixed(2)
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
      name: "Oil Seed Types in Khajura Rural Municipality (गढवा गाउँपालिका)",
      description: `Oil seed production and sales statistics of Khajura Rural Municipality with a total production of ${totalProduction.toFixed(2)} tonnes and sales of ${totalSales.toFixed(2)} tonnes (${((totalSales / totalProduction) * 100).toFixed(2)}% of production). The most common oil seed crop is ${mostProducedOilSeedEN} with ${mostProducedOilSeed?.production.toFixed(2)} tonnes (${mostProducedPercentage}%). Self-consumption represents ${selfConsumptionPercentage}% of total production. Total revenue from oil seed sales is NPR ${totalRevenue.toLocaleString()}.`,
      keywords: [
        "Khajura Rural Municipality",
        "गढवा गाउँपालिका",
        "Oil seed production",
        "Oil seed sales",
        "Mustard production",
        "Flax production",
        "Sunflower production",
        "Nepal agriculture statistics",
        "Municipality-wide oil seeds",
        ...Object.values(OIL_SEED_TYPES_EN).map(
          (name) => `${name} production statistics`,
        ),
        ...Object.values(OIL_SEED_TYPES).map(
          (name) => `${name} उत्पादन तथ्याङ्क`,
        ),
      ],
      url: "https://digital.gadhawamun.gov.np/profile/economics/municipality-wide-oil-seeds",
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
          name: `${OIL_SEED_TYPES_EN[item.type] || item.type} production`,
          unitText: "tonnes",
          value: item.production,
        })),
        {
          "@type": "PropertyValue",
          name: "Total Oil Seed Production",
          unitText: "tonnes",
          value: totalProduction,
        },
        {
          "@type": "PropertyValue",
          name: "Total Oil Seed Sales",
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
          name: "Oil Seed Commercialization Score",
          unitText: "percentage",
          value: commercializationScore,
        },
      ],
      observation: oilSeedStats,
    };
  };

  const structuredData = generateStructuredData();

  return (
    <>
      <Script
        id="oil-seed-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </>
  );
}
